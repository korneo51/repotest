# Déploiement — Steel Cutter Tycoon

## Architecture

```
Internet
  └── jeu.elucidescape.fr
        └── LXC 110 — Nginx Proxy Manager (SSL, reverse proxy)
              └── LXC steelcutter :80
                    ├── Nginx  → sert /var/www/steelcutter (build React)
                    │            proxy /api/ → localhost:3001
                    └── Node.js :3001 (Express + SQLite)
```

**Proxmox host** : `192.168.10.100`  
**LXC 110** (`proxy`) : Nginx Proxy Manager — IP LAN typique `192.168.10.111` (vérifier avec `pct exec 110 -- hostname -I`). Interface d’admin NPM : **`http://<IP_LXC_110>:81`**.  
**LXC steelcutter** : conteneur dédié (ex. VMID `116`). **IP LAN fixe** : `192.168.10.116` (effective après le prochain reboot une fois la config réseau appliquée — voir étape 1). **Pas** le KVM `115` « ElucidSpace ».

---

## Étape 1 — Créer le LXC steelcutter

Depuis le Proxmox host (SSH ou console) :

```bash
# Repérer un ID libre, le storage et le template disponible
pct list
pvesm status
pveam list local   # chercher debian-12-standard ou ubuntu-22.04

# Créer le LXC (adapter ID, template, storage — ex. debian-12-standard_12.12-1)
# Réseau : IP fixe 192.168.10.116 (remplace gw= par la passerelle LAN réelle, souvent .1)
pct create 116 local:vztmpl/debian-12-standard_12.12-1_amd64.tar.zst \
  --hostname steelcutter \
  --cores 2 \
  --memory 512 \
  --swap 512 \
  --storage local-lvm \
  --rootfs local-lvm:8 \
  --net0 name=eth0,bridge=vmbr0,ip=192.168.10.116/24,gw=192.168.10.1 \
  --unprivileged 1 \
  --onboot 1

# Si le CT existait déjà en DHCP, basculer en fixe puis redémarrer :
# pct set 116 -net0 name=eth0,bridge=vmbr0,ip=192.168.10.116/24,gw=192.168.10.1
# pct reboot 116

pct start 116
sleep 5
pct exec 116 -- hostname -I   # doit afficher 192.168.10.116 après reboot / pct set
```

---

## Étape 2 — Bootstrap (Node.js 20 + nginx + pm2)

```bash
pct exec 116 -- bash -c "
  apt update -q &&
  apt install -y curl gnupg2 nginx openssh-server &&
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
pct push 116 /tmp/sc-dist.tar.gz /tmp/sc-dist.tar.gz
pct exec 116 -- bash -c "tar xzf /tmp/sc-dist.tar.gz -C /var/www/steelcutter"
```

### 3c. Envoi de l'API

```bash
tar czf /tmp/sc-api.tar.gz -C api .
pct push 116 /tmp/sc-api.tar.gz /tmp/sc-api.tar.gz
pct exec 116 -- bash -c "
  tar xzf /tmp/sc-api.tar.gz -C /opt/steelcutter/api &&
  cd /opt/steelcutter/api && npm install --omit=dev
"
```

### 3d. Démarrage de l'API avec pm2

```bash
pct exec 116 -- bash -c "
  pm2 start /opt/steelcutter/api/server.js --name steelcutter-api &&
  pm2 save &&
  env PATH=\$PATH:/usr/bin pm2 startup systemd -u root --hp /root | tail -1 | bash
"
```

---

## Étape 4 — Nginx LXC steelcutter

```bash
pct push 116 nginx/steelcutter.conf /etc/nginx/sites-available/steelcutter
pct exec 116 -- bash -c "
  ln -sf /etc/nginx/sites-available/steelcutter /etc/nginx/sites-enabled/steelcutter &&
  rm -f /etc/nginx/sites-enabled/default &&
  nginx -t && systemctl reload nginx
"
```

Vérification :

```bash
pct exec 116 -- curl -s http://localhost/api/leaderboard   # → []
pct exec 116 -- curl -sI http://localhost/                 # → 200 OK
```

---

## Étape 5 — Nginx Proxy Manager (LXC 110)

Ne pas éditer les vhosts nginx à la main sur le LXC 110 : tout passe par **Nginx Proxy Manager**.

1. Ouvre l’interface NPM : `http://192.168.10.111:81` (ou la première IPv4 affichée par `pct exec 110 -- hostname -I`).
2. **Hosts** → **Proxy Hosts** → **Add Proxy Host**.
3. Onglet **Details** :
   - **Domain Names** : `jeu.elucidescape.fr`
   - **Scheme** : `http`
   - **Forward Hostname / IP** : `192.168.10.116` (IP fixe du LXC steelcutter)
   - **Forward Port** : `80`
   - Coche **Websockets Support** (recommandé).
   - **Block Common Exploits** : optionnel.
4. Onglet **SSL** :
   - **SSL Certificate** : demander un certificat **Let’s Encrypt** (email valide, DNS du domaine doit pointer vers l’IP publique qui atteint le LXC 110).
   - Coche **Force SSL** et en général **HTTP/2 Support** si proposé.

Aucun **Custom Location** n’est obligatoire : le fichier `nginx/steelcutter.conf` sur le LXC steelcutter sert déjà la SPA et proxifie `/api/` vers Node en local.

Si un ancien vhost `jeu.elucidescape.fr` avait été ajouté hors NPM sur le 110, supprime-le ou désactive-le pour éviter les conflits avec NPM.

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
./deploy.sh 192.168.10.116
# Build Vite + rsync + pm2 restart + nginx reload — tout automatique
```

---

## Structure des fichiers sur le LXC

| Chemin | Contenu |
|--------|---------|
| `/var/www/steelcutter/` | Build React (index.html + assets) |
| `/opt/steelcutter/api/` | Code Node.js (server.js, db.js…) |
| `/opt/steelcutter/data/game.db` | Base SQLite (joueurs, sauvegardes, classement) |

### Variables d'environnement

```bash
PORT=3001                          # port de l'API (défaut : 3001)
DATA_DIR=/opt/steelcutter/data     # dossier de la BDD SQLite
NODE_ENV=production                # en prod : obligatoire avec JWT_SECRET
JWT_SECRET=<chaîne_longue_secrète> # signature des JWT (connexion) — requis si NODE_ENV=production
```

Après modification des deps Node sur le LXC : `cd /opt/steelcutter/api && npm install --omit=dev` puis `pm2 restart steelcutter-api`.

**Auth** : comptes avec pseudo + mot de passe (bcrypt) ; sessions JWT (~30 j). Les comptes créés avant cette évolution ont `password_hash` vide : à la première connexion, l’API renvoie `NEEDS_PASSWORD` et le client propose de définir un mot de passe (`POST /set-password`).

### Dépannage — écran blanc alors que `index.html` charge

Si `/assets/*.js` renvoie du **HTML** au lieu de **JavaScript**, nginx ne voit pas les fichiers (souvent dossier `assets` en **700** après copie depuis Windows). Sur le LXC :

```bash
chmod 755 /var/www/steelcutter /var/www/steelcutter/assets
find /var/www/steelcutter -type f -exec chmod 644 {} +
```

Le script `./deploy.sh` applique ces permissions après `rsync`.
