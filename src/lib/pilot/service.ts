import { createCIHBinding } from "./cih";
import { normalizeCDIFInput, extractGpsPoint } from "./cdif";
import { createGICDocument } from "./gic";
import { getMethodologyForAsset } from "./methodologies";
import { runDeterministicMRV } from "./mrv";
import type { CDIFInputData, VerificationJob } from "./types";
import { createId } from "./utils";

export function executePilotVerification({
  input,
  becknTransactionId,
  publicBaseUrl,
  jobId,
}: {
  input: unknown;
  becknTransactionId?: string;
  publicBaseUrl: string;
  jobId?: string;
}): VerificationJob {
  const normalized = normalizeCDIFInput(input);
  const createdAt = new Date().toISOString();

  // Auto-detect methodology from asset type (no more hardcoded "IN-ROOFTOP-SOLAR-V1")
  const methodology = getMethodologyForAsset(normalized.physicalAsset.assetType);

  const cihBinding = createCIHBinding({
    entityName: normalized.projectIdentity.companyName,
    entityType: normalized.projectIdentity.industry || "MSME",
    registrationId: normalized.projectIdentity.gstin,
    assetId: normalized.projectIdentity.projectId,
    assetType: normalized.physicalAsset.assetType,
    deviceId: normalized.physicalAsset.iotDeviceId,
    deviceFingerprint: normalized.physicalAsset.deviceFingerprint,
    location: extractGpsPoint(normalized),
    timestamp: createdAt,
  });
  normalized.projectIdentity.cihReference = cihBinding.cihId;

  const mrvRun = runDeterministicMRV(normalized, methodology);
  const verificationId = jobId ?? createId("verify");
  const gic = createGICDocument({
    input: normalized,
    mrvRun,
    verificationId,
    publicBaseUrl,
  });

  return {
    id: verificationId,
    status: gic.status === "ISSUED" ? "ISSUED" : "FAILED",
    createdAt,
    updatedAt: new Date().toISOString(),
    becknTransactionId,
    cihBinding,
    input: normalized,
    mrvRun,
    gic,
    auditTrail: [
      {
        id: createId("audit"),
        type: "CIH_BOUND",
        createdAt,
        detail: `Bound identity ${cihBinding.cihId} to ${normalized.physicalAsset.iotDeviceId}`,
      },
      {
        id: createId("audit"),
        type: "METHODOLOGY_SELECTED",
        createdAt,
        detail: `Auto-selected ${methodology.id} for asset type ${normalized.physicalAsset.assetType}`,
      },
      {
        id: createId("audit"),
        type: "MRV_COMPLETED",
        createdAt,
        detail: `Computed ${mrvRun.step7NetVerifiedReduction} tCO2e via ${methodology.assetType} methodology (confidence: ${mrvRun.overallConfidenceScore}%)`,
      },
      {
        id: createId("audit"),
        type: "GIC_ISSUED",
        createdAt,
        detail: `Issued ${gic.id} — impact type: ${gic.impact.type}`,
      },
    ],
  };
}

export function getPublicBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export type { CDIFInputData };
