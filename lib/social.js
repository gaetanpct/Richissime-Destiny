// ============================================================
// RICHISSIME DESTINY — Interactions entre joueurs
//  1) Actions sociales (une par année et par joueur) : cadeau, prêt, demande d'aide,
//     couple, mariage, entreprise commune, vol, rumeur, défi, dénonciation.
//  2) Scènes collectives : dilemme, cagnotte, enchères, élection, partage, braquage.
// ============================================================
const R = require("./rules");
const C = require("./core");
const FX = require("./fx");
const { pick, POOLS } = require("./pools");

const SK = require("./socialkit");
require("./social_actions");
const GK = require("./group_events");
const FXLIB = FX;

const HOSTILE = ["steal", "rumor", "denounce"];
// Toutes les actions (anciennes et nouvelles) vivent dans socialkit. KINDS reste exporté pour le reste du code.
const KINDS = SK.byId;
// Les défis dépendent de l'âge. À 45 ans on ne propose plus de course de trottinette.
const DUELS = {
  course: { l: "Course", ic: "🏃", ages: [8, 45], score: (p) => p.stats.sport },
  quiz: { l: "Quiz", ic: "🧠", ages: [8, 120], score: (p) => p.stats.intel },
  charme: { l: "Concours de charme", ic: "✨", ages: [14, 60], score: (p) => p.stats.charme },
  blackjack: { l: "Blackjack", ic: "🂡", ages: [18, 120], score: (p) => (p.stats.intel + p.traits.courage) / 2 },
  echecs: { l: "Parties d'échecs", ic: "♟️", ages: [8, 120], score: (p) => p.stats.intel * 0.8 + p.traits.prudent * 0.2 },
  petanque: { l: "Pétanque", ic: "🎯", ages: [45, 120], score: (p) => p.stats.sport * 0.4 + p.stats.charme * 0.3 + p.stats.intel * 0.3 },
  cartes: { l: "Belote de comptoir", ic: "🂡", ages: [30, 120], score: (p) => (p.stats.intel + p.stats.charme) / 2 },
};
function duelsFor(A, B) { return Object.keys(DUELS).filter((k) => [A, B].every((p) => p.age >= DUELS[k].ages[0] && p.age <= DUELS[k].ages[1])); }

function seatName(g, s) { return g.players[s].name; }
function G(p, a, b) { return p.gender === "f" ? b : a; }
function wealthWord(g, amount) { return g.settings.wealthView === "exact" ? " (" + C.fmt(amount) + ")" : ""; }

// ---------- quelles actions pour quel joueur cette année ----------
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lcFirst = (t) => t.charAt(0).toLowerCase() + t.slice(1);
const fitOf = (spec, g, A, B, b) => (spec.fit ? spec.fit(g, A, B, b) : 1);

// la cible B convient-elle à l'action spec pour le joueur A ?
function canTarget(g, A, B, spec) {
  if (!B.alive || B === A) return false;
  if (spec.prison ? !B.prison : !!B.prison) return false;
  const ag = spec.ages || [0, 120];
  if (A.age < ag[0] || A.age > ag[1] || B.age < ag[0] || B.age > ag[1]) return false;
  const bd = SK.bond(g, A.seat, B.seat);
  const last = bd.last[spec.id];
  if (last !== undefined && g.round - last < (spec.coolPair === undefined ? 3 : spec.coolPair)) return false;
  if (spec.ok && !spec.ok(g, A, B, bd)) return false;
  if (!(fitOf(spec, g, A, B, bd) > 0)) return false;
  const cost = SK.ev(spec.cost, A, B, g) || 0;
  if (cost && A.cash < (spec.split ? cost / 2 : cost)) return false;
  return true;
}
function specAllowed(g, A, spec) {
  if (spec.hostile && !g.settings.hostile) return false;
  if (spec.mature && !g.settings.mature) return false;
  if (spec.loufoque && A.cfg.loufoque === 0) return false;
  return true;
}

// Calcule les actions de l'année d'un joueur. Elles tournent d'une année sur l'autre.
function offerActions(g, A) {
  if (A.prison || !A.alive) return [];
  let N = clamp(Number(g.settings.socialChoices) || 5, 2, 10);
  A.socialSeen = A.socialSeen || {};
  const others = g.players.filter((q) => q !== A && q.alive);
  const cands = [];
  SK.LIST.forEach((spec) => {
    if (!specAllowed(g, A, spec)) return;
    const targets = others.filter((B) => canTarget(g, A, B, spec));
    if (!targets.length) return;
    const fit = Math.max.apply(null, targets.map((B) => fitOf(spec, g, A, B, SK.bond(g, A.seat, B.seat))));
    cands.push({ spec, targets: targets.map((q) => q.seat), fit });
  });
  const picked = [];
  const used = {};
  const take = (c) => { picked.push(c); used[c.spec.grp] = (used[c.spec.grp] || 0) + 1; A.socialSeen[c.spec.id] = g.round; };
  // les étapes d'une relation (mariage, réconciliation, parrainage...) restent proposées tant qu'elles sont possibles
  cands.filter((c) => c.spec.prio > 0).sort((a, b) => (b.spec.prio - a.spec.prio) || ((A.socialSeen[a.spec.id] === undefined ? -1 : A.socialSeen[a.spec.id]) - (A.socialSeen[b.spec.id] === undefined ? -1 : A.socialSeen[b.spec.id]))).slice(0, N >= 5 ? 2 : 1).forEach(take);
  // Le statut des autres joueurs réserve des places. Un ennemi juré, un conjoint ou un prisonnier ne se contentent pas d'une action en passant.
  const present = {};
  others.forEach((B) => {
    const bd = SK.bond(g, A.seat, B.seat); const lv = FEUD.level(bd);
    if (lv >= 2) present.ennemi = Math.max(present.ennemi || 0, lv >= 4 ? 4 : lv === 3 ? 3 : 2);
    if (SK.coupleWith(A, B)) present.couple = 3;
    else if (bd.tags.ex) present.ex = 1;
    if (bd.tags.allie) present.allie = 1;
    if (B.prison) present.prisonnier = 2;
  });
  // les places réservées s'ajoutent au réglage de base, pour garder de la variété autour
  let budget = Math.min(5, Object.keys(present).reduce((x, k) => x + present[k], 0));
  N += budget;
  ["ennemi", "couple", "prisonnier", "ex", "allie"].forEach((stt) => {
    let k = Math.min(present[stt] || 0, budget);
    while (k-- > 0) {
      const pool = cands.filter((c) => !picked.includes(c) && c.spec.status === stt);
      if (!pool.length) break;
      const ws = pool.map((c) => {
        const seen = A.socialSeen[c.spec.id]; const gap = seen === undefined ? 9 : g.round - seen;
        return (c.spec.w === undefined ? 5 : c.spec.w) * c.fit * (gap <= 1 ? 0.4 : gap === 2 ? 0.7 : 1) * (0.6 + g.rng() * 0.8);
      });
      const tot = ws.reduce((x, y) => x + y, 0); let r = g.rng() * tot, idx = ws.length - 1;
      for (let i = 0; i < ws.length; i++) { r -= ws[i]; if (r <= 0) { idx = i; break; } }
      take(pool[idx]); budget--;
    }
  });
  const cap = Math.max(1, Math.ceil(N / 2.5));
  const rest = cands.filter((c) => !picked.includes(c));
  let guard = 0;
  while (picked.length < N && rest.length && guard++ < 60) {
    const ws = rest.map((c) => {
      if ((used[c.spec.grp] || 0) >= cap) return 0;
      const seen = A.socialSeen[c.spec.id];
      const gap = seen === undefined ? 9 : g.round - seen;
      const fresh = gap <= 1 ? 0.3 : gap === 2 ? 0.55 : gap === 3 ? 0.8 : 1;
      const lf = c.spec.loufoque ? [0, 0.4, 1, 2.2][A.cfg.loufoque] || 1 : 1;
      return (c.spec.w === undefined ? 5 : c.spec.w) * c.fit * fresh * lf * (0.65 + g.rng() * 0.7);
    });
    const total = ws.reduce((x, y) => x + y, 0);
    if (total <= 0) break;
    let r = g.rng() * total, idx = ws.length - 1;
    for (let i = 0; i < ws.length; i++) { r -= ws[i]; if (r <= 0) { idx = i; break; } }
    take(rest.splice(idx, 1)[0]);
  }
  return picked.map((c) => ({ id: c.spec.id, targets: c.targets }));
}

// description d'une action pour l'interface du joueur A
function describeAction(g, A, off) {
  const spec = SK.byId[off.id];
  if (!spec) return null;
  const label = spec.label ? spec.label(A) : SK.ev(spec.l, A, g);
  const cost = SK.ev(spec.cost, A, null, g) || 0;
  return {
    id: spec.id, l: label, ic: spec.ic, d: SK.ev(spec.d, A, g), hostile: !!spec.hostile, ui: spec.ui || null, mode: spec.mode,
    cost: spec.split ? Math.round(cost / 2) : cost, split: !!spec.split, step: spec.prio > 0, grp: spec.grp,
    targets: off.targets.map((s) => {
      const B = g.players[s]; const bd = SK.bond(g, A.seat, B.seat);
      return { seat: s, name: B.name, word: FEUD.roleOf(g, A, B).word, games: spec.ui === "game" ? duelsFor(A, B) : undefined };
    }),
  };
}

// ---------- validation d'une action ----------
function validate(g, p, a) {
  const spec = SK.byId[a.kind];
  if (!spec) return { ok: false, error: "Action inconnue." };
  if (spec.hostile && !g.settings.hostile) return { ok: false, error: "Les coups bas sont désactivés." };
  if (p.prison) return { ok: false, error: "Impossible depuis la prison." };
  const t = g.players[Number(a.target)];
  if (!t || t === p || !t.alive) return { ok: false, error: "Cible invalide." };
  const off = (p.socialOffer || []).find((o) => o.id === spec.id);
  if (!off || !off.targets.includes(t.seat)) return { ok: false, error: "Cette action n'est pas proposée cette année." };
  const num = (v, lo, hi, d) => { v = Math.floor(Number(v)); if (!isFinite(v)) v = d; return Math.max(lo, Math.min(hi, v)); };
  const act = { kind: spec.id, target: t.seat };
  switch (spec.id) {
    case "gift": act.amount = num(a.amount, 50, Math.floor(p.cash), 0); if (act.amount < 50) return { ok: false, error: "Tu n'as pas assez d'argent." }; break;
    case "loan": act.amount = num(a.amount, 100, Math.floor(p.cash), 0); if (act.amount < 100) return { ok: false, error: "Tu n'as pas assez d'argent." };
      act.rate = num(a.rate, 0, 25, 8); act.years = num(a.years, 1, 10, 3); break;
    case "ask": act.amount = num(a.amount, 100, 200000, 1000); break;
    case "couple": if (p.partner || t.partner) return { ok: false, error: "L'un de vous est déjà en couple." }; break;
    case "marry": if (!(p.partner && p.partner.player === t.seat && p.partner.status === "couple")) return { ok: false, error: "Il faut d'abord être en couple avec ce joueur." }; break;
    case "company": act.amount = num(a.amount, 1000, Math.floor(p.cash), 0); if (act.amount < 1000) return { ok: false, error: "Il faut au moins 1 000 € à investir." }; break;
    case "steal": act.tier = ["petit", "moyen", "gros"].includes(a.tier) ? a.tier : "petit"; break;
    case "duel": { const ok = duelsFor(p, t); act.game = ok.includes(a.game) ? a.game : ok[0]; if (!act.game) return { ok: false, error: "Aucune épreuve ne convient à votre âge." }; act.amount = num(a.amount, 0, Math.floor(p.cash), 0);
      if (act.game === "blackjack") {
        if (act.amount < 10) return { ok: false, error: "Au blackjack, on mise de l'argent. Mets au moins 10 €." };
        if (t.cash < 10) return { ok: false, error: t.name + " n'a plus d'argent à miser." };
      }
      break; }
    default: {
      const cost = SK.ev(spec.cost, p, t, g) || 0;
      if (cost && p.cash < (spec.split ? cost / 2 : cost)) return { ok: false, error: "Tu n'as pas assez d'argent." };
    }
  }
  return { ok: true, action: act };
}

