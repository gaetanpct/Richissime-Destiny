// Jeunes adultes (18 à 29 ans)
const { ev, flash, O, C, D } = require("../kit");

ev("majorite_fete", {
  ages: [18, 18], must: 5, ic: "🎂🍾", tags: ["jalon"], w: 5,
  t: "Tu as 18 ans ! Les parents sortent le champagne tiède, la famille se presse autour d'un gâteau en forme de tracteur. Te voilà libre, majeur{|e} et vacciné{|e} contre la plupart des illusions.",
  c: [
    D("Faire une fête mémorable", "🎉", "La nuit est longue, les photos sont floues. Tout le monde s'en souviendra, sauf toi.", { bonheur: 6, sociable: 3, sante: -1, argent: -150 }),
    D("Passer la soirée en famille", "🍰", "Tendre et un peu long. Ta grand-mère pleure à chaque toast.", { bonte: 3, bonheur: 3 }),
    D("Placer l'argent reçu", "🐖", "Premier réflexe de futur riche. Les invités sont intrigués.", { prudent: 3, ambition: 2, argent: 200 }),
    C("Partir voir le monde avec un sac à dos", "🎒", [O(0.6, "Un mois de routes, de rencontres, de rires. Tu reviens changé{|e}.", { courage: 4, bonheur: 6, creatif: 2, argent: -600 }), O(0.4, "On te vole ton sac dès la première gare. Tu rentres fauché{|e} mais plus débrouillard{|e}.", { courage: 3, bonheur: -1, argent: -400 })], { cost: 300 }),
  ],
});

ev("logement_premier", {
  ages: [18, 26], tags: ["logement"], ic: "🔑🏠", w: 6, need: { home: "parents", noflag: "a_quitte_famille" },
  t: "À force de dormir sous les posters de ton adolescence, l'envie de voler de tes propres ailes te prend. Ta chambre te semble désormais minuscule.",
  c: [
    C("Prendre une colocation", "🏘️", [O(0.7, "Trois colocs, un frigo, de grosses disputes pour la vaisselle. Mais quelle ambiance !", { sociable: 4, bonheur: 4, argent: -300, home: "coloc", flag: "a_quitte_famille" }), O(0.3, "Un coloc ne paie jamais sa part, une autre fait du didgeridoo à 6 h. Ça reste instructif.", { sociable: 2, bonheur: -1, argent: -500, home: "coloc", flag: "a_quitte_famille" })]),
    C("Louer un petit studio", "🛋️", [O(1, "Dix-neuf mètres carrés rien qu'à toi. Le loyer pique, la liberté aussi.", { prudent: 2, bonheur: 3, argent: -600, home: "location", flag: "a_quitte_famille" })], { cost: 600 }),
    D("Rester chez les parents encore un peu", "🛌", "Linge lavé, frigo plein, zéro loyer. Tes parents soupirent sans trop de conviction.", { prudent: 3, argent: 400, bonheur: -1 }),
  ],
});

ev("premiere_voiture", {
  ages: [18, 30], tags: ["argent"], ic: "🚗🔧", w: 5, need: { noasset: "voiture" },
  t: "Le permis en poche, une annonce attire ton œil. Une voiture, ce serait la liberté. Ou une succession de pannes. Les deux, probablement.",
  c: [
    C("Acheter une vieille guimbarde", "🚙", [O(0.6, "Elle démarre ! Pour l'instant. Elle sent le chien mouillé, mais elle roule.", { item: "vieille_voiture", bonheur: 4, argent: -3500 }), O(0.4, "Le moteur lâche au bout de trois semaines. Tu l'as payée plus cher que sa ferraille.", { item: "vieille_voiture", bonheur: -3, argent: -4500 })], { cost: 3500 }),
    D("Prendre un vélo et les transports", "🚲", "Écolo, économe, musclé{|e}. Les pigeons te regardent passer avec respect.", { sport: 3, prudent: 2, item: "velo", argent: -900 }, { cost: 900 }),
    C("Acheter une voiture neuve à crédit", "🚗", [O(1, "L'odeur de neuf ! Et la mensualité de crédit qui t'attend...", { item: "voiture", dette: 12000, argent: -4000, bonheur: 5, charme: 2 })], { cost: 4000 }),
    D("Pas de voiture, la vie est belle à pied", "🚶", "Tu marches, tu observes, tu économises.", { sport: 2, argent: 200 }),
  ],
});

