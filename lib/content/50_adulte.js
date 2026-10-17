// Adultes (30 à 59 ans) — maison, famille, argent, milieu de vie
const { ev, flash, O, C, D } = require("../kit");

ev("achat_appart", {
  ages: [25, 55], tags: ["logement", "argent"], ic: "🏢🔑", w: 5, need: { noasset: "immo", money: [8000, null], job: true }, roll: { bien: ["un deux-pièces lumineux", "un petit loft sous les toits", "un appartement avec vue sur un parking", "un trois-pièces refait à neuf"] },
  t: "Tu visites $bien. L'agent immobilier parle vite et souligne qu'il y a « beaucoup de potentiel ». Cela veut souvent dire beaucoup de travaux.",
  c: [
    C("Acheter à crédit", "🏢", [O(0.75, "Tu signes chez le notaire. Un toit à toi et une dette à ta mesure.", { item: "appart", dette: 150000, argent: -12000, home: "own", bonheur: 6, prudent: 2 }), O(0.25, "Les travaux explosent le budget. Mais l'appartement est ravissant.", { item: "appart", dette: 165000, argent: -18000, home: "own", bonheur: 3 })], { cost: 8000 }),
    D("Continuer à louer", "📄", "Tu gardes ta liberté, ton propriétaire garde son pactole.", { prudent: 1, bonheur: 0 }),
    D("Choisir un studio moins cher", "🛋️", "Plus modeste, plus raisonnable. Les murs sont fins mais le prix aussi.", { item: "studio", dette: 70000, argent: -8000, home: "own", prudent: 3, bonheur: 3 }, { cost: 8000 }),
  ],
});

ev("achat_maison", {
  ages: [30, 55], tags: ["logement", "argent"], ic: "🏡🌳", w: 4, need: { noasset: "immo", money: [20000, null], partner: true },
  t: "Avec la famille qui s'agrandit, un jardin ne serait pas de refus. Une maison de campagne est en vente, et son propriétaire jure que le toit « ne fuit presque pas ».",
  c: [
    C("L'acheter", "🏡", [O(0.7, "Un jardin, un verger, un chat qui adopte le canapé. Tu es chez toi.", { item: "maison", dette: 220000, argent: -25000, home: "own", bonheur: 8, prudent: 1 }), O(0.3, "Le toit fuit vraiment. Les travaux dévorent tes économies.", { item: "maison", dette: 240000, argent: -40000, home: "own", bonheur: 3 })], { cost: 20000 }),
    D("Visiter d'autres biens", "🔎", "Tu en vois dix. Aucun ne te plaît complètement.", { prudent: 2 }),
  ],
});

ev("enfant_naissance", {
  ages: [24, 42], tags: ["famille"], ic: "👶🍼", w: 5, need: { partner: true, kids: [0, 3] }, once: false, cool: 3,
  t: "Une nouvelle inattendue, ou attendue depuis longtemps. Un bébé va arriver dans la famille. Les nuits blanches commencent à neuf mois.",
  c: [
    D("L'accueillir avec joie", "👶", "Le petit paquet de joie arrive. Il a ton nez et la voix de ton beau-père.", { born: 1, bonheur: 8, bonte: 3, argent: -800, sante: -2 }),
    C("Se préparer financièrement", "🧮", [O(1, "Budget, berceau, couches. Tout est prêt, ou presque.", { born: 1, bonheur: 7, prudent: 3, argent: -1200 })], { cost: 1200 }),
  ],
});

ev("enfant_premier_mot", {
  ages: [26, 50], tags: ["famille"], ic: "🗣️👶", w: 5, need: { rel: "child" }, who: { enfant: "child" },
  t: "$enfant prononce son premier mot. Tout le monde attend « papa » ou « maman ». Il dit « tarte ».",
  c: [
    D("Filmer le moment", "📹", "La vidéo fera le tour de la famille. Des larmes de rire coulent.", { bonheur: 5, rel: { enfant: 8 } }),
    D("Lui apprendre d'autres mots", "📖", "Ses progrès sont fulgurants. Un petit génie en vue.", { bonte: 2, rel: { enfant: 6 } }),
  ],
});

