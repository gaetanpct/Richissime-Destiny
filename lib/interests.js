// ============================================================
// RICHISSIME DESTINY — Centres d'intérêt
// Chaque année passée sur un domaine (sport, arts, musique, études...) renforce l'intérêt pour ce domaine.
// Les propositions de choix de vie et les offres d'emploi en tiennent compte, pour que la vie reste cohérente.
// ============================================================
const R = require("./rules");

// choix de vie -> domaines
const PROJECT_DOM = {
  club_sport: ["sport"], velo: ["sport"], sport: ["sport"], competition: ["sport"], marathon: ["sport"], sport_prison: ["sport"], trek: ["nature", "sport"],
  arts: ["arts"], magie: ["arts"], peindre: ["arts"], ecrire_livre: ["arts", "intel"], memoires: ["arts"], theatre: ["arts", "screen"],
  groupe_musique: ["music"], instrument: ["music"], chorale: ["music"],
  youtube: ["screen"], jeux_video: ["tech", "screen"],
  bosser: ["intel"], lecture: ["intel"], etudier: ["intel"], revise_exam: ["intel"], revise_diplome: ["intel"], soutien: ["intel"], formation: ["intel"], formation_metier: ["intel"], langue: ["intel"], echecs: ["intel"], reprise_etudes: ["intel"], etudes_prison: ["intel"], reprise_bac: ["intel"],
  bonbons: ["business"], petit_boulot: ["business"], side: ["business"], creer: ["business"], creer_autre: ["business"], opportunite: ["business"], projet_fou: ["business"], emploi_freelance: ["business"], creer_empire: ["business"], rachat_entreprise: ["business"], fonds_investissement: ["business"], epargne: ["business"],
  delegue: ["social"], copains: ["social"], colo: ["social"], asso_etudiante: ["social"], vie_etudiante: ["social"], benevolat: ["care", "social"], politique_locale: ["social"], syndicat: ["social"], gala: ["social"], soiree_mondaine: ["social"], election_nationale: ["social"],
  animal: ["care", "nature"], soigner: ["care"], asso_entraide: ["care", "social"], accompagnement_deuil: ["care"],
  magouille: ["crime"], fausses_montres: ["crime"], contrebande: ["crime"], pari_clandestin: ["crime"], faux_diplome: ["crime"], detournement: ["crime"], sabotage_collegue: ["crime"], casse_bande: ["crime"], incendie_assurance: ["crime"], fausse_maladie: ["crime"], entrer_mafia: ["crime"], monter_en_grade: ["crime"], reseau_clandestin: ["crime"],
  jardinage: ["nature"], jardin: ["nature"], cuisine: ["cuisine"], lego: ["tech", "hands"], cabane: ["hands"],
};
for (let i = 1; i <= 5; i++) PROJECT_DOM["empire_" + i] = ["business"];
for (let i = 1; i <= 3; i++) PROJECT_DOM["cartel_" + i] = ["crime"];

// métiers -> domaines
const TRACK_DOM = {
  resto: ["cuisine"], commerce: ["business"], btp: ["hands"], sante: ["care", "intel"], droit: ["intel", "social"], tech: ["tech"], finance: ["business", "intel"], enseignement: ["social", "intel"],
  arts: ["arts", "music", "screen"], sportpro: ["sport"], politique: ["social"], ordre: ["order"], science: ["intel"], libre: ["business"], media: ["screen", "social"], agri: ["nature"], cirque: ["arts"],
  hotel: ["social"], immo: ["business"], ingenierie: ["tech", "intel"], presse: ["intel", "arts"], crime: ["crime"],
  foot: ["sport"], tennis: ["sport"], rugby: ["sport"], cyclisme: ["sport"], boxe: ["sport"], f1: ["sport", "order"], ski: ["sport"], natation: ["sport"], esport: ["tech", "screen"], danse: ["sport", "arts"], coach: ["sport"],
  chanteur: ["music"], dj: ["music"], cinema: ["screen", "arts"], humour: ["screen", "arts"], mannequin: ["screen"], createur: ["screen"], photo: ["arts", "screen"], peintre: ["arts"], gamedev: ["tech", "arts"], mode: ["arts"], archi: ["arts", "tech"], tatoueur: ["arts"],
  coiffeur: ["social"], patisserie: ["cuisine"], cabaret: ["arts"], casino: ["business"], nuit: ["social"], hacker: ["tech"], pompier: ["order"], militaire: ["order"], astronaute: ["intel", "sport"], marin: ["nature", "sport"], artisan: ["hands"],
  veto: ["care", "nature"], psy: ["care"], pharmacien: ["care", "intel"], dentiste: ["care"], detective: ["order", "intel"], clerge: ["care"], explorateur: ["nature", "order"], paysagiste: ["nature"], biblio: ["intel"], consultant: ["business"], admin_ca: ["business"],
  mecene_pro: ["arts"], diplomate_honneur: ["social"], critique_gastro: ["cuisine"], sommelier: ["cuisine"], chocolatier: ["cuisine"], golf_pro: ["sport"], paparazzi: ["screen"], vendeur_douteux: ["crime", "business"], recouvrement: ["crime"], chasseur_primes: ["order", "crime"],
};
// métiers de passion, qu'on ne propose pas à quelqu'un qui ne s'y est jamais intéressé
const NICHE = new Set(["sportpro", "foot", "tennis", "rugby", "cyclisme", "boxe", "f1", "ski", "natation", "golf_pro", "danse", "chanteur", "dj", "cinema", "humour", "mannequin", "createur", "photo", "peintre", "gamedev", "esport", "cirque", "cabaret", "astronaute", "hacker", "explorateur", "marin", "mode", "tatoueur", "arts"]);

const domainsOfProject = (pr) => pr.dom || PROJECT_DOM[pr.id] || [];
const val = (p, d) => (p.interest && p.interest[d]) || 0;
function top(p) {
  let best = null;
  Object.keys(p.interest || {}).forEach((d) => { if (!best || p.interest[d] > best.v) best = { d, v: p.interest[d] }; });
  return best;
}
// à chaque fin d'année, l'intérêt pour les domaines pratiqués monte, les autres s'effacent doucement
function update(p, pr, second) {
  p.interest = p.interest || {};
  if (!second) Object.keys(p.interest).forEach((d) => { p.interest[d] *= 0.95; if (p.interest[d] < 0.05) delete p.interest[d]; });
  const doms = domainsOfProject(pr);
  doms.forEach((d) => { p.interest[d] = (p.interest[d] || 0) + (doms.length > 1 ? 0.75 : 1); });
  if (p.job && !second) (TRACK_DOM[p.job.track] || []).forEach((d) => { p.interest[d] = (p.interest[d] || 0) + 0.35; });
}
// coefficient d'un métier selon les centres d'intérêt
function trackFactor(p, k) {
  const D = TRACK_DOM[k];
  if (!D || !D.length) return 1;
  const iv = Math.max.apply(null, D.map((d) => val(p, d)));
  const known = (p.exp && p.exp[k]) || p.jobHistory.some((j) => j.track === k);
  let f = iv >= 8 ? 5 : iv >= 5 ? 3.2 : iv >= 3 ? 2 : iv >= 1.5 ? 1.15 : 0.55;
  const t = top(p);
  if (t && t.v >= 5 && iv < 1.5 && !known) f *= 0.5;
  if (NICHE.has(k) && iv < 2.5 && !known) f *= 0.1;
  return f;
}
module.exports = { PROJECT_DOM, TRACK_DOM, NICHE, domainsOfProject, val, top, update, trackFactor };
