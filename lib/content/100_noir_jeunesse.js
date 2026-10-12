// HUMOUR NOIR 1/4 — Enfance, école, adolescence, amitiés, soirées
// Les ids commencent par n_ . Les scènes chainOnly sont des conséquences différées.
const { ev, flash, O, C, D } = require("../kit");

// ============ ENFANCE ET ÉCOLE ============
ev("n_pipi_classe", {
  title: "Le déluge du mardi", ages: [6, 9], tags: ["enfance"], ic: "💦🧒", rar: "peu",
  t: "Tu lèves la main trop tard. En quelques secondes, ta chaise devient un petit lac et toute la classe tourne la tête avec une précision de projecteur.",
  c: [
    D("Assumer avec dignité", "🫡", "Tu te lèves, tu annonces « c'est la fontaine » et tu sors la tête haute. La classe applaudit ton culot.", { courage: 3, repute: 1, bonheur: -1, flag: "honte_classe" }),
    C("Accuser le voisin", "👉", [O(0.5, "Le voisin pleure, tout le monde te croit. Il portera cette réputation jusqu'au collège.", { honnete: -4, bonheur: 2, repute: 1 }), O(0.5, "La maîtresse remarque que la flaque est sous TA chaise. L'accusation devient légendaire.", { honnete: -4, bonheur: -4, repute: -2, flag: "honte_classe" })], { risk: 1 }),
    D("Éclater en sanglots", "😭", "La maîtresse te console, ta mère te rapporte un pantalon propre et un biscuit.", { bonheur: -2, bonte: 1, flag: "honte_classe", later: { id: "n_retrouvailles_honte", in: [15, 30], p: 0.6 } }),
  ],
});

ev("n_retrouvailles_honte", {
  chainOnly: true, title: "On n'oublie jamais", tags: ["amis"], ic: "🥂😬",
  t: "Au repas des retrouvailles de ton ancienne classe, quelqu'un lève son verre et lance « et si on parlait du fameux mardi ? ». Tout le monde se tourne vers toi avec un sourire immense. Vingt ans ont passé, mais la flaque est toujours là.",
  c: [
    D("En rire avec tout le monde", "😂", "Tu racontes ta version avec des effets de manche. La soirée t'appartient.", { sociable: 3, bonheur: 4, repute: 2 }),
    D("Quitter la table discrètement", "🚪", "Tu invoques une urgence imaginaire. Personne n'est dupe.", { bonheur: -3, sociable: -2 }),
    C("Révéler ce que tu sais sur les autres", "😈", [O(0.5, "La contre-attaque est cruelle et brillante. La table est en larmes de rire.", { repute: 2, bonheur: 3, bonte: -2 }), O(0.5, "Tu mets le feu à la table. Trois personnes ne te parleront plus.", { repute: -4, bonheur: -3, bonte: -3 })], { risk: 1 }),
  ],
});

ev("n_gage_maudit", {
  title: "Le gage de la cour", ages: [7, 11], tags: ["enfance"], ic: "🤞📜", rar: "peu", who: { ami: "friend" },
  t: "Pendant la récré, $ami te lance un défi absurde. Tu promets, main sur le cœur et doigts croisés, que dans vingt ans vous serez mariés ou associés, au choix. La cloche sonne, personne ne se souvient de rien, sauf toi.",
  c: [
    D("Signer en cachette avec du feutre", "🖊️", "Un petit papier plié au fond de ta trousse. Un jour, il ressortira.", { bonheur: 2, creatif: 1, rel: { ami: 8 }, later: { id: "n_promesse_gage", in: [18, 32], keep: true, p: 0.7 } }),
    D("Oublier aussitôt", "🙈", "Une parole d'enfant, une parole de vent.", { bonheur: 1 }),
  ],
});
ev("n_promesse_gage", {
  chainOnly: true, title: "La promesse du préau", tags: ["amis"], ic: "📜😳", who: { ami: "friend" },
  t: "Dans un vieux carton, tu retrouves un papier plié, griffonné au feutre rouge. « Dans 20 ans, $ami et moi, on se marie ou on monte une boîte ensemble. » C'est signé, daté, et tu as même dessiné un dinosaure en guise de sceau.",
  c: [
    C("Appeler $ami et proposer de tenir parole", "📞", [O(0.4, "Vous montez une petite entreprise absurde, qui marche à votre grande surprise.", { argent: 4000, bonheur: 6, ambition: 2, rel: { ami: 20 } }), O(0.3, "Vous vous mariez... pour rire, devant le maire. Le divorce est prévu pour la semaine suivante.", { bonheur: 5, rel: { ami: 15 }, repute: 1 }), O(0.3, "$ami a complètement oublié et pense à une plaisanterie de mauvais goût.", { bonheur: -2, rel: { ami: -5 } })], { risk: 1 }),
    D("Encadrer le papier et le garder", "🖼️", "Un souvenir précieux. Il trône désormais dans ton salon.", { bonheur: 3, creatif: 1 }),
    D("Le brûler pour ne plus y penser", "🔥", "Les cendres s'envolent. Un poids tombe, ou presque.", { bonheur: 0 }),
  ],
});

ev("n_poisson_rouge", {
  title: "Les adieux de Gaston", ages: [6, 10], tags: ["enfance"], ic: "🐟🚽", rar: "peu",
  t: "Ton poisson rouge flotte le ventre en l'air. Tu veux lui offrir des funérailles dignes, mais ta mère dit « les toilettes, c'est ce qu'il y a de plus rapide ». Tu es partagé{|e} entre le chagrin et le tourbillon.",
  c: [
    D("Organiser des funérailles dans le jardin", "⚰️", "Une boîte à chaussures, un discours de trois phrases et un voisin qui pleure plus que toi. Beau moment.", { bonte: 3, bonheur: 1, creatif: 2 }),
    C("Tirer la chasse d'eau avec solennité", "🚽", [O(0.7, "Gaston part vers la mer. Tu le salues d'un geste militaire.", { courage: 2, bonheur: -1 }), O(0.3, "Le poisson revient, vivant, dans la cuvette. Le trauma est immense.", { bonheur: -4, courage: -1, creatif: 1 })], { risk: 1 }),
    D("Prétendre qu'il est en vacances", "🏖️", "Tu inventes une croisière tropicale. Ton petit frère y croit et demande des cartes postales.", { honnete: -2, creatif: 3, bonheur: 1 }),
  ],
});

