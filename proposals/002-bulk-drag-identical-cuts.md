# Proposal 002 — Drag and drop multiple identical cuts at once

Source : document Drive `Jeu collab / Bugs/Améliorations`.

## Demande
Quand on glisse-dépose une coupe qui existe plusieurs fois dans une commande, le jeu doit placer directement plusieurs exemplaires si la barre le permet.

## Problème actuel
- un drag ne place qu'une seule pièce
- pour une commande avec quantité > 1, il faut répéter inutilement la même action
- cela ralentit le jeu et casse le confort d'utilisation

## Résultat attendu
- un seul drag place autant de pièces identiques que possible sur la barre cible
- la limite est le nombre restant à planifier pour cette coupe
- la limite est aussi l'espace réellement disponible sur la barre

## Critères d'acceptation
- si une coupe a une quantité de 4 et que 0 sont planifiées, un drag peut en placer plusieurs d'un coup
- si la barre ne peut en contenir que 2, seules 2 sont ajoutées
- si 3 sont déjà planifiées sur 4, un drag n'en ajoute qu'1 au maximum
- les largeurs de coupe doivent rester prises en compte
- le feedback utilisateur doit indiquer combien de pièces ont été ajoutées
- si aucune pièce ne peut être ajoutée, un message d'erreur clair doit rester affiché

## Notes d'implémentation suggérées
- remplacer l'assignation unitaire par une assignation en lot
- calculer le nombre restant pour `orderId + pieceIdx`
- boucler tant que la barre accepte encore une pièce identique
- réutiliser la logique existante de compatibilité de profil et d'espace disponible
