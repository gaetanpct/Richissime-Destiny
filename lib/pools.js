// ============================================================
// RICHISSIME DESTINY — Réserves de mots (prénoms, lieux, objets farfelus…)
// ============================================================
const POOLS = {
  prenomsM: ["Gaspard", "Hector", "Basile", "Lucien", "Mortimer", "Oscar", "Raoul", "Théophile", "Anatole", "Bastien", "Casimir", "Dorian", "Éloi", "Firmin", "Gustave", "Hubert", "Ignace", "Jules", "Kévin", "Léopold", "Maxence", "Noé", "Octave", "Prosper", "Quentin", "Rodolphe", "Sacha", "Tancrède", "Urbain", "Valentin", "Wilfrid", "Yanis", "Zacharie", "Armand", "Bruno", "Cédric", "Désiré", "Étienne", "Félix", "Gilbert"],
  prenomsF: ["Capucine", "Mélusine", "Gisèle", "Prudence", "Agathe", "Berthe", "Clothilde", "Daphné", "Eulalie", "Fantine", "Gwendoline", "Honorine", "Iris", "Joséphine", "Kenza", "Léonie", "Margaux", "Noémie", "Ophélie", "Philomène", "Quitterie", "Rosalie", "Solène", "Typhaine", "Ursule", "Violette", "Wendy", "Yolande", "Zoé", "Albertine", "Bérénice", "Colette", "Delphine", "Églantine", "Fleur", "Ginette", "Héloïse", "Inès", "Jeanne", "Lola"],
  noms: ["Pétoncle", "de la Brioche", "Moustache", "Larbalète", "Dugland", "Troufion", "Pampalune", "Cassebonbon", "Marmiton", "Lagaffe", "Bidouillard", "Fourchu", "Tournesol", "Ventrebleu", "Poulpinet", "Grattecul", "Dubois-Sec", "Camembert", "Zinzin", "Bellegueule", "Machinchose", "Trouduc-Belair", "Pinsonnet", "Vadrouille", "Cornichon"],
  plats: ["gratin de nouilles", "soufflé au fromage", "tarte à la courgette", "poulet aux pruneaux", "ratatouille", "crêpes au thon", "pot-au-feu", "quiche aux navets", "gâteau de semoule", "tartiflette", "riz au lait salé", "sandwich triangle", "pizza ananas", "soupe de poireaux", "omelette norvégienne"],
  betes: ["hamster", "chat", "chien", "lapin", "perruche", "tortue", "poisson rouge", "cochon d'Inde", "furet", "canard", "chèvre", "escargot de compagnie", "dragon miniature", "poule", "lama"],
  objets: ["trottinette", "cerf-volant", "accordéon", "télescope", "vélo à trois roues", "yoyo géant", "casque de viking", "ukulélé", "château gonflable", "robot ménager", "pédalo", "canne à pêche", "mixeur vintage", "luge en plastique", "diapason"],
  lieux: ["la cantine", "la cour de récréation", "le parking du supermarché", "la gare", "le marché", "la piscine municipale", "la bibliothèque", "le café du coin", "la plage", "la forêt", "le toit de l'immeuble", "la salle des fêtes", "le garage", "le grenier", "la mairie"],
  villes: ["Saint-Glinglin", "Trouville-les-Oies", "Pampelune-sur-Mer", "Bourg-la-Moutarde", "Villeneuve-d'Ascot", "Montcornichon", "Lagrange-aux-Belles", "Sainte-Crêpe", "Castelnau-le-Grumeau", "Boulogne-sur-Brie", "Plouc-les-Bains", "Chantemerle", "Fontainebleu", "Rochefort-en-Folie", "Tourcoing-la-Pluie"],
  boites: ["Pschitt & Fils", "Mega Truc SA", "Biscotte Industries", "Zinzin Corp", "Rapido Gaufres", "Ouistiti Tech", "Grosbonnet Conseil", "Banque Tirelire", "Cabinet Fourchu", "Marmotte Assurances", "Chouchen Logistics", "Patapon Studio", "Goupil & Associés", "Les Éditions du Nez", "Moustache Capital"],
  pays: ["le Japon", "le Canada", "l'Islande", "le Maroc", "le Pérou", "l'Italie", "la Thaïlande", "le Portugal", "l'Australie", "la Norvège", "le Brésil", "la Grèce", "l'Écosse", "la Tunisie", "le Mexique"],
  passions: ["la poterie", "le yoga du rire", "l'escalade", "la pétanque", "le tricot", "le dressage de puces", "le skate", "la cuisine moléculaire", "la photographie", "le bricolage", "la danse country", "les échecs", "le jardinage", "l'astronomie", "le karaoké"],
  instruments: ["saxophone", "violon", "batterie", "flûte à bec", "guitare", "harpe", "tuba", "piano", "trompette", "accordéon"],
  cadeaux: ["un pull moche", "une boîte à musique", "un vélo", "une montre cassée", "un jeu de société", "un poisson rouge", "un livre de recettes", "une paire de chaussettes", "un puzzle de 5000 pièces", "un bon pour un massage"],
  sports: ["football", "natation", "tennis", "judo", "basket", "danse", "escrime", "gymnastique", "athlétisme", "équitation"],
  fruits: ["pomme", "poire", "banane", "ananas", "cerise", "mangue", "kiwi", "raisin", "melon", "fraise"],
  fous: ["un gnome de jardin parlant", "un nuage qui vous suit", "un perroquet comptable", "une chaussette vivante", "un fantôme timide", "un pigeon voyageur de commerce", "une tarte en colère", "un moustique avocat", "un cactus philosophe", "un robot-aspirateur rebelle"],
};

