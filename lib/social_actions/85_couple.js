// Les actions entre deux joueurs qui forment un couple. Elles construisent, réparent ou abîment l'histoire.
const { reg, coupleWith, married, justWed } = require("../socialkit");

const mk = (spec) => reg(Object.assign({ grp: "couple", status: "couple", ages: [18, 100], w: 5, cool: 2, coolPair: 3, ok: (g, A, B) => coupleWith(A, B), fit: (g, A, B, b) => 1.1 }, spec));

mk({ id: "weekend_romantique", ic: "🌹", l: "Week-end romantique", mode: "offer", cost: 1500, split: true, ages: [16, 100],
  d: "Un petit hôtel, une table à la chandelle, un téléphone éteint. Un week-end qui recolle les morceaux.", ask: "$A t'emmène pour un week-end romantique.",
  no: { ta: "$B n'a pas le temps.", bond: { aff: -3 } },
  yes: [{ w: 1, a: { bonheur: 7 }, b: { bonheur: 7 }, ta: "Un week-end délicieux avec $B.", tb: "Un week-end délicieux avec $A.", bond: { aff: 10 } }] });

mk({ id: "voyage_noces", ic: "🌴", l: "Voyage de noces", mode: "offer", cost: 8000, split: true, prio: 3, ok: (g, A, B) => coupleWith(A, B) && married(A) && justWed(A), w: 8,
  d: "Quelques semaines au bout du monde pour fêter le mariage. Un souvenir pour la vie.", ask: "$A veut partir en voyage de noces avec toi.",
  no: { ta: "$B préfère garder les sous pour la maison.", bond: { aff: -3 } },
  yes: [{ w: 1, special: "honeymoon", a: { bonheur: 10, charme: 1 }, b: { bonheur: 10, charme: 1 }, ta: "Le voyage de noces est un rêve.", tb: "Le voyage de noces est un rêve.", bond: { aff: 14 }, news: "🌴 $A et $B partent en voyage de noces." }] });

mk({ id: "acheter_maison", ic: "🏡", l: "Acheter une maison ensemble", mode: "offer", cost: 120000, split: true, ages: [22, 85], w: 4, cool: 5, coolPair: 8, prio: 0,
  d: "Une maison de 120 000 € financée à deux. Chacun y met 60 000 € et possède sa moitié. Vous êtes plus liés, et plus exposés si ça tourne mal.", ask: "$A veut acheter une maison avec toi.",
  ok: (g, A, B) => coupleWith(A, B) && A.cash >= 60000 && B.cash >= 60000 && !A.assets.some((a) => a.name === "Maison de couple"),
  no: { ta: "$B ne se sent pas prêt à signer.", bond: { aff: -4 } },
  yes: [{ w: 1, special: "home_buy", a: { bonheur: 3 }, b: { bonheur: 3 }, ta: "Vous signez chez le notaire.", tb: "Vous signez chez le notaire.", bond: { aff: 12 }, news: "🏡 $A et $B achètent une maison ensemble." }] });

mk({ id: "adopter_animal", ic: "🐾", l: "Adopter un animal", mode: "offer", cost: 300, split: true, ages: [16, 100], w: 4, cool: 5, coolPair: 8,
  d: "Un chiot, un chaton, un lapin nain. Une petite vie de plus à protéger à deux.", ask: "$A veut adopter un animal avec toi.",
  no: { ta: "$B n'est pas du tout pour.", bond: { aff: -2 } },
  yes: [{ w: 1, special: "pet_adopt", a: { bonheur: 3 }, b: { bonheur: 3 }, ta: "Le nouvel habitant a vite pris ses marques.", tb: "Le nouvel habitant a vite pris ses marques.", bond: { aff: 8 } }] });

mk({ id: "therapie_couple", ic: "🛋️", l: "Faire une thérapie de couple", mode: "offer", cost: 1200, split: true, ages: [20, 100], w: 6,
  d: "Quelques séances avec un spécialiste. C'est utile quand l'affection baisse ou que la tension monte.", ask: "$A te propose de voir un thérapeute de couple.",
  ok: (g, A, B, b) => coupleWith(A, B) && (b.aff < 70 || b.riv >= 10) && !b.tags.soigne, fit: (g, A, B, b) => 1.3 + b.riv / 40 + (b.aff < 50 ? 0.6 : 0),
  no: { ta: "$B refuse d'aller parler à un inconnu.", bond: { aff: -5, riv: 3 } },
  yes: [{ w: 1, special: "therapy", a: { bonheur: 3 }, b: { bonheur: 3 }, ta: "Vous apprenez à vous dire les choses.", tb: "Vous apprenez à vous dire les choses.", bond: { aff: 4 } }] });

mk({ id: "renouveler_voeux", ic: "💍", l: "Renouveler vos vœux", mode: "offer", cost: 2500, split: true, ages: [30, 100],
  ok: (g, A, B) => coupleWith(A, B) && married(A) && A.partner.wed !== undefined && A.age - A.partner.wed >= 8,
  d: "Une cérémonie intime après des années de mariage. Un rappel de ce qui vous lie.", ask: "$A voudrait que vous renouveliez vos vœux.",
  no: { ta: "$B trouve ça un peu cérémonieux.", bond: { aff: -2 } },
  yes: [{ w: 1, special: "vow_renew", a: { bonheur: 7 }, b: { bonheur: 7 }, ta: "La cérémonie est pleine de larmes et de sourires.", tb: "La cérémonie est pleine de larmes et de sourires.", bond: { aff: 12 } }] });