ev("n_dessin_maitresse", {
  title: "Le portrait de trop", ages: [6, 9], tags: ["enfance", "ecole"], ic: "🖍️👩‍🏫", rar: "peu", who: { prof: "teacher" },
  t: "Tu dessines $prof avec une bouche immense et des dents très pointues. Elle voit le dessin, blêmit et te convoque avec tes parents. Le mot « psychologue » circule dans les couloirs.",
  c: [
    D("Expliquer que c'est un compliment", "🎨", "Ton talent d'orateur désarme tout le monde. Le dessin est accroché au tableau d'honneur.", { creatif: 3, charme: 1, bonheur: 3, rel: { prof: 5 } }),
    D("Pleurer très fort", "😭", "La maîtresse culpabilise et t'offre une sucette. Efficace mais honteux.", { honnete: -2, bonheur: 1, rel: { prof: -3 } }),
    C("Faire un deuxième dessin pire encore", "😈", [O(0.4, "La maîtresse éclate de rire. Vous devenez complices.", { creatif: 3, bonheur: 4, rel: { prof: 10 } }), O(0.6, "Rendez-vous chez le directeur. Ta mère ne te parle plus pendant deux jours.", { bonheur: -3, repute: -2, rel: { prof: -12 } })], { risk: 1 }),
  ],
});

ev("n_mensonge_papa_astronaute", {
  title: "Mon père est astronaute", ages: [6, 9], tags: ["enfance"], ic: "🚀🤥", rar: "peu", who: { pere: "pere" },
  t: "Pour impressionner la cour, tu annonces que ton père est astronaute. Dix minutes plus tard, toute l'école le sait. Le lendemain, la directrice voudrait « l'inviter à parler aux élèves ».",
  c: [
    C("Tenir le mensonge à tout prix", "🌌", [O(0.35, "Ton père, bon joueur, enfile une combinaison de bricolage et passe une heure à parler. Tu es un héros.", { repute: 4, bonheur: 5, rel: { pere: 10 } }), O(0.65, "Ton père arrive en costume de plombier. La cour hurle de rire.", { bonheur: -4, repute: -2, honnete: -2, rel: { pere: -5 } })], { risk: 1 }),
    D("Tout avouer", "😳", "Tu confesses, la directrice sourit. Les moqueries durent trois jours.", { honnete: 3, bonheur: -2, repute: -1 }),
    D("Dire qu'il est parti en mission secrète", "🕵️", "Un mystère de plus. Tu deviens la légende de l'école.", { creatif: 3, repute: 2, honnete: -2 }),
  ],
});

ev("n_lettre_futur", {
  title: "Lettre à moi-même", ages: [9, 13], tags: ["enfance", "ecole"], ic: "✉️⏳", rar: "peu",
  t: "Le maître vous fait écrire une lettre à votre futur vous, à ouvrir dans vingt ans. Tu t'appliques, avec des fautes et quelques promesses grandioses. Tu glisses aussi un secret, au cas où.",
  c: [
    D("Écrire sérieusement tes rêves", "🌠", "Tu notes ce que tu veux devenir. Le papier retourne dans une boîte.", { ambition: 2, creatif: 1, later: { id: "n_lettre_arrive", in: [18, 30], p: 0.8 } }),
    D("Y glisser une blague nulle", "🤡", "Un message très profond, « t'as perdu tes cheveux ? ». Le futur ne rira peut-être pas.", { creatif: 1, bonheur: 2, later: { id: "n_lettre_arrive", in: [18, 30], p: 0.8 } }),
    D("Y dessiner un robot géant", "🤖", "Une œuvre d'art, à n'en pas douter.", { creatif: 3, later: { id: "n_lettre_arrive", in: [18, 30], p: 0.8 } }),
  ],
});
ev("n_lettre_arrive", {
  chainOnly: true, title: "Reçu avec vingt ans de retard", tags: ["amis"], ic: "📬🧒",
  t: "Un courrier jauni arrive dans ta boîte aux lettres. Ton écriture d'enfant, des fautes, un dessin d'astronaute, et la phrase « si tu n'es pas milliardaire, tu es nul ». La lettre te regarde droit dans les yeux.",
  c: [
    D("Relever le défi", "🔥", "Tu te remets à rêver grand. L'enfant que tu étais t'adresse un vrai coup de pied aux fesses.", { ambition: 4, bonheur: 3 }),
    D("Rire et la ranger", "😂", "Tu as bien changé, le monde aussi. Tu gardes l'astronaute.", { bonheur: 3, creatif: 1 }),
    D("La montrer à tes amis", "📣", "Elle fait le tour de la soirée. Le robot géant reçoit une standing ovation.", { sociable: 2, bonheur: 4, repute: 1 }),
  ],
});

