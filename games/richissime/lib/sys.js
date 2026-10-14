// ============================================================
// RICHISSIME DESTINY — Scènes système (construites dynamiquement)
// ============================================================
const R = require("./rules");
const C = require("./core");
const FX = require("./fx");
const { pick, POOLS } = require("./pools");
const { O, C: Ch, D } = require("./kit");

function jobHunt(g, p) {
  const rng = g.rng;
  const tracks = Object.keys(R.TRACKS).filter((k) => {
    const T = R.TRACKS[k];
    if (T.illicit && !(g.settings.mature && (p.record > 0 || p.traits.honnete < 40))) return false;
    if (T.mature && !g.settings.mature) return false;
    return FX.canWork(p, k) && !(p.job && p.job.track === k);
  });
  tracks.sort(() => rng() - 0.5);
  const choices = [];
  tracks.slice(0, 3).forEach((k) => {
    const T = R.TRACKS[k];
    const level = FX.trackLevelFor(p, k);
    const mul = 0.9 + rng() * 0.25 + (p.job ? 0.12 : 0);
    const sal = Math.round(T.levels[level][1] * mul / 100) * 100;
    const title = T.levels[level][0];
    const boss = pick(rng, POOLS.boites);
    choices.push(Ch("Accepter le poste de " + title.toLowerCase() + " chez " + boss + " pour " + C.fmt(sal) + " par an", T.ic,
      [O(1, "Tu signes ton contrat. Te voilà " + title.toLowerCase() + " chez " + boss + ".", { job: { track: k, level, mul: sal / T.levels[level][1] }, bonheur: 3, flag: "nouveau_job" })]));
  });
  choices.push(Ch("Refuser et continuer comme avant", "🙅", [O(1, "Tu gardes ta liberté pour l'instant. Aucun contrat ne te séduit.", { bonheur: -1 })]));
  const t = tracks.length
    ? "Tes CV ont fait leur effet. Plusieurs entreprises te proposent un entretien, et certaines sont même prêtes à t'engager sur-le-champ. Laquelle vas-tu choisir ?"
    : "Tu as envoyé des dizaines de CV, mais rien ne correspond à ton profil pour l'instant. Il faudrait peut-être continuer à te former.";
  return { id: "sys_jobhunt", ic: "🔎", tags: ["travail"], t, c: choices };
}

function startup(g, p) {
  const budget = Math.floor(p.cash * 0.7);
  const tiers = [5000, 15000, 40000, 120000].filter((v) => v <= budget);
  const sectors = [
    { l: "un petit restaurant", ic: "🍽️", hi: 2.4, lo: 0.2, pw: 0.42 },
    { l: "une application mobile de rencontres entre moustaches", ic: "📱", hi: 6, lo: 0.05, pw: 0.22 },
    { l: "une boutique de produits locaux", ic: "🧀", hi: 2, lo: 0.4, pw: 0.5 },
    { l: "une société de dressage de licornes à domicile", ic: "🦄", hi: 4, lo: 0.1, pw: 0.3 },
    { l: "un cabinet de conseil", ic: "📑", hi: 2.2, lo: 0.5, pw: 0.5 },
  ];
  const choices = [];
  const useTiers = tiers.length ? tiers.slice(-2) : [Math.max(1000, Math.floor(p.cash * 0.5))];
  const secs = sectors.sort(() => g.rng() - 0.5).slice(0, 3);
  secs.forEach((s) => {
    const inv = useTiers[useTiers.length - 1 - (secs.indexOf(s) % useTiers.length)];
    if (inv > p.cash) return;
    const name = pick(g.rng, POOLS.boites);
    const good = Math.round(inv * s.hi), mid = Math.round(inv * 1.1), bad = Math.round(inv * s.lo);
    const fxBase = { ambition: 3 };
    const jobFx = p.job ? {} : { job: { track: "libre", level: 0 } };
    choices.push(Ch("Lancer " + s.l + " pour " + C.fmt(inv), s.ic, [
      O(s.pw * 0.55, "C'est un carton ! " + name + " décolle, les clients se bousculent.", Object.assign({ item: { kind: "entreprise", name: name, value: good }, bonheur: 8, pub: "🚀 $nom lance une entreprise qui marche, " + name + "." }, jobFx, fxBase)),
      O(1 - s.pw, "Ça roule doucement. L'entreprise " + name + " fait son petit bonhomme de chemin.", Object.assign({ item: { kind: "entreprise", name: name, value: mid }, bonheur: 2 }, jobFx, fxBase)),
      O(s.pw * 0.45 + 0.1, "Catastrophe. " + name + " ne décolle pas, tu perds presque tout.", Object.assign({ item: { kind: "entreprise", name: name, value: bad }, bonheur: -8, repute: -3 }, jobFx, fxBase)),
    ], { cost: inv, risk: 2 }));
  });
  choices.push(Ch("Finalement, je reste sage", "🧸", [O(1, "Tu ranges tes rêves de patron dans un tiroir. Pour l'instant.", { prudent: 2 })]));
  return { id: "sys_startup", ic: "🚀", tags: ["argent"], t: "Tu as une idée géniale. Ou en tout cas tu en es sûr(e). Il est temps de monter ta propre entreprise. Dans quoi te lances-tu ?", c: choices };
}

module.exports = { jobHunt, startup };