ev("job_etudiant_galere", {
  ages: [18, 25], tags: ["travail"], ic: "🍕🛵", w: 6, need: { studying: true }, roll: { somme: [1200, 3600, 200] },
  t: "Entre les cours et le loyer, tu cherches un job d'appoint. Une pizzeria, un bar, la livraison de repas... tu pourrais gagner $somme sur l'année, au prix de quelques nuits blanches.",
  c: [
    D("Livreur à vélo", "🚴", "Pluie, côtes, numéros d'immeubles absurdes. Tu as des mollets de légende.", { argent: (p, x) => x.vals.somme, sport: 4, sante: -1, bonheur: -1 }),
    D("Serveur dans un bar", "🍺", "Tu apprends à porter dix verres à la fois et à ignorer les ivrognes. Les pourboires sont bons.", { argent: (p, x) => x.vals.somme + 200, sociable: 3, charme: 2, notes: -3 }),
    D("Garder les enfants des voisins", "🧸", "Moins bien payé, mais tu travailles en pyjama.", { argent: (p, x) => x.vals.somme / 2, bonte: 2, notes: 1 }),
    D("Se concentrer sur les études", "📚", "Tu serres les dents, tu manges des pâtes. Les notes s'envolent.", { notes: 4, intel: 2, argent: -300, bonheur: -1 }),
  ],
});

ev("soiree_etudiante_folle", {
  ages: [18, 24], tags: ["loufoque", "amour"], ic: "🎉🥳", w: 6, need: { studying: true }, who: { ami: "friend" },
  t: "La fameuse soirée étudiante de l'année, thème « déguisé en légume », cocktail mystère servi dans un seau, un DJ qui joue exclusivement des génériques de dessins animés.",
  c: [
    D("Danser jusqu'à l'aube", "💃", "Tu rentres à 6 h avec un chapeau de courgette et une amitié nouvelle.", { bonheur: 6, sociable: 3, sante: -2, rel: { ami: 8 } }),
    C("Participer au concours de boissons", "🥤", [O(0.4, "Tu gagnes un énorme trophée en plastique. Pas la dignité.", { repute: 4, bonheur: 4, sante: -4 }), O(0.6, "Tu ne te souviens plus de rien. Ton téléphone contient des vidéos compromettantes.", { repute: -4, sante: -4, bonheur: 1 })], { risk: 1 }),
    D("Réviser ton partiel du lendemain", "🕯️", "Un ami te traite de rabat-joie. Le partiel, lui, te dit merci.", { notes: 3, prudent: 3, bonheur: -1 }),
    C("Draguer sur la piste", "😏", [O(0.4, "Un numéro de téléphone ! Griffonné sur un ticket de métro.", { charme: 3, bonheur: 4, flag: "rencontre_soiree" }), O(0.6, "Tu te prends un râteau en public. Les légumes autour compatissent.", { charme: -1, bonheur: -2, courage: 1 })], { risk: 1 }),
  ],
});

