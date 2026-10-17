// Les grandes étapes de la vie, jouées quand le joueur choisit le projet correspondant.
// Rencontre, rendez-vous, emménagement, demande en mariage, mariage, bébé, rupture,
// augmentation, démission, retraite, reprise d'études, achat d'un logement, placements.
// Chaque étape réussit forcément après quelques essais, le joueur n'est donc jamais bloqué.
const { ev, flash, O, C, D } = require("../kit");
const CORE = require("../core");

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const arc = (p, k) => (p.arcs && p.arcs[k]) || 0;
const close = (n) => (n ? n.close : 50);
// probabilité de réussir une étape, avec un bonus qui grandit à chaque échec (au troisième essai c'est gagné)
const luck = (base, key, step) => (p) => clamp(base(p) + arc(p, key) * (step || 0.25), 0.05, arc(p, key) >= 3 ? 1 : 0.95);
const unluck = (base, key, step) => (p) => 1 - luck(base, key, step)(p);

// ---------------------------------------------------------------------------------
// 1. Rencontre
// ---------------------------------------------------------------------------------
ev("love_rencontre", {
  chainOnly: true, tags: ["amour"], ic: "💘", who: { crush: { kind: "crush", fresh: true, age: (p, rng) => Math.max(15, p.age + Math.floor(rng() * 9) - 4), close: 22 } },
  roll: { lieu: ["lors d'une soirée", "dans un café bondé", "à la sortie du travail", "au détour d'une librairie", "pendant un concert en plein air", "dans un train en retard"], detail: ["porte un chapeau de paille en plein hiver", "traîne un perroquet qui commente tout", "mange une baguette entière en marchant", "chante faux avec un enthousiasme communicatif", "porte deux chaussettes de couleurs différentes avec conviction", "tient un livre à l'envers sans s'en apercevoir", "a un rire qui fait tomber les verres", "te regarde en essayant de ne pas te regarder"] },
  t: "Tu te trouves $lieu quand ton regard croise celui de $crush. $crush $detail. Le monde ralentit un instant, puis reprend, plus vivement qu'avant.",
  c: [
    C("Engager la conversation", "💬", [
      O(luck((p) => 0.5 + (p.stats.charme - 50) / 170, "amour_essais"), "La conversation dure quatre heures et traverse tous les sujets, de la météo à la meilleure façon de couper une pizza. Tu repars avec un numéro et un sourire.", { rel: { crush: 26 }, bonheur: 5, charme: 1, arcreset: ["amour_essais"], next: "love_date" }),
      O(unluck((p) => 0.5 + (p.stats.charme - 50) / 170, "amour_essais"), "Tu bafouilles, tu renverses ton verre, tu cites un proverbe qui n'existe pas. $crush rit, gentiment. Vous échangez au moins vos prénoms.", { rel: { crush: 8 }, bonheur: -1, arc: { amour_essais: 1 } }),
    ]),
    C("Faire rire pour briser la glace", "😂", [
      O(luck((p) => 0.45 + (p.traits.sociable - 50) / 150 + (p.traits.creatif - 50) / 300, "amour_essais"), "Ta blague sur les canards marche au-delà de toute attente. $crush rit aux larmes, puis te demande comment tu t'appelles, ce qui est bon signe.", { rel: { crush: 28 }, bonheur: 6, sociable: 1, arcreset: ["amour_essais"], next: "love_date" }),
      O(unluck((p) => 0.45 + (p.traits.sociable - 50) / 150 + (p.traits.creatif - 50) / 300, "amour_essais"), "Ta blague tombe dans un silence de cathédrale. $crush sourit par politesse. Vous restez cordiaux, dans une gêne tendre.", { rel: { crush: 7 }, bonheur: -1, arc: { amour_essais: 1 } }),
    ]),
    D("Laisser ton numéro et filer", "📲", "Tu glisses ton numéro sur un petit papier, tu lances un « à bientôt » trop fort et tu disparais. $crush garde le papier en souriant.", { rel: { crush: 14 }, bonheur: 2, charme: 1 }),
    D("Passer ton chemin", "🚶", "Tu hésites, tu fais un pas, tu en fais un autre dans l'autre sens. L'occasion se glisse dans la foule sans faire de bruit.", { rel: { crush: -12 }, bonheur: -1 }),
  ],
});

// ---------------------------------------------------------------------------------
// 2. Rendez-vous
// ---------------------------------------------------------------------------------
const DATE_P = (bonus) => (p) => 0.42 + close(CORE.findNpc(p, "crush")[0]) / 230 + (p.stats.charme - 50) / 230 + (bonus || 0);
const dateWin = (bonus) => luck(DATE_P(bonus), "date_essais");
const dateLose = (bonus) => unluck(DATE_P(bonus), "date_essais");
const WIN_DATE = { becomes: { crush: "partner" }, bonheur: 8, charme: 1, arcreset: ["date_essais", "amour_essais"] };
const LOSE_DATE = { rel: { crush: -4 }, bonheur: -3, arc: { date_essais: 1 } };

