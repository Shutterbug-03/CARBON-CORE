import { NextRequest, NextResponse } from "next/server";

import { generatePilotPdf } from "@/lib/pilot/pdf";
import { executePilotVerification, getPublicBaseUrl } from "@/lib/pilot/service";
import { persistVerificationBundle } from "@/lib/pilot/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const job = executePilotVerification({
      input: body.input ?? body,
      becknTransactionId: body.becknTransactionId,
      publicBaseUrl: getPublicBaseUrl(),
    });

    if (!job.gic || !job.mrvRun) {
      return NextResponse.json({ error: "Verification pipeline did not produce a GIC" }, { status: 500 });
    }

    const pdfBuffer = await generatePilotPdf({
      input: job.input,
      mrvRun: job.mrvRun,
      gic: job.gic,
    });
    const pdfDataUri = `data:application/pdf;base64,${pdfBuffer.toString("base64")}`;

    const persisted = await persistVerificationBundle({
      job,
      pdfDataUri,
    });

    return NextResponse.json({
      success: true,
      verificationJob: persisted.job,
      certificate: persisted.job.gic,
      pdfUrl: persisted.pdfUrl ?? null,
      pdf: persisted.pdfDataUri,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verification failed" },
      { status: 400 },
    );
  }
}
