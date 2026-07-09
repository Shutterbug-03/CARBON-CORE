import { NextRequest, NextResponse } from "next/server";

import { createSignedAck } from "@/lib/beckn/core";
import { dispatchBecknCallback, getPilotSharedSecret } from "@/lib/beckn/transport";
import { appendBecknTransaction } from "@/lib/pilot/store";
import { createId } from "@/lib/pilot/utils";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const context = payload.context ?? {};
  appendBecknTransaction({
    id: createId("beckn"),
    action: "select",
    direction: "inbound",
    createdAt: new Date().toISOString(),
    context,
    payload,
    status: "ACK",
  });

  const order = {
    provider: {
      id: "greenpe-provider",
    },
    items: [
      {
        id: "rooftop-solar-verification",
      },
    ],
    quote: {
      price: {
        currency: "INR",
        value: "0.00",
      },
    },
  };

  await dispatchBecknCallback({
    action: "on_select",
    context,
    callbackUrl: context.bap_uri,
    message: { order },
  });

  const signed = createSignedAck({
    context,
    payload: { message: { order } },
    sharedSecret: getPilotSharedSecret(),
  });

  return NextResponse.json(signed.body);
}
