// Amour, couple, famille
const { ev, flash, O, C, D } = require("../kit");

ev("appli_rencontre", {
  ages: [18, 60], tags: ["amour"], ic: "📱💘", w: 6, need: { single: true }, who: { crush: { kind: "crush", fresh: true } },
  t: "Sur une application de rencontres, un profil te fait sourire. $crush aime les randonnées, les chats et les films en noir et blanc. Sa photo principale montre un poisson.",
  c: [
    C("Proposer un rendez-vous", "☕", [O(0.55, "Le rendez-vous est charmant. Vous vous reverrez, sans doute.", { bonheur: 6, charme: 1, rel: { crush: 20 }, becomes: { crush: "partner" } }), O(0.45, "Il n'a rien à voir avec la photo (c'était vraiment un poisson).", { bonheur: -1, courage: 1 })], { risk: 1 }),
    D("Passer à un autre profil", "👉", "L'infini des possibles t'étourdit.", { bonheur: 0 }),
    D("Discuter sans se voir", "💬", "Des semaines de messages. Le temps file.", { creatif: 1, bonheur: 2, rel: { crush: 6 } }),
  ],
});

ev("rendez_vous_catastrophe", {
  ages: [16, 65], tags: ["amour", "loufoque"], ic: "🍝😅", w: 5, who: { crush: "crush" },
  t: "Premier rendez-vous avec $crush au restaurant. Tu renverses un verre de vin, le serveur te confond avec un chanteur, et ta chaise cède sous toi.",
  c: [
    D("Rire de toi-même", "😂", "$crush éclate de rire à son tour. Une complicité naît.", { charme: 2, bonheur: 5, rel: { crush: 15 } }),
    D("Fuir aux toilettes", "🚽", "Tu te rafraîchis le visage et reviens avec dignité.", { bonheur: 0, rel: { crush: 3 } }),
    D("Changer de restaurant", "🏃", "Vous finissez au kebab du coin. C'est mieux.", { creatif: 2, bonheur: 4, rel: { crush: 10 } }),
  ],
});

ev("couple_vacances", {
  ages: [20, 80], tags: ["amour", "voyage"], ic: "🏝️💑", w: 5, need: { partner: true }, who: { conjoint: "partner" },
  t: "Toi et $conjoint prévoyez des vacances à deux. Les plages, les restos et les souvenirs vous attendent. Il faut quand même choisir entre la montagne et la mer.",
  c: [
    D("Partir à la mer", "🏖️", "Le soleil, le sable, un amour fort. Vous rentrez bronzés.", { bonheur: 7, rel: { conjoint: 10 }, argent: -1200 }, { cost: 1200 }),
    D("Choisir la montagne", "⛰️", "Randonnées, fondues, silence. Tout est calme.", { sport: 3, bonheur: 6, rel: { conjoint: 8 }, argent: -900 }, { cost: 900 }),
    D("Rester à la maison", "🏡", "Vous faites des économies mais vous avez un peu de nostalgie.", { argent: 300, rel: { conjoint: -3 } }),
  ],
});

ev("dispute_couple", {
  ages: [20, 80], tags: ["amour"], ic: "😤💬", w: 5, need: { partner: true }, who: { conjoint: "partner" },
  t: "Une dispute éclate à propos de la vaisselle, du thermostat ou d'un souvenir mal raconté. Les mots prennent de la vitesse.",
  c: [
    D("S'excuser en premier", "🙏", "Un câlin et la paix revient.", { bonte: 2, bonheur: 2, rel: { conjoint: 8 } }),
    C("Camper sur tes positions", "🛑", [O(0.5, "Chacun reste dans son coin pendant deux jours, puis ça passe.", { rel: { conjoint: -6 }, bonheur: -3 }), O(0.5, "Ça s'envenime.", { rel: { conjoint: -15 }, bonheur: -5 })]),
    D("Proposer un dîner pour parler", "🍷", "La conversation désamorce tout.", { sociable: 1, rel: { conjoint: 10 }, argent: -60 }),
  ],
});

