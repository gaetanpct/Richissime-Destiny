// ============================================================
// RICHISSIME DESTINY — Moteur des scènes collectives
// Un événement collectif est une courte fiche (texte, âges, paramètres) rattachée à une mécanique.
// Chaque mécanique a ses propres choix et sa propre résolution, avec de vrais enjeux.
// Choisir de ne rien faire n'est jamais la meilleure option à tous les coups.
// Aucun texte ne contient de deux-points.
// ============================================================
const C = require("./core");
const FX = require("./fx");
const SK = require("./socialkit");
const { pick } = require("./pools");

const LIST = [];
const byId = {};
function reg(ev) {
  if (byId[ev.id]) throw new Error("événement collectif en double " + ev.id);
  ev.ages = ev.ages || [8, 120]; ev.min = ev.min || 2; ev.max = ev.max || 6;
  LIST.push(ev); byId[ev.id] = ev;
  return ev;
}
function regAll(arch, defaults, list) { list.forEach((e) => reg(Object.assign({ a: arch }, defaults, e))); }

const gauss = (rng) => { let u = 0, v = 0; while (u === 0) u = rng(); while (v === 0) v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const fmt = (x) => C.fmt(Math.round(x));
const lc = (s) => s;

// ---------- outils pour la résolution ----------
function helpers(g, grp) {
  const P = (s) => g.players[s];
  const res = { lines: {}, public: "" };
  const add = (s, text0) => {
    const text = String(text0).replace(/\{\|e\}/g, P(s).gender === "f" ? "e" : "").replace(/\s*:\s*/g, ", ");
    res.lines[s] = res.lines[s] ? res.lines[s] + " " + text : text;
    P(s).yearLog.push(text);
    if (grp.big || (grp.ev && grp.ev.journal)) P(s).journal.push({ age: g.age, text, ic: grp.ic, tag: "social" });
  };
  return {
    res, P, add, rng: g.rng, S: grp.stake, seats: grp.seats, ch: (s) => grp.choices[s], ev: grp.ev, grp,
    money: (s, d) => { P(s).cash += Math.round(d); if (P(s).life) { if (d > 0) P(s).life.gains += Math.round(d); else P(s).life.losses -= Math.round(d); } },
    st: (s, k, d) => { P(s).stats[k] = C.clamp(P(s).stats[k] + d, 0, 100); },
    tr: (s, k, d) => { P(s).traits[k] = C.clamp(P(s).traits[k] + d, 0, 100); },
    fx: (s, fx) => FX.applyFx(g, P(s), fx, null),
    bond: (a, b, d) => { if (a !== b) SK.touch(g, a, b, d); },
    pub: (t) => { res.public = String(t).replace(/\s*:\s*/g, ", "); },
    name: (s) => P(s).name,
  };
}
const nm = (H, list) => list.map((s) => H.name(s)).join(", ").replace(/, ([^,]*)$/, " et $1");
function link(H, group, d) { for (let i = 0; i < group.length; i++) for (let j = i + 1; j < group.length; j++) H.bond(group[i], group[j], d); }
function cross(H, A, B, d) { A.forEach((a) => B.forEach((b) => H.bond(a, b, d))); }
const grief = (g, victim, culprit, kind, loot) => { g.grievances = (g.grievances || []).filter((x) => x.round >= g.round - 2); g.grievances.push({ v: victim.seat, c: culprit.seat, kind, round: g.round, loot: loot || 0 }); };

// coût d'une option selon l'argent du joueur
const afford = (p, cost) => cost === 0 || p.cash >= cost;
const T = (p, k) => (p.traits[k] === undefined ? 50 : p.traits[k]);

// ============================================================
// MÉCANIQUES
// ============================================================
const ARCH = {};

// ---- 1. Affaire à plusieurs, avec risque partagé ----
ARCH.venture = {
  options(g, p, grp) {
    const S = grp.stake, e = grp.ev;
    const o = [
      { v: "0", l: "Rester en dehors", ic: "🙅", d: "Je regarde les autres tenter leur chance.", cost: 0 },
      { v: "1", l: "Petite mise", ic: "🪙", d: "Une mise raisonnable.", cost: S },
      { v: "2", l: "Grosse mise", ic: "💎", d: "Je crois à cette affaire.", cost: S * 2.5 },
      { v: "3", l: "Tout y mettre", ic: "🔥", d: "Quitte ou double sur cette affaire.", cost: S * 7 },
    ];
    o[1].l = "Miser " + fmt(o[1].cost); o[2].l = "Miser " + fmt(o[2].cost); o[3].l = "Miser " + fmt(o[3].cost);
    o.forEach((x) => { x.ok = afford(p, x.cost); });
    return o;
  },
  bot(g, p, grp) {
    const r = g.rng(); const brave = (T(p, "courage") + T(p, "ambition") - T(p, "prudent") + 100) / 300;
    const ev = grp.ev; const good = ev.pr * (ev.mult[0] + ev.mult[1]) / 2;
    const w = [Math.max(0.05, 0.6 - brave * 0.6 - (good - 1) * 0.5), 0.9, brave * 1.1 * good, brave * 0.22 * good];
    const sum = w.reduce((a, b) => a + b, 0); let x = r * sum, i = 0; for (; i < 3; i++) { x -= w[i]; if (x <= 0) break; }
    return String(i);
  },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng;
    const amt = { "0": 0, "1": S, "2": S * 2.5, "3": S * 7 };
    const inv = grp.seats.filter((s) => grp.choices[s] !== "0");
    const out = grp.seats.filter((s) => grp.choices[s] === "0");
    if (!inv.length) { grp.seats.forEach((s) => H.add(s, ev.none || "🙅 Personne n'a osé se lancer. L'occasion est passée.")); H.pub("🙅 Personne n'a osé tenter l'affaire."); return; }
    let pr = ev.pr + 0.04 * (inv.length - 1);
    if (ev.stat) pr += (inv.reduce((a, s) => a + H.P(s).stats[ev.stat], 0) / inv.length - 50) / 250;
    pr = C.clamp(pr, 0.08, 0.92);
    const ok = rng() < pr;
    const jack = ok && rng() < (ev.jack || 0.05);
    const m = ev.mult[0] + rng() * (ev.mult[1] - ev.mult[0]);
    inv.forEach((s) => {
      const c = amt[grp.choices[s]];
      if (ok) {
        const back = c * m * (jack ? 3 : 1);
        H.money(s, back - c); H.st(s, "bonheur", 4 + (jack ? 5 : 0)); H.st(s, "repute", 2);
        H.add(s, (ev.win || "💰 L'affaire est un succès.") + " Ta mise de " + fmt(c) + " devient " + fmt(back) + (jack ? ", un résultat hors du commun." : "."));
      } else {
        const lost = c * (ev.loss === undefined ? 0.9 : ev.loss);
        H.money(s, -lost); H.st(s, "bonheur", -4);
        H.add(s, (ev.lose || "📉 L'affaire tourne mal.") + " Tu perds " + fmt(lost) + ".");
        if (c >= S * 7) { H.tr(s, "prudent", 2); }
      }
    });
    out.forEach((s) => {
      if (ok) { H.st(s, "bonheur", -2); H.add(s, "😬 " + (ev.regret || "Tu as laissé passer une affaire qui a marché.") + " " + nm(H, inv) + (inv.length > 1 ? " ont" : " a") + " gagné de l'argent sans toi."); H.tr(s, "prudent", 1); }
      else { H.st(s, "bonheur", 1); H.add(s, "😌 Tu as bien fait de rester en dehors. " + nm(H, inv) + (inv.length > 1 ? " ont" : " a") + " perdu de l'argent."); }
    });
    link(H, inv, { aff: ok ? 3 : -1 });
    if (!ok && inv.length > 1) { const big = inv.slice().sort((a, b) => amt[grp.choices[b]] - amt[grp.choices[a]])[0]; if (inv.length > 1 && rng() < 0.35) inv.filter((s) => s !== big).forEach((s) => H.bond(s, big, { riv: 3, aff: -3 })); }
    H.pub(ok ? (jack ? "🚀 " : "💰 ") + (ev.pubWin || "L'affaire a marché") + (jack ? ", et même au-delà de tout espoir." : ".") : "📉 " + (ev.pubLose || "L'affaire a tourné court") + ".");
  },
};

