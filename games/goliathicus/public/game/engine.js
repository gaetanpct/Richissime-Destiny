// ============================================================
// GOLIATHICUS — Moteur de règles (autoritaire, pur)
// Utilisé côté serveur ; le client ne reçoit que l'état filtré.
// ============================================================
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(require("./pieces.js"), require("./boards.js"), require("./rules-schema.js"));
  } else {
    root.GoliathEngine = factory(root.GoliathPieces, root.GoliathBoards, root.GoliathRules);
  }
})(typeof window !== "undefined" ? window : globalThis, function (Pieces, Boards, Rules) {
  const { PIECES, HOUSES, CHAOS_EVENTS } = Pieces;
  const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const MAX_ROUNDS = 300;
  const QUIET_TURNS_PER_PLAYER = 50;

  const K = (r, c) => r + "," + c;

  class GoliathEngine {
    constructor(config) {
      const plist = config.players;
      this.n = plist.length;
      if (this.n < 2 || this.n > 4) throw new Error("2 à 4 joueurs");
      this.settings = Rules.normalize(config.settings, this.n);
      this.seed = config.seed != null ? config.seed : Math.floor(Math.random() * 4294967295);
      this.rng = Boards.mulberry32(this.seed);
      this.players = plist.map((p, i) => ({
        id: p.id, name: p.name || "Joueur " + (i + 1), house: p.house != null ? p.house : i,
        isAI: !!p.isAI, level: p.level || null, seat: i,
        team: this.settings.teams ? i % 2 : i,
        eliminated: false, ready: false, eliminatedBy: null,
        charges: this.settings.powers ? this.settings.powerCharges : 0,
        score: 0, bonus: 0,
        stats: { moves: 0, cells: 0, attacks: 0, kills: 0, lost: 0, defused: 0, exploded: 0, kingsSlain: 0, powers: 0, bestKill: 0, bestKillType: null },
      }));
      this.board = Boards.buildBoard(this.settings, this.n, this.rng);
      this.terrain = this.board.terrain.map((row) => row.slice());
      this.ruins = new Set();
      this.relics = this.board.relics.slice();
      this.pieces = [];
      this.graveyard = [];
      this.events = [];
      this.seq = 0;
      this.version = 0;
      this.phase = "setup";
      this.current = 0;
      this.round = 1;
      this.turn = 0;
      this.turnPowerUsed = false;
      this.quietTurns = 0;
      this.tempFog = 0;
      this.winners = null;
      this.endReason = null;
      this.lastChaos = null;
      this._visCache = {};
      this.grid = [];
      for (let r = 0; r < this.board.rows; r++) { this.grid.push(new Array(this.board.cols).fill(null)); }
      this.armyCounts = Pieces.resolveArmy(this.settings);
      this.armSize = Pieces.armySizeFor(this.settings.boardSize);
      this.armyBy = this.players.map(() => this.armyCounts);
      this.customMode = this.settings.armyPreset === "custom";
      this._depth = {};
      this.board.arms.forEach((arm) => {
        arm.cells.forEach(([r, c]) => { this._depth[K(r, c)] = this._armDepth(arm.side, r, c); });
      });
      if (this.customMode) {
        // chacun compose son armée (même budget, sans limite de temps), puis on passe au placement
        this.phase = "compose";
        this.comp = this.players.map(() => ({ counts: this._defaultComposition() }));
        this._pushEvent({ kind: "info", text: "Composez vos armées avec le même budget, sans limite de temps. Validez quand vous êtes prêts !" });
      } else {
        this._createArmies();
        this._pushEvent({ kind: "info", text: "Les armées se rangent en ordre de bataille. Disposez vos pièces, puis déclarez-vous prêts !" });
      }
    }

    // ---------- composition sur mesure ----------
    _defaultComposition() {
      return this._cleanComposition(Pieces.ARMIES[this.armSize].standard.counts);
    }
    _cleanComposition(input) {
      return Pieces.sanitizeCustom(input, this.settings, this.armSize);
    }
    compositionCost(counts) { return Pieces.countsCost(counts); }
    composeSet(pi, counts) {
      if (this.phase !== "compose") return { ok: false, error: "Ce n'est plus le moment de composer." };
      if (this.players[pi].ready) return { ok: false, error: "Tu as déjà validé, clique sur Modifier pour changer." };
      this.comp[pi].counts = this._cleanComposition(counts);
      this._bump();
      return { ok: true };
    }
    composePreset(pi, presetId) {
      const preset = Pieces.ARMIES[this.armSize][presetId];
      if (!preset || (preset.special && !this.settings.specialPieces)) return { ok: false, error: "Modèle inconnu." };
      return this.composeSet(pi, preset.counts);
    }
    composeReady(pi, ready = true) {
      if (this.phase !== "compose") return { ok: false, error: "Déjà terminé." };
      this.players[pi].ready = !!ready;
      this._bump();
      if (this.players.every((p) => p.ready || p.eliminated)) this._finishCompose();
      return { ok: true };
    }
    _finishCompose() {
      this.armyBy = this.comp.map((c) => Pieces.finalizeCounts(c.counts, this.settings));
      this._createArmies();
      this.players.forEach((p) => { p.ready = p.eliminated; });
      this.phase = "setup";
      this._pushEvent({ kind: "info", text: "Les armées sont prêtes. Disposez vos pièces, puis déclarez-vous prêts !" });
    }

    // ---------- utilitaires ----------
    _armDepth(side, r, c) {
      const R = this.board.rows, C = this.board.cols;
      const D = this.board.kind === "duel" ? (this.settings.boardSize === "express" ? 2 : 3) : (this.settings.boardSize === "express" ? 3 : 4);
      if (side === "bottom") return r - (R - D);
      if (side === "top") return D - 1 - r;
      if (side === "left") return D - 1 - c;
      return c - (C - D);
    }
    _bump() { this.version++; this._visCache = {}; }
    teamOf(pi) { return this.players[pi].team; }
    isEnemy(piA, piB) { return this.players[piA].team !== this.players[piB].team; }
    pieceAt(r, c) { return this.grid[r] && this.grid[r][c] ? this.grid[r][c] : null; }
    inBounds(r, c) { return r >= 0 && c >= 0 && r < this.board.rows && c < this.board.cols; }
    passable(r, c) {
      if (!this.inBounds(r, c)) return false;
      const t = this.terrain[r][c];
      return (t === "plain" || t === "forest" || t === "marsh") && !this.ruins.has(K(r, c));
    }
    houseOf(pi) { return HOUSES[this.players[pi].house % HOUSES.length]; }
    pieceLabel(p) { const d = PIECES[p.type]; return d.icon + " " + d.name; }
    pname(pi) { return this.players[pi].name; }
    aliveTeams() {
      const s = new Set();
      this.players.forEach((p) => { if (!p.eliminated) s.add(p.team); });
      return s;
    }
    alivePlayers() { return this.players.filter((p) => !p.eliminated); }
    fogActive() { return !!this.settings.fog || this.tempFog > 0; }
    fogRadius() { return this.tempFog > 0 ? 1 : this.settings.fogRadius; }
    isTargetMode() { return this.settings.mode === "kinghunt" ? "roi" : "oeuf"; }

    _pushEvent(ev) {
      ev.seq = ++this.seq;
      ev.round = this.round;
      ev.turn = this.turn;
      ev.fog = this.fogActive();
      this.events.push(ev);
      if (this.events.length > 300) this.events.shift();
      this._bump();
      return ev;
    }

    // ---------- création et placement ----------
    _createArmies() {
      let id = 0;
      this.players.forEach((pl, pi) => {
        if (pl.eliminated) return;
        const arm = this.board.arms[pi];
        const types = [];
        const mineCounts = this.armyBy[pi];
        Object.keys(mineCounts).forEach((t) => { for (let i = 0; i < mineCounts[t]; i++) types.push(t); });
        // sécurité : jamais plus de pièces que de cases
        while (types.length > arm.cells.length) {
          const idx = types.findIndex((t) => t === "garde" || t === "lutin");
          types.splice(idx >= 0 ? idx : types.length - 1, 1);
        }
        const pcs = types.map((type) => ({
          id: "p" + pi + "-" + (id++), owner: pi, type, r: -1, c: -1, alive: true, moved: false,
          revealedAll: false, revealedTo: new Set(), frozen: 0, hist: [], kills: 0,
        }));
        pcs.forEach((p) => this.pieces.push(p));
        this._autoPlace(pi, "random");
      });
    }

    _armCells(pi) { return this.board.arms[pi].cells; }
    myPieces(pi, onlyAlive = true) { return this.pieces.filter((p) => p.owner === pi && (!onlyAlive || p.alive)); }

    // style : "random" | "defensive" | "aggressive"
    _autoPlace(pi, style) {
      const cells = this._armCells(pi).map(([r, c]) => [r, c]);
      const pcs = this.myPieces(pi);
      cells.forEach(([r, c]) => { this.grid[r][c] = null; });
      const free = cells.slice();
      Boards.shuffle(free, this.rng);
      const placed = new Set();
      const place = (p, cell) => {
        p.r = cell[0]; p.c = cell[1]; p.moved = false; p.hist = [];
        this.grid[cell[0]][cell[1]] = p;
        placed.add(p.id);
        const i = free.findIndex((x) => x[0] === cell[0] && x[1] === cell[1]);
        if (i >= 0) free.splice(i, 1);
      };
      const depthOf = (cell) => this._depth[K(cell[0], cell[1])];
      const maxDepth = Math.max(...cells.map(depthOf));
      const bombs = pcs.filter((p) => p.type === "tarte");
      if (this.isTargetMode() === "oeuf") {
        const flag = pcs.find((p) => p.type === "oeuf");
        if (flag) {
          const backs = free.filter((cl) => depthOf(cl) >= maxDepth - (style === "defensive" ? 0 : 1));
          const spot = backs.length ? backs[Math.floor(this.rng() * backs.length)] : free[0];
          place(flag, spot);
          // les tartes autour de l'œuf quand possible
          const neigh = free.filter((cl) => Math.abs(cl[0] - flag.r) + Math.abs(cl[1] - flag.c) === 1);
          Boards.shuffle(neigh, this.rng);
          bombs.forEach((b) => {
            const useNeigh = neigh.length && this.rng() < (style === "defensive" ? 0.9 : 0.55);
            const spot2 = useNeigh ? neigh.shift() : free.filter((cl) => depthOf(cl) >= 1)[0] || free[0];
            if (spot2 && !placed.has(b.id)) place(b, spot2);
          });
        }
      } else {
        bombs.forEach((b) => { const sp = free.filter((cl) => depthOf(cl) >= 1)[0] || free[0]; place(b, sp); });
      }
      // le reste : mélange, les grosses pièces un peu plus devant en mode agressif
      const rest = pcs.filter((p) => !placed.has(p.id));
      Boards.shuffle(rest, this.rng);
      if (style === "aggressive") {
        rest.sort((a, b) => PIECES[b.type].rank - PIECES[a.type].rank);
        free.sort((a, b) => depthOf(a) - depthOf(b));
      }
      rest.forEach((p) => place(p, free[0]));
      this._bump();
    }

    setupRandom(pi, style) {
      if (this.phase !== "setup" || this.players[pi].ready) return { ok: false, error: "Placement terminé." };
      this._autoPlace(pi, style || "random");
      return { ok: true };
    }

    // Échange le contenu de deux cases de son camp (ou déplace vers une case vide).
    setupSwap(pi, a, b) {
      if (this.phase !== "setup") return { ok: false, error: "Ce n'est plus le moment de placer." };
      if (this.players[pi].ready) return { ok: false, error: "Tu es déjà prêt." };
      const cells = this._armCells(pi);
      const inArm = (x) => Array.isArray(x) && cells.some(([r, c]) => r === x[0] && c === x[1]);
      if (!inArm(a) || !inArm(b)) return { ok: false, error: "Cases hors de ton camp." };
      const pa = this.grid[a[0]][a[1]], pb = this.grid[b[0]][b[1]];
      this.grid[a[0]][a[1]] = pb; this.grid[b[0]][b[1]] = pa;
      if (pa) { pa.r = b[0]; pa.c = b[1]; }
      if (pb) { pb.r = a[0]; pb.c = a[1]; }
      this._bump();
      return { ok: true };
    }

    // Applique une disposition complète {pieceId: [r,c]} (utilisé par l'IA).
    setupApply(pi, placement) {
      if (this.phase !== "setup" || this.players[pi].ready) return { ok: false, error: "Placement terminé." };
      const cells = this._armCells(pi);
      const mine = this.myPieces(pi);
      const used = new Set();
      for (const p of mine) {
        const pos = placement[p.id];
        if (!pos || !cells.some(([r, c]) => r === pos[0] && c === pos[1]) || used.has(K(pos[0], pos[1]))) return { ok: false, error: "Disposition invalide." };
        used.add(K(pos[0], pos[1]));
      }
      cells.forEach(([r, c]) => { this.grid[r][c] = null; });
      mine.forEach((p) => { const pos = placement[p.id]; p.r = pos[0]; p.c = pos[1]; p.hist = []; this.grid[pos[0]][pos[1]] = p; });
      this._bump();
      return { ok: true };
    }

    setupReady(pi, ready = true) {
      if (this.phase !== "setup") return { ok: false, error: "Déjà commencé." };
      this.players[pi].ready = !!ready;
      this._bump();
      if (this.players.every((p) => p.ready)) this._startPlaying();
      return { ok: true };
    }

    _startPlaying() {
      this.phase = "playing";
      this.current = 0;
      this.round = 1;
      this.turn = 1;
      this._pushEvent({ kind: "start", text: "⚔️ La bataille commence ! Que le plus rusé l'emporte." });
      this._beginTurn();
    }

    // ---------- déplacements ----------
    _movesFor(p) {
      if (!p.alive || p.frozen > 0 || !PIECES[p.type].mobile) return [];
      const def = PIECES[p.type];
      const out = [];
      const consider = (r, c) => {
        if (!this.passable(r, c)) return "block";
        const occ = this.grid[r][c];
        if (!occ) return "empty";
        if (this.isEnemy(p.owner, occ.owner)) return "enemy";
        return "own";
      };
      DIRS.forEach(([dr, dc]) => {
        if (def.long) {
          let r = p.r + dr, c = p.c + dc;
          while (true) {
            const k = consider(r, c);
            if (k === "empty") { out.push([r, c]); r += dr; c += dc; continue; }
            if (k === "enemy") out.push([r, c]);
            break;
          }
        } else {
          const r = p.r + dr, c = p.c + dc;
          const k = consider(r, c);
          if (k === "empty" || k === "enemy") out.push([r, c]);
          else if (def.ghost && this.inBounds(r, c) && this.terrain[r][c] !== "void" && !this.passable(r, c)) {
            const r2 = r + dr, c2 = c + dc;
            const k2 = consider(r2, c2);
            if (k2 === "empty" || k2 === "enemy") out.push([r2, c2]);
          }
        }
      });
      // règle anti ping-pong : pas de 3e aller-retour sur une case vide
      const h = p.hist;
      return out.filter(([r, c]) => {
        if (this.grid[r][c]) return true;
        if (h.length >= 4) {
          const a = h[h.length - 1], b = h[h.length - 2], c3 = h[h.length - 3], d = h[h.length - 4];
          if (a === c3 && b === d && K(r, c) === b) return false;
        }
        return true;
      });
    }

    legalMoves(pi) {
      const out = [];
      this.myPieces(pi).forEach((p) => {
        this._movesFor(p).forEach(([r, c]) => out.push({ pieceId: p.id, to: [r, c], attack: !!this.grid[r][c] }));
      });
      return out;
    }

    hasLegalMove(pi) {
      return this.myPieces(pi).some((p) => this._movesFor(p).length > 0);
    }

    move(pi, pieceId, to) {
      if (this.phase !== "playing") return { ok: false, error: "La partie n'est pas en cours." };
      if (pi !== this.current) return { ok: false, error: "Ce n'est pas ton tour." };
      const p = this.pieces.find((x) => x.id === pieceId);
      if (!p || p.owner !== pi || !p.alive) return { ok: false, error: "Pièce invalide." };
      if (!Array.isArray(to)) return { ok: false, error: "Destination invalide." };
      const legal = this._movesFor(p).some(([r, c]) => r === to[0] && c === to[1]);
      if (!legal) return { ok: false, error: "Déplacement impossible." };
      this._execMove(p, to[0], to[1]);
      return { ok: true };
    }

    _recordMove(p, r, c) {
      // l'historique garde les cases successivement occupées (détection des allers-retours)
      if (!p.hist.length) p.hist.push(K(p.r, p.c));
      this.grid[p.r][p.c] = null;
      p.r = r; p.c = c;
      this.grid[r][c] = p;
      p.moved = true;
      p.hist.push(K(r, c));
      if (p.hist.length > 8) p.hist.shift();
    }

    _execMove(p, r, c) {
      const pi = p.owner;
      const pl = this.players[pi];
      const from = { r: p.r, c: p.c };
      const dist = Math.abs(r - p.r) + Math.abs(c - p.c);
      pl.stats.moves++;
      pl.stats.cells += dist;
      const target = this.grid[r][c];
      if (!target) {
        this._recordMove(p, r, c);
        if (this.terrain[r][c] === "marsh") p.frozen = 2;
        this._pushEvent({
          kind: "move", pieceId: p.id, owner: pi, from, to: { r, c }, cells: [from, { r, c }],
          text: this.pname(pi) + " avance une pièce.",
        });
        this._afterAction();
        return;
      }
      this._combat(p, target, from);
      this._afterAction();
    }

    _combat(att, def, from) {
      const pi = att.owner, di = def.owner;
      const A = PIECES[att.type], Dd = PIECES[def.type];
      const at = { r: def.r, c: def.c };
      const inForest = this.terrain[at.r][at.c] === "forest";
      let result;
      if (Dd.bomb) result = A.miner ? "defused" : "exploded";
      else if (def.type === "oeuf") result = "flag";
      else if (att.type === "rat" && def.type === "roi") result = "ratKing";
      else if (att.type === "roi" && def.type === "rat") result = "ratGuard"; // le Rat bat le Roi même quand il se défend
      else if (att.type === "roi" && def.type === "roi" && this.settings.mode === "kinghunt") result = "attWins"; // duel de rois : l'attaquant l'emporte
      else if (A.rank > Dd.rank) result = "attWins";
      else if (A.rank < Dd.rank) result = "defWins";
      else result = "tie";
      const attWon = ["defused", "flag", "ratKing", "attWins"].includes(result);
      const defDies = attWon || result === "tie";
      const attDies = result === "exploded" || result === "defWins" || result === "ratGuard" || result === "tie";

      const pa = this.players[pi], pd = this.players[di];
      pa.stats.attacks++;
      const ev = {
        kind: "combat", result, cells: [from, at],
        attacker: { id: att.id, owner: pi, type: att.type, from },
        defender: { id: def.id, owner: di, type: def.type, at },
        text: "",
      };
      // ce qui reste caché (forêt) : seul le défenseur victorieux
      const defHidden = inForest && !defDies;
      if (defHidden) ev.defender.type = null;

      const la = this.pieceLabel(att), ld = Dd.icon + " " + Dd.name;
      const na = this.pname(pi), nd = this.pname(di);
      switch (result) {
        case "defused": ev.text = `⛏️ ${na} désamorce la ${ld} de ${nd} avec son Nain Démineur !`; pa.stats.defused++; break;
        case "exploded": ev.text = `💥 ${la} de ${na} se jette sur une tarte piégée de ${nd} et explose !`; pd.stats.exploded++; break;
        case "flag": ev.text = `🥚 ${na} croque l'Œuf de Dragon de ${nd} !`; break;
        case "ratGuard": ev.text = `🐀 Coup de théâtre ! Le Rat Espion de ${nd} se défend et terrasse le Roi de ${na} !`; pd.stats.kingsSlain++; break;
        case "ratKing": ev.text = `🐀 Coup de théâtre ! Le Rat Espion de ${na} terrasse le Roi de ${nd} !`; pa.stats.kingsSlain++; break;
        case "attWins": ev.text = `${la} de ${na} bat ${defHidden ? "une pièce" : ld} de ${nd}.`; break;
        case "defWins": ev.text = defHidden ? `${la} de ${na} se casse les dents sur une pièce cachée dans la forêt de ${nd}.` : `${la} de ${na} se fait battre par ${ld} de ${nd}.`; break;
        case "tie": ev.text = `${la} de ${na} et ${ld} de ${nd} s'éliminent mutuellement.`; break;
      }

      // application
      const reveal = (piece) => { piece.revealedAll = true; };
      const toGrave = (piece, by) => {
        piece.alive = false; this.grid[piece.r][piece.c] = null;
        const g = { id: piece.id, owner: piece.owner, type: piece.type, evSeq: this.seq + 1 };
        if (this.settings.bombsHidden && PIECES[piece.type].bomb && by) g.hideTeams = [this.players[by.owner].team, this.players[piece.owner].team];
        this.graveyard.push(g);
        if (by) { by.kills++; }
      };
      if (defDies) {
        const k = PIECES[def.type];
        if (attWon) {
          pa.stats.kills++;
          if (k.cost + (k.rank || 0) > pa.stats.bestKill) { pa.stats.bestKill = k.cost + (k.rank || 0); pa.stats.bestKillType = def.type; }
        }
      }
      if (attDies) pa.stats.lost++;
      if (result === "exploded" && !inForest) {
        if (this.settings.bombsHidden) {
          // la tarte reste cachée pour les joueurs qui n'étaient pas dans le combat
          this.players.forEach((q, qi) => { if (q.team === pa.team) def.revealedTo.add(qi); });
        } else reveal(def);
      }
      if (result === "tie") { /* les deux disparaissent */ }

      const keepRevealed = this.settings.survivorsRevealed;
      if (attWon) {
        toGrave(def, att);
        this._recordMove(att, at.r, at.c);
        if (keepRevealed) reveal(att);
        if (this.terrain[at.r][at.c] === "marsh") att.frozen = 2;
      } else if (result === "exploded" || result === "defWins" || result === "ratGuard") {
        toGrave(att, def);
        if (!inForest || result === "exploded") { /* révélé via event */ }
        if ((result === "defWins" || result === "ratGuard") && keepRevealed && !inForest) reveal(def);
      } else {
        toGrave(att, def); toGrave(def, att);
      }
      if (this.settings.bombsHidden && (result === "exploded" || result === "defused")) {
        // seuls les camps du combat savent que c'était une tarte
        ev.hideBomb = { teams: [pa.team, pd.team] };
        ev.hiddenView = {
          result: result === "exploded" ? "defWins" : "attWins",
          text: result === "exploded"
            ? `${la} de ${na} se fait éliminer en attaquant une pièce cachée de ${nd}.`
            : `${la} de ${na} bat une pièce cachée de ${nd}.`,
        };
      }
      this._pushEvent(ev);
      this.quietTurns = -1; // remis à 0 en fin de tour
      // éliminations
      if (result === "flag") this._eliminate(di, "L'Œuf de Dragon a été croqué.", pi);
      if (this.settings.mode === "kinghunt") {
        if (def.type === "roi" && defDies) this._eliminate(di, "Le Roi est tombé.", pi);
        if (att.type === "roi" && attDies) this._eliminate(pi, "Le Roi est tombé.", di);
      }
    }

    _eliminate(pi, reason, by) {
      const pl = this.players[pi];
      if (pl.eliminated) return;
      pl.eliminated = true;
      pl.eliminatedBy = by != null ? by : null;
      const ruins = this.settings.eliminated === "ruins";
      this.pieces.forEach((p) => {
        if (p.owner !== pi || !p.alive) return;
        p.alive = false;
        this.grid[p.r][p.c] = null;
        if (ruins) this.ruins.add(K(p.r, p.c));
      });
      this._pushEvent({ kind: "elim", player: pi, by: by != null ? by : null, text: `☠️ ${pl.name} est éliminé ! ${reason}` });
    }

    // ---------- pouvoirs ----------
    visibleCells(viewerPi) {
      const team = this.players[viewerPi].team;
      const key = "v" + team;
      if (this._visCache[key]) return this._visCache[key];
      const set = new Set();
      const R = this.fogRadius();
      this.pieces.forEach((p) => {
        if (!p.alive || this.players[p.owner].team !== team) return;
        for (let dr = -R; dr <= R; dr++) for (let dc = -R; dc <= R; dc++) {
          if (Math.abs(dr) + Math.abs(dc) > R) continue;
          set.add(K(p.r + dr, p.c + dc));
        }
      });
      this._visCache[key] = set;
      return set;
    }

    canSeePiece(viewerPi, p) {
      if (!this.fogActive()) return true;
      if (this.players[p.owner].team === this.players[viewerPi].team) return true;
      return this.visibleCells(viewerPi).has(K(p.r, p.c));
    }

    usePower(pi, data) {
      if (this.phase !== "playing") return { ok: false, error: "La partie n'est pas en cours." };
      if (pi !== this.current) return { ok: false, error: "Ce n'est pas ton tour." };
      const pl = this.players[pi];
      if (!this.settings.powers) return { ok: false, error: "Les pouvoirs sont désactivés." };
      if (pl.charges <= 0) return { ok: false, error: "Plus de charge de pouvoir." };
      if (this.turnPowerUsed) return { ok: false, error: "Un seul pouvoir par tour." };
      const house = this.houseOf(pi);
      const pid = house.power.id;
      data = data || {};
      const find = (id) => this.pieces.find((x) => x.id === id && x.alive);
      if (pid === "theatre") {
        const a = find(data.a), b = find(data.b);
        if (!a || !b || a === b || a.owner !== pi || b.owner !== pi) return { ok: false, error: "Choisis deux de tes pièces." };
        const ca = { r: a.r, c: a.c }, cb = { r: b.r, c: b.c };
        this.grid[ca.r][ca.c] = b; this.grid[cb.r][cb.c] = a;
        a.r = cb.r; a.c = cb.c; b.r = ca.r; b.c = ca.c;
        a.hist = []; b.hist = [];
        this._pushEvent({ kind: "power", power: pid, owner: pi, cells: [ca, cb], swap: [ca, cb], text: `🔄 ${pl.name} échange la place de deux de ses pièces !` });
      } else if (pid === "longuevue") {
        const t = find(data.target);
        if (!t || this.players[t.owner].team === pl.team || !this.canSeePiece(pi, t)) return { ok: false, error: "Choisis une pièce ennemie visible." };
        t.revealedTo.add(pi);
        this.players.forEach((q, qi) => { if (q.team === pl.team) t.revealedTo.add(qi); });
        this._pushEvent({ kind: "power", power: pid, owner: pi, private: [pi], privateTeam: pl.team, target: { r: t.r, c: t.c, id: t.id }, cells: [], text: `🔭 ${pl.name} utilise son Œil d'aigle sur une pièce ennemie.` });
      } else if (pid === "sieste") {
        const t = find(data.target);
        if (!t || this.players[t.owner].team === pl.team || !this.canSeePiece(pi, t)) return { ok: false, error: "Choisis une pièce ennemie visible." };
        t.frozen = Math.max(t.frozen, 2);
        this._pushEvent({ kind: "power", power: pid, owner: pi, target: { r: t.r, c: t.c, id: t.id }, cells: [{ r: t.r, c: t.c }], text: `😴 ${pl.name} endort une pièce de ${this.pname(t.owner)} pour deux tours !` });
      } else if (pid === "ruee") {
        pl.bonus = 1;
        this._pushEvent({ kind: "power", power: pid, owner: pi, cells: [], text: `⚡ ${pl.name} lance sa Ruée, deux déplacements d'affilée !` });
      } else return { ok: false, error: "Pouvoir inconnu." };
      pl.charges--;
      pl.stats.powers++;
      this.turnPowerUsed = true;
      this._bump();
      return { ok: true };
    }

    resign(pi) {
      if (this.phase !== "playing" && this.phase !== "setup" && this.phase !== "compose") return { ok: false };
      const pl = this.players[pi];
      if (pl.eliminated) return { ok: false };
      if (this.phase === "setup" || this.phase === "compose") { pl.ready = true; }
      this._eliminate(pi, "Il a quitté la partie.", null);
      if (this.phase === "setup" || this.phase === "compose") {
        if (this.alivePlayers().length <= 1) return this._finishByLastStanding();
        if (this.players.every((p) => p.ready || p.eliminated)) { if (this.phase === "compose") this._finishCompose(); else this._startPlaying(); }
        return { ok: true };
      }
      this._afterElimination(pi);
      return { ok: true };
    }

    _afterElimination(pi) {
      if (this.phase === "finished") return;
      if (this._checkLastStanding()) return;
      if (this.current === pi) this._advance();
    }

    // ---------- gestion du tour ----------
    _afterAction() {
      if (this.phase === "finished") return;
      if (this._checkLastStanding()) return;
      const pl = this.players[this.current];
      if (pl.eliminated) { this._advance(); return; }
      if (pl.bonus > 0) {
        pl.bonus = 0;
        if (this.hasLegalMove(this.current)) {
          this.quietTurns = Math.max(0, this.quietTurns);
          this._bump();
          return; // deuxième déplacement du même joueur
        }
      }
      this._advance();
    }

    _checkLastStanding() {
      const teams = this.aliveTeams();
      if (teams.size <= 1) { this._finishByLastStanding(); return true; }
      return false;
    }

    _finishByLastStanding() {
      const teams = this.aliveTeams();
      let winners;
      if (teams.size === 0) winners = [];
      else winners = this.players.filter((p) => !p.eliminated).map((p) => p.seat);
      if (this.settings.teams && teams.size === 1) {
        const t = [...teams][0];
        winners = this.players.filter((p) => p.team === t).map((p) => p.seat);
      }
      this._finish(winners, winners.length ? "last" : "draw");
      return { ok: true };
    }

    _finish(winners, reason) {
      this.phase = "finished";
      this.winners = winners;
      this.endReason = reason;
      let text;
      if (!winners.length) text = "🤝 Match nul, personne ne l'emporte.";
      else if (this.settings.teams) text = `🏆 L'équipe ${winners.map((w) => this.pname(w)).join(" et ")} remporte la bataille !`;
      else if (winners.length === 1) text = `🏆 ${this.pname(winners[0])} remporte la bataille !`;
      else text = `🤝 Égalité entre ${winners.map((w) => this.pname(w)).join(" et ")} !`;
      this._pushEvent({ kind: "end", text, winners, reason });
    }

    _material(team) {
      let t = 0;
      this.pieces.forEach((p) => {
        if (p.alive && this.players[p.owner].team === team) t += PIECES[p.type].cost + (PIECES[p.type].mobile ? 1 : 0);
      });
      return t;
    }

    _finishByMaterial(label) {
      const teams = [...this.aliveTeams()];
      let best = -1; let bestTeams = [];
      teams.forEach((t) => {
        let m = this._material(t);
        m += this.players.filter((p) => p.team === t).reduce((s, p) => s + p.score * 2, 0);
        if (m > best) { best = m; bestTeams = [t]; } else if (m === best) bestTeams.push(t);
      });
      let winners = this.players.filter((p) => bestTeams.includes(p.team) && !p.eliminated).map((p) => p.seat);
      if (bestTeams.length > 1) winners = winners.slice();
      this._pushEvent({ kind: "info", text: label });
      this._finish(bestTeams.length > 1 ? [] : winners, bestTeams.length > 1 ? "draw" : "material");
    }

    _advance() {
      const prev = this.current;
      // décompte du gel des pièces de celui qui vient de jouer
      this.pieces.forEach((p) => { if (p.owner === prev && p.alive && p.frozen > 0) p.frozen--; });
      this.quietTurns = this.quietTurns < 0 ? 0 : this.quietTurns + 1;
      if (this.quietTurns >= QUIET_TURNS_PER_PLAYER * Math.max(2, this.alivePlayers().length)) {
        this._finishByMaterial("🥱 Les armées se regardent en chiens de faïence depuis trop longtemps. On compte les points.");
        return;
      }
      let idx = prev;
      let guard = 0;
      do { idx = (idx + 1) % this.n; guard++; } while (this.players[idx].eliminated && guard <= this.n + 1);
      if (idx <= prev) {
        this.round++;
        if (this.tempFog > 0) this.tempFog--;
        if (this.round > MAX_ROUNDS) { this._finishByMaterial("⏳ Le temps de la bataille est écoulé. On compte les points."); return; }
        this.current = idx;
        this.turn++;
        if (this.settings.chaos && this.round % this.settings.chaosEvery === 0) this._chaos();
      } else {
        this.current = idx;
        this.turn++;
      }
      this._beginTurn();
    }

    _beginTurn() {
      let guard = 0;
      while (this.phase === "playing" && guard++ < 12) {
        const pl = this.players[this.current];
        this.turnPowerUsed = false;
        if (this.settings.mode === "conquest") {
          let gain = 0;
          this.relics.forEach(({ r, c }) => { const o = this.grid[r][c]; if (o && o.owner === this.current) gain++; });
          if (gain) {
            pl.score += gain;
            this._pushEvent({ kind: "relic", owner: this.current, gain, score: pl.score, cells: [], text: `🏆 ${pl.name} marque ${gain} point${gain > 1 ? "s" : ""} de reliques (${pl.score}/${this.settings.relicTarget}).` });
            if (pl.score >= this.settings.relicTarget) {
              const winners = this.players.filter((p) => p.team === pl.team && !p.eliminated).map((p) => p.seat);
              this._finish(winners, "relics");
              return;
            }
          }
        }
        if (!this.hasLegalMove(this.current)) {
          this._eliminate(this.current, "Plus aucune pièce ne peut bouger, c'est la déroute.", null);
          if (this._checkLastStanding()) return;
          // passe au suivant sans compter comme tour calme
          let idx = this.current; let g2 = 0;
          do { idx = (idx + 1) % this.n; g2++; } while (this.players[idx].eliminated && g2 <= this.n + 1);
          if (idx <= this.current) this.round++;
          this.current = idx; this.turn++;
          continue;
        }
        this._pushEvent({ kind: "turn", player: this.current, cells: [], text: "" });
        this._bump();
        return;
      }
    }

    // ---------- chaos ----------
    _connectedNow() {
      let start = null; let total = 0;
      for (let r = 0; r < this.board.rows; r++) for (let c = 0; c < this.board.cols; c++) {
        if (this.passable(r, c)) { total++; if (!start) start = [r, c]; }
      }
      if (!start) return false;
      const seen = new Set([K(start[0], start[1])]);
      const q = [start];
      while (q.length) {
        const [r, c] = q.pop();
        DIRS.forEach(([dr, dc]) => {
          const nr = r + dr, nc = c + dc;
          if (!this.passable(nr, nc) || seen.has(K(nr, nc))) return;
          seen.add(K(nr, nc)); q.push([nr, nc]);
        });
      }
      return seen.size === total;
    }

    _chaos() {
      const pool = Object.keys(CHAOS_EVENTS).filter((k) => k !== this.lastChaos);
      const id = pool[Math.floor(this.rng() * pool.length)];
      const ev = CHAOS_EVENTS[id];
      const isRelic = (r, c) => this.relics.some((x) => x.r === r && x.c === c);
      const neutralFree = () => this.board.neutral.filter(([r, c]) => this.terrain[r][c] === "plain" && !this.grid[r][c] && !this.ruins.has(K(r, c)) && !isRelic(r, c));
      let cells = [];
      let kind = id;
      if (id === "boue") {
        const free = Boards.shuffle(neutralFree(), this.rng).slice(0, 3);
        free.forEach(([r, c]) => { this.terrain[r][c] = "marsh"; cells.push({ r, c }); });
        if (!free.length) kind = "melange";
      }
      if (kind === "tarte") {
        const free = Boards.shuffle(neutralFree(), this.rng);
        let done = false;
        for (const [r, c] of free.slice(0, 12)) {
          this.ruins.add(K(r, c));
          if (this._connectedNow()) { cells.push({ r, c }); done = true; break; }
          this.ruins.delete(K(r, c));
        }
        if (!done) kind = "melange";
      }
      if (kind === "pont") {
        const lakes = this.board.neutral.filter(([r, c]) => this.terrain[r][c] === "lake");
        if (lakes.length) { const [r, c] = lakes[Math.floor(this.rng() * lakes.length)]; this.terrain[r][c] = "plain"; cells.push({ r, c }); }
        else kind = "melange";
      }
      if (kind === "fete" && !this.settings.powers) kind = "melange";
      if (kind === "melange") {
        const cands = this.pieces.filter((p) => p.alive && PIECES[p.type].mobile && !(this.settings.mode === "kinghunt" && p.type === "roi"));
        Boards.shuffle(cands, this.rng);
        let a = cands[0], b = null;
        if (a) b = cands.find((x) => x !== a && x.owner !== a.owner);
        if (a && b) {
          const ca = { r: a.r, c: a.c }, cb = { r: b.r, c: b.c };
          this.grid[ca.r][ca.c] = b; this.grid[cb.r][cb.c] = a;
          a.r = cb.r; a.c = cb.c; b.r = ca.r; b.c = ca.c; a.hist = []; b.hist = [];
          cells = [ca, cb];
        }
      }
      if (kind === "fete") {
        this.players.forEach((p) => { if (!p.eliminated) p.charges = Math.min(3, p.charges + 1); });
      }
      if (kind === "brouillard") this.tempFog = 1;
      const shown = CHAOS_EVENTS[kind];
      this.lastChaos = kind;
      this._pushEvent({ kind: "chaos", chaos: kind, cells: [], visibleCells: cells, text: `${shown.icon} ${shown.name} ! ${shown.text}` });
    }

    // ---------- état filtré ----------
    knows(viewerPi, p) {
      if (this.phase === "finished") return true;
      const vt = this.players[viewerPi].team;
      if (this.players[p.owner].team === vt) return true;
      if (p.revealedAll) return true;
      for (const q of p.revealedTo) { if (this.players[q] && this.players[q].team === vt) return true; }
      return false;
    }

    _eventVisible(viewerPi, ev, vis) {
      if (ev.private && !(ev.private.includes(viewerPi) || (ev.privateTeam != null && this.players[viewerPi].team === ev.privateTeam))) {
        // version publique de l'évènement privé
        return "public";
      }
      if (!ev.fog || !vis) return true;
      if (!ev.cells || !ev.cells.length) return true;
      return ev.cells.some(({ r, c }) => vis.has(K(r, c)));
    }

    getStateFor(pi) {
      const viewer = pi >= 0 ? pi : 0;
      const fog = this.phase === "playing" && this.fogActive();
      const vis = fog ? this.visibleCells(viewer) : null;
      const pieces = [];
      this.pieces.forEach((p) => {
        if (!p.alive) return;
        const mine = this.players[p.owner].team === this.players[viewer].team;
        if (fog && !mine && !vis.has(K(p.r, p.c))) return;
        const known = this.knows(viewer, p);
        pieces.push({
          id: p.id, owner: p.owner, r: p.r, c: p.c, moved: p.moved, frozen: p.frozen,
          type: known ? p.type : null,
          secret: known && !mine && !p.revealedAll && this.phase !== "finished", // connu par un pouvoir
          unknown: !known,
        });
      });
      const events = [];
      const visibleSeqs = new Set();
      this.events.slice(-120).forEach((ev) => {
        const v = this._eventVisible(viewer, ev, vis);
        if (v === true) {
          visibleSeqs.add(ev.seq);
          events.push(this._clientEvent(ev, viewer, true));
        } else if (v === "public") {
          visibleSeqs.add(ev.seq);
          events.push(this._clientEvent(ev, viewer, false));
        } else if (ev.kind === "combat") {
          events.push({ seq: ev.seq, kind: "fogcombat", round: ev.round, text: "⚔️ Un combat éclate quelque part dans la brume..." });
        }
      });
      const graveyard = this.graveyard.filter((g) => !fog || visibleSeqs.has(g.evSeq) || this.players[g.owner].team === this.players[viewer].team).map((g) => {
        const hide = g.hideTeams && this.phase !== "finished" && !g.hideTeams.includes(this.players[viewer].team);
        return { id: g.id, owner: g.owner, type: hide ? null : g.type };
      });
      const legal = {};
      if (this.phase === "playing" && this.current === pi) {
        this.myPieces(pi).forEach((p) => {
          const m = this._movesFor(p);
          if (m.length) legal[p.id] = m;
        });
      }
      const me = this.players[viewer];
      const mySetupCells = this.phase === "setup" && pi >= 0 ? this.board.arms[pi].cells : null;
      return {
        phase: this.phase,
        settings: this.settings,
        you: pi,
        board: {
          kind: this.board.kind, rows: this.board.rows, cols: this.board.cols, terrain: this.terrain,
          ruins: [...this.ruins].map((s) => s.split(",").map(Number)),
          relics: this.relics,
          arms: this.board.arms.map((a) => ({ seat: a.seat, side: a.side, cells: a.cells })),
          sides: this.board.sides,
        },
        players: this.players.map((p, i) => ({
          seat: i, id: p.id, name: p.name, house: p.house, isAI: p.isAI, level: p.level, team: p.team,
          eliminated: p.eliminated, ready: p.ready, charges: p.charges, score: p.score, bonus: p.bonus,
          alive: fog && p.team !== me.team ? null : this.pieces.filter((x) => x.owner === i && x.alive).length,
        })),
        current: this.current, round: this.round, turn: this.turn,
        pieces, graveyard, events, legal,
        armyCounts: this.armyBy[viewer] || this.armyCounts,
        armyCountsBy: this.players.map((_, i) => (this._compVisible(viewer, i) ? this.armyBy[i] : null)),
        compose: this.phase === "compose" ? {
          budget: this.settings.armyBudget, size: this.armSize,
          mine: this.comp[viewer].counts,
          ready: this.players.map((q) => q.ready),
        } : null,
        mySetupCells,
        turnPowerUsed: this.turnPowerUsed,
        fogActive: fog, fogRadius: this.fogRadius(),
        visible: fog ? [...vis] : null,
        winners: this.winners, endReason: this.endReason,
        stats: this.phase === "finished" ? this.finalStats() : null,
        maxRounds: MAX_ROUNDS,
        version: this.version,
      };
    }

    _compVisible(viewer, owner) {
      if (this.phase === "compose") return false;
      if (!this.customMode) return true;
      return this.settings.compReveal || this.phase === "finished" || this.players[owner].team === this.players[viewer].team;
    }

    _clientEvent(ev, viewer, full) {
      const out = { seq: ev.seq, kind: ev.kind, round: ev.round, text: ev.text };
      if (ev.hideBomb && this.phase !== "finished" && !ev.hideBomb.teams.includes(this.players[viewer].team)) {
        // une tarte reste une pièce cachée pour ceux qui n'étaient pas dans le combat
        out.text = ev.hiddenView.text;
        out.result = ev.hiddenView.result;
        out.attacker = ev.attacker;
        out.defender = Object.assign({}, ev.defender, { type: null });
        return out;
      }
      switch (ev.kind) {
        case "move": out.owner = ev.owner; out.pieceId = ev.pieceId; out.from = ev.from; out.to = ev.to; break;
        case "combat":
          out.result = ev.result; out.attacker = ev.attacker; out.defender = ev.defender; break;
        case "power":
          out.power = ev.power; out.owner = ev.owner;
          if (ev.power === "theatre") out.swap = ev.swap;
          if (ev.power === "sieste") out.target = ev.target;
          if (ev.power === "longuevue") { if (full) out.target = ev.target; }
          break;
        case "chaos": out.chaos = ev.chaos; out.cells = ev.visibleCells; break;
        case "elim": out.player = ev.player; break;
        case "relic": out.owner = ev.owner; out.gain = ev.gain; out.score = ev.score; break;
        case "turn": out.player = ev.player; break;
        case "end": out.winners = ev.winners; break;
      }
      return out;
    }

    finalStats() {
      const awards = [];
      const pl = this.players;
      const best = (fn, min = 1) => {
        let b = null; let bv = -1;
        pl.forEach((p, i) => { const v = fn(p); if (v > bv) { bv = v; b = i; } });
        return bv >= min ? { seat: b, value: bv } : null;
      };
      const a1 = best((p) => p.stats.kills, 1); if (a1) awards.push({ icon: "🪓", title: "Le Boucher", seat: a1.seat, text: `${a1.value} pièce${a1.value > 1 ? "s" : ""} ennemie${a1.value > 1 ? "s" : ""} envoyée${a1.value > 1 ? "s" : ""} au tapis` });
      const a2 = best((p) => p.stats.lost, 1); if (a2) awards.push({ icon: "🪂", title: "Le Kamikaze", seat: a2.seat, text: `${a2.value} attaque${a2.value > 1 ? "s" : ""} perdue${a2.value > 1 ? "s" : ""}, mais avec panache` });
      const a3 = best((p) => p.stats.defused, 1); if (a3) awards.push({ icon: "⛏️", title: "Le Pâtissier Démineur", seat: a3.seat, text: `${a3.value} tarte${a3.value > 1 ? "s" : ""} désamorcée${a3.value > 1 ? "s" : ""}` });
      const a4 = best((p) => p.stats.exploded, 1); if (a4) awards.push({ icon: "🥧", title: "Le Maître Tartier", seat: a4.seat, text: `${a4.value} attaquant${a4.value > 1 ? "s" : ""} explosé${a4.value > 1 ? "s" : ""} sur ses tartes` });
      const a5 = best((p) => p.stats.kingsSlain, 1); if (a5) awards.push({ icon: "🐀", title: "Le Régicide", seat: a5.seat, text: "A fait tomber un roi grâce à un petit rat" });
      const a6 = best((p) => p.stats.cells, 1); if (a6) awards.push({ icon: "👟", title: "Le Grand Voyageur", seat: a6.seat, text: `${a6.value} cases parcourues` });
      const a7 = best((p) => p.stats.powers, 1); if (a7) awards.push({ icon: "✨", title: "Le Magicien du Dimanche", seat: a7.seat, text: `${a7.value} pouvoir${a7.value > 1 ? "s" : ""} de maison utilisé${a7.value > 1 ? "s" : ""}` });
      const lazy = pl.map((p, i) => ({ i, v: p.stats.attacks })).sort((a, b) => a.v - b.v)[0];
      if (lazy && pl.length > 1) awards.push({ icon: "🐌", title: "Le Pacifiste", seat: lazy.i, text: `Seulement ${lazy.v} attaque${lazy.v > 1 ? "s" : ""} de la partie` });
      return { awards, perPlayer: pl.map((p) => ({ seat: p.seat, moves: p.stats.moves, attacks: p.stats.attacks, kills: p.stats.kills, lost: p.stats.lost, score: p.score })), rounds: this.round, turns: this.turn };
    }

    // Coup raisonnable pour un joueur absent (minuteur écoulé).
    randomLegalMove(pi) {
      const all = this.legalMoves(pi);
      if (!all.length) return null;
      const attacks = all.filter((m) => m.attack);
      const pickFrom = (arr) => arr[Math.floor(this.rng() * arr.length)];
      // préfère avancer sans attaquer à l'aveugle, sauf si c'est le seul choix
      const calm = all.filter((m) => !m.attack);
      return calm.length ? pickFrom(calm) : pickFrom(attacks);
    }
  }

  return { GoliathEngine, MAX_ROUNDS };
});
