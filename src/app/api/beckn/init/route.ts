import { NextRequest, NextResponse } from "next/server";

import { createSignedAck } from "@/lib/beckn/core";
import { dispatchBecknCallback, getPilotSharedSecret } from "@/lib/beckn/transport";
import { appendBecknTransaction } from "@/lib/pilot/store";
import { createId } from "@/lib/pilot/utils";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const context = payload.context ?? {};
  const orderId = createId("verify-order", context.transaction_id);

  appendBecknTransaction({
    id: createId("beckn"),
    action: "init",
    direction: "inbound",
    createdAt: new Date().toISOString(),
    context,
    payload,
    status: "ACK",
  });

  const order = {
    id: orderId,
    status: "INITIATED",
    provider: {
      id: "greenpe-provider",
    },
    items: [
      {
        id: "rooftop-solar-verification",
      },
    ],
  };

  await dispatchBecknCallback({
    action: "on_init",
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