ev("coloc_chaos", {
  ages: [19, 28], tags: ["logement"], ic: "🍝🧦", w: 5, need: { home: "coloc" }, who: { ami: "friend" },
  t: "Dans l'appartement, la guerre froide dure depuis un mois, la vaisselle sale forme une tour penchée, quelqu'un mange tes yaourts, et un mot anonyme est apparu sur le frigo.",
  c: [
    D("Organiser une réunion de coloc", "🗣️", "Tableau des tâches, règles écrites. Ça tient deux semaines, c'est déjà beau.", { sociable: 2, prudent: 2, bonheur: 2 }),
    C("Piéger le voleur de yaourts", "🕵️", [O(0.7, "C'est $ami ! Il avoue en rougissant et te rembourse en crêpes.", { creatif: 3, rel: { ami: 6 }, bonheur: 3 }), O(0.3, "Tu piégeais le mauvais coloc. Tu t'excuses pendant des jours.", { bonte: -1, rel: { ami: -6 }, bonheur: -2 })]),
    D("Déménager seul{|e}", "📦", "Un loyer plus lourd mais un frigo rien qu'à toi.", { argent: -700, bonheur: 2, home: "location" }, { cost: 700 }),
  ],
});

ev("stage_decisif", {
  ages: [19, 25], tags: ["travail"], ic: "👔📎", w: 6, need: { studying: true, edu: 2 },
  t: "Ton stage de fin d'études est arrivé. Café, photocopies, grandes ambitions... Une chef te dit que « si tu t'accroches, il y aura peut-être une place ».",
  c: [
    C("Te donner à fond", "🔥", [O(0.5, "Ton travail est remarqué par la direction. On te propose un poste à la fin.", { ambition: 3, intel: 1, repute: 3, bonheur: 3, jobHunt: true }), O(0.5, "Tu t'épuises, mais ça passe inaperçu. Une expérience de plus.", { ambition: 2, sante: -3, intel: 2 })]),
    D("Faire le minimum", "😴", "Tu coches les cases. Rien de honteux, rien de grandiose.", { bonheur: 2, ambition: -1 }),
    C("Proposer une idée folle au patron", "💡", [O(0.3, "Il adore ! Ton idée devient un projet pilote, et tu gagnes une prime.", { creatif: 4, repute: 4, argent: 1200, bonheur: 5 }), O(0.7, "Il rit poliment. Tu passes pour un original.", { creatif: 2, courage: 2, repute: -1 })], { risk: 1 }),
  ],
});

ev("chomage_premier", {
  ages: [20, 29], tags: ["travail"], ic: "📭😟", w: 5, need: { nojob: true, retired: false, nostudy: true }, once: false, cool: 4,
  t: "Les mois passent, les candidatures aussi, mais personne ne répond. Ton CV commence à se faner dans les boîtes mails de la terre entière.",
  c: [
    D("Postuler partout, tout le temps", "📮", "À force d'obstination, une porte s'entrouvre.", { ambition: 2, bonheur: -2, jobHunt: true }),
    C("Se former en ligne", "💻", [O(0.6, "Une nouvelle compétence, un nouveau regard des recruteurs.", { intel: 3, creatif: 2, bonheur: 1, jobHunt: true }), O(0.4, "Tu apprends beaucoup mais on te dit « trop de formations, pas assez d'expérience ».", { intel: 3, bonheur: -2 })]),
    D("Faire des petits boulots", "🧹", "Un peu de ménage, un peu de livraison. Pas glorieux mais c'est du pain.", { argent: 1500, sante: -1, bonheur: -1, jobHunt: true }),
    D("Se lancer en indépendant", "🚀", "Tu crées ton statut en une après-midi, tu te retrouves avec une carte de visite fière et un client.", { ambition: 3, courage: 2, argent: 400, job: "libre:0" }),
  ],
});

