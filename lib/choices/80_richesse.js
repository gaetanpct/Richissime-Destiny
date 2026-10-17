// Des choix qui collent au niveau de fortune, aux dettes et à ce qui s'est passé dans les années précédentes.
// Un grand patrimoine ouvre des projets démesurés, un compte vide impose d'autres préoccupations,
// et les coups durs d'hier (ruine, deuil, chute) laissent des suites cohérentes.
const { reg, out, tier, net } = require("../lifekit");
const C = require("../core");

const adult = { ages: [20, 85], nostudy: true, noprison: true, school: false };
const ambitious = (p) => (p.traits.ambition >= 55 ? 1.4 : 0.9);
const bold = (p) => (p.traits.courage >= 55 ? 1.3 : 0.9);
const crooked = (p) => (p.traits.honnete < 45 ? 1.8 : p.traits.honnete < 65 ? 1 : 0.35);
const pct = (f, cap) => (p) => Math.round(Math.min(cap || 1e12, Math.max(0, net(p)) * f));
const yearsSince = (p, age) => (age === null || age === undefined ? 999 : p.age - age);

// ---------------------------------------------------------------------------------
// GRANDES FORTUNES
// ---------------------------------------------------------------------------------
reg({ id: "creer_empire", grp: "argent", l: "Lancer une entreprise démesurée", ic: "🏗️", d: "Avec ta fortune, tu peux voir très grand. Le secteur dépend de ton profil, et la mise de départ est à la hauteur de tes moyens.",
  need: Object.assign({ money: [250000, null], net: [700000, null], ages: [25, 78] }, { nostudy: true, noprison: true, school: false }), scene: "sys:startup", w: 9, cool: 3, fit: (p) => (tier(p) >= 4 ? 1.8 * ambitious(p) : 0) });

reg({ id: "poste_prestige", grp: "emploi", l: "Accepter un poste de prestige", ic: "🎩", d: "Ton nom ouvre des portes. On te propose des postes très haut placés, payés à la hauteur de ton statut.",
  need: Object.assign({ nojob: true, retired: false, ages: [25, 78], net: [700000, null] }, { noprison: true, nostudy: true }), scene: { id: "sys:jobhunt", vals: { reseau: true } }, w: 11, cool: 2, fit: (p) => (tier(p) >= 4 ? 1.8 : 0) });

reg({ id: "rachat_entreprise", grp: "argent", l: "Racheter une entreprise en difficulté", ic: "🏭", d: "Un bon coup, ou un gouffre. Les banquiers t'écoutent, ton comptable s'allume une cigarette.",
  need: Object.assign({ money: [450000, null], net: [900000, null], ages: [30, 78] }, { noprison: true, nostudy: true }), cost: 300000, cool: 4, w: 6, fit: (p) => (tier(p) >= 4 ? 1.5 * bold(p) : 0),
  outs: [
    out(0.4, "Tu redresses l'entreprise en dix-huit mois. Les employés t'adorent, les journaux parlent de toi, et la valeur grimpe en flèche.", { item: { kind: "entreprise", name: "Entreprise redressée", value: 900000 }, repute: 8, bonheur: 7, ambition: 3, pub: "🏭 $nom redresse une entreprise que tout le monde croyait perdue." }, true),
    out(0.4, "L'entreprise tient, sans éclat. Elle vit, elle paie ses salariés, et elle t'occupe l'esprit.", { item: { kind: "entreprise", name: "Entreprise rachetée", value: 330000 }, bonheur: 2 }),
    out(0.2, "Les comptes étaient truqués. L'entreprise coule en quelques mois, et ton chèque avec elle.", { bonheur: -9, repute: -4, prudent: 3 }, true),
  ] });

