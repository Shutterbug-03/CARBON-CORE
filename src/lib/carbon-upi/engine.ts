/**
 * Carbon UPI - Core Engine
 * Deterministic Pipeline Functions
 * 
 * RULES:
 * 1. No guessing
 * 2. All calculations are formula-based
 * 3. Everything is auditable
 * 4. Fail explicitly if data is insufficient
 */

import type {
    Entity,
    Asset,
    IdentityBinding,
    DataPoint,
    DataIngestionResult,
    Methodology,
    MRVInput,
    MRVOutput,
    AuditLogEntry,
    AuditTrail,
    GreenImpactCertificate,
    AuditStepType,
    TrustLevel,
} from './types';

// ============================================
// Utility: Hash Generation (Mock SHA-256)
// ============================================

function generateHash(data: unknown): string {
    // In production, use crypto.subtle.digest('SHA-256', ...)
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return `0x${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// LAYER 1: Identity Binding
// ============================================

export function bindIdentity(entity: Entity, asset: Asset): IdentityBinding {
    const binding: IdentityBinding = {
        hash: generateHash({ entity, asset, timestamp: new Date() }),
        entityId: entity.id,
        assetId: asset.id,
        boundAt: new Date(),
    };
    return binding;
}

// ============================================
// LAYER 2: Data Ingestion
// ============================================

function classifyTrust(sourceType: DataPoint['sourceType']): TrustLevel {
    switch (sourceType) {
        case 'IOT_SENSOR':
        case 'SATELLITE':
            return 'HIGH';
        case 'API_IMPORT':
            return 'MEDIUM';
        case 'MANUAL_ENTRY':
        case 'DOCUMENT_SCAN':
            return 'LOW';
        default:
            return 'LOW';
    }
}

export function ingestData(dataPoints: DataPoint[]): DataIngestionResult {
    const accepted: DataPoint[] = [];
    const rejected: Array<{ point: DataPoint; reason: string }> = [];

    for (const point of dataPoints) {
        // Rule: Must have timestamp
        if (!point.timestamp) {
            rejected.push({ point, reason: 'Missing timestamp' });
            continue;
        }

        // Rule: Timestamp cannot be in the future
        if (new Date(point.timestamp) > new Date()) {
            rejected.push({ point, reason: 'Future timestamp not allowed' });
            continue;
        }

        // Rule: Value must be a valid number
        if (typeof point.value !== 'number' || isNaN(point.value)) {
            rejected.push({ point, reason: 'Invalid value' });
            continue;
        }

        // Assign trust score if not present
        const enrichedPoint: DataPoint = {
            ...point,
            trustScore: point.trustScore || classifyTrust(point.sourceType),
        };

        accepted.push(enrichedPoint);
    }

    const trustDistribution: Record<TrustLevel, number> = {
        HIGH: accepted.filter(p => p.trustScore === 'HIGH').length,
        MEDIUM: accepted.filter(p => p.trustScore === 'MEDIUM').length,
        LOW: accepted.filter(p => p.trustScore === 'LOW').length,
    };

    return {
        accepted,
        rejected,
        summary: {
            total: dataPoints.length,
            accepted: accepted.length,
            rejected: rejected.length,
            trustDistribution,
        },
    };
}

// ============================================
// LAYER 3: MRV Engine
// ============================================

// Pre-approved methodologies (simplified examples)
export const METHODOLOGIES: Methodology[] = [
    {
        id: 'METH-SOIL-001',
        name: 'Soil Carbon Sequestration',
        version: '1.0.0',
        sector: 'Agriculture',
        formula: 'CO2e = Δ(soil_carbon) × 3.67 × area',
        sourceAuthority: 'India GHG Program',
        applicableAssetTypes: ['LAND'],
    },
    {
        id: 'METH-SOLAR-001',
        name: 'Solar Energy Generation',
        version: '1.0.0',
        sector: 'Energy',
        formula: 'CO2e = kWh_generated × grid_emission_factor',
        sourceAuthority: 'CEA India',
        applicableAssetTypes: ['FACILITY'],
    },
    {
        id: 'METH-BIOGAS-001',
        name: 'Biogas Production',
        version: '1.0.0',
        sector: 'Waste',
        formula: 'CO2e = (CH4_captured × 28) + (CO2_avoided × 1)',
        sourceAuthority: 'IPCC',
        applicableAssetTypes: ['FACILITY', 'LAND'],
    },
];

export function calculateMRV(input: MRVInput): MRVOutput {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Rule 1: Must have identity binding
    if (!input.identityBinding) {
        errors.push('Identity binding is required');
    }

    // Rule 2: Must have at least one data point
    if (!input.dataPoints || input.dataPoints.length === 0) {
        errors.push('At least one data point is required');
    }

    // Rule 3: Must have valid methodology
    if (!input.methodology) {
        errors.push('Methodology is required');
    }

    // Rule 4: Time window must be valid
    if (!input.timeWindow || !input.timeWindow.start || !input.timeWindow.end) {
        errors.push('Valid time window is required');
    }

    // If any errors, fail explicitly
    if (errors.length > 0) {
        return {
            success: false,
            methodologyId: input.methodology?.id || 'UNKNOWN',
            confidenceScore: 0,
            errors,
            warnings,
        };
    }

    // Calculate confidence based on trust scores
    const highTrustCount = input.dataPoints.filter(p => p.trustScore === 'HIGH').length;
    const totalCount = input.dataPoints.length;
    const confidenceScore = Math.round((highTrustCount / totalCount) * 100);

    if (confidenceScore < 50) {
        warnings.push('Confidence score below 50%. Consider adding high-trust data sources.');
    }

    // Calculate impact (simplified - in production, use methodology-specific formulas)
    const aggregatedValue = input.dataPoints.reduce((sum, p) => sum + p.value, 0);
    const impactAmount = aggregatedValue * 0.001; // Simplified conversion factor

    return {
        success: true,
        impactValue: {
            amount: Math.round(impactAmount * 100) / 100,
            unit: 'tCO2e',
            type: 'AVOIDED',
        },
        methodologyId: input.methodology.id,
        confidenceScore,
        errors: [],
        warnings,
    };
}

// ============================================
// LAYER 4: Audit Trail
// ============================================

export function createAuditEntry(
    stepType: AuditStepType,
    inputs: Record<string, unknown>,
    outputs: Record<string, unknown>,
    previousHash: string = '0x0000000000000000'
): AuditLogEntry {
    const entry: AuditLogEntry = {
        id: generateId(),
        stepType,
        timestamp: new Date(),
        inputs,
        outputs,
        hash: generateHash({ stepType, inputs, outputs, previousHash }),
        previousHash,
    };
    return entry;
}

export function createAuditTrail(entries: AuditLogEntry[]): AuditTrail {
    return {
        id: generateId(),
        entries,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
    };
}

// ============================================
// LAYER 5: GIC Generator
// ============================================

export function generateGIC(
    entityId: string,
    assetId: string,
    mrvOutput: MRVOutput,
    auditTrail: AuditTrail,
    timeWindow: { start: Date; end: Date }
): GreenImpactCertificate | null {
    if (!mrvOutput.success || !mrvOutput.impactValue) {
        return null;
    }

    const gic: GreenImpactCertificate = {
        id: `GIC-${generateId()}`,
        status: 'VERIFIED',
        entityId,
        assetId,
        impactValue: mrvOutput.impactValue,
        methodologyId: mrvOutput.methodologyId,
        timeWindow,
        confidenceScore: mrvOutput.confidenceScore,
        auditTrailId: auditTrail.id,
        hash: generateHash({
            entityId,
            assetId,
            impactValue: mrvOutput.impactValue,
            methodologyId: mrvOutput.methodologyId,
            timeWindow,
        }),
        createdAt: new Date(),
        verifiedAt: new Date(),
    };

    return gic;
}

// ============================================
// Full Pipeline Runner
// ============================================

export interface PipelineInput {
    entity: Entity;
    asset: Asset;
    rawDataPoints: DataPoint[];
    methodology: Methodology;
    timeWindow: { start: Date; end: Date };
}

export interface PipelineResult {
    success: boolean;
    certificate?: GreenImpactCertificate;
    auditTrail: AuditTrail;
    errors: string[];
}

export function runPipeline(input: PipelineInput): PipelineResult {
    const auditEntries: AuditLogEntry[] = [];
    let previousHash = '0x0000000000000000';

    // Layer 1: Identity Binding
    const identity = bindIdentity(input.entity, input.asset);
    const identityEntry = createAuditEntry(
        'IDENTITY_BOUND',
        { entity: input.entity.id, asset: input.asset.id },
        { hash: identity.hash },
        previousHash
    );
    auditEntries.push(identityEntry);
    previousHash = identityEntry.hash;

    // Layer 2: Data Ingestion
    const ingestionResult = ingestData(input.rawDataPoints);
    const ingestionEntry = createAuditEntry(
        'DATA_INGESTED',
        { rawCount: input.rawDataPoints.length },
        { accepted: ingestionResult.summary.accepted, rejected: ingestionResult.summary.rejected },
        previousHash
    );
    auditEntries.push(ingestionEntry);
    previousHash = ingestionEntry.hash;

    // Layer 3: MRV Calculation
    const mrvInput: MRVInput = {
        identityBinding: identity,
        dataPoints: ingestionResult.accepted,
        methodology: input.methodology,
        timeWindow: input.timeWindow,
    };
    const mrvOutput = calculateMRV(mrvInput);
    const mrvEntry = createAuditEntry(
        'MRV_CALCULATED',
        { dataPointCount: ingestionResult.accepted.length, methodology: input.methodology.id },
        { success: mrvOutput.success, impactValue: mrvOutput.impactValue },
        previousHash
    );
    auditEntries.push(mrvEntry);
    previousHash = mrvEntry.hash;

    // Layer 4: Create Audit Trail
    const auditTrail = createAuditTrail(auditEntries);

    // Layer 5: Generate GIC
    if (!mrvOutput.success) {
        return {
            success: false,
            auditTrail,
            errors: mrvOutput.errors,
        };
    }

    const certificate = generateGIC(
        input.entity.id,
        input.asset.id,
        mrvOutput,
        auditTrail,
        input.timeWindow
    );

    if (!certificate) {
        return {
            success: false,
            auditTrail,
            errors: ['Failed to generate certificate'],
        };
    }

    // Add GIC generation to audit trail
    const gicEntry = createAuditEntry(
        'GIC_GENERATED',
        { mrvOutput: mrvOutput.impactValue },
        { certificateId: certificate.id, hash: certificate.hash },
        previousHash
    );
    auditTrail.entries.push(gicEntry);
    auditTrail.lastUpdatedAt = new Date();

    return {
        success: true,
        certificate,
        auditTrail,
        errors: [],
    };
}
