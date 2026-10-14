// Scènes de l'adolescence (12 à 17 ans)
const { ev, flash, O, C, D } = require("../kit");

ev("premier_baiser", {
  ages: [13, 17], tags: ["amour"], ic: "💋🌳", w: 6, who: { crush: "crush" },
  need: { noflag: "premier_baiser_fait" },
  t: "Lors d'une soirée d'anniversaire, $crush te regarde un peu trop longtemps. La musique est lente, les lumières sont douces, et tu sens ton cœur battre dans tes oreilles.",
  c: [
    C("Tenter un baiser", "💋", [
      O(0.55, "Un premier baiser, maladroit et électrique. Tu rentres chez toi en flottant.", { bonheur: 7, charme: 2, courage: 3, rel: { crush: 14 }, flag: "premier_baiser_fait" }),
      O(0.45, "Vos nez se cognent. Un fou rire gêné, mais $crush est adorable.", { bonheur: 3, courage: 2, rel: { crush: 6 }, flag: "premier_baiser_fait" }),
    ], { risk: 1 }),
    D("Proposer de danser", "💃", "Vous dansez toute la soirée, collés-décollés. Le slow vous appartient.", { charme: 3, bonheur: 5, rel: { crush: 10 } }),
    D("Partir en courant", "🏃", "Tu t'enfuis sous la panique. $crush hausse les épaules, un peu déçu(e).", { courage: -2, rel: { crush: -8 }, bonheur: -3 }),
  ],
});

ev("amoureux_college", {
  ages: [13, 17], tags: ["amour"], ic: "💌💘", w: 5, who: { crush: "crush" },
  t: "Tu as le béguin pour $crush depuis des semaines. Tes copains te poussent à lui écrire un mot.",
  c: [
    C("Lui écrire un poème", "✍️", [O(0.45, "$crush est touché(e) et accepte un rendez-vous au parc. Premier rendez-vous réussi !", { creatif: 3, charme: 2, bonheur: 6, rel: { crush: 15 }, becomes: { crush: "partner" } }), O(0.55, "$crush rit, pas méchamment, mais tu es rouge pivoine.", { creatif: 2, bonheur: -3, rel: { crush: -3 } })], { risk: 1 }),
    D("Faire passer un mot par un ami", "📨", "Le mot est mal transmis. Tu te retrouves avec un lapin dans l'histoire.", { prudent: 2, bonheur: -1 }),
    D("Rien faire, rester dans l'ombre", "🕶️", "Tu continues à rêver en silence. Ça passe, avec le temps.", { prudent: 3, courage: -1 }),
    D("Y aller franchement", "🔥", "Tu l'abordes devant tout le monde. Le courage paie, parfois.", { courage: 5, charme: 1, bonheur: 4, rel: { crush: 8 } }),
  ],
});

ev("premier_smartphone", {
  ages: [11, 14], tags: ["famille"], ic: "📱😍", w: 6, who: { mere: "mere" },
  t: "Tes parents t'offrent ton premier smartphone. Tu vas enfin pouvoir envoyer des messages, regarder des vidéos et prendre des photos de ton chat.",
  c: [
    D("L'utiliser avec modération", "😌", "Tu gardes un bon équilibre, et tes notes ne souffrent pas.", { prudent: 3, bonheur: 3, notes: 1 }),
    D("Passer des heures sur les réseaux", "📲", "Tu ne vois plus le temps passer. Tes devoirs, tes cernes et tes amis en subissent les conséquences.", { bonheur: 2, notes: -4, sante: -2, sociable: 1 }),
    C("Créer une chaîne de vidéos", "🎬", [O(0.2, "Ta chaîne décolle, un million de vues pour une vidéo où tu fais danser ton chat !", { charme: 2, repute: 8, argent: 400, bonheur: 6, flag: "mini_influenceur" }), O(0.8, "Tes vidéos sont vues par ta grand-mère et ta tante. Mais tu t'amuses bien.", { creatif: 3, bonheur: 3 })]),
  ],
});