// Prénoms de la bande d'amis (liste fournie par Ines). Ils tombent au hasard comme personnages secondaires.
const BANDE = {
  f: ["Celia", "Philippine", "Ninon", "Dilek", "Niousha", "Houda", "Mae", "Apolline", "Eva", "Paloma", "Justine", "Léa", "Isaure", "Marie", "Inès", "Fernanda", "Angii", "Angelina", "Maxine", "Maud", "Camille", "Albane", "Maëlys", "Aliénor", "Melissa"],
  m: ["Tom", "Teddy", "Léon", "Gaétan", "Alban", "Enzo", "Sebastian", "Thomas", "Nathan", "Auguste", "Adrien", "Aymeric", "Ayoub", "Eliot", "Xavier", "Jules", "Stanel", "Luan", "Armand", "Push", "Geff", "Djily", "Florian", "Baptistin"],
};
POOLS.bande = BANDE;
// Stars et célébrités entièrement inventées
POOLS.stars = [
  { n: "Zélie Moonlight", g: "f", j: "la chanteuse pop aux douze millions d'abonnés" },
  { n: "Rocco Diamante", g: "m", j: "la vedette de cinéma qui ne sourit jamais sur les photos" },
  { n: "Mamie Turbo", g: "f", j: "la grand-mère devenue reine du rap" },
  { n: "Baptiste Lumière", g: "m", j: "le youtubeur le plus suivi du pays" },
  { n: "Ginevra Stella", g: "f", j: "la diva d'opéra qui casse les verres à vin" },
  { n: "Tonio Pépito", g: "m", j: "le footballeur à la coupe de cheveux légendaire" },
  { n: "Lady Cornichon", g: "f", j: "l'humoriste qui fait hurler de rire les stades" },
  { n: "Max Voltage", g: "m", j: "le DJ qui remplit les stades à lui tout seul" },
  { n: "Calypso Vanderbilt", g: "f", j: "l'héritière scandaleuse des tabloïds" },
  { n: "Gaston Magnifico", g: "m", j: "le magicien milliardaire" },
  { n: "Perle Delacroix", g: "f", j: "la mannequin des défilés les plus fous" },
  { n: "Orson Blackwood", g: "m", j: "l'écrivain mystérieux qui n'a jamais montré son visage" },
  { n: "Nina Tornade", g: "f", j: "la championne de tennis au service meurtrier" },
  { n: "Prince Marmaduke", g: "m", j: "le prince d'un royaume de poche" },
  { n: "Sacha Neon", g: "m", j: "la star du streaming qui joue vingt heures par jour" },
  { n: "Dolores Lamour", g: "f", j: "la comédienne de feuilletons qui pleure sur commande" },
];
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function firstName(rng, gender, bande) {
  if (bande && rng() < bande) return pick(rng, gender === "f" ? BANDE.f : BANDE.m);
  return pick(rng, gender === "f" ? POOLS.prenomsF : POOLS.prenomsM);
}
function fullName(rng, gender) { return firstName(rng, gender) + " " + pick(rng, POOLS.noms); }

module.exports = { POOLS, pick, firstName, fullName };
