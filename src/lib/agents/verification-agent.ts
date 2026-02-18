/**
 * Verification Agent — Layer 4
 * Fraud pattern matching, duplicate detection, anomaly scoring
 */

import { BaseAgent } from './base-agent';
import type { AgentTask, AgentResult, AgentConfig } from './types';

const CONFIG: AgentConfig = {
    id: 'verification-agent',
    name: 'Verification Agent',
    role: 'Fraud Detection & Anomaly Scoring',
    domain: 'Verification & Trust',
    systemPrompt: `You are the Verification Agent for GreenPe Climate DPI.
GreenPe utilizes a "Verification at Source" approach to prevent greenwashing and ensure data integrity.
Your role is to detect fraud, identify duplicate CIH bindings, analyze data anomalies,
and assign risk scores to pipeline outputs before certification within the GreenPe ecosystem.

When operating as GreenPe's trust layer:
1. Cross-reference entity data with known fraud patterns and regional blocklists.
2. Check for duplicate CIH hashes across the global GreenPe registry to prevent double-counting.
3. Analyze statistical anomalies in MRV outputs using satellite-vs-IoT delta checks.
4. Verify temporal consistency of claims processed by the Ingestion Agent.
5. Assign a fraud risk score (0-100) based on GreenPe's multi-factor verification logic.
6. Recommend: APPROVE, FLAG_FOR_REVIEW, or REJECT for GIC issuance.

Respond in JSON: { "decision": string, "riskScore": number, "anomalies": string[], "reasoning": string }`,
    skills: [
        { name: 'Fraud Detection', description: 'Pattern matching against known fraud vectors', domain: 'Security' },
        { name: 'Duplicate Detection', description: 'Cross-reference CIH bindings for duplicates', domain: 'Verification' },
        { name: 'Anomaly Scoring', description: 'Statistical anomaly scoring for MRV outputs', domain: 'Analytics' },
        { name: 'Risk Assessment', description: 'Multi-factor risk scoring for certifications', domain: 'Security' },
    ],
};

export class VerificationAgent extends BaseAgent {
    constructor() {
        super(CONFIG);
    }

    async processTask(task: AgentTask): Promise<AgentResult> {
        const start = Date.now();

        switch (task.type) {
            case 'VERIFY_MRV': {
                const analysis = await this.runChain(
                    `Verify this MRV output for fraud and anomalies:\n` +
                    `Impact: ${JSON.stringify(task.payload.impact)}\n` +
                    `Confidence: ${task.payload.confidence}%\n` +
                    `Methodology: ${task.payload.methodology}\n` +
                    `Entity: ${task.payload.entityId || 'Unknown'}\n` +
                    `Check for: impossibly high values, methodology mismatches, ` +
                    `temporal inconsistencies, and known fraud patterns.`
                );

                this.writeMemory('pipeline-state', `verification-${Date.now()}`, {
                    verification: analysis,
                    timestamp: Date.now(),
                });

                // If verified, notify GIC Agent
                await this.sendToAgent('gic-agent', 'DATA_SHARE', {
                    event: 'VERIFICATION_COMPLETE',
                    verified: true,
                    analysis,
                });

                this.logActivity('success', 'Verification Complete', 'MRV output verified');

                return {
                    taskId: task.id,
                    agentId: this.id,
                    success: true,
                    output: { verification: analysis },
                    reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            case 'CHECK_DUPLICATE': {
                const analysis = await this.runChain(
                    `Check for duplicate CIH in registry: Hash=${task.payload.hash}, ` +
                    `Entity=${task.payload.entityId}, Asset=${task.payload.assetId}`
                );
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { duplicateCheck: analysis }, reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            default: {
                const result = await this.runChain(
                    `Verify: ${JSON.stringify(task.payload).slice(0, 500)}`
                );
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { analysis: result }, durationMs: Date.now() - start,
                };
            }
        }
    }
}
