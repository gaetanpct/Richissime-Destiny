// ============================================================
// GOLIATHICUS — Contenu : pièces, maisons, pouvoirs, armées
// Module UMD partagé client / serveur / IA.
// ============================================================
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory();
  else root.GoliathPieces = factory();
})(typeof window !== "undefined" ? window : globalThis, function () {
  // rank 0 = Œuf (cible), "bomb" = Tarte piégée. mobile=false → ne bouge jamais.
  const PIECES = {
    oeuf: { id: "oeuf", name: "Œuf de Dragon", short: "Œuf", icon: "🥚", rank: 0, cost: 0, mobile: false, max: 1, desc: "Ta cible à protéger. Si un ennemi le croque, tu es éliminé." },
    tarte: { id: "tarte", name: "Tarte Piégée", short: "Tarte", icon: "🥧", rank: 99, cost: 3, mobile: false, bomb: true, max: 6, desc: "Immobile. Fait exploser tout ce qui l'attaque, sauf le Nain Démineur." },
    rat: { id: "rat", name: "Rat Espion", short: "Rat", icon: "🐀", rank: 1, cost: 4, mobile: true, max: 2, desc: "Le plus faible. Mais il terrasse le Roi, qu'il l'attaque ou qu'il se fasse attaquer par lui." },
    lutin: { id: "lutin", name: "Lutin Éclaireur", short: "Lutin", icon: "🧚", rank: 2, cost: 3, mobile: true, long: true, max: 8, desc: "Se déplace d'autant de cases libres qu'il veut en ligne droite, et peut attaquer au bout." },
    nain: { id: "nain", name: "Nain Démineur", short: "Nain", icon: "⛏️", rank: 3, cost: 4, mobile: true, miner: true, max: 6, desc: "Désamorce les tartes piégées sans dégâts." },
    garde: { id: "garde", name: "Garde Royal", short: "Garde", icon: "💂", rank: 4, cost: 4, mobile: true, max: 6, desc: "Le soldat de base, solide et fiable." },
    archere: { id: "archere", name: "Archère", short: "Archère", icon: "🏹", rank: 5, cost: 5, mobile: true, max: 5, desc: "Précise et rapide à frapper." },
    chevalier: { id: "chevalier", name: "Chevalier", short: "Chevalier", icon: "🛡️", rank: 6, cost: 6, mobile: true, max: 5, desc: "Armure lourde et lance au poing." },
    troll: { id: "troll", name: "Troll", short: "Troll", icon: "👹", rank: 7, cost: 8, mobile: true, max: 4, desc: "Énorme, brutal, difficile à arrêter." },
    sorcier: { id: "sorcier", name: "Sorcier", short: "Sorcier", icon: "🧙", rank: 8, cost: 10, mobile: true, max: 3, desc: "Ses sorts écrasent presque tout le monde." },
    dragon: { id: "dragon", name: "Dragon", short: "Dragon", icon: "🐲", rank: 9, cost: 14, mobile: true, max: 2, desc: "Seul le Roi le dépasse." },
    roi: { id: "roi", name: "Roi", short: "Roi", icon: "👑", rank: 10, cost: 18, mobile: true, max: 1, desc: "Le plus fort de tous. Seul le Rat Espion peut le terrasser, même quand c'est le Roi qui attaque." },
    fantome: { id: "fantome", name: "Fantôme", short: "Fantôme", icon: "👻", rank: 5, cost: 6, mobile: true, ghost: true, special: true, max: 3, desc: "Peut sauter par-dessus un obstacle (lac, ruine) juste devant lui." },
  };

  const ORDER = ["oeuf", "tarte", "rat", "lutin", "nain", "garde", "archere", "chevalier", "troll", "sorcier", "dragon", "roi", "fantome"];

  // Les quatre maisons. Chacune a un pouvoir à usage limité.
  const HOUSES = [
    {
      id: 0, name: "Maison du Lion", short: "Lion", icon: "🦁", color: "#d6453d", dark: "#8f2623", light: "#ffd9d4",
      power: { id: "theatre", name: "Échange", icon: "🔄", targets: "ownPair", desc: "Échange la place de deux de tes pièces, sans que personne sache lesquelles sont importantes." },
    },
    {
      id: 1, name: "Maison de l'Aigle", short: "Aigle", icon: "🦅", color: "#2f78d1", dark: "#17467f", light: "#d6e8ff",
      power: { id: "longuevue", name: "Œil d'aigle", icon: "🔭", targets: "enemy", desc: "Découvre en secret le rang d'une pièce ennemie. Toi seul le sais." },
    },
    {
      id: 2, name: "Maison du Serpent", short: "Serpent", icon: "🐍", color: "#3a9d53", dark: "#1d6330", light: "#d8f5de",
      power: { id: "sieste", name: "Sommeil", icon: "😴", targets: "enemy", desc: "Endort une pièce ennemie, qui ne peut plus bouger pendant 2 de ses tours." },
    },
    {
      id: 3, name: "Maison du Soleil", short: "Soleil", icon: "☀️", color: "#e0a417", dark: "#946a05", light: "#fff0bd",
      power: { id: "ruee", name: "Ruée", icon: "⚡", targets: "none", desc: "Tu joues deux déplacements d'affilée ce tour-ci." },
    },
  ];

  // Compositions d'armées. size = nombre de cases du camp (24 normal, 12 express).
  const ARMIES = {
    24: {
      standard: { name: "Équilibrée", icon: "⚖️", desc: "La recette classique, pour bien démarrer.", counts: { oeuf: 1, tarte: 3, roi: 1, dragon: 1, sorcier: 1, troll: 2, chevalier: 3, archere: 2, garde: 2, nain: 3, lutin: 4, rat: 1 } },
      offensive: { name: "Offensive", icon: "⚔️", desc: "Peu de pièges, beaucoup de gros bras.", counts: { oeuf: 1, tarte: 1, roi: 1, dragon: 1, sorcier: 2, troll: 3, chevalier: 3, archere: 3, garde: 2, nain: 2, lutin: 4, rat: 1 } },
      trap: { name: "Piégeuse", icon: "🥧", desc: "Des tartes partout et des nains pour les désamorcer.", counts: { oeuf: 1, tarte: 5, roi: 1, dragon: 1, sorcier: 1, troll: 2, chevalier: 2, archere: 2, garde: 2, nain: 4, lutin: 2, rat: 1 } },
      fast: { name: "Rapide", icon: "🧚", desc: "Beaucoup de lutins pour explorer vite.", counts: { oeuf: 1, tarte: 2, roi: 1, dragon: 1, sorcier: 1, troll: 2, chevalier: 2, archere: 2, garde: 2, nain: 2, lutin: 7, rat: 1 } },
      loufoque: { name: "Fantômes", icon: "👻", desc: "Avec trois fantômes (pièces spéciales).", special: true, counts: { oeuf: 1, tarte: 2, roi: 1, dragon: 1, sorcier: 1, troll: 2, chevalier: 2, archere: 2, garde: 2, nain: 3, lutin: 3, rat: 1, fantome: 3 } },
    },
    12: {
      standard: { name: "Équilibrée", icon: "⚖️", desc: "Une petite armée complète.", counts: { oeuf: 1, tarte: 1, roi: 1, dragon: 1, troll: 1, chevalier: 1, archere: 1, garde: 1, nain: 1, lutin: 2, rat: 1 } },
      offensive: { name: "Offensive", icon: "⚔️", desc: "Pas de piège, que de la bagarre.", counts: { oeuf: 1, roi: 1, dragon: 1, sorcier: 1, troll: 1, chevalier: 2, archere: 1, garde: 1, nain: 1, lutin: 2 } },
      trap: { name: "Piégeuse", icon: "🥧", desc: "Deux tartes et des nains.", counts: { oeuf: 1, tarte: 2, roi: 1, dragon: 1, troll: 1, chevalier: 1, garde: 1, nain: 2, lutin: 1, rat: 1 } },
      fast: { name: "Rapide", icon: "🧚", desc: "Quatre lutins, ça va vite.", counts: { oeuf: 1, tarte: 1, roi: 1, dragon: 1, troll: 1, chevalier: 1, garde: 1, nain: 1, lutin: 4 } },
      loufoque: { name: "Fantômes", icon: "👻", desc: "Avec deux fantômes (pièces spéciales).", special: true, counts: { oeuf: 1, tarte: 1, roi: 1, dragon: 1, troll: 1, chevalier: 1, garde: 1, nain: 1, lutin: 2, rat: 1, fantome: 1 } },
    },
  };

  const CHAOS_EVENTS = {
    boue: { name: "Marée de boue", icon: "🟤", text: "Une marée de boue envahit le centre du royaume. Trois cases deviennent des marais." },
    melange: { name: "Mélange royal", icon: "🌀", text: "Un tourbillon échange la place de deux pièces mobiles !" },
    tarte: { name: "Pluie de tartes", icon: "🥧", text: "Une tarte géante s'écrase au centre et bloque définitivement la case." },
    fete: { name: "Fête au village", icon: "🎉", text: "Tout le monde a bien mangé, chaque maison regagne une charge de pouvoir." },
    pont: { name: "Pont miraculeux", icon: "🌉", text: "Un lac s'assèche, une nouvelle case est praticable." },
    brouillard: { name: "Brouillard soudain", icon: "🌫️", text: "Un brouillard épais tombe pendant un tour de table complet. Visibilité réduite à 1 case." },
  };

  function armySizeFor(boardSize) { return boardSize === "express" ? 12 : 24; }

  function cloneCounts(c) { return Object.assign({}, c); }

  function countsCost(counts) {
    let t = 0;
    Object.keys(counts).forEach((k) => { if (PIECES[k]) t += (PIECES[k].cost || 0) * counts[k]; });
    return t;
  }
  function countsTotal(counts) {
    return Object.keys(counts).reduce((s, k) => s + (PIECES[k] ? counts[k] : 0), 0);
  }

  // Retourne la composition finale d'une armée (objet type → quantité).
  function resolveArmy(settings) {
    const size = armySizeFor(settings.boardSize);
    let counts;
    const presets = ARMIES[size];
    {
      let p = presets[settings.armyPreset] || presets.standard;
      if (p.special && !settings.specialPieces) p = presets.standard;
      counts = cloneCounts(p.counts);
    }
    return finalizeCounts(counts, settings);
  }

  // Adapte une composition au mode de jeu (pas d'œuf en chasse au roi).
  function finalizeCounts(counts, settings) {
    counts = cloneCounts(counts);
    if (settings.mode === "kinghunt") {
      // Pas d'œuf : le roi est la cible. On le remplace par un garde.
      if (counts.oeuf) { counts.garde = (counts.garde || 0) + counts.oeuf; delete counts.oeuf; }
      if (!counts.roi) counts.roi = 1;
    } else if (!counts.oeuf) {
      counts.oeuf = 1;
    }
    Object.keys(counts).forEach((k) => { if (!counts[k]) delete counts[k]; });
    return counts;
  }

  // Nettoie une armée personnalisée (valide en toute circonstance).
  function sanitizeCustom(input, settings, size) {
    const out = {};
    let total = 0;
    ORDER.forEach((id) => {
      const p = PIECES[id];
      if (id === "oeuf") return;
      if (p.special && !settings.specialPieces) return;
      let n = Math.max(0, Math.floor(Number(input && input[id]) || 0));
      n = Math.min(n, p.max);
      if (id === "roi") n = 1;
      out[id] = n;
    });
    // l'œuf prend une place (sauf chasse au roi, géré après)
    const room = size - 1;
    // réduit les surplus en partant des moins chers
    const budget = Number(settings.armyBudget) || 150;
    const trim = ORDER.slice().reverse();
    const over = () => countsTotal(out) > room || countsCost(out) > budget;
    let guard = 0;
    while (over() && guard++ < 500) {
      const id = trim.find((t) => t !== "roi" && t !== "oeuf" && out[t] > 0 && (PIECES[t].cost === 0 ? false : true));
      // enlève d'abord ce qui coûte le moins quand c'est le nombre qui pèche, sinon le plus cher
      let pick = null;
      if (countsTotal(out) > room) {
        pick = ORDER.filter((t) => out[t] > 0 && t !== "roi").sort((a, b) => PIECES[a].cost - PIECES[b].cost)[0];
      } else {
        pick = ORDER.filter((t) => out[t] > 0 && t !== "roi").sort((a, b) => PIECES[b].cost - PIECES[a].cost)[0];
      }
      if (!pick) pick = id;
      if (!pick) break;
      out[pick]--;
    }
    // complète avec des gardes si l'armée est trop petite (au moins 8 pièces)
    while (countsTotal(out) + 1 < Math.min(size, 8)) out.garde = (out.garde || 0) + 1;
    out.oeuf = 1;
    return out;
  }

  return { PIECES, ORDER, HOUSES, ARMIES, CHAOS_EVENTS, armySizeFor, countsCost, countsTotal, resolveArmy, finalizeCounts, sanitizeCustom };
});
