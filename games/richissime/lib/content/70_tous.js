// Scènes de tous âges — chance, loufoque, animaux, voisins, voyages, argent
const { ev, flash, O, C, D } = require("../kit");

ev("animal_adoption", {
  ages: [10, 80], tags: ["famille"], ic: "🐾🏠", w: 5, roll: { bete: "betes" }, need: { norel: "pet" },
  t: "Devant un refuge, un regard t'accroche. Un petit $bete te fixe comme si tu étais sa dernière chance de voir la vie en rose.",
  c: [
    D("L'adopter", "🥰", "Il s'installe dans ta vie comme dans un coussin. Les ronflements sont rassurants.", { bonte: 3, bonheur: 7, argent: -250 }),
    D("Le parrainer à distance", "💝", "Tu viens le voir chaque mois. C'est un compromis tendre.", { bonte: 2, bonheur: 3, argent: -60 }),
    D("Passer ton chemin", "🚶", "Un pincement au cœur, puis le tramway arrive.", { prudent: 1, bonheur: -1 }),
  ],
});

ev("animal_fugue", {
  ages: [8, 80], tags: ["famille"], ic: "🐕💨", w: 4, need: { rel: "pet" }, who: { animal: "pet" },
  t: "$animal a disparu. La porte est entrouverte, la gamelle intacte, le voisin affirme avoir vu une silhouette poilue filer vers le marché.",
  c: [
    C("Le chercher dans tout le quartier", "🔦", [O(0.7, "Tu le retrouves en train de faire les yeux doux à un boucher.", { bonheur: 6, rel: { animal: 12 }, sport: 1 }), O(0.3, "Tu rentres bredouille. Il reviendra peut-être.", { bonheur: -4, rel: { animal: -5 } })]),
    D("Poser des affiches", "📋", "Quelqu'un l'appelle le lendemain. Il dormait chez une dame qui lui chantait des chansons.", { bonheur: 4, sociable: 2 }),
    D("Attendre sagement", "⏳", "Il revient de lui-même, la queue entre les pattes mais l'air satisfait.", { bonheur: 3 }),
  ],
});

ev("deuil_animal", {
  ages: [8, 90], tags: ["famille"], ic: "🌈🐾", w: 3, need: { rel: "pet" }, who: { animal: "pet" },
  t: "$animal s'éteint doucement dans ses bras, après de longues années à partager ton canapé. Le silence est lourd.",
  c: [
    D("Lui offrir un petit jardin d'adieu", "🌷", "Tu plantes un arbuste. Chaque printemps, il fleurit.", { kill: "animal", bonheur: -5, bonte: 2, creatif: 1 }),
    D("Adopter un compagnon tout de suite", "🐱", "Un nouveau venu, sans remplacer l'ancien. Le cœur se réchauffe.", { kill: "animal", bonheur: -2, argent: -200 }),
    D("Prendre le temps de pleurer", "🕯️", "Le chagrin passe lentement.", { kill: "animal", bonheur: -7, sante: -1 }),
  ],
});

ev("pigeon_voyageur_commerce", {
  ages: [12, 90], tags: ["loufoque"], ic: "🕊️📜", w: 3,
  t: "Un pigeon se pose sur ton balcon avec un message attaché à la patte. Il dit « Contactez-moi pour une affaire en or. Signé, un ami ».",
  c: [
    C("Répondre au message", "✉️", [O(0.3, "L'ami est un riche excentrique qui t'offre un petit dédommagement et un thé.", { argent: 1500, bonheur: 4, creatif: 2 }), O(0.7, "Le message était une blague d'un collègue. Le pigeon est moins drôle.", { bonheur: 1, creatif: 1 })]),
    D("Garder le pigeon", "🪶", "Il devient ton colocataire emplumé.", { bonheur: 3, creatif: 2 }),
    D("L'ignorer", "🙄", "Tu changes de balcon.", { prudent: 1 }),
  ],
});

