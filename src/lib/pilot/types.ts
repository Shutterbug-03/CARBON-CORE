import { z } from "zod";

// ============================================
// Asset Types — All supported energy/climate sectors
// ============================================

export const ASSET_TYPES = [
  "ROOFTOP_SOLAR",
  "WIND",
  "SMALL_HYDRO",
  "BIOMASS",
  "BIOGAS",
  "THERMAL_EFFICIENCY",
] as const;

export type AssetType = (typeof ASSET_TYPES)[number];

// ============================================
// Impact Types
// ============================================

export type ImpactType = "AVOIDED" | "REMOVED";

// ============================================
// Zod Schemas
// ============================================

export const gpsPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  region: z.string().min(2),
});

export const cdifInputSchema = z.object({
  projectIdentity: z.object({
    projectName: z.string().min(2),
    projectId: z.string().min(2),
    cihReference: z.string().default(""),
    companyName: z.string().min(2),
    gstin: z.string().min(5),
    udyam: z.string().default(""),
    pan: z.string().default(""),
    location: z.string().min(2),
    gps: z.string().min(3),
    industry: z.string().default(""),
    contact: z.string().default(""),
  }),
  physicalAsset: z.object({
    assetType: z.string().min(2),
    installedCapacity: z.string().min(2),
    panelConfiguration: z.string().default(""),
    inverter: z.string().default(""),
    commissioningDate: z.string().min(4),
    installer: z.string().default(""),
    rooftopArea: z.string().default(""),
    iotDeviceId: z.string().min(2),
    deviceFingerprint: z.string().min(2),
  }),
  monitoringPeriod: z.object({
    periodStart: z.string().min(4),
    periodEnd: z.string().min(4),
    durationDays: z.number().positive(),
    reportingQuarter: z.string().min(2),
    reportingFrequency: z.string().min(2),
    totalReadingsExpected: z.number().positive(),
    verifiedReadings: z.number().nonnegative(),
  }),
  metrics: z.object({
    // Electricity generation (Solar, Wind, Hydro, Biomass power)
    totalEnergyGeneratedKWh: z.number().nonnegative().default(0),
    // Legacy solar field — mapped to totalEnergyGeneratedKWh
    totalSolarGenKWh: z.number().nonnegative().default(0),

    // Fossil fuel usage (Scope 1 deduction)
    totalDieselLitres: z.number().nonnegative().default(0),

    // Biomass specific
    biomassConsumedTonnes: z.number().nonnegative().default(0),
    biomassMoisturePercent: z.number().min(0).max(100).default(15),

    // Biogas specific
    biogasProducedM3: z.number().nonnegative().default(0),
    methaneContentPercent: z.number().min(0).max(100).default(60),
    biogasFlaredM3: z.number().nonnegative().default(0),

    // Thermal/Industrial efficiency
    thermalSavingsKWh: z.number().nonnegative().default(0),
    baselineConsumptionKWh: z.number().nonnegative().default(0),

    // Hydro specific
    waterFlowM3PerSec: z.number().nonnegative().default(0),
    headMetres: z.number().nonnegative().default(0),

    // Production output (for CBAM intensity)
    fabricProducedTonnes: z.number().nonnegative().default(0),
    productOutputTonnes: z.number().nonnegative().default(0),
  }),
});

export const cihBindingInputSchema = z.object({
  entityName: z.string().min(2),
  entityType: z.string().min(2),
  registrationId: z.string().min(2),
  assetId: z.string().min(2),
  assetType: z.string().min(2),
  deviceId: z.string().min(2),
  deviceFingerprint: z.string().min(2),
  location: gpsPointSchema,
  timestamp: z.string().datetime(),
});

export type CDIFInputData = z.infer<typeof cdifInputSchema>;
export type CIHBindingInput = z.infer<typeof cihBindingInputSchema>;
export type GPSPoint = z.infer<typeof gpsPointSchema>;

// ============================================
// Methodology Definition — Multi-Sector
// ============================================

export interface MethodologyDefinition {
  id: string;
  version: string;
  authority: string;
  title: string;
  assetType: AssetType;
  sector: string;
  geography: "INDIA";
  impactType: ImpactType;
  formula: string;

