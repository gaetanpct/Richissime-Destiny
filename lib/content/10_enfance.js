// Scènes de l'enfance (6 à 11 ans)
const { ev, flash, O, C, D } = require("../kit");

ev("rentree", {
  must: 100, ages: [6, 8], tags: ["ecole"], ic: "🎒🏫", who: { prof: "teacher", copain: "bestfriend" },
  t: "C'est la rentrée dans la classe de {$prof:M.|Mme} $prof, à $ville. Un nouveau cartable sur le dos, tu découvres tes camarades. $copain te fait signe de venir s'asseoir à côté de {$copain:lui|elle}, mais la place du fond, près du radiateur, est libre.",
  c: [
    D("T'asseoir à côté de $copain", "🤝", "Vous passez la matinée à échanger des gommes parfumées. Une amitié solide se dessine.", { rel: { copain: 12 }, sociable: 3, bonheur: 3 }),
    D("Prendre la place du fond", "🔥", "Du fond de la classe, tu observes tout. Tu te sens un peu seul(e) mais libre comme l'air.", { courage: 3, rel: { copain: -4 }, bonheur: 1 }),
    D("Te placer au premier rang", "✋", "{$prof:M.|Mme} $prof est ravi(e) de ta motivation. Les autres te regardent avec méfiance.", { notes: 6, intel: 2, sociable: -2, rel: { prof: 10 } }),
  ],
});

ev("cantine_poisson", {
  ages: [6, 11], tags: ["ecole"], ic: "🍽️", roll: { plat: "plats" },
  t: "À la cantine, on sert du $plat. L'odeur est, disons, caractéristique. Ton voisin de table te défie de tout manger.",
  c: [
    C("Tout manger, courageusement", "💪", [O(0.6, "Tu avales tout sans broncher. La cantine t'applaudit !", { courage: 3, repute: 2 }), O(0.4, "Tu avales, et tu regrettes aussitôt. Direction l'infirmerie.", { courage: 2, sante: -4, bonheur: -2 })], { risk: 1 }),
    D("Refiler ta part au chien du gardien", "🐕", "Le chien du gardien est ravi. Toi, tu es un peu coupable.", { honnete: -2, bonheur: 1 }),
    D("Faire semblant d'avoir mal au ventre", "🤒", "L'infirmière n'est pas dupe, mais elle te glisse un bonbon à la réglisse.", { honnete: -2, bonheur: 1 }),
  ],
});

ev("dent_de_lait", {
  ages: [6, 9], tags: ["sante"], ic: "🦷🧚", w: 6,
  t: "Ta première dent de lait tombe, en plein milieu d'une pomme. On te dit que la petite souris passera cette nuit.",
  c: [
    C("Mettre la dent sous l'oreiller", "🌙", [O(0.7, "Au matin, une pièce brille sous ton oreiller. Magique.", { argent: 3, bonheur: 3 }), O(0.3, "Au matin, un petit mot de la souris dit qu'elle est en grève. Tu es déçu(e).", { bonheur: -2, argent: 1 })]),
    D("Garder la dent dans ta poche pour toujours", "🧿", "La dent devient ton porte-bonheur personnel. Ta mère trouve ça un peu dégoûtant.", { creatif: 2, bonheur: 1 }),
    C("Tenter d'attraper la petite souris", "🪤", [O(0.5, "Tu veilles toute la nuit, et tu t'endors à 21 h. La souris te félicite d'un petit mot.", { argent: 2, bonheur: 1 }), O(0.5, "Tu prends ton père en flagrant délit de souris. Le mystère est brisé.", { intel: 2, bonheur: -1, argent: 5 })]),
  ],
});

ev("devoirs_mange", {
  ages: [6, 11], tags: ["ecole"], ic: "📚🐕", w: 5, who: { prof: "teacher" },
  t: "Tu n'as pas fait tes devoirs. {$prof:M.|Mme} $prof arrive en classe et les demande. Tu as trois secondes pour trouver une excuse.",
  c: [
    C("« Mon chien les a mangés »", "🐶", [O(0.35, "Toute la classe éclate de rire, et la maîtresse aussi. Tu t'en tires avec un avertissement.", { charme: 2, bonheur: 2, rel: { prof: -2 } }), O(0.65, "Tu n'as pas de chien. Punition, et une lettre aux parents.", { honnete: -3, notes: -3, rel: { prof: -6 } })], { risk: 1 }),
    D("Avouer honnêtement", "😔", "{$prof:M.|Mme} $prof apprécie ta franchise. Tu feras les devoirs en double demain.", { honnete: 4, notes: -1, rel: { prof: 6 } }),
    C("Copier sur ton voisin en vitesse", "✏️", [O(0.5, "Personne ne remarque rien. Tu es un génie du plagiat.", { notes: 2, honnete: -3 }), O(0.5, "Tu es pris(e) la main dans le cahier de ton voisin.", { notes: -4, repute: -2, honnete: -2 })], { risk: 1 }),
  ],
});

ev("tirelire_cochon", {
  ages: [7, 11], tags: ["argent"], ic: "🐷💰", w: 5,
  t: "Ta tirelire en forme de cochon commence à être bien remplie. Il y a un jouet en vitrine qui te fait de l'œil depuis des semaines.",
  c: [
    C("Acheter le jouet tout de suite", "🧸", [O(1, "Tu craques ! Le jouet est génial pendant trois jours, puis il rejoint le fond du placard.", { argent: -40, bonheur: 4 })], { cost: 40 }),
    D("Continuer à économiser", "🐖", "Ta tirelire grossit, et tu te sens très responsable.", { prudent: 3, argent: 20, bonheur: 1 }),
    D("Offrir un cadeau à ta mère avec", "🎁", "Ta mère pleure de joie. Ça valait bien un jouet.", { bonte: 4, argent: -20, bonheur: 3, rel: { mere: 8 } }, { cost: 20 }),
  ],
});

ev("anniv_invitation", {
  ages: [6, 11], tags: ["amis"], ic: "🎂🎈", who: { ami: "friend" },
  t: "$ami t'invite à son anniversaire. Il y aura un château gonflable, des bonbons à volonté et un clown. Mais ce jour-là, tu avais prévu un match de foot avec ton équipe.",
  c: [
    D("Aller à l'anniversaire", "🎈", "Tu rebondis jusqu'à la nausée. Tu rentres avec un sachet de bonbons et un tatouage de dragon.", { rel: { ami: 10 }, bonheur: 4, sociable: 2 }),
    D("Aller au foot", "⚽", "Tu marques deux buts ! $ami boude un peu, mais pardonne vite.", { sport: 3, rel: { ami: -6 }, bonheur: 3 }),
    C("Tenter de faire les deux", "🏃", [O(0.4, "Tu arrives avec les crampons sur le château gonflable. Succès fou, mais le château est percé.", { rel: { ami: 4 }, repute: 2, bonheur: 4, argent: -15 }), O(0.6, "Tu es en retard partout, tu n'amuses personne.", { rel: { ami: -3 }, bonheur: -2 })], { risk: 1 }),
  ],
});

ev("monstre_sous_lit", {
  ages: [6, 9], tags: ["famille", "loufoque"], ic: "👹🛏️", w: 5,
  t: "Il y a un monstre sous ton lit. Tu l'entends respirer. Il a l'air de manger des biscottes.",
  c: [
    C("Regarder sous le lit", "🔦", [O(0.5, "C'est juste un monstre à poil doux qui voulait de la compagnie. Il devient ton nouvel ami secret.", { courage: 4, flag: "monstre_ami", bonheur: 4 }), O(0.5, "Rien du tout, mais tu as trouvé une chaussette perdue depuis un an.", { courage: 2, bonheur: 1 })]),
    D("Appeler ta mère", "🙋", "Elle vérifie, rassure, et te laisse une veilleuse. Tu dors comme un bébé.", { rel: { mere: 5 }, bonheur: 2, courage: -1 }),
    D("Lui proposer un gâteau", "🍪", "Le monstre accepte le gâteau et disparaît avec un petit rot poli.", { bonte: 3, creatif: 3, bonheur: 3 }),
  ],
});

ev("recre_bagarre", {
  ages: [6, 11], tags: ["ecole"], ic: "🥊🏫", who: { rival: "rival" },
  t: "À la récré, $rival se moque de ta coiffure. Un cercle d'enfants se forme, impatient de voir la suite.",
  c: [
    C("Répondre par un coup de poing", "🥊", [O(0.5, "Tu le mets à terre. Ton nom est maintenant craint dans la cour. Tu es convoqué(e) chez le directeur.", { courage: 3, repute: -3, notes: -2, bonte: -3, rel: { rival: -8 } }), O(0.5, "Tu prends une raclée, mais tu sauves ton honneur.", { courage: 4, sante: -4, bonheur: -3, rel: { rival: -4 } })], { risk: 2 }),
    D("Répondre par une blague", "😎", "Tout le monde rit. Même $rival est désarmé.", { charme: 3, sociable: 2, rel: { rival: 6 }, repute: 2 }),
    D("Aller voir la maîtresse", "🙋", "Tu passes pour un(e) mouchard(e), mais la maîtresse règle l'affaire.", { honnete: 2, repute: -2, rel: { rival: -5 } }),
    D("Ignorer et t'en aller", "🚶", "Tu avais d'autres chats à fouetter. Tu gagnes en maturité.", { prudent: 3, bonheur: -1 }),
  ],
});