ev("ado_en_crise", {
  ages: [38, 55], tags: ["famille"], ic: "😤🚪", w: 5, need: { rel: "child" }, who: { enfant: "child" },
  t: "$enfant claque la porte de sa chambre pour la quatrième fois cette semaine. Il communique désormais par grognements et par emojis.",
  c: [
    D("Lui parler calmement", "🗣️", "Après trois tentatives et un chocolat chaud, il lâche quelques mots. C'est déjà beaucoup.", { bonte: 2, bonheur: 2, rel: { enfant: 8 } }),
    C("Serrer la vis", "🔒", [O(0.4, "Il obéit, boudeur. L'ambiance est glaciale.", { rel: { enfant: -8 }, bonheur: -3 }), O(0.6, "Il se rebelle encore plus fort. Le conflit dure des mois.", { rel: { enfant: -15 }, bonheur: -5, sante: -2 })], { risk: 1 }),
    D("Laisser couler", "🌊", "Tu attends que ça passe. Ça finit par passer, un peu.", { prudent: 1, rel: { enfant: -2 } }),
  ],
});

ev("divorce_orage", {
  ages: [28, 65], tags: ["amour"], ic: "💔📃", w: 3, need: { partner: "marie" }, who: { conjoint: "spouse" },
  t: "Les disputes s'enchaînent, les silences aussi. $conjoint prononce enfin le mot que vous évitiez tous deux depuis des mois.",
  c: [
    C("Accepter le divorce", "📃", [O(0.6, "Séparation à l'amiable. Il reste de la tendresse, et de la paperasse.", { drop: "conjoint", argent: -4000, bonheur: -5 }), O(0.4, "Un divorce houleux, des avocats, des cartons. Ça te coûte cher.", { drop: "conjoint", argent: -15000, bonheur: -7, repute: -2 })]),
    C("Tenter une thérapie de couple", "🛋️", [O(0.55, "Vous apprenez à vous parler. Le couple s'en sort.", { rel: { conjoint: 18 }, bonheur: 5, argent: -600 }), O(0.45, "Cela ne marche pas. Vous vous séparez quand même.", { drop: "conjoint", bonheur: -6, argent: -2500 })], { cost: 600 }),
  ],
});

ev("mariage_demande", {
  ages: [22, 55], tags: ["amour"], ic: "💍💒", w: 6, need: { partner: "couple" }, who: { conjoint: "partner" },
  t: "Les années passent avec $conjoint. Un matin, l'idée de passer ta vie ensemble te paraît comme une évidence. Le moment est peut-être venu de dire « oui » ou de poser la question.",
  c: [
    C("Faire ta demande", "💍", [O(0.8, "Oui ! Le mariage se prépare, avec ses listes d'invités et ses querelles familiales.", { becomes: { conjoint: "spouse" }, bonheur: 9, argent: -4000, pub: "💍 $nom se marie." }), O(0.2, "Non, pas maintenant. Tu avales ta salive, la vie continue.", { bonheur: -5, rel: { conjoint: -10 } })], { cost: 2000, risk: 1 }),
    D("Attendre encore", "⏳", "L'amour n'est pas pressé. Ou toi, peut-être.", { prudent: 2 }),
    D("Se pacser discrètement", "📋", "Une signature dans une mairie, deux témoins, un sandwich. Très bien.", { becomes: { conjoint: "spouse" }, prudent: 2, bonheur: 4, argent: -200 }),
  ],
});

