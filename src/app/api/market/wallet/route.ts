import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
    try {
        const supabase = createAdminClient();

        // Retrieve the first entity in the database to bind to the current session
        // TODO: Replace with proper auth.uid() lookup when auth is wired
        const { data: entities, error: entityError } = await supabase
            .from("entities")
            .select("id, name")
            .limit(1);

        if (entityError || !entities || entities.length === 0) {
            // No entities in DB — return proper 404 instead of fake data
            return NextResponse.json(
                { error: "No entity found. Please complete onboarding first." },
                { status: 404 }
            );
        }

        const entityId = entities[0].id;

        // Fetch wallet
        const { data: wallet } = await supabase
            .from("wallets")
            .select("*")
            .eq("entity_id", entityId)
            .maybeSingle();

        if (!wallet) {
            // No wallet — return proper 404 instead of auto-seeding fake money
            return NextResponse.json(
                {
                    error: "Wallet not found for this entity. Please create a wallet.",
                    entity_id: entityId,
                    entity_name: entities[0].name,
                },
                { status: 404 }
            );
        }

        const fiatBalance = Number(wallet.fiat_balance);

        // Aggregate assets from certificates table (currently owned by this entity)
        const { data: certs } = await supabase
            .from("certificates")
            .select("project_type, carbon_reduced")
            .eq("current_owner_id", entityId)
            .eq("status", "ISSUED");

        let totalCarbon = 0;
        let totalIRec = 0;

        if (certs) {
            certs.forEach((cert: { project_type: string; carbon_reduced: number }) => {
                if (cert.project_type === "I-REC" || cert.project_type === "I_REC") {
                    totalIRec += Number(cert.carbon_reduced);
                } else {
                    totalCarbon += Number(cert.carbon_reduced);
                }
            });
        }

        return NextResponse.json({
            wallet_id: wallet.id,
            fiat_balance: fiatBalance,
            carbon_credits: totalCarbon,
            i_recs: totalIRec,
            entity_name: entities[0].name,
        });
    } catch (error) {
        console.error("Wallet Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