ev("fantome_grenier", {
  ages: [10, 90], tags: ["loufoque"], ic: "👻🕯️", w: 3,
  t: "Des bruits étranges montent du grenier à minuit. Quelqu'un chuchote, claque une porte, déplace des chaises. L'une des chaises semble danser le tango.",
  c: [
    C("Monter voir", "🔦", [O(0.5, "Un fantôme timide qui s'excuse du dérangement et te propose un jeu de cartes.", { bonheur: 4, courage: 3, creatif: 3, flag: "fantome_ami" }), O(0.5, "C'est un raton laveur. Il a mangé les restes de la fête.", { courage: 2, bonheur: 2, sante: 0 })], { risk: 1 }),
    D("Mettre des boules Quiès", "🙉", "Tu dors paisiblement. Le fantôme se vexe.", { prudent: 2, bonheur: 0 }),
    D("Appeler un exorciste", "📞", "L'exorciste arrive avec une baguette en bois et un thermos. Il finit par partager ton thé.", { argent: -150, bonheur: 2, creatif: 1 }),
  ],
});

ev("concours_cuisine_ville", {
  ages: [14, 80], tags: ["loufoque", "social"], ic: "🍲🏆", w: 4, roll: { plat: "plats" },
  t: "La ville de $ville organise un grand concours de cuisine. Le thème de l'année est « $plat revisité ». Les juges sont sévères et affamés.",
  c: [
    C("Participer avec une recette traditionnelle", "👩‍🍳", [O(0.4, "Un second prix, des applaudissements, et un tablier en cadeau.", { repute: 4, bonheur: 5, argent: 200, creatif: 2 }), O(0.6, "Pas de trophée, mais des compliments.", { bonheur: 3, creatif: 1 })]),
    C("Inventer un plat délirant", "🧪", [O(0.25, "Un triomphe ! Ton plat est publié dans le journal local.", { repute: 7, creatif: 5, argent: 400, bonheur: 7 }), O(0.75, "Les juges ont pâli. L'un d'eux est parti en courant.", { creatif: 3, bonheur: 1, repute: -2 })], { risk: 1 }),
    D("Rester spectateur et déguster", "🍴", "Tu goûtes les plats des autres, c'est un régal.", { bonheur: 3, sante: -1 }),
  ],
});

ev("voyage_hasard", {
  ages: [14, 85], tags: ["voyage"], ic: "🧭🌍", w: 5, roll: { pays: "pays" },
  t: "Une amie te propose un week-end improvisé direction $pays. Le départ est demain à l'aube. Un sac, un passeport, un grain de folie.",
  c: [
    D("Partir sur un coup de tête", "✈️", "Un week-end fou et sans plan. Tu rentres épuisé{|e} et radieux{|se}.", { courage: 3, bonheur: 7, argent: -700, creatif: 1 }, { cost: 700 }),
    D("Dire non, prudemment", "🛋️", "Tu regardes les photos de ton amie, un peu envieux{|se}.", { prudent: 2, bonheur: -1 }),
    C("Proposer de partir mais avec un plan", "🗺️", [O(1, "Un compromis. Vous passez un séjour bien organisé, peu de surprises mais de bonnes tables.", { prudent: 2, bonheur: 5, argent: -900 })], { cost: 900 }),
  ],
});

ev("objet_perdu_retrouve", {
  ages: [8, 90], tags: ["loufoque"], ic: "🔑❓", w: 4, roll: { objet: "objets" },
  t: "Tu retrouves un vieux $objet que tu pensais perdu depuis des années. Il a une histoire, des taches mystérieuses et une odeur de grenier.",
  c: [
    D("Le restaurer", "🛠️", "Un peu d'huile de coude et le voilà comme neuf. Tu t'en sers avec fierté.", { creatif: 3, bonheur: 4, argent: -40 }),
    C("Le vendre", "🏷️", [O(0.3, "Un collectionneur l'achète à prix d'or !", { argent: 900, bonheur: 4 }), O(0.7, "Quelqu'un propose quatre euros. Tu refuses, vexé{|e}.", { bonheur: 0 })]),
    D("Le remettre au fond du grenier", "📦", "Il y sera encore dans dix ans.", { prudent: 1 }),
  ],
});

