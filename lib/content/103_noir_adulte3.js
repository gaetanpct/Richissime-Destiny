// HUMOUR NOIR 4/4 — Santé, voyages, chance, catastrophes rares, vieillesse
const { ev, flash, O, C, D } = require("../kit");

// ============ SANTÉ, ACCIDENTS ET MALCHANCE ============
ev("n_trottinette", {
  title: "Le radar de la trottinette", ages: [14, 55], tags: ["sante"], ic: "🛴💥", rar: "commun",
  t: "Tu loues une trottinette électrique pour aller « juste au coin de la rue ». À trois kilomètres, tu découvres que les freins sont décoratifs. Un panneau « cédez le passage » se rapproche avec une détermination inquiétante.",
  c: [
    D("Te jeter dans la haie", "🌿", "Les buissons amortissent. Tu en sors couvert{|e} de feuilles et de dignité réduite.", { sante: -3, courage: 1, bonheur: -1 }),
    C("Tenter de freiner avec le pied", "🦶", [O(0.6, "Tu t'arrêtes dans une gerbe d'étincelles. Une grande première.", { sport: 1, bonheur: 2 }), O(0.4, "Le pied cède. Direction urgences, avec un plâtre qui sera signé par tout le monde.", { sante: -9, argent: -200, bonheur: -2 })], { risk: 2 }),
    D("Continuer en criant de joie", "🎢", "Tu atterris dans un bac à sable. Les enfants applaudissent.", { sante: -2, bonheur: 4, courage: 2 }),
  ],
});
ev("n_sushi_catastrophe", {
  title: "Le buffet à volonté", ages: [16, 75], tags: ["sante", "loufoque"], ic: "🍣🤢", rar: "commun",
  t: "Un restaurant à volonté propose du sushi à neuf euros quatre-vingt-dix. Tu manges de tout, y compris un plat dont personne ne connaît la nature. Vers minuit, ton corps te présente sa démission.",
  c: [
    D("Appeler les urgences", "📞", "Une nuit d'hôpital, une perfusion et une infirmière pleine d'humour.", { sante: -4, argent: -150, prudent: 2 }),
    C("Tenir bon avec du thé", "🍵", [O(0.8, "Le thé triomphe. Tu es épuisé{|e} mais vivant{|e}.", { sante: -3, courage: 1 }), O(0.2, "Le lendemain, les urgences te regardent avec une patience professionnelle.", { sante: -7, argent: -150, bonheur: -2 })], { risk: 1 }),
    D("Poster un avis en deux phrases", "✍️", "« Plus jamais. Sauf le dessert. » Le restaurant te répond par une réduction.", { repute: 1, bonheur: 1, creatif: 1 }),
  ],
});
ev("n_dentiste", {
  title: "Chez le dentiste de l'horreur", ages: [10, 80], tags: ["sante"], ic: "🦷😱", rar: "commun",
  t: "Le dentiste sourit trop. Sur le plafond, un poster de chaton te regarde avec compassion. Il murmure « ça ne fera pas mal » juste avant que la pince n'attrape ton âme.",
  c: [
    D("Serrer les dents, au sens figuré", "😬", "Un quart d'heure d'angoisse. Tu sors avec une dent en moins et un bonbon offert.", { sante: -2, courage: 2, argent: -90 }),
    C("Demander une anesthésie totale", "💉", [O(0.8, "Tu dors, tu rêves de plage et tu te réveilles content{|e}.", { argent: -300, bonheur: 2 }), O(0.2, "Tu te réveilles en disant des secrets à voix haute dans la salle d'attente.", { argent: -300, repute: -2, bonheur: -1 })], { risk: 1 }),
    D("Fuir en courant, le bavoir encore au cou", "🏃", "Tu as bonne mine dans la rue. La douleur, elle, est restée.", { sante: -4, honnete: -1, bonheur: -2 }),
  ],
});
ev("n_regime_miracle", {
  title: "Le régime miracle", ages: [18, 65], tags: ["sante"], ic: "🥬📉", rar: "commun",
  t: "Un influenceur t'a convaincu{|e} qu'il suffit de ne manger que des concombres pour trouver la paix intérieure. Tu es à trois jours de régime et tu parles aux légumes.",
  c: [
    D("Abandonner et commander une pizza", "🍕", "Un moment de pure joie. Tu aimes encore la vie.", { bonheur: 4, sante: 1 }),
    C("Tenir une semaine entière", "🥒", [O(0.4, "Tu perds du poids et gagnes une aura étrange.", { sante: 2, bonheur: 1, courage: 2 }), O(0.6, "Tu t'effondres au supermarché, entouré{|e} de poireaux inquiets.", { sante: -5, bonheur: -3 })], { risk: 2 }),
    D("Te lancer dans l'élevage de concombres", "🌱", "Une passion démarre. Tu offres des concombres à tout l'immeuble.", { creatif: 2, bonheur: 3, bonte: 1 }),
  ],
});
ev("n_hypocondrie", {
  title: "Le grand diagnostic en ligne", ages: [20, 80], tags: ["sante"], ic: "🩺💻", rar: "commun",
  t: "Un petit bouton sur le bras. Tu as tapé « bouton bras » sur internet. Selon le site, tu as une dizaine de maladies rares, dont l'une n'existe que dans une île du Pacifique. Tu te mets à écrire ton testament.",
  c: [
    D("Consulter un vrai médecin", "👩‍⚕️", "Le médecin éclate de rire. C'est un bouton, un vrai.", { honnete: 1, bonheur: 3, argent: -30 }),
    C("Te soigner tout seul avec des tisanes", "🍵", [O(0.7, "Le bouton disparaît. Le miracle est attribué au thym.", { bonheur: 2 }), O(0.3, "Le bouton grossit. Le thym n'y est pour rien.", { sante: -4, argent: -80 })], { risk: 1 }),
    D("Écrire un blog sur ta maladie imaginaire", "📝", "Tu as cent lecteurs, tous dans le même cas.", { creatif: 2, repute: 1, bonheur: 2 }),
  ],
});
ev("n_accident_cuisine", {
  title: "Le soufflé du désastre", ages: [14, 80], tags: ["sante", "loufoque"], ic: "👩‍🍳🔥", rar: "commun",
  t: "Tu as voulu impressionner tout le monde avec un soufflé flambé. Le soufflé s'est enflammé, le torchon aussi, et le détecteur de fumée chante comme un opéra. Le chat t'observe depuis le frigo.",
  c: [
    D("Étouffer les flammes avec un couvercle", "🧯", "Un geste calme, héroïque. Ton sang-froid est salué par le voisinage.", { courage: 3, sante: -1, prudent: 2 }),
    C("Jeter un seau d'eau sur la poêle", "💦", [O(0.5, "Le feu s'éteint dans une gerbe de vapeur. Tu es trempé{|e} mais heureux{|se}.", { bonheur: 1, courage: 1 }), O(0.5, "Le feu s'élargit. Les pompiers sont au courant.", { sante: -6, argent: -1200, bonheur: -4 })], { risk: 3 }),
    D("Sortir en hurlant sans rien éteindre", "🏃", "Les pompiers arrivent. Ils sont charmants, et un peu sarcastiques.", { argent: -300, bonheur: -2, courage: -1 }),
  ],
});
ev("n_chirurgie_ratee", {
  title: "Un petit coup de pouce esthétique", ages: [22, 70], tags: ["sante", "mature"], ic: "💉🎭", rar: "peu", need: { money: [3000, null] },
  t: "Un chirurgien esthétique à la Porsche te promet un « léger rafraîchissement ». Tu ressors du bloc avec un sourire qui ne veut plus se refermer et un sourcil qui a pris son indépendance.",
  c: [
    D("Assumer ce nouveau visage", "😁", "On finit par s'habituer. Les inconnus te trouvent toujours de bonne humeur.", { charme: -1, bonheur: 2, courage: 2 }),
    C("Demander une retouche", "🔧", [O(0.5, "La retouche arrange tout, presque trop bien.", { argent: -2500, charme: 2, bonheur: 3 }), O(0.5, "La retouche aggrave l'affaire. Le sourcil change de côté.", { argent: -2500, charme: -2, bonheur: -3 })], { risk: 2 }),
    D("Poursuivre le chirurgien", "⚖️", "Il disparaît sur une île. Son avocat t'envoie une carte postale.", { argent: -1500, honnete: 1, bonheur: -1 }),
  ],
});
ev("n_burnout_epique", {
  title: "Le burn-out en direct", ages: [25, 62], tags: ["sante", "travail"], ic: "🔥🧠", rar: "peu", need: { job: true },
  t: "Pendant une réunion de budget, tu te mets à rire et tu ne peux plus t'arrêter. Tu rédiges sur le tableau un poème sur la photocopieuse avant de t'allonger sur la table. Le médecin du travail est sidéré.",
  c: [
    D("Accepter un arrêt maladie", "🛏️", "Trois mois à regarder le plafond. Tu retrouves peu à peu le goût de la vie.", { sante: 3, bonheur: 4, perf: -5, prudent: 3 }),
    C("Démissionner sur-le-champ", "🚪", [O(0.5, "Tu pars, libéré{|e}. Un nouveau chapitre s'ouvre.", { quit: true, bonheur: 6, courage: 3 }), O(0.5, "Tu regrettes dès le lendemain, mais la lettre est partie.", { quit: true, bonheur: -3, argent: -500 })], { risk: 2 }),
    D("Continuer en serrant les dents", "🪨", "Tu tiens, mais le corps présente la facture dans quelques mois.", { sante: -7, bonheur: -3, ambition: 2 }),
  ],
});
ev("n_mauvais_genou", {
  title: "Le genou qui a vu trop de choses", ages: [35, 80], tags: ["sante"], ic: "🦵😖", rar: "commun",
  t: "Ton genou craque désormais à chaque pas, avec un son qui rappelle une porte d'église. Ton médecin affirme que « c'est l'âge », ce qui te vexe plus que la douleur.",
  c: [
    D("Faire une rééducation sérieuse", "💪", "Tu te remets à bouger. Ton genou renonce à la plainte.", { sante: 4, sport: 2, bonheur: 2 }),
    D("Ignorer et faire du saut en parachute", "🪂", "Le genou ne t'a pas demandé son avis. Il crie en l'air.", { courage: 3, sante: -4, bonheur: 4 }),
    D("Acheter une canne de collection", "🦯", "Tu deviens une légende de quartier. Les enfants t'appellent « Monsieur Chapeau ».", { charme: 1, repute: 1, bonheur: 2 }),
  ],
});
ev("n_gueule_de_bois_epique", {
  title: "Le lendemain qui chante faux", ages: [18, 60], tags: ["sante", "mature"], ic: "🍷🪦", rar: "commun",
  t: "Tu te réveilles sur un banc de parc, une couronne de fleurs sur la tête, un panneau « STATUE VIVANTE » autour du cou et quarante euros en pièces dans ta poche. Des touristes t'ont pris en photo, une à une.",
  c: [
    D("Rentrer discrètement chez toi", "🚶", "Un trajet de honte, avec un mégaphone dans la tête.", { sante: -2, bonheur: -2 }),
    D("Assumer ton nouveau métier", "🗿", "Tu restes immobile jusqu'au soir. Les touristes en redemandent.", { argent: 90, creatif: 2, bonheur: 3, repute: 1 }),
    C("Appeler un ami pour reconstituer la soirée", "📞", [O(0.5, "Le récit est mémorable. Vous riez pendant une heure.", { bonheur: 5, sociable: 1 }), O(0.5, "L'ami n'a aucun souvenir non plus. Seul le chien le sait.", { bonheur: 1, intel: -1 })], { risk: 1 }),
  ],
});