ev("infidelite", {
  ages: [26, 58], tags: ["amour", "mature"], ic: "💋🤫", w: 3, need: { partner: true }, who: { conjoint: "partner" },
  t: "Un collègue, une rencontre de vacances, un regard appuyé... La tentation frappe à ta porte, avec un sourire trop beau pour être honnête.",
  c: [
    C("Céder à la tentation", "😈", [O(0.5, "L'aventure reste secrète... pour l'instant. Tu portes un secret lourd.", { honnete: -4, bonheur: 2, flag: "secret_infidele" }), O(0.5, "Tout se sait. $conjoint part en claquant la porte.", { honnete: -4, drop: "conjoint", bonheur: -8, repute: -4 })], { risk: 2 }),
    D("Résister", "🛡️", "Tu rentres à la maison, plus fidèle que jamais.", { honnete: 3, rel: { conjoint: 6 }, bonheur: 1 }),
    D("Avouer tes tentations", "🗣️", "Une conversation difficile mais sincère. Ça rapproche, parfois.", { honnete: 4, rel: { conjoint: 4 } }),
  ],
});

ev("crise_quarantaine", {
  ages: [40, 50], tags: ["loufoque"], ic: "🏍️🎸", w: 6, once: true,
  t: "Un matin, tu te regardes dans le miroir et tu te dis que ta vie manque de vroum-vroum. L'envie d'acheter une moto, de changer de tête ou de partir faire le tour du monde te prend soudainement.",
  c: [
    C("Acheter une moto", "🏍️", [O(0.6, "Tu roules les cheveux au vent. Les voisins applaudissent, ton conjoint soupire.", { sport: 2, bonheur: 6, argent: -9000, charme: 2, item: { kind: "voiture", name: "Moto de crise", value: 8000 } }), O(0.4, "Tu glisses sur une plaque de gravier. Ton orgueil est plus abîmé que la moto.", { sante: -5, bonheur: -2, argent: -9000, item: { kind: "voiture", name: "Moto de crise", value: 5000 } })], { cost: 9000, risk: 1 }),
    D("Apprendre la guitare", "🎸", "Trois accords, un public de chats. Tu as retrouvé ta jeunesse.", { creatif: 4, bonheur: 4 }),
    D("Rester raisonnable", "🧘", "Tu prends une tisane. La crise passe, ou prend de l'altitude.", { prudent: 3, bonheur: 0 }),
    C("Changer de vie radicalement", "🌴", [O(0.4, "Tu ouvres une crêperie à l'autre bout du pays. Les débuts sont durs mais joyeux.", { courage: 5, bonheur: 5, argent: -8000, city: true, quit: true, job: "resto:1" }), O(0.6, "Tu y renonces au dernier moment, un peu honteux.", { bonheur: -2 })], { cost: 8000, risk: 2 }),
  ],
});

ev("surendettement_alerte", {
  ages: [25, 70], tags: ["argent"], ic: "📉🧾", w: 5, need: { debt: [20000, null], money: [null, 1500] },
  t: "Les lettres de la banque s'accumulent comme les feuilles mortes en novembre. Ton compte est à sec, les mensualités ne passent plus.",
  c: [
    C("Négocier un étalement", "🤝", [O(0.6, "La banque accepte de lisser les paiements. Un répit.", { dette: -2000, prudent: 3, bonheur: 1 }), O(0.4, "La banque reste inflexible.", { bonheur: -3, honnete: 1 })]),
    C("Vendre des biens", "🏷️", [O(1, "Tu cèdes ce que tu peux. Ça fait mal mais ça soulage.", { sell: "voiture", bonheur: -3, prudent: 2 })]),
    C("Demander l'aide de proches", "🙏", [O(0.5, "Un proche te tend la main sans condition.", { argent: 3000, bonheur: 2, bonte: 1 }), O(0.5, "Personne ne peut t'aider. Tu te sens très seul.", { bonheur: -4 })]),
    D("Faire le dos rond", "🐢", "Tu fermes les yeux, les intérêts continuent leur marche.", { dette: 1500, bonheur: -4, sante: -2 }),
  ],
});