ev("anniv_surprise", {
  ages: [8, 90], tags: ["social"], ic: "🎂😲", w: 5, who: { ami: "friend" },
  t: "Tu rentres chez toi, la porte s'ouvre, les lumières s'allument et tout le monde crie « Surprise ! ». Tu avais complètement oublié ta propre fête.",
  c: [
    D("Remercier tout le monde", "🙏", "Larmes, rires, gâteaux. Une soirée gravée dans les albums.", { bonheur: 7, sociable: 3, rel: { ami: 8 } }),
    D("Faire un discours improvisé", "🎤", "Ton discours est confus, poétique et très applaudi.", { charme: 2, repute: 2, bonheur: 5 }),
    D("Fuir par la fenêtre", "🏃", "Tu reviens poliment dix minutes après, tout le monde a compris.", { courage: -1, bonheur: 3 }),
  ],
});

ev("tempete_arbre", {
  ages: [12, 90], tags: ["loufoque"], ic: "🌪️🌳", w: 3,
  t: "Une tempête arrache l'arbre du jardin, qui s'écrase en douceur sur la voiture du voisin. La voiture est devenue un décor de théâtre.",
  c: [
    D("Assumer et indemniser", "🤝", "L'assurance prend en charge une grande partie des frais.", { argent: -400, honnete: 3, bonte: 2, repute: 1 }),
    C("Nier toute responsabilité", "🙅", [O(0.4, "Le voisin fronce les sourcils mais abandonne.", { honnete: -2, bonheur: -1 }), O(0.6, "Il porte plainte, tu perds ton temps et ton calme.", { argent: -900, honnete: -2, bonheur: -3, repute: -2 })], { risk: 1 }),
    D("Organiser un barbecue avec le bois", "🔥", "Tout le quartier arrive. Le voisin aussi, il apporte les saucisses.", { creatif: 3, sociable: 3, bonheur: 4 }),
  ],
});

ev("rencontre_celebrite", {
  ages: [14, 80], tags: ["loufoque", "social"], ic: "🌟📸", w: 3,
  t: "Au détour d'une rue, tu croises une célébrité qui fait la queue à la boulangerie. Elle a l'air d'hésiter entre un pain au chocolat et un chausson aux pommes.",
  c: [
    D("Lui demander un selfie", "🤳", "Elle accepte avec élégance. Ta photo fait le buzz dans ton cercle.", { repute: 3, bonheur: 4, charme: 1 }),
    C("Lui conseiller le chausson", "🥐", [O(0.4, "Elle suit ton conseil et te remercie avec un clin d'œil. Tu en parles pendant des années.", { bonheur: 6, repute: 4, charme: 2 }), O(0.6, "Elle te regarde étrangement et choisit le pain au chocolat.", { bonheur: 1 })]),
    D("Faire semblant de ne pas la reconnaître", "😎", "Tu as le panache des gens tranquilles.", { charme: 2, prudent: 1 }),
  ],
});

ev("fete_foraine", {
  ages: [8, 70], tags: ["social"], ic: "🎡🍭", w: 4, who: { ami: "friend" },
  t: "La fête foraine s'est installée sur la place. Le grand huit hurle, les auto-tamponneuses cognent, et un stand promet des peluches géantes.",
  c: [
    D("Tenter le grand huit", "🎢", "Tes cheveux se redressent, ton cœur aussi. Quelle vitesse !", { courage: 3, bonheur: 5, sante: -1 }),
    C("Jouer au stand de tir", "🎯", [O(0.35, "Tu gagnes une peluche géante qui occupe tout le salon.", { bonheur: 5, repute: 1, flag: "peluche_geante" }), O(0.65, "Tu repars avec un porte-clés.", { bonheur: 1, argent: -15 })]),
    D("Dévorer des beignets", "🍩", "Sucre glace partout, sourire jusqu'aux oreilles.", { bonheur: 4, sante: -1, argent: -20 }),
  ],
});

