// Choix de vie de l'enfance, de l'adolescence et des études
const { reg, out, examSoon, tier, net } = require("../lifekit");

const kid = { school: true, ages: [6, 11] };
const school = { school: true, ages: [6, 17] };
const teen = { school: true, ages: [12, 17] };

// ---- les classiques de l'école ----
reg({ id: "bosser", grp: "ecole", l: "Bosser dur", ic: "📚", d: "Beaucoup de devoirs. Les notes montent.", need: school, fx: { notes: 9, intel: 2, bonheur: -2 }, hook: "study", w: 6, fit: (p) => (p.school.grade < 60 ? 1.4 : 0.9) });
reg({ id: "ecole_zen", grp: "ecole", l: "École tranquille", ic: "🎒", d: "Ni trop, ni trop peu.", need: school, fx: { notes: 2, bonheur: 1 }, w: 4 });
reg({ id: "chahut", grp: "ecole", l: "Faire le clown", ic: "🤡", d: "Les rires de la classe valent bien un zéro.", need: school, fx: { notes: -5, charme: 1, bonheur: 4, sociable: 3, repute: -1 }, w: 4, fit: (p) => (p.traits.sociable > 50 ? 1.4 : 0.8) });
reg({ id: "club_sport", grp: "sport", l: "Club de sport", ic: "⚽", d: "Tu t'inscris et tu transpires.", need: school, fx: { sport: 5, sante: 2, notes: -1, bonheur: 1 }, fit: (p) => (p.stats.sport >= 50 ? 1.5 : 0.9) });
reg({ id: "arts", grp: "arts", l: "Musique et dessin", ic: "🎨", d: "Tu développes ta fibre artistique.", need: school, fx: { creatif: 4, intel: 1, bonheur: 2 }, fit: (p) => (p.traits.creatif >= 52 ? 1.5 : 0.9) });
reg({ id: "copains", grp: "social", l: "Vie sociale", ic: "🧑‍🤝‍🧑", d: "Plus de copains, moins de devoirs.", need: school, fx: { sociable: 4, charme: 1, bonheur: 3, notes: -2 } });
reg({ id: "lecture", grp: "ecole", l: "Livres et bibliothèque", ic: "📖", d: "Tu dévores tout ce qui s'écrit.", need: school, fx: { intel: 3, notes: 3, sociable: -1 }, fit: (p) => (p.stats.intel >= 50 ? 1.3 : 0.8) });

// ---- nouveautés pour les petits ----
reg({ id: "cabane", grp: "loisir", l: "Construire une cabane", ic: "🛖", d: "Planches, ficelle et secret absolu.", need: kid, cool: 2,
  outs: [out(0.6, "Ta cabane tient debout, pour un temps. Tu y tiens des réunions ultra secrètes avec ton équipe de deux.", { creatif: 3, bonheur: 4, courage: 1 }), out(0.4, "La cabane s'effondre pendant l'inauguration, avec le gâteau. Tu as appris l'architecture à la dure.", { creatif: 1, bonheur: 2, sante: -1 })] });
reg({ id: "velo", grp: "sport", l: "Apprendre le vélo sans roulettes", ic: "🚲", d: "Il faut se lancer, même sans les petites roues.", need: { school: true, ages: [6, 9] }, cool: 3,
  outs: [out(0.7, "Tu pédales seul(e) devant toute la famille qui applaudit. Le trottoir, lui, est vexé.", { sport: 4, courage: 3, bonheur: 5 }), out(0.3, "Quelques genoux écorchés plus tard, tu maîtrises presque la direction.", { sport: 2, courage: 2, sante: -1 })] });
reg({ id: "bonbons", grp: "argent", l: "Vendre des bonbons dans la cour", ic: "🍬", d: "Un petit commerce, des gros risques.", need: { school: true, ages: [8, 13] }, cool: 2,
  outs: [out(0.55, "Tes bonbons partent comme des petits pains. Tu fais un joli bénéfice et quelques jaloux.", { argent: 45, ambition: 2, bonheur: 2 }), out(0.45, "La maîtresse confisque tout le stock. Elle te rend les bonbons à la fin de l'année, avec un sourire suspect.", { argent: -10, ambition: 1, repute: -1 })] });