reg({ id: "fonds_investissement", grp: "argent", l: "Lancer un fonds d'investissement", ic: "📊", d: "Tu réunis l'argent de riches amis et tu promets monts et merveilles. L'exercice demande un peu de culot.",
  need: Object.assign({ money: [220000, null], net: [1500000, null], ages: [30, 78] }, { noprison: true, nostudy: true }), cost: 100000, cool: 5, w: 5, fit: (p) => (tier(p) >= 4 ? 1.4 * (p.stats.intel >= 55 ? 1.3 : 0.8) : 0),
  outs: [
    out(0.4, "Ton fonds tape dans le mille. Tes investisseurs te couvrent de fleurs, de caviar et de nouveaux chèques.", { argent: pct(0.15, 600000), repute: 5, bonheur: 6 }, true),
    out(0.4, "Le fonds fait un score correct. Pas de quoi faire la une, mais personne ne se plaint.", { argent: pct(0.03, 80000), bonheur: 2 }),
    out(0.2, "Une mauvaise année, des clients furieux et un article assassin. Tu rembourses de ta poche.", { argent: () => -150000, repute: -6, bonheur: -8 }, true),
  ] });

reg({ id: "reseau_clandestin", grp: "argent", l: "Prendre la tête d'un réseau clandestin", ic: "🕶️", d: "Un entrepôt, des chauffeurs discrets, des promesses chuchotées. Ça rapporte beaucoup. Ça finit parfois très mal.", tag: "mature",
  need: Object.assign({ money: [150000, null], net: [800000, null], ages: [28, 75] }, { noprison: true, nostudy: true }), cost: 80000, cool: 5, w: 6, fit: (p) => (tier(p) >= 4 ? 1.3 * crooked(p) : 0),
  outs: [
    out(0.4, "Ton réseau tourne à plein régime. Les billets arrivent dans des valises, et ton nom se murmure dans les ruelles avec respect.", { argent: pct(0.2, 900000), honnete: -8, repute: -3, bonheur: 4, flag: "parrain" }, true),
    out(0.3, "Le réseau fonctionne un peu, avec des rivaux qui grognent. Tu gagnes de quoi couvrir tes frais, et tu dors mal.", { argent: pct(0.04, 120000), honnete: -6, bonheur: -2 }),
    out(0.3, "La police fait une descente à l'aube. Tu passes plusieurs années en prison, et ton argent fond en frais d'avocat.", { prison: 5, argent: (p) => -Math.round(Math.max(0, net(p)) * 0.2), honnete: -8, repute: -12, bonheur: -10 }, true),
  ] });

reg({ id: "racheter_club", grp: "argent", l: "Racheter un club de football", ic: "⚽", d: "Un stade, des supporters passionnés et un entraîneur qui change toutes les trois semaines.",
  need: Object.assign({ money: [1500000, null], net: [3000000, null], ages: [35, 85] }, { noprison: true, nostudy: true }), cost: 1200000, cool: 12, w: 3, fit: (p) => (tier(p) >= 5 ? 1.4 : 0),
  outs: [
    out(0.25, "Ton club remporte un titre, après une finale hallucinante. Les supporters scandent ton nom sous la pluie.", { item: { kind: "entreprise", name: "Club de football", value: 1800000 }, repute: 14, bonheur: 10, pub: "⚽ $nom offre un titre à son club de cœur." }, true),
    out(0.5, "Le club se maintient, sans gloire. Tu paies des salaires de millionnaires à des joueurs qui font des passes en arrière.", { item: { kind: "entreprise", name: "Club de football", value: 900000 }, repute: 3, bonheur: 3 }),
    out(0.25, "Le club descend de deux divisions. Les supporters organisent une manifestation, devant chez toi.", { item: { kind: "entreprise", name: "Club de football", value: 250000 }, repute: -6, bonheur: -6 }, true),
  ] });

reg({ id: "election_nationale", grp: "social", l: "Te présenter à une élection nationale", ic: "🏛️", d: "Des meetings, des slogans et des poignées de main par milliers. Il faut des moyens, et des nerfs.",
  need: Object.assign({ money: [150000, null], net: [800000, null], ages: [35, 80] }, { noprison: true, nostudy: true }), cost: 120000, cool: 6, w: 4, fit: (p) => (tier(p) >= 4 && p.stats.charme >= 50 ? 1.4 : tier(p) >= 4 ? 0.7 : 0),
  outs: [
    out(0.3, "Tu es élu. Le fauteuil est confortable, les dossiers lourds, et ton nom apparaît partout.", { repute: 14, bonheur: 6, ambition: 4, pub: "🏛️ $nom est élu au niveau national." }, true),
    out(0.7, "Tu perds, avec un score honorable. Les affiches sont déjà aux oubliettes.", { repute: 2, bonheur: -3, courage: 2 }),
  ] });

