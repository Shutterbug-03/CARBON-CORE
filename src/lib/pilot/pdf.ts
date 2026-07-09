import type { CDIFInputData as LegacyCDIFInputData, MRVCalculationResult } from "@/lib/types/mrv";
import { generateGICPdf } from "@/lib/pdf/gic-generator";

import type { CDIFInputData, GICDocument, MRVRunResult } from "./types";

function toLegacyMRVResult(gic: GICDocument, mrvRun: MRVRunResult): MRVCalculationResult {
  return {
    methodologyId: mrvRun.methodology.id,
    methodologyTitle: mrvRun.methodology.title,
    methodologyVersion: mrvRun.methodology.version,
    standardBody: mrvRun.methodology.authority,
    gridEf: mrvRun.methodology.gridEmissionFactor,
    gridEfSource: "GreenPe India Pilot Methodology Registry — Western India rooftop solar baseline",
    dieselEf: mrvRun.methodology.dieselEmissionFactor,
    dataCompletenessScore: mrvRun.dataCompletenessScore,
    conservativeAdjFactor: mrvRun.methodology.conservativeAdjustmentFactor,
    tdLossFactor: mrvRun.methodology.transmissionLossFactor,
    additionalityTest: "PASSED — rooftop solar generation displaces India grid electricity",
    step1SolarEnergyGeneratedKWh: mrvRun.step1SolarEnergyGeneratedKWh,
    step2DataCompletenessAdjKWh: mrvRun.step2DataCompletenessAdjustedKWh,
    step3BaselineEmissionsRawKg: mrvRun.step3BaselineEmissionsKg,
    step4ConvertToTonnes: mrvRun.step4BaselineEmissionsTonnes,
    step5ApplyCAF: mrvRun.step5ConservativeAdjustedTonnes,
    step6Scope1DieselTco2e: mrvRun.step6Scope1DeductionTonnes,
    step7NetVerifiedReduction: mrvRun.step7NetVerifiedReduction,
    cbamEmissionIntensity: mrvRun.cbamEmissionIntensity,
    confidenceIdentity: mrvRun.confidenceScores.identity,
    confidenceDataCompleteness: mrvRun.confidenceScores.dataCompleteness,
    confidenceCrossValidation: mrvRun.confidenceScores.anomaly,
    confidenceMethodology: mrvRun.confidenceScores.methodology,
    confidenceAnomaly: mrvRun.confidenceScores.anomaly,
    confidenceConservativeness: 100,
    overallConfidenceScore: mrvRun.overallConfidenceScore,
    gicId: gic.id,
    gicHash: gic.hash,
    calculationLogHash: mrvRun.inputHash,
    issueDate: new Date(gic.createdAt).toISOString().slice(0, 10),
    publicVerificationUrl: gic.verification.publicVerificationUrl,
  };
}

export async function generatePilotPdf({
  input,
  mrvRun,
  gic,
}: {
  input: CDIFInputData;
  mrvRun: MRVRunResult;
  gic: GICDocument;
}): Promise<Buffer> {
  return generateGICPdf(input as LegacyCDIFInputData, toLegacyMRVResult(gic, mrvRun));
}
