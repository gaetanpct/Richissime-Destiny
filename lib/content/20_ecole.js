// Jalons de la scolarité et des études
const { ev, flash, O, C, D } = require("../kit");

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// probabilité de réussite selon le niveau scolaire (0..100) et un bonus
const pass = (base, bonus) => (p) => clamp(0.12 + (p.school.grade - 25) / 60 + (bonus || 0) + (p.stats.intel - 50) / 400, 0.04, 0.97) * (base === undefined ? 1 : base);
const fail = (base, bonus) => (p) => 1 - pass(base, bonus)(p);

ev("entree_college", {
  must: 80, ages: [11, 11], tags: ["ecole"], ic: "🏫🚪", who: { ami: "friend" },
  need: { fn: (p) => p.school.phase === "primaire" },
  t: "Dernier jour d'école primaire. Demain, tu entres au collège ! Un grand bâtiment, des casiers, des cloches qui sonnent, et surtout des élèves qui font la taille d'un lampadaire. $ami te regarde, un peu inquiet(e).",
  c: [
    D("Te jurer de bosser comme jamais", "📚", "Tu pars avec de bonnes résolutions et un cartable flambant neuf. Les profs te verront sérieux.", { school: { phase: "college" }, notes: 5, intel: 2, ambition: 2 }),
    D("Y aller détendu(e), tout se passera bien", "😎", "Tu fais confiance à la vie. Le collège ne te fait pas peur.", { school: { phase: "college" }, charme: 2, sociable: 2, bonheur: 2 }),
    D("Te faire des amis par tous les moyens", "🤝", "Dès le premier jour, tu te lies avec toute une bande. Les notes passeront après.", { school: { phase: "college" }, sociable: 5, charme: 2, notes: -2, bonheur: 3 }),
  ],
});

ev("brevet", {
  must: 70, ages: [14, 15], tags: ["ecole"], ic: "📝🎓", need: { fn: (p) => p.school.phase === "college" },
  t: "C'est l'heure du brevet des collèges. Les épreuves durent trois jours, et tes parents n'ont pas fermé l'œil depuis une semaine. Comment abordes-tu cet examen ?",
  c: [
    C("Réviser comme un forcené", "📚", [
      O(pass(1, 0.25), "Tu décroches ton brevet avec mention. Soulagement et fierté !", { dipl: "brevet", school: { phase: "college" }, notes: 4, intel: 2, bonheur: 4, flag: "mention_brevet" }),
      O(fail(1, 0.25), "Malgré tes efforts, tu rates de peu. Tu auras une session de rattrapage, que tu valides.", { dipl: "brevet", bonheur: -2, notes: 1 }),
    ]),
    C("Réviser un peu", "📖", [
      O(pass(1, 0), "Tu décroches ton brevet de justesse. Les parents respirent.", { dipl: "brevet", bonheur: 3 }),
      O(fail(1, 0), "Tu échoues, mais le collège te laisse passer en seconde quand même. Tu es soulagé(e), pas fier(e).", { bonheur: -3, notes: -2 }),
    ]),
    C("Compter sur ta bonne étoile", "🍀", [
      O(pass(1, -0.2), "Contre toute attente, tu obtiens ton brevet ! Tu ne sais pas comment.", { dipl: "brevet", bonheur: 5, courage: 2 }),
      O(fail(1, -0.2), "Tu rates ton brevet, et tu le savais déjà un peu.", { bonheur: -4, notes: -3 }),
    ], { risk: 1 }),
  ],
});

ev("choix_lycee", {
  must: 60, ages: [15, 15], tags: ["ecole"], ic: "🧭🏫", need: { fn: (p) => p.school.phase === "college" },
  t: "Fin de collège, il faut choisir ton avenir. La conseillère d'orientation te tend une brochure. Lycée général, technologique, professionnel, apprentissage ou autre chose ?",
  c: [
    D("Lycée général", "📘", "Tu rejoins un grand lycée de $ville. Dans trois ans, tu passes le bac et tu choisis tes études.", { school: { phase: "lycee", track: "general" }, intel: 1, bonheur: 1 }),
    D("Lycée technologique", "🔧", "Une formation plus concrète, avec ateliers et projets. Tu pourras rebondir.", { school: { phase: "lycee", track: "techno" }, creatif: 2, bonheur: 1 }),
    D("Lycée professionnel", "🛠️", "Tu apprends un vrai métier, sur le terrain. Le bac pro arrive en trois ans.", { school: { phase: "lycee", track: "pro" }, sport: 1, ambition: 1 }),
    D("Apprentissage en entreprise", "🧑‍🏭", "Tu travailles et tu étudies en alternance. Moins de cours, plus de vie réelle.", { school: { phase: "none", track: "apprenti" }, dipl: "brevet", ambition: 3, jobHunt: true, flag: "apprenti" }),
    D("Arrêter l'école", "🚪", "Tu claques la porte de l'école. L'avenir est à toi, et il est très flou.", { school: { phase: "none" }, courage: 3, bonheur: 2, repute: -2, flag: "decrocheur", jobHunt: true }),
  ],
});

