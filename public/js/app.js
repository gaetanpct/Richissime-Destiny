// Point d'entrée — connexion, état, aiguillage des écrans
(function () {
  const RD = window.RD;
  const { $, h, clear } = RD;

  const S = (RD.S = {
    socket: null, meta: null, room: null, game: null, token: RD.store.get("token", null), code: RD.store.get("code", null),
    chat: [], connected: false, ui: { vals: {}, open: {}, tab: "vie", rtab: "gazette", mob: "jeu" },
  });

  function connect() {
    const socket = (S.socket = io({ transports: ["websocket", "polling"] }));
    socket.on("connect", () => {
      S.connected = true;
      if (S.token && S.code && !S.room) socket.emit("room:reconnect", { code: S.code, token: S.token });
      else render();
    });
    socket.on("disconnect", () => { S.connected = false; RD.toast("Connexion perdue, reconnexion en cours…", "error"); });
    socket.on("meta", (m) => { S.meta = m; render(); });
    socket.on("toast", (t) => RD.toast(t.text, t.type));
    socket.on("room:joined", ({ code, token }) => { S.token = token; S.code = code; RD.store.set("token", token); RD.store.set("code", code); history.replaceState(null, "", "?room=" + code); });
    socket.on("room:gone", () => { S.room = null; S.game = null; S.code = null; RD.store.del("code"); render(); });
    socket.on("room:kicked", () => { RD.toast("Tu as été retiré du salon.", "error"); resetRoom(); });
    socket.on("room:lobbyAgain", () => { S.game = null; render(); });
    socket.on("room:state", (r) => {
      S.room = r;
      render();
    });
    socket.on("game:state", (st) => {
      RD.serverOffset = st.serverTime - Date.now();
      const prev = S.game;
      S.game = st;
      RD.onGameState && RD.onGameState(prev, st);
      render();
    });
    socket.on("chat:history", (list) => { S.chat = list.slice(); RD.refreshChat && RD.refreshChat(); });
    socket.on("chat:message", (m) => { S.chat.push(m); if (S.chat.length > 60) S.chat.shift(); RD.refreshChat && RD.refreshChat(); });
  }

  function resetRoom() {
    S.room = null; S.game = null; S.code = null; S.chat = [];
    RD.store.del("code");
    history.replaceState(null, "", location.pathname);
    render();
  }
  RD.leaveRoom = () => { S.socket.emit("room:leave"); resetRoom(); };
  RD.emit = (ev, data) => S.socket.emit(ev, data);

  // ---------- rendu avec conservation du focus et du défilement ----------
  RD.keep = function (fn) {
    const a = document.activeElement;
    const k = a && a.dataset ? a.dataset.k : null;
    const sel = k && typeof a.selectionStart === "number" ? [a.selectionStart, a.selectionEnd] : null;
    const y = window.scrollY;
    const inner = {};
    RD.$$("[data-keepscroll]").forEach((n) => { inner[n.dataset.keepscroll] = n.scrollTop; });
    fn();
    if (k) {
      const n = document.querySelector('[data-k="' + k + '"]');
      if (n) { n.focus({ preventScroll: true }); if (sel && n.setSelectionRange) { try { n.setSelectionRange(sel[0], sel[1]); } catch (e) { /* ignore */ } } }
    }
    window.scrollTo(0, y);
    RD.$$("[data-keepscroll]").forEach((n) => { if (inner[n.dataset.keepscroll] !== undefined) n.scrollTop = inner[n.dataset.keepscroll]; });
  };

  let screenKey = "";
  function render() {
    const root = $("#app");
    if (!S.meta) { clear(root); root.appendChild(h("div.wrap.center", h("p.muted", "Chargement…"))); return; }
    let key, fn;
    if (!S.room) { key = "home"; fn = RD.renderHome; }
    else if (S.room.status === "lobby") { key = "lobby"; fn = RD.renderLobby; }
    else if (S.game && S.game.phase === "review" && S.game.review) { key = "review" + S.game.review.idx; fn = RD.renderReview; }
    else if (S.game && S.game.phase === "over") { key = "end"; fn = RD.renderEnd; }
    else if (S.game) { key = "game"; fn = RD.renderGame; }
    else { key = "wait"; fn = (r) => { clear(r); r.appendChild(h("div.wrap.center", h("h2", "La partie démarre…"))); }; }
    const fresh = key !== screenKey;
    screenKey = key;
    RD.keep(() => { fn(root, fresh); });
    if (fresh) window.scrollTo(0, 0);
  }
  RD.render = render;

  // ---------- chrono et décompte, sans reconstruire la page ----------
  setInterval(() => {
    RD.$$("[data-deadline]").forEach((n) => {
      const dl = Number(n.dataset.deadline); const total = Number(n.dataset.total) || 1;
      const rest = RD.remaining(dl);
      if (n.classList.contains("timer")) n.firstChild.style.width = Math.max(0, Math.min(100, (rest / total) * 100)) + "%";
      else n.textContent = Math.ceil(rest / 1000) + " s";
    });
  }, 250);

  RD.timerBar = function (deadline, total) {
    if (!deadline) return null;
    const rest = RD.remaining(deadline);
    return h("div.timer", { "data-deadline": deadline, "data-total": Math.max(total || 25000, rest) }, h("i", { style: { width: "100%" } }));
  };

  // ---------- démarrage ----------
  const qs = new URLSearchParams(location.search);
  if (qs.get("room") && !S.code) S.ui.joinCode = qs.get("room").toUpperCase();
  window.addEventListener("pointerdown", () => { /* débloque l'audio */ }, { once: true });
  let started = false;
  const start = () => { if (started) return; started = true; render(); connect(); };
  document.addEventListener("DOMContentLoaded", start);
  if (document.readyState !== "loading") start();
})();
