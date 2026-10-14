// HUMOUR NOIR 2/4 — Amour, famille, études, travail
const { ev, flash, O, C, D } = require("../kit");

// ============ AMOUR, SEXUALITÉ ET RELATIONS ============
ev("n_relation_dun_soir", {
  title: "Une nuit, trois conséquences", ages: [18, 40], tags: ["amour", "mature"], ic: "🌙💋", rar: "peu", need: { single: true },
  t: "Une soirée, un regard, un taxi partagé. Au matin, ton hôte dort encore, tu laisses un mot maladroit sur une serviette en papier et tu t'en vas sans te retourner. Tu te dis que personne n'en saura jamais rien.",
  c: [
    D("Laisser ton vrai numéro", "📞", "Quelques semaines d'échanges tendres, puis un joli silence. Cela se passe bien.", { bonheur: 3, charme: 1, flag: "nuit_sans_lendemain" }),
    D("Disparaître sans laisser de trace", "👻", "Un fantôme dans la nuit. Une histoire que tu garderas pour toi.", { bonheur: 2, honnete: -1, flag: "nuit_sans_lendemain", later: { id: "n_enfant_surprise", in: [4, 18], p: 0.18 } }),
    D("Laisser un faux nom et un vrai bisou", "🎭", "Tu t'inventes une vie, puis tu l'oublies.", { honnete: -2, bonheur: 2, flag: "nuit_sans_lendemain", later: { id: "n_enfant_surprise", in: [4, 18], p: 0.18 } }),
  ],
});
ev("n_enfant_surprise", {
  chainOnly: true, title: "Papa, Maman, c'est moi", tags: ["famille", "amour"], ic: "👶📬", need: { noflag: "enfant_surprise_vu" },
  t: "Une lettre recommandée arrive. Un enfant de quelques années, une photo très ressemblante à toi, une lettre posée avec une maladresse émouvante. Une personne du passé t'apprend que tu es parent depuis longtemps, et qu'elle n'a pas osé te le dire.",
  c: [
    C("Aller le ou la rencontrer", "🚪", [O(0.7, "Vous passez un premier week-end maladroit, un parc, une glace, un éclat de rire. L'enfant s'attache vite.", { bonheur: 8, bonte: 4, argent: -400, born: 1, flag: "enfant_surprise_vu", rel: { enfant: 20 } }), O(0.3, "Un test de paternité ou de maternité te surprend, l'enfant n'est pas le tien. Le malentendu laisse un goût étrange.", { bonheur: -3, argent: -300, flag: "enfant_surprise_vu" })], { risk: 1 }),
    D("Demander un test avant tout", "🧬", "La science tranche. Tu as bien un enfant. L'avocat propose un arrangement.", { argent: -600, bonheur: 1, born: 1, flag: "enfant_surprise_vu" }),
    D("Refuser tout contact", "🚫", "Tu enfermes la lettre dans un tiroir. Le tiroir ne se ferme plus tout à fait.", { bonte: -4, bonheur: -4, honnete: -2, flag: "enfant_surprise_vu" }),
  ],
});

ev("n_ex_obsede", {
  title: "L'ex qui n'a pas compris", ages: [20, 60], tags: ["amour"], ic: "📱😶", rar: "peu", need: { rel: "ex" },
  t: "Ton ex t'écrit tous les jours. Un jour pour te présenter des excuses, un autre pour des reproches, un troisième pour te raconter son rêve de la nuit. Il ou elle a même commenté une photo de ton chat avec un cœur brisé.",
  c: [
    D("Répondre une fois, calmement", "🕊️", "Un message poli, définitif. Le silence revient doucement.", { honnete: 2, bonheur: 1 }),
    D("Bloquer sur tous les réseaux", "🚫", "Un soulagement immédiat, une culpabilité diffuse.", { bonheur: 2, prudent: 1 }),
    C("Lui présenter ta nouvelle conquête", "💑", [O(0.4, "Ton ex disparaît pour de bon. Tu savoures.", { bonheur: 4, charme: 1, bonte: -1 }), O(0.6, "Ton ex fait une scène mémorable dans ton restaurant préféré.", { bonheur: -4, repute: -3, argent: -80 })], { risk: 1 }),
  ],
});

ev("n_double_vie", {
  title: "La vie secrète", ages: [25, 65], tags: ["amour", "mature"], ic: "🎭💔", rar: "rare", need: { partner: true },
  t: "Un soir, tu découvres que ton conjoint a une double vie. Un autre appartement, un autre chat, un autre prénom pour lui, et une collection complète de cravates qu'il ne t'a jamais montrées. Il rentre dans trois minutes.",
  c: [
    D("L'attendre et exiger des explications", "🪑", "Une discussion épique de quatre heures. Le chat sort vainqueur.", { courage: 3, bonheur: -4, honnete: 2, flag: "rupture_trahison" }),
    D("Faire tes valises sans rien dire", "🧳", "Tu pars à l'aube, en laissant un mot digne d'un opéra. Un poids tombe de tes épaules.", { bonheur: -2, courage: 2, drop: [] }),
    C("Mener ta propre enquête", "🕵️", [O(0.5, "Tu découvres la vérité complète, bien plus drôle que prévu. Vous vous séparez en riant, ou presque.", { intel: 2, bonheur: 1, honnete: 1 }), O(0.5, "Tu t'enfonces dans une toile de mensonges. L'affaire finit dans le journal local.", { bonheur: -6, repute: -3, argent: -400 })], { risk: 2 }),
  ],
});

