// Les coups du sort. Chaque année, le destin peut tirer l'une de ces scènes, quel que soit le niveau de vie.
// Elles sont rares, mais elles peuvent tout renverser (argent, couple, enfants, travail).
// Chacune demande des conditions réalistes, et les montants suivent la fortune du moment.
// Le moteur les tire lui-même (voir _rollFate dans engine.js), elles ne sortent donc pas dans le tirage normal.
const { ev, O, C, D } = require("../kit");
const CORE = require("../core");

const NW = (p) => Math.max(0, CORE.netWorth(p));
// perte d'une part de la fortune (liquide d'abord, le reste se règle en vendant des actifs ou en s'endettant)
const lose = (f, cap) => (p) => -Math.round(Math.min(cap || 1e12, NW(p) * f));
const win = (f, cap) => (p) => Math.round(Math.min(cap || 1e12, NW(p) * f));
const npcLove = (p) => !!(p.partner && p.partner.npc);
const kidsUnder = (p, a) => p.npcs.filter((n) => n.kind === "child" && n.alive && n.age < a).length;
const hasKind = (p, ks) => p.assets.some((a) => ks.includes(a.kind));
const SHOCK = { shock: true, chainOnly: true, once: false, cool: 8 };

// ---------------------------------------------------------------------------------
// ARGENT, quand on a quelque chose à perdre
// ---------------------------------------------------------------------------------
ev("choc_controle_fiscal", Object.assign({
  ages: [27, 90], tags: ["argent"], ic: "🧾😰", need: { net: [90000, null] },
  t: "Le courrier est à en-tête de l'administration. Un contrôle fiscal approfondi, sur dix ans de comptes, avec un inspecteur très poli qui ne sourit jamais.",
  c: [
    C("Tout payer sans discuter", "💸", [O(1, "Tu règles la note, avec les pénalités et un soupir qui fait trembler les vitres. La paix, ça se paie.", { argent: lose(0.12), bonheur: -4 })]),
    C("Contester avec un avocat spécialisé", "⚖️", [
      O(0.45, "Ton avocat démonte le dossier page par page. L'administration recule, et tu ne paies que les frais.", { argent: lose(0.015), bonheur: 5 }),
      O(0.55, "L'administration gagne sur presque tous les points. Avec les honoraires et les intérêts, l'addition est salée.", { argent: lose(0.2), bonheur: -6, repute: -2 }),
    ]),
    C("Déménager discrètement à l'étranger", "🛫", [
      O(0.4, "Tu disparais avec ton dossier. Une vie de plage et de procédures, assez agréable.", { argent: lose(0.08), city: true, bonheur: 2, repute: -4 }),
      O(0.6, "On te rattrape à l'aéroport, avec une amende proportionnelle à ton culot.", { argent: lose(0.28), repute: -8, bonheur: -8, record: 1 }),
    ], { need: { net: [150000, null] } }),
  ],
}, SHOCK));

ev("choc_associe_disparu", Object.assign({
  ages: [24, 75], tags: ["argent"], ic: "🏃💼", need: { net: [40000, null], fn: (p) => hasKind(p, ["entreprise", "startup"]) || (p.job && p.job.track === "libre") || NW(p) > 150000 },
  t: "Ton associé ne répond plus au téléphone. Le compte de l'entreprise est à zéro, son appartement est vide, et sa dernière publication montre une plage lointaine.",
  c: [
    C("Porter plainte et le traquer", "🕵️", [
      O(0.35, "La police le retrouve dans un bar à jus de fruits. Tu récupères une partie de l'argent, et une belle histoire à raconter.", { argent: lose(0.07), bonheur: 3 }),
      O(0.65, "Il est introuvable. La plainte est classée, et ton compte en banque ressemble à un désert.", { argent: lose(0.3), bonheur: -8, repute: -2 }),
    ]),
    D("Encaisser et repartir de zéro", "🧱", "Tu absorbes le choc. C'est dur, mais tu reconstruis, plus méfiant et plus solide.", { argent: lose(0.25), prudent: 5, bonheur: -5 }),
    C("Payer un détective très cher", "🕶️", [
      O(0.5, "Le détective le retrouve et récupère presque tout, en prélevant sa commission.", { argent: lose(0.1), bonheur: 4 }),
      O(0.5, "Le détective t'envoie des factures et des photos de cocotiers. L'associé est toujours introuvable.", { argent: lose(0.34), bonheur: -9 }),
    ], { need: { net: [100000, null] } }),
  ],
}, SHOCK));