ev("coup_de_foudre_soiree", {
  ages: [19, 32], tags: ["amour"], ic: "💘✨", w: 6, need: { single: true }, who: { crush: { kind: "crush", fresh: true, age: 24 } },
  t: "Au détour d'un café, d'une soirée ou d'un rayon de supermarché, tu croises $crush. Un sourire, une conversation, et le monde autour s'efface.",
  c: [
    C("Demander son numéro", "📱", [O(0.55, "Il suffit d'oser ! Vous vous revoyez, puis encore, puis tout le temps.", { courage: 3, bonheur: 7, rel: { crush: 20 }, becomes: { crush: "partner" } }), O(0.45, "Le numéro tombe sur une pizzeria. Tu n'oseras plus passer devant.", { bonheur: -2, courage: 1 })], { risk: 1 }),
    D("Lui offrir un verre", "🍷", "Une conversation légère. Vous vous quittez avec un « à bientôt ».", { charme: 2, bonheur: 3, rel: { crush: 8 } }),
    D("Rester timide dans ton coin", "🙈", "Tu l'admires de loin, comme un vieux portrait.", { courage: -1, prudent: 2, bonheur: -1 }),
  ],
});

ev("licenciement_surprise", {
  ages: [22, 58], tags: ["travail"], ic: "📦😱", w: 3, need: { job: { illicit: false } }, roll: { prime: [3000, 12000, 500] },
  t: "Ton chef te convoque, la société « se réorganise ». Ton poste est supprimé, avec une indemnité de $prime et un carton pour tes affaires. Ton plant de cactus te regarde, inconsolable.",
  c: [
    D("Accepter l'indemnité et rebondir", "💶", "Le chagrin passe, le chèque reste.", { fire: true, argent: (p, x) => x.vals.prime, bonheur: -3, jobHunt: true }),
    C("Contester devant les prud'hommes", "⚖️", [O(0.45, "La justice te donne raison ! Plus d'argent, et une petite revanche.", { fire: true, argent: (p, x) => x.vals.prime * 2, honnete: 2, repute: 2, bonheur: 2, jobHunt: true }), O(0.55, "Une procédure interminable. Tu gagnes peu, tu perds beaucoup de temps.", { fire: true, argent: (p, x) => x.vals.prime / 2, bonheur: -4 })], { risk: 1 }),
    D("En profiter pour tout changer", "🌅", "Plus de patron, plus de réveil, plus de cactus à emporter.", { fire: true, argent: (p, x) => x.vals.prime, courage: 3, creatif: 2, bonheur: 2, jobHunt: true }),
  ],
});

ev("heritage_tante", {
  ages: [20, 70], tags: ["argent"], ic: "💌💰", w: 3, roll: { somme: [4000, 40000, 1000], tante: ["Odette", "Gisèle", "Marguerite", "Hortense", "Paulette"] },
  t: "Un notaire t'appelle, ta lointaine tante $tante est décédée et t'a désigné{|e} légataire. Il y a $somme, et un perroquet insolent qui connaît ton prénom.",
  c: [
    D("Encaisser et placer", "🏦", "Tu signes les papiers, tu fais fructifier l'argent. Le perroquet te siffle « bravo ».", { argent: (p, x) => x.vals.somme, prudent: 3, ambition: 2 }),
    D("Tout dépenser en voyage", "✈️", "Tu fais le tour des îles. Le perroquet adore la plage.", { argent: (p, x) => x.vals.somme * 0.2, bonheur: 8, courage: 2, creatif: 2 }),
    C("Contester la part de la famille", "🧾", [O(0.5, "Les cousins s'arrangent avec toi. Plus d'argent, moins d'amitié.", { argent: (p, x) => x.vals.somme * 1.6, bonte: -3, honnete: -2 }), O(0.5, "Un cousin t'attaque en justice. L'affaire traîne et coûte cher.", { argent: (p, x) => x.vals.somme * 0.5, bonheur: -4, repute: -2 })], { risk: 1 }),
  ],
});

