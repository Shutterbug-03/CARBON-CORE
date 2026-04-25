/**
 * Carbon Calculation API
 * Uses native OpenAI to analyze uploaded data and calculate carbon impact
 */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Emission factors (simplified - in production, use comprehensive database)
const EMISSION_FACTORS = {
  electricity: {
    grid: 0.82, // India grid average
    solar: 0.05,
    wind: 0.01,
  },
  fuel: {
    diesel: 2.68,
    petrol: 2.31,
    lpg: 1.51,
  },
  agriculture: {
    rice: 2500,
    wheat: 800,
    vegetables: 500,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const { dataType, rawData, additionalContext } = await request.json();

    if (!rawData) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const systemPrompt = `You are a carbon accounting expert specializing in ISO 14064-3 standards.
    
Analyze the following data and calculate the carbon impact.
Emission Factors Available (kg CO2e per unit):
- Electricity (per kWh): Grid ${EMISSION_FACTORS.electricity.grid}, Solar ${EMISSION_FACTORS.electricity.solar}, Wind ${EMISSION_FACTORS.electricity.wind}
- Fuel (per L): Diesel ${EMISSION_FACTORS.fuel.diesel}, Petrol ${EMISSION_FACTORS.fuel.petrol}, LPG ${EMISSION_FACTORS.fuel.lpg}
- Agriculture (per ha/year): Rice ${EMISSION_FACTORS.agriculture.rice}, Wheat ${EMISSION_FACTORS.agriculture.wheat}

Instructions:
1. Parse the data and identify relevant metrics
2. Apply appropriate emission factors
3. Calculate total carbon impact in kg CO2e
4. Provide a confidence score based on data quality (0-100)
5. Assess data trust score (HIGH if direct measurements, MEDIUM if estimated, LOW if incomplete)

Output perfectly structured JSON.`;

    const userContent = `Data Type: ${dataType || "Unknown"}\nRaw Data:\n${
      typeof rawData === "string" ? rawData : JSON.stringify(rawData, null, 2)
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "carbon_analysis",
          schema: {
            type: "object",
            properties: {
              totalCarbonImpact: { type: "number", description: "Total carbon impact in kg CO2e" },
              confidence: { type: "number", description: "Confidence score 0-100" },
              trustScore: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
              methodology: { type: "string" },
              recommendations: { type: "array", items: { type: "string" } },
              breakdown: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    category: { type: "string" },
                    amount: { type: "number" },
                    unit: { type: "string" },
                    emissionFactor: { type: "number" },
                    carbonImpact: { type: "number" }
                  },
                  required: ["category", "amount", "unit", "emissionFactor", "carbonImpact"],
                  additionalProperties: false
                }
              }
            },
            required: ["totalCarbonImpact", "confidence", "trustScore", "methodology", "recommendations", "breakdown"],
            additionalProperties: false
          },
          strict: true
        }
      }
    });

    const parsed = JSON.parse(completion.choices[0].message.content || "{}");
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
    const message = err instanceof Error ? err.message : "Failed to calculate carbon impact";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
