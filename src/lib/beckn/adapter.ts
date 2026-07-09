/**
 * Carbon UPI — Beckn Protocol Adapter Layer
 *
 * Architecture (from Beckn Integration doc):
 *   GreenPe Core APIs (Carbon UPI v1)
 *         ↓
 *   Beckn Adapter Layer   ← THIS FILE
 *         ↓
 *   ONDC / Energy Beckn / Climate Networks
 *
 * RULE: Wrap existing Carbon UPI v1 APIs as Beckn-compatible objects.
 *       Do NOT rebuild native Beckn — wrap.
 *
 * GreenPe is a Beckn Network Provider (BNP) / BAP in the
 * climate verification domain.
 */

import { METHODOLOGIES, CEA_GRID_EMISSION_FACTORS } from '@/lib/carbon-upi/engine';
import type { Methodology, GreenImpactCertificate } from '@/lib/carbon-upi/types';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://verify.greenpe.in';

// ──────────────────────────────────────────────────────────────
// Beckn Catalog Types (Energy Beckn / Climate domain)
// ──────────────────────────────────────────────────────────────

export interface BecknDescriptor {
  name: string;
  short_desc?: string;
  long_desc?: string;
  code?: string;
}

export interface BecknCatalogItem {
  id: string;
  descriptor: BecknDescriptor;
  category_id: string;
  price: { currency: string; value: string };
  tags?: Record<string, string>[];
  time?: { label: string; duration: string };
  matched?: boolean;
}

export interface BecknProvider {
  id: string;
  descriptor: BecknDescriptor;
  categories: { id: string; descriptor: BecknDescriptor }[];
  items: BecknCatalogItem[];
  tags?: Record<string, string>[];
}

export interface BecknCatalog {
  descriptor: BecknDescriptor;
  providers: BecknProvider[];
}

export interface BecknOrder {
  id: string;
  status: string;
  provider: { id: string };
  items: { id: string; quantity?: { count: number } }[];
  quote?: { price: { currency: string; value: string } };
  fulfillment?: BecknFulfillment;
  documents?: BecknDocument[];
  xinput?: Record<string, unknown>;
}

export interface BecknFulfillment {
  id: string;
  type: string;
  state: { descriptor: { code: string; name: string } };
  tags?: Record<string, string>[];
}

export interface BecknDocument {
  id: string;
  descriptor: { name: string; short_desc?: string };
  url: string;
  mime_type?: string;
}

// ──────────────────────────────────────────────────────────────
// GreenPe Beckn Network Provider Identity
// ──────────────────────────────────────────────────────────────

export const GREENPE_BNP = {
  id: 'greenpe-bpp',
  domain: 'deg:climate-verification',      // Energy Beckn DEG domain
  uri: `${BASE_URL}/api/beckn`,
  descriptor: {
    name: 'GreenPe Climate Verification Rail',
    short_desc: 'Identity-bound MRV + GIC issuance for India climate assets',
    long_desc:
      'GreenPe implements the Carbon UPI open protocol — a 7-layer DPI stack for verifiable climate action. ' +
      'Provides deterministic MRV using CEA India emission factors and issues Green Impact Certificates (GICs) ' +
      'consumable by banks, governments, registries, and insurers.',
    code: 'GREENPE-BNP-001',
  },
};

// ──────────────────────────────────────────────────────────────
// Adapter: Methodology → Beckn Catalog Item
// ──────────────────────────────────────────────────────────────

