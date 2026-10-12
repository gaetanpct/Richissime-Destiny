// Le vaste monde. Stars inventées, inconnus fantasques, personnages de la bande.
const { ev, flash, O, C, D } = require("../kit");

const artiste = (p) => !!(p.job && ["chanteur", "dj", "cinema", "humour", "createur", "mannequin", "media"].includes(p.job.track));

// ---------- Les stars (toutes inventées) ----------
ev("star_backstage", {
  ages: [16, 65], tags: ["monde", "star"], ic: "🌟🎤", w: 3, who: { star: "star" }, once: false, cool: 8,
  t: "Un ami te glisse un pass pour les coulisses d'un concert. Tu te retrouves nez à nez avec $star, la célébrité du moment. {$star:Il|Elle} te regarde, surpris{|e} et amusé{|e}.",
  c: [
    D("Demander un selfie", "🤳", "$star accepte et te fait un clin d'œil. Ta photo fait le tour de tes amis.", { repute: 3, bonheur: 4, rel: { star: 8 } }),
    C("Chanter une chanson devant {$star:lui|elle}", "🎶", [O(0.35, "$star adore ta voix et te propose de monter sur scène pour un refrain.", { repute: 8, bonheur: 8, charme: 2, rel: { star: 25 } }), O(0.65, "Un silence gêné. Tu continues quand même, les joues rouges.", { repute: -2, bonheur: -2, courage: 3 })], { risk: 1 }),
    C("Voler un objet souvenir", "🕵️", [O(0.5, "Tu repars avec un plectre doré. Personne n'a rien vu.", { honnete: -3, bonheur: 3 }), O(0.5, "Un garde du corps te rattrape par le col.", { honnete: -3, repute: -5, bonheur: -3, rel: { star: -15 } })], { risk: 1 }),
    D("Rester discret et applaudir de loin", "👏", "Tu savoures l'instant sans déranger personne.", { bonheur: 2, prudent: 1 }),
  ],
});

ev("star_restaurant", {
  ages: [20, 80], tags: ["monde", "star"], ic: "🍽️🌟", w: 3, who: { star: "star" }, once: false, cool: 8,
  t: "Dans un petit restaurant de quartier, la table voisine est occupée par $star. Tout le monde fait semblant de ne pas regarder. La serveuse a renversé trois verres.",
  c: [
    D("Aller dire bonjour", "👋", "$star te répond avec un sourire sincère et t'offre un dessert.", { repute: 2, bonheur: 3, rel: { star: 10 } }),
    D("Faire comme si de rien n'était", "😎", "Tu manges ton plat avec une dignité sans faille. Tu n'as pas osé lever les yeux.", { prudent: 1, bonheur: 1 }),
    C("Filmer discrètement pour les réseaux", "📱", [O(0.5, "La vidéo cartonne. Tu gagnes quelques milliers d'abonnés.", { repute: 4, bonheur: 3, argent: 100 }), O(0.5, "$star te surprend et se fâche. Le restaurant te fait sortir.", { repute: -4, bonheur: -3, rel: { star: -20 } })], { risk: 1 }),
  ],
});

ev("star_enfant_dedicace", {
  ages: [6, 14], tags: ["monde", "star", "enfance"], ic: "🧸🌟", w: 3, who: { star: "star" }, once: true,
  t: "Dans un magasin de jouets, tu tombes sur $star qui signe des autographes. Il y a une file de deux cents personnes et tu tiens ton petit carnet contre ton cœur.",
  c: [
    D("Faire la queue patiemment", "🧍", "Tu obtiens un autographe et un sourire. Tu t'en souviendras toute ta vie.", { bonheur: 6, sociable: 1 }),
    C("Doubler tout le monde", "🏃", [O(0.4, "Tu te glisses sous une table et surgis devant $star, qui rit aux éclats.", { bonheur: 8, courage: 2, charme: 1 }), O(0.6, "Un vigile te rattrape. Honte devant deux cents personnes.", { bonheur: -4, repute: -2 })], { risk: 1 }),
    D("Lui offrir un dessin", "🎨", "$star le glisse dans sa poche avec émotion. Ton cœur bat très fort.", { creatif: 3, bonheur: 5, rel: { star: 12 } }),
  ],
});

ev("star_amoureuse", {
  ages: [18, 45], tags: ["monde", "star", "amour"], ic: "💘🌟", w: 1.5, who: { star: "star" }, need: { single: true }, once: false, cool: 15,
  t: "Lors d'une soirée improbable, $star te remarque. Une conversation s'engage, puis un regard, puis un second. {$star:Il|Elle} te propose de vous revoir « loin des caméras ».",
  c: [
    C("Accepter un dîner secret", "🕯️", [O(0.45, "Une soirée magique. Vous échangez vos numéros, tu ne dors pas de la nuit.", { bonheur: 9, charme: 2, repute: 3, rel: { star: 30 } }), O(0.55, "Un photographe tapi dans les buissons vous prend en photo. La presse s'enflamme.", { bonheur: 3, repute: 5, charme: 1, rel: { star: 10 } })], { risk: 1 }),
    D("Décliner poliment", "🙅", "Tu préfères la tranquillité. $star sourit, un peu surpris{|e}.", { prudent: 2, bonheur: 0, honnete: 1 }),
    C("Vendre l'histoire à un magazine", "💰", [O(0.6, "Le tabloïd te paie royalement. $star ne te le pardonnera pas.", { argent: 4000, repute: -4, honnete: -4, bonte: -3, rel: { star: -40 } }), O(0.4, "Le magazine publie une version différente de la tienne, scandaleuse.", { argent: 1500, repute: -8, honnete: -3, rel: { star: -40 } })], { risk: 2 }),
  ],
});

