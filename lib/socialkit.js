// ============================================================
// RICHISSIME DESTINY — Kit des actions entre joueurs
// Chaque action est déclarée avec reg(). Chaque année, un joueur ne reçoit que quelques actions
// (réglage "Actions entre joueurs par année"). Elles changent d'une année à l'autre et dépendent
// de l'âge des deux joueurs, de leurs liens (affinité, rivalité, étapes déjà franchies) et de leur situation.
// Seules des informations publiques (âge, statut, couple, enfants, réputation) servent à proposer une action.
// ============================================================
const LIST = [];
const byId = Object.create(null);

// reg(spec)
//  id, grp           identifiant et famille (une famille ne prend pas toute la place)
//  l, ic, d          libellé, icône, description (texte ou fonction (A,g) qui rend un texte)
//  ages              [min, max] pour les deux joueurs
//  ok(g,A,B,b)       conditions supplémentaires pour cette cible (b est le lien entre les deux joueurs)
//  fit(g,A,B,b)      coefficient de pertinence (0 cache l'action pour cette cible)
//  w, cool, coolPair poids de tirage (défaut 5), années avant de reproposer à ce joueur (défaut 2), à cette cible (défaut 3)
//  prio              si > 0 l'action reste affichée tant qu'elle est possible (étape d'une relation)
//  mode              "offer" (l'autre doit répondre) ou "direct" (se produit sans son accord)
//  cost, split       coût payé par l'initiateur, ou partagé à parts égales si split
//  hostile, mature, loufoque   respectent les réglages
//  yes / direct      liste d'issues {w, a, b, ta, tb, bond, tag, untag, special, news}
//  no                {a, b, ta, tb, bond} si la cible refuse
//  legacy            action historique gérée directement par social.js
//  ui                champs à remplir (amount, loan, tier, game)
function reg(spec) {
  if (byId[spec.id]) throw new Error("action sociale en double " + spec.id);
  if (!spec.grp) spec.grp = "divers";
  if (!spec.mode) spec.mode = "offer";
  LIST.push(spec);
  byId[spec.id] = spec;
  return spec;
}

// ---------- liens entre deux joueurs ----------
function key(a, b) { return a < b ? a + "-" + b : b + "-" + a; }
function bond(g, a, b) {
  if (!g.bonds) g.bonds = {};
  const k = key(a, b);
  if (!g.bonds[k]) g.bonds[k] = { aff: 10, riv: 0, tags: {}, last: {} };
  return g.bonds[k];
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function touch(g, a, b, d) {
  const bd = bond(g, a, b);
  if (d.aff) bd.aff = clamp(bd.aff + d.aff, 0, 100);
  if (d.riv) bd.riv = clamp(bd.riv + d.riv, 0, 100);
  return bd;
}
function bondWord(g, A, B) {
  const bd = bond(g, A.seat, B.seat);
  if (A.partner && A.partner.player === B.seat) return A.partner.status === "marie" ? "conjoint" : "en couple";
  if (bd.riv >= 60) return "ennemi juré";
  if (bd.riv >= 30) return "rival";
  if (bd.aff >= 60) return "meilleur ami";
  if (bd.aff >= 35) return "ami";
  if (bd.aff >= 18) return "camarade";
  return "connaissance";
}

// ---------- phrases ----------
// $A et $B pour les prénoms, {A:il|elle} et {B:il|elle} pour les accords
function T(text, A, B) {
  if (!text) return "";
  let s = String(text);
  s = s.replace(/\{([AB]):([^|}]*)\|([^}]*)\}/g, (m, w, x, y) => ((w === "A" ? A : B).gender === "f" ? y : x));
  s = s.replace(/\$A\b/g, A.name).replace(/\$B\b/g, B.name);
  return s;
}
function ev(v, ...args) { return typeof v === "function" ? v(...args) : v; }

// ---------- aides de lecture ----------
const publicKids = (p) => p.npcs.filter((n) => n.kind === "child" && n.alive).length;
const isCouple = (p) => !!p.partner;
const coupleWith = (A, B) => !!(A.partner && A.partner.player === B.seat);
const single = (p) => !p.partner;
const employed = (p) => !!p.job;
const married = (p) => !!(p.partner && p.partner.status === "marie");
const justWed = (p) => !!(p.partner && p.partner.wed !== undefined && p.age - p.partner.wed <= 1);

module.exports = { LIST, byId, reg, bond, touch, bondWord, key, T, ev, clamp, publicKids, isCouple, coupleWith, single, employed, married, justWed };
