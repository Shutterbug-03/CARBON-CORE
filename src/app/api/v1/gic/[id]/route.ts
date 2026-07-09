/**
 * GET /api/v1/gic/[id]
 *
 * Carbon UPI Protocol — Public GIC Verification Endpoint
 *
 * Publicly verifiable, unauthenticated endpoint.
 * Any party (bank, government, auditor, insurer) can verify a GIC
 * by providing its ID. No API key required.
 *
 * This is the "GET /gic/:id" that makes the GIC a public proof artifact.
 *
 * Ref: Technical Architecture Doc, Layer 6 — Public Transparency
 * Patent Claim [0012]: "GIC...serves as the final, immutable proof of the asset"
 *
 * Query params:
 *   format?: "json" | "registry"    — "json" (default) or registry-formatted
 *
 * Response (json):
 *   Full GIC object with verification status
 *
 * Response (registry) — returns stub for now, adapters coming in Phase 5:
 *   Registry-formatted object (BEE CCTS, Verra, CBAM)
 */

import { NextRequest, NextResponse } from 'next/server';

// In production this would query Supabase.
// For now returns a structured verification response based on the GIC ID.
// The GIC data would be persisted by /api/v1/gic/issue before being retrievable here.

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') ?? 'json';

  // ── Validate GIC ID format ──────────────────────────────
  // Format: GP-GIC-{YEAR}-{8_HEX_CHARS}
  if (!id || !/^GP-GIC-\d{4}-[A-F0-9]{8}$/.test(id)) {
    return NextResponse.json(
      {
        verified: false,
        error: 'Invalid GIC ID format. Expected: GP-GIC-{YEAR}-{8 hex chars} e.g. GP-GIC-2026-A3B1F2C4',
        gicId: id,
      },
      { status: 400 }
    );
  }

  try {
    // ── Attempt Supabase lookup ─────────────────────────────
    let gicRecord: Record<string, unknown> | null = null;

    try {
      const { createAdminClient } = await import('@/lib/supabase/admin');
      const supabase = createAdminClient();

      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('certificate_id', id)
        .maybeSingle();

      if (!error && data) {
        gicRecord = data as Record<string, unknown>;
      }
    } catch {
      // Supabase not configured — return ID-based response
    }

    // ── Build verification response ─────────────────────────
    if (gicRecord) {
      // Found in database
      const meta = gicRecord.metadata as Record<string, unknown> | null;

      if (format === 'registry') {
        return NextResponse.json({
          format: 'Carbon UPI Registry Format v1',
          gicId: id,
          status: gicRecord.status,
          verifiedImpact: {
            tCO2e: gicRecord.carbon_reduced,
            unit: 'tCO2e',
            vintage: gicRecord.vintage,
          },
          issuer: 'GreenPe Digital MRV Engine',
          issuedDate: gicRecord.issued_date,
          projectType: gicRecord.project_type,
          location: gicRecord.location,
          methodologyId: (meta?.mrvResult as Record<string, unknown>)?.methodologyId ?? 'AMS-I.D',
          verificationUrl: `/gic/${id}`,
          registryCompatibility: ['BEE_CCTS', 'Verra_VCS', 'CBAM', 'Gold_Standard'],
          note: 'Full registry adapters available via /api/v1/gic/:id/registry?format=BEE_CCTS',
        });
      }

      return NextResponse.json({
        verified: true,
        gicId: id,
        status: gicRecord.status,
        protocol: 'Carbon UPI v1',
        issuedBy: 'GreenPe Digital MRV Engine',
        issuedAt: gicRecord.issued_date,
        projectName: gicRecord.project_name,
        projectType: gicRecord.project_type,
        location: gicRecord.location,
        verifiedImpact: {
          tCO2e: gicRecord.carbon_reduced,
          unit: 'tCO2e',
          vintage: gicRecord.vintage,
        },
        pdfUrl: gicRecord.pdf_url,
        metadata: meta,
        publiclyVerifiable: true,
        note: 'This GIC is publicly verifiable. No authentication required.',
      });
    }

    // ── GIC not found ───────────────────────────────────────
    // Return a structured "not found but valid format" response
    // This allows QR codes to still resolve during development/staging
    return NextResponse.json(
      {
        verified: false,
        gicId: id,
        status: 'NOT_FOUND',
        protocol: 'Carbon UPI v1',
        message: 'This GIC ID is not found in the registry. It may have been issued on a different environment or is pending database persistence.',
        hint: 'If you just issued this GIC, ensure the /api/v1/gic/issue endpoint is persisting to Supabase. Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
      },
      { status: 404 }
    );
  } catch (err) {
    console.error(`[/api/v1/gic/${id}] Error:`, err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
