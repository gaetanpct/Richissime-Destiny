// Combines douteuses, justice, prison
const { ev, flash, O, C, D } = require("../kit");

ev("tentation_fraude", {
  ages: [20, 65], tags: ["mature", "argent"], ic: "🕶️💼", w: 3, need: { job: { illicit: false, min: 1 } }, roll: { somme: [5000, 60000, 5000] },
  t: "Dans les comptes de ton entreprise, tu repères une faille. Avec un peu d'audace, $somme pourraient atterrir dans ta poche, sans que personne n'y voie goutte.",
  c: [
    C("Tenter le coup", "🤑", [O(0.55, "Ça passe. Tu planques le magot, la boule au ventre.", { argent: (p, x) => x.vals.somme, honnete: -6, flag: "fraudeur" }), O(0.45, "Tu es démasqué{|e}. L'affaire fait grand bruit.", { fire: true, prison: 2, honnete: -6, repute: -10, bonheur: -6, pub: "🚨 $nom arrêté pour fraude dans son entreprise." })], { risk: 2 }),
    D("Signaler la faille", "🛡️", "Ta hiérarchie te remercie. Tu reçois une prime.", { honnete: 5, argent: 800, repute: 3, perf: 5 }),
    D("Ne rien faire", "🙈", "Tu fermes l'ordinateur. Ta conscience est tranquille.", { honnete: 1 }),
  ],
});

ev("arnaque_en_ligne", {
  ages: [18, 85], tags: ["mature", "argent"], ic: "💻🎣", w: 4, need: { money: [500, null] }, roll: { somme: [300, 6000, 100] },
  t: "Un message te promet un rendement miraculeux de 400 % en trois jours. L'expéditeur est un prince, un ministre ou un lapin de Pâques, on ne sait pas trop.",
  c: [
    C("Envoyer l'argent", "💸", [O(0.1, "Surprise, ça marche ! Tu doubles ta mise.", { argent: (p, x) => x.vals.somme, bonheur: 3 }), O(0.9, "Évidemment, il s'agissait d'une arnaque. Tu perds tout.", { argent: (p, x) => -x.vals.somme, bonheur: -4, prudent: 3 })], { cost: 300, risk: 2 }),
    D("Signaler le message", "🚩", "Tu fais ton devoir de citoyen. Le lapin de Pâques est furieux.", { prudent: 2, honnete: 1 }),
    D("Supprimer et passer à autre chose", "🗑️", "Tu as bien fait.", { prudent: 2 }),
  ],
});

ev("controle_police_route", {
  ages: [18, 80], tags: ["mature"], ic: "🚓🚦", w: 4, need: { asset: "voiture" },
  t: "Un gendarme t'arrête sur le bord de la route. Contrôle de papiers, alcoolémie, extincteur périmé. Le gendarme te regarde longuement.",
  c: [
    D("Coopérer calmement", "🙂", "Tout est en règle. Il te souhaite une bonne journée.", { prudent: 1, honnete: 1 }),
    C("Tenter de le soudoyer", "💶", [O(0.15, "Il accepte. Tu le regrettes tout de suite.", { argent: -100, honnete: -4, record: 1 }), O(0.85, "Il se fâche et te colle une amende majorée.", { argent: -450, honnete: -3, record: 1, repute: -2 })], { risk: 2 }),
    D("Plaisanter pour détendre l'atmosphère", "😄", "Il rit et te laisse repartir avec un avertissement.", { charme: 2, sociable: 1 }),
  ],
});

