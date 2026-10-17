// Actions de l'enfance et de l'adolescence. Pas d'argent ici, des jeux, des pactes, des cabanes et des premiers émois.
const { reg, bond, single } = require("../socialkit");

const KID = [6, 13];
const TEEN = [13, 18];

reg({ id: "pacte_copains", grp: "amitie", ic: "🤞", l: "Faire un pacte de copains", d: "Un serment solennel, une poignée de main secrète et un goûter partagé.",
  ages: [6, 14], w: 8, cool: 3, ok: (g, A, B, b) => !b.tags.pacte,
  yes: [{ w: 1, a: { bonheur: 4, sociable: 2 }, b: { bonheur: 4, sociable: 2 }, ta: "$B accepte le pacte avec un sérieux de notaire. Vous scellez le tout avec une poignée de main secrète et un biscuit coupé en deux.", tb: "Tu jures fidélité éternelle à $A, une main sur le cœur et l'autre sur le goûter.", bond: { aff: 22 }, tag: "pacte" }],
  no: { a: { bonheur: -2 }, ta: "$B trouve que les pactes, c'est pour les bébés. Tu te consoles avec un biscuit.", bond: { aff: -2 } } });

reg({ id: "cabane_commune", grp: "jeu", ic: "🛖", l: "Construire une cabane ensemble", d: "Des planches, du carton, un drapeau et beaucoup d'ambition architecturale.",
  ages: KID, w: 8, cool: 2,
  yes: [
    { w: 0.75, a: { creatif: 3, bonheur: 4 }, b: { creatif: 3, bonheur: 4 }, ta: "La cabane tient debout, avec un toit, une porte et un règlement intérieur de quatorze articles. $B en est le gardien officiel.", tb: "Tu construis avec $A une cabane magnifique. Le règlement interdit les grands, les épinards et les filles de CE2 trop curieuses.", bond: { aff: 12 }, tag: "cabane" },
    { w: 0.25, a: { creatif: 2, bonheur: 2 }, b: { creatif: 2, bonheur: 2 }, ta: "La cabane s'effondre au premier coup de vent. Vous en riez jusqu'au soir, assis sur les ruines.", tb: "La cabane de $A et toi s'effondre en deux secondes. Fou rire immédiat.", bond: { aff: 8 } },
  ],
  no: { ta: "$B préfère jouer seul. Tu construis ta cabane tout seul et elle est très bien, merci.", bond: { aff: -1 } } });

reg({ id: "echange_cartes", grp: "jeu", ic: "🃏", l: "Échanger des cartes à collectionner", d: "Les raretés valent de l'or, les doubles valent de la patience.",
  ages: [7, 14], w: 7, cool: 2,
  yes: [
    { w: 0.65, a: { bonheur: 4, intel: 1 }, b: { bonheur: 4, intel: 1 }, ta: "L'échange est équitable. Chacun repart avec la carte qui lui manquait et un sourire de collectionneur.", tb: "Vous échangez vos cartes sans dispute. $A a la carte de ton rêve et toi la sienne.", bond: { aff: 8 } },
    { w: 0.35, a: { bonheur: 5, honnete: -3 }, b: { bonheur: -4, prudent: 2 }, ta: "Tu refiles à $B une carte brillante mais abîmée contre la plus belle de sa collection. Tu rentres chez toi avec un petit sourire et un petit poids sur la conscience.", tb: "Tu comprends trop tard que la carte brillante de $A est pliée en deux. Tu jures de ne plus jamais échanger sans lunettes.", bond: { aff: -8, riv: 8 } },
  ],
  no: { ta: "$B garde ses cartes précieusement dans son classeur. Pas question d'y toucher.", bond: { aff: -1 } } });

reg({ id: "cache_cache", grp: "jeu", ic: "🙈", l: "Jouer à cache-cache géant", d: "Toute la cour, tous les recoins, et une règle qui change toutes les cinq minutes.",
  ages: [6, 12], w: 7, cool: 2,
  yes: [
    { w: 0.6, a: { sport: 2, bonheur: 4 }, b: { sport: 2, bonheur: 4 }, ta: "Tu te caches dans un bac à sable sec, $B ne te trouve jamais. Tu gagnes la partie et un peu de terre dans les oreilles.", tb: "Tu cherches $A pendant vingt minutes. Il ou elle était dans la poubelle à papier. Respect.", bond: { aff: 9 } },
    { w: 0.4, a: { sport: 2, bonheur: 3 }, b: { sport: 2, bonheur: 4, charme: 1 }, ta: "$B te trouve en quatre secondes. Tu n'as pas la moindre idée de comment.", tb: "Tu repères $A au premier coup d'œil, grâce à ses chaussures qui dépassent. Victoire éclair.", bond: { aff: 8 } },
  ],
  no: { ta: "$B n'a pas envie de courir aujourd'hui. Tu joues contre un arbre, qui ne triche pas.", bond: { aff: -1 } } });