// ---------- effets des actions personnalisées ----------
function pickOut(g, outs, A, B, bd) {
  const ws = outs.map((o) => Math.max(0, typeof o.w === "function" ? o.w(g, A, B, bd) : o.w === undefined ? 1 : o.w));
  const total = ws.reduce((x, y) => x + y, 0);
  let r = g.rng() * (total || 1), out = outs[outs.length - 1];
  for (let i = 0; i < outs.length; i++) { r -= ws[i]; if (r <= 0) { out = outs[i]; break; } }
  return out;
}
function applyBond(g, A, B, o) {
  const bd = SK.touch(g, A.seat, B.seat, o.bond || {});
  if (o.tag) bd.tags[o.tag] = g.round;
  if (o.untag) delete bd.tags[o.untag];
  return bd;
}
// effets spéciaux d'une issue
function special(g, name, A, B, out, lines) {
  const money = (from, to, pct, cap) => { const m = Math.min(Math.round(from.cash * pct), cap); if (m < 50) return 0; from.cash -= m; to.cash += m; return m; };
  switch (name) {
    case "hire": {
      if (B.job || B.retired || B.prison) return;
      const tr = A.job && FXLIB.canWork(B, A.job.track) ? A.job.track : "libre";
      try { FXLIB.applyFx(g, B, { job: { track: tr, level: 0 } }, null); lines.b.push("💼 Tu travailles maintenant comme " + B.job.title.toLowerCase() + "."); lines.a.push("💼 " + B.name + " travaille désormais comme " + B.job.title.toLowerCase() + "."); } catch (e) { /* le métier n'est pas accessible */ }
      return;
    }
    case "blackmail": { const sec = !!SK.bond(g, A.seat, B.seat).tags.confident; const m = money(B, A, sec ? 0.18 : 0.08, sec ? 60000 : 15000); if (m) { g._loot = m; lines.a.push("💶 Tu as encaissé " + C.fmt(m) + "."); lines.b.push("💸 Tu as payé " + C.fmt(m) + " pour acheter le silence."); } return; }
    case "scam": { const m = money(B, A, 0.09, 20000); if (m) { g._loot = m; lines.a.push("💶 L'affaire t'a rapporté " + C.fmt(m) + "."); lines.b.push("💸 L'affaire douteuse t'a coûté " + C.fmt(m) + "."); } return; }
    case "plainte_ok": {
      const gr = freshGrievance(g, A, B); if (gr) gr.used = true;
      const back = Math.min(B.cash, (gr && gr.loot) || 0) ; if (back > 0) { B.cash -= back; A.cash += back; }
      const dam = money(B, A, 0.05, 6000);
      lines.a.push("⚖️ Le tribunal te donne raison" + (back + dam > 0 ? ". Tu récupères " + C.fmt(back + dam) + "." : "."));
      lines.b.push("⚖️ Le tribunal te condamne" + (back + dam > 0 ? ", tu dois " + C.fmt(back + dam) + "." : "."));
      if (g.settings.mature && gr && (gr.kind === "steal" || gr.kind === "arnaque" || gr.kind === "chantage") && g.rng() < 0.3) { FXLIB.applyFx(g, B, { prison: C.rint(g.rng, 1, 3) }, null); lines.b.push("⛓️ Tu es condamné(e) à de la prison ferme."); }
      return;
    }
    case "mini_blackjack": {
      const low = Math.min(A.cash, B.cash);
      let stake = Math.round(Math.min(low * (0.04 + g.rng() * 0.08), 2000000));
      stake = stake >= 10000 ? Math.round(stake / 1000) * 1000 : stake >= 1000 ? Math.round(stake / 100) * 100 : Math.round(stake / 10) * 10;
      startDuel(g, A, B, "blackjack", stake);
      return;
    }
    case "plainte_ko": { const gr = freshGrievance(g, A, B); if (gr) gr.used = true; return; }
    case "revanche": {
      const ls = freshLoss(g, A, B); if (!ls) return;
      ls.used = true;
      startDuel(g, A, B, ls.game, Math.min(Math.floor(A.cash), Math.floor(B.cash), ls.amount ? ls.amount * 2 : 0));
      return;
    }
    default: return FEUD.special(g, name, A, B, out, lines);
  }
}
// applique une issue : effets, lien, histoires et nouvelles
function runOut(g, spec, A, B, out) {
  const bd = applyBond(g, A, B, out);
  if (out.a) FXLIB.applyFx(g, A, out.a, null);
  if (out.b) FXLIB.applyFx(g, B, out.b, null);
  const lines = { a: [], b: [] };
  if (out.special) special(g, out.special, A, B, out, lines);
  const ic = spec.ic;
  A.yearLog.push(ic + " " + SK.T(out.ta, A, B));
  B.yearLog.push(ic + " " + SK.T(out.tb, A, B));
  lines.a.forEach((l) => A.yearLog.push(l)); lines.b.forEach((l) => B.yearLog.push(l));
  if (out.news) g.news(A, SK.T(out.news, A, B), spec.hostile ? "gossip" : "info");
  if (out.tag || out.news) {
    A.journal.push({ age: A.age, text: SK.T(out.ta, A, B), ic, tag: "social" });
    B.journal.push({ age: B.age, text: SK.T(out.tb, A, B), ic, tag: "social" });
  }
  return bd;
}
function payCost(g, spec, A, B) {
  const cost = SK.ev(spec.cost, A, B, g) || 0;
  if (!cost) return true;
  if (spec.split) {
    const h = Math.round(cost / 2);
    if (A.cash < h || B.cash < h) return false;
    A.cash -= h; B.cash -= h; return true;
  }
  if (A.cash < cost) return false;
  A.cash -= cost; return true;
}
function runGeneric(g, spec, A, B, yes, direct) {
  const bd = SK.bond(g, A.seat, B.seat);
  bd.last[spec.id] = g.round;
  if (direct) {
    if (!payCost(g, spec, A, B)) { A.yearLog.push("🪙 Tu n'avais pas assez d'argent pour cette action (" + spec.l + ")."); return; }
    runOut(g, spec, A, B, pickOut(g, spec.direct, A, B, bd));
    return;
  }
  if (!yes) {
    const no = spec.no || { ta: "$B a refusé.", bond: { aff: -1 } };
    applyBond(g, A, B, no);
    if (no.a) FXLIB.applyFx(g, A, no.a, null);
    if (no.b) FXLIB.applyFx(g, B, no.b, null);
    A.yearLog.push("❌ " + SK.T(no.ta || "$B a refusé.", A, B));
    return;
  }
  if (!payCost(g, spec, A, B)) { A.yearLog.push("🪙 Faute d'argent, l'activité avec " + B.name + " est tombée à l'eau."); B.yearLog.push("🪙 Faute d'argent, l'activité proposée par " + A.name + " est tombée à l'eau."); return; }
  runOut(g, spec, A, B, pickOut(g, spec.yes, A, B, bd));
}

// ---------- rancunes et revanches ----------
const GRIEF = { steal: 1, rumor: 1, sabotage: 1, chantage: 1, arnaque: 1, denounce: 1, ruiner_affaires: 1, faire_licencier: 1, fouiller_passe: 1, tendre_piege: 1, saccager_biens: 1, contrat_tueur: 1 };
const FEUD = require("./feud");
function recordGrievance(g, victim, culprit, kind, loot) {
  g.grievances = (g.grievances || []).filter((x) => x.round >= g.round - 2);
  g.grievances.push({ v: victim.seat, c: culprit.seat, kind, round: g.round, loot: loot || 0 });
}
// une plainte ou une revanche n'est pas proposée à tous les coups, mais de façon stable pour un même couple et une même année
const gate = (g, A, B, pct) => ((g.round * 7 + A.seat * 3 + B.seat * 5) % 10) < pct;
function freshGrievance(g, A, B) { return (g.grievances || []).find((x) => x.v === A.seat && x.c === B.seat && x.round === g.round - 1 && !x.used); }
function freshLoss(g, A, B) { return (g.lostGames || []).find((x) => x.loser === A.seat && x.winner === B.seat && x.round === g.round - 1 && !x.used); }

// ---------- résolution des actions choisies ----------
function resolveActions(g) {
  g.offers = []; let seq = 1;
  const order = g.alivePlayers().slice().sort(() => g.rng() - 0.5);
  for (const p of order) {
    const a = p.plan && p.plan.social;
    if (!a || !p.alive) continue;
    const t = g.players[a.target];
    if (!t.alive) continue;
    const spec = SK.byId[a.kind];
    if (!spec) continue;
    SK.bond(g, p.seat, t.seat).last[spec.id] = g.round;
    if (!spec.legacy) {
      if (spec.mode === "direct") { g._loot = 0; runGeneric(g, spec, p, t, true, true); if (GRIEF[spec.id]) recordGrievance(g, t, p, spec.id, g._loot); if (spec.hostile && t.alive) FEUD.afterHostile(g, p, t); }
      else g.offers.push({ id: seq++, from: p.seat, to: t.seat, a, status: "pending" });
      continue;
    }
    switch (a.kind) {
      case "gift": {
        const amt = Math.min(a.amount, Math.floor(p.cash));
        if (amt < 1) break;
        p.cash -= amt; t.cash += amt;
        p.yearLog.push("🎁 Tu as offert " + C.fmt(amt) + " à " + t.name + ".");
        t.yearLog.push("🎁 " + p.name + " t'a offert " + C.fmt(amt) + " !");
        t.stats.bonheur = C.clamp(t.stats.bonheur + 4, 0, 100); p.stats.repute = C.clamp(p.stats.repute + 2, 0, 100); p.traits.bonte = C.clamp(p.traits.bonte + 2, 0, 100);
        SK.touch(g, p.seat, t.seat, { aff: 8 });
        g.news(p, "🎁 " + p.name + " a fait un cadeau à " + t.name + wealthWord(g, amt) + ".");
        break;
      }
      case "steal": g._loot = 0; doSteal(g, p, t, a); recordGrievance(g, t, p, "steal", g._loot); SK.touch(g, p.seat, t.seat, { riv: 18, aff: -10 }); FEUD.afterHostile(g, p, t); break;
      case "rumor": doRumor(g, p, t); recordGrievance(g, t, p, "rumor", 0); SK.touch(g, p.seat, t.seat, { riv: 16, aff: -10 }); FEUD.afterHostile(g, p, t); break;
      case "denounce": doDenounce(g, p, t); recordGrievance(g, t, p, "denounce", 0); SK.touch(g, p.seat, t.seat, { riv: 20, aff: -12 }); FEUD.afterHostile(g, p, t); break;
      default: g.offers.push({ id: seq++, from: p.seat, to: t.seat, a, status: "pending" });
    }
  }
}

