// Vie professionnelle — scènes génériques et scènes propres à chaque métier
const { ev, flash, O, C, D } = require("../kit");
const R = require("../rules");

// ---------- Génériques ----------
ev("promotion_proposee", {
  ages: [22, 62], tags: ["travail"], ic: "📈🎉", w: 5, need: { job: true, exp: [3, null] }, once: false, cool: 4,
  t: "Ton travail ne passe pas inaperçu. Ta direction te convoque et évoque un nouveau poste, plus de responsabilités et une augmentation, avec un sourire poli qui promet beaucoup de réunions.",
  c: [
    C("Accepter la promotion", "🚀", [O(0.75, "Tu grimpes d'un échelon. Nouveau bureau, nouvelle plante verte.", { promote: true, ambition: 2, bonheur: 4, perf: 5, sante: -1 }), O(0.25, "Tu es promu{|e} mais le poste est un nid de guêpes. Les ennuis s'enchaînent.", { promote: true, bonheur: -2, sante: -3, perf: -5 })]),
    D("Négocier un plus gros salaire", "💰", "Tu obtiens une prime et un titre. Ta direction note ton audace.", { raise: 0.12, charme: 1, ambition: 2, perf: 2 }),
    D("Refuser pour garder ta tranquillité", "🧘", "Tu aimes ta vie telle qu'elle est. Le patron soupire.", { prudent: 2, bonheur: 3, perf: -3 }),
  ],
});

ev("augmentation_demande", {
  ages: [22, 62], tags: ["travail", "argent"], ic: "💶🙏", w: 5, need: { job: true }, once: false, cool: 3,
  t: "Les prix montent, ton salaire non. Tu prépares ton argumentaire devant le miroir de la salle de bain. Ton reflet te dit que tu devrais oser.",
  c: [
    C("Demander une augmentation", "💬", [O(0.5, "Accordée ! Ton chef parle de « reconnaissance de ton engagement ».", { raise: 0.1, ambition: 2, bonheur: 4 }), O(0.5, "« Pas le bon moment » dit-il, pour la huitième fois.", { bonheur: -2, ambition: 1 })]),
    D("Chercher un autre poste", "🔎", "Tu envoies quelques CV, juste pour voir.", { jobHunt: true, ambition: 1 }),
    D("Prendre ton mal en patience", "🕰️", "Un jour, on te reconnaîtra. Peut-être.", { prudent: 1, bonheur: -1 }),
  ],
});

ev("collegue_toxique", {
  ages: [20, 62], tags: ["travail"], ic: "🐍💼", w: 5, need: { job: true }, who: { collegue: "colleague" },
  t: "$collegue s'attribue tes idées en réunion, sourit dans ton dos et laisse ses tasses sales sur ton bureau. Il n'a pas le droit d'être aussi efficace dans la fourberie.",
  c: [
    D("L'affronter directement", "🗣️", "Une discussion tendue, mais honnête. Il se calme, un peu.", { courage: 3, honnete: 2, rel: { collegue: -8 }, perf: 2 }),
    C("Le dénoncer au patron", "📣", [O(0.5, "Le patron te donne raison, $collegue est recadré.", { repute: 2, perf: 4, rel: { collegue: -25 } }), O(0.5, "Le patron pense que tu cherches la bagarre.", { repute: -3, perf: -4, rel: { collegue: -15 } })], { risk: 1 }),
    D("Faire profil bas", "🤫", "Tu serres les dents et tu travailles dans ton coin.", { prudent: 2, bonheur: -3 }),
    C("Lui rendre la pareille", "😈", [O(0.5, "Tu le pièges avec la machine à café. Tout le monde en rit.", { creatif: 2, bonte: -2, rel: { collegue: -20 }, bonheur: 2 }), O(0.5, "Ton plan se retourne contre toi.", { repute: -4, perf: -5, bonte: -2 })], { risk: 1 }),
  ],
});