ev("choc_krach", Object.assign({
  ages: [22, 95], tags: ["argent"], ic: "📉💥", need: { net: [30000, null], fn: (p) => hasKind(p, ["actions", "etf", "crypto", "matieres", "levier", "startup"]) },
  t: "Les marchés s'effondrent un lundi matin. Les écrans sont rouges, les journalistes ont des voix funèbres, et ton portefeuille a des allures de gruyère.",
  c: [
    C("Tout vendre tout de suite", "🏃", [
      O(1, "Tu vends dans la panique, à un prix de braderie. Une semaine plus tard, ça remonte un peu. Tu regardes le plafond.", { scaleAssets: { mul: 0.8 }, bonheur: -6 }),
    ]),
    C("Tenir bon et ne rien faire", "🧘", [
      O(0.5, "Tu serres les dents. La tempête passe, tes placements reprennent presque tout. Tu as vieilli de trois ans.", { scaleAssets: { mul: 0.82 }, bonheur: -2, prudent: 2 }),
      O(0.5, "La chute continue pendant des mois. Tu regardes ta fortune fondre comme une glace au soleil.", { scaleAssets: { mul: 0.45 }, bonheur: -9 }),
    ]),
    C("Racheter à bas prix, quitte ou double", "🎰", [
      O(0.4, "Tu as du flair. Quand le marché repart, tes parts valent bien plus qu'avant.", { scaleAssets: { mul: 1.45 }, bonheur: 8, courage: 2 }),
      O(0.6, "Tu rachètes trop tôt. Le marché plonge encore, et tu y laisses beaucoup de plumes.", { scaleAssets: { mul: 0.4 }, bonheur: -8 }),
    ], { need: { net: [60000, null] } }),
  ],
}, SHOCK));

ev("choc_arnaque_romantique", Object.assign({
  ages: [24, 85], tags: ["argent", "amour"], ic: "💔💶", need: { net: [12000, null], single: true },
  who: { fiancee: "crush" },
  t: "Tu as rencontré $fiancee en ligne. Voix douce, photos magnifiques, mille projets de rencontre. Mais un petit souci de bateau, de douane et de virement urgent vient de surgir.",
  c: [
    C("Envoyer l'argent pour l'aider", "💶", [
      O(0.85, "Le virement part. $fiancee disparaît le lendemain, avec ton argent et ta confiance. Le bateau n'a jamais existé.", { argent: lose(0.22, 300000), bonheur: -12, repute: -2, honnete: 0, rel: { fiancee: -30 } }),
      O(0.15, "Étonnamment, la personne est réelle. Vous vous rencontrez enfin, et tu ne regrettes pas ton geste.", { argent: lose(0.03, 5000), bonheur: 6, becomes: { fiancee: "partner" } }),
    ]),
    D("Demander une visioconférence", "📹", "$fiancee se fâche, puis disparaît. Tu viens d'éviter une grosse erreur, avec une pointe de tristesse.", { prudent: 3, bonheur: -2, rel: { fiancee: -20 } }),
    D("Signaler le profil à la police", "🚓", "Tu transmets tout. On te remercie, on te félicite pour ton flair, et le faux profil est fermé.", { honnete: 2, prudent: 2, bonheur: 1 }),
  ],
}, SHOCK));

ev("choc_proces", Object.assign({
  ages: [28, 90], tags: ["argent"], ic: "⚖️📜", need: { net: [60000, null] },
  t: "Un huissier sonne chez toi. Une ancienne connaissance t'attaque en justice pour un contrat oublié depuis longtemps. Il réclame une somme qui donne le tournis.",
  c: [
    C("Se battre jusqu'au bout", "🛡️", [
      O(0.5, "Le juge te donne raison. Tu y laisses des honoraires, mais l'honneur est sauf.", { argent: lose(0.02), bonheur: 4, repute: 2 }),
      O(0.5, "Le juge tranche contre toi. L'addition est lourde, et ton avocat ne cache pas sa gêne.", { argent: lose(0.18), bonheur: -7 }),
    ]),
    D("Transiger et payer pour avoir la paix", "🤝", "Tu règles une partie de la somme pour éviter le procès. C'est cher, mais tu dors mieux.", { argent: lose(0.08), bonheur: -3 }),
  ],
}, SHOCK));

ev("choc_cambriolage", Object.assign({
  ages: [20, 95], tags: ["argent"], ic: "🚪🦹", need: { net: [40000, null] },
  t: "Tu rentres chez toi. La porte est entrouverte, les tiroirs sont par terre, et le salon a l'air d'avoir accueilli une tornade polie.",
  c: [
    C("Déclarer le vol à l'assurance", "📋", [
      O(0.55, "L'assurance paie, sans enthousiasme. Tu ne retrouveras pas tout, mais l'essentiel est couvert.", { argent: lose(0.01), bonheur: -4 }),
      O(0.45, "L'assurance trouve une clause cachée dans un coin du contrat. Elle refuse de payer presque tout.", { argent: lose(0.07), bonheur: -7 }),
    ]),
    D("Tout racheter toi-même", "🛍️", "Tu remplaces tout, avec le sentiment étrange d'avoir été cambriolé deux fois.", { argent: lose(0.05), bonheur: -4, prudent: 2 }),
  ],
}, SHOCK));