// ---- 2. Travail d'équipe (remplace l'ancienne cagnotte) ----
ARCH.teamwork = {
  options(g, p, grp) {
    const S = grp.stake;
    const o = [
      { v: "2", l: "Se donner à fond", ic: "💪", d: "Temps, énergie et un peu d'argent.", cost: S * 0.5 },
      { v: "1", l: "Participer normalement", ic: "🙂", d: "Ma part du travail.", cost: S * 0.15 },
      { v: "0", l: "Laisser les autres faire", ic: "🛋️", d: "Je ne bouge pas. Si ça marche, j'en profite un peu.", cost: 0 },
    ];
    o.forEach((x) => { x.ok = afford(p, x.cost); });
    return o;
  },
  bot(g, p, grp) {
    const k = (T(p, "bonte") + T(p, "sociable") + T(p, "ambition") + T(p, "honnete")) / 400; const r = g.rng();
    if (r < k * 0.75) return "2"; if (r < 0.28 + k * 0.85) return "1"; return "0";
  },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng; const n = grp.seats.length;
    const e = {}; let E = 0; grp.seats.forEach((s) => { e[s] = Number(grp.choices[s]); E += e[s]; });
    const cost = { 2: S * 0.5, 1: S * 0.15, 0: 0 };
    grp.seats.forEach((s) => { H.money(s, -cost[e[s]]); if (e[s] === 2) { H.st(s, "bonheur", -2); } });
    const pr = C.clamp(0.08 + 0.92 * E / (1.7 * n), 0.08, 0.97);
    const ok = rng() < pr;
    const workers = grp.seats.filter((s) => e[s] === 2), lazy = grp.seats.filter((s) => e[s] === 0), mid = grp.seats.filter((s) => e[s] === 1);
    if (ok) {
      const pot = S * (ev.rew || 3.2) * n;
      const wt = { 2: 1.4, 1: 1, 0: 0.45 }; const tot = grp.seats.reduce((a, s) => a + wt[e[s]], 0);
      grp.seats.forEach((s) => {
        const share = pot * wt[e[s]] / tot; H.money(s, share);
        H.st(s, "bonheur", e[s] === 0 ? 2 : 5);
        if (e[s] === 2) { H.st(s, "repute", 4); H.tr(s, "bonte", 1); H.tr(s, "ambition", 1); }
        if (e[s] === 0) { H.st(s, "repute", -3); H.tr(s, "honnete", -1); }
        H.add(s, (ev.win || "🏆 Le projet réussit.") + " Ta part est de " + fmt(share) + (e[s] === 0 ? ", sans avoir levé le petit doigt." : e[s] === 2 ? ", pour un travail qui se voit." : "."));
      });
      link(H, workers.concat(mid), { aff: 4 });
      cross(H, workers, lazy, { aff: -4, riv: 3 });
      H.pub("🏆 " + (ev.pubWin || "Le projet commun est un succès") + (lazy.length ? ", même si certains se sont bien reposés." : ", grâce à toute l'équipe."));
    } else {
      grp.seats.forEach((s) => {
        H.st(s, "bonheur", e[s] === 2 ? -3 : -1);
        if (e[s] === 0) { H.add(s, (ev.lose || "💥 Le projet échoue, faute d'élan.") + " Tu n'y avais pas mis grand chose, tu ne perds rien de plus."); }
        else H.add(s, (ev.lose || "💥 Le projet échoue, faute d'élan.") + " Ton effort de " + fmt(cost[e[s]]) + " et ton temps sont perdus.");
      });
      cross(H, workers.concat(mid), lazy, { aff: -5, riv: 4 });
      H.pub("💥 " + (ev.pubLose || "Le projet commun n'a pas abouti") + (lazy.length ? ", et on cherche déjà des responsables." : "."));
    }
  },
};

// ---- 3. Catastrophe commune ----
ARCH.crisis = {
  options(g, p, grp) {
    const o = [
      { v: "help", l: "Porter secours", ic: "🦸", d: "Je risque ma peau et ma santé pour les autres.", cost: 0 },
      { v: "save", l: "Protéger les miens et mes affaires", ic: "🧳", d: "Je pense d'abord à ce qui m'appartient.", cost: 0 },
      { v: "flee", l: "Fuir loin", ic: "🏃", d: "Je m'en sors, le reste n'est plus mon problème.", cost: 0 },
    ];
    if (g.settings.mature) o.push({ v: "loot", l: "Profiter de la panique", ic: "🕶️", d: "Dans la confusion, il y a de bonnes affaires.", cost: 0 });
    o.forEach((x) => { x.ok = true; });
    return o;
  },
  bot(g, p, grp) {
    const r = g.rng(); const good = (T(p, "bonte") + T(p, "courage")) / 200; const bad = (100 - T(p, "honnete")) / 100;
    if (r < good * 0.55) return "help"; if (r < good * 0.55 + 0.3) return "save"; if (g.settings.mature && r > 0.93 - bad * 0.12) return "loot"; return "flee";
  },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng; const sev = ev.sev || 0.6;
    const hl = grp.seats.filter((s) => grp.choices[s] === "help");
    const f = Math.max(0.25, 1 - 0.28 * hl.length) * (hl.length === 0 ? 1.4 : 1);
    const dmg = S * 2.2 * sev * f;
    const saved = [];
    grp.seats.forEach((s) => {
      const c = grp.choices[s]; const p = H.P(s);
      if (c === "help") {
        const d = dmg * 0.55; H.money(s, -d); const hurt = Math.round((4 + rng() * 8) * sev * (ev.danger ? 1.5 : 1)); H.st(s, "sante", -hurt);
        H.st(s, "repute", 8); H.st(s, "bonheur", 3); H.tr(s, "bonte", 2); H.tr(s, "courage", 2);
        let line = (ev.helpLine || "🦸 Tu portes secours aux autres.") + " Tu perds " + fmt(d) + " et laisses " + hurt + " points de santé.";
        if (ev.danger && rng() < 0.05 * sev) { FX.applyFx(g, p, { die: { cause: ev.dieCause || "mort en portant secours aux autres", final: false, story: ev.dieStory || "Tu es mort{|e} en portant secours aux autres." } }, null); line += " Hélas, tu ne t'en sortiras pas."; }
        H.add(s, line); saved.push(s);
      } else if (c === "save") {
        const d = dmg * 0.75; H.money(s, -d); H.st(s, "bonheur", -1); H.add(s, (ev.saveLine || "🧳 Tu protèges ce que tu peux.") + " La catastrophe te coûte " + fmt(d) + ".");
      } else if (c === "flee") {
        const d = dmg * 0.4; H.money(s, -d); H.st(s, "repute", -3); H.st(s, "bonheur", -3); H.tr(s, "courage", -1);
        H.add(s, (ev.fleeLine || "🏃 Tu fuis loin du danger.") + " Tu perds " + fmt(d) + " et un peu de ton estime de toi.");
      } else {
        const gain = S * (0.5 + rng() * 0.9); H.money(s, gain); H.st(s, "repute", -10); H.tr(s, "honnete", -5);
        if (rng() < 0.32) { H.fx(s, { record: 1 }); H.money(s, -gain * 0.9); H.add(s, "🕶️ Tu pilles dans la panique, mais une caméra t'a filmé. Tu rends tout et paies une amende. Casier de plus."); }
        else H.add(s, "🕶️ Tu profites de la confusion pour récupérer " + fmt(gain) + ". Personne ne t'a vu, pour l'instant.");
      }
    });
    link(H, hl, { aff: 4 });
    const looters = grp.seats.filter((s) => grp.choices[s] === "loot");
    cross(H, hl, grp.seats.filter((s) => grp.choices[s] === "flee"), { aff: -2 });
    looters.forEach((l) => hl.forEach((h) => { if (rng() < 0.5) { H.bond(l, h, { riv: 4 }); } }));
    H.pub((ev.pub || "🚨 Une catastrophe a frappé.") + " " + (hl.length ? nm(H, hl) + " ont porté secours." : "Personne n'a porté secours, les dégâts sont lourds."));
  },
};

