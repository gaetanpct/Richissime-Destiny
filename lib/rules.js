// ============================================================
// RICHISSIME DESTINY — Constantes du jeu
// ============================================================
const STATS = {
  sante: { l: "Santé", ic: "❤️" },
  bonheur: { l: "Bonheur", ic: "😊" },
  intel: { l: "Intelligence", ic: "🧠" },
  charme: { l: "Charme", ic: "✨" },
  sport: { l: "Forme", ic: "💪" },
  repute: { l: "Réputation", ic: "📣" },
};
const TRAITS = {
  courage: { l: "Courage", ic: "🦁" },
  bonte: { l: "Bonté", ic: "💗" },
  ambition: { l: "Ambition", ic: "🚀" },
  sociable: { l: "Sociabilité", ic: "🎉" },
  honnete: { l: "Honnêteté", ic: "⚖️" },
  creatif: { l: "Créativité", ic: "🎨" },
  prudent: { l: "Prudence", ic: "🛡️" },
};

// Dons de naissance, choisis à la création du personnage
const GIFTS = {
  cerveau: { l: "Petit génie", ic: "🧠", d: "+20 Intelligence. Les études te seront plus faciles.", stats: { intel: 20 } },
  charme: { l: "Beau gosse", ic: "✨", d: "+20 Charme et +5 Réputation. Tout le monde t'adore.", stats: { charme: 20, repute: 5 } },
  sante: { l: "Santé de fer", ic: "💪", d: "+15 Santé et +10 Forme. Tu vivras probablement plus longtemps.", stats: { sante: 15, sport: 10 } },
  chance: { l: "Ange gardien", ic: "😇", d: "Tu survis à une mort certaine, une fois dans ta vie.", flags: ["ange_gardien"] },
  famille: { l: "Fonds fiduciaire", ic: "🏦", d: "Une tante riche te lègue 8 000 € à tes 18 ans.", flags: ["fiducie"] },
  bagout: { l: "Grande gueule", ic: "🗣️", d: "+10 Charme, +15 Sociabilité. Tes actions envers les autres joueurs réussissent plus souvent.", stats: { charme: 10 }, traits: { sociable: 15 }, flags: ["bagout"] },
};

// Tranches d'âge
function stageOf(age) {
  if (age < 12) return "enfance";
  if (age < 18) return "ado";
  if (age < 30) return "jeune";
  if (age < 60) return "adulte";
  return "senior";
}
const STAGE_LABEL = { enfance: "Enfance", ado: "Adolescence", jeune: "Jeunesse", adulte: "Âge adulte", senior: "Sagesse" };

// Niveaux de vie, choisis librement. Le coût multiplie les dépenses courantes.
const LIFESTYLES = {
  frugal: { l: "Sobre", ic: "🥔", cost: 0.7, bonheur: -1, d: "Dépenses réduites de 30 %, un peu moins de joie." },
  normal: { l: "Normal", ic: "🏠", cost: 1, bonheur: 0, d: "Un train de vie tranquille." },
  luxe: { l: "Luxueux", ic: "🥂", cost: 2.2, bonheur: 2, d: "Dépenses ×2,2, beaucoup de bonheur et de réputation." },
  folie: { l: "Démesuré", ic: "🛥️", cost: 4, bonheur: 3, d: "Dépenses ×4. Yachts, caviar, paparazzis." },
};

// Diplômes. rank = niveau d'études.
const DIPLOMAS = {
  aucun: { rank: 0, l: "Aucun diplôme" },
  brevet: { rank: 1, l: "Brevet" },
  bacpro: { rank: 2, l: "Bac pro ou CAP" },
  bac: { rank: 3, l: "Baccalauréat" },
  licence: { rank: 4, l: "Licence ou BTS" },
  master: { rank: 5, l: "Master" },
  doctorat: { rank: 6, l: "Doctorat" },
};

