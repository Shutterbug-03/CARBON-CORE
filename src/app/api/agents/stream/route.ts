import { getCoreMemory } from "@/lib/agents/core-memory";
import { getAgentRegistry } from "@/lib/agents";

export const dynamic = "force-dynamic";

export async function GET() {
    // Ensure agents are initialized
    getAgentRegistry();

    const memory = getCoreMemory();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            // Send initial state
            const activities = memory.getActivityLog(10);
            const data = JSON.stringify({ type: 'initial', activities });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));

            // Subscribe to new activities
            const unsubscribe = memory.onActivity((activity) => {
                try {
                    const eventData = JSON.stringify({ type: 'activity', activity });
                    controller.enqueue(encoder.encode(`data: ${eventData}\n\n`));
                } catch {
                    // Stream closed
                    unsubscribe();
                }
            });

            // Heartbeat every 10s to keep connection alive
            const heartbeat = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`));
                } catch {
                    clearInterval(heartbeat);
                    unsubscribe();
                }
            }, 10000);
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
