import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mrvEngine } from "@/lib/engines/mrv-engine";
import { generateGICPdf } from "@/lib/pdf/gic-generator";
import type { CDIFInputData } from "@/lib/types/mrv";

export async function POST(request: NextRequest) {
  try {
    const input: CDIFInputData = await request.json();

    // Basic validation
    if (!input?.projectIdentity || !input?.metrics) {
      return NextResponse.json(
        { error: "Invalid CDIF format. Required: projectIdentity, physicalAsset, monitoringPeriod, metrics" },
        { status: 400 }
      );
    }

    // 1. Run Calculations & Dynamic Telemetry Aggregation
    const iotDeviceId = input.physicalAsset?.iotDeviceId;
    const periodStart = input.monitoringPeriod?.periodStart;
    const periodEnd = input.monitoringPeriod?.periodEnd;

    let dbSolarGen = 0;
    let dbDieselLitres = 0;
    let dbVerifiedReadings = 0;
    let hasDbData = false;

    if (iotDeviceId && periodStart && periodEnd) {
      try {
        const supabase = createAdminClient();
        
        // Fetch the data source for this device
        const { data: dataSource } = await supabase
          .from("data_sources")
          .select("id")
          .eq("source_id", iotDeviceId)
          .maybeSingle();
          
        if (dataSource) {
          // Fetch data points in the monitoring period
          const { data: points } = await supabase
            .from("data_points")
            .select("value, unit")
            .eq("data_source_id", dataSource.id)
            .gte("timestamp", new Date(periodStart).toISOString())
            .lte("timestamp", new Date(periodEnd).toISOString());
            
          if (points && points.length > 0) {
            hasDbData = true;
            dbVerifiedReadings = points.length;
            
            // Sum values by unit
            points.forEach((pt: any) => {
              const val = Number(pt.value);
              const u = pt.unit?.toLowerCase();
              if (u === "kwh") {
                dbSolarGen += val;
              } else if (u === "litres" || u === "liter" || u === "liters" || u === "l") {
                dbDieselLitres += val;
              }
            });
          }
        }
      } catch (err) {
        console.warn("Error querying database for live MRV telemetry:", err);
      }
    }

    if (hasDbData) {
      input.metrics.totalSolarGenKWh = dbSolarGen;
      input.metrics.totalDieselLitres = dbDieselLitres;
      input.monitoringPeriod.verifiedReadings = dbVerifiedReadings;
      console.log(`Aggregated database telemetry: Solar KWh = ${dbSolarGen}, Diesel Litres = ${dbDieselLitres}, Verified Readings = ${dbVerifiedReadings}`);
    } else {
      console.log("No telemetry data points found in database for asset in period; falling back to POST body values.");
    }

    const mrvResult = mrvEngine.calculate(input);

    // 2. Generate 3-page PDF
    const pdfBuffer = await generateGICPdf(input, mrvResult);

    // 3. Save to Supabase using admin client (bypasses RLS)
    let pdfUrl: string | null = null;
    let dbError: string | null = null;

    try {
      const supabase = createAdminClient();

      // Look up entity_id dynamically from GSTIN or companyName
      let matchedEntityId: string | null = null;
      if (input.projectIdentity?.gstin) {
        const { data: entity } = await supabase
          .from("entities")
          .select("id")
          .eq("gstin", input.projectIdentity.gstin)
          .maybeSingle();
        if (entity) {
          matchedEntityId = entity.id;
        }
      }

      if (!matchedEntityId && input.projectIdentity?.companyName) {
        const { data: entity } = await supabase
          .from("entities")
          .select("id")
          .eq("name", input.projectIdentity.companyName)
          .maybeSingle();
        if (entity) {
          matchedEntityId = entity.id;
        }
      }

      // If still null, try finding any entity in the system for testing fallback
      if (!matchedEntityId) {
        const { data: firstEntity } = await supabase
          .from("entities")
          .select("id")
          .limit(1);
        if (firstEntity && firstEntity.length > 0) {
          matchedEntityId = firstEntity[0].id;
        }
      }

      // Upload PDF to storage
      const { data: storageData, error: storageErr } = await supabase.storage
        .from("certificates")
        .upload(`gic/${mrvResult.gicId}.pdf`, pdfBuffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (storageErr) {
        console.warn("Storage upload failed:", storageErr.message);
      } else {
        const { data: urlData } = supabase.storage
          .from("certificates")
          .getPublicUrl(storageData.path);
        pdfUrl = urlData.publicUrl;
      }

      // Insert certificate record with dynamically mapped entity_id and current_owner_id
      const { error: insertErr } = await supabase.from("certificates").upsert({
        certificate_id: mrvResult.gicId,
        entity_id: matchedEntityId, 
        current_owner_id: matchedEntityId,
        project_name: input.projectIdentity.projectName,
        project_type: input.physicalAsset.assetType,
        location: input.projectIdentity.location,
        carbon_reduced: mrvResult.step7NetVerifiedReduction,
        vintage: new Date().getFullYear().toString(),
        issued_date: new Date().toISOString(),
        verifier: "GreenPe Digital MRV Engine v1.0",
        status: "ISSUED",
        pdf_url: pdfUrl,
        metadata: { input, mrvResult },
      }, { onConflict: "certificate_id" });

      if (insertErr) {
        console.warn("DB insert failed:", insertErr.message);
        dbError = insertErr.message;
      }
    } catch (e: unknown) {
      console.warn("Supabase unavailable (check .env.local keys):", e instanceof Error ? e.message : e);
      dbError = "Supabase not configured";
    }

    // 4. Return result — always succeed with PDF even if DB fails
    return NextResponse.json({
      success: true,
      certificateId: mrvResult.gicId,
      verificationUrl: mrvResult.publicVerificationUrl,
      pdfUrl: pdfUrl,
      // Inline base64 fallback when storage is unavailable
      pdf: pdfUrl ?? `data:application/pdf;base64,${pdfBuffer.toString("base64")}`,
      metadata: mrvResult,
      dbSaved: !dbError,
      dbError: dbError,
    });
  } catch (err: unknown) {
    console.error("MRV Processing error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
