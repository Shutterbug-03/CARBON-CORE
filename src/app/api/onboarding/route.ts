import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { role, name, registrationId, region, assetType, assetDesc } = await request.json();

    if (!name || !role) {
      return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Insert Entity (no user_id — MVP mode)
    const { data: entityData, error: entityError } = await supabase
      .from("entities")
      .insert({
        user_id: null,
        type: role.toUpperCase(),
        name,
        registration_id: registrationId || null,
        location: { region: region || "India" },
      })
      .select()
      .single();

    if (entityError) {
      console.error("Entity insert error:", entityError);
      return NextResponse.json({ error: entityError.message }, { status: 500 });
    }

    // 2. Insert Asset
    const { data: assetData, error: assetError } = await supabase
      .from("assets")
      .insert({
        entity_id: entityData.id,
        type: (assetType || "FACILITY").toUpperCase(),
        description: assetDesc || "Default asset",
        metadata: {},
      })
      .select()
      .single();

    if (assetError) {
      console.error("Asset insert error:", assetError);
      return NextResponse.json({ error: assetError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      entity: { id: entityData.id },
      asset: { id: assetData.id },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Onboarding error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
