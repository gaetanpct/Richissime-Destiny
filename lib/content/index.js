// Charge les fichiers de scènes listés ici. Un fichier absent de la liste est ignoré, ce qui évite qu'un ancien fichier resté dans le dépôt provoque des doublons.
const fs = require("fs");
const path = require("path");
const FILES = [
  "05_vie.js",
  "06_metiers_fous.js",
  "07_chocs.js",
  "08_niveaux.js",
  "100_noir_jeunesse.js",
  "101_noir_adulte1.js",
  "102_noir_adulte2.js",
  "103_noir_adulte3.js",
  "10_enfance.js",
  "20_ecole.js",
  "30_ado.js",
  "40_jeune.js",
  "50_adulte.js",
  "60_senior.js",
  "70_tous.js",
  "80_metiers.js",
  "81_metiers2.js",
  "82_vocations.js",
  "85_crime.js",
  "90_amour.js",
  "95_sante.js",
  "96_maladies.js",
  "97_monde.js",
  "98_trash.js",
  "99_sagas.js",
];
const kit = require("../kit");
const { ev, flash, O, C, D } = kit;

ev("annee_tranquille", {
  chainOnly: true, once: false, tags: ["calme"], ic: "🌤️",
  t: "Une année sans grand événement. Les saisons passent, tu observes la vie autour de toi.",
  c: [
    D("Profiter de la routine", "☕", "Tu savoures le calme. Il y a des années comme ça.", { bonheur: 2 }),
    D("Tenter quelque chose de nouveau", "✨", "Tu essaies une nouveauté. Ça ne change pas ta vie, mais ça amuse.", { creatif: 2, bonheur: 1 }),
  ],
});

FILES.forEach((f) => require(path.join(__dirname, f)));
module.exports = kit;
