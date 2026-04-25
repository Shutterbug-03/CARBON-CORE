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

    // 1. Run Calculations
    const mrvResult = mrvEngine.calculate(input);

    // 2. Generate 3-page PDF
    const pdfBuffer = await generateGICPdf(input, mrvResult);

    // 3. Save to Supabase using admin client (bypasses RLS)
    let pdfUrl: string | null = null;
    let dbError: string | null = null;

    try {
      const supabase = createAdminClient();

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

      // Insert certificate record — use a placeholder entity_id for MVP
      // (no user auth required for demo mode)
      const { error: insertErr } = await supabase.from("certificates").upsert({
        certificate_id: mrvResult.gicId,
        entity_id: null, // MVP: no auth — entity linked post-onboarding
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
