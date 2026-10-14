// ============================================================
// Salon : prétendants, réglages générés depuis le schéma, aperçu du plateau
// ============================================================
(function () {
  const { $, el, esc } = UI;
  const { HOUSES, PIECES, ORDER, ARMIES } = GoliathPieces;
  const Rules = GoliathRules;
  const AI = GoliathAI;

  let socket = null;
  let room = null;
  let mySeatId = null;

  function init(sock) {
    socket = sock;
    $("#btn-add-ai").addEventListener("click", () => {
      const lv = UI.store.get("goliath.aiLevel", "normal");
      socket.emit("room:addAi", { level: lv });
    });
    $("#btn-ready").addEventListener("click", () => {
      const me = room && room.players.find((p) => p.you);
      if (me) socket.emit("room:ready", { ready: !me.ready });
    });
    $("#btn-start").addEventListener("click", () => socket.emit("room:start"));
    $("#btn-copy-code").addEventListener("click", () => {
      const code = room ? room.code : "";
      try { navigator.clipboard.writeText(code); UI.toast("Code copié !", "ok"); } catch (e) { UI.toast("Code " + code, "info"); }
    });
  }

  function isHost() { return room && room.players.some((p) => p.you && p.id === room.hostId); }

  function crest(houseIdx, size) {
    const h = HOUSES[houseIdx % HOUSES.length];
    return el("div", { class: "crest", style: { "--hc": h.color, "--hd": h.dark, "--cs": (size || 44) + "px" }, title: h.name, text: h.icon });
  }

  // ---------- liste des joueurs ----------
  function renderSeats() {
    const list = $("#seat-list");
    list.innerHTML = "";
    const host = isHost();
    room.players.forEach((p, i) => {
      const h = HOUSES[p.house % HOUSES.length];
      const teamTag = room.settings.teams ? el("span", { class: "pill pill--team", text: "Équipe " + (i % 2 === 0 ? "A" : "B") }) : null;
      const card = el("div", { class: "seat" + (p.you ? " seat--you" : ""), style: { "--hc": h.color, "--hd": h.dark, "--hl": h.light } }, [
        crest(p.house, 52),
        el("div", { class: "seat__main" }, [
          el("div", { class: "seat__name" }, [
            el("span", { text: p.name }),
            p.id === room.hostId ? el("span", { class: "pill pill--host", text: "👑 hôte" }) : null,
            p.you ? el("span", { class: "pill", text: "toi" }) : null,
            teamTag,
          ]),
          el("div", { class: "seat__sub" }, [
            el("span", { text: h.name }),
            p.isAI ? null : el("span", { class: p.connected ? "dot dot--on" : "dot dot--off", title: p.connected ? "connecté" : "déconnecté" }),
            p.isAI ? null : el("span", { class: "seat__ready " + (p.ready ? "is-ready" : ""), text: p.ready ? "✅ prêt" : "⏳ pas prêt" }),
          ]),
        ]),
        el("div", { class: "seat__tools" }, []),
      ]);
      const tools = $(".seat__tools", card);
      if (p.isAI) {
        if (host) {
          const sel = el("select", { class: "select select--small", title: "Niveau de l'IA" });
          Object.keys(AI.LEVELS).forEach((k) => {
            const o = el("option", { value: k, text: AI.LEVELS[k].icon + " " + AI.LEVELS[k].label });
            if (p.level === k) o.selected = true;
            sel.appendChild(o);
          });
          sel.addEventListener("change", () => { UI.store.set("goliath.aiLevel", sel.value); socket.emit("room:aiLevel", { id: p.id, level: sel.value }); });
          tools.appendChild(sel);
        } else {
          const lv = AI.LEVELS[p.level] || AI.LEVELS.normal;
          tools.appendChild(el("span", { class: "pill", text: lv.icon + " " + lv.label }));
        }
      }
      if (host) {
        const mv = el("div", { class: "seat__move" }, [
          el("button", { class: "mini-btn", title: "Monter", text: "▲", disabled: i === 0 ? "" : null, onclick: () => socket.emit("room:moveSeat", { id: p.id, dir: -1 }) }),
          el("button", { class: "mini-btn", title: "Descendre", text: "▼", disabled: i === room.players.length - 1 ? "" : null, onclick: () => socket.emit("room:moveSeat", { id: p.id, dir: 1 }) }),
        ]);
        tools.appendChild(mv);
        if (!p.you) tools.appendChild(el("button", { class: "mini-btn mini-btn--danger", title: p.isAI ? "Retirer l'IA" : "Expulser", text: "✕", onclick: () => socket.emit(p.isAI ? "room:removeAi" : "room:kick", { id: p.id }) }));
      }
      if (p.you) {
        const picker = el("div", { class: "house-picker" });
        HOUSES.forEach((hh, idx) => {
          const taken = room.players.some((q) => q !== p && q.house === idx && !q.isAI);
          picker.appendChild(el("button", {
            class: "house-btn" + (idx === p.house ? " is-on" : ""), title: hh.name + " — " + hh.power.name,
            style: { "--hc": hh.color, "--hd": hh.dark }, text: hh.icon, disabled: taken ? "" : null,
            onclick: () => socket.emit("room:house", { house: idx }),
          }));
        });
        card.appendChild(picker);
      }
      list.appendChild(card);
    });
    for (let i = room.players.length; i < 4; i++) {
      list.appendChild(el("div", { class: "seat seat--empty" }, [el("div", { class: "seat__empty-ico", text: "➕" }), el("div", {}, [el("b", { text: "Place libre" }), el("div", { class: "muted small", text: "Partage le code ou ajoute une IA" })])]));
    }
    $("#btn-add-ai").classList.toggle("hidden", !host || room.players.length >= 4);
    $("#host-ai-tools").classList.toggle("hidden", !host);
  }

  // ---------- réglages ----------
  function optValue(o) { return typeof o === "object" ? o.value : o; }
  function optLabel(o) { return typeof o === "object" ? o.label : String(o); }

  function visible(rule, s) {
    if (!rule.showIf) return true;
    return Object.keys(rule.showIf).every((k) => s[k] === rule.showIf[k]);
  }
  function unmet(rule, s, n) {
    if (!rule.needs) return null;
    if (rule.needs.players && n !== rule.needs.players) return "Il faut exactement " + rule.needs.players + " joueurs";
    if (rule.needs.specialPieces && !s.specialPieces) return "Active les pièces spéciales";
    return null;
  }

  function changeSetting(id, value) {
    if (!isHost()) return;
    socket.emit("room:settings", { settings: { [id]: value } });
  }

  function renderRule(rule, s, host, n) {
    if (!visible(rule, s)) return null;
    const lock = !host;
    const wrap = el("div", { class: "rule rule--" + rule.type });
    if (rule.type === "legend") {
      return el("div", { class: "rule-legend", text: rule.info });
    }
    if (rule.type === "bool") {
      const why = unmet(rule, s, n);
      const on = !!s[rule.id] && !why;
      wrap.classList.add("rule--switch");
      wrap.appendChild(el("div", { class: "rule__head" }, [
        el("div", { class: "rule__label", text: rule.label }),
        el("button", {
          class: "switch" + (on ? " is-on" : ""), role: "switch", "aria-checked": on ? "true" : "false", disabled: lock || why ? "" : null,
          onclick: () => changeSetting(rule.id, !on),
        }, [el("span", { class: "switch__knob" })]),
      ]));
      wrap.appendChild(el("p", { class: "rule__info", text: why ? "🔒 " + why + ". " + rule.info : rule.info }));
      if (why) wrap.classList.add("rule--disabled");
      return wrap;
    }
    wrap.appendChild(el("div", { class: "rule__label", text: rule.label }));
    if (rule.type === "cards") {
      const grid = el("div", { class: "opt-cards" });
      rule.options.forEach((o) => {
        const why = unmet(o, s, n);
        const active = s[rule.id] === o.value && !why;
        grid.appendChild(el("button", {
          class: "opt-card" + (active ? " is-on" : ""), disabled: lock || why ? "" : null,
          onclick: () => changeSetting(rule.id, o.value),
        }, [
          el("span", { class: "opt-card__ico", text: o.icon }),
          el("span", { class: "opt-card__title", text: o.label }),
          el("span", { class: "opt-card__desc", text: why ? "🔒 " + why : o.desc }),
        ]));
      });
      wrap.appendChild(grid);
    } else {
      const row = el("div", { class: "chips" });
      rule.options.forEach((o) => {
        const v = optValue(o);
        row.appendChild(el("button", {
          class: "chip" + (s[rule.id] === v ? " chip--active" : ""), disabled: lock ? "" : null,
          onclick: () => changeSetting(rule.id, v), text: optLabel(o),
        }));
      });
      wrap.appendChild(row);
    }
    if (rule.info) wrap.appendChild(el("p", { class: "rule__info", text: rule.info }));
    return wrap;
  }

  function renderSettings() {
    const form = $("#settings-form");
    const scrollTop = form.parentElement.scrollTop;
    form.innerHTML = "";
    const host = isHost();
    const s = room.settings;
    const n = room.players.length;
    $("#settings-lock").classList.toggle("hidden", host);
    Rules.SCHEMA.forEach((cat) => {
      const rules = cat.rules.map((r) => renderRule(r, s, host, n)).filter(Boolean);
      if (!rules.length) return;
      const sec = el("section", { class: "settings-cat" }, [el("h3", { class: "settings-cat__title", text: cat.category })]);
      rules.forEach((r) => sec.appendChild(r));
      form.appendChild(sec);
    });
    form.parentElement.scrollTop = scrollTop;
  }

  // ---------- aperçu du plateau ----------
  function renderPreview() {
    const box = $("#board-preview");
    box.innerHTML = "";
    const n = Math.max(2, room.players.length);
    const s = room.settings;
    let board;
    try { board = GoliathBoards.buildBoard(s, n, GoliathBoards.mulberry32(20241011)); } catch (e) { return; }
    const cell = Math.max(8, Math.min(22, Math.floor(230 / board.cols)));
    box.style.gridTemplateColumns = "repeat(" + board.cols + ", " + cell + "px)";
    box.style.gridTemplateRows = "repeat(" + board.rows + ", " + cell + "px)";
    const owner = {};
    board.arms.forEach((arm, i) => {
      const pl = room.players[i];
      arm.cells.forEach(([r, c]) => { owner[r + "," + c] = pl ? HOUSES[pl.house % HOUSES.length].color : "#bbb"; });
    });
    const relics = new Set((board.relics || []).map((x) => x.r + "," + x.c));
    for (let r = 0; r < board.rows; r++) for (let c = 0; c < board.cols; c++) {
      const t = board.terrain[r][c];
      const k = r + "," + c;
      const d = el("div", { class: "pv pv--" + t });
      if (owner[k]) d.style.background = owner[k];
      if (relics.has(k)) { d.classList.add("pv--relic"); d.textContent = "★"; }
      box.appendChild(d);
    }
    $("#board-preview-note").textContent = (board.kind === "duel" ? "Duel" : "Croix à " + n + " camps") + " · " + board.rows + "×" + board.cols + (s.terrain === "random" || s.terrain === "wild" ? " · relief tiré au sort à chaque partie" : "");
  }

  // ---------- pied de page ----------
  function renderFooter() {
    const host = isHost();
    const me = room.players.find((p) => p.you);
    const others = room.players.filter((p) => !p.isAI && !p.you);
    const waiting = others.filter((p) => !p.ready);
    $("#btn-start").classList.toggle("hidden", !host);
    $("#btn-ready").classList.toggle("hidden", host);
    if (!host && me) {
      $("#btn-ready").textContent = me.ready ? "↩ Plus prêt" : "✋ Je suis prêt";
      $("#btn-ready").classList.toggle("btn--green", !me.ready);
      $("#btn-ready").classList.toggle("btn--plum", me.ready);
    }
    const hint = $("#lobby-hint");
    if (room.players.length < 2) hint.textContent = "Ajoute une IA ou invite un ami avec le code pour commencer.";
    else if (host && waiting.length) hint.textContent = "En attente de " + waiting.map((p) => p.name).join(", ") + "…";
    else if (host) hint.textContent = "Tout le monde est prêt, lance la bataille !";
    else hint.textContent = "L'hôte lance la partie quand tout le monde est prêt.";
    $("#btn-start").disabled = room.players.length < 2;
  }

  function render(r) {
    room = r;
    $("#lobby-code").textContent = r.code;
    renderSeats();
    renderSettings();
    renderPreview();
    renderFooter();
  }

  function setRoom(r) { room = r; }
  window.Lobby = { init, render, isHost, setRoom };
})();