ev("spectacle_fin_annee", {
  ages: [6, 11], tags: ["ecole"], ic: "🎭🌟", w: 6,
  t: "C'est le spectacle de fin d'année de l'école. La maîtresse cherche des volontaires pour le grand rôle de l'arbre. Mais il y a aussi le rôle de la princesse, du prince, du narrateur, et de la citrouille.",
  c: [
    C("Le rôle principal", "👑", [O(0.55, "Tu es éblouissant(e), tes parents pleurent, la salle se lève. Une étoile est née.", { charme: 4, repute: 4, bonheur: 5, creatif: 3 }), O(0.45, "Tu oublies ton texte et tu improvises une danse. Le public adore, la maîtresse beaucoup moins.", { charme: 2, bonheur: 2, creatif: 3 })], { risk: 1 }),
    D("L'arbre", "🌳", "Ton rôle consiste à rester immobile. Tu le fais avec talent et personne ne te remarque.", { prudent: 2, bonheur: 1 }),
    D("La citrouille", "🎃", "Le costume est ridicule. Tu es le plus gros succès de la soirée.", { charme: 2, creatif: 3, repute: 3, bonheur: 4 }),
    D("Rester dans les coulisses", "🎬", "Tu règles les lumières et le son. Personne ne le sait, mais tu as tout sauvé.", { intel: 3, creatif: 2, bonheur: 2 }),
  ],
});

ev("poux_classe", {
  ages: [6, 10], tags: ["sante", "ecole"], ic: "🐛💇", w: 4,
  t: "Une alerte aux poux circule dans la classe. Ta mère t'inspecte la tête avec une loupe et un peigne fin.",
  c: [
    C("Te laisser faire sans broncher", "😬", [O(0.5, "Rien du tout, tes cheveux sont impeccables.", { bonheur: 1 }), O(0.5, "Verdict, quelques passagers clandestins. Shampoing violet et bonnet pendant trois semaines.", { bonheur: -3, charme: -1 })]),
    D("Te raser la tête, par précaution", "🧑‍🦲", "Radical. Tu deviens le chauve de la classe. Les copains te trouvent super courageux.", { courage: 4, charme: -2, repute: 2, bonheur: 1 }),
    D("Transformer ça en jeu, avec des surnoms pour les poux", "🐜", "Tu baptises chacun de tes poux. L'infirmière en perd son latin.", { creatif: 4, bonheur: 2, sociable: 1 }),
  ],
});

ev("classe_verte", {
  ages: [8, 11], tags: ["ecole", "aventure"], ic: "🌲🚌", w: 5, who: { ami: "friend", prof: "teacher" },
  t: "Départ en classe verte ! Une semaine dans un chalet avec toute la classe, {$prof:M.|Mme} $prof et des chèvres. Le soir, $ami propose une expédition secrète dans les bois.",
  c: [
    C("Suivre $ami dans les bois", "🌙", [O(0.5, "Vous découvrez une cabane abandonnée et un trésor de bonbons périmés. Une nuit mémorable.", { courage: 4, bonheur: 5, rel: { ami: 10 } }), O(0.5, "Vous vous perdez et c'est {$prof:M.|Mme} $prof qui vous retrouve avec une lampe torche. Grosse punition.", { courage: 3, repute: -3, rel: { ami: 4, prof: -8 } })], { risk: 1 }),
    D("Rester au chalet à jouer aux cartes", "🃏", "Tu gagnes toutes les parties. Tu repars avec trois paquets de bonbons et zéro scrupule.", { intel: 2, argent: 5, bonheur: 3 }),
    D("Passer la nuit à nourrir les chèvres", "🐐", "Les chèvres t'adorent. Tu leur donnes des noms de rois.", { bonte: 3, creatif: 2, bonheur: 4 }),
  ],
});

ev("bulletin_surprise", {
  ages: [7, 11], tags: ["ecole", "famille"], ic: "📄😬", w: 6,
  t: "Le bulletin de ce trimestre arrive ce soir. Tu sais qu'il n'est pas terrible. Tes parents attendent à la porte avec un grand sourire inquiétant.",
  c: [
    D("Le montrer tout de suite", "📬", "Tes parents soupirent mais apprécient ta franchise. On en reparle demain.", { honnete: 3, rel: { mere: 3, pere: 3 }, bonheur: -1 }),
    C("Cacher le bulletin dans le jardin", "🌷", [O(0.4, "Le bulletin disparaît. Personne n'en parle jamais plus.", { honnete: -4, bonheur: 2 }), O(0.6, "Le chien l'a retrouvé et l'a rapporté fièrement à tes parents.", { honnete: -3, rel: { mere: -5, pere: -5 }, bonheur: -3 })], { risk: 1 }),
    D("Modifier discrètement une note au stylo", "🖊️", "Un 4 devient un 14. Tu es un artiste mais un petit criminel.", { honnete: -6, creatif: 3, notes: 1 }),
    D("Promettre de bosser plus", "🤞", "Ta promesse touche tes parents. Tu seras vigilant(e), enfin presque.", { notes: 3, prudent: 1, bonheur: 1 }),
  ],
});

ev("fee_des_dents_dispute", {
  ages: [6, 8], tags: ["famille"], ic: "🧚💸", w: 3,
  t: "Ton ami te dit que la petite souris laisse dix euros. Toi, tu n'as eu qu'une pièce de deux centimes. Il y a de l'injustice dans l'air.",
  c: [
    D("Écrire une lettre de réclamation à la souris", "✉️", "La souris répond par un petit mot d'excuse et une pièce de plus. Ton sens de la négociation est né.", { charme: 2, creatif: 2, argent: 5 }),
    D("Passer à autre chose", "🤷", "Les voies de la souris sont impénétrables.", { prudent: 2 }),
  ],
});

ev("ami_imaginaire", {
  ages: [6, 9], tags: ["loufoque"], ic: "👻🎈", w: 5, roll: { fou: "fous" },
  t: "Tu as maintenant un ami imaginaire. Il s'appelle Monsieur Plouf, il est à moitié poisson, à moitié homme d'affaires, et il te donne parfois des conseils de placement.",
  c: [
    C("Écouter ses conseils", "🐟", [O(0.5, "Monsieur Plouf te conseille de garder ta pièce de deux euros. Tu l'écoutes. Elle devient un souvenir précieux.", { prudent: 3, argent: 5, bonheur: 3 }), O(0.5, "Monsieur Plouf te conseille de manger du sable. Tu n'écoutes que la moitié.", { bonheur: 2, sante: -2, creatif: 3 })]),
    D("Lui offrir une place à table", "🍽️", "Tes parents mettent un couvert en plus. Tu es adoré par ta famille, même si inquiétante.", { creatif: 4, bonheur: 4, rel: { mere: 3 } }),
    D("Lui dire adieu, tu grandis", "👋", "Monsieur Plouf s'évapore avec un petit pop. Tu retiens une larme.", { intel: 2, bonheur: -2, prudent: 2 }),
  ],
});

ev("voisin_grincheux", {
  ages: [7, 11], tags: ["amis"], ic: "👴🏡", who: { voisin: "neighbor" },
  t: "Le voisin $voisin confisque ton ballon qui a atterri dans son jardin pour la troisième fois. Il t'a dit que la prochaine fois, il le crève.",
  c: [
    C("Aller sonner pour le récupérer", "🔔", [O(0.5, "Il te rend le ballon avec un petit sourire. En fait, il est un peu seul.", { courage: 3, bonte: 2, rel: { voisin: 8 } }), O(0.5, "Il te donne un sermon d'une heure, mais finit par te rendre le ballon.", { courage: 2, bonheur: -1, rel: { voisin: -2 } })]),
    D("Passer par-dessus la clôture la nuit", "🌙", "Mission accomplie, ballon récupéré, pantalon déchiré.", { courage: 4, honnete: -2, rel: { voisin: -6 }, argent: -10 }),
    D("Lui offrir des gâteaux pour le calmer", "🍪", "Il sourit un peu. Désormais il te garde tes ballons dans une caisse.", { charme: 3, bonte: 3, rel: { voisin: 10 } }),
  ],
});