ev("n_cantine_guerre", {
  title: "La bataille de la purée", ages: [6, 12], tags: ["enfance", "ecole"], ic: "🥔⚔️", rar: "commun",
  t: "Un petit pois, un lancer approximatif, un cri de guerre. En deux minutes, la cantine entière devient un champ de bataille de purée et de compote. Le surveillant se réfugie derrière un plateau.",
  c: [
    C("Attaquer sans pitié", "🥄", [O(0.5, "Tu es le héros de la cour, couvert de purée mais le plus acclamé.", { repute: 3, bonheur: 5, courage: 2 }), O(0.5, "Tu touches le directeur en pleine figure. Il pose son plateau avec une lenteur terrifiante.", { repute: -2, bonheur: -3, courage: 1, argent: -20 })], { risk: 1 }),
    D("Te cacher sous la table", "🫣", "Tu observes la guerre comme un correspondant de terrain. Aucun dégât.", { prudent: 2, bonheur: 1 }),
    D("Faire respecter l'ordre", "🙋", "Tu cries « stop ». Tout le monde te regarde, puis te lance de la purée.", { courage: 2, honnete: 1, repute: 1, bonheur: -1 }),
  ],
});

ev("n_triche_dictee", {
  title: "La dictée de la honte", ages: [7, 12], tags: ["enfance", "ecole"], ic: "✏️👀", rar: "commun", who: { prof: "teacher" },
  t: "Tu n'as rien appris. Le voisin, lui, a tout révisé. Sa feuille est pile dans ton angle de vue, comme une offrande du ciel.",
  c: [
    C("Copier discrètement", "👀", [O(0.55, "Tu as la meilleure note de ta vie. Le voisin a fait trois fautes volontaires.", { notes: 8, honnete: -3, bonheur: 3 }), O(0.45, "$prof te voit, prend les deux copies et appelle tes parents.", { notes: -10, honnete: -3, bonheur: -4, repute: -2, rel: { prof: -10 }, flag: "tricheur_ecole" })], { risk: 1 }),
    D("Rendre une copie honnête et vide", "📄", "Un beau zéro, mais tout est propre. Ta maîtresse note ta franchise.", { notes: -6, honnete: 3, bonheur: -1 }),
    D("Inventer des mots", "🪄", "Tu écris « le chat fouillait dans la cabulette ». Le dictionnaire n'a rien à dire.", { creatif: 3, notes: -3, bonheur: 2 }),
  ],
});

ev("n_poux_epidemie", {
  title: "L'invasion", ages: [6, 10], tags: ["enfance"], ic: "🪲🧒", rar: "commun",
  t: "Un message de l'école tombe, dix-sept lettres, trois points d'exclamation. Il y a des poux dans la classe. Ta tête commence à te démanger avec une conviction suspecte.",
  c: [
    D("Se faire peigner par ta mère", "🪮", "Une heure de supplice, trois prières, zéro pou. Tu t'en sors indemne.", { sante: 0, bonheur: -1, rel: { mere: 3 } }),
    D("Raser la tête de ton frère par solidarité", "💈", "Une coupe radicale. Il ressemble à un œuf, il t'en veut pour la vie.", { bonte: -1, bonheur: 1, creatif: 2 }),
    D("Nier jusqu'au bout", "🙈", "Tu continues à jouer comme si de rien n'était. La moitié de la classe te remercie en grattant.", { honnete: -2, bonheur: 1, repute: -1 }),
  ],
});

ev("n_voyage_scolaire_chaos", {
  title: "La classe de neige", ages: [9, 13], tags: ["enfance", "ecole"], ic: "🏔️🚌", rar: "commun",
  t: "Une semaine au chalet avec trente enfants, deux accompagnateurs épuisés et un car qui sent le chocolat chaud. La première nuit, un élève hurle que le chalet est hanté.",
  c: [
    C("Mener l'enquête", "🔦", [O(0.5, "Le fantôme est un accompagnateur somnambule. Tu deviens la légende du voyage.", { courage: 3, repute: 3, bonheur: 5 }), O(0.5, "Tu tombes dans l'escalier et passes la semaine en chaussette plâtrée.", { courage: 2, sante: -2, bonheur: -2 })], { risk: 1 }),
    D("Te cacher sous la couette", "🛏️", "Un fantôme de plus ou de moins, tu n'as rien vu.", { prudent: 2, bonheur: 0 }),
    D("Organiser une soirée contes", "📖", "Tu terrorises tout le dortoir avec une histoire de loup-garou. Ils t'adorent, les moniteurs moins.", { creatif: 3, repute: 2, bonheur: 4 }),
  ],
});

// ============ ADOLESCENCE ============
ev("n_video_fete_ado", {
  title: "Ne pas la regarder", ages: [14, 17], tags: ["ado", "reseaux"], ic: "📹😖", rar: "peu",
  t: "Une soirée pyjama dérape. Quelqu'un te filme en train de danser sur le canapé, un coussin sur la tête et une chanson inventée aux lèvres. La vidéo circule déjà dans le groupe de la classe.",
  c: [
    D("Demander à tout le monde de la supprimer", "🙏", "La plupart la suppriment. Deux exemplaires survivent, forcément.", { honnete: 1, bonheur: -2, flag: "video_honte", later: { id: "n_retour_video", in: [10, 25], p: 0.65 } }),
    D("La poster toi-même avec une légende drôle", "😎", "Ton autodérision coupe l'herbe sous le pied des moqueurs. La vidéo reste, mais c'est toi qui la possèdes.", { courage: 3, repute: 2, bonheur: 2, flag: "video_honte", later: { id: "n_retour_video", in: [10, 25], p: 0.65 } }),
    D("Changer de classe", "🏃", "Tu demandes un transfert. Le problème te suit, mais plus lentement.", { bonheur: -3, prudent: 1, flag: "video_honte", later: { id: "n_retour_video", in: [10, 25], p: 0.65 } }),
  ],
});
ev("n_retour_video", {
  chainOnly: true, title: "Elle est revenue", tags: ["reseaux", "travail"], ic: "📹👻",
  t: "Au moment où tu dois présenter un dossier important, quelqu'un prononce ton nom avec un sourire en coin. La vidéo de ta soirée pyjama, vieille de plusieurs années, vient de ressurgir sur un grand écran, en pleine salle de réunion.",
  c: [
    D("En rire avec la salle", "😂", "Ta réaction détend tout le monde. Plusieurs collègues te demandent même la chanson.", { repute: 3, bonheur: 3, perf: 3, charme: 1 }),
    C("Nier que c'est toi", "🙅", [O(0.3, "Un coup de bluff qui fonctionne, la salle passe à autre chose.", { honnete: -2, bonheur: 1 }), O(0.7, "Quelqu'un te reconnaît avec précision, jusqu'au coussin. L'humiliation est totale.", { honnete: -3, repute: -4, perf: -4, bonheur: -3 })], { risk: 2 }),
    D("Quitter la salle avec dignité", "🚪", "Tu ramasses ton dossier et sors. Le dossier est repris par un collègue plus calme.", { perf: -4, bonheur: -3, prudent: 1 }),
  ],
});

