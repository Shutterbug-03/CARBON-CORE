import { NextResponse, type NextRequest } from "next/server";
import { getAgentRegistry } from "@/lib/agents";
import type { AgentTask } from "@/lib/agents/types";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { agentId, taskType, payload, description } = body;

        if (!taskType) {
            return NextResponse.json(
                { error: "taskType is required" },
                { status: 400 }
            );
        }

        const registry = getAgentRegistry();

        const task: AgentTask = {
            id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            type: taskType,
            payload: payload || {},
            priority: 'MEDIUM',
            assignedTo: agentId,
            createdAt: Date.now(),
            status: 'PENDING',
        };

        let result;
        if (agentId) {
            // Dispatch to a specific agent
            result = await registry.dispatchTask(agentId, task);
        } else {
            // Route through orchestrator
            result = await registry.routeTask(task, description);
        }

        return NextResponse.json({
            success: result.success,
            taskId: task.id,
            agentId: result.agentId,
            output: result.output,
            reasoning: result.reasoning,
            durationMs: result.durationMs,
            error: result.error,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json(
            { error: message, success: false },
            { status: 500 }
        );
    }
}