ev("patron_dragon", {
  ages: [20, 62], tags: ["travail"], ic: "🐲📞", w: 4, need: { job: true }, who: { chef: "boss" },
  t: "$chef te convoque à 18 h 52 pour un dossier « urgentissime ». Ses mails arrivent la nuit, ses exigences le dimanche, ses compliments jamais.",
  c: [
    D("Tout lâcher pour le dossier", "🔥", "Tu travailles jusqu'à minuit. $chef grogne un « pas mal ».", { perf: 8, sante: -3, bonheur: -3, ambition: 2 }),
    C("Lui dire non poliment", "✋", [O(0.5, "Il est surpris puis te respecte. Ton cadre de travail s'améliore.", { courage: 3, perf: 2, bonheur: 3, rel: { chef: 5 } }), O(0.5, "Il te déteste désormais.", { perf: -6, rel: { chef: -20 }, bonheur: -2 })], { risk: 1 }),
    D("Poser un congé maladie diplomatique", "🤒", "Un petit repos bien mérité. Ou presque.", { sante: 2, honnete: -2, perf: -2, bonheur: 2 }),
  ],
});

ev("equipe_seminaire", {
  ages: [22, 62], tags: ["travail", "loufoque"], ic: "🏕️🙈", w: 4, need: { job: true },
  t: "Séminaire d'entreprise en pleine forêt. Au programme, trampolines humains, cris de guerre, jeux de rôle et un atelier de cuisine collective où personne ne sait cuisiner.",
  c: [
    D("Jouer le jeu à fond", "🎭", "Tu es l'âme du séminaire. Le patron te félicite pour ton énergie.", { sociable: 3, perf: 4, bonheur: 4, repute: 2 }),
    D("Rester discret", "🌲", "Tu regardes la forêt en pensant à ton canapé.", { prudent: 1, bonheur: 0 }),
    C("Proposer un jeu de ton cru", "🎲", [O(0.5, "Un triomphe. Tout le monde en veut encore.", { creatif: 3, perf: 5, bonheur: 5, repute: 3 }), O(0.5, "Un fiasco épique.", { creatif: 2, repute: -2, bonheur: 1 })], { risk: 1 }),
  ],
});

ev("pause_cafe_ragots", {
  ages: [20, 62], tags: ["travail"], ic: "☕🗣️", w: 5, need: { job: true }, who: { collegue: "colleague" },
  t: "À la machine à café, $collegue chuchote un ragot croustillant sur la direction. La machine bipe, tout le monde se rapproche, la rumeur galope.",
  c: [
    D("Écouter sans commenter", "🤐", "Tu écoutes et tu retiens, comme un bon espion.", { prudent: 2, intel: 1 }),
    C("Propager le ragot", "📢", [O(0.5, "Tu deviens la personne qui sait tout. Les gens t'adorent... ou s'en méfient.", { sociable: 3, repute: 2, honnete: -2 }), O(0.5, "Le ragot remonte jusqu'au patron.", { repute: -5, perf: -4, honnete: -2 })], { risk: 1 }),
    D("Changer de sujet", "🙄", "Tu parles du temps. La machine à café reprend le dessus.", { honnete: 2, bonte: 1 }),
  ],
});

ev("erreur_cher_dossier", {
  ages: [20, 62], tags: ["travail"], ic: "🧾😬", w: 4, need: { job: true }, roll: { somme: [1000, 25000, 1000] },
  t: "Ton regard tombe sur une erreur dans le dossier que tu viens d'envoyer au client. Une virgule mal placée qui coûte $somme à la boîte.",
  c: [
    D("Avouer immédiatement", "🙋", "Ton chef n'est pas ravi mais apprécie ta franchise.", { honnete: 4, perf: -2, repute: 1 }),
    C("Tenter de réparer discrètement", "🕵️", [O(0.5, "Personne n'a rien vu. Tu respires.", { courage: 2, honnete: -1 }), O(0.5, "L'erreur est découverte. Tu es sanctionné{|e}.", { perf: -10, honnete: -3, repute: -3 })], { risk: 1 }),
    D("Mettre la faute sur un collègue", "😈", "Il se fait gronder à ta place. Tu as un goût amer dans la bouche.", { honnete: -5, bonte: -3, perf: 2 }),
  ],
});

