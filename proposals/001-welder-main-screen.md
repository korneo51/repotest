# Proposal 001 — Soudeuse accessible depuis l'écran principal

Source : document Drive `Jeu collab / Bugs/Améliorations`.

## Demande
Pouvoir utiliser la soudeuse directement depuis l'écran principal, sans devoir passer par l'écran d'inventaire.

## Problème actuel
- la soudeuse n'est utilisable que dans le flux `Inventaire`
- cela rajoute des taps inutiles
- on perd la continuité quand on optimise des chutes pendant la production

## Résultat attendu
- accès direct à la soudeuse depuis l'écran principal
- sélection rapide de deux chutes compatibles
- feedback visuel clair si les profils ne correspondent pas
- bouton de soudure visible seulement quand la combinaison est valide

## Critères d'acceptation
- si la soudeuse est achetée, un bloc compact apparaît sur l'écran principal
- seules les chutes vides et soudables sont proposées
- on peut sélectionner/désélectionner deux chutes
- deux profils différents doivent être refusés clairement
- la soudure crée une nouvelle chute selon la règle actuelle
- le flux existant dans l'inventaire reste cohérent ou est supprimé si redondant

## Notes d'implémentation suggérées
- extraire la logique de sélection de soudure dans un helper commun
- réutiliser `weldSel` et `doWeld`
- afficher le module dans la zone principale au-dessus de la liste des barres