reg({ id: "defi_trottinette", grp: "jeu", ic: "🛴", l: "Défier à la trottinette", d: "Un tour de cour, un virage serré, et le droit de se vanter jusqu'aux vacances.",
  ages: [6, 14], w: 7, cool: 2,
  yes: [
    { w: (g, A, B) => Math.max(0.2, Math.min(0.8, 0.5 + (A.stats.sport - B.stats.sport) / 200)), a: { sport: 2, bonheur: 5, repute: 1 }, b: { bonheur: -2 }, ta: "Tu gagnes la course d'une roue d'avance et tu fais un tour d'honneur, les bras en l'air. $B réclame la revanche.", tb: "Tu perds la course de justesse. Ton honneur est blessé, ta trottinette aussi.", bond: { aff: 3, riv: 4 } },
    { w: (g, A, B) => Math.max(0.2, Math.min(0.8, 0.5 + (B.stats.sport - A.stats.sport) / 200)), a: { bonheur: -2 }, b: { sport: 2, bonheur: 5, repute: 1 }, ta: "$B te dépasse dans le dernier virage. Tu ranges ta trottinette, vexé(e), et tu prépares ta revanche.", tb: "Tu gagnes ! La cour entière a vu ton dernier virage. Tu en parleras jusqu'au collège.", bond: { aff: 3, riv: 4 } },
  ],
  no: { ta: "$B refuse, sa trottinette serait « en réparation ». Personne n'est dupe.", bond: { aff: -1 } } });

reg({ id: "gouter_vole", grp: "coup_bas", ic: "🍪", l: "Piquer le goûter", d: "Un geste rapide, un biscuit disparu et un petit goût de culpabilité.", hostile: true, mode: "direct",
  ages: [6, 13], w: 6, cool: 2,
  direct: [
    { w: 0.65, a: { bonheur: 3, honnete: -2 }, b: { bonheur: -4 }, ta: "Tu piques le goûter de $B sans te faire repérer. Les miettes sont encore sur tes joues.", tb: "Ton goûter a disparu. Tu soupçonnes un fantôme en short.", bond: { riv: 8, aff: -3 } },
    { w: 0.35, a: { repute: -3, honnete: -2, bonheur: -3 }, b: { bonheur: -1 }, ta: "$B t'attrape la main dans le sac. Toute la classe voit le biscuit et ta honte.", tb: "Tu attrapes $A la main dans ton sac à goûter. Il ou elle explique que c'était « pour vérifier ».", bond: { riv: 10, aff: -5 }, news: "🍪 $A a été surpris(e) en train de piquer le goûter de $B." },
  ] });

reg({ id: "se_moquer", grp: "coup_bas", ic: "🤭", l: "Se moquer en public", d: "Un petit surnom, un grand rire dans la cour. La cruauté de l'enfance est un art.", hostile: true, mode: "direct",
  ages: [8, 17], w: 5, cool: 3,
  direct: [
    { w: 0.7, a: { bonheur: 2, bonte: -3 }, b: { repute: -3, bonheur: -5 }, ta: "Ton surnom pour $B fait le tour de la cour. Il ou elle encaisse en silence, les joues rouges.", tb: "Un surnom ridicule te colle à la peau depuis ce matin. Tu fais semblant que ça ne te touche pas.", bond: { riv: 14, aff: -8 } },
    { w: 0.3, a: { repute: -4, bonheur: -2 }, b: { repute: 1, bonheur: 1 }, ta: "Ta moquerie se retourne contre toi. Tout le monde rit de toi, pas de $B.", tb: "$A essaie de se moquer de toi, mais la blague tombe à plat. C'est même toi qui fais rire la cour.", bond: { riv: 8 } },
  ] });

