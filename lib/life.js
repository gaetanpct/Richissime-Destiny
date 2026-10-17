// ============================================================
// RICHISSIME DESTINY — Les choix de vie proposés chaque année
// Au lieu d'une longue liste fixe, chaque joueur reçoit quelques propositions qui changent
// d'une année à l'autre et qui collent à sa vie (âge, travail, couple, argent, forme, goûts).
// Les étapes d'un parcours (rencontre, rendez-vous, mariage, bébé, examen, candidature...)
// restent proposées tant qu'elles sont possibles, pour ne jamais se retrouver coincé.
// ============================================================
const IN = require("./interests");
const C = require("./core");
const kit = require("./lifekit");
require("./choices");

const LIST = kit.LIST;
const byId = kit.byId;

// Bandes de fortune cohérentes pour des choix existants (paliers de 0 sans le sou à 5 richissime, voir tier dans lifekit).
// Hors de la bande, le choix n'est plus proposé. Un millionnaire ne vend pas de fausses montres au coin de la rue.
const BANDS = {
  fausses_montres: [0, 3], brocante: [0, 3], magouille: [0, 3], contrebande: [0, 4], pari_clandestin: [0, 3], side: [0, 3], heures_sup: [0, 4],
  emploi_candidater: [0, 3], emploi_reseau: [0, 4], emploi_freelance: [0, 4], emploi_interim: [0, 2], emploi_concours: [0, 3], emploi_bilan: [0, 4],
  petit_boulot: [0, 2], baby_sitting: [0, 1], voyage_camping: [0, 3], fausse_maladie: [0, 4], sabotage_collegue: [0, 4], syndicat: [0, 3], loto: [0, 3],
  creer: [0, 3], vide_grenier: [0, 2], epargne: [0, 3], detournement: [0, 4], casse_bande: [0, 3], incendie_assurance: [0, 3], faux_diplome: [0, 4],
};
function inBand(p, pr) { const b = BANDS[pr.id]; if (!b) return true; const t = kit.tier(p); return t >= b[0] && t <= b[1]; }

// Les choix qui rapportent de l'argent ou font avancer une carrière vivent dans l'onglet Professionnel.
// Les autres restent dans les choix de vie (loisirs, amour, famille, santé, voyages, études, folies).
const PRO_GRP = new Set(["emploi", "travail", "louche", "parcours"]);
const PRO_IDS = new Set(["side", "creer", "creer_autre", "opportunite", "vide_grenier", "brocante", "petit_boulot", "baby_sitting", "bonbons", "creer_empire", "rachat_entreprise", "fonds_investissement", "reseau_clandestin", "racheter_club", "holding_familiale", "pari_fou", "entrer_mafia", "monter_en_grade", "quitter_mafia", "empire_1", "empire_2", "empire_3", "empire_4", "empire_5", "cartel_1", "cartel_2", "cartel_3", "formation_metier", "stage", "atelier_prison", "etudes_prison"]);
const NOT_PRO = new Set(["equilibre", "soiree_clandestine", "bonbons"]);
function isPro(pr) {
  if (NOT_PRO.has(pr.id)) return false; return pr.pro === true || (pr.pro !== false && (PRO_GRP.has(pr.grp) || PRO_IDS.has(pr.id))); }
LIST.forEach((pr) => {
  pr.isPro = isPro(pr);
  if (pr.isPro && pr.ill === undefined && (pr.grp === "louche" || /mafia|cartel|empire_|clandestin/.test(pr.id))) pr.ill = true;
});

function ev(spec, key, p, g) { const v = spec[key]; return typeof v === "function" ? v(p, g) : v; }

// un choix qui prolonge une vraie passion peut revenir chaque année
function passion(p, pr) {
  const t = IN.top(p);
  return !!(t && t.v >= 0.9 && IN.domainsOfProject(pr).includes(t.d));
}