ev("star_voisin_celebre", {
  ages: [25, 85], tags: ["monde", "star"], ic: "🏡🌟", w: 1.8, who: { star: "star" }, once: true,
  t: "Les déménageurs s'affairent à côté de chez toi. Les rideaux sont tirés, mais une voix bien connue chante dans la douche. Ton nouveau voisin est $star.",
  c: [
    D("Apporter un gâteau de bienvenue", "🍰", "$star te remercie avec émotion. Vous devenez voisins de palier et de confidences.", { sociable: 3, bonheur: 4, rel: { star: 20 } }),
    D("Rester à distance", "🚪", "Tu respectes l'intimité de ta nouvelle voisine ou de ton nouveau voisin.", { prudent: 1 }),
    C("Organiser une fête à côté pour l'attirer", "🎉", [O(0.35, "$star se joint à ta fête et chante un refrain à minuit.", { repute: 6, bonheur: 8, sociable: 3, rel: { star: 25 } }), O(0.65, "$star appelle la police pour tapage nocturne.", { repute: -3, bonheur: -2, argent: -135 })], { risk: 1 }),
  ],
});

ev("star_demande_pret", {
  ages: [22, 80], tags: ["monde", "star", "argent"], ic: "💸🌟", w: 1.2, who: { star: "star" }, need: { money: [3000, null], asset: "voiture" }, once: false, cool: 12,
  t: "À ta grande surprise, $star t'appelle en pleine nuit. {$star:Il|Elle} traverse une mauvaise passe et a besoin de 3 000 € en liquide, tout de suite. Promis, juré, rendu avec intérêts.",
  c: [
    C("Prêter l'argent", "🤝", [O(0.6, "$star te rembourse avec un mot gentil et une grosse enveloppe.", { argent: 600, repute: 3, bonte: 2, rel: { star: 20 } }), O(0.4, "$star disparaît sans laisser d'adresse.", { argent: -3000, bonheur: -3, bonte: 1, rel: { star: -5 } })], { risk: 2 }),
    D("Dire non avec tact", "🙅", "Tu proposes de l'aider autrement. {$star:Il|Elle} comprend, un peu déçu{|e}.", { prudent: 2, bonte: 1 }),
  ],
});

ev("star_collab", {
  ages: [18, 65], tags: ["monde", "star", "travail"], ic: "🤝🌟", w: 4, who: { star: "star" }, need: { fn: artiste }, once: false, cool: 6,
  t: "Ton agent t'annonce que $star souhaite collaborer avec toi sur un projet. Les mails se multiplient, les rendez-vous aussi, et ton téléphone vibre comme un poisson frétillant.",
  c: [
    C("Accepter à bras ouverts", "🎉", [O(0.55, "La collaboration cartonne. Vos deux noms sur une affiche, ça claque.", { perf: 10, repute: 8, bonheur: 7, argent: 5000, rel: { star: 22 } }), O(0.45, "Le projet tourne court. Les egos s'entrechoquent.", { perf: -4, bonheur: -3, repute: -1, rel: { star: -10 } })], { risk: 1 }),
    D("Poser tes conditions", "📜", "Tu obtiens un contrat solide. Un peu moins glamour, beaucoup plus sûr.", { perf: 4, argent: 3000, ambition: 2, rel: { star: 5 } }),
    D("Refuser pour garder ton identité", "🦁", "Tu préfères suivre ta propre voie. Ton public te respecte pour ça.", { honnete: 2, creatif: 3, repute: 2 }),
  ],
});

ev("star_publicite", {
  ages: [18, 55], tags: ["monde", "star", "argent"], ic: "📸🌟", w: 1.5, who: { star: "star" }, need: { stat: { charme: [62, null] } }, once: false, cool: 10,
  t: "Une grande marque te propose d'être la tête d'affiche d'une campagne aux côtés de $star. Séance photo de douze heures, trois changements de tenue par heure, et un buffet de graines.",
  c: [
    C("Foncer avec le sourire", "😁", [O(0.7, "La campagne marche du tonnerre. Ton visage est partout.", { argent: 8000, repute: 6, charme: 2, bonheur: 4 }), O(0.3, "Tes photos sont retouchées au point que ta mère ne te reconnaît pas.", { argent: 8000, bonheur: -2, repute: 1 })]),
    D("Refuser, trop de lumière", "🚪", "Tu préfères l'ombre. Un peu de prudence, un peu de regret.", { prudent: 2, bonheur: 0 }),
  ],
});

