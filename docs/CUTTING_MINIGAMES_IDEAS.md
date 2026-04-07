# Brainstorming - Mini-jeux de Découpe

> **Objectif** : Remplacer le mini-jeu unique (curseur oscillant) par des mécaniques variées, immersives et adaptées à chaque outil de coupe. Chaque scie doit offrir une expérience différente qui reflète la réalité de l'outil.

---

## Principes de design

| Principe | Description |
|----------|-------------|
| **Cohérence outil** | Chaque scie a sa propre mécanique de jeu, inspirée de la réalité |
| **Accessibilité** | Jouable confortablement à la souris ET au tactile |
| **Anti-redondance** | Événements aléatoires, variantes, et difficulté progressive |
| **Feedback sensoriel** | Retour visuel + sonore immédiat (vibration tactile si disponible) |
| **Impact gameplay** | La qualité de coupe affecte : coût, satisfaction client, usure outil |

---

## 1. Scie Manuelle (Niveau 0)

### Phase 1 — Mesure et Traçage

**Mécanique** : Le joueur doit mesurer et marquer le trait de coupe sur la barre.

- Un mètre ruban apparaît sur la barre d'acier
- Le joueur **clique/glisse** pour dérouler le mètre depuis une extrémité
- Il doit **relâcher** à la bonne longueur (affichée dans la commande)
- Une tolérance est affichée (ex : ±2mm)
- Un **crayon/marqueur** trace automatiquement le trait à l'endroit relâché
- **Scoring** : écart en mm entre la mesure du joueur et la cote demandée

**Variantes tactile/souris** :
- Souris : clic maintenu + déplacement horizontal, relâcher pour valider
- Tactile : glisser le doigt le long de la barre, lever pour valider

### Phase 2 — Sciage

**Mécanique** : Mouvements de va-et-vient pour scier, en restant sur le trait.

- La barre est vue en coupe (profil latéral, zoom sur la zone de coupe)
- Le trait de coupe tracé en phase 1 est visible (ligne pointillée)
- Le joueur doit faire des **mouvements verticaux** (haut → bas → haut) avec la souris/le doigt
- La scie avance dans le métal **uniquement** si le mouvement est correct (amplitude et rythme)
- Un **indicateur de déviation horizontale** montre si la lame dérive du trait
  - Le joueur peut corriger en décalant légèrement la souris/le doigt à gauche/droite
- Une **jauge de progression** montre l'avancement de la coupe (0% → 100%)
- La vitesse de coupe dépend du rythme : trop rapide = perte de contrôle, trop lent = fatigue

**Scoring** :
- Déviation moyenne par rapport au trait → qualité de coupe
- Nombre de corrections nécessaires → temps passé
- Combinaison phase 1 + phase 2 → multiplicateur de coût final

### Événements aléatoires

| Événement | Effet | Réaction joueur |
|-----------|-------|-----------------|
| **Lame cassée** | La lame se brise en plein sciage. Coût de remplacement (petit montant). La progression reprend là où elle s'est arrêtée | Le joueur doit cliquer "Remplacer la lame" puis reprendre le sciage |
| **Blessure légère** | La main glisse. Écran flash rouge, léger malus de précision pendant 3s | Le joueur doit continuer mais avec un tremblement visuel accru |
| **Acier plus dur que prévu** | Le profilé est plus résistant. La progression ralentit de 30% | Le joueur doit maintenir un bon rythme plus longtemps |
| **Trait effacé** | Le trait de coupe s'efface partiellement (poussière de métal) | Le joueur doit deviner/estimer la trajectoire dans la zone effacée |
| **Crampe** | Après 60% de progression, les mouvements deviennent moins réactifs pendant 2s | Patience : ralentir le rythme pour garder la précision |

---

## 2. Scie à Ruban (Niveau 1)

### Mécanique — Guidage de Découpe

**Concept** : Le joueur guide la barre d'acier à travers la lame fixe de la scie à ruban.

- Vue de dessus : la lame (verticale, fixe) est au centre de l'écran
- La barre arrive depuis la gauche, posée sur la table de la scie
- Le joueur **maintient le clic/toucher** et **pousse la barre** vers la lame
- Il doit maintenir une **vitesse d'avance constante** (ni trop vite, ni trop lent)
  - Jauge de vitesse avec zone verte optimale
  - Trop vite → la lame force, dévie, coupe oblique
  - Trop lent → lame surchauffe, usure prématurée
- En même temps, le joueur doit **maintenir la barre droite** :
  - La barre tend à dévier (gauche/droite) aléatoirement
  - Le joueur corrige en décalant légèrement la souris/le doigt perpendiculairement