// ============ LOISIRS, VOYAGES, EXPÉRIENCES IMPROBABLES ============
ev("n_vol_annule", {
  title: "Retenu{|e} à l'aéroport", ages: [18, 75], tags: ["loisir"], ic: "✈️🛄", rar: "commun",
  t: "Ton vol est annulé. Puis le suivant. Puis la compagnie elle-même. Tu es coincé{|e} dans le terminal avec un sandwich à douze euros, une prise électrique convoitée et un voyageur qui chante.",
  c: [
    D("Transformer l'attente en fête", "🎉", "Tu improvises une soirée avec cent inconnus. Un mariage se prépare sur un coin de banc.", { sociable: 3, bonheur: 5, argent: -50 }),
    D("Rentrer en stop", "🚗", "Un routier te dépose chez toi, bavard et philosophe.", { courage: 2, bonheur: 2, argent: -60 }),
    C("Exiger une indemnité à voix haute", "📣", [O(0.5, "Tu obtiens un bon d'achat et une nuit d'hôtel, sous les applaudissements.", { argent: 300, bonheur: 3 }), O(0.5, "Un agent de sécurité te raccompagne à la sortie.", { bonheur: -3, repute: -1 })], { risk: 1 }),
  ],
});
ev("n_airbnb_enfer", {
  title: "Un logement exceptionnel", ages: [20, 70], tags: ["loisir"], ic: "🏚️🛏️", rar: "peu", need: { money: [600, null] },
  t: "L'annonce parlait de « charme rustique, vue sur la nature, hôte attentionné ». Sur place, la nature est entrée dans la chambre, l'hôte te regarde dormir de sa fenêtre et le matelas est un cheval.",
  c: [
    D("Demander à être remboursé{|e}", "💶", "Après dix jours de messages, on te rembourse une moitié.", { argent: -200, bonheur: -2 }),
    C("Rester pour l'aventure", "⛺", [O(0.5, "Le cheval devient ton ami. Tu passes un séjour inoubliable.", { bonheur: 6, creatif: 2 }), O(0.5, "L'hôte te réveille à six heures pour t'apprendre la traite.", { bonheur: -2, sante: -1 })], { risk: 1 }),
    D("Dormir dans la voiture", "🚙", "Une nuit froide, mais maîtrisée. L'aube est belle.", { sante: -1, courage: 1, bonheur: 1 }),
  ],
});
ev("n_randonnee_perdue", {
  title: "Raccourci fatal", ages: [14, 70], tags: ["loisir", "sante"], ic: "🥾🌲", rar: "peu",
  t: "Tu as pris « un petit raccourci » dans la forêt. Quatre heures plus tard, tu croises la même souche pour la sixième fois. Le portable affiche un point d'interrogation qui te regarde en silence.",
  c: [
    C("Suivre la rivière vers l'aval", "🌊", [O(0.8, "Tu retrouves un village, des gens et une très bonne soupe.", { courage: 3, bonheur: 4 }), O(0.2, "La nuit tombe, la nuit passe et les secours te trouvent à l'aube, frigorifié{|e}.", { sante: -6, courage: 2, argent: -300 })], { risk: 2 }),
    D("Allumer un feu de détresse", "🔥", "Les pompiers te trouvent en une heure. Ils se moquent un peu de toi.", { prudent: 2, bonheur: -1, argent: -150 }),
    D("Tourner en rond en chantant", "🎤", "Tu finis par tomber sur la route. Tu avais marché en cercle vingt minutes.", { bonheur: 2, courage: 1 }),
  ],
});
ev("n_festival_boue", {
  title: "Le festival sous le déluge", ages: [16, 50], tags: ["loisir", "mature"], ic: "🎸☔", rar: "commun",
  t: "Trois jours de musique, de bière tiède et de boue jusqu'aux genoux. Le chanteur du groupe principal glisse, tombe dans la fosse et te rend un sourire énorme. Ta tente flotte au loin.",
  c: [
    D("Danser dans la boue", "💃", "Tu entres dans le chaos avec bonheur. Ta photo fait la une du festival.", { bonheur: 6, repute: 2, sociable: 2, sante: -1 }),
    D("Trouver un abri avec des inconnus", "⛺", "Vous passez la nuit à chanter. Une amitié improbable se noue.", { bonheur: 4, sociable: 3 }),
    C("Monter sur scène par défi", "🎤", [O(0.25, "Le public te suit. Tu chantes avec le groupe pendant un refrain.", { repute: 5, bonheur: 8, courage: 3 }), O(0.75, "La sécurité te sort par les pieds.", { repute: -2, bonheur: -2, courage: 1 })], { risk: 2 }),
  ],
});
ev("n_tatouage_vacances", {
  title: "Un souvenir pour la vie", ages: [18, 55], tags: ["loisir", "mature"], ic: "🖋️🌴", rar: "peu",
  t: "En vacances, un tatoueur local te propose « le symbole de la chance » pour dix euros. Tu ne comprends pas un mot de la langue. Rentré{|e} chez toi, tu découvres qu'il y a écrit « LIVRAISON GRATUITE ».",
  c: [
    D("L'assumer fièrement", "😎", "C'est devenu ton signe distinctif. Les gens adorent.", { bonheur: 3, charme: 1, courage: 1, repute: 1 }),
    D("Le faire couvrir par un tatouage plus grand", "🐉", "Un dragon s'enroule maintenant autour de la mention. Le résultat est étonnamment beau.", { argent: -300, bonheur: 2, creatif: 1 }),
    C("Retourner voir le tatoueur", "✈️", [O(0.3, "Il te rembourse en riant et te tatoue autre chose.", { bonheur: 4, argent: -600 }), O(0.7, "Il a déménagé. Tu repars avec un autre souvenir, plus cher.", { argent: -900, bonheur: -2 })], { risk: 1 }),
  ],
});
ev("n_croisiere_naufrage", {
  title: "La croisière à moitié coulée", ages: [30, 85], tags: ["loisir", "loufoque"], ic: "🚢🫠", rar: "rare", need: { money: [2500, null] },
  t: "Le paquebot de luxe heurte un rocher que le commandant jurait avoir « déplacé au dernier moment ». Le buffet reste ouvert, l'orchestre joue un air triste et les passagers prennent des selfies sur le pont incliné.",
  c: [
    D("Embarquer dans le canot en premier", "🛟", "Tu t'en sors, un peu honteux{|se}. Un journal te surnomme « le rat du paquebot ».", { honnete: -3, repute: -3, bonheur: 1 }),
    D("Organiser l'évacuation", "🦸", "Tu aides tout le monde. Un reportage te nomme héros du jour.", { courage: 5, repute: 6, bonheur: 4, bonte: 3 }),
    C("Aller chercher le buffet de desserts", "🍰", [O(0.7, "Tu reviens avec trois gâteaux. Les rescapés t'adorent.", { bonheur: 5, repute: 2 }), O(0.3, "Tu rates le dernier canot. Un hélicoptère te repêche en dernier.", { bonheur: -3, sante: -3, courage: 2 })], { risk: 2 }),
  ],
});
ev("n_secte_yoga", {
  title: "La retraite spirituelle", ages: [22, 65], tags: ["loisir", "loufoque"], ic: "🧘‍♀️🌀", rar: "peu", need: { money: [800, null] },
  t: "Un week-end de yoga à la campagne. Le gourou accueille les participants en tunique rose et leur demande de « confier leur carte bancaire à l'univers ». Le bol de riz qui t'est tendu sourit un peu trop.",
  c: [
    D("Fuir en pleine nuit par la fenêtre", "🏃", "Tu t'enfuis, léger{|ère}. Le lendemain, tu bois un café sans te retourner.", { courage: 2, intel: 2, prudent: 3 }),
    C("Rester pour comprendre", "🧐", [O(0.3, "Le gourou s'avère inoffensif et drôle. Tu repars en paix.", { bonheur: 5, sante: 1 }), O(0.7, "Tu donnes plus que tu ne voulais. Un chèque est parti, la tunique est restée.", { argent: -1800, bonheur: -3, intel: -1 })], { risk: 2 }),
    D("Dénoncer la secte à la police", "👮", "Une enquête s'ouvre, on te remercie à demi-mot.", { honnete: 3, repute: 2, bonheur: 1 }),
  ],
});
ev("n_safari_selfie", {
  title: "Le selfie de trop", ages: [18, 70], tags: ["loisir", "sante"], ic: "🦁📷", rar: "rare", need: { money: [2000, null] },
  t: "En safari, tu as vu un lionceau près de la route. Un guide hurle de ne pas descendre. Tu penses, avec une logique imparable, que le lionceau est si mignon qu'il ne peut vouloir que ton bien.",
  c: [
    D("Remonter dans la jeep", "🚙", "Le guide te regarde avec une immense reconnaissance. Un souvenir sain.", { prudent: 3, bonheur: 2 }),
    C("Faire le selfie quand même", "🤳", [O(0.7, "Le selfie est splendide et la lionne n'a pas bougé. Tu as de la chance.", { bonheur: 6, repute: 3, courage: 3 }), O(0.27, "La lionne s'approche. Les gardes t'attrapent par le col.", { sante: -5, courage: 2, bonheur: -1 }), O(0.03, "La lionne n'a pas apprécié. Le safari devient un récit exemplaire.", { die: "lors d'un selfie avec un lionceau" })], { risk: 3 }),
    D("Offrir ton déjeuner au lionceau", "🍖", "Le guide tombe à la renverse. La lionne mange ton sandwich avec classe.", { bonte: 1, bonheur: 2, prudent: -2 }),
  ],
});
ev("n_surclassement", {
  title: "Surclassé{|e} par erreur", ages: [18, 80], tags: ["loisir", "chance"], ic: "🥂✈️", rar: "peu",
  t: "À l'embarquement, l'hôtesse t'adresse un sourire énorme et t'invite en première classe. Tu y découvres un siège-lit, du champagne et un voisin en costume qui te prend pour un célèbre écrivain.",
  c: [
    D("Jouer le jeu avec panache", "🎩", "Tu inventes un roman, tu signes des serviettes. Le voyage est mémorable.", { charme: 3, bonheur: 6, honnete: -2 }),
    D("Avouer la méprise", "🙊", "Le voisin rit beaucoup. Il t'offre un verre pour ta franchise.", { honnete: 3, bonheur: 4 }),
    C("Demander un second dessert", "🍰", [O(0.6, "On t'apporte trois desserts, la tête haute.", { bonheur: 5 }), O(0.4, "Le steward vérifie ton billet. Tu retournes en classe éco avec ton verre.", { bonheur: -2, repute: -1 })], { risk: 1 }),
  ],
});

