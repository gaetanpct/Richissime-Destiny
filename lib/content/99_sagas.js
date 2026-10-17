// Grandes histoires à plusieurs étapes. Chaque choix a des suites, immédiates ou plus tard.
const { ev, flash, O, C, D } = require("../kit");

// ======================================================
// 1. LA CARTE DU GRAND-ONCLE
// ======================================================
ev("saga_carte_debut", {
  ages: [18, 70], tags: ["saga", "loufoque"], ic: "🗺️🏴‍☠️", w: 3, who: { oncle: { kind: "grandparent", fresh: true, age: 84 } },
  t: "Ton grand-oncle $oncle, sur son lit de mort, te glisse une vieille carte froissée. « Tout est là, murmure-t-il. Mais méfie-toi des crabes. »",
  c: [
    D("Étudier la carte", "🔍", "La carte indique un point sur la côte, près de $ville. Un grand X, entouré de crabes dessinés.", { creatif: 2, next: "saga_carte_expedition" }),
    D("La ranger dans un tiroir", "🗄️", "Tu la laisses dormir. Peut-être qu'un jour...", { prudent: 2, later: { id: "saga_carte_tiroir", in: [3, 8] } }),
  ],
});
ev("saga_carte_tiroir", {
  chainOnly: true, tags: ["saga"], ic: "🗺️✨",
  t: "En vidant un tiroir, tu retrouves la carte. Elle a l'air plus ancienne et plus mystérieuse que dans ton souvenir.",
  c: [
    D("Se lancer enfin", "🚀", "Tu prépares ton sac, ta pelle et un sandwich.", { courage: 2, next: "saga_carte_expedition" }),
    D("La jeter", "🗑️", "Les crabes resteront tranquilles.", { prudent: 2 }),
  ],
});
ev("saga_carte_expedition", {
  chainOnly: true, tags: ["saga"], ic: "⛏️🦀",
  t: "Tu arrives sur la côte, la pelle sur l'épaule. Le vent siffle, les mouettes rient. Un vieux pêcheur te dit que d'autres chercheurs sont déjà venus.",
  c: [
    C("Creuser à l'endroit du X", "⛏️", [O(0.5, "Ta pelle heurte quelque chose de dur. Un coffre !", { next: "saga_carte_coffre" }), O(0.5, "Tu ne trouves qu'un vieux soulier. Mais les crabes t'observent...", { next: "saga_carte_crabes" })]),
    D("Interroger le pêcheur", "🎣", "Il te raconte une légende, puis te demande un billet en échange.", { argent: -20, intel: 1, next: "saga_carte_coffre" }),
    D("Renoncer", "🏃", "Les crabes avaient raison.", { courage: -1 }),
  ],
});
ev("saga_carte_crabes", {
  chainOnly: true, tags: ["saga", "loufoque"], ic: "🦀🦀",
  t: "Les crabes forment un cercle autour de toi, solennels. L'un d'entre eux porte une minuscule couronne. Il agite sa pince vers une grotte.",
  c: [
    D("Suivre le crabe-roi", "👑", "Il te mène à une grotte, où brille quelque chose.", { courage: 2, creatif: 2, next: "saga_carte_coffre" }),
    D("Fuir", "🏃", "Les crabes te regardent partir, déçus.", { courage: -1, bonheur: -1 }),
  ],
});
ev("saga_carte_coffre", {
  chainOnly: true, tags: ["saga"], ic: "💰📦",
  t: "Le coffre s'ouvre en grinçant. À l'intérieur, des pièces d'or, un parchemin, et un petit écriteau « Merci d'avoir cherché. Partage avec les crabes. »",
  c: [
    C("Tout garder", "🤑", [O(0.6, "Tu ramènes le magot. Les crabes pincent les fesses de ton ombre pendant des semaines.", { item: "lingot", argent: 6000, honnete: -2, bonheur: 4 }), O(0.4, "Un concurrent surgit et tente de te voler.", { next: "saga_carte_rival" })]),
    D("Partager avec les crabes", "🦀", "Tu laisses une partie du trésor sur la plage. Une marée magique emporte l'or, qui revient en légende.", { item: "bijou", argent: 2500, bonte: 5, bonheur: 7, repute: 3 }),
    D("Donner à une association", "🏛️", "Un musée expose le coffre. Ton nom figure sur la plaque.", { argent: 1200, repute: 6, bonte: 4, bonheur: 4 }),
  ],
});
ev("saga_carte_rival", {
  chainOnly: true, tags: ["saga"], ic: "🥷⚔️",
  t: "Un chasseur de trésors en gilet de sauvetage te barre la route. Il exige la moitié du butin, ou plus.",
  c: [
    C("Se battre", "🥊", [O(0.5, "Tu le mets en fuite. Le trésor est à toi.", { item: "lingot", argent: 5000, courage: 3, sante: -2 }), O(0.5, "Tu perds, et ta dignité aussi.", { sante: -4, bonheur: -3, argent: 800 })], { risk: 1 }),
    D("Partager", "🤝", "Une moitié chacun, tout le monde est content.", { item: "bijou", argent: 3000, bonte: 2, bonheur: 3 }),
    D("Le tromper avec une fausse carte", "🎭", "Il suit la fausse carte et tombe dans un étang.", { item: "lingot", argent: 6000, creatif: 3, honnete: -2, bonheur: 5 }),
  ],
});

