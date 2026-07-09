/**
 * Carbon UPI - Core Type Definitions
 * Aligned with: CDIF Schema (Technical Architecture Doc, Layer 2)
 *               CIH Spec (Technical Architecture Doc, Layer 1)
 *               GIC Structure (Patent Specification, Claims [0012])
 *
 * RULES:
 * 1. No guessing — all fields map to a document source
 * 2. All types are deterministic and auditable
 * 3. No AI decisions encoded here — pure data structures
 */

// ============================================
// LAYER 1: Identity & Asset Binding (CIH)
// Ref: Technical Architecture Doc — Layer 1
// Patent Claim [0022]: "computing a unique, irreversible Cryptographic
//   Identity Hash that ties together four critical data points:
//   verified identity, device identity, GPS coordinates, timestamp"
// ============================================

export type EntityType = 'FARMER' | 'MSME' | 'EXPORTER' | 'GOVERNMENT' | 'INDUSTRIAL';

/**
 * Supported identity credential types per Technical Architecture Doc, Layer 1
 */
export type IdentityCredentialType =
  | 'AADHAAR_HASH'   // Individual — Aadhaar Offline XML hash (no PII stored)
  | 'GSTIN'          // Business registration
  | 'PAN'            // Tax registration
  | 'UDYAM'          // MSME registration
  | 'ENTERPRISE_KYC' // Enterprise KYC token

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  registrationId: string;         // Aadhaar hash / GSTIN / PAN / UDYAM — value, never raw PII
  credentialType: IdentityCredentialType;
  location: {
    lat: number;
    lng: number;
    region: string;
  };
  createdAt: Date;
  verifiedAt?: Date;
}

export type AssetType = 'LAND' | 'MACHINE' | 'FACILITY' | 'VEHICLE' | 'EV_FLEET' | 'INDUSTRIAL_BOILER';

export interface Asset {
  id: string;
  type: AssetType;
  ownerId: string;                // Entity.id
  description: string;
  deviceId: string;               // Smart meter ID / inverter serial / SCADA ID / telematics unit
  metadata: Record<string, unknown>;
  boundAt: Date;
}

/**
 * Input parameters for CIH computation.
 * CIH = SHA-256(identity || assetId || deviceId || lat || lng || timestamp)
 * All inputs are normalized to strings before hashing.
 */
export interface CIHInput {
  identityHash: string;   // SHA-256 of raw credential (GSTIN / Aadhaar XML hash / PAN)
  assetId: string;        // Unique asset identifier
  deviceId: string;       // IoT device / smart meter MAC or serial
  lat: number;            // Asset GPS latitude
  lng: number;            // Asset GPS longitude
  timestamp: string;      // ISO 8601 — moment of binding
}

export interface IdentityBinding {
  cih: string;            // The Composite Identity Hash — SHA-256 output
  entityId: string;
  assetId: string;
  deviceId: string;
  geolocation: { lat: number; lng: number };
  boundAt: Date;
  /** @deprecated Use cih instead — kept for backward compat with pipeline runner */
  hash?: string;
}

// ============================================
// LAYER 2: Data Ingestion — CDIF Schema
// Ref: Technical Architecture Doc — Layer 2
// CDIF mandatory fields: CIH Reference, Asset Type, Measurement Unit,
//   Data Source, Timestamp, Geo-location, Data Integrity Signature,
//   Reporting Period, Schema Version
// ============================================

export type DataSourceType =
  | 'IOT_SENSOR'        // Smart meters, solar inverters, EV charging systems, flow meters
  | 'SATELLITE'         // Satellite imagery and remote sensing feeds
  | 'SCADA'             // SCADA / PLC / EMS / ERP industrial systems
  | 'MANUAL_ENTRY'      // Pre-validated digital templates, mobile uploads with geo-tagging
  | 'API_IMPORT'        // Weather / irradiance APIs
  | 'DOCUMENT_SCAN';    // Legacy — lowest trust

export type TrustLevel = 'HIGH' | 'MEDIUM' | 'LOW';

/**
 * CDIF-compliant data packet.
 * Maps 1:1 with the 8 mandatory fields defined in the Technical Architecture Doc.
 */
export interface DataPoint {
  id: string;

  // CDIF mandatory fields:
  cihReference: string;       // CIH from Layer 1 — links data to verified identity
  sourceType: DataSourceType; // CDIF: "Data Source"
  sourceId: string;           // Device or system identifier
  timestamp: Date;            // CDIF: ISO 8601 standardized time
  geolocation: {              // CDIF: Latitude-longitude coordinates
    lat: number;
    lng: number;
  };
  value: number;
  unit: string;               // CDIF: kWh / Litres / Tonnes / Kilometres
  deviceSignature: string;    // CDIF: "Data Integrity Signature" — device crypto sig or 'MANUAL'
  reportingPeriod: {          // CDIF: Monitoring window start and end
    start: Date;
    end: Date;
  };
  schemaVersion: string;      // CDIF: e.g. "CDIF-1.0" — backward compat identifier