// ---- 4. Concours ----
ARCH.contest = {
  options(g, p, grp) {
    const S = grp.stake;
    const o = [
      { v: "prep", l: "Me préparer sérieusement", ic: "📚", d: "Du travail en amont, c'est un coût mais un vrai atout.", cost: S * 0.15 },
      { v: "go", l: "Y aller à l'instinct", ic: "🎲", d: "Je compte sur mon talent et sur la chance.", cost: 0 },
      { v: "all", l: "Tout donner, quitte à se blesser", ic: "🔥", d: "Un gros risque, une grosse chance.", cost: S * 0.05 },
    ];
    if (g.settings.mature) o.push({ v: "cheat", l: "Tricher discrètement", ic: "🃏", d: "Une aide cachée. Si on te prend, c'est la disqualification et la honte.", cost: S * 0.1 });
    o.push({ v: "out", l: "Ne pas participer", ic: "🙅", d: "Je regarde depuis la tribune.", cost: 0 });
    o.forEach((x) => { x.ok = afford(p, x.cost); });
    return o;
  },
  bot(g, p, grp) {
    const r = g.rng(); const dishonest = (100 - T(p, "honnete")) / 100; const brave = T(p, "courage") / 100;
    if (r < 0.1) return "out"; if (g.settings.mature && r < 0.1 + dishonest * dishonest * 0.35) return "cheat"; if (r < 0.55) return "prep"; return brave > 0.6 && r > 0.8 ? "all" : "go";
  },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng; const stat = ev.stat || "intel";
    const cost = { prep: S * 0.15, go: 0, all: S * 0.05, cheat: S * 0.1, out: 0 };
    const part = grp.seats.filter((s) => grp.choices[s] !== "out");
    grp.seats.forEach((s) => H.money(s, -cost[grp.choices[s]]));
    if (part.length < 1) { grp.seats.forEach((s) => H.add(s, "🙅 Personne ne s'est présenté. Le concours est annulé.")); H.pub("🙅 Le concours a été annulé faute de candidats."); return; }
    const sc = {}; const caught = [];
    part.forEach((s) => {
      const c = grp.choices[s]; let v = H.P(s).stats[stat] + gauss(rng) * 12;
      if (c === "prep") v += 9; if (c === "all") v += 4 + gauss(rng) * 14; if (c === "cheat") { v += 15; if (rng() < 0.38) caught.push(s); }
      sc[s] = v;
    });
    const valid = part.filter((s) => !caught.includes(s)).sort((a, b) => sc[b] - sc[a]);
    const prize = S * (ev.prize || 3);
    valid.forEach((s, i) => {
      if (i === 0) { H.money(s, prize); H.st(s, "repute", 9); H.st(s, "bonheur", 6); H.tr(s, "ambition", 1); if (ev.stat) H.st(s, ev.stat, 1); H.add(s, (ev.win || "🏆 Tu remportes le concours.") + " Tu empoches " + fmt(prize) + "."); }
      else if (i === 1) { H.money(s, prize * 0.3); H.st(s, "bonheur", 2); H.add(s, "🥈 Tu finis deuxième et touches " + fmt(prize * 0.3) + "."); }
      else { H.st(s, "bonheur", i === valid.length - 1 && valid.length > 3 ? -2 : 0); H.add(s, "🎽 Tu termines à la " + (i + 1) + "e place, sans prix mais avec de l'expérience."); }
      if (grp.choices[s] === "all" && rng() < 0.25) { H.st(s, "sante", -7); H.add(s, "🤕 Tu t'es fait mal en forçant."); }
    });
    caught.forEach((s) => { H.st(s, "repute", -12); H.st(s, "bonheur", -6); H.tr(s, "honnete", -4); H.add(s, "🚨 Ta triche est découverte. Disqualification et honte devant tout le monde."); grp.seats.filter((x) => x !== s).forEach((x) => H.bond(x, s, { aff: -4, riv: 2 })); });
    grp.seats.filter((s) => grp.choices[s] === "out").forEach((s) => H.add(s, "🍿 Tu regardes le concours depuis la tribune. " + (valid[0] !== undefined ? H.name(valid[0]) + " l'emporte." : "Personne ne gagne.")));
    if (valid[0] !== undefined) valid.slice(1).forEach((s) => { if (rng() < 0.3) H.bond(s, valid[0], { riv: 3 }); });
    H.pub(valid[0] !== undefined ? "🏆 " + H.name(valid[0]) + " remporte " + (ev.pubWin || "le concours") + (caught.length ? ", après une disqualification pour triche." : ".") : "🚨 Tous les finalistes ont été disqualifiés pour triche.");
  },
};

// ---- 5. Pari collectif ----
ARCH.pari = {
  options(g, p, grp) {
    const S = grp.stake, ev = grp.ev; const ante = S * 0.6;
    const o = ev.out.map((x, i) => ({ v: "b" + i, l: x.l, ic: x.ic || "🎯", d: "Parier " + fmt(ante) + " sur ce résultat.", cost: ante }));
    o.push({ v: "no", l: "Ne pas parier", ic: "🙅", d: "Je regarde sans mise.", cost: 0 });
    o.forEach((x) => { x.ok = afford(p, x.cost); });
    return o;
  },
  bot(g, p, grp) {
    const ev = grp.ev; if (g.rng() < 0.18 + T(p, "prudent") / 400) return "no";
    const w = ev.out.map((x) => x.w); let r = g.rng() * w.reduce((a, b) => a + b, 0), i = 0; for (; i < w.length - 1; i++) { r -= w[i]; if (r <= 0) break; }
    return "b" + i;
  },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng; const ante = S * 0.6;
    const w = ev.out.map((x) => x.w); let r = rng() * w.reduce((a, b) => a + b, 0), win = 0; for (; win < w.length - 1; win++) { r -= w[win]; if (r <= 0) break; }
    const bettors = grp.seats.filter((s) => grp.choices[s] !== "no"); const winners = bettors.filter((s) => grp.choices[s] === "b" + win);
    const label = ev.out[win].l;
    bettors.forEach((s) => H.money(s, -ante));
    const pot = ante * bettors.length;
    if (!bettors.length) { grp.seats.forEach((s) => H.add(s, "🙅 Personne n'a parié. Le résultat est « " + label + " ».")); H.pub("🎯 Personne n'a parié."); return; }
    if (winners.length) {
      const each = (pot * 0.95 + (winners.length === bettors.length ? ante * 0.1 * bettors.length : 0)) / winners.length;
      winners.forEach((s) => { H.money(s, each); H.st(s, "bonheur", 5); H.add(s, "🎯 Bien vu. Le résultat est « " + label + " ». Tu gagnes " + fmt(each) + " pour une mise de " + fmt(ante) + "."); });
    }
    bettors.filter((s) => !winners.includes(s)).forEach((s) => { H.st(s, "bonheur", -3); H.add(s, "🙈 Raté. Le résultat est « " + label + " », tu perds ta mise de " + fmt(ante) + "."); });
    grp.seats.filter((s) => grp.choices[s] === "no").forEach((s) => H.add(s, "🍿 Tu n'as pas parié. Le résultat est « " + label + " »."));
    if (winners.length && winners.length < bettors.length) cross(H, bettors.filter((s) => !winners.includes(s)), winners, { riv: 1 });
    H.pub("🎯 " + (ev.pub || "Le pari collectif") + " donne « " + label + " », " + (winners.length ? nm(H, winners) + " " + (winners.length > 1 ? "empochent" : "empoche") + " la cagnotte des paris." : "personne n'avait deviné, la maison garde tout."));
  },
};

// ---- 6. Loterie ----
ARCH.lottery = {
  options(g, p, grp) {
    const price = grp.stake * 0.25;
    const o = [{ v: "0", l: "Pas de ticket", ic: "🙅", d: "Je passe mon tour.", cost: 0 }, { v: "1", l: "Un ticket", ic: "🎟️", d: "Une petite chance.", cost: price }, { v: "3", l: "Trois tickets", ic: "🎟️", d: "Trois fois plus de chances.", cost: price * 3 }, { v: "8", l: "Huit tickets", ic: "🎰", d: "Je veux vraiment gagner.", cost: price * 8 }];
    o.forEach((x) => { x.ok = afford(p, x.cost); }); return o;
  },
  bot(g, p, grp) { const r = g.rng(); const risk = (T(p, "courage") - T(p, "prudent") + 100) / 200; if (r < 0.25 - risk * 0.1) return "0"; if (r < 0.7) return "1"; return r < 0.7 + risk * 0.2 ? "8" : "3"; },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng; const price = S * 0.25;
    const tk = {}; let tot = 0; grp.seats.forEach((s) => { tk[s] = Number(grp.choices[s]); tot += tk[s]; H.money(s, -tk[s] * price); });
    if (!tot) { grp.seats.forEach((s) => H.add(s, "🙅 Personne n'a pris de ticket. Le tirage n'a pas lieu.")); H.pub("🎟️ Le tirage a été annulé."); return; }
    let r = rng() * tot, win = grp.seats[0]; for (const s of grp.seats) { r -= tk[s]; if (r <= 0) { win = s; break; } }
    const prize = S * (ev.prize || 4) + tot * price * 0.7; H.money(win, prize); H.st(win, "bonheur", 8); H.st(win, "repute", 2);
    grp.seats.forEach((s) => { if (s === win) H.add(s, "🎉 Le ticket gagnant est le tien. " + (ev.win || "Tu remportes le gros lot") + " de " + fmt(prize) + ", pour " + fmt(tk[s] * price) + " de mise."); else { H.st(s, "bonheur", tk[s] ? -2 : 0); H.add(s, (tk[s] ? "🎟️ Perdu. Tes " + fmt(tk[s] * price) + " de tickets sont partis en fumée. " : "🍿 Tu n'avais pas de ticket. ") + H.name(win) + " remporte le gros lot de " + fmt(prize) + "."); if (tk[s] >= 3 && rng() < 0.3) H.bond(s, win, { riv: 2 }); } });
    H.pub("🎟️ " + H.name(win) + " " + (ev.pubWin || "gagne la loterie") + ".");
  },
};