function methodologyToBecknItem(methodology: Methodology): BecknCatalogItem {
  const efValue = methodology.emissionFactors.primary;
  const region = 'India-National';
  const gridEF = methodology.id.includes('SOLAR') || methodology.id.includes('WIND') || methodology.id.includes('EV')
    ? CEA_GRID_EMISSION_FACTORS[region]
    : null;

  return {
    id: `carbon-upi-${methodology.id.toLowerCase()}`,
    descriptor: {
      name: methodology.name,
      short_desc: methodology.formula,
      long_desc: `${methodology.name} — verified using ${methodology.sourceAuthority}. ` +
        `Primary emission factor: ${efValue} ${methodology.emissionFactors.primaryUnit}. ` +
        `Output: ${methodology.outputUnit}. Impact type: ${methodology.impactType}.`,
      code: methodology.id,
    },
    category_id: `climate-${methodology.sector.toLowerCase()}`,
    price: {
      currency: 'INR',
      value: '0.00',   // Protocol layer is free; GreenPe enterprise layer is paid
    },
    tags: [
      { 'carbon-upi:methodology_id': methodology.id },
      { 'carbon-upi:sector': methodology.sector },
      { 'carbon-upi:authority': methodology.sourceAuthority },
      { 'carbon-upi:output_unit': methodology.outputUnit },
      { 'carbon-upi:impact_type': methodology.impactType },
      ...(gridEF ? [{ 'carbon-upi:grid_ef_kg_co2_kwh': gridEF.toString() }] : []),
      { 'carbon-upi:applicable_assets': methodology.applicableAssetTypes.join(',') },
    ],
    time: {
      label: 'Verification SLA',
      duration: 'PT5M',  // ISO 8601 duration: 5 minutes
    },
  };
}

// ──────────────────────────────────────────────────────────────
// Adapter: GIC → Beckn Order Document
// ──────────────────────────────────────────────────────────────

export function gicToBecknDocument(gic: GreenImpactCertificate): BecknDocument {
  return {
    id: gic.id,
    descriptor: {
      name: 'Green Impact Certificate (GIC)',
      short_desc: `${gic.impactValue.amount} ${gic.impactValue.unit} ${gic.impactValue.type} — ${gic.methodologyTitle ?? gic.methodologyId}`,
    },
    url: `${BASE_URL}/gic/${gic.id}`,
    mime_type: 'application/json',
  };
}

// ──────────────────────────────────────────────────────────────
// Adapter: GIC → Beckn Fulfillment
// ──────────────────────────────────────────────────────────────

export function gicToBecknFulfillment(gic: GreenImpactCertificate, orderId: string): BecknFulfillment {
  return {
    id: `fulfillment-${orderId}`,
    type: 'CLIMATE_VERIFICATION',
    state: {
      descriptor: {
        code: gic.status === 'VERIFIED' || gic.status === 'ISSUED' ? 'VERIFIED' : 'FAILED',
        name: gic.status === 'VERIFIED' || gic.status === 'ISSUED'
          ? 'GIC Issued — Verification Complete'
          : 'Verification Failed',
      },
    },
    tags: [
      { 'carbon-upi:gic_id': gic.id },
      { 'carbon-upi:gic_hash': gic.hash },
      { 'carbon-upi:cih_reference': gic.cihReference ?? '' },
      { 'carbon-upi:tco2e': gic.impactValue.amount.toString() },
      { 'carbon-upi:confidence_score': gic.confidenceScore.toString() },
      { 'carbon-upi:methodology_id': gic.methodologyId },
      { 'carbon-upi:verification_url': `${BASE_URL}/gic/${gic.id}` },
      { 'carbon-upi:protocol_version': 'Carbon UPI v1' },
    ],
  };
}

// ──────────────────────────────────────────────────────────────
// Main Adapter: Build Full Beckn Catalog from Protocol Registry
// ──────────────────────────────────────────────────────────────

/**
 * Converts the Carbon UPI methodology registry into a Beckn catalog.
 * Called by on_search handler.
 *
 * Each methodology becomes a Beckn catalog item.
 * A BAP can select a methodology and trigger the verification flow.
 */