ev("love_date", {
  chainOnly: true, tags: ["amour"], ic: "🥂", who: { crush: "crush" },
  t: "$crush accepte ton rendez-vous. Il faut maintenant choisir où l'emmener, avec une grande part d'espoir et une petite part de panique.",
  c: [
    C("Un dîner aux chandelles", "🕯️", [
      O(dateWin(0.1), "Le dîner est parfait. Vous parlez jusqu'à la fermeture, puis sur le trottoir, puis sur un banc. $crush finit par te prendre la main, et tu ne sens plus tes pieds.", WIN_DATE),
      O(dateLose(0.1), "Le serveur confond vos plats, l'addition est salée et la conversation tourne à la météo. $crush promet de t'écrire, du ton de quelqu'un qui hésite.", LOSE_DATE),
    ], { cost: 120 }),
    C("Une balade et une glace", "🍦", [
      O(dateWin(0.05), "Vous marchez des heures, vous riez de tout, vous partagez la dernière boule. Au moment de partir, $crush te dit « on remet ça ? », avec un grand sourire.", WIN_DATE),
      O(dateLose(0.05), "Il pleut, la glace tombe, un pigeon s'en mêle. La soirée est drôle, mais $crush la classe dans la case « gentil ».", LOSE_DATE),
    ], { cost: 15 }),
    C("Une activité complètement improvisée", "🎳", [
      O(dateWin(0.02), "Vous finissez au bowling, sur une piste de karaoké, au milieu d'un anniversaire d'inconnus. Vous passez la meilleure soirée de l'année.", WIN_DATE),
      O(dateLose(0.02), "Le bowling est fermé, le karaoké aussi, et vous finissez au kebab. $crush y trouve du charme, mais pas assez pour ce soir.", LOSE_DATE),
    ], { cost: 60 }),
    C("Une promenade au bord de l'eau, sans un sou", "🌊", [
      O(dateWin(0), "Pas un centime dépensé, mais un coucher de soleil, une conversation sans fin et un canard qui vous suit. $crush te prend la main sans prévenir.", WIN_DATE),
      O(dateLose(0), "Le vent se lève, le canard disparaît, et la conversation s'épuise avant le coucher du soleil. $crush reste poli{$crush:|e}, mais ailleurs.", LOSE_DATE),
    ]),
    C("Cuisiner chez toi", "🍝", [
      O(dateWin(0.03), "Tu fais brûler les pâtes, $crush sauve la sauce. Vous mangez par terre en riant, et la soirée prend une tournure que le four n'aurait pas prévue.", WIN_DATE),
      O(dateLose(0.03), "Ta cuisine s'enfume, l'alarme sonne, un voisin sonne aussi. $crush s'éclipse avec élégance et une part de gâteau.", LOSE_DATE),
    ], { cost: 40 }),
    D("Remettre à plus tard", "💤", "Tu repousses. Les jours passent, la confiance aussi.", { rel: { crush: -2 } }),
  ],
});

ev("love_ex", {
  chainOnly: true, tags: ["amour"], ic: "📞", who: { ex: "ex" },
  t: "Tu écris à $ex. Une phrase, puis une autre, puis un café. On dit que les anciens amours ne meurent jamais, ils prennent juste un autre abonnement.",
  c: [
    C("Se remettre ensemble", "💞", [
      O((p) => clamp(0.35 + close(CORE.findNpc(p, "ex")[0]) / 250 + arc(p, "ex_essais") * 0.2, 0.1, 0.9), "Vous vous retrouvez comme si rien ne s'était passé, sauf deux ou trois remarques sur la vaisselle. Cette fois, vous vous dites tout dès le début.", { becomes: { ex: "partner" }, bonheur: 6, rel: { ex: 25 } }),
      O((p) => 1 - clamp(0.35 + close(CORE.findNpc(p, "ex")[0]) / 250 + arc(p, "ex_essais") * 0.2, 0.1, 0.9), "Vous réalisez en dix minutes pourquoi vous vous étiez séparés. Vous finissez le café, polis et soulagés.", { bonheur: -2, arc: { ex_essais: 1 } }),
    ]),
    D("Tourner la page autour d'un café", "☕", "Vous faites le tour de vos souvenirs, avec un sourire doux. Tu repars plus léger.", { bonheur: 3, rel: { ex: 8 }, intel: 1 }),
    D("Régler tes comptes", "📢", "Tu dis tout ce que tu avais sur le cœur. $ex écoute, puis répond, puis claque la porte. Tu te sens à la fois mieux et un peu ridicule.", { bonheur: 1, rel: { ex: -14 }, courage: 2 }),
    D("Finalement, ne rien faire", "🙈", "Tu poses ton téléphone sur la table, face contre le bois. Cette histoire restera dans le passé.", { bonheur: 0 }),
  ],
});

