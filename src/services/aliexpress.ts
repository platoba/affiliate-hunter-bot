// AliExpress Affiliate API Client (Stub)
// NOTE: The old AliExpress Affiliate API is deprecated.
// This is a placeholder for the new Taobao Open Platform API.
// Implement when API credentials are obtained.
import { config } from '../config.js';
import type { AffiliateResult } from '../types.js';

const { apiKey } = config.aliexpress;

export async function searchAliExpress(query: string): Promise<AffiliateResult[]> {
  if (!apiKey) {
    console.log('[AliExpress] No API key configured, skipping');
    return [];
  }

  // TODO: Implement with new Taobao Open Platform API
  // Reference: https://open.aliexpress.com/
  // Operations: aliexpress.affiliate.product.query
  //             aliexpress.affiliate.link.generate
  console.log('[AliExpress] API not yet implemented, query:', query);
  return [];
}

export async function generateAliExpressLink(url: string): Promise<AffiliateResult | null> {
  if (!apiKey) return null;

  // TODO: Implement aliexpress.affiliate.link.generate
  console.log('[AliExpress] Link generation not yet implemented, url:', url);
  return null;
}