ev("surprise_anniversaire_couple", {
  ages: [20, 80], tags: ["amour"], ic: "🎁💕", w: 4, need: { partner: true }, who: { conjoint: "partner" },
  t: "L'anniversaire de $conjoint approche. Tu veux lui faire une surprise inoubliable. Ton portefeuille et ton imagination se battent en duel.",
  c: [
    D("Organiser une soirée secrète", "🎉", "Les amis surgissent derrière le canapé. $conjoint est aux anges.", { rel: { conjoint: 15 }, bonheur: 6, argent: -300 }),
    D("Offrir un voyage", "✈️", "Un week-end dans un endroit de rêve.", { rel: { conjoint: 18 }, bonheur: 7, argent: -1200 }, { cost: 1200 }),
    D("Oublier la date", "🫣", "Catastrophe.", { rel: { conjoint: -15 }, bonheur: -4, charme: -1 }),
  ],
});

ev("conjoint_chomage", {
  ages: [25, 60], tags: ["amour", "argent"], ic: "📉💑", w: 3, need: { partner: true }, who: { conjoint: "partner" },
  t: "$conjoint perd son emploi. L'ambiance à la maison est tendue, les factures s'empilent, et les sourires sont plus rares.",
  c: [
    D("Le soutenir", "🤗", "Vous serrez les coudes. Il retrouve du travail quelques mois plus tard.", { bonte: 3, rel: { conjoint: 12 }, argent: -1500 }),
    D("Lui mettre la pression", "😠", "Chaque mot est un piment. Ça devient pesant.", { rel: { conjoint: -12 }, bonheur: -4 }),
    D("Prendre un second job", "🛠️", "Tu couvres les charges, en y laissant du sommeil.", { argent: 2500, sante: -3, bonheur: -2, rel: { conjoint: 6 } }),
  ],
});

ev("conjoint_cadeau_fou", {
  ages: [22, 80], tags: ["amour", "loufoque"], ic: "🎁🐓", w: 3, need: { partner: true }, who: { conjoint: "partner" },
  t: "Pour fêter vos dix ans de relation, $conjoint t'offre une poule vivante nommée Brigitte. « Elle pond des œufs d'or », promet-il, un peu gêné.",
  c: [
    D("Accueillir Brigitte", "🐔", "Elle ne pond que des œufs ordinaires mais délicieux.", { bonheur: 5, creatif: 2, rel: { conjoint: 8 } }),
    C("Faire expertiser les œufs", "🥚", [O(0.15, "Surprise ! L'un des œufs a une coquille en or.", { item: "poule_or", bonheur: 8, creatif: 3 }), O(0.85, "Ce sont de très bons œufs.", { bonheur: 2 })]),
    D("La rendre discrètement", "🔄", "Brigitte part vivre à la ferme voisine.", { bonheur: -1, rel: { conjoint: -4 } }),
  ],
});

ev("parents_conflit", {
  ages: [20, 60], tags: ["famille"], ic: "👨‍👩‍👦😬", w: 5, need: { rel: "parent" }, who: { parent: "parent" },
  t: "$parent critique ta façon de vivre et te fait des remarques sur ton métier, ton logement et ta façon de plier le linge. Un déjeuner familial vire à l'orage.",
  c: [
    D("Encaisser en silence", "🤐", "Tu rentres épuisé{|e}, mais en paix.", { prudent: 2, bonheur: -2 }),
    C("Se disputer franchement", "🔥", [O(0.5, "Vous finissez par rire de vous-mêmes.", { courage: 2, rel: { parent: 6 }, bonheur: 2 }), O(0.5, "Vous ne vous parlez plus pendant des mois.", { courage: 1, rel: { parent: -18 }, bonheur: -4 })]),
    D("Changer de sujet avec humour", "😂", "Un rire sauve le repas.", { charme: 1, rel: { parent: 4 } }),
  ],
});