function isEligible(g, p, pr) {
  const inPrison = !!p.prison;
  const prisonOnly = !!(pr.need && pr.need.prison === true);
  if (inPrison !== prisonOnly && !pr.anywhere) return false;
  if (pr.tag === "mature" && !g.settings.mature) return false;
  if (pr.tag === "loufoque" && p.cfg.loufoque === 0) return false;
  if (pr.need && !C.check(p, pr.need, g)) return false;
  const cost = ev(pr, "cost", p, g) || 0;
  if (cost && p.cash < cost && pr.id !== "routine") return false;
  if (pr.fit && !(pr.fit(p, g) > 0)) return false;
  if (!inBand(p, pr)) return false;
  return true;
}

// Les choix de vie qui reviennent d'une année sur l'autre sont dévalués, pour que la liste tourne.
function freshness(p, g, pr) {
  let f = 1;
  if (passion(p, pr)) return 1.6;
  const seen = p.lifeSeen[pr.id];
  if (seen !== undefined) { const gap = g.round - seen; f *= gap <= 1 ? 0.3 : gap === 2 ? 0.55 : gap === 3 ? 0.8 : 1; }
  const done = p.lifeDone[pr.id];
  if (done !== undefined) { const gap = g.round - done; f *= gap <= 1 ? 0.2 : gap <= 3 ? 0.5 : 0.85; }
  return f;
}

function chosenRecently(p, g, pr) {
  if (passion(p, pr)) return false;
  const done = p.lifeDone[pr.id];
  if (done === undefined) return false;
  const cool = pr.cool === undefined ? 2 : pr.cool;
  return g.round - done <= cool && cool > 0;
}

// Calcule la liste des choix de l'année pour un joueur (identifiants, dans l'ordre d'affichage).
function offer(g, p) {
  const n = Math.max(2, Math.min(10, Number(g.settings.lifeChoices) || 5));
  const rng = g.rng;
  const pool = LIST.filter((pr) => pr.id !== "routine" && !pr.isPro && isEligible(g, p, pr) && !chosenRecently(p, g, pr));
  const picked = [];
  const used = {};
  // 1. les étapes de parcours, toujours proposées
  const sticky = pool.filter((pr) => pr.prio > 0).sort((a, b) => (b.prio - a.prio) || ((p.lifeSeen[a.id] === undefined ? -1 : p.lifeSeen[a.id]) - (p.lifeSeen[b.id] === undefined ? -1 : p.lifeSeen[b.id])));
  const stickyMax = p.prison ? 3 : n >= 5 ? 2 : 1;
  sticky.slice(0, stickyMax).forEach((pr) => { picked.push(pr); used[pr.grp] = (used[pr.grp] || 0) + 1; });
  // 1 bis. la passion du moment est presque toujours proposée sous une forme ou une autre
  const tp = IN.top(p);
  if (tp && tp.v >= 0.9 && rng() < Math.min(0.95, 0.4 + tp.v * 0.18)) {
    const cands = pool.filter((pr) => !picked.includes(pr) && IN.domainsOfProject(pr).includes(tp.d) && !pr.prio);
    if (cands.length) { const pr = cands[Math.floor(rng() * cands.length)]; picked.push(pr); used[pr.grp] = (used[pr.grp] || 0) + 1; }
  }
  // 2. le reste, tiré au sort selon la cohérence avec la vie du joueur
  const cap = Math.max(1, Math.ceil(n / 2.5));
  const rest = pool.filter((pr) => !picked.includes(pr));
  const target = p.prison ? Math.min(n, 4) : n;
  let guard = 0;
  while (picked.length < target && rest.length && guard++ < 50) {
    const ws = rest.map((pr) => {
      if ((used[pr.grp] || 0) >= cap) return 0;
      const base = pr.w === undefined ? 5 : pr.w;
      const fit = pr.fit ? pr.fit(p, g) : 1;
      let lf = 1;
      if (pr.tag === "loufoque") lf = [0, 0.4, 1, 2.2][p.cfg.loufoque] || 1;
      return base * fit * lf * freshness(p, g, pr) * (0.65 + rng() * 0.7);
    });
    const total = ws.reduce((a, b) => a + b, 0);
    if (total <= 0) break;
    let r = rng() * total, idx = ws.length - 1;
    for (let i = 0; i < ws.length; i++) { r -= ws[i]; if (r <= 0) { idx = i; break; } }
    const pr = rest.splice(idx, 1)[0];
    picked.push(pr); used[pr.grp] = (used[pr.grp] || 0) + 1;
  }
  const ids = picked.map((pr) => pr.id);
  ids.forEach((id) => { p.lifeSeen[id] = g.round; });
  return ids;
}

