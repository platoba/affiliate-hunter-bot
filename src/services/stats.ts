// User stats service
import pool from '../db/pool.js';
import type { UserStats } from '../types.js';

export async function getUserStats(userId: number): Promise<UserStats> {
  const [linksRes, clicksRes, commissionsRes, recentRes] = await Promise.all([
    pool.query('SELECT COUNT(*) as count FROM links WHERE user_id = $1', [userId]),
    pool.query(
      `SELECT COUNT(*) as count FROM clicks c
       JOIN links l ON c.link_id = l.id
       WHERE l.user_id = $1`,
      [userId]
    ),
    pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count
       FROM commissions WHERE user_id = $1 AND status != 'pending'`,
      [userId]
    ),
    pool.query(
      `SELECT l.affiliate_url as url, COUNT(c.id) as clicks, l.created_at
       FROM links l
       LEFT JOIN clicks c ON c.link_id = l.id
       WHERE l.user_id = $1
       GROUP BY l.id
       ORDER BY l.created_at DESC
       LIMIT 5`,
      [userId]
    ),
  ]);

  return {
    userId: String(userId),
    totalLinks: parseInt(linksRes.rows[0].count),
    totalClicks: parseInt(clicksRes.rows[0].count),
    totalConversions: parseInt(commissionsRes.rows[0].count),
    totalRevenue: commissionsRes.rows[0].total,
    recentLinks: recentRes.rows.map((r: { url: string; clicks: string; created_at: string }) => ({
      url: r.url,
      clicks: parseInt(r.clicks),
      createdAt: r.created_at,
    })),
  };
}

export async function getStatsByTelegramId(telegramId: number): Promise<UserStats | null> {
  const res = await pool.query('SELECT id FROM users WHERE telegram_id = $1', [telegramId]);
  if (res.rows.length === 0) return null;
  return getUserStats(res.rows[0].id);
}
