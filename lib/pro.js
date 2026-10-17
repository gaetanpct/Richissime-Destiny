// ============================================================
// RICHISSIME DESTINY — La vie professionnelle
// Onglet Professionnel. Chaque joueur garde une fiche de carrière (p.pro) qui change vraiment son avenir.
//   skill   la compétence acquise dans son domaine, elle ouvre les promotions et les augmentations
//   net     le carnet d'adresses, il améliore les offres d'emploi et les bonnes occasions
//   rep     la réputation dans son milieu (respect dans la mafia, renom dans un métier sérieux)
//   heat    la pression de la police ou des concurrents, elle augmente les risques d'arrestation et de chute
// Les contextes décrivent l'activité du moment, chacun a ses propres options dans choices/95_pro_*.js
// ============================================================
const R = require("./rules");
const C = require("./core");

const FAM = {
  bureau: ["sante", "droit", "tech", "finance", "enseignement", "politique", "science", "public", "ingenierie", "presse", "immo", "consultant", "admin_ca", "psy", "pharmacien", "dentiste", "veto", "archi", "biblio", "diplomate_honneur", "mecene_pro", "clerge", "consultant_prince", "detective"],
  terrain: ["resto", "commerce", "btp", "transport", "agri", "hotel", "artisan", "coiffeur", "patisserie", "chocolatier", "paysagiste", "vtc", "marin", "pompier", "militaire", "ordre", "nuit", "sommelier", "tatoueur", "crieur_public", "testeur_matelas", "casino"],
  scene: ["arts", "cirque", "media", "chanteur", "dj", "cinema", "humour", "mannequin", "createur", "photo", "peintre", "gamedev", "mode", "cabaret", "danse", "critique_gastro", "medium_tele", "voyante", "adulte", "sculpteur_beurre", "traducteur_chats", "dresseur_licornes", "chasseur_fantomes", "paparazzi"],
  sport: ["sportpro", "foot", "tennis", "rugby", "cyclisme", "boxe", "f1", "ski", "natation", "esport", "coach", "golf_pro", "testeur_toboggans", "explorateur", "astronaute"],
  libre: ["libre"],
  ombre: ["crime", "hacker", "vendeur_douteux", "recouvrement", "chasseur_primes"],
};
const TRACK_FAM = {};
Object.keys(FAM).forEach((f) => FAM[f].forEach((t) => { TRACK_FAM[t] = f; }));

// les contextes valent pour les noms de choices/95_pro_*.js
const CONTEXTS = {
  bureau: { l: "Métier sérieux", ic: "🗂️" },
  terrain: { l: "Métier manuel et de service", ic: "🛠️" },
  scene: { l: "Métier de création et de scène", ic: "🎭" },
  sport: { l: "Métier du sport et de l'aventure", ic: "🏅" },
  libre: { l: "Travail en indépendant", ic: "🧰" },
  patron: { l: "Chef d'entreprise", ic: "🏭" },
  ombre: { l: "Activité dans l'ombre", ic: "🕶️" },
  mafia: { l: "Organisation criminelle", ic: "🕴️" },
  etudes: { l: "Études et débuts", ic: "🎓" },
  apprenti: { l: "Apprentissage", ic: "🧑‍🏭" },
  chomage: { l: "Recherche d'activité", ic: "🔎" },
  retraite: { l: "Retraite active", ic: "🏖️" },
  prison: { l: "Derrière les barreaux", ic: "🔒" },
  tous: { l: "Pour tout le monde", ic: "💼" },
};

function trackFamily(track) {
  if (!track) return null;
  const T = R.TRACKS[track];
  if (!T) return "terrain";
  if (T.illicit) return "ombre";
  if (TRACK_FAM[track]) return TRACK_FAM[track];
  if (T.stat === "creatif") return "scene";
  if (T.stat === "sport") return "sport";
  if (T.stat === "intel") return "bureau";
  return "terrain";
}

function state(p) {
  if (!p.pro) p.pro = { skill: 0, net: 0, rep: 0, heat: 0, done: 0 };
  return p.pro;
}

// Les contextes qui s'appliquent à ce joueur à ce moment
function contexts(p) {
  const out = [];
  if (p.prison) return ["prison"];
  const phase = p.school ? p.school.phase : "none";
  if (p.school && p.school.track === "apprenti" && p.age <= 20) out.push("apprenti");
  if (["lycee", "sup"].includes(phase) || (phase === "college" && p.age >= 15)) out.push("etudes");
  if (p.retired) out.push("retraite");
  if (p.job && !p.retired) {
    const f = trackFamily(p.job.track);
    if (f) out.push(f);
    if (R.TRACKS[p.job.track] && R.TRACKS[p.job.track].illicit && !out.includes("ombre")) out.push("ombre");
  } else if (!p.retired && !out.includes("etudes") && p.age >= 16) out.push("chomage");
  if (p.assets && p.assets.some((a) => a.kind === "entreprise" && !a.partnerCompany)) out.push("patron");
  if (C.hasFlag(p, "mafia") || C.hasFlag(p, "parrain")) out.push("mafia");
  out.push("tous");
  return out;
}

function mainContext(p) {
  const c = contexts(p).filter((x) => x !== "tous");
  return c[0] || "tous";
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Variation de la fiche de carrière
function bump(p, d) {
  const S = state(p);
  ["skill", "net", "rep", "heat"].forEach((k) => { if (d && d[k]) S[k] = clamp(S[k] + d[k], 0, 100); });
  if (d && (d.skill || d.net || d.rep)) S.done++;
}

// Chaque année la fiche évolue toute seule, puis elle pèse sur la promotion
function tick(g, p, rep) {
  const S = state(p);
  const rng = g.rng;
  S.heat = Math.max(0, S.heat - (p.prison ? 14 : 6));
  S.net = Math.max(0, S.net - 1.5);
  S.rep = Math.max(0, S.rep - 0.7);
  if (p.retired) S.skill = Math.max(0, S.skill - 1);
  if (!p.job || p.prison) return;
  const T = R.TRACKS[p.job.track];
  if (!T || T.illicit) return;
  // une vraie compétence fait progresser plus vite, même sans choix précis cette année
  p.job.perf = clamp(p.job.perf + S.skill / 45, 0, 100);
  const nl = p.job.level + 1;
  if (nl >= T.levels.length || (T.gate && T.gate[nl] > p.school.edu)) return;
  const yrs = p.age - p.job.since;
  let ch = (S.skill - 22) / 420 + (p.job.perf - 62) / 520 + S.rep / 800 + (S.net - 20) / 1400;
  if (yrs < 2) ch *= 0.25;
  ch = clamp(ch, 0, 0.2);
  if (rng() < ch) {
    const FX = require("./fx");
    const before = p.job.title;
    FX.applyFx(g, p, { promote: true, bonheur: 4, repute: 2 }, null);
    if (p.job.title !== before) {
      rep.lines.push("📈 Ton investissement professionnel paie. Tu passes de " + before.toLowerCase() + " à " + p.job.title.toLowerCase() + ".");
      p.journal.push({ age: p.age, text: "Promotion obtenue grâce à ton travail de fond. Tu deviens " + p.job.title.toLowerCase() + ".", ic: "📈", tag: "travail" });
    }
  }
}

module.exports = { CONTEXTS, FAM, trackFamily, state, contexts, mainContext, bump, tick };
