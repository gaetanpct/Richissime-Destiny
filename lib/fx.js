// ============================================================
// RICHISSIME DESTINY — Application des effets d'un choix
// ============================================================
const R = require("./rules");
const C = require("./core");
const { pick } = require("./pools");

const NUM_STATS = Object.keys(R.STATS);
const NUM_TRAITS = Object.keys(R.TRAITS);

function val(v, p, x, g) { return typeof v === "function" ? v(p, x, g) : v; }
// retrouve un personnage par nom de slot, sinon par son type (mere, pere, friend…)
function slot(x, p, name) {
  if (x.slots[name]) return x.slots[name];
  const alias = { ami: "friend", copain: "bestfriend", frere: "sibling", soeur: "sibling", maitresse: "teacher", prof: "teacher", voisin: "neighbor", chef: "boss", collegue: "colleague", conjoint: "spouse", enfant: "child" };
  const kind = alias[name] || name;
  const arr = C.findNpc(p, kind);
  return arr.length ? arr[0] : null;
}

// Catalogue d'objets nommés que les scènes peuvent donner
const ITEMS = {
  velo: { kind: "voiture", name: "Vélo électrique", value: 900, rate: -0.15 },
  scooter: { kind: "voiture", name: "Scooter", value: 2500 },
  vieille_voiture: { kind: "voiture", name: "Vieille voiture", value: 4500 },
  voiture: { kind: "voiture", name: "Voiture familiale", value: 16000 },
  voiture_luxe: { kind: "voiture", name: "Voiture de sport", value: 70000 },
  studio: { kind: "immo", name: "Studio", value: 90000 },
  appart: { kind: "immo", name: "Appartement", value: 190000 },
  maison: { kind: "immo", name: "Maison avec jardin", value: 320000 },
  villa: { kind: "immo", name: "Villa avec piscine", value: 900000 },
  chateau: { kind: "immo", name: "Château (humide)", value: 2200000, upkeep: 15000 },
  bijou: { kind: "or", name: "Bijou de famille", value: 3000 },
  lingot: { kind: "or", name: "Lingot d'or", value: 15000 },
  tableau: { kind: "art", name: "Tableau mystérieux", value: 6000 },
  tableau_maitre: { kind: "art", name: "Tableau de maître", value: 90000 },
  licorne: { kind: "loufoque", name: "Licorne de poche", value: 8000, upkeep: 600 },
  dragonnet: { kind: "loufoque", name: "Dragonneau domestique", value: 25000, upkeep: 2000 },
  chateau_fantome: { kind: "loufoque", name: "Manoir hanté", value: 120000, upkeep: 3000 },
  tarte_or: { kind: "loufoque", name: "Tarte en or massif", value: 40000 },
  grotte: { kind: "loufoque", name: "Grotte aux trésors", value: 60000 },
  poule_or: { kind: "loufoque", name: "Poule aux œufs d'or", value: 30000, income: 3500, upkeep: 300 },
  collection: { kind: "art", name: "Collection de timbres rares", value: 12000 },
};

function addAsset(p, spec, x) {
  const base = typeof spec === "string" ? ITEMS[spec] : spec;
  if (!base) throw new Error("objet inconnu " + JSON.stringify(spec));
  const a = { id: "a" + (p.assetSeq = (p.assetSeq || 0) + 1), kind: base.kind, name: base.name, value: val(base.value, p, x), cost: val(base.value, p, x), upkeep: base.upkeep || 0, income: base.income || 0 };
  if (x && x.vals) a.name = x.render ? x.render(a.name) : a.name;
  p.assets.push(a);
  return a;
}

function setFlag(p, f, v) {
  if (typeof f === "string") { p.flags[f] = p.flags[f] ? p.flags[f] : 1; return; }
  if (Array.isArray(f)) { f.forEach((k) => setFlag(p, k)); return; }
  Object.keys(f).forEach((k) => { p.flags[k] = 1; p.flagTtl[k] = f[k]; });
}