ev("college_bagarre_rumeur", {
  ages: [12, 16], tags: ["ecole"], ic: "🗣️😳", w: 5, who: { rival: "rival" },
  t: "Une rumeur gênante court sur toi dans tout le collège. Elle dit que tu ronfles en classe en parlant à une peluche. C'est faux, ou presque.",
  c: [
    D("Démentir devant tout le monde", "📢", "Ton discours fait le tour du collège. Certains te croient, d'autres rigolent.", { courage: 3, repute: 1, bonheur: -1 }),
    C("Retrouver l'auteur et lui faire payer", "🥊", [O(0.5, "C'est $rival, tu le fais avouer, il présente ses excuses.", { courage: 4, repute: 3, rel: { rival: -4 } }), O(0.5, "Tu accuses la mauvaise personne. Ça fait un énorme scandale.", { repute: -5, bonte: -3, bonheur: -4 })], { risk: 1 }),
    D("Rire de toi-même et prendre la rumeur à la légère", "😄", "Tu deviens le roi de l'autodérision. La rumeur perd de sa force.", { charme: 3, sociable: 2, repute: 3, bonheur: 3 }),
  ],
});

ev("college_voyage_scolaire", {
  ages: [12, 15], tags: ["ecole", "voyage"], ic: "🗼🚌", w: 5, who: { ami: "friend" },
  t: "Voyage scolaire à l'étranger ! Une semaine dans une famille d'accueil, avec des repas bizarres et une langue que tu comprends à 12 %.",
  c: [
    D("Te débrouiller avec les mains et les sourires", "🤲", "Tu te fais comprendre à coup de grimaces. La famille t'adore.", { charme: 3, courage: 2, bonheur: 5, intel: 1 }),
    D("Passer la semaine avec ton ami", "👭", "Vous restez collés, vous faites les 400 coups. Tu reviens plus soudé(e).", { rel: { ami: 10 }, bonheur: 4, sociable: 1 }),
    C("Fausser compagnie au groupe pour explorer", "🧭", [O(0.5, "Tu découvres un marché incroyable, un petit trésor bon marché. Tu te fais punir, mais ça valait le coup.", { courage: 5, bonheur: 5, repute: -2, argent: -10 }), O(0.5, "Tu te perds, la police te ramène en voiture. Gros moment de honte.", { courage: 3, bonheur: -3, repute: -4 })], { risk: 1 }),
  ],
});

ev("sport_equipe_college", {
  ages: [12, 17], tags: ["sport"], ic: "🏀🏆", w: 5, who: { ami: "friend" },
  t: "L'entraîneur de l'équipe du collège te regarde jouer à la récré, et t'invite à passer les sélections. C'est une chance, mais il y a un risque d'échec et de moqueries.",
  c: [
    C("Tenter les sélections", "💪", [O(0.5, "Tu es pris(e) dans l'équipe ! Les entraînements sont durs, mais l'ambiance est géniale.", { sport: 5, sociable: 3, bonheur: 5, repute: 3, flag: "equipe_sport" }), O(0.5, "Tu rates de peu, mais l'entraîneur te dit de revenir l'an prochain.", { sport: 2, bonheur: -2, courage: 2 })], { risk: 1 }),
    D("Décliner, tu préfères la musique", "🎸", "Ton choix te semble le bon. Tu t'inscris à la chorale.", { creatif: 3, bonheur: 2 }),
    D("Entraîner tes amis dans une équipe à toi", "👟", "Vous montez votre équipe bricolée. Elle perd tous ses matchs mais l'ambiance est exquise.", { sociable: 4, bonheur: 5, repute: 1 }),
  ],
});

ev("premiere_cigarette", {
  ages: [13, 17], tags: ["sante", "mature"], ic: "🚬😶", w: 4, who: { rival: "rival" },
  t: "Derrière le gymnase, $rival et d'autres ados t'offrent une cigarette. Tout le monde te regarde, c'est le grand test.",
  c: [
    C("Essayer", "🚬", [O(0.6, "Tu tousses à t'étouffer. Plus jamais, tu te jures.", { sante: -2, honnete: -1, repute: 1 }), O(0.4, "Tu y prends goût, ce qui va devenir un problème.", { sante: -4, flag: "fumeur", repute: 1 })], { risk: 2 }),
    D("Refuser avec fermeté", "✋", "On te traite de chochotte, mais tu es fier(e) de toi.", { courage: 2, prudent: 3, sante: 1, repute: -1 }),
    D("Prétexter une allergie", "🤧", "Excuse géniale, l'un des ados te présente même des excuses.", { creatif: 3, charme: 1 }),
  ],
});