// ---- 7. Un joueur a un problème, les autres décident de l'aider ----
ARCH.favor = {
  role: true,
  options(g, p, grp) {
    const t = grp.extra.target, S = grp.stake, n = grp.seats.length; const need = S * (grp.ev.need || 4); const part = need / Math.max(1, n - 1);
    if (p.seat === t) return [{ v: "ask", l: "Demander de l'aide à tous", ic: "🙏", d: "J'avoue que je n'y arrive pas seul(e).", ok: true }, { v: "alone", l: "Me débrouiller seul(e)", ic: "🧱", d: "Je paie tout moi-même, quitte à me serrer la ceinture.", ok: true }, { v: "hide", l: "Faire comme si de rien n'était", ic: "🫣", d: "Les ennuis finiront par passer.", ok: true }];
    const o = [{ v: "full", l: "Donner " + fmt(part), ic: "🤝", d: "Je prends ma part du problème.", cost: part }, { v: "half", l: "Donner " + fmt(part / 2), ic: "🪙", d: "Un geste, sans me ruiner.", cost: part / 2 }, { v: "no", l: "Ne rien donner", ic: "🙈", d: "Chacun ses soucis.", cost: 0 }];
    if (g.settings.hostile && g.settings.mature) o.push({ v: "exploit", l: "En profiter", ic: "🦈", d: "Je lui rachète ses affaires à bas prix.", cost: 0 });
    o.forEach((x) => { x.ok = afford(p, x.cost || 0); }); return o;
  },
  bot(g, p, grp) {
    const t = grp.extra.target;
    if (p.seat === t) { const r = g.rng(); return r < 0.55 ? "ask" : r < 0.85 ? "alone" : "hide"; }
    const bd = SK.bond(g, p.seat, t); const k = (T(p, "bonte") + bd.aff + (100 - bd.riv * 1.5)) / 250; const r = g.rng();
    if (g.settings.hostile && g.settings.mature && bd.riv >= 35 && r < 0.35) return "exploit";
    if (r < k * 0.8) return "full"; if (r < 0.2 + k) return "half"; return "no";
  },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng; const t = grp.extra.target; const n = grp.seats.length; const others = grp.seats.filter((s) => s !== t);
    const need = S * (ev.need || 4); const part = need / Math.max(1, n - 1); const tn = H.name(t);
    const ct = grp.choices[t];
    const amt = { full: part, half: part / 2, no: 0, exploit: 0 };
    if (ct !== "ask") {
      H.money(t, -need); H.st(t, "bonheur", ct === "alone" ? -3 : -6); if (ct === "alone") { H.tr(t, "ambition", 1); H.st(t, "repute", 2); }
      H.add(t, (ct === "alone" ? "🧱 Tu règles tout seul{|e} " : "🫣 Tu fais l'autruche, mais la facture arrive quand même, ") + "pour " + (ev.cost || "le problème") + ", soit " + fmt(need) + ".");
      others.forEach((s) => H.add(s, "👀 " + tn + " " + (ct === "alone" ? "a réglé son problème sans rien demander" : "n'a rien dit mais a eu de gros ennuis") + ". " + (ev.shortSelf || "")));
      H.pub("🧱 " + tn + " a affronté " + (ev.pubWhat || "un coup dur") + (ct === "alone" ? " en se débrouillant seul(e)." : " sans en parler."));
      return;
    }
    let A = 0; others.forEach((s) => { const c = grp.choices[s]; A += amt[c]; H.money(s, -amt[c]); });
    const ex = others.filter((s) => grp.choices[s] === "exploit");
    const cov = A / need;
    const lost = Math.max(0, need - A);
    H.money(t, A - need);
    if (cov >= 1) { H.st(t, "bonheur", 6); H.add(t, "🥹 Tout le monde s'est mobilisé pour " + (ev.cost || "ton problème") + ". Le problème de " + fmt(need) + " est entièrement couvert."); }
    else if (cov > 0) { H.st(t, "bonheur", cov > 0.5 ? 1 : -3); H.add(t, "😮‍💨 Les autres ont apporté " + fmt(A) + ". Il reste " + fmt(lost) + " à ta charge."); }
    else { H.st(t, "bonheur", -9); H.st(t, "repute", -2); H.add(t, "💔 Personne ne t'a aidé. Tu assumes seul{|e} le coût de " + fmt(need) + "."); }
    others.forEach((s) => {
      const c = grp.choices[s];
      if (c === "full") { H.st(s, "repute", 4); H.tr(s, "bonte", 2); H.st(s, "bonheur", 2); H.bond(s, t, { aff: 8 }); H.add(s, "🤝 Tu donnes " + fmt(part) + " à " + tn + ". " + (cov >= 1 ? "Grâce à vous, c'est réglé." : "")); }
      else if (c === "half") { H.st(s, "repute", 1); H.bond(s, t, { aff: 3 }); H.add(s, "🪙 Tu donnes " + fmt(part / 2) + " à " + tn + ", sans trop forcer."); }
      else if (c === "exploit") { const gain = Math.min(Math.max(0, H.P(t).cash), need * 0.35); H.money(s, gain); H.money(t, -gain); H.st(s, "repute", -4); H.tr(s, "honnete", -3); H.bond(s, t, { riv: 14, aff: -10 }); grief(g, H.P(t), H.P(s), "arnaque", gain); H.add(s, "🦈 Tu rachètes à " + tn + " ses affaires à bas prix et empoches " + fmt(gain) + " de plus-value."); H.add(t, "🦈 " + H.name(s) + " a profité de ta situation pour te racheter tes affaires à bas prix, " + fmt(gain) + " perdus."); }
      else { if (cov < 0.5) { H.st(s, "repute", -2); } H.bond(s, t, { aff: -3, riv: 2 }); H.add(s, "🙈 Tu n'as rien donné à " + tn + ".");  }
    });
    H.pub("🆘 " + tn + " a demandé de l'aide pour " + (ev.pubWhat || "un coup dur") + (cov >= 1 ? ", et le groupe a tout couvert." : cov > 0 ? ", le groupe n'a couvert qu'une partie." : ", mais personne n'a donné un sou."));
  },
};