ev("n_rumeur_college", {
  title: "Radio couloir", ages: [11, 16], tags: ["ado"], ic: "🗣️🏫", rar: "commun", who: { rival: "rival" },
  t: "Une rumeur absurde court sur toi dans tout le collège. D'après elle, tu serais le petit-fils d'un dictateur oublié ou le propriétaire d'un hamster mutant. Tout le monde te regarde différemment, et $rival entretient la flamme.",
  c: [
    D("Confirmer la rumeur avec aplomb", "🤥", "Tu en rajoutes. En dix jours, on te demande des autographes à la cantine.", { charme: 2, repute: 3, honnete: -3, bonheur: 4 }),
    D("Démentir avec calme", "🕊️", "Le temps passe, la rumeur meurt. Elle reviendra sous une autre forme.", { honnete: 2, bonheur: -1 }),
    C("Inventer une rumeur pire sur $rival", "😈", [O(0.5, "Les regards se détournent de toi, la rumeur change de cible.", { repute: 2, bonheur: 3, bonte: -3, rel: { rival: -15 } }), O(0.5, "Ta riposte se retourne contre toi. Le collège te boude une semaine.", { repute: -4, bonheur: -3, bonte: -3, rel: { rival: -10 } })], { risk: 1 }),
  ],
});

ev("n_premier_baiser", {
  title: "Un baiser, deux dents", ages: [13, 16], tags: ["ado", "amour"], ic: "💋😬", rar: "commun", who: { crush: "crush" },
  t: "Devant le portail du collège, $crush se penche vers toi. Tu fermes les yeux, tu avances, et vos appareils dentaires s'accrochent avec un bruit de ferraille qui fait se retourner trois classes.",
  c: [
    D("Rire et recommencer", "😂", "Un baiser plus calme, plus heureux. Cela devient une histoire que vous raconterez à tout le monde.", { bonheur: 6, charme: 1, rel: { crush: 15 } }),
    D("Fuir en courant", "🏃", "Tu disparais en direction des toilettes. Un souvenir qui reviendra te hanter.", { bonheur: -4, charme: -1, rel: { crush: -10 } }),
    C("Appeler les pompiers pour vous décoller", "🚒", [O(0.4, "Les pompiers sont adorables, la photo finit au journal.", { repute: 4, bonheur: 3, rel: { crush: 10 } }), O(0.6, "Les pompiers rigolent et la scène devient virale à l'échelle du collège.", { repute: -3, bonheur: -3, charme: -1 })], { risk: 1 }),
  ],
});

ev("n_photo_classe_pire", {
  title: "La photo de classe", ages: [10, 16], tags: ["ado", "ecole"], ic: "📸🙃", rar: "commun",
  t: "Au moment du déclic, tu éternues, tu clignes des deux yeux et un camarade te fait des oreilles de lapin. La photo arrive deux semaines plus tard, et ta mère l'encadre sans honte.",
  c: [
    D("L'accepter", "😅", "La photo orne le salon pour les vingt prochaines années. Tout le monde l'adore sauf toi.", { bonheur: -1, charme: -1, rel: { mere: 3 } }),
    D("La retoucher au feutre", "🖊️", "Tu corriges ton visage, mais le feutre a mordu sur les autres. Le professeur est furieux.", { creatif: 2, honnete: -1, bonheur: 1, repute: -1 }),
    D("La faire disparaître", "🔥", "Tu la glisses dans la cheminée. Ta mère demande où est passée la photo des vacances.", { honnete: -2, bonheur: 1 }),
  ],
});

ev("n_fugue_festival", {
  title: "Direction le festival", ages: [15, 17], tags: ["ado"], ic: "🎪🎒", rar: "peu",
  t: "Tu sèches un week-end entier pour suivre des amis à un festival de musique. Les parents ne sont pas au courant, le sac à dos est plein de chips et la tente a trois trous.",
  c: [
    C("Profiter à fond", "🎸", [O(0.55, "Un week-end légendaire, des chansons à plein poumons et une amitié qui naît sous la pluie.", { bonheur: 8, sociable: 3, courage: 2 }), O(0.45, "Tu perds ton portefeuille, ton téléphone et une chaussure.", { bonheur: -3, argent: -100, sante: -2 })], { risk: 1 }),
    D("Rentrer avant que tes parents ne s'inquiètent", "🏠", "Tu rates le meilleur concert mais évites une grosse dispute.", { prudent: 2, bonheur: -1, honnete: 1 }),
    C("Mentir sur l'endroit où tu étais", "🤥", [O(0.5, "Personne n'y voit rien. Ta crédibilité reste intacte.", { honnete: -3, bonheur: 3 }), O(0.5, "Une photo de toi sur la scène arrive aux oreilles de ta mère. Elle est atterrée.", { honnete: -3, bonheur: -4, rel: { mere: -10 } })], { risk: 1 }),
  ],
});

