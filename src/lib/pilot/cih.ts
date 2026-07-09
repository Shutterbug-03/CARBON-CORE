import { cihBindingInputSchema, type CIHBindingInput, type CIHBindingRecord } from "./types";
import { createId, sha256 } from "./utils";

export function createCIHBinding(input: CIHBindingInput): CIHBindingRecord {
  const parsed = cihBindingInputSchema.parse(input);
  const canonical = {
    entityName: parsed.entityName.trim().toUpperCase(),
    entityType: parsed.entityType.trim().toUpperCase(),
    registrationId: parsed.registrationId.trim().toUpperCase(),
    assetId: parsed.assetId.trim().toUpperCase(),
    assetType: parsed.assetType.trim().toUpperCase(),
    deviceId: parsed.deviceId.trim().toUpperCase(),
    deviceFingerprint: parsed.deviceFingerprint.trim(),
    location: parsed.location,
    timestamp: parsed.timestamp,
  };
  const hash = sha256(canonical);

  return {
    cihId: createId("cih", hash),
    hash,
    createdAt: parsed.timestamp,
    entityName: parsed.entityName,
    entityType: parsed.entityType,
    registrationId: parsed.registrationId,
    assetId: parsed.assetId,
    assetType: parsed.assetType,
    deviceId: parsed.deviceId,
    deviceFingerprint: parsed.deviceFingerprint,
    location: parsed.location,
  };
}