// ---- 8. Un joueur reçoit un coup de chance ----
ARCH.windfall = {
  role: true,
  options(g, p, grp) {
    const t = grp.extra.target;
    if (p.seat === t) return [{ v: "share", l: "Partager avec les autres", ic: "🎁", d: "Une partie pour chacun.", ok: true }, { v: "keep", l: "Tout garder", ic: "🏦", d: "C'est à moi.", ok: true }, { v: "party", l: "Faire la fête avec", ic: "🍾", d: "On dépense une partie ensemble.", ok: true }];
    const o = [{ v: "cheer", l: "Féliciter chaleureusement", ic: "🎉", d: "Je suis heureux{|e} pour lui ou elle.", ok: true }, { v: "ask", l: "Demander une part", ic: "🤲", d: "Après tout, on est amis.", ok: true }, { v: "ignore", l: "Ne rien dire", ic: "😐", d: "Pas mon affaire.", ok: true }];
    if (g.settings.hostile) o.push({ v: "envy", l: "Saboter sa chance", ic: "😈", d: "Je n'ai pas supporté ça.", ok: true });
    return o.map((x) => Object.assign(x, { d: x.d.replace(/\{\|e\}/g, p.gender === "f" ? "e" : "") }));
  },
  bot(g, p, grp) {
    const t = grp.extra.target;
    if (p.seat === t) { const r = g.rng(); const k = (T(p, "bonte") + T(p, "sociable")) / 200; return r < k * 0.6 ? "share" : r < 0.35 + k * 0.4 ? "party" : "keep"; }
    const bd = SK.bond(g, p.seat, t); const r = g.rng();
    if (g.settings.hostile && bd.riv >= 30 && r < 0.4) return "envy";
    return r < 0.4 + bd.aff / 250 ? "cheer" : r < 0.7 ? "ask" : "ignore";
  },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng; const t = grp.extra.target; const others = grp.seats.filter((s) => s !== t); const tn = H.name(t);
    const gain = S * (ev.gain || 4) * (0.8 + rng() * 0.5); const ct = grp.choices[t];
    const cheer = others.filter((s) => grp.choices[s] === "cheer"), ask = others.filter((s) => grp.choices[s] === "ask"), envy = others.filter((s) => grp.choices[s] === "envy"), ign = others.filter((s) => grp.choices[s] === "ignore");
    let left = gain;
    if (ct === "share") {
      const give = gain * 0.4 / others.length; others.forEach((s) => { H.money(s, give); H.st(s, "bonheur", 3); H.bond(s, t, { aff: 6 }); H.add(s, "🎁 " + tn + " partage sa chance avec toi. Tu reçois " + fmt(give) + "."); }); left = gain * 0.6;
      H.st(t, "repute", 5); H.tr(t, "bonte", 2); H.st(t, "bonheur", 5); H.add(t, (ev.win || "🍀 Une chance incroyable.") + " Tu gardes " + fmt(left) + " et tu en donnes " + fmt(gain * 0.4) + " aux autres.");
    } else if (ct === "party") {
      left = gain * 0.7; H.add(t, (ev.win || "🍀 Une chance incroyable.") + " Tu organises une grande fête, il te reste " + fmt(left) + ".");
      others.forEach((s) => { H.st(s, "bonheur", 4); H.bond(s, t, { aff: 3 }); H.add(s, "🍾 " + tn + " invite tout le monde à fêter ça. Une belle soirée."); }); H.st(t, "bonheur", 7); H.st(t, "repute", 3);
    } else {
      H.st(t, "bonheur", 4); H.add(t, (ev.win || "🍀 Une chance incroyable.") + " Tu gardes les " + fmt(gain) + " pour toi.");
      others.forEach((s) => { if (grp.choices[s] !== "ask") H.bond(s, t, { aff: -1 }); });
    }
    if (ask.length) { const per = ct === "keep" ? 0 : left * 0.08; if (ct === "keep") ask.forEach((s) => { H.bond(s, t, { aff: -4, riv: 3 }); H.add(s, "🤲 Tu as demandé une part à " + tn + " qui a refusé. Ça laisse un goût amer."); }); else ask.forEach((s) => { H.money(s, per); left -= per; H.add(s, "🤲 Tu as demandé une part et " + tn + " t'a donné " + fmt(per) + "."); }); }
    cheer.forEach((s) => { H.bond(s, t, { aff: 4 }); H.st(s, "bonheur", 1); if (!ask.includes(s)) H.add(s, "🎉 Tu as félicité " + tn + " sincèrement."); });
    ign.forEach((s) => H.add(s, "😐 Tu n'as rien dit à " + tn + "."));
    envy.forEach((s) => { const dmg = Math.min(gain * 0.4, Math.max(0, H.P(t).cash)); H.money(t, -dmg); H.st(s, "repute", -4); H.tr(s, "honnete", -3); H.bond(s, t, { riv: 12, aff: -8 }); grief(g, H.P(t), H.P(s), "sabotage", dmg); H.add(s, "😈 Tu sabotes la chance de " + tn + ". Elle ou il perd " + fmt(dmg) + "."); H.add(t, "😈 Quelqu'un a saboté ta chance, tu perds " + fmt(dmg) + ". Tu sais très bien qui."); });
    H.money(t, left);
    H.pub("🍀 " + tn + " " + (ev.pubWin || "a eu une chance incroyable") + (ct === "share" ? " et la partage." : ct === "party" ? " et organise une fête." : ct === "keep" ? " et garde tout." : "."));
  },
};

// ---- 9. Procès ou accusation ----
ARCH.tribunal = {
  role: true,
  options(g, p, grp) {
    const t = grp.extra.target, S = grp.stake;
    if (p.seat === t) { const o = [{ v: "deny", l: "Plaider l'innocence", ic: "⚖️", d: "Je dis la vérité, ou ma version.", ok: true }, { v: "deal", l: "Négocier un arrangement", ic: "🤝", d: "Je paie " + fmt(S * 1.2) + " pour limiter les dégâts.", cost: S * 1.2, ok: afford(p, S * 1.2) }]; if (g.settings.mature) o.push({ v: "run", l: "Prendre la fuite", ic: "🏃", d: "Je disparais quelque temps.", ok: true }); return o; }
    return [{ v: "pro", l: "Témoigner en sa faveur", ic: "🛡️", d: "Je prends sa défense.", ok: true }, { v: "con", l: "Témoigner contre", ic: "👆", d: "Je dis ce que j'ai vu, ou ce que je pense avoir vu.", ok: true }, { v: "mute", l: "Rester muet", ic: "🤐", d: "Je ne veux pas être mêlé à ça.", ok: true }];
  },
  bot(g, p, grp) {
    const t = grp.extra.target;
    if (p.seat === t) { const r = g.rng(); return r < 0.7 ? "deny" : r < 0.88 ? "deal" : g.settings.mature ? "run" : "deny"; }
    const bd = SK.bond(g, p.seat, t); const r = g.rng(); const pro = (bd.aff - bd.riv + 60) / 160;
    return r < pro * 0.7 ? "pro" : r < 0.75 ? "con" : "mute";
  },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng; const t = grp.extra.target; const others = grp.seats.filter((s) => s !== t); const tn = H.name(t);
    const guilty = rng() < (ev.gp || 0.5); const ct = grp.choices[t];
    const pro = others.filter((s) => grp.choices[s] === "pro"), con = others.filter((s) => grp.choices[s] === "con"), mute = others.filter((s) => grp.choices[s] === "mute");
    const fine = S * (ev.fine || 2.5);
    if (ct === "deal") { H.money(t, -S * 1.2); H.st(t, "repute", -4); H.add(t, "🤝 Tu arranges l'affaire à l'amiable pour " + fmt(S * 1.2) + ". Pas de procès, mais on a parlé."); others.forEach((s) => H.add(s, "🤝 " + tn + " a préféré un arrangement.")); H.pub("🤝 " + tn + " a évité le procès par un arrangement."); return; }
    if (ct === "run") { H.fx(t, { bonheur: -6, repute: -10 }); H.money(t, -S * 0.6); H.add(t, "🏃 Tu disparais pendant quelques mois. Fuir te coûte " + fmt(S * 0.6) + " et ta réputation."); others.forEach((s) => H.add(s, "🏃 " + tn + " a pris la fuite avant le verdict.")); H.pub("🏃 " + tn + " s'est enfui(e) avant le verdict."); return; }
    const score = con.length * 1.0 + (guilty ? 1.2 : 0) - pro.length * 1.0 + gauss(rng) * 0.5 - (H.P(t).stats.repute - 50) / 80;
    const convicted = score > 0.35;
    if (convicted) {
      const pr = ev.prison && g.settings.mature && guilty && con.length >= 1 ? ev.prison : 0;
      if (pr) { H.fx(t, { prison: pr, repute: -15, bonheur: -8 }); H.add(t, "⚖️ Condamné{|e} pour " + (ev.what || "les faits") + ". Verdict, " + pr + " an" + (pr > 1 ? "s" : "") + " de prison."); }
      else { H.money(t, -fine); H.st(t, "repute", -10); H.st(t, "bonheur", -5); H.add(t, "⚖️ Reconnu{|e} coupable de " + (ev.what || "ces faits") + ". Amende de " + fmt(fine) + " et réputation en berne."); }
      con.forEach((s) => { H.st(s, "repute", guilty ? 4 : -4); H.bond(s, t, { riv: guilty ? 5 : 10, aff: -5 }); H.add(s, guilty ? "👆 Ton témoignage a pesé. " + tn + " est condamné{|e}, et c'était mérité." : "👆 Ton témoignage a pesé, mais " + tn + " n'avait rien fait. Tu l'as envoyé{|e} au tapis pour rien."); if (!guilty) { grief(g, H.P(t), H.P(s), "denounce", fine); } });
      pro.forEach((s) => { H.st(s, "repute", guilty ? -3 : 1); H.bond(s, t, { aff: 5 }); H.add(s, "🛡️ Tu as défendu " + tn + " en vain, le tribunal l'a condamné{|e}."); });
      mute.forEach((s) => H.add(s, "🤐 Tu es resté muet. " + tn + " est condamné{|e}."));
      H.pub("⚖️ " + tn + " a été condamné(e) pour " + (ev.what || "les faits") + ".");
    } else {
      H.st(t, "repute", guilty ? 2 : 9); H.st(t, "bonheur", 6); H.add(t, "⚖️ Tu es acquitté{|e} de l'accusation de " + (ev.what || "ces faits") + (guilty ? ". Tu as eu de la chance." : ". Ton nom est lavé."));
      con.forEach((s) => { H.st(s, "repute", guilty ? -2 : -7); H.bond(s, t, { riv: 8, aff: -6 }); H.add(s, "👆 Ton témoignage n'a pas suffi, " + tn + " est acquitté{|e}. " + (guilty ? "" : "Tout le monde a compris que tu mentais.")); if (!guilty) { H.money(s, -fine * 0.4); H.money(t, fine * 0.4); } });
      pro.forEach((s) => { H.st(s, "repute", 3); H.bond(s, t, { aff: 8 }); H.add(s, "🛡️ Tu as défendu " + tn + " et le tribunal l'a acquitté{|e}."); });
      mute.forEach((s) => H.add(s, "🤐 Tu es resté muet. " + tn + " est acquitté{|e}."));
      H.pub("⚖️ " + tn + " a été acquitté(e).");
    }
  },
};