ev("parent_malade", {
  ages: [30, 70], tags: ["famille", "sante"], ic: "🏥👵", w: 4, need: { rel: "parent" }, who: { parent: "parent" },
  t: "$parent est hospitalisé{|e}. Les couloirs, l'odeur de désinfectant et les visites quotidiennes envahissent ton emploi du temps.",
  c: [
    D("Rester à son chevet", "🛏️", "Chaque jour, tu passes de longues heures. Sa guérison te comble.", { bonte: 4, rel: { parent: 15 }, bonheur: 1, sante: -2 }),
    D("Prendre en charge les frais", "💶", "Tu paies pour des soins de qualité.", { argent: -3000, bonte: 3, rel: { parent: 10 } }, { cost: 3000 }),
    D("Rendre visite à l'occasion", "🚪", "Tu viens quand tu peux. $parent comprend.", { rel: { parent: -3 }, bonheur: -1 }),
  ],
});

ev("parent_deces", {
  ages: [35, 80], tags: ["famille"], ic: "🕯️🌹", w: 3, need: { rel: "parent" }, who: { parent: "parent" },
  t: "$parent s'éteint à l'automne. La cérémonie est simple, la famille pleure, et un oncle raconte une anecdote qui fait rire tout le monde en pleurs.",
  c: [
    D("Faire un éloge", "🎤", "Ton discours est sincère. Tu sens une présence douce.", { kill: "parent", bonheur: -7, bonte: 2, creatif: 1, argent: 3000 }),
    D("Prendre ta part de l'héritage", "📜", "La famille se réunit chez le notaire.", { kill: "parent", bonheur: -6, argent: 12000 }),
    D("Rester au calme", "🌧️", "Tu t'isoles quelques jours, le chagrin est profond.", { kill: "parent", bonheur: -9, sante: -2 }),
  ],
});

ev("enfant_difficulte_ecole", {
  ages: [32, 50], tags: ["famille"], ic: "📚😟", w: 4, need: { rel: "child" }, who: { enfant: "child" },
  t: "$enfant rapporte un bulletin plein de rouge. L'enseignant parle de « dispersion » et d'« imagination débordante ». L'enfant rêve de devenir pirate.",
  c: [
    D("L'aider à réviser", "📘", "Un peu de patience, beaucoup de chocolat.", { bonte: 2, rel: { enfant: 8 }, bonheur: 1 }),
    D("Engager un professeur particulier", "🎓", "Les notes remontent. Ton compte en banque descend.", { argent: -1500, rel: { enfant: 4 } }, { cost: 1500 }),
    D("Le laisser rêver en paix", "🏴‍☠️", "Après tout, la vie est une aventure.", { bonheur: 2, rel: { enfant: 5 }, prudent: -1 }),
  ],
});

ev("enfant_reussite", {
  ages: [36, 70], tags: ["famille"], ic: "🎓🌟", w: 4, need: { rel: "child" }, who: { enfant: "child" },
  t: "$enfant te présente son diplôme, un grand sourire sur le visage. Tes yeux brillent, ta gorge se serre, ton appareil photo se déclenche tout seul.",
  c: [
    D("Faire une fête de famille", "🎊", "Tout le monde est là, fier et ému.", { bonheur: 8, argent: -300, rel: { enfant: 10 } }),
    D("Lui offrir un cadeau important", "🎁", "Une montre, un voyage. Il est ravi.", { argent: -1500, bonte: 3, rel: { enfant: 12 } }, { cost: 1500 }),
    D("Pleurer discrètement dans un mouchoir", "🥲", "Un moment simple et fort.", { bonheur: 6, rel: { enfant: 6 } }),
  ],
});

