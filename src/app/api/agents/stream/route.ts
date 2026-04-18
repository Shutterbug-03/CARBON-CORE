import { getCoreMemory } from "@/lib/agents/core-memory";
import { getAgentRegistry } from "@/lib/agents";

export const dynamic = "force-dynamic";

// Hard timeout: kill any SSE connection after 5 minutes to prevent GB-hour bleed
export const maxDuration = 300;

export async function GET() {
    // Ensure agents are initialized
    getAgentRegistry();

    const memory = getCoreMemory();
    const encoder = new TextEncoder();

    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
    let unsubscribeFn: (() => void) | null = null;

    const cleanup = () => {
        if (heartbeatTimer) {
            clearInterval(heartbeatTimer);
            heartbeatTimer = null;
        }
        if (unsubscribeFn) {
            unsubscribeFn();
            unsubscribeFn = null;
        }
    };

    const stream = new ReadableStream({
        start(controller) {
            // Send initial state
            const activities = memory.getActivityLog(10);
            const data = JSON.stringify({ type: 'initial', activities });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));

            // Subscribe to new activities
            unsubscribeFn = memory.onActivity((activity) => {
                try {
                    const eventData = JSON.stringify({ type: 'activity', activity });
                    controller.enqueue(encoder.encode(`data: ${eventData}\n\n`));
                } catch {
                    cleanup();
                    try { controller.close(); } catch { /* already closed */ }
                }
            });

            // Heartbeat every 30s (reduced from 10s to lower memory pressure)
            heartbeatTimer = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`));
                } catch {
                    cleanup();
                    try { controller.close(); } catch { /* already closed */ }
                }
            }, 30000);
        },
        // ✅ Critical: runs when client disconnects or stream is cancelled
        cancel() {
            cleanup();
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