// ---- 10. Fête, événement organisé ----
ARCH.party = {
  options(g, p, grp) {
    const S = grp.stake;
    const o = [{ v: "org", l: "Organiser", ic: "🎪", d: "Je m'en occupe, ça coûte et ça rapporte en estime.", cost: S * 0.8 }, { v: "come", l: "Venir et s'amuser", ic: "🥳", d: "Je participe de bon cœur.", cost: S * 0.1 }, { v: "stay", l: "Rester chez moi", ic: "🛋️", d: "Pas ce soir.", cost: 0 }];
    if (g.settings.hostile) o.push({ v: "ruin", l: "Tout gâcher", ic: "💣", d: "Un esclandre, une provocation, un mauvais tour.", cost: 0 });
    o.forEach((x) => { x.ok = afford(p, x.cost); }); return o;
  },
  bot(g, p, grp) { const r = g.rng(); const so = (T(p, "sociable") + T(p, "bonte")) / 200; if (g.settings.hostile && r > 0.96 - (100 - T(p, "bonte")) / 2000) return "ruin"; if (r < so * 0.35) return "org"; if (r < 0.2 + so * 0.7) return "come"; return "stay"; },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng;
    const org = grp.seats.filter((s) => grp.choices[s] === "org"), come = grp.seats.filter((s) => grp.choices[s] === "come"), ruin = grp.seats.filter((s) => grp.choices[s] === "ruin"), stay = grp.seats.filter((s) => grp.choices[s] === "stay");
    const cost = { org: S * 0.8, come: S * 0.1 };
    org.concat(come).forEach((s) => H.money(s, -cost[grp.choices[s]]));
    const att = org.concat(come);
    if (!org.length) {
      come.forEach((s) => { H.st(s, "bonheur", -2); H.add(s, "🪑 Tu arrives à l'heure et il n'y a personne qui a rien organisé. " + (come.length > 1 ? "Vous finissez par improviser quelque chose de simple." : "Tu repars déçu{|e}.")); });
      if (come.length > 1) link(H, come, { aff: 2 }); stay.forEach((s) => H.add(s, "🛋️ Tu restes chez toi. Personne n'a rien organisé, de toute façon."));
      ruin.forEach((s) => H.add(s, "💣 Tu voulais tout gâcher, mais il n'y avait rien à gâcher.")); H.pub("🪑 " + (ev.pubFail || "L'événement n'a pas eu lieu") + ", faute d'organisateur."); return;
    }
    const Q = org.length * 3 + come.length - ruin.length * 3 + gauss(rng) * 1.2 + (ev.q || 0);
    const tier = Q >= 4 ? 2 : Q >= 1 ? 1 : 0;
    if (tier === 2) {
      org.forEach((s) => { H.st(s, "repute", 9); H.st(s, "bonheur", 6); H.st(s, "charme", 1); H.tr(s, "sociable", 2); H.add(s, (ev.great || "🎊 C'est une réussite totale.") + " Ton organisation est saluée de tous."); });
      come.forEach((s) => { H.st(s, "bonheur", 5); H.add(s, (ev.great || "🎊 C'est une réussite totale.") + " Tu t'es régalé{|e}."); });
      link(H, att, { aff: 4 });
      att.forEach((s) => { if (rng() < 0.08) { H.fx(s, { argent: Math.round(S * (0.5 + rng())), pub: "" }); } });
    } else if (tier === 1) {
      org.forEach((s) => { H.st(s, "repute", 3); H.st(s, "bonheur", 2); H.add(s, (ev.ok || "🙂 C'était sympa sans plus.") + " Tu as fait de ton mieux."); });
      come.forEach((s) => { H.st(s, "bonheur", 2); H.add(s, (ev.ok || "🙂 C'était sympa sans plus.")); }); link(H, att, { aff: 1.5 });
    } else {
      org.forEach((s) => { H.st(s, "repute", -3); H.st(s, "bonheur", -3); H.add(s, (ev.bad || "🫠 Un fiasco.") + " Tu as organisé tout ça pour rien."); });
      come.forEach((s) => { H.st(s, "bonheur", -2); H.add(s, (ev.bad || "🫠 Un fiasco.")); });
    }
    ruin.forEach((s) => { H.st(s, "repute", -7); H.tr(s, "bonte", -2); H.add(s, "💣 Tu gâches tout. " + (tier === 0 ? "Ça ne s'est pas vu, c'était déjà raté." : "Tout le monde t'a vu, et ça ne se pardonne pas vite.")); if (tier > 0) att.forEach((a) => { H.bond(s, a, { riv: 7, aff: -6 }); }); });
    stay.forEach((s) => { H.st(s, "bonheur", tier === 2 ? -2 : 0); H.add(s, "🛋️ Tu es resté{|e} chez toi. " + (tier === 2 ? "On te dit que c'était extraordinaire." : "Tu n'as pas raté grand chose.")); });
    H.pub((tier === 2 ? "🎊 " : tier === 1 ? "🙂 " : "🫠 ") + (tier === 2 ? (ev.pubGreat || "Un événement mémorable") : tier === 1 ? (ev.pubOk || "Un événement correct") : (ev.pubBad || "Un événement raté")) + (ruin.length ? ", entaché par un esclandre." : "."));
  },
};

// ---- 11. Négociation ----
ARCH.negotiation = {
  options(g, p, grp) { return [{ v: "firm", l: "Rester ferme", ic: "🧱", d: "Je ne bouge pas d'un pouce.", ok: true }, { v: "soft", l: "Faire des concessions", ic: "🕊️", d: "Je cherche un terrain d'entente.", ok: true }, { v: "bluff", l: "Bluffer", ic: "🃏", d: "Je prétends avoir un autre acheteur.", ok: true }]; },
  bot(g, p, grp) { const r = g.rng(); const h = (T(p, "courage") + T(p, "ambition") + (100 - T(p, "bonte"))) / 300; return r < h * 0.5 ? "firm" : r < 0.35 + h * 0.2 ? "bluff" : "soft"; },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng; const V = S * (ev.val || 2);
    const f = grp.seats.filter((s) => grp.choices[s] === "firm"), so = grp.seats.filter((s) => grp.choices[s] === "soft"), b = grp.seats.filter((s) => grp.choices[s] === "bluff");
    grp.seats.forEach((s) => {
      const c = grp.choices[s]; let m, line;
      if (c === "soft") { m = f.length + b.length === 0 ? 0.9 : f.length ? 0.5 : 0.65; line = m >= 0.9 ? "🕊️ Tout le monde a fait des concessions, l'accord est bon pour tous." : "🕊️ Tu as cédé du terrain, d'autres en ont profité."; H.st(s, "bonheur", m >= 0.9 ? 3 : 0); }
      else if (c === "firm") { m = f.length >= 2 ? 0.35 : so.length ? 1.35 : 0.8; line = f.length >= 2 ? "🧱 Vous étiez plusieurs à rester inflexibles. L'accord est quasi bloqué." : "🧱 Ta fermeté a payé, tu obtiens plus que les autres."; H.st(s, "bonheur", f.length >= 2 ? -2 : 3); }
      else { if (f.length >= 1 || b.length >= 2) { m = 0; line = "🃏 Ton bluff est percé à jour. Tu repars sans rien et la réputation en miettes."; H.st(s, "repute", -8); H.tr(s, "honnete", -2); } else { m = 1.7; line = "🃏 Ton bluff passe. Tout le monde a cru à ton autre acheteur."; H.st(s, "bonheur", 5); H.tr(s, "honnete", -2); } }
      const gain = V * m; H.money(s, gain); H.add(s, (ev.what || "🤝 Négociation.") + " " + line + " Tu obtiens " + fmt(gain) + ".");
    });
    cross(H, f, so, { aff: -2 }); if (b.length && f.length) cross(H, f, b, { aff: -3, riv: 3 });
    H.pub("🤝 " + (ev.pub || "Une négociation à plusieurs") + (f.length >= 2 ? " a patiné, tout le monde campait sur ses positions." : so.length === grp.seats.length ? " s'est conclue dans la bonne humeur." : " a vu des gagnants et des perdants."));
  },
};

