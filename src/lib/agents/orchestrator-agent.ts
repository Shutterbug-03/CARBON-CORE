/**
 * Orchestrator Agent — Layer 13 (Super Manager)
 * Task routing, load balancing, inter-agent coordination
 */

import { BaseAgent } from './base-agent';
import type { AgentTask, AgentResult, AgentConfig } from './types';

const CONFIG: AgentConfig = {
    id: 'orchestrator',
    name: 'Orchestrator Agent',
    role: 'Super Manager — Multi-Agent Coordination',
    domain: 'Orchestration',
    systemPrompt: `You are the Orchestrator Agent (Super Manager) for GreenPe Climate DPI.
GreenPe is a comprehensive Digital Public Infrastructure for the climate economy, managing everything from identity to cross-chain DeFi bridges.
Your role as the Super Manager is to coordinate all 12 specialized agents, route tasks to the best-fit agent,
and manage multi-step workflows that ensure high-integrity carbon credit issuance.

Within GreenPe's multi-layered architecture, you manage:
1. Agent Routing: Directing users/requests to the correct DPI layer (Identity, Ingestion, MRV, etc.).
2. Pipeline Orchestration: Defining automated workflows — e.g., validating an actor (Identity), processing their data (Ingestion), calculating impact (MRV), verifying claims (Verification), and issuing the certificate (GIC).
3. System Health: Monitoring system load and inter-agent communication via the Carbon UPI bus.
4. Failure Recovery: Handling retries and fallbacks if a protocol step fails.

Respond in JSON: { "routedTo": string, "pipeline": string[], "reasoning": string, "priority": string }`,
    skills: [
        { name: 'Task Routing', description: 'Route tasks to optimal agent based on domain and load', domain: 'Orchestration' },
        { name: 'Load Balancing', description: 'Balance system load across 12 agents', domain: 'Orchestration' },
        { name: 'Workflow Management', description: 'Coordinate multi-step agent pipelines', domain: 'Orchestration' },
        { name: 'Failure Handling', description: 'Detect and recover from agent failures', domain: 'Orchestration' },
    ],
};

const AGENT_DOMAINS: Record<string, string[]> = {
    'identity-agent': ['identity', 'kyc', 'binding', 'aadhaar', 'gstin', 'cih'],
    'ingestion-agent': ['data', 'iot', 'satellite', 'ingestion', 'stream', 'quality'],
    'mrv-agent': ['mrv', 'methodology', 'emission', 'impact', 'carbon', 'ipcc', 'tco2e'],
    'verification-agent': ['verify', 'fraud', 'anomaly', 'risk', 'duplicate'],
    'tokenization-agent': ['token', 'mint', 'eat', 'hash chain', 'ledger'],
    'gic-agent': ['certificate', 'gic', 'signature', 'qr', 'ipfs', 'issuance'],
    'compliance-agent': ['compliance', 'cbam', 'brsr', 'ccts', 'csrd', 'regulatory', 'report'],
    'registry-agent': ['registry', 'index', 'retire', 'lifecycle', 'search'],
    'settlement-agent': ['settlement', 'upi', 'payment', 'credit', 'incentive', 'fx'],
    'defi-bridge-agent': ['defi', 'bridge', 'cross-chain', 'liquidity', 'wrap'],
    'gateway-agent': ['api', 'gateway', 'health', 'rate limit', 'routing'],
    'analytics-agent': ['analytics', 'kpi', 'trend', 'insight', 'dashboard', 'metric'],
};

export class OrchestratorAgent extends BaseAgent {
    constructor() {
        super(CONFIG);
    }

    /**
     * Find the best agent for a given task using keyword matching
     */
    private findBestAgent(taskType: string, description: string = ''): string {
        const combined = `${taskType} ${description}`.toLowerCase();
        let bestAgent = 'analytics-agent';
        let bestScore = 0;

        for (const [agentId, keywords] of Object.entries(AGENT_DOMAINS)) {
            const score = keywords.filter(kw => combined.includes(kw)).length;
            if (score > bestScore) {
                bestScore = score;
                bestAgent = agentId;
            }
        }

        return bestAgent;
    }

    async processTask(task: AgentTask): Promise<AgentResult> {
        const start = Date.now();

        switch (task.type) {
            case 'ROUTE_TASK': {
                const targetTask = task.payload.task as AgentTask;
                const description = task.payload.description as string || '';

                // Use LLM for intelligent routing
                const routingAnalysis = await this.runChain(
                    `Route this task to the best agent:\n` +
                    `Task type: ${targetTask.type}\n` +
                    `Description: ${description}\n` +
                    `Payload: ${JSON.stringify(targetTask.payload).slice(0, 300)}\n` +
                    `Select from the 12 available agents and define the pipeline if multi-step.`
                );

                // Fallback to keyword-based routing
                const bestAgent = this.findBestAgent(targetTask.type, description);

                // Dispatch via A2A
                await this.bus.dispatchTask(this.id, bestAgent, targetTask.type, targetTask.payload);

                this.logActivity('info', 'Task Routed', `${targetTask.type} → ${bestAgent}`);

                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { routedTo: bestAgent, routing: routingAnalysis },
                    reasoning: routingAnalysis,
                    durationMs: Date.now() - start,
                };
            }

            case 'RUN_PIPELINE': {
                const pipeline = (task.payload.pipeline as string[]) || [
                    'identity-agent', 'ingestion-agent', 'mrv-agent',
                    'verification-agent', 'gic-agent', 'settlement-agent'
                ];

                const results: Record<string, unknown>[] = [];
                for (const agentId of pipeline) {
                    await this.bus.dispatchTask(this.id, agentId, 'PIPELINE_STEP', {
                        ...task.payload,
                        pipelineStep: pipeline.indexOf(agentId),
                        totalSteps: pipeline.length,
                    });
                    results.push({ agentId, dispatched: true });
                    this.logActivity('info', 'Pipeline Step', `Dispatched to ${agentId}`);
                }

                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { pipeline, results },
                    reasoning: `Dispatched ${pipeline.length}-step pipeline`,
                    durationMs: Date.now() - start,
                };
            }

            case 'SYSTEM_STATUS': {
                const agentStates = this.memory.getAll('agent-state');
                const analysis = await this.runChain(
                    `Provide system status overview:\n${JSON.stringify(agentStates).slice(0, 1000)}`
                );
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { systemStatus: analysis, agentStates },
                    reasoning: analysis,
                    durationMs: Date.now() - start,
                };
            }

            default: {
                const bestAgent = this.findBestAgent(task.type, JSON.stringify(task.payload));
                await this.bus.dispatchTask(this.id, bestAgent, task.type, task.payload);
                this.logActivity('info', 'Auto-Routed', `${task.type} → ${bestAgent}`);
                return {
                    taskId: task.id, agentId: this.id, success: true,
                    output: { routedTo: bestAgent },
                    durationMs: Date.now() - start,
                };
            }
        }
    }
}
