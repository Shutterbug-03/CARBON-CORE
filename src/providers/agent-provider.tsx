"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type AgentStatus = "IDLE" | "ACTIVE" | "PROCESSING" | "ERROR" | "WAITING";

export interface Agent {
    id: string;
    name: string;
    status: AgentStatus;
    load: number;
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

export interface AgentActivity {
    id: string;
    agentId: string;
    agentName: string;
    action: string;
    detail: string;
    timestamp: number;
    type: "info" | "success" | "warning" | "error";
}

interface SystemSummary {
    totalAgents: number;
    activeAgents: number;
    systemLoad: number;
    totalTasksCompleted: number;
    totalA2AMessages: number;
}

interface AgentContextType {
    agents: Agent[];
    systemLoad: number;
    activeAgentsCount: number;
    system: SystemSummary;
    activities: AgentActivity[];
    dispatchTask: (agentId: string | null, taskType: string, payload?: Record<string, unknown>) => Promise<unknown>;
    loading: boolean;
}

const DEFAULT_SYSTEM: SystemSummary = {
    totalAgents: 13,
    activeAgents: 0,
    systemLoad: 0,
    totalTasksCompleted: 0,
    totalA2AMessages: 0,
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [system, setSystem] = useState<SystemSummary>(DEFAULT_SYSTEM);
    const [activities, setActivities] = useState<AgentActivity[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch agents from API
    const fetchAgents = useCallback(async () => {
        try {
            const res = await fetch("/api/agents");
            if (!res.ok) return;
            const data = await res.json();
            setAgents(data.agents || []);
            setSystem(data.system || DEFAULT_SYSTEM);
            if (data.recentActivity) {
                setActivities(data.recentActivity);
            }
            setLoading(false);
        } catch {
            // Silent retry
        }
    }, []);

    // Poll every 3 seconds
    useEffect(() => {
        fetchAgents();
        const interval = setInterval(fetchAgents, 3000);
        return () => clearInterval(interval);
    }, [fetchAgents]);

    // SSE stream for real-time activities
    useEffect(() => {
        let eventSource: EventSource | null = null;

        try {
            eventSource = new EventSource("/api/agents/stream");
            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === "activity") {
                        setActivities(prev => [data.activity, ...prev].slice(0, 50));
                    } else if (data.type === "initial" && data.activities) {
                        setActivities(data.activities);
                    }
                } catch {
                    // Parse error, skip
                }
            };
            eventSource.onerror = () => {
                // Reconnect handled automatically by EventSource
            };
        } catch {
            // SSE not supported, fall back to polling only
        }

        return () => {
            eventSource?.close();
        };
    }, []);

    // Dispatch task to an agent or orchestrator
    const dispatchTask = useCallback(async (
        agentId: string | null,
        taskType: string,
        payload: Record<string, unknown> = {}
    ) => {
        const res = await fetch("/api/agents/task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ agentId, taskType, payload }),
        });
        const result = await res.json();
        // Refresh agents after dispatch
        await fetchAgents();
        return result;
    }, [fetchAgents]);

    const systemLoad = system.systemLoad;
    const activeAgentsCount = system.activeAgents;

    return (
        <AgentContext.Provider value={{
            agents,
            systemLoad,
            activeAgentsCount,
            system,
            activities,
            dispatchTask,
            loading,
        }}>
            {children}
        </AgentContext.Provider>
    );
}

export function useAgents() {
    const context = useContext(AgentContext);
    if (!context) throw new Error("useAgents must be used within AgentProvider");
    return context;
}
