// ============================================================
// RICHISSIME DESTINY — L'expérience change l'issue des choix répétés
// Un même choix de vie ne tourne pas pareil deux fois. Les chances dépendent
// de ce que tu sais faire (intelligence, ambition, prudence), de ce que tu as déjà
// vécu avec ce choix (leçon retenue, excès de confiance, série noire) et de ta situation.
// ============================================================
const C = require("./core");

const num = (v) => { const n = Number(v); return isFinite(n) ? n : 0; };
function ev(v, p, x, g) { try { return typeof v === "function" ? v(p, x, g) : v; } catch (e) { return 0; } }

// ton d'une issue, 1 plutôt bon, -1 plutôt mauvais, 0 neutre
function tone(o, p, x, g) {
  const fx = o.fx || {};
  const money = num(ev(fx.argent, p, x, g)) - num(ev(fx.dette, p, x, g));
  const bon = num(ev(fx.bonheur, p, x, g));
  if (fx.empire) return 1;
  if (money > 300) return 1;
  if (money < -300) return -1;
  if (bon >= 4) return 0.5;
  if (bon <= -4) return -0.5;
  return 0;
}

function hist(p, id) {
  p.mem.lifeHist = p.mem.lifeHist || {};
  return p.mem.lifeHist[id] || null;
}

// retourne des poids ajustés, ou les mêmes si le choix n'a pas de vrai risque
function tilt(g, p, pr, outs, ws, x) {
  const tones = outs.map((o) => tone(o, p, x, g));
  if (!(tones.some((t) => t > 0) && tones.some((t) => t < 0))) return { ws, tones, risky: false };
  const h = hist(p, pr.id);
  const T = p.traits, S = p.stats;
  const skill = C.clamp(0.6 * (S.intel - 50) / 100 + 0.2 * (T.ambition - 50) / 100 + 0.2 * (T.prudent - 50) / 100, -0.3, 0.35);
  const n = h ? Math.min(3, h.n) : 0;
  const lastBad = h && h.last < 0 ? Math.min(2, h.badRun || 1) : 0;
  const lastGood = h && h.last > 0 ? Math.min(2, h.goodRun || 1) : 0;
  // leçon retenue après un échec, confiance après un succès, mais la chance finit toujours par tourner
  const good = C.clamp(1 + skill + 0.08 * n + 0.12 * lastBad + 0.05 * lastGood, 0.6, 1.9);
  const bad = C.clamp(1 - skill * 0.8 - 0.05 * n + 0.1 * lastGood - 0.05 * lastBad, 0.5, 1.5);
  const out = ws.map((w, i) => w * (tones[i] > 0 ? good : tones[i] < 0 ? bad : 1));
  return { ws: out, tones, risky: true, h };
}

const PRE = {
  badThenGood: ["Cette fois, tu as retenu la leçon. ", "Tu t'y prends autrement que la dernière fois. ", "L'expérience a fini par payer. "],
  goodThenGood: ["Le succès appelle le succès. ", "Tu sais maintenant comment faire. ", "Ta réputation te précède. "],
  goodThenBad: ["Un peu trop sûr de toi, tu as baissé la garde. ", "La chance a tourné. ", "Cette fois, ça ne s'est pas passé comme avant. "],
  badThenBad: ["L'histoire se répète. ", "Tu retombes dans les mêmes pièges. ", "Insister n'a rien arrangé. "],
};

// retient l'issue, retourne un début de phrase si la répétition est notable
function record(g, p, pr, tn, info) {
  if (!info || !info.risky || !tn) return "";
  p.mem.lifeHist = p.mem.lifeHist || {};
  const h = p.mem.lifeHist[pr.id] || (p.mem.lifeHist[pr.id] = { n: 0, last: 0, goodRun: 0, badRun: 0 });
  const prev = h.last;
  h.n++; h.last = tn;
  h.goodRun = tn > 0 ? h.goodRun + 1 : 0;
  h.badRun = tn < 0 ? h.badRun + 1 : 0;
  if (h.n < 2 || !prev || tn === 0) return "";
  const key = prev < 0 ? (tn > 0 ? "badThenGood" : "badThenBad") : (tn > 0 ? "goodThenGood" : "goodThenBad");
  const L = PRE[key];
  return L[Math.floor(g.rng() * L.length)];
}