ev("n_belle_famille_diner", {
  title: "Le dîner des belles-familles", ages: [22, 60], tags: ["amour", "famille"], ic: "🍽️😰", rar: "commun", need: { partner: true },
  t: "Dîner avec les parents de ton ou ta partenaire. Il y a de la nappe blanche, un rôti sec et une tante qui pose des questions sur ton salaire, ton avenir et la date de ton mariage, par ordre de gravité croissante.",
  c: [
    D("Jouer la carte du charme", "😊", "Tu complimentes la tante, le chien et le rôti. Tout le monde te trouve parfait.", { charme: 2, bonheur: 3, repute: 2 }),
    C("Dire exactement ce que tu penses", "🗣️", [O(0.4, "Une franchise qui plaît. Le beau-père éclate de rire et t'offre un digestif.", { courage: 3, honnete: 2, bonheur: 4 }), O(0.6, "Le silence qui suit est digne d'un enterrement.", { honnete: 2, bonheur: -4, repute: -2 })], { risk: 1 }),
    D("Prétexter une urgence au dessert", "📞", "Tu pars en courant, ton partenaire ne comprend pas. Ou trop bien.", { honnete: -2, bonheur: -1 }),
  ],
});

ev("n_demande_en_mariage_rate", {
  title: "La demande de l'année", ages: [22, 55], tags: ["amour"], ic: "💍🙈", rar: "peu", need: { partner: true },
  t: "Tu prépares la demande en mariage du siècle. La bague, le restaurant, le violoniste. Au moment décisif, le violoniste glisse, la bague tombe dans une soupière et un serveur la ramasse avec une cuillère.",
  c: [
    D("Rire et faire la demande dans la confusion", "😂", "Elle ou il dit oui, entre deux fous rires. Une histoire qui va se raconter pendant des décennies.", { bonheur: 8, charme: 1, flag: "fiance" }),
    D("Reporter à un autre jour", "📆", "Vous finissez le repas, la bague se perd dans la soupe. Le secret reste entier.", { bonheur: -2, prudent: 1 }),
    C("Demander quand même, avec sérieux", "💍", [O(0.55, "Un oui profond, ému. La salle applaudit.", { bonheur: 9, flag: "fiance" }), O(0.45, "Un non surprenant, glacé, sous les yeux d'un serveur compatissant.", { bonheur: -8, charme: -1, repute: -1 })], { risk: 2 }),
  ],
});

ev("n_rencontre_appli", {
  title: "Match de l'enfer", ages: [18, 60], tags: ["amour", "reseaux"], ic: "📱💔", rar: "commun", need: { single: true },
  t: "Ton rendez-vous arrive avec une demi-heure de retard, vingt ans de plus que sur la photo et un perroquet sur l'épaule. Il commande trois plats, un cocktail, puis te demande si tu peux régler la note.",
  c: [
    D("Partir avant le dessert", "🚪", "Tu t'excuses, tu pars. Le perroquet crie ton prénom jusqu'à la sortie.", { bonheur: -1, prudent: 1 }),
    D("Rester et jouer le jeu", "🎭", "Le repas est drôle. Le perroquet est charmant, la personne l'est presque.", { bonheur: 3, sociable: 2, argent: -90 }),
    C("Payer et proposer de se revoir", "💶", [O(0.15, "Une vraie histoire commence, absurde et sincère.", { bonheur: 8, argent: -90, flag: "rencontre_amie" }), O(0.85, "Le deuxième rendez-vous est encore plus étrange.", { bonheur: -2, argent: -150 })], { risk: 1 }),
  ],
});

ev("n_ex_chez_nous", {
  title: "Le retour de l'ex", ages: [25, 70], tags: ["amour"], ic: "🔔😬", rar: "peu", need: { partner: true, rel: "ex" },
  t: "Un soir, la sonnette retentit. C'est ton ex, un sac à la main et les yeux rouges. Il ou elle prétend avoir été mis{|e} à la porte et demande à dormir sur ton canapé. Ton ou ta partenaire est derrière toi, les bras croisés.",
  c: [
    D("Refuser fermement", "🚫", "La porte se ferme, l'ambiance du couple se détend un peu.", { honnete: 1, bonheur: 1, courage: 2 }),
    C("Accepter pour une nuit", "🛋️", [O(0.3, "Vous passez une nuit étonnamment calme, ton ex repart sans rien casser.", { bonte: 3, bonheur: 2 }), O(0.7, "Le matin, l'ex a mangé tes céréales et dit des horreurs à ton partenaire. La vaisselle volera.", { bonheur: -5, bonte: 1, flag: "rupture_trahison" })], { risk: 2 }),
    D("Appeler un taxi et payer le trajet", "🚕", "Une solution propre, froide, efficace. L'ex repart vexé.", { argent: -60, bonheur: 0 }),
  ],
});

ev("n_amour_fou_inconnu", {
  title: "Coup de foudre au rayon surgelés", ages: [18, 70], tags: ["amour"], ic: "⚡🥦", rar: "rare", need: { single: true },
  t: "Entre les petits pois et les glaces à la vanille, tu croises un regard qui dure deux secondes de trop. Une personne magnifique te sourit, puis prend la fuite. Elle a oublié son panier, rempli de dix pots de moutarde.",
  c: [
    C("Courir après elle ou lui", "🏃", [O(0.35, "Tu le ou la rattrapes sur le parking. Vous dînez le soir même.", { bonheur: 8, charme: 2, flag: "rencontre_amie" }), O(0.65, "Tu glisses sur une flaque de glace fondue, la sécurité intervient.", { bonheur: -3, sante: -2, repute: -2 })], { risk: 1 }),
    D("Laisser un mot dans le panier", "📝", "Un numéro de téléphone, un cœur, une blague sur la moutarde. Le message reste sans réponse, puis arrive dix jours plus tard.", { creatif: 2, bonheur: 3, flag: "rencontre_amie" }),
    D("Garder le panier pour toi", "🧺", "Dix pots de moutarde. Tu deviens l'homme ou la femme la plus piquante de la ville.", { bonheur: 1, honnete: -1 }),
  ],
});