ev("choc_incendie", Object.assign({
  ages: [22, 95], tags: ["argent"], ic: "🔥🏠", need: { fn: (p) => p.home === "own" || hasKind(p, ["immo"]) },
  t: "Un court-circuit, un rideau, et un voisin qui crie. Les pompiers arrivent vite, mais ta maison porte les stigmates d'une nuit très chaude.",
  c: [
    C("Compter sur l'assurance", "🧯", [
      O(0.6, "L'assurance couvre la majeure partie des travaux. Tu dors chez des amis le temps du chantier.", { scaleAssets: { kind: "immo", mul: 0.92 }, argent: lose(0.01), bonheur: -6 }),
      O(0.4, "L'assurance chipote sur chaque ligne. Tu paies une grande partie des travaux.", { scaleAssets: { kind: "immo", mul: 0.7 }, argent: lose(0.06), bonheur: -9 }),
    ]),
    D("Tout vendre en l'état et partir", "🧳", "Tu cèdes le bien à un promoteur, pour moins cher que sa valeur. Une page se tourne.", { sell: "immo", home: "rent", argent: -2000, bonheur: -5, city: true }),
  ],
}, SHOCK));

ev("choc_ponzi", Object.assign({
  ages: [25, 80], tags: ["argent"], ic: "📈🦈", need: { net: [20000, null] }, who: { copain: "friend" },
  t: "$copain a trouvé le plan du siècle. Un placement qui rapporte quarante pour cent par an, garanti, sans risque, avec une seule condition, en parler à tout le monde.",
  c: [
    C("Y mettre une grosse partie de ton argent", "💰", [
      O(0.3, "Le plan paie vraiment. Tu retires ton gain à temps et tu remercies $copain, un peu gêné de ton succès.", { argent: win(0.25, 200000), bonheur: 6 }),
      O(0.7, "Le plan s'effondre en trois mois. Tu perds presque tout ce que tu avais mis, et $copain n'ose plus te parler.", { argent: lose(0.3), bonheur: -11, repute: -3, rel: { copain: -25 } }),
    ]),
    C("Y mettre un petit peu, pour voir", "🪙", [
      O(0.65, "Tu perds ta petite mise. Ça te coûte un peu, et tu gagnes une bonne histoire pour les dîners.", { argent: lose(0.03, 8000), bonheur: -2, rel: { copain: -6 } }),
      O(0.35, "Tu empoches un petit gain avant la chute. Tu quittes le navire avec un sourire en coin.", { argent: win(0.04, 15000), bonheur: 3 }),
    ]),
    D("Refuser et prévenir les autres", "🚫", "Tu refuses et tu alertes ton entourage. Deux mois plus tard, tout s'effondre. On te remercie, parfois avec un vrai dîner.", { prudent: 4, honnete: 2, rel: { copain: -4 }, bonheur: 2 }),
  ],
}, SHOCK));

ev("choc_heritier_cache", Object.assign({
  ages: [35, 95], tags: ["argent", "famille"], ic: "👤📜", need: { net: [250000, null] },
  t: "Une personne que tu ne connais pas se présente avec un test de paternité, une photo d'enfance et un avocat. Elle affirme être un enfant caché de ton parent, et réclame sa part.",
  c: [
    C("Partager sans discuter", "🤲", [O(1, "Tu acceptes de partager. Ce n'est pas facile, mais la famille s'agrandit, avec des déjeuners très étranges.", { argent: lose(0.12), bonheur: 2, bonte: 4 })]),
    C("Contester devant un juge", "⚖️", [
      O(0.45, "Le test est invalidé. L'affaire est classée, et l'inconnu repart en claquant la porte.", { argent: lose(0.02), bonheur: 2, repute: -1 }),
      O(0.55, "Le juge reconnaît la filiation. Tu paies la part, plus les frais, plus quelques regards noirs.", { argent: lose(0.22), bonheur: -6 }),
    ]),
  ],
}, SHOCK));

ev("choc_addiction_paris", Object.assign({
  ages: [22, 80], tags: ["argent", "mature"], ic: "🎰😵", need: { net: [15000, null] },
  t: "Ça a commencé par un petit pari pour le plaisir. Aujourd'hui, ton téléphone vibre dès que tu t'ennuies, et tu rejoues toujours « une dernière fois ».",
  c: [
    C("Se faire aider, couper les ponts avec les paris", "🧠", [
      O(0.7, "Une longue année de discipline, de groupes de parole et de patience. Tu es sorti d'affaire.", { argent: lose(0.04), bonheur: 3, prudent: 4, honnete: 3 }),
      O(0.3, "Tu rechutes un peu en route, mais tu finis par tenir bon, en perdant quelques plumes.", { argent: lose(0.1), bonheur: -2, prudent: 3 }),
    ]),
    C("Continuer, un dernier gros coup pour se refaire", "🎲", [
      O(0.15, "Le gros coup arrive enfin. Tu gagnes beaucoup, et tu jures que c'est la dernière fois.", { argent: win(0.3, 400000), bonheur: 4 }),
      O(0.85, "Ça ne marche pas, ça ne marche jamais. Tu perds une grande partie de ta fortune en quelques semaines.", { argent: lose(0.38), bonheur: -12, repute: -3 }),
    ]),
  ],
}, SHOCK));

