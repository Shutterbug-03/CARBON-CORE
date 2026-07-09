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
            credentialType: "GSTIN",
            location: { lat: 28.6139, lng: 77.209, region: "India" },
            createdAt: new Date(),
        };

        const asset = body.asset || {
            id: `AST-${Date.now()}`,
            type: "LAND",
            ownerId: entity.id,
            description: "Test Asset",
            deviceId: "sensor-demo-001",
            metadata: {},
            boundAt: new Date(),
        };

        const reportingStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const reportingEnd = new Date();

        const rawDataPoints = Array.from({ length: 10 }, (_, i) => ({
            id: `dp-${Date.now()}-${i}`,
            cihReference: `CIH-${entity.registrationId}-${asset.id}`,
            sourceType: "IOT_SENSOR" as const,
            sourceId: `sensor-${Math.floor(Math.random() * 100)}`,
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            geolocation: {
                lat: entity.location.lat,
                lng: entity.location.lng,
            },
            value: Math.random() * 100 + 50,
            unit: "kWh",
            deviceSignature: "SIMULATED_DEVICE_SIGNATURE",
            reportingPeriod: {
                start: reportingStart,
                end: reportingEnd,
            },
            schemaVersion: "CDIF-1.0",
            trustScore: "HIGH" as const,
            raw: { voltage: 220, current: Math.random() * 10 },
        }));

        const result = runPipeline({
            entity,
            asset,
            rawDataPoints,
            methodology: METHODOLOGIES[0],
            timeWindow: {
                start: reportingStart,
                end: reportingEnd,
            },
        });

        return NextResponse.json({ success: true, result });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Pipeline execution failed";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
