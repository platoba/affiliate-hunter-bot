# AffiliateHunter Bot 🤖

> AI-powered multi-platform affiliate commission finder. Paste any product URL, get the best affiliate deal instantly.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-26A5E4.svg)](https://core.telegram.org/bots)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

## 🎮 Try It Now

**Live Demo → [@affiliate_hunter_demo_bot](https://t.me/affiliate_hunter_demo_bot)**

Send `/start` to try it instantly — no setup needed.

---

## What It Does

AffiliateHunter searches multiple affiliate networks simultaneously to find the **highest commission rate** for any product.

```
You: /search https://www.nike.com/air-max-90

Bot: 🔍 Found 3 affiliate programs for Nike:
     
     PartnerMatic  → 8.5% commission
     LinkHaiTao    → 6.2% commission  
     Awin          → 5.0% commission
     
     🏆 Best deal: PartnerMatic (8.5%)
     💰 Estimated: $8.50 per $100 sale
```

### Supported Networks
- 🔗 **PartnerMatic** — 21,000+ brands, global coverage
- 🔗 **LinkHaiTao** — 10,000+ coupons, Asia-Pacific focus
- 🔗 **AliExpress Affiliate** — extensible plugin
- 🔌 **Easy to add more** — Awin, CJ, Impact, Rakuten, ShareASale...

## Features

| Command | Description |
|---------|-------------|
| `/search <url>` | Compare commission rates across all networks |
| `/link <url>` | Generate the highest-paying affiliate link |
| `/hot` | Today's top commission products |
| `/stats` | Your personal click/conversion/revenue dashboard |

**Plus:**
- 📊 REST API for programmatic access
- 🗄️ PostgreSQL storage for tracking & analytics
- 🐳 One-command Docker deployment
- ⚡ Redis caching for instant responses

## Quick Start

```bash
# Clone
git clone https://github.com/platoba/affiliate-hunter-bot.git
cd affiliate-hunter-bot

# Configure
cp .env.example .env
# Edit .env with your API keys and bot token

# Run with Docker (recommended)
docker compose up -d

# Or run locally
npm install
npm run build
npm start
```

## Environment Variables

```env
BOT_TOKEN=your_telegram_bot_token
DATABASE_URL=postgresql://user:pass@localhost:5432/affiliate_hunter
PARTNERMATIC_TOKEN=your_token
PARTNERMATIC_CHANNEL=your_channel
LINKHAITAO_TOKEN=your_token
LINKHAITAO_MEDIUM_ID=your_medium_id
```

## REST API

Base URL: `http://localhost:3300`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/search` | Search commissions for a product URL |
| `POST` | `/api/link` | Generate best affiliate link |
| `GET` | `/api/hot` | Top commission products today |
| `GET` | `/api/stats/:userId` | User statistics |

### Example

```bash
curl -X POST http://localhost:3300/api/search \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.nike.com/air-max-90"}'
```

## Architecture

```
┌─────────────────┐
│  Telegram Bot    │  Grammy framework
│  (User Interface)│
└────────┬────────┘
         ↓
┌─────────────────┐
│  Fastify API     │  REST endpoints (:3300)
│  (Core Engine)   │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Affiliate Search │  Parallel multi-network search
│ ├─ PartnerMatic  │
│ ├─ LinkHaiTao    │
│ └─ AliExpress    │
└────────┬────────┘
         ↓
┌─────────────────┐
│  PostgreSQL      │  Tracking & analytics
│  Redis           │  Caching & rate limiting
└─────────────────┘
```

## Adding New Networks

Create a new service in `src/services/`:

```typescript
// src/services/networks/awin.ts
export async function searchAwin(query: string) {
  const response = await fetch(`https://api.awin.com/...`);
  return [{ merchant: 'Nike', commission: 5.0, url: '...' }];
}
```

Register it in `src/services/affiliate.ts` — done.

## Use Cases

- **Affiliate Marketers** — Find the best commission for any product instantly
- **Content Creators** — Generate optimized affiliate links for reviews
- **E-commerce Teams** — Track which networks pay the most
- **Telegram Communities** — Share monetized product links

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 20 + TypeScript |
| Bot Framework | Grammy |
| API | Fastify |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Deploy | Docker Compose |

## Roadmap

- [x] Multi-network search (PartnerMatic, LinkHaiTao)
- [x] Telegram Bot interface
- [x] REST API
- [x] Docker deployment
- [ ] Web dashboard
- [ ] Webhook notifications for price drops
- [ ] Browser extension
- [ ] Awin / CJ / Impact integrations

## Contributing

PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT © 2026

---

**⭐ Star this repo if you find it useful!**

Made with ❤️ by [platoba](https://github.com/platoba)