- Un **trait de guidage** (laser) est affiché pour la trajectoire idéale

**Scoring** :
- Régularité de la vitesse d'avance → qualité de coupe
- Déviation latérale moyenne → précision
- Temps total → efficacité

**Variantes tactile/souris** :
- Souris : clic maintenu, pousser vers le haut (avance) + corrections latérales
- Tactile : glisser vers le haut avec un doigt, corriger avec de légers écarts latéraux

### Événements aléatoires

| Événement | Effet | Réaction joueur |
|-----------|-------|-----------------|
| **Lame qui déraille** | La lame de ruban sort de sa poulie. Pause de 2s + petit coût | Attendre le recalibrage, reprendre prudemment |
| **Vibrations anormales** | La machine vibre, la barre tremble sur la table | Réduire la vitesse d'avance pour stabiliser |
| **Noeud dans l'acier** | Zone de résistance accrue à un point de la coupe | Ralentir à ce passage précis sinon déviation forte |
| **Liquide de refroidissement vide** | La lame chauffe, déviation progressive si on ne ralentit pas | Réduire la vitesse de 50% pendant 3s |
| **Éclat de métal** | Un éclat est projeté, flash d'avertissement | Pas d'impact gameplay, mais maintient la tension narrative |

---

## 3. Scie Circulaire (Niveau 2)

### Mécanique — Puissance Contrôlée

**Concept** : Le joueur abaisse la lame circulaire sur la barre fixée, en contrôlant la pression et l'alignement.

- Vue latérale : la barre est bridée sur la table, la lame est au-dessus
- **Étape 1 — Alignement** : Le joueur positionne la lame au-dessus du trait de coupe
  - Glisser la lame horizontalement pour l'aligner avec le repère
  - Valider quand le trait de la lame coïncide avec le trait de coupe
- **Étape 2 — Descente** : Le joueur abaisse la lame progressivement
  - Glisser vers le bas (souris/tactile) pour descendre la lame
  - **Jauge de pression** : zone verte = pression optimale
    - Trop forte → étincelles excessives, usure disque, risque de rebond
    - Trop faible → coupe lente, lame qui patine
  - La coupe est **rapide** mais demande un contrôle constant de la pression
- **Retour visuel** : gerbe d'étincelles proportionnelle à la pression (effet particules)
- Durée courte (~3-5s de gameplay actif) : la scie circulaire est efficace

**Scoring** :
- Précision de l'alignement initial → qualité des bords
- Régularité de la pression → propreté de coupe
- Pas de rebond déclenché → bonus

**Variantes tactile/souris** :
- Souris : glisser horizontalement (alignement), puis verticalement (descente) avec pression = vitesse de mouvement
- Tactile : même principe, pression simulée par la vitesse du glissement

### Événements aléatoires

| Événement | Effet | Réaction joueur |
|-----------|-------|-----------------|
| **Rebond de lame (kickback)** | Si pression trop forte trop vite, la lame rebondit. Dégâts possibles sur la pièce, malus qualité | Reprendre l'approche plus doucement |
| **Disque fissuré** | Le disque se fissure. Coût de remplacement. Coupe annulée, à recommencer | Cliquer "Changer le disque", recommencer la coupe |
| **Bavure excessive** | La coupe est réussie mais laisse une grosse bavure | Mini QTE rapide pour ébavurer (clic rapide × 3) |
| **Étincelle sur matériau inflammable** | Un chiffon/carton prend feu à côté | Le joueur doit rapidement cliquer sur l'extincteur avant de reprendre |
| **Bride mal serrée** | La barre bouge pendant la coupe, décalage soudain | Le joueur doit relâcher, resserrer (clic), puis reprendre |

---

## 4. Scie CNC (Niveau 3) — Supervision

### Mécanique — Programme et Surveillance

**Concept** : La CNC coupe automatiquement, mais le joueur supervise et intervient si nécessaire. Pas de mini-jeu systématique, mais des événements ponctuels.

- **Mode normal** : La coupe est automatique avec animation (barre de progression). Le joueur valide simplement. Multiplicateur = 1.0 (parfait).
- **Mode incident** (aléatoire, ~15-20% de chance) : Un événement survient et le joueur doit réagir.

### Événements de supervision