// ======================================================
// 2. LE CHÂTEAU HUMIDE
// ======================================================
ev("saga_chateau_debut", {
  ages: [25, 75], tags: ["saga", "argent"], ic: "🏰💧", w: 2, need: { money: [3000, null] },
  t: "Un notaire t'apprend que tu as hérité d'un château. Il omet pudiquement de dire qu'il est humide, hanté et situé en bas d'une colline marécageuse.",
  c: [
    D("Aller le visiter", "🏰", "Le château est immense, vide, et sent le chien mouillé. Un fantôme en robe de chambre te salue.", { courage: 2, next: "saga_chateau_decision" }),
    D("Refuser l'héritage", "🙅", "Tu le laisses à la commune. La mairie te remercie.", { prudent: 3, repute: 1 }),
  ],
});
ev("saga_chateau_decision", {
  chainOnly: true, tags: ["saga"], ic: "🏰🔨",
  t: "Que faire de ce monument ? Le toit fuit en sept endroits, le fantôme veut qu'on garde son salon, et un promoteur te propose un chèque.",
  c: [
    C("Le transformer en hôtel de charme", "🏨", [O(0.5, "L'hôtel plaît aux touristes. Les fantômes sont un argument de vente.", { item: "chateau_fantome", argent: -15000, bonheur: 5, repute: 4, later: { id: "saga_chateau_hotel", in: [2, 4] } }), O(0.5, "Les travaux dévorent tout. Les clients arrivent trop peu.", { item: "chateau_fantome", argent: -25000, bonheur: -3, later: { id: "saga_chateau_hotel", in: [2, 4] } })], { cost: 8000, risk: 2 }),
    D("Vendre au promoteur", "💶", "Un chèque, un soupir de soulagement.", { argent: 90000, honnete: 0, bonheur: 4 }),
    D("S'y installer avec le fantôme", "👻", "Il t'apprend à jouer aux échecs et à déboucher les cheminées.", { item: "chateau_fantome", home: "own", bonheur: 6, creatif: 3, later: { id: "saga_chateau_fantome", in: [2, 5] } }),
  ],
});
ev("saga_chateau_hotel", {
  chainOnly: true, tags: ["saga"], ic: "🏨⭐",
  t: "Un guide de voyage prestigieux annonce la visite d'un inspecteur anonyme dans les prochaines semaines. L'enjeu est de taille.",
  c: [
    C("Tout astiquer", "✨", [O(0.5, "L'inspecteur adore. Cinq étoiles, réservations pour deux ans.", { argent: 25000, repute: 8, bonheur: 6 }), O(0.5, "Le fantôme se montre et l'inspecteur s'enfuit.", { argent: 2000, repute: -3, bonheur: 0 })], { risk: 1 }),
    D("Laisser faire", "🎲", "Le hasard décide. Il fait beau.", { argent: 6000, bonheur: 3 }),
  ],
});
ev("saga_chateau_fantome", {
  chainOnly: true, tags: ["saga", "loufoque"], ic: "👻🎩",
  t: "Le fantôme du château avoue qu'il garde un secret depuis des siècles. Dans les caves, une salle cachée contient quelque chose de précieux.",
  c: [
    C("Fouiller les caves", "🔦", [O(0.4, "Une cave remplie de bouteilles de vin d'un millésime incroyable.", { argent: 30000, bonheur: 6, repute: 3 }), O(0.6, "Surtout des toiles d'araignées et une collection de pantoufles.", { bonheur: 3, creatif: 2 })]),
    D("Laisser le secret au fantôme", "🤐", "Certains mystères sont faits pour durer.", { bonte: 2, bonheur: 4 }),
  ],
});

