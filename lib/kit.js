// ============================================================
// RICHISSIME DESTINY — Kit d'écriture des scènes
// Les fichiers du dossier content/ utilisent ces fonctions pour déclarer
// les événements, les flashs (petites nouvelles sans choix), etc.
// ============================================================
const EVENTS = [];
const FLASHES = [];
const SAGAS = [];
const byId = Object.create(null);

// ev(id, spec) enregistre une scène.
//  ages:[min,max]   tranche d'âge (incluse)
//  need:{...}       conditions (voir engine.check)
//  w                poids de tirage (défaut 5)
//  tags             le premier tag sert de catégorie (rythme)
//  who:{slot:kind}  personnages secondaires (créés si absents)
//  roll:{slot:...}  valeurs tirées (pool de textes ou [min,max,pas])
//  t                texte (avec $slot, {m|f})
//  c                choix (tableau ou fonction (p,x)=>[...])
//  must             scène obligatoire (jalon de vie)
//  once             false = peut revenir (avec cool années d'attente)
function ev(id, spec) {
  if (byId[id]) throw new Error("scène en double : " + id);
  spec.id = id;
  if (spec.once === undefined) spec.once = true;
  // rar : niveau de rareté. Fixe le poids de tirage si w n'est pas donné.
  if (spec.rar) { const RW = { commun: 6, peu: 3, rare: 1, mythique: 0.25 }; if (RW[spec.rar] === undefined) throw new Error("rareté inconnue " + spec.rar); if (spec.w === undefined) spec.w = RW[spec.rar]; }
  EVENTS.push(spec);
  byId[id] = spec;
  return spec;
}

// flash(texte, fx, opts) : petite nouvelle de l'année, sans choix.
function flash(t, fx, opts) {
  const f = Object.assign({ t, fx: fx || {} }, opts || {});
  f.id = "fl" + FLASHES.length;
  FLASHES.push(f);
  return f;
}

// O(poids, texte, effets) : une issue possible d'un choix.
const O = (w, t, fx) => ({ w, t, fx: fx || {} });
// C(libellé, icône, issues, options) : un choix proposé au joueur.
const C = (l, ic, o, opt) => Object.assign({ l, ic, o }, opt || {});
// D(libellé, icône, texte, effets, options) : choix à issue unique.
const D = (l, ic, t, fx, opt) => C(l, ic, [O(1, t, fx)], opt);

module.exports = { EVENTS, FLASHES, SAGAS, byId, ev, flash, O, C, D };
