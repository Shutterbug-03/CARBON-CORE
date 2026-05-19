import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client for server-side logic
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
    try {
        // In a real app, you would get the user ID from the request headers or token
        // For MVP, we will fetch the first entity or a specific one
        
        // Mocking user auth logic for the demo (assuming the user is the first entity)
        const { data: entities, error: entityError } = await supabase
            .from("entities")
            .select("id")
            .limit(1);
            
        if (entityError || !entities || entities.length === 0) {
            // Return mock wallet if DB is not setup yet to prevent UI breaking
            return NextResponse.json({
                fiat_balance: 24500.50,
                carbon_credits: 1250.00,
                i_recs: 850.00
            });
        }

        const entityId = entities[0].id;

        // Fetch wallet
        const { data: wallet, error: walletError } = await supabase
            .from("wallets")
            .select("*")
            .eq("entity_id", entityId)
            .single();

        if (walletError || !wallet) {
             return NextResponse.json({
                fiat_balance: 24500.50,
                carbon_credits: 1250.00,
                i_recs: 850.00
            });
        }

        // Aggregate assets from certificates table (owned by this entity)
        const { data: certs, error: certError } = await supabase
            .from("certificates")
            .select("project_type, carbon_reduced")
            .eq("entity_id", entityId)
            .eq("status", "ISSUED");

        let totalCarbon = 0;
        let totalIRec = 0;

        if (certs) {
            certs.forEach((cert: any) => {
                if (cert.project_type === "I-REC") {
                    totalIRec += Number(cert.carbon_reduced);
                } else {
                    totalCarbon += Number(cert.carbon_reduced);
                }
            });
        }

        return NextResponse.json({
            wallet_id: wallet.id,
            fiat_balance: wallet.fiat_balance,
            carbon_credits: totalCarbon,
            i_recs: totalIRec
        });

    } catch (error) {
        console.error("Wallet Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
