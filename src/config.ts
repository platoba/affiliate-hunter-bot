import 'dotenv/config';

export const config = {
  bot: {
    token: process.env.BOT_TOKEN || '',
  },
  db: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/s1_affiliate',
  },
  api: {
    port: parseInt(process.env.API_PORT || '3300'),
    host: process.env.API_HOST || '0.0.0.0',
  },
  partnermatic: {
    baseUrl: 'https://api.partnermatic.com/api',
    token: process.env.PARTNERMATIC_TOKEN || '',
    channel: process.env.PARTNERMATIC_CHANNEL || '',
  },
  linkhaitao: {
    baseUrl: 'https://api.linkhaitao.com/v2',
    token: process.env.LINKHAITAO_TOKEN || '',
    mediumId: process.env.LINKHAITAO_MEDIUM_ID || '',
  },
  aliexpress: {
    apiKey: process.env.ALIEXPRESS_API_KEY || '',
    trackingId: process.env.ALIEXPRESS_TRACKING_ID || '',
    digitalSign: process.env.ALIEXPRESS_DIGITAL_SIGN || '',
  },
} as const;
