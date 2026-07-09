import type { BecknContext } from "./core";
import { createSignedAck } from "./core";
import { appendBecknTransaction } from "@/lib/pilot/store";
import { createId } from "@/lib/pilot/utils";

const PILOT_SECRET = process.env.BECKN_SHARED_SECRET || "pilot-secret";

export async function dispatchBecknCallback({
  action,
  context,
  callbackUrl,
  message,
}: {
  action: string;
  context: BecknContext;
  callbackUrl?: string;
  message: Record<string, unknown>;
}): Promise<void> {
  const callbackContext = {
    ...context,
    action,
    message_id: createId("msg"),
    timestamp: new Date().toISOString(),
  };

  const signed = createSignedAck({
    context: callbackContext,
    payload: { message },
    sharedSecret: PILOT_SECRET,
  });

  appendBecknTransaction({
    id: createId("beckn"),
    action,
    direction: "outbound",
    createdAt: callbackContext.timestamp,
    context: callbackContext,
    payload: signed.body,
    status: callbackUrl ? "DISPATCHED" : "ACK",
  });

  if (!callbackUrl) {
    return;
  }

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(callbackUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...signed.headers,
        },
        body: JSON.stringify(signed.body),
      });

      if (response.ok) {
        return;
      }
    } catch {
      // Retry with a small backoff in the next loop iteration.
    }

    await new Promise((resolve) => setTimeout(resolve, attempt * 200));
  }
}

export function getPilotSharedSecret(): string {
  return PILOT_SECRET;
}