// ---------- les choix sans hasard ne se passent pas toujours pareil ----------
const GOOD = {
  sport: ["Tu progresses plus vite que prévu.", "Les efforts se voient enfin."],
  etudes: ["Tout s'imbrique, tu comprends vite cette année.", "Un professeur te remarque et te pousse."],
  ecole: ["Tout s'imbrique, tu comprends vite cette année.", "Un professeur te remarque et te pousse."],
  arts: ["Une idée t'arrive d'un coup et tu tiens quelque chose.", "Quelqu'un adore ce que tu fais."],
  social: ["Une rencontre inattendue égaie l'année.", "Les liens se resserrent plus que prévu."],
  famille: ["L'ambiance à la maison est belle cette année.", "Un moment de tendresse que tu n'oublieras pas."],
  voyage: ["Le voyage dépasse tes attentes.", "Un hasard de route devient un souvenir fort."],
  loisir: ["Tu y prends un plaisir fou.", "Les fous rires s'enchaînent."],
  sante: ["Ton corps te remercie vite.", "Tu te sens plus léger qu'il y a des années."],
  travail: ["Ton investissement est remarqué.", "On te confie un dossier qui compte."],
  emploi: ["Un contact te rend un vrai service.", "Ça démarre mieux que prévu."],
  argent: ["Les chiffres sont plus gentils que prévu.", "Une bonne surprise tombe sur ton compte."],
};
const BAD = {
  sport: ["Une petite blessure te ralentit.", "Tu stagnes, le découragement guette."],
  etudes: ["Tu te perds dans les cours, il faut rattraper.", "La fatigue s'installe."],
  ecole: ["Tu te perds dans les cours, il faut rattraper.", "Un contrôle raté te vexe."],
  arts: ["L'inspiration ne vient pas, tu doutes.", "Une critique te touche plus que tu ne le dis."],
  social: ["Un malentendu refroidit l'ambiance.", "Tu te sens un peu à l'écart."],
  famille: ["Des tensions pèsent à la maison.", "Un souci d'organisation te fatigue."],
  voyage: ["Le voyage tourne court, tout est trop cher.", "Un imprévu gâche une partie du séjour."],
  loisir: ["Ça ne prend pas, tu t'ennuies.", "Tu y laisses plus d'argent que prévu."],
  sante: ["Le résultat se fait attendre, tu doutes.", "Tu récupères mal."],
  travail: ["Un collègue te met des bâtons dans les roues.", "Le dossier traîne et l'ambiance aussi."],
  emploi: ["Les réponses tardent, le moral flanche.", "Une occasion te file sous le nez."],
  argent: ["Une dépense imprévue grignote tes projets.", "Les chiffres sont moins bons que prévu."],
};

function variance(g, p, pr, rep) {
  if (pr.id === "routine" || pr.outs && pr.outs.length || pr.scene) return;
  if (!pr.fx || !Object.keys(pr.fx).length || p.dying) return;
  const grp = pr.grp;
  const G = GOOD[grp], B = BAD[grp];
  if (!G || !B) return;
  const key = pr.interest || null;
  const rng = g.rng;
  const stat = Math.max(S_(p, "intel"), S_(p, "sport"), S_(p, "charme"));
  const luck = (stat - 50) / 400;
  const r = rng();
  const h = hist(p, "var_" + pr.id);
  p.mem.lifeHist = p.mem.lifeHist || {};
  p.mem.lifeHist["var_" + pr.id] = { n: ((h && h.n) || 0) + 1, last: 0, goodRun: 0, badRun: 0 };
  if (r < 0.2 + luck) {
    p.stats.bonheur = C.clamp(p.stats.bonheur + 2, 0, 100);
    const k = Object.keys(pr.fx).find((f) => p.stats[f] !== undefined && f !== "bonheur" && num(pr.fx[f]) > 0);
    if (k) p.stats[k] = C.clamp(p.stats[k] + 1, 0, 100);
    rep.lines.push(pr.ic + " " + G[Math.floor(rng() * G.length)]);
  } else if (r > 0.82 - luck) {
    p.stats.bonheur = C.clamp(p.stats.bonheur - 2, 0, 100);
    if (grp === "loisir" || grp === "voyage" || grp === "argent") { const m = Math.min(Math.max(0, p.cash), 200 + Math.round(Math.max(0, C.netWorth(p)) * 0.002)); p.cash -= m; }
    rep.lines.push(pr.ic + " " + B[Math.floor(rng() * B.length)]);
  }
}
const S_ = (p, k) => p.stats[k] || 50;

module.exports = { tilt, record, tone, variance };
