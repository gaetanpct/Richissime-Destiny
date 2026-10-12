// Scènes propres aux métiers ajoutés (sports, arts, médias, vie nocturne, passions, aventure)
const { ev, flash, O, C, D } = require("../kit");
const R = require("../rules");

// [introduction, issue heureuse, issue malheureuse, libellé du raccourci]
const SPEC = {
  foot: [
    ["Dimanche de match. Le stade chante, ton entraîneur hurle depuis la touche et le ballon te tombe pile sur le pied droit, à vingt mètres des buts.", "Une frappe sublime, le filet tremble. Le stade se lève comme un seul homme.", "Le ballon part dans la tribune et atterrit dans la bière d'un supporter.", "Plonger dans la surface"],
    ["Un recruteur d'un grand club observe le match depuis la tribune. Ton agent t'a prévenu{|e} la veille avec trois points d'exclamation.", "Tu joues le match de ta vie. L'offre arrive dans la soirée.", "Tu rates trois passes faciles. Le recruteur range son carnet.", "Provoquer un penalty"],
    ["Après une défaite lourde, les supporters t'attendent à la sortie du stade avec des banderoles. Pas toutes très aimables.", "Tu t'arrêtes, tu t'excuses sincèrement. L'ambiance se détend et un chant te réhabilite.", "Un mot de travers devient viral. Ta cote chute.", "Passer par la sortie de secours"],
  ],
  tennis: [
    ["Balle de match au troisième set. Ton adversaire se gratte le nez, le public retient son souffle, un pigeon s'est posé sur la ligne.", "Un service gagnant, ligne touchée. Tu tombes à genoux sur la terre battue.", "Double faute. La raquette finit en deux morceaux.", "Contester la ligne"],
    ["Un grand sponsor te propose un contrat de lunettes, de montres et de boissons énergisantes. Ton agent a des étoiles dans les yeux.", "Tu négocies comme un ministre, le contrat est somptueux.", "Le sponsor se retire après une photo malheureuse.", "Signer sans lire"],
  ],
  rugby: [
    ["Finale de championnat sous la pluie. Le terrain est une soupe de boue, le talonneur a perdu une chaussure, la mêlée avance en grognant.", "Tu perces la défense et plantes l'essai de la victoire.", "Tu lâches le ballon à trois mètres de la ligne. Le silence est assourdissant.", "Plaquer un peu trop haut"],
    ["La troisième mi-temps s'éternise. Le capitaine chante, le président danse sur une table, ton coach regarde sa montre.", "Tu mènes le chant avec brio, l'équipe est soudée comme jamais.", "Tu glisses, tu casses la table du président. Facture salée.", "Rentrer discrètement"],
  ],
  cyclisme: [
    ["Dernière montée du col. Le peloton s'étire, ton souffle ressemble à un soufflet de forge et un spectateur te court à côté déguisé en diable.", "Tu lâches tout le monde dans les derniers lacets. Bras levés sur la ligne.", "Une crevaison à cinq kilomètres de l'arrivée, le rêve s'évapore.", "Se faire pousser par un supporter"],
    ["Un contrôle surprise a lieu à l'hôtel de l'équipe, à six heures du matin. Tout le monde sort en pyjama.", "Tout est en règle. Tu dors comme un bébé ensuite.", "Une erreur administrative fait grand bruit dans la presse.", "Disparaître avant le contrôle"],
  ],
  boxe: [
    ["Gong du dernier round. Ton œil droit ne s'ouvre plus, ton adversaire danse autour de toi, ton coach hurle des conseils contradictoires.", "Un crochet parfait au moment idéal. L'arbitre lève ton bras.", "Tu vas au tapis. Comptez jusqu'à dix, tu en es à neuf.", "Tenter un coup interdit"],
    ["Un promoteur douteux propose un combat à gros budget, dans un hangar, sans arbitre officiel.", "Le combat est réglo, la bourse est belle et personne ne se plaint.", "L'affaire tourne mal, ta réputation prend un coup.", "Accepter les yeux fermés"],
  ],
  f1: [
    ["Le départ du Grand Prix approche. Cinq feux rouges, vingt voitures, un moteur qui hurle plus fort que ta mère.", "Tu prends un départ magistral et tu gagnes quatre places dans le premier virage.", "Un accrochage au premier virage. Ton aileron voltige dans les arbres.", "Couper la chicane"],
    ["Ton ingénieur te propose un réglage audacieux de la voiture, jamais testé, qui pourrait changer la course.", "Le réglage fait des merveilles, tu domines la séance.", "La voiture devient incontrôlable, tu finis dans le bac à graviers.", "Garder le réglage secret"],
  ],
  ski: [
    ["Dernière descente de la saison. Un brouillard à couper au couteau cache les piquets et un marmotton s'est installé sur la piste.", "Tu dévales comme une fusée, chrono record.", "Tu rates la porte. Ta saison se termine dans un filet.", "Prendre un raccourci hors piste"],
    ["Une avalanche menace le col pendant l'entraînement. Le guide hésite, le sponsor attend.", "Vous attendez et la montagne s'effondre loin de vous. Sage décision.", "Tu t'entêtes, une coulée de neige te surprend.", "Foncer malgré tout"],
  ],
  natation: [
    ["La finale est dans cinq minutes. Ton bonnet est trop serré, ton entraîneur te donne un dernier conseil, tu ne l'as pas entendu.", "Plongeon parfait, virages précis. Tu touches le mur en premier.", "Ton maillot se déchire en plein virage. Le public hurle, toi aussi.", "Tricher sur le départ"],
    ["Un journaliste te demande ton secret de préparation devant dix caméras. Ton secret est une tartine de beurre de cacahuète.", "Ta franchise séduit le pays, les tartines se vendent à prix d'or.", "Tu fais un mauvais jeu de mots, la presse s'en empare.", "Inventer un secret"],
  ],
  esport: [
    ["Finale en direct, quatre mille personnes dans la salle et trois millions devant leurs écrans. Ta souris vient de lâcher une étincelle.", "Un combo parfait. L'équipe adverse jette ses casques.", "Un mauvais clic fatal. Le chat te rebaptise pour la semaine.", "Utiliser un bug du jeu"],
    ["Ton équipe te demande de passer 14 heures par jour à t'entraîner. Ton dos proteste, ton rang monte.", "Tu atteins le premier rang mondial du classement.", "Tu t'effondres de fatigue avant le tournoi.", "Dormir sur le clavier"],
  ],
  danse: [
    ["Premier soir de gala. Ton partenaire a un genou en compote, ta chaussure de pointe a un clou, la salle est comble et le rideau se lève.", "Tu enchaînes les pirouettes sans faute. Les roses pleuvent.", "Un faux pas, un genou qui lâche, un silence gêné.", "Improviser une variation"],
    ["Une chorégraphe célèbre te propose de rejoindre son prochain spectacle. Elle change d'avis toutes les dix minutes.", "Tu t'adaptes avec grâce, elle t'érige en muse.", "Elle te déteste. Tu es remplacé{|e} en une soirée.", "Copier un autre danseur"],
  ],
  coach: [
    ["Un client veut perdre 20 kilos pour son mariage dans trois semaines. Sa fiancée ne le sait pas encore.", "Il y parvient, il pleure de joie et t'offre un bouquet.", "Il craque devant une raclette et te rend responsable.", "Promettre un miracle"],
    ["Ta salle de sport est envahie par une classe de seniors énergiques. Ils ont des muscles d'acier et des remarques acerbes.", "Tu les conquiers avec humour, ils amènent leurs voisins.", "Ils te débordent, tu finis sur le banc de musculation.", "Les mettre au défi"],
  ],
  chanteur: [
    ["Tu montes sur scène devant une foule immense. Ton micro grésille, ton batteur est en retard, ta chanson préférée vient de sortir de ta mémoire.", "Tu improvises, la foule hurle ton nom.", "Tu chantes faux, un spectateur te lance une chaussure.", "Mimer en play-back"],
    ["Un producteur propose de transformer ton refrain en tube mondial. Il veut aussi changer ton nom, ta coupe et tes paroles.", "Le tube cartonne, tu es partout.", "Le tube fait un four, tu perds ton identité.", "Signer à la hâte"],
    ["Ton nouveau single est repris dans une publicité pour du fromage. Les fans sont partagés, le chèque ne l'est pas.", "Le fromage se vend, tu encaisses les droits.", "Le fromage est périmé, le scandale éclate.", "Refuser par principe"],
  ],
  dj: [
    ["Minuit, le club est plein, tes platines fument. Un fan hurle une demande à l'oreille, un autre renverse sa boisson sur ton ordinateur.", "Tu enchaînes les morceaux, la salle devient folle.", "Le logiciel plante. Quarante secondes de silence, c'est long.", "Lancer un remix improvisé"],
    ["Un organisateur de festival te propose le créneau de trois heures du matin, devant une foule hypnotisée et un peu fatiguée.", "Ton set devient culte. Les vidéos tournent partout.", "Tu te trompes de clé USB, tu joues des chansons pour enfants.", "Promettre un set explosif"],
  ],
  cinema: [
    ["Premier jour de tournage. Le réalisateur crie « moteur », ton partenaire oublie son texte, une mouette passe dans le champ.", "Tu improvises une réplique magistrale, le plateau applaudit.", "Tu éclates de rire quarante fois de suite. L'équipe soupire.", "Voler la vedette"],
    ["Le film dans lequel tu joues sort en salle. Les critiques sont mitigées, ta mère pleure de fierté au premier rang.", "Ta performance fait sensation, les propositions pleuvent.", "Un critique t'éreinte en trois lignes assassines.", "Écrire toi-même une critique élogieuse"],
    ["Un grand festival t'invite pour présenter ton film. Smoking prêté, escaliers rouges, flashs de partout.", "Tu glisses sur le tapis avec élégance, les caméras t'adorent.", "Tu tombes dans l'escalier, c'est la photo du jour.", "Arriver en retard sur un âne"],
  ],
  humour: [
    ["Ta première grande salle. Ton premier gag tombe dans le vide et le deuxième encore plus bas. Au fond, un spectateur ronfle.", "Ta chute fait mouche, la salle se tord.", "Tu bafouilles, le silence s'installe, quelqu'un tousse.", "Imiter un politicien"],
    ["Ton sketch devient viral, mais pas pour les bonnes raisons. Une phrase sortie de son contexte enflamme les réseaux.", "Tu t'expliques avec humour, la polémique retombe et tu en sors grandi{|e}.", "L'affaire dégénère, tu perds des contrats.", "Faire le mort"],
  ],
  mannequin: [
    ["Défilé de la semaine de la mode. Tu portes une robe en carton, des chaussures à talons de quinze centimètres et un chapeau en forme de saucisson.", "Tu glisses sur le podium avec une grâce de fauve. Les flashs crépitent.", "Un talon cède, tu atterris dans les bras d'un critique.", "Marcher à reculons"],
    ["Un photographe réputé te propose une séance mystérieuse, en pleine nuit, dans un entrepôt. Son assistante est très gentille.", "Les photos sont sublimes, la couverture t'attend.", "La séance est un désastre, on perd le contrat.", "Exiger un cachet exorbitant"],
  ],
  createur: [
    ["Tu lances une nouvelle vidéo. Ton idée est un défi à base de tartes, de chats et de trampolines. Ton compteur d'abonnés frémit.", "La vidéo devient virale, tes abonnés explosent.", "La vidéo se retrouve à 12 vues, dont trois de ta tante.", "Acheter de faux abonnés"],
    ["Une grande marque veut t'offrir un contrat de partenariat. Tu dois dire dans tes vidéos que leur shampoing change la vie.", "Le contrat te rend riche et tes fans te suivent.", "Tes fans découvrent que tu n'as jamais utilisé le shampoing.", "Mentir sans honte"],
    ["Un autre créateur t'accuse publiquement d'avoir copié son idée. Les commentaires s'enflamment à la vitesse de la lumière.", "Tu réponds avec humour, la polémique retombe en ta faveur.", "Tu réponds à chaud, ton message est ressorti dans toute la presse.", "Supprimer ton compte pour la nuit"],
  ],
  photo: [
    ["Un mariage de 250 invités, un marié ivre, un oncle qui se prend pour le photographe et un gâteau qui penche dangereusement.", "Tu captures l'instant magique, les mariés pleurent devant l'album.", "Tu oublies de recharger la carte mémoire. Plus aucune photo.", "Mettre en scène des faux souvenirs"],
    ["Un magazine te commande un reportage sur un volcan en éruption. Tu as quarante-huit heures et un seul objectif.", "Tes photos font le tour du monde.", "Tu perds ton matériel dans un ravin.", "Voler une image à un confrère"],
  ],
  peintre: [
    ["Ton tableau est exposé dans une galerie du centre-ville. Un visiteur l'observe dix minutes et déclare que c'est « de la peinture ».", "Un collectionneur l'achète au prix d'une voiture.", "Un enfant dessine dessus au feutre, personne ne s'en aperçoit.", "Prétendre que c'était voulu"],
    ["Un mécène très riche t'invite dans sa villa pour un portrait de sa famille. Le chien refuse de poser.", "Le portrait enchante la famille, les commandes suivent.", "Le portrait déplaît, on te fait déguerpir.", "Flatter le modèle jusqu'au ridicule"],
  ],
  gamedev: [
    ["Ton jeu sort demain. Vingt-trois bugs connus, quatre mystérieux, et une quête principale qui fait crasher la console.", "Le lancement est un succès, les joueurs adorent les bugs.", "Les avis sont désastreux, le studio panique.", "Cacher les bugs"],
    ["Un éditeur te propose de racheter ton studio. Il parle de synergies, d'agilité et de licornes.", "Tu vends au meilleur prix, tu gardes ta liberté.", "Le rachat tourne mal et tu perds le contrôle.", "Refuser par orgueil"],
  ],
  mode: [
    ["Ta collection d'été est prête. Elle comporte neuf robes, trois chapeaux et un sac à main qui fait aussi cafetière.", "Les acheteurs raffolent de la cafetière. La collection s'arrache.", "Les acheteurs se moquent du sac et la presse suit.", "Copier une grande maison"],
    ["Une célébrité veut porter ta robe pour une cérémonie. Elle exige de la raccourcir, de l'allonger et de la teindre en bleu.", "Elle est sublime, ton nom est dans tous les magazines.", "La robe se déchire en direct à la télévision.", "Tout accepter sans discuter"],
  ],
  archi: [
    ["Ton projet de tour futuriste est présenté au conseil municipal. Le maire l'adore, les voisins le détestent, un pigeon a déjà fait son nid sur la maquette.", "Le projet est approuvé à l'unanimité.", "Le projet est enterré sous les pétitions.", "Cacher les plans défavorables"],
    ["Le chantier de ton premier gros bâtiment accuse trois semaines de retard. L'entrepreneur invente des excuses de plus en plus poétiques.", "Tu rattrapes le retard en jonglant avec les équipes.", "Une erreur de calcul fait rire tout le chantier.", "Rogner sur les matériaux"],
  ],
  tatoueur: [
    ["Un client veut le prénom de son ex tatoué sur le bras. Il en est certain. Vraiment. Il tremble en le disant.", "Tu le dissuades avec tact. Il revient avec un dessin magnifique.", "Il te rend responsable quand l'ex revient.", "Tatouer sans discuter"],
    ["Une célébrité réserve ton salon pour la nuit, en secret, avec huit gardes du corps et une idée très étrange.", "Le tatouage devient légendaire, ta réputation explose.", "La célébrité n'est pas contente, tu perds des clients.", "Tout poster sur internet"],
  ],
  coiffeur: [
    ["Une cliente exige « la coupe de la star de la semaine » mais montre une photo de profil, floue, sur un téléphone fissuré.", "Elle sort radieuse, son mari ne la reconnaît plus mais adore.", "Elle sort en larmes. Les avis en ligne vont être cruels.", "Couper à l'instinct"],
    ["Ton salon est invité à coiffer une émission de télévision en direct. Tu as dix minutes, un sèche-cheveux et un fou rire naissant.", "La coiffure est applaudie, la télé t'engage.", "Le chignon s'effondre en direct. Les audiences explosent mais pas en ta faveur.", "Tout miser sur la laque"],
  ],
  patisserie: [
    ["Un mariage de 300 invités et un gâteau à sept étages. Il fait 35 degrés dans la salle. Ton chef te regarde avec des yeux de loup.", "Le gâteau tient, la salle applaudit, les mariés pleurent de gourmandise.", "Le gâteau fond lentement, comme dans un film d'horreur.", "Remplacer la crème par de la mousse à raser"],
    ["Un grand critique gastronomique visite ta boutique en secret. Tu le reconnais à son carnet et à ses lunettes sévères.", "Il adore ton éclair et lui consacre trois colonnes.", "Il se casse une dent sur un macaron. Mauvaise critique.", "Offrir la tournée de gâteaux"],
  ],
  cabaret: [
    ["Premier soir sur scène. Le projecteur t'aveugle, ta tenue tient avec trois épingles et la salle est pleine. Un oncle que tu ne connaissais pas est au premier rang.", "Ton numéro électrise la salle. Tu es ovationné{|e}.", "Un accroc de costume provoque un fou rire général. Tu t'en sors avec humour.", "Improviser un numéro inédit"],
    ["Une soirée privée très bien payée est proposée par un client mystérieux. Le patron te regarde d'un air entendu.", "La soirée se passe très bien, le pourboire est digne d'un roi.", "Le client se révèle odieux. Tu quittes les lieux la tête haute.", "Accepter sans poser de questions"],
    ["Ta famille découvre ton métier par un cousin bavard. Le repas de dimanche est tendu comme une corde de violon.", "Tu t'expliques avec calme, ils finissent par applaudir ton courage.", "La dispute éclate entre le fromage et le dessert.", "Mentir sur ta profession"],
  ],
  adulte: [
    ["Ton premier mois sur la plateforme. Les abonnés sont rares, les commentaires sont étranges et ton chat s'invite dans le cadre.", "Ta communauté grandit vite, les revenus grimpent.", "Le compte stagne. Tu doutes de la stratégie.", "Acheter de la publicité douteuse"],
    ["Un proche découvre ton activité. Le téléphone sonne, ta mère laisse trois messages vocaux en majuscules.", "Tu assumes avec honnêteté, la famille te respecte finalement.", "Les relations se tendent pendant des mois.", "Nier en bloc"],
    ["Une fuite de données met en danger ta vie privée. Des inconnus partagent des captures et ton nom circule.", "Tu réagis vite, tu portes plainte, la plateforme te soutient.", "L'affaire s'étale dans la presse. La honte est lourde.", "Fuir quelques mois à la campagne"],
  ],
  casino: [
    ["Une table de poker, cinq joueurs, une pile de jetons de la taille d'un pâté de maisons. Ton adversaire sourit trop, c'est suspect.", "Tu relances avec audace et tu rafles le pot.", "Tu perds tout sur un tapis maudit.", "Compter les cartes discrètement"],
    ["Un client chanceux enchaîne les gains depuis trois heures. La direction t'ordonne de le surveiller.", "Tu repères sa méthode, la direction te félicite.", "Tu l'accuses à tort, le scandale éclate.", "Fermer les yeux contre un pourboire"],
  ],
  nuit: [
    ["Une soirée très agitée dans ton bar. Quatre bagarres, deux déclarations d'amour, un homme qui danse sur le comptoir en chantant l'hymne national.", "Tu calmes tout le monde avec humour et fermeté. Le patron te fait confiance.", "La soirée dégénère, tu finis avec un œil au beurre noir.", "Fermer le bar pour la nuit"],
    ["Une célébrité arrive à l'improviste dans ton établissement. Elle veut rester anonyme et chante déjà au micro.", "La soirée devient légendaire, ton bar est cité partout.", "Un paparazzi s'invite, la star part en colère.", "Vendre l'info au plus offrant"],
  ],
  hacker: [
    ["Une grande entreprise a un système de sécurité réputé impénétrable. Tu y vois un défi, un jeu, un trophée.", "Tu y entres sans effort. Le butin numérique est énorme.", "Un piège te repère. Tu coupes la connexion de justesse.", "Lancer une attaque massive"],
    ["Un inconnu te propose un contrat très bien payé pour un piratage discret. Il refuse de donner son nom, sa voix est étrange.", "Le contrat se passe bien, tu disparais avec ta récompense.", "L'inconnu est un policier. Tu t'en sors de justesse.", "Exiger plus d'argent"],
  ],
  pompier: [
    ["La sirène retentit en pleine nuit. Un incendie dans un immeuble, des fenêtres illuminées et un chat coincé sur un balcon du quatrième.", "Tu sauves le chat et deux habitants. Les voisins pleurent d'admiration.", "Tu t'en sors avec une brûlure légère mais le chat t'a griffé.", "Foncer sans équipement"],
    ["Une inondation s'abat sur la ville. Les rues deviennent des canaux, les voitures flottent, un canard défile avec dignité.", "Tu organises les secours avec brio, la ville te remercie.", "Une erreur de manœuvre met le camion en panne.", "Prendre un raccourci par un tunnel"],
  ],
  militaire: [
    ["Un exercice de nuit en pleine forêt. Il pleut des cordes, la boussole indique le sud-ouest alors qu'on cherche le nord et le sergent chante pour se motiver.", "Tu guides le groupe jusqu'à l'objectif. Le colonel te félicite.", "Tu tournes en rond pendant six heures. Ambiance glaciale.", "Prendre un chemin interdit"],
    ["Une mission humanitaire à l'étranger te demande de distribuer des vivres. La foule est nombreuse, la chaleur écrasante.", "Tu réussis ta mission et reçois une médaille.", "Une erreur de logistique provoque un retard fâcheux.", "Improviser sans ordre"],
  ],
  astronaute: [
    ["Compte à rebours de la fusée. Dix, neuf, huit... Ton collègue a oublié ses chaussettes, le chef de mission les cherche à la radio.", "Le décollage est parfait, la Terre devient une bille bleue.", "Une alerte retarde le lancement de trois mois.", "Improviser une manœuvre"],
    ["En orbite, un câble se détache. Les voyants clignotent, un collègue panique poliment et Houston demande de ne pas toucher à rien.", "Tu répares avec sang-froid. La station est sauvée.", "Une fuite d'air force à une sortie d'urgence.", "Ignorer la procédure"],
  ],
  marin: [
    ["Une tempête s'abat sur le chalutier en pleine nuit. Les vagues font trois étages, le cuisinier chante pour se rassurer et les poissons semblent amusés.", "Tu tiens la barre et ramènes l'équipage au port.", "Une vague emporte une partie de la pêche.", "Couper à travers la tempête"],
    ["Ton filet remonte un objet étrange, couvert d'algues, qui ressemble à un coffre. Le capitaine se frotte les mains.", "Le coffre contient un vrai trésor, que tu partages avec l'équipage.", "Le coffre est vide. Il contient seulement une vieille chaussure.", "Garder le coffre pour toi"],
  ],
  artisan: [
    ["Une fuite d'eau noie la cuisine d'une cliente, à 22 h un dimanche. Elle te regarde comme un sauveur et t'offre un thé qui refroidit.", "Tu répares en vingt minutes. Elle te recommande à tout le quartier.", "Tu inondes aussi le voisin du dessous. Grosse facture.", "Facturer le triple"],
    ["Un chantier de rénovation te réserve une surprise sous le parquet. Une momie de chat, un coffre vide et un trou profond.", "Tu gères la surprise avec bonne humeur, le client est enchanté.", "Le trou s'agrandit, le budget aussi.", "Reboucher sans rien dire"],
  ],
  veto: [
    ["Une dame arrive en larmes avec un perroquet qui répète des insultes apprises auprès du voisin. Elle veut qu'on le soigne de ses « vilains mots ».", "Tu le calmes avec patience, la dame t'offre des chocolats.", "Le perroquet te mord le doigt et insulte ta mère.", "Prescrire une cure de silence"],
    ["Un fermier t'appelle en pleine nuit pour une vache qui met bas. Il pleut, la ferme est loin, le chien aboie dans la nuit.", "Un joli veau naît, le fermier pleure de joie.", "La vache te donne un coup de sabot mémorable.", "Appeler un confrère"],
  ],
  psy: [
    ["Un patient te confie un rêve étrange, avec un crocodile, une tarte et son ancien professeur de maths. Il attend une interprétation brillante.", "Ton analyse l'éclaire, il pleure de gratitude.", "Tu interprètes tout de travers, il quitte le cabinet vexé.", "Inventer une interprétation"],
    ["Un journaliste te demande ton avis sur un phénomène de société. Les caméras sont déjà là, la lumière est crue.", "Ton intervention marque les esprits et tu deviens un expert recherché.", "Une phrase mal comprise déclenche un scandale.", "Refuser de répondre"],
  ],
  pharmacien: [
    ["La pharmacie est pleine. Une vieille dame demande un médicament dont elle a oublié le nom, mais se souvient de la couleur de la boîte.", "Tu devines parfaitement. Elle te remercie et offre des bonbons.", "Tu te trompes de boîte. Heureusement, le médicament est inoffensif.", "Vendre autre chose"],
    ["Une grande chaîne ouvre une officine en face de la tienne et casse les prix avec des affiches fluorescentes.", "Tu fidélises ta clientèle grâce au conseil. Le quartier te reste fidèle.", "Tu perds la moitié de ta clientèle.", "Baisser les prix en dessous du coût"],
  ],
  dentiste: [
    ["Un patient terrifié refuse d'ouvrir la bouche. Il serre les poings, ferme les yeux et récite sa liste de courses.", "Tu le rassures, il en sort détendu, une dent plus propre.", "Il te mord le doigt. Une scène dont on parlera.", "Utiliser une méthode miracle"],
    ["Un confrère jaloux dépose une plainte fantaisiste contre ton cabinet. Un inspecteur arrive avec un carnet et un air méfiant.", "L'inspection se passe parfaitement, ta réputation grandit.", "Le dossier traîne et abîme ton image.", "Offrir un cadeau à l'inspecteur"],
  ],
  detective: [
    ["Une cliente te demande de suivre son mari. Tu le filatures pendant trois jours. Il va à la boulangerie, au parc, puis chez un clown.", "Tu découvres la vérité, la cliente éclate de rire en pleurant.", "Tu te fais repérer à cause de ton chapeau trop voyant.", "Cambrioler le bureau du suspect"],
    ["Une affaire de disparition de chat tourne au scandale de quartier. Trois voisins s'accusent mutuellement et l'un d'eux est un mime.", "Tu retrouves le chat et soudes le quartier.", "Le chat est introuvable, les accusations pleuvent.", "Accuser un innocent"],
  ],
  clerge: [
    ["Une cérémonie de mariage, un marié en retard, une mariée en larmes et une chorale qui chante une demi-heure de trop.", "Tu sauves la cérémonie avec humour. Les familles te remercient.", "Une phrase de travers déclenche un fou rire général.", "Raccourcir le sermon"],
    ["Un villageois te demande conseil pour un différend de clôture. L'affaire dure depuis trois générations.", "Tu réconcilies les deux familles autour d'un gâteau.", "Tu aggraves le litige sans le vouloir.", "Imposer ta volonté"],
  ],
  voyante: [
    ["Un client entre dans ta roulotte. Tu lui dis qu'il rencontrera l'amour. Il t'avoue qu'il est déjà marié depuis vingt ans.", "Tu rattrapes le coup avec une prédiction brillante. Il revient chaque semaine.", "Il te réclame un remboursement en hurlant.", "Prédire sa mort pour l'impressionner"],
    ["Un journaliste vient te défier en direct à la télévision. Tu dois deviner le contenu d'une boîte fermée.", "Tu devines juste par hasard. Tu deviens une star.", "La boîte contient une chaussette, tu dis une orange.", "Tricher grâce à un complice"],
  ],
  vtc: [
    ["Un client monte dans ta voiture à trois heures du matin et te raconte sa vie pendant 40 minutes. Tu apprends qu'il est un roi du pétrole.", "Il te laisse un pourboire digne d'un prince.", "Il vomit sur la banquette arrière.", "Rouler trop vite"],
    ["Une grève bloque la ville. Tout le monde veut une voiture, les prix s'envolent, tu croises un taxi en colère.", "Tu enchaînes les courses et fais ton meilleur mois.", "Tu te fais verbaliser et perds une journée.", "Doubler les tarifs"],
  ],
  explorateur: [
    ["Au fond d'une grotte, ta lampe frontale clignote. Une salle immense s'ouvre devant toi, avec des dessins étranges sur les murs.", "Tu découvres un site inédit, la presse accourt.", "Tu glisses dans une rivière souterraine et perds ton matériel.", "Explorer sans corde"],
    ["Une carte au trésor ancienne te mène sur une île déserte. Tu creuses, tu creuses, tu entends un cliquetis.", "Tu déterres un coffre rempli d'or.", "Tu déterres une boîte de conserve de 1974.", "Partir seul"],
  ],
  paysagiste: [
    ["Un client veut un jardin « zen mais festif », avec une fontaine, un labyrinthe, une piste de danse et trois nains de jardin.", "Le jardin est un chef-d'œuvre, la presse locale s'en empare.", "La fontaine inonde le voisin.", "Planter des fleurs au hasard"],
    ["Un orage détruit la moitié du parc municipal que tu as aménagé. Le maire est furieux, les enfants aussi.", "Tu replantes en un week-end avec une équipe de bénévoles.", "Le maire te rend responsable devant le conseil.", "Accuser la météo"],
  ],
  biblio: [
    ["Un lecteur te rend un livre avec trente ans de retard. Il tient à payer l'amende. Elle fait 3 650 €.", "Tu proposes un arrangement, il fait un don à la bibliothèque.", "Il réclame son argent en hurlant.", "Imposer l'amende"],
    ["Une nuit, un mystérieux livre apparaît dans les rayons. Aucune trace d'auteur, des pages blanches, et un parfum de violette.", "Le livre devient une légende locale, la bibliothèque est comble.", "Le livre disparaît aussi mystérieusement qu'il est venu.", "Le vendre à un collectionneur"],
  ],
  consultant: [
    ["Une grande entreprise t'engage pour « optimiser les synergies ». Tu ne sais pas ce que ça veut dire, mais tu dis oui avec assurance.", "Ton rapport impressionne la direction, la mission est prolongée.", "Ton rapport est truffé d'erreurs, la mission s'arrête.", "Copier le rapport d'un concurrent"],
    ["Un client te demande un diaporama en 12 heures. Il en veut 87 pages, avec des animations, de la musique et un graphique qui bouge.", "Tu livres à l'heure, la direction applaudit.", "Le fichier plante en pleine présentation.", "Tout faire faire par un stagiaire"],
  ],
};

