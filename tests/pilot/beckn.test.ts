import test from "node:test";
import assert from "node:assert/strict";

import { buildBecknContext, createSignedAck, signPayload, verifyPayloadSignature } from "@/lib/beckn/core";

const context = buildBecknContext({
  action: "search",
  bapId: "buyer.app",
  bapUri: "https://buyer.app/callback",
  bppId: "pilot.greenpe.in",
  bppUri: "https://pilot.greenpe.in/api/beckn",
  transactionId: "txn-001",
  messageId: "msg-001",
  domain: "nic2004:403",
  city: "std:080",
  country: "IND",
});

test("buildBecknContext sets the India pilot defaults", () => {
  assert.equal(context.core_version, "1.1.0");
  assert.equal(context.domain, "nic2004:403");
  assert.equal(context.country, "IND");
});

test("pilot Beckn payload signatures round-trip with a shared secret", () => {
  const payload = { context, message: { intent: { item: { descriptor: { name: "Rooftop Solar Verification" } } } } };
  const signature = signPayload(payload, "pilot-secret");

  assert.equal(verifyPayloadSignature(payload, signature, "pilot-secret"), true);
  assert.equal(verifyPayloadSignature(payload, signature, "wrong-secret"), false);
});

test("createSignedAck returns a Beckn ACK envelope with signature metadata", () => {
  const ack = createSignedAck({
    context,
    payload: { message: { ack: { status: "ACK" } } },
    sharedSecret: "pilot-secret",
  });

  const body = ack.body as Record<string, unknown>;
  const message = body.message as { ack: { status: string } };
  assert.equal(message.ack.status, "ACK");
  assert.ok(ack.headers["x-greenpe-signature"]);
});
