/**
 * POST /api/v1/cih/create
 *
 * Carbon UPI Protocol — Layer 1: Composite Identity Hash
 *
 * Creates a deterministic, tamper-proof CIH binding a verified identity
 * to a physical asset, measurement device, geolocation, and timestamp.
 *
 * Ref: Technical Architecture Doc, Layer 1
 * Patent Claim [0022]: "computing a unique, irreversible Cryptographic Identity Hash"
 *
 * Request Body:
 *   {
 *     identityCredential: string    — Raw GSTIN / PAN / Aadhaar XML hash / UDYAM
 *     credentialType: string        — "GSTIN" | "PAN" | "AADHAAR_HASH" | "UDYAM" | "ENTERPRISE_KYC"
 *     assetId: string               — Unique physical asset identifier
 *     deviceId: string              — Smart meter MAC / inverter serial / SCADA ID
 *     lat: number                   — Asset GPS latitude
 *     lng: number                   — Asset GPS longitude
 *     timestamp?: string            — ISO 8601 (defaults to now if omitted)
 *   }
 *
 * Response:
 *   {
 *     cih: string                   — 64-char SHA-256 hex — the Composite Identity Hash
 *     identityHash: string          — SHA-256 of raw credential (PII never stored)
 *     assetId: string
 *     deviceId: string
 *     geolocation: { lat, lng }
 *     timestamp: string             — ISO 8601 of binding moment
 *     schemaVersion: string         — "CDIF-1.0"
 *   }
 */

import { NextRequest, NextResponse } from 'next/server';
import { computeCIH, sha256 } from '@/lib/carbon-upi/engine';
import type { CIHInput, IdentityCredentialType } from '@/lib/carbon-upi/types';

const VALID_CREDENTIAL_TYPES: IdentityCredentialType[] = [
  'GSTIN',
  'PAN',
  'AADHAAR_HASH',
  'UDYAM',
  'ENTERPRISE_KYC',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Validate required fields ────────────────────────────
    const missing: string[] = [];
    if (!body.identityCredential) missing.push('identityCredential');
    if (!body.credentialType)     missing.push('credentialType');
    if (!body.assetId)            missing.push('assetId');
    if (!body.deviceId)           missing.push('deviceId');
    if (body.lat === undefined || body.lat === null) missing.push('lat');
    if (body.lng === undefined || body.lng === null) missing.push('lng');

    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          missing,
          documentation: 'POST /api/v1/cih/create requires: identityCredential, credentialType, assetId, deviceId, lat, lng',
        },
        { status: 400 }
      );
    }

    if (!VALID_CREDENTIAL_TYPES.includes(body.credentialType)) {
      return NextResponse.json(
        {
          error: `Invalid credentialType. Must be one of: ${VALID_CREDENTIAL_TYPES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    if (typeof body.lat !== 'number' || typeof body.lng !== 'number') {
      return NextResponse.json(
        { error: 'lat and lng must be numbers' },
        { status: 400 }
      );
    }

    if (body.lat < -90 || body.lat > 90 || body.lng < -180 || body.lng > 180) {
      return NextResponse.json(
        { error: 'Invalid GPS coordinates. lat must be -90 to 90, lng must be -180 to 180' },
        { status: 400 }
      );
    }

    // ── Compute CIH ─────────────────────────────────────────
    // CRITICAL: Hash the raw credential — PII never stored or returned
    const identityHash = sha256(body.identityCredential.toString().trim());
    const timestamp = body.timestamp ?? new Date().toISOString();

    const cihInput: CIHInput = {
      identityHash,
      assetId: body.assetId.toString().trim(),
      deviceId: body.deviceId.toString().trim(),
      lat: body.lat,
      lng: body.lng,
      timestamp,
    };

    const cih = computeCIH(cihInput);

    return NextResponse.json(
      {
        cih,
        identityHash,         // SHA-256 of credential — safe to return, no PII
        assetId: cihInput.assetId,
        deviceId: cihInput.deviceId,
        geolocation: {
          lat: cihInput.lat,
          lng: cihInput.lng,
        },
        credentialType: body.credentialType,
        timestamp,
        schemaVersion: 'CDIF-1.0',
        protocol: 'Carbon UPI v1',
        layer: 1,
        description: 'Composite Identity Hash — binds verified identity + asset + device + location + time',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[/api/v1/cih/create] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/cih/create
 * Returns the API schema documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/v1/cih/create',
    description: 'Carbon UPI Layer 1 — Composite Identity Hash (CIH) creation',
    protocol: 'Carbon UPI v1',
    schema: {
      request: {
        identityCredential: 'string — raw GSTIN / PAN / Aadhaar XML / UDYAM (hashed before use, never stored)',
        credentialType: `enum — ${VALID_CREDENTIAL_TYPES.join(' | ')}`,
        assetId: 'string — unique physical asset identifier',
        deviceId: 'string — IoT device MAC / inverter serial / SCADA ID',
        lat: 'number — GPS latitude of asset (-90 to 90)',
        lng: 'number — GPS longitude of asset (-180 to 180)',
        timestamp: 'string? — ISO 8601 binding time (defaults to server time)',
      },
      response: {
        cih: 'string — 64-char SHA-256 hex Composite Identity Hash',
        identityHash: 'string — SHA-256 of raw credential (PII never stored)',
        assetId: 'string',
        deviceId: 'string',
        geolocation: '{ lat: number, lng: number }',
        credentialType: 'string',
        timestamp: 'string — ISO 8601',
        schemaVersion: 'string — e.g. CDIF-1.0',
      },
    },
  });
}