// ---- 12. Coordination ----
ARCH.coord = {
  options(g, p, grp) { return grp.ev.pick.map((x) => ({ v: x.v, l: x.l, ic: x.ic || "👉", d: x.d || "", ok: true })); },
  bot(g, p, grp) { const pk = grp.ev.pick; return g.rng() < 0.55 ? pk[0].v : pick(g.rng, pk).v; },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng; const cnt = {}; grp.seats.forEach((s) => { cnt[grp.choices[s]] = (cnt[grp.choices[s]] || 0) + 1; });
    const keys = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a]);
    const maj = cnt[keys[0]] > (cnt[keys[1]] || 0) ? keys[0] : null;
    const lab = (v) => ev.pick.find((x) => x.v === v).l;
    if (!maj) { grp.seats.forEach((s) => { H.money(s, -S * 0.2); H.st(s, "bonheur", -2); H.add(s, "🌀 Personne ne s'est mis d'accord. " + (ev.chaos || "Le groupe se disperse dans le désordre") + ". Tu perds " + fmt(S * 0.2) + "."); }); H.pub("🌀 " + (ev.pubChaos || "Le groupe n'a pas réussi à se coordonner") + "."); return; }
    const win = grp.seats.filter((s) => grp.choices[s] === maj), lose = grp.seats.filter((s) => grp.choices[s] !== maj);
    const rew = S * (ev.rew || 1.6) * (win.length === grp.seats.length ? 1.25 : 1);
    win.forEach((s) => { H.money(s, rew); H.st(s, "bonheur", 4); H.add(s, "✅ Vous avez choisi ensemble « " + lab(maj) + " ». " + (ev.win || "Ça a marché") + ", " + fmt(rew) + " pour toi."); });
    lose.forEach((s) => { H.money(s, -S * 0.25); H.st(s, "bonheur", -2); H.add(s, "🙃 Tu étais seul{|e} (ou presque) à choisir « " + lab(grp.choices[s]) + " ». Tu perds " + fmt(S * 0.25) + "."); });
    link(H, win, { aff: 2.5 });
    H.pub("✅ " + (ev.pub || "Le groupe") + " a choisi « " + lab(maj) + " »" + (lose.length ? ", malgré " + lose.length + " dissident" + (lose.length > 1 ? "s" : "") + "." : ", à l'unanimité."));
  },
};

// ---- 13. Exclusion ou récompense par le vote ----
ARCH.ballot = {
  options(g, p, grp) { const o = grp.seats.filter((s) => s !== p.seat).map((s) => ({ v: String(s), l: g.players[s].name, ic: g.players[s].avatar.acc || "👤", d: grp.ev.neg ? "Voter pour l'écarter." : "Voter pour lui ou elle.", ok: true })); o.push({ v: "blank", l: "Voter blanc", ic: "⚪", d: "Je m'abstiens.", ok: true }); return o; },
  bot(g, p, grp) {
    const o = grp.seats.filter((s) => s !== p.seat); if (!o.length || g.rng() < 0.07) return "blank";
    const w = o.map((s) => { const bd = SK.bond(g, p.seat, s); return grp.ev.neg ? 1 + bd.riv / 12 + (100 - bd.aff) / 80 : 1 + bd.aff / 15 - bd.riv / 40; });
    let r = g.rng() * w.reduce((a, b) => a + Math.max(0.1, b), 0), i = 0; for (; i < o.length - 1; i++) { r -= Math.max(0.1, w[i]); if (r <= 0) break; } return String(o[i]);
  },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng; const tally = {}; grp.seats.forEach((s) => { tally[s] = 0; });
    grp.seats.forEach((s) => { const v = grp.choices[s]; if (v !== "blank" && tally[Number(v)] !== undefined) tally[Number(v)]++; });
    const max = Math.max.apply(null, Object.values(tally));
    if (max === 0) { grp.seats.forEach((s) => H.add(s, "⚪ Tout le monde a voté blanc. " + (ev.nothing || "Rien ne change") + ".")); H.pub("⚪ Vote blanc général."); return; }
    const top = grp.seats.filter((s) => tally[s] === max); const w = top[Math.floor(rng() * top.length)]; const wn = H.name(w);
    const voters = grp.seats.filter((s) => grp.choices[s] === String(w));
    if (ev.neg) {
      H.money(w, -S * (ev.loss || 0.6)); H.st(w, "repute", -8); H.st(w, "bonheur", -6); H.tr(w, "sociable", -1);
      H.add(w, (ev.lose || "🚫 Le groupe t'écarte.") + " " + max + " voix contre toi, " + fmt(S * (ev.loss || 0.6)) + " perdus et un moral en berne.");
      grp.seats.filter((s) => s !== w).forEach((s) => { if (voters.includes(s)) { H.bond(s, w, { riv: 8, aff: -5 }); grief(g, H.P(w), H.P(s), "denounce", 0); H.add(s, "🗳️ Tu as voté pour écarter " + wn + ", et ça a marché."); } else H.add(s, "🗳️ " + wn + " est écarté{|e} (" + max + " voix)."); });
      H.pub("🚫 " + wn + " est écarté(e) du groupe par " + max + " voix.");
    } else {
      const perk = ev.perk || { argent: 0.6, repute: 10 };
      const f = {}; Object.keys(perk).forEach((k) => { f[k] = k === "argent" ? Math.round(S * perk[k]) : perk[k]; }); H.fx(w, f);
      H.add(w, (ev.win || "🏅 Tu es choisi{|e}.") + " " + max + " voix en ta faveur" + (perk.argent ? ", et " + fmt(S * perk.argent) + " à la clé." : "."));
      grp.seats.filter((s) => s !== w).forEach((s) => { if (voters.includes(s)) { H.bond(s, w, { aff: 4 }); H.add(s, "🗳️ Ton candidat, " + wn + ", l'emporte."); } else H.add(s, "🗳️ " + wn + " l'emporte (" + max + " voix)."); });
      H.pub("🏅 " + wn + " est choisi(e) (" + max + " voix)" + (top.length > 1 ? " après tirage au sort." : "."));
    }
  },
};

// ---- 14. Deux camps ----
ARCH.camps = {
  options(g, p, grp) { const e = grp.ev; return [{ v: "A", l: "Camp " + e.A, ic: "🟥", d: "Je rejoins ce camp.", ok: true }, { v: "B", l: "Camp " + e.B, ic: "🟦", d: "Je rejoins ce camp.", ok: true }, { v: "N", l: "Rester neutre", ic: "⚪", d: "Je regarde de loin.", ok: true }]; },
  bot(g, p, grp) { const r = g.rng(); return r < 0.12 ? "N" : r < 0.56 ? "A" : "B"; },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng; const stat = ev.stat || "sport";
    const A = grp.seats.filter((s) => grp.choices[s] === "A"), B = grp.seats.filter((s) => grp.choices[s] === "B"), N = grp.seats.filter((s) => grp.choices[s] === "N");
    const pw = (L) => L.reduce((a, s) => a + H.P(s).stats[stat] + gauss(rng) * 10 + 12, 0);
    const pa = pw(A), pb = pw(B);
    N.forEach((s) => { H.st(s, "bonheur", 0); H.add(s, "⚪ Tu restes neutre. " + (A.length && B.length ? "Tu regardes " + nm(H, A) + " affronter " + nm(H, B) + "." : "")); });
    if (!A.length && !B.length) { H.pub("⚪ Personne n'a voulu s'engager."); return; }
    if (!A.length || !B.length) { const W = A.length ? A : B; const gain = S * 1.2; W.forEach((s) => { H.money(s, gain); H.st(s, "bonheur", 3); H.add(s, "🏁 Aucun adversaire ne s'est présenté. Victoire par forfait, " + fmt(gain) + " pour toi."); }); link(H, W, { aff: 2 }); H.pub("🏁 Victoire par forfait pour " + nm(H, W) + "."); return; }
    const winA = pa >= pb; const W = winA ? A : B, L = winA ? B : A;
    const pot = S * (ev.prize || 2.2) * (A.length + B.length) / W.length;
    W.forEach((s) => { H.money(s, pot); H.st(s, "bonheur", 6); H.st(s, "repute", 5); H.add(s, "🏆 Ton camp (" + (winA ? ev.A : ev.B) + ") " + (ev.winWord || "l'emporte") + ". Tu touches " + fmt(pot) + "."); });
    L.forEach((s) => { H.money(s, -S * 0.25); H.st(s, "bonheur", -4); H.st(s, "repute", -2); H.add(s, "💢 Ton camp (" + (winA ? ev.B : ev.A) + ") a perdu. Tu laisses " + fmt(S * 0.25) + " et un peu de fierté."); });
    link(H, A, { aff: 4 }); link(H, B, { aff: 4 }); cross(H, A, B, { riv: 3, aff: -2 });
    if (rng() < 0.15) { const s = pick(rng, W.concat(L)); H.st(s, "sante", -6); H.add(s, "🤕 Tu t'es blessé{|e} dans la bagarre."); }
    H.pub("🏆 " + (winA ? ev.A : ev.B) + " " + (ev.winWord || "l'emporte") + " face à " + (winA ? ev.B : ev.A) + ".");
  },
};