ev("ecole_visite_pompiers", {
  ages: [6, 9], tags: ["ecole"], ic: "🚒🔥", w: 4,
  t: "Les pompiers viennent visiter l'école. Le plus costaud te propose de monter sur l'échelle, et de tenir la lance à incendie.",
  c: [
    C("Monter sur l'échelle", "🪜", [O(0.7, "La vue d'en haut est magnifique. Tu veux devenir pompier, ou oiseau.", { courage: 4, bonheur: 4, flag: "reve_pompier" }), O(0.3, "Tu as le vertige et tu redescends en pleurant.", { courage: 1, bonheur: -2 })]),
    C("Tenir la lance", "💦", [O(0.5, "Tu arroses toute la classe sans le vouloir. Fou rire général.", { repute: 3, bonheur: 4, sociable: 2 }), O(0.5, "Tu arroses la maîtresse. Punition.", { notes: -2, repute: -2, bonheur: 2 })], { risk: 1 }),
    D("Poser mille questions au pompier", "❓", "Tu en sais autant sur les extincteurs que le chef de caserne.", { intel: 3, notes: 2 }),
  ],
});

ev("premier_velo", {
  ages: [6, 9], tags: ["famille", "sport"], ic: "🚲", w: 5, who: { pere: "pere" },
  t: "Ton père te débarrasse des petites roues de ton vélo. « Tu es prêt(e) », dit-il, la voix pleine d'inquiétude.",
  c: [
    C("Pédaler à fond sur la descente", "💨", [O(0.5, "Tu files comme le vent ! Tu fais le tour du quartier en poussant des cris de joie.", { sport: 3, courage: 4, bonheur: 5 }), O(0.5, "Tu t'écrases dans un buisson de ronces. Genoux en miettes mais fierté intacte.", { sport: 2, courage: 3, sante: -4 })], { risk: 1 }),
    D("Y aller doucement avec ton père qui court derrière", "👨‍👦", "Il court, il transpire, il rit. Un beau souvenir.", { rel: { pere: 10 }, sport: 2, bonheur: 4 }),
    D("Refuser, tu préfères les petites roues", "🛞", "Tu gardes tes petites roues encore un peu. Ce n'est pas grave.", { prudent: 3, bonheur: -1 }),
  ],
});

ev("brocante_trouvaille", {
  ages: [7, 11], tags: ["argent", "aventure"], ic: "🏺🛒", w: 4, roll: { prix: [3, 15, 1] },
  t: "Dans une brocante, un vieux monsieur te propose un petit objet poussiéreux pour $prix. Il te dit que c'est un authentique anneau magique, ou presque.",
  c: [
    C("L'acheter", "💍", [O(0.15, "L'anneau est un vrai bijou ancien ! Un expert t'en offre plus tard une belle somme.", { argent: 120, bonheur: 5, flag: "anneau_ancien" }), O(0.85, "C'est un anneau de rideau. Mais il est joli.", { bonheur: 1 })], { cost: 8 }),
    D("Marchander", "🪙", "Tu négocies comme un vieux marchand. Le vieux monsieur est impressionné.", { charme: 3, intel: 2, argent: 2 }),
    D("Passer ton chemin", "🚶", "Tu continues ta promenade. L'anneau reste dans ses rêves.", { prudent: 2 }),
  ],
});

ev("chien_perdu", {
  ages: [7, 11], tags: ["animal", "amis"], ic: "🐕🔎", w: 5,
  t: "Un chien errant te suit depuis l'école. Il a un collier, mais pas d'adresse. Il te regarde avec des yeux de caramel.",
  c: [
    C("Le ramener à la maison", "🏠", [O(0.5, "Tes parents acceptent de le garder le temps de trouver son maître. Il reste finalement pour toujours.", { bonheur: 6, bonte: 3, flag: "chien_adopte" }), O(0.5, "Tes parents refusent, mais le chien retrouve son maître le lendemain. Tu reçois une jolie récompense.", { bonte: 3, argent: 20, bonheur: 3 })]),
    D("Chercher le maître avec des affiches", "📄", "Tu dessines des affiches pendant des heures. Le maître se manifeste et te remercie avec des gâteaux.", { bonte: 4, creatif: 2, rel: { mere: 4 }, bonheur: 3 }),
    D("Le laisser tranquille", "🚶", "Il s'éloigne, tu ressens un petit pincement au cœur.", { prudent: 2, bonheur: -2 }),
  ],
});

ev("grands_parents_vacances", {
  ages: [6, 11], tags: ["famille"], ic: "👵🏡", w: 5,
  t: "Les vacances chez mamie et papi ! Ils t'offrent des crêpes à toute heure, des histoires de guerre et des leçons de pêche.",
  c: [
    D("Pêcher avec papi toute la journée", "🎣", "Vous ne prenez rien, mais vous rigolez beaucoup. Il te raconte comment il a rencontré mamie.", { bonheur: 5, intel: 1, rel: { mere: 2 } }),
    D("Aider mamie à la cuisine", "🥞", "Tu apprends à faire la pâte à crêpes comme personne. Tu deviens le chef des crêpes de la famille.", { creatif: 3, bonheur: 4, sante: -1, flag: "crepes_secret" }),
    C("Explorer le grenier", "🕸️", [O(0.35, "Tu y trouves un coffre de lettres anciennes et une médaille de guerre. Papi est ému aux larmes.", { bonheur: 5, intel: 2, flag: "coffre_grenier" }), O(0.65, "Tu y trouves des araignées, mais aussi un vieux jeu de société génial.", { courage: 2, bonheur: 3 })]),
  ],
});

ev("jeu_video_epuisant", {
  ages: [8, 11], tags: ["jeu"], ic: "🎮🌙", w: 5,
  t: "Ton ami t'a prêté un jeu vidéo génial. Ça fait trois heures que tu joues et il faut aller dormir demain, il y a école.",
  c: [
    C("Continuer en cachette sous la couette", "🔦", [O(0.5, "Tu finis le jeu en une nuit ! Tu es le roi du niveau 12, mais fatigué(e).", { sport: -2, bonheur: 5, sante: -3, intel: 1 }), O(0.5, "Tes parents te surprennent. Console confisquée une semaine.", { bonheur: -4, honnete: -2 })], { risk: 1 }),
    D("Éteindre et dormir", "😴", "Tu fais un rêve où tu es le héros du jeu. Il y avait des tartes volantes.", { sante: 2, prudent: 2, bonheur: 1 }),
    D("Proposer à ton frère ou ta sœur de jouer avec toi", "🧑‍🤝‍🧑", "Vous jouez à deux et vous vous amusez beaucoup. Vous finissez fâchés à cause du score.", { sociable: 2, bonheur: 3 }),
  ],
});

ev("kermesse_stand", {
  ages: [6, 11], tags: ["ecole", "argent"], ic: "🎪🎯", w: 5,
  t: "C'est la kermesse de l'école ! Il y a un stand de tir, un stand de pêche aux canards, une grosse tombola et du barbe à papa à volonté. Tu as quelques pièces dans la poche.",
  c: [
    C("Tenter la tombola", "🎟️", [O(0.1, "Tu gagnes le gros lot, un vélo flambant neuf !", { bonheur: 8, sport: 2, item: "velo" }), O(0.9, "Tu gagnes un porte-clés en forme de tarte.", { bonheur: 1, argent: -3 })], { cost: 3 }),
    D("Manger du barbe à papa jusqu'à l'écœurement", "🍭", "Tu es malade comme un chien, mais tellement heureux.", { sante: -3, bonheur: 5, argent: -5 }, { cost: 5 }),
    D("Tenir un stand toi-même", "🧑‍🍳", "Tu vends des citronnades et récoltes une jolie somme pour la classe.", { ambition: 3, charme: 2, argent: 15, repute: 3 }),
  ],
});

ev("copain_triche", {
  ages: [8, 11], tags: ["ecole"], ic: "📝👀", who: { ami: "friend" },
  t: "Pendant l'interro de maths, $ami te glisse un petit papier. « Passe-moi tes réponses et je te donne mes billes. »",
  c: [
    C("Accepter l'échange", "🔴", [O(0.5, "Personne ne s'en rend compte, tu empoches la moitié de la collection de billes.", { honnete: -4, argent: 5, rel: { ami: 4 } }), O(0.5, "Le maître vous surprend. Zéro pour tous les deux et conseil de classe.", { honnete: -3, notes: -4, rel: { ami: -6 }, repute: -3 })], { risk: 1 }),
    D("Refuser fermement", "✋", "$ami boude pendant deux jours, puis il comprend. Ta fierté est intacte.", { honnete: 4, rel: { ami: -4 }, bonheur: 1 }),
    D("Dénoncer $ami au maître", "👀", "Tu passes pour une balance. Mais le maître t'apprécie.", { honnete: 2, bonte: -3, repute: -3, rel: { ami: -12 } }),
  ],
});

