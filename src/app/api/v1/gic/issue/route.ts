/**
 * POST /api/v1/gic/issue
 *
 * Carbon UPI Protocol — Layer 4: Green Impact Certificate (GIC) Issuance
 *
 * Issues a Green Impact Certificate (GIC) — a programmable, machine-readable
 * proof artifact that binds identity, asset, MRV output, and cryptographic
 * proofs into a single verifiable object.
 *
 * The GIC is NOT a carbon credit.
 * The GIC is a standardized programmable climate proof infrastructure object.
 * Any downstream system (bank, government, registry, insurer) can consume it.
 *
 * Ref: Technical Architecture Doc, Layer 4
 * Patent Claim [0012]: "unified Green Impact Certificate (GIC) containing
 *   cryptographic proofs, MRV validation, registry acceptance, and transaction records"
 *
 * Request Body:
 *   {
 *     cihReference: string          — CIH from Layer 1
 *     mrvHash: string               — MRV audit hash from POST /api/v1/mrv/verify
 *     entityId: string
 *     assetId: string
 *     deviceId: string
 *     methodologyId: string
 *     impactValue: {
 *       amount: number              — tCO2e verified
 *       unit: "tCO2e" | "kgCO2e"
 *       type: "AVOIDED" | "REMOVED"
 *     }
 *     confidenceScore: number       — 0-100
 *     timeWindow: { start, end }    — ISO 8601
 *     calculationTrace?: Step[]     — From MRV response (stored for audit)
 *   }
 *
 * Response:
 *   {
 *     gicId: string                 — Unique GIC identifier (e.g. GP-GIC-2026-A3B1F2C4)
 *     gicHash: string               — SHA-256 of core GIC fields
 *     qrPayload: string             — JSON for QR code → public verification URL
 *     publicVerificationUrl: string — GET /api/v1/gic/:id
 *     status: "VERIFIED"
 *     issuedAt: string
 *     consumableBy: string[]        — Systems that can consume this GIC
 *   }
 */

import { NextRequest, NextResponse } from 'next/server';
import { sha256, getMethodologyById, METHODOLOGIES } from '@/lib/carbon-upi/engine';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://verify.greenpe.in';