function trackLevelFor(p, track) {
  const T = R.TRACKS[track];
  const exp = (p.exp && p.exp[track]) || 0;
  let lvl = Math.min(T.levels.length - 1, Math.floor(exp / 4));
  if (T.gate) while (lvl > 0 && T.gate[lvl] > p.school.edu) lvl--;
  return lvl;
}
function canWork(p, track) {
  const T = R.TRACKS[track];
  if (p.age < T.age) return false;
  if (T.maxAge && p.age > T.maxAge) return false;
  const need = T.gate ? T.gate[0] : T.edu;
  if (p.school.edu < need) return false;
  if (T.minStat && p.stats[T.minStat[0]] < T.minStat[1]) return false;
  return true;
}
function hire(p, track, level, salaryMul) {
  const T = R.TRACKS[track];
  level = C.clamp(level === undefined ? trackLevelFor(p, track) : level, 0, T.levels.length - 1);
  if (p.job) p.jobHistory.push({ title: p.job.title, from: p.job.since, to: p.age, why: "changement" });
  const [title, sal] = T.levels[level];
  p.job = { track, level, title, salary: Math.round(sal * (salaryMul || 1)), since: p.age, perf: 50 };
  p.retired = false;
  p.exp = p.exp || {};
}
function setLevel(p, level) {
  const T = R.TRACKS[p.job.track];
  level = C.clamp(level, 0, T.levels.length - 1);
  const mul = p.job.salary / T.levels[p.job.level][1];
  p.job.level = level;
  p.job.title = T.levels[level][0];
  p.job.salary = Math.round(T.levels[level][1] * mul);
}