ev("teletravail_chaos", {
  ages: [22, 62], tags: ["travail", "loufoque"], ic: "🏠💻", w: 4, need: { job: true },
  t: "Une visioconférence avec le grand patron tourne mal. Ton chat saute sur le clavier, ton enfant crie, ton voisin perce un mur, et tu as oublié de couper ta caméra.",
  c: [
    D("Rire de la situation", "😂", "Tout le monde rit avec toi. Tu deviens la star de l'équipe.", { charme: 2, sociable: 2, repute: 2, bonheur: 3 }),
    D("S'excuser platement", "🙇", "Le patron hausse un sourcil, mais ça passe.", { honnete: 1, perf: -1 }),
    D("Couper la caméra et faire semblant", "📵", "Personne n'est dupe. Personne ne dit rien.", { prudent: 1, perf: -2 }),
  ],
});

ev("deplacement_pro", {
  ages: [22, 62], tags: ["travail", "voyage"], ic: "💼✈️", w: 4, need: { job: true }, roll: { pays: "pays" },
  t: "Ton entreprise t'envoie en déplacement pro à destination de $pays. Un hôtel anonyme, un client exigeant et une réunion à 8 h après dix heures d'avion.",
  c: [
    D("Bosser sérieusement", "📊", "Le contrat est signé, tu rentres épuisé{|e} mais salué{|e}.", { perf: 8, ambition: 2, sante: -1 }),
    D("Profiter du séjour", "🏖️", "Tu visites un peu, tu manges beaucoup, tu travailles un tout petit peu.", { bonheur: 6, perf: -2, sociable: 1 }),
    C("Combiner travail et rencontre", "🤝", [O(0.5, "Tu signes un contrat et trouves une belle amitié.", { perf: 6, bonheur: 5, sociable: 3 }), O(0.5, "Tu rates ta réunion à cause d'un excès de dîner.", { perf: -6, bonheur: 3 })], { risk: 1 }),
  ],
});

ev("startup_idee_collegue", {
  ages: [24, 50], tags: ["travail", "argent"], ic: "💡🤝", w: 3, need: { job: true, money: [3000, null] }, who: { collegue: "colleague" },
  t: "$collegue te prend à part. « J'ai une idée géniale, on quitte tout et on monte une boîte. J'ai déjà le nom et un logo en cours de dessin ».",
  c: [
    C("Se lancer ensemble", "🚀", [O(0.25, "L'entreprise décolle à une vitesse folle. Vous voilà patrons.", { quit: true, ambition: 4, argent: 8000, item: { kind: "entreprise", name: "La start-up de $collegue", value: 120000 }, bonheur: 6 }), O(0.75, "Après un an de galère, elle ferme. Il vous reste l'amitié... ou pas.", { quit: true, argent: -6000, ambition: 2, bonheur: -3, jobHunt: true })], { cost: 3000, risk: 2 }),
    D("Décliner mais l'encourager", "👍", "Il se lance seul. Tu suis ses aventures de loin.", { prudent: 2, bonheur: 1 }),
    D("Lui dire que c'est une très mauvaise idée", "🙅", "Il en est vexé. Il ne te parle plus pendant un mois.", { honnete: 2, rel: { collegue: -10 } }),
  ],
});

ev("fusion_entreprise", {
  ages: [26, 60], tags: ["travail"], ic: "🏢🔀", w: 3, need: { job: { illicit: false } },
  t: "Ton entreprise annonce une fusion. Tout le monde parle de synergies, d'optimisation et de restructuration, ce qui veut dire que la moitié des gens vont partir.",
  c: [
    C("Se faire remarquer", "🌟", [O(0.55, "Tu es retenu{|e}, avec une belle promotion en prime.", { promote: true, ambition: 2, perf: 6 }), O(0.45, "Tu es remercié{|e}. L'indemnité est correcte.", { fire: true, argent: 5000, bonheur: -3, jobHunt: true })]),
    D("Faire profil bas", "🫥", "Tu passes entre les gouttes.", { prudent: 2, perf: 0 }),
    D("Prendre l'indemnité et partir", "💶", "Tu quittes l'entreprise avec un chèque et un sourire.", { quit: true, argent: 6000, courage: 2, jobHunt: true }),
  ],
});

