// ============================================================
// Plateau : rendu, rotation vers le joueur, pièces, animations
// ============================================================
(function () {
  const { $, el } = UI;
  const { PIECES, HOUSES } = GoliathPieces;
  const K = (r, c) => r + "," + c;

  let boardEl, fxEl, wrapEl, zoneEl;
  let onCellClick = null;
  let onPieceHover = null;
  let cell = 40;
  let sig = "";
  let tiles = {};          // "vr,vc" -> element
  let pieceEls = new Map(); // id -> element
  let vt = null;            // transformation courante
  let inv = {};             // "vr,vc" -> {r,c}
  let current = null;       // dernier état rendu
  const locks = new Map();  // id -> timestamp de fin
  let speed = 1;

  function init(opts) {
    onCellClick = opts.onCell;
    onPieceHover = opts.onHover;
    boardEl = $("#board"); fxEl = $("#board-fx"); wrapEl = $("#board-wrap"); zoneEl = $("#board-zone");
    boardEl.addEventListener("click", (e) => {
      const rect = boardEl.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const vc = Math.floor(x / cell), vr = Math.floor(y / cell);
      const g = inv[K(vr, vc)];
      if (g && onCellClick) onCellClick(g.r, g.c, e);
    });
    boardEl.addEventListener("mousemove", (e) => {
      if (!onPieceHover) return;
      const rect = boardEl.getBoundingClientRect();
      const vc = Math.floor((e.clientX - rect.left) / cell), vr = Math.floor((e.clientY - rect.top) / cell);
      const g = inv[K(vr, vc)];
      onPieceHover(g ? g : null);
    });
    boardEl.addEventListener("mouseleave", () => { if (onPieceHover) onPieceHover(null); });
    if (window.ResizeObserver) new ResizeObserver(() => { if (current) relayout(); }).observe(zoneEl);
    window.addEventListener("resize", () => { if (current) relayout(); });
  }

  function setSpeed(s) { speed = s; document.body.classList.toggle("slow-mode", s > 1); }

  function mySide(state) {
    const arm = state.board.arms[state.you];
    return arm ? arm.side : "bottom";
  }

  function computeCell(state) {
    const W = zoneEl.clientWidth, H = zoneEl.clientHeight;
    const rows = vt.rows, cols = vt.cols;
    const pad = window.innerWidth < 700 ? 22 : 44;
    const c = Math.floor(Math.min((W - pad) / cols, (H - pad - 22) / rows));
    return Math.max(18, Math.min(68, c || 30));
  }

  function posOf(vr, vc) { return { x: vc * cell, y: vr * cell }; }

  function buildTiles(state) {
    boardEl.innerHTML = "";
    tiles = {}; inv = {};
    const b = state.board;
    boardEl.style.width = vt.cols * cell + "px";
    boardEl.style.height = vt.rows * cell + "px";
    const armOwner = {};
    b.arms.forEach((arm) => arm.cells.forEach(([r, c]) => { armOwner[K(r, c)] = arm.seat; }));
    const relics = new Set((b.relics || []).map((x) => K(x.r, x.c)));
    const ruins = new Set((b.ruins || []).map((x) => K(x[0], x[1])));
    const layer = el("div", { class: "layer layer--tiles" });
    for (let r = 0; r < b.rows; r++) for (let c = 0; c < b.cols; c++) {
      const t = b.terrain[r][c];
      if (t === "void") continue;
      const v = vt.map(r, c);
      inv[K(v.r, v.c)] = { r, c };
      const k = K(r, c);
      const cls = ["tile", "tile--" + t];
      if ((r + c) % 2) cls.push("tile--alt");
      if (ruins.has(k)) cls.push("tile--ruin");
      const owner = armOwner[k];
      const d = el("div", { class: cls.join(" ") });
      if (owner !== undefined) {
        const pl = state.players[owner];
        const h = HOUSES[pl.house % HOUSES.length];
        d.classList.add("tile--arm");
        d.style.setProperty("--armc", h.color);
        d.dataset.seat = owner;
      }
      if (relics.has(k)) d.appendChild(el("span", { class: "tile__relic", text: "🏆" }));
      if (t === "forest") d.appendChild(el("span", { class: "tile__deco", text: "🌲" }));
      if (t === "marsh") d.appendChild(el("span", { class: "tile__deco", text: "🫧" }));
      if (t === "lake") d.appendChild(el("span", { class: "tile__deco tile__deco--wave", text: "〰️" }));
      if (ruins.has(k)) d.appendChild(el("span", { class: "tile__deco", text: "🪨" }));
      const p = posOf(v.r, v.c);
      d.style.cssText += `;left:${p.x}px;top:${p.y}px;width:${cell}px;height:${cell}px;font-size:${Math.round(cell * 0.5)}px`;
      layer.appendChild(d);
      tiles[K(v.r, v.c)] = d;
    }
    // filigranes de maison au centre de chaque camp
    b.arms.forEach((arm) => {
      const pl = state.players[arm.seat];
      const h = HOUSES[pl.house % HOUSES.length];
      let sx = 0, sy = 0;
      arm.cells.forEach(([r, c]) => { const v = vt.map(r, c); sx += v.c; sy += v.r; });
      const n = arm.cells.length;
      const w = el("div", { class: "arm-mark", text: h.icon, dataset: { seat: arm.seat } });
      w.style.left = (sx / n + 0.5) * cell + "px"; w.style.top = (sy / n + 0.5) * cell + "px"; w.style.fontSize = cell * 1.8 + "px";
      layer.appendChild(w);
    });
    boardEl.appendChild(layer);
    boardEl.appendChild(el("div", { class: "layer layer--marks", id: "layer-marks" }));
    boardEl.appendChild(el("div", { class: "layer layer--pieces", id: "layer-pieces" }));
    pieceEls = new Map();
    fxEl.style.width = vt.cols * cell + "px"; fxEl.style.height = vt.rows * cell + "px";
  }

  function relayout() {
    sig = ""; // force
    render(current.view);
  }

  function makePieceEl(owner, type, state, opts) {
    opts = opts || {};
    const pl = state.players[owner];
    const h = HOUSES[pl.house % HOUSES.length];
    const d = type ? PIECES[type] : null;
    const e = el("div", { class: "piece" + (opts.mine ? " piece--mine" : " piece--enemy"), style: { "--hc": h.color, "--hd": h.dark, "--hl": h.light } }, [
      el("div", { class: "piece__inner" }, [
        el("div", { class: "piece__face piece__front" }, [
          el("span", { class: "piece__ico", text: d ? d.icon : "" }),
          el("span", { class: "piece__rank", text: d ? (d.bomb ? "💣" : d.id === "oeuf" ? "" : String(d.rank)) : "" }),
        ]),
        el("div", { class: "piece__face piece__back" }, [el("span", { class: "piece__emblem", text: h.icon }), el("span", { class: "piece__q", text: "?" })]),
      ]),
      el("span", { class: "piece__sleep", text: "💤" }),
      el("span", { class: "piece__eye", text: "👁️" }),
    ]);
    e.style.width = e.style.height = Math.round(cell * 0.88) + "px";
    e.style.fontSize = Math.round(cell * 0.5) + "px";
    return e;
  }

  function setPieceFace(e, type) {
    const d = type ? PIECES[type] : null;
    const ico = e.querySelector(".piece__ico"), rk = e.querySelector(".piece__rank");
    if (ico.textContent !== (d ? d.icon : "")) ico.textContent = d ? d.icon : "";
    const rt = d ? (d.bomb ? "💣" : d.id === "oeuf" ? "" : String(d.rank)) : "";
    if (rk.textContent !== rt) rk.textContent = rt;
    e.classList.toggle("is-up", !!d);
    e.dataset.type = type || "";
  }

  function placeEl(e, vr, vc) {
    const off = (cell - Math.round(cell * 0.88)) / 2;
    e.style.transform = `translate(${vc * cell + off}px, ${vr * cell + off}px)`;
  }

  function render(view) {
    const state = view.state;
    const newSig = [state.board.rows, state.board.cols, mySide(state), JSON.stringify(state.board.terrain), state.board.ruins.length, state.players.map((p) => p.house).join(""), state.board.relics.length].join("|");
    vt = GoliathBoards.viewTransform(state.board, mySide(state));
    const newCell = computeCell(state);
    current = { view, state };
    if (newSig !== sig || newCell !== cell) {
      cell = newCell; sig = newSig;
      buildTiles(state);
      wrapEl.style.setProperty("--cell", cell + "px");
    }
    renderPieces(view);
    renderMarks(view);
    // état du plateau
    const cur = state.players[state.current];
    wrapEl.classList.toggle("is-myturn", state.phase === "playing" && state.current === state.you);
    if (cur) { const h = HOUSES[cur.house % HOUSES.length]; wrapEl.style.setProperty("--turnc", h.color); }
    wrapEl.classList.toggle("is-fog", !!state.fogActive);
    wrapEl.classList.toggle("is-setup", state.phase === "setup");
    $$arms(state);
  }

  function $$arms(state) {
    UI.$$(".arm-mark", boardEl).forEach((m) => {
      const seat = +m.dataset.seat;
      m.classList.toggle("arm-mark--turn", state.phase === "playing" && state.current === seat);
      m.classList.toggle("arm-mark--dead", !!state.players[seat].eliminated);
    });
    UI.$$(".tile--arm", boardEl).forEach((t) => t.classList.toggle("tile--dead", !!state.players[+t.dataset.seat].eliminated));
  }

  function renderPieces(view) {
    const state = view.state;
    const layer = $("#layer-pieces");
    const seen = new Set();
    const now = Date.now();
    state.pieces.forEach((p) => {
      seen.add(p.id);
      const v = vt.map(p.r, p.c);
      let e = pieceEls.get(p.id);
      const mine = state.players[p.owner].team === state.players[state.you].team;
      if (!e) {
        e = makePieceEl(p.owner, p.type, state, { mine });
        e.dataset.id = p.id;
        e.style.transition = "none";
        placeEl(e, v.r, v.c);
        layer.appendChild(e);
        pieceEls.set(p.id, e);
        void e.offsetWidth;
        e.style.transition = "";
        e.classList.add("piece--pop");
      } else {
        const off = (cell - Math.round(cell * 0.88)) / 2;
        e.style.width = e.style.height = Math.round(cell * 0.88) + "px";
        e.style.fontSize = Math.round(cell * 0.5) + "px";
        placeEl(e, v.r, v.c);
      }
      setPieceFace(e, p.type);
      e.classList.toggle("piece--mine", mine);
      e.classList.toggle("piece--enemy", !mine);
      e.classList.toggle("is-sleep", p.frozen > 0);
      e.classList.toggle("is-secret", !!p.secret);
      e.classList.toggle("is-moved", !!p.moved);
      e.classList.toggle("is-selected", view.selectedId === p.id);
      e.classList.toggle("is-target", !!(view.targetIds && view.targetIds.has(p.id)));
      e.classList.toggle("is-picked", !!(view.pickedIds && view.pickedIds.has(p.id)));
      const lockEnd = locks.get(p.id);
      e.classList.toggle("piece--locked", !!(lockEnd && lockEnd > now));
      e.style.zIndex = view.selectedId === p.id ? 6 : 3;
      e.style.pointerEvents = "none";
    });
    pieceEls.forEach((e, id) => {
      if (!seen.has(id)) { e.classList.add("piece--gone"); pieceEls.delete(id); setTimeout(() => e.remove(), 300); }
    });
  }

  function mark(layer, vr, vc, cls, text) {
    const m = el("div", { class: "mark " + cls });
    m.style.cssText += `;left:${vc * cell}px;top:${vr * cell}px;width:${cell}px;height:${cell}px;font-size:${Math.round(cell * 0.4)}px`;
    if (text) m.textContent = text;
    layer.appendChild(m);
    return m;
  }

  function renderMarks(view) {
    const state = view.state;
    const layer = $("#layer-marks");
    layer.innerHTML = "";
    const set = (cells, cls, text) => (cells || []).forEach(([r, c]) => { const v = vt.map(r, c); mark(layer, v.r, v.c, cls, text); });
    // brouillard
    if (state.fogActive && state.visible) {
      const vis = new Set(state.visible);
      for (let r = 0; r < state.board.rows; r++) for (let c = 0; c < state.board.cols; c++) {
        if (state.board.terrain[r][c] === "void") continue;
        if (!vis.has(K(r, c))) { const v = vt.map(r, c); mark(layer, v.r, v.c, "mark--fog"); }
      }
    }
    // dernier coup
    (view.lastMoves || []).forEach((m) => {
      const h = HOUSES[state.players[m.seat].house % HOUSES.length];
      [m.from, m.to].forEach((x, i) => {
        const v = vt.map(x.r, x.c);
        const mk = mark(layer, v.r, v.c, "mark--lm " + (i === 0 ? "mark--lm-from" : "mark--lm-to") + (m.latest ? " mark--lm-latest" : ""), i === 0 ? "" : "");
        mk.style.setProperty("--lc", h.color);
        mk.style.setProperty("--ld", h.dark);
      });
    });
    // placement : mon camp
    if (state.phase === "setup" && state.mySetupCells) {
      set(state.mySetupCells, "mark--setup");
      if (view.setupSelected) set([view.setupSelected], "mark--select");
    }
    if (view.marks) view.marks.forEach((m) => { const v = vt.map(m.r, m.c); mark(layer, v.r, v.c, "mark--" + m.kind, m.text); });
  }

  // ---------- animations ----------
  function cellCenterPx(r, c) { const v = vt.map(r, c); return { x: v.c * cell, y: v.r * cell }; }

  function lockPieces(ids, ms) { const end = Date.now() + ms; ids.forEach((id) => locks.set(id, end)); }

  function ghost(owner, type, r, c, state, mine) {
    const g = makePieceEl(owner, type, state, { mine });
    g.classList.add("piece--ghost");
    g.style.transition = "none";
    const v = vt.map(r, c);
    placeEl(g, v.r, v.c);
    fxEl.appendChild(g);
    void g.offsetWidth;
    g.style.transition = `transform ${0.26 * speed}s ease-in-out`;
    setPieceFace(g, null);
    return g;
  }

  function puff(r, c, text, cls) {
    const v = vt.map(r, c);
    const p = el("div", { class: "puff " + (cls || ""), text });
    p.style.left = v.c * cell + "px"; p.style.top = v.r * cell + "px"; p.style.width = cell + "px"; p.style.height = cell + "px"; p.style.fontSize = Math.round(cell * 0.8) + "px";
    fxEl.appendChild(p);
    setTimeout(() => p.remove(), 1400 * speed);
  }

  // Duel : les deux pièces se retournent, puis le perdant disparaît.
  function playCombat(ev, state) {
    if (!vt) return 0;
    const a = ev.attacker, d = ev.defender;
    const mineA = state.players[a.owner].team === state.players[state.you].team;
    const mineD = state.players[d.owner].team === state.players[state.you].team;
    const total = Math.round(1700 * speed);
    const ga = ghost(a.owner, a.type, a.from.r, a.from.c, state, mineA);
    const gd = ghost(d.owner, d.type, d.at.r, d.at.c, state, mineD);
    const T = (ms, fn) => setTimeout(fn, ms * speed);
    // glisse vers la case du défenseur
    T(60, () => {
      const v = vt.map(d.at.r, d.at.c), vf = vt.map(a.from.r, a.from.c);
      const dx = (vf.c - v.c) * cell * 0.45, dy = (vf.r - v.r) * cell * 0.45;
      const off = (cell - Math.round(cell * 0.88)) / 2;
      ga.style.transform = `translate(${v.c * cell + off + dx}px, ${v.r * cell + off + dy}px)`;
    });
    T(380, () => {
      setPieceFace(ga, a.type);
      if (d.type) setPieceFace(gd, d.type);
      UI.Sound[ev.result === "exploded" ? "boom" : "clash"]();
      puff(d.at.r, d.at.c, ev.result === "exploded" ? "💥" : "✨", "puff--hit");
    });
    T(1050, () => {
      const loseA = ["exploded", "defWins", "ratGuard", "tie"].includes(ev.result);
      const loseD = ["defused", "flag", "ratKing", "attWins", "tie"].includes(ev.result);
      if (loseA) ga.classList.add("piece--dying");
      if (loseD) gd.classList.add("piece--dying");
      if (ev.result === "defused") puff(d.at.r, d.at.c, "🔧", "puff--small");
    });
    T(1650, () => { ga.remove(); gd.remove(); });
    lockPieces([a.id, d.id], total);
    setTimeout(() => { if (current) renderPieces(current.view); }, total + 30);
    return total;
  }

  function playPower(ev, state) {
    if (!vt) return;
    if (ev.power === "theatre" && ev.swap) ev.swap.forEach((x) => puff(x.r, x.c, "🎭", "puff--small"));
    if (ev.power === "sieste" && ev.target) puff(ev.target.r, ev.target.c, "😴", "puff--small");
    if (ev.power === "longuevue" && ev.target) puff(ev.target.r, ev.target.c, "🔭", "puff--small");
    UI.Sound.power();
  }

  function playChaos(ev) {
    wrapEl.classList.remove("shake"); void wrapEl.offsetWidth; wrapEl.classList.add("shake");
    (ev.cells || []).forEach((x) => puff(x.r, x.c, "🌀", "puff--small"));
    UI.Sound.chaos();
  }

  function pixelOfPiece(id) {
    const e = pieceEls.get(id); return e ? e : null;
  }

  window.Board = { init, render, playCombat, playPower, playChaos, lockPieces, setSpeed, puff, pixelOfPiece, relayout: () => { if (current) relayout(); } };
})();
