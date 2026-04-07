# Déploiement — Steel Cutter Tycoon

## Architecture

```
Internet
  └── jeu.elucidescape.fr
        └── LXC 110 (nginx reverse proxy + SSL)
              └── LXC steelcutter :80
                    ├── Nginx  → sert /var/www/steelcutter (build React)
                    │            proxy /api/ → localhost:3001
                    └── Node.js :3001 (Express + SQLite)
```

**Proxmox host** : `192.168.10.100`
**LXC 110** : nginx reverse proxy existant
**LXC steelcutter** : à créer (ID libre à déterminer, ex: 115)

---

## Étape 1 — Créer le LXC steelcutter

Depuis le Proxmox host (SSH ou console) :

```bash
# Repérer un ID libre, le storage et le template disponible
pct list
pvesm status
pveam list local   # chercher debian-12-standard ou ubuntu-22.04

# Créer le LXC (adapter ID, template, storage)
pct create 115 local:vztmpl/debian-12-standard_12.7-1_amd64.tar.zst \
  --hostname steelcutter \
  --cores 2 \
  --memory 512 \
  --swap 512 \
  --storage local-lvm \
  --rootfs local-lvm:8 \
  --net0 name=eth0,bridge=vmbr0,ip=dhcp \
  --unprivileged 1 \
  --onboot 1

pct start 115
sleep 5
pct exec 115 -- hostname -I   # noter l'IP (ex: 192.168.10.115)
```

---

## Étape 2 — Bootstrap (Node.js 20 + nginx + pm2)

```bash
pct exec 115 -- bash -c "
  apt update -q &&
  apt install -y curl gnupg2 nginx &&
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - &&
  apt install -y nodejs &&
  npm install -g pm2 &&
  mkdir -p /opt/steelcutter/api /opt/steelcutter/data /var/www/steelcutter
"
```

---

## Étape 3 — Build et déploiement

### 3a. Build du frontend React (machine de dev)

```bash
cd steel-cutter-app && npm install && npm run build
```

### 3b. Envoi du frontend

```bash
tar czf /tmp/sc-dist.tar.gz -C steel-cutter-app/dist .
pct push 115 /tmp/sc-dist.tar.gz /tmp/sc-dist.tar.gz
pct exec 115 -- bash -c "tar xzf /tmp/sc-dist.tar.gz -C /var/www/steelcutter"
```

### 3c. Envoi de l'API

```bash
tar czf /tmp/sc-api.tar.gz -C api .
pct push 115 /tmp/sc-api.tar.gz /tmp/sc-api.tar.gz
pct exec 115 -- bash -c "
  tar xzf /tmp/sc-api.tar.gz -C /opt/steelcutter/api &&
  cd /opt/steelcutter/api && npm install --omit=dev
"
```

### 3d. Démarrage de l'API avec pm2

```bash
pct exec 115 -- bash -c "
  pm2 start /opt/steelcutter/api/server.js --name steelcutter-api &&
  pm2 save &&
  env PATH=\$PATH:/usr/bin pm2 startup systemd -u root --hp /root | tail -1 | bash
"
```

---

## Étape 4 — Nginx LXC steelcutter

```bash
pct push 115 nginx/steelcutter.conf /etc/nginx/sites-available/steelcutter
pct exec 115 -- bash -c "
  ln -sf /etc/nginx/sites-available/steelcutter /etc/nginx/sites-enabled/steelcutter &&
  rm -f /etc/nginx/sites-enabled/default &&
  nginx -t && systemctl reload nginx
"
```

Vérification :

```bash
pct exec 115 -- curl -s http://localhost/api/leaderboard   # → []
pct exec 115 -- curl -sI http://localhost/                 # → 200 OK
```

---

## Étape 5 — Reverse proxy LXC 110

Remplacer `192.168.10.115` par l'IP réelle du LXC steelcutter.

```bash
pct exec 110 -- bash -c "cat > /etc/nginx/sites-available/jeu.elucidescape.fr << 'NGINX'
server {
    listen 80;
    server_name jeu.elucidescape.fr;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name jeu.elucidescape.fr;

    ssl_certificate     /etc/letsencrypt/live/jeu.elucidescape.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jeu.elucidescape.fr/privkey.pem;

    location / {
        proxy_pass         http://192.168.10.115:80;
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto https;
    }
}
NGINX
ln -sf /etc/nginx/sites-available/jeu.elucidescape.fr /etc/nginx/sites-enabled/ &&
nginx -t && systemctl reload nginx"
```

---

## Vérification finale

```bash
curl -s https://jeu.elucidescape.fr/api/leaderboard   # → []
curl -sI https://jeu.elucidescape.fr/                 # → HTTP/2 200
```

Ouvrir `https://jeu.elucidescape.fr` → écran de login Steel Cutter ✓

---

## Redéploiement (mise à jour de l'app)

```bash
./deploy.sh <IP_LXC_STEELCUTTER>
# Build Vite + rsync + pm2 restart + nginx reload — tout automatique
```

---

## Structure des fichiers sur le LXC

| Chemin | Contenu |
|--------|---------|
| `/var/www/steelcutter/` | Build React (index.html + assets) |
| `/opt/steelcutter/api/` | Code Node.js (server.js, db.js…) |
| `/opt/steelcutter/data/game.db` | Base SQLite (joueurs, sauvegardes, classement) |

### Variables d'environnement (optionnelles)

```bash
PORT=3001                          # port de l'API (défaut : 3001)
DATA_DIR=/opt/steelcutter/data     # dossier de la BDD SQLite
```
