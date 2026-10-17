// Seniors (60 ans et plus)
const { ev, flash, O, C, D } = require("../kit");

ev("retraite", {
  ages: [62, 67], must: 9, tags: ["jalon"], ic: "🎉🪑", w: 5, need: { retired: false },
  t: "L'heure de la retraite a sonné. Pot de départ, chèque-cadeau, discours trop longs. On te remet un cadeau symbolique, un fauteuil à bascule, ce qui est gentil et un peu vexant.",
  c: [
    D("Partir en beauté", "🍾", "Une dernière fois, tu salues tout le monde. Tu pars avec ta pension et le cœur léger.", { retire: true, bonheur: 5 }),
    C("Continuer à travailler en freelance", "💼", [O(0.6, "Tu gardes un pied dans le métier, quelques missions bien payées.", { retire: true, argent: 4000, ambition: 2, bonheur: 2 }), O(0.4, "On t'oublie vite. Ta pension seule fera l'affaire.", { retire: true, bonheur: -1 })]),
    D("Prendre une retraite anticipée de fête", "🌴", "Tu mets le cap sur le soleil et les cocktails.", { retire: true, bonheur: 8, argent: -2500, sante: 2 }),
  ],
});

ev("retraite_ennui", {
  ages: [63, 85], tags: ["famille"], ic: "😴🛋️", w: 5, need: { retired: true },
  t: "La retraite, c'est formidable le premier mois. Au troisième, tu réorganises ton placard à épices par ordre alphabétique et tu observes la rue par la fenêtre.",
  c: [
    C("Se lancer dans une passion", "🎨", [O(0.8, "Poterie, aquarelle, jardin... Tu as trouvé ton rythme.", { creatif: 4, bonheur: 6, sante: 2 }), O(0.2, "Tu te découvres un talent monstrueux pour les moustaches en papier mâché.", { creatif: 5, bonheur: 6, repute: 2 })]),
    D("Faire du bénévolat", "🤝", "Tu sers la soupe et les sourires. Beaucoup de gratitude en retour.", { bonte: 4, bonheur: 5, repute: 2, sociable: 2 }),
    D("Regarder la télé toute la journée", "📺", "Les feuilletons te font oublier le temps.", { bonheur: 0, sante: -2 }),
    D("Voyager", "🧳", "Tu découvres le monde à un rythme paisible.", { bonheur: 6, argent: -2000, courage: 1 }, { cost: 2000 }),
  ],
});

ev("petits_enfants", {
  ages: [55, 90], tags: ["famille"], ic: "👶👵", w: 6, need: { rel: "child" }, who: { enfant: "child" },
  t: "$enfant t'annonce que tu vas être grand-parent. Tu cours au grenier chercher le vieux doudou de ton propre enfant.",
  c: [
    D("Gâter le petit à outrance", "🧸", "Bonbons, câlins, histoires inventées. Les parents lèvent les yeux au ciel.", { bonheur: 8, bonte: 2, argent: -300, rel: { enfant: 6 } }),
    D("Offrir un cadeau précieux", "🎁", "Un bijou ou une petite somme, pour son avenir.", { argent: -1000, bonheur: 5, bonte: 3, rel: { enfant: 8 } }, { cost: 1000 }),
    D("Raconter tes aventures de jeunesse", "📖", "Le petit rit aux éclats et réclame la suite.", { bonheur: 5, creatif: 2, repute: 1 }),
  ],
});

ev("petits_enfants_vacances", {
  ages: [60, 90], tags: ["famille"], ic: "🏖️👧", w: 5, need: { rel: "child" }, who: { enfant: "child" },
  t: "Les petits-enfants passent les vacances chez toi. La maison est en désordre, la tarte est dévorée, les voisins entendent des cris de joie.",
  c: [
    D("Les emmener à la plage", "🏖️", "Châteaux de sable, glaces fondues, coups de soleil sur le nez.", { bonheur: 7, sport: 1, argent: -250 }),
    D("Cuisiner avec eux", "🍰", "Il y a de la farine au plafond mais des sourires partout.", { bonheur: 6, creatif: 2 }),
    D("Les laisser regarder la télé", "📺", "La paix s'installe, mais ils s'ennuient un peu.", { bonheur: 1 }),
  ],
});

