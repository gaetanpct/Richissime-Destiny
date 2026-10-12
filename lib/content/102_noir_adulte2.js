// HUMOUR NOIR 3/4 — Argent, faillites, réseaux sociaux, célébrité, justice
const { ev, flash, O, C, D } = require("../kit");

// ============ ARGENT, DETTES, INVESTISSEMENTS, FAILLITES ============
ev("n_crypto_poulet", {
  title: "Le PouletCoin", ages: [20, 60], tags: ["argent"], ic: "🐔📈", rar: "peu", need: { money: [1500, null] },
  t: "Un cousin éloigné t'explique, avec des yeux brillants, que le PouletCoin va remplacer l'euro avant Noël. Le logo est un poulet en costume. Le site promet des rendements de 4000 pour cent et un autocollant offert.",
  c: [
    C("Tout miser, c'est l'occasion de ta vie", "🎰", [O(0.12, "Le poulet décolle. Tu revends au sommet et tu ne comprends toujours pas pourquoi.", { argent: 22000, bonheur: 8, flag: "riche_par_hasard", later: { id: "n_profiteurs", in: [1, 2], p: 0.7 } }), O(0.88, "Le cours s'effondre en six heures. Le cousin ne répond plus, son site affiche un simple poulet qui rit.", { argent: -1500, dette: 4000, bonheur: -6, flag: "dette_crypto", later: { id: "n_saisie_huissier", in: [1, 2], p: 0.75 } })], { risk: 3 }),
    D("Investir juste de quoi s'amuser", "🪙", "Quelques euros pour un poulet numérique. Il vaut dix centimes la semaine suivante, mais ton autocollant est très joli.", { argent: -150, bonheur: 1 }),
    D("Prévenir toute la famille du piège", "📣", "Tu passes pour un rabat-joie jusqu'à ce que le site s'effondre. Tu deviens un prophète dans ta propre famille.", { repute: 3, intel: 1, bonheur: 2 }),
  ],
});
ev("n_saisie_huissier", {
  chainOnly: true, title: "L'huissier sonne deux fois", tags: ["argent"], ic: "🔔📋", need: { debt: [1500, null] },
  t: "Un homme en costume gris sonne à ta porte avec une mallette et une expression de pure bonté administrative. Il t'explique qu'il va « procéder à un inventaire », ce qui signifie qu'il regarde ton canapé avec envie.",
  c: [
    D("Négocier un échéancier", "🤝", "Une longue discussion, un café tiède et un tableau Excel. Tu t'en sors avec un plan sur dix ans.", { honnete: 2, bonheur: -2, dette: -500 }),
    C("Cacher tes objets de valeur chez la voisine", "📦", [O(0.5, "L'huissier n'y voit que du feu. La voisine adore garder ta collection de vinyles.", { bonheur: 2, honnete: -2 }), O(0.5, "L'huissier est plus malin que prévu. La fraude te coûte une amende.", { honnete: -3, argent: -800, dette: 800, bonheur: -3, record: 1 })], { risk: 2 }),
    D("Laisser tout saisir et repartir de zéro", "🧹", "Il ne reste que des murs et un matelas. Un sentiment étrange de liberté s'installe.", { sell: "voiture", argent: -400, bonheur: -3, courage: 3, flag: "tout_perdu", later: { id: "n_faillite_perso", in: [1, 3], p: 0.5 } }),
  ],
});
ev("n_faillite_perso", {
  chainOnly: true, title: "Dossier de surendettement", tags: ["argent"], ic: "🗂️💸", need: { debt: [3000, null] },
  t: "Tu poses ton dossier de surendettement sur le comptoir. L'agent le feuillette avec un petit sourire poli, puis il te demande si tu as « une cagnotte secrète quelque part ». Tu réponds par un rire nerveux.",
  c: [
    D("Accepter la procédure", "📄", "On efface une partie de la dette. Tu sors allégé{|e}, mais fiché{|e} pour quelques années.", { dette: -9000, bonheur: 3, repute: -2, flag: "ancien_failli" }),
    C("Tenter de négocier encore plus", "🎲", [O(0.35, "Le conciliateur est de bonne humeur, une partie de la dette saute.", { dette: -14000, bonheur: 5 }), O(0.65, "Il referme le dossier et te demande de revenir quand tu auras plus de dignité.", { bonheur: -4, repute: -1 })], { risk: 1 }),
  ],
});
ev("n_profiteurs", {
  chainOnly: true, title: "Tous tes amis d'un coup", tags: ["argent", "social"], ic: "🦈🍾", need: { money: [3000, null] },
  t: "Depuis ton succès, ton téléphone ne désemplit plus. Des amis d'enfance que tu n'as pas vus depuis vingt ans, un oncle qui connaît un « super projet », une ex qui « pensait justement à toi », et un inconnu qui te demande de financer son album de flûte.",
  c: [
    C("Prêter à tout le monde", "🤲", [O(0.3, "Tu as le cœur grand, et deux ou trois personnes te remboursent même avec un petit cadeau.", { argent: -2500, bonte: 4, bonheur: 4, repute: 2 }), O(0.7, "Tu ne reverras jamais ton argent. Mais tu as fini à la une du journal de la flûte.", { argent: -9000, bonte: 2, bonheur: -3 })], { risk: 2 }),
    D("Filtrer les vrais proches", "🔍", "Tu fais le tri sans pitié. Il te reste quatre vrais amis et un chat.", { argent: -300, intel: 2, bonheur: 2, repute: -1 }),
    D("Disparaître quelques mois en voyage", "🏝️", "Tu reviens bronzé{|e}, ils ont tous trouvé quelqu'un d'autre à exploiter.", { argent: -2500, bonheur: 5 }),
  ],
});
ev("n_idee_stupide_millionnaire", {
  title: "L'idée du siècle", ages: [20, 55], tags: ["argent", "chance"], ic: "💡🤑", rar: "mythique",
  t: "Un soir de fête, tu lances une idée complètement stupide. Un ami la note sur une serviette. Un an plus tard, des chaussettes à poche pour téléphone se vendent partout dans le monde, et ton nom figure sur la serviette encadrée, dans le bureau de l'investisseur.",
  c: [
    D("Réclamer ta part", "🧾", "Un avocat, une négociation et un chèque à six chiffres.", { argent: 120000, bonheur: 8, ambition: 3, flag: "idee_millions", later: { id: "n_profiteurs", in: [1, 2], p: 0.8 } }),
    D("Laisser faire, par amitié", "🤍", "Ton ami t'offre un voyage et un dîner. La reconnaissance est belle, mais cher payée.", { argent: 3000, bonheur: 5, bonte: 3 }),
    C("Menacer d'un procès", "⚖️", [O(0.5, "Un arrangement discret te rapporte gros.", { argent: 60000, honnete: -2, bonheur: 5 }), O(0.5, "Pas de preuve, pas de serviette. La serviette a disparu dans une machine à laver.", { bonheur: -5, repute: -2 })], { risk: 2 }),
  ],
});
ev("n_chute_apres_succes", {
  chainOnly: true, title: "La chute du roi", tags: ["argent"], ic: "📉👑", need: { money: [50000, null] },
  t: "Tu as cru que cela durerait toujours. Un conseiller en gestion de patrimoine à lunettes rondes t'explique poliment que tu dépenses cinq fois plus que tu ne gagnes, et que le yacht n'était pas une obligation.",
  c: [
    D("Vendre le superflu en urgence", "🛥️", "Les jouets partent à bas prix. Il te reste un modeste confort et une grande leçon.", { argent: -6000, sell: "bijou", bonheur: -3, prudent: 4 }),
    C("Doubler la mise pour se refaire", "🎲", [O(0.25, "Miracle, tu te refais en trois semaines. Tu n'as rien compris, mais ça marche.", { argent: 40000, bonheur: 4, prudent: -2 }), O(0.75, "Tu perds plus encore. Le yacht part dans la semaine.", { argent: -45000, bonheur: -8, prudent: -2 })], { risk: 3 }),
    D("Tout avouer à ta famille", "🗣️", "La honte passe vite, le soutien reste. Ta famille te prête une chambre et du courage.", { bonheur: 2, honnete: 3, argent: -1000 }),
  ],
});
ev("n_loterie_imprevue", {
  title: "Le ticket oublié", ages: [20, 80], tags: ["argent", "chance"], ic: "🎟️🍀", rar: "rare",
  t: "En vidant une vieille veste, tu retrouves un ticket de loterie froissé. Tu le vérifies sur un site au hasard, par curiosité. Les chiffres correspondent. La date limite de réclamation est demain midi, et ton train a été annulé.",
  c: [
    C("Courir au guichet à pied", "🏃", [O(0.6, "Tu arrives à la minute près, hors d'haleine. Le gain est confirmé.", { argent: 35000, bonheur: 9, sport: 1, flag: "gagnant_loto" }), O(0.4, "Le guichet ferme devant ton nez. Tu restes à genoux sur le trottoir.", { bonheur: -8, courage: -1 })], { risk: 2 }),
    D("Appeler un ami pour qu'il t'emmène", "🚗", "Il arrive en retard, mais il arrive. Tu lui offres un cadeau énorme.", { argent: 33000, bonheur: 8, bonte: 3, flag: "gagnant_loto" }),
    D("Ne rien faire, c'est sûrement faux", "😴", "Il était vrai. Tu l'apprends trois semaines plus tard par un article.", { bonheur: -10, intel: -1 }),
  ],
});
ev("n_heritage_loufoque", {
  title: "Un legs improbable", ages: [25, 80], tags: ["argent", "famille", "loufoque"], ic: "📜🐊", rar: "rare",
  t: "Un notaire te convoque. Ta grande tante t'a légué sa collection de cinquante-deux perruques, un perroquet qui insulte le notaire, et un coffre-fort dont personne ne connaît le code.",
  c: [
    D("Accepter le legs et ouvrir le coffre", "🔐", "Après une semaine d'efforts, il s'ouvre. Il contient un peu d'argent, une lettre et une recette de gâteau.", { argent: 4000, bonheur: 5, item: "bijou", creatif: 2 }),
    D("Revendre les perruques", "💇", "Un collectionneur en offre un prix absurde. Tu es riche de façon incompréhensible.", { argent: 2500, bonheur: 3, honnete: 1 }),
    D("Adopter le perroquet seulement", "🦜", "Il t'insulte avec tendresse. Un compagnon pour la vie.", { bonheur: 5, sociable: 1, item: "velo" }),
  ],
});
ev("n_assurance_fraude", {
  title: "Le sinistre créatif", ages: [25, 70], tags: ["argent"], ic: "📑🔥", rar: "peu", need: { money: [500, null] },
  t: "Ton canapé est tâché, ton frigo est vieux et ton assurance est généreuse. Un voisin glisse, l'air de rien, qu'un petit « incident domestique » pourrait régler tous tes problèmes de décoration.",
  c: [
    C("Déclarer un sinistre inventé", "🔥", [O(0.6, "L'assureur ne vérifie rien. Tu refais ton salon à neuf avec un sourire de mauvais joueur.", { argent: 3000, honnete: -4, bonheur: 3 }), O(0.4, "L'expert te regarde pendant dix minutes. La fraude est découverte, l'amende tombe.", { argent: -2500, honnete: -4, record: 1, repute: -3 })], { risk: 3 }),
    D("Réparer toi-même, à l'ancienne", "🔧", "Un week-end avec un tournevis et un tutoriel. Le canapé tient presque.", { sport: 1, bonheur: 1, prudent: 1 }),
    D("Refuser et dénoncer le voisin", "👮", "Le voisin ne te salue plus. L'immeuble non plus.", { honnete: 3, repute: -2, bonheur: -2 }),
  ],
});
ev("n_arnaque_amoureuse", {
  title: "Le prince du messenger", ages: [22, 75], tags: ["argent", "amour"], ic: "📱🤴", rar: "peu", need: { single: true },
  t: "Un compte magnifique te contacte. Photos de voyage, citations de poètes, et une vie tragique. Après trois semaines de messages tendres, il ou elle a besoin « d'un petit service de 800 euros » pour une urgence médicale.",
  c: [
    C("Envoyer l'argent par amour", "💌", [O(0.15, "Le compte était réel. L'histoire est belle et se termine par un mariage inattendu.", { argent: -800, bonheur: 10, flag: "amour_internet" }), O(0.85, "Le compte disparaît dans l'heure. Les photos venaient d'une banque d'images.", { argent: -800, bonheur: -7, intel: -1, repute: -1 })], { risk: 3 }),
    D("Demander un appel vidéo", "🎥", "Le prince n'a plus de batterie ni d'excuses. La fraude se dévoile avec grâce.", { intel: 2, bonheur: 2, prudent: 3 }),
    D("Le piéger pour s'amuser", "🪤", "Tu passes dix jours à faire perdre son temps à un escroc. Tu en tires un récit hilarant.", { bonheur: 5, creatif: 2, repute: 2 }),
  ],
});
ev("n_entreprise_famille", {
  title: "La boutique de famille", ages: [28, 65], tags: ["argent", "famille"], ic: "🏪👨‍👩‍👧", rar: "peu", need: { money: [3000, null], job: true },
  t: "Ton oncle te propose de reprendre sa boutique de souvenirs, installée dans une ville sans touristes. Le stock se compose de mille magnets de la tour Eiffel et de trois pulls en laine de lama.",
  c: [
    C("Reprendre la boutique", "🏪", [O(0.35, "Un influenceur filme tes magnets par ironie. La boutique devient un lieu culte.", { argent: 12000, bonheur: 6, repute: 3, creatif: 2 }), O(0.65, "Les ventes sont nulles. Ton oncle se plaint de toi à chaque Noël.", { argent: -3000, bonheur: -4 })], { risk: 2 }),
    D("Refuser avec diplomatie", "🙏", "Ton oncle boude un an, puis offre la boutique à un chien.", { bonheur: 1, honnete: 1 }),
    D("Proposer de liquider le stock en ligne", "💻", "Les magnets partent en trois semaines. L'oncle pleure de joie, le chien aussi.", { argent: 1800, intel: 2, bonheur: 3 }),
  ],
});
ev("n_fisc_controle", {
  title: "Le contrôle fiscal", ages: [25, 75], tags: ["argent"], ic: "🧮😨", rar: "peu", need: { money: [4000, null] },
  t: "Un courrier à l'en-tête sévère t'invite à justifier trois années de comptes. Une facture de 12 euros pour « matériel de bien-être » attire l'attention, car tu n'as jamais pu expliquer ce que c'était.",
  c: [
    D("Tout expliquer avec franchise", "📚", "L'inspecteur sourit. Tout est en ordre, sauf la facture mystère.", { honnete: 3, argent: -300, bonheur: 1 }),
    C("Bluffer avec aplomb", "🃏", [O(0.4, "Ton aplomb déroute l'inspecteur. Il classe l'affaire en soupirant.", { honnete: -2, bonheur: 4 }), O(0.6, "Il vérifie. Il vérifie tout. L'amende est salée.", { argent: -3500, honnete: -2, bonheur: -4 })], { risk: 2 }),
    D("Embaucher un comptable très cher", "👔", "Il sauve ton dossier et mange ton dernier chèque.", { argent: -1200, prudent: 2, bonheur: 1 }),
  ],
});
ev("n_pari_sportif", {
  title: "Le pari de trop", ages: [20, 65], tags: ["argent"], ic: "⚽💸", rar: "peu", need: { money: [800, null], noflag: "sobre_jeu" },
  t: "Un ami jure avoir un tuyau en or sur le match de ce soir. Une équipe de troisième division doit battre le champion, parce que le gardien « a mal dormi ». La cote est de 40 contre 1.",
  c: [
    C("Parier le loyer", "🏠", [O(0.1, "Le gardien a vraiment mal dormi. Tu gagnes une somme folle.", { argent: 16000, bonheur: 9, flag: "pari_gagne" }), O(0.9, "Le gardien est impérial. Tu perds tout, y compris un peu de dignité.", { argent: -1000, dette: 600, bonheur: -7 })], { risk: 3 }),
    D("Parier une petite somme", "🪙", "Cinq euros pour un souvenir. Tu perds, mais le match était beau.", { argent: -5, bonheur: 1 }),
    D("Refuser et regarder le match", "📺", "Le gardien a bien mal dormi. Tu apprends que ton ami a gagné trois mille euros. Aïe.", { bonheur: -3, prudent: 1 }),
  ],
});
ev("n_colocation_dette", {
  title: "Le colocataire fantôme", ages: [20, 45], tags: ["argent", "social"], ic: "🏠👻", rar: "peu", need: { home: "coloc" },
  t: "Ton colocataire a disparu en laissant trois mois de loyer impayés, une plante carnivore et un mot qui dit « je reviens dans une minute ». Cela fait vingt-trois jours. La plante grandit.",
  c: [
    D("Payer sa part pour garder l'appartement", "💶", "Tu tiens le coup, la plante aussi. Elle devient ton meilleur colocataire.", { argent: -1100, bonheur: -1, bonte: 2 }),
    C("Mettre ses affaires à la rue", "📦", [O(0.5, "Il réapparaît à temps, vexé, mais rembourse tout.", { argent: 1100, bonheur: 2 }), O(0.5, "Il revient avec sa mère, qui te fait la leçon pendant deux heures.", { bonheur: -5, repute: -2 })], { risk: 1 }),
    D("Mener l'enquête sur sa disparition", "🔦", "Tu le retrouves dans un festival, en train de jouer du didgeridoo. Il rembourse en cinq ans.", { creatif: 1, bonheur: 3 }),
  ],
});
ev("n_pret_ami", {
  title: "Le prêt entre amis", ages: [20, 70], tags: ["argent", "social"], ic: "🤝💶", rar: "commun", need: { money: [800, null] }, who: { ami: "friend" },
  t: "$ami te demande 1500 euros pour « un truc incroyable qui va tout changer ». Il refuse de dire de quoi il s'agit et jure avoir tout prévu. Il t'a déjà emprunté un chargeur en 2019.",
  c: [
    C("Lui prêter l'argent", "🤲", [O(0.4, "Il te rembourse avec des intérêts et un énorme sourire.", { argent: 300, bonheur: 4, rel: { ami: 12 } }), O(0.6, "Il disparaît avec ton argent. La rancune te colle à la peau.", { argent: -1500, bonheur: -4, rel: { ami: -25 } })], { risk: 2 }),
    D("Refuser poliment", "🙅", "Il boude, puis oublie.", { rel: { ami: -5 }, prudent: 1 }),
    D("Proposer de lui donner 100 euros, sans retour", "🎁", "Un petit cadeau pour ne pas gâcher l'amitié.", { argent: -100, bonte: 2, rel: { ami: 4 } }),
  ],
});