| Événement | Mécanique | Conséquence si ignoré |
|-----------|-----------|----------------------|
| **Erreur de programme** | Un écran affiche le G-code avec une erreur surlignée. Le joueur doit identifier la bonne correction parmi 3 choix | Coupe décalée, pièce perdue |
| **Usure outil détectée** | Alerte capteur. Le joueur choisit : continuer (risque) ou changer l'outil (coût + délai) | Si continue : 50% chance de coupe ratée |
| **Capteur bloqué** | La machine s'arrête. Le joueur doit recalibrer en alignant deux repères visuels | Perte de temps (max cuts/jour réduit de 1) |
| **Bourrage de copeaux** | Les copeaux s'accumulent. Le joueur doit cliquer pour souffler/aspirer avant reprise | Machine bloquée, coupe impossible |
| **Panne électrique** | Écran noir 1s, puis la machine redémarre. Le joueur doit relancer la séquence | Perte du programme en cours, recommencer |

---

## Système de qualité global

### Grades de coupe

| Grade | Condition | Effet |
|-------|-----------|-------|
| **S — Parfait** | Toutes les phases quasi-parfaites | Coût ×0.4, client très satisfait (+rep bonus) |
| **A — Excellent** | Très bonne précision, pas d'incident | Coût ×0.6, client satisfait |
| **B — Correct** | Précision moyenne, quelques déviations | Coût ×1.0, client neutre |
| **C — Médiocre** | Coupe déviée ou lente | Coût ×1.5, client mécontent |
| **D — Raté** | Coupe complètement ratée | Coût ×2.0, pièce potentiellement perdue, -rep |

### Impact sur la satisfaction client

- Chaque commande a un **score de qualité moyen** (moyenne des grades de chaque coupe)
- Un client avec des coupes parfaites laisse un **pourboire** (bonus argent)
- Un client avec des coupes médiocres peut **refuser la commande** (perte sèche)
- Les clients réguliers se souviennent de la qualité passée (petit historique)

---

## Éléments de variété transversaux

### Difficulté progressive

- **Jour 1-5** : Barres faciles (profilés simples, coupes droites)
- **Jour 6-15** : Profilés plus complexes, tolérances plus serrées
- **Jour 16+** : Commandes multi-coupes rapides, événements plus fréquents

### Bonus de combo

- Enchaîner 3 coupes "A" ou mieux → **bonus combo** : réduction coût de la coupe suivante
- Enchaîner 5 coupes parfaites → **"Main d'or"** : bonus réputation + notification visuelle

### Fatigue de l'opérateur

- Après N coupes dans la journée, un léger tremblement apparaît (augmente progressivement)
- Simule la fatigue physique réelle
- Incite le joueur à gérer son planning (ne pas tout faire en un jour)
- La fatigue se réinitialise chaque nouveau jour

### Tutoriel contextuel

- Première utilisation de chaque scie → mini-tutoriel intégré (3-4 étapes guidées)
- Les contrôles sont expliqués visuellement avec des animations de main/souris
- Le tutoriel ne se rejoue pas sauf si demandé (bouton "?" sur l'écran de coupe)

---

## Résumé des mécaniques par scie

| Scie | Mécanique principale | Durée | Difficulté | Interactivité |
|------|---------------------|-------|------------|---------------|
| **Manuelle** | Mesurer + va-et-vient en suivant un trait | 8-15s | Facile mais demande du rythme | Haute |
| **Ruban** | Guider la barre à vitesse constante | 6-10s | Moyenne, double attention (vitesse + direction) | Haute |
| **Circulaire** | Aligner puis descente contrôlée | 3-5s | Courte mais exigeante en précision | Moyenne |
| **CNC** | Supervision + réaction aux incidents | 1-3s (ou 5s si incident) | Faible sauf incidents | Faible (ponctuelle) |

---

## Notes techniques d'implémentation

- **Architecture** : Créer un composant par type de scie (`ManualSawGame`, `BandSawGame`, `CircularSawGame`, `CncSawGame`) orchestrés par un `CuttingMiniGame` parent qui dispatch selon `sawLv`
- **Input unifié** : Utiliser les Pointer Events (`onPointerDown`, `onPointerMove`, `onPointerUp`) pour un comportement identique souris/tactile
- **Animation** : `requestAnimationFrame` pour les mouvements fluides, CSS transitions pour les feedbacks visuels
- **Son** : Prévoir des hooks audio (`useSound`) pour chaque action (sciage, étincelles, alerte, casse)
- **Événements** : Système de tirage aléatoire pondéré, avec probabilité croissante selon le jour et le nombre de coupes déjà faites
- **Performance mobile** : Canvas 2D pour les effets de particules (étincelles), limiter à 30fps sur mobile si nécessaire
