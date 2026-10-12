// ============================================================
// RICHISSIME DESTINY — Réglages de partie (source unique, envoyée au client)
// ============================================================
const SCHEMA = [
  {
    category: "⏳ Le déroulement",
    items: [
      { id: "startAge", label: "Âge de départ", type: "choice", default: "random", info: "Tous les joueurs commencent le même âge, dans la même classe.", options: [
        { value: "6", label: "6 ans", icon: "🧒", desc: "Le CP, tout au début." },
        { value: "7", label: "7 ans", icon: "🧒", desc: "Une petite année de plus." },
        { value: "8", label: "8 ans", icon: "🧒", desc: "On sait déjà lire." },
        { value: "random", label: "Au hasard", icon: "🎲", desc: "6, 7 ou 8 ans." },
      ] },
      { id: "ageCap", label: "Fin de partie anticipée", type: "choice", default: "none", info: "La partie se termine quand tous les joueurs sont morts. Tu peux aussi l'arrêter plus tôt, les survivants sont alors comptés avec leur fortune du moment.", options: [
        { value: "none", label: "À la mort de tous", icon: "🪦", desc: "La vraie vie, jusqu'au bout." },
        { value: "90", label: "À 90 ans", icon: "👴", desc: "On arrête les survivants à 90 ans." },
        { value: "70", label: "À 70 ans", icon: "🧓", desc: "Une partie plus courte." },
        { value: "45", label: "À 45 ans", icon: "🧑", desc: "Une partie express." },
      ] },
      { id: "timer", label: "Chrono par choix", type: "choice", default: "normal", info: "Si un joueur dépasse le temps, un choix est fait automatiquement à sa place.", options: [
        { value: "none", label: "Sans chrono", icon: "♾️", desc: "On attend tout le monde." },
        { value: "fast", label: "Rapide", icon: "⚡", desc: "25 secondes." },
        { value: "normal", label: "Normal", icon: "⏱️", desc: "45 secondes." },
        { value: "slow", label: "Cool", icon: "🐢", desc: "90 secondes." },
      ] },
    ],
  },
  {
    category: "🎭 L'ambiance",
    items: [
      { id: "loufoque", label: "Niveau de loufoquerie", type: "choice", default: "2", info: "Règle la fréquence des événements délirants (fantômes, dragons, tartes parlantes…).", options: [
        { value: "0", label: "Réaliste", icon: "🧑‍💼", desc: "Presque aucune folie." },
        { value: "1", label: "Un peu fou", icon: "🙂", desc: "De temps en temps." },
        { value: "2", label: "Très fou", icon: "🤪", desc: "Souvent." },
        { value: "3", label: "Délire total", icon: "🦄", desc: "Quasi tout le temps." },
      ] },
      { id: "danger", label: "Dangerosité de la vie", type: "choice", default: "normal", info: "Plus la vie est dangereuse, plus les risques de mort sont fréquents.", options: [
        { value: "douce", label: "Douce", icon: "🌸", desc: "Moins de risques de mort." },
        { value: "normal", label: "Normale", icon: "⚖️", desc: "Équilibré." },
        { value: "dure", label: "Impitoyable", icon: "☠️", desc: "La mort rôde souvent." },
      ] },
      { id: "mature", label: "Thèmes adultes", type: "bool", default: true, info: "Autorise l'alcool, les crimes, la prison et les magouilles. Désactivé, la vie reste plus sage." },
      { id: "bande", label: "Prénoms de la bande", type: "choice", default: "souvent", info: "Les personnages secondaires (amis, collègues, voisins, rivaux...) peuvent porter les prénoms de ta liste de copains. Ils sont fictifs, ils tombent au hasard à n'importe quel moment de la vie.", options: [
        { value: "off", label: "Jamais", icon: "🚫", desc: "Seulement des prénoms inventés." },
        { value: "parfois", label: "Parfois", icon: "🎲", desc: "Un personnage sur quatre." },
        { value: "souvent", label: "Souvent", icon: "🎉", desc: "Un personnage sur deux." },
        { value: "partout", label: "Partout", icon: "👯", desc: "Presque toute la population." },
      ] },
      { id: "startClass", label: "Milieu de départ", type: "choice", default: "moyenne", info: "La famille de tous les joueurs. Elle influence l'argent de poche et les premiers événements.", options: [
        { value: "modeste", label: "Modeste", icon: "🏚️", desc: "On compte les sous." },
        { value: "moyenne", label: "Moyenne", icon: "🏠", desc: "Ni riche, ni pauvre." },
        { value: "aisee", label: "Aisée", icon: "🏰", desc: "Un confort de départ." },
      ] },
    ],
  },
  {
    category: "🤝 Entre les joueurs",
    items: [
      { id: "social", label: "Scènes collectives", type: "choice", default: "normal", info: "Enchères, votes, dilemmes, braquages à plusieurs… Ces scènes obligent les joueurs à décider ensemble.", options: [
        { value: "rare", label: "Rares", icon: "🌙", desc: "Environ une année sur huit." },
        { value: "normal", label: "Normales", icon: "🌤️", desc: "Environ une année sur quatre." },
        { value: "frequent", label: "Fréquentes", icon: "🌈", desc: "Environ une année sur trois." },
      ] },
      { id: "hostile", label: "Coups bas autorisés", type: "bool", default: true, info: "Autorise le vol, les rumeurs et les dénonciations contre les autres joueurs." },
      { id: "inheritance", label: "Héritage entre joueurs", type: "bool", default: true, info: "À sa mort, un joueur peut léguer 30 % de sa fortune à un autre joueur encore en vie, ou à son conjoint." },
      { id: "wealthView", label: "Fortunes visibles", type: "choice", default: "tiers", info: "Ce que les autres joueurs peuvent voir de ton argent.", options: [
        { value: "exact", label: "Exactes", icon: "🔢", desc: "Chacun voit le montant." },
        { value: "tiers", label: "Par niveau", icon: "🪙", desc: "Pauvre, aisé, riche… seulement." },
        { value: "hidden", label: "Cachées", icon: "🙈", desc: "Personne ne sait, jusqu'à la mort." },
      ] },
    ],
  },
  {
    category: "💡 Aides",
    items: [
      { id: "hints", label: "Indices de risque", type: "bool", default: true, info: "Affiche un petit symbole de danger sur les choix les plus risqués." },
    ],
  },
];

function defaults() {
  const out = {};
  SCHEMA.forEach((c) => c.items.forEach((i) => { out[i.id] = i.default; }));
  return out;
}

function normalize(input) {
  const base = defaults();
  const out = {};
  SCHEMA.forEach((c) => c.items.forEach((i) => {
    let v = input && input[i.id] !== undefined ? input[i.id] : base[i.id];
    if (i.type === "bool") v = !!v;
    else if (i.type === "choice") {
      v = String(v);
      if (!i.options.some((o) => o.value === v)) v = base[i.id];
    }
    out[i.id] = v;
  }));
  return out;
}

module.exports = { SCHEMA, defaults, normalize };
