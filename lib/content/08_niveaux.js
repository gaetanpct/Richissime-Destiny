// Scènes propres à un niveau de fortune, pour que la vie d'un millionnaire ne ressemble pas à celle d'un fauché.
const { ev, O, C, D } = require("../kit");
const CORE = require("../core");

const NW = (p) => Math.max(0, CORE.netWorth(p));
const pct = (f, cap) => (p) => Math.round(Math.min(cap || 1e12, NW(p) * f));
const neg = (f, cap) => (p) => -Math.round(Math.min(cap || 1e12, NW(p) * f));

// ---------------------------------------------------------------------------------
// GRANDES FORTUNES
// ---------------------------------------------------------------------------------
ev("riche_forum_mondial", {
  ages: [30, 85], tags: ["social", "argent"], ic: "🌐🥂", w: 4, need: { net: [1500000, null] },
  t: "Un forum économique mondial t'invite, avec un badge doré, un hélicoptère et un programme chargé de conférences où l'on s'écoute parler. Les couloirs sont pleins de gens qui murmurent des chiffres.",
  c: [
    C("Y aller et nouer des alliances", "🤝", [
      O(0.55, "Tu repars avec trois cartes de visite précieuses et un accord de principe qui rapportera gros.", { argent: pct(0.03, 300000), repute: 4, ambition: 2, bonheur: 3 }),
      O(0.45, "Tu passes trois jours à sourire à des inconnus. Le champagne était bon, le résultat plus mince.", { argent: neg(0.002, 20000), bonheur: 1 }),
    ]),
    D("Envoyer ton bras droit à ta place", "🧑‍💼", "Il revient avec un dossier. Tu restes tranquille chez toi, avec ton thé et ton chien.", { bonheur: 2, prudent: 1 }),
  ],
});

ev("riche_enfant_depensier", {
  ages: [38, 85], tags: ["famille", "argent"], ic: "💸👨‍👧", w: 4, need: { net: [800000, null], kids: [1, null], rel: "child" }, who: { enfant: "child" },
  t: "$enfant a pris goût au luxe plus vite que prévu. Cartes bancaires, voyages et un garage rempli de voitures que personne ne conduit. L'addition arrive, avec un grand sourire.",
  c: [
    C("Couper les vivres pour lui apprendre la vie", "✂️", [
      O(0.6, "Le choc est rude, mais $enfant finit par trouver un vrai métier. La famille sait désormais ce que coûte un croissant.", { rel: { enfant: -8 }, bonheur: -2, prudent: 2 }),
      O(0.4, "$enfant te boude pendant des années, et passe chez ton ennemi juré pour se faire inviter à dîner.", { rel: { enfant: -25 }, bonheur: -5 }),
    ]),
    D("Continuer à payer sans compter", "💳", "Tu paies, encore et encore. $enfant sourit, et tu lui souris, avec un frisson dans le dos.", { argent: neg(0.015, 150000), rel: { enfant: 8 }, bonheur: 1 }),
    D("Lui donner un poste dans ton entreprise", "🏢", "$enfant s'ennuie à mourir, fait quelques bêtises, mais apprend à poser une signature sans trembler.", { rel: { enfant: 4 }, bonheur: 1, ambition: 1 }),
  ],
});

ev("riche_assistant_detourne", {
  ages: [30, 85], tags: ["argent"], ic: "🕵️💶", w: 3, need: { net: [1200000, null] },
  t: "Ton assistant personnel de longue date a pris l'habitude de se servir. Des virements discrets, des factures fantômes, et une maison de vacances dans un village de carte postale.",
  c: [
    C("Le confronter tout de suite", "🔥", [
      O(0.6, "Il pleure, avoue, et rembourse une partie. Tu le renvoies avec un regard glacé.", { argent: neg(0.01, 80000), bonheur: -4, honnete: 1 }),
      O(0.4, "Il a déjà tout dépensé. Tu le renvoies, et tu perds beaucoup plus que prévu.", { argent: neg(0.035, 300000), bonheur: -7 }),
    ]),
    C("Faire intervenir la police", "🚓", [
      O(0.5, "L'enquête est efficace. Une partie de l'argent est récupérée, et ton ancien assistant passe quelques années en prison.", { argent: neg(0.008, 60000), repute: 2, bonheur: -3 }),
      O(0.5, "L'enquête s'enlise, et la presse s'amuse de l'histoire. Tu perds de l'argent et un peu de dignité.", { argent: neg(0.03, 250000), repute: -3, bonheur: -6 }),
    ]),
  ],
});

