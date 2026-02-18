import { NextResponse } from "next/server";

export async function GET() {
    const certificates = [
        { id: "GP-8821", date: "2026-02-17", impact: 12.5, status: "ISSUED", confidence: 98, type: "Solar", entity: "Solar Farm Pvt Ltd" },
        { id: "GP-8742", date: "2026-02-10", impact: 45.2, status: "ISSUED", confidence: 99, type: "Wind", entity: "WindGen India" },
        { id: "GP-8691", date: "2026-01-28", impact: 8.4, status: "VERIFIED", confidence: 96, type: "Agriculture", entity: "AgriGreen Co-op" },
        { id: "GP-8553", date: "2026-01-15", impact: 23.1, status: "ISSUED", confidence: 97, type: "Biogas", entity: "BioEnergy Solutions" },
        { id: "GP-8412", date: "2026-01-02", impact: 15.7, status: "ISSUED", confidence: 95, type: "Solar", entity: "Solar Farm Pvt Ltd" },
    ];
    return NextResponse.json({ certificates, total: certificates.length });
}