ev("sante_declin_hanche", {
  ages: [65, 90], tags: ["sante"], ic: "🦴🏥", w: 5,
  t: "Une douleur dans la hanche devient insupportable. Le médecin évoque une prothèse, et te rappelle que tu ne pourras plus escalader les clôtures.",
  c: [
    C("Se faire opérer", "🏥", [O(0.85, "L'opération réussit. Tu remarches comme avant, presque.", { sante: 5, sport: 4, argent: -400, bonheur: 4 }), O(0.15, "Des complications. La convalescence est longue.", { sante: -5, bonheur: -3, argent: -800 })], { risk: 1 }),
    D("Prendre des antidouleurs", "💊", "Tu vis avec, mais tu avances lentement.", { sante: -3, sport: -4, bonheur: -2 }),
    D("Essayer la kiné et le yoga", "🧘", "Petit à petit, tu retrouves de la souplesse.", { sante: 3, sport: 2, bonheur: 2 }),
  ],
});

ev("club_aines", {
  ages: [62, 90], tags: ["social"], ic: "♟️👴", w: 6, need: { retired: true },
  t: "Un club de seniors t'invite à rejoindre leurs activités. Belote, thé dansant, sorties champignons. L'ambiance est joyeuse et les concours de tricot féroces.",
  c: [
    D("Rejoindre le club", "🎲", "Tu te fais des amis et une réputation de tricheur{|se} à la belote.", { sociable: 4, bonheur: 6, sante: 1 }),
    D("Fonder ton propre club", "🏴", "Un club de pétanque, de poésie ou de poker. Le succès est immédiat.", { ambition: 2, repute: 4, bonheur: 5, sociable: 4 }),
    D("Rester chez toi", "🏠", "Tu préfères ton fauteuil et ton chat.", { bonheur: 0, sociable: -1 }),
  ],
});

ev("testament_notaire", {
  ages: [65, 95], tags: ["argent", "famille"], ic: "📜🖋️", w: 4, need: { net: [30000, null] },
  t: "Un après-midi pluvieux, tu décides de rédiger ton testament. Le notaire sourit en préparant son stylo plume, ses lunettes et une bonne dose de tact.",
  c: [
    D("Tout léguer aux enfants", "👨‍👩‍👧", "Une répartition équitable. Chacun repart avec un petit sourire.", { bonte: 3, bonheur: 2, rel: { enfant: 6 } }),
    C("Faire un legs surprise", "🎭", [O(0.5, "Un refuge pour animaux hérite d'une partie. Les enfants hurlent.", { bonte: 4, bonheur: 4, rel: { enfant: -10 } }), O(0.5, "Un vieil ami reçoit ton vieux fauteuil à bascule. Il en pleure.", { bonte: 3, bonheur: 4 })]),
    D("Ne rien décider, on verra plus tard", "🌫️", "Le notaire referme son dossier en soupirant.", { bonheur: 0 }),
  ],
});

ev("souvenirs_album", {
  ages: [65, 95], tags: ["famille"], ic: "📔🕰️", w: 5,
  t: "Un après-midi de pluie, tu ouvres les vieux albums photo. Les visages d'hier défilent, les vacances, les anniversaires, les bêtises. Tu ris, tu pleures, tu racontes.",
  c: [
    D("Tout raconter aux petits-enfants", "👨‍👧", "Ils t'écoutent la bouche ouverte, puis réclament des bonbons.", { bonheur: 6, bonte: 2 }),
    D("Écrire tes mémoires", "✍️", "Un livre que personne ne publiera, mais que toute la famille lira.", { creatif: 4, bonheur: 4, intel: 1 }),
    D("Ranger l'album et regarder dehors", "🌤️", "Les souvenirs attendront demain.", { bonheur: 1 }),
  ],
});

ev("deuil_conjoint", {
  ages: [55, 95], tags: ["famille"], ic: "🕯️🖤", w: 2, need: { partner: "marie" }, who: { conjoint: "spouse" },
  t: "$conjoint s'éteint doucement, au terme d'une longue vie commune. La maison est soudain trop grande et trop silencieuse.",
  c: [
    D("Traverser le deuil avec les proches", "🫂", "Les enfants, les amis, les voisins... On ne te laisse pas seul{|e}.", { kill: "conjoint", bonheur: -8, sociable: 2, bonte: 2 }),
    D("Se plonger dans le travail ou les activités", "🧹", "L'activité calme la peine, un peu.", { kill: "conjoint", bonheur: -6, sante: -2 }),
    D("Se replier sur soi", "🌑", "Le chagrin t'engloutit pendant des mois.", { kill: "conjoint", bonheur: -12, sante: -5 }),
  ],
});