function generateGICId(entityId: string, timestamp: string): string {
  const year = new Date().getFullYear();
  const shortHash = sha256(`${entityId}-${timestamp}`).slice(0, 8).toUpperCase();
  return `GP-GIC-${year}-${shortHash}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Validate required fields ────────────────────────────
    const required = ['cihReference', 'entityId', 'assetId', 'methodologyId', 'impactValue', 'confidenceScore', 'timeWindow'];
    const missing = required.filter(f => body[f] === undefined || body[f] === null);

    if (missing.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', missing },
        { status: 400 }
      );
    }

    if (!/^[a-f0-9]{64}$/.test(body.cihReference)) {
      return NextResponse.json(
        { error: 'cihReference must be a 64-char SHA-256 hex string' },
        { status: 400 }
      );
    }

    const methodology = getMethodologyById(body.methodologyId);
    if (!methodology) {
      return NextResponse.json(
        {
          error: `Methodology ${body.methodologyId} is not approved`,
          approvedMethodologies: METHODOLOGIES.map(m => m.id),
        },
        { status: 400 }
      );
    }

    const { impactValue } = body;
    if (
      typeof impactValue.amount !== 'number' ||
      impactValue.amount <= 0 ||
      !['tCO2e', 'kgCO2e'].includes(impactValue.unit) ||
      !['AVOIDED', 'REMOVED'].includes(impactValue.type)
    ) {
      return NextResponse.json(
        {
          error: 'impactValue must have: amount (positive number), unit ("tCO2e" | "kgCO2e"), type ("AVOIDED" | "REMOVED")',
        },
        { status: 400 }
      );
    }

    if (
      typeof body.confidenceScore !== 'number' ||
      body.confidenceScore < 0 ||
      body.confidenceScore > 100
    ) {
      return NextResponse.json(
        { error: 'confidenceScore must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    if (body.confidenceScore < 30) {
      return NextResponse.json(
        {
          error: `Confidence score ${body.confidenceScore}% is below the minimum threshold of 30%. GIC cannot be issued.`,
          confidenceScore: body.confidenceScore,
        },
        { status: 422 }
      );
    }

    if (!body.timeWindow?.start || !body.timeWindow?.end) {
      return NextResponse.json(
        { error: 'timeWindow with start and end (ISO 8601) is required' },
        { status: 400 }
      );
    }

    // ── Generate GIC ────────────────────────────────────────
    const issuedAt = new Date().toISOString();
    const gicId = generateGICId(body.entityId, issuedAt);

    // GIC hash covers all core fields — tamper-proof
    const gicHash = sha256({
      gicId,
      entityId: body.entityId,
      assetId: body.assetId,
      cihReference: body.cihReference,
      impactValue: body.impactValue,
      methodologyId: body.methodologyId,
      timeWindow: body.timeWindow,
      auditTrailReference: body.mrvHash ?? null,
      issuedAt,
    });

    const publicVerificationUrl = `${BASE_URL}/gic/${gicId}`;

    const qrPayload = JSON.stringify({
      gicId,
      hash: gicHash,
      verificationUrl: publicVerificationUrl,
      issuedAt,
      protocol: 'Carbon UPI v1',
    });

    // Full GIC object — registry-consumable
    const gic = {
      gicId,
      status: 'VERIFIED',
      protocol: 'Carbon UPI v1',
      schemaVersion: 'GIC-1.0',

      // Identity anchor
      cihReference: body.cihReference,

      // Core proof data
      entityId: body.entityId,
      assetId: body.assetId,
      deviceId: body.deviceId ?? null,
      impactValue: body.impactValue,

      // Methodology & period
      methodologyId: body.methodologyId,
      methodologyName: methodology.name,
      methodologyAuthority: methodology.sourceAuthority,
      timeWindow: body.timeWindow,

      // Verification
      confidenceScore: body.confidenceScore,
      mrvAuditReference: body.mrvHash ?? null,
      calculationTrace: body.calculationTrace ?? null,

      // Cryptographic proof
      gicHash,
      qrPayload,

      // Timestamps
      issuedAt,
      verifiedAt: issuedAt,

      // Public access
      publicVerificationUrl,

      // Downstream consumption guidance
      consumableBy: [
        'Banks — green lending decisions',
        'Government — subsidy disbursement triggers',
        'Registries — Verra VCS / BEE CCTS / Gold Standard submission',
        'Insurers — climate underwriting',
        'ESG platforms — BRSR / CBAM reporting',
        'ONDC / Beckn — climate commerce networks',
      ],
    };

    return NextResponse.json(
      {
        success: true,
        gicId,
        gicHash,
        qrPayload,
        publicVerificationUrl,
        status: 'VERIFIED',
        issuedAt,
        protocol: 'Carbon UPI v1',
        layer: 4,
        gic, // Full GIC object
        consumableBy: gic.consumableBy,
        nextSteps: [
          `Public verification: GET ${publicVerificationUrl}`,
          'Registry submission: Use /api/v1/gic/:id/registry?format=BEE_CCTS (coming soon)',
          'Beckn network: Wrap with Beckn adapter for ONDC/Energy Beckn discovery',
        ],
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[/api/v1/gic/issue] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/gic/issue
 * Returns GIC issuance schema
 */
export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/v1/gic/issue',
    description: 'Carbon UPI Layer 4 — Green Impact Certificate (GIC) issuance. Issues a programmable, machine-readable climate proof artifact.',
    protocol: 'Carbon UPI v1',
    gicDescription: 'A GIC is NOT a carbon credit. It is a standardized programmable climate proof infrastructure object that any downstream system (bank, government, registry, insurer) can consume.',
    requiredFlow: [
      '1. POST /api/v1/cih/create → get cihReference',
      '2. POST /api/v1/cdif/submit → get accepted data packets',
      '3. POST /api/v1/mrv/verify → get mrvHash + impactValue + confidenceScore',
      '4. POST /api/v1/gic/issue → get gicId + public verification URL',
    ],
    minimumConfidenceScore: 30,
  });
}