// ============ RÉUSSITES EXTRAORDINAIRES ET COUPS DE CHANCE ============
ev("n_tableau_grenier", {
  title: "Le chef-d'œuvre du grenier", ages: [25, 85], tags: ["chance", "argent"], ic: "🖼️🕸️", rar: "mythique",
  t: "En vidant le grenier de tes parents, tu trouves une toile couverte de poussière, signée d'un nom que tu connais mal. Un expert la regarde longuement, devient pâle, puis te demande si tu veux t'asseoir.",
  c: [
    D("Vendre aux enchères", "🔨", "Le marteau s'abat sur un prix astronomique. Tu restes sans voix.", { argent: 200000, bonheur: 10, flag: "tableau_millions", later: { id: "n_profiteurs", in: [1, 2], p: 0.8 } }),
    D("L'accrocher au salon", "🛋️", "Chaque invité se prosterne devant le tableau. Tu gagnes un statut mondain.", { bonheur: 6, repute: 4, creatif: 2 }),
    C("Nettoyer le tableau toi-même", "🧽", [O(0.2, "Tu révèles une signature encore plus précieuse.", { argent: 350000, bonheur: 10, flag: "tableau_millions" }), O(0.8, "Tu effaces la moitié de la peinture avec un détergent ménager.", { bonheur: -10, intel: -2 })], { risk: 3 }),
  ],
});
ev("n_sauvetage_heros", {
  title: "Le héros du quai", ages: [14, 75], tags: ["chance", "celebrite"], ic: "🦸‍♂️🌊", rar: "rare",
  t: "Un enfant tombe de la jetée. Tu plonges tout habillé{|e}, tu le remontes, et un passant filme la scène en criant « génial » avec la voix d'un commentateur sportif. Tu es trempé{|e}, essoufflé{|e} et un peu confus{|e}.",
  c: [
    D("Refuser les honneurs", "🙏", "Tu repars discrètement. Mais la vidéo parle pour toi.", { courage: 4, bonte: 4, repute: 5, bonheur: 4 }),
    D("Accepter une médaille de la ville", "🏅", "Le maire te serre la main. Ta photo trône dans la mairie.", { repute: 7, bonheur: 5, bonte: 2 }),
    C("Monnayer ton histoire", "💶", [O(0.4, "Un magazine achète ton récit, qui devient un best-seller.", { argent: 5000, repute: 3, honnete: -2 }), O(0.6, "On te reproche ta cupidité. Tu perds une partie de ta gloire.", { repute: -3, bonheur: -2 })], { risk: 1 }),
  ],
});
ev("n_inventeur_accident", {
  title: "L'invention accidentelle", ages: [20, 70], tags: ["chance", "argent", "loufoque"], ic: "🔬💥", rar: "rare",
  t: "En voulant réparer ton grille-pain, tu fusionnes accidentellement un sèche-cheveux, une cuillère et un vieux téléphone. L'objet découpe parfaitement les tranches de pain en forme de poisson. Ton voisin pleure d'émotion.",
  c: [
    D("Déposer un brevet", "📑", "L'invention devient un succès mondial. Les tranches de pain-poisson partent par millions.", { argent: 30000, bonheur: 7, creatif: 3, ambition: 3 }),
    D("Offrir l'invention à ton voisin", "🎁", "Il devient riche. Tu es son parrain éternel.", { bonte: 4, bonheur: 3, rel: { voisin: 15 } }),
    C("Monter une société tout de suite", "🏢", [O(0.35, "La société décolle. Les investisseurs adorent ton air tranquille.", { argent: 15000, bonheur: 5 }), O(0.65, "La société s'effondre sous la comptabilité.", { argent: -4000, bonheur: -3 })], { risk: 2 }),
  ],
});
ev("n_mecene_inconnu", {
  title: "La fée bienfaitrice", ages: [18, 60], tags: ["chance", "argent"], ic: "🧚💶", rar: "rare",
  t: "Un homme élégant que tu n'as jamais vu te remet une enveloppe. « De la part de quelqu'un qui n'oubliera jamais ta gentillesse d'il y a douze ans », dit-il en s'éclipsant. L'enveloppe contient un chèque et un petit mot en forme de poème.",
  c: [
    D("Encaisser et dire merci", "🙏", "Un cadeau tombé du ciel. Tu en fais un bon usage.", { argent: 6000, bonheur: 6, bonte: 2 }),
    D("Chercher l'identité du donateur", "🕵️", "Tu retrouves une vieille dame que tu avais aidée sur un banc. Elle pleure de joie.", { argent: 6000, bonheur: 7, bonte: 3, intel: 1 }),
    D("Offrir la moitié à une association", "🤝", "Tu partages. La vieille dame l'apprend et rit aux larmes.", { argent: 3000, bonte: 5, bonheur: 6 }),
  ],
});
ev("n_erreur_virement", {
  title: "Un zéro de trop", ages: [20, 70], tags: ["chance", "argent"], ic: "🏦🤯", rar: "peu",
  t: "Ta banque a versé 30 000 euros sur ton compte à la place de 300. Un message d'excuse arrive deux heures plus tard, suivi d'un autre, puis d'un ton de plus en plus sec.",
  c: [
    D("Tout rendre immédiatement", "📞", "La banque te remercie d'un cadeau de 50 euros en bon d'achat. C'est un début.", { honnete: 4, argent: 50, bonheur: 2 }),
    C("Dépenser un peu avant de rendre", "🛍️", [O(0.4, "Tu rends l'argent, avec des frais. L'histoire reste dans l'agence.", { argent: -400, honnete: -2, bonheur: 3 }), O(0.6, "La banque te poursuit. L'amende est salée.", { argent: -3000, honnete: -3, record: 1, bonheur: -5 })], { risk: 3 }),
    D("Faire un don et tout avouer", "🏥", "Tu redonnes tout et laisses un petit pourboire à l'agence. Le directeur ne s'en remet pas.", { bonte: 3, honnete: 3, bonheur: 4, argent: -100 }),
  ],
});
ev("n_poste_prestigieux_accident", {
  title: "Le poste qui t'est tombé dessus", ages: [28, 62], tags: ["chance", "travail"], ic: "🏛️🎩", rar: "rare", need: { job: true },
  t: "Un chasseur de têtes t'appelle, enthousiaste. Il prend ton nom pour celui d'un expert renommé. Avant que tu comprennes, on t'invite à rejoindre le conseil d'administration d'une grande entreprise.",
  c: [
    D("Accepter et faire semblant", "🎭", "Tu apprends vite. On te trouve « visionnaire ».", { promote: true, honnete: -2, bonheur: 5, ambition: 3 }),
    D("Avouer la méprise", "🗣️", "Le chasseur éclate de rire et te propose un poste moins prestigieux, mais réel.", { honnete: 4, raise: 0.1, bonheur: 3 }),
    C("Demander un salaire exorbitant", "💰", [O(0.35, "L'entreprise accepte, par peur de perdre un génie.", { raise: 0.5, bonheur: 6, honnete: -2 }), O(0.65, "Le recrutement est annulé sur un éclat de rire.", { bonheur: -2, repute: -2 })], { risk: 2 }),
  ],
});
ev("n_concours_absurde", {
  title: "Champion{|ne} du monde de quelque chose", ages: [12, 80], tags: ["chance", "loufoque"], ic: "🏆🧀", rar: "rare",
  t: "Sans l'avoir prévu, tu t'inscris à un concours de lancer de fromage. Par un mélange de panique et de chance, tu gagnes. Tu reçois une coupe en forme de brie et une invitation aux championnats du monde.",
  c: [
    D("Partir aux championnats", "🧀", "Tu y vas, tu y crois, et tu termines troisième. Le brie est ton compagnon.", { repute: 4, bonheur: 5, sport: 2, argent: -300 }),
    D("Ouvrir une fromagerie", "🏪", "Tu surfes sur ta gloire. Ton fromage « Le Lanceur » devient célèbre.", { argent: 3000, creatif: 2, bonheur: 4 }),
    D("Garder la coupe sur ta cheminée", "🏠", "Chaque invité te demande de raconter l'histoire. Tu le fais avec plaisir.", { bonheur: 3, repute: 1 }),
  ],
});