ev("vol_a_letalage", {
  ages: [12, 60], tags: ["mature"], ic: "🛍️🥷", w: 3,
  t: "Dans un magasin, un objet magnifique te tend les bras. Personne ne regarde. Le vigile mange un sandwich et le caissier rêve de vacances.",
  c: [
    C("Le glisser dans ta poche", "🤫", [O(0.6, "Personne n'a rien vu. Tu repars avec un trésor... et une mauvaise conscience.", { argent: 80, honnete: -4, bonheur: 1 }), O(0.4, "Le vigile te rattrape. Honte et amende.", { argent: -200, honnete: -3, repute: -4, record: 1 })], { risk: 2 }),
    D("Acheter l'objet", "💳", "Tu paies. Le caissier sourit.", { argent: -80, honnete: 2 }),
    D("Partir sans rien", "🚶", "Tu résistes à l'appel de l'objet.", { prudent: 2 }),
  ],
});

ev("cambriolage_subi", {
  ages: [20, 90], tags: ["mature", "argent"], ic: "🚪🏴‍☠️", w: 3, need: { net: [10000, null] }, roll: { somme: [800, 8000, 100] },
  t: "Tu rentres chez toi. La porte est entrouverte, le salon sens dessus dessous, et la télé a disparu. Le cambrioleur a laissé un mot, « merci pour le fromage ».",
  c: [
    D("Déclarer le vol à l'assurance", "📋", "L'assurance rembourse une partie. Il faut remplir sept formulaires.", { argent: (p, x) => -x.vals.somme / 3, prudent: 2, bonheur: -3 }),
    C("Mener ta propre enquête", "🔎", [O(0.3, "Tu retrouves le coupable grâce à une empreinte de basket. Tu récupères tes biens.", { argent: 0, courage: 3, repute: 3, bonheur: 3 }), O(0.7, "Tu piétines les indices, la police te supplie d'arrêter.", { argent: (p, x) => -x.vals.somme / 2, bonheur: -3 })]),
    D("Installer une alarme", "🔔", "Tu te sens plus tranquille, ton portefeuille un peu moins.", { argent: (p, x) => -x.vals.somme / 8 - 300, prudent: 3 }),
  ],
});

ev("braquage_banque_idee", {
  ages: [18, 55], tags: ["mature"], ic: "🏦🎭", w: 2, need: { stat: { courage: [50, null] } }, who: { ami: "friend" },
  t: "$ami te dévoile un plan, braquer la petite banque de $ville. Il a déjà des masques en forme de canard. Un plan « sans risque » d'après lui.",
  c: [
    C("Participer au braquage", "🦆", [O(0.35, "Le plan fonctionne étrangement bien. Un butin gras vous attend.", { argent: 28000, honnete: -8, courage: 3, flag: "braqueur", rel: { ami: 12 } }), O(0.65, "La police vous cueille au petit déjeuner.", { prison: 4, honnete: -8, repute: -12, bonheur: -8, pub: "🚨 $nom arrêté après un braquage de banque raté." })], { risk: 3 }),
    D("Dénoncer le plan", "📞", "Ton ami est arrêté. Tu as la conscience tranquille, mais plus d'ami.", { honnete: 6, rel: { ami: -30 }, repute: 2 }),
    D("Refuser et l'en dissuader", "🙅", "Il rit et change de sujet. Pour l'instant.", { honnete: 3, prudent: 3 }),
  ],
});

ev("proces_temoin", {
  ages: [20, 80], tags: ["mature"], ic: "⚖️🗣️", w: 3,
  t: "Tu es convoqué{|e} comme témoin dans un procès, car tu as vu un voisin sortir d'une maison en feu en portant un perroquet. Le tribunal veut connaître ta version.",
  c: [
    D("Dire la vérité", "🙋", "Tu témoignes honnêtement. Le perroquet est acquitté.", { honnete: 4, repute: 2 }),
    C("Déformer légèrement les faits", "🎭", [O(0.5, "Personne ne remarque tes arrangements.", { honnete: -3 }), O(0.5, "Parjure découvert, tu écopes d'une amende.", { argent: -1500, honnete: -5, record: 1, repute: -4 })], { risk: 1 }),
    D("Ne pas te présenter", "🙈", "Tu reçois une amende pour absence.", { argent: -200, honnete: -1 }),
  ],
});

