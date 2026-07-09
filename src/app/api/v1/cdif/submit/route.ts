/**
 * POST /api/v1/cdif/submit
 *
 * Carbon UPI Protocol — Layer 2: Climate Data Ingestion Format (CDIF)
 *
 * Accepts a batch of CDIF-compliant climate data packets, validates them
 * against the 8 mandatory CDIF fields, classifies trust levels, and
 * returns the ingestion result with accepted/rejected breakdown.
 *
 * Ref: Technical Architecture Doc, Layer 2
 * CDIF mandatory fields: CIH Reference, Asset Type, Measurement Unit,
 *   Data Source, Timestamp, Geo-location, Data Integrity Signature,
 *   Reporting Period, Schema Version
 *
 * Request Body:
 *   {
 *     cihReference: string          — CIH from Layer 1 (64-char SHA-256 hex)
 *     packets: CDIFPacket[]         — Array of data packets
 *   }
 *
 *   CDIFPacket:
 *   {
 *     sourceType: string            — "IOT_SENSOR" | "SATELLITE" | "SCADA" | "MANUAL_ENTRY" | "API_IMPORT" | "DOCUMENT_SCAN"
 *     sourceId: string              — Device or system identifier
 *     timestamp: string             — ISO 8601
 *     geolocation: { lat, lng }
 *     value: number
 *     unit: string                  — "kWh" | "Litres" | "Tonnes" | "Kilometres" | etc.
 *     deviceSignature?: string      — Cryptographic sig from device (or "MANUAL")
 *     reportingPeriod: { start, end }
 *     schemaVersion?: string        — defaults to "CDIF-1.0"
 *     raw?: unknown                 — Original payload preserved for audit
 *   }
 *
 * Response:
 *   {
 *     accepted: CDIFPacket[]
 *     rejected: { packet, reason }[]
 *     summary: { total, accepted, rejected, trustDistribution }
 *     ingestionHash: string         — SHA-256 of full ingestion for audit trail
 *   }
 */

import { NextRequest, NextResponse } from 'next/server';
import { ingestData, sha256 } from '@/lib/carbon-upi/engine';
import type { DataPoint, DataSourceType } from '@/lib/carbon-upi/types';

const VALID_SOURCE_TYPES: DataSourceType[] = [
  'IOT_SENSOR',
  'SATELLITE',
  'SCADA',
  'MANUAL_ENTRY',
  'API_IMPORT',
  'DOCUMENT_SCAN',
];

function mapPacketToDataPoint(packet: Record<string, unknown>, cihReference: string, index: number): DataPoint {
  return {
    id: `cdif-${Date.now()}-${index}`,
    cihReference,
    sourceType: (packet.sourceType as DataSourceType) ?? 'MANUAL_ENTRY',
    sourceId: (packet.sourceId as string) ?? 'unknown',
    timestamp: new Date((packet.timestamp as string)),
    geolocation: {
      lat: (packet.geolocation as { lat: number; lng: number })?.lat ?? 0,
      lng: (packet.geolocation as { lat: number; lng: number })?.lng ?? 0,
    },
    value: Number(packet.value ?? 0),
    unit: (packet.unit as string) ?? '',
    deviceSignature: (packet.deviceSignature as string) ?? 'MANUAL',
    reportingPeriod: {
      start: new Date((packet.reportingPeriod as { start: string; end: string })?.start),
      end: new Date((packet.reportingPeriod as { start: string; end: string })?.end),
    },
    schemaVersion: (packet.schemaVersion as string) ?? 'CDIF-1.0',
    trustScore: null as unknown as import('@/lib/carbon-upi/types').TrustLevel, // Set to null so ingestData classifies by sourceType
    raw: packet.raw ?? packet,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Validate top-level fields ───────────────────────────
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

    if (!body.packets || !Array.isArray(body.packets) || body.packets.length === 0) {
      return NextResponse.json(
        { error: 'packets must be a non-empty array of CDIF data packets' },
        { status: 400 }
      );
    }

    if (body.packets.length > 10000) {
      return NextResponse.json(
        { error: 'Maximum 10,000 packets per submission. Split into batches.' },
        { status: 400 }
      );
    }

    // ── Pre-validate sourceType values ──────────────────────
    const invalidSources: number[] = [];
    body.packets.forEach((p: Record<string, unknown>, i: number) => {
      if (p.sourceType && !VALID_SOURCE_TYPES.includes(p.sourceType as DataSourceType)) {
        invalidSources.push(i);
      }
    });

    if (invalidSources.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid sourceType at packet indices: ${invalidSources.slice(0, 10).join(', ')}`,
          validSourceTypes: VALID_SOURCE_TYPES,
        },
        { status: 400 }
      );
    }

    // ── Map packets to DataPoints ───────────────────────────
    const dataPoints: DataPoint[] = body.packets.map(
      (p: Record<string, unknown>, i: number) => mapPacketToDataPoint(p, body.cihReference, i)
    );

    // ── Run CDIF ingestion ──────────────────────────────────
    const result = ingestData(dataPoints);

    // ── Compute ingestion hash for audit chain ──────────────
    const ingestionHash = sha256({
      cihReference: body.cihReference,
      acceptedCount: result.summary.accepted,
      rejectedCount: result.summary.rejected,
      trustDistribution: result.summary.trustDistribution,
      timestamp: new Date().toISOString(),
    });

    const statusCode = result.summary.accepted === 0 ? 422 : 200;

    return NextResponse.json(
      {
        cihReference: body.cihReference,
        accepted: result.accepted,
        rejected: result.rejected.map(r => ({
          packet: r.point,
          reason: r.reason,
        })),
        summary: result.summary,
        ingestionHash,
        schemaVersion: 'CDIF-1.0',
        protocol: 'Carbon UPI v1',
        layer: 2,
        nextStep:
          result.summary.accepted > 0
            ? 'Submit accepted packets to POST /api/v1/mrv/verify'
            : 'Fix rejected packets and resubmit',
      },
      { status: statusCode }
    );
  } catch (err) {
    console.error('[/api/v1/cdif/submit] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/cdif/submit
 * Returns CDIF schema documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/v1/cdif/submit',
    description: 'Carbon UPI Layer 2 — Climate Data Ingestion Format (CDIF) submission and validation',
    protocol: 'Carbon UPI v1',
    cdifMandatoryFields: [
      'cihReference — CIH from Layer 1 (64-char SHA-256)',
      'sourceType — IOT_SENSOR | SATELLITE | SCADA | MANUAL_ENTRY | API_IMPORT | DOCUMENT_SCAN',
      'timestamp — ISO 8601',
      'geolocation — { lat, lng }',
      'value — numeric measurement',
      'unit — kWh | Litres | Tonnes | Kilometres | etc.',
      'deviceSignature — cryptographic sig or "MANUAL"',
      'reportingPeriod — { start: ISO8601, end: ISO8601 }',
      'schemaVersion — "CDIF-1.0" (defaults if omitted)',
    ],
    trustLevels: {
      HIGH: 'IOT_SENSOR, SATELLITE — automated, tamper-evident hardware',
      MEDIUM: 'SCADA, API_IMPORT — system-validated, not hardware-signed',
      LOW: 'MANUAL_ENTRY, DOCUMENT_SCAN — human entry, highest fraud risk',
    },
    limits: {
      maxPacketsPerSubmission: 10000,
    },
  });
}