ev("choc_rug_pull", Object.assign({
  ages: [20, 70], tags: ["argent"], ic: "🪙🧹", need: { fn: (p) => hasKind(p, ["crypto"]) },
  t: "Le site de ta cryptomonnaie préférée affiche une page blanche. Le compte de l'équipe est vide, le fondateur a quitté tous les groupes de discussion et ton application ne reconnaît plus rien.",
  c: [
    D("Constater les dégâts et se jurer de ne plus recommencer", "🪦", "Tout est parti en fumée. Tu en parleras dans dix ans avec un rire jaune.", { scaleAssets: { kind: "crypto", mul: 0.03 }, bonheur: -8, prudent: 3 }),
    C("Tenter de se racheter une revanche immédiate", "🎢", [
      O(0.25, "Une autre pièce explose, et tu récupères une belle partie de ta perte.", { argent: win(0.08, 80000), bonheur: 6 }),
      O(0.75, "Tu perds encore un peu plus. La spirale est cruelle.", { scaleAssets: { kind: "crypto", mul: 0.03 }, argent: lose(0.05), bonheur: -10 }),
    ]),
  ],
}, SHOCK));

ev("choc_faillite_boite", Object.assign({
  ages: [23, 62], tags: ["travail"], ic: "🏢🧯", need: { job: true, nojob: false },
  t: "L'ambiance est étrange depuis des semaines. Un matin, un huissier colle un avis à la porte. Ton entreprise dépose le bilan, et tout le monde repart avec un carton.",
  c: [
    D("Repartir tout de suite en recherche d'emploi", "🔎", "Tu mets à jour ton CV avant même d'avoir quitté le parking. Ça va aller.", { fire: true, jobHunt: true, bonheur: -5, ambition: 2 }),
    D("Prendre quelques mois pour souffler", "🌴", "Tu t'offres un vrai break, avec une grasse matinée à chaque fois. Les offres attendront un peu.", { fire: true, jobHunt: true, bonheur: 3, argent: -1500 }),
    C("Se lancer à son compte avec ses indemnités", "🚀", [
      O(0.45, "Ton petit projet décolle plus vite que prévu. Tu ne regretteras jamais cette porte fermée.", { fire: true, job: { track: "libre", level: 0 }, bonheur: 6, courage: 3 }),
      O(0.55, "Les débuts sont difficiles, et les clients se font désirer. Mais tu tiens bon.", { fire: true, job: { track: "libre", level: 0 }, bonheur: -3, courage: 3 }),
    ]),
  ],
}, SHOCK));

ev("choc_burnout", Object.assign({
  ages: [27, 60], tags: ["sante", "travail"], ic: "🔋😵‍💫", need: { job: { min: 1 } },
  t: "Un matin, tu n'arrives pas à te lever. Les mails te donnent le vertige, ton corps refuse d'avancer. Ton médecin hoche la tête et prononce un mot que tu redoutais, épuisement.",
  c: [
    C("Prendre un long congé et se soigner", "🛌", [
      O(0.7, "Quelques mois pour souffler, un ajustement de tes journées, et tu reprends goût aux choses simples. Le poste t'attend, un peu changé.", { sante: 6, bonheur: 4, argent: -2500, prudent: 3 }),
      O(0.3, "La reprise est trop tôt, et ta santé en garde un souvenir. Tu pars pour un nouveau poste, plus léger.", { sante: 2, bonheur: 2, quit: true, jobHunt: true, argent: -2500 }),
    ]),
    D("Démissionner et tout recommencer ailleurs", "🚪", "Tu quittes tout. Ça fait peur, et ça fait du bien.", { quit: true, jobHunt: true, bonheur: 3, courage: 3, sante: 3 }),
    C("Serrer les dents et continuer", "💪", [
      O(0.4, "Tu tiens encore un an, au prix de ta santé. Le corps finira par présenter la facture.", { sante: -8, bonheur: -6, perf: 5 }),
      O(0.6, "Tu t'effondres au milieu d'une réunion. La direction finit par te laisser partir, avec un chèque et un air gêné.", { sante: -10, bonheur: -8, fire: true, jobHunt: true, argent: 4000 }),
    ]),
  ],
}, SHOCK));

ev("choc_scandale_presse", Object.assign({
  ages: [28, 85], tags: ["social", "argent"], ic: "📰💣", need: { net: [150000, null] },
  t: "Un journal publie une enquête sur toi. Photos volées, ragots, vieux messages, et un titre en lettres rouges. La moitié du pays croit déjà tout savoir.",
  c: [
    C("Attaquer le journal en diffamation", "⚖️", [
      O(0.4, "Tu gagnes, et le journal publie des excuses en première page. Les frais restent salés.", { argent: lose(0.02), repute: 4, bonheur: 2 }),
      O(0.6, "Tu perds. Le journal publie le jugement, avec des commentaires savoureux.", { argent: lose(0.07), repute: -6, bonheur: -6 }),
    ]),
    D("Faire un grand mea culpa en direct", "🎙️", "Ton passage télé est gênant, mais sincère. L'opinion finit par t'accorder une seconde chance.", { repute: -3, bonheur: -2, honnete: 3 }),
    D("Disparaître quelques mois dans le Sud", "🏝️", "Tu te mets au vert. Les gens finissent par oublier, à la faveur d'un nouveau scandale.", { argent: lose(0.01), repute: -4, bonheur: 1, city: true }),
  ],
}, SHOCK));