ev("promotion_mauvaise_surprise", {
  ages: [24, 60], tags: ["travail"], ic: "😬📉", w: 3, need: { job: { min: 1 } },
  t: "Un jeune cadre plein de diplômes est nommé directeur au-dessus de toi. Il parle d'« agilité », d'« écosystème » et de « disruption », sans savoir où se trouve la photocopieuse.",
  c: [
    D("Lui apprendre le métier", "🤝", "Il t'est reconnaissant. Une alliance surprenante.", { bonte: 2, perf: 4, repute: 2 }),
    C("Le laisser se planter", "🍿", [O(0.5, "Il tombe, toi aussi tu y gagnes ta place.", { ambition: 2, perf: 5, honnete: -1 }), O(0.5, "Les ennuis te retombent dessus.", { perf: -6, bonheur: -2 })]),
    D("Postuler ailleurs", "🔎", "Tu en as assez de l'écosystème.", { jobHunt: true, ambition: 1 }),
  ],
});

ev("mutation_proposee", {
  ages: [24, 55], tags: ["travail"], ic: "🌍💼", w: 3, need: { job: true },
  t: "Ta société te propose une mutation à $ville, avec un meilleur salaire, un petit logement de fonction et une promesse de soleil trois jours par an.",
  c: [
    D("Accepter", "🧳", "Un nouveau départ, de nouvelles rencontres.", { city: true, raise: 0.1, courage: 2, bonheur: 2, argent: -1000 }),
    D("Refuser", "🏡", "Tu restes là où sont les tiens.", { prudent: 2, bonheur: 2 }),
  ],
});

ev("formation_continue", {
  ages: [26, 58], tags: ["travail"], ic: "🎓📋", w: 4, need: { job: true },
  t: "Ton entreprise propose une formation, trois jours dans un hôtel à la campagne. Le thème, « gérer son temps efficacement ». Le programme dure quarante heures.",
  c: [
    D("S'y inscrire sérieusement", "📝", "Tu en ressors plus efficace, un peu plus gris.", { intel: 2, perf: 5, ambition: 1 }),
    D("Y aller pour le buffet", "🍰", "La formation est l'excuse, le buffet le prétexte.", { bonheur: 3, perf: 1, sante: -1 }),
    D("Décliner", "🙅", "Tu préfères travailler à ton rythme.", { prudent: 1 }),
  ],
});

ev("heures_sup", {
  ages: [20, 62], tags: ["travail", "argent"], ic: "⏰💶", w: 4, need: { job: { illicit: false } },
  t: "Un gros projet débarque. La direction propose des heures supplémentaires, payées correctement, mais aux dépens de tes soirées et de ta patience.",
  c: [
    D("Accepter volontiers", "💪", "Tu t'épuises un peu, ton compte en banque aussi, dans le bon sens.", { argent: 2400, perf: 6, sante: -3, bonheur: -2 }),
    D("Refuser", "🙅", "Ta vie privée reste intacte, ta carrière un peu moins.", { perf: -3, bonheur: 2 }),
    D("Négocier des congés en échange", "🤝", "Un compromis habile. Tu pars en week-end prolongé.", { perf: 2, bonheur: 3, argent: 500 }),
  ],
});

ev("licenciement_dans_dos", {
  ages: [22, 60], tags: ["travail"], ic: "🔪📄", w: 2, need: { job: { illicit: false }, stat: { repute: [null, 40] } },
  t: "Ton entreprise te remet une lettre en main propre, sèche et dactylographiée. Tu es licencié{|e} pour faute grave, officiellement parce que tu aurais « mangé la dernière part de gâteau du comité ».",
  c: [
    C("Contester", "⚖️", [O(0.5, "L'injustice est reconnue, tu touches des indemnités.", { fire: true, argent: 7000, honnete: 2, bonheur: 1, jobHunt: true }), O(0.5, "Procès perdu. Fin de partie.", { fire: true, bonheur: -5, jobHunt: true })]),
    D("Rebondir immédiatement", "🏃", "Tu pars la tête haute et le carton sous le bras.", { fire: true, courage: 2, jobHunt: true }),
  ],
});