// ============ ÉVÉNEMENTS EXTRÊMEMENT RARES ET CATASTROPHIQUES ============
ev("n_meteorite", {
  title: "Une pierre venue du ciel", ages: [10, 90], tags: ["catastrophe", "loufoque"], ic: "☄️🏠", rar: "mythique",
  t: "Une météorite de la taille d'un melon perce ton toit, traverse ta cuisine et s'arrête dans ton frigo, entre le beurre et le yaourt. Les scientifiques arrivent en courant, les journalistes en voiture et ta mère en pleurant.",
  c: [
    D("La vendre à un musée", "🏛️", "Le musée t'en offre une fortune. Le frigo, lui, reste au centre de l'exposition.", { argent: 25000, bonheur: 6, repute: 4 }),
    D("La garder dans ton salon", "🪨", "Chaque invité veut la toucher. Tu deviens l'hôte le plus populaire de la ville.", { bonheur: 5, repute: 3, sociable: 2 }),
    C("Organiser des visites payantes", "🎟️", [O(0.5, "Les visiteurs affluent. Tu fais fortune en quelques mois.", { argent: 12000, bonheur: 5 }), O(0.5, "L'assurance refuse de couvrir les dégâts, qu'elle juge « d'origine divine ».", { argent: -5000, bonheur: -4 })], { risk: 2 }),
  ],
});
ev("n_declare_mort", {
  title: "Vous êtes décédé{|e}, monsieur ou madame", ages: [25, 80], tags: ["catastrophe", "loufoque"], ic: "🪦📄", rar: "mythique",
  t: "Un courrier de l'administration te félicite de tes « obsèques récentes ». Ta carte bancaire est bloquée, ton compte est clos et ton employeur t'envoie des condoléances. Ton propre faire-part est affiché à la mairie.",
  c: [
    D("Se présenter au guichet en personne", "🚶", "On t'écoute avec un sourire gêné. Dix formulaires plus tard, tu es vivant{|e}.", { bonheur: -2, intel: 1, argent: -200 }),
    C("Profiter de la situation", "🥸", [O(0.5, "Tu vis trois semaines de liberté absolue, sans impôts ni factures.", { bonheur: 6, honnete: -3 }), O(0.5, "L'administration te retrouve et t'envoie une amende pour fraude.", { argent: -1500, honnete: -3, record: 1 })], { risk: 2 }),
    D("Assister à ton propre enterrement civil", "⚰️", "Tu entends les éloges les plus sincères de ta vie. Tu en es touché{|e}.", { bonheur: 5, bonte: 2, repute: 3 }),
  ],
});
ev("n_incendie_maison", {
  title: "Quand tout part en fumée", ages: [20, 85], tags: ["catastrophe"], ic: "🔥🏚️", rar: "rare", need: { money: [3000, null] },
  t: "Un court-circuit dans le grille-pain, un rideau trop proche et une nuit trop calme. Les pompiers sauvent le chat, les photos de famille et une cuillère à soupe. Le reste n'est plus que cendre.",
  c: [
    D("Accepter l'aide de la famille", "🤝", "Tu emménages quelques mois chez ta tante. Elle t'adore et te nourrit comme un roi.", { bonheur: -2, bonte: 2, argent: -1500, loseItem: "voiture" }),
    C("Contester l'assurance", "📑", [O(0.5, "L'assurance rembourse en grande partie.", { argent: 6000, bonheur: 2 }), O(0.5, "L'expert conclut à une négligence. Tu reçois une fraction.", { argent: 1500, bonheur: -5 })], { risk: 2 }),
    D("Repartir de zéro avec le sourire", "🌱", "Tu trouves un petit logement, des meubles de récupération et une vie plus simple.", { courage: 4, bonheur: 2, argent: -2500 }),
  ],
});
ev("n_inondation", {
  title: "Le salon aquatique", ages: [18, 90], tags: ["catastrophe"], ic: "🌊🛋️", rar: "rare",
  t: "La rivière sort de son lit et décide d'emménager chez toi. Ton canapé flotte, ton chat est sur la bibliothèque, et un canard s'est installé dans la baignoire en regardant les murs.",
  c: [
    D("Sauver les objets les plus précieux", "📦", "Tu sauves les albums de famille, la guitare et le canard.", { courage: 3, bonte: 2, argent: -1500, bonheur: -1 }),
    C("Attendre les secours sur le toit", "🏠", [O(0.9, "Les pompiers t'évacuent en barque. Tu te sens dans un film.", { bonheur: 2, courage: 2, argent: -2000 }), O(0.1, "Le toit tient, mais tu tombes malade du froid.", { sante: -8, argent: -2000 })], { risk: 2 }),
    D("Ramer dans le salon avec ton voisin", "🛶", "Votre humour est apprécié par le journal local, qui publie votre photo.", { sociable: 3, bonheur: 4, repute: 2, argent: -1000 }),
  ],
});
ev("n_double_identite", {
  title: "Le double parfait", ages: [20, 75], tags: ["catastrophe", "loufoque"], ic: "👥❓", rar: "mythique",
  t: "Un inconnu qui te ressemble comme deux gouttes d'eau a ouvert un compte bancaire à ton nom, a emprunté ton vélo et s'est inscrit à ton club de scrabble. Il a gagné le tournoi. Ton club le préfère.",
  c: [
    D("Le confronter", "🤝", "Vous vous découvrez des points communs étranges. Il devient un ami, un peu inquiétant.", { bonheur: 3, sociable: 2 }),
    C("Porter plainte pour usurpation", "⚖️", [O(0.5, "Il est condamné, et ton club regrette amèrement le tournoi.", { honnete: 2, bonheur: 1 }), O(0.5, "La police te prend pour le double. Tu perds une demi-journée.", { bonheur: -3, repute: -1 })], { risk: 1 }),
    D("Lui laisser ta vie ennuyeuse", "🎭", "Tu pars vivre ailleurs. Il se débrouille très bien avec tes factures.", { bonheur: 4, courage: 3, argent: -300 }),
  ],
});
ev("n_plancher_soiree", {
  title: "La fête qui s'effondre", ages: [18, 55], tags: ["catastrophe", "mature"], ic: "🏚️🎉", rar: "rare",
  t: "Soixante invités dans un appartement prévu pour douze. Le plancher gémit, le lustre balance, et un pilier cède dans un bruit d'opéra. Les invités tombent au rez-de-chaussée, sur une réunion de copropriétaires.",
  c: [
    D("Assumer la responsabilité", "🙋", "Tu t'excuses en personne. La copropriété t'envoie une facture, et une invitation à la prochaine fête.", { argent: -2500, honnete: 3, bonheur: -1 }),
    C("Accuser le voisin du dessus", "👉", [O(0.3, "Le voisin n'avait aucune preuve de son innocence. Tu t'en tires indemne.", { honnete: -4, bonheur: 2 }), O(0.7, "Il avait des témoins, toi non. L'affaire devient judiciaire.", { argent: -4000, honnete: -4, repute: -3 })], { risk: 3 }),
    D("Poursuivre la fête au rez-de-chaussée", "💃", "Les copropriétaires dansent aussi. Une soirée entrée dans l'histoire de l'immeuble.", { bonheur: 6, sociable: 3, repute: 2, argent: -800 }),
  ],
});
ev("n_pandemie_ridicule", {
  title: "La grande pénurie de papier", ages: [10, 90], tags: ["catastrophe", "loufoque"], ic: "🧻😱", rar: "rare",
  t: "Une rumeur explique que le papier toilette va disparaître. En une demi-journée, plus aucun rayon n'en contient. Ton voisin t'a proposé un échange contre un rein, une voiture ou un chat.",
  c: [
    D("Stocker comme tout le monde", "🛒", "Tu as dix paquets. Tu ne sais plus où dormir.", { argent: -150, bonheur: -1, prudent: 1 }),
    D("Rester calme et attendre", "🧘", "Les rayons se remplissent. Tu as gardé ton calme.", { bonheur: 2, intel: 1 }),
    C("Revendre du papier au marché noir", "🦹", [O(0.5, "Tu fais un joli bénéfice. Ton voisin te traite d'escroc avec admiration.", { argent: 1200, honnete: -3, bonheur: 2 }), O(0.5, "Les voisins se liguent contre toi. Ton paillasson disparaît.", { repute: -4, honnete: -3, bonheur: -3 })], { risk: 2 }),
  ],
});
ev("n_vol_identite_bancaire", {
  title: "Le compte à zéro", ages: [20, 80], tags: ["catastrophe", "argent"], ic: "💳🕳️", rar: "peu", need: { money: [2000, null] },
  t: "Un matin, ton compte affiche zéro. Un hacker, quelque part, a acheté 400 paires de chaussettes, un jet-ski et une licorne gonflable. La banque te répond que cela ressemble à ton « profil de consommation ».",
  c: [
    D("Faire opposition tout de suite", "🛑", "Tu récupères une partie de l'argent après deux mois de papiers.", { argent: -800, bonheur: -3, prudent: 2 }),
    C("Mener l'enquête toi-même", "🕵️", [O(0.25, "Tu remontes jusqu'au hacker, un adolescent qui s'excuse en larmes.", { argent: 1500, intel: 3, bonheur: 4 }), O(0.75, "Tu t'enfonces dans des forums obscurs. Ton ordinateur attrape un virus.", { argent: -600, bonheur: -3 })], { risk: 2 }),
    D("Accepter ton sort et garder la licorne", "🦄", "La licorne gonflable devient ta mascotte. Elle est plus fidèle que beaucoup d'humains.", { argent: -1500, bonheur: 1, creatif: 1 }),
  ],
});