ev("n_trio_catastrophe", {
  title: "Le triangle des Bermudes", ages: [20, 50], tags: ["amour", "mature"], ic: "🔺💘", rar: "rare",
  t: "Tu t'aperçois que deux personnes très différentes pensent chacune que tu es leur amoureux ou amoureuse. Elles se présentent toutes deux à ta porte, le même soir, chacune avec un bouquet et un chien.",
  c: [
    D("Tout avouer aux deux", "🕊️", "Une scène digne d'un vaudeville. Aucun des deux ne te reparle pendant un mois.", { honnete: 3, bonheur: -4, repute: -2 }),
    C("Essayer de les séparer pour mieux régner", "🧠", [O(0.25, "Un exploit tactique, tu sors indemne et sans honte.", { intel: 2, honnete: -3, bonheur: 4 }), O(0.75, "Les deux découvrent la supercherie ensemble et vous poursuivent à tour de rôle.", { honnete: -3, bonheur: -6, repute: -4 })], { risk: 2 }),
    D("Choisir celui ou celle avec le chien le plus mignon", "🐶", "Une décision sans appel. Les deux restent stupéfaits.", { bonheur: 3, charme: 1, honnete: -1 }),
  ],
});

ev("n_amour_ancien_prof", {
  title: "Les retrouvailles du lycée", ages: [25, 55], tags: ["amour", "amis"], ic: "🎓💘", rar: "peu", need: { single: true },
  t: "Au vingtième anniversaire de ta promo, tu revois ton ancien béguin de lycée. Il ou elle n'a presque pas changé, ou alors à peine plus que toi. La nuit avance, les verres se multiplient, un slow débute.",
  c: [
    D("Inviter à danser", "💃", "Vous dansez, vous riez, vous vous souvenez de choses qui n'étaient jamais arrivées.", { bonheur: 6, charme: 1, flag: "rencontre_amie" }),
    D("Rester près du buffet", "🍢", "Tu manges trente mini-saucisses en regardant la piste. Une belle soirée de timide.", { bonheur: 1, sante: -1 }),
    C("Avouer enfin ton secret d'il y a vingt ans", "💌", [O(0.4, "Surprise, il ou elle avait le même. Vous partez bras dessus bras dessous.", { bonheur: 9, courage: 2, flag: "rencontre_amie" }), O(0.6, "Il ou elle ne se souvient même pas de toi.", { bonheur: -5, courage: 2, repute: -1 })], { risk: 2 }),
  ],
});

// ============ FAMILLE, PARENTALITÉ ET SECRETS ============
ev("n_secret_famille", {
  title: "Ce que cachait le grenier", ages: [8, 20], tags: ["famille"], ic: "📦🕵️", rar: "peu",
  t: "En fouillant le grenier, tu trouves une boîte fermée par un ruban. Des lettres, une photo d'un inconnu qui te ressemble, un acte de naissance au nom d'une autre famille. Ton cœur bat plus fort.",
  c: [
    D("Tout lire en cachette", "📖", "Tu comprends à moitié. Un secret ancien, un nom oublié. Tu gardes le tout pour toi.", { intel: 2, bonheur: -2, honnete: -1, flag: "secret_famille", later: { id: "n_revelation_famille", in: [12, 30], keep: true } }),
    D("En parler à tes parents", "🗣️", "Un silence tendu, puis une explication à moitié vraie. Tu n'es pas sûr{|e} de tout comprendre.", { honnete: 2, bonheur: -3, flag: "secret_famille", later: { id: "n_revelation_famille", in: [12, 30], keep: true } }),
    D("Remettre la boîte à sa place", "🔒", "Tu ne veux pas savoir. Pas encore. Tu fais semblant de tout ignorer.", { prudent: 2, bonheur: 0, flag: "secret_famille", later: { id: "n_revelation_famille", in: [15, 35], keep: true } }),
  ],
});
ev("n_revelation_famille", {
  chainOnly: true, title: "La vérité sort du placard", tags: ["famille"], ic: "🗝️😳", who: { pere: "pere" },
  t: "À l'occasion d'un repas de famille, une vieille tante s'écrie « il va bien falloir lui dire un jour ». Un verre se brise. Tout le monde se tourne vers toi, avec les yeux de ceux qui savent depuis toujours.",
  c: [
    D("Demander toute la vérité", "🕯️", "Un récit plein de détours, de larmes et d'éclats de rire. Tu repars avec une famille un peu plus grande.", { honnete: 3, bonheur: 3, courage: 3, rel: { pere: 5 } }),
    D("Dire que tu savais déjà", "😎", "Les visages se décomposent. Ta tante change de couleur.", { intel: 2, bonheur: 4, repute: 2 }),
    D("Quitter la table, sidéré{|e}", "🚪", "Tu marches trois heures dans la ville. Au retour, quelqu'un a gardé ton dessert.", { bonheur: -3, courage: 1, rel: { pere: -5 } }),
  ],
});