// ---------------------------------------------------------------------------------
// COUPLE ET FAMILLE
// ---------------------------------------------------------------------------------
ev("choc_conjoint_infidele", Object.assign({
  ages: [27, 70], tags: ["amour", "mature"], ic: "💔🤥", need: { fn: npcLove }, who: { conjoint: "partner" },
  t: "Un message lu par hasard, un reçu d'hôtel, une excuse bancale. Tu n'es plus très sûr de $conjoint. Tout s'éclaire quand tu les vois ensemble, avec quelqu'un d'autre, à la terrasse d'un café.",
  c: [
    C("Confronter $conjoint et pardonner", "🕊️", [
      O(0.55, "Les larmes, les excuses, les promesses. Vous mettez des mois à reconstruire, mais le couple tient.", { rel: { conjoint: -10 }, bonheur: -3, bonte: 3 }),
      O(0.45, "Vous essayez, mais la confiance ne revient pas. Quelques mois plus tard, tu fais tes cartons.", { drop: "conjoint", bonheur: -9 }),
    ]),
    C("Partir sur-le-champ", "🚪", [O(1, "Tu fais tes valises le soir même. C'est brutal, c'est net, et tu dors mal, mais debout.", { drop: "conjoint", bonheur: -7, courage: 3, argent: lose(0.05) })]),
    C("Rendre la pareille", "😈", [
      O(0.5, "Tu te venges discrètement. Le secret reste secret, mais il pèse.", { honnete: -5, bonheur: 1, flag: "secret_infidele", rel: { conjoint: -8 } }),
      O(0.5, "Tout éclate au grand jour. $conjoint part, avec les amis, les meubles et la moitié de ton compte.", { honnete: -5, drop: "conjoint", bonheur: -10, repute: -4, argent: lose(0.1) }),
    ]),
    C("Faire semblant de ne rien voir", "🙈", [
      O(0.6, "Tu fermes les yeux, et la vie continue, un peu moins joyeuse qu'avant.", { bonheur: -5, honnete: -2 }),
      O(0.4, "Le silence te ronge. Tu finis par exploser au pire moment, devant la famille.", { bonheur: -8, repute: -3, rel: { conjoint: -15 } }),
    ]),
  ],
}, SHOCK));

ev("choc_secret_decouvert", Object.assign({
  ages: [27, 70], tags: ["amour", "mature"], ic: "🤫💥", need: { fn: (p) => npcLove(p) && p.flags.secret_infidele }, who: { conjoint: "partner" },
  t: "Un vieux message ressurgit, une amie qui bavarde, un reçu qui tombe d'une poche. $conjoint sait tout, et le regarde en silence depuis dix minutes.",
  c: [
    C("Tout avouer, sans excuses", "🗣️", [
      O(0.5, "L'orage passe, les cris aussi. Vous décidez de continuer, avec plus de lucidité.", { unflag: "secret_infidele", rel: { conjoint: -12 }, bonheur: -4, honnete: 4 }),
      O(0.5, "Tu perds ton foyer en une soirée. $conjoint part, et reprend un peu plus que ses affaires.", { unflag: "secret_infidele", drop: "conjoint", bonheur: -9, argent: lose(0.08) }),
    ]),
    C("Nier jusqu'au bout", "🙅", [
      O(0.35, "Ton aplomb sauve la situation. Tu gardes ta vie, et un nœud dans l'estomac.", { unflag: "secret_infidele", honnete: -4, bonheur: -3 }),
      O(0.65, "Personne n'y croit. $conjoint part, et les amis commencent à prendre parti.", { unflag: "secret_infidele", honnete: -4, drop: "conjoint", bonheur: -10, repute: -4 }),
    ]),
  ],
}, SHOCK));

ev("choc_tentation", Object.assign({
  ages: [26, 60], tags: ["amour", "mature"], ic: "🍷😏", need: { fn: npcLove }, who: { conjoint: "partner", collegue: "colleague" },
  t: "Un dîner de travail qui s'éternise, un verre de trop et $collegue qui te regarde un peu trop longtemps. Rien n'est joué, mais tout est possible.",
  c: [
    C("Céder à la tentation", "😈", [
      O(0.5, "L'aventure reste secrète, pour l'instant. Tu rentres chez toi avec le sourire et un poids sur la conscience.", { honnete: -5, bonheur: 4, flag: "secret_infidele" }),
      O(0.5, "Tout se sait avant le petit déjeuner. $conjoint te lance un regard glacé, puis les affaires du placard.", { honnete: -5, drop: "conjoint", bonheur: -9, repute: -4 }),
    ]),
    D("Rentrer sagement", "🛡️", "Tu rentres chez toi, un peu dépité, très fidèle. $conjoint ne saura jamais combien ce taxi t'a coûté.", { honnete: 3, rel: { conjoint: 4 }, bonheur: 1 }),
    D("En parler à $conjoint le soir même", "🗣️", "Une conversation un peu bizarre, puis un fou rire. Le couple en sort plus solide.", { honnete: 4, rel: { conjoint: 7 }, bonheur: 3 }),
  ],
}, SHOCK));