ev("decrochage_envie", {
  ages: [16, 17], tags: ["ecole"], ic: "😩📚", w: 5, who: { teacher: "teacher", bestfriend: "bestfriend" }, need: { fn: (p) => p.school.phase === "lycee" && p.school.grade < 45 },
  t: "Ça fait des mois que tu t'ennuies à mourir en cours. Tes notes dégringolent, tes profs soupirent. Une idée germe, tout plaquer pour voir ailleurs.",
  c: [
    C("Quitter l'école pour de bon", "🚪", [O(1, "Tu quittes le lycée sans diplôme. Tes parents sont atterrés, mais tu te sens libre.", { school: { phase: "none" }, flag: "decrocheur", bonheur: 2, repute: -3, jobHunt: true })], { risk: 2 }),
    D("Tenir bon avec l'aide d'un prof", "🧑‍🏫", "Un prof te prend sous son aile. Tu remontes la pente, doucement.", { notes: 8, intel: 2, bonheur: 1, rel: { teacher: 10 } }),
    D("Changer de lycée", "🏫", "Un nouveau départ dans un autre établissement, avec de nouveaux amis.", { notes: 3, sociable: 2, bonheur: 2, rel: { bestfriend: -5 } }),
  ],
});

ev("bac_exam", {
  must: 75, ages: [17, 18], tags: ["ecole"], ic: "🎓📜", need: { fn: (p) => p.school.phase === "lycee" },
  t: "Le grand jour du baccalauréat arrive. La philo, le grand oral, la fatigue. Dans la salle, on entend voler les mouches. Ton stylo tremble.",
  c: [
    C("Tout donner", "🔥", [
      O(pass(1, 0.28), "Tu décroches ton bac avec mention très bien ! Tes parents pleurent de joie dans la cour du lycée.", { dipl: (p) => (p.school.track === "pro" ? "bacpro" : "bac"), school: { phase: "none" }, intel: 2, bonheur: 8, flag: "mention_tb", next: "orientation" }),
      O(fail(1, 0.28), "Malgré ton énergie, tu rates ton bac. Un coup dur, tu devras repasser l'examen.", { school: { phase: "none" }, bonheur: -6, later: { id: "bac_rattrapage", in: 1 } }),
    ]),
    C("Rester calme et jouer la carte de l'intuition", "🧘", [
      O(pass(1, 0.05), "Tu décroches ton bac sans trop de souci. Mention assez bien.", { dipl: (p) => (p.school.track === "pro" ? "bacpro" : "bac"), school: { phase: "none" }, bonheur: 5, next: "orientation" }),
      O(fail(1, 0.05), "Le bac n'est pas au rendez-vous. Il faudra repasser.", { school: { phase: "none" }, bonheur: -5, later: { id: "bac_rattrapage", in: 1 } }),
    ]),
    C("Tricher avec une antisèche cachée", "📎", [
      O(0.5, "Personne ne remarque rien. Tu as ton bac, grâce à ton ingéniosité.", { dipl: (p) => (p.school.track === "pro" ? "bacpro" : "bac"), school: { phase: "none" }, honnete: -6, bonheur: 4, next: "orientation" }),
      O(0.5, "Tu es surpris(e) par le surveillant. Exclusion de la session, et honte.", { school: { phase: "none" }, honnete: -4, repute: -6, bonheur: -8, later: { id: "bac_rattrapage", in: 1 } }),
    ], { risk: 2 }),
  ],
});

ev("bac_rattrapage", {
  chainOnly: true, ages: [18, 20], tags: ["ecole"], ic: "🎓🔁",
  t: "Un an plus tard, tu repasses ton baccalauréat. Tu as retravaillé, mûri et même appris à te détendre.",
  c: [
    C("Foncer", "💪", [
      O(0.78, "Cette fois, c'est la bonne. Tu décroches enfin ton bac !", { dipl: "bac", intel: 2, bonheur: 7, next: "orientation" }),
      O(0.22, "Un nouvel échec. Tu tournes la page des examens, direction la vie active.", { bonheur: -5, jobHunt: true }),
    ]),
    D("Renoncer au bac et chercher du travail", "💼", "Pas besoin de bac pour réussir. Tu te lances.", { ambition: 2, jobHunt: true, flag: "decrocheur" }),
  ],
});