ev("premier_jour_job_ete", {
  ages: [15, 17], tags: ["travail"], ic: "🍦🏖️", w: 6, roll: { somme: [600, 1800, 100] },
  t: "Pour l'été, tu décroches un petit job. Les glaces en bord de mer rapportent $somme sur toute la saison. Le patron est un peu fou, et les clients sont impatients.",
  c: [
    D("Bosser sérieusement", "🍨", "Tu enchaînes les cornets, sans une erreur. Le patron t'offre une prime.", { argent: (p, x) => x.vals.somme + 150, sport: 1, ambition: 3, bonheur: 2 }),
    C("Te faire des copains plutôt que de bosser", "😎", [O(0.5, "Tu as passé un été de rêve, le patron a fermé les yeux.", { argent: (p, x) => x.vals.somme / 2, sociable: 4, bonheur: 5 }), O(0.5, "Tu te fais virer au bout d'un mois.", { argent: 300, bonheur: -2, repute: -2 })]),
    D("Piquer des glaces en cachette", "🥄", "Tu manges des glaces à volonté. Tu en as pris cinq kilos et un peu de culpabilité.", { argent: (p, x) => x.vals.somme / 2, honnete: -3, sante: -2, bonheur: 4 }),
  ],
});

ev("seconde_prof_principal", {
  ages: [15, 17], tags: ["ecole"], ic: "🧑‍🏫📚", w: 5, who: { prof: "teacher" }, need: { school: true },
  t: "Ton prof principal te convoque. « Tu as du potentiel, mais tu te disperses. » Il te propose un plan de travail strict.",
  c: [
    D("Accepter son aide", "🙏", "Avec son suivi, tes notes remontent. Tu apprends à t'organiser.", { notes: 8, intel: 2, rel: { prof: 12 }, bonheur: 1 }),
    D("Refuser, tu t'en sors tout seul", "🙅", "Tu te débrouilles à ta manière. Parfois ça marche, parfois non.", { courage: 2, notes: -1, rel: { prof: -5 } }),
    D("Négocier un contrat de bonne conduite", "📝", "Tu signes un papier ridicule avec ton prof. Il le garde sur son bureau.", { charme: 2, notes: 4, rel: { prof: 5 }, bonheur: 2 }),
  ],
});

ev("fete_ado_parents_absents", {
  ages: [15, 17], tags: ["amis", "mature"], ic: "🎉🏠", w: 5, who: { ami: "friend" },
  t: "Tes parents partent en week-end. $ami te souffle une idée, organiser une fête à la maison. Les invitations circulent déjà, et il y a plus de monde que prévu.",
  c: [
    C("Faire la fête à fond", "🎶", [O(0.4, "La soirée est mythique. Les voisins demandent le nom du DJ, tu es au sommet.", { repute: 6, sociable: 5, bonheur: 7, rel: { ami: 8 } }), O(0.6, "La maison est un champ de bataille, le canapé fume, et tes parents rentrent plus tôt que prévu.", { repute: 3, bonheur: 3, rel: { mere: -10, pere: -10 }, argent: -150 })], { risk: 2 }),
    D("Faire une petite soirée entre amis", "🍕", "Pizza, films et rires. Pas de dégâts, des souvenirs.", { sociable: 3, bonheur: 4, prudent: 2, rel: { ami: 5 } }),
    D("Refuser, ce n'est pas une bonne idée", "🙅", "Tu passes pour un(e) rabat-joie, mais ta maison est intacte.", { prudent: 4, repute: -2, bonheur: -1, honnete: 2 }),
  ],
});

