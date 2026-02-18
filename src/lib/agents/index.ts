/**
 * GreenPe Agent System — Agent Registry
 * 
 * Central index that instantiates and manages all 13 agents.
 * Singleton — initializes agents lazily on first access.
 */

import { BaseAgent } from './base-agent';
import { IdentityAgent } from './identity-agent';
import { IngestionAgent } from './ingestion-agent';
import { MRVAgent } from './mrv-agent';
import { VerificationAgent } from './verification-agent';
import { TokenizationAgent } from './tokenization-agent';
import { GICAgent } from './gic-agent';
import { ComplianceAgent } from './compliance-agent';
import { RegistryAgent } from './registry-agent';
import { SettlementAgent } from './settlement-agent';
import { DeFiBridgeAgent } from './defi-bridge-agent';
import { GatewayAgent } from './gateway-agent';
import { AnalyticsAgent } from './analytics-agent';
import { OrchestratorAgent } from './orchestrator-agent';
import type { AgentTelemetry, AgentTask, AgentResult } from './types';
import { getCoreMemory } from './core-memory';
import { getA2ABus } from './a2a-bus';

class AgentRegistry {
    private agents: Map<string, BaseAgent> = new Map();
    private initialized: boolean = false;

    /**
     * Initialize all 13 agents
     */
    initialize(): void {
        if (this.initialized) return;

        const agentClasses: BaseAgent[] = [
            new IdentityAgent(),
            new IngestionAgent(),
            new MRVAgent(),
            new VerificationAgent(),
            new TokenizationAgent(),
            new GICAgent(),
            new ComplianceAgent(),
            new RegistryAgent(),
            new SettlementAgent(),
            new DeFiBridgeAgent(),
            new GatewayAgent(),
            new AnalyticsAgent(),
            new OrchestratorAgent(),
        ];

        agentClasses.forEach(agent => {
            this.agents.set(agent.id, agent);
        });

        // Log initialization
        const memory = getCoreMemory();
        memory.logActivity({
            id: `system-init-${Date.now()}`,
            agentId: 'system',
            agentName: 'System',
            action: 'Agent System Initialized',
            detail: `${agentClasses.length} agents online`,
            timestamp: Date.now(),
            type: 'success',
        });

        this.initialized = true;
    }

    /**
     * Get a specific agent by ID
     */
    getAgent(id: string): BaseAgent | undefined {
        this.ensureInitialized();
        return this.agents.get(id);
    }

    /**
     * Get all agents
     */
    getAllAgents(): BaseAgent[] {
        this.ensureInitialized();
        return Array.from(this.agents.values());
    }

    /**
     * Get telemetry for all agents
     */
    getAllTelemetry(): AgentTelemetry[] {
        this.ensureInitialized();
        return Array.from(this.agents.values()).map(a => a.getHeartbeat());
    }

    /**
     * Dispatch a task to a specific agent
     */
    async dispatchTask(agentId: string, task: AgentTask): Promise<AgentResult> {
        this.ensureInitialized();
        const agent = this.agents.get(agentId);
        if (!agent) {
            return {
                taskId: task.id,
                agentId,
                success: false,
                output: {},
                error: `Agent ${agentId} not found`,
                durationMs: 0,
            };
        }
        return agent.handleTask(task);
    }

    /**
     * Route task through orchestrator
     */
    async routeTask(task: AgentTask, description?: string): Promise<AgentResult> {
        this.ensureInitialized();
        const orchestrator = this.agents.get('orchestrator');
        if (!orchestrator) {
            return {
                taskId: task.id,
                agentId: 'orchestrator',
                success: false,
                output: {},
                error: 'Orchestrator not initialized',
                durationMs: 0,
            };
        }

        return orchestrator.handleTask({
            ...task,
            type: 'ROUTE_TASK',
            payload: { task, description },
        });
    }

    /**
     * Get system summary
     */
    getSystemSummary(): {
        totalAgents: number;
        activeAgents: number;
        systemLoad: number;
        totalTasksCompleted: number;
        totalA2AMessages: number;
    } {
        this.ensureInitialized();
        const telemetry = this.getAllTelemetry();
        const activeAgents = telemetry.filter(t => t.status !== 'IDLE').length;
        const systemLoad = Math.floor(
            telemetry.reduce((sum, t) => sum + t.load, 0) / telemetry.length
        );
        const totalTasksCompleted = telemetry.reduce((sum, t) => sum + t.tasksCompleted, 0);
        const totalA2AMessages = telemetry.reduce(
            (sum, t) => sum + t.a2aMessagesSent + t.a2aMessagesReceived, 0
        );

        return {
            totalAgents: telemetry.length,
            activeAgents,
            systemLoad,
            totalTasksCompleted,
            totalA2AMessages,
        };
    }

    private ensureInitialized(): void {
        if (!this.initialized) {
            this.initialize();
        }
    }
}

// Singleton
let instance: AgentRegistry | null = null;

export function getAgentRegistry(): AgentRegistry {
    if (!instance) {
        instance = new AgentRegistry();
    }
    return instance;
}

// Re-export core modules for convenience
export { getCoreMemory } from './core-memory';
export { getA2ABus } from './a2a-bus';
export type { AgentTelemetry, AgentTask, AgentResult, AgentActivity, A2AMessage } from './types';