ev("riche_paparazzi_chantage", {
  ages: [28, 85], tags: ["social", "mature"], ic: "📸🕶️", w: 3, need: { net: [1000000, null] },
  t: "Un photographe a surpris une scène embarrassante lors de tes dernières vacances. Il te l'annonce poliment par message, en mentionnant un prix qui ressemble à une mensualité de cadre.",
  c: [
    C("Payer pour étouffer l'affaire", "💶", [
      O(0.55, "L'affaire est enterrée. Le photographe repart avec ton chèque et un grand sourire.", { argent: neg(0.01, 80000), bonheur: -3 }),
      O(0.45, "Il revient trois mois plus tard avec une nouvelle demande, et les mêmes photos.", { argent: neg(0.02, 150000), bonheur: -6, honnete: -1 }),
    ]),
    D("Publier toi-même un communiqué amusé", "📣", "Tu prends les devants avec humour. L'opinion rit, puis passe à autre chose, avec une certaine sympathie.", { repute: 2, bonheur: 2, courage: 2 }),
    D("Le poursuivre en justice", "⚖️", "Le procès dure des mois. Tu gagnes, et tu y perds quelques semaines de sommeil.", { argent: neg(0.004, 30000), repute: 1, bonheur: -2 }),
  ],
});

ev("riche_vol_bijoux", {
  ages: [30, 90], tags: ["argent"], ic: "💎🦹", w: 3, need: { net: [1500000, null] },
  t: "En rentrant d'un dîner, tu constates que le coffre-fort est ouvert. Les bijoux de famille ont disparu, avec une dizaine de montres et un tableau que tu n'aimais pas, mais qui valait cher.",
  c: [
    C("Compter sur l'assurance", "📋", [
      O(0.6, "L'assurance paie, après un long interrogatoire et beaucoup de papier.", { argent: neg(0.004, 40000), bonheur: -4 }),
      O(0.4, "L'assurance estime que le coffre n'était pas assez protégé. Elle paie une toute petite part.", { argent: neg(0.025, 200000), bonheur: -7 }),
    ]),
    C("Engager une équipe privée pour retrouver les voleurs", "🕶️", [
      O(0.45, "L'équipe retrouve les bijoux à l'étranger, chez un recéleur dépité.", { argent: neg(0.006, 50000), bonheur: 5, repute: 2 }),
      O(0.55, "L'équipe te facture des heures magnifiques et ne retrouve rien du tout.", { argent: neg(0.02, 180000), bonheur: -6 }),
    ]),
  ],
});

ev("riche_proposition_rachat", {
  ages: [32, 80], tags: ["argent", "travail"], ic: "🤝💰", w: 4, need: { net: [1000000, null], asset: "entreprise" },
  t: "Un grand groupe t'écrit pour racheter ton entreprise. Le chiffre proposé est généreux, la lettre pleine de promesses et de grands sourires de façade.",
  c: [
    C("Vendre et profiter", "🏖️", [O(1, "La vente est conclue. Tu empoches un énorme chèque, tu t'offres un grand voyage, et tu réalises que tu vas devoir t'occuper autrement.", { argent: 450000, sell: "entreprise", bonheur: 6, flag: "a_vendu" })]),
    D("Refuser et continuer l'aventure", "🧗", "Tu gardes les commandes. Ton équipe est ravie, et tu portes encore un peu de ce regret délicieux.", { ambition: 3, bonheur: 3 }),
    C("Négocier un prix plus haut", "🎯", [
      O(0.5, "Le groupe s'aligne, après des jours de bras de fer. Tu vends bien plus cher que prévu.", { argent: 900000, sell: "entreprise", bonheur: 8 }),
      O(0.5, "Le groupe se retire et rachète ton concurrent. Tu gardes ton entreprise, avec un petit goût d'occasion manquée.", { bonheur: -4 }),
    ]),
  ],
});

ev("riche_jet_panne", {
  ages: [30, 90], tags: ["voyage", "loufoque"], ic: "🛩️🧯", w: 3, need: { net: [3000000, null] },
  t: "Ton jet privé tombe en panne à l'autre bout du monde, entre un désert et un buffet décevant. Le pilote parle d'une pièce rare, qui doit arriver d'un autre continent.",
  c: [
    D("Acheter un autre jet sur place", "💵", "Tu sors un chéquier. L'aéroport t'applaudit, ton comptable pleure.", { argent: neg(0.02, 600000), bonheur: 3, repute: 1 }),
    D("Rentrer en vol régulier, en classe économique", "💺", "Tu découvres l'espace pour les jambes, la cuisine en barquette, et une grand-mère qui te raconte sa vie. Tu n'as jamais autant ri.", { bonheur: 5, sociable: 2 }),
    D("Attendre dans un hôtel de luxe", "🏨", "Trois jours de spa, de cocktails et de massages. Ta fortune encaisse, ton moral aussi.", { argent: neg(0.001, 30000), bonheur: 4 }),
  ],
});