ev("n_heritage_surprise", {
  title: "Un oncle dont personne ne parlait", ages: [22, 75], tags: ["famille", "argent"], ic: "📜💰", rar: "peu",
  t: "Un notaire t'appelle. Un oncle lointain, mort sur un yacht sans témoin, t'a légué un manoir humide, une collection de timbres et trois perroquets. Il y a aussi une dette, de montant indéterminé.",
  c: [
    C("Accepter l'héritage en bloc", "📜", [O(0.5, "Le manoir cache un petit trésor sous la cave. Tu deviens plus riche que tu ne le pensais.", { argent: 20000, bonheur: 6, item: { kind: "immo", name: "Manoir humide", value: 150000 } }), O(0.5, "Les dettes dépassent la valeur du manoir. Tu apprends à jongler avec les huissiers.", { dette: 20000, bonheur: -4, item: { kind: "immo", name: "Manoir humide", value: 120000 }, later: { id: "n_heritage_conflit", in: [1, 3] } })], { risk: 2 }),
    D("Refuser pour éviter les ennuis", "🙅", "Tu laisses les perroquets au notaire. Tu dors bien, mais tu y penseras souvent.", { prudent: 3, bonheur: 0 }),
    D("Prendre uniquement les perroquets", "🦜", "Ils insultent tout le monde avec élégance. Ton quartier est ravi.", { bonheur: 4, creatif: 2, argent: -150 }),
  ],
});
ev("n_heritage_conflit", {
  chainOnly: true, title: "Les cousins arrivent", tags: ["famille", "argent"], ic: "👨‍👩‍👧‍👦⚖️",
  t: "Trois cousins que tu n'as jamais vus se présentent à ta porte avec un avocat, une tarte et des regards très peu chaleureux. Ils estiment que le manoir leur revient de droit.",
  c: [
    D("Négocier à l'amiable", "🤝", "Un partage honnête est signé autour d'un thé. Chacun repart avec un perroquet.", { argent: -2000, bonheur: 2, bonte: 2 }),
    C("Aller jusqu'au tribunal", "⚖️", [O(0.45, "Tu gagnes. Le juge est visiblement soulagé de se débarrasser du dossier.", { argent: 3000, bonheur: 3, repute: 1 }), O(0.55, "Tu perds, les frais d'avocat engloutissent tout.", { argent: -6000, bonheur: -5 })], { risk: 2 }),
    D("Tout leur laisser", "🏳️", "Ils emportent tout, le manoir, la collection, et un perroquet qui t'insulte depuis la voiture.", { bonheur: -2, bonte: 3, prudent: 2 }),
  ],
});

ev("n_enfant_cartable_feu", {
  title: "La note du directeur", ages: [25, 50], tags: ["famille"], ic: "🔥🎒", rar: "commun", need: { rel: "child" }, who: { enfant: "child" },
  t: "Le directeur de l'école de $enfant t'appelle. $enfant a mis le feu à un cartable, accessoirement celui d'un camarade, accessoirement avec un briquet qu'il ou elle n'était pas censé{e} avoir. Il y a un rapport de trois pages.",
  c: [
    D("Punir avec fermeté", "🚫", "Une sortie en moins pendant un mois. L'enfant boude, l'école soupire de soulagement.", { honnete: 1, bonheur: -2, rel: { enfant: -8 } }),
    D("Discuter longuement", "🗣️", "Un long dialogue sincère. L'enfant avoue qu'il ou elle voulait seulement « voir si ça brûle ».", { bonte: 2, bonheur: 1, rel: { enfant: 8 } }),
    C("Défendre l'enfant devant l'école", "🛡️", [O(0.4, "L'école reconnaît l'accident, l'affaire est classée.", { repute: 1, rel: { enfant: 12 } }), O(0.6, "L'école ne cède pas, et ta réputation de parent en prend un coup.", { repute: -3, bonheur: -2, rel: { enfant: 4 } })], { risk: 1 }),
  ],
});

ev("n_enfant_ado_rebelle", {
  title: "Je ne te parle plus", ages: [30, 55], tags: ["famille"], ic: "🚪😤", rar: "commun", need: { rel: "child" }, who: { enfant: "child" },
  t: "$enfant, devenu{e} adolescent{e}, ne répond plus que par grognements. Son pantalon est trop large, sa musique trop forte et sa porte fermée à clé. Un jour, tu trouves un mot sur la table, « je pars vivre chez Marco ».",
  c: [
    D("Aller le ou la chercher chez Marco", "🚗", "Tu arrives, tu t'excuses d'avance. Marco est en fait un chien. La dispute se transforme en fou rire.", { bonte: 2, bonheur: 4, rel: { enfant: 15 } }),
    D("Laisser du temps", "⏳", "Le silence dure trois jours. $enfant revient avec une pizza en guise d'excuse.", { prudent: 2, bonheur: 1, rel: { enfant: 8 } }),
    C("Menacer de couper les vivres", "💸", [O(0.5, "Un électrochoc. L'enfant devient presque aimable.", { honnete: 1, bonheur: -1, rel: { enfant: -4 } }), O(0.5, "La guerre est déclarée, pour de bon.", { bonheur: -5, rel: { enfant: -20 } })], { risk: 1 }),
  ],
});

ev("n_mariage_parents_dispute", {
  title: "Le mariage des disputes", ages: [25, 60], tags: ["famille"], ic: "💒🥊", rar: "peu", who: { mere: "mere", pere: "pere" },
  t: "Au mariage d'un cousin, ta mère et ton père s'affrontent au sujet d'un plan de table. La pièce montée est menacée, un oncle met ses lunettes de soleil et le marié se cache derrière un rideau.",
  c: [
    D("Faire la médiation", "🕊️", "Tu les écoutes deux heures, tu rédiges un traité de paix. Il tient toute la soirée.", { bonte: 3, intel: 1, bonheur: 2 }),
    D("Boire un verre et regarder le spectacle", "🥂", "Un moment d'anthologie. Tu en fais le récit pendant dix ans.", { bonheur: 3, honnete: -1 }),
    C("Prendre parti", "🎯", [O(0.4, "Tu as raison, ils le reconnaissent en grommelant.", { repute: 1, bonheur: 2, rel: { mere: 6, pere: -3 } }), O(0.6, "Tu as tort, et tu en payes le prix pendant les trois dîners suivants.", { bonheur: -4, rel: { mere: -5, pere: -5 } })], { risk: 1 }),
  ],
});