reg({ id: "animal", grp: "famille", l: "Prendre soin d'un animal", ic: "🐹", d: "Un hamster, un poisson, un escargot qui court vite.", need: { school: true, ages: [6, 12] }, cool: 3,
  outs: [out(1, "Tu t'occupes de ton compagnon avec un grand sérieux. Il ne dit rien, mais il t'écoute comme personne.", { bonte: 3, bonheur: 4 })] });
reg({ id: "magie", grp: "arts", l: "Apprendre des tours de magie", ic: "🎩", d: "Pièce disparue, carte retrouvée, public sceptique.", need: { school: true, ages: [7, 14] }, cool: 3,
  outs: [out(0.6, "Tu étonnes tes cousins avec une pièce qui disparaît. Elle ne réapparaîtra jamais, mais le tour était superbe.", { creatif: 3, charme: 2, bonheur: 3 }), out(0.4, "Ton lapin préféré refuse de sortir du chapeau. Le public applaudit quand même, par pitié.", { creatif: 2, bonheur: 1 })] });
reg({ id: "lego", grp: "loisir", l: "Construire un château en briques", ic: "🧱", d: "Trois mille pièces et un pied qui s'en souvient.", need: { school: true, ages: [6, 12] }, cool: 2,
  outs: [out(1, "Ton château de briques occupe tout le salon. Les parents contournent les tours en marchant sur la pointe des pieds.", { creatif: 3, intel: 1, bonheur: 3 })] });
reg({ id: "colo", grp: "social", l: "Partir en colonie de vacances", ic: "⛺", d: "Chansons, moustiques et premier amour de bus.", need: { school: true, ages: [7, 14] }, cool: 3, cost: 300,
  outs: [out(0.7, "Tu reviens bronzé(e), enroué(e) d'avoir chanté, avec trois nouveaux amis et un coup de soleil historique.", { sociable: 4, sport: 2, bonheur: 5 }), out(0.3, "Une nuit, vous cherchez le monstre du lac avec des lampes torches. Vous trouvez le cuisinier.", { courage: 3, bonheur: 4 })] });

// ---- nouveautés pour les collégiens et lycéens ----
reg({ id: "delegue", grp: "social", l: "Te présenter comme délégué de classe", ic: "🗳️", d: "Une campagne, un programme, des promesses.", need: { school: true, ages: [9, 17] }, cool: 3,
  outs: [out((p) => 0.35 + (p.stats.charme - 50) / 200 + (p.traits.sociable - 50) / 250, "Tu gagnes l'élection avec un programme sérieux, une cantine moins grise et des récréations plus longues. Tes camarades te portent en triomphe.", { repute: 4, sociable: 3, ambition: 2, bonheur: 4 }, true), out((p) => 0.65 - (p.stats.charme - 50) / 200, "Tu perds contre un élève qui promettait des frites tous les jours. La démocratie est cruelle.", { bonheur: -2, ambition: 1 })] });
reg({ id: "groupe_musique", grp: "arts", l: "Monter un groupe de musique", ic: "🎸", d: "Un batteur, une guitare et trois idées de nom.", need: { school: true, ages: [12, 17] }, cool: 3, fit: (p) => (p.traits.creatif >= 48 ? 1.6 : 0.6),
  outs: [out(0.45, "Votre premier concert, dans le garage d'un ami, rassemble vingt personnes. Les voisins en appellent dix de plus par la fenêtre.", { creatif: 4, sociable: 3, repute: 2, bonheur: 5 }, true), out(0.55, "Le groupe se sépare avant le premier concert. Le chanteur voulait seulement les tee-shirts.", { creatif: 2, bonheur: 0 })] });
