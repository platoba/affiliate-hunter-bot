// Telegram Bot - Grammy
import { Bot, Context } from 'grammy';
import { config } from '../config.js';
import { ensureUser, checkQuota, saveLink } from '../db/pool.js';
import { searchAll, generateBestLink, getHotProducts } from '../services/affiliate.js';
import { getStatsByTelegramId } from '../services/stats.js';

export function createBot(): Bot {
  const bot = new Bot(config.bot.token);

  // /start
  bot.command('start', async (ctx: Context) => {
    await ctx.reply(
      `🤖 *AI联盟推广助手*\n\n` +
      `帮你一键查询多平台佣金，生成最优推广链接。\n\n` +
      `📋 *命令列表:*\n` +
      `/search <URL或关键词> — 查询各平台佣金率\n` +
      `/link <URL> — 生成最优推广链接\n` +
      `/hot — 今日高佣热门商品\n` +
      `/stats — 个人推广统计\n\n` +
      `🆓 免费版: 每日10次查询\n` +
      `💎 Pro版: 无限查询 + 高级分析\n\n` +
      `支持平台: PartnerMatic · LinkHaiTao · AliExpress`,
      { parse_mode: 'Markdown' }
    );
  });

  // /search <query>
  bot.command('search', async (ctx: Context) => {
    const query = ctx.match as string;
    if (!query) {
      await ctx.reply('用法: /search <商品URL或关键词>\n例: /search wireless earbuds');
      return;
    }

    const tgUser = ctx.from!;
    const userId = await ensureUser(tgUser.id, tgUser.username);
    const withinQuota = await checkQuota(userId);
    if (!withinQuota) {
      await ctx.reply('⚠️ 今日免费查询次数已用完 (10/10)\n升级Pro版享受无限查询: /upgrade');
      return;
    }

    await ctx.reply('🔍 正在查询多平台佣金...');

    const results = await searchAll(query);
    if (results.length === 0) {
      await ctx.reply('❌ 未找到相关结果，请尝试其他关键词或URL');
      return;
    }

    const lines = results.slice(0, 8).map((r, i) => {
      const rate = r.commissionRate ? `${r.commissionRate}%` : 'N/A';
      const coupon = r.couponCode ? `🎫 ${r.couponCode}` : '';
      return `${i + 1}. *${r.platform}* | ${r.productName}\n   佣金: ${rate} ${coupon}\n   🔗 ${r.affiliateUrl || r.productUrl}`;
    });

    await ctx.reply(
      `📊 *佣金查询结果* (${results.length}条)\n\n${lines.join('\n\n')}`,
      { parse_mode: 'Markdown', link_preview_options: { is_disabled: true } }
    );
  });

  // /link <url>
  bot.command('link', async (ctx: Context) => {
    const url = (ctx.match as string)?.trim();
    if (!url || !/^https?:\/\//i.test(url)) {
      await ctx.reply('用法: /link <商品URL>\n例: /link https://www.amazon.com/dp/B09V3KXJPB');
      return;
    }

    const tgUser = ctx.from!;
    const userId = await ensureUser(tgUser.id, tgUser.username);
    const withinQuota = await checkQuota(userId);
    if (!withinQuota) {
      await ctx.reply('⚠️ 今日免费次数已用完');
      return;
    }

    await ctx.reply('🔗 正在生成最优推广链接...');

    const result = await generateBestLink(url);
    if (!result || !result.affiliateUrl) {
      await ctx.reply('❌ 无法为该URL生成推广链接，该商品可能不在联盟平台中');
      return;
    }

    await saveLink(userId, url, result.affiliateUrl, result.platform, result.commissionRate, result.productName);

    const rate = result.commissionRate ? `${result.commissionRate}%` : '待确认';
    await ctx.reply(
      `✅ *推广链接已生成*\n\n` +
      `📦 平台: ${result.platform}\n` +
      `💰 佣金率: ${rate}\n` +
      `🔗 推广链接:\n${result.affiliateUrl}`,
      { parse_mode: 'Markdown', link_preview_options: { is_disabled: true } }
    );
  });

  // /hot
  bot.command('hot', async (ctx: Context) => {
    await ctx.reply('🔥 正在获取今日高佣热门商品...');

    const products = await getHotProducts();
    if (products.length === 0) {
      await ctx.reply('暂无热门商品数据，请稍后再试');
      return;
    }

    const lines = products.map((p, i) =>
      `${i + 1}. *${p.name}*\n   ${p.platform} | 佣金 ${p.commissionRate}%\n   🔗 ${p.url}`
    );

    await ctx.reply(
      `🔥 *今日高佣热门* (${products.length})\n\n${lines.join('\n\n')}`,
      { parse_mode: 'Markdown', link_preview_options: { is_disabled: true } }
    );
  });

  // /stats
  bot.command('stats', async (ctx: Context) => {
    const tgUser = ctx.from!;
    const stats = await getStatsByTelegramId(tgUser.id);

    if (!stats) {
      await ctx.reply('📊 暂无数据，使用 /search 或 /link 开始推广吧！');
      return;
    }

    await ctx.reply(
      `📊 *推广统计*\n\n` +
      `🔗 生成链接: ${stats.totalLinks}\n` +
      `👆 总点击: ${stats.totalClicks}\n` +
      `💰 转化次数: ${stats.totalConversions}\n` +
      `💵 总收入: $${stats.totalRevenue}\n\n` +
      `📋 *最近链接:*\n` +
      (stats.recentLinks.length > 0
        ? stats.recentLinks.map((l) => `  • ${l.clicks}次点击 | ${l.url}`).join('\n')
        : '  暂无'),
      { parse_mode: 'Markdown', link_preview_options: { is_disabled: true } }
    );
  });

  // Error handler
  bot.catch((err) => {
    console.error('[Bot] Error:', err);
  });

  return bot;
}
