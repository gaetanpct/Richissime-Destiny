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
- gaeboub-up/, goliathicus/ et richissime/, un dossier par jeu directement à la racine, sans dossier games. Chaque dossier contient son server.js, son dossier public, ses éventuels dossiers lib, et un fichier game.json qui sert à la présentation sur l'accueil. Tout dossier de la racine qui contient un server.js et un game.json est reconnu comme un jeu (sauf public et node_modules).

Pour envoyer le projet sur GitHub, il suffit de déposer chaque dossier séparément (gaeboub-up, goliathicus, richissime, public), puis les fichiers de la racine. Chaque envoi reste sous la limite de 100 fichiers.

## Une seule base de code

Ce dépôt est la seule source de vérité. Une modification faite dans gaeboub-up, goliathicus ou richissime s'applique directement au site Picuite Games, il n'y a pas de deuxième script à tenir à jour. Les anciens dépôts séparés de chaque jeu ne servent plus.

## Ajouter un nouveau jeu plus tard

1. Créer un dossier à la racine au nom du jeu, par exemple mon-jeu.
2. Y mettre un server.js qui exporte une fonction mount(server, prefix) renvoyant un routeur Express. Le serveur Socket.io du jeu doit utiliser le chemin prefix + "/socket.io", et le client doit se connecter avec ce même chemin.
3. Ajouter un game.json (nom, accroche, présentation, étapes, couleurs, ordre) en copiant celui d'un autre jeu.
4. Déposer son logo en SVG dans public/logos/ sous le nom de son dossier, par exemple mon-jeu.svg.
5. Ajouter dans la page index.html du jeu le script /pg-back.js pour avoir le bouton de retour vers l'accueil.

La carte du jeu apparaît toute seule sur l'accueil, à la place réservée.

## Richissime Destiny, mise à jour

Troisième mise à jour de Richissime Destiny, pour des parties moins moyennes.

- Des destins extrêmes. Chacun place son argent de son côté. Seuls de rares krachs touchent tout le monde d'un coup, dont un grand krach très rare qui frappe aussi l'immobilier et les entreprises. Le livret ne rapporte parfois rien, les cryptos font perdre le plus souvent mais peuvent être multipliées par plus de dix, et il existe des jackpots de start-ups et d'entreprises. Deux voies mènent à des fortunes indécentes, de plusieurs centaines de millions à des milliards. La voie légale est une chaîne d'étapes (scale-up, groupe national, bourse, marché mondial, première entreprise du monde). La voie illégale passe par la mafia, le poste de parrain puis un cartel. Chaque étape ouvre la suivante, et à tout moment un empire peut s'effondrer d'un coup ou un réseau tomber avec des peines de prison très lourdes. Des choix comme le pari fou et l'emprunt démesuré donnent aussi des fins en dettes énormes.
- Des réactions. Quand on a été volé, calomnié, trompé ou arnaqué, on peut porter plainte l'année suivante, et démentir une rumeur. Après une partie perdue, on peut demander une revanche, double ou rien. Ces réactions ne sont pas proposées à chaque fois.
- Du blackjack pour de vrai. Quand un défi de blackjack est accepté, une table s'ouvre avec de vraies cartes tirées dans un paquet. Chacun tire ou reste, et le plus proche de 21 gagne. La main de l'adversaire n'est jamais envoyée avant la fin. Les robots et les absents jouent à ta place avec une stratégie simple. Il n'y a plus de poker et plus de réglage à ce sujet. On mise toujours de l'argent, la somme est choisie par celui qui lance le défi, et un robot ne peut pas refuser.
- Des scènes collectives irrégulières. Le tirage est aléatoire, avec parfois deux années de suite puis plusieurs années sans rien, mais jamais plus de sept années sans scène. Cinq années sans scène arrivent rarement au réglage normal. Le réglage propose Fréquentes, Normales, Peu fréquentes et Rares. Les enjeux suivent la fortune des joueurs présents, avec parfois un coup exceptionnel.
- Des habitudes qui comptent. Répéter la salle de sport, une formation, la lecture, une langue ou le théâtre installe des qualités, avec des paliers à trois, six et dix ans et des déclics aléatoires. La salle de sport fait grimper le charme, une formation fait grimper l'intelligence, et les stats influencent les salaires proposés.

Quatrième mise à jour, pensée pour plus de cohérence et de rapidité.

- Moins de réglages. La partie commence toujours à 8 ans, et le réglage de l'âge de départ a disparu. Par défaut, il n'y a pas de limite de temps pour noter une vie, on peut se noter soi-même, les thèmes adultes et les coups bas sont autorisés, et l'héritage entre joueurs est désactivé.
- Une nouvelle bande de prénoms. Les personnages secondaires portent plus souvent les prénoms de la bande (environ quatre sur cinq au réglage par défaut), avec la nouvelle liste.
- Des centres d'intérêt qui se construisent. Chaque année passée sur un domaine (sport, arts, musique, vidéo, études, affaires, vie sociale, nature, cuisine...) renforce l'intérêt pour ce domaine. Une passion est presque toujours proposée sous une forme ou une autre, et elle ouvre les métiers qui vont avec. Les métiers de passion (sport de haut niveau, ski, chant, cinéma, création de contenu...) ne sont plus proposés à quelqu'un qui ne s'y est jamais intéressé.
- Des parcours en boule de neige. Un parcours sportif (section sport-études, centre de formation, contrat professionnel, vedette), un parcours cinéma (courts métrages dans le garage, festival, producteur, rôle principal, star mondiale) et un parcours musique (groupe de garage, premiers concerts, label, tube, stades du monde entier). Chaque marche réussie ouvre la suivante, chaque marche peut échouer (blessure grave, fiasco, scandale) et faire retomber, et le nombre d'essais par marche est limité.