ev("marche_du_samedi", {
  ages: [7, 11], tags: ["famille", "argent"], ic: "🥬🧺", w: 4, who: { mere: "mere" },
  t: "Au marché du samedi, ta mère te confie quelques pièces pour acheter des tomates. Un marchand te propose une affaire, trois fois plus de tomates pour le même prix, mais elles sont un peu... molles.",
  c: [
    C("Accepter l'affaire", "🍅", [O(0.5, "Tu rentres avec un sac énorme. Ta mère fait de la sauce pour tout le quartier.", { bonheur: 3, intel: 1, rel: { mere: 4 } }), O(0.5, "Les tomates sont pourries. Ta mère fronce les sourcils.", { rel: { mere: -3 }, bonheur: -2 })]),
    D("Acheter les tomates normales", "🧺", "Une transaction impeccable. Ta mère est fière de toi.", { prudent: 3, rel: { mere: 5 } }),
    D("Garder la monnaie pour un bonbon", "🍬", "Un petit larcin sucré qui laisse un goût de culpabilité.", { honnete: -3, bonheur: 2, argent: 2 }),
  ],
});

ev("lettre_pere_noel", {
  ages: [6, 9], tags: ["famille"], ic: "🎅✉️", w: 4,
  t: "Tu écris ta lettre au Père Noël. Tu sais qu'il ne peut pas tout apporter. Pourtant, ta liste est longue comme un bras.",
  c: [
    D("Demander un seul gros cadeau", "🎁", "Tu l'obtiens, c'est la joie ! Mais tu t'ennuies un peu après.", { bonheur: 4, prudent: 2 }),
    D("Demander tout ce qui existe", "📜", "Tu reçois la moitié. Beaucoup d'objets, peu d'amour.", { bonheur: 2, ambition: 2 }),
    D("Demander un cadeau pour quelqu'un d'autre", "💞", "Ta famille est bouleversée par ta générosité. Ton cadeau à toi est modeste mais touchant.", { bonte: 5, bonheur: 3, rel: { mere: 6, pere: 6 } }),
    D("Lui demander un job d'elfe", "🧝", "Le Père Noël répond poliment que le marché de l'emploi est complet.", { creatif: 3, ambition: 2, bonheur: 2 }),
  ],
});

ev("troc_cour", {
  ages: [7, 11], tags: ["argent", "ecole"], ic: "🃏🔄", w: 6, who: { rival: "rival" },
  t: "Dans la cour, un marché de cartes à collectionner s'est monté. Il te manque une carte rare pour finir ta collection. $rival en a deux.",
  c: [
    C("Proposer un échange très avantageux pour lui", "🤝", [O(0.5, "$rival accepte et tu complètes ta collection. Il se croit très malin.", { bonheur: 4, charme: 2, rel: { rival: 5 } }), O(0.5, "$rival refuse net. Il t'a repéré(e) comme un pigeon.", { bonheur: -2, rel: { rival: -3 } })]),
    C("Lui piquer la carte", "🦹", [O(0.4, "Tu repars avec la carte sans bruit. Tu as le sens du risque.", { honnete: -5, courage: 3, bonheur: 3 }), O(0.6, "Tu te fais prendre, la cour entière le sait.", { honnete: -4, repute: -6, rel: { rival: -12 } })], { risk: 2 }),
    D("Revendre une de tes cartes pour en acheter une autre", "💱", "Un petit commerce naît dans la cour. Tu apprends l'art de la marge.", { intel: 2, ambition: 3, argent: 10 }),
  ],
});

ev("cirque_arrive", {
  ages: [6, 11], tags: ["loufoque", "aventure"], ic: "🎪🤡", w: 4,
  t: "Un cirque s'installe dans le champ derrière chez toi. Le clown te repère dans la foule et t'invite sur la piste.",
  c: [
    C("Monter sur la piste", "🤹", [O(0.6, "Tu jongles avec trois balles, et le public rugit ! Le directeur du cirque te glisse sa carte.", { charme: 3, creatif: 4, repute: 3, bonheur: 5, flag: "carte_cirque" }), O(0.4, "Tu reçois une tarte à la crème en pleine figure. Le public est en délire.", { bonheur: 2, repute: 2, charme: -1 })]),
    D("Rester dans le public et applaudir", "👏", "Tu passes un super après-midi sans prendre de tartes.", { bonheur: 3, prudent: 2 }),
    D("Te cacher dans une caisse de clowns", "📦", "Tu voyages sans le savoir jusqu'au village voisin. Tes parents ont eu très peur.", { courage: 4, bonheur: 2, rel: { mere: -6, pere: -6 } }),
  ],
});

ev("tricherie_cartes", {
  ages: [7, 11], tags: ["jeu"], ic: "🃏😏", w: 4,
  t: "Tu joues aux cartes avec ton grand-père. Il triche à chaque partie, et tu l'as remarqué. Il a un petit sourire en coin.",
  c: [
    D("Tricher aussi, pour l'égaler", "😈", "Une partie d'anthologie, vous trichez tous les deux avec panache. Vous êtes inséparables.", { creatif: 3, honnete: -2, bonheur: 4 }),
    D("Le dénoncer fièrement", "☝️", "Papi éclate de rire et te félicite pour ton sens de l'observation.", { intel: 3, honnete: 2, bonheur: 2 }),
    D("Ne rien dire et perdre", "🙂", "Tu laisses faire, tu aimes le voir gagner. Il te donne un billet à la fin.", { bonte: 3, argent: 10, bonheur: 3 }),
  ],
});

ev("goutte_eau_robot", {
  ages: [8, 11], tags: ["loufoque", "ecole"], ic: "🤖💧", w: 4,
  t: "Lors du concours de sciences de l'école, tu dois présenter un projet. Tu as le choix entre un volcan en pâte à sel, un robot en carton et un système d'arrosage... en forme de tarte.",
  c: [
    C("Le volcan", "🌋", [O(0.6, "L'éruption est spectaculaire ! Tu arroses un peu le jury. Mention honorable.", { intel: 3, notes: 3, repute: 3, bonheur: 4 }), O(0.4, "Le volcan reste muet. Le jury a pitié de toi.", { notes: 1, bonheur: -1 })]),
    D("Le robot en carton", "🤖", "Il ne bouge pas mais il a une personnalité. Le jury est charmé.", { creatif: 4, notes: 2, bonheur: 3 }),
    C("Le système d'arrosage en forme de tarte", "🥧", [O(0.4, "Révolution ! Le jury veut le breveter. Tu es un génie incompris.", { intel: 5, creatif: 5, repute: 5, bonheur: 6, notes: 5, flag: "invention_tarte" }), O(0.6, "Il a tout inondé. Zéro, mais standing ovation.", { creatif: 3, repute: 2, bonheur: 2, notes: -2 })], { risk: 1 }),
  ],
});

ev("bonbons_vol", {
  ages: [6, 10], tags: ["argent"], ic: "🍬👀", w: 4,
  t: "Au supermarché, un sachet de bonbons est à portée de ta main. Ta mère est occupée à comparer des pâtes. Personne ne regarde.",
  c: [
    C("Glisser le sachet dans ta poche", "🙊", [O(0.4, "Tu les dégustes en cachette. Un goût sucré et coupable.", { honnete: -4, bonheur: 3 }), O(0.6, "Le vigile te prend par l'épaule. Ta mère rougit jusqu'aux oreilles.", { honnete: -4, repute: -3, rel: { mere: -8 }, bonheur: -4 })], { risk: 1 }),
    D("Demander à ta mère", "🙏", "Elle te répond non, puis oui à moitié. Un sachet partagé, c'est quand même bon.", { honnete: 3, bonheur: 2, rel: { mere: 2 } }),
    D("Résister, et compter jusqu'à cent", "💪", "Tu ressors fier(e). Ta volonté se muscle.", { prudent: 3, honnete: 3, bonheur: 1 }),
  ],
});

ev("cabane_foret", {
  ages: [7, 11], tags: ["aventure", "amis"], ic: "🛖🌲", w: 5, who: { ami: "friend", copain: "bestfriend" },
  t: "Avec $ami et $copain, tu construis une cabane dans la forêt. Elle est faite de branches, de couvertures volées et d'une vieille porte de frigo.",
  c: [
    D("Faire de la cabane une forteresse", "🏰", "Vous installez des pièges à bonbons et une alarme à casseroles. Personne n'entre.", { creatif: 4, sociable: 2, bonheur: 4, rel: { ami: 6, copain: 6 } }),
    D("Y ouvrir un café pour les copains", "☕", "Vous servez de la menthe à l'eau. Les gamins de l'école font la queue.", { ambition: 3, charme: 2, argent: 10, rel: { ami: 4 } }),
    D("Y passer la nuit", "🌌", "Trop de bruits dans la nuit, vous rentrez à minuit. Vous vous faites gronder, mais quelle aventure !", { courage: 4, bonheur: 4, rel: { copain: 8 } }),
  ],
});