ev("n_cadeau_noel_catastrophe", {
  title: "Le pire cadeau du monde", ages: [10, 80], tags: ["famille"], ic: "🎁😬", rar: "commun",
  t: "Noël. Tu ouvres ton paquet devant toute la famille. Un pull jaune avec un renne qui chante, une paire de chaussettes assorties et un bon pour « une journée avec la tante Gertrude ». Tout le monde te regarde.",
  c: [
    D("Remercier avec émotion", "🥹", "Tu portes le pull toute la soirée. La tante est aux anges.", { bonte: 2, bonheur: 1, honnete: -1 }),
    D("Éclater de rire", "😂", "Le renne chante, tu chantes avec lui. L'oncle le plus raide de la famille rit aux larmes.", { bonheur: 3, charme: 1 }),
    C("Dire la vérité", "🙊", [O(0.4, "Un silence, puis un éclat de rire général. La tante promet d'offrir des chocolats l'an prochain.", { honnete: 2, bonheur: 2 }), O(0.6, "Elle se lève, quitte la table et ne revient que pour le dessert.", { honnete: 2, bonheur: -3, repute: -1 })], { risk: 1 }),
  ],
});

ev("n_testament_surprise_vivant", {
  title: "Le testament de son vivant", ages: [40, 85], tags: ["famille", "argent"], ic: "📜😏", rar: "rare", need: { rel: "family" },
  t: "Un grand-père riche réunit toute la famille pour lire son testament de son vivant. Il sourit, il observe, il note les réactions. La phrase finale, « je distribue tout à celui qui me fera le plus rire ».",
  c: [
    C("Tenter la blague de ta vie", "🎭", [O(0.3, "Le grand-père éclate de rire et te nomme héritier principal.", { argent: 15000, bonheur: 6, charme: 2, repute: 2 }), O(0.7, "Ton humour tombe à plat. La cousine, elle, a préparé un numéro de clown.", { bonheur: -3, charme: -1 })], { risk: 2 }),
    D("Lui offrir sincèrement du temps", "🫂", "Une après-midi à lui écouter ses souvenirs. Il te sourit, il n'oublie pas.", { bonte: 3, bonheur: 4, argent: 1000 }),
    D("Quitter la salle en disant que c'est ridicule", "🚪", "Tu perds sans doute des milliers d'euros, mais tu gagnes en dignité.", { honnete: 2, bonheur: 1, argent: -50 }),
  ],
});

// ============ ÉTUDES ET ÉCHECS SCOLAIRES ============
ev("n_orientation_absurde", {
  title: "Le conseiller d'orientation", ages: [14, 18], tags: ["ecole"], ic: "🧭🤨", rar: "commun",
  t: "Le conseiller d'orientation te regarde longuement, consulte une feuille et annonce « d'après vos résultats, vous avez toutes les chances de devenir dompteur de puces ». Il le dit avec un sérieux administratif.",
  c: [
    D("Prendre la proposition au sérieux", "🪲", "Tu explores la piste. Tu découvres une passion sincère pour le dressage de puces.", { creatif: 3, bonheur: 3, flag: "puces" }),
    D("Ignorer son avis", "🙄", "Tu choisis ta voie sans lui. Il hoche la tête avec compassion.", { ambition: 1, bonheur: 0 }),
    D("Contester auprès du directeur", "🗣️", "Un long échange administratif. Le conseiller est muté.", { courage: 2, repute: 1, bonheur: 1 }),
  ],
});

ev("n_redoublement_epique", {
  title: "Le redoublement qui change tout", ages: [15, 22], tags: ["ecole"], ic: "📚🔁", rar: "peu",
  t: "Tu redoubles pour la deuxième fois. Tes camarades de la première heure passent en troisième année, toi en deuxième chance. Ton nouveau groupe t'accueille avec des lazzis et un sandwich.",
  c: [
    D("Travailler comme un forcené", "💪", "Tu bûches jour et nuit. Les résultats suivent, avec une fatigue sourde.", { notes: 10, intel: 2, sante: -2, bonheur: -1 }),
    D("Prendre ça avec humour", "😄", "Tu deviens la mascotte de la classe. Les profs t'adorent, les notes un peu moins.", { notes: 1, bonheur: 4, sociable: 3 }),
    C("Tricher avec une application secrète", "📱", [O(0.4, "Personne ne remarque rien, tu passes sans effort.", { notes: 8, honnete: -4, bonheur: 3 }), O(0.6, "Tu es repéré{|e}. L'exclusion est immédiate.", { notes: -8, honnete: -4, repute: -4, bonheur: -5, flag: "tricheur_ecole" })], { risk: 2 }),
  ],
});