ev("surendettement_spirale", {
  ages: [25, 70], tags: ["argent"], ic: "🌀💶", w: 3, need: { debt: [60000, null] }, once: false, cool: 6,
  t: "Les intérêts s'accumulent. Un huissier te laisse un petit mot poli accompagné d'un grand formulaire. La situation devient grave.",
  c: [
    C("Déposer un dossier de surendettement", "📁", [O(0.7, "Une commission efface une partie de la dette. Tu repars de zéro, bruyamment.", { dette: -30000, repute: -3, bonheur: 2 }), O(0.3, "Le dossier est recalé, un casse-tête.", { bonheur: -4 })]),
    D("Travailler le week-end", "🛠️", "Tu cumules les emplois. Tes yeux sont rouges, ton compte l'est moins.", { argent: 5000, sante: -4, bonheur: -3 }),
  ],
});

ev("surendettement_miracle", {
  chainOnly: true, ic: "🎰", tags: ["argent"], once: false,
  t: "Un billet oublié dans un vieux livre gagne un lot au tirage.",
  c: [D("Quel bol !", "🍀", "Une somme inespérée qui tombe pile.", { argent: 8000, bonheur: 6 })],
});

ev("impots_controle", {
  ages: [28, 80], tags: ["argent"], ic: "🧾🕵️", w: 4, need: { net: [30000, null] }, roll: { somme: [800, 9000, 100] },
  t: "Une lettre sévère te convoque à un contrôle fiscal. Le fisc a détecté « une incohérence » dans tes déclarations, ce qui veut dire qu'il cherche.",
  c: [
    C("Tout expliquer calmement", "🧮", [O(0.6, "Tout est en ordre, ou presque. Tu paies un petit complément.", { argent: (p, x) => -x.vals.somme / 4, honnete: 2 }), O(0.4, "Le fisc te redresse, tu paies lourdement.", { argent: (p, x) => -x.vals.somme, bonheur: -3 })]),
    C("Embaucher un expert comptable", "🧑‍💼", [O(0.8, "L'expert trouve la faille. Tu paies un peu, mais moins.", { argent: (p, x) => -x.vals.somme / 6 - 400, prudent: 2 }), O(0.2, "L'expert coûte plus que le redressement.", { argent: -2500 })], { cost: 400 }),
    C("Tenter de cacher des revenus", "🕶️", [O(0.35, "Ça passe. Le fisc est distrait.", { argent: 0, honnete: -3, courage: 1 }), O(0.65, "Fraude fiscale. Amende salée.", { argent: (p, x) => -x.vals.somme * 2, honnete: -4, repute: -4, record: 1 })], { risk: 2 }),
  ],
});

ev("assurance_vie_conseil", {
  ages: [30, 65], tags: ["argent"], ic: "📈🏦", w: 4, need: { money: [10000, null] },
  t: "Un ami te parle d'assurance-vie, de plans d'épargne, de placements diversifiés. Il ne sait pas vraiment de quoi il parle, mais il le dit avec aplomb.",
  c: [
    D("Épargner régulièrement", "🐷", "Rien de spectaculaire, mais ça grossit tranquillement.", { argent: -5000, item: { kind: "livret", name: "Assurance-vie", value: 5200 }, prudent: 3 }, { cost: 5000 }),
    C("Placer en actions", "📊", [O(0.6, "Le marché sourit. Ton portefeuille aussi.", { argent: -5000, item: { kind: "actions", name: "Portefeuille d'actions", value: 6200 }, ambition: 2 }), O(0.4, "Le marché grimace. Tu relativises.", { argent: -5000, item: { kind: "actions", name: "Portefeuille d'actions", value: 3600 }, bonheur: -2 })], { cost: 5000, risk: 1 }),
    D("Garder l'argent liquide", "💵", "Tu dors mieux avec tes billets sous le matelas.", { prudent: 2, bonheur: 1 }),
  ],
});

