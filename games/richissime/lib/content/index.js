// Charge tous les fichiers de scènes du dossier.
const fs = require("fs");
const path = require("path");
const kit = require("../kit");
fs.readdirSync(__dirname).filter((f) => f.endsWith(".js") && f !== "index.js").sort().forEach((f) => require(path.join(__dirname, f)));
module.exports = kit;