ev("n_mensonge_cv", {
  title: "Un diplôme très imaginatif", ages: [21, 50], tags: ["travail", "etudes"], ic: "📄🤥", rar: "peu", need: { nojob: true },
  t: "Pour décrocher un entretien, tu embellis légèrement ton CV. Un diplôme d'une école très prestigieuse, quelques stages en Suisse, et une fluence « bilingue » dans une langue que tu as seulement chantée sous la douche.",
  c: [
    C("Envoyer le CV tel quel", "📨", [O(0.6, "Tu décroches l'entretien, puis le poste. Une carrière brillante commence sur un mensonge.", { job: "consultant:0", honnete: -4, bonheur: 4, flag: "cv_mensonge", later: { id: "n_cv_controle", in: [3, 15], p: 0.65 } }), O(0.4, "Le recruteur parle la langue en question. Un silence de quatre minutes s'installe.", { honnete: -2, bonheur: -3, repute: -2 })], { risk: 2 }),
    D("Rendre le CV honnête", "📄", "Plus modeste, plus vrai. Tu décroches un entretien raisonnable.", { honnete: 3, bonheur: 1 }),
    D("Dire que tu étais en tournée avec un cirque", "🎪", "Ton récit enchante le recruteur. Il t'engage sans rien vérifier.", { creatif: 3, honnete: -2, bonheur: 3, jobHunt: true }),
  ],
});
ev("n_cv_controle", {
  chainOnly: true, title: "Vérification des diplômes", tags: ["travail"], ic: "🔍📄", need: { job: true },
  t: "Un audit interne contrôle tous les diplômes. Le directeur des ressources humaines te convoque avec un dossier épais. Il pose ton CV sur la table, ouvre la page 2 et lit à voix haute « bilingue en finnois ».",
  c: [
    D("Tout avouer", "🕊️", "Tu t'excuses, tu t'expliques. On te garde sur un poste plus modeste.", { honnete: 3, perf: -6, bonheur: -3, demote: true }),
    C("Nier jusqu'au bout", "🙅", [O(0.3, "Le dossier est perdu, personne ne cherche plus loin.", { honnete: -3, bonheur: 2 }), O(0.7, "Une preuve irréfutable. Tu es licencié{|e}.", { honnete: -3, fire: true, repute: -5, bonheur: -6 })], { risk: 3 }),
    D("Démissionner avant le scandale", "🚪", "Tu pars la tête haute, ta dignité à moitié intacte.", { quit: true, bonheur: -2, repute: -1 }),
  ],
});

ev("n_mention_inattendue", {
  title: "Le plus beau jour de ton année", ages: [16, 24], tags: ["ecole", "chance"], ic: "🎓✨", rar: "rare",
  t: "Tu n'as presque pas révisé, tu as répondu à tout au hasard, et tu reçois pourtant une mention exceptionnelle. Les profs sont suspicieux, tes parents pleurent, et le correcteur se demande lui-même ce qui s'est passé.",
  c: [
    D("Savourer sans poser de question", "🍾", "Tu fêtes ça jusqu'à l'aube. Personne ne t'a rien demandé.", { notes: 10, bonheur: 8, honnete: -1, repute: 2 }),
    D("Avouer ton coup de chance", "😅", "Tu confesses à ton prof, qui rit et te garde comme assistant{|e}.", { honnete: 3, bonheur: 4, repute: 1 }),
    D("Demander une recorrection", "🧐", "Ta note baisse de trois points, mais la mention reste. Le destin est généreux.", { honnete: 2, bonheur: 5 }),
  ],
});

ev("n_grand_oral_catastrophe", {
  title: "L'oral du siècle", ages: [17, 26], tags: ["ecole", "etudes"], ic: "🎤🥶", rar: "commun",
  t: "Devant un jury de cinq personnes, tu ouvres la bouche et rien ne sort. Puis un hoquet. Puis un chant de baleine involontaire. Le jury est pétrifié, un des examinateurs note quelque chose avec gravité.",
  c: [
    D("Éclater de rire et recommencer", "😂", "Ton rire est contagieux. Le jury aussi s'y met. Tu obtiens une bonne note pour ton courage.", { notes: 4, courage: 3, bonheur: 3 }),
    D("Fuir la salle", "🏃", "Tu sors en trombe. Le concierge te regarde passer avec sérénité.", { notes: -10, bonheur: -5, courage: -1 }),
    D("Continuer avec dignité, hoquet compris", "🎩", "Le hoquet devient un rythme. Tu finis sous les applaudissements polis.", { notes: 2, courage: 2, bonheur: 1, creatif: 1 }),
  ],
});

ev("n_stage_enfer", {
  title: "Stagiaire à vie", ages: [18, 26], tags: ["travail", "etudes"], ic: "📎😵", rar: "commun",
  t: "Ton stage consiste à faire du café, trier des trombones et acheter des croissants pour un patron qui t'appelle « le stagiaire ». Le nom de ton badge est écrit à la main, avec une faute d'orthographe.",
  c: [
    D("Faire du zèle et impressionner", "🌟", "Tu appris tout, tu rends tout, tu proposes des idées. On te remarque, un peu.", { ambition: 2, perf: 3, bonheur: -2, sante: -1 }),
    D("Démissionner avec panache", "🚪", "Tu pars en laissant un mug avec « merci pour le café ». Une légende de bureau.", { bonheur: 3, honnete: 1, argent: -200 }),
    C("Se plaindre à la direction", "🗣️", [O(0.4, "Le patron s'excuse, ton statut change, tu es payé{|e}.", { argent: 600, repute: 2, courage: 3 }), O(0.6, "Il note ton nom pour ne plus jamais te rappeler.", { repute: -3, bonheur: -2 })], { risk: 1 }),
  ],
});