reg({ id: "holding_familiale", grp: "argent", l: "Mettre ta fortune dans une holding familiale", ic: "🗂️", d: "Un notaire, une pile de documents, et la promesse d'une fiscalité moins douloureuse.",
  need: Object.assign({ net: [2000000, null], ages: [40, 95] }, { noprison: true, nostudy: true }), cost: 25000, cool: 8, w: 3, fit: (p) => (tier(p) >= 5 ? 1.3 : 0),
  outs: [
    out(0.7, "L'architecture est complexe, mais elle fonctionne. Tu économises sur ta charge fiscale pendant des années.", { argent: pct(0.02, 200000), bonheur: 2, prudent: 2 }),
    out(0.3, "Le montage inquiète l'administration, qui ouvre un contrôle. Tu perds les économies attendues.", { bonheur: -3 }),
  ] });

// ---------------------------------------------------------------------------------
// PETITES BOURSES
// ---------------------------------------------------------------------------------
reg({ id: "aide_sociale", grp: "argent", l: "Monter un dossier d'aide sociale", ic: "📄", d: "Des formulaires, des tampons, des files d'attente. Mais ça peut sauver une fin de mois.",
  need: Object.assign({ net: [null, 8000], ages: [18, 90] }, { noprison: true, nostudy: true }), cool: 2, w: 7, fit: (p) => (tier(p) <= 1 ? 1.8 : 0),
  outs: [out(0.7, "Le dossier passe. Une aide arrive, pas de quoi faire des folies, mais assez pour respirer un peu.", { argent: 3600, bonheur: 2 }), out(0.3, "Il manque un document, puis un autre, puis une signature. Le dossier est refusé, ça sera pour l'année prochaine.", { bonheur: -3 })] });

reg({ id: "deux_boulots", grp: "emploi", l: "Cumuler deux petits boulots", ic: "🥱", d: "Le matin dans une boulangerie, le soir dans une salle de sport. Fatigant, mais ça paie le loyer.",
  need: Object.assign({ net: [null, 25000], ages: [18, 62] }, { noprison: true, nostudy: true }), cool: 2, w: 6, fit: (p) => (tier(p) <= 1 ? 1.6 : 0),
  outs: [out(1, "Tu enchaînes les journées de seize heures. Tu es épuisé, mais le compte en banque respire.", { argent: 7000, sante: -4, bonheur: -3, courage: 1 }, false)] });

reg({ id: "coup_de_main_famille", grp: "famille", l: "Demander un coup de main à la famille", ic: "🫶", d: "Appeler quelqu'un en essayant de ne pas avoir l'air d'en avoir besoin.",
  need: Object.assign({ net: [null, 10000], ages: [18, 70], rel: "family" }, { noprison: true }), cool: 3, w: 6, fit: (p) => (tier(p) <= 1 ? 1.6 : 0),
  outs: [out(0.7, "Quelqu'un te glisse une enveloppe, avec un sermon gentil. Tu respires.", { argent: 2200, bonheur: 2, rel: { mere: 2 } }), out(0.3, "On te prête un peu, avec une liste de reproches. L'argent est là, l'ambiance un peu moins.", { argent: 1200, bonheur: -2 })] });

reg({ id: "colocation_eco", grp: "logement", l: "Prendre un colocataire pour partager le loyer", ic: "🛋️", d: "Une personne de plus dans l'appartement, et une chaussette de plus dans l'évier.",
  need: Object.assign({ net: [null, 35000], ages: [18, 65], home: "rent" }, { noprison: true }), cool: 3, w: 5, fit: (p) => (tier(p) <= 1 ? 1.5 : 0.3),
  outs: [out(0.7, "Ton colocataire est sympa, et le loyer devient abordable. Vous apprenez à vivre à deux, ce qui est un sport.", { argent: 3500, bonheur: 1, sociable: 2 }), out(0.3, "Il laisse la vaisselle pour dix jours et ne paie pas sa part. Tu récupères le loyer, au prix de ta patience.", { argent: 1000, bonheur: -3 })] });

