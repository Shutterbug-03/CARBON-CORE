import test from "node:test";
import assert from "node:assert/strict";

import { normalizeCDIFInput } from "@/lib/pilot/cdif";
import { getMethodologyDefinition } from "@/lib/pilot/methodologies";
import { runDeterministicMRV } from "@/lib/pilot/mrv";
import { createGICDocument } from "@/lib/pilot/gic";

const rawInput = {
  projectIdentity: {
    projectName: "Surya Textiles Rooftop Solar",
    projectId: "SURYA-GJ-001",
    cihReference: "pending-cih",
    companyName: "Surya Textiles Pvt Ltd",
    gstin: "24ABCDE1234F1Z5",
    udyam: "UDYAM-GJ-01-0001234",
    pan: "ABCDE1234F",
    location: "Rajkot, Gujarat, India",
    gps: "22.3039,70.8022",
    industry: "Textiles",
    contact: "ops@suryatextiles.example",
  },
  physicalAsset: {
    assetType: "ROOFTOP_SOLAR",
    installedCapacity: "500 kWp",
    panelConfiguration: "Mono PERC",
    inverter: "Sungrow SG110CX",
    commissioningDate: "2025-06-01",
    installer: "GreenPe EPC",
    rooftopArea: "4000 sq ft",
    iotDeviceId: "INV-GJ-0001",
    deviceFingerprint: "fingerprint-001",
  },
  monitoringPeriod: {
    periodStart: "2026-01-01",
    periodEnd: "2026-03-31",
    durationDays: 90,
    reportingQuarter: "Q1",
    reportingFrequency: "DAILY",
    totalReadingsExpected: 90,
    verifiedReadings: 88,
  },
  metrics: {
    totalSolarGenKWh: 17540,
    totalDieselLitres: 1525,
    fabricProducedTonnes: 412.5,
  },
};

test("runDeterministicMRV returns the expected rooftop solar result", () => {
  const normalized = normalizeCDIFInput(rawInput);
  const methodology = getMethodologyDefinition("IN-ROOFTOP-SOLAR-V1");

  const result = runDeterministicMRV(normalized, methodology);

  assert.equal(result.methodology.id, "IN-ROOFTOP-SOLAR-V1");
  assert.equal(result.step7NetVerifiedReduction, 10.4558);
  assert.equal(result.overallConfidenceScore, 98);
  assert.equal(result.flags.length, 0);
});

test("createGICDocument produces a stable verifiable payload for an MRV run", () => {
  const normalized = normalizeCDIFInput(rawInput);
  const methodology = getMethodologyDefinition("IN-ROOFTOP-SOLAR-V1");
  const result = runDeterministicMRV(normalized, methodology);

  const gic = createGICDocument({
    input: normalized,
    mrvRun: result,
    verificationId: "verify-job-001",
    issuedAt: "2026-04-05T00:00:00.000Z",
    publicBaseUrl: "https://pilot.greenpe.in",
  });

  assert.equal(gic.status, "ISSUED");
  assert.equal(gic.impact.amount, 10.4558);
  assert.equal(gic.verification.verificationId, "verify-job-001");
  assert.match(gic.hash, /^[a-f0-9]{64}$/);
  assert.equal(
    gic.verification.publicVerificationUrl,
    `https://pilot.greenpe.in/verify/${gic.id}`,
  );
});
