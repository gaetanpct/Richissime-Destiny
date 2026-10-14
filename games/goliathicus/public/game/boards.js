// ============================================================
// GOLIATHICUS — Génération des plateaux
// Plateau en croix (3 ou 4 joueurs) ou en duel rectangulaire (2 joueurs).
// Le relief neutre est toujours symétrique, donc équitable.
// ============================================================
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory();
  else root.GoliathBoards = factory();
})(typeof window !== "undefined" ? window : globalThis, function () {
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rng) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const SIDES_BY_COUNT = { 2: ["bottom", "top"], 3: ["bottom", "left", "right"], 4: ["bottom", "left", "top", "right"] };
  const PASSABLE = { plain: true, forest: true, marsh: true };

  function isPassableTerrain(t) { return !!PASSABLE[t]; }

  function buildBoard(settings, playerCount, rng) {
    rng = rng || Math.random;
    const express = settings.boardSize === "express";
    const count = Math.max(2, Math.min(4, playerCount));
    const sides = SIDES_BY_COUNT[count];
    const duel = count === 2;
    let rows, cols, C, D, W, M;
    const terrain = [];
    const arms = [];
    const neutral = [];

    if (duel) {
      W = express ? 6 : 8; D = express ? 2 : 3; M = express ? 4 : 6;
      rows = D + M + D; cols = W;
      for (let r = 0; r < rows; r++) { terrain.push([]); for (let c = 0; c < cols; c++) terrain[r].push("plain"); }
      const bottom = [], top = [];
      for (let r = rows - D; r < rows; r++) for (let c = 0; c < cols; c++) bottom.push([r, c]);
      for (let r = 0; r < D; r++) for (let c = 0; c < cols; c++) top.push([r, c]);
      arms.push({ seat: 0, side: "bottom", cells: bottom });
      arms.push({ seat: 1, side: "top", cells: top });
      for (let r = D; r < D + M; r++) for (let c = 0; c < cols; c++) neutral.push([r, c]);
    } else {
      C = express ? 4 : 6; D = express ? 3 : 4;
      rows = cols = C + 2 * D;
      for (let r = 0; r < rows; r++) { terrain.push([]); for (let c = 0; c < cols; c++) terrain[r].push("void"); }
      for (let r = D; r < D + C; r++) for (let c = D; c < D + C; c++) { terrain[r][c] = "plain"; neutral.push([r, c]); }
      const armCells = {
        bottom: () => { const a = []; for (let r = rows - D; r < rows; r++) for (let c = D; c < D + C; c++) a.push([r, c]); return a; },
        top: () => { const a = []; for (let r = 0; r < D; r++) for (let c = D; c < D + C; c++) a.push([r, c]); return a; },
        left: () => { const a = []; for (let r = D; r < D + C; r++) for (let c = 0; c < D; c++) a.push([r, c]); return a; },
        right: () => { const a = []; for (let r = D; r < D + C; r++) for (let c = cols - D; c < cols; c++) a.push([r, c]); return a; },
      };
      sides.forEach((side, seat) => {
        const cells = armCells[side]();
        cells.forEach(([r, c]) => { terrain[r][c] = "plain"; });
        arms.push({ seat, side, cells });
      });
    }

    const orbitOf = (r, c) => {
      if (duel) return [[r, c], [rows - 1 - r, cols - 1 - c]];
      const S = rows;
      const out = [[r, c]];
      let cr = r, cc = c;
      for (let i = 0; i < 3; i++) { const nr = cc, nc = S - 1 - cr; cr = nr; cc = nc; out.push([cr, cc]); }
      return out;
    };
    const key = (r, c) => r + "," + c;

    function connected() {
      let start = null; let total = 0;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        if (isPassableTerrain(terrain[r][c])) { total++; if (!start) start = [r, c]; }
      }
      if (!start) return false;
      const seen = new Set([key(start[0], start[1])]);
      const q = [start];
      while (q.length) {
        const [r, c] = q.pop();
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) return;
          if (!isPassableTerrain(terrain[nr][nc]) || seen.has(key(nr, nc))) return;
          seen.add(key(nr, nc)); q.push([nr, nc]);
        });
      }
      return seen.size === total;
    }

    // --- relief ---
    const mode = settings.terrain || "classic";
    function setOrbit(r, c, t) { orbitOf(r, c).forEach(([rr, cc]) => { terrain[rr][cc] = t; }); }

    if (mode === "classic") {
      if (duel) {
        if (express) { [1, 4].forEach((c) => [D + 1, D + 2].forEach((r) => { terrain[r][c] = "lake"; })); }
        else { [1, 2, 5, 6].forEach((c) => [D + 2, D + 3].forEach((r) => { terrain[r][c] = "lake"; })); }
      } else {
        const a = D + C / 2 - 1;
        [a, a + 1].forEach((r) => [a, a + 1].forEach((c) => { terrain[r][c] = "lake"; }));
      }
    } else if (mode === "random" || mode === "wild") {
      const share = mode === "wild" ? { lake: 0.2, forest: 0.14, marsh: 0.1 } : { lake: 0.1, forest: 0.1, marsh: 0.06 };
      const seen = new Set();
      const orbits = [];
      neutral.forEach(([r, c]) => {
        if (seen.has(key(r, c))) return;
        const o = orbitOf(r, c);
        o.forEach(([a, b]) => seen.add(key(a, b)));
        orbits.push([r, c]);
      });
      shuffle(orbits, rng);
      // on garde une marge autour des bords pour toujours laisser des passages
      orbits.forEach(([r, c]) => {
        const x = rng();
        let t = null;
        if (x < share.lake) t = "lake";
        else if (x < share.lake + share.forest) t = "forest";
        else if (x < share.lake + share.forest + share.marsh) t = "marsh";
        if (!t) return;
        const prev = terrain[r][c];
        setOrbit(r, c, t);
        if (t === "lake" && !connected()) setOrbit(r, c, prev);
      });
    }

    // --- reliques ---
    const relics = [];
    if (settings.mode === "conquest") {
      const orbitsWanted = settings.relicOrbits === 2 ? 2 : 1;
      const midR = (rows - 1) / 2, midC = (cols - 1) / 2;
      const cands = neutral
        .filter(([r, c]) => terrain[r][c] !== "lake")
        .map(([r, c]) => ({ r, c, d: Math.abs(r - midR) + Math.abs(c - midC) + rng() * 0.9 }))
        .sort((a, b) => a.d - b.d);
      const used = new Set();
      for (const cand of cands) {
        if (relics.length >= orbitsWanted * (duel ? 2 : 4)) break;
        if (used.has(key(cand.r, cand.c))) continue;
        const orbit = orbitOf(cand.r, cand.c);
        const okOrbit = orbit.every(([r, c]) => !used.has(key(r, c)) && terrain[r][c] !== "lake" && terrain[r][c] !== "void");
        if (!okOrbit) continue;
        orbit.forEach(([r, c]) => { used.add(key(r, c)); terrain[r][c] = "plain"; relics.push({ r, c }); });
      }
    }

    return { kind: duel ? "duel" : "cross", rows, cols, terrain, arms, neutral, relics, sides, express };
  }

  // Rotation d'affichage : place le camp du joueur en bas de l'écran.
  // Renvoie {rows, cols, map(r,c)->{r,c}} pour passer des coordonnées du jeu à l'écran.
  function viewTransform(board, side) {
    const R = board.rows, C = board.cols;
    if (board.kind === "duel") {
      if (side === "top") return { rows: R, cols: C, map: (r, c) => ({ r: R - 1 - r, c: C - 1 - c }) };
      return { rows: R, cols: C, map: (r, c) => ({ r, c }) };
    }
    const S = R;
    if (side === "left") return { rows: S, cols: S, map: (r, c) => ({ r: S - 1 - c, c: r }) };
    if (side === "top") return { rows: S, cols: S, map: (r, c) => ({ r: S - 1 - r, c: S - 1 - c }) };
    if (side === "right") return { rows: S, cols: S, map: (r, c) => ({ r: c, c: S - 1 - r }) };
    return { rows: S, cols: S, map: (r, c) => ({ r, c }) };
  }

  return { buildBoard, viewTransform, mulberry32, shuffle, isPassableTerrain, SIDES_BY_COUNT };
});
