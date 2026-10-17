// ============================================================
// RICHISSIME DESTINY — Scènes système (construites dynamiquement)
//  jobhunt     les offres d'emploi reçues, cohérentes avec le profil et la fortune
//  jobswitch   les offres reçues quand on a déjà un poste
//  startup     le choix du secteur pour créer une entreprise
// ============================================================
const R = require("./rules");
const C = require("./core");
const FX = require("./fx");
const jobs = require("./jobs");
const { pick, POOLS } = require("./pools");
const { O, C: Ch, D } = require("./kit");

const G = (p, a, b) => (p.gender === "f" ? b : a);

function jobhunt(g, p, vals) {
  vals = vals || {};
  const offs = jobs.offers(g, p, { n: 3, reseau: !!vals.reseau });
  const choices = [];
  offs.forEach((o) => {
    const T = R.TRACKS[o.track];
    const tail = o.why ? ", " + o.why : "";
    choices.push(Ch("Accepter le poste de " + o.title.toLowerCase() + " chez " + o.boss + " pour " + C.fmt(o.salary) + " par an" + tail, T.ic,
      [O(1, "Tu signes ton contrat. Te voilà " + o.title.toLowerCase() + " chez " + o.boss + ", " + (o.salary >= 60000 ? "avec un salaire dont tu te souviendras." : o.salary >= 25000 ? "avec un salaire correct et un badge." : "avec un petit salaire, mais un vrai début."), { job: { track: o.track, level: o.level, mul: o.mulReal }, bonheur: 3, flag: "nouveau_job", unflag: "piston", arcreset: ["emploi_essais"] })]));
  });
  choices.push(Ch("Refuser et continuer à chercher", "🙅", [O(1, "Tu gardes ta liberté pour l'instant. D'autres offres arriveront.", { bonheur: -1, arc: { emploi_essais: 1 } })]));
  let t;
  if (!offs.length) t = "Tu as envoyé des dizaines de candidatures, mais personne ne répond. Il faudrait peut-être te former.";
  else if (vals.reseau) t = "Ton réseau a parlé. Plusieurs anciens collègues et amis ont glissé ton nom au bon endroit, et les propositions sont à la hauteur.";
  else if (p.flags.piston) t = "Quelqu'un a mis une bonne parole pour toi. Les entretiens se passent à merveille, et on te propose plusieurs postes.";
  else t = "Tes candidatures ont fait leur effet. Plusieurs entreprises te proposent un poste qui colle à ton profil et à ta situation. Laquelle vas-tu choisir ?";
  return { id: "sys_jobhunt", ic: "🔎", tags: ["travail"], t, c: choices };
}

function jobswitch(g, p) {
  const rng = g.rng;
  const T = R.TRACKS[p.job.track];
  const choices = [];
  const boss1 = pick(rng, POOLS.boites), boss2 = pick(rng, POOLS.boites);
  const nl = p.job.level + 1;
  if (nl < T.levels.length && (!T.gate || T.gate[nl] <= p.school.edu)) {
    const sal = Math.round(Math.max(p.job.salary * 1.12, T.levels[nl][1] * (0.95 + rng() * 0.15)) / 100) * 100;
    choices.push(Ch("Devenir " + T.levels[nl][0].toLowerCase() + " chez " + boss1 + " pour " + C.fmt(sal) + " par an", T.ic,
      [O(1, "Tu quittes ton ancien patron avec un pot de départ plein de sourires crispés. Te voilà " + T.levels[nl][0].toLowerCase() + " chez " + boss1 + ".", { job: { track: p.job.track, level: nl, mul: sal / T.levels[nl][1] }, bonheur: 4, ambition: 2 })]));
  }
  const sal2 = Math.round(p.job.salary * (1.1 + rng() * 0.15) / 100) * 100;
  choices.push(Ch("Garder ton poste de " + p.job.title.toLowerCase() + " chez " + boss2 + " pour " + C.fmt(sal2) + " par an", T.ic,
    [O(1, "Même métier, autre entreprise, meilleure paye. Ton ancien patron te souhaite bonne chance avec un visage d'enterrement.", { job: { track: p.job.track, level: p.job.level, mul: sal2 / T.levels[p.job.level][1] }, bonheur: 3 })]));
  if (rng() < 0.6) {
    const alt = jobs.offers(g, p, { n: 1 })[0];
    if (alt) {
      const AT = R.TRACKS[alt.track];
      const altSal = Math.round(Math.max(alt.salary, p.job.salary * 0.9) / 100) * 100;
      choices.push(Ch("Changer de voie, " + alt.title.toLowerCase() + " chez " + alt.boss + " pour " + C.fmt(altSal) + " par an" + (alt.why ? ", " + alt.why : ""), AT.ic,
        [O(1, "Tu changes complètement de décor. C'est un peu fou, très excitant, et ta famille te regarde avec une inquiétude affectueuse.", { job: { track: alt.track, level: alt.level, mul: altSal / AT.levels[alt.level][1] }, bonheur: 4, courage: 2 })]));
    }
  }
  choices.push(Ch("Rester où tu es", "🙂", [O(1, "Tu déclines poliment. Ton patron l'apprend et te propose une petite augmentation pour la peine.", { raise: 0.04, perf: 4, bonheur: 1 })]));
  return { id: "sys_jobswitch", ic: "📞", tags: ["travail"], t: "Un chasseur de têtes t'appelle. Plusieurs entreprises rêvent de t'avoir dans leurs rangs. Quelle offre vas-tu écouter ?", c: choices };
}