function offerText(g, o) {
  const f = g.players[o.from], t = g.players[o.to], a = o.a;
  switch (a.kind) {
    case "loan": return f.name + " te propose un prêt de " + C.fmt(a.amount) + " à " + a.rate + " % sur " + a.years + " an" + (a.years > 1 ? "s" : "") + ".";
    case "ask": return f.name + " te demande de l'aide, " + C.fmt(a.amount) + " pour s'en sortir.";
    case "couple": return f.name + " te propose de sortir ensemble.";
    case "marry": return f.name + " te demande en mariage !";
    case "company": return f.name + " te propose de monter une entreprise ensemble, avec " + C.fmt(a.amount) + " chacun.";
    case "duel": return f.name + " te lance un défi de " + DUELS[a.game].l.toLowerCase() + (a.amount ? " avec " + C.fmt(a.amount) + " en jeu." : " pour l'honneur.");
    default: {
      const spec = SK.byId[a.kind];
      if (!spec) return "";
      const cost = SK.ev(spec.cost, f, t, g) || 0;
      const base = spec.ask ? SK.T(spec.ask, f, t) : f.name + " te propose " + lcFirst(SK.ev(spec.l, f, g)) + ".";
      return base + (cost ? (spec.split ? " Chacun paiera " + C.fmt(Math.round(cost / 2)) + "." : " " + f.name + " prendra les frais en charge.") : "");
    }
  }
}

function respond(g, seat, offerId, answer) {
  if (g.phase !== "respond") return { ok: false };
  const o = g.offers.find((x) => x.id === offerId && x.to === seat && x.status === "pending");
  if (!o) return { ok: false };
  const yes = answer === "yes" || answer === "half";
  applyOffer(g, o, yes, answer);
  return { ok: true };
}

function expireOffers(g) { g.offers.filter((o) => o.status === "pending").forEach((o) => applyOffer(g, o, false, "no")); }

function applyOffer(g, o, yes, answer) {
  const f = g.players[o.from], t = g.players[o.to], a = o.a;
  o.status = yes ? "yes" : "no";
  if (!f.alive || !t.alive) { o.status = "void"; return; }
  const gs = SK.byId[a.kind];
  if (gs && !gs.legacy) { runGeneric(g, gs, f, t, yes, false); return; }
  if (!yes) {
    SK.touch(g, f.seat, t.seat, { aff: -2 });
    f.yearLog.push("❌ " + t.name + " a refusé ta proposition (" + KINDS[a.kind].l.toLowerCase() + ").");
    if (a.kind === "marry" || a.kind === "couple") { f.stats.bonheur = C.clamp(f.stats.bonheur - 8, 0, 100); g.news(f, "💔 " + f.name + " s'est fait" + G(f, "", "e") + " éconduire par " + t.name + "."); }
    return;
  }
  switch (a.kind) {
    case "loan": {
      const amt = Math.min(a.amount, Math.floor(f.cash));
      if (amt < 100) { o.status = "void"; return; }
      f.cash -= amt; t.cash += amt;
      g.loans.push({ from: f.seat, to: t.seat, principal: amt, rate: a.rate / 100, due: g.round + a.years, balance: amt });
      f.yearLog.push("🏦 Tu as prêté " + C.fmt(amt) + " à " + t.name + ".");
      t.yearLog.push("🏦 " + f.name + " t'a prêté " + C.fmt(amt) + ".");
      g.news(f, "🏦 " + f.name + " a prêté de l'argent à " + t.name + ".");
      break;
    }
    case "ask": {
      let amt = a.amount; if (answer === "half") amt = Math.floor(amt / 2);
      amt = Math.min(amt, Math.floor(t.cash));
      if (amt < 50) { o.status = "void"; return; }
      t.cash -= amt; f.cash += amt;
      t.stats.repute = C.clamp(t.stats.repute + 2, 0, 100); f.stats.bonheur = C.clamp(f.stats.bonheur + 3, 0, 100);
      f.yearLog.push("🙏 " + t.name + " t'a donné " + C.fmt(amt) + ".");
      t.yearLog.push("🙏 Tu as aidé " + f.name + " avec " + C.fmt(amt) + ".");
      g.news(t, "🙏 " + t.name + " a aidé " + f.name + wealthWord(g, amt) + ".");
      break;
    }
    case "couple": {
      if (f.partner || t.partner) { o.status = "void"; return; }
      f.partner = { player: t.seat, status: "couple", since: f.age }; t.partner = { player: f.seat, status: "couple", since: t.age };
      SK.bond(g, f.seat, t.seat).tags.couple = g.round; SK.touch(g, f.seat, t.seat, { aff: 20, riv: -30 });
      f.stats.bonheur = C.clamp(f.stats.bonheur + 8, 0, 100); t.stats.bonheur = C.clamp(t.stats.bonheur + 8, 0, 100);
      f.yearLog.push("💘 Tu sors maintenant avec " + t.name + " !"); t.yearLog.push("💘 Tu sors maintenant avec " + f.name + " !");
      g.news(f, "💘 " + f.name + " et " + t.name + " sont en couple !", "love");
      f.journal.push({ age: g.age, text: "Tu es en couple avec " + t.name + ".", ic: "💘", tag: "amour" });
      t.journal.push({ age: g.age, text: "Tu es en couple avec " + f.name + ".", ic: "💘", tag: "amour" });
      break;
    }
    case "marry": {
      if (!(f.partner && f.partner.player === t.seat)) { o.status = "void"; return; }
      f.partner.status = "marie"; f.partner.wed = f.age; t.partner = { player: f.seat, status: "marie", since: t.partner ? t.partner.since : t.age, wed: t.age };
      f.stats.bonheur = C.clamp(f.stats.bonheur + 10, 0, 100); t.stats.bonheur = C.clamp(t.stats.bonheur + 10, 0, 100);
      const party = 2500; f.cash -= Math.min(f.cash, party / 2); t.cash -= Math.min(t.cash, party / 2);
      f.yearLog.push("💍 Tu épouses " + t.name + " !"); t.yearLog.push("💍 Tu épouses " + f.name + " !");
      g.news(f, "💍 " + f.name + " et " + t.name + " se marient !", "love");
      f.journal.push({ age: g.age, text: "Mariage avec " + t.name + ".", ic: "💍", tag: "amour" });
      t.journal.push({ age: g.age, text: "Mariage avec " + f.name + ".", ic: "💍", tag: "amour" });
      break;
    }
    case "company": {
      const amt = Math.min(a.amount, Math.floor(f.cash), Math.floor(t.cash));
      if (amt < 1000) { o.status = "void"; f.yearLog.push("Votre projet d'entreprise est tombé à l'eau, faute de fonds."); return; }
      f.cash -= amt; t.cash -= amt;
      const id = "c" + (g.companies.length + 1) + "_" + g.round;
      const co = { id, a: f.seat, b: t.seat, value: amt * 2, name: pick(g.rng, POOLS.boites), born: g.round };
      g.companies.push(co);
      [f, t].forEach((x) => { x.assets.push({ id: "a" + (++x.assetSeq), kind: "entreprise", name: co.name + " (société commune)", value: amt, cost: amt, upkeep: 0, income: 0, partnerCompany: id }); });
      f.yearLog.push("🤝 Tu fondes " + co.name + " avec " + t.name + "."); t.yearLog.push("🤝 Tu fondes " + co.name + " avec " + f.name + ".");
      g.news(f, "🤝 " + f.name + " et " + t.name + " fondent l'entreprise " + co.name + ".", "money");
      break;
    }
    case "duel": startDuel(g, f, t, a.game, a.amount); SK.touch(g, f.seat, t.seat, { aff: 4, riv: 2 }); break;
  }
}

// ---------- coups bas ----------
function doSteal(g, p, t, a) {
  const pct = { petit: 0.06, moyen: 0.14, gros: 0.28 }[a.tier];
  const loot = Math.floor(t.cash * pct);
  if (loot < 50) { p.yearLog.push("🦹 " + t.name + " n'avait presque rien à voler."); return; }
  let pr = 0.5 + (p.stats.intel - t.stats.intel) / 220 + (p.traits.courage - 50) / 300 - (t.traits.prudent - 50) / 250 - { petit: 0, moyen: 0.08, gros: 0.18 }[a.tier];
  if (p.flags.bagout) pr += 0.05;
  pr = C.clamp(pr, 0.12, 0.88);
  if (g.rng() < pr) {
    t.cash -= loot; p.cash += loot; g._loot = loot;
    p.traits.honnete = C.clamp(p.traits.honnete - 4, 0, 100); p.stats.bonheur = C.clamp(p.stats.bonheur + 2, 0, 100);
    p.yearLog.push("🦹 Tu as volé " + C.fmt(loot) + " à " + t.name + " sans te faire prendre.");
    const known = g.rng() < 0.3;
    t.yearLog.push("😡 On t'a volé " + C.fmt(loot) + " !" + (known ? " Tu soupçonnes fortement " + p.name + "." : " Tu ignores qui est le coupable."));
    t.stats.bonheur = C.clamp(t.stats.bonheur - 6, 0, 100);
    p.flags.voleur = 1; p.flagTtl.voleur = 12; p.record += g.rng() < 0.4 ? 1 : 0;
    g.news(null, "🦹 Un vol mystérieux a eu lieu chez " + t.name + ".", "crime");
  } else {
    p.stats.repute = C.clamp(p.stats.repute - 15, 0, 100);
    const fine = Math.min(Math.floor(p.cash), 600);
    p.cash -= fine; t.cash += fine;
    p.yearLog.push("🚔 Tu t'es fait" + G(p, "", "e") + " prendre en train de voler " + t.name + ". Amende de " + C.fmt(fine) + ".");
    t.yearLog.push("🚔 " + p.name + " a essayé de te voler, mais tu l'as pris(e) sur le fait !");
    g.news(p, "🚔 " + p.name + " a été pris" + G(p, "", "e") + " la main dans le sac chez " + t.name + ".", "crime");
    if (g.settings.mature && g.rng() < 0.2) { FX.applyFx(g, p, { prison: 1 }, null); p.yearLog.push("⛓️ Le juge t'envoie un an en prison."); }
  }
}
function doRumor(g, p, t) {
  let pr = 0.68 + (p.flags.bagout ? 0.1 : 0) + (p.stats.charme - 50) / 400;
  if (g.rng() < pr) {
    t.stats.repute = C.clamp(t.stats.repute - 12, 0, 100); t.stats.bonheur = C.clamp(t.stats.bonheur - 5, 0, 100);
    p.traits.bonte = C.clamp(p.traits.bonte - 3, 0, 100); p.traits.honnete = C.clamp(p.traits.honnete - 3, 0, 100);
    p.yearLog.push("🗣️ Ta rumeur sur " + t.name + " a fait le tour de la ville.");
    t.yearLog.push("🗣️ Une rumeur horrible circule sur toi. Ta réputation en prend un coup.");
    g.news(null, "🗣️ Une rumeur circule sur " + t.name + "…", "gossip");
  } else {
    p.stats.repute = C.clamp(p.stats.repute - 10, 0, 100);
    p.yearLog.push("😬 Ta rumeur a été découverte. Tout le monde sait que c'était toi.");
    t.yearLog.push("😤 Une rumeur sur toi a été lancée par " + p.name + ", mais tout le monde l'a découvert.");
    g.news(p, "😬 " + p.name + " a été démasqué" + G(p, "", "e") + " en train de répandre une rumeur sur " + t.name + ".", "gossip");
  }
}
function doDenounce(g, p, t) {
  const guilty = t.record > 0 || t.flags.illicite || t.flags.voleur || t.flags.fugitif || (t.job && R.TRACKS[t.job.track].illicit);
  if (guilty && g.rng() < 0.8) {
    FX.applyFx(g, t, { prison: C.rint(g.rng, 1, 3), repute: -10 }, null);
    p.stats.repute = C.clamp(p.stats.repute + 3, 0, 100);
    p.yearLog.push("📢 Ta dénonciation a fonctionné, " + t.name + " est en prison.");
    t.yearLog.push("🚔 Quelqu'un t'a dénoncé(e). Tu es arrêté(e) !");
    g.news(null, "🚔 " + t.name + " a été arrêté(e) après une dénonciation.", "crime");
  } else {
    p.stats.repute = C.clamp(p.stats.repute - 12, 0, 100);
    p.yearLog.push("📢 Ta dénonciation était sans preuve, tu passes pour un(e) calomniateur(trice).");
    t.yearLog.push("📢 Quelqu'un a essayé de te dénoncer à tort.");
    g.news(p, "📢 " + p.name + " a dénoncé " + t.name + " sans preuves.", "gossip");
  }
}
// lance une épreuve entre deux joueurs (les jeux de cartes se jouent en vrai quand la partie le prévoit)
function startDuel(g, f, t, game, amount) {
  if (g.minigames && g.minigames.wants && g.minigames.wants(g, f, t, game)) return g.minigames.queue(g, f, t, game, amount);
  return doDuel(g, f, t, { game, amount });
}
function recordLoss(g, loser, winner, game, amt) {
  g.lostGames = (g.lostGames || []).filter((x) => x.round >= g.round - 2);
  g.lostGames.push({ loser: loser.seat, winner: winner.seat, game, amount: amt, round: g.round });
}
function doDuel(g, f, t, a) {
  const D = DUELS[a.game];
  const score = (p) => D.score(p) + g.rng() * 55;
  const sf = score(f), st = score(t);
  const winner = sf >= st ? f : t, loser = winner === f ? t : f;
  const amt = Math.min(a.amount, Math.floor(loser.cash));
  if (amt > 0) { loser.cash -= amt; winner.cash += amt; }
  recordLoss(g, loser, winner, a.game, amt);
  winner.stats.bonheur = C.clamp(winner.stats.bonheur + 4, 0, 100); loser.stats.bonheur = C.clamp(loser.stats.bonheur - 3, 0, 100);
  winner.stats.repute = C.clamp(winner.stats.repute + 3, 0, 100);
  winner.yearLog.push(D.ic + " Tu as battu " + loser.name + " à l'épreuve de " + D.l.toLowerCase() + (amt ? " et gagné " + C.fmt(amt) + "." : "."));
  loser.yearLog.push(D.ic + " Tu as perdu contre " + winner.name + (amt ? " et laissé " + C.fmt(amt) + "." : "."));
  g.news(winner, D.ic + " " + winner.name + " a battu " + loser.name + " (" + D.l.toLowerCase() + ")" + (amt ? wealthWord(g, amt) : "") + ".", "duel");
}

