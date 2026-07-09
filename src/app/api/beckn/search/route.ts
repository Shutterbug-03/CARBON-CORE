/**
 * POST /api/beckn/search
 *
 * Beckn BPP — on_search handler
 *
 * When a BAP sends a search request to find climate verification services,
 * this endpoint returns the full Carbon UPI methodology catalog.
 *
 * BAP can filter by:
 *   - message.intent.category.descriptor.name → sector filter (Energy, Agriculture, etc.)
 *   - message.intent.item.descriptor.tags["carbon-upi:asset_type"] → asset type filter
 *
 * Response: Beckn catalog with all matching methodology items.
 *
 * Architecture (Beckn Integration doc):
 *   BAP → /search → BPP (GreenPe) → on_search callback → BAP
 */

import { NextRequest, NextResponse } from 'next/server';

import { createSignedAck } from '@/lib/beckn/core';
import { dispatchBecknCallback, getPilotSharedSecret } from '@/lib/beckn/transport';
import { buildBecknCatalog, parseBecknSearchIntent } from '@/lib/beckn/adapter';
import { appendBecknTransaction } from '@/lib/pilot/store';
import { createId } from '@/lib/pilot/utils';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const context = payload.context ?? {};

  // Log inbound transaction
  appendBecknTransaction({
    id: createId('beckn'),
    action: 'search',
    direction: 'inbound',
    createdAt: new Date().toISOString(),
    context,
    payload,
    status: 'ACK',
  });

  // Parse search intent — filter catalog by sector/asset type if present
  const intent = parseBecknSearchIntent(payload.message ?? {});
  const catalog = buildBecknCatalog({
    filterSector: intent.sector,
    filterAssetType: intent.assetType,
  });

  // Async callback to BAP
  await dispatchBecknCallback({
    action: 'on_search',
    context,
    callbackUrl: context.bap_uri,
    message: { catalog },
  });

  // Sync ACK response
  const signed = createSignedAck({
    context,
    payload: { message: { catalog } },
    sharedSecret: getPilotSharedSecret(),
  });

  return NextResponse.json(signed.body);
}
