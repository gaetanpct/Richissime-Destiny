# Richissime Destiny

Un jeu de vie en ligne pour 1 à 6 joueurs, ou en solo. Chaque joueur vit un personnage fictif de l'enfance jusqu'à la mort, une année par tour. À la fin, celui qui a la plus grosse fortune gagne.

## Lancer en local

    npm install
    npm start

Puis ouvrir localhost, port 3000, dans le navigateur.

## Déployer sur Render

1. Pousser ce dossier sur un dépôt GitHub.
2. Sur Render, créer un Web Service relié au dépôt.
3. Build Command, `npm install`.
4. Start Command, `npm start`.
5. Render fournit la variable PORT toute seule, rien d'autre à régler.

La route /health répond quand le serveur est vivant.

## Organisation

- server.js, le serveur Express et Socket.io (salons, connexions, tchat).
- lib/, le moteur et tout le contenu des scènes. Ces fichiers ne sont jamais envoyés au navigateur, ce qui évite les spoilers.
- lib/view.js, construit pour chaque joueur uniquement ce qu'il a le droit de voir.
- public/, l'interface (HTML, CSS, JavaScript simple).

## Contenu

Plus de 560 scènes, 71 métiers, des maladies rares, des stars inventées et les prénoms de la bande d'amis. Le réglage Prénoms de la bande se trouve dans le salon.

## Réglages utiles

Tous les réglages de partie se font dans le salon, par l'hôte, avec une explication sous chaque option. Pour les tests, la variable d'environnement RICHISSIME_TIME_SCALE accélère les chronos.
