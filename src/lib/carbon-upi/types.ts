/**
 * Carbon UPI - Core Type Definitions
 * The "Boring" Infrastructure Layer
 * 
 * These types are DETERMINISTIC and AUDITABLE.
 * No guessing. No AI decisions. Pure data structures.
 */

// ============================================
// LAYER 1: Identity & Asset Binding
// ============================================

export type EntityType = 'FARMER' | 'MSME' | 'EXPORTER' | 'GOVERNMENT';

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  registrationId: string; // Aadhaar / GSTIN / PAN
  location: {
    lat: number;
    lng: number;
    region: string;
  };
  createdAt: Date;
  verifiedAt?: Date;
}

export type AssetType = 'LAND' | 'MACHINE' | 'FACILITY' | 'VEHICLE';

export interface Asset {
  id: string;
  type: AssetType;
  ownerId: string; // Entity.id
  description: string;
  metadata: Record<string, unknown>;
  boundAt: Date;
}

export interface IdentityBinding {
  hash: string; // SHA-256 of Entity + Asset + Timestamp
  entityId: string;
  assetId: string;
  boundAt: Date;
}

// ============================================
// LAYER 2: Data Ingestion & Classification
// ============================================

export type DataSourceType = 
  | 'IOT_SENSOR'
  | 'SATELLITE'
  | 'MANUAL_ENTRY'
  | 'API_IMPORT'
  | 'DOCUMENT_SCAN';

export type TrustLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface DataPoint {
  id: string;
  sourceType: DataSourceType;
  sourceId: string;
  timestamp: Date;
  value: number;
  unit: string;
  trustScore: TrustLevel;
  raw: unknown; // Original payload
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
// LAYER 3: MRV Engine (The Brain)
// ============================================

export interface Methodology {
  id: string;
  name: string;
  version: string;
  sector: string;
  formula: string; // Human-readable formula description
  sourceAuthority: string; // e.g., "IPCC", "India GHG Program"
  applicableAssetTypes: AssetType[];
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
  confidenceScore: number; // 0-100
  errors: string[];
  warnings: string[];
}

// ============================================
// LAYER 4: Evidence & Audit Trail
// ============================================

export type AuditStepType = 
  | 'IDENTITY_BOUND'
  | 'DATA_INGESTED'
  | 'MRV_CALCULATED'
  | 'GIC_GENERATED'
  | 'ANOMALY_DETECTED';

export interface AuditLogEntry {
  id: string;
  stepType: AuditStepType;
  timestamp: Date;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  hash: string; // Hash of inputs + outputs for integrity
  previousHash: string; // Chain integrity
}

export interface AuditTrail {
  id: string;
  entries: AuditLogEntry[];
  createdAt: Date;
  lastUpdatedAt: Date;
}

// ============================================
// LAYER 5: Green Impact Certificate (GIC)
// ============================================

export type GICStatus = 'DRAFT' | 'VERIFIED' | 'ISSUED' | 'REVOKED';

export interface GreenImpactCertificate {
  id: string;
  status: GICStatus;
  
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
  timeWindow: {
    start: Date;
    end: Date;
  };
  
  // Verification
  confidenceScore: number;
  auditTrailId: string;
  
  // Cryptographic Proof
  hash: string;
  signature?: string;
  
  // Metadata
  createdAt: Date;
  verifiedAt?: Date;
  issuedAt?: Date;
}

// ============================================
// Pipeline State (For Simulation)
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