ev("vol_scooter_ado", {
  ages: [14, 17], tags: ["mature", "crime"], ic: "🛵🚨", w: 3, who: { rival: "rival" },
  t: "$rival te défie de piquer le scooter du voisin pour un tour dans le quartier. « T'as pas les tripes », dit-il en ricanant.",
  c: [
    C("Relever le défi", "🔥", [O(0.4, "Tu fais ton tour de piste sans te faire attraper. La légende naît.", { courage: 5, repute: 2, honnete: -6, bonheur: 4 }), O(0.6, "Tu es arrêté(e) par la police. Un avertissement et une grosse leçon de morale.", { honnete: -5, repute: -6, bonheur: -5, record: 1, rel: { mere: -10, pere: -10 } })], { risk: 3 }),
    D("Refuser net", "🚫", "$rival t'insulte, mais tu gardes la tête haute.", { honnete: 4, prudent: 3, rel: { rival: -5 } }),
    D("Proposer d'aller à la fête foraine à la place", "🎡", "Tu proposes un plan bien plus fun. $rival réfléchit et dit oui.", { charme: 3, creatif: 2, bonheur: 4, rel: { rival: 8 } }),
  ],
});

ev("manif_lycee", {
  ages: [15, 17], tags: ["social"], ic: "✊📢", w: 4, need: { school: true },
  t: "Les lycéens organisent une grande manifestation pour réclamer le retour des tartes à la cantine. Les banderoles sont prêtes, les slogans hurlés.",
  c: [
    D("Prendre la tête du cortège", "📣", "Ton nom est scandé, tu passes même au journal local. Les tartes reviennent !", { courage: 4, charme: 3, repute: 6, bonheur: 5, ambition: 2 }),
    D("Suivre le mouvement", "🚶", "Tu marches en chantant. L'ambiance est bonne, la cause juste.", { sociable: 3, bonheur: 4 }),
    D("Profiter pour sécher les cours en douce", "🏃", "Tu files au café du coin. Tu rates la révolution et deux heures de maths.", { honnete: -2, bonheur: 2, notes: -2 }),
  ],
});

ev("lycee_prof_dragon", {
  ages: [15, 17], tags: ["loufoque", "ecole"], ic: "🐉📖", w: 3, need: { school: true },
  t: "Ton prof d'histoire est un dragon. Il l'a avoué hier, en soufflant un petit nuage de fumée. Tout le monde a fait comme si de rien n'était, et il a continué le cours sur la Révolution.",
  c: [
    D("Lui demander des anecdotes sur les rois", "👑", "Il a connu tout le monde. Tu écris un mémoire génial.", { intel: 4, notes: 6, bonheur: 3 }),
    D("Lui demander de te faire un tour sur son dos", "🐲", "Il refuse poliment. « Pas pendant les heures de cours. »", { courage: 3, bonheur: 3, creatif: 2 }),
    D("Chercher à le dénoncer", "📞", "Personne ne te croit, et le dragon t'invite à la retenue.", { honnete: 1, notes: -2, bonheur: -1 }),
  ],
});

ev("jeux_argent_ado", {
  ages: [16, 17], tags: ["argent", "mature"], ic: "🎰🃏", w: 3,
  t: "Un copain organise un poker clandestin dans une cave. La mise d'entrée est de quelques dizaines d'euros, tu as de l'argent de poche.",
  c: [
    C("Jouer", "🃏", [O(0.35, "Tu repars avec le pot ! Tu es le nouveau roi de la cave.", { argent: 180, bonheur: 4, courage: 2, intel: 1 }), O(0.65, "Tu perds tout en trois mains. Une leçon coûteuse.", { argent: -60, bonheur: -3, prudent: 1 })], { risk: 2, cost: 60 }),
    D("Regarder et prendre des notes", "📓", "Tu apprends comment ils bluffent. Tu verras plus tard.", { intel: 2, prudent: 2, bonheur: 1 }),
    D("Décliner et rentrer", "🏠", "Tu préfères dormir plutôt que de te ruiner.", { prudent: 3 }),
  ],
});

