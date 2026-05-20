import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { assetId, deviceId, timestamp, value, unit, trustScore, raw } = payload;

    // Validate parameters
    if (!assetId || !deviceId || !timestamp || value === undefined || !unit) {
      return NextResponse.json(
        { error: "Missing required fields. Required: assetId, deviceId, timestamp, value, unit" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Resolve Data Source
    let { data: dataSource, error: searchError } = await supabase
      .from("data_sources")
      .select("id")
      .eq("asset_id", assetId)
      .eq("source_id", deviceId)
      .maybeSingle();

    if (searchError) {
      console.error("Error checking data sources:", searchError.message);
      return NextResponse.json({ error: searchError.message }, { status: 500 });
    }

    if (!dataSource) {
      // Create a default source for this asset
      const { data: newSource, error: createError } = await supabase
        .from("data_sources")
        .insert({
          asset_id: assetId,
          type: "IOT_SENSOR",
          source_id: deviceId
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating new data source:", createError.message);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      dataSource = newSource;
    }

    if (!dataSource) {
      return NextResponse.json({ error: "Could not resolve or create data source" }, { status: 500 });
    }

    // 2. Insert Data Point
    const { data: dataPoint, error: insertError } = await supabase
      .from("data_points")
      .insert({
        data_source_id: dataSource.id,
        timestamp: new Date(timestamp).toISOString(),
        value: Number(value),
        unit: unit,
        trust_score: trustScore || "HIGH",
        raw: raw || payload
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting data point:", insertError.message);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      dataPointId: dataPoint.id,
      dataSourceId: dataSource.id
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("IoT ingestion processing error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
