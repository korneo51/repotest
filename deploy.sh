#!/usr/bin/env bash
# ============================================================
# deploy.sh — Déploie Steel Cutter Tycoon sur le LXC steelcutter
# Usage : ./deploy.sh <ip_du_lxc>
# Exemple : ./deploy.sh 192.168.10.116
# ============================================================
set -euo pipefail

LXC_IP="${1:?Usage: ./deploy.sh <ip_du_lxc>}"
SSH="ssh root@${LXC_IP}"
APP_DIR="/opt/steelcutter"
WEB_DIR="/var/www/steelcutter"

echo "==> Build du frontend…"
cd "$(dirname "$0")/steel-cutter-app"
npm ci --prefer-offline 2>/dev/null || npm install
npm run build

echo "==> Envoi du frontend vers ${LXC_IP}:${WEB_DIR}…"
$SSH "mkdir -p ${WEB_DIR}"
rsync -av --delete dist/ "root@${LXC_IP}:${WEB_DIR}/"
# www-data doit pouvoir lire dist/ (scp/rsync depuis Windows peuvent laisser des dossiers en 700)
$SSH "chmod 755 ${WEB_DIR} ${WEB_DIR}/assets 2>/dev/null || true; find ${WEB_DIR} -type f -exec chmod 644 {} + 2>/dev/null || true"

echo "==> Envoi de l'API…"
$SSH "mkdir -p ${APP_DIR}/api ${APP_DIR}/data"
rsync -av --delete ../api/ "root@${LXC_IP}:${APP_DIR}/api/"

echo "==> Installation des dépendances Node.js…"
$SSH "cd ${APP_DIR}/api && npm install --omit=dev"

echo "==> (Re)démarrage de l'API avec pm2 (NODE_ENV=production + JWT_SECRET)…"
$SSH "cd ${APP_DIR}/api && (test -f .jwt_secret && grep -q '^JWT_SECRET=' .jwt_secret || printf 'JWT_SECRET=%s\\n' \"\$(openssl rand -hex 32)\" > .jwt_secret) && set -a && . ./.jwt_secret && set +a && export NODE_ENV=production && pm2 delete steelcutter-api 2>/dev/null || true; pm2 start ${APP_DIR}/api/server.js --name steelcutter-api --cwd ${APP_DIR}/api && pm2 save"

echo "==> Configuration nginx…"
rsync -av ../nginx/steelcutter.conf "root@${LXC_IP}:/etc/nginx/sites-available/steelcutter"
$SSH "ln -sf /etc/nginx/sites-available/steelcutter /etc/nginx/sites-enabled/steelcutter 2>/dev/null || true"
$SSH "nginx -t && systemctl reload nginx"

echo ""
echo "✓ Déploiement terminé. Vérifie : http://${LXC_IP}/"
echo "  (HTTPS / domaine : Nginx Proxy Manager sur LXC 110 → voir DEPLOY.md)"
