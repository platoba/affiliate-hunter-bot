// Affiliate Orchestrator - coordinates multi-platform queries
import type { AffiliateResult, HotProduct } from '../types.js';
import { searchPartnerMatic, generatePartnerMaticLink } from './partnermatic.js';
import { searchLinkHaiTao, generateLinkHaiTaoLink } from './linkhaitao.js';
import { searchAliExpress, generateAliExpressLink } from './aliexpress.js';

// Detect if input is a URL
function isUrl(input: string): boolean {
  return /^https?:\/\//i.test(input.trim());
}

// Detect platform from URL
function detectPlatform(url: string): string | null {
  if (/aliexpress\.com/i.test(url)) return 'aliexpress';
  if (/amazon\./i.test(url)) return 'amazon';
  return null; // generic - try all
}

// Search across all platforms
export async function searchAll(query: string): Promise<AffiliateResult[]> {
  const results = await Promise.allSettled([
    searchPartnerMatic(query),
    searchLinkHaiTao(query),
    searchAliExpress(query),
  ]);

  const all: AffiliateResult[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') all.push(...r.value);
  }

  // Sort by commission rate descending
  return all.sort((a, b) => (b.commissionRate ?? 0) - (a.commissionRate ?? 0));
}

// Generate best affiliate link for a URL
export async function generateBestLink(url: string): Promise<AffiliateResult | null> {
  const platform = detectPlatform(url);

  // If AliExpress URL, try AliExpress first
  if (platform === 'aliexpress') {
    const ae = await generateAliExpressLink(url);
    if (ae) return ae;
  }

  // Try all platforms in parallel
  const results = await Promise.allSettled([
    generatePartnerMaticLink(url),
    generateLinkHaiTaoLink(url),
    generateAliExpressLink(url),
  ]);

  const valid: AffiliateResult[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) valid.push(r.value);
  }

  if (valid.length === 0) return null;

  // Return the one with highest commission rate, or first available
  return valid.sort((a, b) => (b.commissionRate ?? 0) - (a.commissionRate ?? 0))[0];
}

// Get hot products (high commission) from all platforms
export async function getHotProducts(): Promise<HotProduct[]> {
  // Search trending keywords across platforms
  const keywords = ['electronics deals', 'fashion sale', 'beauty discount', 'home gadgets'];
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

  const results = await searchAll(randomKeyword);

  return results
    .filter((r) => r.commissionRate && r.commissionRate > 0)
    .slice(0, 10)
    .map((r) => ({
      platform: r.platform,
      name: r.productName,
      url: r.affiliateUrl || r.productUrl,
      commissionRate: r.commissionRate!,
      category: randomKeyword,
    }));
}