// Applique un tableau d'effets à un joueur. g = partie, x = contexte {slots, vals}.
function applyFx(g, p, fx, x) {
  if (!fx) return;
  x = x || { slots: {}, vals: {} };
  const rng = g.rng;
  for (const key of Object.keys(fx)) {
    const raw = fx[key];
    const v = val(raw, p, x, g);
    if (v === undefined || v === null) continue;
    if (NUM_STATS.includes(key)) { p.stats[key] = C.clamp(p.stats[key] + v, 0, 100); continue; }
    if (NUM_TRAITS.includes(key)) { p.traits[key] = C.clamp(p.traits[key] + v, 0, 100); continue; }
    switch (key) {
      case "argent": p.cash += Math.round(v); break;
      case "dette": p.debt = Math.max(0, p.debt + Math.round(v)); break;
      case "notes": p.school.grade = C.clamp(p.school.grade + v, 0, 100); break;
      case "rel":
        for (const sl of Object.keys(v)) { const n = slot(x, p, sl); if (n) n.close = C.clamp(n.close + v[sl], 0, 100); }
        break;
      case "kill": (Array.isArray(v) ? v : [v]).forEach((s) => { const n = slot(x, p, s); if (n) { n.alive = false; n.deadAge = p.age; if (p.partner && p.partner.npc === n.id) p.partner = null; } }); break;
      case "drop": (Array.isArray(v) ? v : [v]).forEach((s) => { const n = slot(x, p, s); if (n) { if (n.kind === "partner" || n.kind === "spouse") { n.kind = "ex"; if (p.partner && p.partner.npc === n.id) { p.partner = null; } } else if (n.kind !== "mere" && n.kind !== "pere") n.kind = "ex"; n.close = Math.min(n.close, 15); } }); break;
      case "becomes":
        for (const sl of Object.keys(v)) {
          const n = slot(x, p, sl); if (!n) continue;
          n.kind = v[sl];
          if (n.kind === "partner") { p.partner = { npc: n.id, status: "couple" }; n.close = Math.max(n.close, 70); }
          if (n.kind === "spouse") { p.partner = { npc: n.id, status: "marie" }; n.close = Math.max(n.close, 75); }
        }
        break;
      case "born": {
        const arr = Array.isArray(v) ? v : [v];
        arr.forEach(() => { const n = C.addNpc(p, rng, "child", { age: 0, close: 80 }); x.slots.enfant = n; p.stats.bonheur = C.clamp(p.stats.bonheur + 4, 0, 100); });
        break;
      }
      case "flag": setFlag(p, v); break;
      case "unflag": (Array.isArray(v) ? v : [v]).forEach((f) => { delete p.flags[f]; delete p.flagTtl[f]; }); break;
      case "later": {
        (Array.isArray(v) ? v : [v]).forEach((l) => {
          if (l.p !== undefined && rng() >= l.p) return;
          const d = Array.isArray(l.in) ? l.in[0] + Math.floor(rng() * (l.in[1] - l.in[0] + 1)) : (l.in || 1);
          p.queue.push({ id: l.id, at: p.age + Math.max(1, d), slots: l.keep ? serializeSlots(x) : null });
        });
        break;
      }
      case "next": x.next = Array.isArray(v) ? pick(rng, v) : v; break;
      case "job": {
        if (typeof v === "string") { const [tr, lv] = v.split(":"); hire(p, tr, lv === undefined ? undefined : Number(lv)); }
        else hire(p, v.track, v.level, v.mul);
        if (R.TRACKS[p.job.track].illicit) p.flags.illicite = 1;
        break;
      }
      case "fire": if (p.job) { p.jobHistory.push({ title: p.job.title, from: p.job.since, to: p.age, why: "licencié" }); p.job = null; } break;
      case "quit": if (p.job) { p.jobHistory.push({ title: p.job.title, from: p.job.since, to: p.age, why: "démission" }); p.job = null; } break;
      case "promote": if (p.job) { const T = R.TRACKS[p.job.track]; const nl = p.job.level + 1; if (nl < T.levels.length && (!T.gate || T.gate[nl] <= p.school.edu)) { setLevel(p, nl); x.promoted = true; } else { p.job.salary = Math.round(p.job.salary * 1.08); x.promoted = false; } } break;
      case "raise": if (p.job) p.job.salary = Math.round(p.job.salary * (1 + v)); break;
      case "demote": if (p.job) setLevel(p, p.job.level - 1); break;
      case "perf": if (p.job) p.job.perf = C.clamp(p.job.perf + v, 0, 100); break;
      case "retire": if (!p.retired) { p.retired = true; const last = p.job ? p.job.salary : 12000; p.pension = Math.round(Math.max(9000, last * 0.55)); if (p.job) { p.jobHistory.push({ title: p.job.title, from: p.job.since, to: p.age, why: "retraite" }); p.job = null; } } break;
      case "item": (Array.isArray(v) ? v : [v]).forEach((it) => { const a = addAsset(p, typeof it === "object" && it.value !== undefined ? Object.assign({}, it, { name: C.render(it.name, p, x), value: val(it.value, p, x, g) }) : it, x); x.lastItem = a; }); break;
      case "sell": p.assets.filter((a) => a.kind === v || a.id === v).forEach((a) => { p.cash += Math.round(a.value); }); p.assets = p.assets.filter((a) => !(a.kind === v || a.id === v)); break;
      case "loseItem": { const i = p.assets.findIndex((a) => a.kind === v); if (i >= 0) p.assets.splice(i, 1); break; }
      case "scaleAssets": { p.assets.forEach((a) => { if (!v.kind || a.kind === v.kind) a.value = Math.round(a.value * v.mul); }); break; }
      case "die": p.dying = { cause: C.render(typeof v === "string" ? v : v.cause, p, x), final: !!(v && v.final) }; break;
      case "prison": { const yrs = Math.max(1, Math.round(v)); p.prison = { left: yrs, total: yrs }; p.record += 1; p.flags.ex_detenu = 1; if (p.job) { p.jobHistory.push({ title: p.job.title, from: p.job.since, to: p.age, why: "prison" }); p.job = null; } break; }
      case "free": if (p.prison) { p.prison = null; } break;
      case "record": p.record += v; break;
      case "school": Object.assign(p.school, v); break;
      case "dipl": giveDiploma(p, v); break;
      case "pub": g.news(p, C.render(v, p, x)); break;
      case "badge": p.badges[v] = (p.badges[v] || 0) + 1; break;
      case "home": p.home = v; break;
      case "city": p.city = typeof v === "string" ? v : pick(rng, require("./pools").POOLS.villes); break;
      case "lifestyle": p.lifestyle = v; break;
      case "jobHunt": p.pendingJobHunt = true; break;
      case "exp": if (p.job) { p.exp[p.job.track] = (p.exp[p.job.track] || 0) + v; } break;
      case "text": break;
      case "keep": break;
      default: throw new Error("effet inconnu : " + key);
    }
  }
}

function serializeSlots(x) { const o = {}; Object.keys(x.slots || {}).forEach((k) => { o[k] = x.slots[k].id; }); return o; }

function giveDiploma(p, id) {
  const D = R.DIPLOMAS[id];
  if (!D) throw new Error("diplôme inconnu " + id);
  if (!p.school.diplomas.includes(id)) p.school.diplomas.push(id);
  p.school.edu = Math.max(p.school.edu, D.rank);
}

module.exports = { applyFx, ITEMS, addAsset, hire, setLevel, canWork, trackLevelFor, giveDiploma, val, NUM_STATS, NUM_TRAITS };