ev("choc_enfant_maladie", Object.assign({
  ages: [25, 62], tags: ["famille", "mature"], ic: "🏥💔", need: { fn: (p) => kidsUnder(p, 22) > 0 }, who: { enfant: "child" },
  t: "Les examens reviennent, et le médecin prend un air grave. $enfant est atteint{$enfant:|e} d'une maladie sérieuse. Tout ce que tu pensais important devient d'un seul coup très petit.",
  c: [
    C("Tout tenter, les meilleurs spécialistes du monde", "🌍", [
      O(0.78, "Après de longs mois d'hôpital, $enfant s'en sort. Tu as vidé ton compte, mais tu as retrouvé ton enfant.", { argent: lose(0.4, 400000), bonheur: -2, rel: { enfant: 10 } }),
      O(0.22, "Malgré tous les efforts, $enfant ne s'en sort pas. Rien ne comble ce vide, aucun mot ne suffit.", { argent: lose(0.3, 300000), bonheur: -35, kill: "enfant", flag: "deuil_enfant" }),
    ], { cost: 1500 }),
    C("Rester jour et nuit à ses côtés, suivre le traitement du service public", "🤍", [
      O(0.62, "Les soignants font un travail extraordinaire. $enfant guérit, après une année qui t'a laissé exsangue.", { bonheur: -3, rel: { enfant: 12 }, sante: -3 }),
      O(0.38, "La maladie est la plus forte. $enfant s'éteint, entouré{$enfant:|e} de tout ton amour. Tu ne seras plus jamais le même.", { bonheur: -35, kill: "enfant", flag: "deuil_enfant", sante: -5 }),
    ]),
  ],
}, SHOCK));

ev("choc_deuil_conjoint", Object.assign({
  ages: [32, 88], tags: ["famille", "mature"], ic: "🕯️🌧️", need: { fn: npcLove }, who: { conjoint: "partner" },
  t: "Un coup de téléphone, un hôpital, un couloir trop long. $conjoint est parti{$conjoint:|e} trop vite, sans prévenir, laissant tout en plan, y compris les clés dans l'entrée.",
  c: [
    C("S'effondrer et se laisser porter par les proches", "🫂", [O(1, "Tu es entouré. Les amis cuisinent, la famille appelle, et peu à peu tu retrouves la force d'avancer.", { kill: "conjoint", bonheur: -28, sante: -3, flag: "veuvage" })]),
    C("Se jeter dans le travail ou les voyages", "🏃", [O(1, "Tu fuis ta peine par l'action. Ça marche un temps, puis elle te rattrape un soir de pluie.", { kill: "conjoint", bonheur: -24, flag: "veuvage", sante: -4, courage: 2 })]),
  ],
}, SHOCK));

ev("choc_ami_trahit", Object.assign({
  ages: [18, 80], tags: ["amis", "argent"], ic: "🗡️🤝", need: { net: [8000, null] }, who: { copain: "bestfriend" },
  t: "Tu découvres que $copain, ton meilleur ami, a parlé de tes secrets à ton pire ennemi, et qu'il a emprunté une grosse somme en ton nom, en utilisant ta signature.",
  c: [
    C("Le confronter, face à face", "🔥", [
      O(0.5, "$copain pleure, rembourse une partie, et supplie de ne pas tout casser. Le lien ne sera plus jamais le même.", { argent: lose(0.04, 30000), rel: { copain: -30 }, bonheur: -6 }),
      O(0.5, "$copain nie, puis disparaît de ta vie. Tu paies seul, avec un goût de cendre dans la bouche.", { argent: lose(0.1, 60000), rel: { copain: -60 }, bonheur: -9 }),
    ]),
    D("Pardonner et tout oublier", "🤲", "Tu avales ta rancœur. $copain te remercie, les larmes aux yeux. La question de la confiance reste ouverte.", { argent: lose(0.08, 50000), rel: { copain: 8 }, bonte: 4, bonheur: -3 }),
    D("Porter plainte", "🚔", "Tu transformes ton ami en dossier. Justice se fait, lentement, et ça ne soulage pas autant que prévu.", { argent: lose(0.03, 20000), rel: { copain: -80 }, bonheur: -5, honnete: 2 }),
  ],
}, SHOCK));

// ---------------------------------------------------------------------------------
// LES BONNES SURPRISES, parce que le hasard ne frappe pas que dans un sens
// ---------------------------------------------------------------------------------
ev("choc_loterie", Object.assign({
  ages: [20, 90], tags: ["chance", "argent"], ic: "🎟️🍀", need: { net: [null, 60000] },
  t: "Tu as acheté un ticket par habitude, sans y penser. Un soir, en vérifiant les numéros, tu relis trois fois le ticket, puis tu t'assois.",
  c: [
    C("Tout dépenser tout de suite", "🛍️", [
      O(1, "Tu t'offres tout ce dont tu rêvais. En quelques mois, il ne reste que les souvenirs et deux manteaux ridicules.", { argent: 24000, bonheur: 10, item: { kind: "loufoque", name: "Manteau de lotto", value: 800 } }),
    ]),
    D("Placer une grande partie", "📈", "Tu fais preuve d'une sagesse rare. La somme dort bien, et toi aussi.", { argent: 24000, prudent: 3, bonheur: 5 }),
    D("Garder le secret et ne rien changer", "🤫", "Tu ne dis rien. Ta vie continue, avec un petit matelas bien caché.", { argent: 24000, bonheur: 4, prudent: 2 }),
  ],
}, SHOCK));