ev("copains_dispute_clan", {
  ages: [12, 17], tags: ["amis"], ic: "🧑‍🤝‍🧑💥", w: 5, who: { ami: "friend", copain: "bestfriend" },
  t: "$ami et $copain se sont disputés violemment. Chacun veut que tu prennes parti. Les regards sont lourds, les silences encore plus.",
  c: [
    D("Prendre le parti de $ami", "🔵", "$ami te remercie. $copain se sent trahi.", { rel: { ami: 10, copain: -12 }, bonheur: -1 }),
    D("Prendre le parti de $copain", "🔴", "$copain te remercie. $ami fait la tête.", { rel: { ami: -10, copain: 8 }, bonheur: -1 }),
    D("Organiser une réconciliation", "🕊️", "Après de longs efforts, ils se réconcilient autour d'une pizza.", { charme: 3, sociable: 3, bonte: 3, rel: { ami: 6, copain: 6 }, bonheur: 3 }),
    D("Rester neutre", "🇨🇭", "Tu es un Suisse parfait. Mais personne ne te remercie.", { prudent: 3, rel: { ami: -3, copain: -3 } }),
  ],
});

ev("brevet_blanc_triche", {
  ages: [13, 16], tags: ["ecole"], ic: "📋😬", w: 4, who: { ami: "friend" }, need: { school: true },
  t: "À l'examen blanc, $ami te chuchote de lui passer ta copie. Il joue sa moyenne de l'année. Le surveillant fait une pause pipi.",
  c: [
    C("Lui laisser regarder", "👀", [O(0.5, "Personne ne remarque rien. $ami te doit une fière chandelle.", { honnete: -3, rel: { ami: 10 }, bonheur: 2 }), O(0.5, "Le surveillant revient et voit tout. Zéro pour vous deux.", { honnete: -3, notes: -4, repute: -3, rel: { ami: -4 } })], { risk: 1 }),
    D("Cacher ta copie", "🙈", "$ami te fait la moue, mais tu es fidèle à tes principes.", { honnete: 4, rel: { ami: -5 }, notes: 1 }),
    D("Proposer de l'aider à réviser après", "📚", "Vous révisez ensemble. $ami fait des progrès, et vous devenez inséparables.", { bonte: 4, intel: 1, rel: { ami: 8 }, bonheur: 2 }),
  ],
});

ev("petit_ami_jaloux", {
  ages: [15, 17], tags: ["amour"], ic: "😒💔", w: 4, who: { partner: "partner" }, need: { partner: "couple" },
  t: "$partner te fait une scène de jalousie parce que tu as parlé trop longtemps avec quelqu'un d'autre. Vous êtes au milieu de la cour.",
  c: [
    D("Calmer le jeu avec douceur", "🤗", "Vous vous expliquez calmement. $partner s'excuse.", { bonte: 3, rel: { partner: 8 }, bonheur: 2 }),
    D("Rompre sur-le-champ", "💔", "Une rupture dramatique. Tout le lycée en parle. Tu sors la tête haute, les yeux rouges.", { courage: 3, bonheur: -5, repute: -1, drop: "partner" }),
    D("Te défendre en criant", "😡", "La dispute s'envenime. Vous vous réconciliez à la sortie, mais ça laisse des traces.", { courage: 2, rel: { partner: -8 }, bonheur: -2 }),
  ],
});

ev("coup_de_foudre_ami", {
  ages: [14, 17], tags: ["amour", "amis"], ic: "💘👀", w: 3, who: { copain: "bestfriend" },
  t: "Un jour, en regardant $copain rire, tu réalises qu'il se passe quelque chose de nouveau dans ton cœur. Ton meilleur ami ou ta meilleure amie, que tu connais depuis toujours.",
  c: [
    C("Tout lui avouer", "💞", [O(0.5, "$copain ressent la même chose ! Vous vous embrassez maladroitement sous les étoiles.", { bonheur: 10, courage: 4, becomes: { copain: "partner" } }), O(0.5, "$copain est surpris(e), gêné(e), et vous mettez du temps à retrouver votre amitié.", { bonheur: -5, courage: 3, rel: { copain: -10 } })], { risk: 2 }),
    D("Garder ça pour toi", "🤐", "Tu continues à l'aimer en silence. Ça te donne des idées de poésie.", { creatif: 4, bonheur: -2, prudent: 2 }),
  ],
});