// ======================================================
// 3. LA VIDÉO VIRALE
// ======================================================
ev("saga_viral_debut", {
  ages: [12, 60], tags: ["saga", "loufoque"], ic: "📹🔥", w: 3,
  t: "Une vidéo de toi circule en ligne. On te voit éternuer sur un gâteau d'anniversaire, avec un air tragique. Elle atteint 3 millions de vues en une nuit.",
  c: [
    D("Assumer et surfer sur la vague", "🏄", "Tu deviens « la tête au gâteau ». Les marques t'appellent.", { repute: 8, charme: 2, next: "saga_viral_gloire" }),
    D("Demander le retrait de la vidéo", "🚫", "Tu passes des semaines à envoyer des mails. La vidéo disparaît, enfin.", { repute: -1, bonheur: -1 }),
    D("Ignorer le buzz", "🙈", "La vague passe. Tu retournes à ta tranquillité.", { prudent: 2 }),
  ],
});
ev("saga_viral_gloire", {
  chainOnly: true, tags: ["saga"], ic: "🌟📱",
  t: "Une grande marque de gâteaux t'invite à signer un contrat. Un animateur télé veut t'inviter. Les inconnus t'arrêtent dans la rue pour te dire « éternue ! ».",
  c: [
    C("Signer avec la marque", "✍️", [O(0.7, "Un contrat lucratif. Tu deviens l'égérie du gâteau.", { argent: 18000, repute: 6, next: "saga_viral_chute" }), O(0.3, "La marque fait faillite. Tu empoches l'avance.", { argent: 6000, repute: 2 })]),
    D("Aller à la télé", "📺", "Tu éternues en direct. L'audience explose.", { argent: 3000, repute: 5, charme: 2, next: "saga_viral_chute" }),
    D("Refuser tout", "🚪", "Tu préfères ta vie normale.", { prudent: 3, bonheur: 2 }),
  ],
});
ev("saga_viral_chute", {
  chainOnly: true, tags: ["saga"], ic: "📉😬",
  t: "L'attention retombe, un humoriste te parodie, et un journal ressort une vieille photo gênante. La célébrité est un ascenseur, et il redescend.",
  c: [
    C("Rebondir avec humour", "😄", [O(0.6, "Tu retournes la situation. Ton autodérision te rend adorable.", { repute: 5, bonheur: 5, creatif: 3 }), O(0.4, "Personne ne rit. Silence gêné.", { repute: -3, bonheur: -2 })]),
    D("Disparaître de la scène", "🌫️", "Tu t'effaces. Tu gardes l'argent, la dignité et un petit chat.", { argent: 1000, bonheur: 2, prudent: 2 }),
    D("Écrire un livre", "📖", "« Éternuer pour de bon ». Un succès d'estime.", { argent: 4000, creatif: 3, repute: 3 }),
  ],
});

