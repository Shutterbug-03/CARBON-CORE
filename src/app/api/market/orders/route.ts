import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
    try {
        const supabase = createAdminClient();

        // Fetch open market orders with seller and certificate details
        const { data: orders, error } = await supabase
            .from("market_orders")
            .select(`
                id,
                asset_type,
                quantity,
                price_per_unit,
                status,
                entity_id,
                certificate_id,
                entities ( name, location ),
                certificates ( certificate_id, project_name, location )
            `)
            .eq("status", "OPEN")
            .eq("order_type", "SELL");

        if (error || !orders || orders.length === 0) {
            // Return mock data if DB table is empty or doesn't exist yet to keep UI functional
            return NextResponse.json([
                { id: "ord_1", seller: "SolarGen India", type: "I-REC", quantity: 500, price: 2.50, location: "Gujarat", methodology: "Solar PV", entity_id: "mock1" },
                { id: "ord_2", seller: "EcoWind Corp", type: "I-REC", quantity: 1200, price: 2.10, location: "Tamil Nadu", methodology: "Wind", entity_id: "mock2" },
                { id: "ord_3", seller: "AgriWaste Ltd", type: "Carbon Credit", quantity: 300, price: 15.00, location: "Punjab", methodology: "Biomass", entity_id: "mock3" },
                { id: "ord_4", seller: "HydroPower Pro", type: "I-REC", quantity: 2000, price: 1.80, location: "Himachal", methodology: "Hydro", entity_id: "mock4" }
            ]);
        }

        const formattedOrders = orders.map((o: any) => ({
            id: o.id,
            seller: o.entities?.name || "Unknown Seller",
            type: o.asset_type === "I_REC" ? "I-REC" : "Carbon Credit",
            quantity: Number(o.quantity),
            price: Number(o.price_per_unit),
            location: o.certificates?.location || o.entities?.location?.region || "Global",
            methodology: o.certificates?.project_name ? `Project: ${o.certificates.project_name}` : "Verified Project",
            entity_id: o.entity_id,
            certificate_uuid: o.certificate_id,
            certificate_code: o.certificates?.certificate_id
        }));

        return NextResponse.json(formattedOrders);

    } catch (error) {
        console.error("Market Orders Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const { entityId, assetType, quantity, price, certificateId } = payload;
        
        if (!entityId || !assetType || !quantity || !price) {
             return NextResponse.json({ error: "Missing required fields. Required: entityId, assetType, quantity, price" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // If a certificate identifier is passed, look up its UUID primary key
        let certificateUuid: string | null = null;
        if (certificateId) {
            // Find certificate by UUID or human-readable certificate_id
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(certificateId);
            const query = supabase.from("certificates").select("id");
            const { data: cert } = isUuid 
                ? await query.eq("id", certificateId).maybeSingle()
                : await query.eq("certificate_id", certificateId).maybeSingle();

            if (cert) {
                certificateUuid = cert.id;
            }
        }

        const { data, error } = await supabase
            .from("market_orders")
            .insert({
                entity_id: entityId,
                certificate_id: certificateUuid,
                asset_type: assetType === "I-REC" ? "I_REC" : assetType,
                order_type: "SELL",
                quantity: quantity,
                price_per_unit: price,
                status: "OPEN"
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, order: data });

    } catch (error: any) {
         console.error("Create Market Order Error:", error);
         return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

