// Rivalités, coups bas, arnaques et délires. Les coups bas et le trash respectent les réglages de la partie.
const { reg, bond, employed } = require("../socialkit");
const F = require("../feud");

reg({ id: "provocation", grp: "coup_bas", ic: "😏", l: "Lancer une provocation", d: "Un commentaire de travers, un regard de défi. La rivalité s'installe, ou s'enflamme.", hostile: true, mode: "direct",
  ages: [10, 90], w: 6, cool: 2, fit: (g, A, B, b) => 0.7 + b.riv / 20 + (b.tags.ex ? 1.5 : 0),
  direct: [
    { w: 0.6, a: { bonheur: 2, bonte: -2 }, b: { bonheur: -3 }, ta: "Ta pique tombe pile. $B hausse un sourcil et ravale sa réponse. La partie est lancée.", tb: "$A te lance une pique au moment où tu t'y attendais le moins. Tu rumines ta réplique jusqu'au soir.", bond: { riv: 10 } },
    { w: 0.4, a: { bonheur: -2, repute: -2 }, b: { bonheur: 1, repute: 1 }, ta: "$B te répond avec une réplique que tout le monde applaudit. Tu cherches un trou de souris.", tb: "Ta réplique à $A fait mouche et la salle applaudit. Tu savoures longtemps.", bond: { riv: 8 } },
  ] });

reg({ id: "sabotage", grp: "coup_bas", ic: "🪤", l: "Saboter un projet", d: "Un dossier égaré, un courriel mal orienté, un café renversé au bon moment. Tu ne laisses aucune trace, normalement.", hostile: true, mode: "direct",
  ages: [18, 75], w: 6, cool: 3, ok: (g, A, B, b) => employed(A) && employed(B), fit: (g, A, B, b) => (b.riv >= 15 ? 1.5 : 0.35),
  direct: [
    { w: 0.6, special: "sabotage_ok", a: { honnete: -3, bonheur: 3 }, b: { perf: -10, repute: -2, bonheur: -4 }, ta: "Le rapport de $B arrive avec un jour de retard et un café dessus. Personne ne soupçonne rien, sauf peut-être le café.", tb: "Ton dossier a disparu. Tu retrouves un morceau de ton rapport dans la corbeille d'un collègue.", bond: { riv: 14, aff: -6 } },
    { w: 0.4, a: { repute: -6, perf: -6, bonheur: -4 }, b: { perf: 2, bonheur: 1 }, ta: "Une caméra a tout filmé. Tu passes un entretien désagréable avec les ressources humaines, qui est assez long pour qu'on t'offre un siège.", tb: "Tu surprends $A en train de déplacer ton dossier. Tu fais semblant de ne rien voir, puis tu en parles à tout l'étage.", bond: { riv: 14, aff: -8 }, news: "🪤 $A a été pris(e) en train de saboter le travail de $B." },
  ] });

reg({ id: "chantage", grp: "coup_bas", ic: "🕶️", l: "Faire chanter", d: "Une photo gênante, un secret mal gardé et une enveloppe à déposer dans une cabine. Tu sais ce que tu fais, en théorie.", hostile: true, mature: true, mode: "direct",
  ages: [25, 80], w: 4, cool: 4, fit: (g, A, B, b) => (b.riv >= 20 ? 1.5 : 0.3) * (B.cash > 20000 || B.stats.repute > 70 ? 1.4 : 1),
  direct: [
    { w: 0.55, a: { honnete: -5 }, b: { bonheur: -6 }, ta: "$B paie sans broncher, avec un regard qui promet une vengeance lente et méthodique.", tb: "Tu paies. Tu rumines. Tu notes mentalement le nom de $A dans ton carnet noir.", bond: { riv: 20, aff: -10 }, special: "blackmail" },
    { w: 0.45, a: { repute: -10, bonheur: -5 }, b: { bonheur: 1, repute: 2 }, ta: "$B file droit chez la police avec ton message. Tu passes un après-midi désagréable dans un bureau gris.", tb: "Tu apportes le message de $A à la police, qui prend l'affaire très au sérieux. Tu vis plus légèrement ensuite.", bond: { riv: 20, aff: -10 }, news: "📬 $A a tenté de faire chanter $B et s'est fait remarquer." },
  ] });

