// Fastify API Server
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from '../config.js';
import { searchAll, generateBestLink, getHotProducts } from '../services/affiliate.js';
import { getUserStats } from '../services/stats.js';
import { ensureUser, saveLink } from '../db/pool.js';

export async function createApi() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true });

  // Health check
  app.get('/health', async () => ({ status: 'ok', service: 's1-affiliate-bot' }));

  // POST /api/search - Multi-platform commission search
  app.post<{ Body: { query: string; userId?: number } }>('/api/search', async (req, reply) => {
    const { query } = req.body;
    if (!query) return reply.code(400).send({ error: 'query is required' });

    const results = await searchAll(query);
    return { results, count: results.length };
  });

  // POST /api/link - Generate affiliate link
  app.post<{ Body: { url: string; telegramId: number } }>('/api/link', async (req, reply) => {
    const { url, telegramId } = req.body;
    if (!url) return reply.code(400).send({ error: 'url is required' });

    const result = await generateBestLink(url);
    if (!result) return reply.code(404).send({ error: 'No affiliate link available for this URL' });

    // Save if user provided
    if (telegramId) {
      const userId = await ensureUser(telegramId);
      await saveLink(userId, url, result.affiliateUrl!, result.platform, result.commissionRate, result.productName);
    }

    return { link: result };
  });

  // GET /api/stats/:userId
  app.get<{ Params: { userId: string } }>('/api/stats/:userId', async (req, reply) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return reply.code(400).send({ error: 'Invalid userId' });

    const stats = await getUserStats(userId);
    return { stats };
  });

  // GET /api/hot - Hot high-commission products
  app.get('/api/hot', async () => {
    const products = await getHotProducts();
    return { products, count: products.length };
  });

  return app;
}

export async function startApi() {
  const app = await createApi();
  await app.listen({ port: config.api.port, host: config.api.host });
  console.log(`[API] Listening on ${config.api.host}:${config.api.port}`);
  return app;
}