ev("concours_dessin", {
  ages: [6, 11], tags: ["ecole", "art"], ic: "🖍️🏆", w: 5, who: { prof: "teacher" },
  t: "Un concours de dessin est organisé par la mairie. Le thème est « Mon héros ». Tu as une heure.",
  c: [
    D("Dessiner un super-héros qui lance des tartes", "🥧", "Original ! Le jury est amusé, et tu reçois une mention spéciale.", { creatif: 5, repute: 3, bonheur: 5 }),
    D("Dessiner ta mère", "👩", "Un dessin tout simple, sincère. Ta mère le met sous verre.", { bonte: 3, rel: { mere: 10 }, bonheur: 4 }),
    C("Copier un dessin trouvé dans un livre", "📘", [O(0.5, "Personne ne s'en aperçoit, tu gagnes un second prix.", { honnete: -4, argent: 15, bonheur: 3 }), O(0.5, "Le jury reconnaît le dessin. Disqualifié(e) !", { honnete: -3, repute: -4, bonheur: -3 })], { risk: 1 }),
  ],
});

ev("anniv_surprise_parent", {
  ages: [6, 11], tags: ["famille"], ic: "🎂🤫", w: 5, who: { mere: "mere", pere: "pere" },
  t: "C'est bientôt l'anniversaire de ta mère. Tu veux lui préparer une surprise, mais tu n'as pas beaucoup d'argent et ton père ne sait pas garder un secret.",
  c: [
    D("Faire un gâteau toi-même", "🎂", "Le gâteau est un peu carbonisé, mais ta mère le mange en pleurant d'amour.", { creatif: 3, bonte: 3, rel: { mere: 12 }, bonheur: 4 }),
    D("Fabriquer une carte avec des paillettes", "💌", "Il y a des paillettes partout dans la maison, jusque dans le lit. Elle l'encadre.", { creatif: 3, rel: { mere: 8 }, bonheur: 3 }),
    D("Acheter un cadeau avec ta tirelire", "🎁", "Un joli foulard qui coûte tout ton argent de poche. Ta mère te serre fort.", { argent: -25, bonte: 4, rel: { mere: 10 }, bonheur: 4 }, { cost: 25 }),
  ],
});

ev("noir_lumiere", {
  ages: [6, 10], tags: ["loufoque"], ic: "🌑🕯️", w: 3,
  t: "Une grande panne de courant plonge ton quartier dans le noir. Les voisins sortent avec des bougies. Un drôle de brouhaha monte de la cave.",
  c: [
    C("Descendre à la cave avec une lampe", "🔦", [O(0.5, "C'est juste le chat qui fait le malin avec des pots de confiture. Fou rire.", { courage: 3, bonheur: 3 }), O(0.5, "Un fantôme poli te salue puis disparaît. Personne ne te croit.", { courage: 5, creatif: 3, bonheur: 4, flag: "a_vu_fantome" })]),
    D("Raconter des histoires de fantômes aux voisins", "👻", "Tu terrorises tout le monde avec brio. Un voisin te propose un contrat pour la fête d'Halloween.", { creatif: 4, charme: 2, repute: 3, argent: 5 }),
    D("Te cacher sous la couette avec le chat", "🐈", "Le chat ronronne et la panne passe. Un moment de douceur.", { bonheur: 3, prudent: 2 }),
  ],
});

ev("petit_frere_jalousie", {
  ages: [6, 11], tags: ["famille"], ic: "👶😤", w: 5, need: { rel: "sibling" }, who: { frere: "sibling" },
  t: "Ton frère ou ta sœur $frere a eu un cadeau plus gros que le tien pour son anniversaire. C'est injuste, et tu le fais savoir.",
  c: [
    D("Bouder pendant trois jours", "😠", "Tes parents finissent par comprendre. Tu récoltes un câlin et un dessert.", { bonheur: -1, rel: { frere: -3 } }),
    D("Proposer d'échanger vos cadeaux", "🔄", "$frere accepte ! Chacun a ce qu'il voulait, la paix est restaurée.", { sociable: 2, rel: { frere: 8 }, bonheur: 2 }),
    C("Casser discrètement le cadeau", "🔨", [O(0.5, "Personne ne sait. $frere pleure. Tu te sens comme le pire des mortels.", { bonte: -5, rel: { frere: -10 }, bonheur: -2 }), O(0.5, "Tu es découvert(e), et ça se termine en grande dispute familiale.", { bonte: -4, rel: { frere: -10, mere: -6 }, bonheur: -4 })], { risk: 1 }),
  ],
});

ev("histoire_au_dodo", {
  ages: [6, 10], tags: ["famille"], ic: "📖🌙", w: 4, who: { pere: "pere" },
  t: "Ce soir, c'est ton père qui te lit l'histoire. Il a oublié le livre mais promet d'en inventer une. Il commence, et ça part très loin.",
  c: [
    D("L'écouter jusqu'au bout", "😴", "L'histoire parle d'un cochon pirate et d'un sorcier qui fait de la comptabilité. Tu t'endors avec le sourire.", { rel: { pere: 10 }, bonheur: 5, creatif: 3 }),
    D("Lui proposer des idées pour l'histoire", "💡", "Vous inventez un monde ensemble. Tu veux devenir écrivain, ou cochon pirate.", { creatif: 5, intel: 1, rel: { pere: 8 }, bonheur: 4 }),
  ],
});

ev("tempete_nuit", {
  ages: [6, 11], tags: ["famille", "loufoque"], ic: "⛈️🏠", w: 3,
  t: "Une grosse tempête secoue ton quartier. Un arbre tombe devant la maison, et le toit de la voisine s'envole. Il flotte comme un cerf-volant géant.",
  c: [
    C("Courir aider la voisine", "🏃", [O(0.6, "Tu l'aides à sauver ses affaires. Elle t'offre une boîte de chocolats gigantesque.", { courage: 3, bonte: 4, repute: 3, bonheur: 4, sante: -1 }), O(0.4, "Tu glisses, tu tombes dans une flaque. Mais tout le quartier t'applaudit.", { courage: 3, bonte: 3, repute: 3, bonheur: 2, sante: -2 })], { risk: 1 }),
    D("Rester sous la couette en regardant par la fenêtre", "🪟", "Le spectacle est grandiose. Tu comptes les éclairs jusqu'à l'endormissement.", { prudent: 3, bonheur: 2 }),
    D("Attraper le toit comme un cerf-volant", "🪁", "Impossible. Mais ça fait une super histoire à raconter à l'école.", { courage: 4, creatif: 3, sante: -3, repute: 2 }),
  ],
});

ev("ecole_theatre_ratatouille", {
  ages: [9, 11], tags: ["ecole", "loufoque"], ic: "🐀👨‍🍳", w: 3,
  t: "La cantine est envahie par un rat qui cuisine. Il porte une toque et manie la poêle mieux que le cuistot. Personne n'ose en parler à la direction.",
  c: [
    D("Devenir son assistant", "🧑‍🍳", "Vous préparez des plats incroyables chaque midi. L'inspecteur d'académie est ébloui.", { creatif: 5, intel: 2, bonheur: 5, flag: "rat_chef" }),
    D("Prévenir la direction", "📣", "Le rat est mis à la porte. Les plats redeviennent tristes. Tu es seul(e) à comprendre ton erreur.", { honnete: 2, bonheur: -3 }),
    D("Prendre des photos pour la postérité", "📸", "Personne ne te croit, mais tu gardes un trésor.", { creatif: 3, prudent: 2, bonheur: 2 }),
  ],
});

ev("classe_elections_delegue", {
  ages: [8, 11], tags: ["ecole"], ic: "🗳️🏫", w: 5, who: { rival: "rival" },
  t: "C'est l'élection du délégué de classe. $rival se présente avec un programme généreux, des bonbons gratuits pour tous. À toi de décider.",
  c: [
    C("Te présenter contre $rival", "🎤", [O(0.5, "Ton discours convainc la classe. Tu es élu(e) délégué(e) !", { charme: 3, repute: 5, ambition: 3, bonheur: 5 }), O(0.5, "$rival gagne grâce aux bonbons. La démocratie est cruelle.", { bonheur: -2, ambition: 1, rel: { rival: -4 } })], { risk: 1 }),
    D("Soutenir $rival", "🤝", "$rival remporte l'élection et te remercie en te nommant ministre des bonbons.", { bonte: 3, rel: { rival: 12 }, bonheur: 2 }),
    D("Ne pas voter", "🙅", "Tu laisses les autres décider. Tu regretteras peut-être.", { prudent: 2 }),
  ],
});

