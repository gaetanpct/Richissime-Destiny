// Actions de la maturité avancée et de la retraite. Pétanque, souvenirs, voyages tranquilles et dernières réconciliations.
const { reg, bond, coupleWith, publicKids } = require("../socialkit");

reg({ id: "petanque", grp: "jeu", ic: "🎯", l: "Proposer une partie de pétanque", d: "Des boules, de l'ombre et un pastis. Les règles sont sacrées, la mauvaise foi aussi.",
  ages: [50, 120], w: 9, cool: 2,
  yes: [
    { w: (g, A, B) => Math.max(0.25, Math.min(0.75, 0.5 + (A.stats.sport - B.stats.sport) / 300)), a: { bonheur: 5, sociable: 2, repute: 1 }, b: { bonheur: 3 }, ta: "Tu places ta dernière boule à un cheveu du cochonnet, sous les cris de l'assistance. $B réclame un mètre, perd, et rit.", tb: "Tu perds de justesse contre $A. Tu exiges de mesurer, tu mesures, tu perds quand même.", bond: { aff: 8, riv: 2 } },
    { w: (g, A, B) => Math.max(0.25, Math.min(0.75, 0.5 + (B.stats.sport - A.stats.sport) / 300)), a: { bonheur: 3 }, b: { bonheur: 5, sociable: 2, repute: 1 }, ta: "Tu perds de peu face à $B, qui fait semblant de ne pas être content. Il ou elle exulte à l'intérieur.", tb: "Ta victoire contre $A est saluée par un silence respectueux. Tu fais semblant de ne pas t'en vanter, mais tu t'en vantes.", bond: { aff: 8, riv: 2 } },
  ],
  no: { ta: "$B a mal au dos aujourd'hui. On repasse demain, ou l'an prochain.", bond: { aff: -1 } } });

reg({ id: "veillee_souvenirs", grp: "amitie", ic: "📷", l: "Ressortir les vieilles photos", d: "Un album poussiéreux, des visages d'avant et des souvenirs qui reviennent un par un.",
  ages: [45, 120], w: 9, cool: 2, ok: (g, A, B, b) => b.aff >= 18 || coupleWith(A, B),
  yes: [
    { w: 0.8, a: { bonheur: 6, creatif: 1 }, b: { bonheur: 6 }, ta: "Vous passez la soirée sur le canapé, à rire des coupes de cheveux, à pleurer un peu, à vous souvenir de tout et de n'importe quoi.", tb: "Les vieilles photos de $A te ramènent trente ans en arrière. Vous riez, vous vous taisez, vous vous serrez la main.", bond: { aff: 16 } },
    { w: 0.2, a: { bonheur: 3 }, b: { bonheur: 3 }, ta: "Un album contient une photo que personne ne voulait revoir. Après une seconde de gêne, tout le monde éclate de rire.", tb: "Une photo gênante circule entre vous deux. Elle est brûlée en riant, puis sauvegardée en secret.", bond: { aff: 9 } },
  ],
  no: { ta: "$B n'a plus ses lunettes. Les photos attendront.", bond: { aff: -1 } } });

reg({ id: "voyage_retraites", grp: "voyage", ic: "🚌", l: "Partir en voyage organisé", d: "Un car climatisé, un guide enthousiaste et un buffet à volonté. Frais partagés.",
  ages: [55, 120], w: 8, cool: 3, cost: 2200, split: true, ok: (g, A, B, b) => b.aff >= 18 || coupleWith(A, B),
  yes: [
    { w: 0.7, a: { bonheur: 6, sante: 1, sociable: 2 }, b: { bonheur: 6, sante: 1, sociable: 2 }, ta: "Le voyage est exactement ce que tu espérais. Les monuments sont beaux, le guide patient, le buffet pantagruélique.", tb: "Voyager avec $A, c'est la garantie de rire dès l'aéroport. Le buffet est à la hauteur de ton appétit.", bond: { aff: 13 } },
    { w: 0.3, a: { bonheur: 3, sante: -1 }, b: { bonheur: 3, sante: -1 }, ta: "Le car tombe en panne devant un champ de tournesols. Vous y passez deux heures, et c'est le meilleur moment du séjour.", tb: "Le car de ton voyage tombe en panne devant un champ de tournesols. Vous pique-niquez sur le bord de la route avec $A.", bond: { aff: 10 } },
  ],
  no: { ta: "$B préfère le fauteuil à la valise. Tu le comprends, tu regrettes quand même.", bond: { aff: -1 } } });