reg({ id: "jeux_video", grp: "loisir", l: "Passer tes nuits sur les jeux vidéo", ic: "🎮", d: "Une dernière partie, et ensuite on dort. Peut-être.", need: { school: true, ages: [8, 17] }, cool: 2,
  outs: [out(0.7, "Ton niveau grimpe, tes notes dégringolent. Tes cernes, eux, ont une vie à part entière.", { notes: -5, bonheur: 4, sante: -1, intel: 1 }), out(0.3, "Tu gagnes un petit tournoi en ligne, devant quatre spectateurs et une mère inquiète.", { notes: -3, bonheur: 5, repute: 1, intel: 2 })] });
reg({ id: "theatre", grp: "arts", l: "Faire du théâtre", ic: "🎭", d: "Un rôle d'arbre, ou de roi, c'est le sort qui décide.", need: { school: true, ages: [9, 17] }, cool: 3, fit: (p) => (p.stats.charme >= 50 ? 1.4 : 0.9),
  outs: [out(0.5, "Tu joues un grand rôle devant la salle des fêtes. On t'applaudit, on te reconnaît dans la rue du village.", { charme: 3, creatif: 2, repute: 2, bonheur: 4 }, true), out(0.5, "Tu joues un arbre. Tu es un arbre magnifique, immobile et très respecté.", { charme: 1, courage: 2, bonheur: 2 })] });
reg({ id: "soutien", grp: "ecole", l: "Prendre des cours de soutien", ic: "🧑‍🏫", d: "Une heure de plus par semaine, pour de vrai.", need: school, cost: 400, cool: 2, fit: (p) => (p.school.grade < 55 ? 2.4 : p.school.grade < 70 ? 0.8 : 0.2),
  outs: [out(1, "Ton prof particulier, patient et obstiné, te réconcilie avec les fractions. Les notes remontent doucement.", { notes: 7, intel: 1 })] });
reg({ id: "revise_exam", grp: "ecole", prio: 4, cool: 0, ic: "📝", need: { school: true }, fit: (p) => (examSoon(p) === "brevet" || examSoon(p) === "bac" || examSoon(p) === "rattrapage" ? 1 : 0),
  l: (p) => (examSoon(p) === "brevet" ? "Réviser le brevet à fond" : "Préparer le bac sérieusement"),
  d: "Un an de révisions ciblées, qui augmente nettement tes chances de réussir l'examen de cette année.",
  fx: { notes: 4, intel: 1, bonheur: -2 }, flag: "revise_exam", hook: "study" });
reg({ id: "echange", grp: "voyage", l: "Partir en échange scolaire", ic: "🌍", d: "Six mois dans une famille étrangère, avec un chien qui parle une autre langue.", need: { school: true, ages: [14, 17] }, cost: 800, cool: 3, fit: (p) => (tier(p) >= 1 || p.flags.classe_aisee ? 1.2 : 0.5),
  outs: [out(0.7, "Tu reviens en parlant une autre langue, avec des histoires que personne ne comprend et un accent qui fait rire ta grand-mère.", { intel: 3, sociable: 3, charme: 1, bonheur: 5 }), out(0.3, "Le mal du pays te prend, tu manges un fromage importé en pleurant. Mais tu as grandi.", { courage: 3, intel: 2, bonheur: 1 })] });
reg({ id: "youtube", grp: "arts", l: "Lancer ta chaîne de vidéos", ic: "📹", d: "Trois spectateurs, dont ta mère.", need: { ages: [13, 40], noprison: true }, cool: 3, fit: (p) => (p.traits.creatif >= 50 ? 1.5 : 0.6),
  outs: [out(0.06, "Une de tes vidéos devient virale pour une raison que tu ne comprends toujours pas. Les abonnés arrivent par milliers.", { argent: 4000, repute: 6, charme: 2, bonheur: 6, flag: "mini_influenceur" }, true), out(0.54, "Tes vidéos montent doucement. Quelques fidèles te suivent, dont un qui commente tout en majuscules.", { creatif: 3, bonheur: 2, argent: 150 }), out(0.4, "Tes vidéos font quarante vues, dont trente-neuf de ta famille.", { creatif: 2, bonheur: -1 })] });