mk({ id: "cadeau_surprise", ic: "🎁", l: "Faire un cadeau surprise", mode: "direct", cost: 1000, ages: [14, 100], w: 6,
  d: "Un cadeau choisi avec soin, pas trop cher, juste très bien pensé.",
  direct: [{ w: 1, a: { bonheur: 2 }, b: { bonheur: 7 }, ta: "Tu offres un cadeau à $B et son visage s'illumine.", tb: "$A t'offre un cadeau qui te touche profondément.", bond: { aff: 8 } }] });

mk({ id: "testament_mutuel", ic: "📜", l: "Rédiger un testament commun", mode: "offer", ages: [35, 100], w: 3, cool: 8, coolPair: 12,
  d: "Chacun désigne l'autre comme héritier. Si l'un de vous disparaît, l'autre est protégé.", ask: "$A veut qu'on rédige un testament au nom de l'autre.",
  ok: (g, A, B) => coupleWith(A, B) && g.settings.inheritance && (A.heir !== B.seat || B.heir !== A.seat),
  no: { ta: "$B n'a pas envie de parler de ça.", bond: { aff: -2 } },
  yes: [{ w: 1, special: "mutual_will", a: { bonheur: 2 }, b: { bonheur: 2 }, ta: "Vous signez chez le notaire, main dans la main.", tb: "Vous signez chez le notaire, main dans la main.", bond: { aff: 8 } }] });

mk({ id: "pause_couple", ic: "⏸️", l: "Demander une pause", mode: "offer", ages: [18, 100], w: 3, cool: 3, coolPair: 5,
  d: "Quelques mois pour respirer. Ça peut sauver le couple, ou l'achever.", ask: "$A te demande une pause dans votre couple.",
  ok: (g, A, B, b) => coupleWith(A, B) && b.aff < 60, fit: (g, A, B, b) => 0.6 + (60 - b.aff) / 60,
  no: { ta: "$B refuse la pause et se vexe.", bond: { aff: -6, riv: 4 }, b: { bonheur: -4 } },
  yes: [{ w: 1, special: "couple_pause", a: {}, b: {}, ta: "$B accepte la pause.", tb: "Tu acceptes la pause.", bond: {} }] });

mk({ id: "rompre", ic: "💔", l: "Rompre", mode: "direct", ages: [16, 100], w: 3, cool: 4, coolPair: 6,
  d: "Tu mets fin à votre histoire. Si vous êtes mariés, il y a un divorce, un partage et une pension. Ça fait mal des deux côtés.",
  ok: (g, A, B, b) => coupleWith(A, B) && (b.aff < 55 || b.riv >= 15), fit: (g, A, B, b) => 0.5 + (b.riv >= 15 ? 0.8 : 0) + (b.aff < 35 ? 0.7 : 0),
  direct: [{ w: 1, special: "couple_break", a: {}, b: {}, ta: "Tu quittes $B.", tb: "$A te quitte.", bond: {} }] });

mk({ id: "aventure_cachee", ic: "🤫", l: "Avoir une aventure en cachette", mode: "direct", mature: true, hostile: true, ages: [20, 80], w: 3, cool: 4, coolPair: 5,
  d: "Une rencontre, un soir de trop, un mensonge de plus. Si c'est découvert, la rupture est probable et la confiance ne revient pas.",
  ok: (g, A, B, b) => coupleWith(A, B) && (b.aff < 70 || A.traits.honnete < 60), fit: (g, A, B, b) => 0.4 + (A.traits.honnete < 45 ? 0.8 : 0),
  direct: [{ w: 1, special: "affair", a: {}, b: {}, ta: "Tu vis une aventure à l'écart de $B.", tb: "Tu sens bien que quelque chose a changé chez $A.", bond: {} }] });

mk({ id: "scene_jalousie", ic: "😤", l: "Faire une scène de jalousie", mode: "direct", ages: [16, 100], w: 3, cool: 3, coolPair: 5, hostile: true,
  d: "Un message mal compris, un regard de trop. La dispute est mémorable et laisse des traces.",
  ok: (g, A, B, b) => coupleWith(A, B) && b.riv >= 5, fit: (g, A, B, b) => 0.4 + b.riv / 30,
  direct: [{ w: 1, special: "jealous_scene", a: {}, b: {}, ta: "Ta scène de jalousie fait trembler les murs.", tb: "$A te fait une scène de jalousie.", bond: {} }] });

reg({ id: "se_remettre_ensemble", grp: "couple", status: "ex", ic: "💞", l: "Se remettre ensemble", mode: "offer", ages: [18, 100], w: 6, cool: 3, coolPair: 5, prio: 0,
  d: "Vous vous êtes quittés, mais vous y repensez. Tu proposes de reprendre là où vous vous étiez arrêtés.", ask: "$A te propose de vous remettre ensemble.",
  ok: (g, A, B, b) => !!b.tags.ex && !A.partner && !B.partner && b.riv < 40, fit: (g, A, B, b) => 0.7 + b.aff / 90,
  no: { ta: "$B préfère garder le passé derrière lui.", bond: { aff: -3 } },
  yes: [{ w: 1, special: "reunite", a: { bonheur: 6 }, b: { bonheur: 6 }, ta: "$B accepte, avec un sourire timide.", tb: "Tu acceptes, avec un sourire timide.", bond: { aff: 12, riv: -10 } }] });
