import { NextResponse } from "next/server";
import { runPipeline, METHODOLOGIES } from "@/lib/carbon-upi/engine";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const entity = body.entity || {
            id: `ENT-${Date.now()}`,
            type: "FARMER",
            name: "Test Entity",
            registrationId: "TEST-001",
            location: { lat: 28.6139, lng: 77.209, region: "India" },
            createdAt: new Date(),
        };

        const asset = body.asset || {
            id: `AST-${Date.now()}`,
            type: "LAND",
            ownerId: entity.id,
            description: "Test Asset",
            metadata: {},
            boundAt: new Date(),
        };

        const rawDataPoints = Array.from({ length: 10 }, (_, i) => ({
            id: `dp-${Date.now()}-${i}`,
            sourceType: "IOT_SENSOR" as const,
            sourceId: `sensor-${Math.floor(Math.random() * 100)}`,
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            value: Math.random() * 100 + 50,
            unit: "kWh",
            trustScore: "HIGH" as const,
            raw: { voltage: 220, current: Math.random() * 10 },
        }));

        const result = runPipeline({
            entity,
            asset,
            rawDataPoints,
            methodology: METHODOLOGIES[0],
            timeWindow: {
                start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                end: new Date(),
            },
        });

        return NextResponse.json({ success: true, result });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Pipeline execution failed";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