ev("n_pari_toit", {
  title: "Le pari du toit", ages: [12, 17], tags: ["ado"], ic: "🏠🪂", rar: "rare",
  t: "Un camarade te défie de sauter d'un petit toit dans la piscine du voisin. La distance est correcte, mais le niveau de l'eau, lui, est discutable.",
  c: [
    C("Sauter", "🦅", [O(0.8, "Splash magnifique. Le voisin applaudit sans comprendre.", { courage: 4, repute: 3, bonheur: 4 }), O(0.17, "Mauvaise réception, bras cassé et fierté en miettes.", { sante: -8, argent: -200, repute: -1 }), O(0.03, "L'eau est plus basse que prévu. La suite est trop triste.", { die: "après un plongeon raté dans la piscine du voisin" })], { risk: 3 }),
    D("Refuser et proposer un défi plus calme", "🧠", "Une partie d'échecs à cinq. Tu gagnes, personne ne sait comment.", { intel: 2, prudent: 3, bonheur: 1 }),
    D("Pousser l'ami qui a lancé le défi", "😈", "Il saute, il rit, il hurle. La piscine est sa meilleure amie, il te remercie.", { bonte: -1, bonheur: 3, repute: 1 }),
  ],
});

ev("n_journal_intime_lu", {
  title: "Pages arrachées", ages: [11, 16], tags: ["ado", "famille"], ic: "📓😱", rar: "commun", who: { sibling: "sibling" },
  t: "Ton journal intime est sur la table du salon, ouvert à la page la plus embarrassante, entouré de ton frère ou de ta sœur hilare. Il lit à voix haute avec les intonations.",
  c: [
    D("Lui arracher le carnet", "🤼", "Une bagarre homérique, un livre déchiré, une tristesse silencieuse ensuite.", { bonheur: -3, sport: 1, rel: { sibling: -8 } }),
    D("Rire avec lui ou elle", "😂", "Tu transformes la page en parodie. Tout le monde adore.", { charme: 1, bonheur: 3, rel: { sibling: 10 }, honnete: 1 }),
    C("Menacer de révéler ses secrets", "😈", [O(0.6, "Il se calme aussitôt. Un équilibre de la terreur s'installe.", { bonheur: 2, bonte: -2, rel: { sibling: -3 } }), O(0.4, "Il ne cède pas et le salon devient une zone de guerre.", { bonheur: -3, bonte: -2, rel: { sibling: -12 } })], { risk: 1 }),
  ],
});

ev("n_meilleur_ami_trahit", {
  title: "Le poignard dans le dos", ages: [12, 18], tags: ["ado", "amis"], ic: "🗡️🤝", rar: "peu", who: { copain: "bestfriend" },
  t: "$copain, ton meilleur ami depuis toujours, a tout répété à la classe. Tes secrets, ton petit béguin, ta peur des moutons. Les rires dans le couloir ressemblent à un grand orchestre.",
  c: [
    D("Lui parler face à face", "🗣️", "Il pleure, s'excuse, promet. Une amitié abîmée mais réparable.", { courage: 3, honnete: 2, rel: { copain: -5 } }),
    D("Ne plus jamais lui parler", "🧊", "Tu bloques le contact, tu changes de table. La solitude pèse plus que prévu.", { bonheur: -4, bonte: -1, becomes: { copain: "enemy" } }),
    C("Se venger au bon moment", "⏳", [O(0.6, "Des années plus tard, ta vengeance arrive avec élégance et personne ne comprend d'où elle vient.", { bonheur: 3, bonte: -3, becomes: { copain: "enemy" } }), O(0.4, "Tu oublies, tu le recroises, vous éclatez de rire. Une tendresse bête t'envahit.", { bonheur: 4, rel: { copain: 15 } })], { risk: 1 }),
  ],
});

// ============ AMITIÉS ET TRAHISONS ============
ev("n_ami_copie_vie", {
  title: "Copier-coller", ages: [18, 55], tags: ["amis"], ic: "👯😒", rar: "peu", who: { ami: "friend" },
  t: "$ami a la même coupe de cheveux que toi, le même manteau, la même ville, le même prénom pour son chat. Hier, tu as appris qu'il a postulé dans ton entreprise, avec ton CV légèrement modifié.",
  c: [
    D("Le prendre au mot et l'aider", "🤝", "Il est touché, il progresse. Vous formez un duo inattendu.", { bonte: 3, bonheur: 2, rel: { ami: 12 } }),
    D("Lui dire clairement que ça suffit", "🛑", "Une conversation tendue. Il pleure, puis change de style.", { courage: 2, honnete: 2, rel: { ami: -8 } }),
    C("Lui faire une blague cruelle", "🎭", [O(0.5, "Tu lui envoies une photo piégée de toi. Il la copie, il se ridiculise, il rit de lui-même.", { creatif: 2, bonheur: 3, rel: { ami: 4 } }), O(0.5, "Il découvre la farce et te le fait payer.", { bonheur: -3, repute: -2, rel: { ami: -15 } })], { risk: 1 }),
  ],
});

ev("n_ami_emprunte_tout", {
  title: "Je te le rends demain", ages: [20, 65], tags: ["amis", "argent"], ic: "💸😅", rar: "commun", who: { ami: "friend" },
  t: "$ami t'emprunte une perceuse, un livre, deux cents euros et ta voiture pour le week-end. Les objets reviennent un par un, par miracle, mais jamais l'argent.",
  c: [
    D("Réclamer ton dû avec fermeté", "🧾", "Il paie en deux fois et te regarde avec rancune.", { argent: 100, courage: 2, rel: { ami: -10 } }),
    D("Laisser tomber par amitié", "🤷", "L'argent s'évapore, l'amitié résiste, ton sourire un peu moins.", { argent: -200, bonte: 2, bonheur: -1, rel: { ami: 6 } }),
    C("Lui prêter encore plus pour le piéger", "🪤", [O(0.4, "Il rembourse tout d'un coup, honteux. Tout le monde y gagne.", { argent: 300, honnete: 1, bonheur: 3, rel: { ami: 5 } }), O(0.6, "Il disparaît avec la totalité.", { argent: -500, bonheur: -4, rel: { ami: -25 } })], { risk: 1 }),
  ],
});