// ======================================================
// 4. L'INVENTION GÉNIALE
// ======================================================
ev("saga_invention_debut", {
  ages: [18, 60], tags: ["saga", "argent"], ic: "💡🔧", w: 3, need: { stat: { creatif: [45, null] } }, roll: { objet: "objets" },
  t: "Dans ton garage, tu bricoles depuis des mois un appareil révolutionnaire, un $objet qui se plie tout seul et chante la Marseillaise. Il manque encore quelques boulons.",
  c: [
    C("Finaliser l'invention", "🔧", [O(0.55, "Ça marche ! Ton engin fonctionne et fait tourner les têtes.", { creatif: 3, next: "saga_invention_brevet" }), O(0.45, "L'engin explose dans un nuage de confettis. Les voisins applaudissent.", { creatif: 2, bonheur: 2, argent: -200 })]),
    D("Montrer à un ami ingénieur", "🧑‍🔧", "Il rit, puis se tait, puis veut en savoir plus.", { intel: 1, next: "saga_invention_brevet" }),
    D("La ranger", "📦", "Un jour, peut-être...", { prudent: 1 }),
  ],
});
ev("saga_invention_brevet", {
  chainOnly: true, tags: ["saga"], ic: "📜🏭",
  t: "Un industriel flaire la bonne affaire. Il t'invite à déjeuner, parle de « brevet », de « licence » et d'une vingtaine de zéros.",
  c: [
    C("Déposer un brevet seul{|e}", "📜", [O(0.5, "Le brevet est accordé. Tu fondes ta propre petite affaire.", { argent: -3000, item: { kind: "entreprise", name: "Ton invention", value: 50000 }, ambition: 3, next: "saga_invention_concurrent" }), O(0.5, "Le dossier est refusé, trop de papiers.", { argent: -1500, bonheur: -3 })], { cost: 1500, risk: 1 }),
    D("Vendre l'idée à l'industriel", "💶", "Tu empoches un gros chèque. Ton invention fera fortune sans toi.", { argent: 45000, bonheur: 5, ambition: 1 }),
    D("S'associer à lui", "🤝", "Il apporte les moyens, tu apportes le génie.", { item: { kind: "entreprise", name: "Associé à l'industriel", value: 70000 }, argent: 8000, ambition: 2, next: "saga_invention_concurrent" }),
  ],
});
ev("saga_invention_concurrent", {
  chainOnly: true, tags: ["saga"], ic: "🥷💼",
  t: "Un concurrent sort une copie à moitié prix. Il prétend avoir inventé le principe en premier. Les avocats flairent le sang.",
  c: [
    C("Aller en justice", "⚖️", [O(0.55, "Tu gagnes, avec dommages et intérêts.", { argent: 35000, honnete: 2, repute: 3 }), O(0.45, "Procès perdu, frais énormes.", { argent: -9000, bonheur: -4 })], { risk: 1 }),
    D("Baisser tes prix", "📉", "Tu perds en marge mais tu gardes tes clients.", { argent: 5000, prudent: 2 }),
    D("Innover encore plus", "🚀", "Une version 2.0 écrase la concurrence.", { creatif: 4, argent: 20000, ambition: 3 }),
  ],
});