ev("orientation", {
  chainOnly: true, tags: ["ecole"], ic: "🧭🎓",
  t: "Le bac en poche, il faut décider de la suite. Les portes ouvertes se succèdent, les brochures s'empilent. Quelle voie choisis-tu pour tes études ?",
  c: (p) => {
    const ch = [];
    const edu = p.school.edu;
    const g = p.stats.intel;
    ch.push(C("La fac (licence en 3 ans)", "🏛️", [O(1, "Tu t'inscris à l'université. Un grand amphi, des centaines d'étudiants, et une liberté vertigineuse.", { school: (p) => ({ phase: "sup", track: "fac", target: "licence", endAge: p.age + 3 }), bonheur: 3 })], { need: { edu: 3 } }));
    ch.push(C("Une prépa et une grande école (5 ans)", "🏆", [O(1, "Deux ans de prépa, de nuits blanches et de café, puis une grande école. Tu t'engages dans le marathon.", { school: (p) => ({ phase: "sup", track: "prepa", target: "master", endAge: p.age + 5 }), dette: 12000, ambition: 4, intel: 3, bonheur: -3 })], { need: { edu: 3, stat: { intel: [52, null] } }, cost: 0, why: "Il faut un bon niveau (Intelligence 52)" }));
    ch.push(C("Une école de commerce (5 ans)", "💼", [O(1, "Tu intègres une école de commerce. Les frais sont lourds, les soirées nombreuses, le réseau précieux.", { school: (p) => ({ phase: "sup", track: "commerce", target: "master", endAge: p.age + 5 }), dette: 22000, sociable: 4, charme: 2, ambition: 3 })], { need: { edu: 3 } }));
    ch.push(C("Une école d'ingénieurs (5 ans)", "⚙️", [O(1, "Tu entres en école d'ingénieurs. Des équations, des projets et des cafés à gogo.", { school: (p) => ({ phase: "sup", track: "ingenieur", target: "master", endAge: p.age + 5 }), dette: 10000, intel: 4 })], { need: { edu: 3, stat: { intel: [50, null] } }, why: "Il faut un bon niveau (Intelligence 50)" }));
    ch.push(C("Médecine (6 ans)", "🩺", [O(1, "Tu t'attaques à la première année de médecine, la jungle des concours. Courage !", { school: (p) => ({ phase: "sup", track: "medecine", target: "master", endAge: p.age + 6 }), dette: 8000, intel: 4, bonheur: -4, courage: 2 })], { need: { edu: 3, stat: { intel: [60, null] } }, why: "Il faut un très bon niveau (Intelligence 60)" }));
    ch.push(C("Le droit (5 ans)", "⚖️", [O(1, "Tu t'inscris en droit. Les codes sont lourds, les plaidoiries passionnantes.", { school: (p) => ({ phase: "sup", track: "droit", target: "master", endAge: p.age + 5 }), dette: 6000, intel: 2, charme: 2 })], { need: { edu: 3 } }));
    ch.push(C("Un BTS ou un IUT (2 ans)", "🔧", [O(1, "Une formation concrète et courte, avec stages et projets. Tu seras opérationnel(le) vite.", { school: (p) => ({ phase: "sup", track: "bts", target: "licence", endAge: p.age + 2 }), bonheur: 2 })], { need: { edu: 2 } }));
    ch.push(C("Une école d'art (3 ans)", "🎨", [O(1, "Tu intègres une école d'art. Peinture, design, sculpture. Les repas sont maigres, les idées foisonnent.", { school: (p) => ({ phase: "sup", track: "art", target: "licence", endAge: p.age + 3 }), creatif: 5, dette: 4000, bonheur: 3 })], { need: { edu: 2 } }));
    ch.push(C("Travailler tout de suite", "💼", [O(1, "Tu te mets en quête d'un premier emploi. Le monde du travail t'attend.", { ambition: 2, bonheur: 1, jobHunt: true })], {}));
    ch.push(C("Voyager d'abord, on verra après", "🎒", [O(0.7, "Une année sabbatique sur les routes. Tu reviens plus mûr(e) et un peu plus pauvre.", { bonheur: 7, courage: 3, intel: 2, argent: -300, flag: "annee_sabbatique" }), O(0.3, "Ton voyage tourne à la catastrophe, mais quelle expérience !", { bonheur: 3, courage: 5, argent: -600, sante: -3 })], { risk: 1 }));
    return ch;
  },
});