Object.keys(SPEC).forEach((tr) => {
  const T = R.TRACKS[tr];
  if (!T) throw new Error("métier inconnu " + tr);
  SPEC[tr].forEach((spec, i) => {
    const [intro, win, lose, shortcut] = spec;
    const tags = ["travail"]; if (T.mature || T.illicit) tags.push("mature");
    ev("pro_" + tr + "_" + (i + 1), {
      ages: [T.age, T.maxAge || 64], tags, ic: T.ic + "💼", w: 5, need: { job: tr }, once: false, cool: 3,
      t: intro,
      c: [
        C("Foncer, c'est le moment de briller", "🚀", [O(0.5, win, { perf: 9, ambition: 2, repute: 3, bonheur: 4, argent: Math.round(T.levels[0][1] * 0.08), exp: 1 }), O(0.5, lose, { perf: -7, bonheur: -3, sante: T.danger ? -3 : -1, repute: -2 })], { risk: 1 }),
        D("Jouer la prudence", "🛡️", "Tu fais ton travail sans éclat. Rien de grave, rien de glorieux.", { prudent: 2, perf: 1 }),
        C(shortcut, "🥷", [O(0.45, "Le raccourci fonctionne et personne n'y voit rien.", { perf: 5, honnete: -2, creatif: 1 }), O(0.55, "Le raccourci te revient en pleine figure.", { perf: -8, honnete: -2, repute: -3 })], { risk: 1 }),
      ],
    });
  });
});