// Métiers. levels = [titre, salaire annuel net]
const TRACKS = {
  resto: { l: "Restauration", ic: "🍳", edu: 0, age: 16, stat: "creatif", stress: 2, levels: [["Plongeur", 16000], ["Serveur", 19500], ["Cuisinier", 25000], ["Chef de cuisine", 38000], ["Chef étoilé", 85000]] },
  commerce: { l: "Commerce", ic: "🛍️", edu: 0, age: 16, stat: "charme", stress: 1, levels: [["Vendeur", 18000], ["Chef de rayon", 25500], ["Directeur de magasin", 44000], ["Directeur régional", 72000], ["Roi du rayon surgelés", 120000]] },
  btp: { l: "Bâtiment", ic: "🧱", edu: 0, age: 16, stat: "sport", stress: 2, danger: 1, levels: [["Apprenti maçon", 15500], ["Ouvrier qualifié", 23000], ["Chef de chantier", 36000], ["Entrepreneur du bâtiment", 72000], ["Magnat du béton", 140000]] },
  sante: { l: "Santé", ic: "🩺", edu: 2, age: 18, stat: "intel", stress: 3, levels: [["Aide-soignant", 22000], ["Infirmier", 31000], ["Médecin", 72000], ["Chirurgien", 145000], ["Professeur de médecine", 195000]], gate: [2, 4, 5, 5, 5] },
  droit: { l: "Droit", ic: "⚖️", edu: 4, age: 22, stat: "charme", stress: 2, levels: [["Clerc de notaire", 27000], ["Avocat junior", 42000], ["Avocat", 70000], ["Associé du cabinet", 130000], ["Star du barreau", 260000]], gate: [4, 5, 5, 5, 5] },
  tech: { l: "Informatique", ic: "💻", edu: 2, age: 18, stat: "intel", stress: 2, levels: [["Technicien", 25000], ["Développeur", 40000], ["Lead développeur", 62000], ["Directeur technique", 115000], ["Licorne de la tech", 320000]], gate: [2, 4, 4, 5, 5] },
  finance: { l: "Finance", ic: "📈", edu: 4, age: 22, stat: "intel", stress: 3, levels: [["Assistant financier", 32000], ["Trader", 65000], ["Gérant de fonds", 115000], ["Directeur financier", 210000], ["Golden boy", 480000]], gate: [4, 5, 5, 5, 5] },
  enseignement: { l: "Enseignement", ic: "🍎", edu: 3, age: 20, stat: "charme", stress: 2, levels: [["Surveillant", 18500], ["Instituteur", 29000], ["Professeur", 39000], ["Directeur d'école", 54000], ["Inspecteur d'académie", 68000]], gate: [3, 4, 4, 5, 5] },
  arts: { l: "Arts et spectacle", ic: "🎭", edu: 0, age: 16, stat: "creatif", stress: 2, variable: 0.7, levels: [["Artiste de rue", 9000], ["Musicien de bar", 15000], ["Comédien", 24000], ["Auteur reconnu", 52000], ["Star internationale", 280000]] },
  sportpro: { l: "Sport professionnel", ic: "🏅", edu: 0, age: 16, stat: "sport", stress: 2, danger: 1, maxAge: 40, levels: [["Sportif amateur", 11000], ["Pro de deuxième division", 42000], ["Pro de première division", 125000], ["Vedette nationale", 520000], ["Légende vivante", 1200000]], minStat: ["sport", 60] },
  politique: { l: "Politique", ic: "🏛️", edu: 3, age: 21, stat: "charme", stress: 3, levels: [["Militant", 12000], ["Conseiller municipal", 29000], ["Maire", 48000], ["Député", 95000], ["Ministre", 170000]], gate: [3, 4, 4, 5, 5] },
  ordre: { l: "Sécurité", ic: "🚓", edu: 1, age: 18, stat: "courage", stress: 3, danger: 2, levels: [["Recrue", 21000], ["Gendarme", 28500], ["Officier", 43000], ["Commissaire", 66000], ["Général", 105000]] },
  science: { l: "Recherche", ic: "🔬", edu: 5, age: 24, stat: "intel", stress: 2, levels: [["Doctorant", 19000], ["Chercheur", 40000], ["Directeur de recherche", 68000], ["Académicien", 105000], ["Prix Nobel de la tarte", 160000]], gate: [5, 6, 6, 6, 6] },
  libre: { l: "Indépendant", ic: "🧰", edu: 0, age: 18, stat: "ambition", stress: 3, variable: 1.1, levels: [["Auto-entrepreneur", 13000], ["Freelance", 31000], ["Patron de PME", 74000], ["Grand patron", 190000], ["Magnat", 520000]] },
  transport: { l: "Transport", ic: "🚚", edu: 0, age: 18, stat: "sport", stress: 2, danger: 1, levels: [["Livreur", 19500], ["Chauffeur routier", 25500], ["Pilote de ligne", 90000], ["Commandant de bord", 140000]], gate: [0, 0, 4, 4] },
  media: { l: "Médias", ic: "🎤", edu: 0, age: 17, stat: "charme", stress: 2, variable: 0.5, levels: [["Stagiaire", 8000], ["Chroniqueur", 25000], ["Animateur télé", 62000], ["Star de la télé-réalité", 180000], ["Roi des plateaux", 420000]] },
  agri: { l: "Agriculture", ic: "🌾", edu: 0, age: 16, stat: "sport", stress: 2, danger: 1, levels: [["Ouvrier agricole", 17000], ["Exploitant", 28000], ["Viticulteur", 48000], ["Grand domaine", 98000]] },
  cirque: { l: "Cirque et magie", ic: "🎪", edu: 0, age: 16, stat: "creatif", stress: 1, variable: 0.6, levels: [["Clown", 14000], ["Jongleur", 19000], ["Funambule", 30000], ["Directeur de cirque", 60000], ["Magicien légendaire", 170000]] },
  public: { l: "Fonction publique", ic: "🏢", edu: 2, age: 18, stat: "intel", stress: 1, levels: [["Guichetier", 24500], ["Chef de bureau", 36500], ["Directeur de service", 60000], ["Préfet", 92000]], gate: [2, 3, 4, 5] },
  hotel: { l: "Tourisme et hôtellerie", ic: "🏨", edu: 0, age: 17, stat: "charme", stress: 2, levels: [["Réceptionniste", 20000], ["Guide", 24500], ["Directeur d'hôtel", 52000], ["Hôtelier de luxe", 110000]] },
  immo: { l: "Immobilier", ic: "🏘️", edu: 2, age: 20, stat: "charme", stress: 2, variable: 0.6, levels: [["Agent immobilier", 27000], ["Négociateur star", 52000], ["Directeur d'agence", 85000], ["Promoteur", 230000]], gate: [2, 2, 4, 4] },
  ingenierie: { l: "Ingénierie", ic: "⚙️", edu: 4, age: 22, stat: "intel", stress: 2, levels: [["Technicien", 29000], ["Ingénieur", 44000], ["Chef de projet", 68000], ["Directeur technique", 105000], ["Inventeur célèbre", 190000]], gate: [4, 5, 5, 5, 5] },
  presse: { l: "Journalisme", ic: "📰", edu: 3, age: 20, stat: "intel", stress: 2, levels: [["Pigiste", 14500], ["Journaliste", 30000], ["Rédacteur en chef", 56000], ["Patron de presse", 105000]], gate: [3, 4, 4, 5] },
  crime: { l: "Milieu", ic: "🕶️", edu: 0, age: 16, stat: "courage", stress: 3, danger: 2, illicit: true, mature: true, variable: 1.0, levels: [["Pickpocket", 10000], ["Cambrioleur", 32000], ["Escroc", 62000], ["Chef de gang", 160000], ["Parrain", 520000]] },
};

