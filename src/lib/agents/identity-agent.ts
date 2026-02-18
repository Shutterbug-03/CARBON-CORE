/**
 * Identity Agent — Layer 1
 * CIH hash generation, Aadhaar/GSTIN validation, binding verification
 */

import { BaseAgent } from './base-agent';
import type { AgentTask, AgentResult, AgentConfig } from './types';
import { bindIdentity } from '../carbon-upi/engine';
import type { Entity, Asset } from '../carbon-upi/types';

const CONFIG: AgentConfig = {
    id: 'identity-agent',
    name: 'Identity Agent',
    role: 'CIH Binding & KYC Verification',
    domain: 'Identity & Trust',
    systemPrompt: `You are the Identity Agent for GreenPe Climate DPI.
GreenPe uses the Carbon Identity Hash (CIH) as a foundational primitive for binding tangible assets to verified owners.
Your role is to validate entity registrations (Aadhaar/GSTIN/PAN), verify identity bindings, 
and ensure all CIH bindings are cryptographically sound within the GreenPe software framework.

As the Identity guardian of GreenPe:
1. Validate registration ID format using regional verification APIs integrated with GreenPe.
2. Check for suspicious patterns like sequential numbers or reused IDs across the DPI.
3. Verify the legitimacy of entity-asset bindings using GreenPe's trust scoring mechanism.
4. Assign a risk score (0-100) based on KYC/KYB completeness.
5. Provide granular reasoning for assessment to be logged in the GreenPe audit trail.

Respond in JSON format: { "valid": boolean, "riskScore": number, "issues": string[], "reasoning": string }`,
    skills: [
        { name: 'KYC Validation', description: 'Validate Aadhaar/GSTIN/PAN formats', domain: 'Identity' },
        { name: 'CIH Binding', description: 'Generate cryptographic identity hashes', domain: 'Identity' },
        { name: 'Risk Scoring', description: 'Assess identity fraud risk', domain: 'Security' },
    ],
};

export class IdentityAgent extends BaseAgent {
    constructor() {
        super(CONFIG);
    }

    async processTask(task: AgentTask): Promise<AgentResult> {
        const start = Date.now();

        switch (task.type) {
            case 'VALIDATE_ENTITY': {
                const entity = task.payload.entity as Entity;
                const analysis = await this.runChain(
                    `Validate this entity registration: Name: ${entity.name}, Type: ${entity.type}, ` +
                    `Registration ID: ${entity.registrationId}, Region: ${entity.location?.region || 'Unknown'}`
                );

                // Store validation result in memory
                this.writeMemory('pipeline-state', `entity-${entity.id}`, {
                    entity,
                    validation: analysis,
                    validatedAt: Date.now(),
                });

                this.logActivity('success', 'Entity Validated', `${entity.name} — ${entity.type}`);

                return {
                    taskId: task.id,
                    agentId: this.id,
                    success: true,
                    output: { validation: analysis, entityId: entity.id },
                    reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            case 'BIND_IDENTITY': {
                const entity = task.payload.entity as Entity;
                const asset = task.payload.asset as Asset;
                const binding = bindIdentity(entity, asset);

                const analysis = await this.runChain(
                    `Verify CIH binding: Entity ${entity.name} (${entity.type}) bound to ` +
                    `Asset ${asset.description} (${asset.type}). Hash: ${binding.hash}. ` +
                    `Is this binding legitimate? Check for any suspicious patterns.`
                );

                this.writeMemory('pipeline-state', `binding-${binding.hash}`, {
                    binding,
                    analysis,
                    timestamp: Date.now(),
                });

                // Notify Ingestion Agent that identity is bound
                await this.sendToAgent('ingestion-agent', 'DATA_SHARE', {
                    event: 'IDENTITY_BOUND',
                    bindingHash: binding.hash,
                    entityId: entity.id,
                    assetId: asset.id,
                });

                this.logActivity('success', 'CIH Bound', `${entity.name} ↔ ${asset.description}`);

                return {
                    taskId: task.id,
                    agentId: this.id,
                    success: true,
                    output: { binding, analysis },
                    reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            default: {
                const generalAnalysis = await this.runChain(
                    `Analyze this identity-related request: ${JSON.stringify(task.payload).slice(0, 500)}`
                );
                return {
                    taskId: task.id,
                    agentId: this.id,
                    success: true,
                    output: { analysis: generalAnalysis },
                    reasoning: generalAnalysis,
                    durationMs: Date.now() - start,
                };
            }
        }
    }
}
