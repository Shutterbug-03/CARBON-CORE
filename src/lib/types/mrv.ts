export interface CDIFInputData {
  projectIdentity: {
    projectName: string;
    projectId: string;
    cihReference: string;
    companyName: string;
    gstin: string;
    udyam: string;
    pan: string;
    location: string;
    gps: string;
    industry: string;
    contact: string;
  };
  physicalAsset: {
    assetType: string;
    installedCapacity: string;
    panelConfiguration: string;
    inverter: string;
    commissioningDate: string;
    installer: string;
    rooftopArea: string;
    iotDeviceId: string;
    deviceFingerprint: string;
  };
  monitoringPeriod: {
    periodStart: string;
    periodEnd: string;
    durationDays: number;
    reportingQuarter: string;
    reportingFrequency: string;
    totalReadingsExpected: number;
    verifiedReadings: number;
  };
  metrics: {
    totalSolarGenKWh: number;
    totalDieselLitres: number;
    fabricProducedTonnes: number;
  };
}

export interface MRVCalculationResult {
  // Config
  methodologyId: string;
  methodologyTitle: string;
  methodologyVersion: string;
  standardBody: string;
  gridEf: number;
  gridEfSource: string;
  dieselEf: number;
  dataCompletenessScore: number;
  conservativeAdjFactor: number;
  tdLossFactor: number;
  additionalityTest: string;

  // Traces
  step1SolarEnergyGeneratedKWh: number;
  step2DataCompletenessAdjKWh: number;
  step3BaselineEmissionsRawKg: number;
  step4ConvertToTonnes: number;
  step5ApplyCAF: number;
  step6Scope1DieselTco2e: number;
  step7NetVerifiedReduction: number;
  cbamEmissionIntensity: number;

  // Scores
  confidenceIdentity: number;
  confidenceDataCompleteness: number;
  confidenceCrossValidation: number;
  confidenceMethodology: number;
  confidenceAnomaly: number;
  confidenceConservativeness: number;
  overallConfidenceScore: number;

  // Hashes
  gicId: string;
  gicHash: string;
  calculationLogHash: string;
  issueDate: string;
  publicVerificationUrl: string;
}

export interface WebhookPayload {
  input: CDIFInputData;
  result?: MRVCalculationResult;
}