ev("star_mariage", {
  ages: [25, 75], tags: ["monde", "star"], ic: "💒🌟", w: 1.2, who: { star: "star" }, need: { fn: (p) => p.npcs.some((n) => n.kind === "star" && n.close >= 30) }, once: false, cool: 15,
  t: "$star t'invite à son mariage sur une île privée. Cent cinquante invités, une pièce montée de six mètres et un hélicoptère en guise de taxi.",
  c: [
    D("Y aller avec ton plus bel habit", "🤵", "Une fête de rêve. Tu rencontres des gens passionnants et tu dances jusqu'à l'aube.", { bonheur: 8, sociable: 3, repute: 3, argent: -300, rel: { star: 8 } }),
    C("Y aller et profiter du buffet", "🍤", [O(0.5, "Tu manges dix-sept crevettes et fais rire un ministre.", { bonheur: 6, sociable: 2, repute: 2 }), O(0.5, "Tu glisses sur une crevette et renverses la pièce montée.", { bonheur: -2, repute: -4, rel: { star: -5 } })], { risk: 1 }),
    D("Envoyer un cadeau", "🎁", "Un joli cadeau, une carte pleine d'affection. Merci cher ami.", { argent: -150, bonte: 2 }),
  ],
});

ev("star_paparazzi", {
  ages: [18, 70], tags: ["monde", "star"], ic: "📸😳", w: 2, who: { star: "star" }, need: { fn: (p) => p.npcs.some((n) => n.kind === "star" && n.close >= 15) }, once: false, cool: 6,
  t: "Un photographe te suit depuis ce matin. Un article titre déjà sur ta prétendue liaison avec $star. Tu n'as pourtant fait que lui serrer la main dans la rue.",
  c: [
    D("Démentir calmement", "🗞️", "Tu publies un démenti sobre. L'affaire retombe, vaguement ennuyeuse pour les journaux.", { honnete: 2, repute: 1 }),
    C("Jouer le jeu et en profiter", "🎭", [O(0.55, "Tu donnes trois interviews et signes un contrat de chroniqueur.", { argent: 3000, repute: 6, bonheur: 4, honnete: -2 }), O(0.45, "Le scandale enfle, tu finis sur toutes les unes.", { repute: -6, bonheur: -3, rel: { star: -15 } })], { risk: 2 }),
    D("Fuir à la campagne un mois", "🌾", "Le temps de laisser les choses se tasser, tu élèves des poules.", { bonheur: 3, argent: -500, sante: 1 }),
  ],
});

ev("star_fan_obsede", {
  ages: [20, 70], tags: ["monde", "star"], ic: "🥰📣", w: 1.2, need: { stat: { repute: [70, null] }, fn: artiste }, once: false, cool: 10,
  t: "Une fan t'attend chaque matin devant chez toi, un bouquet à la main. Elle t'écrit des lettres de huit pages et sait ton emploi du temps mieux que toi.",
  c: [
    D("Lui offrir un autographe poli", "✍️", "Elle pleure de joie et repart. Pour quelques semaines au moins.", { bonte: 2, bonheur: 1 }),
    D("Engager un garde du corps", "🕴️", "L'affaire est réglée. Le garde du corps est devenu ton meilleur ami.", { argent: -1500, bonheur: 1, prudent: 2 }),
    C("L'inviter à prendre un thé", "🫖", [O(0.5, "Elle devient une amie fidèle et respectueuse.", { bonheur: 3, sociable: 2, bonte: 2 }), O(0.5, "Elle déménage dans ton garage.", { bonheur: -5, argent: -300 })], { risk: 1 }),
  ],
});

ev("star_jury", {
  ages: [22, 70], tags: ["monde", "star", "travail"], ic: "🎭🌟", w: 2, who: { star: "star" }, need: { fn: artiste }, once: false, cool: 8,
  t: "Une émission de télévision te propose de siéger au jury aux côtés de $star. Tu dois juger des candidats, parfois géniaux, souvent tordants.",
  c: [
    D("Juger avec bienveillance", "💗", "Tu deviens le chouchou du public. Les audiences montent.", { repute: 6, bonte: 3, bonheur: 5, argent: 4000 }),
    C("Juger avec cruauté", "😈", [O(0.5, "Le public adore te détester, les audiences explosent.", { repute: 4, argent: 6000, bonte: -4 }), O(0.5, "Le public se retourne contre toi. Les mails de menaces se multiplient.", { repute: -8, bonheur: -4, bonte: -4 })], { risk: 2 }),
    D("Refuser, la télé n'est pas pour toi", "📺", "Tu préfères travailler dans l'ombre.", { prudent: 2, creatif: 1 }),
  ],
});

// ---------- Rencontres improbables ----------
ev("monde_genie_lampe", {
  ages: [8, 90], tags: ["monde", "loufoque"], ic: "🧞🪔", w: 2, once: true,
  t: "Dans un vide-grenier, tu achètes une vieille lampe à huile rouillée. Tu la frottes pour la nettoyer. Une fumée bleue jaillit, une voix de baryton gronde, et un génie apparaît avec un accent un peu marseillais.",
  c: [
    C("Demander la richesse", "💰", [O(0.5, "Le génie claque des doigts. Un sac d'or apparaît sur la table.", { argent: 20000, bonheur: 5, honnete: -1 }), O(0.5, "Le génie lit mal le contrat. Tu reçois une montagne de pièces de monnaie étrangères sans valeur.", { argent: 300, bonheur: 1 })]),
    D("Demander la santé", "❤️", "Une lumière chaude t'enveloppe. Tu te sens plus fort{|e} qu'à vingt ans.", { sante: 15, bonheur: 4 }),
    D("Demander la sagesse", "🦉", "Tu comprends tout, un instant. Puis ça se dissipe. Il reste quelque chose.", { intel: 8, bonheur: 3 }),
    C("Demander l'immortalité", "♾️", [O(0.1, "Le génie accepte. Tu vivras très longtemps, avec ce que ça implique.", { sante: 25, bonheur: -2, flag: "ange_gardien" }), O(0.9, "Le génie rit. « Pas dans mon contrat ! » Il te donne un petit gâteau.", { bonheur: 1 })], { risk: 1 }),
  ],
});

