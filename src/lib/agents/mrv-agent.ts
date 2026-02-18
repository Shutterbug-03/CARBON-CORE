/**
 * MRV Agent — Layer 3
 * IPCC methodology execution, emission factor lookup, Monte Carlo confidence
 */

import { BaseAgent } from './base-agent';
import type { AgentTask, AgentResult, AgentConfig } from './types';
import { calculateMRV, METHODOLOGIES } from '../carbon-upi/engine';
import type { MRVInput } from '../carbon-upi/types';

const CONFIG: AgentConfig = {
    id: 'mrv-agent',
    name: 'MRV Computation Agent',
    role: 'Impact Calculation Engine',
    domain: 'MRV & Methodology',
    systemPrompt: `You are the MRV (Measurement, Reporting, Verification) Agent for GreenPe Climate DPI.
GreenPe is a high-integrity carbon credit ecosystem focusing on radical transparency and cryptographic proof of impact.
Your role within this software is to compute carbon impact using IPCC-approved methodologies, validate emission factors,
and determine confidence scores for impact calculations.

Specifically for GreenPe:
1. Select the optimal methodology based on asset type and data in accordance with GreenPe's multi-layered DPI architecture.
2. Validate emission factors against IPCC AR6 guidelines and GreenPe's internal trust registry.
3. Calculate Monte Carlo confidence intervals for real-time impact reporting.
4. Flag any methodology mismatches or data insufficiency in the Ingestion-to-MRV pipeline.
5. Provide the final tCO2e impact with confidence bounds as immutable records.

Respond in JSON: { "methodology": string, "impact_tCO2e": number, "confidence": number, "warnings": string[], "reasoning": string }`,
    skills: [
        { name: 'IPCC Methodology', description: 'Apply IPCC-approved emission calculation methodologies', domain: 'MRV' },
        { name: 'Emission Factors', description: 'Lookup and validate emission factor databases', domain: 'MRV' },
        { name: 'Confidence Analysis', description: 'Monte Carlo confidence interval computation', domain: 'Statistics' },
        { name: 'Impact Calculation', description: 'Compute tCO2e avoided/removed', domain: 'MRV' },
    ],
};

export class MRVAgent extends BaseAgent {
    constructor() {
        super(CONFIG);
    }

    async processTask(task: AgentTask): Promise<AgentResult> {
        const start = Date.now();

        switch (task.type) {
            case 'CALCULATE_MRV': {
                const mrvInput = task.payload.mrvInput as MRVInput;
                const mrvOutput = calculateMRV(mrvInput);

                const analysis = await this.runChain(
                    `Analyze this MRV calculation result:\n` +
                    `Methodology: ${mrvInput.methodology.name} (${mrvInput.methodology.id})\n` +
                    `Data points: ${mrvInput.dataPoints.length}\n` +
                    `Success: ${mrvOutput.success}\n` +
                    `Impact: ${mrvOutput.impactValue?.amount} ${mrvOutput.impactValue?.unit}\n` +
                    `Confidence: ${mrvOutput.confidenceScore}%\n` +
                    `Warnings: ${mrvOutput.warnings.join(', ') || 'None'}\n` +
                    `Errors: ${mrvOutput.errors.join(', ') || 'None'}\n` +
                    `Validate the methodology choice and provide Monte Carlo confidence assessment.`
                );

                this.writeMemory('pipeline-state', `mrv-${Date.now()}`, {
                    output: mrvOutput,
                    analysis,
                    timestamp: Date.now(),
                });

                // Notify Verification Agent
                if (mrvOutput.success) {
                    await this.sendToAgent('verification-agent', 'DATA_SHARE', {
                        event: 'MRV_CALCULATED',
                        impact: mrvOutput.impactValue,
                        confidence: mrvOutput.confidenceScore,
                        methodology: mrvInput.methodology.id,
                    });
                }

                this.logActivity(
                    mrvOutput.success ? 'success' : 'warning',
                    'MRV Computed',
                    `${mrvOutput.impactValue?.amount || 0} tCO2e @ ${mrvOutput.confidenceScore}% confidence`
                );

                return {
                    taskId: task.id,
                    agentId: this.id,
                    success: mrvOutput.success,
                    output: { mrvOutput, analysis },
                    reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            case 'SELECT_METHODOLOGY': {
                const methList = METHODOLOGIES.map(m => `${m.id}: ${m.name} (${m.sector})`).join('\n');
                const analysis = await this.runChain(
                    `Select the optimal methodology for:\n` +
                    `Asset type: ${task.payload.assetType}\n` +
                    `Sector: ${task.payload.sector}\n` +
                    `Available methodologies:\n${methList}`
                );
                return {
                    taskId: task.id,
                    agentId: this.id,
                    success: true,
                    output: { recommendation: analysis, methodologies: METHODOLOGIES },
                    reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            default: {
                const result = await this.runChain(
                    `Analyze this MRV request: ${JSON.stringify(task.payload).slice(0, 500)}`
                );
                return {
                    taskId: task.id,
                    agentId: this.id,
                    success: true,
                    output: { analysis: result },
                    durationMs: Date.now() - start,
                };
            }
        }
    }
}
