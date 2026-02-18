/**
 * AI Agent Chat — Streaming API
 * Streams real-time responses from any agent using Greeni Agent Framework
 */

import { NextRequest } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { getCoreMemory } from "@/lib/agents/core-memory";
import fs from 'fs';
import path from 'path';

const FORMATTING_RULES = `
FORMATTING RULES (follow strictly):
- Use **bold** for key terms, numbers, and important values
- Use numbered lists (1. 2. 3.) for steps and processes
- Use bullet lists (- item) for features and facts
- Use ### for section headings
- NEVER use LaTeX math notation (\\[ \\] or \\( \\))
- For math, write it plainly: "500 kWh × 0.9 kg/kWh = 450 kg CO₂"
- Use Unicode symbols: ×, ÷, ≈, ₂, tCO₂e, →, ✓
- Keep responses concise and scannable
- End with a helpful follow-up offer when relevant
`;

const STRICT_CONTEXT_INSTRUCTION = `
CRITICAL CORE DIRECTIVE:
You are an AI agent for **GreenPe** (Green Energy & Climate Infrastructure).
1. **Scope Restriction:** You must ONLY discuss Green Energy, Carbon Credits, Climate Infrastructure, and GreenPe specific tasks.
2. **Off-Topic Refusal:** If a user asks about anything unrelated (e.g., cooking, general politics, general coding, movies), politely refuse: "I am a GreenPe specialized agent. I can only assist with Green Energy and Climate Infrastructure tasks."
3. **Identity:** You are NOT a general assistant. You are a specialized component of India's Climate DPI.
4. **Tone:** Professional, Dedicated, Technical, and Focused on Sustainability.
`;

const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
    "orchestrator": `You are the Orchestrator Agent for CarbonCore — India's AI-native Climate DPI.
You coordinate 12 specialized agents: Identity, Ingestion, MRV, Verification, Tokenization, GIC, Compliance, Registry, Settlement, DeFi Bridge, Gateway, and Analytics.
You help users understand the system, route tasks, and provide intelligent insights about carbon credit workflows.
Be concise, professional, and use data when available.
${STRICT_CONTEXT_INSTRUCTION}
${FORMATTING_RULES}`,

    "mrv-agent": `You are the MRV (Measurement, Reporting & Verification) Agent for CarbonCore.
You specialize in IPCC methodologies, carbon emission calculations, and impact measurement.
You calculate tCO₂e reductions using Verra VCS and CDM standards.
India grid emission factors: North 0.716, South 0.682, East 0.821, West 0.698, National 0.82 tCO₂e/MWh.
Gujarat is in the West India grid (0.698 tCO₂e/MWh).
Be precise with numbers and always cite your methodology.
${STRICT_CONTEXT_INSTRUCTION}
${FORMATTING_RULES}`,

    "verification-agent": `You are the Verification Agent for CarbonCore.
You detect fraud, anomalies, and duplicate claims in carbon credit submissions.
You cross-reference NASA satellite data, IoT sensor readings, and historical baselines.
Be analytical and flag any suspicious patterns. Confidence scores are key.
${STRICT_CONTEXT_INSTRUCTION}
${FORMATTING_RULES}`,

    "compliance-agent": `You are the Compliance Agent for CarbonCore.
You ensure adherence to CBAM (EU Carbon Border Adjustment), BRSR (India), CCTS, and CSRD frameworks.
You generate regulatory reports and assess compliance gaps.
Stay current with India's carbon market regulations and international standards.
${STRICT_CONTEXT_INSTRUCTION}
${FORMATTING_RULES}`,

    "gic-agent": `You are the GIC (Green Impact Certificate) Issuance Agent for CarbonCore.
You generate, sign, and register Green Impact Certificates — India's digital carbon credit instrument.
Each GIC represents verified tCO₂e reductions with cryptographic proof and QR verification.
Guide users through the certificate lifecycle: DRAFT → VERIFIED → ISSUED → RETIRED.
${STRICT_CONTEXT_INSTRUCTION}
${FORMATTING_RULES}`,

    "analytics-agent": `You are the Analytics Agent for CarbonCore.
You compute KPIs, identify trends, and generate insights from carbon credit data.
You track: total credits issued, verification rates, fraud detection rates, settlement volumes, and market trends.
Present data clearly with context and actionable recommendations.
${STRICT_CONTEXT_INSTRUCTION}
${FORMATTING_RULES}`,

    "identity-agent": `You are the Identity Agent for CarbonCore.
You handle CIH (Carbon Identity Hash) binding, KYC verification, and entity authentication.
You integrate with Aadhaar for individuals and GSTIN for businesses.
Privacy-first: always use masked identifiers and minimal data principles.
${STRICT_CONTEXT_INSTRUCTION}
${FORMATTING_RULES}`,

    "settlement-agent": `You are the Settlement Agent for CarbonCore.
You handle UPI payments, carbon credit transfers, and incentive distribution.
You process settlements in INR and facilitate cross-border transactions.
Be precise about amounts, fees, and settlement timelines.
${STRICT_CONTEXT_INSTRUCTION}
${FORMATTING_RULES}`,

    "default": `You are an AI agent for CarbonCore — India's AI-native Climate DPI platform.
You help users understand carbon credits, green energy verification, and climate finance.
Be helpful, accurate, and professional. Use data and examples when relevant.
${STRICT_CONTEXT_INSTRUCTION}
${FORMATTING_RULES}`,
};

