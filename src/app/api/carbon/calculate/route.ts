/**
 * Carbon Calculation API
 * Uses AI to analyze uploaded data and calculate carbon impact
 */

import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// Emission factors (simplified - in production, use comprehensive database)
const EMISSION_FACTORS = {
  electricity: {
    // kg CO2 per kWh
    grid: 0.82, // India grid average
    solar: 0.05,
    wind: 0.01,
  },
  fuel: {
    // kg CO2 per liter
    diesel: 2.68,
    petrol: 2.31,
    lpg: 1.51,
  },
  agriculture: {
    // kg CO2 per hectare per year
    rice: 2500,
    wheat: 800,
    vegetables: 500,
  },
};

// Output schema for structured AI response
const carbonAnalysisSchema = z.object({
  totalCarbonImpact: z.number().describe("Total carbon impact in kg CO2e"),
  confidence: z
    .number()
    .min(0)
    .max(100)
    .describe("Confidence score of the calculation (0-100)"),
  breakdown: z
    .array(
      z.object({
        category: z.string(),
        amount: z.number(),
        unit: z.string(),
        emissionFactor: z.number(),
        carbonImpact: z.number(),
      })
    )
    .describe("Breakdown of carbon calculations"),
  methodology: z
    .string()
    .describe("Brief explanation of calculation methodology"),
  trustScore: z.enum(["HIGH", "MEDIUM", "LOW"]).describe("Overall data trust score"),
  recommendations: z
    .array(z.string())
    .describe("Recommendations for improving carbon offset"),
});

type CarbonAnalysis = z.infer<typeof carbonAnalysisSchema>;

// Structured output parser
const parser = StructuredOutputParser.fromZodSchema(carbonAnalysisSchema);

// Create calculation prompt
const CALCULATION_PROMPT = `You are a carbon accounting expert specializing in ISO 14064-3 standards.

Analyze the following data and calculate the carbon impact:

Data Type: {dataType}
Raw Data:
{rawData}

Emission Factors Available:
- Electricity: Grid {grid} kg CO2/kWh, Solar {solar} kg CO2/kWh, Wind {wind} kg CO2/kWh
- Fuel: Diesel {diesel} kg CO2/L, Petrol {petrol} kg CO2/L, LPG {lpg} kg CO2/L
- Agriculture: Rice {rice} kg CO2/ha/year, Wheat {wheat} kg CO2/ha/year

Instructions:
1. Parse the data and identify relevant metrics
2. Apply appropriate emission factors
3. Calculate total carbon impact in kg CO2e
4. Provide confidence score based on data quality
5. Give breakdown by category
6. Assess trust score (HIGH if direct measurements, MEDIUM if estimated, LOW if incomplete)
7. Provide actionable recommendations

{formatInstructions}`;

export async function POST(request: NextRequest) {
  try {
    const { dataType, rawData, additionalContext } = await request.json();

    if (!rawData) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // Initialize OpenAI model
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini", // Fast and cost-effective
      temperature: 0.1, // Low temperature for consistent calculations
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Create prompt template
    const promptTemplate = new PromptTemplate({
      template: CALCULATION_PROMPT,
      inputVariables: ["dataType", "rawData"],
      partialVariables: {
        formatInstructions: parser.getFormatInstructions(),
        grid: EMISSION_FACTORS.electricity.grid.toString(),
        solar: EMISSION_FACTORS.electricity.solar.toString(),
        wind: EMISSION_FACTORS.electricity.wind.toString(),
        diesel: EMISSION_FACTORS.fuel.diesel.toString(),
        petrol: EMISSION_FACTORS.fuel.petrol.toString(),
        lpg: EMISSION_FACTORS.fuel.lpg.toString(),
        rice: EMISSION_FACTORS.agriculture.rice.toString(),
        wheat: EMISSION_FACTORS.agriculture.wheat.toString(),
      },
    });

    // Format prompt
    const formattedPrompt = await promptTemplate.format({
      dataType: dataType || "Unknown",
      rawData: typeof rawData === "string" ? rawData : JSON.stringify(rawData, null, 2),
    });

    // Invoke model
    const response = await model.invoke(formattedPrompt);

    // Parse structured output
    const parsed: CarbonAnalysis = await parser.parse(response.content as string);

    // Convert kg to tonnes
    const carbonImpactTonnes = parsed.totalCarbonImpact / 1000;

    return NextResponse.json({
      success: true,
      result: {
        carbonImpact: carbonImpactTonnes,
        carbonImpactKg: parsed.totalCarbonImpact,
        unit: "tCO2e",
        confidence: parsed.confidence,
        trustScore: parsed.trustScore,
        breakdown: parsed.breakdown,
        methodology: parsed.methodology,
        recommendations: parsed.recommendations,
        calculatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Carbon calculation error:", err);

    // Handle parsing errors
    if (err instanceof Error && err.message.includes("parse")) {
      return NextResponse.json(
        {
          error: "Failed to parse AI response. The model may have returned invalid format.",
          details: err.message,
        },
        { status: 500 }
      );
    }

    const message = err instanceof Error ? err.message : "Failed to calculate carbon impact";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
