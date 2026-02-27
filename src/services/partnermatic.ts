// PartnerMatic API Client
// Docs: POST https://api.partnermatic.com/api/coupon
import { config } from '../config.js';
import type { AffiliateResult } from '../types.js';

const { baseUrl, token, channel } = config.partnermatic;

interface PMCouponResponse {
  code: number;
  message: string;
  data?: {
    list?: Array<{
      advertiser_name: string;
      coupon_code: string;
      coupon_value: string;
      coupon_type: string;
      start_date: string;
      end_date: string;
      landing_url: string;
      tracking_url: string;
      commission_rate?: string;
      description?: string;
    }>;
  };
}

export async function searchPartnerMatic(query: string): Promise<AffiliateResult[]> {
  if (!token) return [];

  try {
    const res = await fetch(`${baseUrl}/coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        channel,
        keyword: query,
        page: 1,
        page_size: 10,
      }),
    });

    const json = (await res.json()) as PMCouponResponse;
    if (json.code !== 200 || !json.data?.list) return [];

    return json.data.list.map((item) => ({
      platform: 'PartnerMatic',
      productName: item.advertiser_name,
      productUrl: item.landing_url,
      affiliateUrl: item.tracking_url,
      commissionRate: item.commission_rate ? parseFloat(item.commission_rate) : undefined,
      couponCode: item.coupon_code,
      couponValue: item.coupon_value,
      expiresAt: item.end_date,
      raw: item,
    }));
  } catch (err) {
    console.error('[PartnerMatic] search error:', err);
    return [];
  }
}

export async function generatePartnerMaticLink(url: string): Promise<AffiliateResult | null> {
  if (!token) return null;

  try {
    const res = await fetch(`${baseUrl}/deeplink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, channel, url }),
    });

    const json = (await res.json()) as { code: number; data?: { tracking_url?: string } };
    if (json.code !== 200 || !json.data?.tracking_url) return null;

    return {
      platform: 'PartnerMatic',
      productName: '',
      productUrl: url,
      affiliateUrl: json.data.tracking_url,
    };
  } catch (err) {
    console.error('[PartnerMatic] deeplink error:', err);
    return null;
  }
}