// ======================================================
// 5. L'ÎLE DÉSERTE
// ======================================================
ev("saga_ile_debut", {
  ages: [20, 65], tags: ["saga", "voyage", "loufoque"], ic: "🏝️✈️", w: 2, need: { money: [1500, null] },
  t: "Le petit avion de ton voyage tousse, tressaute, et plonge vers l'océan. Tu te réveilles allongé{|e} sur le sable, avec trois noix de coco, un perroquet et un pilote en slip.",
  c: [
    D("Explorer l'île", "🌴", "Tu trouves de l'eau, des fruits, et un vieux bateau.", { courage: 3, next: "saga_ile_survie" }),
    D("Allumer un feu de détresse", "🔥", "La fumée monte, haute et épaisse.", { intel: 2, next: "saga_ile_survie" }),
  ],
});
ev("saga_ile_survie", {
  chainOnly: true, tags: ["saga"], ic: "🥥🪵",
  t: "Les jours passent. Le pilote a bâti une cabane, le perroquet te raconte des blagues douteuses. Il va falloir décider comment s'en sortir.",
  c: [
    C("Construire un radeau", "🛶", [O(0.6, "Après trois jours de navigation, tu aperçois un cargo.", { courage: 4, sport: 3, next: "saga_ile_retour" }), O(0.4, "Le radeau chavire. Tu regagnes l'île à la nage.", { sport: 2, sante: -3, courage: 2, next: "saga_ile_signal" })], { risk: 1 }),
    D("Faire des signaux", "🪞", "Un miroir, des pierres en forme de SOS. Ça pourrait marcher.", { creatif: 2, next: "saga_ile_signal" }),
    D("Profiter de la vie", "🏖️", "Tu pêches, tu dors, tu ris. Il n'y a rien à faire sinon vivre.", { bonheur: 5, sante: 2, next: "saga_ile_signal" }),
  ],
});
ev("saga_ile_signal", {
  chainOnly: true, tags: ["saga"], ic: "🚁📡",
  t: "Au bout d'un mois, un hélicoptère survole l'île. Tu agites ton drapeau fait d'un slip du pilote. Ils t'ont vu.",
  c: [
    D("Monter à bord", "🚁", "On te ramène en héros. Les journaux racontent ton histoire.", { repute: 4, bonheur: 5, next: "saga_ile_retour" }),
    D("Rester un jour de plus", "🌅", "Un dernier coucher de soleil sur ton île.", { bonheur: 6, next: "saga_ile_retour" }),
  ],
});
ev("saga_ile_retour", {
  chainOnly: true, tags: ["saga"], ic: "📺🏝️",
  t: "De retour chez toi, un producteur t'offre un contrat pour raconter ton aventure. Ton pilote veut y figurer. Le perroquet réclame des royalties.",
  c: [
    C("Écrire un livre", "📖", [O(0.5, "Un best-seller de librairie.", { argent: 18000, repute: 6, creatif: 3 }), O(0.5, "Quelques centaines d'exemplaires, dont ceux de ta famille.", { argent: 800, creatif: 2 })]),
    D("Vendre les droits à la télé", "📺", "Un téléfilm mal doublé, un chèque bien réel.", { argent: 12000, repute: 3 }),
    D("Tout raconter à tes proches", "🫂", "Ton récit devient un classique de repas de famille.", { bonheur: 5, sociable: 2 }),
  ],
});

// ======================================================
// 6. L'ARNAQUE DE L'AMI (PONZI)
// ======================================================
ev("saga_ponzi_debut", {
  ages: [22, 65], tags: ["saga", "argent"], ic: "🤝💸", w: 2, need: { money: [3000, null] }, who: { ami: "friend" },
  t: "$ami te parle d'un placement secret, le « Fonds Soleil Éternel ». Les intérêts sont de 20 % par mois et les témoignages sont enthousiastes. Les photos sont prises sur une plage.",
  c: [
    C("Investir un peu", "💶", [O(0.7, "Les premiers mois, les intérêts tombent. Tu es ravi{|e}.", { argent: 600, next: "saga_ponzi_tentation" }), O(0.3, "Le fonds disparaît dès le premier mois.", { argent: -2000, bonheur: -3, prudent: 3 })], { cost: 2000, risk: 2 }),
    D("Se renseigner d'abord", "🔍", "Tu découvres un procès en cours contre le fonds. Tu t'en tires.", { prudent: 4, intel: 2, rel: { ami: -3 } }),
    D("Refuser", "🙅", "Tu gardes tes économies.", { prudent: 2 }),
  ],
});
ev("saga_ponzi_tentation", {
  chainOnly: true, tags: ["saga"], ic: "🚀💸",
  t: "Les chiffres grimpent. $ami te presse de tout investir et d'y entraîner tes proches. Un doute te taraude, mais l'appât du gain parle fort.",
  c: [
    C("Tout investir", "🎰", [O(0.2, "Tu retires à temps, empochant un gros gain.", { argent: 15000, bonheur: 5 }), O(0.8, "Le fonds s'effondre. Tu perds tout.", { argent: -9000, bonheur: -6, prudent: 3, next: "saga_ponzi_chute" })], { risk: 3 }),
    D("Retirer ton argent maintenant", "🏃", "Tu sors avec un joli gain, tu laisses les autres.", { argent: 4000, prudent: 3, bonheur: 3, next: "saga_ponzi_chute" }),
  ],
});
ev("saga_ponzi_chute", {
  chainOnly: true, tags: ["saga"], ic: "🚔📰",
  t: "Le directeur du fonds est arrêté. Les journaux s'en emparent. Un avocat te contacte pour une procédure collective.",
  c: [
    D("Rejoindre l'action collective", "⚖️", "Tu récupères une petite partie de tes pertes.", { argent: 3000, honnete: 2 }),
    D("Renoncer à toute procédure", "🙈", "Tu ne veux plus en entendre parler.", { bonheur: -1, prudent: 2 }),
    D("Pardonner à ton ami", "🫶", "Il n'a pas voulu te nuire. L'amitié survit, abîmée.", { bonte: 3, bonheur: 2 }),
  ],
});

