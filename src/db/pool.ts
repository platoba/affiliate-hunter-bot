import pg from 'pg';
import { config } from '../config.js';

const pool = new pg.Pool({ connectionString: config.db.url });

pool.on('error', (err) => {
  console.error('Unexpected PG pool error:', err);
});

export default pool;

// Ensure user exists, return internal user id
export async function ensureUser(telegramId: number, username?: string): Promise<number> {
  const res = await pool.query(
    `INSERT INTO users (telegram_id, username)
     VALUES ($1, $2)
     ON CONFLICT (telegram_id) DO UPDATE SET username = COALESCE($2, users.username), updated_at = NOW()
     RETURNING id`,
    [telegramId, username ?? null]
  );
  return res.rows[0].id;
}

// Check and increment daily query count (free tier: 10/day)
export async function checkQuota(userId: number): Promise<boolean> {
  const res = await pool.query(
    `UPDATE users
     SET daily_queries = CASE
       WHEN last_query_at = CURRENT_DATE THEN daily_queries + 1
       ELSE 1
     END,
     last_query_at = CURRENT_DATE
     WHERE id = $1
     RETURNING daily_queries, tier`,
    [userId]
  );
  const { daily_queries, tier } = res.rows[0];
  return tier === 'pro' || daily_queries <= 10;
}

// Save generated affiliate link
export async function saveLink(
  userId: number,
  originalUrl: string,
  affiliateUrl: string,
  platform: string,
  commissionRate?: number,
  productName?: string
): Promise<number> {
  const res = await pool.query(
    `INSERT INTO links (user_id, original_url, affiliate_url, platform, commission_rate, product_name)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [userId, originalUrl, affiliateUrl, platform, commissionRate ?? null, productName ?? null]
  );
  return res.rows[0].id;
}
