// Charge les fichiers de choix de vie listés ici. Un fichier absent de la liste est ignoré, ce qui évite qu'un ancien fichier resté dans le dépôt provoque des doublons.
const fs = require("fs");
const path = require("path");
const FILES = [
  "10_ecole.js",
  "20_amour.js",
  "30_travail.js",
  "40_argent.js",
  "50_sante_loisirs.js",
  "60_lunaire_trash.js",
  "70_senior_prison.js",
  "80_richesse.js",
  "90_extremes.js",
  "92_parcours.js",
  "95_pro_bureau.js",
  "96_pro_terrain_scene.js",
  "97_pro_ombre_mafia.js",
];
FILES.forEach((f) => require(path.join(__dirname, f)));
