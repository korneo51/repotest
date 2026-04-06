# Steel Cutter Tycoon

Version Vite/React du prototype, prête à lancer localement ou dans Docker.

## Lancer en dev
```bash
npm install
npm run dev
```

## Build production
```bash
npm install
npm run build
npm run preview
```

## Docker
```bash
docker compose up -d --build
```

Le conteneur expose le jeu sur le port `8080`.

## Déploiement conseillé sur Proxmox
- lancer ce projet dans un LXC/VM Docker
- publier ensuite derrière Nginx Proxy Manager ou ton reverse proxy vers `jeu.elucidescape.fr`

## Prochaines étapes produit
- sauvegarde persistante
- analytics
- refactor de la logique
- onboarding
- monétisation légère