ev("noel_famille", {
  ages: [6, 95], tags: ["famille"], ic: "🎄🎁", w: 5, once: false, cool: 4, who: { mere: "mere" },
  t: "C'est Noël. La dinde est trop cuite, l'oncle raconte la même histoire, les enfants hurlent de joie en déchirant les papiers. Un cadeau mystère attend sous le sapin.",
  c: [
    D("Se laisser porter par la magie", "✨", "Les lumières, les chants, les rires. Tout est chaleur.", { bonheur: 6, bonte: 2 }),
    C("Offrir des cadeaux fastueux", "🎁", [O(1, "Tout le monde est comblé, ton compte un peu moins.", { argent: -600, bonheur: 5, bonte: 3 })], { cost: 600 }),
    C("Tenter de cuisiner la dinde", "🦃", [O(0.5, "Un succès. Tu es le héros du repas.", { creatif: 2, bonheur: 5, repute: 1 }), O(0.5, "La dinde est un désastre. La pizza livrée est un triomphe.", { bonheur: 3 })]),
  ],
});

ev("meteo_canicule", {
  ages: [8, 95], tags: ["sante"], ic: "☀️🥵", w: 4,
  t: "Une canicule brûlante tombe sur $ville. Le bitume fond, les glaces aussi, ton ventilateur tourne comme un hélicoptère.",
  c: [
    D("Rester au frais, boire de l'eau", "🧊", "Tu traverses la vague de chaleur sans encombre.", { prudent: 2, sante: 1 }),
    D("Aller à la piscine", "🏊", "Un plongeon et des éclaboussures. Quelle fraîcheur.", { sport: 2, bonheur: 4, argent: -10 }),
    C("Faire du sport malgré tout", "🏃", [O(0.5, "Tu t'en sors avec un teint de tomate.", { sport: 3, bonheur: 1, sante: -1 }), O(0.5, "Insolation. Une nuit à l'hôpital.", { sante: -6, argent: -200, bonheur: -3 })], { risk: 1 }),
  ],
});

ev("concours_talent", {
  ages: [8, 60], tags: ["loufoque", "social"], ic: "🎪🥁", w: 4, roll: { talent: ["ventriloquie", "claquettes", "magie", "chant d'oiseaux", "danse de la pluie", "jonglage avec des œufs"] },
  t: "Un concours de talents passe dans ta ville. Ta spécialité, c'est la $talent. Le public est généreux, le jury aussi, mais pas toujours.",
  c: [
    C("Tenter ta chance", "🎤", [O(0.25, "Tu remportes le concours ! Un contrat local t'attend.", { repute: 8, creatif: 4, argent: 1500, bonheur: 8 }), O(0.45, "Tu termines en milieu de tableau. Une belle expérience.", { repute: 1, creatif: 2, bonheur: 3 }), O(0.3, "Un fiasco. Une vidéo gênante circule.", { repute: -3, bonheur: -2, courage: 2 })], { risk: 1 }),
    D("Regarder dans le public", "👀", "Un candidat vole la vedette avec un tour de passe-passe fou.", { bonheur: 3 }),
  ],
});

ev("amnesie_clef", {
  ages: [8, 90], tags: ["loufoque"], ic: "🔑🤔", w: 4,
  t: "Tu as perdu tes clés. Ou plutôt tu sais exactement où elles sont, mais pas du tout où tu es toi-même quand tu penses qu'elles sont là.",
  c: [
    D("Faire appel à un serrurier", "🔧", "Il arrive avec un sourire et une facture à deux zéros.", { argent: -190, bonheur: -1 }),
    D("Passer par la fenêtre", "🪟", "Tu escalades avec grâce, tu retombes sur un chat endormi.", { sport: 1, courage: 1, bonheur: 1 }),
    D("Attendre l'ami qui a un double", "⏳", "Deux heures plus tard, tu es sauvé{|e}.", { prudent: 1, bonheur: 0 }),
  ],
});

