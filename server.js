// ============================================================
// PICUITE GAMES — Serveur du site
// Un seul serveur Express héberge l'accueil et tous les jeux.
// Chaque jeu vit dans games/<id>/ avec un fichier game.json (fiche de présentation)
// et un server.js qui exporte une fonction mount(server, prefix) renvoyant un routeur Express.
// Pour ajouter un jeu plus tard, il suffit de déposer un nouveau dossier dans games/
// et son logo dans public/logos/, rien d'autre à modifier ici.
// ============================================================
const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

// ---------- découverte des jeux ----------
const GAMES_DIR = __dirname;
const NOT_GAMES = new Set(["node_modules", "public"]);
const games = [];
fs.readdirSync(GAMES_DIR, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith(".") && !NOT_GAMES.has(d.name)).forEach((d) => {
  const dir = path.join(GAMES_DIR, d.name);
  const metaFile = path.join(dir, "game.json");
  const serverFile = path.join(dir, "server.js");
  if (!fs.existsSync(metaFile) || !fs.existsSync(serverFile)) return;
  try {
    const meta = JSON.parse(fs.readFileSync(metaFile, "utf8"));
    meta.id = d.name;
    const router = require(serverFile)(server, "/" + d.name);
    app.get("/" + d.name, (req, res, next) => {
      if (req.originalUrl.split("?")[0].endsWith("/")) return next();
      const q = req.originalUrl.indexOf("?");
      res.redirect(301, "/" + d.name + "/" + (q >= 0 ? req.originalUrl.slice(q) : ""));
    });
    app.use("/" + d.name, router);
    games.push(meta);
  } catch (e) { console.error("Jeu ignoré", d.name, e); }
});
games.sort((a, b) => (a.order || 99) - (b.order || 99));

app.get("/health", (req, res) => res.json({ ok: true, games: games.map((g) => g.id) }));
app.get("/api/games", (req, res) => res.json(games));
app.use(express.static(path.join(__dirname, "public"), { maxAge: 0 }));

server.listen(PORT, () => console.log("Picuite Games écoute sur le port " + PORT + " avec " + games.length + " jeux"));