ev("n_ami_gagne_loto", {
  title: "Le gros lot du voisin", ages: [20, 70], tags: ["amis", "argent"], ic: "🎰🤑", rar: "rare", who: { ami: "friend" },
  t: "$ami vient de gagner au loto, un montant à huit chiffres. Il t'invite à fêter ça, annonce qu'il quitte son travail et réclame immédiatement que tu viennes vivre avec lui.",
  c: [
    D("Accepter pour la fête", "🥂", "Une semaine de folie, de yachts pas payés et de champagne tiède. Tu repars léger de quelques kilos.", { bonheur: 8, sante: -1, argent: 2000, rel: { ami: 15 } }),
    C("Lui demander un prêt immense", "💶", [O(0.5, "Il accepte avec un grand sourire. Tu changes de vie.", { argent: 30000, bonheur: 6, honnete: -1, rel: { ami: -5 } }), O(0.5, "Il rit et te raccompagne poliment à la porte.", { bonheur: -3, rel: { ami: -15 } })], { risk: 1 }),
    D("Rester un ami discret", "🙂", "Tu le félicites sans rien demander. Il s'en souviendra, toi aussi.", { bonte: 2, bonheur: 2, rel: { ami: 12 } }),
  ],
});

ev("n_ami_secret_avoue", {
  title: "Je dois te dire un truc", ages: [18, 70], tags: ["amis"], ic: "😰🍷", rar: "peu", who: { ami: "friend" },
  t: "$ami t'appelle à minuit. « Tu es assis{|e} ? J'ai quelque chose à avouer. » Il respire fort, tu entends un pigeon, puis un long silence qui ressemble à un film d'horreur.",
  c: [
    D("L'écouter patiemment", "👂", "Il t'avoue avoir écrit en secret des romans de fantasy sous pseudo. Tu les lis tous en une semaine.", { bonte: 2, bonheur: 4, creatif: 1, rel: { ami: 12 } }),
    C("Lui dire que tu devines déjà", "🔮", [O(0.5, "Tu avais deviné juste. Il est stupéfait, soulagé.", { intel: 1, bonheur: 3, rel: { ami: 10 } }), O(0.5, "Tu étais complètement à côté. Il en reste vexé.", { bonheur: -2, rel: { ami: -5 } })], { risk: 1 }),
    D("Raccrocher en faisant semblant d'être coupé", "📵", "Tu fuis la conversation. Il retentera dans six mois.", { honnete: -2, bonheur: -1, rel: { ami: -8 } }),
  ],
});

ev("n_coloc_enfer", {
  title: "Colocation sans pitié", ages: [18, 35], tags: ["amis", "logement"], ic: "🏠🔥", rar: "commun",
  t: "Tes colocs ont un tableau de ménage, un tableau de vaisselle et un tableau de reproches. Hier, un yaourt a disparu et trois personnes ont failli en venir aux mains. Aujourd'hui, c'est la vaisselle.",
  c: [
    D("Organiser un grand conseil", "📋", "Une règle est votée, une autre disparaît. Les murs tiennent encore.", { sociable: 2, bonheur: 1 }),
    D("Déménager à la cloche de bois", "🚪", "Tu pars à l'aube avec deux valises et quelques dettes.", { bonheur: 2, argent: -300, sociable: -1 }),
    C("Se venger du voleur de yaourt", "🥛", [O(0.5, "Tu découvres le coupable. Il admet tout, on l'applaudit.", { bonheur: 3, honnete: 1 }), O(0.5, "Tu accuses le mauvais coloc, qui claque la porte.", { bonheur: -3, honnete: -1, repute: -2 })], { risk: 1 }),
  ],
});

ev("n_surprise_party_ratee", {
  title: "Surprise !", ages: [18, 70], tags: ["amis"], ic: "🎂😳", rar: "commun", who: { ami: "friend" },
  t: "Pour ton anniversaire, $ami a organisé une grande surprise. Quarante personnes se cachent dans l'obscurité. Tu rentres un soir où tu avais prévu de rester en pyjama, la porte s'ouvre et les cris fusent.",
  c: [
    D("Sourire et jouer le jeu", "🥳", "Tu fais comme si tu n'avais rien vu venir. La soirée est inoubliable.", { bonheur: 6, sociable: 3, rel: { ami: 10 } }),
    D("Éclater de rire malgré le pyjama", "😂", "Tu saluais tout le monde en chaussons. Une photo qui marque l'histoire.", { bonheur: 4, charme: -1, repute: 1, rel: { ami: 8 } }),
    D("T'enfuir en pleurant", "😭", "Tu t'enfermes dans la salle de bain pendant une heure. Les invités mangent le gâteau sans toi.", { bonheur: -4, repute: -2, rel: { ami: -10 } }),
  ],
});

// ============ SOIRÉES, ALCOOL ET EXCÈS ============
ev("n_reveil_zoo", {
  title: "Le réveil au zoo", ages: [18, 45], tags: ["fete", "mature"], ic: "🦒🥴", rar: "peu",
  t: "Tu ouvres un œil, puis l'autre. Tu es allongé{|e} dans l'enclos des flamants roses, un chapeau melon sur la tête et un gardien qui te regarde avec attention. Tes souvenirs de la veille ressemblent à du brouillard.",
  c: [
    D("Sortir tranquillement en saluant", "🦩", "Tu salues le gardien, les flamants et les visiteurs. Une sortie digne d'un chef d'État.", { courage: 2, bonheur: 2, sante: -1 }),
    C("Inventer une raison officielle", "📋", [O(0.5, "Tu prétends être inspecteur sanitaire. Tout le monde te croit, par pure fatigue.", { honnete: -3, bonheur: 3 }), O(0.5, "Le gardien appelle la police municipale.", { honnete: -3, argent: -135, repute: -3, bonheur: -3 })], { risk: 1 }),
    D("Prendre un selfie avec les flamants", "🤳", "La photo devient un classique de ton album. Les flamants gardent leur sérieux.", { creatif: 2, bonheur: 4, repute: 1 }),
  ],
});