ev("coup_de_fil_banque", {
  ages: [21, 60], tags: ["argent"], ic: "🏦☎️", w: 4, need: { money: [3000, null] },
  t: "Un conseiller bancaire plein d'enthousiasme t'appelle, « J'ai un produit pour vous. Extraordinaire. Presque trop beau. »",
  c: [
    C("Écouter et investir", "📊", [O(0.55, "Les chiffres suivent. Tu gagnes un joli petit pactole.", { argent: 1800, ambition: 2 }), O(0.45, "Le produit s'effondre. Tu relis le contrat avec amertume.", { argent: -2200, prudent: 2, bonheur: -3 })], { cost: 2000, risk: 2 }),
    D("Raccrocher poliment", "📞", "Tu sens que c'est un piège à loups.", { prudent: 3, honnete: 1 }),
    D("Négocier un meilleur taux sur tes frais", "🤝", "Le conseiller n'avait pas prévu cela. Tu gagnes un petit geste commercial.", { argent: 150, charme: 1, ambition: 1 }),
  ],
});

ev("voyage_aventure", {
  ages: [20, 55], tags: ["voyage"], ic: "🌍🧳", w: 6, roll: { pays: "pays" }, need: { money: [800, null] },
  t: "Une envie d'ailleurs t'attrape, $pays t'appelle. Billets, valise, et un guide de voyage rempli de photos trop belles pour être vraies.",
  c: [
    C("Partir en sac à dos", "🎒", [O(0.7, "Tu t'émerveilles chaque jour. La vie ressemble à une carte postale.", { bonheur: 7, courage: 3, creatif: 2, argent: -900 }), O(0.3, "Un week-end de gastro, un bus raté, une rencontre fabuleuse. Tu reviens pâle et heureux{|se}.", { bonheur: 4, sante: -3, courage: 2, argent: -700 })], { cost: 800 }),
    D("Séjour tout compris à l'hôtel", "🏖️", "Piscine, cocktails, bracelet de couleur. Tu rentres bronzé{|e}.", { bonheur: 5, sante: 2, argent: -1800 }, { cost: 1800 }),
    D("Rester et économiser", "🏠", "Pas d'aventure, mais un compte en banque rassurant.", { prudent: 3, argent: 300 }),
  ],
});

ev("rencontre_mentor", {
  ages: [20, 40], tags: ["travail"], ic: "🧙‍♂️📖", w: 4, need: { job: true }, who: { mentor: "mentor" },
  t: "Un aîné, $mentor, te prend sous son aile. Il t'invite à déjeuner, te raconte ses erreurs, et te glisse que « le talent ne suffit pas, il faut aussi savoir se montrer ».",
  c: [
    D("Suivre ses conseils à la lettre", "🧭", "Ton CV, tes relations, ton aplomb, tout progresse.", { ambition: 3, intel: 1, repute: 2, exp: 1, rel: { mentor: 10 }, perf: 8 }),
    C("Prendre ses conseils, puis le doubler", "🥷", [O(0.5, "Tu grimpes plus vite que lui. Il te félicite avec un sourire crispé.", { ambition: 4, honnete: -2, perf: 12, rel: { mentor: -15 }, exp: 1 }), O(0.5, "Il l'apprend et te ferme son carnet d'adresses.", { honnete: -2, perf: -5, repute: -3, rel: { mentor: -25 } })], { risk: 1 }),
    D("Remercier et suivre ta propre route", "🚶", "Chacun son chemin, on garde le contact.", { courage: 2, prudent: 1 }),
  ],
});

