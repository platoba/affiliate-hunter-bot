-- S1 Affiliate Bot - Database Schema

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  telegram_id   BIGINT UNIQUE NOT NULL,
  username      VARCHAR(255),
  tier          VARCHAR(20) DEFAULT 'free',  -- free / pro
  daily_queries INT DEFAULT 0,
  last_query_at DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS links (
  id             SERIAL PRIMARY KEY,
  user_id        INT REFERENCES users(id),
  original_url   TEXT NOT NULL,
  affiliate_url  TEXT NOT NULL,
  platform       VARCHAR(50) NOT NULL,       -- partnermatic / linkhaitao / aliexpress
  commission_rate DECIMAL(5,2),
  product_name   VARCHAR(500),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clicks (
  id         SERIAL PRIMARY KEY,
  link_id    INT REFERENCES links(id),
  ip_hash    VARCHAR(64),
  user_agent TEXT,
  referer    TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commissions (
  id          SERIAL PRIMARY KEY,
  link_id     INT REFERENCES links(id),
  user_id     INT REFERENCES users(id),
  platform    VARCHAR(50) NOT NULL,
  order_id    VARCHAR(255),
  amount      DECIMAL(10,2) NOT NULL,
  currency    VARCHAR(10) DEFAULT 'USD',
  status      VARCHAR(20) DEFAULT 'pending', -- pending / confirmed / paid
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_commissions_user_id ON commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
