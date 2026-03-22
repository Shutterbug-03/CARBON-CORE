import { getAgentRegistry } from '../src/lib/agents/index';
// @ts-ignore
import { config } from 'dotenv';
config({ path: '.env.local' });

process.env.LANGCHAIN_TRACING_V2 = "false";

async function runTest() {
    console.log("🚀 Starting AI Workflow Test (Pipeline Route)");
    const registry = getAgentRegistry();

    // Testing the orchestrator RUN_PIPELINE capability
    const result = await registry.dispatchTask('orchestrator', {
        id: `test-run-${Date.now()}`,
        type: 'RUN_PIPELINE',
        payload: {
            entity: {
                id: "ENT-123",
                name: "Test Entity",
                type: "FARMER",
                registrationId: "TEST-001",
                location: { region: "India" }
            },
            asset: {
                id: "AST-456",
                description: "Test Land Plot",
                type: "LAND"
            },
            rawDataPoints: [
                { value: 100, unit: "kWh", trustScore: "HIGH" },
                { value: 110, unit: "kWh", trustScore: "HIGH" }
            ],
            impact: { amount: 150, unit: "tCO2e" },
            confidence: 98
        },
        priority: 'HIGH',
        status: 'PENDING',
        createdAt: Date.now(),
        assignedTo: 'orchestrator'
    });

    console.log("✅ Workflow Result:");
    console.log(JSON.stringify(result, null, 2));
}

runTest().catch(console.error);
