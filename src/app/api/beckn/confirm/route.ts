import { NextRequest, NextResponse } from "next/server";

import { createSignedAck } from "@/lib/beckn/core";
import { dispatchBecknCallback, getPilotSharedSecret } from "@/lib/beckn/transport";
import { generatePilotPdf } from "@/lib/pilot/pdf";
import { executePilotVerification, getPublicBaseUrl } from "@/lib/pilot/service";
import { appendBecknTransaction, persistVerificationBundle } from "@/lib/pilot/store";
import { rooftopSolarSample } from "@/lib/pilot/sample";
import { createId } from "@/lib/pilot/utils";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const context = payload.context ?? {};
  const input = payload.message?.order?.xinput ?? rooftopSolarSample;
  const jobId = payload.message?.order?.id ?? createId("verify-order");

  appendBecknTransaction({
    id: createId("beckn"),
    action: "confirm",
    direction: "inbound",
    createdAt: new Date().toISOString(),
    context,
    payload,
    status: "ACK",
  });

  const job = executePilotVerification({
    input,
    becknTransactionId: context.transaction_id,
    publicBaseUrl: getPublicBaseUrl(),
    jobId,
  });

  if (!job.gic || !job.mrvRun) {
    return NextResponse.json({ error: "Unable to issue GIC" }, { status: 400 });
  }

  const pdfBuffer = await generatePilotPdf({
    input: job.input,
    mrvRun: job.mrvRun,
    gic: job.gic,
  });
  const persisted = await persistVerificationBundle({
    job,
    pdfDataUri: `data:application/pdf;base64,${pdfBuffer.toString("base64")}`,
  });
  const gic = persisted.job.gic;

  if (!gic) {
    return NextResponse.json({ error: "Issued verification job is missing its GIC artifact" }, { status: 500 });
  }

  const order = {
    id: persisted.job.id,
    status: persisted.job.status,
    provider: {
      id: "greenpe-provider",
    },
    documents: [
      {
        id: gic.id,
        descriptor: {
          name: "Green Impact Certificate",
        },
        url: gic.verification.publicVerificationUrl,
      },
    ],
  };

  await dispatchBecknCallback({
    action: "on_confirm",
    context,
    callbackUrl: context.bap_uri,
    message: { order },
  });

  return NextResponse.json(
    createSignedAck({
      context,
      payload: { message: { order } },
      sharedSecret: getPilotSharedSecret(),
    }).body,
  );
}