ev("nouveau_job_offre", {
  ages: [21, 60], tags: ["travail"], ic: "📬✨", w: 4, need: { job: true, exp: [2, null] }, once: false, cool: 4,
  t: "Un chasseur de têtes t'appelle. Une grande entreprise cherche quelqu'un dans ton domaine. Salaire plus élevé, promesses brillantes et un babyfoot.",
  c: [
    C("Passer l'entretien", "🤵", [O(0.55, "Tu es pris{|e} ! Nouveau poste, nouvelle vie.", { jobHunt: true, ambition: 2, bonheur: 3 }), O(0.45, "Tu n'es pas retenu{|e}, mais tu as gagné en assurance.", { courage: 1, charme: 1 })]),
    D("Refuser, tu es bien là", "🛋️", "Fidélité récompensée par une plante en cadeau.", { prudent: 2, bonheur: 2, perf: 2 }),
  ],
});

// ---------- Une scène à deux versions par métier ----------
const SPEC = {
  resto: [
    ["Le coup de feu du samedi soir déborde. Quarante couverts en retard, un client exige « un poulet sans poulet ». Le chef crie des mots que tu ne connais qu'en sauce.", "Tu inventes un plat de génie dans la cuisine, devant un critique gastronomique.", "Tu brûles trois assiettes et un tablier."],
    ["Un critique anonyme dîne dans ton établissement. Tout le monde le sait, personne ne sait lequel est le critique.", "Le critique adore. Un article élogieux paraît dans le journal local.", "Il trouve le pain trop salé et le dit à la ville entière."],
  ],
  commerce: [
    ["Les soldes sont arrivés. Une armée de clients affamés charge les portiques. Ton rayon ressemble à un champ de bataille de pull-overs.", "Tu fais le plus gros chiffre de la journée et un client t'offre des chocolats.", "Une bousculade mal gérée, un mannequin à terre, un fou rire nerveux."],
    ["Un client se plaint à voix haute que la couleur d'un t-shirt est « trop bleue ». Il exige un remboursement et la présence du directeur.", "Ta diplomatie sauve la situation, il repart avec trois t-shirts.", "Tu l'énerves, il poste un avis incendiaire en ligne."],
  ],
  btp: [
    ["Sur le chantier, la grue se bloque au-dessus d'une poutre. Les ouvriers regardent le ciel en croisant les doigts. Le chef te regarde, toi.", "Tu trouves la solution et décoinces la grue sous les applaudissements.", "La poutre tombe de peu à côté d'un camion."],
    ["Un client change tous les plans la veille de la livraison. Il veut une piscine à la place du garage.", "Tu t'adaptes avec brio et factures un joli supplément.", "Le client refuse de payer, l'ambiance est glaciale."],
  ],
  sante: [
    ["Une nuit de garde à l'hôpital, tout s'enchaîne. Une urgence, un fou rire, un patient qui jure qu'il est Napoléon.", "Ton sang-froid sauve un patient. L'équipe t'applaudit au petit matin.", "Tu fais une petite erreur de dosage, vite rattrapée, mais tu sues à grosses gouttes."],
    ["Un patient très célèbre arrive aux urgences en robe de chambre en or. Il exige une chambre avec jacuzzi.", "Tu le soignes avec tact, il te remercie dans une interview.", "Il refuse tes soins, tu perds ton calme."],
  ],
  droit: [
    ["Un dossier épineux atterrit sur ton bureau. Un client riche accusé d'avoir volé un bateau, qu'il jure avoir seulement « emprunté ».", "Ta plaidoirie fait mouche, le client est relaxé.", "Le juge te regarde avec des yeux de cobra, tu perds."],
    ["Le tribunal t'accorde dix minutes pour plaider une affaire de voisinage. Une histoire de chèvre qui a mangé un tableau de maître.", "Tu convaincs le juge, l'affaire est classée.", "La chèvre bêle pendant ta plaidoirie, personne ne t'écoute."],
  ],
  tech: [
    ["Un bug mystérieux paralyse la plateforme. Le client appelle toutes les cinq minutes. Il paraît que ça ne devrait pas se produire un vendredi.", "Tu trouves la faille en pleine nuit. Les serveurs repartent.", "Tu aggraves tout en voulant bien faire."],
    ["La direction veut intégrer une « IA révolutionnaire » dans le produit, dès lundi. Personne ne sait ce que cela veut dire.", "Tu livres un prototype étonnant, on t'invite à le présenter.", "Le prototype répond « 42 » à toutes les questions."],
  ],
  finance: [
    ["Les marchés s'affolent. Tes écrans clignotent de rouge. Un collègue crie « vends tout ! », un autre « achète tout ! ».", "Tu choisis la bonne direction et réalises un gain énorme.", "Tu rates le bon moment, la perte est cuisante."],
    ["Un client te confie un portefeuille important en insistant sur la discrétion. Il exige de la croissance sans risque.", "Tu gères avec brio, il te félicite.", "Le portefeuille dégringole, il te rappelle chaque heure."],
  ],
  enseignement: [
    ["Ta classe de trente élèves est en ébullition. Un cafard apparaît dans le cartable d'Inès, un cri retentit, et le tableau interactif décide de planter.", "Tu retournes la situation en cours de sciences naturelles. Les élèves adorent.", "Tu perds le contrôle, le directeur passe par hasard."],
    ["Des parents d'élèves exigent une réunion urgente, parce que leur enfant n'a eu que 19 sur 20.", "Tu les rassures avec calme, ils repartent apaisés.", "Ils déposent une pétition."],
  ],
  arts: [
    ["Ton spectacle est complet ce soir. La salle bruisse. Dans la dernière rangée, un producteur très célèbre s'est assis.", "Tu donnes le meilleur de toi-même, il t'offre un contrat.", "Un trou de mémoire et un décor qui tombe. Tu improvises mal."],
    ["Une galerie accepte d'exposer tes œuvres. Le vernissage est dans une semaine, les murs sont nus.", "Le public est enthousiaste, plusieurs œuvres se vendent.", "Seuls trois visiteurs passent, dont ta mère."],
  ],
  sportpro: [
    ["Match décisif ! Les tribunes grondent, ton entraîneur te regarde avec insistance. Ton genou craque un peu.", "Tu marques le but de la victoire. Le stade explose.", "Tu rates l'occasion, les huées pleuvent."],
    ["Un journaliste te demande ta recette secrète de la réussite. Tu bégaies que c'est « beaucoup de pâtes ».", "Ta réponse devient virale, les sponsors affluent.", "Ta phrase est reprise en moquerie par les humoristes."],
  ],
  politique: [
    ["Réunion publique dans la salle des fêtes. Trois cents personnes, un micro défaillant, et un habitant qui hurle contre les pigeons.", "Ton discours enflamme la salle, tu es applaudi{|e} longuement.", "Le micro grésille, ton discours fait un bide."],
    ["Un scandale éclate dans ton camp. Un adjoint aurait détourné le budget des feux d'artifice. On réclame ta réaction.", "Tu prends tes responsabilités avec dignité, ta cote remonte.", "Tu défends l'indéfendable, les médias t'étrillent."],
  ],
  ordre: [
    ["Une course-poursuite éclate dans les rues de $ville. Le suspect prend un tramway à contresens. Ton collègue hurle, tu accélères.", "Tu l'interceptes avec brio, félicité par le commissaire.", "Tu perds sa trace, il t'a semé en poussette."],
    ["Dans une affaire sensible, on te confie une mission discrète. Tu dois surveiller un suspect qui semble très observateur.", "Tu obtiens les preuves, l'affaire est résolue.", "Tu es repéré{|e} dès le premier jour, ton cache-nez ne fait illusion."],
  ],
  science: [
    ["Après des mois d'expériences, ta découverte pourrait changer la science. Ou le résultat vient d'une erreur de calcul, on ne sait pas.", "Les résultats sont confirmés, ton article fait sensation.", "L'erreur est confirmée, tu gagnes un silence gêné."],
    ["Un laboratoire concurrent publie une étude suspecte, étrangement proche de la tienne.", "Tu portes l'affaire avec élégance, la vérité éclate.", "Ta contestation est ignorée, tu perds du prestige."],
  ],
  libre: [
    ["Un client majeur menace de partir. Ton agenda déborde, ton ordinateur chauffe, ta tasse de café est la quatrième de la matinée.", "Tu le fidélises par une idée géniale, ton chiffre d'affaires grimpe.", "Il part, ton mois s'annonce maigre."],
    ["Une grosse commande arrive d'un client qui paie tard et exige tôt. Tout le monde te dit de te méfier.", "Il paie à temps, tout se passe bien.", "Il ne paie jamais, tu perds un mois de salaire."],
  ],
  transport: [
    ["Un orage violent s'abat sur la route. Les essuie-glaces vont à toute vitesse, ton chargement de poulets en porcelaine menace de se renverser.", "Tu arrives à bon port, intact, tu reçois une prime.", "Un dérapage, des poulets à terre, la franchise grimpe."],
    ["Retard de livraison à cause d'un embouteillage monstre. Le client menace de ne plus travailler avec ton employeur.", "Tu réussis à livrer à l'heure par un détour astucieux.", "Tu arrives avec trois heures de retard, l'ambiance est glaciale."],
  ],
  media: [
    ["Le direct commence dans une minute. Ton oreillette grésille, ton invité est en retard, ton prompteur affiche une recette de gâteau.", "Tu improvises et tu captives l'audience. Les chiffres montent.", "Tu bafouilles, tu rougis, c'est un naufrage en direct."],
    ["Un scandale touche ta chaîne. Une rumeur dit que tu aurais une liaison avec ta maquilleuse. C'est faux.", "Tu rétablis la vérité avec humour, ça te rend plus populaire.", "La rumeur grossit, ton image en souffre."],
  ],
  agri: [
    ["La récolte s'annonce excellente, mais un orage de grêle menace. Ton voisin t'aide à tendre des bâches, vous êtes tous les deux trempés.", "La récolte est sauvée, le marché te sourit.", "La grêle ravage la moitié du champ."],
    ["Un acheteur étranger vient visiter ta ferme et t'offre un contrat avantageux. Il veut tout goûter, y compris la vache.", "Tu le séduis, le contrat est signé.", "Le contrat tombe à l'eau, un taureau a mal pris la visite."],
  ],
  cirque: [
    ["Ton numéro est le clou du spectacle. Les projecteurs, les roulements de tambour, un tigre qui baille. Un spectateur dans la salle se met à hurler.", "Tu exécutes ton numéro à la perfection, ovation debout.", "Un faux pas, un nez rouge qui tombe, un rire d'enfant. Tu reprends en riant."],
    ["Le directeur du cirque te propose une tournée internationale. Les roulottes sont inconfortables mais le monde est vaste.", "Tu pars sillonner l'Europe, le succès est total.", "La tournée est annulée à cause d'un éléphant malade."],
  ],
  public: [
    ["Un dossier traîne depuis trois ans dans ton bureau. Il est coincé entre deux tampons, un formulaire et un trombone.", "Tu le fais avancer d'un coup magique, ta hiérarchie te félicite.", "Le dossier se perd, tu ne le retrouveras jamais."],
    ["Un usager mécontent hurle au guichet parce qu'on lui a demandé un justificatif de justificatif.", "Tu lui trouves une solution et il te serre la main.", "Il filme la scène, ça devient viral."],
  ],
  hotel: [
    ["Un client célèbre loge dans l'hôtel et exige des oreillers en plume de cygne et un thé servi à 3 h 07 du matin.", "Tu le satisfais, il laisse un énorme pourboire.", "Il quitte l'hôtel en laissant un avis assassin."],
    ["Une fuite d'eau inonde les chambres le jour d'un congrès. Les clients, en peignoir, s'agglutinent dans le hall.", "Tu gères la crise et offres le petit-déjeuner. Le congrès se termine joyeusement.", "L'hôtel doit rembourser plusieurs chambres."],
  ],
  immo: [
    ["Une cliente veut acheter une maison où elle a vu un fantôme. Elle y tient. Elle veut aussi une remise.", "Tu signes la vente avec un joli bénéfice.", "Elle renonce, la maison reste sur les bras."],
    ["Un promoteur te propose de vendre un terrain dont le propriétaire dit qu'il est maudit. Il y a des champignons parlants.", "Tu fais une belle commission.", "L'affaire se retourne contre toi."],
  ],
  ingenierie: [
    ["Le pont que tu as conçu va être inauguré. Les élus coupent le ruban, les caméras filment, une inquiétante fissure apparaît.", "Tu rectifies in extremis, le pont tient.", "Un affaissement, une enquête, un énorme scandale."],
    ["Ton prototype d'aspirateur nucléaire fascine la direction. Le premier essai doit avoir lieu en public.", "L'essai est une réussite éclatante.", "L'aspirateur explose en confettis."],
  ],
  presse: [
    ["Tu enquêtes sur un scandale local de pots-de-vin. Un informateur anonyme te donne un indice dans un parking sombre.", "Ton article fait grand bruit et te vaut une récompense.", "Ton article est démenti, une plainte tombe."],
    ["Ton rédacteur en chef réclame un titre accrocheur pour demain. Il suggère « Un cochon fait le tour du monde en ballon ».", "Ton papier s'arrache, tu deviens la star de la rédaction.", "Le cochon n'existait pas, tu es ridiculisé{|e}."],
  ],
  crime: [
    ["Un gros coup se prépare. Une banque, une nuit, un plan en trois étapes dessiné sur une serviette en papier.", "Le coup réussit, un butin gras comme une oie de Noël.", "La police débarque, tu t'enfuis in extremis."],
    ["Un rival du Milieu veut te dépouiller. Il envoie des hommes en costume rayé à ta porte, avec une boîte de chocolats piégée.", "Tu déjoues le piège avec panache.", "Tu perds une partie de ton butin."],
  ],
};
Object.keys(SPEC).forEach((tr) => {
  const T = R.TRACKS[tr];
  SPEC[tr].forEach((spec, i) => {
    const [intro, win, lose] = spec;
    const illicit = !!T.illicit;
    ev("pro_" + tr + "_" + (i + 1), {
      ages: [T.age, T.maxAge || 62], tags: illicit ? ["travail", "mature"] : ["travail"], ic: T.ic + "💼", w: 5, need: { job: tr }, once: false, cool: 3,
      t: intro,
      c: [
        C("Foncer, c'est le moment de briller", "🚀", [O(0.5, win, { perf: 9, ambition: 2, repute: 3, bonheur: 4, argent: Math.round(T.levels[0][1] * 0.08), exp: 1 }), O(0.5, lose, { perf: -7, bonheur: -3, sante: -1, repute: -2 })], { risk: 1 }),
        D("Jouer la prudence", "🛡️", "Tu fais ton travail sans éclat. Rien de grave, rien de glorieux.", { prudent: 2, perf: 1 }),
        C("Chercher un raccourci", "🥷", [O(0.45, "Le raccourci fonctionne. Personne n'y voit rien.", { perf: 5, honnete: -2, creatif: 1 }), O(0.55, "Le raccourci te revient dans la figure.", { perf: -8, honnete: -2, repute: -3 })], { risk: 1 }),
      ],
    });
  });
});