// ---------- bots ----------
function botRespond(g, o) {
  const a = o.a, t = g.players[o.to], f = g.players[o.from];
  const r = g.rng();
  const bd = SK.bond(g, o.from, o.to);
  let yes;
  if (a.kind === "duel" && a.game === "blackjack") yes = true; else if (a.kind === "ask") yes = r < 0.4; else if (a.kind === "duel") yes = r < 0.6; else if (a.kind === "marry" || a.kind === "couple") yes = r < 0.55;
  else if (a.kind === "faire_la_paix" || a.kind === "derniere_reconciliation") yes = r < 0.7;
  else yes = r < 0.55 + bd.aff / 250 - bd.riv / 150;
  applyOffer(g, o, yes, yes && a.kind === "ask" && g.rng() < 0.4 ? "half" : yes ? "yes" : "no");
}
function botAction(g, p) {
  const offer = p.socialOffer || [];
  if (!offer.length) return null;
  // un robot rancunier frappe plus souvent, surtout si on lui a fait du mal ou s'il a un rival déclaré
  const heat = (o) => Math.max.apply(null, o.targets.map((s) => SK.bond(g, p.seat, s).riv));
  const ws = offer.map((o) => { const sp = SK.byId[o.id]; return (sp.hostile ? 0.35 * (1 + heat(o) / 12) * (o.id === "contrat_tueur" ? 0.35 : 1) : 1) * (sp.prio > 0 ? 2 : 1) * (sp.grp === "reaction" ? 3 : 1); });
  const tot = ws.reduce((x, y) => x + y, 0);
  let r = g.rng() * tot, o = offer[offer.length - 1];
  for (let i = 0; i < offer.length; i++) { r -= ws[i]; if (r <= 0) { o = offer[i]; break; } }
  const t = g.players[pick(g.rng, o.targets)];
  const v = validate(g, p, { kind: o.id, target: t.seat, amount: Math.max(100, Math.floor(p.cash * 0.1)), tier: "petit", game: duelsFor(p, t)[0], rate: 8, years: 3 });
  return v.ok ? v.action : null;
}
function botActChance(g, p) {
  let pr = 0.3;
  g.alivePlayers().forEach((q) => { if (q === p) return; if (SK.bond(g, p.seat, q.seat).riv >= 30) pr += 0.15; });
  if ((g.grievances || []).some((x) => x.v === p.seat && !x.used && x.round >= g.round - 1)) pr += 0.2;
  return Math.min(0.85, pr);
}
function botFinance(g, p) { g.finance(p.seat, { op: "invest", kind: pick(g.rng, ["livret", "actions"]), amount: Math.floor(p.cash * 0.4) }); }

// ---------- prêts et sociétés (fin d'année) ----------
function loanTick(g, p, rep) { /* les prêts se règlent dans yearEnd pour avoir les deux parties */ }

function yearEnd(g) {
  // prêts
  for (const l of g.loans.slice()) {
    const bor = g.players[l.to], len = g.players[l.from];
    l.balance = Math.round(l.balance * (1 + l.rate));
    if (!bor.alive) { g.loans.splice(g.loans.indexOf(l), 1); continue; }
    if (g.round >= l.due) {
      const pay = Math.min(l.balance, Math.floor(bor.cash));
      bor.cash -= pay; len.cash += pay;
      if (pay >= l.balance) {
        len.yearLog.push("🏦 " + bor.name + " t'a remboursé " + C.fmt(pay) + ".");
        bor.yearLog.push("🏦 Tu as remboursé ton prêt à " + len.name + " (" + C.fmt(pay) + ").");
      } else {
        const rest = l.balance - pay;
        bor.debt += rest; bor.stats.repute = C.clamp(bor.stats.repute - 10, 0, 100);
        len.yearLog.push("😠 " + bor.name + " ne t'a rendu que " + C.fmt(pay) + " sur " + C.fmt(l.balance) + ".");
        bor.yearLog.push("😬 Tu n'as pas pu rembourser entièrement " + len.name + ". Le reste devient une dette.");
        g.news(bor, "😬 " + bor.name + " est mauvais payeur envers " + len.name + ".", "money");
      }
      g.loans.splice(g.loans.indexOf(l), 1);
    }
  }
  // entreprises communes
  for (const co of g.companies.slice()) {
    const A = g.players[co.a], B = g.players[co.b];
    if (!A.alive || !B.alive) continue;
    const skill = ((A.stats.intel + A.traits.ambition + B.stats.intel + B.traits.ambition) / 4 - 50) / 250;
    const noise = (g.rng() + g.rng() + g.rng() - 1.5) * 0.5;
    const rate = 0.06 + skill + noise;
    co.value = Math.max(0, Math.round(co.value * (1 + rate)));
    [A, B].forEach((x) => { const as = x.assets.find((s) => s.partnerCompany === co.id); if (as) as.value = Math.round(co.value / 2); });
    if (rate < -0.25) { const m = co.name + " traverse une grosse crise."; A.yearLog.push("📉 " + m); B.yearLog.push("📉 " + m); }
    if (rate > 0.35) { const m = co.name + " explose les compteurs cette année !"; A.yearLog.push("🚀 " + m); B.yearLog.push("🚀 " + m); g.news(A, "🚀 L'entreprise " + co.name + " de " + A.name + " et " + B.name + " cartonne !", "money"); }
  }
  // les liens évoluent doucement. Les amitiés s'effritent sans entretien, les rancunes s'apaisent.
  Object.keys(g.bonds || {}).forEach((k) => {
    const bd = g.bonds[k];
    if (bd.aff > 12) bd.aff = Math.max(10, bd.aff - 1.5);
    if (bd.riv > 0) bd.riv = Math.max(0, bd.riv - 2);
  });
  // couples de joueurs
  const seen = new Set();
  g.alivePlayers().forEach((p) => {
    if (!p.partner || p.partner.player === undefined || seen.has(p.seat)) return;
    const q = g.players[p.partner.player];
    seen.add(p.seat); seen.add(q.seat);
    if (!q.alive) { p.partner = null; return; }
    const married = p.partner.status === "marie";
    p.stats.bonheur = C.clamp(p.stats.bonheur + 2, 0, 100); q.stats.bonheur = C.clamp(q.stats.bonheur + 2, 0, 100);
    SK.touch(g, p.seat, q.seat, { aff: 4 });
    const brk = married ? 0.035 : 0.1;
    if (g.rng() < brk) breakUp(g, p, q, married);
  });
}
function breakUp(g, p, q, married) {
  p.partner = null; q.partner = null;
  { const bb = SK.bond(g, p.seat, q.seat); delete bb.tags.couple; bb.tags.ex = g.round; } SK.touch(g, p.seat, q.seat, { aff: -12, riv: married ? 22 : 14 });
  [p, q].forEach((x) => { x.stats.bonheur = C.clamp(x.stats.bonheur - (married ? 12 : 7), 0, 100); });
  if (married) { p.mem.divorces++; q.mem.divorces++; }
  if (married) {
    const rich = p.cash >= q.cash ? p : q, poor = rich === p ? q : p;
    const alim = Math.floor(rich.cash * 0.25);
    rich.cash -= alim; poor.cash += alim;
    p.yearLog.push("💔 Ton mariage avec " + q.name + " prend fin. Pension et partage, " + C.fmt(alim) + " changent de main.");
    q.yearLog.push("💔 Ton mariage avec " + p.name + " prend fin. Pension et partage, " + C.fmt(alim) + " changent de main.");
    g.news(p, "💔 " + p.name + " et " + q.name + " divorcent.", "love");
  } else {
    p.yearLog.push("💔 Ton couple avec " + q.name + " s'arrête."); q.yearLog.push("💔 Ton couple avec " + p.name + " s'arrête.");
    g.news(p, "💔 " + p.name + " et " + q.name + " se séparent.", "love");
  }
}

// ---------- mort et héritage ----------
function onDeath(g, p, net) {
  // prêts
  g.loans = g.loans.filter((l) => l.from !== p.seat && l.to !== p.seat);
  // société commune
  g.companies.forEach((co) => {
    if (co.a !== p.seat && co.b !== p.seat) return;
    if (co.dead) return;
    co.dead = true;
    const other = g.players[co.a === p.seat ? co.b : co.a];
    if (other.alive) { other.assets = other.assets.filter((s) => s.partnerCompany !== co.id); other.cash += Math.round(co.value * 0.5 * 0.9); other.yearLog.push("🕯️ " + p.name + " est mort" + G(p, "", "e") + ". Tu liquides votre société et récupères " + C.fmt(co.value * 0.45) + "."); }
    p.assets = p.assets.filter((s) => s.partnerCompany !== co.id);
  });
  g.companies = g.companies.filter((co) => !co.dead);
  // conjoint
  if (p.partner && p.partner.player !== undefined) {
    const q = g.players[p.partner.player];
    if (q && q.alive) {
      if (p.partner.status === "marie" && net > 0) {
        const part = Math.floor(net * 0.4);
        q.cash += part;
        q.yearLog.push("🕯️ " + p.name + " est mort" + G(p, "", "e") + ". Tu hérites de " + C.fmt(part) + ".");
        g.news(q, "📜 " + q.name + " hérite de son conjoint" + G(p, "", "e") + " " + p.name + wealthWord(g, part) + ".", "money");
        q.stats.bonheur = C.clamp(q.stats.bonheur - 18, 0, 100);
      } else q.stats.bonheur = C.clamp(q.stats.bonheur - 8, 0, 100);
      q.partner = null;
    }
  }
  // héritage librement choisi
  if (g.settings.inheritance && p.heir !== null && p.heir !== undefined && net > 0) {
    const h = g.players[p.heir];
    if (h && h.alive && !(p.partner && p.partner.status === "marie" && p.partner.player === h.seat)) {
      const part = Math.floor(net * 0.3);
      h.cash += part;
      h.yearLog.push("📜 " + p.name + " t'a légué " + C.fmt(part) + " dans son testament.");
      g.news(h, "📜 " + h.name + " reçoit un héritage de " + p.name + wealthWord(g, part) + ".", "money");
    }
  }
  g.players.forEach((x) => { if (x.heir === p.seat) x.heir = null; if (x.partner && x.partner.player === p.seat) x.partner = null; });
}