ev("evasion_prison_idee", {
  ages: [18, 70], tags: ["mature"], ic: "⛓️🪜", w: 4, need: { prison: true },
  t: "Un codétenu murmure qu'il a un plan d'évasion en trois étapes, un tunnel creusé avec une cuillère. Il en est à la huitième cuillère.",
  c: [
    C("Tenter l'évasion", "🏃", [O(0.2, "L'évasion réussit ! Tu cours comme jamais.", { free: true, courage: 5, honnete: -4, flag: "evade", bonheur: 5, record: 1 }), O(0.8, "Tu es rattrapé{|e}. Ta peine augmente.", { prison: 2, bonheur: -5, honnete: -2 })], { risk: 3 }),
    D("Refuser et se tenir tranquille", "😇", "Tu purges ta peine avec sérieux, le gardien te remarque.", { prudent: 3, honnete: 1, bonheur: 0 }),
    D("Dénoncer le plan", "📣", "Le directeur te remercie. Tes codétenus un peu moins.", { honnete: 3, repute: -2, bonheur: -1 }),
  ],
});

ev("prison_atelier", {
  ages: [18, 90], tags: ["mature"], ic: "🛠️⛓️", w: 6, need: { prison: true },
  t: "L'établissement propose des ateliers, menuiserie, informatique, théâtre, cuisine. On t'assure que « ça aide à se réinsérer ».",
  c: [
    D("Suivre l'atelier de cuisine", "🍳", "Tu confectionnes des gratins mémorables.", { creatif: 3, bonheur: 3, intel: 1 }),
    D("Passer un diplôme", "🎓", "Un diplôme de plus à ton actif, signé par le directeur.", { intel: 3, ambition: 2, dipl: "brevet", bonheur: 2 }),
    D("Faire du sport dans la cour", "🏋️", "Tes biceps font trembler la cour.", { sport: 4, sante: 2, courage: 1 }),
    D("Ne rien faire", "😴", "Le temps s'étire. Les jours se ressemblent.", { bonheur: -3 }),
  ],
});

ev("prison_visite", {
  ages: [18, 90], tags: ["mature", "famille"], ic: "👨‍👩‍👧⛓️", w: 4, need: { prison: true, rel: "family" }, who: { proche: "parent" },
  t: "Au parloir, $proche t'apporte une tarte aux pommes, que le surveillant fouille longuement. Tu manges un bout à travers la vitre, les yeux humides.",
  c: [
    D("Remercier avec chaleur", "🫂", "Tu te sens moins seul{|e}. La peine est un peu plus douce.", { bonheur: 5, bonte: 2, rel: { proche: 10 } }),
    D("Reprocher à la famille son absence", "😡", "La visite se termine en dispute.", { bonheur: -3, rel: { proche: -12 } }),
  ],
});

ev("prison_gang_offre", {
  ages: [18, 65], tags: ["mature"], ic: "🕶️⛓️", w: 4, need: { prison: true },
  t: "Un caïd du préau t'invite à rejoindre son clan. Il dispose de cigarettes, de protection et d'une réputation redoutable. Il aime aussi le scrabble.",
  c: [
    C("Rejoindre le clan", "🤝", [O(0.6, "On te respecte, mais les ennuis ne sont jamais loin.", { repute: 2, courage: 3, honnete: -3, flag: "milieu_contact", sante: -1 }), O(0.4, "Une bagarre éclate. Tu perds des dents.", { sante: -6, bonheur: -3, prison: 1 })], { risk: 2 }),
    D("Refuser poliment", "🙏", "Il hausse les épaules. Tu restes à l'écart.", { prudent: 2, honnete: 1 }),
    D("Jouer au scrabble avec lui", "🔤", "Une amitié improbable naît autour d'un mot de sept lettres.", { creatif: 2, bonheur: 3, intel: 1 }),
  ],
});

