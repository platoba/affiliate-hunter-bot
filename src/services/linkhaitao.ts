// LinkHaiTao API Client
import { config } from '../config.js';
import type { AffiliateResult } from '../types.js';

const { baseUrl, token, mediumId } = config.linkhaitao;

interface LHTResponse {
  success: boolean;
  data?: Array<{
    advertiser_name: string;
    commission: string;
    commission_type: string;
    tracking_link: string;
    landing_page: string;
    coupon_code?: string;
    coupon_description?: string;
    start_date?: string;
    end_date?: string;
  }>;
  message?: string;
}

export async function searchLinkHaiTao(query: string): Promise<AffiliateResult[]> {
  if (!token) return [];

  try {
    const params = new URLSearchParams({
      token,
      medium_id: mediumId,
      keyword: query,
      page: '1',
      page_size: '10',
    });

    const res = await fetch(`${baseUrl}/coupons?${params}`);
    const json = (await res.json()) as LHTResponse;
    if (!json.success || !json.data) return [];

    return json.data.map((item) => ({
      platform: 'LinkHaiTao',
      productName: item.advertiser_name,
      productUrl: item.landing_page,
      affiliateUrl: item.tracking_link,
      commissionRate: parseFloat(item.commission) || undefined,
      couponCode: item.coupon_code,
      couponValue: item.coupon_description,
      expiresAt: item.end_date,
      raw: item,
    }));
  } catch (err) {
    console.error('[LinkHaiTao] search error:', err);
    return [];
  }
}

export async function generateLinkHaiTaoLink(url: string): Promise<AffiliateResult | null> {
  if (!token) return null;

  try {
    const params = new URLSearchParams({
      token,
      medium_id: mediumId,
      url,
    });

    const res = await fetch(`${baseUrl}/deeplink?${params}`);
    const json = (await res.json()) as { success: boolean; data?: { tracking_link?: string } };
    if (!json.success || !json.data?.tracking_link) return null;

    return {
      platform: 'LinkHaiTao',
      productName: '',
      productUrl: url,
      affiliateUrl: json.data.tracking_link,
    };
  } catch (err) {
    console.error('[LinkHaiTao] deeplink error:', err);
    return null;
  }
}