// ---- 15. Expédition ----
ARCH.expedition = {
  options(g, p, grp) { const d = grp.ev.danger; return [{ v: "prud", l: "Y aller prudemment", ic: "🥾", d: "Un gain modeste, presque sûr.", ok: true }, { v: "aud", l: "Tenter l'audace", ic: "🧗", d: "Un gros gain possible, mais un vrai risque" + (d ? " pour ta vie." : " pour ta santé."), ok: true }, { v: "stay", l: "Rester au camp", ic: "⛺", d: "Je garde les affaires.", ok: true }]; },
  bot(g, p, grp) { const r = g.rng(); const br = (T(p, "courage") + T(p, "ambition") - T(p, "prudent") + 100) / 300; return r < 0.1 ? "stay" : r < 0.4 + br * 0.3 ? "aud" : "prud"; },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng; const go = grp.seats.filter((s) => grp.choices[s] !== "stay"); const stay = grp.seats.filter((s) => grp.choices[s] === "stay");
    if (!go.length) { grp.seats.forEach((s) => H.add(s, "⛺ Personne n'a bougé du camp. " + (ev.nope || "Rien ne s'est passé") + ".")); H.pub("⛺ L'expédition n'a pas quitté le camp."); return; }
    go.forEach((s) => {
      const c = grp.choices[s];
      if (c === "prud") { const gain = S * (0.35 + rng() * 0.3); H.money(s, gain); H.st(s, "bonheur", 3); H.add(s, (ev.safe || "🥾 Une sortie sans histoire.") + " Tu rapportes " + fmt(gain) + "."); }
      else {
        const ok = rng() < (ev.pr || 0.45) + (H.P(s).stats.sport - 50) / 300;
        if (ok) { const gain = S * (ev.big || 2.6) * (0.7 + rng() * 0.7); H.money(s, gain); H.st(s, "bonheur", 7); H.st(s, "repute", 4); H.tr(s, "courage", 2); let t = (ev.hit || "🌟 L'audace paie.") + " Tu rapportes " + fmt(gain) + "."; if (ev.item && rng() < 0.2) { H.fx(s, { item: { kind: ev.item.kind, name: ev.item.name, value: Math.round(S * ev.item.v * (0.6 + rng() * 0.9)) } }); t += " Tu ramènes aussi " + ev.item.name.toLowerCase() + "."; } H.add(s, t); }
        else {
          const hurt = Math.round(5 + rng() * 12); H.money(s, -S * 0.5); H.st(s, "sante", -hurt); H.st(s, "bonheur", -4); let t = (ev.miss || "💥 L'audace est mal récompensée.") + " Tu perds " + fmt(S * 0.5) + " et " + hurt + " points de santé.";
          if (ev.danger && rng() < 0.04) { FX.applyFx(g, H.P(s), { die: { cause: ev.dieCause || "mort pendant l'expédition", final: false, story: ev.dieStory || "Tu es mort{|e} pendant l'expédition." } }, null); t += " Les secours arrivent trop tard."; }
          H.add(s, t);
        }
      }
    });
    stay.forEach((s) => { H.st(s, "bonheur", -1); H.add(s, "⛺ Tu gardes le camp pendant que " + nm(H, go) + (go.length > 1 ? " partent" : " part") + "."); });
    link(H, go, { aff: 3.5 });
    H.pub("🧭 " + (ev.pub || "Une expédition") + " avec " + nm(H, go) + (stay.length ? ", pendant que " + nm(H, stay) + " gardait le camp." : "."));
  },
};

// ---- 16. Rançon, impôt, racket ----
ARCH.tribute = {
  role: true, mature: true,
  options(g, p, grp) {
    const t = grp.extra.target, S = grp.stake; const tr = S * (grp.ev.tr || 0.8);
    if (p.seat === t) return [{ v: "demand", l: "Exiger le tribut", ic: "👑", d: "Chacun doit payer " + fmt(tr) + ".", ok: true }, { v: "mercy", l: "Se montrer clément", ic: "🕊️", d: "Je ne demande que la moitié.", ok: true }];
    return [{ v: "pay", l: "Payer", ic: "🪙", d: "Je paie pour avoir la paix.", cost: tr, ok: afford(p, tr) }, { v: "refuse", l: "Refuser", ic: "✋", d: "Je ne paierai pas.", ok: true }, { v: "rebel", l: "Se soulever", ic: "✊", d: "Je pousse les autres à ne plus payer.", ok: true }];
  },
  bot(g, p, grp) { const t = grp.extra.target; if (p.seat === t) return g.rng() < 0.65 ? "demand" : "mercy"; const r = g.rng(); const bd = SK.bond(g, p.seat, t); const c = (T(p, "courage") + bd.riv * 1.2 - T(p, "prudent") + 50) / 200; return r < c * 0.4 ? "rebel" : r < 0.35 + c * 0.35 ? "refuse" : "pay"; },
  resolve(g, grp, H) {
    const ev = grp.ev, S = grp.stake, rng = g.rng; const t = grp.extra.target; const others = grp.seats.filter((s) => s !== t); const tn = H.name(t);
    const mercy = grp.choices[t] === "mercy"; const tr = S * (ev.tr || 0.8) * (mercy ? 0.5 : 1);
    const pay = others.filter((s) => grp.choices[s] === "pay"), ref = others.filter((s) => grp.choices[s] === "refuse"), reb = others.filter((s) => grp.choices[s] === "rebel");
    const strongRevolt = reb.length * 2 + ref.length >= others.length + 1 && reb.length >= 1;
    if (strongRevolt) {
      const loss = S * (ev.fall || 1.2); H.money(t, -loss); H.st(t, "repute", -14); H.st(t, "bonheur", -8); H.add(t, "✊ " + (ev.rebelLine || "Le groupe se soulève contre toi.") + " Tu perds " + fmt(loss) + " et ton autorité.");
      others.forEach((s) => { if (grp.choices[s] === "rebel") { H.st(s, "repute", 6); H.tr(s, "courage", 2); H.st(s, "bonheur", 4); H.bond(s, t, { riv: 6 }); H.add(s, "✊ La révolte réussit. " + tn + " perd tout pouvoir."); } else if (grp.choices[s] === "pay") { H.money(s, -tr * 0.4); H.add(s, "✊ Les autres se sont soulevés. Tu avais déjà payé une partie (" + fmt(tr * 0.4) + ")."); } else { H.st(s, "bonheur", 2); H.add(s, "✊ Tu as refusé et le groupe a suivi. " + tn + " est renversé{|e}."); } });
      H.pub("✊ " + tn + " a été renversé(e) par la révolte du groupe."); return;
    }
    let got = 0; pay.forEach((s) => { H.money(s, -tr); got += tr; H.st(s, "bonheur", -3); H.add(s, "🪙 Tu paies " + fmt(tr) + " à " + tn + ". " + (ev.payLine || "Tu as la paix, pour cette fois.")); H.bond(s, t, { aff: -2, riv: 3 }); });
    H.money(t, got); H.st(t, "bonheur", got > 0 ? 3 : -2);
    ref.concat(reb).forEach((s) => {
      const c = grp.choices[s]; if (rng() < (c === "rebel" ? 0.6 : 0.45) && !mercy) { const pen = tr * (c === "rebel" ? 1.8 : 1.3); H.money(s, -pen); H.money(t, pen); H.st(s, "bonheur", -4); H.bond(s, t, { riv: 10 }); grief(g, H.P(t), H.P(s), "chantage", 0); H.add(s, "🔥 " + tn + " te fait payer ton refus. Représailles, tu perds " + fmt(pen) + "."); }
      else { H.st(s, "repute", 3); H.tr(s, "courage", 1); H.add(s, "✋ Tu as tenu bon, et " + tn + " n'a rien pu faire cette fois."); }
    });
    H.add(t, (ev.demandLine || "👑 Tu lèves un tribut.") + " Tu encaisses " + fmt(got) + " sur " + fmt(tr * others.length) + " espérés." + (mercy ? " Ta clémence a été remarquée." : ""));
    if (mercy) { H.st(t, "repute", 3); others.forEach((s) => H.bond(s, t, { aff: 2 })); }
    H.pub("👑 " + tn + " " + (ev.pub || "a levé un tribut") + ", " + pay.length + " ont payé et " + (ref.length + reb.length) + " ont refusé.");
  },
};

// ---- 17. Enchères à scénarios ----
// (La mécanique d'enchères d'origine reste dans social.js, ces fiches s'y rattachent comme variantes.)

module.exports = { reg, regAll, LIST, byId, ARCH, helpers, gauss, fmt, T, nm };