// ======================================================
// 7. LA CAMPAGNE ÉLECTORALE
// ======================================================
ev("saga_mairie_debut", {
  ages: [30, 75], tags: ["saga", "social"], ic: "🗳️🎤", w: 2, need: { stat: { repute: [40, null] } },
  t: "Le maire de $ville prend sa retraite. Tes voisins te supplient de te présenter. Une affiche te montre déjà avec un sourire peu naturel.",
  c: [
    D("Se présenter", "🗳️", "La campagne commence. Tracts, poignées de main, soupes populaires.", { ambition: 3, charme: 1, next: "saga_mairie_campagne" }),
    D("Décliner", "🙅", "Tu laisses la place à un autre.", { prudent: 2 }),
  ],
});
ev("saga_mairie_campagne", {
  chainOnly: true, tags: ["saga"], ic: "📢🧑‍🤝‍🧑",
  t: "Le dernier débat approche. Ton adversaire est un ancien boulanger qui promet du pain gratuit dans les cantines. La salle des fêtes est comble.",
  c: [
    C("Promettre des réformes audacieuses", "🏛️", [O(0.45, "Ton discours enthousiasme la salle.", { repute: 5, next: "saga_mairie_vote" }), O(0.55, "Trop ambitieux, on te trouve irréaliste.", { repute: -2, next: "saga_mairie_vote" })]),
    D("Attaquer l'adversaire", "🥊", "Ton discours est virulent. Les spectateurs sont partagés.", { honnete: -2, courage: 2, next: "saga_mairie_vote" }),
    D("Offrir un buffet gratuit", "🍰", "Tu perds en dignité mais gagnes en sympathie.", { argent: -600, sociable: 3, bonte: 1, next: "saga_mairie_vote" }),
  ],
});
ev("saga_mairie_vote", {
  chainOnly: true, tags: ["saga"], ic: "🗳️🎉",
  t: "Le soir du scrutin, les résultats sont serrés. La salle des fêtes bruisse. Le maire sortant tient le micro, un papier tremblant à la main.",
  c: [
    C("Attendre les résultats", "⏳", [O(0.5, "Élu{|e} maire ! Tu reçois l'écharpe tricolore sous les acclamations.", { job: "politique:2", repute: 10, bonheur: 8, ambition: 3, pub: "🗳️ $nom est élu(e) maire de $ville." }), O(0.5, "Battu{|e} de quelques voix. Tu salues avec élégance.", { repute: 3, bonheur: -2, courage: 2 })]),
  ],
});

