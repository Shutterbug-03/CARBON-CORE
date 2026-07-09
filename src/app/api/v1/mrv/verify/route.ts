/**
 * POST /api/v1/mrv/verify
 *
 * Carbon UPI Protocol — Layer 3: Digital MRV Engine
 *
 * Runs deterministic, auditable emission calculation using a pre-approved
 * methodology. Returns tCO2e impact with full step-by-step calculation trace.
 *
 * CRITICAL: All emission calculations are formula-based.
 *           AI does NOT determine emissions — AI assists with anomaly detection only.
 *           Regulators can reproduce every output from the trace.
 *
 * Ref: Technical Architecture Doc, Layer 3
 * Source Authorities:
 *   Solar/Wind  — CEA CO2 Baseline Database v19.0 | AMS-I.D UNFCCC CDM v18
 *   Soil Carbon — IPCC AR6 | India GHG Program
 *   Biogas      — IPCC AR6 (CH4 GWP-100 = 27.9)
 *   EV          — MoRTH India | CEA India
 *
 * Request Body:
 *   {
 *     cihReference: string          — CIH from Layer 1
 *     methodologyId: string         — "METH-SOLAR-001" | "METH-SOIL-001" | "METH-BIOGAS-001" | "METH-EV-001" | "METH-WIND-001"
 *     dataPoints: DataPoint[]       — Accepted packets from POST /api/v1/cdif/submit
 *     timeWindow: {
 *       start: string               — ISO 8601
 *       end: string                 — ISO 8601
 *     }
 *     gridRegion?: string           — "India-North" | "India-South" | "India-East" | "India-West" | "India-Northeast" | "India-National"
 *   }
 *
 * Response:
 *   {
 *     success: boolean
 *     mrvResult: {
 *       tCO2e: number               — Verified emission reduction
 *       unit: "tCO2e"
 *       type: "AVOIDED" | "REMOVED"
 *       confidenceScore: number     — 0-100 (weighted by trust level)
 *       calculationTrace: Step[]    — Full auditor-readable calculation log
 *       methodologyId: string
 *       methodologyAuthority: string
 *       gridEmissionFactor?: number — CEA EF used (if applicable)
 *     }
 *     mrvHash: string               — SHA-256 of MRV output for audit chain
 *     warnings: string[]
 *     nextStep: string
 *   }
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  calculateMRV,
  getMethodologyById,
  METHODOLOGIES,
  sha256,
  CEA_GRID_EMISSION_FACTORS,
} from '@/lib/carbon-upi/engine';
import type { DataPoint, MRVInput, IdentityBinding } from '@/lib/carbon-upi/types';

const VALID_GRID_REGIONS = Object.keys(CEA_GRID_EMISSION_FACTORS);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Validate required fields ────────────────────────────
    if (!body.cihReference) {
      return NextResponse.json(
        { error: 'cihReference is required — obtain from POST /api/v1/cih/create' },
        { status: 400 }
      );
    }

    if (!/^[a-f0-9]{64}$/.test(body.cihReference)) {
      return NextResponse.json(
        { error: 'cihReference must be a 64-character SHA-256 hex string' },
        { status: 400 }
      );
    }

    if (!body.methodologyId) {
      return NextResponse.json(
        {
          error: 'methodologyId is required',
          availableMethodologies: METHODOLOGIES.map(m => ({
            id: m.id,
            name: m.name,
            sector: m.sector,
            authority: m.sourceAuthority,
          })),
        },
        { status: 400 }
      );
    }

    const methodology = getMethodologyById(body.methodologyId);
    if (!methodology) {
      return NextResponse.json(
        {
          error: `Methodology ${body.methodologyId} is not approved`,
          availableMethodologies: METHODOLOGIES.map(m => m.id),
        },
        { status: 400 }
      );
    }

    if (!body.dataPoints || !Array.isArray(body.dataPoints) || body.dataPoints.length === 0) {
      return NextResponse.json(
        { error: 'dataPoints must be a non-empty array (use accepted packets from POST /api/v1/cdif/submit)' },
        { status: 400 }
      );
    }

    if (!body.timeWindow?.start || !body.timeWindow?.end) {
      return NextResponse.json(
        { error: 'timeWindow with start and end (ISO 8601) is required' },
        { status: 400 }
      );
    }

    if (body.gridRegion && !VALID_GRID_REGIONS.includes(body.gridRegion)) {
      return NextResponse.json(
        {
          error: `Invalid gridRegion. Must be one of: ${VALID_GRID_REGIONS.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // ── Reconstruct DataPoints ──────────────────────────────
    // Dates are serialized as strings in JSON — re-parse
    const dataPoints: DataPoint[] = body.dataPoints.map((p: DataPoint) => ({
      ...p,
      timestamp: new Date(p.timestamp),
      reportingPeriod: p.reportingPeriod
        ? { start: new Date(p.reportingPeriod.start), end: new Date(p.reportingPeriod.end) }
        : { start: new Date(body.timeWindow.start), end: new Date(body.timeWindow.end) },
      cihReference: p.cihReference ?? body.cihReference,
    }));

    // ── Build identity binding stub from CIH reference ──────
    // When calling /mrv/verify directly (not via full pipeline),
    // we accept the CIH as the trust anchor
    const identityBinding: IdentityBinding = {
      cih: body.cihReference,
      hash: body.cihReference,
      entityId: body.entityId ?? 'unknown',
      assetId: body.assetId ?? 'unknown',
      deviceId: body.deviceId ?? 'unknown',
      geolocation: { lat: 0, lng: 0 },
      boundAt: new Date(),
    };

    const mrvInput: MRVInput = {
      identityBinding,
      dataPoints,
      methodology,
      timeWindow: {
        start: new Date(body.timeWindow.start),
        end: new Date(body.timeWindow.end),
      },
    };

    // ── Run deterministic MRV calculation ───────────────────
    const mrvOutput = calculateMRV(mrvInput, body.gridRegion);

    if (!mrvOutput.success) {
      return NextResponse.json(
        {
          success: false,
          errors: mrvOutput.errors,
          warnings: mrvOutput.warnings,
          confidenceScore: mrvOutput.confidenceScore,
          calculationTrace: mrvOutput.calculationTrace,
        },
        { status: 422 }
      );
    }

    // ── Compute MRV hash for audit chain ────────────────────
    const mrvHash = sha256({
      cihReference: body.cihReference,
      methodologyId: body.methodologyId,
      impactValue: mrvOutput.impactValue,
      confidenceScore: mrvOutput.confidenceScore,
      dataPointCount: dataPoints.length,
      timestamp: new Date().toISOString(),
    });

    // Resolve which grid EF was used
    const gridRegion = body.gridRegion ?? 'India-National';
    const gridEfUsed = methodology.id.includes('SOLAR') || methodology.id.includes('WIND') || methodology.id.includes('EV')
      ? CEA_GRID_EMISSION_FACTORS[gridRegion]
      : null;

    return NextResponse.json({
      success: true,
      cihReference: body.cihReference,
      mrvResult: {
        tCO2e: mrvOutput.impactValue!.amount,
        unit: mrvOutput.impactValue!.unit,
        type: mrvOutput.impactValue!.type,
        confidenceScore: mrvOutput.confidenceScore,
        calculationTrace: mrvOutput.calculationTrace,
        methodologyId: mrvOutput.methodologyId,
        methodologyName: methodology.name,
        methodologyAuthority: methodology.sourceAuthority,
        gridEmissionFactor: gridEfUsed,
        gridRegion: gridEfUsed ? gridRegion : null,
        dataPointCount: dataPoints.length,
        timeWindow: body.timeWindow,
      },
      mrvHash,
      warnings: mrvOutput.warnings,
      protocol: 'Carbon UPI v1',
      layer: 3,
      nextStep: 'Submit mrvHash + cihReference to POST /api/v1/gic/issue to generate a Green Impact Certificate',
    });
  } catch (err) {
    console.error('[/api/v1/mrv/verify] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/mrv/verify
 * Returns available methodologies and schema documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/v1/mrv/verify',
    description: 'Carbon UPI Layer 3 — Deterministic MRV Engine. Calculates verified tCO2e impact with full audit trace.',
    protocol: 'Carbon UPI v1',
    rule: 'AI does NOT determine emissions. All calculations are formula-based and reproducible.',
    availableMethodologies: METHODOLOGIES.map(m => ({
      id: m.id,
      name: m.name,
      sector: m.sector,
      formula: m.formula,
      authority: m.sourceAuthority,
      applicableAssets: m.applicableAssetTypes,
      emissionFactors: m.emissionFactors,
    })),
    gridRegions: VALID_GRID_REGIONS.map(r => ({
      region: r,
      ef: CEA_GRID_EMISSION_FACTORS[r],
      unit: 'kgCO2/kWh',
      source: 'CEA CO2 Baseline Database v19.0, FY2023-24',
    })),
  });
}
