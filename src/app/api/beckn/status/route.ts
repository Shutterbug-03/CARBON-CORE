import { NextRequest, NextResponse } from "next/server";

import { createSignedAck } from "@/lib/beckn/core";
import { dispatchBecknCallback, getPilotSharedSecret } from "@/lib/beckn/transport";
import { getVerificationResponse, appendBecknTransaction } from "@/lib/pilot/store";
import { createId } from "@/lib/pilot/utils";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const context = payload.context ?? {};
  const orderId = payload.message?.order_id;

  appendBecknTransaction({
    id: createId("beckn"),
    action: "status",
    direction: "inbound",
    createdAt: new Date().toISOString(),
    context,
    payload,
    status: "ACK",
  });

  const verification = orderId ? await getVerificationResponse(orderId) : { valid: false };
  const order = verification.valid && verification.certificate && verification.verificationJob
    ? {
        id: verification.verificationJob.id,
        status: verification.verificationJob.status,
        documents: [
          {
            id: verification.certificate.id,
            descriptor: { name: "Green Impact Certificate" },
            url: verification.certificate.verification.publicVerificationUrl,
          },
        ],
      }
    : {
        id: orderId,
        status: "NOT_FOUND",
      };

  await dispatchBecknCallback({
    action: "on_status",
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