reg({ id: "asso_entraide", grp: "social", l: "Frapper à la porte d'une association d'entraide", ic: "🥫", d: "Des bénévoles formidables, un colis, et quelqu'un qui te regarde sans te juger.",
  need: Object.assign({ net: [null, 3000], ages: [14, 95] }, { noprison: true }), cool: 2, w: 7, fit: (p) => (tier(p) === 0 ? 2 : 0),
  outs: [out(1, "On t'accueille avec un repas chaud et un sourire. Ça ne règle pas tout, mais ça change une semaine entière.", { argent: 800, bonheur: 4, bonte: 2 })] });

reg({ id: "cagnotte", grp: "argent", l: "Lancer une cagnotte en ligne", ic: "📣", d: "Tu racontes ton histoire, tu publies une photo, et tu espères que quelqu'un clique.",
  need: Object.assign({ net: [null, 25000], ages: [18, 75] }, { noprison: true }), cool: 4, w: 4, fit: (p) => (tier(p) <= 1 ? 1.2 : 0),
  outs: [out(0.3, "Ton histoire fait le tour des réseaux. Des inconnus donnent, parfois généreusement, et tu pleures de gratitude.", { argent: 6500, bonheur: 6, repute: 2 }, true), out(0.7, "Tu récoltes quelques dizaines d'euros, de la part de ta famille et d'un inconnu sympathique.", { argent: 350, bonheur: 1 })] });

// ---------------------------------------------------------------------------------
// DETTES
// ---------------------------------------------------------------------------------
reg({ id: "plan_remboursement", grp: "argent", l: "Négocier un plan de remboursement", ic: "📆", d: "Tu t'assois face à un conseiller très calme et tu tentes de réduire l'ardoise.",
  need: Object.assign({ debt: [5000, null], ages: [20, 90] }, { noprison: true }), cool: 3, w: 9, fit: (p) => (p.debt >= 15000 ? 2 : 1.2),
  outs: [out(0.65, "La banque accepte de revoir les échéances et de gommer une partie des pénalités. La dette fond.", { dette: (p) => -Math.round(p.debt * 0.35), bonheur: 3, prudent: 2 }), out(0.35, "Le conseiller reste poli et ferme. Aucun geste commercial, mais au moins la conversation a eu lieu.", { bonheur: -1, prudent: 1 })] });

reg({ id: "rachat_credits", grp: "argent", l: "Regrouper tous tes crédits en un seul", ic: "🧩", d: "Un seul prêt, une seule mensualité, et la sensation d'avoir fait du rangement.",
  need: Object.assign({ debt: [8000, null], ages: [22, 85] }, { noprison: true }), cool: 4, w: 6, fit: (p) => (p.debt >= 20000 ? 1.5 : 0.8),
  outs: [out(0.6, "Le regroupement est accepté, avec un taux plus doux. Tu respires un peu mieux.", { dette: (p) => -Math.round(p.debt * 0.12), bonheur: 2 }), out(0.4, "Les frais de dossier rongent presque tout l'intérêt de l'opération, et la banque s'étonne que tu poses des questions.", { dette: (p) => Math.round(p.debt * 0.02), bonheur: -2 })] });

reg({ id: "vendre_voiture_dette", grp: "argent", l: "Vendre ta voiture pour réduire tes dettes", ic: "🚗", d: "Un peu de marche à pied, un peu de liberté en moins, beaucoup de dette en moins.",
  need: Object.assign({ debt: [5000, null], asset: "voiture", ages: [20, 90] }, { noprison: true }), cool: 4, w: 7, fit: () => 1.4, fx: { sell: "voiture" },
  outs: [out(1, "Tu vends ta voiture, tu rembourses ce que tu peux et tu découvres les joies du vélo.", { bonheur: -2, sport: 1 })] });

reg({ id: "heures_sup_dette", grp: "emploi", l: "Prendre toutes les heures supplémentaires pour rembourser", ic: "⏰", d: "Tu dis oui à tout, tu restes tard, et ton chef t'appelle « mon sauveur ».",
  need: Object.assign({ debt: [5000, null], job: true, ages: [20, 64] }, { noprison: true, nostudy: true }), cool: 3, w: 7, fit: (p) => (p.debt >= 10000 ? 1.5 : 0.8),
  outs: [out(1, "Tu enchaînes les semaines à rallonge. La dette baisse, ton sommeil aussi.", { argent: 5500, sante: -4, bonheur: -3, perf: 4 })] });