ev("monde_voyageur_temps", {
  ages: [10, 85], tags: ["monde", "loufoque"], ic: "⏳🕰️", w: 1.5, once: true,
  t: "Un homme en costume étrange surgit d'un nuage de fumée dans ta cuisine. Il dit venir de l'an 2300 et t'implore de ne surtout pas manger la dernière part de gâteau au chocolat.",
  c: [
    D("Suivre son conseil", "🍰", "Tu laisses le gâteau. Ton frère le mange et déclenche une dispute historique. Le monde est sauvé, peut-être.", { bonheur: 2, intel: 1, bonte: 1 }),
    C("Manger le gâteau par défi", "😈", [O(0.5, "Rien ne se passe. Le voyageur disparaît, vexé.", { bonheur: 4, courage: 2 }), O(0.5, "Un hoquet temporel te fait rajeunir de dix minutes. Tu en gardes un fou rire.", { bonheur: 6, creatif: 2 })], { risk: 1 }),
    D("Lui demander les numéros du loto", "🎰", "Il bafouille. Il ne se souvient que des numéros de 2287. Ils ne servent à rien aujourd'hui.", { bonheur: 1 }),
  ],
});

ev("monde_extraterrestre", {
  ages: [10, 90], tags: ["monde", "loufoque"], ic: "👽🛸", w: 1.5, once: true,
  t: "Une soucoupe volante se pose dans ton jardin, juste à côté du poulailler. Un petit être vert descend, tient dans une main un plan de ta rue et dans l'autre une assiette de bonbons étranges.",
  c: [
    D("L'inviter à prendre un thé", "🫖", "Il parle trois langues et pas la tienne. Vous vous comprenez par gestes. Il repart en laissant un cadeau.", { bonheur: 8, sociable: 3, creatif: 2, argent: 200 }),
    C("Vendre une photo à la presse", "📸", [O(0.5, "Un magazine t'achète le cliché pour une fortune.", { argent: 3000, repute: 4, honnete: -1 }), O(0.5, "Personne ne te croit. Ta réputation en prend un coup.", { repute: -4, bonheur: -2 })], { risk: 1 }),
    D("Fuir en hurlant", "🏃", "Tu te réfugies chez ton voisin. Le petit être repart en haussant les épaules.", { courage: -2, bonheur: -1 }),
  ],
});

ev("monde_mendiant_milliardaire", {
  ages: [12, 85], tags: ["monde"], ic: "🧥💎", w: 2, once: false, cool: 20,
  t: "Un homme au manteau râpé te demande une pièce devant la gare. Son regard est vif, ses chaussures sont d'une qualité étonnante. Un chauffeur attend, discrètement, au coin de la rue.",
  c: [
    D("Lui donner un peu d'argent", "💶", "Il te remercie avec une gravité étonnante. Un mois plus tard, un chèque arrive à ton nom.", { argent: -5, bonte: 3, bonheur: 2, later: { id: "monde_chèque_mystère", in: [1, 2] } }),
    D("L'inviter à manger un sandwich", "🥪", "Vous parlez pendant une heure. Il t'enseigne plus que dix manuels.", { intel: 3, bonte: 3, bonheur: 4 }),
    D("L'ignorer et passer ton chemin", "🙈", "Tu poursuis ta route. Tu ne sauras jamais.", { bonte: -1 }),
  ],
});
ev("monde_chèque_mystère", {
  chainOnly: true, tags: ["monde"], ic: "💌💶",
  t: "Un courrier au papier épais arrive. Il contient un chèque et un mot calligraphié, « pour votre bonté, avec toute ma gratitude ». La signature est celle du plus grand banquier du pays.",
  c: [
    D("Encaisser et dire merci", "🏦", "Tu encaisses, tu écris une longue lettre de remerciements.", { argent: 5000, bonte: 2, bonheur: 5 }),
    D("Le donner à une association", "🤲", "Tu offres l'intégralité du chèque. Ta réputation brille.", { repute: 10, bonte: 6, bonheur: 4 }),
  ],
});

ev("monde_secte_joyeuse", {
  ages: [16, 80], tags: ["monde", "loufoque"], ic: "🔆🙏", w: 1.5, once: true,
  t: "Un groupe de gens très souriants t'aborde dans la rue. Ils portent des tuniques jaune citron et t'invitent à une réunion consacrée à « l'harmonie des tartes ». Il y aura du gâteau.",
  c: [
    D("Y aller pour le gâteau", "🍰", "Tu manges trois parts de tarte et repars sans rien signer. Quelle belle soirée.", { bonheur: 4, sociable: 2 }),
    C("Rejoindre pour de bon", "🔆", [O(0.4, "Une communauté chaleureuse et farfelue. Tu y trouves des amis.", { bonheur: 6, sociable: 4, argent: -500 }), O(0.6, "On te réclame une cotisation exorbitante.", { argent: -2500, bonheur: -3, intel: 1 })], { risk: 1 }),
    D("Décliner poliment", "🙅", "Tu t'éloignes avec un petit tract. La tarte aux pommes te manque quand même.", { prudent: 1 }),
  ],
});

