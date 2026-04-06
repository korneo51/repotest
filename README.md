# Steel Cutter Tycoon

Prototype de jeu de gestion publié sur GitHub Pages.

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