// ---------- scènes collectives ----------
const STAKE = { enfance: 30, ado: 200, jeune: 1500, adulte: 6000, senior: 4000 };
const GROUPS = {
  dilemma: {
    ages: [6, 120], min: 2, max: 2,
    skins: [
      { t: "Hier soir, $A et $B ont été vus près de $lieu pendant un incident. Un enquêteur propose à chacun un marché en tête à tête. Parler peut rapporter gros, mais si les deux parlent, personne n'en sort grandi.", ic: "🕵️", stat: "gaffe" },
      { t: "Un sac de pièces d'or oublié sur un banc. $A et $B l'ont vu en même temps. Partager, ou tout rafler discrètement avant que l'autre ne s'en aperçoive ?", ic: "💰", stat: "or" },
      { t: "$A et $B ont chacun reçu une offre secrète du même acheteur pour un bien commun. Faire front ensemble, ou vendre dans le dos de l'autre ?", ic: "📜", stat: "offre" },
      { t: "Un concours de pâtisserie oppose $A et $B. Un juge corrompu propose de glisser la défaite à l'autre contre un petit pot-de-vin. Jouer propre ou tricher ?", ic: "🎂", stat: "triche" },
      { t: "Une vitre cassée dans la rue. $A et $B sont les seuls témoins. On peut s'accuser ou se couvrir mutuellement.", ic: "🪟", stat: "vitre" },
      { t: "$A et $B se retrouvent coincés sur un radeau avec une seule bouée. Partager la peur ou pousser l'autre à l'eau ?", ic: "🛟", stat: "radeau" },
    ],
    opts: [{ v: "coop", l: "Coopérer", ic: "🤝", d: "On se serre les coudes." }, { v: "betray", l: "Trahir", ic: "🔪", d: "Chacun pour soi." }],
  },
  public: {
    ages: [8, 120], min: 3, max: 6, minPlayers: 3,
    skins: [
      { t: "La cagnotte de la fête de quartier ! Chacun peut y mettre de l'argent. Ce qui est collecté est augmenté de moitié par la mairie, puis redistribué à parts égales entre tous les joueurs, même ceux qui n'ont rien donné.", ic: "🎪" },
      { t: "Un fonds commun pour acheter un cadeau géant. Plus la cagnotte grossit, plus la mairie ajoute. Mais les égoïstes en profitent aussi…", ic: "🎁" },
      { t: "Le grand projet du village (une fontaine à chocolat). Chacun investit s'il le souhaite. Les bénéfices sont partagés entre tous.", ic: "⛲" },
    ],
    opts: [{ v: "0", l: "Ne rien donner", ic: "🙈", d: "Je garde tout." }, { v: "1", l: "Participer un peu", ic: "🪙", d: "Une mise normale." }, { v: "2", l: "Participer beaucoup", ic: "💎", d: "Une grosse mise." }],
  },
  auction: {
    ages: [10, 120], min: 2, max: 6,
    skins: [
      { t: "Une vente aux enchères secrète ! Un tableau mystérieux, trouvé dans un grenier. Son vrai prix est inconnu, il peut valoir une fortune ou ne rien valoir. Chacun mise en secret, le plus offrant l'emporte.", ic: "🖼️", item: { kind: "art", name: "Tableau douteux" } },
      { t: "Une poule dorée ? Un vieux paysan vend son animal « miraculeux » aux enchères. Plus ou moins d'œufs d'or, qui sait ?", ic: "🐔", item: { kind: "loufoque", name: "Poule suspecte" } },
      { t: "Un terrain vague, avec une cabane et une rumeur de trésor enterré. Les enchères sont ouvertes en secret.", ic: "🏞️", item: { kind: "immo", name: "Terrain vague" } },
      { t: "Un coffre sans clé, mis aux enchères tel quel. Contenu inconnu, mystère garanti.", ic: "🧰", item: { kind: "loufoque", name: "Coffre sans clé" } },
    ],
    opts: [{ v: "0", l: "Ne pas miser", ic: "🙅", d: "Je regarde passer." }, { v: "1", l: "Mise prudente", ic: "🪙", d: "La moitié de l'estimation." }, { v: "2", l: "Mise honnête", ic: "💶", d: "L'estimation." }, { v: "3", l: "Grosse mise", ic: "🔥", d: "60 % de plus que l'estimation." }],
  },
  vote: {
    ages: [8, 120], min: 3, max: 6, minPlayers: 3,
    skins: [
      { t: "Élection du ou de la délégué(e) ! Chacun vote pour quelqu'un d'autre. Celui ou celle qui en rassemble le plus gagne la gloire.", ic: "🗳️", title: "délégué(e)" },
      { t: "C'est le grand vote du Roi ou de la Reine du carnaval. Vote pour qui tu veux, sauf toi-même.", ic: "👑", title: "roi ou reine du carnaval" },
      { t: "L'association des amis de la tarte cherche un président ou une présidente. Chacun vote pour son préféré.", ic: "🥧", title: "président(e) de l'association de la tarte" },
      { t: "Élection du maire ! Les promesses fusent, les poignées de mains aussi. À toi de voter.", ic: "🏛️", title: "maire" },
    ],
  },
  split: {
    ages: [8, 120], min: 2, max: 6,
    skins: [
      { t: "Un héritage tombe du ciel, la fameuse tante Gertrude vous a tous couchés sur son testament. À vous de réclamer votre part. Mais si tout le monde en demande trop, les avocats mangent le gâteau !", ic: "📜" },
      { t: "Vous avez trouvé un trésor ensemble. Combien en réclamer ? Celui qui exagère risque de provoquer une bagarre générale.", ic: "🏴‍☠️" },
      { t: "Une loterie commune a été gagnée. Le gain doit être partagé, mais personne n'a décidé de la règle !", ic: "🎟️" },
    ],
    opts: [{ v: "1", l: "Part modeste", ic: "🙂", d: "Je me contente de peu." }, { v: "2", l: "Part normale", ic: "😐", d: "Un partage honnête." }, { v: "4", l: "Part gourmande", ic: "😈", d: "J'en veux beaucoup." }],
  },
  heist: {
    ages: [16, 120], min: 2, max: 6, mature: true,
    skins: [
      { t: "Le casse du siècle ! Une banque mal gardée, un plan douteux, et d'autres joueurs motivés. Plus vous êtes nombreux, plus ça passe, mais le butin est partagé. Un échec, c'est la prison ou l'amende.", ic: "🏦" },
      { t: "Un musée avec un diamant géant et un seul gardien qui dort. Qui en est ? Plus la bande est grande, plus les chances augmentent.", ic: "💎" },
      { t: "Un train de marchandises rempli de fromages rares. Un casse tout à fait réaliste, forcément.", ic: "🚂" },
    ],
    opts: [{ v: "in", l: "Je suis de la partie", ic: "🦹", d: "Je tente le coup." }, { v: "out", l: "Je reste à l'écart", ic: "😇", d: "Pas de ça chez moi." }],
  },
fame: {
    ages: [10, 120], min: 2, max: 6, role: true,
    skins: [
      { t: "$A a été filmé{|e} en pleine dispute avec une oie. La vidéo dépasse déjà dix millions de vues, et les autres décident de la suite.", ic: "🦢" },
      { t: "$A est devenu{|e} célèbre après avoir gagné un concours de grimaces. Le pays entier connaît son visage, hélas. Les autres réagissent.", ic: "🤪" },
      { t: "Un journal local a imprimé la photo de $A en couverture, avec une légende qui n'a aucun rapport. Les inconnus l'arrêtent dans la rue.", ic: "📰" },
      { t: "Un discours raté de $A est devenu un tube de danse. Tout le monde le chante, même les enfants, même les cousins.", ic: "🕺" },
    ],
  },
  secret: {
    ages: [12, 120], min: 2, max: 6, role: true,
    skins: [
      { t: "Les autres viennent de découvrir un secret que $A cachait au fond d'une boîte à chaussures. Il était très bien caché, mais pas assez.", ic: "📦" },
      { t: "Les autres ont découvert que $A mentait depuis toujours sur un détail de sa vie, son âge, un diplôme ou une couleur de cheveux.", ic: "🎭" },
      { t: "Le vieux carnet intime de $A est tombé dans les mains des autres. Les pages sont croustillantes, les dessins le sont plus encore.", ic: "📓" },
    ],
  },
  heritage: {
    ages: [25, 120], min: 2, max: 6, role: true,
    skins: [
      { t: "Un oncle lointain, immensément riche et très excentrique, vient de mourir. Son testament désigne $A comme seul{|e} héritier, à la grande colère des autres.", ic: "📜" },
      { t: "Une vieille tante a tout légué à $A, y compris son perroquet. Les autres crient à l'injustice et prennent un avocat par la manche.", ic: "🦜" },
    ],
  },
  rivalcrush: {
    ages: [15, 120], min: 2, max: 2, mature: true,
    skins: [
      { t: "$A et $B découvrent qu'ils fréquentent exactement la même personne depuis des mois, sans le savoir. Le dîner de la grande révélation est prévu ce soir.", ic: "💘" },
      { t: "$A et $B se retrouvent à la même soirée, avec le même rendez-vous galant, au même moment, à la même table. Le serveur ne sait plus où se mettre.", ic: "🍝" },
    ],
    opts: [{ v: "fight", l: "Se battre pour cette personne", ic: "🥊", d: "Je ne lâche rien." }, { v: "yield", l: "Laisser tomber avec élégance", ic: "🕊️", d: "Je passe mon tour." }, { v: "laugh", l: "En rire ensemble", ic: "😂", d: "On trinque à l'absurde." }],
  },
  scandal: {
    ages: [14, 120], min: 2, max: 6, role: true,
    skins: [
      { t: "Un scandale éclate autour de $A, une histoire de pot-de-vin, de pigeons et de photos floues. Les éclaboussures touchent tous ses proches.", ic: "🗞️" },
      { t: "Une rumeur embarrassante circule sur $A. Elle est probablement fausse, mais elle est tellement drôle que personne n'ose la démentir.", ic: "🗣️" },
    ],
  },
};