Object.assign(TRACKS, require("./tracks_extra"));
Object.assign(TRACKS, require("./tracks_more"));
// métiers de passion, acceptés même quand on n'a pas besoin d'argent
["peintre", "photo", "artisan", "paysagiste", "biblio", "clerge", "explorateur", "patisserie", "cirque", "danse", "humour", "chanteur", "dj", "cinema", "tatoueur", "gamedev", "createur", "arts", "mode", "archi", "veto", "voyante", "detective", "coiffeur", "enseignement"].forEach((k) => { if (TRACKS[k]) TRACKS[k].passion = true; });

// Actifs achetables. g = rendement moyen, v = volatilité (écart-type) annuels.
const ASSET_KINDS = {
  // ---- placements libres (menu Finance). risk va de 0 (aucun risque) à 5 (tout ou rien) ----
  livret: { l: "Livret d'épargne", ic: "🐖", g: 0.02, v: 0.0, liquid: true, risk: 0, d: "Aucun risque, mais ça rapporte à peine plus que l'inflation." },
  obligations: { l: "Obligations d'État", ic: "📜", g: 0.034, v: 0.025, liquid: true, risk: 1, d: "Presque sans risque, un peu mieux que le livret." },
  or: { l: "Or et bijoux", ic: "🥇", g: 0.03, v: 0.1, liquid: true, risk: 2, d: "Valeur refuge. Il brille, il bouge peu." },
  pierre: { l: "Pierre-papier (immobilier de bureaux)", ic: "🏢", g: 0.047, v: 0.06, liquid: true, risk: 2, d: "Des loyers sans se salir les mains, avec de petites crises de temps en temps." },
  etf: { l: "Indice mondial", ic: "🌍", g: 0.052, v: 0.12, liquid: true, risk: 2, d: "Tout le marché dans un seul panier. Solide sur la durée." },
  actions: { l: "Actions", ic: "📊", g: 0.05, v: 0.22, liquid: true, risk: 3, floor: -0.5, d: "Des entreprises triées sur le volet, avec des années folles et des années moches." },
  matieres: { l: "Matières premières", ic: "🛢️", g: 0.045, v: 0.3, liquid: true, risk: 3, floor: -0.6, d: "Pétrole, blé, cuivre. Ça monte, ça plonge, ça surprend." },
  crypto: { l: "Cryptos", ic: "🪙", g: 0.07, v: 0.75, liquid: true, risk: 4, jackpot: [0.04, 14], floor: -0.92, d: "Des montagnes russes. Le plus souvent tu perds, mais une fois de temps en temps ta position est multipliée par plus de dix." },
  startup: { l: "Start-ups (capital-risque)", ic: "🦄", g: -0.02, v: 0.06, liquid: false, risk: 5, jackpot: [0.03, 9], crash: [0.3, 0.55], floor: -0.9, d: "Presque tout s'effondre, mais une fois sur trente la part est multipliée par neuf." },
  levier: { l: "Produits à effet de levier", ic: "🎲", g: -0.06, v: 0.9, liquid: true, risk: 5, jackpot: [0.06, 4], floor: -0.9, d: "Le casino en costume. Un coup de génie rapporte beaucoup, un mauvais coup te rase." },
  // ---- biens et objets ----
  immo: { l: "Immobilier", ic: "🏠", g: 0.03, v: 0.06, liquid: false, risk: 2 },
  voiture: { l: "Voiture", ic: "🚗", g: -0.12, v: 0.03, liquid: false, risk: 0 },
  entreprise: { l: "Entreprise", ic: "🏭", g: 0.04, v: 0.4, liquid: false, risk: 4 },
  art: { l: "Œuvre d'art", ic: "🖼️", g: 0.03, v: 0.28, liquid: false, risk: 3 },
  loufoque: { l: "Trésor farfelu", ic: "🦄", g: 0.0, v: 0.2, liquid: false, risk: 3 },
};
// Placements disponibles dans le menu Finance (investissement libre), du plus sûr au plus risqué
const INVEST_KINDS = ["livret", "obligations", "or", "pierre", "etf", "actions", "matieres", "crypto", "startup", "levier"];

// Risque de mort naturelle par an, selon l'âge (avant modificateurs)
const MORTALITY = [[0, 0.0002], [15, 0.0006], [25, 0.0009], [40, 0.0025], [50, 0.007], [60, 0.017], [70, 0.042], [80, 0.105], [90, 0.25], [100, 0.42], [108, 0.6]];
function baseMortality(age) {
  for (let i = 0; i < MORTALITY.length - 1; i++) {
    const [a, m] = MORTALITY[i], [b, n] = MORTALITY[i + 1];
    if (age >= a && age < b) return Math.exp(Math.log(m) + (Math.log(n) - Math.log(m)) * (age - a) / (b - a));
  }
  return MORTALITY[MORTALITY.length - 1][1];
}

const TIMERS = { none: 0, fast: 25, normal: 45, slow: 90 };

module.exports = {
  STATS, TRAITS, GIFTS, stageOf, STAGE_LABEL, LIFESTYLES, DIPLOMAS, TRACKS, ASSET_KINDS, INVEST_KINDS, baseMortality, TIMERS,
  // les choix de vie vivent dans life.js (chargé à la demande pour éviter un cycle de dépendances)
  get PROJECTS() { return require("./life").LIST; },
};