reg({ id: "copier_devoirs", grp: "ecole", ic: "📝", l: "Copier sur ses devoirs", d: "Tu demandes ses réponses à quelqu'un de plus sérieux. Un peu d'éthique en moins, un peu de note en plus.",
  ages: [8, 17], w: 6, cool: 2,
  yes: [
    { w: 0.7, a: { notes: 6, honnete: -2 }, b: { honnete: -1, bonte: 1 }, ta: "Les réponses de $B sont impeccables. Tu changes deux mots pour que ça ne se voie pas, et tu récoltes une bonne note.", tb: "Tu laisses $A copier tes devoirs. Ta conscience grince un peu.", bond: { aff: 5 } },
    { w: 0.3, a: { notes: -6, repute: -2 }, b: { notes: -3, repute: -1 }, ta: "Le professeur remarque que vos deux copies contiennent la même faute d'orthographe et la même tache de confiture. Zéro pour tous les deux.", tb: "Zéro pour toi et pour $A, à cause d'une tache de confiture identique. C'est profondément injuste.", bond: { aff: -4, riv: 4 } },
  ],
  no: { ta: "$B cache sa copie avec les deux bras. Tu n'auras pas les réponses aujourd'hui.", bond: { aff: -2 } } });

reg({ id: "invitation_anniversaire", grp: "amitie", ic: "🎂", l: "Inviter à ton anniversaire", d: "Un gâteau, des ballons et un clown un peu inquiétant.",
  ages: [6, 15], w: 7, cool: 3,
  yes: [
    { w: 0.8, a: { bonheur: 5, sociable: 2 }, b: { bonheur: 4, sociable: 1 }, ta: "$B vient à ton anniversaire avec un cadeau enveloppé de façon très approximative. Tout le monde chante faux avec bonheur.", tb: "L'anniversaire de $A est une réussite totale, gâteau compris. Tu repars avec une part et un ballon.", bond: { aff: 10 } },
    { w: 0.2, a: { bonheur: 2 }, b: { bonheur: 3 }, ta: "Le clown fait peur à la moitié des invités, mais $B s'amuse comme un fou. Au moins un enfant a aimé.", tb: "Le clown est terrifiant. Tu manges trois parts de gâteau pour te remettre.", bond: { aff: 7 } },
  ],
  no: { ta: "$B a déjà un autre anniversaire ce jour-là. Tu fais semblant de comprendre.", bond: { aff: -2 } } });

reg({ id: "soiree_pyjama", grp: "amitie", ic: "🛏️", l: "Organiser une soirée pyjama", d: "Des chips, des histoires de fantômes et zéro minute de sommeil.",
  ages: [8, 15], w: 6, cool: 3,
  yes: [
    { w: 0.8, a: { bonheur: 5, sociable: 2, sante: -1 }, b: { bonheur: 5, sociable: 2, sante: -1 }, ta: "Vous passez la nuit à raconter des histoires de fantômes, à manger des chips et à ne dormir qu'à l'aube. Le lendemain, vous êtes des zombies heureux.", tb: "La soirée pyjama de $A est inoubliable. Tu te réveilles avec un feutre sur la joue.", bond: { aff: 12 } },
    { w: 0.2, a: { bonheur: 2, repute: -1 }, b: { bonheur: 3 }, ta: "Les parents de $B appellent à minuit pour dire que quelqu'un a laissé un chat dans le frigo. Fin de soirée anticipée.", tb: "On vient te chercher à minuit à cause d'un incident de chat. Tu ne sauras jamais ce qui s'est vraiment passé.", bond: { aff: 7 } },
  ],
  no: { ta: "$B n'a pas le droit de dormir ailleurs. Les règles de la maison sont dures mais justes.", bond: { aff: -1 } } });

