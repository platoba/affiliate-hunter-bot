// Shared types for S1 Affiliate Bot

export interface AffiliateResult {
  platform: string;
  productName: string;
  productUrl: string;
  affiliateUrl?: string;
  commissionRate?: number;
  commissionAmount?: string;
  currency?: string;
  couponCode?: string;
  couponValue?: string;
  expiresAt?: string;
  raw?: unknown;
}

export interface SearchQuery {
  query: string; // URL or keyword
  userId?: string;
}

export interface LinkRequest {
  url: string;
  userId: string;
}

export interface UserStats {
  userId: string;
  totalLinks: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: string;
  recentLinks: { url: string; clicks: number; createdAt: string }[];
}

export interface HotProduct {
  platform: string;
  name: string;
  url: string;
  commissionRate: number;
  category?: string;
}
