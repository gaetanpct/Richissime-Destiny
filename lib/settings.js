// ============================================================
// RICHISSIME DESTINY — Réglages de partie (source unique, envoyée au client)
// ============================================================
const SCHEMA = [
  {
    category: "⏳ Le déroulement",
    items: [
      { id: "ageCap", label: "Fin de partie anticipée", type: "choice", default: "none", info: "La partie se termine quand tous les joueurs sont morts. Tu peux aussi l'arrêter plus tôt, les survivants sont alors comptés avec leur fortune du moment.", options: [
        { value: "none", label: "À la mort de tous", icon: "🪦", desc: "La vraie vie, jusqu'au bout." },
        { value: "90", label: "À 90 ans", icon: "👴", desc: "On arrête les survivants à 90 ans." },
        { value: "70", label: "À 70 ans", icon: "🧓", desc: "Une partie plus courte." },
        { value: "45", label: "À 45 ans", icon: "🧑", desc: "Une partie express." },
      ] },
      { id: "ending", label: "Comment se termine la partie", type: "choice", default: "vote", info: "Quand tous les joueurs sont morts, on peut désigner le gagnant de deux façons.", options: [
        { value: "vote", label: "Par vote", icon: "🗳️", desc: "Chaque vie défile une par une, les joueurs la notent, la meilleure moyenne gagne." },
        { value: "fortune", label: "À la fortune", icon: "💰", desc: "Le plus riche à sa mort gagne, sans vote." },
      ] },
      { id: "reviewTime", label: "Temps pour noter chaque vie", type: "choice", default: "none", info: "Utilisé seulement pour la fin par vote. Dès que tout le monde a noté, on passe à la vie suivante.", options: [
        { value: "45", label: "45 secondes", icon: "⚡", desc: "Une lecture rapide." },
        { value: "90", label: "90 secondes", icon: "⏱️", desc: "Le temps de lire tranquillement." },
        { value: "180", label: "3 minutes", icon: "🐢", desc: "Pour tout commenter à l'oral." },
        { value: "none", label: "Sans limite", icon: "♾️", desc: "On attend tous les votes." },
      ] },
      { id: "selfRate", label: "Se noter soi-même", type: "bool", default: true, info: "Si désactivé, on ne peut pas voter pour sa propre vie (sauf si on joue seul)." },
      { id: "lifeChoices", label: "Choix de vie par année", type: "choice", default: "5", info: "Le nombre de propositions que chaque joueur reçoit pour son année. Elles changent chaque année et collent à sa vie (âge, travail, couple, argent, goûts). Moins il y en a, plus la partie est rapide.", options: [
        { value: "3", label: "3 choix", icon: "⚡", desc: "Partie express, ça va droit au but." },
        { value: "4", label: "4 choix", icon: "🏃", desc: "Court et varié." },
        { value: "5", label: "5 choix", icon: "⚖️", desc: "Le bon équilibre." },
        { value: "7", label: "7 choix", icon: "🧭", desc: "Davantage de liberté, parties plus longues." },
      ] },
      { id: "proChoices", label: "Choix professionnels par année", type: "choice", default: "5", info: "Le nombre d'options que chaque joueur reçoit dans l'onglet Professionnel. Elles dépendent de son activité du moment (métier sérieux, métier manuel, scène, sport, indépendant, milieu, mafia, études, chômage, retraite). On peut en choisir une par année, en plus de son choix de vie.", options: [
        { value: "3", label: "3 options", icon: "⚡", desc: "Un menu court, pour aller vite." },
        { value: "4", label: "4 options", icon: "🏃", desc: "Court et varié." },
        { value: "5", label: "5 options", icon: "⚖️", desc: "Le bon équilibre." },
        { value: "7", label: "7 options", icon: "🧭", desc: "Davantage de stratégie de carrière." },
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
        { value: "chaos", label: "Au hasard par joueur", icon: "🎲", desc: "Chaque joueur reçoit un niveau tiré au sort, pas forcément le même." },
      ] },
      { id: "danger", label: "Dangerosité de la vie", type: "choice", default: "normal", info: "Plus la vie est dangereuse, plus les risques de mort sont fréquents.", options: [
        { value: "douce", label: "Douce", icon: "🌸", desc: "Moins de risques de mort." },
        { value: "normal", label: "Normale", icon: "⚖️", desc: "Équilibré." },
        { value: "dure", label: "Impitoyable", icon: "☠️", desc: "La mort rôde souvent." },
        { value: "chaos", label: "Au hasard par joueur", icon: "🎲", desc: "Chaque joueur reçoit une dangerosité tirée au sort, même si ce n'est pas équitable." },
      ] },
      { id: "mature", label: "Thèmes adultes", type: "bool", default: true, info: "Autorise l'alcool, les crimes, la prison et les magouilles. Désactivé, la vie reste plus sage." },
      { id: "bande", label: "Prénoms de la bande", type: "choice", default: "souvent", info: "Les personnages secondaires (amis, collègues, voisins, rivaux...) peuvent porter les prénoms de ta liste de copains. Ils sont fictifs, ils tombent au hasard à n'importe quel moment de la vie.", options: [
        { value: "off", label: "Jamais", icon: "🚫", desc: "Seulement des prénoms inventés." },
        { value: "parfois", label: "Parfois", icon: "🎲", desc: "Deux personnages sur cinq." },
        { value: "souvent", label: "Souvent", icon: "🎉", desc: "Quatre personnages sur cinq." },
        { value: "partout", label: "Partout", icon: "👯", desc: "Presque toute la population." },
      ] },
      { id: "startClass", label: "Milieu de départ", type: "choice", default: "moyenne", info: "La famille de naissance. Elle influence l'argent de poche et les premiers événements.", options: [
        { value: "modeste", label: "Modeste", icon: "🏚️", desc: "On compte les sous." },
        { value: "moyenne", label: "Moyenne", icon: "🏠", desc: "Ni riche, ni pauvre." },
        { value: "aisee", label: "Aisée", icon: "🏰", desc: "Un confort de départ." },
        { value: "chaos", label: "Au hasard par joueur", icon: "🎲", desc: "Chaque joueur naît dans une famille tirée au sort, parfois la même, parfois très différente." },
      ] },
      { id: "giftMode", label: "Don de naissance", type: "choice", default: "choix", info: "Le don donne un petit avantage de départ. Chacun le choisit lui-même, ou le destin décide à sa place.", options: [
        { value: "choix", label: "Chacun choisit", icon: "🎁", desc: "Chaque joueur prend le don qu'il veut." },
        { value: "chaos", label: "Au hasard par joueur", icon: "🎲", desc: "Le don est tiré au sort pour chacun, sans appel." },
      ] },
    ],
  },
  {
    category: "🤝 Entre les joueurs",
    items: [
      { id: "social", label: "Scènes collectives", type: "choice", default: "normal", info: "Enchères, votes, dilemmes, braquages à plusieurs… Ces scènes obligent les joueurs à décider ensemble. C'est toujours aléatoire, avec parfois deux années de suite puis plusieurs années sans rien. Il n'y en a jamais plus de sept années de suite sans.", options: [
        { value: "frequent", label: "Fréquentes", icon: "🌈", desc: "Souvent, avec parfois deux ou trois années de suite. Rarement plus de trois années sans scène." },
        { value: "normal", label: "Normales", icon: "🌤️", desc: "En moyenne une année sur quatre. Cinq années sans scène arrivent rarement." },
        { value: "peu", label: "Peu fréquentes", icon: "🌥️", desc: "Plutôt calme, avec de longues pauses de quatre ou cinq ans." },
        { value: "rare", label: "Rares", icon: "🌙", desc: "Très espacées, avec des pauses qui peuvent monter jusqu'à sept ans." },
      ] },
      { id: "socialChoices", label: "Actions entre joueurs par année", type: "choice", default: "5", info: "Le nombre d'actions proposées chaque année contre ou pour un autre joueur (cadeau, rendez-vous, défi, vengeance, mariage, parrainage...). Elles changent chaque année et dépendent de l'âge, de la fortune et des liens entre vous.", options: [
        { value: "3", label: "3 actions", icon: "🤏", desc: "Peu de choix, plus de simplicité." },
        { value: "5", label: "5 actions", icon: "🤝", desc: "Un bon éventail à chaque tour." },
        { value: "8", label: "8 actions", icon: "🎪", desc: "Beaucoup d'idées, surtout pour les bandes d'amis chaotiques." },
      ] },
      { id: "hostile", label: "Coups bas autorisés", type: "bool", default: true, info: "Autorise le vol, les rumeurs et les dénonciations contre les autres joueurs." },
      { id: "inheritance", label: "Héritage entre joueurs", type: "bool", default: false, info: "À sa mort, un joueur peut léguer 30 % de sa fortune à un autre joueur encore en vie, ou à son conjoint." },
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