ev("n_karaoke_fatal", {
  title: "Karaoké fatal", ages: [18, 65], tags: ["fete", "mature"], ic: "🎤🔥", rar: "commun",
  t: "Deux verres de trop, un micro tendu par un inconnu, et la voix de ton enfance intérieure qui te souffle « vas-y ». La chanson choisie fait onze minutes. Tu connais à peu près les trois premières secondes.",
  c: [
    C("Chanter à pleins poumons", "🎶", [O(0.4, "Une performance mythique. La salle te réclame un rappel.", { repute: 3, bonheur: 6, charme: 1 }), O(0.6, "La salle prie pour la fin. Quelqu'un lance un chausson.", { repute: -2, bonheur: -1, courage: 2 })], { risk: 1 }),
    D("Refuser et applaudir les autres", "👏", "Tu laisses la gloire à d'autres. Ton foie aussi.", { bonheur: 1, prudent: 1 }),
    D("Chanter une chanson pour enfants avec sérieux", "🧸", "Un moment de pure poésie absurde. Tout le monde chante avec toi.", { creatif: 3, sociable: 2, bonheur: 5 }),
  ],
});

ev("n_message_patron_ivre", {
  title: "Envoyé à tous", ages: [22, 60], tags: ["fete", "travail", "mature"], ic: "📱🍷", rar: "peu", need: { job: true }, who: { chef: "boss" },
  t: "Le lendemain d'une soirée, ton téléphone indique « message envoyé » à $chef, à minuit quarante-sept. Tu n'oses pas lire le contenu. Les trois mots que tu devines sont « je t'adore » et « démission ».",
  c: [
    D("Tout avouer en face", "🗣️", "Tu poses ta tête sur la table, il éclate de rire. Une complicité naît du désastre.", { honnete: 3, bonheur: 1, perf: -2, rel: { chef: 8 } }),
    C("Nier avoir écrit", "🙅", [O(0.3, "Tu prétends qu'on t'a volé ton téléphone. Il y croit, ou fait semblant.", { honnete: -2, bonheur: 1 }), O(0.7, "Il a gardé une capture d'écran qu'il agite devant toi.", { honnete: -3, perf: -6, repute: -3, rel: { chef: -12 } })], { risk: 2 }),
    D("Prendre trois jours de congé", "🏖️", "Le temps de laisser l'affaire s'oublier, ou de changer de nom.", { bonheur: 2, perf: -4, argent: -150 }),
  ],
});

ev("n_achat_ivre", {
  title: "Commande confirmée", ages: [20, 60], tags: ["fete", "argent", "mature"], ic: "🛒🍾", rar: "peu", need: { money: [500, null] },
  t: "Tu te réveilles avec un mail de confirmation. À deux heures du matin, tu as acheté un cheval, une pirogue et trente mètres de moquette léopard. La livraison est annoncée pour la semaine prochaine.",
  c: [
    C("Annuler en urgence", "📞", [O(0.5, "Le vendeur est compréhensif et rembourse presque tout.", { argent: -150, bonheur: 1, prudent: 2 }), O(0.5, "Le contrat est clair, tu dois payer des frais énormes.", { argent: -1800, bonheur: -3, prudent: 3 })], { risk: 1 }),
    D("Assumer et accueillir le cheval", "🐴", "Il se nomme Gaston, il adore ton salon. Tu apprends à aimer le crottin.", { argent: -900, bonheur: 5, creatif: 3, item: { kind: "loufoque", name: "Cheval de salon", value: 2500 } }),
    D("Revendre l'ensemble à profit", "🤑", "Un flair commercial né de l'urgence. Tu empoches une petite marge.", { argent: 400, intel: 1, ambition: 1 }),
  ],
});

ev("n_mariage_vegas", {
  title: "Oui, oui, oui !", ages: [21, 45], tags: ["fete", "amour", "mature"], ic: "💒🎰", rar: "rare", need: { single: true },
  t: "Un voyage entre amis, un pari, une chapelle ouverte vingt-quatre heures sur vingt-quatre. Tu te réveilles avec une alliance en plastique au doigt et un certificat de mariage signé. Ton conjoint dort encore, il ou elle porte une cape.",
  c: [
    D("Annuler immédiatement", "✂️", "Les papiers sont déchirés, l'affaire est classée. Une légende de plus.", { bonheur: -1, argent: -200, honnete: 1 }),
    C("Essayer de faire vivre l'union", "💍", [O(0.25, "Contre toute attente, l'histoire dure. Vous vous mariez une seconde fois, cette fois pour de bon.", { bonheur: 9, charme: 1, flag: "mariage_vegas_ok" }), O(0.75, "La réalité s'invite en deux semaines. Un divorce, des avocats, un chat à partager.", { bonheur: -4, argent: -1200, later: { id: "n_divorce_express", in: 1 } })], { risk: 2 }),
    D("Fuir à l'aéroport sans un mot", "✈️", "Tu laisses une note. Le marié ou la mariée apprendra la nouvelle autour d'un pancake.", { honnete: -3, bonheur: 2, repute: -2 }),
  ],
});
ev("n_divorce_express", {
  chainOnly: true, title: "Divorce à l'amiable, ou presque", tags: ["amour"], ic: "⚖️💔",
  t: "L'avocat t'explique que ton mariage éclair fait de toi l'ex-conjoint d'une personne dont tu connais surtout le prénom. Il propose un partage équitable du chat, de la cape et d'une moquette léopard.",
  c: [
    D("Tout lui laisser", "🏳️", "Tu pars léger{|e}, un peu plus pauvre et beaucoup plus sage.", { argent: -300, bonheur: 2, prudent: 3 }),
    D("Réclamer la moquette", "🐆", "Un combat d'une absurdité rare. Tu gagnes la moquette, tu perds trois soirées.", { argent: -600, bonheur: -1, creatif: 2 }),
    D("Rester amis", "🤝", "Vous finissez dans un bar à raconter l'histoire. Une belle amitié bizarre commence.", { bonheur: 4, sociable: 2 }),
  ],
});