ev("voisin_conflit", {
  ages: [25, 80], tags: ["social"], ic: "🌳🪚", w: 5, who: { voisin: "neighbor" },
  t: "$voisin a taillé ta haie en pensant qu'elle était à lui. Maintenant, elle ressemble à un hérisson déprimé.",
  c: [
    D("Discuter calmement", "🕊️", "Il s'excuse, offre deux bouteilles de vin. L'affaire est close.", { bonte: 2, rel: { voisin: 8 }, bonheur: 1 }),
    C("Porter plainte", "⚖️", [O(0.5, "Le tribunal te donne raison. Il paie, la haie repousse.", { argent: 400, rel: { voisin: -15 }, bonheur: -1 }), O(0.5, "La procédure dure des mois et coûte plus que la haie.", { argent: -700, bonheur: -3, rel: { voisin: -20 } })]),
    C("Se venger en plantant du bambou", "🎋", [O(0.5, "Le bambou envahit son jardin. Il t'écrit un mot salé.", { creatif: 2, bonte: -2, rel: { voisin: -12 }, bonheur: 2 }), O(0.5, "Le bambou traverse ta propre cave.", { argent: -1200, bonheur: -3 })], { risk: 1 }),
  ],
});

ev("fete_voisins_chaos", {
  ages: [26, 75], tags: ["social", "loufoque"], ic: "🥗🎈", w: 4, who: { voisin: "neighbor" },
  t: "La fête des voisins tourne au concours de salades. $voisin a apporté une quiche suspecte, une autre voisine un accordéon, et un enfant un vrai serpent.",
  c: [
    D("Goûter à la quiche", "🥧", "C'est délicieux. Étrange mais délicieux.", { bonheur: 3, rel: { voisin: 6 } }),
    D("Prendre l'accordéon", "🪗", "Tu joues faux avec panache. Les voisins reprennent en chœur.", { creatif: 3, sociable: 3, bonheur: 4 }),
    D("Éviter le serpent", "🐍", "Tu restes à un mètre de l'enfant. Le serpent te fixe quand même.", { prudent: 2, bonheur: 0 }),
  ],
});

ev("demenagement_famille", {
  ages: [30, 55], tags: ["logement"], ic: "📦🧸", w: 3, need: { rel: "child" },
  t: "Les enfants grandissent, les pièces rétrécissent. Une opportunité d'emménager dans un quartier plus calme se présente.",
  c: [
    D("Déménager", "🚚", "Les cartons s'empilent, les souvenirs aussi. Un nouveau quartier, de nouvelles habitudes.", { argent: -2500, city: true, bonheur: 2 }, { cost: 2500 }),
    D("Rester, tout agrandir", "🔨", "Des travaux, de la poussière, un salon agrandi.", { argent: -6000, bonheur: 3, prudent: 1 }, { cost: 6000 }),
  ],
});

ev("anniversaire_30", {
  ages: [30, 30], must: 3, tags: ["jalon"], ic: "🎂3️⃣0️⃣", w: 5,
  t: "Tes 30 ans. Ta mère t'envoie un message « Alors, les petits-enfants ? », ton ami t'offre un cadeau de « vieux ».",
  c: [
    D("Faire une grande fête", "🎉", "Tout le monde est là, la piste de danse tremble.", { bonheur: 6, sociable: 3, argent: -500 }),
    D("Bilan de vie sérieux", "📓", "Tu écris ce que tu veux, ce qui te manque, ce que tu pourrais changer.", { prudent: 3, ambition: 3, intel: 1 }),
    D("Ignorer l'événement", "🙈", "Tu fais comme si de rien n'était. La date a bien eu lieu quand même.", { bonheur: -1 }),
  ],
});