// ---------- adolescence ----------
reg({ id: "mot_doux", grp: "coeur", ic: "💌", l: "Glisser un mot doux", d: "Un petit papier plié en quatre, un cœur dessiné sur le coin. Il peut changer ta vie ou te faire fuir au bout du monde.", mode: "direct",
  ages: [13, 40], w: 7, cool: 2, ok: (g, A, B, b) => single(A) && single(B) && !b.tags.crush, fit: (g, A, B, b) => (Math.abs(A.age - B.age) <= 4 ? 1 : 0.2),
  direct: [
    { w: (g, A, B, b) => Math.max(0.25, Math.min(0.8, 0.45 + (A.stats.charme - 50) / 200 + b.aff / 300)), a: { bonheur: 5 }, b: { bonheur: 4, charme: 1 }, ta: "$B lit ton mot, rougit, et te regarde longuement dans le couloir. Tu sens ton cœur battre à une vitesse illégale.", tb: "Tu trouves un mot doux de la part de $A. Tu le relis cinq fois, avant de le ranger précieusement dans ton agenda.", bond: { aff: 18 }, tag: "crush" },
    { w: (g, A, B, b) => Math.max(0.2, Math.min(0.75, 0.55 - (A.stats.charme - 50) / 200 - b.aff / 300)), a: { bonheur: -5, repute: -1 }, b: { bonheur: 1 }, ta: "$B lit ton mot et le passe discrètement à son voisin, qui le passe au sien. À la fin de la matinée, toute la classe connaît ton orthographe amoureuse.", tb: "Un mot doux de $A circule dans la classe. Tu préfères ne pas savoir qui l'a lu.", bond: { aff: 2 } },
  ] });

reg({ id: "bal_lyceen", grp: "coeur", ic: "💃", l: "Inviter au bal du lycée", d: "Un smoking loué, une robe d'occasion et une piste de danse où l'on évite les profs.",
  ages: [15, 18], w: 9, cool: 2, cost: 60,
  yes: [
    { w: 0.6, a: { bonheur: 7, charme: 2, repute: 1 }, b: { bonheur: 7, charme: 2 }, ta: "Vous dansez toute la soirée, avec les pieds de l'autre et les vôtres. À la fin, vous partagez un slow, un cookie et un secret.", tb: "Le bal avec $A est un grand moment. Les photos sont floues et magnifiques.", bond: { aff: 16 }, tag: "crush" },
    { w: 0.25, a: { bonheur: 3, repute: 2 }, b: { bonheur: 4, repute: 2 }, ta: "Vous finissez la soirée sur la piste de danse, devant tous, en train de refaire la chorégraphie d'un clip des années 90. Légende.", tb: "Ton passage de danse avec $A devient légendaire dans le lycée.", bond: { aff: 10 } },
    { w: 0.15, a: { bonheur: -3, repute: -1 }, b: { bonheur: -1 }, ta: "Tu renverses un verre de punch sur la robe de $B. Vous en riez tous les deux, mais pas tout de suite.", tb: "Un verre de punch atterrit sur ta tenue. $A est mortifié(e), toi aussi, mais ça passera.", bond: { aff: 3 } },
  ],
  no: { a: { bonheur: -4 }, ta: "$B a déjà un autre cavalier. Tu y vas avec des amis et tu danses sur une table, par défi.", bond: { aff: -3 } } });

reg({ id: "groupe_ensemble", grp: "arts", ic: "🎸", l: "Monter un groupe de musique", d: "Une guitare, une batterie empruntée et une certitude absolue de devenir célèbre.",
  ages: [13, 30], w: 7, cool: 3, ok: (g, A, B, b) => !b.tags.groupe,
  yes: [
    { w: 0.35, a: { creatif: 3, repute: 3, bonheur: 5 }, b: { creatif: 3, repute: 3, bonheur: 5 }, ta: "Votre premier concert, dans un garage, attire quarante personnes et un chien. C'est un succès local et une base de fans fidèles.", tb: "Le concert avec $A fait un carton dans le quartier. Un voisin vous demande même un autographe.", bond: { aff: 16 }, tag: "groupe", news: "🎸 $A et $B ont monté un groupe de musique et font un carton dans leur quartier." },
    { w: 0.65, a: { creatif: 2, bonheur: 3 }, b: { creatif: 2, bonheur: 3 }, ta: "Vous répétez beaucoup, vous vous disputez sur le nom du groupe, et vous ne jouez qu'un seul morceau. Mais quel morceau.", tb: "Le groupe avec $A se sépare au bout de trois répétitions, à cause d'une querelle de nom. Il en reste une chanson géniale.", bond: { aff: 8 }, tag: "groupe" },
  ],
  no: { ta: "$B n'a aucun sens du rythme et le sait. Tu cherches un autre batteur.", bond: { aff: -1 } } });