ev("amour_tardif", {
  ages: [60, 85], tags: ["amour"], ic: "💞🍵", w: 3, need: { single: true }, who: { crush: { kind: "crush", fresh: true, age: 64 } },
  t: "Au club de lecture, un regard s'attarde. $crush t'invite à partager une tasse de thé. À ton âge, un cœur qui bat si fort inquiète presque le médecin.",
  c: [
    C("Accepter l'invitation", "☕", [O(0.7, "Un nouvel amour, doux et complice. Vous vous retrouvez chaque semaine.", { bonheur: 8, charme: 2, becomes: { crush: "partner" }, rel: { crush: 25 } }), O(0.3, "Une belle amitié, rien de plus. C'est déjà joli.", { bonheur: 3, rel: { crush: 10 } })]),
    D("Décliner poliment", "🙈", "Tu préfères ta solitude tranquille.", { prudent: 1 }),
  ],
});

ev("jeux_vieux_casino", {
  ages: [60, 90], tags: ["argent", "mature"], ic: "🎰👴", w: 3, need: { money: [1000, null] },
  t: "Un groupe de retraités organise un voyage au casino. Les machines à sous scintillent, les cocktails sont gratuits, la raison est en option.",
  c: [
    C("Jouer prudemment", "🎲", [O(0.4, "Tu gagnes un petit pactole et le droit de te vanter.", { argent: 1200, bonheur: 4 }), O(0.6, "Tu perds ta mise en riant.", { argent: -300, bonheur: 2 })], { cost: 300, risk: 1 }),
    C("Miser gros", "🃏", [O(0.15, "Jackpot ! Les pièces coulent à flots.", { argent: 12000, bonheur: 8, repute: 2 }), O(0.85, "La banque gagne, comme toujours.", { argent: -3000, bonheur: -4 })], { cost: 3000, risk: 2 }),
    D("Rester au buffet", "🍤", "Meilleur plan de la soirée.", { bonheur: 3, sante: -1 }),
  ],
});

ev("bilan_de_vie", {
  ages: [75, 100], tags: ["jalon"], ic: "🌅📚", w: 5, once: true,
  t: "Assis sur ton banc, tu fais le point sur ta vie. Les erreurs, les victoires, les amis, les bêtises. Que choisirais-tu de transmettre ?",
  c: [
    D("De la sagesse", "🦉", "Tu rédiges quelques pages qui seront relues pendant des générations.", { intel: 2, bonte: 3, bonheur: 5, repute: 3 }),
    D("De l'humour", "😄", "Tu laisses une collection de blagues et de souvenirs hilarants.", { creatif: 3, bonheur: 6, sociable: 2 }),
    D("De l'argent", "💰", "Tu rédiges des lettres et des chèques à tes proches.", { argent: -2000, bonte: 3, bonheur: 2 }),
  ],
});

ev("dernier_voyage", {
  ages: [70, 95], tags: ["voyage"], ic: "🛫🌅", w: 4, need: { money: [3000, null], stat: { sante: [30, null] } },
  t: "Un dernier grand voyage, avant que les articulations ne protestent trop. Tu feuillettes un catalogue avec une loupe.",
  c: [
    D("La croisière de rêve", "🛳️", "Tu savoures chaque vague. Le capitaine t'invite à sa table.", { bonheur: 10, argent: -4000, sante: 1 }, { cost: 4000 }),
    D("Revoir les lieux de ta jeunesse", "🏞️", "Tu retrouves un banc, une fontaine, un vieux café. Tout a changé, sauf les souvenirs.", { bonheur: 8, argent: -1500, creatif: 1 }, { cost: 1500 }),
    D("Rester près de la famille", "🏡", "Le plus beau voyage est au bout du couloir.", { bonheur: 5, bonte: 2 }),
  ],
});

flash("Ton médecin t'avoue qu'il envie ta forme. Tu hausses les épaules en riant.", { bonheur: 2, sante: 1 }, { ages: [60, 90] });
flash("Tu perds tes lunettes sur ton front, et tu les cherches une demi-heure.", { bonheur: 0 }, { ages: [60, 95] });
flash("Un jeune te cède sa place dans le bus. Tu ne sais pas si tu dois être flatté ou vexé.", { bonheur: 0 }, { ages: [60, 95] });
flash("Tu retrouves un vieux disque et tu danses seul{|e} dans le salon.", { bonheur: 3, sante: 1 }, { ages: [60, 95] });
flash("Les nouvelles technologies t'effraient, mais ton petit-fils t'apprend à envoyer un message vocal.", { intel: 1, bonheur: 2 }, { ages: [60, 95], need: { rel: "child" } });
flash("Ta tension grimpe en regardant les infos. Tu éteins la télé et ouvres un roman.", { sante: -1, bonheur: 1 }, { ages: [60, 95] });
flash("Un pigeon t'a volé un morceau de pain au parc. Il avait l'air très reconnaissant.", { bonheur: 2 }, { ages: [60, 95] });
flash("Ta pension est revalorisée de quarante euros. Tu proposes un toast.", { argent: 40, bonheur: 1 }, { ages: [62, 95], need: { retired: true } });