ev("n_gueule_bois_reunion", {
  title: "La réunion de dix heures", ages: [24, 58], tags: ["fete", "travail", "mature"], ic: "🤢📊", rar: "commun", need: { job: true },
  t: "Ton réveil sonne. Ta tête sonne aussi, mais plus fort. Dans une heure, tu dois présenter le bilan annuel à vingt personnes. Ton reflet ressemble à un chiffon mouillé.",
  c: [
    D("Boire trois cafés et prier", "☕", "Tu tiens, à peu près. Un collègue te regarde avec pitié.", { perf: -1, sante: -2, bonheur: -1 }),
    C("Tout miser sur le charme", "😎", [O(0.4, "Tu improvises, tu fais rire, personne ne s'aperçoit de rien.", { perf: 5, charme: 2, bonheur: 3 }), O(0.6, "Tu bafouilles devant la direction. Un silence glacial s'installe.", { perf: -6, repute: -3, bonheur: -3 })], { risk: 2 }),
    D("Prétexter un virus", "🤒", "Tu restes au lit, honteux{|se} et soulagé{|e}. Ton patron propose du jus d'orange.", { honnete: -2, perf: -2, sante: 1 }),
  ],
});

ev("n_afterwork_derapage", {
  title: "Un petit verre, vraiment", ages: [22, 60], tags: ["fete", "travail", "mature"], ic: "🍻💼", rar: "commun", need: { job: true }, who: { collegue: "colleague" },
  t: "L'afterwork devait durer une heure. Il est trois heures du matin, $collegue chante sur le bar, ton patron a perdu sa cravate et un stagiaire raconte la vie de sa grand-mère à un barman ému.",
  c: [
    D("Partir avant la catastrophe", "🚶", "Tu rentres dormir. Le lendemain, tu seras le seul à avoir bonne mine.", { sante: 1, prudent: 2, perf: 1 }),
    D("Rester et participer au chaos", "🎉", "Tu deviens l'âme de la soirée. Ton équipe t'adore, ton foie moins.", { sociable: 3, bonheur: 5, sante: -2, perf: 2, rel: { collegue: 10 } }),
    C("Prendre des photos pour chantage futur", "📸", [O(0.5, "Ces clichés valent de l'or, ou au moins une promotion.", { perf: 5, honnete: -3, ambition: 2 }), O(0.5, "Quelqu'un te surprend à photographier, l'ambiance se glace.", { honnete: -3, repute: -3, rel: { collegue: -15 } })], { risk: 2 }),
  ],
});

ev("n_concours_biere", {
  title: "Le concours qui tourne mal", ages: [18, 50], tags: ["fete", "mature"], ic: "🍺🏆", rar: "peu",
  t: "Un bar organise un concours de dégustation. Tu t'inscris par défi. À la quatrième pinte, la salle te regarde avec admiration, ton nom s'affiche en lumières et ton estomac fait des bruits de ferry.",
  c: [
    C("Continuer jusqu'à la victoire", "🏆", [O(0.35, "Tu gagnes un trophée en plastique et un an de bières offertes. Ton foie pleure.", { repute: 3, bonheur: 5, sante: -4, argent: 150 }), O(0.65, "Tu t'endors sur la table. Un barman te couvre d'une nappe.", { sante: -3, repute: -2, bonheur: -1 })], { risk: 1 }),
    D("Abandonner avec dignité", "🏳️", "Tu poses ton verre, sous les sifflets amicaux. Tu survis.", { prudent: 2, sante: 0 }),
    D("Passer à l'eau gazeuse en cachette", "💧", "Tu triches avec un talent extraordinaire. Tu rentres chez toi en forme.", { honnete: -2, intel: 1, bonheur: 2 }),
  ],
});

ev("n_nuit_serenade", {
  title: "La sérénade de trois heures", ages: [18, 60], tags: ["fete", "amour", "mature"], ic: "🎸🌙", rar: "peu", who: { crush: "crush" },
  t: "Sur un coup de tête et de rhum, tu décides de chanter sous la fenêtre de $crush, une guitare empruntée dans les mains et un répertoire de deux chansons. Les voisins sortent un à un, en peignoir.",
  c: [
    C("Persévérer jusqu'au bout", "🎶", [O(0.3, "$crush ouvre la fenêtre, éclate de rire et t'invite à monter.", { bonheur: 8, charme: 2, rel: { crush: 25 } }), O(0.7, "Un seau d'eau, un chien qui aboie, la police qui sonne.", { bonheur: -3, argent: -135, repute: -2, rel: { crush: -5 } })], { risk: 2 }),
    D("Rentrer en silence", "🚶", "Tu ranges la guitare dans le coffre de ta honte. Elle est bien là.", { bonheur: -1, prudent: 1 }),
    D("Passer au répertoire de Noël en plein été", "🎄", "Tout le quartier chante avec toi. Tu deviens légende urbaine.", { creatif: 3, sociable: 2, bonheur: 5, repute: 2 }),
  ],
});