ev("marche_noel_arnaque", {
  ages: [14, 90], tags: ["argent"], ic: "🛍️🕵️", w: 4,
  t: "Sur un marché, un vendeur très persuasif propose une « montre en or de famille » pour trois fois rien. Elle a l'air un peu trop brillante pour être honnête.",
  c: [
    C("L'acheter", "⌚", [O(0.3, "C'est une vraie ! Une pièce ancienne de valeur.", { item: "bijou", argent: -80, bonheur: 4 }), O(0.7, "Plastique doré. Le vendeur a déjà disparu.", { argent: -80, bonheur: -2 })], { cost: 80, risk: 1 }),
    D("Marchander pour le plaisir", "🗣️", "Tu repars sans rien, mais avec un fou rire.", { charme: 2, bonheur: 2 }),
    D("Passer ton chemin", "🚶", "Tu sens l'embrouille de loin.", { prudent: 2 }),
  ],
});

ev("taxe_amende_stationnement", {
  ages: [18, 85], tags: ["argent"], ic: "🅿️📃", w: 4, need: { asset: "voiture" },
  t: "Un petit papier orange orne ton pare-brise. Une amende, évidemment. Tu t'étais garé en face d'un panneau que tu avais pris pour un décor de théâtre.",
  c: [
    D("Payer sans discuter", "💳", "Ça pique, mais c'est fini.", { argent: -135, bonheur: -1 }),
    C("Contester", "📝", [O(0.35, "L'amende est annulée !", { argent: 0, bonheur: 3, honnete: 1 }), O(0.65, "Elle est majorée. Tu aurais mieux fait de payer.", { argent: -190, bonheur: -2 })]),
    D("Mettre l'amende sur la voiture du voisin", "😈", "Il est furieux, tu es mort de rire.", { argent: 0, honnete: -3, bonheur: 2 }),
  ],
});

ev("voisin_celebre_cuisinier", {
  ages: [16, 90], tags: ["loufoque", "social"], ic: "🧑‍🍳🍷", w: 3, who: { voisin: "neighbor" },
  t: "$voisin se révèle être un chef étoilé à la retraite. Il t'invite à dîner et te promet « le meilleur soufflé de ta vie ». Il est sérieux et sinistrement exigeant.",
  c: [
    D("Accepter avec joie", "🍽️", "Une soirée incroyable, un soufflé qui monte jusqu'au plafond.", { bonheur: 6, creatif: 2, rel: { voisin: 12 } }),
    D("Proposer d'apprendre", "👨‍🍳", "Il t'enseigne le secret de la béchamel. Tu hérites de son tablier.", { creatif: 4, intel: 1, bonheur: 4, rel: { voisin: 14 } }),
    D("Refuser, tu es au régime", "🥗", "Il s'offusque, mais pas longtemps.", { sante: 1, rel: { voisin: -4 } }),
  ],
});

ev("bug_informatique", {
  ages: [12, 80], tags: ["loufoque"], ic: "💻🔥", w: 4,
  t: "Ton ordinateur plante sans prévenir, juste au moment où tu allais sauvegarder ton travail. L'écran bleu te fixe comme un vieux sage qui sait que tu aurais dû sauvegarder.",
  c: [
    D("Redémarrer en priant", "🙏", "Un miracle. Tout est là, sauf la dernière heure de travail.", { bonheur: -1, prudent: 2 }),
    C("Le réparer toi-même", "🛠️", [O(0.5, "Tu es un génie du tournevis. Tout repart.", { intel: 2, creatif: 1, bonheur: 3 }), O(0.5, "Le plus beau des feux d'artifice.", { argent: -600, bonheur: -3 })]),
    D("Payer un réparateur", "💼", "Il revient avec le même sourire qu'un dentiste.", { argent: -150, bonheur: -1 }),
  ],
});

