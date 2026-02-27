# AffiliateHunter Bot 🤖

> AI-powered multi-platform affiliate commission finder. Paste any product URL, get the best affiliate deal instantly.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-26A5E4.svg)](https://core.telegram.org/bots)

## What It Does

AffiliateHunter is a Telegram bot + REST API that searches multiple affiliate networks simultaneously to find the highest commission rate for any product.

**Paste a product URL → Get commission rates from all networks → Generate the best affiliate link**

### Supported Networks
- 🔗 PartnerMatic (21,000+ brands)
- 🔗 LinkHaiTao (10,000+ coupons)
- 🔗 AliExpress Affiliate (extensible)
- 🔗 Easy to add more (Awin, CJ, Impact, Rakuten...)

## Features

- `/search <url>` — Compare commission rates across all networks
- `/link <url>` — Generate the highest-paying affiliate link
- `/hot` — Today's top commission products
- `/stats` — Your personal click/conversion/revenue dashboard
- REST API for programmatic access
- PostgreSQL storage for tracking & analytics
- Docker-ready deployment

## Quick Start

```bash
# Clone
git clone https://github.com/platoba/affiliate-hunter-bot.git
cd affiliate-hunter-bot

# Configure
cp .env.example .env
# Edit .env with your API keys and bot token

# Run with Docker
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

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/search` | Search commissions for a product URL |
| POST | `/api/link` | Generate best affiliate link |
| GET | `/api/hot` | Top commission products today |
| GET | `/api/stats/:userId` | User statistics |

## Architecture

```
Telegram Bot (Grammy)
       ↓
  Fastify API (:3300)
       ↓
  Affiliate Services
  ├── PartnerMatic
  ├── LinkHaiTao
  └── AliExpress
       ↓
  PostgreSQL (tracking)
```

## Adding New Networks

Create a new service in `src/services/`:

```typescript
export async function searchMyNetwork(query: string) {
  // Your API integration
  return [{ merchant, commission, url }];
}
```

Then register it in `src/services/affiliate.ts`.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Bot**: Grammy (Telegram Bot Framework)
- **API**: Fastify
- **Database**: PostgreSQL
- **Deploy**: Docker Compose

## License

MIT © 2026
