#!/bin/bash
set -euo pipefail

# S1 Affiliate Bot - Deploy Script
# Target: 43.160.251.119

SERVER="43.160.251.119"
PROJECT="s1-affiliate-bot"
REMOTE_DIR="/opt/$PROJECT"

echo "🚀 Deploying $PROJECT to $SERVER..."

# 1. Sync files to server
echo "📦 Syncing files..."
rsync -avz --exclude='node_modules' --exclude='dist' --exclude='.env' \
  ./ root@$SERVER:$REMOTE_DIR/

# 2. Build and start on server
echo "🔨 Building and starting..."
ssh root@$SERVER << 'EOF'
  cd /opt/s1-affiliate-bot

  # Ensure .env exists
  if [ ! -f .env ]; then
    echo "⚠️  .env not found! Copy .env.example and configure:"
    echo "    cp .env.example .env && nano .env"
    exit 1
  fi

  # Build and start
  docker compose down || true
  docker compose build --no-cache
  docker compose up -d

  echo "✅ Deployed! Checking status..."
  docker compose ps
  sleep 3
  docker compose logs --tail=20 bot
EOF

echo "✅ Deploy complete!"
echo "   API: http://$SERVER:3300/health"