function planGroup(g) {
  const alive = g.alivePlayers();
  if (alive.length < 2) return false;
  // fréquence des scènes collectives. C'est aléatoire, parfois deux années de suite puis plusieurs années de calme.
  // Chaque année sans scène augmente la chance d'en avoir une, et jamais plus de sept années de suite sans scène.
  const gap = g.lastGroup === undefined ? g.round : g.round - g.lastGroup - 1;
  const H = {
    frequent: [0.42, 0.34, 0.36, 0.5, 0.7, 0.9, 1],
    normal: [0.28, 0.24, 0.3, 0.42, 0.62, 0.85, 1],
    peu: [0.16, 0.12, 0.15, 0.22, 0.35, 0.6, 0.85],
    rare: [0.08, 0.07, 0.09, 0.13, 0.2, 0.4, 0.7],
  }[g.settings.social] || [0.28, 0.24, 0.3, 0.42, 0.62, 0.85, 1];
  const freq = gap >= 7 ? 1 : H[gap];
  if (g.rng() >= freq) return false;
  g.lastGroup = g.round;
  const age = g.age;
  // l'ancienne cagnotte commune est retirée, elle est remplacée par les événements du catalogue (travail d'équipe, affaires, etc.)
  const kinds = Object.keys(GROUPS).filter((k) => {
    if (k === "public") return false;
    const d = GROUPS[k];
    if (age < d.ages[0]) return false;
    if (d.mature && !g.settings.mature) return false;
    const need = d.minPlayers || d.min;
    return alive.length >= need;
  });
  // le catalogue d'événements collectifs, sans répétition rapprochée
  g.groupSeen = g.groupSeen || {};
  let evs = GK.LIST.filter((e) => age >= e.ages[0] && age <= e.ages[1] && (!e.mature || g.settings.mature) && alive.length >= e.min);
  const fresh = evs.filter((e) => g.groupSeen[e.id] === undefined || g.round - g.groupSeen[e.id] > 18);
  if (fresh.length) evs = fresh;
  if (!kinds.length && !evs.length) return false;
  const useEv = evs.length && (!kinds.length || g.rng() < 0.75);
  let kind, d, skin, ev = null;
  if (useEv) { ev = pick(g.rng, evs); kind = "ev"; d = { max: ev.max, min: ev.min, role: !!GK.ARCH[ev.a].role }; skin = { t: ev.t, ic: ev.ic }; g.groupSeen[ev.id] = g.round; }
  else { kind = pick(g.rng, kinds); d = GROUPS[kind]; skin = pick(g.rng, d.skins); }
  let seats = alive.map((p) => p.seat);
  if (kind === "dilemma") seats = seats.sort(() => g.rng() - 0.5).slice(0, 2);
  else if (seats.length > d.max) seats = seats.sort(() => g.rng() - 0.5).slice(0, d.max);
  // l'enjeu suit la fortune des joueurs présents, et parfois un coup exceptionnel change vraiment une vie
  const base = STAKE[R.stageOf(age)];
  const avgNet = seats.reduce((x, st) => x + Math.max(0, C.netWorth(g.players[st])), 0) / Math.max(1, seats.length);
  const big = g.rng() < 0.2 && avgNet > base * 8;
  let stake = Math.max(base, avgNet * (0.03 + g.rng() * 0.07) * (big ? 3 + g.rng() * 4 : 1));
  stake = Math.min(stake, 60000000);
  const mag = Math.pow(10, Math.max(0, Math.floor(Math.log10(stake)) - 1)); stake = Math.round(stake / mag) * mag;
  const names = seats.map((s) => g.players[s].name);
  let text = skin.t;
  if (big) text += " L'enjeu est exceptionnel cette fois.";
  if (kind === "dilemma") text = text.replace(/\$A/g, names[0]).replace(/\$B/g, names[1]).replace("$lieu", pick(g.rng, POOLS.lieux));
  if (ev) text = text.replace(/\$lieu/g, pick(g.rng, POOLS.lieux)).replace(/\$ville/g, pick(g.rng, POOLS.villes));
  let target = null;
  if (kind === "rivalcrush") { seats = seats.sort(() => g.rng() - 0.5).slice(0, 2); text = text.replace(/\$A/g, g.players[seats[0]].name).replace(/\$B/g, g.players[seats[1]].name); }
  else if (d.role) {
    target = pick(g.rng, seats);
    const tp = g.players[target];
    text = text.replace(/\$A/g, tp.name).replace(/\{\|e\}/g, tp.gender === "f" ? "e" : "");
  }
  if (ev && !d.role) text = text.replace(/\$A/g, names[0]).replace(/\$B/g, names[1] || names[0]);
  const grp = { kind, skin, seats, stake, big, choices: {}, state: "choose", text, ic: skin.ic, result: null, deadline: 0, extra: {}, ev };
  if (target !== null) grp.extra.target = target;
  if (kind === "auction") grp.extra.est = Math.round(stake * 2 * (0.8 + g.rng() * 0.6));
  if (kind === "split") grp.extra.pot = stake * seats.length * 1.3;
  const ms = g.timerMs(1);
  grp.deadline = ms ? g.now() + ms : 0;
  g.group = grp;
  seats.forEach((s) => { const pl = g.players[s]; pl.botAt = g.now() + 500 + Math.floor(g.rng() * 1200) * g.timeScale; });
  return true;
}

function groupOptions(g, p) {
  const grp = g.group; if (!grp) return [];
  if (grp.kind === "ev") return GK.ARCH[grp.ev.a].options(g, p, grp).map((o) => Object.assign({}, o, { d: String(o.d || "").replace(/\{\|e\}/g, p.gender === "f" ? "e" : ""), l: String(o.l).replace(/\{\|e\}/g, p.gender === "f" ? "e" : "") }));
  const d = GROUPS[grp.kind];
  if (grp.kind === "vote") return grp.seats.filter((s) => s !== p.seat).map((s) => ({ v: String(s), l: g.players[s].name, ic: g.players[s].avatar.acc || "👤", d: "Voter pour " + g.players[s].name })).concat([{ v: "blank", l: "Voter blanc", ic: "⚪", d: "Je m'abstiens." }]);
  if (d.role) {
    const isT = p.seat === grp.extra.target;
    const TN = g.players[grp.extra.target].name;
    const T = {
      fame: [{ v: "embrace", l: "Assumer la célébrité", ic: "🌟", d: "Je savoure mon quart d'heure de gloire." }, { v: "hide", l: "Me cacher quelques mois", ic: "🫣", d: "Je disparais le temps que ça passe." }],
      secret: [{ v: "confess", l: "Tout avouer", ic: "🕊️", d: "Autant le dire moi-même." }, { v: "deny", l: "Nier en bloc", ic: "🙅", d: "Je ne sais pas de quoi vous parlez." }],
      heritage: [{ v: "share", l: "Partager l'héritage", ic: "🤝", d: "On se le partage en famille." }, { v: "keep", l: "Tout garder", ic: "🏦", d: "Le testament est le testament." }],
      scandal: [{ v: "apology", l: "Présenter des excuses", ic: "🙏", d: "Je baisse la tête et je m'explique." }, { v: "counter", l: "Contre-attaquer", ic: "🔥", d: "Je ne me laisserai pas faire." }],
    };
    const O = {
      fame: [{ v: "support", l: "Le soutenir", ic: "🤝", d: "Je partage et je félicite " + TN + "." }, { v: "mock", l: "Se moquer de " + TN, ic: "😂", d: "Je ne peux pas m'en empêcher." }, { v: "ignore", l: "Faire comme si de rien n'était", ic: "🙈", d: "Je ne dis rien." }],
      secret: [{ v: "keep", l: "Garder le secret", ic: "🤐", d: "Je ne dirai rien à personne." }, { v: "reveal", l: "Le révéler à tout le monde", ic: "📣", d: "Les gens doivent savoir." }].concat(g.settings.hostile ? [{ v: "blackmail", l: "Faire chanter " + TN, ic: "💰", d: "Mon silence a un prix." }] : []),
      heritage: [{ v: "accept", l: "Accepter le testament", ic: "🙂", d: "C'est la volonté du défunt." }, { v: "contest", l: "Contester en justice", ic: "⚖️", d: "J'ai un avocat très cher." }],
      scandal: [{ v: "defend", l: "Faire front avec " + TN, ic: "🛡️", d: "Je prends sa défense publiquement." }, { v: "distance", l: "Prendre mes distances", ic: "🚶", d: "Je ne connais pas cette personne." }].concat(g.settings.hostile ? [{ v: "exploit", l: "Vendre une interview", ic: "🎙️", d: "Un journal paie très bien." }] : []),
    };
    return (isT ? T[grp.kind] : O[grp.kind]).map((o) => Object.assign({ ok: true }, o));
  }
  const opts = d.opts.map((o) => Object.assign({}, o));
  const S = grp.stake;
  if (grp.kind === "public") { opts[1].l = "Donner " + C.fmt(S); opts[2].l = "Donner " + C.fmt(S * 2.5); opts.forEach((o, i) => { o.cost = [0, S, S * 2.5][i]; o.ok = o.cost === 0 || p.cash >= o.cost; }); }
  if (grp.kind === "auction") { const E = grp.extra.est; opts[1].l = "Miser " + C.fmt(E * 0.5); opts[2].l = "Miser " + C.fmt(E); opts[3].l = "Miser " + C.fmt(E * 1.6); opts.forEach((o, i) => { o.cost = [0, E * 0.5, E, E * 1.6][i]; o.ok = o.cost === 0 || p.cash >= o.cost; }); }
  if (grp.kind === "heist") opts.forEach((o) => { o.ok = true; });
  opts.forEach((o) => { if (o.ok === undefined) o.ok = true; });
  return opts;
}

function groupChoose(g, seat, value) {
  const grp = g.group;
  if (g.phase !== "group" || !grp || grp.state !== "choose" || !grp.seats.includes(seat)) return { ok: false };
  const p = g.players[seat];
  const opts = groupOptions(g, p);
  const o = opts.find((x) => x.v === String(value));
  if (!o || o.ok === false) return { ok: false, error: "Choix impossible." };
  grp.choices[seat] = String(value);
  p.missed = 0; if (!p.bot) p.auto = false;
  return { ok: true };
}

function groupDefault(g, p) {
  const grp = g.group;
  const all = groupOptions(g, p);
  const opts = all.filter((o) => o.ok !== false);
  if (grp.kind === "ev") {
    if (!opts.length) return all.length ? all[0].v : "blank";
    // un robot joue selon son caractère, un humain qui n'a pas répondu prend l'option la moins coûteuse
    if (g.controlled(p)) { const v = GK.ARCH[grp.ev.a].bot(g, p, grp); return opts.some((o) => o.v === v) ? v : opts[0].v; }
    const cheapest = opts.slice().sort((a, b) => (a.cost || 0) - (b.cost || 0));
    const low = cheapest.filter((o) => (o.cost || 0) === (cheapest[0].cost || 0));
    return low[Math.floor(low.length / 2)].v;
  }
  if (!opts.length) { console.error('GROUP VIDE', grp.kind, all.length); return all.length ? all[0].v : 'blank'; }
  if (grp.kind === "vote") return pick(g.rng, opts).v;
  if (grp.kind === "dilemma") return g.rng() < 0.7 ? "coop" : "betray";
  if (grp.kind === "heist") return g.rng() < 0.4 ? "in" : "out";
  if (grp.kind === "rivalcrush") return pick(g.rng, ["fight", "yield", "laugh", "laugh"]);
  return pick(g.rng, opts).v;
}