ev("enfant_ado_secret", {
  ages: [38, 55], tags: ["famille"], ic: "🤫👦", w: 3, need: { rel: "child" }, who: { enfant: "child" },
  t: "En rangeant sa chambre, tu tombes sur un carnet secret de $enfant. Il y écrit des poèmes, des dessins et une liste de tes défauts.",
  c: [
    D("Lire en cachette", "👀", "Tu apprends des choses touchantes et d'autres gênantes.", { honnete: -1, rel: { enfant: -4 }, bonheur: 1 }),
    D("Le remettre à sa place", "📘", "Tu respectes son intimité.", { honnete: 2, bonte: 1, rel: { enfant: 4 } }),
    D("En parler avec lui", "🗣️", "Il rougit puis se confie. Un bel échange.", { bonte: 2, rel: { enfant: 10 }, bonheur: 3 }),
  ],
});

ev("famille_reunion", {
  ages: [20, 90], tags: ["famille"], ic: "👨‍👩‍👧‍👦🍖", w: 5, once: false, cool: 4,
  t: "La grande réunion de famille a lieu chez une tante. Quarante convives, six générations, un gâteau gigantesque, et une dispute politique en préparation.",
  c: [
    D("Se faire tout petit", "🫥", "Tu manges ton gâteau et tu écoutes.", { prudent: 1, bonheur: 2 }),
    D("Animer la fête", "🎉", "Tu deviens la star du dessert.", { sociable: 3, charme: 2, bonheur: 5 }),
    C("Lancer le débat", "🔥", [O(0.5, "Tu fais rire tout le monde en provoquant gentiment.", { charme: 2, bonheur: 3 }), O(0.5, "Le débat dégénère, plusieurs personnes quittent la table.", { repute: -2, bonheur: -2 })], { risk: 1 }),
  ],
});

ev("coup_de_foudre_conjoint_secret", {
  ages: [30, 60], tags: ["amour"], ic: "🕵️❤️", w: 2, need: { partner: true }, who: { conjoint: "partner" },
  t: "$conjoint prépare quelque chose en cachette depuis des semaines. Des appels chuchotés, des cartons qui disparaissent, une odeur de gâteau au chocolat.",
  c: [
    D("Faire semblant de ne rien voir", "🙈", "La surprise est grandiose, tu joues très bien l'étonnement.", { bonheur: 6, rel: { conjoint: 10 } }),
    D("Mener l'enquête", "🔎", "Tu découvres le pot aux roses et gâches un peu la surprise.", { bonheur: 2, rel: { conjoint: -2 }, intel: 1 }),
  ],
});

ev("naissance_jumeaux", {
  ages: [26, 40], tags: ["famille", "loufoque"], ic: "👶👶", w: 2, need: { partner: true, kids: [0, 2] },
  t: "Le médecin annonce avec solennité qu'il y a deux battements de cœur. Des jumeaux ! La chambre du bébé va devoir devenir celle des bébés.",
  c: [
    D("Se préparer à toute vitesse", "🛒", "Deux berceaux, deux fois plus de couches. Le bonheur est double.", { born: 2, bonheur: 8, argent: -2500, sante: -3 }, { cost: 2500 }),
    D("Paniquer calmement", "😰", "Après une nuit blanche, tu acceptes joyeusement.", { born: 2, bonheur: 6, argent: -2000, sante: -3 }),
  ],
});

flash("Votre chat s'est endormi sur ta chaussure préférée. Tu le laisses faire.", { bonheur: 2 }, { need: { rel: "pet" } });
flash("Ton conjoint t'a laissé un petit mot doux sur le miroir.", { bonheur: 3 }, { need: { partner: true }, ages: [20, 90] });
flash("Un câlin de ton enfant, un matin brumeux. Le monde s'illumine.", { bonheur: 3 }, { need: { rel: "child" }, ages: [20, 70] });
flash("Votre couple gagne un concours de danse, au mariage d'un cousin.", { bonheur: 3, rel: { conjoint: 4 } }, { need: { partner: true }, ages: [20, 80], who: { conjoint: "partner" } });
flash("Ton petit frère te demande conseil sur ses amours. Tu es dépassé{|e}.", { bonheur: 1 }, { need: { rel: "sibling" }, ages: [18, 60] });
flash("Un ami d'enfance te fait signe, après vingt ans. Il a la même voix.", { bonheur: 2 }, { ages: [25, 80] });
