// ============================================================
// RICHISSIME DESTINY — Cœur : conditions, effets, personnages secondaires, textes
// ============================================================
const R = require("./rules");
const { POOLS, pick, firstName } = require("./pools");

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rint = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));
const fmt = (n) => {
  const s = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (n < 0 ? "-" : "") + s + " €";
};

// ---------- Fortune ----------
function assetsValue(p) { return p.assets.reduce((s, a) => s + (a.value || 0), 0); }
function netWorth(p) { return Math.round(p.cash + assetsValue(p) - p.debt); }
function wealthTier(n) {
  if (n < 0) return { k: 0, l: "Endetté" };
  if (n < 2000) return { k: 1, l: "Fauché" };
  if (n < 25000) return { k: 2, l: "Modeste" };
  if (n < 120000) return { k: 3, l: "À l'aise" };
  if (n < 500000) return { k: 4, l: "Riche" };
  if (n < 2000000) return { k: 5, l: "Très riche" };
  return { k: 6, l: "Richissime" };
}

// ---------- Personnages secondaires ----------
const NPC_ALIAS = { mere: "mere", pere: "pere", friend: "friend", ami: "friend", copain: "bestfriend", bestfriend: "bestfriend", rival: "rival", teacher: "teacher", prof: "teacher", sibling: "sibling", frere: "sibling", boss: "boss", chef: "boss", colleague: "colleague", collegue: "colleague", partner: "love", conjoint: "love", spouse: "love", partenaire: "love", love: "love", child: "child", enfant: "child", neighbor: "neighbor", voisin: "neighbor", mentor: "mentor", enemy: "enemy", crush: "crush", grandparent: "grandparent", star: "star", vedette: "star", client: "client" };
const NPC_TAGS = ["drôle", "timide", "jaloux", "généreux", "radin", "bavard", "têtu", "rêveur", "fêtard", "sérieux", "gaffeur", "malin"];
let npcSeq = 1;
function addNpc(p, rng, kind, opt) {
  opt = opt || {};
  const gender = opt.gender || (rng() < 0.5 ? "m" : "f");
  const npc = {
    id: "n" + (npcSeq++),
    kind,
    name: opt.name || firstName(rng, gender, p.bande),
    gender,
    age: opt.age !== undefined ? opt.age : p.age,
    close: opt.close !== undefined ? opt.close : rint(rng, 35, 70),
    alive: true,
    tag: opt.tag || pick(rng, NPC_TAGS),
  };
  // évite les doublons de prénoms
  const used = new Set(p.npcs.map((n) => n.name));
  let guard = 0;
  while (used.has(npc.name) && guard++ < 20) npc.name = firstName(rng, gender, p.bande);
  p.npcs.push(npc);
  return npc;
}
const FAMILY_KINDS = ["mere", "pere", "sibling", "child", "spouse", "grandparent"];
function relMatch(n, kind) {
  if (!n.alive) return false;
  if (kind === "family") return FAMILY_KINDS.includes(n.kind);
  if (kind === "parent") return n.kind === "mere" || n.kind === "pere";
  if (kind === "love") return n.kind === "partner" || n.kind === "spouse";
  return n.kind === kind;
}
function findNpc(p, kind) { return p.npcs.filter((n) => relMatch(n, kind)); }
function hasRel(p, kind) { return p.npcs.some((n) => relMatch(n, kind)); }
// Ce que l'on crée si l'on n'a pas la personne demandée
const CREATABLE = { friend: [18, 70], bestfriend: [-1, 1], rival: [-1, 1], teacher: [30, 60], neighbor: [20, 80], crush: [-1, 1], stranger: [10, 70], boss: [30, 60], colleague: [22, 55], mentor: [40, 70], enemy: [-1, 1], sibling: [-3, 3], parent: [30, 60], mere: [28, 45], pere: [28, 45], grandparent: [60, 85], pet: [0, 3], star: [22, 60], client: [20, 70] };
function getOrMakeNpc(p, rng, kind) {
  const ex = findNpc(p, (kind === "partner" || kind === "spouse") ? "love" : kind);
  if (ex.length) return pick(rng, ex);
  if (kind === "parent") kind = rng() < 0.5 ? "mere" : "pere";
  const spec = CREATABLE[kind] || [18, 60];
  let age;
  if (["friend", "bestfriend", "rival", "crush", "enemy"].includes(kind)) age = p.age + rint(rng, -1, 1);
  else age = (kind === "sibling") ? p.age + rint(rng, -3, 3) : rint(rng, spec[0], spec[1]);
  if (age < 0) age = 0;
  let g = kind === "mere" ? "f" : kind === "pere" ? "m" : undefined;
  const o = { age };
  if (kind === "star") { const st = pick(rng, POOLS.stars); o.name = st.n; g = st.g; o.tag = "célèbre"; o.close = rint(rng, 5, 25); o.blurb = st.j; }
  if (g) o.gender = g;
  if (kind === "pet") { o.name = pick(rng, ["Pistache", "Biscotte", "Moustache", "Sacha", "Noisette", "Réglisse", "Pepito", "Bouboule", "Gaufrette", "Churros", "Mirabelle", "Tonnerre"]); o.close = rint(rng, 50, 90); }
  return addNpc(p, rng, kind, o);
}

