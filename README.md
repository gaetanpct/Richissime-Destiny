# Picuite Games

Le site qui réunit tous les jeux, avec une page d'accueil pour choisir.

Jeux inclus pour l'instant, Gaeboub-up (plateau à la Monopoly), Goliathicus (stratégie et bluff) et Richissime Destiny (simulation de vie entre amis).

## Lancer en local

    npm install
    npm start

Puis ouvrir localhost, port 3000, dans le navigateur.

## Déployer sur Render

1. Pousser ce dossier sur un dépôt GitHub.
2. Sur Render, créer un Web Service relié au dépôt.
3. Build Command, npm install.
4. Start Command, npm start.
5. Render fournit la variable PORT tout seul.

Une seule adresse sert tout le site. Les jeux sont sur /gaeboub-up, /goliathicus et /richissime. La route /health répond quand le serveur est vivant.

## Organisation

- server.js, le serveur du site, il découvre et monte automatiquement chaque jeu.
- public/, la page d'accueil (index.html, style.css, app.js), les logos dans public/logos et le petit bouton de retour pg-back.js.
- games/, un dossier par jeu. Chaque dossier contient son server.js, son dossier public, ses éventuels dossiers lib, et un fichier game.json qui sert à la présentation sur l'accueil.

## Une seule base de code

Ce dépôt est la seule source de vérité. Une modification faite dans games/gaeboub-up, games/goliathicus ou games/richissime s'applique directement au site Picuite Games, il n'y a pas de deuxième script à tenir à jour. Les anciens dépôts séparés de chaque jeu ne servent plus.

## Ajouter un nouveau jeu plus tard

1. Créer un dossier dans games/ au nom du jeu, par exemple games/mon-jeu.
2. Y mettre un server.js qui exporte une fonction mount(server, prefix) renvoyant un routeur Express. Le serveur Socket.io du jeu doit utiliser le chemin prefix + "/socket.io", et le client doit se connecter avec ce même chemin.
3. Ajouter un game.json (nom, accroche, présentation, étapes, couleurs, ordre) en copiant celui d'un autre jeu.
4. Déposer son logo en SVG dans public/logos/ sous le nom de son dossier, par exemple mon-jeu.svg.
5. Ajouter dans la page index.html du jeu le script /pg-back.js pour avoir le bouton de retour vers l'accueil.

La carte du jeu apparaît toute seule sur l'accueil, à la place réservée.