ev("monde_sosie_celebre", {
  ages: [16, 70], tags: ["monde", "loufoque"], ic: "🪞🌟", w: 1.5, who: { star: "star" }, once: true,
  t: "Une foule te poursuit dans la rue en hurlant. On te prend pour $star. Tu as beau protester, on te tend des stylos, des bébés à signer et des sandwichs.",
  c: [
    C("Profiter de la confusion", "😎", [O(0.55, "Tu es invité{|e} dans un restaurant étoilé et personne ne te fait payer.", { bonheur: 8, argent: 150, honnete: -2 }), O(0.45, "La vraie star s'en rend compte et te réclame des droits d'image.", { bonheur: -2, argent: -400, honnete: -2 })], { risk: 1 }),
    D("Expliquer calmement", "🗣️", "Tu enlèves tes lunettes. Les gens sont déçus mais te prennent en photo quand même.", { honnete: 3, bonheur: 2 }),
    D("Signer des autographes en riant", "✍️", "Tu signes vingt-sept carnets d'un paraphe invraisemblable. Tu t'en souviendras.", { creatif: 3, bonheur: 6, honnete: -1 }),
  ],
});

ev("monde_magicien_rue", {
  ages: [6, 90], tags: ["monde"], ic: "🎩🪄", w: 3, once: false, cool: 8,
  t: "Un magicien de rue t'invite à choisir une carte au hasard. Tu choisis. Il retourne un oiseau, deux balles et ton portefeuille, qu'il te rend en s'excusant.",
  c: [
    D("Applaudir et lui donner une pièce", "🪙", "Un moment de poésie au coin d'une rue. Il te salue très bas.", { bonheur: 3, argent: -5, bonte: 1 }),
    C("Tenter de comprendre le truc", "🔍", [O(0.4, "Tu perces son secret. Il te propose de devenir son assistant{|e}.", { intel: 2, bonheur: 4, creatif: 2 }), O(0.6, "Tu n'y comprends rien et il te fait disparaître ta montre.", { bonheur: -1, argent: -80, intel: 1 })], { risk: 1 }),
    D("Se faire tirer un lapin du chapeau", "🐇", "Un lapin se retrouve dans tes bras. Il s'appelle Gaston et ne veut plus partir.", { bonheur: 5, creatif: 1 }),
  ],
});

ev("monde_chasseur_tresor", {
  ages: [18, 80], tags: ["monde", "loufoque"], ic: "🗺️💎", w: 1.5, once: true, need: { money: [500, null] },
  t: "Un homme en chapeau de brousse te propose d'investir dans une expédition. Il parle d'une carte, d'un galion englouti et d'une perruche savante qui connaît l'emplacement.",
  c: [
    C("Investir 2 000 €", "💰", [O(0.25, "Le galion existe. Votre part est colossale.", { argent: 25000, bonheur: 8, repute: 4 }), O(0.75, "Le galion est une vieille barque de pêche remplie de crabes.", { argent: -2000, bonheur: -1, creatif: 1 })], { risk: 2, cost: 2000 }),
    D("Refuser avec un sourire", "🙅", "Tu restes sur la terre ferme. Mieux vaut un petit salaire qu'un galion perdu.", { prudent: 2 }),
    D("L'accompagner gratuitement", "🧭", "Une aventure folle, sans trésor mais avec beaucoup de fous rires.", { bonheur: 6, courage: 3, sante: -1 }),
  ],
});

ev("monde_roi_exile", {
  ages: [20, 85], tags: ["monde", "loufoque"], ic: "👑🥲", w: 1, once: true, who: { star: "star" },
  t: "$star, un ancien roi d'un micro-royaume, a perdu son trône à cause d'un référendum sur les fromages. Il sonne à ta porte avec une valise de dorures et sollicite l'hospitalité.",
  c: [
    D("L'héberger pour quelques jours", "🛏️", "Il t'offre une médaille en carton et apprend à cuire des pâtes.", { bonte: 3, bonheur: 4, repute: 2, argent: -100, rel: { star: 15 } }),
    D("L'envoyer chez ton voisin", "🚪", "Tu lui indiques la bonne direction avec un grand sourire. Un voisin se sacrifie.", { bonte: -1 }),
    C("Lui proposer un contrat d'investissement", "📜", [O(0.3, "Il est vraiment riche. Tu empoches une jolie somme.", { argent: 10000, bonheur: 4 }), O(0.7, "Son trésor est en monnaie locale sans valeur.", { argent: -500, bonheur: -1, honnete: -1 })], { risk: 1 }),
  ],
});