reg({ id: "arnaque", grp: "coup_bas", ic: "🎩", l: "Vendre une affaire en or", d: "Un terrain sur la lune, un tableau signé par un ami d'enfance, ou un super plan de retraite. Le charme fait le reste.", hostile: true, mature: true, mode: "direct",
  ages: [20, 80], w: 4, cool: 4, ok: (g, A, B, b) => b.aff < 70,
  direct: [
    { w: 0.55, a: { honnete: -4, bonheur: 3 }, b: { bonheur: -4 }, ta: "$B tombe dans le panneau et sort son chéquier. Tu quittes la table avec le sourire du chat qui a mangé le canari.", tb: "Tu comprends deux jours trop tard que le terrain de $A est sur la lune. Littéralement.", bond: { riv: 14, aff: -12 }, special: "scam" },
    { w: 0.45, a: { repute: -6, bonheur: -3 }, b: { bonheur: 1 }, ta: "$B flaire l'arnaque et appelle un conseiller. Tout le monde est au courant avant la fin de la semaine.", tb: "Tu flaires l'arnaque de $A à trois kilomètres. Tu racontes l'histoire à tous les dîners pendant un mois.", bond: { riv: 12 }, news: "🎩 $A a tenté d'arnaquer $B et s'est ridiculisé(e)." },
  ] });

reg({ id: "vengeance", grp: "coup_bas", ic: "🧨", l: "Se venger d'un coup bas", d: "On t'a fait du tort, tu n'as pas oublié. Un plat qui se mange froid, avec un peu de piment.", hostile: true, mode: "direct",
  ages: [14, 90], w: 14, prio: 1, cool: 2, coolPair: 2, ok: (g, A, B, b) => (g.grievances || []).some((x) => x.v === A.seat && x.c === B.seat && !x.used && x.round >= g.round - 3) || (b.riv >= 25 && (!!b.tags.ex || !!b.tags.betrayed)) || b.riv >= 55,
  direct: [
    { w: (g, A, B) => F.odds(g, A, B, 0.55), special: "vengeance_ok", a: { bonheur: 5, bonte: -2 }, b: { repute: -4, bonheur: -6 }, ta: "Ta vengeance est subtile, élégante et parfaitement injuste. $B ne comprend pas ce qui lui arrive. Toi si.", tb: "Quelqu'un vient de te rendre une monnaie que tu pensais avoir oubliée. Tu n'as pas la moindre idée de qui.", bond: { riv: 12, aff: -5 } },
    { w: (g, A, B) => 1 - F.odds(g, A, B, 0.55), special: "vengeance_ko", a: { bonheur: -3, repute: -3 }, b: { bonheur: 1 }, ta: "Ta vengeance échoue de façon spectaculaire. Il y a des plumes, des cris, des témoins.", tb: "La vengeance de $A tourne mal. Tu observes la scène depuis un banc, avec un sourire sans pitié.", bond: { riv: 12 }, news: "🧨 La vengeance de $A contre $B a tourné au fiasco." },
  ] });

reg({ id: "faire_eloge", grp: "amitie", ic: "📣", l: "Faire l'éloge d'un autre devant tout le monde", d: "Un compliment sincère, au bon moment, devant les bonnes personnes. La réputation de l'autre y gagne, la tienne aussi.", mode: "direct",
  ages: [12, 100], w: 6, cool: 2, coolPair: 3,
  direct: [
    { w: 1, a: { repute: 2, bonte: 1 }, b: { repute: 4, bonheur: 4 }, ta: "Ton éloge de $B fait mouche. Les gens écoutent, hochent la tête, retiennent le nom.", tb: "Tu apprends que $A a dit du bien de toi devant des gens importants. Tu rougis d'un coup.", bond: { aff: 10 } },
  ] });

