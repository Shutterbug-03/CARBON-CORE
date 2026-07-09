import crypto from "node:crypto";

import { stableStringify } from "@/lib/pilot/utils";

export interface BecknContext {
  domain: string;
  action: string;
  version: string;
  bap_id: string;
  bap_uri: string;
  bpp_id: string;
  bpp_uri: string;
  transaction_id: string;
  message_id: string;
  city: string;
  country: string;
  core_version: string;
  timestamp: string;
}

export function buildBecknContext(input: {
  action: string;
  bapId: string;
  bapUri: string;
  bppId: string;
  bppUri: string;
  transactionId: string;
  messageId: string;
  domain?: string;
  city?: string;
  country?: string;
  version?: string;
  timestamp?: string;
}): BecknContext {
  return {
    domain: input.domain ?? "nic2004:403",
    action: input.action,
    version: input.version ?? "1.1.0",
    bap_id: input.bapId,
    bap_uri: input.bapUri,
    bpp_id: input.bppId,
    bpp_uri: input.bppUri,
    transaction_id: input.transactionId,
    message_id: input.messageId,
    city: input.city ?? "std:080",
    country: input.country ?? "IND",
    core_version: "1.1.0",
    timestamp: input.timestamp ?? new Date().toISOString(),
  };
}

export function signPayload(payload: unknown, sharedSecret: string): string {
  return crypto
    .createHmac("sha256", sharedSecret)
    .update(stableStringify(payload))
    .digest("hex");
}

export function verifyPayloadSignature(
  payload: unknown,
  signature: string,
  sharedSecret: string,
): boolean {
  const expected = signPayload(payload, sharedSecret);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function createSignedAck({
  context,
  payload,
  sharedSecret,
}: {
  context: BecknContext;
  payload: Record<string, unknown>;
  sharedSecret: string;
}) {
  const body = {
    context,
    ...payload,
  };

  return {
    body,
    headers: {
      "x-greenpe-signature": signPayload(body, sharedSecret),
      "x-greenpe-subscriber-id": context.bpp_id,
    },
  };
}