Cinquième mise à jour, centrée sur les relations et sur la liberté de choix.

- Un bouton Quitter mon emploi est toujours visible dans l'année quand on travaille, même en apprentissage. Partir fait perdre le salaire de l'année, et la recherche d'emploi est proposée tout de suite.
- Les choix risqués ne tournent pas pareil deux fois. Les chances dépendent de l'intelligence, de l'ambition et de la prudence, mais aussi de ce qu'on a déjà vécu avec ce choix. Après un échec on retient parfois la leçon, après une série de succès la chance finit par tourner. Les choix sans hasard réservent maintenant de bonnes et de moins bonnes années.
- Chaque autre joueur a un rôle bien lisible dans l'onglet Proches et dans la liste des joueurs. On y trouve meilleur ami, ami, camarade, allié, ex, conjoint, rival, ennemi juré, ainsi que les dettes entre joueurs, les sociétés communes et les derniers événements entre vous deux.
- Les rivalités ont de vraies conséquences. Quand la rivalité monte, des incidents arrivent même sans action, avec des clients perdus, des procès, des rapports qui nuisent à un poste, des biens saccagés et, tout en haut, des violences. Les coups bas ont changé d'échelle avec ruiner ses affaires, faire perdre son emploi, déterrer son passé, tendre un piège, saccager ses biens et, pour les parties très sombres, mettre un contrat sur une tête. La réussite dépend du rapport de force entre les deux joueurs. La vengeance, qu'elle réussisse ou non, coûte maintenant de l'argent à l'un ou à l'autre.
- Les liens positifs comptent aussi. On peut sceller une alliance, éponger les dettes d'un proche, ouvrir son carnet d'adresses, financer un projet ou partager un secret. Un allié prend ta défense, vient à ton secours quand les dettes s'accumulent, et sa trahison est brutale. Un secret partagé peut se retourner contre toi si vous vous fâchez.

Sixième mise à jour, centrée sur la vie entière, les statuts et la carrière.

- Beaucoup plus de causes de mort. La liste compte désormais plus de cent trente causes, des accidents de la route aux situations rarissimes. Elles tombent à des fréquences très différentes, et environ une vie sur dix s'arrête par un coup du sort entre 8 et 85 ans. Les improbables sont vraiment improbables.
- Un vote final qui regarde la vie. Les joueurs automatiques notent d'abord ce que la vie a raconté, avec ses moments les plus lourds, et seulement ensuite la fortune. Les moments clés de la fiche de vie reprennent les faits qui comptent vraiment, comme de longues années de prison, un mariage, un deuil, une ruine ou une ascension. Un registre suit ces faits pendant toute la partie.
- Plus de cagnotte commune vide. Les scènes collectives sont passées à plus de cent cinquante événements, répartis sur seize mécaniques différentes, comme les expéditions, les paris, les tribunaux, les fêtes, les épreuves, les négociations et les crises. Chaque joueur y a un vrai choix et les résultats changent d'une scène à l'autre.
- Des statuts qui comptent. Un rival juré, un ennemi, un conjoint ou un détenu reçoit des actions bien à lui, dont des vendettas, des contrats sur une tête, des demandes en mariage, des voyages de noces, des scènes de jalousie, des colis et des avocats pour un détenu, et des évasions. Les autres joueurs réagissent aussi à ton statut. Après des années de prison, le conjoint peut partir, les amis s'éloignent, les ennemis en profitent, et une scène marque la libération.
- Les clics ne sont plus perdus. Quand le chrono s'arrête avant de valider l'année, le choix de vie, l'option professionnelle et l'action envers un autre joueur déjà cliqués sont retenus. Une année vide n'arrive plus qu'en l'absence de tout clic.
- Des études qui comptent vraiment. Après le lycée, l'apprentissage ou le bac, on choisit une spécialisation parmi soixante-treize filières, par exemple arts du spectacle en lycée professionnel ou en apprentissage pour devenir acteur, cuisine, mécanique, soins, informatique, sport études, droit des affaires ou chirurgie. Chaque année dans la filière fait progresser les qualités du domaine. À la sortie, les métiers du domaine sont proposés bien plus souvent, avec un meilleur salaire et un niveau de départ plus élevé, et la fiche professionnelle démarre avec de la compétence et un carnet d'adresses. L'apprentissage mène à un diplôme.
- Un onglet Professionnel. Tout ce qui fait avancer une carrière ou rapporte de l'argent quitte la liste des choix de vie et passe dans un onglet à part. On peut y faire un choix en plus de son choix de vie. Les options dépendent de l'activité du moment, avec des menus propres aux métiers sérieux, aux métiers manuels, à la scène, au sport, aux indépendants, aux chefs d'entreprise, au milieu, à la mafia, aux études, à l'apprentissage, à la recherche d'emploi, à la retraite et à la détention.
- Une fiche de carrière qui change l'avenir. Chaque joueur a quatre jauges. La compétence ouvre les promotions et les augmentations. Le réseau améliore les offres d'emploi. La réputation compte pour les promotions et pour le respect dans la mafia. La pression policière augmente le risque d'arrestation et de chute, et retombe quand on se fait discret, qu'on blanchit ou qu'on arrose les bonnes personnes. Chaque option indique ce qu'elle construit, son risque, son coût et si elle est illégale.
- Un nouveau réglage, le nombre d'options professionnelles par année, de trois à sept, avec son explication dans le salon.
- Le bouton Quitter mon emploi est maintenant dans l'onglet Professionnel.