// ============ RÉSEAUX SOCIAUX, RÉPUTATION, CÉLÉBRITÉ ============
ev("n_video_virale", {
  title: "Quarante millions de vues", ages: [15, 60], tags: ["social", "celebrite"], ic: "📹🔥", rar: "peu",
  t: "Un inconnu t'a filmé{|e} en train de glisser sur une peau de banane, de te rattraper sur un cygne en plastique et de finir dans une fontaine. La vidéo a quarante millions de vues. Elle s'appelle « Le grand plongeon ».",
  c: [
    D("Assumer et surfer sur la vague", "🏄", "Tu apparais dans trois émissions et ton nom devient un mème. Les sponsors font la queue.", { repute: 6, argent: 2500, bonheur: 5, flag: "celebre_ridicule", later: { id: "n_celebrite_ridicule", in: [1, 3], p: 0.7 } }),
    D("Demander la suppression de la vidéo", "🗑️", "La plateforme répond en dix mois. La vidéo a depuis été copiée mille fois.", { bonheur: -3, repute: 1, prudent: 1 }),
    C("Tourner une suite", "🎬", [O(0.35, "La suite est plus drôle que l'originale. Tu gagnes un public.", { argent: 6000, repute: 8, bonheur: 6, flag: "celebre_ridicule" }), O(0.65, "La suite est ratée. Tu es « le gars du cygne qui s'accroche ».", { repute: -4, bonheur: -3 })], { risk: 2 }),
  ],
});
ev("n_celebrite_ridicule", {
  chainOnly: true, title: "Le gars du cygne", tags: ["celebrite"], ic: "🦢⭐", need: { flag: "celebre_ridicule" },
  t: "On te reconnaît partout, au supermarché, aux toilettes, au cimetière. Des enfants te demandent de refaire « le plongeon ». Une marque de maillots de bain propose un contrat, et une chaîne de télévision te veut dans une émission de téléréalité.",
  c: [
    D("Signer pour la marque de maillots", "🩱", "Tu deviens l'égérie d'une marque improbable. Les affiches te suivent dans toute la ville.", { argent: 8000, repute: 4, bonheur: 3 }),
    C("Participer à la téléréalité", "📺", [O(0.45, "Tu fais un excellent candidat. Tu repars avec un public et une réputation.", { argent: 12000, repute: 10, bonheur: 6 }), O(0.55, "Tu es éliminé{|e} en premier, à cause d'un malentendu avec un canapé.", { repute: -4, bonheur: -4 })], { risk: 2 }),
    D("Disparaître et mener une vie discrète", "🕵️", "L'oubli arrive, doucement. Quelques années plus tard, personne ne te reconnaît.", { bonheur: 3, repute: -2, unflag: "celebre_ridicule" }),
  ],
});
ev("n_vieux_tweet", {
  title: "Le retour du vieux message", ages: [22, 60], tags: ["social"], ic: "🐦🕰️", rar: "peu", need: { job: true },
  t: "Un journaliste a déterré un message que tu avais publié à 17 ans. Il est maladroit, grossier et franchement idiot. Il passe en boucle sous le titre « Notre nouveau responsable pensait ça en 2012 ».",
  c: [
    D("Présenter des excuses publiques", "🙏", "Tu t'excuses sobrement. L'orage passe, il te reste quelques tâches de honte.", { honnete: 3, repute: -2, bonheur: -2 }),
    C("Contre-attaquer avec humour", "😏", [O(0.45, "L'humour désarme tout le monde. Le message devient un souvenir sympathique.", { repute: 4, charme: 2, bonheur: 4 }), O(0.55, "L'humour est mal reçu. Tu es suspendu{|e} par ton employeur.", { repute: -6, bonheur: -5, fire: true })], { risk: 2 }),
    D("Supprimer ton compte et te taire", "🫥", "Silence radio. Les gens finissent par oublier, ou presque.", { repute: -1, bonheur: -1 }),
  ],
});
ev("n_scandale_photo", {
  title: "La photo qui fuit", ages: [18, 60], tags: ["social", "mature"], ic: "📸😳", rar: "rare",
  t: "Une photo gênante de toi, prise un soir de fête, circule dans un groupe de messagerie qui compte déjà trois mille membres. On te voit en pyjama de licorne, un verre à chaque main et une couronne de pizza sur la tête.",
  c: [
    D("Assumer et la republier toi-même", "🦄", "Tu reprends le contrôle du récit. La photo devient un symbole de joie de vivre.", { repute: 2, bonheur: 4, courage: 3 }),
    D("Menacer de poursuites", "⚖️", "Les groupes la suppriment. Mais elle reste dans quelques mémoires.", { argent: -300, bonheur: -1 }),
    C("Payer pour étouffer l'affaire", "💰", [O(0.5, "Le fuyard disparaît avec l'argent et la photo reste cachée.", { argent: -1500, bonheur: 1 }), O(0.5, "Il garde l'argent et republie la photo avec fierté.", { argent: -1500, repute: -4, bonheur: -5 })], { risk: 2 }),
  ],
});
ev("n_influenceur", {
  title: "Devenir influenceur sans le vouloir", ages: [16, 55], tags: ["social", "celebrite"], ic: "🤳💄", rar: "peu",
  t: "Tu as posté, par ennui, une vidéo où tu goûtes des yaourts périmés avec un air solennel. Cent mille abonnés plus tard, ils te demandent des « avis de gastronomie négative ».",
  c: [
    D("Monétiser la chaîne", "💶", "Des marques de yaourts te sponsorisent. Le goût du périmé est devenu un art.", { argent: 5000, repute: 4, bonheur: 4, creatif: 3 }),
    C("Tenter un produit dérivé", "📦", [O(0.4, "Ton calendrier « mois du périmé » se vend comme des petits pains.", { argent: 9000, repute: 3, bonheur: 5 }), O(0.6, "Le stock reste dans ton salon. Ton chat s'en sert comme pyramide.", { argent: -2500, bonheur: -3 })], { risk: 2 }),
    D("Tout arrêter pour garder ta tranquillité", "🛑", "Tu retrouves ta vie. Tes abonnés pleurent dans les commentaires.", { bonheur: 2, repute: -1 }),
  ],
});
ev("n_polemique_gratuite", {
  title: "La polémique du siècle", ages: [18, 65], tags: ["social"], ic: "🔥🗣️", rar: "peu",
  t: "Tu as exprimé une opinion sans importance sur la façon de tartiner le beurre. Quarante-huit heures plus tard, des experts s'insultent sur un plateau télévisé, des politiques prennent position, et un parti vient de se fonder sur ton post.",
  c: [
    D("Se taire et regarder brûler", "🍿", "Tu savoures le désastre depuis ton canapé. L'affaire s'éteint toute seule.", { bonheur: 3, repute: -1 }),
    C("Participer au débat télévisé", "🎙️", [O(0.4, "Tu brilles par ton absurdité tranquille. L'émission te réinvite chaque mois.", { repute: 6, argent: 2000, bonheur: 5 }), O(0.6, "Tu t'effondres en direct, d'un rire nerveux qui devient mythique.", { repute: -3, bonheur: -3, flag: "rire_nerveux" })], { risk: 2 }),
    D("Présenter des excuses solennelles pour le beurre", "🧈", "On t'applaudit pour ta dignité. Le beurre, lui, ne s'est jamais remis.", { repute: 2, bonheur: 1, honnete: 1 }),
  ],
});
ev("n_faux_compte", {
  title: "Le faux compte", ages: [16, 50], tags: ["social"], who: { fam: "sibling" }, ic: "🎭📱", rar: "peu",
  t: "Quelqu'un a créé un faux compte à ton nom. Il y publie des citations de philosophes accompagnées de photos de ton visage retouchées. Le compte compte déjà plus d'abonnés que le tien.",
  c: [
    D("Signaler et attendre", "🚨", "La plateforme répond poliment qu'il s'agit d'un « hommage ». Tu soupires.", { bonheur: -1, prudent: 1 }),
    C("Contacter le faussaire", "💬", [O(0.5, "C'est ton neveu. Vous éclatez de rire et il arrête.", { bonheur: 3, rel: { fam: 5 } }), O(0.5, "C'est un inconnu qui te remercie de ton talent. Il refuse de supprimer.", { bonheur: -2, repute: -1 })], { risk: 1 }),
    D("Reprendre la main et l'utiliser toi-même", "😎", "Tu deviens l'imposteur de toi-même. Les abonnés n'y voient que du feu.", { creatif: 2, repute: 3, honnete: -1, bonheur: 2 }),
  ],
});
ev("n_star_rencontre_ridicule", {
  title: "Une star dans l'ascenseur", ages: [18, 80], tags: ["celebrite"], ic: "🛗🌟", rar: "rare", who: { vedette: "star" },
  t: "Tu te retrouves coincé{|e} dans un ascenseur avec $vedette. Il ne reste que vous deux, un ventilateur qui fait un bruit inquiétant et la vague impression d'être dans un film. Vous avez quarante minutes.",
  c: [
    D("Lui avouer ton admiration sans retenue", "😍", "Elle ou il rit, vous partagez un biscuit. Un souvenir qui te rendra heureux{|e} pour toujours.", { bonheur: 7, charme: 1, repute: 2 }),
    C("Lui proposer un duo improvisé", "🎤", [O(0.3, "Le duo est un triomphe. Il est repris dans une émission.", { repute: 7, bonheur: 8, creatif: 3 }), O(0.7, "Le duo est une catastrophe. Elle ou il se bouche les oreilles.", { repute: -1, bonheur: -3, courage: 2 })], { risk: 2 }),
    D("Faire semblant de ne pas la ou le reconnaître", "🥸", "Ton air indifférent la ou le vexe et la ou le séduit en même temps. Une histoire hilarante.", { charme: 2, bonheur: 3, honnete: -1 }),
  ],
});
ev("n_reseau_amoureux", {
  title: "Le profil trop beau", ages: [18, 60], tags: ["amour", "social"], ic: "💘📲", rar: "commun", need: { single: true },
  t: "Tu as passé trois heures à choisir ta photo de profil. Elle montre un lac, un chien emprunté et un livre de philosophie que tu n'as jamais ouvert. Une première touche apparaît, très enthousiaste, accompagnée de six points d'exclamation.",
  c: [
    C("Accepter le rendez-vous", "☕", [O(0.4, "Une vraie rencontre, des fous rires, un chien qui vous adopte.", { bonheur: 6, charme: 1, rel: { crush: 15 } }), O(0.35, "La personne n'a rien à voir avec la photo. Vous restez pour le gâteau.", { bonheur: 0 }), O(0.25, "Elle ou il apporte un ami « pour être en sécurité ». La soirée devient surréaliste.", { bonheur: 2, creatif: 1 })], { risk: 1 }),
    D("Avouer que le livre n'est pas à toi", "📖", "L'honnêteté a un certain succès, la personne rit beaucoup.", { honnete: 3, bonheur: 3, charme: 1 }),
    D("Supprimer l'application pour la dixième fois", "📵", "Tu reviens dans trois jours, comme toujours.", { bonheur: 1 }),
  ],
});
ev("n_avis_en_ligne", {
  title: "La vengeance en cinq étoiles", ages: [18, 70], tags: ["social", "travail"], ic: "⭐😤", rar: "commun",
  t: "Le restaurateur t'a servi un plat froid et une addition chaude. Tu rédiges un avis d'une cruauté lyrique, sur trois paragraphes, avec une métaphore sur le sel. Il devient l'avis le plus lu de la ville.",
  c: [
    D("Laisser l'avis en ligne", "🖋️", "Tu reçois des likes et un message du restaurateur en majuscules.", { repute: 2, bonheur: 3, bonte: -2 }),
    C("Supprimer l'avis par charité", "🕊️", [O(0.5, "Le restaurateur t'offre un dîner en remerciement, un vrai.", { bonheur: 4, bonte: 3, argent: 60 }), O(0.5, "Il l'ignore, il avait déjà fermé.", { bonheur: 1 })], { risk: 1 }),
    D("Y retourner pour un dîner de réconciliation", "🍽️", "Vous parlez de sel pendant quarante minutes. Une amitié étrange est née.", { sociable: 2, bonheur: 3 }),
  ],
});

