// Événements autour d'un joueur en particulier. $A désigne la personne concernée.
const { regAll } = require("../groupkit");

regAll("favor", { role: true }, [
  { id: "f_panne", ic: "🚗", ages: [18, 120], need: 1.5, cost: "la réparation de la voiture", pubWhat: "une voiture en panne", t: "La voiture de $A rend l'âme sur l'autoroute. Le garagiste réclame une grosse facture pour la remettre en état." },
  { id: "f_loyer", ic: "🏠", ages: [18, 120], need: 2.5, cost: "le loyer en retard", pubWhat: "des loyers en retard", t: "$A a pris trois mois de retard sur son loyer. Le propriétaire a envoyé un huissier et menace d'expulser." },
  { id: "f_hopital", ic: "🏥", ages: [14, 120], need: 4, cost: "les frais d'hôpital", pubWhat: "une grosse facture médicale", t: "$A est tombé{|e} malade et doit payer une opération et des soins coûteux. L'assurance ne rembourse pas tout." },
  { id: "f_proces", ic: "⚖️", ages: [20, 120], need: 5, cost: "les frais de justice", pubWhat: "un procès perdu", t: "$A a perdu un procès contre un voisin et doit payer des dommages et les frais d'avocat. La somme est lourde." },
  { id: "f_mariage", ic: "💒", ages: [20, 100], need: 3, cost: "le mariage", pubWhat: "un mariage à financer", t: "$A se marie bientôt mais le traiteur, la salle et la robe coûtent bien plus que prévu. Il faut trouver de l'argent." },
  { id: "f_expulse", ic: "📦", ages: [18, 120], need: 3, cost: "le déménagement forcé", pubWhat: "un déménagement forcé", t: "$A doit quitter son logement en urgence après un arrêté d'insalubrité. Il faut trouver un nouvel endroit et payer le déménagement." },
  { id: "f_boutique", ic: "🏪", ages: [22, 120], need: 6, cost: "la reconstruction de la boutique", pubWhat: "la boutique détruite", t: "La boutique de $A a été détruite par un incendie. L'assurance traîne et les stocks sont perdus." },
  { id: "f_jeu", ic: "🎲", ages: [20, 120], mature: true, need: 4, cost: "la dette de jeu", pubWhat: "une dette de jeu", t: "$A a perdu beaucoup d'argent au jeu et doit rembourser des gens peu fréquentables avant la fin du mois." },
  { id: "f_etudes", ic: "🎓", ages: [16, 40], need: 3, cost: "les frais de scolarité", pubWhat: "des frais de scolarité", t: "$A est admis{|e} dans une grande école mais ne peut pas payer les frais de scolarité. Une chance pareille ne se présente qu'une fois." },
  { id: "f_vol", ic: "🔓", ages: [14, 120], need: 1.8, cost: "le matériel volé", pubWhat: "un cambriolage", t: "$A s'est fait cambrioler pendant les vacances. Ordinateur, vélo, bijoux, tout a disparu." },
  { id: "f_animal", ic: "🐕", ages: [8, 120], need: 1.2, cost: "les soins de l'animal", pubWhat: "un animal malade", t: "L'animal de $A est gravement malade. Le vétérinaire propose une opération, chère mais qui peut le sauver." },
  { id: "f_impot", ic: "🧾", ages: [25, 120], need: 4, cost: "le redressement fiscal", pubWhat: "un redressement fiscal", t: "$A reçoit un redressement fiscal après un contrôle. La somme à payer est énorme et les pénalités courent." },
  { id: "f_cercueil", ic: "🕯️", ages: [20, 120], need: 3.5, cost: "les obsèques", pubWhat: "un deuil", t: "Un proche de $A vient de mourir et les obsèques coûtent cher. En plus du chagrin, il y a la facture." },
  { id: "f_materiel", ic: "🎻", ages: [12, 70], need: 2, cost: "l'instrument de musique", pubWhat: "un instrument cassé", t: "L'instrument de musique de $A a été écrasé dans un déménagement. Sans lui, impossible de jouer au concert de la semaine prochaine." },
]);