ev("sortie_prison_reinsertion", {
  ages: [18, 90], tags: ["mature", "travail"], ic: "🔓🌅", w: 8, need: { flag: "ex_detenu", noprison: true, nojob: true }, once: false, cool: 4,
  t: "Te voilà libre, avec un casier et un sac de vêtements. Les employeurs sont frileux, les voisins aussi. Un nouveau départ est possible, avec un peu d'aide.",
  c: [
    D("Chercher un emploi honnête", "📬", "Après des semaines de refus, une petite entreprise te donne ta chance.", { honnete: 3, ambition: 2, bonheur: 3, jobHunt: true }),
    D("Retourner dans le milieu", "🕶️", "Les anciennes connaissances t'accueillent à bras ouverts.", { honnete: -3, job: "crime:0", bonheur: 0 }),
    D("Créer son petit commerce", "🧺", "Une carriole de fruits au marché. Modeste mais à toi.", { ambition: 2, creatif: 2, job: "libre:0", bonheur: 3 }),
  ],
});

ev("justice_amende_radar", {
  ages: [18, 85], tags: ["mature"], ic: "📸🚗", w: 4, need: { asset: "voiture" },
  t: "Un flash éclate sur la route de campagne. Ton visage grimaçant va finir sur une lettre recommandée avec une photo peu flatteuse.",
  c: [
    D("Payer l'amende", "💳", "Ça fait mal au portefeuille mais le flash t'a fait sourire.", { argent: -135, bonheur: -1, record: 0 }),
    C("Désigner quelqu'un d'autre", "🎭", [O(0.4, "Personne ne vérifie. Tu t'en tires.", { honnete: -3 }), O(0.6, "Fraude constatée, amende doublée.", { argent: -450, honnete: -3, record: 1 })], { risk: 1 }),
    D("Contester pour le principe", "📮", "La lettre revient tamponnée « refusé ».", { argent: -135, honnete: 1 }),
  ],
});

ev("proposition_milieu", {
  ages: [18, 50], tags: ["mature", "argent"], ic: "🕶️🥃", w: 3, need: { noflag: "illicite", job: { illicit: false } },
  t: "Dans un bar enfumé, un inconnu en costume rayé t'offre un verre. « J'ai du boulot pour quelqu'un de ton talent. Discret, bien payé. »",
  c: [
    C("Écouter sa proposition", "🕶️", [O(0.6, "Il te propose un petit travail sans question. Ça paie bien.", { argent: 2500, honnete: -4, flag: "milieu_contact" }), O(0.4, "C'est un policier infiltré. Il te suit désormais.", { honnete: -1, record: 1, prudent: 2 })], { risk: 2 }),
    D("Décliner", "🚪", "Tu paies ton verre et tu pars.", { honnete: 2, prudent: 2 }),
    D("L'ignorer et alerter le patron du bar", "📞", "Le patron blêmit et appelle quelqu'un.", { honnete: 3, bonheur: 0 }),
  ],
});

flash("Tu entends une sirène dans la nuit. Elle passe à côté de toi sans s'arrêter.", { prudent: 1 }, { ages: [16, 70], tag: "mature" });
flash("Un voisin se fait voler son nain de jardin. Il accuse tout le quartier.", { bonheur: 0 }, { ages: [16, 90], tag: "mature" });
flash("La police fait une descente dans le bar d'à côté. Tu bois ton café à la maison.", { prudent: 1 }, { ages: [18, 70], tag: "mature" });
flash("Un codétenu te prête un livre, que tu lis avec ferveur.", { intel: 1, bonheur: 1 }, { ages: [18, 90], need: { prison: true } });
flash("Le repas de la cantine est un plat de lentilles. Encore.", { bonheur: -1 }, { ages: [18, 90], need: { prison: true } });
flash("Tu écris une lettre à un proche. Les mots te font du bien.", { bonheur: 2, creatif: 1 }, { ages: [18, 90], need: { prison: true } });