export function buildBecknCatalog(options?: {
  filterSector?: string;
  filterAssetType?: string;
}): BecknCatalog {
  let methodologies = METHODOLOGIES;

  if (options?.filterSector) {
    methodologies = methodologies.filter(
      m => m.sector.toLowerCase() === options.filterSector!.toLowerCase()
    );
  }

  if (options?.filterAssetType) {
    methodologies = methodologies.filter(
      m => m.applicableAssetTypes.some(
        t => t.toLowerCase() === options.filterAssetType!.toLowerCase()
      )
    );
  }

  // Build unique categories from methodology sectors
  const sectors = [...new Set(methodologies.map(m => m.sector))];
  const categories = sectors.map(sector => ({
    id: `climate-${sector.toLowerCase()}`,
    descriptor: {
      name: `${sector} Climate Verification`,
      short_desc: `Verified MRV and GIC issuance for ${sector.toLowerCase()} climate assets`,
    },
  }));

  const items = methodologies.map(methodologyToBecknItem);

  return {
    descriptor: {
      name: 'GreenPe Climate Verification Rail',
      short_desc: 'Carbon UPI open protocol — Identity-bound MRV + GIC issuance',
      long_desc:
        'Carbon UPI is the digital public infrastructure for climate action verification in India. ' +
        'GreenPe is the enterprise execution layer on top. ' +
        'This network provides deterministic, auditable MRV using government-approved emission factors ' +
        'and issues Green Impact Certificates (GICs) as programmable climate proof artifacts.',
      code: 'CARBON-UPI-V1',
    },
    providers: [
      {
        ...GREENPE_BNP,
        categories,
        items,
        tags: [
          { 'carbon-upi:version': '1.0.0' },
          { 'carbon-upi:protocol': 'Carbon UPI' },
          { 'carbon-upi:patent': 'Provisional Spec IN/PA 3385, Dec 2025' },
          { 'carbon-upi:methodologies': methodologies.map(m => m.id).join(',') },
          { 'carbon-upi:hash_algorithm': 'SHA-256' },
          { 'carbon-upi:beckn_role': 'BNP — Beckn Network Provider' },
          { 'carbon-upi:ondc_compatible': 'true' },
          { 'carbon-upi:energy_beckn_compatible': 'true' },
        ],
      },
    ],
  };
}

// ──────────────────────────────────────────────────────────────
// Adapter: Parse Beckn search intent → filter parameters
// ──────────────────────────────────────────────────────────────

export interface BecknSearchIntent {
  sector?: string;
  assetType?: string;
  methodologyId?: string;
}

export function parseBecknSearchIntent(
  message: Record<string, unknown>
): BecknSearchIntent {
  const intent = (message?.intent ?? {}) as Record<string, unknown>;
  const category = (intent?.category ?? {}) as Record<string, unknown>;
  const item = (intent?.item ?? {}) as Record<string, unknown>;
  const descriptor = (item?.descriptor ?? {}) as Record<string, unknown>;
  const tags = (descriptor?.tags ?? []) as Record<string, string>[];

  const tagMap: Record<string, string> = {};
  tags.forEach(t => Object.assign(tagMap, t));

  return {
    sector: (category as Record<string, Record<string, string>>)?.descriptor?.name?.split(' ')[0] ?? tagMap['carbon-upi:sector'],
    assetType: tagMap['carbon-upi:asset_type'],
    methodologyId: descriptor?.code as string ?? tagMap['carbon-upi:methodology_id'],
  };
}

// ──────────────────────────────────────────────────────────────
// Adapter: Build Beckn order from verification result
// ──────────────────────────────────────────────────────────────

export function buildBecknOrder(params: {
  orderId: string;
  status: string;
  methodologyId: string;
  gic?: GreenImpactCertificate;
}): BecknOrder {
  const order: BecknOrder = {
    id: params.orderId,
    status: params.status,
    provider: { id: GREENPE_BNP.id },
    items: [{ id: `carbon-upi-${params.methodologyId.toLowerCase()}` }],
    quote: { price: { currency: 'INR', value: '0.00' } },
  };

  if (params.gic) {
    order.fulfillment = gicToBecknFulfillment(params.gic, params.orderId);
    order.documents = [gicToBecknDocument(params.gic)];
  }

  return order;
}
