/**
 * GreenPe Agent System — A2A Message Bus
 * 
 * Agent-to-Agent communication using A2A protocol patterns.
 * Supports typed messages, task dispatch, broadcast, and correlation.
 */

import type { A2AMessage, A2AMessageType, TaskStatus, AgentActivity } from './types';
import { getCoreMemory } from './core-memory';

type MessageHandler = (message: A2AMessage) => void | Promise<void>;

class A2AMessageBus {
    private handlers: Map<string, MessageHandler[]> = new Map();
    private messageLog: A2AMessage[] = [];
    private messageCounter: number = 0;

    /**
     * Generate unique message ID
     */
    private generateId(): string {
        this.messageCounter++;
        return `a2a-${Date.now()}-${this.messageCounter}`;
    }

    /**
     * Send a message from one agent to another
     */
    async sendMessage(
        from: string,
        to: string,
        type: A2AMessageType,
        payload: Record<string, unknown>,
        correlationId?: string
    ): Promise<A2AMessage> {
        const message: A2AMessage = {
            id: this.generateId(),
            from,
            to,
            type,
            payload,
            timestamp: Date.now(),
            status: 'PENDING',
            correlationId,
        };

        this.messageLog.push(message);
        if (this.messageLog.length > 500) {
            this.messageLog = this.messageLog.slice(-500);
        }

        // Log activity to core memory
        const memory = getCoreMemory();
        memory.logActivity({
            id: message.id,
            agentId: from,
            agentName: from,
            action: `A2A → ${to}`,
            detail: `${type}: ${JSON.stringify(payload).slice(0, 120)}`,
            timestamp: message.timestamp,
            type: 'info',
        });

        // Deliver to target agent handlers
        if (to === 'broadcast') {
            // Broadcast to all registered handlers
            for (const [agentId, handlers] of this.handlers) {
                if (agentId !== from) {
                    for (const handler of handlers) {
                        try {
                            await handler(message);
                        } catch (err) {
                            console.error(`A2A delivery failed to ${agentId}:`, err);
                        }
                    }
                }
            }
        } else {
            const handlers = this.handlers.get(to) || [];
            for (const handler of handlers) {
                try {
                    await handler(message);
                    message.status = 'COMPLETED';
                } catch (err) {
                    message.status = 'FAILED';
                    console.error(`A2A delivery failed to ${to}:`, err);
                }
            }
        }

        return message;
    }

    /**
     * Dispatch a task from one agent to another
     */
    async dispatchTask(
        from: string,
        to: string,
        taskType: string,
        taskPayload: Record<string, unknown>
    ): Promise<A2AMessage> {
        return this.sendMessage(from, to, 'TASK_DISPATCH', {
            taskType,
            ...taskPayload,
        });
    }

    /**
     * Send a task result back
     */
    async sendResult(
        from: string,
        to: string,
        result: Record<string, unknown>,
        correlationId: string
    ): Promise<A2AMessage> {
        return this.sendMessage(from, to, 'TASK_RESULT', result, correlationId);
    }

    /**
     * Share data between agents
     */
    async shareData(
        from: string,
        to: string,
        data: Record<string, unknown>
    ): Promise<A2AMessage> {
        return this.sendMessage(from, to, 'DATA_SHARE', data);
    }

    /**
     * Send alert to orchestrator or broadcast
     */
    async sendAlert(
        from: string,
        alert: { severity: string; message: string; data?: Record<string, unknown> }
    ): Promise<A2AMessage> {
        return this.sendMessage(from, 'orchestrator', 'ALERT', alert);
    }

    /**
     * Register a handler for an agent
     */
    onMessage(agentId: string, handler: MessageHandler): () => void {
        const handlers = this.handlers.get(agentId) || [];
        handlers.push(handler);
        this.handlers.set(agentId, handlers);

        return () => {
            const current = this.handlers.get(agentId) || [];
            this.handlers.set(agentId, current.filter(h => h !== handler));
        };
    }

    /**
     * Get recent message log
     */
    getMessageLog(limit: number = 50): A2AMessage[] {
        return this.messageLog.slice(-limit).reverse();
    }

    /**
     * Get messages for a specific agent
     */
    getMessagesForAgent(agentId: string, limit: number = 20): A2AMessage[] {
        return this.messageLog
            .filter(m => m.from === agentId || m.to === agentId)
            .slice(-limit)
            .reverse();
    }

    /**
     * Get message stats
     */
    getStats(): { total: number; byType: Record<string, number>; byStatus: Record<string, number> } {
        const byType: Record<string, number> = {};
        const byStatus: Record<string, number> = {};

        this.messageLog.forEach(m => {
            byType[m.type] = (byType[m.type] || 0) + 1;
            byStatus[m.status] = (byStatus[m.status] || 0) + 1;
        });

        return { total: this.messageLog.length, byType, byStatus };
    }
}

// Singleton
let instance: A2AMessageBus | null = null;

export function getA2ABus(): A2AMessageBus {
    if (!instance) {
        instance = new A2AMessageBus();
    }
    return instance;
}

export type { A2AMessageBus };