ev("ecole_prix_excellence", {
  ages: [12, 17], tags: ["ecole"], ic: "🏅📜", w: 3, need: { school: true, fn: (p) => p.school.grade > 70 },
  t: "Tes excellentes notes te valent le prix d'excellence du lycée, remis en grande pompe devant tous les élèves et leurs parents.",
  c: [
    D("Savourer la cérémonie", "🥂", "Tes parents sont rayonnants, et tes camarades font semblant d'applaudir.", { repute: 4, bonheur: 5, rel: { mere: 8, pere: 8 }, intel: 1 }),
    D("Offrir ton prix à tes parents", "💐", "Ils en pleurent. Tu es leur fierté.", { bonte: 4, rel: { mere: 12, pere: 12 }, bonheur: 4 }),
    D("Te cacher pour éviter les moqueries", "🙈", "Tu rases les murs. Le directeur t'attrape par la manche et t'accompagne.", { prudent: 2, repute: 2, bonheur: 1 }),
  ],
});

ev("pente_savon_course", {
  ages: [12, 14], tags: ["loufoque", "sport"], ic: "🛼🧼", w: 3,
  t: "Le grand concours annuel de glissade sur savon noir a lieu dans la cour du collège. Les lots sont des tickets de cinéma et une casquette de la mairie.",
  c: [
    C("Participer à fond", "🏁", [O(0.4, "Tu glisses jusqu'à la victoire ! Casquette et tickets de cinéma t'appartiennent.", { sport: 3, bonheur: 5, repute: 3, courage: 2 }), O(0.6, "Tu fais un vol plané, et tu finis dans la jardinière de la directrice.", { sante: -2, bonheur: 2, repute: 2 })]),
    D("Faire le commentateur", "🎤", "Ton commentaire est si drôle que les profs en pleurent de rire.", { charme: 3, creatif: 3, repute: 3, bonheur: 4 }),
    D("Rester au sec, c'est un jeu de fou", "☔", "Tu regardes le spectacle de loin. Ça valait le coup d'œil.", { prudent: 3 }),
  ],
});

ev("fete_sixieme_rentree", {
  ages: [12, 12], tags: ["ecole"], ic: "🎒🏫", w: 3, who: { ami: "friend" },
  t: "Ton ami $ami te lance un défi. Faire le tour du collège en sautant à cloche-pied pendant la récréation. Les surveillants ne comprendront pas.",
  c: [
    D("Relever le défi", "🐇", "Tu finis essoufflé(e) mais couvert(e) de gloire, un record absurde.", { sport: 2, courage: 3, repute: 3, bonheur: 4, rel: { ami: 6 } }),
    D("Refuser, tu as ta dignité", "🙅", "Tu gardes une posture plus digne que drôle.", { prudent: 2, repute: -1 }),
  ],
});

ev("ado_blog_secret", {
  ages: [13, 17], tags: ["loufoque", "amis"], ic: "📔🤫", w: 3,
  t: "Tu tiens un journal intime où tu écris tout, tes rêves, tes secrets, et le nom de ton prof de maths en version dragon. Un jour, tu le retrouves ouvert sur ton bureau.",
  c: [
    D("Faire une enquête pour trouver le coupable", "🕵️", "Tu identifies ton petit frère ou ta petite sœur. Rire jaune et pardon.", { intel: 3, rel: { sibling: -2 }, bonheur: 1 }),
    D("Réécrire tout pour que ce soit moins gênant", "✍️", "Tu inventes de nouvelles histoires. Tes talents d'auteur s'affinent.", { creatif: 4, bonheur: 1 }),
    D("Brûler le journal", "🔥", "Un grand feu de joie... et beaucoup de regrets.", { bonheur: -2, prudent: 2 }),
  ],
});

ev("reseaux_sociaux_scandale", {
  ages: [14, 17], tags: ["social"], ic: "📲😱", w: 4,
  t: "Une photo gênante de toi, prise en soirée, circule sur les réseaux. On y voit ton visage, des spaghettis et un caniche déguisé en fée.",
  c: [
    D("En rire et la partager toi-même", "😂", "Tu prends tout le monde de vitesse. La photo devient un mème, et tu deviens célèbre localement.", { charme: 3, repute: 3, bonheur: 3, sociable: 2 }),
    D("Exiger qu'on la retire", "✋", "Elle disparaît petit à petit. Tu respires, un peu honteux(se).", { courage: 2, bonheur: -2, repute: -1 }),
    D("Couper les réseaux pendant un mois", "🔌", "Un mois sans notification, tu redécouvres les livres et la nature.", { sante: 2, intel: 2, bonheur: 1, sociable: -1 }),
  ],
});

