// S1 Affiliate Bot - Entry Point
import { createBot } from './bot/index.js';
import { startApi } from './api/index.js';
import pool from './db/pool.js';

async function main() {
  // Verify DB connection
  try {
    await pool.query('SELECT 1');
    console.log('[DB] Connected');
  } catch (err) {
    console.error('[DB] Connection failed:', err);
    process.exit(1);
  }

  // Start Fastify API
  await startApi();

  // Start Telegram Bot
  const bot = createBot();
  bot.start({
    onStart: () => console.log('[Bot] Started'),
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down...');
    bot.stop();
    await pool.end();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
