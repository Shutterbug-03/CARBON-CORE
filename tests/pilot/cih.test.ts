import test from "node:test";
import assert from "node:assert/strict";

import { createCIHBinding } from "@/lib/pilot/cih";

const bindingInput = {
  entityName: "Surya Textiles Pvt Ltd",
  entityType: "MSME",
  registrationId: "27ABCDE1234F1Z5",
  assetId: "asset-rooftop-solar-001",
  assetType: "ROOFTOP_SOLAR",
  deviceId: "INV-GJ-0001",
  deviceFingerprint: "fingerprint-001",
  location: {
    lat: 22.3039,
    lng: 70.8022,
    region: "Rajkot, Gujarat",
  },
  timestamp: "2026-01-15T10:30:00.000Z",
};

test("createCIHBinding is deterministic for the same identity payload", () => {
  const first = createCIHBinding(bindingInput);
  const second = createCIHBinding(bindingInput);

  assert.equal(first.cihId, second.cihId);
  assert.equal(first.hash, second.hash);
});

test("createCIHBinding changes when the bound device changes", () => {
  const first = createCIHBinding(bindingInput);
  const second = createCIHBinding({
    ...bindingInput,
    deviceId: "INV-GJ-0002",
  });

  assert.notEqual(first.cihId, second.cihId);
  assert.notEqual(first.hash, second.hash);
});