// ======================================================
// 8. LE COUP DE FOUDRE FOU
// ======================================================
ev("saga_amour_debut", {
  ages: [18, 45], tags: ["saga", "amour"], ic: "💘🌹", w: 3, need: { single: true }, who: { crush: { kind: "crush", fresh: true, age: 26 } },
  t: "Dans le métro, tes yeux croisent ceux de $crush. Un sourire échangé. À la station suivante, $crush descend et laisse tomber un gant.",
  c: [
    D("Courir pour rendre le gant", "🧤", "Tu cours, bousculant quatre personnes. $crush se retourne et rit.", { courage: 2, charme: 1, next: "saga_amour_rencontre" }),
    D("Garder le gant en souvenir", "🤫", "Tu rentres chez toi avec un trésor. Un peu bizarre.", { creatif: 1, honnete: -1 }),
    D("Ne rien faire", "😶", "Le gant s'éloigne. Dommage.", { bonheur: -1 }),
  ],
});
ev("saga_amour_rencontre", {
  chainOnly: true, tags: ["saga"], ic: "☕🧤",
  t: "$crush te remercie, te propose un café et avoue que le gant était laissé exprès. « Je voulais voir si tu courais », dit-il en riant.",
  c: [
    D("Rire et accepter le café", "☕", "Vous parlez des heures. Vous échangez vos numéros.", { bonheur: 6, charme: 2, rel: { crush: 18 }, next: "saga_amour_couple" }),
    D("Vexé{|e}, refuser", "😤", "Tu repars la tête haute. Le gant reste dans sa main.", { bonheur: -1, rel: { crush: -8 } }),
  ],
});
ev("saga_amour_couple", {
  chainOnly: true, tags: ["saga"], ic: "💑🌆",
  t: "Vous passez des mois ensemble. Rires, balades, dîners. Un soir, $crush te dit qu'il a une proposition à te faire, et ses mains tremblent un peu.",
  c: [
    C("Écouter la proposition", "💍", [O(0.65, "Il te propose d'emménager ensemble. Tu dis oui.", { becomes: { crush: "partner" }, bonheur: 8, rel: { crush: 15 }, home: "location" }), O(0.35, "Il veut déménager à l'autre bout du monde. Tu hésites.", { bonheur: 0, next: "saga_amour_choix" })]),
    D("Prendre ton temps", "⏳", "Tu demandes quelques semaines. Il comprend, avec un sourire triste.", { prudent: 2, rel: { crush: -4 } }),
  ],
});
ev("saga_amour_choix", {
  chainOnly: true, tags: ["saga"], ic: "🌍💔",
  t: "L'offre est belle, mais elle t'éloigne de tout ce que tu connais. Tes amis, ton quartier, ta boulangerie préférée. Le cœur contre la raison.",
  c: [
    C("Le suivre", "✈️", [O(0.7, "Une vie nouvelle, des paysages inconnus. Vous êtes heureux.", { becomes: { crush: "partner" }, city: true, courage: 4, bonheur: 7 }), O(0.3, "Vous vous séparez au bout d'un an, loin de tout.", { city: true, bonheur: -4, courage: 3 })], { risk: 1 }),
    D("Rester", "🏡", "Vous vous quittez avec tendresse.", { prudent: 2, bonheur: -3, rel: { crush: -10 } }),
  ],
});

// ======================================================
// 9. LA POULE AUX ŒUFS D'OR (suite de la poule du couple et autres)
// ======================================================
ev("saga_licorne_debut", {
  ages: [8, 80], tags: ["saga", "loufoque"], ic: "🦄🌈", w: 2,
  t: "Une licorne minuscule trottine dans ton jardin, trempée de rosée. Elle te regarde avec des yeux interrogateurs, une carotte entre les dents.",
  c: [
    D("L'adopter", "🥰", "Elle te suit partout, laisse des paillettes sur le tapis.", { item: "licorne", bonheur: 6, creatif: 3, later: { id: "saga_licorne_voleur", in: [2, 5] } }),
    D("Appeler un vétérinaire", "📞", "Il vient, il pâlit, il part en courant.", { bonheur: 1, creatif: 1 }),
    D("L'ignorer", "🙈", "Elle repart dans la brume.", { bonheur: -1 }),
  ],
});
ev("saga_licorne_voleur", {
  chainOnly: true, tags: ["saga", "loufoque"], ic: "🦄🥷",
  t: "Un collectionneur véreux a repéré ta licorne. Une nuit, tu surprends un homme en cape qui tente de l'emmener par la fenêtre.",
  c: [
    C("Défendre ta licorne", "🥊", [O(0.6, "Tu fais fuir le voleur. La licorne te lèche le visage.", { courage: 4, bonheur: 6, rel: { animal: 10 } }), O(0.4, "Le voleur s'enfuit avec la licorne.", { loseItem: "loufoque", bonheur: -7, courage: 2 })], { risk: 2 }),
    D("Appeler la police", "📞", "La police arrive, interloquée. Le voleur est cueilli.", { prudent: 2, bonheur: 3 }),
    D("Lui vendre la licorne", "💰", "Il paie une fortune. Tu as honte, un peu.", { sell: "loufoque", argent: 14000, bonte: -4, honnete: -3, bonheur: -2 }),
  ],
});

