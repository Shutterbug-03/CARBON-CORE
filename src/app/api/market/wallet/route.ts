import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
    try {
        const supabase = createAdminClient();

        // Retrieve the first entity in the database to bind to the current session (demo / no auth fallback)
        const { data: entities, error: entityError } = await supabase
            .from("entities")
            .select("id, name")
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
        let { data: wallet, error: walletError } = await supabase
            .from("wallets")
            .select("*")
            .eq("entity_id", entityId)
            .maybeSingle();

        // Auto-seed a wallet with demo money if none exists yet
        if (!wallet) {
            const { data: seededWallet, error: seedError } = await supabase
                .from("wallets")
                .insert({
                    entity_id: entityId,
                    fiat_balance: 100000.00
                })
                .select()
                .single();

            if (seedError) {
                console.error("Auto-seeding wallet failed:", seedError.message);
            } else {
                wallet = seededWallet;
            }
        }

        const fiatBalance = wallet ? Number(wallet.fiat_balance) : 100000.00;

        // Aggregate assets from certificates table (currently owned by this entity)
        const { data: certs, error: certError } = await supabase
            .from("certificates")
            .select("project_type, carbon_reduced")
            .eq("current_owner_id", entityId)
            .eq("status", "ISSUED");

        let totalCarbon = 0;
        let totalIRec = 0;

        if (certs) {
            certs.forEach((cert: any) => {
                if (cert.project_type === "I-REC" || cert.project_type === "I_REC") {
                    totalIRec += Number(cert.carbon_reduced);
                } else {
                    totalCarbon += Number(cert.carbon_reduced);
                }
            });
        }

        return NextResponse.json({
            wallet_id: wallet?.id || "demo-wallet",
            fiat_balance: fiatBalance,
            carbon_credits: totalCarbon,
            i_recs: totalIRec,
            entity_name: entities[0].name
        });

    } catch (error) {
        console.error("Wallet Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