// ---------- délires, pour les parties très folles ----------
reg({ id: "pari_absurde", grp: "delire", ic: "🎲", l: "Parier sur un détail absurde", d: "Combien de temps un pigeon restera sur le banc, le prénom du prochain facteur, la couleur du chapeau. Tout se parie.", loufoque: true,
  ages: [10, 100], w: 6, cool: 2,
  yes: [
    { w: 0.5, a: { bonheur: 5, argent: 150 }, b: { bonheur: -2, argent: -150 }, ta: "Le pigeon reste exactement quarante-sept minutes, comme tu l'avais prédit. Tu encaisses, magnanime.", tb: "Le pigeon s'envole après une minute. Tu perds le pari, et une certaine foi en la nature.", bond: { aff: 4, riv: 3 } },
    { w: 0.5, a: { bonheur: -2, argent: -150 }, b: { bonheur: 5, argent: 150 }, ta: "Le pigeon reste trois heures. Tu perds ton pari et tu comprends que $B l'a nourri en cachette.", tb: "Ton pigeon reste trois heures sur le banc. Personne ne soupçonne les miettes de pain dans ta poche.", bond: { aff: 4, riv: 3 } },
  ],
  no: { ta: "$B refuse de parier sur un pigeon. Un homme sans imagination.", bond: { aff: -1 } } });

reg({ id: "chasse_tresor", grp: "delire", ic: "🗺️", l: "Partir à la chasse au trésor", d: "Une carte dessinée à la main, une pelle, et un cœur qui bat plus vite que nécessaire.", loufoque: true,
  ages: [8, 70], w: 6, cool: 3, ok: (g, A, B, b) => b.aff >= 12,
  yes: [
    { w: 0.25, a: { argent: 900, bonheur: 7 }, b: { argent: 900, bonheur: 7 }, ta: "Vous trouvez un coffre rempli de pièces rouillées, d'un vieux livre et d'une montre. L'antiquaire du coin vous en offre un bon prix.", tb: "Le trésor existe ! Une petite fortune, des pièces rouillées et une montre arrêtée qui vaut très cher.", bond: { aff: 14 }, news: "🗺️ $A et $B ont découvert un vrai trésor." },
    { w: 0.75, a: { bonheur: 5, sport: 1 }, b: { bonheur: 5, sport: 1 }, ta: "Vous creusez pendant des heures et trouvez deux boutons, une cuillère et un caillou intéressant. Ce fut une belle journée.", tb: "Tu creuses avec $A jusqu'à la nuit. Le trésor n'existait pas, mais le sandwich oui.", bond: { aff: 10 } },
  ],
  no: { ta: "$B pense que les cartes au trésor ne sont jamais fiables. Tu y vas seul, ça n'a pas du tout le même goût.", bond: { aff: -1 } } });

reg({ id: "echange_vies", grp: "delire", ic: "🔄", l: "Échanger de vie pendant une journée", d: "Tu prends son planning, ses habitudes, ses chaussettes. Il ou elle prend les tiennes.", loufoque: true,
  ages: [14, 90], w: 5, cool: 3, ok: (g, A, B, b) => b.aff >= 14,
  yes: [
    { w: 0.6, a: { intel: 1, bonte: 2, bonheur: 4 }, b: { intel: 1, bonte: 2, bonheur: 4 }, ta: "Tu comprends pourquoi $B est tout le temps fatigué(e). L'inverse est vrai, ce qui rend la soirée plus tendre.", tb: "Vivre la journée de $A te rend admiratif(ve). Et reconnaissant(e) de ta propre routine.", bond: { aff: 15 } },
    { w: 0.4, a: { bonheur: 2, repute: -1 }, b: { bonheur: 2 }, ta: "Ton remplaçant ou remplaçante dit au chef que le café est « surévalué ». Tu récoltes des regards.", tb: "Tu remplaces $A à la réunion et tu prononces le mot « synergie » sans rire. On te félicite.", bond: { aff: 9 } },
  ],
  no: { ta: "$B trouve ta vie bien trop compliquée pour qu'on la prenne en main. Vexant et vrai.", bond: { aff: -1 } } });