// ======================================================
// 10. LE CONCOURS DE LA TARTE
// ======================================================
ev("saga_tarte_debut", {
  ages: [10, 80], tags: ["saga", "loufoque"], ic: "🥧🏆", w: 3,
  t: "Le grand concours mondial de la tarte aux pommes a lieu à $ville cette année. Le premier prix est une tarte en or massif. Tu es sûr{|e} que ta recette secrète peut tout révolutionner.",
  c: [
    D("S'inscrire avec ta recette", "🥧", "Tu bricoles ta tarte pendant des semaines. Elle sent merveilleusement bon.", { creatif: 2, next: "saga_tarte_qualif" }),
    D("Aider un ami candidat", "🤝", "Tu deviens son assistant de choc. Votre duo est comique.", { bonte: 2, sociable: 2, next: "saga_tarte_qualif" }),
    D("Regarder de loin", "🍿", "Tu t'achètes une part dans la foule.", { bonheur: 2 }),
  ],
});
ev("saga_tarte_qualif", {
  chainOnly: true, tags: ["saga"], ic: "🥧👨‍⚖️",
  t: "Le jury, quatre pâtissiers moustachus, goûte ta tarte en silence. Le président finit par dire « Intéressant ». C'est le mot que tu craignais le plus.",
  c: [
    C("Attendre le verdict", "⏳", [O(0.5, "Tu passes en finale !", { creatif: 3, repute: 3, next: "saga_tarte_finale" }), O(0.5, "Éliminé{|e}. Le jury te donne tout de même une médaille de participation.", { bonheur: 1, creatif: 1 })]),
    C("Saboter la tarte du favori", "😈", [O(0.5, "Personne ne t'a vu. Ta tarte passe.", { honnete: -4, next: "saga_tarte_finale" }), O(0.5, "Tu es pris{|e} sur le fait. Disqualification.", { honnete: -4, repute: -6 })], { risk: 2 }),
  ],
});
ev("saga_tarte_finale", {
  chainOnly: true, tags: ["saga"], ic: "🥧👑",
  t: "La finale est retransmise en direct. Les caméras zooment sur ta tarte. Elle a l'air parfaite, ou presque. Un pigeon plane au-dessus de l'estrade.",
  c: [
    C("Présenter la tarte avec panache", "🎤", [O(0.4, "Tu remportes la tarte en or ! Elle brille comme un soleil.", { item: "tarte_or", repute: 8, bonheur: 9, creatif: 3 }), O(0.4, "Deuxième place, médaille d'argent et un bon d'achat.", { argent: 600, repute: 4, bonheur: 5 }), O(0.2, "Le pigeon renverse ta tarte en plein direct.", { repute: -1, bonheur: 2, creatif: 2 })], { risk: 1 }),
    D("Offrir ta tarte au public", "🎁", "La foule s'arrache les parts. Tu deviens un héros.", { bonte: 4, repute: 5, bonheur: 6 }),
  ],
});

flash("Tu repenses à cette étrange aventure. Les souvenirs les plus fous sont aussi les plus précieux.", { bonheur: 1 }, { ages: [18, 90], tag: "loufoque" });