ev("surprise_tirelire_fouille", {
  ages: [7, 11], tags: ["argent", "famille"], ic: "🐷🔍", w: 3, who: { frere: "sibling" },
  t: "Ta tirelire est mystérieusement plus légère qu'hier. Quelqu'un a fait un prélèvement. Les soupçons se portent sur ton frère ou ta sœur, mais aussi sur le chat.",
  c: [
    D("Mener l'enquête avec un carnet", "🕵️", "Tu découvres que le coupable est le chat, qui jouait avec les pièces. Un coup de maître.", { intel: 4, bonheur: 3 }),
    C("Accuser $frere", "👉", [O(0.5, "$frere avoue en rougissant et te rembourse.", { argent: 8, rel: { frere: -3 }, bonheur: 1 }), O(0.5, "$frere est innocent, vous vous disputez à fond.", { rel: { frere: -10 }, bonte: -2, bonheur: -3 })], { risk: 1 }),
    D("Passer l'éponge", "🤷", "Une pièce de plus ou de moins, ce n'est pas si grave. Tu te sens grand(e).", { bonte: 3, prudent: -1, argent: -5 }),
  ],
});

ev("piscine_plongeoir", {
  ages: [7, 11], tags: ["sport"], ic: "🏊🌊", w: 5,
  t: "À la piscine, un plongeoir de trois mètres te regarde fixement. Tes amis te défient d'y grimper. Tu as les jambes en coton.",
  c: [
    C("Sauter sans réfléchir", "🦅", [O(0.7, "Tu hurles de joie en plongeant. Tu es un héros pendant trois jours.", { courage: 5, sport: 2, repute: 3, bonheur: 5 }), O(0.3, "Gros plat. Dos rouge, dignité en miettes, mais fierté intacte.", { courage: 4, sante: -3, bonheur: -1 })], { risk: 1 }),
    D("Redescendre l'échelle", "🪜", "Tu as été sage, mais tu rumines pendant deux jours.", { prudent: 3, courage: -2, bonheur: -1 }),
    D("Te jeter du bord, tout doucement", "🐢", "Tu fais une grosse éclaboussure. Mais tu as sauté, c'est ça qui compte.", { courage: 3, bonheur: 3 }),
  ],
});

ev("poule_ecole", {
  ages: [7, 11], tags: ["loufoque", "animal"], ic: "🐔🏫", w: 3,
  t: "Une poule s'est installée dans la cour de récré. Elle pond un œuf par jour, toujours à ton endroit préféré. La maîtresse dit que c'est un cadeau du ciel.",
  c: [
    D("Lui donner un nom et la nourrir", "🌾", "Elle te suit partout, tu es la star de la classe. On la surnomme Madame Coquette.", { bonte: 3, bonheur: 5, repute: 3 }),
    C("Vendre les œufs aux copains", "🥚", [O(0.7, "Tu récoltes de l'argent de poche, et même des commandes spéciales.", { ambition: 4, argent: 25, bonheur: 3 }), O(0.3, "L'un des œufs est pourri. Scandale à la cantine.", { argent: 10, repute: -4, honnete: -2 })], { risk: 1 }),
    D("Organiser un défilé de la poule", "🎉", "Toute l'école défile. Une fête improvisée dont on parle encore.", { creatif: 4, sociable: 3, bonheur: 5, repute: 4 }),
  ],
});

ev("petit_job_enfant", {
  ages: [9, 11], tags: ["argent"], ic: "🧼🚗", w: 4, roll: { prix: [3, 8, 1] },
  t: "Pendant les vacances, tu as l'idée de laver les voitures des voisins pour de l'argent de poche. Un seau, une éponge, et beaucoup d'enthousiasme.",
  c: [
    C("Lancer l'affaire dans tout le quartier", "🚿", [O(0.7, "Tu enchaînes les clients et gagnes un petit pactole.", { ambition: 4, argent: 60, sport: 1, bonheur: 3 }), O(0.3, "Tu as rayé une voiture avec ta brosse. Il faut rembourser.", { ambition: 2, argent: -20, bonheur: -2 })], { risk: 1 }),
    D("Offrir tes services gratuitement à ta famille", "🏡", "Tu es adoré de toute la famille. Mais ton compte en banque ne bouge pas.", { bonte: 3, rel: { mere: 5 }, bonheur: 3 }),
    D("Tenir une table de limonade", "🍋", "Tu vends de la limonade tiède et du sourire. Ça marche mieux que prévu.", { charme: 3, ambition: 3, argent: 35 }),
  ],
});

ev("cuisine_gateau_catastrophe", {
  ages: [7, 11], tags: ["famille", "loufoque"], ic: "🍰💥", w: 5, roll: { plat: "plats" },
  t: "Tu décides de préparer un gâteau pour toute la famille, sans l'aide de personne. Recette, farine, œufs. Tu mélanges tout... et tu rajoutes un peu de $plat, par curiosité.",
  c: [
    C("L'enfourner et prier", "🔥", [O(0.3, "Un miracle. Le goût est étrange, mais tout le monde en redemande.", { creatif: 5, bonheur: 5, repute: 3 }), O(0.7, "Le gâteau fait une explosion de crème dans le four. Cuisine à nettoyer, famille morte de rire.", { creatif: 2, bonheur: 3, argent: -10 })]),
    D("Appeler ton père à la rescousse", "🆘", "Vous sauvez le gâteau ensemble. Ton père te félicite pour ton audace.", { rel: { pere: 8 }, bonheur: 4 }),
    D("Tout jeter et recommencer", "🗑️", "Cette fois, tu suis la recette. Le gâteau est correct. Tu as appris quelque chose.", { prudent: 3, intel: 2, bonheur: 2 }),
  ],
});

ev("dispute_amis_secret", {
  ages: [8, 11], tags: ["amis"], ic: "🤫💔", w: 5, who: { ami: "friend", copain: "bestfriend" },
  t: "$ami t'a confié un secret énorme, il a le béguin pour la fille du boulanger. Le soir, $copain te demande avec insistance ce qu'$ami t'a dit.",
  c: [
    D("Garder le secret", "🔒", "Tu tiens ta langue. $ami l'apprend et t'est reconnaissant à vie.", { honnete: 4, rel: { ami: 12, copain: -3 }, bonheur: 2 }),
    C("Tout raconter à $copain", "📣", [O(0.5, "$copain promet de garder le secret, mais toute la classe le sait le lendemain.", { honnete: -4, rel: { ami: -15, copain: 6 }, bonheur: -3 }), O(0.5, "$copain garde le secret... mais en parle à ses frères.", { honnete: -3, rel: { ami: -10 }, bonheur: -1 })], { risk: 1 }),
    D("Inventer un faux secret", "🎭", "Tu leur racontes une histoire de licornes cachées sous l'école. Tout le monde y croit.", { creatif: 4, honnete: -2, bonheur: 2 }),
  ],
});

ev("zoo_sortie", {
  ages: [6, 10], tags: ["ecole", "animal"], ic: "🦒🐒", w: 5, who: { ami: "friend" },
  t: "Sortie scolaire au zoo ! Un singe vole la casquette de ton ami $ami. Il la porte avec fierté, assis sur un rocher.",
  c: [
    C("Tenter de la récupérer", "🙈", [O(0.4, "Le singe te rend la casquette en échange de ton goûter. Tu es un diplomate.", { charme: 3, courage: 3, rel: { ami: 8 }, bonheur: 3 }), O(0.6, "Le singe te jette ton propre bonnet. Tu te fais huer.", { repute: -2, bonheur: 1, rel: { ami: 2 } })]),
    D("Prévenir un gardien", "🧑‍✈️", "Le gardien récupère la casquette avec une banane. Tu es un peu déçu(e) de ne pas avoir tout fait.", { prudent: 3, honnete: 2, rel: { ami: 4 } }),
    D("Rire avec $ami et prendre une photo", "📸", "Le souvenir est parfait, un singe en casquette. Quelle joie !", { bonheur: 5, rel: { ami: 8 }, creatif: 2 }),
  ],
});

ev("histoire_de_vacances_plage", {
  ages: [6, 11], tags: ["famille", "voyage"], ic: "🏖️🦀", w: 6,
  t: "En vacances à la plage, tu construis un énorme château de sable. Les vagues arrivent, impitoyables, et un crabe tente d'y emménager.",
  c: [
    D("Défendre ton château jusqu'au bout", "🏰", "Tu creuses des douves, tu bâtis des murs. Le château tient plus longtemps que tous les autres.", { courage: 3, creatif: 3, bonheur: 4 }),
    D("Laisser le crabe s'installer", "🦀", "Le crabe t'adopte, c'est ton colocataire. Tu retournes lui dire bonjour chaque jour.", { bonte: 3, creatif: 3, bonheur: 4 }),
    D("Détruire le château toi-même avant la mer", "💥", "Tu hurles de joie en sautant dessus. Quel spectacle !", { courage: 2, bonheur: 4, sport: 1 }),
  ],
});

