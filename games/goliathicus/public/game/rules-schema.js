// ============================================================
// GOLIATHICUS — Réglages de partie (source unique)
// Sert à générer le salon, valider les valeurs et fournir les défauts.
// ============================================================
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory();
  else root.GoliathRules = factory();
})(typeof window !== "undefined" ? window : globalThis, function () {
  // type : "cards" (grandes cartes), "chips" (boutons), "bool" (interrupteur)
  const SCHEMA = [
    {
      category: "⚔️ Façon de gagner",
      rules: [
        {
          id: "mode", label: "Mode de jeu", type: "cards", default: "classic",
          options: [
            { value: "classic", label: "Classique", icon: "🥚", desc: "Croque l'Œuf de Dragon d'un adversaire pour l'éliminer. Le dernier en lice gagne." },
            { value: "conquest", label: "Conquête", icon: "🏆", desc: "Tiens les reliques du centre pour marquer des points. Le premier à atteindre l'objectif gagne, ou le dernier en lice." },
            { value: "kinghunt", label: "Chasse au roi", icon: "👑", desc: "Pas d'œuf ! Un camp est éliminé quand son Roi tombe. Protège ton roi, planque-le bien." },
          ],
          info: "Le mode de victoire de la partie.",
        },
        { id: "relicTarget", label: "Points de reliques pour gagner", type: "chips", default: 12, options: [8, 12, 16, 24], showIf: { mode: "conquest" }, info: "Chaque relique tenue au début de ton tour rapporte 1 point." },
        { id: "relicOrbits", label: "Nombre de reliques", type: "chips", default: 1, options: [{ value: 1, label: "Peu" }, { value: 2, label: "Beaucoup" }], showIf: { mode: "conquest" }, info: "Peu = 4 reliques (2 en duel), beaucoup = le double." },
      ],
    },
    {
      category: "🌶️ Pimente la partie",
      rules: [
        { id: "teams", label: "👯 Équipes 2 contre 2", type: "bool", default: false, needs: { players: 4 }, info: "Uniquement à 4. Tu joues avec le joueur en face de toi, vous partagez ce que vous savez, vous ne pouvez pas vous attaquer. L'équipe gagne quand les deux adversaires sont éliminés." },
        { id: "fog", label: "🌫️ Brouillard", type: "bool", default: false, info: "Tu ne vois que les pièces proches des tiennes. Le reste du plateau est dans la brume." },
        { id: "fogRadius", label: "Portée de vue", type: "chips", default: 2, options: [1, 2, 3], showIf: { fog: true }, info: "Distance maximale (en cases) à laquelle tu vois les pièces ennemies." },
        { id: "chaos", label: "🎲 Chaos", type: "bool", default: false, info: "Un événement surprise secoue le royaume à intervalles réguliers, avec de la boue, des tourbillons, des tartes qui tombent du ciel..." },
        { id: "chaosEvery", label: "Un événement tous les", type: "chips", default: 5, options: [{ value: 3, label: "3 tours" }, { value: 5, label: "5 tours" }, { value: 8, label: "8 tours" }], showIf: { chaos: true }, info: "Un « tour » = tout le monde a joué une fois." },
        { id: "boardSize", label: "⚡ Taille du plateau", type: "chips", default: "normal", options: [{ value: "normal", label: "Normale (~35 min)" }, { value: "express", label: "Express (~10 min)" }], info: "Express = petit plateau et armées de 12 pièces, pour une partie éclair." },
      ],
    },
    {
      category: "🗺️ Le royaume",
      rules: [
        {
          id: "terrain", label: "Relief", type: "chips", default: "classic",
          options: [
            { value: "classic", label: "Classique" }, { value: "random", label: "Aléatoire" }, { value: "wild", label: "Sauvage" }, { value: "none", label: "Plaine" },
          ],
          info: "Classique = un grand lac central. Aléatoire = lacs, forêts et marais tirés au sort (toujours équitable). Sauvage = beaucoup de relief. Plaine = aucun obstacle.",
        },
        { id: "terrainInfo", type: "legend", info: "🌲 Forêt, le défenseur qui gagne un combat ici reste caché.   🟤 Marais, une pièce qui s'y arrête dort un tour.   💧 Lac, infranchissable." },
      ],
    },
    {
      category: "🛡️ Les armées",
      rules: [
        {
          id: "armyPreset", label: "Composition", type: "cards", default: "standard",
          options: [
            { value: "standard", label: "Équilibrée", icon: "⚖️", desc: "La recette classique." },
            { value: "offensive", label: "Offensive", icon: "⚔️", desc: "Peu de pièges, beaucoup de gros bras." },
            { value: "trap", label: "Piégeuse", icon: "🥧", desc: "Des tartes et des nains." },
            { value: "fast", label: "Rapide", icon: "🧚", desc: "Des lutins à gogo." },
            { value: "loufoque", label: "Fantômes", icon: "👻", desc: "Avec des fantômes.", needs: { specialPieces: true } },
            { value: "custom", label: "Sur mesure", icon: "🛠️", desc: "Chaque joueur compose sa propre armée avec le même budget, sans limite de temps." },
          ],
          info: "Tout le monde joue avec la même composition (équitable).",
        },
        { id: "armyBudget", label: "Budget de l'armée sur mesure", type: "chips", default: 150, options: [110, 130, 150, 180], showIf: { armyPreset: "custom" }, info: "Chaque pièce coûte des points. Chaque joueur dépense le même budget pour composer sa propre armée avant le placement, sans limite de temps." },
        { id: "compReveal", label: "👀 Dévoiler les compositions à tous", type: "bool", default: false, showIf: { armyPreset: "custom" }, info: "Activé = chacun voit l'armée de ses adversaires une fois les compositions validées. Désactivé = la composition adverse reste secrète, il faut deviner." },
        { id: "specialPieces", label: "👻 Pièces spéciales", type: "bool", default: true, info: "Autorise le Fantôme (saute par-dessus un obstacle) dans les compositions." },
        { id: "bombsHidden", label: "🥧 Les tartes restent cachées", type: "bool", default: true, info: "Activé = une tarte qui fait exploser un attaquant (ou qui est désamorcée) n'est jamais dévoilée aux joueurs qui n'étaient pas dans le combat. Désactivé = tout le monde voit ce que c'était." },
        { id: "survivorsRevealed", label: "👁️ Les survivants restent dévoilés", type: "bool", default: true, info: "Activé = après un combat, la pièce gagnante reste visible de tous. Désactivé = mode mémoire, tu dois te souvenir de ce que tu as vu." },
      ],
    },
    {
      category: "🏰 Les maisons",
      rules: [
        { id: "powers", label: "✨ Pouvoirs de maison", type: "bool", default: true, info: "Chaque maison a un pouvoir à usage limité, comme l'Échange, l'Œil d'aigle, le Sommeil ou la Ruée." },
        { id: "powerCharges", label: "Utilisations par partie", type: "chips", default: 1, options: [1, 2, 3], showIf: { powers: true }, info: "Combien de fois chaque joueur peut utiliser son pouvoir." },
      ],
    },
    {
      category: "⏱️ Rythme et fin de partie",
      rules: [
        { id: "setupTimer", label: "Temps pour placer l'armée", type: "chips", default: 0, options: [{ value: 0, label: "Illimité" }, { value: 60, label: "1 min" }, { value: 120, label: "2 min" }, { value: 180, label: "3 min" }, { value: 300, label: "5 min" }], info: "Illimité = personne n'est pressé. Sinon, les joueurs qui ne sont pas prêts sont placés automatiquement à la fin du temps." },
        { id: "turnTimer", label: "Temps par tour", type: "chips", default: 90, options: [{ value: 0, label: "Illimité" }, { value: 30, label: "30 s" }, { value: 60, label: "60 s" }, { value: 90, label: "90 s" }, { value: 180, label: "3 min" }], info: "Si le temps est écoulé, un coup raisonnable est joué à ta place." },
        { id: "eliminated", label: "Camp éliminé", type: "chips", default: "ruins", options: [{ value: "ruins", label: "Devient ruines" }, { value: "vanish", label: "Disparaît" }], info: "Ruines = les pièces restantes se changent en obstacles infranchissables. Disparaît = elles s'évaporent." },
        { id: "duelTime", label: "⚔️ Durée d'affichage du dernier combat", type: "chips", default: 8, options: [{ value: 4, label: "4 s" }, { value: 8, label: "8 s" }, { value: 15, label: "15 s" }, { value: 0, label: "Jusqu'au prochain combat" }], info: "Combien de temps le cadre qui montre qui a attaqué qui reste à l'écran." },
        { id: "showLog", label: "📜 Afficher la chronique", type: "bool", default: false, info: "Affiche la liste des derniers événements sur le côté. Désactivé = écran plus clair, il faut suivre le plateau." },
        { id: "slowMode", label: "🐢 Mode lent", type: "bool", default: false, info: "Les pions glissent plus doucement et l'IA prend son temps, pratique pour suivre ce qu'il se passe." },
      ],
    },
  ];

  function allRules() {
    const out = [];
    SCHEMA.forEach((c) => c.rules.forEach((r) => out.push(r)));
    return out;
  }

  function defaults() {
    const d = {};
    allRules().forEach((r) => { if (r.type !== "legend") d[r.id] = r.default; });
    return d;
  }

  // Les valeurs valides d'un réglage.
  function allowedValues(rule) {
    if (!rule.options) return null;
    return rule.options.map((o) => (typeof o === "object" ? o.value : o));
  }

  // Valide et complète des réglages reçus (jamais d'exception).
  function normalize(input, playerCount) {
    const base = defaults();
    const src = input && typeof input === "object" ? input : {};
    allRules().forEach((r) => {
      if (r.type === "legend") return;
      let v = src[r.id];
      if (v === undefined) return;
      if (r.type === "bool") base[r.id] = !!v;
      else {
        const ok = allowedValues(r);
        if (ok && ok.includes(v)) base[r.id] = v;
        else if (ok) {
          const num = Number(v);
          if (ok.includes(num)) base[r.id] = num;
        }
      }
    });
    if (typeof playerCount === "number") {
      if (playerCount !== 4) base.teams = false;
    }
    if (!base.specialPieces && base.armyPreset === "loufoque") base.armyPreset = "standard";
    return base;
  }

  return { SCHEMA, allRules, defaults, normalize, allowedValues };
});