reg({ id: "baby_sitting", grp: "argent", l: "Faire du baby-sitting", ic: "🍼", d: "Quelques sous contre des cris et des histoires du soir.", need: { school: true, ages: [13, 19] }, cool: 1,
  outs: [out(0.7, "Les enfants dorment, tu as vidé le frigo des voisins, et tu empoches un joli billet.", { argent: 600, bonte: 1, bonheur: 1 }), out(0.3, "Les enfants t'ont ligoté(e) à une chaise avec des guirlandes. Les parents te paient le double.", { argent: 900, courage: 2, bonheur: 2 })] });
reg({ id: "fugue_nuit", grp: "loisir", l: "Faire le mur une nuit", ic: "🌙", d: "Une soirée interdite, un grillage trop haut.", need: { school: true, ages: [13, 17] }, tag: "mature", cool: 3,
  outs: [out(0.55, "Tu rentres à l'aube sans te faire repérer, avec des histoires pour dix ans.", { courage: 3, sociable: 2, bonheur: 4 }), out(0.45, "Ta mère t'attendait dans l'entrée, assise, avec un thé et un regard pire que le thé.", { courage: 2, bonheur: -3, repute: -1 })] });
reg({ id: "premiere_cigarette", grp: "loisir", l: "Essayer une cigarette derrière le gymnase", ic: "🚬", d: "Une mauvaise idée pour faire la maligne.", need: { school: true, ages: [13, 17] }, tag: "mature", cool: 4, w: 2,
  outs: [out(0.5, "Tu tousses pendant dix minutes devant tes amis. Tu décides que ce n'était pas pour toi.", { sante: -1, bonheur: -1, prudent: 2 }), out(0.5, "Tu t'y habitues, et ça ne s'arrangera pas avec les années.", { sante: -2, courage: 1, flag: "fumeur" })] });

// ---- jobs et argent de poche pour les jeunes ----
reg({ id: "petit_boulot", grp: "argent", l: "Petit boulot", ic: "💶", d: "Quelques sous gagnés à la sueur du front.", need: { ages: [14, 25], nojob: true }, hook: "petitboulot", fx: { sante: -1, notes: -1 }, cool: 1, fit: (p) => (tier(p) <= 1 ? 1.6 : 0.8) });

// ---- études supérieures ----
reg({ id: "etudier", grp: "etudes", prio: 3, cool: 0, ic: "🎓", d: (p) => "Tu avances vers ton diplôme" + (p.school.endAge ? ", examens finaux dans " + Math.max(0, p.school.endAge - p.age) + " an" + (p.school.endAge - p.age > 1 ? "s" : "") : "") + ".", l: "Étudier sérieusement",
  need: { studying: true }, fx: { notes: 8, intel: 2, bonheur: -2 }, hook: "study" });
reg({ id: "vie_etudiante", grp: "social", l: "Vie étudiante", ic: "🍻", d: "Soirées, amis, et un peu de cours.", need: { studying: true }, fx: { notes: -3, bonheur: 5, sociable: 3, sante: -1 }, cost: 600, w: 5 });
reg({ id: "stage", grp: "travail", l: "Stage et job d'étudiant", ic: "🗂️", d: "L'argent de poche et le CV avancent ensemble.", need: { studying: true }, fx: { notes: -1, ambition: 2 }, hook: "petitboulot", w: 5 });
reg({ id: "erasmus", grp: "voyage", l: "Partir un semestre à l'étranger", ic: "🛫", d: "Une ville nouvelle, des amis du monde entier, un lave-linge incompréhensible.", need: { studying: true }, cost: 1500, cool: 4,
  outs: [out(0.8, "Tu rentres avec une langue de plus, trois histoires d'amour de gare et un nouveau regard.", { intel: 2, sociable: 3, charme: 2, bonheur: 5 }), out(0.2, "Tu rates deux partiels mais tu gagnes un ami à vie dans un pays de cinq millions d'habitants.", { notes: -4, sociable: 4, bonheur: 5 })] });