ev("diplome_sup", {
  chainOnly: true, tags: ["ecole"], ic: "🎓🏅",
  t: "C'est l'heure des examens finaux, la dernière ligne droite de tes études. Les partiels s'enchaînent, le stress monte, mais l'horizon est proche.",
  c: [
    C("Donner le maximum", "🔥", [
      O(pass(1, 0.22), "Tu obtiens ton diplôme avec les félicitations du jury. Une nouvelle vie commence !", { dipl: (p) => p.school.target || "licence", school: { phase: "none", target: null, track: null }, bonheur: 8, ambition: 2, jobHunt: true }),
      O(fail(1, 0.22), "Tu échoues de peu. L'école te propose de redoubler, mais tu préfères partir.", { school: { phase: "none", target: null, track: null }, bonheur: -6, flag: "echec_etudes", jobHunt: true }),
    ]),
    C("Y aller sans trop de pression", "😌", [
      O(pass(1, 0.05), "Tu décroches ton diplôme sans trop de peine. C'est fait !", { dipl: (p) => p.school.target || "licence", school: { phase: "none", target: null, track: null }, bonheur: 5, jobHunt: true }),
      O(fail(1, 0.05), "Tu rates ton diplôme. Une grosse déception, mais la vie continue.", { school: { phase: "none", target: null, track: null }, bonheur: -5, flag: "echec_etudes", jobHunt: true }),
    ]),
  ],
});

// ---------- Quelques scènes d'études ----------
ev("etudes_partiel_nuit", {
  ages: [18, 28], tags: ["ecole"], ic: "☕📚", w: 6, who: { friend: "friend" }, need: { studying: true },
  t: "Les partiels débutent demain matin et tu n'as pas ouvert un seul cours. Il est minuit, la machine à café est en panne et ton colocataire ronfle.",
  c: [
    C("Veiller toute la nuit", "🌙", [O(0.6, "Tu n'as pas dormi mais tu as tout lu. Tu t'en sors honorablement.", { notes: 6, sante: -3, intel: 1 }), O(0.4, "Tu t'endors sur ton clavier. Les partiels sont un désastre.", { notes: -4, sante: -3, bonheur: -3 })], { risk: 1 }),
    D("Te coucher et faire confiance à ton cerveau", "😴", "Tu arrives frais et dispos, mais pas préparé(e). Ça passe, ou ça casse.", { notes: -1, sante: 2, bonheur: 2 }),
    D("Demander des notes à un camarade", "🤝", "Tu reçois un résumé impeccable. Tu devras lui rendre la pareille.", { notes: 3, sociable: 2, rel: { friend: 4 } }),
  ],
});

ev("etudes_job_etudiant", {
  ages: [18, 28], tags: ["travail"], ic: "🍕🛵", w: 5, need: { studying: true }, roll: { somme: [1500, 4500, 100] },
  t: "Tes finances sont à sec. Un patron de pizzeria te propose de livrer des pizzas le soir, pour $somme sur l'année. Mais ça veut dire moins de temps pour réviser.",
  c: [
    D("Accepter le job", "🛵", "Tu enchaînes les livraisons, et les pourboires t'amusent. Le portefeuille reprend des couleurs.", { argent: (p, x) => x.vals.somme, notes: -3, sport: 2, sante: -1, ambition: 2 }),
    D("Refuser et vivre frugalement", "🥔", "Pâtes au beurre et rien d'autre. Mais tu as la tête libre pour étudier.", { notes: 4, bonheur: -3, prudent: 2 }),
    D("Demander de l'aide à tes parents", "🙏", "Ils t'envoient un petit virement avec un message très tendre.", { argent: 1200, rel: { mere: 3, pere: 3 }, honnete: 0, bonheur: 1 }),
  ],
});