ev("creation_boite_idee", {
  ages: [21, 45], tags: ["argent", "travail"], ic: "💡🏭", w: 4, need: { money: [2000, null] },
  t: "Une idée te trotte dans la tête depuis des semaines. Un produit que personne ne vend encore, mais que tout le monde voudrait. Il faudrait seulement oser, et trouver quelques milliers d'euros.",
  c: [
    C("Monter l'entreprise", "🏭", [O(0.25, "Les premiers clients arrivent, puis les journalistes. La boîte décolle !", { ambition: 5, repute: 6, item: { kind: "entreprise", name: "Ta jeune entreprise", value: 60000 }, bonheur: 5 }), O(0.45, "Ça tient trois ans en rampant, puis ça s'arrête. Tu as appris plus qu'en dix ans de bureau.", { ambition: 3, intel: 2, argent: -5000, bonheur: -2 }), O(0.3, "Le produit fait flop. La dette, elle, reste.", { dette: 6000, bonheur: -4, prudent: 2 })], { cost: 2000, risk: 2 }),
    D("Chercher des investisseurs d'abord", "💼", "Dix rendez-vous, onze PowerPoint. Quelqu'un finit par dire oui.", { ambition: 2, charme: 2, argent: 800 }),
    D("Garder l'idée dans un tiroir", "🗄️", "Elle y dormira comme une belle au bois dormant.", { prudent: 2, bonheur: -1 }),
  ],
});

ev("amie_demande_service", {
  ages: [20, 60], tags: ["social"], ic: "🙏🤝", w: 5, who: { ami: "friend" }, roll: { somme: [200, 2500, 100] },
  t: "$ami t'appelle, la voix serrée, il lui manque $somme pour boucler le mois. Il jure de te rendre l'argent rapidement.",
  c: [
    C("Lui prêter l'argent", "💸", [O(0.65, "Il rembourse, avec un gâteau en prime. L'amitié sort grandie.", { argent: 0, bonte: 3, rel: { ami: 12 } }), O(0.35, "L'argent ne revient jamais, et il évite tes appels.", { argent: (p, x) => -x.vals.somme, rel: { ami: -15 }, bonheur: -2 })], { cost: 200 }),
    D("Lui donner un peu, sans attendre", "🎁", "Tu offres une petite partie, sans rien exiger. Ça fait chaud au cœur.", { argent: -150, bonte: 3, rel: { ami: 8 } }),
    D("Refuser gentiment", "🙅", "Tu invoques tes propres dépenses. Il comprend, ou fait semblant.", { prudent: 2, rel: { ami: -6 } }),
  ],
});

ev("concert_foule_vedette", {
  ages: [18, 40], tags: ["loufoque"], ic: "🎤🌟", w: 3,
  t: "Dans une salle de concert bondée, la chanteuse vedette te désigne du doigt et t'invite sur scène pour chanter avec elle. Tu ne connais que le refrain, et mal.",
  c: [
    C("Monter sur scène", "🎶", [O(0.5, "Le public hurle de joie. Ta vidéo tourne partout pendant des semaines.", { repute: 8, charme: 3, courage: 4, bonheur: 6, argent: 300 }), O(0.5, "Tu chantes faux, mais avec tant de cœur que la salle te pardonne. Presque.", { repute: -2, courage: 5, bonheur: 3 })], { risk: 1 }),
    D("Te cacher derrière un voisin", "🫣", "Tu échappes à la gloire, et à la honte.", { prudent: 2, bonheur: 0 }),
  ],
});

ev("cheque_perdu_chance", {
  ages: [18, 80], tags: ["loufoque", "argent"], ic: "🍀💶", w: 3, roll: { somme: [200, 5000, 100] },
  t: "Dans la poche d'un vieux manteau acheté en friperie, tu trouves une enveloppe contenant $somme en billets. Aucun nom, aucune adresse.",
  c: [
    D("Garder l'argent", "🤑", "Finalement, la fripe valait plus cher que prévu.", { argent: (p, x) => x.vals.somme, honnete: -2, bonheur: 3 }),
    C("Tenter de retrouver le propriétaire", "🔎", [O(0.5, "Une vieille dame sanglote de joie et t'offre une récompense.", { argent: (p, x) => x.vals.somme / 4, honnete: 4, bonte: 3, bonheur: 5 }), O(0.5, "Personne ne se manifeste. Tu fais un don à un refuge.", { honnete: 4, bonte: 4, bonheur: 3, repute: 2 })]),
    D("Déposer tout à la police", "👮", "Le commissariat est impressionné. Tu repars avec un sourire, et un tampon.", { honnete: 5, repute: 2 }),
  ],
});