// Les options de l'onglet Professionnel. Elles dépendent du contexte du moment (métier, études, milieu, retraite...).
// Les options propres au contexte passent avant les options générales.
function offerPro(g, p) {
  const PRO = require("./pro");
  const n = Math.max(2, Math.min(9, Number(g.settings.proChoices) || 5));
  const rng = g.rng;
  const ctxs = PRO.contexts(p);
  const specific = (pr) => Array.isArray(pr.ctx) && pr.ctx.some((c) => c !== "tous" && ctxs.includes(c));
  const universal = (pr) => !Array.isArray(pr.ctx) || pr.ctx.includes("tous");
  const pool = LIST.filter((pr) => pr.isPro && isEligible(g, p, pr) && !chosenRecently(p, g, pr) && (specific(pr) || (universal(pr) && (!pr.ctx || ctxs.includes("tous")))));
  const picked = [];
  const used = {};
  const add = (pr) => { picked.push(pr); used[pr.grp] = (used[pr.grp] || 0) + 1; };
  // 1. les étapes d'un parcours restent proposées
  const sticky = pool.filter((pr) => pr.prio > 0).sort((a, b) => (b.prio - a.prio));
  sticky.slice(0, 2).forEach(add);
  // 2. tirage pondéré, avec un poids supplémentaire pour ce qui colle au contexte principal
  const main = PRO.mainContext(p);
  const target = Math.min(n, p.prison ? 3 : n);
  const draw = (cands, want) => {
    let guard = 0;
    while (picked.length < want && cands.length && guard++ < 60) {
      const ws = cands.map((pr) => {
        const base = pr.w === undefined ? 5 : pr.w;
        const fit = pr.fit ? pr.fit(p, g) : 1;
        let lf = 1;
        if (pr.tag === "loufoque") lf = [0, 0.4, 1, 2.2][p.cfg.loufoque] || 1;
        const cap = Math.max(2, Math.ceil(n / 2));
        if ((used[pr.grp] || 0) >= cap) return 0;
        const mainBoost = Array.isArray(pr.ctx) && pr.ctx.includes(main) ? 1.5 : 1;
        return base * fit * lf * mainBoost * freshness(p, g, pr) * (0.65 + rng() * 0.7);
      });
      const total = ws.reduce((a, b) => a + b, 0);
      if (total <= 0) break;
      let r = rng() * total, idx = ws.length - 1;
      for (let i = 0; i < ws.length; i++) { r -= ws[i]; if (r <= 0) { idx = i; break; } }
      add(cands.splice(idx, 1)[0]);
    }
  };
  const rest = pool.filter((pr) => !picked.includes(pr));
  const spec = rest.filter(specific);
  const gen = rest.filter((pr) => !specific(pr));
  draw(spec, Math.min(target, picked.length + Math.max(2, Math.ceil(target * 0.7))));
  draw(gen, target);
  draw(spec.filter((pr) => !picked.includes(pr)), target);
  const ids = picked.map((pr) => pr.id);
  ids.forEach((id) => { p.lifeSeen[id] = g.round; });
  return ids;
}

// Description complète d'un choix pour le client
function describe(g, p, id) {
  const pr = id === "routine" ? ROUTINE : byId[id];
  if (!pr) return null;
  return { id: pr.id, l: ev(pr, "l", p, g), ic: pr.ic, d: ev(pr, "d", p, g), cost: ev(pr, "cost", p, g) || 0, step: pr.prio > 0, grp: pr.grp, pro: !!pr.isPro, ill: !!pr.ill, risk: pr.risk === undefined ? -1 : pr.risk, gain: pr.gain || "", build: pr.build || "" };
}

const ROUTINE = { id: "routine", grp: "divers", l: "Année tranquille", ic: "🌤️", d: "Tu laisses la vie venir, sans rien forcer.", need: {}, fx: {}, cost: 0 };
LIST.push(ROUTINE);
byId.routine = ROUTINE;

module.exports = { LIST, byId, offer, offerPro, describe, isPro, isEligible, ROUTINE, ev };
