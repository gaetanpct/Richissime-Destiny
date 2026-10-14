// ============================================================
// Écran de partie : placement, tours, pouvoirs, animations, fin
// ============================================================
(function () {
  const { $, el, esc } = UI;
  const { PIECES, ORDER, HOUSES, CHAOS_EVENTS } = GoliathPieces;
  const AI = GoliathAI;
  const K = (r, c) => r + "," + c;

  let socket = null;
  let st = null;            // dernier état reçu
  let selectedId = null;
  let setupSelected = null;
  let power = null;         // {kind, picks:[]} pendant le ciblage d'un pouvoir
  let lastSeq = -1;
  let lastCells = null;
  let busy = false;
  let clockOffset = 0;
  let timerHandle = null;
  let hoverCell = null;
  let endShown = false;
  let endDismissed = false;
  let lastTurnKey = "";
  let bannerTimer = null;
  let isHostFn = () => false;

  function init(sock, hostFn) {
    socket = sock;
    isHostFn = hostFn || isHostFn;
    Board.init({ onCell: onCell, onHover: onHover });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { cancelAll(); renderAll(); } });
    $("#duel-banner").addEventListener("click", () => $("#duel-banner").classList.add("hidden"));
    $("#btn-end-view").addEventListener("click", () => { endDismissed = true; $("#end-overlay").classList.add("hidden"); renderAll(); });
    $("#btn-end-lobby").addEventListener("click", () => socket.emit("room:backToLobby"));
    $("#btn-end-quit").addEventListener("click", () => window.App.leaveRoom());
    if (timerHandle) clearInterval(timerHandle);
    timerHandle = setInterval(tickTimer, 250);
  }

  function reset() {
    st = null; selectedId = null; setupSelected = null; power = null; lastSeq = -1; lastCells = null; busy = false;
    endShown = false; endDismissed = false; lastTurnKey = "";
    $("#end-overlay").classList.add("hidden");
    $("#duel-banner").classList.add("hidden");
    $("#chaos-banner").classList.add("hidden");
    $("#compose-overlay").classList.add("hidden");
    clearTimeout(bannerTimer);
  }

  const me = () => (st ? st.players[st.you] : null);
  const houseOf = (seat) => HOUSES[st.players[seat].house % HOUSES.length];
  const isMyTurn = () => st && st.phase === "playing" && st.current === st.you && !st.players[st.you].eliminated;
  const myTeam = () => st.players[st.you].team;
  const isMine = (p) => st.players[p.owner].team === myTeam();
  const pieceAt = (r, c) => st.pieces.find((p) => p.r === r && p.c === c) || null;
  function cancelAll() { selectedId = null; setupSelected = null; power = null; }

  // ---------- réception d'un état ----------
  function onState(state) {
    const first = !st;
    const prevPhase = st ? st.phase : null;
    st = state;
    busy = false;
    clockOffset = Date.now() - (state.serverTime || Date.now());
    Board.setSpeed(state.settings.slowMode ? 1.7 : 1);
    if (first) lastSeq = Math.max(0, ...state.events.map((e) => e.seq)) - 0;

    // validation de la sélection
    if (selectedId && !st.pieces.some((p) => p.id === selectedId)) selectedId = null;
    if (selectedId && !(st.legal && st.legal[selectedId]) && isMyTurn()) { /* pièce bloquée : on garde pour info */ }
    if (!isMyTurn()) { power = null; if (st.phase === "playing") selectedId = selectedId && !isMyPieceId(selectedId) ? selectedId : null; }
    if (st.phase !== "setup") setupSelected = null;

    // nouveaux évènements
    const fresh = state.events.filter((e) => e.seq > lastSeq);
    if (!first) processEvents(fresh); else if (state.phase === "setup") { /* rien à rejouer */ }
    if (state.events.length) lastSeq = Math.max(lastSeq, ...state.events.map((e) => e.seq));

    // nouveau tour pour moi
    const key = state.turn + ":" + state.current + ":" + state.phase;
    if (state.phase === "playing" && key !== lastTurnKey) {
      lastTurnKey = key;
      if (state.current === state.you && !first) { UI.Sound.turn(); }
    }
    renderAll();
    if (state.phase === "finished" && !endShown) { endShown = true; showEnd(); }
    if (state.phase !== "finished") { endShown = false; endDismissed = false; $("#end-overlay").classList.add("hidden"); }
  }

  function isMyPieceId(id) { const p = st.pieces.find((x) => x.id === id); return !!p && isMine(p); }

  function processEvents(events) {
    events.forEach((ev) => {
      if (ev.kind === "move") {
        lastCells = [ev.from, ev.to];
        if (ev.owner !== st.you) UI.Sound.move(); else UI.Sound.move();
      } else if (ev.kind === "combat") {
        lastCells = [ev.attacker.from, ev.defender.at];
        Board.playCombat(ev, st);
        showDuel(ev);
      } else if (ev.kind === "power") {
        Board.playPower(ev, st);
        if (ev.power === "longuevue" && ev.target && ev.owner === st.you) UI.toast("🔭 Pièce dévoilée, regarde bien le plateau !", "ok");
      } else if (ev.kind === "chaos") {
        Board.playChaos(ev);
        showChaos(ev);
      } else if (ev.kind === "elim") {
        UI.toast(ev.text, ev.player === st.you ? "error" : "info");
        if (ev.player === st.you) UI.Sound.defeat();
      } else if (ev.kind === "relic") {
        if (ev.owner === st.you) UI.toast("🏆 +" + ev.gain + " point de relique", "ok");
      }
    });
  }

  function tokenHtml(owner, type, hidden) {
    const h = houseOf(owner);
    const d = type ? PIECES[type] : null;
    return `<span class="mini-token ${hidden || !d ? "is-hidden" : ""}" style="--hc:${h.color};--hd:${h.dark}"><span>${hidden || !d ? h.icon : d.icon}</span>${d && !hidden ? `<i>${d.bomb ? "💣" : d.id === "oeuf" ? "" : d.rank}</i>` : ""}</span>`;
  }

  function showDuel(ev) {
    const b = $("#duel-banner");
    const a = ev.attacker, d = ev.defender;
    const nameA = st.players[a.owner].name, nameD = st.players[d.owner].name;
    const dName = d.type ? PIECES[d.type].name : "Pièce cachée";
    const aName = PIECES[a.type].name;
    const slow = st.settings.slowMode ? 1.7 : 1;
    const keep = Number(st.settings.duelTime);
    b.innerHTML = `
      <div class="duel__kicker">⚔️ Dernier combat</div>
      <div class="duel__side">${tokenHtml(a.owner, a.type)}<b>${esc(aName)}</b><small>${esc(nameA)}</small></div>
      <div class="duel__vs">⚔️</div>
      <div class="duel__side">${tokenHtml(d.owner, d.type, !d.type)}<b>${esc(dName)}</b><small>${esc(nameD)}</small></div>
      <div class="duel__text">${esc(ev.text)}</div>`;
    b.classList.remove("hidden", "duel--show");
    void b.offsetWidth;
    b.classList.add("duel--show");
    clearTimeout(bannerTimer);
    // 0 = le cadre reste jusqu'au prochain combat
    if (keep > 0) bannerTimer = setTimeout(() => b.classList.add("hidden"), keep * 1000 * (slow > 1 ? 1.4 : 1));
  }

  function showChaos(ev) {
    const c = CHAOS_EVENTS[ev.chaos];
    const b = $("#chaos-banner");
    b.innerHTML = `<div class="chaos__ico">${c.icon}</div><div><b>${esc(c.name)}</b><div>${esc(c.text)}</div></div>`;
    b.classList.remove("hidden", "chaos--show"); void b.offsetWidth; b.classList.add("chaos--show");
    setTimeout(() => b.classList.add("hidden"), 4200);
  }

  // ---------- interactions ----------
  function onHover(cellPos) {
    hoverCell = cellPos;
    renderInfo();
  }

  function onCell(r, c) {
    if (!st) return;
    UI.Sound.select();
    if (st.phase === "setup") return onSetupClick(r, c);
    if (st.phase !== "playing") { selectedId = (pieceAt(r, c) || {}).id || null; renderAll(); return; }
    const p = pieceAt(r, c);
    if (power && isMyTurn()) return onPowerClick(p);
    if (!isMyTurn()) { selectedId = p ? p.id : null; renderAll(); return; }
    if (selectedId && !busy) {
      const dests = (st.legal && st.legal[selectedId]) || [];
      if (dests.some(([dr, dc]) => dr === r && dc === c)) {
        busy = true;
        socket.emit("game:move", { pieceId: selectedId, to: [r, c] });
        selectedId = null;
        renderAll();
        return;
      }
    }
    if (p && isMine(p)) {
      selectedId = selectedId === p.id ? null : p.id;
      if (selectedId && !(st.legal && st.legal[selectedId]) && PIECES[p.type].mobile) UI.toast("Cette pièce est bloquée ou endormie pour le moment.", "info");
      if (selectedId && p.type && !PIECES[p.type].mobile) UI.toast(PIECES[p.type].name + " ne bouge jamais.", "info");
    } else selectedId = p ? p.id : null;
    renderAll();
  }

  function onSetupClick(r, c) {
    const cells = st.mySetupCells || [];
    const inArm = cells.some(([a, b]) => a === r && b === c);
    if (me().ready) { UI.toast("Tu es prêt. Clique sur « Pas prêt » pour modifier.", "info"); return; }
    if (!inArm) { setupSelected = null; renderAll(); return; }
    if (setupSelected) {
      if (setupSelected[0] === r && setupSelected[1] === c) { setupSelected = null; }
      else { socket.emit("game:setupSwap", { a: setupSelected, b: [r, c] }); setupSelected = null; }
    } else if (pieceAt(r, c)) setupSelected = [r, c];
    renderAll();
  }

  function onPowerClick(p) {
    const house = houseOf(st.you);
    const kind = house.power.targets;
    if (!p) { UI.toast("Clique sur une pièce.", "info"); return; }
    if (kind === "enemy") {
      if (isMine(p)) { UI.toast("Choisis une pièce ennemie.", "info"); return; }
      socket.emit("game:power", { data: { target: p.id } });
      power = null; busy = true; renderAll();
    } else if (kind === "ownPair") {
      if (!isMine(p)) { UI.toast("Choisis deux de TES pièces.", "info"); return; }
      if (power.picks.includes(p.id)) { power.picks = power.picks.filter((x) => x !== p.id); renderAll(); return; }
      power.picks.push(p.id);
      if (power.picks.length === 2) {
        socket.emit("game:power", { data: { a: power.picks[0], b: power.picks[1] } });
        power = null; busy = true;
      }
      renderAll();
    }
  }

  function startPower() {
    const house = houseOf(st.you);
    const kind = house.power.targets;
    if (kind === "none") {
      App.confirm(`Utiliser ${house.power.icon} ${house.power.name} ? ${house.power.desc}`, () => { socket.emit("game:power", { data: {} }); busy = true; });
      return;
    }
    selectedId = null;
    power = { kind, picks: [] };
    renderAll();
  }

  // ---------- rendu ----------
  function renderAll() {
    if (!st) return;
    renderTop();
    renderBoard();
    renderPlayers();
    renderActions();
    renderInfo();
    renderGrave();
    renderLog();
    renderCompose();
  }

  // Dernier déplacement ou combat de chaque joueur (affiché dans la couleur de sa maison)
  function computeLastMoves() {
    const by = {};
    st.events.forEach((ev) => {
      if (ev.kind === "move") by[ev.owner] = { seat: ev.owner, from: ev.from, to: ev.to, seq: ev.seq };
      else if (ev.kind === "combat" && ev.attacker && ev.defender) by[ev.attacker.owner] = { seat: ev.attacker.owner, from: ev.attacker.from, to: ev.defender.at, seq: ev.seq };
    });
    const arr = Object.keys(by).map((k) => by[k]).sort((a, b) => a.seq - b.seq);
    if (arr.length) arr[arr.length - 1].latest = true;
    return arr;
  }

  function renderBoard() {
    const marks = [];
    const targetIds = new Set();
    const pickedIds = new Set();
    if (st.phase === "playing" && isMyTurn() && !power && selectedId) {
      const dests = (st.legal && st.legal[selectedId]) || [];
      dests.forEach(([r, c]) => {
        const t = pieceAt(r, c);
        marks.push({ r, c, kind: t && !isMine(t) ? "attack" : "move", text: t && !isMine(t) ? "⚔️" : "" });
      });
    }
    if (power) {
      st.pieces.forEach((p) => {
        const kind = houseOf(st.you).power.targets;
        if (kind === "enemy" && !isMine(p)) targetIds.add(p.id);
        if (kind === "ownPair" && isMine(p)) targetIds.add(p.id);
      });
      power.picks.forEach((id) => pickedIds.add(id));
    }
    Board.render({ state: st, selectedId, marks, lastMoves: computeLastMoves(), setupSelected, targetIds, pickedIds });
  }

  function renderTop() {
    const banner = $("#turn-banner");
    const cur = st.players[st.current];
    const h = HOUSES[cur.house % HOUSES.length];
    banner.style.setProperty("--hc", h.color); banner.style.setProperty("--hd", h.dark);
    banner.classList.toggle("is-me", isMyTurn());
    if (st.phase === "compose") banner.innerHTML = `🛠️ <b>Composition des armées</b>`;
    else if (st.phase === "setup") banner.innerHTML = `📐 <b>Placement des armées</b>`;
    else if (st.phase === "finished") banner.innerHTML = `🏁 <b>Partie terminée</b>`;
    else if (isMyTurn()) banner.innerHTML = `${h.icon} <b>À toi de jouer !</b>${st.players[st.you].bonus ? " (+1 coup bonus)" : ""}`;
    else banner.innerHTML = `${h.icon} Tour de <b>${esc(cur.name)}</b>${cur.isAI ? " 🤖" : ""}`;
    $("#round-num").textContent = st.round;
    $("#btn-sound").textContent = UI.Sound.enabled ? "🔊" : "🔇";
    let hint = "";
    if (st.phase === "compose") hint = me().ready ? "Armée validée. En attente des autres joueurs…" : "Compose ton armée avec le budget indiqué, sans limite de temps.";
    else if (st.phase === "setup") hint = me().ready ? "Tu es prêt. En attente des autres joueurs…" : "Clique sur une pièce de ton camp, puis sur une autre case de ton camp pour les échanger.";
    else if (st.phase === "playing") {
      if (power) hint = houseOf(st.you).power.targets === "ownPair" ? `Pouvoir ${houseOf(st.you).power.name} — choisis deux de tes pièces (${power.picks.length}/2). Échap pour annuler.` : `Pouvoir ${houseOf(st.you).power.name} — clique sur une pièce ennemie. Échap pour annuler.`;
      else if (isMyTurn()) hint = selectedId ? "Clique sur une case éclairée pour jouer." : "Choisis une de tes pièces pour la déplacer.";
      else hint = `${cur.name} réfléchit…`;
    }
    $("#board-hint").textContent = hint;
  }

  function renderPlayers() {
    const box = $("#player-cards");
    box.innerHTML = "";
    const conq = st.settings.mode === "conquest";
    st.players.forEach((p) => {
      const h = HOUSES[p.house % HOUSES.length];
      const auto = st.autoSeats && st.autoSeats[p.seat] && !p.isAI;
      const card = el("div", { class: "pcard" + (st.current === p.seat && st.phase === "playing" ? " is-turn" : "") + (p.eliminated ? " is-dead" : "") + (p.seat === st.you ? " is-you" : ""), style: { "--hc": h.color, "--hd": h.dark, "--hl": h.light } }, [
        el("div", { class: "crest crest--sm", style: { "--hc": h.color, "--hd": h.dark, "--cs": "40px" }, text: p.eliminated ? "☠️" : h.icon }),
        el("div", { class: "pcard__main" }, [
          el("div", { class: "pcard__name" }, [
            el("span", { text: p.name }),
            p.seat === st.you ? el("span", { class: "pill", text: "toi" }) : null,
            p.isAI ? el("span", { class: "pill", title: AI.LEVELS[p.level] ? AI.LEVELS[p.level].label : "", text: (AI.LEVELS[p.level] || AI.LEVELS.normal).icon }) : null,
            auto ? el("span", { class: "pill", title: "Déconnecté, l'IA joue à sa place", text: "🤖 auto" }) : null,
            st.settings.teams ? el("span", { class: "pill pill--team", text: "Éq. " + (p.team === 0 ? "A" : "B") }) : null,
          ]),
          el("div", { class: "pcard__stats" }, [
            el("span", { title: "Pièces en vie", text: "🧩 " + (p.alive === null ? "?" : p.alive) }),
            st.settings.powers ? el("span", { title: h.power.name, class: p.charges > 0 ? "" : "is-spent", text: h.power.icon + " ×" + p.charges }) : null,
            st.phase === "setup" ? el("span", { text: p.ready ? "✅ prêt" : "⏳ place…" }) : null,
          ]),
          conq ? el("div", { class: "relic-bar", title: "Points de reliques" }, [el("i", { style: { width: Math.min(100, (p.score / st.settings.relicTarget) * 100) + "%" } }), el("span", { text: "🏆 " + p.score + "/" + st.settings.relicTarget })]) : null,
        ]),
      ]);
      box.appendChild(card);
    });
  }

  function renderActions() {
    const panel = $("#action-panel");
    panel.innerHTML = "";
    const m = me();
    const h = houseOf(st.you);
    if (st.phase === "compose") {
      panel.appendChild(el("h3", { class: "h-sub", text: "🛠️ Composition en cours" }));
      panel.appendChild(el("p", { class: "muted small", text: m.ready ? "Ton armée est validée. Tu peux encore la modifier tant que les autres n'ont pas fini." : "Choisis les pièces de ton armée dans la fenêtre qui s'affiche." }));
      return;
    }
    if (st.phase === "setup") {
      panel.appendChild(el("h3", { class: "h-sub", text: "📐 Place ton armée" }));
      panel.appendChild(el("p", { class: "muted small", text: "Cache ton Œuf de Dragon dans le fond de ton camp, entoure-le de tartes piégées, et garde tes grosses pièces à l'abri... ou pas !" }));
      if (!m.ready) {
        panel.appendChild(el("div", { class: "btn-row" }, [
          el("button", { class: "btn btn--small btn--plum", onclick: () => socket.emit("game:setupRandom", { style: "random" }), text: "🎲 Hasard" }),
          el("button", { class: "btn btn--small btn--plum", onclick: () => socket.emit("game:setupRandom", { style: "defensive" }), text: "🛡️ Défensive" }),
          el("button", { class: "btn btn--small btn--plum", onclick: () => socket.emit("game:setupRandom", { style: "aggressive" }), text: "⚔️ Offensive" }),
        ]));
      }
      panel.appendChild(el("button", { class: "btn btn--big " + (m.ready ? "btn--plum" : "btn--gold"), onclick: () => socket.emit("game:setupReady", { ready: !m.ready }), text: m.ready ? "↩ Pas prêt, je modifie" : "✅ Je suis prêt !" }));
      // composition
      const mine = {};
      st.pieces.filter((p) => p.owner === st.you && p.type).forEach((p) => { mine[p.type] = (mine[p.type] || 0) + 1; });
      const comp = el("div", { class: "composition" });
      ORDER.forEach((id) => { if (mine[id]) comp.appendChild(el("span", { class: "comp-chip", title: PIECES[id].name + " — " + PIECES[id].desc, text: PIECES[id].icon + " " + mine[id] })); });
      panel.appendChild(el("h4", { class: "h-mini", text: "Ton armée" }));
      panel.appendChild(comp);
      return;
    }
    if (st.phase === "finished") {
      panel.appendChild(el("h3", { class: "h-sub", text: "🏁 Partie terminée" }));
      panel.appendChild(el("button", { class: "btn btn--gold", onclick: () => { endDismissed = false; showEnd(); }, text: "🏆 Voir le résumé" }));
      return;
    }
    if (m.eliminated) {
      panel.appendChild(el("h3", { class: "h-sub", text: "☠️ Tu es éliminé" }));
      panel.appendChild(el("p", { class: "muted small", text: "Tu peux continuer à regarder la bataille jusqu'à la fin." }));
      return;
    }
    // jeu
    panel.appendChild(el("h3", { class: "h-sub", text: isMyTurn() ? "⚔️ À toi de jouer" : "⏳ En attente" }));
    if (st.settings.powers) {
      const can = isMyTurn() && m.charges > 0 && !st.turnPowerUsed;
      const pw = el("button", {
        class: "power-btn" + (power ? " is-on" : ""), disabled: can ? null : "", style: { "--hc": h.color, "--hd": h.dark },
        onclick: () => { if (power) { power = null; renderAll(); } else startPower(); },
      }, [
        el("span", { class: "power-btn__ico", text: h.power.icon }),
        el("span", { class: "power-btn__txt" }, [
          el("b", { text: power ? "Annuler le pouvoir" : h.power.name }),
          el("small", { text: m.charges <= 0 ? "Plus de charge" : st.turnPowerUsed ? "Déjà utilisé ce tour" : h.power.desc }),
        ]),
        el("span", { class: "power-btn__n", text: "×" + m.charges }),
      ]);
      panel.appendChild(pw);
    }
    panel.appendChild(el("p", { class: "muted small", text: isMyTurn() ? "Choisis une pièce puis une case éclairée. Un seul déplacement par tour." : "Observe bien les mouvements : une pièce qui bouge n'est ni une tarte ni l'Œuf !" }));
    if (st.settings.turnTimer > 0 && st.deadline) {
      // le minuteur est dans la barre du haut
    }
  }

  function renderInfo() {
    const box = $("#piece-info");
    if (!st) return;
    let p = null;
    if (hoverCell) p = pieceAt(hoverCell.r, hoverCell.c);
    if (!p && selectedId) p = st.pieces.find((x) => x.id === selectedId) || null;
    if (!p) {
      if (hoverCell) {
        const t = st.board.terrain[hoverCell.r] && st.board.terrain[hoverCell.r][hoverCell.c];
        const names = { lake: "💧 Lac — infranchissable.", forest: "🌲 Forêt — un défenseur qui gagne ici reste caché.", marsh: "🟤 Marais — une pièce qui s'y arrête dort un tour.", plain: "" };
        const isRuin = st.board.ruins.some(([a, b]) => a === hoverCell.r && b === hoverCell.c);
        const isRelic = st.board.relics.some((x) => x.r === hoverCell.r && x.c === hoverCell.c);
        const txt = isRuin ? "🪨 Ruines — infranchissables." : isRelic ? "🏆 Relique — chaque tour passé dessus rapporte un point." : names[t] || "";
        if (txt) { box.classList.remove("hidden"); box.innerHTML = `<p>${esc(txt)}</p>`; return; }
      }
      box.classList.add("hidden"); return;
    }
    const mine = isMine(p);
    const h = houseOf(p.owner);
    box.classList.remove("hidden");
    if (p.type) {
      const d = PIECES[p.type];
      box.innerHTML = `<div class="pinfo"><div class="pinfo__tok">${tokenHtml(p.owner, p.type)}</div><div><b>${esc(d.name)}</b>
        <div class="muted small">${d.bomb ? "Piège immobile" : d.id === "oeuf" ? "Cible à protéger" : "Force " + d.rank}${d.mobile ? "" : " · immobile"} · ${esc(st.players[p.owner].name)}</div>
        <p class="small">${esc(d.desc)}</p>${p.frozen > 0 ? '<p class="small">💤 Endormie (' + p.frozen + ' tour' + (p.frozen > 1 ? "s" : "") + ')</p>' : ""}${p.secret ? '<p class="small">👁️ Dévoilée par ton Œil d&#39;aigle.</p>' : ""}</div></div>`;
    } else {
      box.innerHTML = `<div class="pinfo"><div class="pinfo__tok">${tokenHtml(p.owner, null, true)}</div><div><b>Pièce mystère</b>
        <div class="muted small">${esc(h.short)} · ${esc(st.players[p.owner].name)}</div>
        <p class="small">${p.moved ? "Elle a déjà bougé : ce n'est donc ni une tarte ni l'Œuf." : "Elle n'a jamais bougé : ce peut être une tarte, l'Œuf... ou une pièce discrète."}</p>${p.frozen > 0 ? '<p class="small">💤 Endormie.</p>' : ""}</div></div>`;
    }
  }

  function renderGrave() {
    const box = $("#graveyard");
    box.innerHTML = "";
    if (!st.graveyard.length) { box.appendChild(el("span", { class: "muted small", text: "Personne n'est encore tombé." })); return; }
    st.players.forEach((pl) => {
      const dead = st.graveyard.filter((g) => g.owner === pl.seat);
      if (!dead.length) return;
      const h = HOUSES[pl.house % HOUSES.length];
      const row = el("div", { class: "grave-row", style: { "--hc": h.color } }, [el("span", { class: "grave-row__who", text: h.icon })]);
      dead.sort((a, b) => (b.type ? PIECES[b.type].rank : -1) - (a.type ? PIECES[a.type].rank : -1)).forEach((g) => row.appendChild(el("span", { class: "grave", title: g.type ? PIECES[g.type].name : "Pièce cachée", text: g.type ? PIECES[g.type].icon : "❔" })));
      box.appendChild(row);
    });
  }

  function renderLog() {
    const card = $("#log-card");
    if (card) card.classList.toggle("hidden", !st.settings.showLog);
    if (!st.settings.showLog) return;
    const ol = $("#log-list");
    const keep = st.events.filter((e) => e.text && !["move", "turn"].includes(e.kind)).slice(-40).reverse();
    ol.innerHTML = "";
    keep.forEach((e) => ol.appendChild(el("li", { class: "log__item log__item--" + e.kind, text: e.text })));
  }

  // ---------- composition sur mesure ----------
  function renderCompose() {
    const ov = $("#compose-overlay");
    const show = st.phase === "compose" && !me().eliminated && !!st.compose;
    ov.classList.toggle("hidden", !show);
    if (!show) return;
    const c = st.compose;
    const ready = me().ready;
    const counts = c.mine || {};
    const room = c.size - 1;
    let total = 0, cost = 0;
    ORDER.forEach((id) => { if (id !== "oeuf") { total += counts[id] || 0; cost += (counts[id] || 0) * PIECES[id].cost; } });
    $("#compose-sub").textContent = "Tout le monde a le même budget. Il n'y a pas de limite de temps. L'Œuf de Dragon est ajouté automatiquement et le Roi est toujours présent.";
    const meters = $("#compose-meters"); meters.innerHTML = "";
    meters.appendChild(el("div", { class: "meter" + (total > room ? " meter--bad" : "") }, [el("span", { text: "Pièces " + total + " sur " + room }), el("div", { class: "meter__bar" }, [el("i", { style: { width: Math.min(100, (total / room) * 100) + "%" } })])]));
    meters.appendChild(el("div", { class: "meter" + (cost > c.budget ? " meter--bad" : "") }, [el("span", { text: "Budget " + cost + " sur " + c.budget }), el("div", { class: "meter__bar" }, [el("i", { style: { width: Math.min(100, (cost / c.budget) * 100) + "%" } })])]));
    const presets = $("#compose-presets"); presets.innerHTML = "";
    if (!ready) {
      presets.appendChild(el("span", { class: "muted small", text: "Partir d'un modèle" }));
      const list = GoliathPieces.ARMIES[c.size] || {};
      Object.keys(list).forEach((k) => {
        if (list[k].special && !st.settings.specialPieces) return;
        presets.appendChild(el("button", { class: "btn btn--small btn--plum", title: list[k].desc, onclick: () => socket.emit("game:composePreset", { preset: k }), text: list[k].icon + " " + list[k].name }));
      });
    }
    const grid = $("#compose-grid"); grid.innerHTML = "";
    ORDER.forEach((id) => {
      if (id === "oeuf") return;
      const d = PIECES[id];
      if (d.special && !st.settings.specialPieces) return;
      const n = counts[id] || 0;
      const canPlus = !ready && n < d.max && total < room && cost + d.cost <= c.budget && id !== "roi";
      const canMinus = !ready && n > 0 && id !== "roi";
      const set = (delta) => { const next = Object.assign({}, counts); delete next.oeuf; next[id] = n + delta; socket.emit("game:compose", { counts: next }); };
      grid.appendChild(el("div", { class: "army-row", title: d.desc }, [
        el("span", { class: "army-row__ico", text: d.icon }),
        el("span", { class: "army-row__name", text: d.short }),
        el("small", { class: "army-row__cost", text: (d.mobile ? "Force " + d.rank + " · " : "") + d.cost + " pts" }),
        el("div", { class: "stepper" }, [
          el("button", { class: "mini-btn", text: "−", disabled: canMinus ? null : "", onclick: () => set(-1) }),
          el("b", { text: String(n) }),
          el("button", { class: "mini-btn", text: "+", disabled: canPlus ? null : "", onclick: () => set(1) }),
        ]),
      ]));
    });
    const status = $("#compose-status");
    status.innerHTML = "";
    st.players.forEach((p) => {
      const h = HOUSES[p.house % HOUSES.length];
      status.appendChild(el("span", { class: "comp-chip", text: h.icon + " " + p.name + (p.ready ? " ✅" : " ⏳") }));
    });
    const btn = $("#btn-compose-ready");
    btn.textContent = ready ? "↩ Modifier mon armée" : "✅ Valider mon armée";
    btn.className = "btn btn--big " + (ready ? "btn--plum" : "btn--gold");
    btn.onclick = () => socket.emit("game:composeReady", { ready: !ready });
  }

  // ---------- minuteur ----------
  function tickTimer() {
    const t = $("#timer");
    if (!st || !st.deadline || st.phase === "finished") { t.classList.add("hidden"); return; }
    const left = Math.max(0, Math.round((st.deadline - (Date.now() - clockOffset)) / 1000));
    t.classList.remove("hidden");
    $("#timer-text").textContent = left >= 60 ? Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0") : left + " s";
    t.classList.toggle("timer--low", left <= 10);
    t.title = st.phase === "setup" ? "Temps restant pour placer l'armée" : "Temps restant pour jouer";
  }

  // ---------- fin de partie ----------
  function showEnd() {
    if (endDismissed) return;
    const ov = $("#end-overlay");
    const winners = st.winners || [];
    const iWon = winners.includes(st.you);
    const draw = winners.length === 0 || (winners.length > 1 && !st.settings.teams);
    $("#end-trophy").textContent = draw ? "🤝" : iWon ? "🏆" : "💀";
    $("#end-title").textContent = draw ? "Match nul" : iWon ? (st.settings.teams ? "Votre équipe gagne !" : "Victoire !") : "Défaite...";
    const last = st.events.filter((e) => e.kind === "end").pop();
    $("#end-sub").textContent = last ? last.text : "";
    (iWon && !draw ? UI.Sound.victory : UI.Sound.defeat).call(UI.Sound);
    const aw = $("#end-awards");
    aw.innerHTML = "";
    ((st.stats && st.stats.awards) || []).slice(0, 6).forEach((a) => {
      const h = houseOf(a.seat);
      aw.appendChild(el("div", { class: "award", style: { "--hc": h.color } }, [
        el("div", { class: "award__ico", text: a.icon }),
        el("div", {}, [el("b", { text: a.title }), el("div", { class: "small", text: st.players[a.seat].name + " — " + a.text })]),
      ]));
    });
    const tb = $("#end-table");
    tb.innerHTML = "";
    const table = el("table", { class: "stat-table" }, [
      el("thead", {}, [el("tr", {}, ["Joueur", "Coups", "Attaques", "Victoires", "Pertes"].map((t) => el("th", { text: t })))]),
      el("tbody", {}, ((st.stats && st.stats.perPlayer) || []).map((s) => {
        const h = houseOf(s.seat);
        return el("tr", { class: winners.includes(s.seat) ? "is-winner" : "" }, [
          el("td", {}, [el("span", { class: "dotc", style: { background: h.color } }), " " + st.players[s.seat].name + (winners.includes(s.seat) ? " 🏆" : "")]),
          el("td", { text: String(s.moves) }), el("td", { text: String(s.attacks) }), el("td", { text: String(s.kills) }), el("td", { text: String(s.lost) }),
        ]);
      })),
    ]);
    tb.appendChild(table);
    $("#btn-end-lobby").classList.toggle("hidden", !isHostFn());
    $("#end-wait").classList.toggle("hidden", isHostFn());
    // confettis
    const conf = $("#end-confetti");
    conf.innerHTML = "";
    if (iWon && !draw) {
      for (let i = 0; i < 40; i++) {
        const s = el("i", { style: { left: Math.random() * 100 + "%", background: ["#f5c04a", "#d6453d", "#2f78d1", "#3a9d53", "#fff"][i % 5], animationDelay: Math.random() * 1.5 + "s", animationDuration: 2.5 + Math.random() * 2 + "s" } });
        conf.appendChild(s);
      }
    }
    ov.classList.remove("hidden");
  }

  function refreshHostButtons() {
    if (st && st.phase === "finished") {
      $("#btn-end-lobby").classList.toggle("hidden", !isHostFn());
      $("#end-wait").classList.toggle("hidden", isHostFn());
    }
  }

  window.Game = { init, onState, reset, refreshHostButtons, cancelAll: () => { cancelAll(); if (st) renderAll(); }, get state() { return st; } };
})();