ev("danse_concours_lycee", {
  ages: [14, 17], tags: ["art"], ic: "💃🎶", w: 3,
  t: "Le lycée organise un concours de talents. Tu peux chanter, danser, jongler ou présenter un numéro de magie. Un jury de profs sera là, et les parents.",
  c: [
    C("Tenter un numéro de magie", "🪄", [O(0.5, "Tu fais disparaître la perruque du directeur. Triomphe absolu.", { creatif: 4, charme: 3, repute: 5, bonheur: 6 }), O(0.5, "Le tour rate, mais le directeur applaudit, soulagé.", { creatif: 2, bonheur: 2 })], { risk: 1 }),
    D("Chanter ta chanson préférée", "🎤", "Faux, mais avec l'âme. La salle chante en chœur.", { charme: 3, repute: 3, bonheur: 4 }),
    D("Inscrire un copain à ta place", "📝", "Il fait un numéro de flûte qui coûte cher à ses voisins. Tu rigoles.", { bonheur: 1, rel: { friend: 3 } }),
  ],
});

ev("stage_decouverte_3e", {
  ages: [14, 15], tags: ["travail", "ecole"], ic: "🧥🏢", w: 6, need: { school: true }, roll: { entreprise: "boites" },
  t: "C'est l'heure du stage d'observation. Tu atterris chez $entreprise. Ton tuteur te regarde comme un colis fragile et t'offre une tasse de café.",
  c: [
    D("Poser plein de questions", "❓", "Tu fais forte impression. Ton tuteur te propose de revenir l'été.", { intel: 2, ambition: 3, charme: 1, bonheur: 2, flag: "contact_pro" }),
    D("Faire le minimum", "😴", "Tu pointes, tu observes, tu rentres. Aucune étincelle.", { bonheur: -1, ambition: -1 }),
    D("Proposer des idées audacieuses", "💡", "Une de tes idées plaît au chef. Il la garde dans un tiroir en la prenant pour la sienne.", { creatif: 3, ambition: 3, bonheur: 1 }),
  ],
});

ev("grand_voyage_famille", {
  ages: [12, 17], tags: ["voyage", "famille"], ic: "🚐🏞️", w: 5, who: { pere: "pere", mere: "mere" },
  t: "Ta famille te propose un grand voyage cet été. Deux semaines sur la route, dans un camping-car prêté par un cousin. Les placards sont minuscules, les disputes inévitables.",
  c: [
    D("Embarquer avec joie", "🚐", "Des paysages magnifiques, des rires, et une panne mémorable. Ton père se révèle bricoleur.", { bonheur: 6, rel: { mere: 5, pere: 8 }, intel: 1 }),
    D("Râler pendant tout le trajet", "😤", "Tu passes deux semaines à bouder. La vue est belle, mais tu n'en profites pas.", { bonheur: -2, rel: { mere: -3, pere: -3 } }),
    D("Prendre en charge le GPS et la musique", "🎶", "Tu deviens le copilote officiel. Vous chantez à tue-tête à chaque tunnel.", { creatif: 2, bonheur: 5, rel: { pere: 6 } }),
  ],
});

ev("ado_chat_perdu_tarte", {
  ages: [12, 16], tags: ["loufoque", "amis"], ic: "🥧🐈", w: 3,
  t: "Une tarte géante est tombée du ciel au milieu du terrain de foot. Elle a des poils, des moustaches, et elle miaule. Les élèves se rassemblent autour avec curiosité.",
  c: [
    D("La nourrir avec du lait", "🥛", "La tarte-chat ronronne puis se met à fredonner une chanson pop. Tu es son héros.", { bonte: 3, creatif: 3, bonheur: 5, flag: "tarte_chat" }),
    D("La manger", "😋", "Elle était délicieuse. Le chat protestait un peu, mais c'était trop tard.", { honnete: -1, bonheur: 3, bonte: -4, sante: 1 }),
    D("L'exposer à la kermesse", "🎪", "Tu fais payer l'entrée. Ça rapporte plus que ton premier job.", { ambition: 3, argent: 120, repute: 2, bonheur: 3 }),
  ],
});