ev("sport_equipe_adulte", {
  ages: [20, 45], tags: ["sport"], ic: "⚽🍻", w: 5, who: { ami: "friend" },
  t: "Un club amateur de $ville cherche des joueurs pour un tournoi. Les entraînements sont le mercredi soir, la troisième mi-temps est la meilleure partie du sport.",
  c: [
    D("Rejoindre l'équipe", "🏉", "Tu retrouves des muscles que tu avais oubliés et des amis que tu ne soupçonnais pas.", { sport: 5, sociable: 3, bonheur: 4, sante: 2 }),
    C("Devenir capitaine", "🧢", [O(0.5, "Ton discours galvanise l'équipe. Vous gagnez le tournoi !", { sport: 3, repute: 5, bonheur: 6, charme: 2 }), O(0.5, "Vous perdez tous les matchs, mais dans la bonne humeur.", { bonheur: 3, sociable: 2 })]),
    D("Décliner, le canapé t'appelle", "🛋️", "Une série, un plaid, un thé. Le sport, c'est pour demain.", { sport: -2, bonheur: 1 }),
  ],
});

ev("soiree_pyjama_ami_retrouve", {
  ages: [22, 50], tags: ["social"], ic: "📞🥂", w: 4, who: { ami: "friend" },
  t: "Un ancien camarade d'école, $ami, te recontacte après dix ans de silence. Au téléphone, vous riez comme avant.",
  c: [
    D("Organiser des retrouvailles", "🥂", "Une soirée de souvenirs fous, de photos jaunies et de promesses de se revoir.", { sociable: 4, bonheur: 6, rel: { ami: 14 } }),
    D("Rester en contact par messages", "💬", "On échange quelques mèmes, c'est déjà ça.", { bonheur: 2, rel: { ami: 4 } }),
    D("Laisser filer", "🕊️", "Les chemins se sont séparés, c'est la vie.", { rel: { ami: -5 } }),
  ],
});

ev("demenagement_ville", {
  ages: [21, 45], tags: ["logement"], ic: "📦🚚", w: 4,
  t: "Une opportunité t'attire dans une autre ville, $ville. Nouveau décor, nouvelles têtes, loyers peut-être différents.",
  c: [
    C("Tout plaquer et déménager", "🚚", [O(0.6, "Une nouvelle vie ! Tu te fais de nouveaux amis et des habitudes fraîches.", { city: true, courage: 4, bonheur: 5, argent: -1200 }), O(0.4, "Tu regrettes tes anciens repères. L'herbe n'est pas plus verte, mais le pain est meilleur.", { city: true, courage: 3, bonheur: -1, argent: -1200 })], { cost: 1200 }),
    D("Rester là où tu es", "🏡", "Tu connais ton boulanger, c'est déjà une fortune.", { prudent: 3, bonheur: 1 }),
  ],
});

ev("tenter_concours", {
  ages: [21, 40], tags: ["travail"], ic: "📝🏛️", w: 3, need: { edu: 3, nojob: true },
  t: "Un concours de la fonction publique ouvre ses inscriptions. Les places sont rares, les épreuves longues, la sécurité de l'emploi garantie.",
  c: [
    C("Le préparer sérieusement", "📚", [O(0.35, "Reçu{|e} ! Un poste stable et une pile de papiers à tamponner.", { intel: 3, ambition: 2, job: "public:0", bonheur: 4 }), O(0.65, "Tu échoues de peu. Tu retentes l'an prochain.", { intel: 2, bonheur: -2 })]),
    D("Passer ton chemin", "🚶", "Le bureau et les tampons, ce n'est pas pour toi.", { creatif: 1 }),
  ],
});