  // Computed:
  trustScore: TrustLevel;
  raw: unknown;               // Original payload — preserved for audit
}

export interface DataIngestionResult {
  accepted: DataPoint[];
  rejected: Array<{ point: DataPoint; reason: string }>;
  summary: {
    total: number;
    accepted: number;
    rejected: number;
    trustDistribution: Record<TrustLevel, number>;
  };
}

// ============================================
// LAYER 3: MRV Engine
// Ref: Technical Architecture Doc — Layer 3
// Patent Claim [0009]: "automatic validation...using machine learning,
//   anomaly detection, geospatial verification, and baseline comparisons"
// KEY RULE: AI assists. AI does NOT determine emissions.
//           All impact calculations are deterministic formula-based.
// ============================================

/**
 * Methodology configuration.
 * Each methodology maps to a real regulatory framework.
 * The emissionFactors field contains the actual coefficients used in calculation.
 */
export interface Methodology {
  id: string;
  name: string;
  version: string;
  sector: string;
  formula: string;            // Human-readable formula for auditors
  sourceAuthority: string;    // e.g. "CEA India", "IPCC AR6", "India GHG Program"
  applicableAssetTypes: AssetType[];
  emissionFactors: {
    primary: number;          // Main emission factor (e.g. grid EF in kgCO2/kWh)
    primaryUnit: string;      // e.g. "kgCO2_per_kWh"
    conservativeAdjFactor?: number; // CAF discount (e.g. 0.95 = 5% discount)
    secondaryFactors?: Record<string, number>; // Additional EFs (diesel, CH4 GWP, etc.)
  };
  impactType: 'AVOIDED' | 'REMOVED';
  outputUnit: 'tCO2e' | 'kgCO2e';
}

export interface MRVInput {
  identityBinding: IdentityBinding;
  dataPoints: DataPoint[];
  methodology: Methodology;
  timeWindow: {
    start: Date;
    end: Date;
  };
}

export interface MRVOutput {
  success: boolean;
  impactValue?: {
    amount: number;
    unit: 'tCO2e' | 'kgCO2e';
    type: 'AVOIDED' | 'REMOVED';
  };
  methodologyId: string;
  confidenceScore: number;    // 0–100
  calculationTrace: {         // Full step-by-step trace for auditors
    step: string;
    input: string;
    formula: string;
    output: string;
  }[];
  errors: string[];
  warnings: string[];
}

// ============================================
// LAYER 4: Evidence & Audit Trail
// Patent Claim [0014]: "maintenance of immutable logs, fraud detection
//   mechanisms, and end-to-end audit trails"
// ============================================

export type AuditStepType =
  | 'CIH_CREATED'
  | 'IDENTITY_BOUND'
  | 'DATA_INGESTED'
  | 'MRV_CALCULATED'
  | 'GIC_GENERATED'
  | 'ANOMALY_DETECTED'
  | 'REGISTRY_SUBMITTED';

export interface AuditLogEntry {
  id: string;
  stepType: AuditStepType;
  timestamp: Date;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  hash: string;         // SHA-256(stepType || inputs || outputs || previousHash)
  previousHash: string; // Chain integrity — each entry links to previous
}

export interface AuditTrail {
  id: string;
  entries: AuditLogEntry[];
  createdAt: Date;
  lastUpdatedAt: Date;
}

// ============================================
// LAYER 5: Green Impact Certificate (GIC)
// Ref: Technical Architecture Doc — Layer 4
// Patent Claim [0012]: "unified Green Impact Certificate (GIC)
//   containing cryptographic proofs, MRV validation, registry acceptance,
//   and transaction records"
// GIC is NOT a carbon credit — it is a programmable proof artifact.
// ============================================

export type GICStatus = 'DRAFT' | 'VERIFIED' | 'ISSUED' | 'REVOKED';

export interface GreenImpactCertificate {
  id: string;
  status: GICStatus;

  // Identity Anchor
  cihReference: string;       // Composite Identity Hash — links back to Layer 1

  // Core Data
  entityId: string;
  assetId: string;
  impactValue: {
    amount: number;
    unit: 'tCO2e' | 'kgCO2e';
    type: 'AVOIDED' | 'REMOVED';
  };

  // Methodology & Time
  methodologyId: string;
  methodologyTitle: string;   // Human-readable for certificates
  timeWindow: {
    start: Date;
    end: Date;
  };

  // Verification
  confidenceScore: number;
  auditTrailId: string;

  // Cryptographic Proof
  hash: string;               // SHA-256 of core GIC fields
  qrPayload: string;          // JSON string for QR code → public verification URL
  signature?: string;         // Future: digital signature

  // Metadata
  createdAt: Date;
  verifiedAt?: Date;
  issuedAt?: Date;
}

// ============================================
// Pipeline State (Internal)
// ============================================

export interface PipelineState {
  currentLayer: 1 | 2 | 3 | 4 | 5;
  identity?: IdentityBinding;
  ingestion?: DataIngestionResult;
  mrv?: MRVOutput;
  auditTrail?: AuditTrail;
  certificate?: GreenImpactCertificate;
  errors: string[];
}