ev("tricot_mamie", {
  ages: [6, 11], tags: ["famille"], ic: "🧶👵", w: 3,
  t: "Mamie t'a tricoté un pull. Il est trop grand, trop vert, et il a des petits dragons sur les manches. Tes copains vont se moquer.",
  c: [
    D("Le porter fièrement à l'école", "💚", "Un copain trouve ça génial et en veut un. Tu deviens un trendsetter malgré toi.", { charme: 2, repute: 2, bonte: 3, rel: { mere: 3 }, bonheur: 3 }),
    D("Le cacher au fond de ton sac", "🎒", "Tu l'enfiles en rentrant, mamie est ravie. Le secret est bien gardé.", { prudent: 2, honnete: -1, bonheur: 1 }),
    D("L'échanger contre un paquet de billes", "🔴", "Mamie le saura un jour. Tu auras de la peine à lui répondre.", { honnete: -3, argent: 5, bonheur: 1 }),
  ],
});

ev("controle_dictee", {
  ages: [6, 11], tags: ["ecole"], ic: "✏️📓", w: 6, who: { prof: "teacher" },
  t: "Dictée surprise. Le texte est rempli de mots tordus, comme « rhododendron » et « pneumatique ». {$prof:M.|Mme} $prof lit en articulant exagérément.",
  c: [
    D("Écrire au plus près du son", "🔊", "Orthographe approximative, mais la phonétique est au point. Note honorable.", { notes: 2, intel: 1 }),
    C("Jeter un œil au voisin", "👀", [O(0.4, "Tu copies sans te faire repérer et gagnes quelques points.", { notes: 4, honnete: -3 }), O(0.6, "{$prof:M.|Mme} $prof t'a vu(e), zéro pointé.", { notes: -6, honnete: -3, rel: { prof: -6 } })], { risk: 1 }),
    D("Te concentrer à fond", "🧠", "Tu fais un sans-faute. Ta fierté déborde.", { notes: 6, intel: 2, bonheur: 3 }),
  ],
});

ev("doudou_perdu", {
  ages: [6, 9], tags: ["famille"], ic: "🧸😭", w: 4,
  t: "Ton doudou a disparu ! Tu le cherches partout, sous le lit, dans le jardin, derrière la machine à laver. Tu n'arrives plus à dormir.",
  c: [
    C("Lancer une opération de recherche avec toute la famille", "🔦", [O(0.7, "Le doudou est retrouvé dans le panier du chien. Soulagement général.", { bonheur: 5, rel: { mere: 5, pere: 5 } }), O(0.3, "Introuvable. Ta mère t'en offre un nouveau, il ne sent pas pareil.", { bonheur: -2, intel: 1 })]),
    D("Te passer de doudou, cette nuit", "💪", "Dure nuit, mais tu es fier(e). Tu grandis.", { courage: 3, bonheur: -2 }),
    D("Adopter un nouveau doudou, un hérisson en peluche", "🦔", "Tu l'appelles Pique-Pique. Il est un peu dur, mais très fidèle.", { creatif: 2, bonheur: 3 }),
  ],
});

ev("balade_foret_champignon", {
  ages: [7, 11], tags: ["aventure", "sante"], ic: "🍄🌲", w: 4, who: { pere: "pere" },
  t: "En balade en forêt, ton père te montre des champignons. L'un d'eux est énorme et d'un rouge très appétissant, avec des petits points blancs.",
  c: [
    C("Goûter un petit morceau", "👅", [O(0.5, "Tu as des visions de licornes pendant une heure. Tu rentres à la maison avec la fièvre.", { sante: -6, courage: 3, bonheur: -1 }), O(0.5, "Ça ne goûte rien. Ton père soupire d'effroi.", { courage: 2, rel: { pere: -3 } })], { risk: 2 }),
    D("Ramasser les bons champignons avec ton père", "🧺", "Vous faites une belle omelette au retour. Une journée simple et douce.", { rel: { pere: 8 }, intel: 2, bonheur: 4 }),
    D("Dessiner le champignon rouge dans ton carnet", "🖊️", "Tu deviens un expert en champignons toxiques. Une compétence qui servira peut-être.", { intel: 3, creatif: 2 }),
  ],
});

ev("blague_prof", {
  ages: [8, 11], tags: ["ecole", "loufoque"], ic: "🤡📚", w: 5, who: { prof: "teacher", ami: "friend" },
  t: "$ami te met au défi de glisser un faux serpent dans le tiroir de {$prof:M.|Mme} $prof. Il paraît que c'est une tradition qui remonte à loin.",
  c: [
    C("Relever le défi", "🐍", [O(0.5, "{$prof:M.|Mme} $prof a hurlé de rire. Le serpent est resté dans la classe, comme mascotte.", { courage: 4, repute: 3, bonheur: 4, rel: { prof: 3 } }), O(0.5, "{$prof:M.|Mme} $prof n'a pas du tout apprécié. Retenue pendant deux semaines.", { courage: 3, notes: -2, rel: { prof: -10, ami: 4 } })], { risk: 1 }),
    D("Refuser poliment", "🙏", "$ami hausse les épaules. Tu n'as pas envie de faire de la peine.", { prudent: 2, rel: { prof: 3, ami: -3 } }),
    D("Proposer une blague moins risquée", "💡", "Un faux nez sur le portrait du président. L'ambiance est géniale.", { creatif: 3, charme: 2, repute: 2, bonheur: 3 }),
  ],
});

ev("histoire_amitie_nouvel_eleve", {
  ages: [6, 11], tags: ["amis", "ecole"], ic: "🧒🆕", w: 6,
  t: "Un nouvel élève arrive dans ta classe. Il est timide, il a un accent étrange et ne parle à personne. Il est assis seul dans la cour.",
  c: [
    D("Aller lui parler et l'inviter à jouer", "🤗", "Ça devient un super copain, et vous bâtissez une amitié qui durera.", { bonte: 4, sociable: 3, bonheur: 4, repute: 2 }),
    D("Laisser les autres s'en occuper", "😶", "Il finit par se faire des amis ailleurs. Tu te sens un peu coupable.", { prudent: 1, bonheur: -1 }),
    D("Te moquer avec les autres", "🙃", "La blague tombe à plat et tu as honte. Le lendemain, tu t'excuses.", { bonte: -3, honnete: 2, repute: -2 }),
  ],
});

ev("piege_fantome_grenier", { who: { ami: "friend" },
  ages: [8, 11], tags: ["loufoque", "aventure"], ic: "👻🏚️", w: 3,
  t: "Les enfants du quartier disent qu'un fantôme habite la maison abandonnée au bout de la rue. Ce soir, c'est le défi, il faut y entrer et rapporter quelque chose.",
  c: [
    C("Entrer le premier avec une lampe", "🔦", [O(0.5, "Tu y trouves un vieux chandelier en argent. Un cadeau du fantôme ?", { courage: 6, repute: 5, bonheur: 4, item: { kind: "or", name: "Chandelier en argent", value: 400 } }), O(0.5, "Tu croises un fantôme sympa qui te demande l'heure. Tu lui réponds poliment.", { courage: 5, creatif: 3, bonheur: 3, flag: "a_vu_fantome" })], { risk: 1 }),
    D("Te contenter d'attendre dehors", "🌙", "Tu fais le guet, c'est quand même un rôle important.", { prudent: 3, rel: { ami: 2 } }),
    D("Rentrer te coucher, c'est trop tard", "🛏️", "Tu manques ton aventure, mais tu dors bien. On se moque un peu de toi.", { prudent: 3, courage: -2, repute: -2 }),
  ],
});

ev("grand_frere_defi", {
  ages: [7, 11], tags: ["famille", "jeu"], ic: "🕹️🏆", w: 3, need: { rel: "sibling" }, who: { frere: "sibling" },
  t: "$frere te défie à un jeu de société qui dure des heures. Le gagnant choisit le film de ce soir.",
  c: [
    C("Jouer sérieusement", "♟️", [O(0.5, "Tu écrases $frere et choisis un film de dragons.", { intel: 3, rel: { frere: 4 }, bonheur: 4 }), O(0.5, "$frere gagne et choisit un film de maths. Aïe.", { rel: { frere: 4 }, bonheur: -1 })]),
    C("Tricher à fond", "🎲", [O(0.5, "Tu gagnes, et tu te sens un peu mal.", { honnete: -3, bonheur: 3, rel: { frere: -2 } }), O(0.5, "$frere te surprend, le jeu vole dans la pièce.", { honnete: -2, rel: { frere: -8 }, bonheur: -2 })], { risk: 1 }),
    D("Proposer de choisir le film à deux", "🤝", "Vous regardez un film sur les dinosaures. C'est un compromis parfait.", { sociable: 3, rel: { frere: 8 }, bonheur: 4 }),
  ],
});