// ---------------------------------------------------------------------------------
// 3. Vie à deux
// ---------------------------------------------------------------------------------
ev("love_emmenager", {
  chainOnly: true, tags: ["amour", "logement"], ic: "🔑", who: { partner: "partner" },
  t: "Entre les week-ends chez l'un et les week-ends chez l'autre, tu transportes de plus en plus de brosses à dents. $partner te regarde et dit « on devrait peut-être arrêter de se promener avec nos affaires dans des sacs ».",
  c: [
    C("Louer un appartement à deux", "🏢", [
      O(0.85, "Vous visitez quarante appartements, vous en choisissez un avec un balcon minuscule et une vue sur un parking. Vous y êtes heureux, et même la plante survit.", { flag: "cohab", home: "location", rel: { partner: 12 }, bonheur: 6 }),
      O(0.15, "L'aménagement donne lieu à un conflit mémorable autour d'une étagère. Vous vous réconciliez sur le canapé, au milieu des cartons.", { flag: "cohab", home: "location", rel: { partner: 4 }, bonheur: 3 }),
    ], { cost: 1500 }),
    D("Emménager chez $partner", "🚪", "Tu poses tes cartons dans un salon qui n'est pas le tien, mais qui le deviendra. La vie s'y organise doucement.", { flag: "cohab", home: "location", rel: { partner: 9 }, bonheur: 4 }),
    C("Acheter un logement ensemble", "🏡", [
      O(0.8, "Chez le notaire, vous signez avec des mains qui tremblent. Un toit à deux, un crédit à deux, et un voisin à qui il faudra dire bonjour pendant vingt ans.", { flag: "cohab", item: { kind: "immo", name: "Appartement acheté à deux", value: 78000 }, dette: 45000, home: "own", rel: { partner: 14 }, bonheur: 7 }),
      O(0.2, "Les travaux explosent le budget et la patience de tout le monde. Mais vous avez désormais des murs à vous, et des disputes de couple propriétaire.", { flag: "cohab", item: { kind: "immo", name: "Appartement acheté à deux", value: 72000 }, dette: 52000, home: "own", rel: { partner: 8 }, bonheur: 4, argent: -34000 }),
    ], { cost: 30000 }),
    D("Pas tout de suite", "⏳", "Tu expliques que tu as besoin d'un peu de temps. $partner hoche la tête et ravale sa déception.", { rel: { partner: -4 }, bonheur: -1 }),
  ],
});

const YES = (bonus) => (p) => clamp(0.6 + close(CORE.findNpc(p, "love")[0]) / 300 + (p.partner && p.partner.since !== undefined && p.age - p.partner.since >= 3 ? 0.08 : 0) + (bonus || 0) + arc(p, "demande_essais") * 0.25, 0.1, arc(p, "demande_essais") >= 2 || close(CORE.findNpc(p, "love")[0]) >= 85 ? 1 : 0.95);
const NO = (bonus) => (p) => 1 - YES(bonus)(p);
const REFUS = { rel: { partner: -10 }, bonheur: -7, flag: { demande_refusee: 2 }, arc: { demande_essais: 1 } };

ev("love_demande", {
  chainOnly: true, tags: ["amour"], ic: "💍", who: { partner: "partner" },
  t: "La bague est dans ta poche depuis trois semaines. Tu l'as montrée au chat, qui n'a pas réagi. Il est temps de te lancer pour de vrai auprès de $partner.",
  c: [
    C("Une demande intime, à la maison", "🕯️", [
      O(YES(0.05), "Tu mets un genou à terre dans la cuisine, entre deux casseroles. $partner pleure, rit, dit oui trois fois de suite. Le chat s'enfuit, jaloux.", { becomes: { partner: "spouse" }, bonheur: 12, arcreset: ["demande_essais"], next: "love_mariage" }),
      O(NO(0.05), "$partner te regarde longuement, la bouche tremblante. « Je ne suis pas prêt{$partner:|e} » dit-{$partner:il|elle} enfin. Tu ranges la bague avec un nœud dans la gorge.", REFUS),
    ]),
    C("Une demande publique et spectaculaire", "🎆", [
      O(YES(-0.03), "Devant cent personnes, sous un feu d'artifice commandé pour l'occasion, tu poses la question. $partner dit oui avant la fin de ta phrase. La foule hurle, un inconnu pleure.", { becomes: { partner: "spouse" }, bonheur: 14, repute: 2, arcreset: ["demande_essais"], pub: "💍 $nom fait sa demande en mariage devant tout le monde.", next: "love_mariage" }),
      O(NO(-0.03), "Devant cent personnes, $partner dit « je dois réfléchir ». Un silence énorme tombe. Quelqu'un tousse, quelqu'un applaudit par erreur.", Object.assign({}, REFUS, { repute: -2, bonheur: -9 })),
    ], { cost: 700 }),
    C("Une demande absurde au sommet d'un décor en carton", "🏔️", [
      O(YES(-0.05), "Tu choisis le plus improbable des décors, un volcan en carton-pâte, et tu récites ton texte avec un sérieux comique. $partner dit oui en riant jusqu'aux larmes.", { becomes: { partner: "spouse" }, bonheur: 13, creatif: 2, arcreset: ["demande_essais"], next: "love_mariage" }),
      O(NO(-0.05), "$partner trouve l'idée charmante, mais pas assez pour dire oui. « Ce n'est pas le bon moment » murmure-t-{$partner:il|elle} en souriant tristement.", REFUS),
    ], { cost: 200 }),
    D("Attendre encore un peu", "⏳", "Tu repousses la demande. La bague continue de vivre dans ta veste, en cachette.", { bonheur: -1 }),
  ],
});