regAll("windfall", { role: true }, [
  { id: "w_loto", ic: "🍀", ages: [18, 120], gain: 6, win: "🍀 Tu gagnes au loto.", pubWin: "a gagné au loto", t: "$A vient de gagner une jolie somme au loto, avec un ticket acheté sur un coup de tête à la station-service." },
  { id: "w_prime", ic: "💼", ages: [20, 100], gain: 3, win: "💼 Une prime exceptionnelle t'est versée.", pubWin: "a reçu une prime exceptionnelle", t: "$A reçoit une prime exceptionnelle de la direction, pour un dossier que tout le monde croyait perdu." },
  { id: "w_brevet", ic: "💡", ages: [18, 100], gain: 5, win: "💡 Ton brevet est racheté.", pubWin: "a vendu un brevet", t: "Une grande entreprise rachète le brevet de $A, un système à base de bouchons et de ficelle que personne ne prenait au sérieux." },
  { id: "w_objet", ic: "🏺", ages: [10, 120], gain: 3.5, win: "🏺 Ton vieil objet vaut une fortune.", pubWin: "a découvert qu'un vieil objet valait une fortune", t: "$A découvre que le vieux vase hérité d'une grand-tante vaut une fortune aux enchères. Il était utilisé comme porte-parapluie." },
  { id: "w_terrain", ic: "🏞️", ages: [25, 120], gain: 7, win: "🏞️ Ton terrain est classé constructible.", pubWin: "a vu son terrain devenir constructible", t: "Le terrain de $A, jusque-là sans valeur, devient constructible d'un coup de crayon à la mairie. Les promoteurs font la queue." },
  { id: "w_voyage", ic: "✈️", ages: [14, 100], gain: 2, win: "✈️ Tu gagnes un voyage.", pubWin: "a gagné un voyage", t: "$A gagne un tirage au sort pour un grand voyage tout compris. Il faut décider avec qui partir, ou comment le monnayer." },
  { id: "w_tresor", ic: "🪙", ages: [8, 100], gain: 2.5, win: "🪙 Tu trouves un trésor en bêchant.", pubWin: "a trouvé un trésor en jardinant", t: "En bêchant son jardin, $A met au jour un pot de pièces anciennes. Le notaire arrive, l'État aussi, les voisins surtout." },
  { id: "w_enchere", ic: "🔨", ages: [18, 120], gain: 4.5, win: "🔨 Tu as acheté un lot au bon moment.", pubWin: "a flairé la bonne affaire aux enchères", t: "$A a acheté un lot de cartons à une vente aux enchères, juste pour le plaisir. Dans l'un d'eux, un manuscrit signé d'un grand nom." },
]);

regAll("tribunal", { role: true }, [
  { id: "j_vol", ic: "🧤", ages: [14, 120], gp: 0.5, fine: 2.5, prison: 2, what: "vol", mature: true, t: "$A est accusé{|e} d'avoir volé la caisse d'un commerçant du quartier. Il y a des témoins, des caméras floues, et pas mal de rumeurs." },
  { id: "j_fraude", ic: "📄", ages: [25, 120], gp: 0.55, fine: 4, prison: 3, what: "fraude", mature: true, t: "$A est accusé{|e} de fraude dans la gestion d'une association. Les comptes ne tombent pas juste, et quelqu'un a fait remonter l'affaire." },
  { id: "j_diffamation", ic: "🗣️", ages: [18, 120], gp: 0.5, fine: 3, what: "diffamation", t: "$A est poursuivi{|e} en diffamation pour avoir écrit des choses très dures sur un notable de la ville. Les preuves sont minces des deux côtés." },
  { id: "j_tapage", ic: "🔊", ages: [14, 120], gp: 0.7, fine: 0.8, what: "tapage nocturne", t: "$A est convoqué{|e} pour tapage nocturne, après trois fêtes consécutives qui ont fait trembler l'immeuble. Les voisins ont signé une pétition." },
  { id: "j_triche", ic: "📝", ages: [12, 30], gp: 0.55, fine: 0.5, what: "triche à un examen", t: "$A est accusé{|e} d'avoir triché à un examen important. Un surveillant a vu quelque chose, une camarade affirme le contraire." },
  { id: "j_vitre", ic: "🪟", ages: [8, 16], gp: 0.5, fine: 0.4, what: "bris de vitrine", t: "La vitre du boulanger est brisée. $A est accusé{|e} d'avoir lancé le ballon. Le boulanger veut un coupable, les autres enfants se taisent." },
  { id: "j_fuite", ic: "🚙", ages: [18, 100], gp: 0.55, fine: 3, prison: 2, what: "délit de fuite", mature: true, t: "$A est accusé{|e} d'avoir renversé un cycliste et pris la fuite. La voiture ressemble à la sienne, mais il y en a beaucoup comme ça." },
  { id: "j_faute", ic: "🩺", ages: [25, 100], gp: 0.45, fine: 5, what: "faute professionnelle", t: "$A est accusé{|e} d'une faute professionnelle grave par un ancien client. Personne ne sait exactement ce qui s'est passé ce jour-là." },
]);

regAll("tribute", { role: true, mature: true, ages: [16, 120] }, [
  { id: "r_quartier", ic: "🕴️", tr: 0.8, fall: 1.3, pub: "a imposé une taxe dans le quartier", t: "$A prétend contrôler le quartier et réclame une taxe de protection à tous les commerçants. Certains disent que c'est une arnaque, d'autres que c'est dangereux de refuser." },
  { id: "r_bande", ic: "🏴‍☠️", tr: 1, fall: 1.4, pub: "a exigé sa part de la bande", t: "$A est le chef d'une petite bande et exige que chacun reverse une part de ses gains. La bande râle, mais personne n'ose vraiment se lever." },
  { id: "r_patron", ic: "💼", tr: 0.7, fall: 1, pub: "a exigé des heures supplémentaires non payées", t: "$A, patron tyrannique, exige que chaque employé lui reverse une commission sur les primes. Le climat est pesant." },
  { id: "r_maire", ic: "🏛️", tr: 0.9, fall: 1.5, pub: "a exigé des pots-de-vin pour les permis", t: "$A, maire corrompu, réclame un pot-de-vin à chaque dossier de permis de construire. Tout le monde le sait, personne ne le dit." },
  { id: "r_pont", ic: "🌉", tr: 0.6, fall: 0.9, pub: "a installé un péage sur le pont", t: "$A a installé un péage sauvage sur le vieux pont, le seul passage vers la ville. Il tient les clés de la barrière." },
]);