reg({ id: "secte_tarte", grp: "delire", ic: "🥧", l: "Fonder la secte de la tarte", d: "Une doctrine simple, un goûter par semaine et une robe de laine à fleurs. L'adhésion est gratuite, la dévotion à la pâte brisée est totale.", loufoque: true,
  ages: [18, 90], w: 4, cool: 4, ok: (g, A, B, b) => b.aff >= 15 && !b.tags.secte,
  yes: [
    { w: 0.4, a: { repute: 3, bonheur: 6, sociable: 3, argent: 400 }, b: { repute: 2, bonheur: 6, sociable: 3, argent: 400 }, ta: "La secte attire quarante adeptes dès le premier mois. Les dons affluent, la pâte aussi, et le gourou en chef s'appelle toujours $A.", tb: "La secte de la tarte de $A compte vite quarante fidèles. Tu es nommé(e) grand maître du fruit rouge.", bond: { aff: 12 }, tag: "secte", news: "🥧 $A et $B fondent la secte de la tarte, quarante fidèles déjà." },
    { w: 0.6, a: { bonheur: 4, creatif: 2 }, b: { bonheur: 4, creatif: 2 }, ta: "La secte compte deux membres, un chat et un voisin curieux. C'est suffisant pour un premier goûter.", tb: "Avec $A, la secte de la tarte a des débuts modestes. Mais les tartes sont excellentes.", bond: { aff: 9 }, tag: "secte" },
  ],
  no: { ta: "$B refuse de rejoindre la secte. Tu respectes sa liberté de croire ou de ne pas croire aux fruits rouges.", bond: { aff: -1 } } });

reg({ id: "concours_moustache", grp: "delire", ic: "🥸", l: "Défier à un concours de moustache", d: "Cirée, frisée, tressée ou imaginaire. Le jury est composé d'un chat et de deux oncles.", loufoque: true,
  ages: [16, 90], w: 5, cool: 3,
  yes: [
    { w: (g, A, B) => 0.5 + (A.stats.charme - B.stats.charme) / 400, a: { charme: 1, repute: 3, bonheur: 5 }, b: { bonheur: 2 }, ta: "Ta moustache est sacrée meilleure du canton. L'oncle gauche pleure, l'oncle droit hurle d'admiration.", tb: "Ta moustache finit deuxième. C'est la plus belle défaite de ta carrière.", bond: { aff: 6, riv: 3 } },
    { w: (g, A, B) => 0.5 - (A.stats.charme - B.stats.charme) / 400, a: { bonheur: 2 }, b: { charme: 1, repute: 3, bonheur: 5 }, ta: "$B gagne avec une moustache en forme de point d'exclamation. Tu félicites, les dents serrées.", tb: "Ta moustache en point d'exclamation décroche le grand prix. Le chat te regarde avec respect.", bond: { aff: 6, riv: 3 } },
  ],
  no: { ta: "$B n'a aucune moustache et refuse d'en coller une. Peu sportif.", bond: { aff: -1 } } });

// ---------- après une rupture, ou quand l'ambiance se gâte ----------
reg({ id: "scene_ex", grp: "coup_bas", ic: "🎭", l: "Faire une scène à son ex", d: "Un restaurant bondé, une voix qui porte, et des affaires qui volent. Tout le monde en parlera, toi aussi.", hostile: true, mode: "direct",
  ages: [16, 90], w: 13, cool: 2, coolPair: 3, ok: (g, A, B, b) => !!b.tags.ex && !A.partner,
  direct: [
    { w: 0.55, a: { bonheur: 2, repute: -3 }, b: { bonheur: -5, repute: -2 }, ta: "Tu fais une scène mémorable à $B devant tout le restaurant. Un serveur t'applaudit, un autre appelle la sécurité.", tb: "$A te fait une scène en public. Tu rougis jusqu'aux oreilles et tu finis ton dessert tout seul.", bond: { riv: 10, aff: -4 }, news: "🎭 $A a fait une scène à son ex $B, devant tout le monde." },
    { w: 0.45, a: { bonheur: -4, repute: -4 }, b: { bonheur: 1 }, ta: "Ta scène tourne au ridicule. Tu glisses sur une serviette et tu termines à terre sous les yeux de $B, qui garde un calme olympien.", tb: "La scène de $A tourne au gag. Tu gardes ton sérieux jusqu'à la sortie, puis tu éclates de rire.", bond: { riv: 6 } },
  ] });

