/**
 * API Gateway Agent — Layer 11
 * Rate limiting, request routing, health check orchestration
 */

import { BaseAgent } from './base-agent';
import type { AgentTask, AgentResult, AgentConfig } from './types';

const CONFIG: AgentConfig = {
    id: 'gateway-agent',
    name: 'API Gateway Agent',
    role: 'Request Routing & Rate Limiting',
    domain: 'Infrastructure',
    systemPrompt: `You are the API Gateway Agent for GreenPe Climate DPI.
GreenPe is a modular infrastructure where the Gateway acts as the secure entry point for all ecosystem participants.
Your role is to manage API request routing, enforce high-performance rate limits, and orchestrate health checks across every DPI layer.

As the Infrastructure gatekeeper of GreenPe:
1. Route requests to specialized GreenPe agents (Identity, MRV, GIC, etc.) via the Carbon UPI bus.
2. Enforce granular rate limits per client/API-key to ensure GreenPe's ecosystem stability.
3. Orchestrate multi-step health checks across the registry, ledger, and compute nodes.
4. Manage aggressive caching of frequent GreenPe registry lookups for sub-millisecond latency.
5. Log comprehensive API usage metrics for the Analytics and Compliance agents.

Respond in JSON: { "routedTo": string, "rateLimitStatus": string, "healthStatus": object, "reasoning": string }`,
    skills: [
        { name: 'Request Routing', description: 'Intelligent API request routing', domain: 'Infrastructure' },
        { name: 'Rate Limiting', description: 'Per-client token-based rate limiting', domain: 'Security' },
        { name: 'Health Checks', description: 'Service availability monitoring', domain: 'Infrastructure' },
    ],
};

export class GatewayAgent extends BaseAgent {
    constructor() {
        super(CONFIG);
    }

    async processTask(task: AgentTask): Promise<AgentResult> {
        const start = Date.now();

        switch (task.type) {
            case 'HEALTH_CHECK': {
                // Read all agent states from memory
                const agentStates = this.memory.getAll('agent-state');
                const analysis = await this.runChain(
                    `System health check requested. Agent states:\n` +
                    `${JSON.stringify(agentStates).slice(0, 800)}\n` +
                    `Provide overall health assessment and flag any issues.`
                );

                this.writeMemory('metrics', 'system-health', {
                    analysis, checkedAt: Date.now(),
                });

                this.logActivity('success', 'Health Check', 'All systems assessed');
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { healthReport: analysis }, reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            default: {
                const result = await this.runChain(
                    `Gateway request: ${JSON.stringify(task.payload).slice(0, 500)}`
                );
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { analysis: result }, durationMs: Date.now() - start,
                };
            }
        }
    }
}