ev("monde_mafia_boulangerie", {
  ages: [20, 80], tags: ["monde", "loufoque", "mature"], ic: "🥖🕶️", w: 1.2, once: true,
  t: "Deux hommes en costume rayé entrent dans ta boulangerie préférée. Ils commandent douze baguettes et demandent poliment au boulanger de leur « confier ses économies ». Il bégaye de peur.",
  c: [
    C("Intervenir courageusement", "🦸", [O(0.45, "Tu les mets à la porte avec une baguette. Le quartier t'adore.", { courage: 5, repute: 8, bonheur: 5 }), O(0.55, "Les hommes te regardent longuement. Tu prends le large, tremblant{|e}.", { courage: 2, bonheur: -3 })], { risk: 2 }),
    D("Appeler la police discrètement", "📞", "La police arrive. Le boulanger t'offre un croissant tous les matins.", { honnete: 3, repute: 3, bonheur: 3 }),
    D("Faire semblant de ne rien voir", "🙈", "Tu achètes ton pain et tu pars. Le remords te suit.", { honnete: -2, bonheur: -2 }),
  ],
});

ev("monde_concours_talent", {
  ages: [8, 70], tags: ["monde"], ic: "🏆🎭", w: 3, once: false, cool: 10,
  t: "Une grande émission de talents passe dans ta région. Tu n'as pas de vrai talent, sauf peut-être pour imiter un canard enrhumé. Ta famille t'a déjà inscrit{|e}.",
  c: [
    C("Faire ton numéro de canard", "🦆", [O(0.3, "Le jury s'écroule de rire. Tu passes en finale.", { repute: 8, bonheur: 8, charme: 2 }), O(0.7, "Le jury reste de marbre. Le public siffle.", { repute: -3, bonheur: -3, courage: 3 })], { risk: 1 }),
    D("Chanter une chanson classique", "🎤", "Un joli moment, sans éclat ni honte.", { bonheur: 3, creatif: 2 }),
    D("Déclarer forfait", "🏳️", "Tu restes dans les coulisses. Ta famille soupire.", { bonheur: -1, prudent: 1 }),
  ],
});

ev("monde_ascenseur_star", {
  ages: [18, 80], tags: ["monde", "star"], ic: "🛗🌟", w: 2, who: { star: "star" }, once: false, cool: 10,
  t: "L'ascenseur s'arrête brutalement entre deux étages. Tu te retrouves seul{|e} avec $star, qui récite sa liste de courses à haute voix pour se calmer.",
  c: [
    D("L'aider à rester calme", "🫂", "Vous discutez deux heures. Quelque chose naît, une complicité sincère.", { bonte: 3, bonheur: 5, rel: { star: 25 } }),
    D("Lui proposer de chanter ensemble", "🎶", "Un duo improvisé qui va rester gravé dans votre mémoire.", { creatif: 3, bonheur: 6, rel: { star: 20 } }),
    D("Vous taire tous les deux", "🤐", "Deux heures de silence gêné. Le dépanneur vous délivre.", { bonheur: -1 }),
  ],
});

// ---------- La bande, les proches, les voisins ----------
ev("bande_retrouvailles", {
  ages: [18, 80], tags: ["monde", "amitie"], ic: "🥂🫂", w: 4, who: { ami: "friend" }, once: false, cool: 5,
  t: "Tu croises $ami à une terrasse, par hasard. Dix ans sans vous voir, et pourtant il suffit d'un fou rire pour que tout revienne, les blagues, les bêtises, les souvenirs d'école.",
  c: [
    D("Passer la soirée ensemble", "🍻", "Vous refaites le monde jusqu'à la fermeture. Une belle amitié repart.", { bonheur: 6, sociable: 2, rel: { ami: 15 } }),
    D("Échanger vos numéros et partir", "📱", "Tu promets de rappeler. Peut-être.", { bonheur: 2, rel: { ami: 4 } }),
    C("Lui proposer un projet fou", "💡", [O(0.45, "Vous vous lancez dans une aventure géniale ensemble.", { bonheur: 7, creatif: 3, ambition: 2, rel: { ami: 12 } }), O(0.55, "Le projet fait un four, mais vous en rigolez des années.", { bonheur: 3, argent: -300, rel: { ami: 8 } })], { risk: 1 }),
  ],
});

ev("bande_service_demande", {
  ages: [16, 85], tags: ["monde", "amitie"], ic: "🙏🧳", w: 4, who: { ami: "friend" }, once: false, cool: 4,
  t: "$ami t'appelle, un peu gêné{$ami:|e}, pour te demander un service. Il faut déménager un canapé, un piano et une plante carnivore, tout ça avant dix-huit heures.",
  c: [
    D("Dire oui sans hésiter", "💪", "Dos cassé mais cœur léger. Vous mangez des pizzas assis sur le piano.", { bonte: 3, sante: -1, bonheur: 4, rel: { ami: 12 } }),
    D("Proposer de payer un déménageur", "💶", "Tu règles le problème avec ton portefeuille. L'amitié survit, un peu refroidie.", { argent: -200, bonheur: 1, rel: { ami: 3 } }),
    D("Inventer une excuse", "🤒", "Tu te dis malade. Il comprend, ou fait semblant.", { honnete: -2, rel: { ami: -8 } }),
  ],
});