// ============ TRAVAIL, CHÔMAGE ET CARRIÈRE ============
ev("n_licenciement_absurde", {
  title: "Merci pour votre service", ages: [22, 62], tags: ["travail"], ic: "📦😶", rar: "peu", need: { job: true },
  t: "Un matin, ton badge ne marche plus. Un agent de sécurité te tend un carton avec ta plante verte, une tasse et un chèque. Le motif du licenciement, selon la lettre, est « poste supprimé par un algorithme en retard d'une version ».",
  c: [
    D("Partir avec dignité", "🚶", "Tu remercies tout le monde, tu quittes les lieux. Le carton pèse plus lourd que prévu.", { fire: true, bonheur: -4, honnete: 1, later: { id: "n_chomage_spirale", in: 1 } }),
    C("Attaquer aux prud'hommes", "⚖️", [O(0.4, "Le juge te donne raison. Une indemnité tombe, ton ancien patron change de couleur.", { fire: true, argent: 8000, bonheur: 4, later: { id: "n_chomage_spirale", in: 1 } }), O(0.6, "L'affaire s'éternise. Les honoraires dépassent l'indemnité.", { fire: true, argent: -2000, bonheur: -5, later: { id: "n_chomage_spirale", in: 1 } })], { risk: 2 }),
    D("Embarquer la plante et la photocopieuse", "🪴", "Un petit cambriolage sentimental. L'entreprise n'a jamais vu passer ni l'une ni l'autre.", { fire: true, honnete: -3, bonheur: 2, record: 0, later: { id: "n_chomage_spirale", in: 1 } }),
  ],
});
ev("n_chomage_spirale", {
  chainOnly: true, title: "Le chômage, ce grand inconnu", tags: ["travail"], ic: "🛋️📉", need: { nojob: true },
  t: "Les journées se suivent, longues et sans horaire. Tu as relu trois fois ton CV, vidé ton frigo et passé une demi-journée à regarder un escargot traverser la terrasse. L'estime de soi s'effrite doucement.",
  c: [
    D("Se reconvertir complètement", "🔄", "Tu te lances dans une formation improbable, dompteur de plantes ou conseiller en moustaches. Une nouvelle vie commence.", { argent: -1500, bonheur: 3, creatif: 3, jobHunt: true }),
    D("Créer ta propre entreprise", "🚀", "Une idée, un site web, une tasse de café. Tu te lances, avec plus de courage que de capital.", { bonheur: 4, ambition: 3, jobHunt: true }),
    C("Attendre que ça passe", "⏳", [O(0.5, "Un coup de fil inattendu te propose un contrat sur un malentendu.", { jobHunt: true, bonheur: 3 }), O(0.5, "Les semaines deviennent des mois. Le moral descend.", { bonheur: -6, sante: -2, flag: "creux_chomage" })], { risk: 1 }),
  ],
});

ev("n_promotion_accident", {
  title: "Nommé par erreur", ages: [24, 60], tags: ["travail", "chance"], ic: "🏆🙃", rar: "rare", need: { job: true },
  t: "Un mail du siège t'annonce ta nomination au poste de directeur, avec un salaire doublé et un bureau face à la mer. Tu cherches l'erreur longtemps, avant de comprendre que le message était destiné à un homonyme.",
  c: [
    D("Accepter sans rien dire", "🤫", "Tu prends le poste, le bureau, le café brésilien. Tu apprends en route, ou presque.", { promote: true, honnete: -3, bonheur: 6, perf: -3, flag: "poste_par_erreur" }),
    D("Prévenir le siège de l'erreur", "📞", "Le siège éclate de rire et te propose un poste plus raisonnable pour ta franchise.", { honnete: 4, raise: 0.1, bonheur: 3, repute: 2 }),
    C("Demander une augmentation en plus", "💶", [O(0.3, "Le siège a peur d'un scandale et accorde tout.", { raise: 0.3, honnete: -3, bonheur: 5 }), O(0.7, "On découvre la méprise, tu es licencié{|e} pour usurpation de nomination.", { fire: true, honnete: -3, bonheur: -6, repute: -4 })], { risk: 3 }),
  ],
});

ev("n_boss_humiliation", {
  title: "La réunion de trop", ages: [22, 62], tags: ["travail"], ic: "😬📣", rar: "commun", need: { job: true }, who: { chef: "boss" },
  t: "$chef te reprend publiquement pour une erreur que tu n'as pas faite, devant trente collègues, avec un tableau et un pointeur laser. Un collègue te regarde en haussant les sourcils de compassion.",
  c: [
    D("Répondre calmement avec des preuves", "📊", "Tu sors les chiffres. Le silence tombe, puis la rectification. Tu gagnes en respect.", { courage: 3, intel: 1, perf: 4, repute: 2, rel: { chef: -5 } }),
    D("Encaisser et rager en silence", "😤", "Tu avales la couleuvre. Elle te reste en travers pendant des jours.", { bonheur: -3, perf: -2, prudent: 1 }),
    C("Rendre l'humiliation", "🎯", [O(0.35, "Tu réponds avec esprit. La salle éclate de rire, le chef rougit.", { repute: 3, bonheur: 3, rel: { chef: -20 }, perf: 2 }), O(0.65, "Ta réplique rate sa cible. Le chef te convoque en privé, longtemps.", { repute: -3, perf: -6, bonheur: -3, rel: { chef: -20 } })], { risk: 2 }),
  ],
});

