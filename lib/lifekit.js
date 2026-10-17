// ============================================================
// RICHISSIME DESTINY — Kit des choix de vie
// Chaque choix de vie est déclaré avec reg(). La liste complète est lue par life.js,
// qui en propose quelques-uns seulement chaque année, selon le profil du joueur.
// ============================================================
const C = require("./core");

const LIST = [];
const byId = Object.create(null);

// reg(spec)
//  id, grp           identifiant et famille (une famille ne prend pas toute la place)
//  l, ic, d          libellé, icône, description (texte ou fonction (p,g) qui rend un texte)
//  need              conditions (voir core.check)
//  fit(p,g)          coefficient de cohérence, 0 cache le choix
//  w                 poids de tirage de base (défaut 5)
//  cool              nombre d'années d'attente après avoir choisi ce projet (défaut 2)
//  prio              si > 0 le choix reste affiché tant qu'il est possible (étapes d'un parcours)
//  cost              coût (nombre ou fonction)
//  fx                effets appliqués à la fin de l'année
//  outs              issues possibles de l'année, tirées au sort [{w,t,fx}]
//  scene             scène jouée dans l'année, id ou {id, vals} ou fonction (p,g)
//  flag              drapeau d'année posé (durée 1 an)
//  tag               "loufoque" ou "mature" pour respecter les réglages
function reg(spec) {
  if (byId[spec.id]) throw new Error("choix de vie en double " + spec.id);
  if (!spec.grp) spec.grp = "divers";
  LIST.push(spec);
  byId[spec.id] = spec;
  return spec;
}

// issue possible d'un choix de vie
const out = (w, t, fx, j) => ({ w, t, fx: fx || {}, j: j || false });

// ---------- aides de lecture du profil ----------
const net = (p) => C.netWorth(p);
const stat = (p, k) => p.stats[k];
const crushOf = (p) => C.findNpc(p, "crush").filter((n) => n.close >= 20)[0] || null;
const loveNpc = (p) => (p.partner && p.partner.npc ? p.npcs.find((n) => n.id === p.partner.npc && n.alive) || null : null);
const partnerYears = (p) => (p.partner ? Math.max(0, p.age - (p.partner.since !== undefined ? p.partner.since : p.age)) : 0);
const kidsCount = (p) => p.npcs.filter((n) => n.kind === "child" && n.alive).length;
const sporty = (p) => p.stats.sport >= 62;
const brainy = (p) => p.stats.intel >= 62;
const artsy = (p) => p.traits.creatif >= 62;
const charming = (p) => p.stats.charme >= 62;
const arc = (p, k) => (p.arcs && p.arcs[k]) || 0;
// Examen proche : brevet, bac, rattrapage ou diplôme des études supérieures
function examSoon(p) {
  const s = p.school;
  if (s.phase === "college" && p.age >= 14 && !s.diplomas.includes("brevet")) return "brevet";
  if (s.phase === "lycee" && p.age >= 17) return "bac";
  if (p.queue.some((q) => q.id === "bac_rattrapage" && q.at <= p.age)) return "rattrapage";
  if (p.queue.some((q) => q.id === "diplome_sup" && q.at <= p.age)) return "diplome";
  return null;
}
// échelle de richesse : 0 sans le sou, 1 modeste, 2 confortable, 3 riche, 4 très riche, 5 richissime
function tier(p) {
  const n = net(p);
  return n < 3000 ? 0 : n < 40000 ? 1 : n < 200000 ? 2 : n < 900000 ? 3 : n < 3000000 ? 4 : 5;
}

module.exports = { LIST, byId, reg, out, net, stat, crushOf, loveNpc, partnerYears, kidsCount, sporty, brainy, artsy, charming, arc, examSoon, tier };
