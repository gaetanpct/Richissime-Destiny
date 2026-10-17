# Richissime Destiny

Un jeu de vie en ligne pour 1 à 6 joueurs. Tu vis une vie entière, du CP jusqu'à la tombe, avec des choix qui s'enchaînent, des événements absurdes et des actions envers les autres joueurs. À la fin, tout le monde note la vie des autres.

## Lancer le jeu

Il faut Node 18 ou plus récent.

```
npm install
npm start
```

Le jeu écoute ensuite sur le port 3000, ou sur le port donné par la variable PORT. Sur Render, la commande de démarrage est `npm start`.

## Organisation

Le dossier lib contient le moteur et tout le contenu du jeu (scènes, choix de vie, onglet Professionnel, filières d'études, actions entre joueurs, causes de mort). Il ne part jamais vers le navigateur. Le dossier public contient l'interface.

Les fichiers de scènes et de choix sont chargés depuis une liste écrite dans les fichiers index.js des dossiers content et choices. Si tu ajoutes un fichier, pense à l'ajouter à cette liste.

## Mettre à jour le dépôt

Avant de déposer une nouvelle version, supprime les anciens dossiers lib et public du dépôt pour ne garder aucun fichier périmé.