ev("love_mariage", {
  chainOnly: true, tags: ["amour", "jalon"], ic: "💒", who: { partner: "partner" },
  t: "Le oui est prononcé, il reste à organiser le grand jour. $partner et toi avez des idées très différentes, ce qui promet des négociations difficiles et un gâteau à plusieurs étages.",
  c: [
    C("Une grande fête avec toute la famille", "🎊", [
      O(0.85, "Cent cinquante invités, un orchestre, un cousin qui pleure pendant les discours et une tante qui danse sur la table. Le plus beau jour de ta vie, selon plusieurs sources.", { bonheur: 14, rel: { partner: 12, family: 6 }, sociable: 2, pub: "💒 $nom se marie en grande pompe." }),
      O(0.15, "La pluie, le traiteur en retard, une tante qui renverse la pièce montée. Le mariage est un désastre magnifique dont on parlera pendant des décennies.", { bonheur: 11, rel: { partner: 14 }, pub: "💒 $nom se marie, et personne n'oubliera le gâteau." }),
    ], { cost: 9000 }),
    D("Un mariage simple entre proches", "🌿", "Vingt invités, un jardin, un déjeuner sous les arbres. Tout est calme, doux et complètement vous.", { bonheur: 11, rel: { partner: 13 }, pub: "💒 $nom se marie dans la simplicité." }, { cost: 1800 }),
    D("La mairie en baskets, puis une pizza", "🍕", "Vous signez, vous riez, vous mangez une pizza sur les marches de la mairie. C'est exactement ce que vous vouliez, ni plus ni moins.", { bonheur: 9, rel: { partner: 10 } }),
    C("Un mariage à thème délirant", "🤪", [
      O(1, "Tout le monde est déguisé en pirates, en chevaliers ou en légumes. Le prêtre est un clown. Les photos sont irrécupérables, et sublimes.", { bonheur: 13, rel: { partner: 12 }, creatif: 3, pub: "💒 $nom organise le mariage le plus fou de la région." }),
    ], { cost: 3500 }),
  ],
});

// Bébé
ev("love_bebe", {
  chainOnly: true, tags: ["amour", "famille"], ic: "👶", who: { partner: "partner" },
  t: "Toi et $partner parlez beaucoup de ce petit quelqu'un qui n'existe pas encore. Les prénoms circulent, les peurs aussi. Il est temps de décider si c'est le bon moment.",
  c: [
    C("Essayer d'avoir un enfant", "🍼", [
      O((p) => clamp(0.62 - Math.max(0, p.age - 34) * 0.04 + arc(p, "bebe_essais") * 0.2, 0.08, arc(p, "bebe_essais") >= 3 && p.age <= 42 ? 1 : 0.95), "Une bonne nouvelle arrive après quelques mois d'attente et de petits signes. Neuf mois plus tard, un cri retentit dans la salle d'accouchement, minuscule et vainqueur.", { born: 1, rel: { partner: 12 }, bonheur: 10, arcreset: ["bebe_essais"], next: "love_naissance" }),
      O((p) => 1 - clamp(0.62 - Math.max(0, p.age - 34) * 0.04 + arc(p, "bebe_essais") * 0.2, 0.08, arc(p, "bebe_essais") >= 3 && p.age <= 42 ? 1 : 0.95), "Cette année, la cigogne fait la grève. Vous avez rigolé, pleuré un peu, reparlé du sujet à voix basse. Vous gardez espoir.", { rel: { partner: 4 }, bonheur: -1, arc: { bebe_essais: 1 } }),
    ]),
    D("En parler encore longuement", "💬", "Vous passez de longues soirées à discuter. Vous ne décidez rien, mais vous vous connaissez mieux.", { rel: { partner: 5 }, bonheur: 1 }),
    D("Remettre à plus tard", "⏳", "Le travail, le logement, la peur, tout est prétexte. Vous vous donnez encore un an.", { bonheur: -1 }),
  ],
});

ev("love_naissance", {
  chainOnly: true, tags: ["famille", "jalon"], ic: "🍼", who: { partner: "partner" },
  t: "Le bébé est là, avec dix doigts, deux yeux et une opinion arrêtée sur le sommeil. $enfant dort dans tes bras. Il faut choisir comment fêter cette arrivée.",
  c: [
    D("Un baptême ou une fête en famille", "🎈", "La famille se réunit autour du berceau. Il y a des cadeaux en triple exemplaire, et un oncle qui prend trop de photos.", { bonheur: 5, argent: -400, rel: { family: 6, enfant: 12 } }),
    D("Une petite cérémonie intime à la maison", "🕯️", "Vous êtes trois dans la cuisine, avec un gâteau de supermarché. C'est tout ce dont vous aviez besoin.", { bonheur: 5, rel: { enfant: 12, partner: 4 } }),
    D("Prendre un congé pour rester avec le bébé", "🛌", "Vous passez de longues semaines à regarder le bébé dormir. Le temps ne s'écoule plus de la même façon.", { bonheur: 6, rel: { enfant: 15, partner: 6 }, perf: -2, argent: -1200 }),
  ],
});

