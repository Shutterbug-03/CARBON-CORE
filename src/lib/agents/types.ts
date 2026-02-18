/**
 * GreenPe Agent System — Type Definitions
 * Greeni Agent Framework + A2A + Core Memory
 */

// ============================================
// Agent Status & Identity
// ============================================

export type AgentStatus = 'IDLE' | 'ACTIVE' | 'PROCESSING' | 'ERROR' | 'WAITING';

export interface AgentSkill {
    name: string;
    description: string;
    domain: string;
}

export interface AgentConfig {
    id: string;
    name: string;
    role: string;
    domain: string;
    systemPrompt: string;
    skills: AgentSkill[];
    model?: string; // defaults to Greeni AI
}

export interface AgentTelemetry {
    agentId: string;
    status: AgentStatus;
    load: number;             // 0-100
    currentAction: string;
    lastHeartbeat: number;
    tasksCompleted: number;
    tasksQueued: number;
    avgResponseMs: number;
    memoryReads: number;
    memoryWrites: number;
    a2aMessagesSent: number;
    a2aMessagesReceived: number;
    lastError?: string;
}

// ============================================
// Task System
// ============================================

export type TaskStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AgentTask {
    id: string;
    type: string;
    payload: Record<string, unknown>;
    priority: TaskPriority;
    assignedTo?: string;    // agent ID
    createdAt: number;
    startedAt?: number;
    completedAt?: number;
    status: TaskStatus;
}

export interface AgentResult {
    taskId: string;
    agentId: string;
    success: boolean;
    output: Record<string, unknown>;
    reasoning?: string;     // LLM reasoning trace
    tokensUsed?: number;
    durationMs: number;
    error?: string;
}

// ============================================
// A2A Message Protocol
// ============================================

export type A2AMessageType =
    | 'TASK_DISPATCH'
    | 'TASK_RESULT'
    | 'DATA_SHARE'
    | 'HEARTBEAT'
    | 'QUERY'
    | 'ALERT'
    | 'COORDINATION';

export interface A2AMessage {
    id: string;
    from: string;           // agent ID
    to: string;             // agent ID or 'broadcast'
    type: A2AMessageType;
    payload: Record<string, unknown>;
    timestamp: number;
    status: TaskStatus;
    correlationId?: string; // links request/response pairs
}

// ============================================
// Core Memory Channels
// ============================================

export type MemoryChannel =
    | 'agent-state'
    | 'task-queue'
    | 'audit-log'
    | 'pipeline-state'
    | 'conversations'
    | 'metrics';

export interface MemoryEntry<T = unknown> {
    key: string;
    value: T;
    updatedAt: number;
    updatedBy: string;      // agent ID
}

// ============================================
// Agent Activity Feed
// ============================================

export interface AgentActivity {
    id: string;
    agentId: string;
    agentName: string;
    action: string;
    detail: string;
    timestamp: number;
    type: 'info' | 'success' | 'warning' | 'error';
}