ev("don_sang_ou_charite", {
  ages: [18, 70], tags: ["social"], ic: "🩸❤️", w: 4,
  t: "Un stand de collecte de sang s'est installé près de chez toi. Les infirmières sourient, les biscuits sont gratuits, les gens hésitent.",
  c: [
    D("Donner ton sang", "🩸", "Une petite piqûre, une grande fierté. Les biscuits sont délicieux.", { bonte: 4, bonheur: 3, sante: -1, repute: 1 }),
    D("Faire un don en argent", "💶", "Tu verses ce que tu peux. C'est utile aussi.", { argent: -50, bonte: 2, bonheur: 1 }, { cost: 50 }),
    D("Passer ton chemin", "🚶", "Tu n'oses pas, tu as la phobie des aiguilles.", { bonheur: 0 }),
  ],
});

ev("quiproquo_carte_bancaire", {
  ages: [16, 90], tags: ["argent", "loufoque"], ic: "💳🤦", w: 3,
  t: "Ta carte bancaire est refusée devant un caissier amusé et trois personnes impatientes. Tu fouilles tes poches, puis ton sac, puis ton cœur.",
  c: [
    D("Payer avec des pièces", "🪙", "Tu étales ton petit trésor sur le comptoir. On t'applaudit.", { argent: -45, bonheur: 1 }),
    D("Reposer les courses", "🙈", "Tu repars avec un sandwich et de la dignité.", { bonheur: -1 }),
    D("Appeler ton ami à la rescousse", "📞", "Il vient avec un grand sourire et une carte fonctionnelle.", { sociable: 1, bonheur: 1, argent: -45 }),
  ],
});

ev("zombie_marathon", {
  ages: [16, 55], tags: ["loufoque", "sport"], ic: "🧟🏃", w: 3,
  t: "Un marathon de zombies est organisé dans $ville. Des centaines de personnes maquillées courent en poussant des cris, poursuivies par des figurants.",
  c: [
    D("Courir en zombie", "🧟", "Tu cours en gémissant, tu t'amuses comme jamais.", { sport: 3, bonheur: 5, sociable: 2 }),
    D("Courir en survivant", "🏃", "Tu sprintes, tu esquives, tu gagnes le trophée de la fuite.", { sport: 4, courage: 2, bonheur: 4 }),
    D("Regarder avec un café", "☕", "Le spectacle est mémorable.", { bonheur: 2 }),
  ],
});

ev("troc_objet_etrange", {
  ages: [12, 90], tags: ["loufoque", "argent"], ic: "🔄🧸", w: 3, roll: { fou: "fous" },
  t: "Un vieux marchand de troc te propose d'échanger ta montre contre $fou. Il jure que c'est le meilleur marché du siècle.",
  c: [
    C("Accepter l'échange", "🤝", [O(0.3, "Le $fou se révèle être une affaire en or.", { item: { kind: "loufoque", name: "Curiosité du marchand", value: 3500 }, bonheur: 5, creatif: 3 }), O(0.7, "Tu as juste troqué ta montre contre une bizarrerie.", { item: { kind: "loufoque", name: "Curiosité du marchand", value: 100 }, bonheur: 2, creatif: 2 })]),
    D("Refuser et rire", "😂", "Tu repars avec ta montre et une histoire.", { bonheur: 2 }),
  ],
});

ev("petite_annonce_etrange", {
  ages: [16, 80], tags: ["loufoque", "argent"], ic: "📰🤨", w: 3,
  t: "Une petite annonce attire ton regard. « Cherche personne sérieuse pour garder un cactus pendant un an. Rémunération généreuse ». Le numéro est celui d'un manoir.",
  c: [
    C("Répondre à l'annonce", "☎️", [O(0.45, "Le cactus est d'une rare espèce. Tu es payé grassement, il fleurit à la fin de l'année.", { argent: 3500, bonheur: 4, creatif: 2 }), O(0.55, "Le cactus pique, le propriétaire marmonne, la rémunération est symbolique.", { argent: 200, bonheur: 0 })]),
    D("Ne pas répondre", "📵", "Tu préfères les offres moins piquantes.", { prudent: 2 }),
  ],
});

