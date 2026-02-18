/**
 * Settlement Agent — Layer 9
 * UPI rail simulation, credit transfer, FX layer, incentive calculation
 */

import { BaseAgent } from './base-agent';
import type { AgentTask, AgentResult, AgentConfig } from './types';

const CONFIG: AgentConfig = {
    id: 'settlement-agent',
    name: 'Settlement Agent',
    role: 'UPI Credit Transfer & Incentives',
    domain: 'Settlement & Payments',
    systemPrompt: `You are the Settlement Agent for GreenPe Climate DPI.
GreenPe bridges the gap between verified climate impact and real-world financial incentives.
Your role within the DPI is to process credit settlements via UPI rails, calculate carbon incentives, and manage multi-currency FX layers for cross-border transactions.

As GreenPe's financial settlement engine:
1. Calculate the market and incentive value of credits from verified MRV outputs (₹ per tCO2e).
2. Apply GreenPe's adaptive incentive logic, including government subsidies and early-adopter bonuses.
3. Process cryptographic UPI transfer simulations via the Carbon UPI payment rail.
4. Handle seamless FX conversion for international carbon marketplaces linked to GreenPe.
5. Generate immutable, regulator-ready settlement receipts for the GreenPe audit trail.

Respond in JSON: { "settlementId": string, "amount": number, "currency": string, "status": string, "reasoning": string }`,
    skills: [
        { name: 'UPI Settlement', description: 'Process payments via UPI infrastructure', domain: 'Payments' },
        { name: 'Incentive Calculation', description: 'Compute carbon credit incentive values', domain: 'Finance' },
        { name: 'FX Layer', description: 'Cross-border foreign exchange processing', domain: 'Finance' },
        { name: 'Receipt Generation', description: 'Generate settlement receipts with audit trail', domain: 'Settlement' },
    ],
};

export class SettlementAgent extends BaseAgent {
    constructor() {
        super(CONFIG);
    }

    async processTask(task: AgentTask): Promise<AgentResult> {
        const start = Date.now();

        switch (task.type) {
            case 'PROCESS_SETTLEMENT': {
                const analysis = await this.runChain(
                    `Process UPI settlement:\n` +
                    `Impact: ${task.payload.impactAmount} tCO2e\n` +
                    `Entity: ${task.payload.entityId}\n` +
                    `Rate: ₹500/tCO2e (current market)\n` +
                    `Calculate total, apply incentives, generate settlement.`
                );

                const settlementId = `SET-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                this.writeMemory('pipeline-state', `settlement-${settlementId}`, {
                    settlementId, analysis, processedAt: Date.now(),
                });

                this.logActivity('success', 'Settlement Processed', settlementId);
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { settlementId, analysis }, reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            default: {
                const result = await this.runChain(
                    `Settlement request: ${JSON.stringify(task.payload).slice(0, 500)}`
                );
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { analysis: result }, durationMs: Date.now() - start,
                };
            }
        }
    }
}