ev("love_adoption", {
  chainOnly: true, tags: ["famille", "jalon"], ic: "🧸",
  t: "Après des mois de dossiers, d'entretiens et de visites, une assistante sociale vous appelle. Elle a une bonne nouvelle, dit-elle d'une voix très douce, et une petite personne qui attend déjà dans le couloir.",
  c: [
    D("Accueillir un enfant", "💞", "Une petite main attrape la tienne comme s'il l'avait toujours fait. La famille s'agrandit d'un seul coup.", { adopt: 1, bonheur: 11, bonte: 3, rel: { partner: 10 } }),
    C("Accueillir deux frères et sœurs", "👫", [O(1, "On ne sépare pas ces deux-là, alors vous prenez les deux. La maison devient un joyeux chaos, avec des chaussures partout.", { adopt: 2, bonheur: 12, bonte: 4, rel: { partner: 12 } })], { cost: 2500 }),
    D("Renoncer pour le moment", "🕊️", "Le projet est trop lourd pour toi en ce moment. Vous gardez l'idée au chaud.", { bonheur: -3, rel: { partner: -3 } }),
  ],
});

ev("love_rupture", {
  chainOnly: true, tags: ["amour"], ic: "💔", who: { partner: "partner" },
  t: "Les silences durent plus longtemps que les mots. Tu repasses mille fois la même phrase dans ta tête, comme un disque rayé. Tu sais, au fond, ce qu'il faut faire pour $partner et pour toi.",
  c: [
    D("Rompre en douceur, en face", "🕊️", "Tu parles longtemps, avec des silences, des larmes et un « merci pour tout ». Vous ne vous quittez pas fâchés, seulement un peu cassés.", { drop: "partner", bonheur: -5, bonte: 2, honnete: 1 }),
    D("Rompre par message", "📱", "Tu tapes, tu effaces, tu renvoies. $partner répond en trois secondes avec des mots qui ne se répètent pas ici. Ta réputation en prend un coup.", { drop: "partner", bonheur: -3, repute: -2, bonte: -2 }),
    D("Rompre en chanson", "🎸", "Tu composes un morceau de rupture, très touchant, très long, avec quatre couplets. $partner l'écoute en entier et pleure de rire.", { drop: "partner", bonheur: -2, creatif: 3 }),
    D("Finalement, vous vous donnez une chance", "🌱", "Vous vous parlez enfin sincèrement, vous vous écoutez, vous riez même un peu. L'histoire continue, avec un peu plus de lucidité.", { rel: { partner: 12 }, bonheur: 3 }),
  ],
});

ev("love_divorce", {
  chainOnly: true, tags: ["amour", "argent"], ic: "⚖️", who: { partner: "partner" },
  t: "Vous êtes deux étrangers qui se croisent dans le couloir, s'excusent et se disputent ensuite. L'idée du divorce traîne dans votre maison depuis des mois, comme une odeur de chou.",
  c: [
    C("Divorcer à l'amiable", "🕊️", [O(1, "Un avocat, une feuille de papier, deux signatures. Tout se passe étonnamment bien, sauf l'histoire du canapé.", { drop: "partner", argent: (p) => -Math.round(Math.max(2500, CORE.netWorth(p) * 0.08)), bonheur: -5, bonte: 1 })], {}),
    C("Se lancer dans une guerre d'avocats", "🥊", [
      O(0.5, "Après des mois de mails assassins, tu obtiens ce que tu voulais, plus ou moins. Tes avocats se paient une villa.", { drop: "partner", argent: (p) => -Math.round(Math.max(6000, CORE.netWorth(p) * 0.2)), bonheur: -4, repute: -2 }),
      O(0.5, "La guerre tourne mal. Les avocats raflent la mise, et tu perds la moitié de ce que tu avais.", { drop: "partner", argent: (p) => -Math.round(Math.max(9000, CORE.netWorth(p) * 0.35)), bonheur: -9, repute: -3 }),
    ]),
    D("Tenter une dernière thérapie", "🛋️", "Vous allez voir un thérapeute. Il vous apprend à vous parler sans vous couper la parole. Ce n'est pas la fin, pas encore.", { rel: { partner: 14 }, bonheur: 2 }, { cost: 600 }),
  ],
});