// ---------------------------------------------------------------------------------
// LES SUITES DU PASSE, parfois dix ans après
// ---------------------------------------------------------------------------------
reg({ id: "rebondir", grp: "argent", l: "Rebondir après la chute", ic: "🔥", d: "Tu as tout perdu, ou presque. Il reste une idée, un carnet de contacts et une envie têtue de recommencer.",
  need: Object.assign({ ages: [22, 78], fn: (p) => yearsSince(p, p.mem && p.mem.bigLossAt) <= 6 }, { noprison: true, nostudy: true }), prio: 1, cool: 1, w: 10, fit: () => 1.6,
  outs: [
    out(0.4, "Ton nouveau projet prend plus vite que prévu. Les gens qui riaient de toi te demandent un rendez-vous.", { argent: 9000, bonheur: 6, courage: 3, ambition: 3 }, true),
    out(0.6, "Rien ne décolle tout de suite, mais tu apprends. Chaque échec t'affûte, et tes erreurs ne sont plus les mêmes.", { bonheur: 1, courage: 2, prudent: 2 }),
  ] });

reg({ id: "gloire_passee", grp: "social", l: "Raconter tes années de gloire", ic: "🎤", d: "Conférences, mémoires et interviews. Tu as été très riche, il reste une réputation et quelques anecdotes.",
  need: Object.assign({ ages: [40, 95], fn: (p) => p.mem && p.mem.peakNet >= 1000000 && net(p) < 120000 }, { noprison: true }), cool: 4, w: 7, fit: () => 1.5,
  outs: [out(0.5, "Ton livre se vend très correctement et ton histoire fait rire, puis réfléchir. Tu es invité à des plateaux de télévision.", { argent: 15000, repute: 5, bonheur: 5 }, true), out(0.5, "Tu animes des conférences devant des salles clairsemées, mais ravies. Ça paie un peu, et ça réchauffe le cœur.", { argent: 4000, bonheur: 3 })] });

reg({ id: "accompagnement_deuil", grp: "sante", l: "Se faire accompagner dans le deuil", ic: "🕯️", d: "Un groupe de parole, un thérapeute, des amis qui ne disent rien et c'est très bien comme ça.",
  need: { ages: [18, 100], fn: (p) => !!(p.flags.deuil_enfant || p.flags.veuvage), noprison: true }, prio: 2, cool: 1, w: 12, fit: () => 1.8,
  outs: [
    out(0.55, "Petit à petit, la douleur change de forme. Elle ne disparaît pas, mais elle te laisse respirer.", { bonheur: 10, sante: 2, unflag: ["deuil_enfant", "veuvage"] }, true),
    out(0.45, "Il y a des jours meilleurs, et des jours terribles. Mais tu n'es plus seul à porter ça.", { bonheur: 4, sante: 1 }),
  ] });

reg({ id: "fondation_memoire", grp: "social", l: "Créer une fondation en mémoire de ton enfant", ic: "🕊️", d: "Donner un sens à l'absence, un nom à une action, un lieu à un souvenir.",
  need: { ages: [25, 100], money: [20000, null], fn: (p) => !!p.flags.deuil_enfant, noprison: true }, cost: 15000, cool: 10, w: 8, fit: () => 1.4,
  outs: [out(1, "Ta fondation voit le jour, discrète et utile. Chaque projet financé porte un prénom, et ton cœur s'allège un peu.", { repute: 7, bonte: 6, bonheur: 6, unflag: "deuil_enfant" }, true)] });

reg({ id: "rouvrir_son_coeur", grp: "amour", l: "Rouvrir ton cœur après le deuil", ic: "🌱", d: "Pas pour remplacer, juste pour avancer. Quelqu'un te sourit, et tu oses sourire en retour.", prio: 1,
  need: { ages: [25, 90], single: true, fn: (p) => !!p.flags.veuvage && !C.hasRel(p, "crush"), noprison: true }, cool: 1, w: 9, fit: () => 1.4,
  scene: { id: "love_rencontre", vals: { lieu: "lors d'un petit événement de quartier" } } });