ev("flashmob_ville", {
  ages: [12, 60], tags: ["loufoque", "social"], ic: "💃🎶", w: 3,
  t: "Au milieu de la place, une musique éclate. Cinquante personnes se mettent à danser en chœur, et l'une d'entre elles te tend la main.",
  c: [
    D("Rejoindre la danse", "💃", "Tu connais la chorégraphie par miracle. Les passants filment.", { bonheur: 6, sociable: 3, repute: 2 }),
    D("Filmer la scène", "📹", "La vidéo fait quelques milliers de vues.", { bonheur: 2, repute: 1 }),
    D("T'éclipser", "🫥", "Tu laisses la fête aux autres.", { prudent: 1 }),
  ],
});

ev("enquete_voisin_disparu", {
  ages: [10, 80], tags: ["loufoque"], ic: "🔎🕵️", w: 3, who: { voisin: "neighbor" },
  t: "$voisin n'a pas relevé son courrier depuis une semaine. Sa porte est entrouverte, une odeur de tarte aux pommes flotte dans l'escalier.",
  c: [
    D("Entrer et vérifier", "🚪", "Il dort, la tarte refroidit, tout va bien. Il te remercie en t'offrant la moitié.", { bonte: 3, bonheur: 3, rel: { voisin: 10 } }),
    D("Prévenir la police", "👮", "Les agents arrivent... pour constater qu'il est parti en vacances. Tout le monde en rit.", { prudent: 2, honnete: 1, rel: { voisin: -3 } }),
    D("Ne pas te mêler de ça", "🤐", "On ne sait jamais ce que cachent les gens.", { prudent: 1 }),
  ],
});

ev("pari_ami_fou", {
  ages: [14, 70], tags: ["loufoque", "social"], ic: "🎲🤪", w: 4, who: { ami: "friend" }, roll: { somme: [20, 300, 20] },
  t: "$ami te parie $somme que tu ne tiendras pas une semaine sans te plaindre. Les règles sont floues, les juges bavards, la tentation immense.",
  c: [
    C("Relever le défi", "🤞", [O(0.4, "Tu gagnes, et tu deviens insupportablement serein{|e}.", { argent: (p, x) => x.vals.somme, prudent: 2, bonheur: 3, rel: { ami: 5 } }), O(0.6, "Tu craques au troisième jour. $ami savoure sa victoire.", { argent: (p, x) => -x.vals.somme, bonheur: -1, rel: { ami: 4 } })], { cost: 20 }),
    D("Refuser", "🙅", "Tu prétends être au-dessus de ça.", { prudent: 2 }),
  ],
});

ev("don_surprise_inconnu", {
  ages: [12, 90], tags: ["social"], ic: "🎁🫶", w: 3,
  t: "Un inconnu t'offre un café dans une file d'attente, « pour la bonne humeur du jour ». Il disparaît avant que tu puisses le remercier.",
  c: [
    D("Offrir un café à ton tour", "☕", "Le geste se transmet à toute la file. Une journée belle comme un dimanche.", { bonte: 4, bonheur: 5, repute: 1 }),
    D("Savourer et sourire", "😊", "Un petit bonheur de rien du tout.", { bonheur: 3 }),
  ],
});

ev("chute_banale", {
  ages: [6, 95], tags: ["sante"], ic: "🤸💥", w: 4,
  t: "Une peau de banane, un trottoir mouillé, une marche en moins. Tu t'étales sous les yeux de dix passants dont un qui filme.",
  c: [
    D("Te relever avec dignité", "🎩", "Tu salues l'assistance. On t'applaudit.", { charme: 1, courage: 1, sante: -1, repute: 1 }),
    D("Rire aux éclats", "😂", "Le rire est contagieux. Les passants rient avec toi.", { bonheur: 3, sociable: 1, sante: -1 }),
    D("Rentrer en vitesse", "🏃", "Tu t'enfuis avec un genou en vrac.", { sante: -2, bonheur: -1 }),
  ],
});

