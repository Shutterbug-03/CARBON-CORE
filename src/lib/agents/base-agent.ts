/**
 * GreenPe Agent System — Base Agent Class
 * 
 * Abstract base for all 13 specialized agents.
 * Uses Greeni Agent Framework for LLM reasoning.
 * Integrates with Core Memory and A2A Bus.
 */

import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import type { AgentConfig, AgentTelemetry, AgentTask, AgentResult, AgentSkill, AgentStatus, AgentActivity } from './types';
import { getCoreMemory, type CoreMemoryStore } from './core-memory';
import { getA2ABus, type A2AMessageBus } from './a2a-bus';

export abstract class BaseAgent {
    readonly id: string;
    readonly name: string;
    readonly role: string;
    readonly domain: string;
    readonly skills: AgentSkill[];
    readonly systemPrompt: string;

    protected model: ChatOpenAI;
    protected memory: CoreMemoryStore;
    protected bus: A2AMessageBus;

    // Telemetry tracking
    private _status: AgentStatus = 'IDLE';
    private _currentAction: string = 'Standby';
    private _load: number = 0;
    private _tasksCompleted: number = 0;
    private _tasksQueued: number = 0;
    private _totalResponseMs: number = 0;
    private _responseCount: number = 0;
    private _memoryReads: number = 0;
    private _memoryWrites: number = 0;
    private _a2aSent: number = 0;
    private _a2aReceived: number = 0;
    private _lastError?: string;

    constructor(config: AgentConfig) {
        this.id = config.id;
        this.name = config.name;
        this.role = config.role;
        this.domain = config.domain;
        this.skills = config.skills;
        this.systemPrompt = config.systemPrompt;

        // Initialize Greeni AI model
        const apiKey = process.env.OPENAI_API_KEY;
        const hasKey = apiKey && !apiKey.startsWith('sk-your');

        this.model = new ChatOpenAI({
            modelName: config.model || 'gpt-4o-mini',
            temperature: 0.2,
            maxTokens: 1024,
            apiKey: hasKey ? apiKey : undefined,
        });

        this.memory = getCoreMemory();
        this.bus = getA2ABus();

        // Register A2A message handler
        this.bus.onMessage(this.id, async (message) => {
            this._a2aReceived++;
            if (message.type === 'TASK_DISPATCH') {
                const task: AgentTask = {
                    id: message.id,
                    type: message.payload.taskType as string,
                    payload: message.payload,
                    priority: 'MEDIUM',
                    assignedTo: this.id,
                    createdAt: Date.now(),
                    status: 'PENDING',
                };
                await this.handleTask(task);
            }
        });

        // Write initial state to memory
        this.updateMemoryState();
    }

    /**
     * Check if OpenAI API key is available
     */
    protected get hasLLM(): boolean {
        const apiKey = process.env.OPENAI_API_KEY;
        return !!apiKey && !apiKey.startsWith('sk-your');
    }

    /**
     * Run LLM chain with the agent's system prompt
     */
    protected async runChain(userMessage: string): Promise<string> {
        if (!this.hasLLM) {
            return this.simulateResponse(userMessage);
        }

        const start = Date.now();
        try {
            const prompt = ChatPromptTemplate.fromMessages([
                SystemMessagePromptTemplate.fromTemplate(this.systemPrompt),
                HumanMessagePromptTemplate.fromTemplate('{input}'),
            ]);

            const chain = prompt.pipe(this.model).pipe(new StringOutputParser());
            const result = await chain.invoke({ input: userMessage });

            const duration = Date.now() - start;
            this._totalResponseMs += duration;
            this._responseCount++;

            // Log conversation to memory
            this.writeMemory('conversations', `${this.id}-${Date.now()}`, {
                role: 'assistant',
                content: result.slice(0, 500),
                timestamp: Date.now(),
            });

            return result;
        } catch (err) {
            this._lastError = err instanceof Error ? err.message : 'Unknown error';
            this.setStatus('ERROR', `LLM Error: ${this._lastError}`);
            return this.simulateResponse(userMessage);
        }
    }

