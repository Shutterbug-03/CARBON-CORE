import type { CDIFInputData, GICDocument, MRVRunResult } from "./types";
import { createId, sha256 } from "./utils";

export function createGICDocument({
  input,
  mrvRun,
  verificationId,
  issuedAt,
  publicBaseUrl,
}: {
  input: CDIFInputData;
  mrvRun: MRVRunResult;
  verificationId: string;
  issuedAt?: string;
  publicBaseUrl: string;
}): GICDocument {
  const createdAt = issuedAt ?? new Date().toISOString();
  const seed = {
    projectId: input.projectIdentity.projectId,
    mrvRunId: mrvRun.id,
    verificationId,
    createdAt,
  };
  const hash = sha256(seed);
  const id = createId("gic", hash);

  return {
    id,
    status: mrvRun.flags.length > 0 ? "FLAGGED" : "ISSUED",
    hash,
    createdAt,
    entity: {
      companyName: input.projectIdentity.companyName,
      gstin: input.projectIdentity.gstin,
      projectName: input.projectIdentity.projectName,
      cihReference: input.projectIdentity.cihReference,
    },
    asset: {
      assetType: input.physicalAsset.assetType,
      installedCapacity: input.physicalAsset.installedCapacity,
      deviceId: input.physicalAsset.iotDeviceId,
    },
    methodology: {
      id: mrvRun.methodology.id,
      version: mrvRun.methodology.version,
      authority: mrvRun.methodology.authority,
      title: mrvRun.methodology.title,
    },
    impact: {
      amount: mrvRun.step7NetVerifiedReduction,
      unit: "tCO2e",
      type: mrvRun.methodology.impactType, // AVOIDED or REMOVED — from methodology
    },
    verification: {
      verificationId,
      confidenceScore: mrvRun.overallConfidenceScore,
      publicVerificationUrl: `${publicBaseUrl.replace(/\/$/, "")}/verify/${id}`,
      mrvRunId: mrvRun.id,
    },
  };
}