// ---------------------------------------------------------------------------------
// 4. Travail
// ---------------------------------------------------------------------------------
const RAISE_P = (bonus) => (p) => clamp(0.4 + (p.job ? p.job.perf : 50) / 250 + (p.age - (p.job ? p.job.since : p.age)) / 60 + (bonus || 0) + arc(p, "raise_essais") * 0.25, 0.08, arc(p, "raise_essais") >= 2 ? 1 : 0.92);
ev("job_raise", {
  chainOnly: true, tags: ["travail"], ic: "💰", who: { boss: "boss" },
  t: "Tu prends rendez-vous avec $boss. Dans le couloir, ton cœur bat dans les oreilles et ta cravate a l'air plus petite que d'habitude. Il est temps de défendre ton salaire.",
  c: [
    C("Plaider avec des chiffres", "📊", [
      O(RAISE_P((0)), "Tes tableaux sont convaincants et tes arguments précis. $boss accepte d'une voix lente. Tu sors avec une augmentation dont tu es discrètement fier.", { raise: 0.12, perf: 4, bonheur: 4, intel: 1, arcreset: ["raise_essais"] }),
      O((p) => 1 - RAISE_P(0)(p), "$boss te remercie pour ta présentation, puis parle de « conjoncture ». Tu sors avec un café et des promesses.", { bonheur: -2, arc: { raise_essais: 1 } }),
    ]),
    C("Jouer la carte du charme et de l'ambiance", "😄", [
      O((p) => clamp(RAISE_P(0.02)(p) + (p.stats.charme - 50) / 250, 0.08, arc(p, "raise_essais") >= 2 ? 1 : 0.92), "Tu fais rire $boss, tu parles de l'équipe, du moral, du café. L'augmentation tombe presque par hasard, accompagnée d'un sourire.", { raise: 0.1, bonheur: 4, charme: 1, arcreset: ["raise_essais"] }),
      O((p) => 1 - clamp(RAISE_P(0.02)(p) + (p.stats.charme - 50) / 250, 0.08, arc(p, "raise_essais") >= 2 ? 1 : 0.92), "$boss rit de tes blagues, applaudit ton énergie, et te laisse repartir sans rien. Tu as passé un excellent moment, vraiment.", { bonheur: -1, arc: { raise_essais: 1 } }),
    ]),
    C("Viser une vraie promotion", "🎯", [
      O((p) => clamp(RAISE_P(-0.05)(p), 0.08, arc(p, "raise_essais") >= 2 ? 1 : 0.9), "On te propose un poste plus élevé, avec un nouveau titre sur la carte de visite. Tu fais mine de réfléchir, puis tu dis oui à toute vitesse.", { promote: true, bonheur: 6, ambition: 2, arcreset: ["raise_essais"] }),
      O((p) => 1 - clamp(RAISE_P(-0.05)(p), 0.08, arc(p, "raise_essais") >= 2 ? 1 : 0.9), "« Pas cette année » répond $boss. « Peut-être la prochaine. » Tu n'as pas eu de raison de le croire.", { bonheur: -3, arc: { raise_essais: 1 } }),
    ], { risk: 1 }),
    C("Menacer de démissionner", "😤", [
      O(0.45, "Ton bluff fonctionne. $boss blêmit, propose une augmentation généreuse et un nouveau bureau. Tu es désormais la star du service.", { raise: 0.2, bonheur: 5, courage: 2, arcreset: ["raise_essais"] }),
      O(0.35, "$boss ne se laisse pas impressionner. Il t'invite à t'asseoir, te sert un thé, et te dit « réfléchis bien ». Rien ne bouge.", { bonheur: -3, perf: -3, arc: { raise_essais: 1 } }),
      O(0.2, "$boss prend ta démission au mot. Tu es dehors en vingt minutes, ton carton dans les bras, ta plante sous le bras.", { fire: true, bonheur: -8, repute: -3, forced: ["sys:jobhunt"] }),
    ], { risk: 2 }),
  ],
});

ev("job_quit", {
  chainOnly: true, tags: ["travail", "jalon"], ic: "🚪",
  t: "Ça fait des mois que tu y penses. Dans le métro, sous la douche, devant le micro-ondes. Aujourd'hui, la décision t'appartient. Comment veux-tu quitter ce travail ?",
  c: [
    D("Démissionner proprement et chercher autre chose", "📝", "Tu rédiges une lettre digne, tu la remets en main propre. Ton patron te serre la main, vaguement ému, vaguement soulagé.", { quit: true, bonheur: 2, forced: ["sys:jobhunt"] }),
    C("Négocier une rupture conventionnelle", "🤝", [
      O(0.55, "Les négociations aboutissent. Tu pars avec un chèque et un pot de départ, un peu gêné de ta propre chance.", { quit: true, argent: (p) => (p.job ? Math.round(p.job.salary * 0.3) : 0), bonheur: 3, forced: ["sys:jobhunt"] }),
      O(0.45, "L'entreprise refuse. « On ne fait pas ça ici. » Tu restes sur ton fauteuil, un peu humilié(e), très résolu(e).", { bonheur: -3 }),
    ]),
    D("Partir en claquant la porte", "💥", "Tu jettes ta cravate dans la photocopieuse, tu salues l'open space d'un grand geste, et tu quittes les lieux sous des applaudissements incertains.", { quit: true, repute: -4, courage: 3, bonheur: 5, forced: ["sys:jobhunt"] }),
    D("Finalement, tu restes", "🙂", "Tu ranges la lettre dans un tiroir. Tu ne sais plus si c'était du courage ou de la sagesse.", { perf: 3, bonheur: 0 }),
  ],
});

ev("job_retraite", {
  chainOnly: true, tags: ["travail", "jalon"], ic: "🏖️",
  t: "Des collègues organisent un pot de départ sans te demander, avec un gâteau en forme de pantoufle. Tes enfants, ta famille et le chat attendent ta décision sur ta carrière.",
  c: [
    D("Prendre ta retraite pour de bon", "🌴", "Le dernier jour, tu éteins l'ordinateur et tu pars sans te retourner. Les pantoufles te tendent les bras, et ton café dure enfin plus de dix minutes.", { retire: true, bonheur: 5, pub: "🏖️ $nom prend sa retraite." }),
    C("Partir en fanfare avec un grand pot de départ", "🎉", [O(1, "Tu offres un buffet à toute l'entreprise, le patron prononce un discours trop long, et la comptable pleure. Tu pars la tête haute.", { retire: true, bonheur: 7, repute: 2, pub: "🏖️ $nom prend sa retraite dans un grand pot de départ." })], { cost: 600 }),
    D("Travailler encore un peu", "💼", "Tu n'es pas prêt(e) à lâcher tes habitudes. Le bureau t'accueille comme un vieux fauteuil.", { perf: 4, bonheur: 0 }),
  ],
});

