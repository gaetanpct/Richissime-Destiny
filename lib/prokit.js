// ============================================================
// RICHISSIME DESTINY — Kit des options professionnelles
// P(id, contextes, icône, libellé, description, spec) déclare une option de l'onglet Professionnel.
// Chaque option a des issues tirées au sort. Les chances dépendent de la fiche de carrière (compétence, réseau,
// réputation, pression) et des qualités du joueur, et les issues modifient cette fiche. C'est ce qui rend les choix cohérents entre eux.
// ============================================================
const { reg, out, tier, net } = require("./lifekit");
const C = require("./core");
const PRO = require("./pro");

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const S = (p) => PRO.state(p);
const st = (p, k) => (k in p.stats ? p.stats[k] : p.traits[k]);

// salaire de référence pour dimensionner les gains
const salOf = (p) => (p.job ? p.job.salary : p.retired ? p.pension || 12000 : 15000);
const sal = (p, f) => Math.round(salOf(p) * f / 100) * 100;
// échelle de patrimoine pour les gains de patrons et de truands
const scale = (p, f, lo, hi) => Math.round(clamp(Math.max(0, net(p)) * f, lo, hi) / 100) * 100;

// chance de succès, qui monte avec une qualité, la compétence, le réseau et la réputation
// base  chance de départ, k  poids de la qualité, w  poids de la fiche
function chance(base, stat, w) {
  w = w || {};
  return (p) => {
    const pr = S(p);
    return clamp(base + (stat ? (st(p, stat) - 50) / 220 : 0) + pr.skill * (w.skill === undefined ? 0.002 : w.skill) + pr.net * (w.net || 0) + pr.rep * (w.rep || 0) - pr.heat * (w.heat || 0), 0.05, 0.93);
  };
}
const fail = (ch) => (p) => 1 - ch(p);

const DOM = { prison: ["prison"] };

// P déclare l'option
function P(id, ctx, ic, l, d, o) {
  o = o || {};
  const ctxs = Array.isArray(ctx) ? ctx : [ctx];
  const spec = Object.assign({ id, grp: "pro_" + ctxs[0], pro: true, ctx: ctxs, ic, l, d, cool: 3, w: 6 }, o);
  // résumé automatique de ce que l'option construit, pour l'écran
  const sums = {};
  (o.outs || []).forEach((x) => {
    const pr = x.fx && x.fx.pro;
    if (!pr || typeof pr !== "object") return;
    ["skill", "net", "rep", "heat"].forEach((k) => { if (pr[k] > 0) sums[k] = (sums[k] || 0) + pr[k]; });
  });
  if (o.fx && o.fx.pro) ["skill", "net", "rep", "heat"].forEach((k) => { if (o.fx.pro[k] > 0) sums[k] = (sums[k] || 0) + o.fx.pro[k]; });
  const NAMES = { skill: "Compétence", net: "Réseau", rep: "Réputation", heat: "Pression" };
  spec.build = o.build || Object.keys(sums).sort((a, b) => sums[b] - sums[a]).map((k) => NAMES[k]).join(", ");
  return reg(spec);
}

const adult = { nostudy: true, noprison: true };
const job = (extra) => Object.assign({ job: true }, adult, extra || {});

module.exports = { P, out, chance, fail, S, st, sal, salOf, scale, clamp, adult, job, tier, net, C, DOM };