    /**
     * Simulate an LLM response when no API key is available.
     * Subclasses can override for domain-specific simulation.
     */
    protected simulateResponse(userMessage: string): string {
        return `[${this.name}] Simulated analysis of: ${userMessage.slice(0, 100)}. Processing complete with high confidence.`;
    }

    /**
     * Process a task — subclasses implement domain-specific logic
     */
    abstract processTask(task: AgentTask): Promise<AgentResult>;

    /**
     * Handle an incoming task with telemetry tracking
     */
    async handleTask(task: AgentTask): Promise<AgentResult> {
        this._tasksQueued++;
        this.setStatus('PROCESSING', `Processing: ${task.type}`);

        const start = Date.now();
        try {
            const result = await this.processTask(task);
            const duration = Date.now() - start;

            this._tasksCompleted++;
            this._tasksQueued = Math.max(0, this._tasksQueued - 1);
            this._totalResponseMs += duration;
            this._responseCount++;

            // Log success activity
            this.logActivity('success', `Completed: ${task.type}`, JSON.stringify(result.output).slice(0, 150));

            this.setStatus('ACTIVE', `Completed: ${task.type}`);
            return result;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            this._lastError = errorMsg;
            this._tasksQueued = Math.max(0, this._tasksQueued - 1);

            this.logActivity('error', `Failed: ${task.type}`, errorMsg);
            this.setStatus('ERROR', errorMsg);

            return {
                taskId: task.id,
                agentId: this.id,
                success: false,
                output: {},
                error: errorMsg,
                durationMs: Date.now() - start,
            };
        }
    }

    /**
     * Set agent status and update memory
     */
    protected setStatus(status: AgentStatus, action: string): void {
        this._status = status;
        this._currentAction = action;
        this._load = status === 'PROCESSING' ? Math.min(95, this._load + 20) :
            status === 'ACTIVE' ? Math.max(10, this._load - 10) :
                status === 'IDLE' ? 0 : this._load;
        this.updateMemoryState();
    }

    /**
     * Read from core memory with tracking
     */
    protected readMemory<T = unknown>(channel: Parameters<CoreMemoryStore['read']>[0], key: string): T | undefined {
        this._memoryReads++;
        return this.memory.read<T>(channel, key);
    }

    /**
     * Write to core memory with tracking
     */
    protected writeMemory<T = unknown>(channel: Parameters<CoreMemoryStore['write']>[0], key: string, value: T): void {
        this._memoryWrites++;
        this.memory.write(channel, key, value, this.id);
    }

    /**
     * Send A2A message to another agent
     */
    protected async sendToAgent(
        toAgentId: string,
        type: Parameters<A2AMessageBus['sendMessage']>[2],
        payload: Record<string, unknown>
    ): Promise<void> {
        this._a2aSent++;
        await this.bus.sendMessage(this.id, toAgentId, type, payload);
    }

    /**
     * Log an activity event
     */
    protected logActivity(type: AgentActivity['type'], action: string, detail: string): void {
        this.memory.logActivity({
            id: `${this.id}-${Date.now()}`,
            agentId: this.id,
            agentName: this.name,
            action,
            detail,
            timestamp: Date.now(),
            type,
        });
    }

    /**
     * Update agent state in core memory
     */
    private updateMemoryState(): void {
        this.memory.write('agent-state', this.id, this.getHeartbeat(), this.id);
    }

    /**
     * Get current telemetry
     */
    getHeartbeat(): AgentTelemetry {
        return {
            agentId: this.id,
            status: this._status,
            load: this._load,
            currentAction: this._currentAction,
            lastHeartbeat: Date.now(),
            tasksCompleted: this._tasksCompleted,
            tasksQueued: this._tasksQueued,
            avgResponseMs: this._responseCount > 0 ? Math.round(this._totalResponseMs / this._responseCount) : 0,
            memoryReads: this._memoryReads,
            memoryWrites: this._memoryWrites,
            a2aMessagesSent: this._a2aSent,
            a2aMessagesReceived: this._a2aReceived,
            lastError: this._lastError,
        };
    }

    /**
     * Start periodic heartbeat updates
     */
    startHeartbeat(intervalMs: number = 5000): () => void {
        const interval = setInterval(() => {
            this.updateMemoryState();
        }, intervalMs);
        return () => clearInterval(interval);
    }
}
