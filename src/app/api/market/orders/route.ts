import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    try {
        // Fetch open market orders with seller details
        const { data: orders, error } = await supabase
            .from("market_orders")
            .select(`
                id,
                asset_type,
                quantity,
                price_per_unit,
                status,
                entity_id,
                entities ( name, location )
            `)
            .eq("status", "OPEN")
            .eq("order_type", "SELL");

        if (error || !orders || orders.length === 0) {
            // Return mock data if DB table doesn't exist yet to keep UI functional
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
            location: o.entities?.location?.region || "Global",
            methodology: "Verified Project", // Simplified for MVP
            entity_id: o.entity_id
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
        
        // Example: Creating a new Sell Order
        const { entityId, assetType, quantity, price } = payload;
        
        if (!entityId || !assetType || !quantity || !price) {
             return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("market_orders")
            .insert({
                entity_id: entityId,
                asset_type: assetType,
                order_type: "SELL",
                quantity: quantity,
                price_per_unit: price,
                status: "OPEN"
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, order: data });

    } catch (error) {
         console.error("Create Market Order Error:", error);
         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
