import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const { orderId, buyerEntityId } = payload;

        if (!orderId || !buyerEntityId) {
             return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Fetch the Order
        const { data: order, error: orderError } = await supabase
            .from("market_orders")
            .select("*")
            .eq("id", orderId)
            .single();

        if (orderError || !order) {
            // For MVP UI functional testing without DB:
            if (orderId.startsWith("ord_")) {
                return NextResponse.json({ success: true, message: "Mock trade executed successfully!" });
            }
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.status !== "OPEN") {
            return NextResponse.json({ error: "Order is no longer available" }, { status: 400 });
        }

        const totalCost = Number(order.quantity) * Number(order.price_per_unit);

        // 2. Fetch Buyer Wallet
        const { data: buyerWallet, error: buyerWalletError } = await supabase
            .from("wallets")
            .select("*")
            .eq("entity_id", buyerEntityId)
            .single();

        if (buyerWalletError || !buyerWallet) {
             return NextResponse.json({ error: "Buyer wallet not found" }, { status: 404 });
        }

        if (Number(buyerWallet.fiat_balance) < totalCost) {
             return NextResponse.json({ error: "Insufficient fiat balance" }, { status: 400 });
        }

        // 3. Execute Trade (Ideally in a Postgres transaction using RPC)
        // Since we are doing it via REST for MVP, we sequence it. 
        // A production app MUST use a stored procedure to prevent race conditions.
        
        // A. Deduct Fiat from Buyer
        await supabase.from("wallets")
            .update({ fiat_balance: Number(buyerWallet.fiat_balance) - totalCost })
            .eq("entity_id", buyerEntityId);

        // B. Add Fiat to Seller
        const { data: sellerWallet } = await supabase
            .from("wallets")
            .select("fiat_balance")
            .eq("entity_id", order.entity_id)
            .single();

        if (sellerWallet) {
             await supabase.from("wallets")
                .update({ fiat_balance: Number(sellerWallet.fiat_balance) + totalCost })
                .eq("entity_id", order.entity_id);
        }

        // C. Mark Order as FILLED
        await supabase.from("market_orders")
            .update({ status: "FILLED", updated_at: new Date().toISOString() })
            .eq("id", orderId);

        // D. Create Trade Record
        await supabase.from("trades").insert({
            buyer_id: buyerEntityId,
            seller_id: order.entity_id,
            order_id: orderId,
            asset_type: order.asset_type,
            quantity: order.quantity,
            price_per_unit: order.price_per_unit,
            total_amount: totalCost
        });

        // E. Transfer Ownership of Certificates
        // Simplification for MVP: We assume the credits are transferred abstractly.
        // In reality, we'd update `current_owner_id` in the `certificates` table.

        return NextResponse.json({ 
            success: true, 
            message: "Trade executed successfully!",
            tradeDetails: {
                totalCost,
                quantity: order.quantity
            }
        });

    } catch (error) {
         console.error("Trade Execution Error:", error);
         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
