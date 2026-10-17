// ============================================================
// RICHISSIME DESTINY — Le registre des moments de vie
// À la fin de chaque année, on compare l'état du joueur à celui de l'année précédente. Tout ce qui compte vraiment
// (prison, mariage, enfant, ruine, fortune, métier, diplôme, grave blessure) est noté avec un poids d'importance.
// Le jury de la vie lit ce registre, pas seulement le journal. Les textes évitent les deux-points.
// ============================================================
const C = require("./core");
const R = require("./rules");

const fem = (p, a, b) => (p.gender === "f" ? b : a);
function mark(p, age, ic, text, w, kind) {
  p.ledger = p.ledger || [];
  p.ledger.push({ age, ic, text, w, kind: kind || "vie" });
}

const WEALTH = [[100000, "Premier cap de 100 000 € de patrimoine", 4], [1000000, "Premier million", 7], [10000000, "Dix millions", 8], [100000000, "Cent millions, un empire de plus", 9], [1000000000, "Le milliard, un autre monde", 10]];
const FLAGS = {
  empire_1: ["🏗️", "Ton entreprise décolle pour de bon", 6], empire_2: ["🏭", "Ton groupe passe à l'échelle nationale", 7], empire_3: ["🌍", "Ton groupe devient un géant", 8], empire_4: ["🌐", "Un empire international", 9], empire_5: ["👑", "Une multinationale à ton nom", 10],
  ex_detenu: null,
};

function snap(p) {
  return {
    prison: p.prison ? p.prison.total || p.prison.left : 0,
    hasPrison: !!p.prison,
    job: p.job ? p.job.track + ":" + p.job.level : null,
    jobTitle: p.job ? p.job.title : null,
    track: p.job ? p.job.track : null,
    level: p.job ? p.job.level : -1,
    partner: p.partner ? (p.partner.status || "couple") + ":" + (p.partner.npc != null ? p.partner.npc : "s" + p.partner.player) : null,
    kids: p.npcs.filter((n) => n.kind === "child" && n.alive).length,
    kidsDead: p.npcs.filter((n) => n.kind === "child" && !n.alive).length,
    spouseDead: p.npcs.filter((n) => (n.kind === "spouse" || n.kind === "partner") && !n.alive).length,
    dipl: (p.school.diplomas || []).length, edu: p.school.edu,
    net: C.netWorth(p), debt: p.debt, sante: p.stats.sante, flags: Object.keys(p.flags),
    exes: p.npcs.filter((n) => n.kind === "ex").length,
  };
}