ev("voyage_train_rencontre", {
  ages: [14, 80], tags: ["voyage", "social"], ic: "🚆💬", w: 4,
  t: "Dans le train, ton voisin de siège te raconte sa vie pendant trois heures. Il a été clown, pirate, comptable et inventeur d'un fromage qui chante.",
  c: [
    D("L'écouter avec passion", "👂", "Tu apprends des choses fascinantes. Tu te sens plus riche.", { intel: 2, creatif: 2, bonheur: 4, bonte: 1 }),
    D("Mettre ton casque", "🎧", "Tu rates l'histoire du fromage.", { prudent: 1 }),
    C("Lui demander un conseil d'affaires", "💼", [O(0.3, "Il te souffle un excellent tuyau, qui rapporte un petit pactole.", { argent: 1800, intel: 1 }), O(0.7, "Il te conseille d'investir dans les fromages chantants.", { creatif: 2, bonheur: 2 })]),
  ],
});

ev("miracle_bus_retard", {
  ages: [14, 70], tags: ["loufoque"], ic: "🚌⏰", w: 3,
  t: "Ton bus a vingt minutes de retard. Le chauffeur est visiblement sorti pour se promener, et la ligne est occupée par un cortège de chèvres.",
  c: [
    D("Attendre avec philosophie", "🧘", "Tu regardes les chèvres. Elles te regardent.", { prudent: 1, bonheur: 1 }),
    D("Marcher à pied", "🚶", "Tu arrives en sueur mais à l'heure.", { sport: 2, sante: 1 }),
    D("Prendre un taxi", "🚕", "Tu arrives frais, ton portefeuille aussi.", { argent: -30, bonheur: 1 }),
  ],
});

flash("Ton chat renverse un pot de fleurs et te regarde d'un air innocent.", { bonheur: 1 }, { need: { rel: "pet" } });
flash("Tu gagnes un concours de la plus belle citrouille, avec un légume de contrebande.", { bonheur: 2, repute: 1, argent: 50 }, { ages: [12, 80], tag: "loufoque" });
flash("Une pluie fine accompagne ta promenade. Tu aimes cette mélancolie douce.", { bonheur: 1 });
flash("Tu te fais offrir un bouquet de fleurs sauvages par un inconnu.", { bonheur: 2, charme: 1 }, { ages: [14, 90] });
flash("Un pigeon te vole ton sandwich au jambon. Tu lui pardonnes.", { bonheur: 0, argent: -4 });
flash("Tu surprends ton reflet dans une vitrine et tu te trouves magnifique.", { bonheur: 2, charme: 1 });
flash("Tu perds un gant. Un gant orphelin attend quelque part sa moitié.", { bonheur: -1 }, { ages: [8, 90] });
flash("Un nuage ressemble parfaitement à un canard. Tu en parles à tout le monde.", { creatif: 1, bonheur: 1 });
flash("Ton voisin te laisse des tomates de son jardin devant la porte.", { bonheur: 2, sante: 1 }, { ages: [16, 90] });
flash("On te complimente sur ta coiffure. Tu n'as pas coiffé tes cheveux depuis trois jours.", { charme: 1, bonheur: 2 }, { ages: [14, 90] });
flash("Tu trouves un euro dans la rue. Ton jour est parfait.", { argent: 1, bonheur: 1 });
flash("Ton horoscope annonce une rencontre capitale. Tu croises un facteur.", { bonheur: 1 }, { ages: [14, 90], tag: "loufoque" });
flash("Tu rates l'horaire de l'heure d'été et arrives une heure en avance au travail.", { bonheur: -1 }, { ages: [16, 70], need: { job: true } });
flash("Un étranger te demande son chemin. Tu l'envoies dans la bonne direction. Pour une fois.", { bonte: 1, bonheur: 1 }, { ages: [14, 90] });
flash("Un orage t'oblige à dîner à la bougie. Étrangement, ça te plaît.", { bonheur: 2 }, { ages: [10, 90] });
flash("Le prix de la baguette a augmenté de dix centimes. La nation gronde.", { argent: -10, bonheur: -1 }, { ages: [16, 90] });