ev("anniversaire_40", {
  ages: [40, 40], must: 3, tags: ["jalon"], ic: "🎂4️⃣0️⃣", w: 5,
  t: "Quarante ans. Les copains t'offrent un gâteau en forme de déambulateur, tes enfants te trouvent « presque vieux{|ille} ».",
  c: [
    D("Rire de tout cela", "😂", "L'humour est ton meilleur lifting.", { bonheur: 4, sociable: 2 }),
    D("Se mettre au sport", "🏃", "Tu t'inscris à la salle. Trois fois. Puis plus.", { sport: 3, sante: 2, bonheur: 1 }),
    D("Faire un bilan", "🧾", "Tu relis tes carnets et tes comptes. Il reste beaucoup à faire.", { ambition: 2, prudent: 2 }),
  ],
});

ev("anniversaire_50", {
  ages: [50, 50], must: 3, tags: ["jalon"], ic: "🎂5️⃣0️⃣", w: 5,
  t: "Cinquante ans ! Une carte de l'assurance santé t'attend dans la boîte aux lettres, ainsi qu'une invitation à un dépistage.",
  c: [
    D("Faire un bilan de santé complet", "🩺", "Quelques ajustements, un régime. Rien de grave.", { sante: 4, prudent: 3 }, { cost: 300 }),
    D("Fêter les 50 ans avec faste", "🥳", "Banquet, discours, photos gênantes. Tu es adoré{|e}.", { bonheur: 6, sante: -1, argent: -1500 }),
    D("Ignorer le sujet", "😶", "Tu ne veux pas y penser. Ton dos y pense pour toi.", { sante: -1 }),
  ],
});

ev("carriere_pause_burnout", {
  ages: [28, 58], tags: ["travail", "sante"], ic: "🔥🥵", w: 4, need: { job: true, stat: { sante: [null, 55] } },
  t: "Ton corps te lâche en plein dossier. Épuisement, insomnies, cheveux qui tombent. Le médecin parle de burn-out et d'arrêt de travail.",
  c: [
    D("Prendre le repos prescrit", "🛏️", "Tu reprends doucement, plus lucide et plus sage.", { sante: 8, bonheur: 3, perf: -8, argent: -1500 }),
    C("Continuer coûte que coûte", "💪", [O(0.4, "Tu tiens bon, avec des cernes comme des soucoupes.", { perf: 6, sante: -6, ambition: 2 }), O(0.6, "Tu t'effondres au bureau. Arrêt forcé.", { sante: -10, bonheur: -5, perf: -10, argent: -3000 })], { risk: 2 }),
    D("Démissionner et changer de vie", "🚪", "Tu pars avec un carton et un soupir de soulagement.", { quit: true, sante: 6, bonheur: 4, courage: 3, jobHunt: true }),
  ],
});

ev("jeu_loterie_gagnant", {
  ages: [24, 80], tags: ["argent", "loufoque"], ic: "🎟️💰", w: 2, roll: { somme: [5000, 120000, 5000] },
  t: "Le numéro tiré à la loterie locale est le tien. Il y a $somme à la clé, et une photo avec un énorme chèque en carton.",
  c: [
    D("Empocher et placer prudemment", "🏦", "Tu rédiges un testament et un plan d'épargne. Tu dors toujours aussi bien.", { argent: (p, x) => x.vals.somme, prudent: 3, ambition: 1 }),
    D("Faire la fête pendant des mois", "🍾", "Un an de folies, de cadeaux et de dîners.", { argent: (p, x) => x.vals.somme * 0.3, bonheur: 9, sante: -2, sociable: 3 }),
    D("Partager avec tes proches", "🎁", "Chacun reçoit sa part, tes proches t'adorent.", { argent: (p, x) => x.vals.somme * 0.5, bonte: 5, repute: 4, bonheur: 5 }),
  ],
});

ev("voyage_luxe_cruise", {
  ages: [35, 75], tags: ["voyage", "argent"], ic: "🛳️🍸", w: 4, need: { money: [6000, null] },
  t: "Une croisière autour de la Méditerranée en cabine avec hublot. Le buffet est interminable, le capitaine a des moustaches de roman.",
  c: [
    D("Réserver la suite", "🛳️", "Le luxe t'enveloppe comme une couverture chaude.", { bonheur: 8, sante: 2, argent: -5500, charme: 1 }, { cost: 5500 }),
    D("Cabine bon marché", "🛏️", "Une cabine sans hublot mais avec des souvenirs.", { bonheur: 5, argent: -2000 }, { cost: 2000 }),
    D("Rester chez soi", "🏡", "Ton jardin est une croisière suffisante.", { prudent: 2, bonheur: 1 }),
  ],
});