export async function POST(request: NextRequest) {
    try {
        const { message, agentId, history = [], documentContext = [] } = await request.json();

        if (!message) {
            return new Response(JSON.stringify({ error: "message is required" }), { status: 400 });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey || apiKey.startsWith("sk-your")) {
            return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), { status: 500 });
        }

        const baseSystemPrompt = AGENT_SYSTEM_PROMPTS[agentId] || AGENT_SYSTEM_PROMPTS["default"];

        // Build context from history
        const historyContext = history.length > 0
            ? `\n\nConversation history:\n${history.slice(-6).map((m: { role: string; content: string }) =>
                `${m.role === "user" ? "User" : "Agent"}: ${m.content}`
            ).join("\n")}\n\n`
            : "";

        // Build document context from uploaded files (Current Session)
        let documentBlock = "";
        if (documentContext.length > 0) {
            documentBlock = "\n\n=== REFERENCE DOCUMENTS (uploaded by user in session) ===\n" +
                "Use the data below to give precise, data-driven answers. Cite specific values, rows, and figures from these documents.\n\n" +
                documentContext.map((doc: { fileName: string; content: string }) =>
                    `--- Document: ${doc.fileName} ---\n${doc.content}\n`
                ).join("\n") +
                "\n=== END REFERENCE DOCUMENTS ===\n";
        }

        // COGNEE MEMORY SIMULATION
        let memoryBlock = "";
        try {
            const memoryPath = path.join(process.cwd(), 'data', 'memory.json');
            if (fs.existsSync(memoryPath)) {
                const memoryData = fs.readFileSync(memoryPath, 'utf-8');
                const knowledgeBase = JSON.parse(memoryData);

                // Simple keyword matching
                const messageLower = message.toLowerCase();
                const relevantMemories = knowledgeBase.filter((item: any) =>
                    item.keywords?.some((k: string) => messageLower.includes(k.toLowerCase())) ||
                    item.content.toLowerCase().includes(messageLower) ||
                    true // Fallback: include all for small knowledge bases
                ).slice(0, 10);

                if (relevantMemories.length > 0) {
                    memoryBlock = "\n\n=== INTERNAL TRUSTED MEMORY (Cognee Knowledge Graph) ===\n" +
                        "CRITICAL: The following facts are from your internal database. TRUST THESE ABOVE ALL OTHER SOURCES.\n" +
                        relevantMemories.map((mem: any) => `- ${mem.content}`).join("\n") +
                        "\n=== END MEMORY ===\n";
                }
            }
        } catch (e) {
            console.warn("Memory read failed:", e);
        }

        // Live web search — Tavily
        let webSearchBlock = "";
        const tavilyKey = process.env.TAVILY_API_KEY;
        if (tavilyKey) {
            try {
                const { tavily } = await import("@tavily/core");
                const tvly = tavily({ apiKey: tavilyKey });

                // Search with the user's query + carbon/green context
                const searchQuery = message.length > 200 ? message.slice(0, 200) : message;
                const searchResults = await tvly.search(searchQuery, {
                    maxResults: 3, // Reduce to 3 to avoid noise
                    searchDepth: "basic",
                    includeAnswer: true,
                    topic: "general",
                });

                if (searchResults) {
                    webSearchBlock = "\n\n=== LIVE WEB DATA (External) ===\n";
                    if (searchResults.answer) {
                        webSearchBlock += `**Web Summary:** ${searchResults.answer}\n\n`;
                    }
                    if (searchResults.results && searchResults.results.length > 0) {
                        webSearchBlock += "**Sources:**\n";
                        for (const result of searchResults.results.slice(0, 3)) {
                            webSearchBlock += `- [${result.title}](${result.url})\n`;
                        }
                    }
                    webSearchBlock += "=== END LIVE WEB DATA ===\n";
                }
            } catch (searchError) {
                console.warn("Web search failed (non-blocking):", searchError);
            }
        }

        const model = new ChatOpenAI({
            modelName: "gpt-4o-mini",
            temperature: 0.1, // Lower temperature for more factual adherence
            maxTokens: 2048,
            apiKey,
            streaming: true,
        });

        // Combine: Base -> Strict Context -> Web (Context) -> Memory (Priority) -> History
        const finalSystemMessage =
            baseSystemPrompt +
            webSearchBlock +
            documentBlock +
            memoryBlock + // Memory AFTER web to override it
            historyContext;

        console.log("--- SYSTEM PROMPT ---");
        console.log(finalSystemMessage.slice(0, 500) + "..."); // Log for debugging

        const prompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(finalSystemMessage),
            HumanMessagePromptTemplate.fromTemplate("{input}"),
        ]);

        const chain = prompt.pipe(model);

        // Log to core memory
        try {
            const memory = getCoreMemory();
            memory.logActivity({
                id: `chat-${Date.now()}`,
                agentId: agentId || "default",
                agentName: agentId || "AI Agent",
                action: "Chat Message",
                detail: message.slice(0, 100),
                timestamp: Date.now(),
                type: "info",
            });
        } catch {
            // Memory logging is non-critical
        }

        // Stream the response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const response = await chain.stream({ input: message });
                    let fullText = "";
                    for await (const chunk of response) {
                        const text = typeof chunk.content === "string"
                            ? chunk.content
                            : Array.isArray(chunk.content)
                                ? chunk.content.map((c: unknown) => (c as { text?: string }).text || "").join("")
                                : "";
                        if (text) {
                            fullText += text;
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                        }
                    }

                    // Fallback for strict context refusal if empty
                    if (!fullText.trim()) {
                        const refusal = "I apologize, but I am specialized agent for GreenPe. I can only assist with Green Energy and Climate Infrastructure tasks.";
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: refusal })}\n\n`));
                    }

                    controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                    controller.close();
                } catch (err) {
                    const msg = err instanceof Error ? err.message : "Stream error";
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}
