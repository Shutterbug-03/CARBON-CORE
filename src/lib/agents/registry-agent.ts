/**
 * Registry Agent — Layer 8
 * Certificate registry indexing, search, retirement lifecycle
 */

import { BaseAgent } from './base-agent';
import type { AgentTask, AgentResult, AgentConfig } from './types';

const CONFIG: AgentConfig = {
    id: 'registry-agent',
    name: 'Registry Agent',
    role: 'Certificate Registry & Lifecycle',
    domain: 'Registry',
    systemPrompt: `You are the Registry Agent for GreenPe Climate DPI.
The GreenPe Registry is the "source of truth" for all verified carbon assets within the DPI ecosystem.
Your role is to manage the certificate registry — indexing new certificates, enabling search, and handling the full retirement lifecycle.

In the GreenPe Registry ecosystem:
1. Index new GICs with full metadata schemas for faceted searchability across the DPI.
2. Track certificate lifecycle across all states: DRAFT → VERIFIED → ISSUED → ACTIVE → RETIRED.
3. Prevent double-counting by cross-referencing all regional registries and external bridges.
4. Generate real-time registry statistics and compliance reports for the Analytics Agent.
5. Support advanced certificate discovery for buyers and regulators.

Respond in JSON: { "action": string, "registryId": string, "status": string, "reasoning": string }`,
    skills: [
        { name: 'Indexing', description: 'Index certificates with full metadata', domain: 'Registry' },
        { name: 'Lifecycle Management', description: 'Track certificate lifecycle transitions', domain: 'Registry' },
        { name: 'Double-Count Prevention', description: 'Cross-reference against all registries', domain: 'Verification' },
        { name: 'Search', description: 'Multi-criteria certificate search', domain: 'Registry' },
    ],
};

export class RegistryAgent extends BaseAgent {
    constructor() {
        super(CONFIG);
    }

    async processTask(task: AgentTask): Promise<AgentResult> {
        const start = Date.now();

        switch (task.type) {
            case 'INDEX_CERTIFICATE': {
                const analysis = await this.runChain(
                    `Index new certificate in registry:\n` +
                    `Certificate ID: ${task.payload.certId}\n` +
                    `Entity: ${task.payload.entityId}\n` +
                    `Impact: ${JSON.stringify(task.payload.impact)}\n` +
                    `Verify no duplicates and assign registry ID.`
                );

                const registryId = `REG-${Date.now()}`;
                this.writeMemory('pipeline-state', `registry-${registryId}`, {
                    registryId, certId: task.payload.certId,
                    indexedAt: Date.now(), analysis,
                });

                this.logActivity('success', 'Certificate Indexed', `${registryId}`);
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { registryId, analysis }, reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            case 'RETIRE_CERTIFICATE': {
                const analysis = await this.runChain(
                    `Process retirement for certificate: ${task.payload.certId}`
                );
                this.logActivity('info', 'Certificate Retired', `${task.payload.certId}`);
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { retired: true, analysis }, reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            default: {
                const result = await this.runChain(
                    `Registry request: ${JSON.stringify(task.payload).slice(0, 500)}`
                );
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { analysis: result }, durationMs: Date.now() - start,
                };
            }
        }
    }
}