function scan(g, p) {
  const m = p.mem;
  const now = snap(p), old = m.snap;
  m.snap = now;
  if (!old) return;
  const age = p.age;
  p.ledger = p.ledger || [];
  m.bhSum = (m.bhSum || 0) + p.stats.bonheur; m.bhN = (m.bhN || 0) + 1;
  if (p.partner) m.partnerYears = (m.partnerYears || 0) + 1;
  m.maxLevel = Math.max(m.maxLevel || 0, now.level);
  // prison
  if (now.hasPrison && !old.hasPrison) {
    const yrs = p.prison.total || p.prison.left;
    mark(p, age, "⛓️", "Condamné" + fem(p, "", "e") + " à " + yrs + " an" + (yrs > 1 ? "s" : "") + " de prison", Math.min(10, 5 + yrs / 2.2), "prison");
    m.sentences = (m.sentences || 0) + 1;
  } else if (!now.hasPrison && old.hasPrison) {
    const yrs = m.jailYears || 0;
    mark(p, age, "🔓", "Libéré" + fem(p, "", "e") + " de prison, après " + yrs + " an" + (yrs > 1 ? "s" : "") + " derrière les barreaux en tout", Math.min(10, 5 + yrs / 2.5), "prison");
  }
  // métier
  if (now.track && now.track !== old.track) {
    const T = R.TRACKS[now.track];
    const first = !m.everWorked;
    m.everWorked = true;
    mark(p, age, T ? T.ic : "💼", (first ? "Premier emploi comme " : "Nouveau métier comme ") + now.jobTitle.toLowerCase(), first ? 5 : 3.5, "metier");
  } else if (now.level > old.level && old.level >= 0 && now.track === old.track) {
    const top = R.TRACKS[now.track] ? R.TRACKS[now.track].levels.length - 1 : 4;
    mark(p, age, "📈", "Promotion, tu deviens " + now.jobTitle.toLowerCase(), now.level >= top ? 7 : now.level >= 3 ? 5 : 3, "metier");
  }
  if (old.job && !now.job) {
    const last = p.jobHistory[p.jobHistory.length - 1];
    if (last && last.why === "licencié") mark(p, age, "📦", "Licencié" + fem(p, "", "e") + " de ton poste de " + last.title.toLowerCase(), 4, "metier");
    else if (last && last.why === "démission") mark(p, age, "🚪", "Tu quittes ton poste de " + last.title.toLowerCase(), 3, "metier");
  }
  // couple, mariage, enfants
  if (now.partner && now.partner !== old.partner) {
    const wed = /^marie/.test(now.partner);
    mark(p, age, wed ? "💍" : "❤️", wed ? "Mariage" : "Une grande histoire d'amour commence", wed ? 7 : 5, "amour");
  } else if (!now.partner && old.partner) {
    const wasWed = /^marie/.test(old.partner);
    if (now.spouseDead > old.spouseDead) mark(p, age, "🕯️", "Tu perds la personne que tu aimais", 9, "deuil");
    else mark(p, age, "💔", wasWed ? "Divorce" : "Une rupture qui marque", wasWed ? 7 : 5, "amour");
  }
  if (now.kids > old.kids) mark(p, age, "👶", now.kids - old.kids > 1 ? "Naissance de jumeaux ou plus d'un enfant" : "Naissance d'un enfant", 7, "famille");
  if (now.kidsDead > old.kidsDead) mark(p, age, "🕯️", "Tu perds un enfant", 10, "deuil");
  // fortune
  WEALTH.forEach(([lvl, t, w]) => { if (now.net >= lvl && !(m.wealthMarks || {})[lvl]) { m.wealthMarks = m.wealthMarks || {}; m.wealthMarks[lvl] = age; mark(p, age, "💰", t, w, "argent"); } });
  if (now.net < -20000 && !m.markedRuin) { m.markedRuin = true; mark(p, age, "📉", "La ruine, tes dettes dépassent tout ce que tu possèdes", 7, "argent"); }
  if (now.net >= 0) m.markedRuin = false;
  if (old.net > 100000 && now.net < old.net * 0.45) mark(p, age, "💥", "Tu perds plus de la moitié de ta fortune en une année", 7, "argent");
  // études
  if (now.dipl > old.dipl) mark(p, age, "🎓", "Un diplôme de plus", now.edu >= 5 ? 5 : 3.5, "etudes");
  // santé
  if (old.sante - now.sante >= 28) mark(p, age, "🏥", "Un grave problème de santé change ta vie", 6, "sante");
  // drapeaux marquants
  now.flags.forEach((f) => { if (!old.flags.includes(f) && FLAGS[f]) mark(p, age, FLAGS[f][0], FLAGS[f][1], FLAGS[f][2], "carriere"); });
  // séparations d'une longue histoire
  if (now.exes > old.exes && !old.partner && now.partner === old.partner) { /* déjà traité */ }
}

// Poids de chaque rubrique pour choisir les moments clés d'une vie
function keyMoments(p, journal, max) {
  const JW = { mort: 10, naissance: 10, jalon: 6, saga: 6, justice: 6, amour: 5, famille: 4, argent: 4, sante: 4, travail: 3, social: 3, ecole: 2, projet: 5.5, deuil: 7, flash: 1 };
  const items = [];
  (journal || []).forEach((j, i) => items.push({ age: j.age, ic: j.ic || "•", text: j.text, w: (JW[j.tag] || 2) + ((i * 2654435761) >>> 0) % 1000 / 700, tag: j.tag }));
  (p.ledger || []).forEach((l) => items.push({ age: l.age, ic: l.ic, text: l.text, w: l.w + 2.5, tag: l.kind, ledger: true }));
  // doublons proches entre registre et journal
  const must = items.filter((x) => x.tag === "naissance" || x.tag === "mort");
  const rest = items.filter((x) => !must.includes(x)).sort((a, b) => b.w - a.w);
  const pick = must.slice();
  const seen = new Set();
  const norm = (t) => String(t).toLowerCase().replace(/[^a-zàâçéèêëîïôûùüÿœ ]/g, "").slice(0, 28);
  for (const x of rest) {
    if (pick.length >= max) break;
    const k = x.age + norm(x.text);
    if (seen.has(k)) continue;
    // pas plus de trois entrées de la même rubrique, sauf si le poids est très élevé
    const same = pick.filter((y) => y.tag === x.tag).length;
    if (same >= 3 && x.w < 11) continue;
    seen.add(k); pick.push(x);
  }
  return pick.sort((a, b) => a.age - b.age || b.w - a.w);
}

module.exports = { scan, mark, keyMoments, snap };
