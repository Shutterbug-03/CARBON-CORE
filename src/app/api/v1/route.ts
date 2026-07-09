/**
 * GET /api/v1
 *
 * Carbon UPI Protocol — API Root
 *
 * Returns the full protocol specification, available endpoints,
 * methodology registry, and grid emission factors.
 *
 * This is the entry point for any system integrating with Carbon UPI.
 * Design: RFC-style discovery document (like OIDC /.well-known/openid-configuration)
 */

import { NextResponse } from 'next/server';
import { METHODOLOGIES, CEA_GRID_EMISSION_FACTORS } from '@/lib/carbon-upi/engine';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://verify.greenpe.in';

export async function GET() {
  return NextResponse.json({
    protocol: 'Carbon UPI',
    version: '1.0.0',
    description: 'Digital Public Infrastructure for Climate Action Verification — India',
    governance: 'Brown Swan Private Limited / GreenPe',
    patent: 'Provisional Specification filed 19 December 2025 (IN/PA 3385)',
    baseUrl: BASE_URL,

    architecture: {
      model: '7-Layer DPI Stack (modelled on UPI / ONDC)',
      layers: [
        { id: 1, name: 'CIH — Composite Identity Hash',     status: 'ACTIVE',  endpoint: `${BASE_URL}/api/v1/cih/create` },
        { id: 2, name: 'CDIF — Climate Data Ingestion',     status: 'ACTIVE',  endpoint: `${BASE_URL}/api/v1/cdif/submit` },
        { id: 3, name: 'MRV — Deterministic Verification',  status: 'ACTIVE',  endpoint: `${BASE_URL}/api/v1/mrv/verify` },
        { id: 4, name: 'GIC — Green Impact Certificate',    status: 'ACTIVE',  endpoint: `${BASE_URL}/api/v1/gic/issue` },
        { id: 5, name: 'Registry Interoperability',         status: 'PLANNED', endpoint: `${BASE_URL}/api/v1/gic/:id/registry` },
        { id: 6, name: 'Public Transparency Ledger',        status: 'ACTIVE',  endpoint: `${BASE_URL}/api/v1/gic/:id` },
        { id: 7, name: 'Governance & Open Protocol',        status: 'PLANNED', endpoint: null },
      ],
    },

    endpoints: {
      'POST /api/v1/cih/create': {
        description: 'Layer 1 — Create Composite Identity Hash binding identity + asset + device + GPS + time',
        auth: 'none (public protocol endpoint)',
        rateLimit: '1000/min',
      },
      'POST /api/v1/cdif/submit': {
        description: 'Layer 2 — Submit CDIF-format climate activity data for validation and trust classification',
        auth: 'none (public protocol endpoint)',
        rateLimit: '100/min',
      },
      'POST /api/v1/mrv/verify': {
        description: 'Layer 3 — Run deterministic MRV calculation using approved methodology',
        auth: 'none (public protocol endpoint)',
        rateLimit: '100/min',
      },
      'POST /api/v1/gic/issue': {
        description: 'Layer 4 — Issue Green Impact Certificate (programmable climate proof artifact)',
        auth: 'none (public protocol endpoint)',
        rateLimit: '100/min',
      },
      'GET /api/v1/gic/:id': {
        description: 'Layer 6 — Publicly verify any GIC by ID. No authentication required.',
        auth: 'none (public)',
        rateLimit: 'unlimited',
      },
    },

    protocolFlow: [
      'POST /api/v1/cih/create       → cihReference (64-char SHA-256)',
      'POST /api/v1/cdif/submit      → accepted data packets + ingestionHash',
      'POST /api/v1/mrv/verify       → tCO2e + calculationTrace + mrvHash',
      'POST /api/v1/gic/issue        → gicId + gicHash + publicVerificationUrl',
      'GET  /api/v1/gic/:id          → public proof verification (any party)',
    ],

    methodologyRegistry: METHODOLOGIES.map(m => ({
      id: m.id,
      name: m.name,
      sector: m.sector,
      formula: m.formula,
      authority: m.sourceAuthority,
      applicableAssets: m.applicableAssetTypes,
      impactType: m.impactType,
      outputUnit: m.outputUnit,
      emissionFactors: m.emissionFactors,
    })),

    gridEmissionFactors: {
      source: 'Central Electricity Authority (CEA), CO2 Baseline Database v19.0, FY2023-24',
      unit: 'kgCO2 per kWh',
      factors: CEA_GRID_EMISSION_FACTORS,
    },

    openStandards: {
      cdifSchema: `${BASE_URL}/api/v1/cdif/submit`,
      gicSchema: `${BASE_URL}/api/v1/gic/issue`,
      methodologyRegistry: `${BASE_URL}/api/v1`,
    },

    becknCompatibility: {
      status: 'PLANNED',
      description: 'GreenPe will expose Beckn adapter layer wrapping these APIs for ONDC / Energy Beckn network participation',
      architecture: 'Wrap existing Carbon UPI APIs with Beckn adapter — do NOT rebuild as native Beckn',
    },

    registryCompatibility: {
      planned: ['BEE_CCTS', 'Verra_VCS', 'Gold_Standard', 'POSOCO', 'CBAM'],
      status: 'Registry adapters in development (Phase 5)',
    },

    schemaVersion: 'CDIF-1.0 / GIC-1.0',
    hashAlgorithm: 'SHA-256 (Node.js crypto)',
    license: 'Proprietary — Brown Swan Private Limited',
  });
}
