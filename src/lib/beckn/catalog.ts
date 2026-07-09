/**
 * GreenPe Beckn Catalog
 *
 * Dynamic — built from Carbon UPI methodology registry.
 * NOT a hardcoded static object.
 *
 * Exported:
 *   becknCatalog — default catalog (all methodologies)
 *   buildDynamicCatalog — filter by sector/asset type
 */

export { buildBecknCatalog as buildDynamicCatalog } from './adapter';

// Default catalog (all 5 methodologies, all sectors)
import { buildBecknCatalog } from './adapter';
export const becknCatalog = buildBecknCatalog();
