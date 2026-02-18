import { NextResponse } from "next/server";
import { getAgentRegistry } from "@/lib/agents";
import { getCoreMemory } from "@/lib/agents/core-memory";

export async function GET() {
    const registry = getAgentRegistry();
    const telemetry = registry.getAllTelemetry();
    const summary = registry.getSystemSummary();
    const memory = getCoreMemory();
    const recentActivity = memory.getActivityLog(20);

    return NextResponse.json({
        agents: telemetry.map(t => ({
            id: t.agentId,
            name: t.agentId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            status: t.status,
            load: t.load,
            currentAction: t.currentAction,
            lastHeartbeat: t.lastHeartbeat,
            tasksCompleted: t.tasksCompleted,
            tasksQueued: t.tasksQueued,
            avgResponseMs: t.avgResponseMs,
            memoryReads: t.memoryReads,
            memoryWrites: t.memoryWrites,
            a2aMessagesSent: t.a2aMessagesSent,
            a2aMessagesReceived: t.a2aMessagesReceived,
            lastError: t.lastError,
        })),
        system: summary,
        recentActivity,
    });
}