  // Common factors
  gridEmissionFactor: number;       // kgCO2/kWh — CEA India
  dieselEmissionFactor: number;     // kgCO2/litre — IPCC AR6
  conservativeAdjustmentFactor: number; // CAF — UNFCCC CDM EB55
  transmissionLossFactor: number;   // T&D loss — CEA India

  // Sector-specific factors
  ch4GWP100yr?: number;             // Methane GWP — IPCC AR6 (27.9)
  methaneOxidationFactor?: number;  // Flare/engine oxidation (0.99)
  biomassEmissionFactor?: number;   // kgCO2/tonne biomass burned
  biomassRenewableFraction?: number; // Fraction considered carbon-neutral
  capacityFactor?: number;          // For hydro/wind availability
  turbineEfficiency?: number;       // For hydro conversion
  thermalBaselineEF?: number;       // kgCO2/kWh for thermal baseline
}

// ============================================
// CIH Binding Record
// ============================================

export interface CIHBindingRecord {
  cihId: string;
  hash: string;
  createdAt: string;
  entityName: string;
  entityType: string;
  registrationId: string;
  assetId: string;
  assetType: string;
  deviceId: string;
  deviceFingerprint: string;
  location: GPSPoint;
}

// ============================================
// MRV Run Result — Generic 7-Step
// ============================================

export interface MRVRunResult {
  id: string;
  methodology: MethodologyDefinition;
  monitoringWindow: {
    periodStart: string;
    periodEnd: string;
    reportingQuarter: string;
  };
  dataCompletenessScore: number;

  // 7-step calculation trace (generic names)
  step1ActivityDataRaw: number;
  step1Unit: string;
  step2DataCompletenessAdjusted: number;
  step3BaselineEmissionsKg: number;
  step4BaselineEmissionsTonnes: number;
  step5ConservativeAdjustedTonnes: number;
  step6Scope1DeductionTonnes: number;
  step7NetVerifiedReduction: number;

  // Legacy solar aliases (for backward compat with existing PDF/UI)
  step1SolarEnergyGeneratedKWh: number;
  step2DataCompletenessAdjustedKWh: number;

  // CBAM
  cbamEmissionIntensity: number;

  // Confidence
  confidenceScores: {
    identity: number;
    dataCompleteness: number;
    methodology: number;
    anomaly: number;
  };
  overallConfidenceScore: number;

  // Flags
  flags: string[];
  createdAt: string;
  inputHash: string;
}

// ============================================
// GIC Document
// ============================================

export interface GICDocument {
  id: string;
  status: "ISSUED" | "FLAGGED";
  hash: string;
  createdAt: string;
  entity: {
    companyName: string;
    gstin: string;
    projectName: string;
    cihReference: string;
  };
  asset: {
    assetType: string;
    installedCapacity: string;
    deviceId: string;
  };
  methodology: {
    id: string;
    version: string;
    authority: string;
    title: string;
  };
  impact: {
    amount: number;
    unit: "tCO2e";
    type: ImpactType;
  };
  verification: {
    verificationId: string;
    confidenceScore: number;
    publicVerificationUrl: string;
    mrvRunId: string;
  };
}

// ============================================
// Verification Job
// ============================================

export interface VerificationJob {
  id: string;
  status: "INITIATED" | "CONFIRMED" | "ISSUED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  cihBinding: CIHBindingRecord;
  input: CDIFInputData;
  mrvRun?: MRVRunResult;
  gic?: GICDocument;
  becknTransactionId?: string;
  auditTrail: AuditEvent[];
}

// ============================================
// Beckn & Audit
// ============================================

export interface BecknTransaction {
  id: string;
  action: string;
  direction: "inbound" | "outbound";
  createdAt: string;
  context: Record<string, unknown>;
  payload: Record<string, unknown>;
  status: "ACK" | "NACK" | "DISPATCHED";
}

export interface AuditEvent {
  id: string;
  type: string;
  createdAt: string;
  detail: string;
  metadata?: Record<string, unknown>;
}

export interface GICVerificationResponse {
  valid: boolean;
  certificate?: GICDocument;
  verificationJob?: VerificationJob;
  pdfUrl?: string | null;
  artifacts?: {
    pdfDataUri?: string;
  };
}