ev("etudes_stage_reve", {
  ages: [20, 27], tags: ["travail"], ic: "🗂️🏢", w: 5, need: { studying: true }, roll: { entreprise: "boites" },
  t: "On te propose un stage chez $entreprise. Le salaire est dérisoire, les horaires sont longs, mais le CV s'en souviendra.",
  c: [
    C("Accepter et se donner à fond", "💼", [O(0.7, "Le stage se passe très bien. On te propose même de revenir à la fin de tes études.", { ambition: 3, argent: 1500, intel: 1, notes: 1, flag: "promesse_embauche" }), O(0.3, "Le stage est une galère, tu fais du café et des photocopies.", { ambition: 1, argent: 1000, bonheur: -3 })]),
    D("Décliner pour garder du temps libre", "🏖️", "Tu passes un super été. Mais ton CV est un peu vide.", { bonheur: 4, ambition: -2 }),
    D("Négocier un meilleur salaire", "🗣️", "Surprise, ils acceptent. Tu gagnes plus et tu apprends à t'imposer.", { charme: 2, argent: 2500, ambition: 2, courage: 2 }, { need: { stat: { charme: [50, null] } }, why: "Il faut du charme (50)" }),
  ],
});

ev("etudes_colocation", {
  ages: [18, 26], tags: ["amis"], ic: "🛋️🍕", w: 6, need: { studying: true },
  t: "Tu emménages en colocation avec trois autres étudiants. Le frigo est partagé, la salle de bain l'est aussi, et un des colocs est un fan inconditionnel de la trompette.",
  c: [
    D("Organiser des soirées jeux de société", "🎲", "Votre colocation devient l'endroit à la mode. Les amis débarquent, les rires fusent.", { sociable: 4, bonheur: 5, notes: -2 }),
    D("Mettre un cadenas sur ta nourriture", "🔒", "L'ambiance se refroidit, mais ton fromage est en sécurité.", { prudent: 2, sociable: -2, bonheur: -1 }),
    D("Apprendre la trompette avec lui", "🎺", "Le voisinage prépare des plaintes. Votre duo devient culte.", { creatif: 4, sociable: 2, bonheur: 4, repute: -1 }),
  ],
});

ev("etudes_redoublement", {
  ages: [19, 26], tags: ["ecole"], ic: "🔁😕", w: 4, need: { studying: true, fn: (p) => p.school.grade < 35 },
  t: "Tes résultats sont inquiétants. Le directeur des études te convoque pour une discussion sérieuse. Le mot « redoubler » flotte dans l'air.",
  c: [
    D("Promettre de te remettre au travail", "🙏", "Tu t'engages, et tu y tiens. Les semaines suivantes sont studieuses.", { notes: 10, bonheur: -2, ambition: 2 }),
    D("Changer de filière", "🔀", "Une autre voie s'ouvre. Tu sens que tu es à ta place.", { notes: 6, bonheur: 3, school: (p) => ({ track: p.school.track, endAge: (p.school.endAge || p.age + 1) + 1 }) }),
    D("Arrêter les études", "🚪", "Tu fais tes cartons. Il est temps d'aller voir le vrai monde.", { school: { phase: "none", target: null }, bonheur: -2, flag: "echec_etudes", jobHunt: true }),
  ],
});

ev("etudes_amphi_fantome", {
  ages: [18, 26], tags: ["loufoque", "ecole"], ic: "👻🏛️", w: 4, need: { studying: true },
  t: "Dans le grand amphi, un fantôme assiste aux cours depuis le dernier rang. Il prend des notes, il lève la main parfois. Personne ne dit rien, tout le monde l'a adopté.",
  c: [
    D("Lui demander ses notes", "📝", "Il te prête un cours d'une clarté céleste. Tu comprends tout, enfin.", { notes: 7, intel: 2, bonheur: 3 }),
    D("Lui proposer de former un groupe de révision", "👥", "Le fantôme est l'élève le plus assidu. Le groupe devient légendaire.", { sociable: 3, notes: 4, bonheur: 4 }),
    D("L'ignorer poliment", "🙂", "Les fantômes sont des gens comme les autres, ils ont leurs secrets.", { prudent: 2 }),
  ],
});

flash("Tu as décroché un 20/20 en dictée. Tes parents encadrent la copie.", { notes: 3, bonheur: 3, intel: 1 }, { ages: [8, 11], ic: "📝", need: { school: true } });
flash("Pendant un cours très ennuyeux, tu as dessiné des dragons dans la marge. Ils sont superbes.", { creatif: 2, notes: -1, bonheur: 1 }, { ages: [11, 17], ic: "🐉", need: { school: true } });
flash("Le prof principal t'a donné une colle, pour avoir ri trop fort.", { notes: -1, bonheur: -1, repute: -1 }, { ages: [11, 17], ic: "🔒", need: { school: true } });
flash("Tu as retrouvé un cahier d'école primaire. Quel souvenir !", { bonheur: 2 }, { ages: [12, 30], ic: "📓" });