reg({ id: "medisance", grp: "coup_bas", ic: "🐍", l: "Dire du mal dans son dos", d: "Une confidence fausse, un air faussement navré, et la réputation de l'autre qui se dégonfle un peu.", hostile: true, mode: "direct",
  ages: [12, 100], w: 7, cool: 2, coolPair: 3, ok: (g, A, B, b) => b.aff < 50 || !!b.tags.ex, fit: (g, A, B, b) => 0.8 + b.riv / 40 + (b.tags.ex ? 1 : 0),
  direct: [
    { w: 0.65, a: { bonheur: 2, honnete: -2 }, b: { repute: -4, bonheur: -3 }, ta: "Tu glisses deux ou trois horreurs sur $B à la bonne personne. Le bruit court plus vite que toi.", tb: "Tu apprends que $A raconte des horreurs sur toi. Tu n'as même pas besoin de savoir lesquelles.", bond: { riv: 9, aff: -6 } },
    { w: 0.35, a: { repute: -5, bonheur: -3 }, b: { bonheur: 1 }, ta: "La personne à qui tu te confiais est la meilleure amie de $B. Elle sourit très poliment.", tb: "On te rapporte les médisances de $A, avec le nom du témoin. L'histoire se retourne contre lui.", bond: { riv: 9 } },
  ] });

reg({ id: "draguer_couple", grp: "coup_bas", ic: "😈", l: "Draguer quelqu'un déjà en couple", d: "Il y a un conjoint, une alliance, un dîner de famille. Et toi, un sourire dangereux.", hostile: true, mature: true, mode: "direct",
  ages: [20, 70], w: 6, cool: 3, coolPair: 4, ok: (g, A, B, b) => !!B.partner && !(A.partner && A.partner.player === B.seat) && b.aff >= 8, fit: (g, A, B, b) => (A.stats.charme >= 60 ? 1.4 : 0.8) * (b.riv > 40 ? 0.5 : 1),
  direct: [
    { w: 0.5, a: { bonheur: 5, honnete: -4, charme: 1 }, b: { bonheur: -2, honnete: -3 }, ta: "$B se laisse draguer un peu trop longtemps. Tu rentres chez toi en sifflotant, et la suite n'appartient qu'à vous.", tb: "$A te fait un numéro de charme. Tu hésites, puis tu rentres tard. Quelque chose a changé.", bond: { aff: 6, riv: 6 }, tag: "tentation" },
    { w: 0.5, a: { bonheur: -3, repute: -4 }, b: { bonheur: 2 }, ta: "$B te met poliment à distance, et en parle à son conjoint en riant. Tu évites le prochain dîner.", tb: "$A tente sa chance. Tu éclates de rire et tu racontes tout au dîner. La tentative n'a jamais été renouvelée.", bond: { riv: 10, aff: -8 } },
  ] });

reg({ id: "amis_apres_rupture", grp: "paix", ic: "☕", l: "Rester amis après la rupture", d: "Un café, un long silence, et une phrase qui commence par « on n'a pas tout raté ».", prio: 1,
  ages: [16, 100], w: 8, cool: 3, coolPair: 4, ok: (g, A, B, b) => !!b.tags.ex && !A.partner && !B.partner && b.riv < 40,
  yes: [
    { w: 1, a: { bonheur: 4 }, b: { bonheur: 4 }, ta: "Un café, deux silences, un fou rire. Avec $B, c'est fini, mais pas tout à fait perdu.", tb: "Avec $A, vous prenez un café. L'histoire d'amour est finie, l'amitié commence timidement.", bond: { aff: 16, riv: -22 }, untag: "ex", tag: "ami_ex" },
  ],
  no: { a: { bonheur: -2 }, ta: "$B refuse de te revoir. C'est encore trop frais.", bond: { aff: -2 } } });