ev("riche_visite_ancienne_boite", {
  ages: [38, 85], tags: ["travail", "social"], ic: "🏢👀", w: 3, need: { net: [1500000, null], fn: (p) => p.jobHistory.length > 0 },
  t: "Tu repasses devant l'ancienne entreprise où tu as commencé. L'accueil te reconnaît, la direction te court après, et un stagiaire te demande s'il peut un jour avoir ton bureau.",
  c: [
    D("Offrir une bourse aux stagiaires", "🎓", "Les jeunes t'applaudissent. Tu sens que ta réussite a un sens, et c'est agréable.", { argent: neg(0.003, 40000), repute: 4, bonte: 3, bonheur: 4 }),
    D("Prendre un café avec ton premier patron", "☕", "Il a vieilli, il a rapetissé, et il répète les mêmes blagues. Tu réalises que le temps passe pour tout le monde.", { bonheur: 3, bonte: 2 }),
    D("Faire un discours de coach un peu pompeux", "🎤", "Tu parles longuement de persévérance. Les gens notent « sympa », sans trop croire un mot.", { repute: 1, bonheur: 1 }),
  ],
});

// ---------------------------------------------------------------------------------
// PETITS BUDGETS
// ---------------------------------------------------------------------------------
ev("pauvre_fin_de_mois", {
  ages: [18, 85], tags: ["argent"], ic: "🥫📉", w: 5, need: { net: [null, 2500] },
  t: "Il reste huit jours avant la fin du mois, et trois euros sur le compte. Le frigo contient un pot de moutarde, une carotte et un reste de riz qui a vécu.",
  c: [
    D("Faire le tour des soldes et des invendus", "🛒", "Tu rentres avec un sac de fruits abîmés, du pain de la veille et une grande fierté. Tu manges mieux que prévu.", { argent: -20, bonheur: 1, prudent: 1 }),
    D("Demander à dîner à des amis", "🍽️", "Tu t'invites avec élégance. Ils comprennent, ils ont tous déjà été là.", { bonheur: 3, sociable: 2 }),
    C("Jouer quelques euros à un jeu de grattage", "🎟️", [
      O(0.12, "Un gain inattendu. Tu l'encaisses en sautillant jusqu'au bureau de tabac.", { argent: 600, bonheur: 5 }),
      O(0.88, "Rien. Il ne reste plus qu'un peu de poussière argentée sous tes ongles.", { argent: -5, bonheur: -2 }),
    ]),
  ],
});

ev("pauvre_facture_imprevue", {
  ages: [18, 85], tags: ["argent"], ic: "🧾😱", w: 5, need: { net: [null, 4000] },
  t: "Une facture que tu n'attendais pas arrive dans la boîte aux lettres. Réparation, taxe oubliée ou contravention, peu importe, le montant ressemble à ton budget de quinze jours.",
  c: [
    D("La payer tout de suite pour ne plus y penser", "💶", "Tu règles, et tu avales ta salive. Ça va, tu survivras.", { argent: -700, bonheur: -3 }),
    C("Demander un étalement", "📞", [
      O(0.65, "On accepte un étalement, avec des frais. Tu respires.", { argent: -150, dette: 600, bonheur: -1 }),
      O(0.35, "On refuse, avec une phrase très polie. Tu paies plus cher, plus tard.", { dette: 900, bonheur: -4 }),
    ]),
    D("Faire semblant de ne pas l'avoir vue", "🙈", "Elle disparaît sous la pile de courrier. Elle reviendra, avec ses amies les pénalités.", { dette: 1000, bonheur: -1, prudent: -2 }),
  ],
});

ev("pauvre_petit_coup_de_chance", {
  ages: [16, 90], tags: ["chance", "argent"], ic: "🍀🪙", w: 4, need: { net: [null, 6000] },
  t: "En ramassant une pièce tombée, tu trouves un billet plié sous le banc. Il y a aussi une enveloppe avec un nom, une adresse et un numéro de téléphone.",
  c: [
    D("Rendre l'enveloppe à son propriétaire", "📮", "La personne te remercie, les larmes aux yeux, et te donne une petite récompense. Ton karma, lui, est au plus haut.", { argent: 250, bonte: 3, repute: 2, bonheur: 4 }),
    D("Garder le billet, rendre l'enveloppe", "😇", "Tu gardes le billet, tu postes l'enveloppe. Ta conscience est à peu près tranquille.", { argent: 80, bonheur: 2 }),
    D("Tout garder", "🤑", "Ta journée s'améliore tout de suite. Ta conscience, un peu moins.", { argent: 330, honnete: -3, bonheur: 1 }),
  ],
});