function groupTick(g, t) {
  const grp = g.group;
  if (!grp) { g._startEvents(); return true; }
  let changed = false;
  if (grp.state === "choose") {
    grp.seats.forEach((s) => {
      const p = g.players[s];
      if (grp.choices[s] === undefined && g.controlled(p) && t >= p.botAt) { grp.choices[s] = groupDefault(g, p); changed = true; }
    });
    const all = grp.seats.every((s) => grp.choices[s] !== undefined);
    const late = grp.deadline && t >= grp.deadline;
    if (all || late) {
      grp.seats.forEach((s) => { if (grp.choices[s] === undefined) { const p = g.players[s]; grp.choices[s] = groupDefault(g, p); if (!g.controlled(p)) { p.missed++; g._maybeAuto(p); } } });
      resolveGroup(g);
      grp.state = "result";
      const ms = g.timerMs(0.5);
      grp.deadline = ms ? t + Math.max(ms, 9000 * g.timeScale) : t + 9000 * g.timeScale;
      grp.ready = {};
      g.alivePlayers().forEach((p) => { p.botAt = t + 400 + Math.floor(g.rng() * 900) * g.timeScale; });
      changed = true;
    }
  } else if (grp.state === "result") {
    g.alivePlayers().forEach((p) => { if (!grp.ready[p.seat] && g.controlled(p) && t >= p.botAt) { grp.ready[p.seat] = true; changed = true; } });
    const all = g.alivePlayers().every((p) => grp.ready[p.seat]);
    if (all || t >= grp.deadline) { g.group = null; g._startEvents(); changed = true; }
  }
  return changed;
}

function groupReady(g, seat) {
  if (g.phase !== "group" || !g.group || g.group.state !== "result") return { ok: false };
  g.group.ready[seat] = true; return { ok: true };
}