ev("colis_mysterieux", {
  ages: [18, 80], tags: ["loufoque"], ic: "📦❓", w: 4, roll: { fou: "fous" },
  t: "Un colis étrange arrive à ta porte, sans expéditeur. À l'intérieur, $fou, avec une notice illisible.",
  c: [
    D("L'adopter", "🤗", "Il devient ta mascotte. Les voisins ne comprennent pas, mais t'envient.", { creatif: 3, bonheur: 5, repute: 1 }),
    C("Le revendre en ligne", "💰", [O(0.5, "Un collectionneur l'achète à prix d'or !", { argent: 1800, creatif: 2 }), O(0.5, "Personne n'en veut. Tu le gardes, en secret.", { bonheur: 1 })]),
    D("Le rapporter à la poste", "📮", "Le guichetier te regarde avec pitié.", { honnete: 2, prudent: 1 }),
  ],
});

ev("gala_invitation", {
  ages: [22, 60], tags: ["social"], ic: "🥂🎩", w: 3, need: { stat: { repute: [45, null] } },
  t: "On t'invite à un gala mondain. Smoking, robes, canapés minuscules. Les gens riches s'y regardent beaucoup, les gens utiles s'y parlent peu.",
  c: [
    C("Faire du réseau", "🤝", [O(0.55, "Tu repars avec trois cartes de visite et un contact précieux.", { ambition: 3, charme: 2, repute: 3, argent: 500 }), O(0.45, "Tu renverses du champagne sur un sénateur. Le buffet te console.", { repute: -3, bonheur: 1 })]),
    D("Te régaler du buffet", "🍤", "Tu goûtes à tout. Vraiment à tout.", { bonheur: 4, sante: -1 }),
    D("Partir avant le discours", "🚪", "Un taxi, un pyjama, un canapé.", { prudent: 1, bonheur: 1 }),
  ],
});

ev("reseau_amis_voyage", {
  ages: [22, 40], tags: ["social", "voyage"], ic: "🚐🏕️", w: 4, who: { ami: "friend", copain: "bestfriend" },
  t: "Avec $ami et $copain, vous planifiez un road trip. Un van déglingué, une carte routière et aucun plan précis.",
  c: [
    C("Partir sans réserver", "🚐", [O(0.6, "Les paysages, les rires, les pannes... un été magique.", { bonheur: 8, sociable: 3, rel: { ami: 8, copain: 8 }, argent: -700 }), O(0.4, "Le van tombe en panne en pleine campagne. Vous dormez chez un fermier qui devient un ami.", { bonheur: 5, courage: 2, argent: -900, rel: { ami: 6 } })], { cost: 700 }),
    D("Réserver chaque étape", "📆", "Rien ne dérape, rien ne surprend non plus. C'est agréable.", { prudent: 3, bonheur: 4, argent: -600 }),
    D("Rester à la maison", "🏠", "Le road trip se fait sans toi. Les photos te piquent un peu.", { bonheur: -2, rel: { ami: -4 } }),
  ],
});

flash("Tu célèbres tes 20 ans avec un gâteau écrasé et des amis fidèles.", { bonheur: 2 }, { ages: [20, 20] });
flash("Un ancien camarade devient célèbre. Tu envisages d'envoyer un message pour dire « je le connaissais ».", { bonheur: 1 }, { ages: [20, 35] });
flash("Les prix de l'immobilier ont encore grimpé dans ton quartier.", {}, { ages: [20, 40] });
flash("Ton premier cheveu blanc fait son apparition. Tu le gardes en souvenir.", { bonheur: -1 }, { ages: [26, 32] });
flash("Un voisin organise la fête des voisins. Tu te sers trois fois de gâteau.", { sociable: 1, bonheur: 2 }, { ages: [20, 50] });
flash("Tu gagnes un panier garni au tirage de la kermesse.", { bonheur: 2 }, { ages: [18, 60] });
flash("Un pigeon s'installe sur ton balcon. Il paie son loyer en roucoulades.", { bonheur: 1 }, { ages: [20, 70] });