ev("anniv_18_ans_prep", {
  ages: [17, 17], tags: ["famille"], ic: "🎂🔟", w: 6, who: { mere: "mere", pere: "pere" },
  t: "Tu es à un an de la majorité. Tes parents te disent « Plus que 12 mois avant d'être libre ! » avec un sourire douloureux. Tu planifies déjà tout ce que tu vas faire.",
  c: [
    D("Économiser pour un projet fou", "💰", "Tu mets de côté chaque euro. Ça te donne un sentiment de pouvoir.", { prudent: 3, ambition: 2, argent: 200 }),
    D("Passer plus de temps avec la famille", "🏡", "Tu profites de chaque dîner, de chaque dispute. Bientôt, tout changera.", { bonte: 3, rel: { mere: 8, pere: 8 }, bonheur: 4 }),
    D("Préparer un grand tour du monde", "🌍", "Ton atlas est plein de punaises. Le futur te fait rêver.", { creatif: 2, courage: 2, bonheur: 3 }),
  ],
});

ev("sorcier_bonus_classe", {
  ages: [12, 15], tags: ["loufoque"], ic: "🧙‍♂️📈", w: 3,
  t: "Un sorcier miteux te propose un contrat magique. En échange de ta signature, il te promet une moyenne de 18/20 jusqu'à la fin de l'année. Il y a des petites lignes en bas, illisibles.",
  c: [
    C("Signer sans lire", "✍️", [O(0.5, "Tes notes explosent, mais le sorcier vient réclamer son dû. Il veut ton goûter pour toujours.", { notes: 25, intel: 3, honnete: -3, bonheur: -2 }), O(0.5, "Le contrat est un canular. Rien ne change, mais le sorcier a pris ton stylo.", { bonheur: -2, courage: 1 })], { risk: 2 }),
    D("Refuser avec dignité", "🙅", "Tu gardes ton âme et tes notes, en l'état.", { honnete: 4, prudent: 3 }),
    D("Négocier les clauses", "🧾", "Tu obtiens un contrat plus clair. Le sorcier est impressionné et te propose un stage.", { intel: 3, ambition: 3, charme: 2, notes: 6 }),
  ],
});

flash("Tu as reçu ta première lettre d'amour, rédigée par un camarade très maladroit.", { bonheur: 2, charme: 1 }, { ages: [12, 16], ic: "💌" });
flash("Tu t'es teint les cheveux en vert, ta mère a failli s'évanouir.", { charme: 1, bonheur: 2, rel: { mere: -2 }, repute: 1 }, { ages: [13, 17], ic: "💚" });
flash("Tu as gagné le concours de blagues de la classe, avec un jeu de mots sur le fromage.", { charme: 1, repute: 2, bonheur: 3 }, { ages: [12, 17], ic: "😂" });
flash("Tu as appris à jouer du triangle. Le professeur de musique en pleure d'émotion.", { creatif: 2, bonheur: 1 }, { ages: [12, 15], ic: "🎶" });
flash("Tu t'es disputé(e) avec ton meilleur ami pour une histoire de chips. Vous êtes réconciliés dès le lendemain.", { rel: { bestfriend: 2 }, bonheur: 1 }, { ages: [12, 17], ic: "🥔" });
flash("Un chat a dormi sur ton sac pendant tout un cours. Personne n'a osé le déloger.", { bonheur: 2 }, { ages: [12, 17], ic: "🐈" });
flash("Tu as raté le bus et tu as dû marcher trois kilomètres sous la pluie.", { sante: -1, bonheur: -2, sport: 1 }, { ages: [12, 17], ic: "🚌" });
flash("Tu as passé une nuit blanche à regarder une série et tu t'endors en cours.", { sante: -1, notes: -1, bonheur: 1 }, { ages: [13, 17], ic: "📺" });
flash("Le voisin t'a offert des tomates de son jardin. Tu en as fait de la sauce pour trois semaines.", { bonheur: 1, argent: 2 }, { ages: [12, 17], ic: "🍅" });
flash("Tu as perdu ton portable dans le bus, et quelqu'un l'a retrouvé et rapporté. Il reste des gens bien.", { bonheur: 2, repute: 1 }, { ages: [13, 17], ic: "📱" });