reg({ id: "asso_etudiante", grp: "social", l: "Présider l'association étudiante", ic: "🎪", d: "Des bières, des budgets et des réunions interminables.", need: { studying: true }, cool: 3,
  outs: [out(0.7, "Ta soirée de rentrée est un triomphe. Les chiffres sont presque justes. Tu apprends à gérer les gens, ce qui est pire que gérer l'argent.", { sociable: 4, ambition: 3, repute: 3, notes: -2, bonheur: 3 }), out(0.3, "La caisse de l'association est vide, personne ne sait pourquoi. Tu as une idée, mais tu te tais.", { ambition: 2, repute: -3, bonheur: -1 })] });
reg({ id: "triche_partiel", grp: "etudes", l: "Tricher aux partiels", ic: "📎", d: "Antisèche, oreillette ou courage de saint.", need: { studying: true }, tag: "mature", cool: 3, w: 2,
  outs: [out(0.6, "Personne ne remarque rien. Les notes grimpent, la conscience, elle, fait la grève.", { notes: 8, honnete: -4, bonheur: 1 }), out(0.4, "Tu es pris(e) en train de lire ta manche. Le jury te convoque, et tu ne sais plus où te mettre.", { notes: -6, honnete: -3, repute: -5, bonheur: -5 })] });
reg({ id: "revise_diplome", grp: "etudes", prio: 4, cool: 0, ic: "📝", need: { studying: true }, fit: (p) => (examSoon(p) === "diplome" ? 1 : 0), l: "Préparer les examens finaux", d: "Une année entière pour mettre toutes les chances de ton côté avant le grand jour.", fx: { notes: 4, intel: 1, bonheur: -2 }, flag: "revise_exam", hook: "study" });

// ---- reprendre des études à l'âge adulte ----
reg({ id: "reprise_bac", grp: "etudes", l: "Passer ton bac en candidat libre", ic: "🎒", d: "Il n'est jamais trop tard pour décrocher le diplôme que tu n'as pas eu.", need: { ages: [18, 40], nostudy: true, school: false, retired: false }, cost: 300, cool: 4, prio: 1,
  fit: (p) => (p.school.edu < 3 && !p.school.diplomas.includes("bacpro") ? 1.5 : 0),
  outs: [out(1, "Tu t'inscris pour passer le bac en candidat libre. Dans un an, tu auras ta chance.", { school: (p) => ({ phase: "sup", track: "bac_libre", target: "bac", endAge: p.age + 1 }), ambition: 2 }, true)] });
reg({ id: "formation_metier", grp: "etudes", l: "Passer un diplôme de métier", ic: "🛠️", d: "Une formation courte qui mène à un diplôme reconnu et à un vrai métier.", need: { ages: [18, 55], nostudy: true, school: false, retired: false }, cool: 4, cost: 500,
  fit: (p) => (p.school.edu < 2 ? 1.4 : 0),
  outs: [out(1, "Tu t'inscris à une formation de métier. Au bout d'un an, tu auras ton diplôme ou la poussière de l'atelier.", { school: (p) => ({ phase: "sup", track: "metier", target: "bacpro", endAge: p.age + 1 }), ambition: 2 }, true)] });
reg({ id: "reprise_etudes", grp: "etudes", l: "Reprendre des études", ic: "🏛️", d: "Tu retournes sur les bancs de la fac, avec dix ans de plus et dix fois plus de motivation.", need: { ages: [20, 55], nostudy: true, school: false, retired: false, edu: 3 }, cool: 5, fit: (p) => (p.stats.intel >= 52 && p.school.edu <= 4 ? 1.1 : 0),
  scene: "reprise_orient" });