// ---------------------------------------------------------------------------------
// 5. Études
// ---------------------------------------------------------------------------------
ev("reprise_orient", {
  chainOnly: true, tags: ["ecole"], ic: "🧭🎓",
  t: "Tu t'es décidé(e) à retourner étudier. Les jeunes autour de toi ont la moitié de ton âge et le double de ton énergie, mais tu as, toi, des raisons précises de revenir. Quelle voie choisis-tu ?",
  c: (p) => [
    C("Une licence (3 ans)", "🏛️", [O(1, "Tu t'inscris à l'université. Tu es le plus âgé de l'amphi, et le seul à noter vraiment les cours.", { next: "choix_filiere", school: (q) => ({ phase: "sup", track: "fac", target: "licence", endAge: q.age + 3 }), bonheur: 3, ambition: 2 })], { need: { edu: 3, maxedu: 3 } }),
    C("Un BTS ou une formation courte (2 ans)", "🔧", [O(1, "Une formation concrète et courte. Tu apprends vite, car tu sais exactement pourquoi tu es là.", { next: "choix_filiere", school: (q) => ({ phase: "sup", track: "bts", target: "licence", endAge: q.age + 2 }), bonheur: 2, ambition: 2 })], { need: { edu: 2, maxedu: 3 } }),
    C("Un master (2 ans)", "🎓", [O(1, "Tu t'attaques à un master avec une détermination qui impressionne les enseignants. Les nuits blanches sont aussi de la partie.", { next: "choix_filiere", school: (q) => ({ phase: "sup", track: "master", target: "master", endAge: q.age + 2 }), dette: 6000, intel: 2, ambition: 3 })], { need: { edu: 4 }, why: "Il faut déjà une licence" }),
    C("Une école d'art (3 ans)", "🎨", [O(1, "Tu entres dans une école d'art tard dans la vie. Tu y apprends des choses sur la peinture, et surtout sur toi.", { next: "choix_filiere", school: (q) => ({ phase: "sup", track: "art", target: "licence", endAge: q.age + 3 }), creatif: 5, dette: 3000, bonheur: 4 })], { need: { edu: 3, maxedu: 3 } }),
    C("Un doctorat (4 ans)", "🧪", [O(1, "Tu te lances dans une thèse sur un sujet que personne d'autre ne comprend. Tu seras le meilleur du monde, à toi tout seul.", { next: "choix_filiere", school: (q) => ({ phase: "sup", track: "doctorat", target: "doctorat", endAge: q.age + 4 }), intel: 4, bonheur: -2, ambition: 3 })], { need: { edu: 5, stat: { intel: [60, null] } }, why: "Il faut un master et une intelligence solide" }),
    D("Finalement, laisser tomber", "🙈", "Tu ranges ton dossier d'inscription dans un tiroir. Ça te démangera peut-être un autre jour.", {}),
  ],
});

// ---------------------------------------------------------------------------------
// 6. Argent
// ---------------------------------------------------------------------------------
ev("achat_logement", {
  chainOnly: true, tags: ["argent", "logement"], ic: "🏠",
  t: "Tu pousses la porte de l'agence immobilière avec le sentiment de faire une bêtise. Le conseiller, qui sourit de toutes ses dents, a déjà trois dossiers sur le bureau. Quel logement vises-tu ?",
  c: (p) => [
    D("Acheter un studio", "🛋️", "Petit, un peu sombre, mais à toi. Les murs sont fins, le prix aussi.", { item: "studio", dette: 70000, home: "own", prudent: 3, bonheur: 3 }, { need: { money: [8000, null] }, cost: 8000 }),
    C("Acheter un appartement", "🏢", [O(0.75, "Tu signes chez le notaire. Un toit à toi et une dette à ta mesure.", { item: "appart", dette: 150000, home: "own", bonheur: 6, prudent: 2 }), O(0.25, "Les travaux explosent le budget. Mais l'appartement est ravissant.", { item: "appart", dette: 165000, argent: -18000, home: "own", bonheur: 3 })], { need: { money: [12000, null] }, cost: 12000 }),
    C("Acheter une maison avec jardin", "🏡", [O(0.7, "Un jardin, un verger, un chat qui adopte le canapé. Tu es chez toi.", { item: "maison", dette: 220000, home: "own", bonheur: 8, prudent: 1 }), O(0.3, "Le toit fuit vraiment. Les travaux dévorent tes économies.", { item: "maison", dette: 240000, argent: -40000, home: "own", bonheur: 3 })], { need: { money: [30000, null] }, cost: 25000 }),
    C("Acheter une villa avec piscine", "🏖️", [O(1, "Une villa avec piscine, palmiers et un voisin qui t'envie. Tu es fier(e) comme un paon, et ton jardinier encore plus.", { item: "villa", home: "own", bonheur: 10, repute: 3 })], { need: { money: [950000, null] }, cost: 900000 }),
    D("Rester locataire en paix", "🔑", "Tu quittes l'agence sans rien signer. Le conseiller, lui, soupire dans sa plante verte.", { prudent: 1 }),
  ],
});

