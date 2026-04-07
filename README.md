# Steel Cutter Tycoon

Prototype de jeu de gestion publié sur GitHub Pages.

**v0.2** : déblocage des profilés par réputation ★, missions urgentes avec timer, gains ajustés, **prix d’achat et ferraille cohérents avec le poids réel** (€/kg par profilé, revente liée au prix matière), affichage en euros entiers.

## Liens
- Jeu en ligne : `https://korneo51.github.io/repotest/`
- Code source : `steel-cutter-app/`
- Version publiée : `docs/`

## Mise à jour de GitHub Pages
Depuis `steel-cutter-app/` :

```bash
node ./node_modules/vite/bin/vite.js build
rm -rf ../docs/*
cp -r dist/* ../docs/
touch ../docs/.nojekyll
```

Puis depuis la racine du repo :

```bash
git add docs
 git commit -m "Update Pages build"
 git push
```