reg({ id: "defi_skate", grp: "jeu", ic: "🛹", l: "Défier au skate", d: "Un escalier, une rampe et des genoux qui regretteront.",
  ages: [12, 28], w: 6, cool: 2, fit: (g, A) => (A.stats.sport >= 45 ? 1.2 : 0.5),
  yes: [
    { w: (g, A, B) => Math.max(0.2, Math.min(0.8, 0.5 + (A.stats.sport - B.stats.sport) / 200)), a: { sport: 2, bonheur: 5, repute: 2 }, b: { bonheur: -2, sante: -1 }, ta: "Tu réussis la figure du siècle, enfin presque. $B est bluffé(e) et un peu écorché(e).", tb: "Tu tentes la rampe, tu rates, tu glisses sur dix mètres. $A applaudit sans méchanceté.", bond: { aff: 4, riv: 3 } },
    { w: (g, A, B) => Math.max(0.2, Math.min(0.8, 0.5 + (B.stats.sport - A.stats.sport) / 200)), a: { bonheur: -2, sante: -2 }, b: { sport: 2, bonheur: 5, repute: 2 }, ta: "Tu atterris sur le dos devant tout le skate park. $B vient t'aider et ne dit rien de poli.", tb: "Tu réussis la figure et $A te félicite en se massant le dos.", bond: { aff: 4, riv: 3 } },
  ],
  no: { ta: "$B dit que le skate, c'est pour les adolescents. Tu tombes seul(e) avec dignité.", bond: { aff: -1 } } });

reg({ id: "fete_sans_parents", grp: "fete", ic: "🏠", l: "Organiser une fête, parents absents", d: "La maison est à toi pour un week-end. C'est une très mauvaise idée, donc forcément excellente.", mature: true,
  ages: [15, 19], w: 6, cool: 3,
  yes: [
    { w: 0.4, a: { bonheur: 6, repute: 3, sociable: 2 }, b: { bonheur: 6, repute: 2 }, ta: "La fête est mythique. Le salon est un champ de bataille, mais tout le lycée en parle encore.", tb: "La fête de $A est la meilleure de l'année. Tu rentres à l'aube avec un chapeau qui n'est pas le tien.", bond: { aff: 12 }, news: "🏠 La fête de $A, parents absents, entre dans la légende." },
    { w: 0.35, a: { bonheur: 3, argent: -250, repute: -1 }, b: { bonheur: 3 }, ta: "Un vase meurt, la table de la cuisine aussi. Tu passes le dimanche à nettoyer avec une envie de disparaître.", tb: "La fête de $A tourne au désastre. Tu aides à ramasser les verres, par pure solidarité.", bond: { aff: 9 } },
    { w: 0.25, a: { bonheur: -4, repute: -3, argent: -150 }, b: { bonheur: 2 }, ta: "Les voisins appellent la police à minuit. L'agent est très gentil, mais le rapport arrive quand même chez tes parents.", tb: "La police débarque chez $A. Tu t'enfuis par le jardin, habillé(e) d'un rideau.", bond: { aff: 6 }, news: "🚨 La police a stoppé la fête de $A." },
  ],
  no: { ta: "$B est consigné(e) pour le week-end. Ta fête se fait sans la personne que tu espérais.", bond: { aff: -2 } } });

reg({ id: "faire_la_paix", grp: "paix", ic: "🕊️", l: "Faire la paix", d: "Tendre la main à quelqu'un avec qui ça s'est mal passé. Il y faut du courage et un peu de chocolat.",
  ages: [8, 120], w: 9, prio: 1, cool: 2, coolPair: 2, ok: (g, A, B, b) => b.riv >= 22,
  yes: [
    { w: 0.8, a: { bonheur: 5, bonte: 2 }, b: { bonheur: 5, bonte: 2 }, ta: "Vous vous expliquez sans crier, vous reconnaissez chacun vos torts et vous vous serrez la main. Le poids disparaît.", tb: "Tu acceptes la main tendue de $A. La vieille histoire s'éteint doucement.", bond: { riv: -35, aff: 8 }, tag: "paix" },
    { w: 0.2, a: { bonheur: 2 }, b: { bonheur: 2 }, ta: "Vous vous parlez, vous ne vous aimez pas plus, mais vous cessez de vous détester. C'est déjà un progrès.", tb: "Avec $A, ça n'ira pas plus loin qu'une trêve. C'est mieux que rien.", bond: { riv: -18 } },
  ],
  no: { a: { bonheur: -3 }, ta: "$B refuse la paix d'un haussement d'épaules. La rancune a la vie dure.", bond: { riv: 4 } } });