ev("invest_opportunite", {
  chainOnly: true, tags: ["argent"], ic: "🎰", roll: { mise: (p) => Math.max(1000, Math.min(Math.floor(p.cash * 0.5), Math.round(p.cash * 0.25 / 500) * 500)) },
  t: "Un ami d'un ami d'un cousin te propose un plan d'investissement qui « va tout changer ». Il parle vite, avec des chiffres qui brillent. Tu peux placer $mise. Le niveau de risque est affiché sur chaque proposition.",
  c: [
    C("Un fonds sécurisé, sans risque", "🛡️", [O(1, "Tu places ton argent sur un fonds sans histoire. Il rapportera peu, mais il ne t'empêchera jamais de dormir.", { placer: (p, x) => ({ kind: "obligations", amount: x.vals.mise }), prudent: 1 })], { cost: (p, x) => x.vals.mise, risk: 0 }),
    C("Une société d'immobilier de bureaux", "🏢", [O(0.8, "Les loyers tombent, les bureaux se remplissent. Tu touches de petits dividendes réguliers.", { placer: (p, x) => ({ kind: "pierre", amount: x.vals.mise }) }), O(0.2, "Le marché des bureaux s'effondre pendant la crise du télétravail. Ta part perd du terrain.", { placer: (p, x) => ({ kind: "pierre", amount: Math.round(x.vals.mise * 0.7) }), bonheur: -2 })], { cost: (p, x) => x.vals.mise, risk: 1 }),
    C("Une start-up inconnue qui promet monts et merveilles", "🦄", [
      O(0.08, "Ta start-up est rachetée par un géant du secteur. Ta part est multipliée par dix, et tu prends la pose pendant tout le dîner.", { item: (p, x) => ({ kind: "entreprise", name: "Parts de start-up", value: Math.round(x.vals.mise * 10) }), bonheur: 10, repute: 3, pub: "🦄 $nom a fait un coup de génie en investissant dans une start-up." }),
      O(0.22, "La start-up trouve un petit marché. Ta part gagne un peu de valeur, c'est déjà un exploit.", { item: (p, x) => ({ kind: "entreprise", name: "Parts de start-up", value: Math.round(x.vals.mise * 1.6) }), bonheur: 3 }),
      O(0.4, "La start-up tient un an, puis ferme. Il reste de ton argent deux fauteuils et un baby-foot.", { item: (p, x) => ({ kind: "entreprise", name: "Parts de start-up", value: Math.round(x.vals.mise * 0.25) }), bonheur: -5 }),
      O(0.3, "La start-up s'évanouit un matin, et son fondateur aussi. Il reste ton virement et ton air étonné.", { bonheur: -8, repute: -1 }),
    ], { cost: (p, x) => x.vals.mise, risk: 4 }),
    C("Une cryptomonnaie sortie de nulle part", "🪙", [
      O(0.05, "Ta cryptomonnaie explose de manière absurde. En quelques mois, ton petit pari est devenu une fortune. Tu n'as aucune idée de ce qui s'est passé, et tu t'en fiches.", { item: (p, x) => ({ kind: "crypto", name: "Cryptomonnaie miraculeuse", value: Math.round(x.vals.mise * 22) }), bonheur: 14, repute: 4, pub: "🪙 $nom a fait fortune avec une cryptomonnaie improbable." }),
      O(0.25, "La monnaie double de valeur puis hésite, puis double encore. Tu oses espérer.", { item: (p, x) => ({ kind: "crypto", name: "Cryptomonnaie miraculeuse", value: Math.round(x.vals.mise * 2) }), bonheur: 4 }),
      O(0.7, "La cryptomonnaie perd tout, du jour au lendemain, avec la dignité d'une montgolfière percée.", { bonheur: -8, prudent: 2 }),
    ], { cost: (p, x) => x.vals.mise, risk: 5 }),
    C("Un élevage de truffes dans le Périgord", "🍄", [
      O(0.3, "Les chênes ont fini par donner. Les truffes se vendent à prix d'or. Ton chien truffier, ravi, pleure presque de joie.", { item: (p, x) => ({ kind: "entreprise", name: "Truffière du Périgord", value: Math.round(x.vals.mise * 2.8), income: Math.round(x.vals.mise * 0.06) }), bonheur: 6, creatif: 1 }),
      O(0.7, "Les chênes sont encore petits, le chien truffier est capricieux, et les premières récoltes seront pour dans dix ans.", { item: (p, x) => ({ kind: "entreprise", name: "Truffière du Périgord", value: Math.round(x.vals.mise * 0.8) }), bonheur: 1 }),
    ], { cost: (p, x) => x.vals.mise, risk: 3 }),
    D("Décliner poliment", "🙅", "Tu remercies l'ami de l'ami du cousin. Tu gardes ton argent et ta tranquillité d'esprit.", { prudent: 2 }),
  ],
});