reg({ id: "derniere_reconciliation", grp: "paix", ic: "🤍", l: "Se réconcilier avant qu'il soit trop tard", d: "On a tous une vieille querelle qui traîne. À un certain âge, elle devient légère à porter, à condition de la déposer.",
  ages: [60, 120], w: 14, prio: 2, cool: 1, coolPair: 2, ok: (g, A, B, b) => b.riv >= 15,
  yes: [
    { w: 0.85, a: { bonheur: 8, bonte: 3 }, b: { bonheur: 8, bonte: 3 }, ta: "Vous parlez longtemps, de tout et de rien, de la querelle aussi. Quand elle revient, vous en riez. C'est fini.", tb: "Tu raccroches avec $A après deux heures de conversation. Le plus dur a été la première phrase.", bond: { riv: -50, aff: 15 }, tag: "paix" },
    { w: 0.15, a: { bonheur: 3 }, b: { bonheur: 3 }, ta: "$B ne revient pas sur le passé, mais accepte un café. C'est une belle trêve.", tb: "Tu acceptes un café avec $A. Le sujet n'est pas abordé, mais le silence est paisible.", bond: { riv: -25 } },
  ],
  no: { a: { bonheur: -4 }, ta: "$B garde ses vieilles rancunes, comme d'autres gardent leurs boutons de manchette.", bond: { riv: 3 } } });

reg({ id: "pot_retraite", grp: "famille", ic: "🥂", l: "Organiser un pot de départ en retraite", d: "Un discours, un cadeau, une grande tranche de gâteau et un collègue pris d'un fou rire.",
  ages: [58, 80], w: 16, prio: 2, cool: 0, coolPair: 5, ok: (g, A, B, b) => !!B.retired && B.retiredAt !== undefined && B.age - B.retiredAt <= 1 && b.aff >= 15 && !b.tags.potretraite,
  yes: [
    { w: 1, a: { bonheur: 4, sociable: 2 }, b: { bonheur: 8, repute: 1 }, ta: "Tu lèves ton verre à la nouvelle vie de $B. Le gâteau est énorme, les discours un peu trop longs, mais personne ne s'en plaint.", tb: "Pour ton départ en retraite, $A a tout organisé. Il y a même un gâteau en forme de canne à pêche.", bond: { aff: 16 }, tag: "potretraite" },
  ],
  no: { ta: "$B part sans cérémonie, sur la pointe des pieds. Ça fait un petit vide.", bond: { aff: -1 } } });

reg({ id: "course_deambulateurs", grp: "jeu", ic: "🦽", l: "Parier sur une course de déambulateurs", d: "Une piste, une ligne d'arrivée et un public en délire. Les concurrents ont une moyenne d'âge de quatre-vingt-un ans.", loufoque: true,
  ages: [65, 120], w: 6, cool: 3,
  yes: [
    { w: 0.5, a: { bonheur: 7, sociable: 2, repute: 2 }, b: { bonheur: 5 }, ta: "Ton déambulateur truqué avec des bandes lumineuses dépasse tous les autres. Tu remportes la coupe sous une pluie de confettis.", tb: "Tu perds la course contre $A, mais tu as dépassé un jeune de soixante-quatorze ans.", bond: { aff: 8, riv: 3 } },
    { w: 0.5, a: { bonheur: 5 }, b: { bonheur: 7, sociable: 2, repute: 2 }, ta: "Ton déambulateur dérape dans le virage final. $B passe devant, avec une grâce de pilote.", tb: "Tu gagnes la course, sous les applaudissements. La haie, elle, ne s'en remet pas.", bond: { aff: 8, riv: 3 } },
  ],
  no: { ta: "$B prétend que le déambulateur n'est pas homologué. Tu ne retrouves aucune règle écrite.", bond: { aff: -1 } } });

reg({ id: "transmettre_heritage", grp: "famille", ic: "🏺", l: "Léguer un objet de valeur sentimentale", d: "Une montre, un bijou, un service à thé. Le bien n'est pas le plus cher, mais il compte.", mode: "direct",
  ages: [60, 120], w: 6, cool: 4, coolPair: 5, ok: (g, A, B, b) => b.aff >= 35,
  direct: [
    { w: 1, a: { bonheur: 5, bonte: 2, repute: 1 }, b: { bonheur: 7, argent: 600 }, ta: "Tu offres à $B l'objet que tu gardais précieusement depuis soixante ans. Il ou elle pleure un peu, toi aussi, et c'est parfait.", tb: "$A te donne un objet qui fut longtemps le sien. Tu le gardes contre ton cœur.", bond: { aff: 20 } },
  ] });