ev("mecenat_mairie", {
  ages: [35, 70], tags: ["social", "argent"], ic: "🏛️🏅", w: 3, need: { net: [100000, null] },
  t: "Le maire te sollicite pour financer la rénovation de la place du village. Une plaque à ton nom est promise, avec ta photo de profil.",
  c: [
    D("Financer généreusement", "🎖️", "Tu deviens un notable de la commune. Ta plaque brille au soleil.", { argent: -8000, repute: 8, bonte: 3, bonheur: 4 }, { cost: 8000 }),
    D("Verser une petite somme", "🤲", "Un geste, une mention en bas de page.", { argent: -1000, repute: 2, bonte: 1 }, { cost: 1000 }),
    D("Refuser net", "🙅", "Les affaires sont les affaires.", { repute: -2, prudent: 2 }),
  ],
});

ev("tresor_grenier", {
  ages: [30, 80], tags: ["loufoque"], ic: "🏚️💎", w: 3,
  t: "En vidant le grenier, tu tombes sur une malle poussiéreuse. À l'intérieur, une carte au trésor, trois chaussettes dépareillées et un objet mystérieux.",
  c: [
    C("Suivre la carte", "🗺️", [O(0.25, "Un coffre enterré contient un vrai trésor !", { item: "lingot", bonheur: 8, courage: 3 }), O(0.35, "Tu trouves une tarte en or... en plastique.", { item: { kind: "loufoque", name: "Tarte dorée (plastique)", value: 400 }, bonheur: 4, creatif: 2 }), O(0.4, "La carte mène à un parking. Tu y trouves une pièce de deux euros.", { argent: 2, bonheur: 1 })]),
    C("Faire expertiser l'objet", "🔬", [O(0.5, "C'est un vieux bijou de famille de valeur.", { item: "bijou", bonheur: 3 }), O(0.5, "Un vieux presse-agrumes. Rien de plus.", { bonheur: 0 })]),
    D("Tout remettre dans la malle", "📦", "Le mystère restera entier.", { prudent: 1 }),
  ],
});

flash("Ton dos fait un bruit de craquement digne d'un film d'horreur.", { sante: -1 }, { ages: [30, 60] });
flash("Le prix du café a encore augmenté. Tu décides de le boire plus lentement.", { argent: -20, bonheur: -1 }, { ages: [28, 70] });
flash("Un ami d'enfance t'invite à son mariage.", { sociable: 1, argent: -80, bonheur: 2 }, { ages: [28, 50] });
flash("Tu reçois une carte postale d'un ancien collègue parti vivre en Islande.", { bonheur: 1 }, { ages: [28, 70] });
flash("Un pot de départ interminable, des chips molles. Tu gagnes un stylo.", { bonheur: 0 }, { ages: [28, 60], need: { job: true } });
flash("Ta voiture fait un bruit étrange. Le garagiste fait un tour de moulinet avec sa clé et sourit.", { argent: -450 }, { ages: [25, 70], need: { asset: "voiture" } });
flash("Tes enfants t'offrent un dessin « de toute la famille ». Tu es représenté avec une tête de poireau.", { bonheur: 3 }, { ages: [28, 60], need: { rel: "child" } });
flash("L'impôt sur le revenu arrive. Tu respires profondément.", { argent: -300, bonheur: -1 }, { ages: [25, 70], need: { job: true } });
flash("Tu découvres un café qui sert les meilleurs croissants du monde. Tu y vas tous les matins.", { bonheur: 2, argent: -150 }, { ages: [25, 70] });