// ---------- Textes ----------
const fmtN = (n) => fmt(n);
function render(text, p, x) {
  if (!text) return "";
  let s = String(text);
  // genre d'un personnage secondaire  {$ami:il|elle}
  s = s.replace(/\{\$(\w+):([^|}]*)\|([^}]*)\}/g, (m, slot, a, b) => {
    const n = x && x.slots && x.slots[slot];
    return n && n.gender === "f" ? b : a;
  });
  // genre du joueur  {il|elle}  {|e}
  s = s.replace(/\{([^|}$:]*)\|([^}:]*)\}/g, (m, a, b) => (p && p.gender === "f" ? b : a));
  // variables
  s = s.replace(/\$(\w+)/g, (m, k) => {
    if (x) {
      if (x.slots && x.slots[k]) return x.slots[k].name;
      if (p && !(x.vals && x.vals[k] !== undefined) && NPC_ALIAS[k]) { const arr = findNpc(p, NPC_ALIAS[k]); if (arr.length) return arr[0].name; }
      if (x.vals && x.vals[k] !== undefined) {
        const v = x.vals[k];
        if (typeof v === "number") return k.startsWith("n_") ? String(v) : fmtN(v);
        return String(v);
      }
    }
    if (k === "nom" && p) return p.name;
    if (k === "age" && p) return String(p.age);
    if (k === "metier" && p) return p.job ? p.job.title.toLowerCase() : "sans emploi";
    if (k === "ville" && p) return p.city;
    return m;
  });
  return s;
}

// ---------- Conditions ----------
function inSchool(p) { return ["primaire", "college", "lycee"].includes(p.school.phase); }
function studying(p) { return p.school.phase === "sup"; }
function numIn(v, r) { if (!r) return true; if (r[0] != null && v < r[0]) return false; if (r[1] != null && v > r[1]) return false; return true; }

function check(p, need, g, x) {
  if (!need) return true;
  const age = p.age;
  for (const k of Object.keys(need)) {
    const v = need[k];
    switch (k) {
      case "ages": if (age < v[0] || age > v[1]) return false; break;
      case "stage": if (!(Array.isArray(v) ? v : [v]).includes(R.stageOf(age))) return false; break;
      case "money": if (!numIn(p.cash, v)) return false; break;
      case "net": if (!numIn(netWorth(p), v)) return false; break;
      case "debt": if (!numIn(p.debt, v)) return false; break;
      case "stat": for (const s of Object.keys(v)) if (!numIn(p.stats[s], v[s])) return false; break;
      case "tr": for (const s of Object.keys(v)) if (!numIn(p.traits[s], v[s])) return false; break;
      case "flag": for (const f of (Array.isArray(v) ? v : [v])) if (!hasFlag(p, f)) return false; break;
      case "any": if (!v.some((f) => hasFlag(p, f))) return false; break;
      case "noflag": for (const f of (Array.isArray(v) ? v : [v])) if (hasFlag(p, f)) return false; break;
      case "job":
        if (v === true) { if (!p.job) return false; }
        else if (v === false) { if (p.job) return false; }
        else if (typeof v === "string") { if (!p.job || p.job.track !== v) return false; }
        else if (v && typeof v === "object") {
          if (!p.job) return false;
          if (v.track && p.job.track !== v.track) return false;
          if (v.min !== undefined && p.job.level < v.min) return false;
          if (v.max !== undefined && p.job.level > v.max) return false;
          if (v.illicit !== undefined && !!R.TRACKS[p.job.track].illicit !== v.illicit) return false;
        }
        break;
      case "nojob": if (v ? !!p.job : !p.job) return false; break;
      case "edu": if (p.school.edu < v) return false; break;
      case "maxedu": if (p.school.edu > v) return false; break;
      case "rel": if (!hasRel(p, v)) return false; break;
      case "norel": if (hasRel(p, v)) return false; break;
      case "asset": if (!p.assets.some((a) => a.kind === v)) return false; break;
      case "noasset": if (p.assets.some((a) => a.kind === v)) return false; break;
      case "school": if (inSchool(p) !== v) return false; break;
      case "studying": if (studying(p) !== v) return false; break;
      case "nostudy": if (studying(p) === v) return false; break;
      case "retired": if (!!p.retired !== v) return false; break;
      case "prison": if (!!p.prison !== v) return false; break;
      case "noprison": if (!!p.prison === v) return false; break;
      case "mature": if (g && v && !g.settings.mature) return false; break;
      case "gender": if (p.gender !== v) return false; break;
      case "players": { const n = g ? g.alivePlayers().length : 1; if (!numIn(n, v)) return false; break; }
      case "multi": if (g && g.alivePlayers().length < 2) return false; break;
      case "single": if (v ? !!p.partner : !p.partner) return false; break;
      case "partner": if (v === true ? !p.partner : v === false ? !!p.partner : !(p.partner && p.partner.status === v)) return false; break;
      case "kids": if (!numIn(p.npcs.filter((n) => n.kind === "child" && n.alive).length, v)) return false; break;
      case "home": if (p.home !== v) return false; break;
      case "record": if (!numIn(p.record, v)) return false; break;
      case "exp": if (!numIn(p.yearsWorked, v)) return false; break;
      case "chance": if (!((g ? g.rng() : Math.random()) < v)) return false; break;
      case "fn": if (!v(p, g, x)) return false; break;
      case "kind": break;
      default: throw new Error("condition inconnue : " + k);
    }
  }
  return true;
}

function hasFlag(p, f) { const v = p.flags[f]; return v !== undefined && v !== 0; }

module.exports = { clamp, rint, fmt, assetsValue, netWorth, wealthTier, addNpc, findNpc, hasRel, getOrMakeNpc, relMatch, render, check, inSchool, studying, hasFlag, NPC_TAGS, FAMILY_KINDS };