ev("bande_mariage_ami", {
  ages: [22, 70], tags: ["monde", "amitie"], ic: "💍🥂", w: 3, who: { ami: "friend" }, once: false, cool: 6,
  t: "$ami se marie ! Il te demande d'être témoin. Le discours doit durer quinze minutes, être drôle et ne mentionner aucun ex.",
  c: [
    C("Écrire un discours inoubliable", "🎤", [O(0.55, "La salle pleure de rire, puis de joie. Un grand moment.", { bonheur: 7, repute: 4, creatif: 2, rel: { ami: 18 } }), O(0.45, "Ta blague sur l'ex tombe à plat. La mariée soupire.", { bonheur: -1, repute: -2, rel: { ami: 4 } })], { risk: 1 }),
    D("Rester sobre et émouvant", "💗", "Ton discours est court, sincère et touche tout le monde.", { bonheur: 5, bonte: 2, rel: { ami: 14 } }),
    D("Décliner et envoyer un cadeau", "🎁", "Tu t'excuses. Ton cadeau est somptueux.", { argent: -200, rel: { ami: -5 } }),
  ],
});

ev("bande_dispute", {
  ages: [14, 80], tags: ["monde", "amitie"], ic: "😤💥", w: 3, who: { ami: "friend" }, once: false, cool: 6,
  t: "Une dispute éclate avec $ami à propos d'une chose absurde, une dernière part de pizza, un malentendu de texto ou une partie de cartes. Les mots dépassent la pensée.",
  c: [
    D("Faire le premier pas", "🕊️", "Tu t'excuses, il s'excuse, vous riez. Les choses reprennent leur place.", { bonte: 3, bonheur: 3, rel: { ami: 10 } }),
    D("Laisser le temps faire", "⏳", "Le silence dure des mois. Puis un message anodin rompt la glace.", { bonheur: -1, rel: { ami: -3 } }),
    D("Couper les ponts", "✂️", "Tu bloques son numéro. Un peu de liberté, un peu de vide.", { bonheur: -3, honnete: 1, rel: { ami: -35 } }),
  ],
});

ev("bande_voyage_ensemble", {
  ages: [18, 75], tags: ["monde", "amitie"], ic: "🧳✈️", w: 3, who: { ami: "friend" }, once: false, cool: 8, need: { money: [1500, null] },
  t: "$ami te propose un grand voyage sans programme précis. Une tente, un sac à dos et l'envie de se perdre. Vous partez demain si tu dis oui.",
  c: [
    D("Partir sans réfléchir", "🎒", "Trois semaines de fous rires, de galères et de levers de soleil. Vous rentrez transformés.", { bonheur: 9, courage: 3, creatif: 2, argent: -1500, rel: { ami: 18 } }),
    D("Proposer un voyage plus organisé", "🗺️", "Des hôtels, des horaires, un plan B. Un voyage sans surprise.", { bonheur: 4, prudent: 2, argent: -1800, rel: { ami: 8 } }),
    D("Rester chez toi", "🏠", "Tu regardes ses photos avec un petit pincement.", { bonheur: -1, rel: { ami: -5 } }),
  ],
});

ev("bande_lance_entreprise", {
  ages: [20, 60], tags: ["monde", "amitie", "argent"], ic: "💡🤝", w: 2.5, who: { ami: "friend" }, once: false, cool: 8, need: { money: [2000, null] },
  t: "$ami a une idée de génie, une application qui dit aux gens quel fromage manger selon leur humeur. Il cherche un associé et ne jure que par toi.",
  c: [
    C("Investir 2 000 €", "💶", [O(0.3, "L'application cartonne. Vous vendez la start-up à prix d'or.", { argent: 20000, bonheur: 7, repute: 4, rel: { ami: 15 } }), O(0.7, "L'application plante, les serveurs aussi.", { argent: -2000, bonheur: -2, rel: { ami: 5 } })], { risk: 2, cost: 2000 }),
    D("Offrir ton aide gratuitement", "🤝", "Tu l'aides à tester l'application pendant les week-ends. Précieux et gratifiant.", { bonte: 2, bonheur: 3, rel: { ami: 10 } }),
    D("Refuser avec honnêteté", "🙅", "Tu lui expliques tes doutes. Il boude, puis comprend.", { honnete: 2, prudent: 2, rel: { ami: -3 } }),
  ],
});

ev("bande_trahison", {
  ages: [16, 80], tags: ["monde", "amitie"], ic: "🗡️😔", w: 2, who: { ami: "friend" }, once: false, cool: 10,
  t: "Tu apprends que $ami a répété un secret que tu lui avais confié. Tout le groupe est au courant. Les regards en disent long.",
  c: [
    D("L'affronter en face", "🔥", "Une discussion houleuse, des larmes, puis des excuses franches.", { courage: 3, honnete: 2, rel: { ami: -5 } }),
    D("Pardonner en silence", "🕊️", "Tu avales la pilule. Le secret est mort, l'amitié survit.", { bonte: 3, bonheur: -1, rel: { ami: 4 } }),
    C("Te venger avec un secret à lui", "😈", [O(0.5, "Le coup est parfait. Il comprend la leçon.", { bonte: -3, honnete: -2, bonheur: 2, rel: { ami: -25 } }), O(0.5, "Le groupe te donne tort, tu passes pour le méchant.", { repute: -5, bonte: -3, bonheur: -3, rel: { ami: -30 } })], { risk: 2 }),
  ],
});