ev("choc_heritage_surprise", Object.assign({
  ages: [24, 80], tags: ["argent", "famille"], ic: "📜🎁", need: { net: [null, 80000] },
  t: "Une lettre d'un notaire. Un grand-oncle dont tu as à peine souvenir t'a couché sur son testament. Il vivait seul, sans enfant, avec un perroquet et une vieille maison.",
  c: [
    C("Vendre la maison et empocher", "🏡", [O(1, "La vente va vite. Tu hérites d'une somme qui change ton année, et tu gardes le perroquet.", { argent: 38000, bonheur: 7, pet: true })]),
    C("Garder la maison et s'y installer", "🔑", [O(1, "Tu t'installes dans la maison. Elle craque, elle sent le vieux bois, et tu l'adores déjà.", { item: { kind: "immo", name: "Maison du grand-oncle", value: 110000, rent: 0 }, home: "own", bonheur: 8, argent: -4000 })]),
  ],
}, SHOCK));

ev("choc_idee_virale", Object.assign({
  ages: [16, 55], tags: ["chance", "argent"], ic: "🚀📱", need: { net: [null, 150000] },
  t: "Une vidéo que tu as faite pour rire dépasse les dix millions de vues. Les messages affluent, les marques t'écrivent, et ton téléphone chauffe en permanence.",
  c: [
    C("Signer avec la plus grosse agence", "🖋️", [
      O(0.6, "Les contrats arrivent, les projets aussi. Tu deviens une petite célébrité du web, et ton compte en banque s'en souvient.", { argent: 30000, repute: 8, bonheur: 6, badge: "star_du_web" }),
      O(0.4, "L'agence te presse comme un citron. Tu gagnes de l'argent, mais tu perds tout contrôle sur ton image.", { argent: 12000, repute: 3, bonheur: -4 }),
    ]),
    D("Capitaliser seul sur la vague", "🌊", "Tu gères tout toi-même, avec des nuits blanches et un joli pactole à la clé.", { argent: 16000, repute: 5, bonheur: 4, courage: 3 }),
    D("Laisser passer, tu n'as pas envie de ça", "🧘", "Tu gardes ta vie telle qu'elle est. Le buzz finit par s'éteindre, et tu dors tranquille.", { bonheur: 3, prudent: 2 }),
  ],
}, SHOCK));

// ---------------------------------------------------------------------------------
// LES MAUVAISES SURPRISES DE TOUT LE MONDE, avec des montants absolus
// ---------------------------------------------------------------------------------
const hit = (a, b) => (p, x, g) => -Math.round((a + g.rng() * (b - a)) / 100) * 100;

ev("choc_voiture_panne", Object.assign({
  ages: [19, 80], tags: ["argent"], ic: "🚗🔧", w: 6, need: { job: true },
  t: "Ta voiture rend l'âme sur l'autoroute, dans un nuage de fumée et un bruit de casseroles. Le garagiste examine le moteur, mâchonne son stylo et annonce un chiffre qui fait mal.",
  c: [
    C("Tout faire réparer", "🔧", [O(1, "La voiture repart comme neuve, ton compte en banque un peu moins.", { argent: hit(2500, 6500), bonheur: -2 })]),
    D("La revendre pour pas grand-chose et prendre les transports", "🚇", "Tu t'habitues aux horaires de bus. Ça te coûte peu, et ton mauvais caractère aussi.", { argent: 600, bonheur: -3, sport: 1 }),
    C("Emprunter pour acheter mieux", "💳", [O(1, "Tu repars avec un joli modèle et un crédit qui va te suivre pendant des années.", { dette: 9000, bonheur: 3, item: { kind: "voiture", name: "Voiture à crédit", value: 8500 } })]),
  ],
}, SHOCK));

ev("choc_frais_medicaux", Object.assign({
  ages: [20, 85], tags: ["sante", "argent"], ic: "🏥💶", w: 5,
  t: "Une mauvaise chute, une opération non remboursée, et un hôpital qui t'explique avec un grand sourire ce que couvre ta mutuelle. Soit presque rien.",
  c: [
    C("Tout payer d'un coup", "💸", [O(1, "Tu règles la facture, avec un soupir qui secoue le plafond. Tu es debout, et plus léger côté portefeuille.", { argent: hit(3000, 14000), sante: 2, bonheur: -3 })]),
    C("Étaler les paiements avec un crédit", "📆", [O(1, "L'hôpital accepte un échéancier. Les mensualités se glissent dans ton quotidien comme des invités qui ne partent pas.", { dette: 8000, sante: 2, bonheur: -2 })]),
    D("Demander de l'aide à la famille", "🫂", "Tes proches se serrent les coudes. L'ambiance est un peu lourde, mais ils sont là.", { argent: hit(300, 1500), rel: { mere: 3 }, bonheur: -1 }),
  ],
}, SHOCK));