ev("balade_neige_bataille", {
  ages: [6, 11], tags: ["amis", "jeu"], ic: "☃️❄️", w: 5, who: { ami: "friend", rival: "rival" },
  t: "Il a neigé toute la nuit ! Dans la cour, la bataille de boules de neige entre deux camps commence. $ami te veut dans son équipe, $rival dans la sienne.",
  c: [
    D("Rejoindre $ami", "⚪", "Vous gagnez avec un barrage de boules de neige. Chocolat chaud pour tous.", { sociable: 3, bonheur: 5, rel: { ami: 8 }, sport: 2 }),
    D("Rejoindre $rival", "🔵", "Tu changes de camp, et $rival est reconnaissant. $ami fait la tête.", { charme: 1, rel: { ami: -6, rival: 10 }, bonheur: 3 }),
    D("Rester seul(e) et construire un bonhomme de neige géant", "⛄", "Il devient la mascotte de l'école, avec une carotte de trois mètres.", { creatif: 4, bonheur: 4, repute: 3 }),
  ],
});

ev("lunettes_vue", {
  ages: [6, 11], tags: ["sante"], ic: "👓🤓", w: 4,
  t: "L'opticien annonce que tu as besoin de lunettes. Tu dois choisir une monture. Il y a des rouges, des rondes, et une paire en forme de poisson.",
  c: [
    D("Les lunettes poisson", "🐟", "Elles sont ridicules et tu les adores. Tu es la star de la classe pendant une semaine.", { creatif: 3, repute: 2, bonheur: 3, charme: -1 }),
    D("Une monture ronde, sage", "👓", "Tu ressembles à un petit professeur. Tu y vois enfin clair !", { intel: 1, bonheur: 2, notes: 2 }),
    D("Refuser de les porter", "🙈", "Tu plisses les yeux en classe, et ta tête te fait mal le soir.", { sante: -3, notes: -3, bonheur: -2 }),
  ],
});

ev("naufrage_baignoire", {
  ages: [6, 9], tags: ["loufoque", "jeu"], ic: "🛁⛵", w: 3,
  t: "Tu transformes la baignoire en océan et le canard en plastique en capitaine. Une grande bataille navale commence, avec des tempêtes de mousse.",
  c: [
    D("Faire déborder la baignoire pour la tempête", "🌊", "L'eau inonde la salle de bain. Ta mère arrive avec une serpillière et un air terrible.", { creatif: 3, bonheur: 4, rel: { mere: -4 }, argent: -5 }),
    D("Inventer une histoire avec le canard", "🦆", "Le capitaine Coin-Coin sauve la flotte. Tu pourrais en faire un livre.", { creatif: 5, bonheur: 4 }),
    D("Sortir du bain et réviser tes leçons", "📘", "Tu as une conscience professionnelle d'enfant sage, c'est rare.", { notes: 2, prudent: 2, bonheur: -1 }),
  ],
});

ev("dispute_parents_nuit", {
  ages: [7, 11], tags: ["famille"], ic: "🌙🗣️", w: 3, who: { mere: "mere", pere: "pere" },
  t: "Dans la nuit, tu entends tes parents se disputer dans la cuisine. Tu ne comprends pas tout, mais leurs voix sont fatiguées.",
  c: [
    D("Descendre leur faire un câlin", "🤗", "Ils s'arrêtent, te serrent dans leurs bras, et la dispute se calme.", { bonte: 3, rel: { mere: 6, pere: 6 }, bonheur: 2 }),
    D("Rester caché dans ton lit, serrant ton doudou", "🛏️", "Tu t'endors les yeux humides. Le lendemain, tout va mieux.", { prudent: 2, bonheur: -3 }),
    D("Écrire un petit mot et le glisser sous leur porte", "💌", "Au matin, ils te remercient les larmes aux yeux.", { creatif: 3, bonte: 4, rel: { mere: 5, pere: 5 }, bonheur: 2 }),
  ],
});

ev("sorcier_ecole_pschitt", {
  ages: [8, 11], tags: ["loufoque", "ecole"], ic: "🧙✨", w: 3,
  t: "Un sorcier miteux s'invite à l'école pour une animation scientifique. Il fait des tours qui font « pschitt » et disparaît dans un nuage de confettis. Il cherche un assistant volontaire.",
  c: [
    C("Devenir son assistant", "🪄", [O(0.5, "Tu manies la baguette, tout explose, c'est un triomphe. Tu hérites d'une petite baguette.", { creatif: 5, bonheur: 5, repute: 4, flag: "baguette_magique" }), O(0.5, "Le sorcier te transforme en grenouille pendant dix secondes. C'est dur, mais tu rigoles.", { courage: 3, bonheur: 3, repute: 2 })], { risk: 1 }),
    D("Lui poser des questions sur les formules", "📜", "Il t'apprend deux ou trois mots magiques. Ils ne marchent pas, mais ils sont drôles.", { intel: 3, creatif: 2, bonheur: 2 }),
    D("Te cacher sous la table", "🫣", "Tu n'es pas fan de la magie. Tu passes un après-midi tranquille, malgré les pétards.", { prudent: 3, courage: -1 }),
  ],
});

ev("cartable_trop_lourd", {
  ages: [6, 10], tags: ["ecole", "sante"], ic: "🎒🏋️", w: 3,
  t: "Ton cartable pèse plus lourd que toi. Tu y as mis tous tes livres, un dictionnaire, un échiquier et une brique que tu trouves jolie.",
  c: [
    D("Tout garder, ça te muscle", "💪", "Après quelques semaines, tu as des muscles de déménageur. Ton dos est moins ravi.", { sport: 4, sante: -2, bonheur: 1 }),
    D("Alléger ton sac", "🪶", "Tu respires. Ton dos te remercie.", { sante: 2, prudent: 3 }),
    D("Tirer ton cartable sur un petit chariot", "🛒", "Tu deviens la risée de l'école, mais tu ne portes rien.", { creatif: 3, repute: -2, sante: 1 }),
  ],
});

ev("surprise_chat_gouttiere", {
  ages: [6, 11], tags: ["animal"], ic: "🐈🏠", w: 4,
  t: "Un chaton est coincé dans la gouttière du voisin, et miaule à fendre l'âme. Il n'y a personne pour l'aider.",
  c: [
    C("Grimper pour le sauver", "🧗", [O(0.6, "Tu le sauves ! Le voisin te remercie avec un grand sourire. Le chaton te suivra désormais partout.", { courage: 5, bonte: 4, repute: 4, bonheur: 5, flag: "chaton_adopte" }), O(0.4, "Tu te retrouves coincé(e) avec le chat. Les pompiers viennent vous chercher.", { courage: 3, sante: -2, repute: 2, bonheur: 2 })], { risk: 2 }),
    D("Appeler les pompiers", "🚒", "Ils arrivent, sirène hurlante, et sauvent le chat. Tu es en effet un citoyen modèle.", { prudent: 3, honnete: 2, bonheur: 2 }),
    D("Lui lancer des croquettes", "🥫", "Il descend tout seul, tout simplement. Parfois, la solution est facile.", { intel: 3, bonheur: 3 }),
  ],
});

flash("Tu as gagné une partie de billes devant toute l'école. Tes poches sont lourdes.", { argent: 2, bonheur: 1, repute: 1 }, { ages: [6, 11], ic: "🔴" });
flash("Ton premier tour de manège te rend un peu malade, mais très heureux.", { bonheur: 2, sante: -1 }, { ages: [6, 11], ic: "🎠" });
flash("La maîtresse t'a collé une gommette dorée pour ton comportement exemplaire.", { bonheur: 2, repute: 1 }, { ages: [6, 10], ic: "⭐" });
flash("Tu as perdu une dent dans un yaourt. Le yaourt est déclaré inviolable.", { bonheur: 1 }, { ages: [6, 9], ic: "🦷" });
flash("Un pigeon te vole ton goûter au beau milieu de la cour.", { bonheur: -1 }, { ages: [6, 11], ic: "🕊️" });
flash("Tu as appris à faire un nœud de lacet sans l'aide de personne. Chef-d'œuvre !", { intel: 1, bonheur: 2 }, { ages: [6, 8], ic: "👟" });
flash("Ton équipe de foot gagne le tournoi de l'école, grâce à ton but miraculeux.", { sport: 2, repute: 2, bonheur: 3 }, { ages: [7, 11], ic: "⚽" });
flash("Tu as un fou rire pendant la minute de silence. Tu es envoyé(e) chez le directeur.", { repute: -1, bonheur: 1, notes: -1 }, { ages: [6, 11], ic: "🤭" });
flash("Il pleut des cordes pendant la sortie de classe. Tout le monde saute dans les flaques.", { bonheur: 2, sante: -1 }, { ages: [6, 11], ic: "☔" });
flash("Tu as trouvé une pièce de deux euros dans la cour. Quelle chance !", { argent: 2, bonheur: 1 }, { ages: [6, 11], ic: "🪙" });