ev("bande_presentation_amour", {
  ages: [18, 55], tags: ["monde", "amour"], ic: "💞🍷", w: 2.5, who: { ami: "friend" }, need: { single: true }, once: false, cool: 8,
  t: "$ami est certain{$ami:|e} d'avoir trouvé ton âme sœur. Il organise un dîner à quatre, avec la personne en question, une nappe à fleurs et un air de ne pas y toucher.",
  c: [
    C("Jouer le jeu avec le sourire", "😊", [O(0.4, "Le courant passe, vous échangez vos numéros.", { bonheur: 6, charme: 2, sociable: 2, flag: "rencontre_amie" }), O(0.6, "Aucune étincelle, mais un très bon repas.", { bonheur: 2 })]),
    D("Trouver une excuse pour partir tôt", "🕐", "Tu invoques une réunion à l'aube. Ton ami n'est pas dupe.", { honnete: -1, rel: { ami: -3 } }),
    D("Demander à $ami d'arrêter", "🛑", "Tu poses des limites avec douceur. Il comprend, déçu.", { honnete: 2, prudent: 1 }),
  ],
});

ev("bande_ami_malade", {
  ages: [20, 85], tags: ["monde", "amitie", "sante"], ic: "🏥💐", w: 2, who: { ami: "friend" }, once: false, cool: 8,
  t: "Tu apprends que $ami est hospitalisé{$ami:|e} pour un problème sérieux. La nouvelle te cueille à froid. Le téléphone reste sur ta main longtemps.",
  c: [
    D("Aller le voir tout de suite", "🚪", "Tu passes l'après-midi à son chevet, avec des chocolats et des blagues nulles.", { bonte: 4, bonheur: 2, rel: { ami: 22 } }),
    D("Envoyer des messages quotidiens", "💌", "Un petit mot, chaque jour. Il les garde tous.", { bonte: 2, rel: { ami: 10 } }),
    D("Reporter la visite", "📆", "Tu te dis que tu iras demain. Demain devient trois semaines.", { bonte: -2, bonheur: -2, rel: { ami: -10 } }),
  ],
});

ev("bande_ami_etranger", {
  ages: [20, 65], tags: ["monde", "amitie"], ic: "🌍👋", w: 2, who: { ami: "friend" }, once: false, cool: 10,
  t: "$ami déménage à l'autre bout du monde pour un nouveau travail. Un dernier verre, un dernier câlin, une valise ouverte sur le lit. Les au revoir sont toujours étranges.",
  c: [
    D("Promettre de lui rendre visite", "✈️", "Tu tiens parole l'année suivante. Les retrouvailles sont fabuleuses.", { bonheur: 4, argent: -1200, rel: { ami: 12 } }),
    D("Rester en contact par écrit", "✉️", "Des lettres, des messages, des photos. L'amitié survit aux fuseaux horaires.", { bonheur: 2, rel: { ami: 5 } }),
    D("Se promettre de se revoir un jour", "🤞", "Chacun reprend sa vie. Les années filent.", { bonheur: -2, rel: { ami: -10 } }),
  ],
});

ev("bande_rival_coup", {
  ages: [14, 70], tags: ["monde", "rivalite"], ic: "😈🏁", w: 3, who: { rival: "rival" }, once: false, cool: 6,
  t: "$rival te défie à nouveau, devant tout le monde. Cette fois, il s'agit d'une partie d'échecs, d'une dégustation de fromage et d'une course en sacs de pommes de terre.",
  c: [
    C("Relever le défi", "🔥", [O(0.5, "Tu gagnes haut la main. Tes amis te portent en triomphe.", { bonheur: 6, repute: 4, courage: 2, rel: { rival: -5 } }), O(0.5, "Tu perds, vexé{|e}. Le sac de patates est ton ennemi.", { bonheur: -3, repute: -2, rel: { rival: 5 } })], { risk: 1 }),
    D("Refuser avec dignité", "🧘", "Tu laisses passer. Il n'a pas l'air plus content.", { prudent: 2, bonheur: 1 }),
    D("Lui proposer une trêve", "🕊️", "Il hésite, puis accepte. Une rivalité devient amitié.", { bonte: 3, bonheur: 3, becomes: { rival: "friend" } }),
  ],
});

ev("bande_collegue_ami", {
  ages: [20, 62], tags: ["monde", "travail", "amitie"], ic: "☕🤝", w: 3, who: { collegue: "colleague" }, need: { job: true }, once: false, cool: 6,
  t: "À la pause déjeuner, $collegue t'invite à partager un repas. Vous parlez de séries, de vacances ratées et de la photocopieuse hantée du troisième étage. Un lien s'installe.",
  c: [
    D("Accepter et devenir proche", "🥗", "Vos déjeuners deviennent un rituel. Le travail paraît moins gris.", { bonheur: 5, sociable: 2, perf: 2, becomes: { collegue: "friend" } }),
    D("Rester cordial sans plus", "🙂", "Une relation agréable, sans confidences.", { bonheur: 1 }),
    D("Éviter, tu préfères manger seul{|e}", "🎧", "Tu mets des écouteurs. Le silence est reposant.", { prudent: 1, sociable: -1 }),
  ],
});