function resolveGroup(g) {
  const grp = g.group; const S = grp.stake; const rng = g.rng;
  const P = (s) => g.players[s];
  const res = { lines: {}, public: "" };
  const add = (s, text0) => { const text = text0.replace(/\{\|e\}/g, P(s).gender === "f" ? "e" : ""); res.lines[s] = text; P(s).yearLog.push(text); P(s).journal.push({ age: g.age, text, ic: grp.ic, tag: "social" }); };
  const money = (s, d) => { P(s).cash += Math.round(d); };
  const st = (s, k, d) => { P(s).stats[k] = C.clamp(P(s).stats[k] + d, 0, 100); };
  const seats = grp.seats;
  if (grp.kind === "ev") {
    const H = GK.helpers(g, grp);
    GK.ARCH[grp.ev.a].resolve(g, grp, H);
    grp.result = H.res;
    seats.forEach((sx) => { if (!H.res.lines[sx]) H.add(sx, H.res.public || "Rien de notable cette fois."); });
    if (!H.res.public) H.res.public = "Une scène collective s'est jouée.";
    g.news(null, H.res.public, "group");
    return;
  }
  if (grp.kind === "dilemma") {
    const [a, b] = seats; const ca = grp.choices[a], cb = grp.choices[b];
    const nm = (s) => P(s).name;
    if (ca === "coop" && cb === "coop") { money(a, S); money(b, S); st(a, "bonheur", 4); st(b, "bonheur", 4); add(a, "🤝 Toi et " + nm(b) + " avez coopéré, vous gagnez " + C.fmt(S) + " chacun."); add(b, "🤝 Toi et " + nm(a) + " avez coopéré, vous gagnez " + C.fmt(S) + " chacun."); res.public = "🤝 " + nm(a) + " et " + nm(b) + " se sont serré les coudes."; }
    else if (ca === "betray" && cb === "betray") { money(a, -S / 2); money(b, -S / 2); st(a, "bonheur", -4); st(b, "bonheur", -4); add(a, "🔪 Vous vous êtes trahis tous les deux, " + C.fmt(S / 2) + " perdus chacun."); add(b, "🔪 Vous vous êtes trahis tous les deux, " + C.fmt(S / 2) + " perdus chacun."); res.public = "🔪 " + nm(a) + " et " + nm(b) + " se sont trahis mutuellement."; }
    else {
      const traitor = ca === "betray" ? a : b, victim = traitor === a ? b : a;
      money(traitor, S * 2); money(victim, -S); st(traitor, "repute", -5); st(victim, "bonheur", -6); P(traitor).traits.honnete = C.clamp(P(traitor).traits.honnete - 4, 0, 100);
      add(traitor, "🔪 Tu as trahi " + nm(victim) + " et empoché " + C.fmt(S * 2) + ".");
      add(victim, "😡 " + nm(traitor) + " t'a trahi ! Tu perds " + C.fmt(S) + ".");
      res.public = "🔪 " + nm(traitor) + " a trahi " + nm(victim) + ".";
      recordGrievance(g, P(victim), P(traitor), "arnaque", S);
    }
  } else if (grp.kind === "public") {
    const amounts = { "0": 0, "1": S, "2": S * 2.5 };
    let pot = 0; seats.forEach((s) => { const c = amounts[grp.choices[s]]; pot += c; money(s, -c); });
    const share = pot * 1.5 / seats.length;
    seats.forEach((s) => { money(s, share); const c = amounts[grp.choices[s]]; const net = share - c; add(s, (c ? "🪙 Tu as donné " + C.fmt(c) + ". " : "🙈 Tu n'as rien donné. ") + "La cagnotte te rapporte " + C.fmt(share) + ", soit " + (net >= 0 ? "+" : "") + C.fmt(net) + " au total."); if (c === 0 && pot > 0) st(s, "repute", -2); if (c === amounts["2"]) { st(s, "repute", 3); P(s).traits.bonte = C.clamp(P(s).traits.bonte + 2, 0, 100); } });
    res.public = "🎪 La cagnotte a récolté " + (g.settings.wealthView === "hidden" ? "une belle somme" : C.fmt(pot)) + ", multipliée par la mairie.";
  } else if (grp.kind === "auction") {
    const E = grp.extra.est; const lv = { "0": 0, "1": 0.5, "2": 1, "3": 1.6 };
    const bids = seats.map((s) => ({ s, bid: E * lv[grp.choices[s]], lvl: lv[grp.choices[s]] })).filter((x) => x.bid > 0);
    const real = Math.round(E * Math.exp((rng() + rng() + rng() - 1.5) * 1.1));
    if (!bids.length) { seats.forEach((s) => add(s, "🙅 Personne n'a misé. La vente est annulée.")); res.public = "🔨 Personne n'a misé, vente annulée."; }
    else {
      bids.sort((a, b) => b.bid - a.bid || rng() - 0.5);
      const w = bids[0];
      money(w.s, -w.bid);
      const item = grp.skin.item;
      const a = { id: "a" + (++P(w.s).assetSeq), kind: item.kind, name: item.name, value: real, cost: w.bid, upkeep: 0, income: 0 };
      P(w.s).assets.push(a);
      const verdict = real > w.bid * 1.4 ? "une affaire en or" : real < w.bid * 0.6 ? "une arnaque" : "un prix correct";
      seats.forEach((s) => { if (s === w.s) add(s, "🔨 Tu remportes l'enchère pour " + C.fmt(w.bid) + ". L'objet vaut en réalité " + C.fmt(real) + ", " + verdict + "."); else add(s, "🔨 " + P(w.s).name + " remporte les enchères. L'objet valait " + C.fmt(real) + "."); });
      st(w.s, "bonheur", real > w.bid ? 5 : -4);
      res.public = "🔨 " + P(w.s).name + " a remporté les enchères" + wealthWord(g, w.bid) + ". L'objet valait " + C.fmt(real) + ".";
    }
  } else if (grp.kind === "vote") {
    const tally = {}; seats.forEach((s) => { tally[s] = 0; });
    seats.forEach((s) => { const v = grp.choices[s]; if (v !== "blank" && tally[Number(v)] !== undefined) tally[Number(v)]++; });
    const max = Math.max.apply(null, Object.values(tally));
    const top = seats.filter((s) => tally[s] === max);
    const win = pick(rng, top);
    const title = grp.skin.title;
    seats.forEach((s) => { if (s === win) { st(s, "repute", 10); st(s, "bonheur", 6); money(s, S * 0.5); add(s, "🗳️ Tu es élu(e) " + title + " avec " + max + " voix !"); } else add(s, "🗳️ " + P(win).name + " est élu(e) " + title + " (" + max + " voix)."); });
    res.public = "🗳️ " + P(win).name + " est élu(e) " + title + (top.length > 1 ? " après un tirage au sort" : "") + ".";
  } else if (grp.kind === "split") {
    const pot = grp.extra.pot; const n = seats.length;
    const shares = {}; let sum = 0; seats.forEach((s) => { shares[s] = Number(grp.choices[s]); sum += shares[s]; });
    const brawl = sum > 2.1 * n;
    seats.forEach((s) => {
      let gain = brawl ? pot * shares[s] / sum * 0.6 : pot * shares[s] / (2 * n);
      money(s, gain);
      if (brawl) { st(s, "bonheur", -3); if (shares[s] === 4) st(s, "repute", -4); }
      if (!brawl && shares[s] === 1) { st(s, "repute", 3); P(s).traits.bonte = C.clamp(P(s).traits.bonte + 2, 0, 100); }
      add(s, (brawl ? "💥 Trop de monde en voulait beaucoup, les avocats ont mangé le gâteau. " : "📜 Partage réussi. ") + "Tu touches " + C.fmt(gain) + ".");
    });
    res.public = brawl ? "💥 Dispute générale pour l'héritage, les avocats s'enrichissent." : "📜 Le partage s'est fait dans le calme.";
  } else if (grp.kind === "heist") {
    const crew = seats.filter((s) => grp.choices[s] === "in");
    if (!crew.length) { seats.forEach((s) => add(s, "😇 Personne n'a voulu participer au casse.")); res.public = "😇 Personne n'a voulu tenter le coup."; }
    else {
      const n = crew.length;
      let pr = 0.28 + 0.16 * (n - 1);
      pr += crew.reduce((s, x) => s + (P(x).stats.intel + P(x).traits.courage + P(x).traits.prudent) / 3 - 50, 0) / n / 300;
      pr = C.clamp(pr, 0.15, 0.85);
      if (rng() < pr) {
        const loot = S * 4 * (0.8 + rng() * 0.8); const each = loot / n * (n === 1 ? 1 : 1.3);
        crew.forEach((s) => { money(s, each); st(s, "bonheur", 6); P(s).traits.honnete = C.clamp(P(s).traits.honnete - 6, 0, 100); P(s).flags.complice = 1; P(s).flagTtl.complice = 10; add(s, "🦹 Le casse a réussi ! Ta part est de " + C.fmt(each) + "."); });
        seats.filter((s) => !crew.includes(s)).forEach((s) => add(s, "🦹 Un casse a réussi sans toi (" + crew.length + " complice" + (crew.length > 1 ? "s" : "") + ")."));
        res.public = "🦹 Un casse spectaculaire a réussi. La police cherche les coupables.";
      } else {
        crew.forEach((s) => {
          if (rng() < 0.55) { FX.applyFx(g, P(s), { prison: C.rint(rng, 1, 3), repute: -15, bonheur: -8 }, null); add(s, "🚔 Le casse a échoué, la police t'arrête. Direction la prison."); }
          else { money(s, -S); st(s, "repute", -8); add(s, "🚔 Le casse a échoué, tu t'enfuis mais tu paies " + C.fmt(S) + " d'amende."); }
        });
        seats.filter((s) => !crew.includes(s)).forEach((s) => add(s, "😅 Tu as bien fait de ne pas venir, le casse a échoué."));
        res.public = "🚔 Un casse a échoué, des arrestations ont eu lieu.";
      }
    }
  } else if (grp.kind === "fame") {
    const t = grp.extra.target; const others = seats.filter((s) => s !== t);
    const sup = others.filter((s) => grp.choices[s] === "support"), mock = others.filter((s) => grp.choices[s] === "mock");
    const tn = P(t).name;
    if (grp.choices[t] === "embrace") {
      if (sup.length >= mock.length) {
        money(t, S * 1.5); st(t, "repute", 12); st(t, "bonheur", 6);
        add(t, "🌟 Tu assumes ta célébrité et tes amis te soutiennent. Les propositions pleuvent, tu empoches " + C.fmt(S * 1.5) + ".");
        sup.forEach((s) => { st(s, "repute", 2); st(s, "bonheur", 2); add(s, "🤝 Tu as soutenu " + tn + ". Un peu de sa lumière te revient."); });
        mock.forEach((s) => { st(s, "bonheur", 3); st(s, "repute", -2); add(s, "😂 Tu t'es moqué{|e} de " + tn + ", mais la foule était contre toi."); });
        others.filter((s) => !sup.includes(s) && !mock.includes(s)).forEach((s) => add(s, "🙈 Tu as regardé " + tn + " devenir célèbre sans rien dire."));
        res.public = "🌟 " + tn + " est la star du moment, soutenu(e) par ses amis.";
      } else {
        money(t, S * 0.5); st(t, "repute", -6); st(t, "bonheur", -5);
        add(t, "😬 Tu assumes mais la moquerie de tes amis fait mal. Tu gagnes quand même " + C.fmt(S * 0.5) + ".");
        mock.forEach((s) => { st(s, "bonheur", 4); add(s, "😂 Tu as ri avec les autres de " + tn + ". Ça a fait un bien fou."); });
        sup.forEach((s) => { st(s, "bonheur", -1); add(s, "🤝 Tu as soutenu " + tn + " contre la moquerie générale."); });
        others.filter((s) => !sup.includes(s) && !mock.includes(s)).forEach((s) => add(s, "🙈 Tu as regardé la scène sans rien dire."));
        res.public = "😂 La célébrité de " + tn + " tourne à la farce publique.";
      }
    } else {
      st(t, "repute", 2); st(t, "bonheur", -2);
      add(t, "🫣 Tu te caches quelques mois. La tempête passe, il reste une légende locale.");
      others.forEach((s) => { st(s, "bonheur", grp.choices[s] === "mock" ? 2 : 0); add(s, "🙂 " + tn + " a disparu de la circulation en attendant que ça passe."); });
      res.public = "🫣 " + tn + " a préféré se faire oublier.";
    }
  } else if (grp.kind === "secret") {
    const t = grp.extra.target; const others = seats.filter((s) => s !== t); const tn = P(t).name;
    const rev = others.filter((s) => grp.choices[s] === "reveal"), bm = others.filter((s) => grp.choices[s] === "blackmail"), kp = others.filter((s) => grp.choices[s] === "keep");
    const conf = grp.choices[t] === "confess";
    if (rev.length) {
      const pen = Math.min(12, 6 * rev.length) * (conf ? 0.5 : 1);
      st(t, "repute", -pen); st(t, "bonheur", -4);
      add(t, "📣 Ton secret est révélé à tout le monde" + (conf ? ", mais ta franchise adoucit le choc." : ". Honte, rumeurs et mensonges mis à nu."));
      rev.forEach((s) => { st(s, "repute", -1); add(s, "📣 Tu as révélé le secret de " + tn + ". Tout le monde en parle."); });
    } else if (conf) { P(t).traits.honnete = C.clamp(P(t).traits.honnete + 4, 0, 100); st(t, "repute", 3); st(t, "bonheur", 3); add(t, "🕊️ Tu as tout avoué avant que personne ne parle. On respecte ta franchise."); }
    else { st(t, "bonheur", 4); add(t, "🤐 Personne n'a rien dit. Ton secret reste un secret, pour l'instant."); }
    if (bm.length) {
      const pay = Math.min(Math.max(0, P(t).cash), S * 0.7 * (conf ? 0.4 : 1));
      bm.forEach((s) => { const part = pay / bm.length; money(s, part); P(s).traits.honnete = C.clamp(P(s).traits.honnete - 3, 0, 100); st(s, "repute", -1); add(s, "💰 Tu as fait chanter " + tn + " et empoché " + C.fmt(part) + "."); });
      money(t, -pay); st(t, "bonheur", -3); add(t, "💸 On te fait chanter. Tu perds " + C.fmt(pay) + ".");
    }
    kp.forEach((s) => { P(s).traits.bonte = C.clamp(P(s).traits.bonte + 1, 0, 100); add(s, "🤐 Tu as gardé le secret de " + tn + "."); });
    res.public = rev.length ? "📣 Un secret de " + tn + " s'est répandu comme une traînée de poudre." : "🤐 Quelque chose s'est dit à voix basse, et personne ne parlera.";
  } else if (grp.kind === "heritage") {
    const t = grp.extra.target; const others = seats.filter((s) => s !== t); const tn = P(t).name;
    const pot = S * 5; const con = others.filter((s) => grp.choices[s] === "contest");
    const sh = grp.choices[t] === "share";
    if (sh) {
      const fee = con.length ? 0.15 : 0; const each = pot * (1 - fee) / seats.length;
      seats.forEach((s) => { money(s, each); add(s, "🤝 L'héritage est partagé, " + C.fmt(each) + " pour toi." + (con.length ? " Les avocats ont tout de même pris leur part." : "")); });
      st(t, "bonheur", 3); P(t).traits.bonte = C.clamp(P(t).traits.bonte + 3, 0, 100); st(t, "repute", 3);
      res.public = "🤝 " + tn + " a partagé l'héritage avec les autres.";
    } else if (!con.length) {
      money(t, pot * 0.9); st(t, "bonheur", 5); add(t, "🏦 Tu gardes tout. " + C.fmt(pot * 0.9) + " tombent dans ta poche, et les autres te regardent de travers.");
      others.forEach((s) => { st(s, "bonheur", -3); add(s, "😒 " + tn + " a gardé tout l'héritage. Tu n'as rien contesté."); });
      res.public = "🏦 " + tn + " a hérité de tout.";
    } else {
      const left = pot * 0.6; const tShare = left * 0.5; const cShare = left * 0.5 / con.length;
      money(t, tShare); st(t, "bonheur", -3); add(t, "⚖️ Procès, avocats et pertes. Tu repars avec " + C.fmt(tShare) + ".");
      con.forEach((s) => { money(s, cShare); add(s, "⚖️ Tu as contesté et obtenu " + C.fmt(cShare) + ", moins les honoraires."); });
      others.filter((s) => !con.includes(s)).forEach((s) => add(s, "😶 Tu as regardé les autres se déchirer devant le juge."));
      res.public = "⚖️ Le testament de l'oncle a fini devant le tribunal, et les avocats se sont régalés.";
    }
  } else if (grp.kind === "rivalcrush") {
    const [a, b] = seats; const ca = grp.choices[a], cb = grp.choices[b]; const na = P(a).name, nb = P(b).name;
    const sc = { fight: 0, yield: 1, laugh: 2 };
    const one = (s, c, o, o2) => {
      if (c === "fight" && o === "fight") { st(s, "bonheur", -6); st(s, "repute", -3); add(s, "🥊 Vous vous battez pour cette personne devant tout le restaurant. Elle est partie sans dessert."); }
      else if (c === "fight" && o === "yield") { st(s, "bonheur", 5); st(s, "charme", 1); add(s, "😎 " + o2 + " a laissé tomber. Tu gardes la place, et la personne en question."); }
      else if (c === "fight" && o === "laugh") { st(s, "bonheur", 2); st(s, "repute", -1); add(s, "🙃 " + o2 + " en a ri, toi tu t'es énervé{|e}. Ça ne s'oublie pas."); }
      else if (c === "yield" && o === "fight") { st(s, "bonheur", -3); add(s, "🕊️ Tu as laissé tomber face à " + o2 + ". La dignité console peu."); }
      else if (c === "yield" && o === "yield") { st(s, "bonheur", 2); P(s).traits.bonte = C.clamp(P(s).traits.bonte + 1, 0, 100); add(s, "🕊️ Vous avez tous les deux renoncé. La personne se retrouve seule, étonnée."); }
      else if (c === "yield" && o === "laugh") { st(s, "bonheur", 3); add(s, "😄 Tu as renoncé et " + o2 + " en a ri avec toi. Le soir finit mieux que prévu."); }
      else if (c === "laugh" && o === "fight") { st(s, "bonheur", 1); st(s, "repute", 1); add(s, "😂 Tu as ri, " + o2 + " s'est énervé{|e}. Tu gardes le beau rôle."); }
      else if (c === "laugh" && o === "yield") { st(s, "bonheur", 3); add(s, "😄 Tu as ri et " + o2 + " a renoncé. Quelle bonne soirée."); }
      else { st(s, "bonheur", 6); P(s).traits.sociable = C.clamp(P(s).traits.sociable + 2, 0, 100); add(s, "🥂 Vous avez ri aux larmes avec " + o2 + ". Une belle amitié naît de ce carnage."); }
    };
    one(a, ca, cb, nb); one(b, cb, ca, na);
    res.public = ca === "laugh" && cb === "laugh" ? "🥂 " + na + " et " + nb + " ont fini la soirée en meilleurs amis." : ca === "fight" && cb === "fight" ? "🥊 " + na + " et " + nb + " se sont écharpés devant tout le restaurant." : "💘 " + na + " et " + nb + " ont réglé l'affaire autour d'une table.";
  } else if (grp.kind === "scandal") {
    const t = grp.extra.target; const others = seats.filter((s) => s !== t); const tn = P(t).name;
    const df = others.filter((s) => grp.choices[s] === "defend"), di = others.filter((s) => grp.choices[s] === "distance"), ex = others.filter((s) => grp.choices[s] === "exploit");
    const apo = grp.choices[t] === "apology";
    let dRep = apo ? -3 : -6; let dBon = apo ? -3 : -2;
    if (apo) P(t).traits.honnete = C.clamp(P(t).traits.honnete + 2, 0, 100); else P(t).traits.courage = C.clamp(P(t).traits.courage + 2, 0, 100);
    dRep += df.length * 3; dBon += df.length * 2; dRep -= ex.length * 4; dBon -= ex.length * 2;
    st(t, "repute", dRep); st(t, "bonheur", dBon);
    add(t, (apo ? "🙏 Tu présentes des excuses. " : "🔥 Tu contre-attaques. ") + (df.length ? "Certains te défendent. " : "") + (ex.length ? "Quelqu'un a vendu une interview sur toi. " : "") + "Ta réputation évolue de " + (dRep >= 0 ? "+" : "") + Math.round(dRep) + ".");
    df.forEach((s) => { st(s, "repute", -2); P(s).traits.bonte = C.clamp(P(s).traits.bonte + 2, 0, 100); add(s, "🛡️ Tu as défendu " + tn + ". Quelques éclaboussures sont retombées sur toi."); });
    di.forEach((s) => { add(s, "🚶 Tu as pris tes distances. Prudent{|e}, mais un peu lâche."); });
    ex.forEach((s) => { money(s, S * 0.5); st(s, "repute", 2); P(s).traits.honnete = C.clamp(P(s).traits.honnete - 3, 0, 100); add(s, "🎙️ Tu as vendu une interview sur " + tn + " pour " + C.fmt(S * 0.5) + "."); });
    res.public = "🗞️ Le scandale autour de " + tn + " a fait la une, " + (df.length ? "certains l'ont défendu" : "personne ne l'a défendu") + ".";
  }
  grp.result = res;
  g.news(null, res.public, "group");
}

module.exports = { recordLoss, startDuel, KINDS, DUELS, GROUPS, duelsFor, offerActions, describeAction, validate, resolveActions, respond, expireOffers, offerText, botRespond, botAction, botActChance, botFinance, loanTick, yearEnd, onDeath, planGroup, breakUp, groupOptions, groupChoose, groupTick, groupReady, applyOffer };