flash("Une photocopieuse tombe en panne. Un drame de bureau se joue.", { bonheur: -1 }, { ages: [20, 62], need: { job: true } });
flash("Ton collègue apporte des croissants. Il est l'homme du jour.", { bonheur: 2 }, { ages: [20, 62], need: { job: true } });
flash("Ton chef t'offre un mug « employé du mois ». Il est fêlé.", { perf: 1, bonheur: 1 }, { ages: [20, 62], need: { job: true } });
flash("Ton badge ne marche plus. Tu entres derrière quelqu'un en faisant semblant de téléphoner.", { bonheur: 0 }, { ages: [20, 62], need: { job: true } });
flash("L'ascenseur te laisse coincé{|e} dix minutes avec le directeur. Vous parlez de pêche.", { perf: 2, bonheur: 1 }, { ages: [20, 62], need: { job: true } });
flash("Une tasse de café renversée sur un clavier. Tu pleures en silence.", { bonheur: -1, argent: -60 }, { ages: [20, 62], need: { job: true } });
flash("Un client te laisse un avis cinq étoiles avec des fautes d'orthographe adorables.", { perf: 2, bonheur: 2 }, { ages: [18, 62], need: { job: true } });
flash("Tu gagnes un gâteau à la tombola de l'entreprise. Il est aux navets.", { bonheur: 1 }, { ages: [20, 62], need: { job: true } });