ev("n_startup_brillante", {
  title: "La start-up de trop", ages: [22, 55], tags: ["travail", "argent"], ic: "🚀💸", rar: "peu", need: { money: [3000, null] },
  t: "Un ami te propose de lever des fonds pour une application qui transforme les cris des chats en haïkus. Les investisseurs adorent. Le logiciel plante une fois sur deux. Les chats, eux, ne comprennent rien.",
  c: [
    C("Investir et foncer", "💶", [O(0.2, "L'application explose. Vous revendez pour une somme absurde.", { argent: 60000, bonheur: 8, repute: 4, ambition: 3 }), O(0.8, "La start-up s'évapore en dix-huit mois, laissant des dettes et des chats mécontents.", { argent: -3000, dette: 4000, bonheur: -4 })], { risk: 3, cost: 3000 }),
    D("Rejoindre comme simple salarié", "💼", "Un petit salaire, une grande ambiance, une table de ping-pong. Tu apprends beaucoup.", { argent: 2000, ambition: 1, bonheur: 3 }),
    D("Décliner poliment", "🙅", "Tu laisses les chats à leurs haïkus. La start-up fait faillite, tu respires.", { prudent: 2, bonheur: 1 }),
  ],
});

ev("n_collegue_vole_idee", {
  title: "Mon idée, son nom", ages: [22, 62], tags: ["travail"], ic: "🕵️💡", rar: "commun", need: { job: true }, who: { collegue: "colleague" },
  t: "Tu découvres que $collegue présente ton projet à la direction, mot pour mot, avec ton schéma et tes fautes de frappe. Il a même gardé ton clin d'œil final.",
  c: [
    D("Le démasquer en réunion", "📣", "Tu exposes l'affaire devant tout le monde. Les regards se tournent vers lui, la direction hésite.", { courage: 3, perf: 3, repute: 2, rel: { collegue: -25 } }),
    D("Lui en parler en tête à tête", "🗣️", "Il s'excuse, promet de rectifier. Il ne le fera jamais complètement.", { honnete: 2, perf: 1, rel: { collegue: -8 } }),
    C("Lui voler la prochaine idée", "🥷", [O(0.45, "Tu devances tout le monde et brilles. Il pâlit.", { perf: 5, honnete: -3, ambition: 2, rel: { collegue: -20 } }), O(0.55, "Il t'avait tendu un piège. Tu te ridiculises devant la direction.", { perf: -6, honnete: -3, repute: -4 })], { risk: 2 }),
  ],
});

ev("n_teletravail_derapage", {
  title: "Caméra allumée", ages: [22, 62], tags: ["travail", "reseaux"], ic: "💻🙈", rar: "commun", need: { job: true },
  t: "Pendant une visioconférence avec soixante personnes, tu te lèves pour attraper un café. Tu portes un caleçon à motifs de canard, ton chat marche sur le clavier, et ton micro est resté ouvert. Un silence admiratif s'installe.",
  c: [
    D("Assumer", "🦆", "Tu salues l'écran et te rassois. Ton collègue démarre une ola dans la discussion.", { bonheur: 3, repute: 1, charme: 1, courage: 2 }),
    D("Couper la caméra et simuler un bug", "📵", "Tu fais semblant de planter. Le plantage dure jusqu'à la fin de la réunion.", { honnete: -2, bonheur: -1 }),
    C("Dire que c'est une blague de l'équipe technique", "🎭", [O(0.3, "Personne ne vérifie, tu t'en sors.", { honnete: -2, bonheur: 2 }), O(0.7, "Le service informatique est vexé et prouve le contraire avec un journal détaillé.", { honnete: -3, repute: -3, perf: -2 })], { risk: 1 }),
  ],
});

ev("n_burnout_collectif", {
  title: "Le bureau déprime", ages: [24, 62], tags: ["travail", "sante"], ic: "🪫👥", rar: "peu", need: { job: true },
  t: "Dans l'équipe, une personne s'écroule, puis deux, puis cinq. L'open space ressemble à un champ de bataille de post-it. Ton manager répond par un atelier « sourire du lundi » avec des ballons.",
  c: [
    D("Alerter la direction", "📣", "Un rapport circonstancié, quelques réunions pénibles. Quelques changements concrets arrivent.", { courage: 3, repute: 2, perf: -1, bonheur: 1 }),
    D("Quitter le navire", "🚪", "Tu pars, la tête haute et le CV fraîchement mis à jour.", { quit: true, jobHunt: true, bonheur: 2 }),
    D("Organiser une sortie de groupe", "🎳", "Un bowling, des rires, une trêve de quelques heures. Ça fait du bien à tous.", { sociable: 3, bonheur: 3, argent: -60, perf: 1 }),
  ],
});

ev("n_chef_gueule_noire", {
  title: "Le patron fantôme", ages: [24, 62], tags: ["travail"], ic: "👻👔", rar: "peu", need: { job: true },
  t: "Ton nouveau patron n'a jamais été vu en vrai. Il donne ses ordres par mail à trois heures du matin, signés d'une seule initiale. Un collègue jure qu'il l'a croisé dans l'ascenseur, mais il s'est évaporé.",
  c: [
    C("Mener ta propre enquête", "🕵️", [O(0.4, "Le patron est un chat roux, nommé Directeur, adopté par la standardiste. Les mails étaient écrits par elle. La boîte est conquise.", { bonheur: 5, creatif: 2, repute: 2 }), O(0.6, "Tu ne trouves rien, mais on te reproche ta curiosité.", { perf: -3, repute: -1, bonheur: -1 })], { risk: 1 }),
    D("Faire ton travail sans te poser de question", "📎", "L'absurde est ton collègue. Les résultats suivent.", { perf: 3, prudent: 2 }),
    D("Écrire un mail de remerciements à ce fantôme", "💌", "Une réponse arrive à cinq heures, deux mots, « merci beaucoup ». Tu es ému{|e}.", { bonheur: 3, honnete: 1 }),
  ],
});