// ============ JUSTICE, ARRESTATIONS, PROCÈS ============
ev("n_arrestation_absurde", {
  title: "Arrêté{|e} pour une raison idiote", ages: [18, 70], tags: ["justice"], ic: "🚔🤡", rar: "peu",
  t: "Trois policiers te placent poliment les menottes. Tu es soupçonné{|e} d'avoir volé une statue de nain de jardin dans un lotissement, parce qu'une caméra de surveillance t'a filmé{|e} en train de déposer ton propre nain de jardin un peu plus loin.",
  c: [
    D("Coopérer et expliquer", "🗣️", "Tu passes six heures au commissariat à écrire ton innocence. Le nain est retrouvé chez un collectionneur.", { honnete: 2, bonheur: -2, repute: -1 }),
    C("Exiger un avocat tout de suite", "👔", [O(0.6, "L'avocat sort une preuve de génie. Tu es relâché{|e} avec les excuses de la police.", { argent: -500, repute: 1, bonheur: 2 }), O(0.4, "L'avocat arrive en retard et en pantoufles. Tu restes en garde à vue toute la nuit.", { argent: -500, bonheur: -4 })], { risk: 1 }),
    D("Transformer l'affaire en histoire drôle", "😆", "Les agents te prennent en photo avec le nain. L'anecdote devient légendaire.", { bonheur: 3, repute: 3, charme: 1, later: { id: "n_proces_celebre", in: [1, 3], p: 0.25 } }),
  ],
});
ev("n_proces_celebre", {
  chainOnly: true, title: "L'affaire du nain de jardin", tags: ["justice", "celebrite"], ic: "⚖️🧙", need: { noprison: true },
  t: "Une association de défense des nains de jardin porte plainte pour « atteinte à l'image du nain ». Le procès attire les caméras, les chroniqueurs et un avocat en cape. Chacun veut sa photo avec toi.",
  c: [
    D("Plaider avec émotion", "🎭", "Ton discours émeut la salle. Tu es acquitté{|e} sous les applaudissements.", { repute: 7, bonheur: 5, charme: 2 }),
    C("Négocier un arrangement", "🤝", [O(0.55, "Tu paies une petite somme et on t'oublie.", { argent: -900, bonheur: 1 }), O(0.45, "Le procureur refuse. L'affaire devient un feuilleton.", { argent: -2500, repute: 3, bonheur: -3 })], { risk: 1 }),
    D("Écrire un livre sur l'affaire", "📚", "« Le Nain et moi » se vend étonnamment bien.", { argent: 4000, creatif: 3, repute: 5, bonheur: 4 }),
  ],
});
ev("n_prison_absurde", {
  title: "Cellule 12, vue sur l'ennui", ages: [20, 65], tags: ["justice", "mature"], ic: "🔒🙃", rar: "rare", need: { record: [1, null], noprison: true },
  t: "Tu es condamné{|e} à quelques mois pour une série de bêtises qui se sont accumulées comme des assiettes sales. Ton codétenu est un ancien chef pâtissier qui juge ta cuisine « décevante » avant même de l'avoir goûtée.",
  c: [
    D("Suivre une formation en prison", "🎓", "Tu en sors avec un diplôme et un goût prononcé pour les religieuses au chocolat.", { prison: 1, intel: 3, bonheur: -2, flag: "formation_prison" }),
    C("Organiser un tournoi de cartes", "🃏", [O(0.6, "Le tournoi remporte un énorme succès. Tu es le roi des cartes.", { prison: 1, repute: 2, bonheur: 2, sociable: 3 }), O(0.4, "Le tournoi tourne mal. Un gardien confisque tout.", { prison: 1, bonheur: -4, sante: -2 })], { risk: 2 }),
    D("Écrire des lettres à toute ta famille", "✉️", "Tu redécouvres le plaisir de la correspondance. La peine paraît plus courte.", { prison: 1, bonheur: 1, bonte: 2 }),
  ],
});
ev("n_temoin_scene", {
  title: "Témoin malgré toi", ages: [20, 80], tags: ["justice"], ic: "👀🚨", rar: "peu",
  t: "Tu as vu, depuis ton balcon, un homme en costume de canard voler un vélo. Deux jours plus tard, la police sonne à ta porte. Elle te demande de décrire le canard « avec précision ».",
  c: [
    D("Faire un portrait-robot détaillé", "✏️", "Ton dessin est étrangement fidèle. Le canard est arrêté dans la semaine.", { honnete: 3, intel: 1, repute: 2, bonheur: 2 }),
    C("Mentir par peur des représailles", "🤐", [O(0.5, "Personne ne remarque rien. Le canard court toujours.", { honnete: -3, bonheur: -1 }), O(0.5, "Le canard était le fils du maire. Tu es cité{|e} à comparaître.", { honnete: -3, bonheur: -4, repute: -2 })], { risk: 2 }),
    D("Proposer ton aide comme détective amateur", "🕵️", "Tu passes deux semaines à suivre des canards. Une passion naît.", { creatif: 2, bonheur: 4 }),
  ],
});
ev("n_amende_delirante", {
  title: "La contravention de la honte", ages: [18, 80], tags: ["justice"], ic: "🧾🚫", rar: "commun", need: { asset: "voiture" },
  t: "Une contravention de 135 euros t'attend sur ton pare-brise pour avoir stationné « en situation de défi à l'ordre public ». L'agent a écrit, en commentaire, « c'est la troisième fois, monsieur, madame, vous l'avez fait exprès ».",
  c: [
    D("Payer sans rien dire", "💶", "Cher, mais net. Tu gardes ta dignité.", { argent: -135, bonheur: -1 }),
    C("Contester avec une lettre de trois pages", "✍️", [O(0.35, "Le juge, ému par ton style, annule l'amende.", { honnete: 1, intel: 2, bonheur: 3 }), O(0.65, "Le juge ajoute des frais de dossier à ton insolence.", { argent: -220, bonheur: -2 })], { risk: 1 }),
    D("Déplacer ta voiture en pleine nuit, discrètement", "🌙", "Un chat te regarde faire. Le voisin aussi.", { honnete: -1, bonheur: 1 }),
  ],
});
ev("n_proces_famille", {
  title: "Le procès du dimanche", ages: [30, 80], tags: ["justice", "famille"], who: { fam: "sibling" }, ic: "⚖️🍗", rar: "rare", need: { money: [2000, null] },
  t: "Ton frère te traîne en justice à propos d'une casserole. Une casserole en fonte, héritée de grand-mère, qu'il juge « lui revenir de droit moral ». Les avocats facturent plus cher que la casserole ne vaut.",
  c: [
    D("Donner la casserole pour avoir la paix", "🍳", "Il la prend, ému. La famille respire.", { bonheur: 2, bonte: 3, rel: { fam: 8 } }),
    C("Se battre jusqu'au bout", "⚔️", [O(0.4, "Tu gagnes. La casserole trône sur ton étagère comme un trophée.", { argent: -2500, honnete: 1, bonheur: 2, rel: { fam: -15 } }), O(0.6, "Tu perds la casserole et ton argent.", { argent: -4000, bonheur: -5, rel: { fam: -15 } })], { risk: 2 }),
    D("Proposer de la partager, une semaine sur deux", "🔁", "Un arrangement ridicule mais fonctionnel. La casserole voyage dans un sac isotherme.", { bonheur: 3, creatif: 2 }),
  ],
});
ev("n_cambriolage", {
  title: "Le cambrioleur poli", ages: [22, 80], tags: ["justice"], ic: "🥷📦", rar: "peu", need: { money: [800, null] },
  t: "Tu rentres chez toi. La porte est ouverte, le salon est rangé avec soin et un mot est posé sur la table. « Désolé pour le dérangement. Votre télévision était trop belle. J'ai nourri votre chat. »",
  c: [
    D("Prévenir la police", "👮", "Tu déposes plainte. L'assurance rembourse en six mois.", { argent: -600, honnete: 2, bonheur: -2 }),
    D("Poser une pancarte pour le prochain visiteur", "🪧", "« Prière d'essuyer vos pieds. » Le cambrioleur ne revient pas.", { creatif: 2, bonheur: 2 }),
    C("Mener ta propre enquête", "🔎", [O(0.3, "Tu retrouves le cambrioleur, qui s'excuse et rend la télévision.", { bonheur: 5, intel: 2 }), O(0.7, "Tu t'enfonces dans des pistes absurdes. Ton chat est le seul suspect de ton propre salon.", { bonheur: -2, intel: 1 })], { risk: 1 }),
  ],
});
ev("n_condamnation_celebrite", {
  title: "Du banc des accusés aux plateaux télé", ages: [20, 60], tags: ["justice", "celebrite"], ic: "🎥⛓️", rar: "mythique", need: { record: [1, null] },
  t: "Ton passé judiciaire intrigue une production de documentaires. Ils veulent raconter ta vie, avec une musique dramatique et un titre en trois mots. Le premier titre proposé est « Le Malentendu ».",
  c: [
    D("Accepter le documentaire", "🎬", "La série cartonne. Tu deviens une célébrité de bar et de salon.", { argent: 15000, repute: 8, bonheur: 5, flag: "star_du_documentaire" }),
    C("Exiger un droit de regard", "📝", [O(0.5, "Ils acceptent. Le résultat est flatteur, presque trop.", { argent: 8000, repute: 5, bonheur: 4 }), O(0.5, "Ils refusent et sortent le film sans toi.", { repute: -3, bonheur: -3 })], { risk: 1 }),
    D("Refuser et garder ton passé secret", "🤫", "Tu restes dans l'ombre, tranquille et ordinaire.", { bonheur: 2, prudent: 2 }),
  ],
});