ev("choc_credit_conso", Object.assign({
  ages: [20, 70], tags: ["argent"], ic: "💳🌀", w: 5,
  t: "Une petite facilité de paiement, une autre, un renouvellement, et un jour tu ouvres ton relevé. La somme des mensualités ressemble à une suite de numéros de loterie.",
  c: [
    D("Se serrer la ceinture et rembourser", "✂️", "Tu rembourses en mangeant des pâtes pendant des mois. Ça passe, avec de la discipline.", { argent: hit(2500, 8000), prudent: 4, bonheur: -4 }),
    C("Demander un rachat de crédit", "🏦", [
      O(0.6, "La banque accepte. Les mensualités baissent, mais la durée s'étire à l'infini.", { dette: 4000, bonheur: -1 }),
      O(0.4, "La banque refuse poliment. Tu te retrouves avec une jolie dette de plus.", { dette: 9000, bonheur: -6 }),
    ]),
    D("Faire l'autruche", "🐦", "Tu ne regardes plus ton courrier. Les intérêts, eux, regardent très bien.", { dette: 7000, bonheur: -3 }),
  ],
}, SHOCK));

ev("choc_licenciement_sec", Object.assign({
  ages: [23, 62], tags: ["travail"], ic: "📦😶", w: 6, need: { job: true },
  t: "Ton patron te convoque dans son bureau. Il y a un directeur des ressources humaines, un café déjà froid et une enveloppe. Ton poste est supprimé, avec effet immédiat.",
  c: [
    D("Accepter la rupture et chercher ailleurs", "📝", "Tu signes, tu rends ton badge et tu repars avec un petit chèque. La page se tourne.", { fire: true, jobHunt: true, argent: 2500, bonheur: -6 }),
    C("Contester devant les prud'hommes", "⚖️", [
      O(0.45, "La justice te donne raison. Tu touches une belle indemnité et tu quittes ton ancien patron avec un sourire mauvais.", { fire: true, jobHunt: true, argent: 9000, bonheur: 2 }),
      O(0.55, "La procédure s'éternise et tu en sors avec un petit chèque et un grand soupir.", { fire: true, jobHunt: true, argent: 1000, bonheur: -5 }),
    ]),
    D("En profiter pour changer complètement de vie", "🌈", "Tu transformes ce coup dur en occasion. Tu choisis une voie très différente.", { fire: true, jobHunt: true, argent: 2500, courage: 3, bonheur: 1 }),
  ],
}, SHOCK));

ev("choc_caution_ami", Object.assign({
  ages: [22, 70], tags: ["argent", "amis"], ic: "✍️😬", w: 5, who: { copain: "friend" },
  t: "Il y a quelques années, tu t'es porté caution pour le prêt de $copain. Ce matin, la banque t'appelle. Il ne paie plus, et c'est maintenant ton problème.",
  c: [
    C("Régler la dette pour éviter les poursuites", "🏦", [O(1, "Tu règles à sa place. $copain t'invite à dîner pour te remercier, et il laisse l'addition en suspens.", { argent: hit(5000, 22000), rel: { copain: -10 }, bonheur: -5 })]),
    C("Aller voir $copain pour qu'il trouve une solution", "🗣️", [
      O(0.5, "$copain se met à vendre tout ce qu'il a. La dette est partagée, et la rancune aussi.", { argent: hit(1500, 6000), rel: { copain: -12 }, bonheur: -3 }),
      O(0.5, "$copain a disparu de la ville. Tu paies le tout, la mâchoire serrée.", { argent: hit(5000, 22000), rel: { copain: -50 }, bonheur: -8 }),
    ]),
  ],
}, SHOCK));

ev("choc_expulsion", Object.assign({
  ages: [19, 75], tags: ["logement", "argent"], ic: "🏠🧳", w: 5, need: { net: [null, 4000], home: "rent" },
  t: "Les loyers impayés s'accumulent et le propriétaire ne plaisante plus. Une lettre recommandée annonce une procédure d'expulsion, sans fioritures.",
  c: [
    C("Demander de l'aide à ses proches", "🫂", [
      O(0.6, "Une tante te prête de quoi tenir, avec un sermon gratuit. Tu restes dans les murs.", { argent: 2500, bonheur: -3, rel: { mere: -2 } }),
      O(0.4, "Personne ne peut t'aider. Tu dors sur le canapé de quelqu'un d'autre, le temps de rebondir.", { home: "parents", bonheur: -6 }),
    ]),
    D("Négocier un étalement avec le propriétaire", "📞", "Le propriétaire se laisse convaincre, de justesse. Il faudra tenir les délais.", { dette: 3000, bonheur: -3, prudent: 2 }),
    D("Partir avant qu'on te mette dehors", "🚶", "Tu pars la tête haute, avec un sac et un peu de fierté. La vie est rude, mais elle est à toi.", { home: "street", bonheur: -8, courage: 3 }),
  ],
}, SHOCK));

// Le secret d'une infidélité finit par se savoir, même sans coup du sort, d'où ce tirage naturel
kitById("choc_secret_decouvert").chainOnly = false;
kitById("choc_secret_decouvert").w = 8;
function kitById(id) { return require("../kit").byId[id]; }