const SECTORS = [
  { l: "un petit restaurant", ic: "🍽️", hi: 2.4, lo: 0.2, pw: 0.42, fit: (p) => (p.traits.creatif >= 50 ? 1.4 : 1) },
  { l: "une application mobile de rencontres entre moustaches", ic: "📱", hi: 6, lo: 0.05, pw: 0.22, fit: (p) => (p.stats.intel >= 55 ? 1.5 : 0.8) },
  { l: "une boutique de produits locaux", ic: "🧀", hi: 2, lo: 0.4, pw: 0.5, fit: () => 1 },
  { l: "une société de dressage de licornes à domicile", ic: "🦄", hi: 4, lo: 0.1, pw: 0.3, lunar: true, fit: () => 1 },
  { l: "un cabinet de conseil", ic: "📑", hi: 2.2, lo: 0.5, pw: 0.5, fit: (p) => (p.school.edu >= 4 ? 1.8 : 0.5) },
  { l: "une salle de sport", ic: "🏋️", hi: 2.3, lo: 0.3, pw: 0.45, fit: (p) => (p.stats.sport >= 58 ? 2 : 0.4) },
  { l: "une galerie d'art", ic: "🖼️", hi: 3, lo: 0.2, pw: 0.35, fit: (p) => (p.traits.creatif >= 55 ? 1.8 : 0.5) },
  { l: "un studio de jeux vidéo", ic: "🎮", hi: 7, lo: 0.05, pw: 0.2, fit: (p) => (p.stats.intel >= 55 && p.traits.creatif >= 45 ? 1.8 : 0.5) },
  { l: "une brasserie artisanale", ic: "🍺", hi: 2.6, lo: 0.3, pw: 0.42, fit: () => 1 },
  { l: "une agence de voyages sur mesure", ic: "🧳", hi: 2.2, lo: 0.4, pw: 0.5, fit: (p) => (p.stats.charme >= 52 ? 1.3 : 0.9) },
  { l: "une société de cascades pour le cinéma", ic: "🎬", hi: 3.2, lo: 0.2, pw: 0.3, fit: (p) => (p.traits.courage >= 58 ? 2 : 0.3) },
  { l: "une boulangerie qui ouvre à trois heures du matin", ic: "🥖", hi: 2, lo: 0.5, pw: 0.55, fit: () => 1 },
  { l: "un cabinet de détectives pour animaux perdus", ic: "🕵️", hi: 3.5, lo: 0.2, pw: 0.28, lunar: true, fit: () => 1 },
  { l: "une compagnie de transport de caviar par drone", ic: "🛸", hi: 5, lo: 0.1, pw: 0.25, fit: (p) => (C.netWorth(p) >= 300000 ? 1.8 : 0.3) },
  { l: "une chaîne de cliniques vétérinaires", ic: "🐾", hi: 2.4, lo: 0.5, pw: 0.5, fit: (p) => (C.netWorth(p) >= 150000 ? 1.5 : 0.3) },
];

function startup(g, p) {
  const budget = Math.floor(p.cash * 0.7);
  const tiers = [5000, 15000, 40000, 120000, 400000, 1500000].filter((v) => v <= budget);
  const rng = g.rng;
  const pool = SECTORS.filter((s) => !(s.lunar && p.cfg.loufoque === 0));
  const ws = pool.map((s) => s.fit(p) * (0.6 + rng() * 0.8));
  const secs = [];
  const arr = pool.slice(), w = ws.slice();
  while (secs.length < 3 && arr.length) {
    const total = w.reduce((a, b) => a + b, 0);
    let r = rng() * total, idx = w.length - 1;
    for (let i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) { idx = i; break; } }
    secs.push(arr.splice(idx, 1)[0]); w.splice(idx, 1);
  }
  const useTiers = tiers.length ? tiers.slice(-3) : [Math.max(1000, Math.floor(p.cash * 0.5))];
  const choices = [];
  secs.forEach((s, i) => {
    const inv = useTiers[Math.min(useTiers.length - 1, Math.max(0, useTiers.length - 1 - (i % useTiers.length)))];
    if (inv > p.cash) return;
    const name = pick(rng, POOLS.boites);
    const good = Math.round(inv * s.hi), mid = Math.round(inv * 1.1), bad = Math.round(inv * s.lo);
    const fxBase = { ambition: 3 };
    const jobFx = p.job ? {} : { job: { track: "libre", level: 0 } };
    const risk = s.hi >= 5 ? 3 : s.hi >= 3 ? 2 : 1;
    choices.push(Ch("Lancer " + s.l + " pour " + C.fmt(inv), s.ic, [
      O(s.pw * 0.55, "C'est un carton ! " + name + " décolle, les clients se bousculent.", Object.assign({ item: { kind: "entreprise", name: name, value: good }, bonheur: 8, pub: "🚀 $nom lance une entreprise qui marche, " + name + "." }, jobFx, fxBase)),
      O(1 - s.pw, "Ça roule doucement. L'entreprise " + name + " fait son petit bonhomme de chemin.", Object.assign({ item: { kind: "entreprise", name: name, value: mid }, bonheur: 2 }, jobFx, fxBase)),
      O(s.pw * 0.45 + 0.1, "Catastrophe. " + name + " ne décolle pas, tu perds presque tout.", Object.assign({ item: { kind: "entreprise", name: name, value: bad }, bonheur: -8, repute: -3 }, jobFx, fxBase)),
    ], { cost: inv, risk }));
  });
  choices.push(Ch("Finalement, je reste sage", "🧸", [O(1, "Tu ranges tes rêves de patron dans un tiroir. Pour l'instant.", { prudent: 2 })]));
  return { id: "sys_startup", ic: "🚀", tags: ["argent"], t: "Tu as une idée géniale. Ou en tout cas tu en es sûr" + G(p, "", "e") + ". Il est temps de monter ta propre entreprise. Dans quoi te lances-tu ?", c: choices };
}

module.exports = { jobHunt: jobhunt, jobhunt, jobswitch, startup };