// Un petit mot d'ambiance pour chaque métier
const FL = {
  foot: ["Un enfant te réclame un autographe sur son ballon dégonflé.", "Ton coiffeur te demande une photo dédicacée pour la vitrine."],
  tennis: ["Une balle perdue atterrit sur un spectateur, il applaudit."],
  rugby: ["Après le match, tu dégustes la plus grande assiette de pâtes du monde."],
  cyclisme: ["Tu croises un troupeau de vaches sur la route. L'une d'elles te dépasse."],
  boxe: ["Ton nez a changé de forme. Ton entraîneur dit que ça te va bien."],
  f1: ["Ton casque a un autocollant de ta grand-mère. Elle est fière."],
  ski: ["Une marmotte te regarde passer, impressionnée ou moqueuse."],
  natation: ["Tu passes cinq heures dans l'eau. Tes doigts ressemblent à des pruneaux."],
  esport: ["Ton chat a gagné une partie à ta place. Il réclame des croquettes."],
  danse: ["Tes pointes sont mortes. Une nouvelle paire est arrivée."],
  coach: ["Un client te remercie avec une boîte de chocolats. Tu hésites."],
  chanteur: ["Un fan chante ta chanson sous ta fenêtre. Faux, mais avec le cœur."],
  dj: ["Ta clé USB s'est retrouvée dans la lessive. Elle a survécu."],
  cinema: ["Un figurant te reconnaît dans la rue et t'offre un café."],
  humour: ["Une blague de ta mamie t'inspire un sketch entier."],
  mannequin: ["Un styliste te demande de porter une robe en spaghettis. Ça tombe, littéralement."],
  createur: ["Ton chat bat tous tes records de vues. Il demande un cachet."],
  photo: ["Un lion de zoo a refusé de poser. Tu as photographié sa queue."],
  peintre: ["Un petit-neveu dessine une œuvre à côté de la tienne. Le critique préfère la sienne."],
  gamedev: ["Un joueur t'écrit pour te dire que ton bug l'a rendu heureux."],
  mode: ["Un fil rebelle a transformé ta robe en nappe. Elle a fait sensation."],
  tatoueur: ["Un client t'apporte son dessin, fait par sa grand-mère. Il est étonnant."],
  coiffeur: ["Un client dort pendant tout le shampoing et ronfle au séchage."],
  patisserie: ["Un client a commandé un gâteau en forme de pigeon. Il est splendide."],
  cabaret: ["Une plume s'est coincée dans l'aspirateur. Le cabaret a eu un petit rire."],
  adulte: ["Ton compte fait un petit bond. Ta comptable fait un grand sourire."],
  casino: ["Un client perd tout et te remercie. Personne ne comprend."],
  nuit: ["Un inconnu danse sur le comptoir depuis une heure et demie."],
  hacker: ["Tu retrouves le mot de passe de ta tante. Elle utilisait « 1234 ».", "Un pare-feu t'a envoyé un message, il te demande de partir poliment."],
  pompier: ["Un chat est descendu tout seul de l'arbre. Tu as pris la photo quand même."],
  militaire: ["Une botte égarée a refait surface. Elle n'était pas de ta pointure."],
  astronaute: ["Tu mets quatre minutes à boire un café en apesanteur. Il était froid."],
  marin: ["Une mouette a volé ton sandwich avec une précision militaire."],
  artisan: ["Un client te donne des tomates de son jardin. Elles sont magnifiques."],
  veto: ["Un chiot t'a léché la figure pendant l'examen. Il a un bon diagnostic."],
  psy: ["Un patient t'offre un livre. Il parle de lui-même, longuement."],
  pharmacien: ["Un client demande une boîte de sourires. Tu proposes du chocolat."],
  dentiste: ["Une enfant te fait un dessin avec des dents pleines de couleurs."],
  detective: ["Ton chapeau mou est sorti d'une soirée en lambeaux. Il a vu des choses."],
  clerge: ["Un enfant de chœur renverse tout le vin de messe. Il te regarde, terrorisé."],
  voyante: ["Tu as prédit de la pluie. Il pleut. Tu es impressionné{|e}."],
  vtc: ["Un client chante à tue-tête sur la banquette arrière."],
  explorateur: ["Une chauve-souris a élu domicile dans ton sac à dos."],
  paysagiste: ["Un nain de jardin a disparu pendant la nuit. L'enquête est ouverte."],
  biblio: ["Un lecteur demande un livre qui n'existe pas. Tu l'écris pour lui."],
  consultant: ["Tu as dit « synergie » douze fois en une réunion. Record personnel."],
};
Object.keys(FL).forEach((tr) => FL[tr].forEach((t) => flash(t, { bonheur: 1 }, { ages: [R.TRACKS[tr].age, R.TRACKS[tr].maxAge || 64], need: { job: tr } })));
