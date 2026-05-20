import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get("entityId");

    const supabase = createAdminClient();

    let query = supabase.from("data_sources").select(`
      id,
      asset_id,
      type,
      source_id,
      created_at,
      assets!inner (
        id,
        entity_id,
        type,
        description
      )
    `);

    if (entityId) {
      query = query.eq("assets.entity_id", entityId);
    }

    const { data: sources, error } = await query;

    if (error) {
      console.error("Error fetching data sources:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // For each source, query aggregate info from data_points
    const enrichedSources = await Promise.all(
      (sources || []).map(async (source: any) => {
        // Count total data points
        const { count, error: countError } = await supabase
          .from("data_points")
          .select("id", { count: "exact", head: true })
          .eq("data_source_id", source.id);

        // Fetch latest data point
        const { data: latestData, error: latestError } = await supabase
          .from("data_points")
          .select("timestamp, value, unit")
          .eq("data_source_id", source.id)
          .order("timestamp", { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          id: source.id,
          sourceId: source.source_id,
          type: source.type,
          assetId: source.asset_id,
          assetName: source.assets?.description || "Compliance Asset",
          assetType: source.assets?.type || "General",
          createdAt: source.created_at,
          totalDataPoints: count || 0,
          lastActive: latestData ? latestData.timestamp : null,
          lastValue: latestData ? latestData.value : null,
          unit: latestData ? latestData.unit : null,
        };
      })
    );

    return NextResponse.json(enrichedSources);

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Sources list endpoint error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