// ============ VIEILLESSE, REGRETS, HÉRITAGE, FIN DE VIE ============
ev("n_testament_piege", {
  title: "Le testament piégé", ages: [60, 95], tags: ["vieillesse", "famille"], ic: "📜😈", rar: "peu", need: { money: [10000, null] },
  t: "Tu rédiges ton testament avec la lucidité d'un maître d'échecs. Chaque héritier devra relever un petit défi, un poème de dix vers, une soupe sans sel ou un repas en silence, avant de toucher un centime.",
  c: [
    D("Maintenir les défis, avec un sourire", "😈", "Ta famille se déchire joyeusement en ton absence. Tu savoures à l'avance.", { bonheur: 4, creatif: 2, bonte: -1 }),
    D("Tout partager équitablement", "⚖️", "Une génération qui t'aime et te regrette sans jamais s'étriper.", { bonte: 3, bonheur: 3 }),
    C("Tout léguer à ton chat", "🐈", [O(0.5, "Le notaire t'applaudit. Le chat vit dans le luxe, entouré de soupirants.", { bonheur: 5, creatif: 3 }), O(0.5, "La famille t'attaque en justice, avec une ardeur remarquable.", { bonheur: -3, argent: -1500 })], { risk: 2 }),
  ],
});
ev("n_inventaire_regrets", {
  title: "La liste des regrets", ages: [60, 95], tags: ["vieillesse"], ic: "📝🌅", rar: "commun",
  t: "Un soir de pluie, tu retrouves une vieille boîte. À l'intérieur, une liste dressée à vingt ans de tout ce que tu comptais faire. La plupart des lignes sont barrées d'un « jamais ». Une seule est restée vierge.",
  c: [
    D("Accomplir cette dernière ligne", "✅", "Tu l'accomplis, tremblant{|e} de joie. Un frisson te traverse.", { bonheur: 8, courage: 3, sante: -1 }),
    D("Rire de ta jeunesse et brûler la liste", "🔥", "Tu ris à gorge déployée, sans amertume. Le feu fait un joli spectacle.", { bonheur: 3, sante: 1 }),
    D("Appeler quelqu'un que tu n'as pas vu depuis longtemps", "📞", "Une voix te répond, émue. Vous parlez trois heures.", { bonheur: 6, bonte: 2, sociable: 2 }),
  ],
});
ev("n_maison_retraite_complot", {
  title: "La révolution des fauteuils roulants", ages: [70, 100], tags: ["vieillesse", "loufoque"], ic: "👵🛞", rar: "peu",
  t: "Dans ta résidence, un complot se trame. Une ancienne institutrice organise un tournoi illégal de bridge, un colonel prépare une évasion et ton voisin t'a confié qu'il cache des gâteaux sous son lit.",
  c: [
    D("Rejoindre le tournoi", "🃏", "Tu deviens le champion de la résidence. La rumeur dit que tu triches.", { bonheur: 5, sociable: 3, repute: 2 }),
    C("Participer à l'évasion", "🚪", [O(0.5, "L'évasion réussit jusqu'au parking. Un taxi vous ramène à la résidence.", { bonheur: 7, courage: 3 }), O(0.5, "Le colonel s'endort en chemin. Vous êtes retrouvés au bout de la rue.", { bonheur: 3, courage: 2, repute: -1 })], { risk: 1 }),
    D("Dénoncer les gâteaux", "🍪", "Tu es mis{|e} en quarantaine sociale. Les gâteaux sont à toi, au final.", { honnete: 2, bonheur: -1 }),
  ],
});
ev("n_petits_enfants_chantage", {
  title: "Les petits-enfants affectueux", ages: [65, 100], tags: ["vieillesse", "famille"], ic: "👵👶", rar: "commun", need: { kids: 1 },
  t: "Tes petits-enfants te rendent visite avec des fleurs, des dessins et un enthousiasme étrange. Après une heure, ils te demandent poliment quand tu comptes « nous faire cadeau de la maison ».",
  c: [
    D("Les gâter jusqu'à l'excès", "🎁", "Ils partent avec chacun une montre. Tu es adoré{|e}, ruiné{|e} et ravi{|e}.", { argent: -600, bonheur: 5, bonte: 2 }),
    C("Les mettre à l'épreuve", "🧪", [O(0.5, "Ils réussissent et te sourient. Tu ressens une belle fierté.", { bonheur: 6, bonte: 2 }), O(0.5, "Ils échouent lamentablement. Ils reviennent pour le dessert quand même.", { bonheur: 1, honnete: 1 })], { risk: 1 }),
    D("Promettre la maison à celui qui joue le mieux aux échecs", "♟️", "Une partie légendaire commence. Le dernier survivant gagne ton respect.", { intel: 2, bonheur: 4 }),
  ],
});
ev("n_reunion_classe", {
  title: "La réunion des anciens de la classe", ages: [40, 90], tags: ["vieillesse", "social"], ic: "🎓🥂", rar: "peu",
  t: "Quarante ans après le lycée, une réunion de classe est organisée. Le premier de la classe est devenu chauffeur de taxi, la plus timide dirige une multinationale et le cancre vend des assurances avec un talent redoutable.",
  c: [
    D("Y aller et tout raconter", "🗣️", "Tu repars avec trois anciens amis et quelques secrets rigolos.", { bonheur: 5, sociable: 2, repute: 1 }),
    C("Mentir sur ta réussite", "🎭", [O(0.4, "Ton mensonge est applaudi par la salle. Tu repars en héros imaginaire.", { bonheur: 3, honnete: -3, repute: 2 }), O(0.6, "Ton ancien voisin de table sort ton vrai dossier. La salle rit longuement.", { bonheur: -4, honnete: -3, repute: -3 })], { risk: 2 }),
    D("Rester chez toi, finalement", "🛋️", "La soirée t'a manqué comme une absence en mots croisés.", { bonheur: -1 }),
  ],
});
ev("n_ex_retrouve", {
  title: "Un amour de jeunesse", ages: [55, 95], tags: ["vieillesse", "amour"], ic: "💞🕰️", rar: "peu", need: { rel: "ex" }, who: { amour: "crush" },
  t: "Dans la salle d'attente du médecin, tu reconnais ton ancien amour de jeunesse. Ses cheveux ont blanchi, ses yeux n'ont pas changé. Il ou elle te sourit comme en 1983 et te demande si tu es toujours aussi maladroit{|e} en danse.",
  c: [
    D("Proposer un café", "☕", "Le café dure quatre heures. Vous reparlez de tout, y compris de ce que vous n'avez jamais dit.", { bonheur: 7, charme: 1, rel: { amour: 18 } }),
    C("Inviter à danser au bal du quartier", "💃", [O(0.6, "La piste est à vous. L'orchestre joue pour vous, ou presque.", { bonheur: 9, sante: 1, rel: { amour: 25 } }), O(0.4, "Votre hanche proteste. Les secours sourient en voyant les deux amoureux.", { bonheur: 4, sante: -3 })], { risk: 1 }),
    D("Lui sourire et partir en paix", "🕊️", "Certaines histoires restent belles parce qu'elles sont finies.", { bonheur: 2, bonte: 1 }),
  ],
});
ev("n_memoires", {
  title: "Mes mémoires, tome 1 sur 14", ages: [60, 100], tags: ["vieillesse", "creation"], ic: "📖🖋️", rar: "commun",
  t: "Tu décides d'écrire tes mémoires. Au bout de trois semaines, tu en es à la page 800 et tu viens à peine de naître. Le premier lecteur, ton neveu, demande poliment si les chapitres suivants sont « plus courts ».",
  c: [
    D("Poursuivre en quatorze tomes", "📚", "Ton œuvre devient un monument local. La bibliothèque lui consacre une étagère.", { creatif: 4, bonheur: 5, repute: 2 }),
    C("Chercher un éditeur", "✉️", [O(0.25, "Un éditeur y voit un chef-d'œuvre d'humour involontaire. Le livre est un succès.", { argent: 6000, repute: 6, bonheur: 7 }), O(0.75, "Dix lettres de refus, toutes très courtoises.", { bonheur: -2, creatif: 1 })], { risk: 1 }),
    D("Raconter tes histoires à voix haute", "🗣️", "Tu deviens la star des dîners de famille.", { sociable: 2, bonheur: 4 }),
  ],
});
ev("n_derniere_volonte", {
  title: "La dernière volonté improbable", ages: [70, 100], tags: ["vieillesse", "loufoque"], ic: "⚰️🎈", rar: "rare",
  t: "Tu as une dernière volonté un peu spéciale. Tu veux que tes cendres soient envoyées dans une fusée miniature, ou lancées au-dessus du stade pendant un match de handball. Ton notaire note chaque mot avec un air d'inquiétude.",
  c: [
    D("Maintenir la fusée miniature", "🚀", "Le notaire fait ses calculs. Ce sera cher, spectaculaire et inoubliable.", { argent: -3000, creatif: 3, bonheur: 5 }),
    D("Choisir le stade de handball", "🤾", "Les supporters sont prévenus. Ils applaudiront avec respect.", { bonheur: 4, repute: 2 }),
    D("Demander un simple enterrement champêtre", "🌳", "Un arbre sera planté avec tes cendres. Il grandira bien droit, comme toi.", { bonheur: 3, bonte: 2 }),
  ],
});
ev("n_bucket_list", {
  title: "Dernier tour de piste", ages: [65, 100], tags: ["vieillesse"], ic: "🎢🧓", rar: "peu", need: { money: [1500, null] },
  t: "Ton médecin est formel, il ne faut plus rien faire d'imprudent. Tu as donc décidé de tout faire, dans l'ordre. Saut en parachute, concert de heavy metal et déclaration d'amour à ton boulanger.",
  c: [
    C("Sauter en parachute", "🪂", [O(0.92, "Tu atterris dans un pré, hilare. Le moniteur te serre la main.", { bonheur: 9, courage: 4 }), O(0.08, "Ton cœur lâche d'émotion. Une fin à la hauteur de ta vie.", { die: "d'un coup d'émotion lors d'un saut en parachute" })], { risk: 3 }),
    D("Aller au concert de heavy metal", "🤘", "Tu pogotes avec dignité. Un jeune te prête son t-shirt.", { bonheur: 7, sante: -1, sociable: 2 }),
    D("Déclarer ton amour au boulanger", "🥖", "Il rougit. Il te répond que sa femme et lui seraient honorés de ta baguette quotidienne.", { bonheur: 5, courage: 3, charme: 1 }),
  ],
});
ev("n_veillee_fou_rire", {
  title: "Le fou rire de la veillée", ages: [40, 100], tags: ["vieillesse", "famille"], ic: "🕯️😂", rar: "peu",
  t: "Lors d'une veillée, un cousin raconte une anecdote tellement ridicule sur le défunt que toute l'assemblée éclate de rire. Le curé tousse. La veuve, elle, tape sur la table de joie. Tu es aux premières loges.",
  c: [
    D("Rire aux éclats avec les autres", "😂", "Le deuil devient un peu plus doux. Le rire a ouvert la porte.", { bonheur: 4, sociable: 2, bonte: 1 }),
    D("Tenter de te retenir", "🤐", "Tu craques au pire moment, à voix haute. On t'adore pour ça.", { bonheur: 2, repute: 1, courage: -1 }),
    D("Raconter à ton tour une histoire", "🎤", "Ton récit est applaudi. Le défunt aurait adoré.", { creatif: 2, bonheur: 5, repute: 2 }),
  ],
});
ev("n_heritier_surprise", {
  title: "L'héritier qui n'existait pas", ages: [55, 95], tags: ["vieillesse", "famille", "argent"], ic: "👤📜", rar: "rare", need: { money: [8000, null] },
  t: "Un jeune homme inconnu se présente chez ton notaire, un papier à la main. Il prétend être ton enfant caché, ton petit-neveu ou le fils de ton ex. Il est charmant, mal rasé, et possède ton nez.",
  c: [
    D("L'accueillir à bras ouverts", "🤗", "Il devient un vrai membre de la famille. Il fait la cuisine.", { bonheur: 6, bonte: 3, rel: { enfant: 10 } }),
    C("Demander un test ADN", "🧬", [O(0.6, "Le test confirme. Il fond en larmes, toi aussi.", { bonheur: 5, argent: -300, bonte: 2 }), O(0.4, "Le test est négatif. Il repart, légèrement penaud, avec un chèque pour le déplacement.", { bonheur: -1, argent: -400 })], { risk: 1 }),
    D("Le mettre à la porte", "🚪", "Tu te couches la conscience lourde, ce qui ne te ressemble pas.", { bonheur: -4, bonte: -3 }),
  ],
});
