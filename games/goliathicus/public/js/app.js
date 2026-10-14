// ============================================================
// Application : connexion, écrans, session, tchat
// ============================================================
(function () {
  const { $, $$, el, esc, store } = UI;
  const { HOUSES, PIECES, ORDER } = GoliathPieces;

  // Échelle des forces toujours visible pendant la partie
  (function buildLadder() {
    const box = $("#ladder-mini"); if (!box) return;
    const ids = ORDER.filter((id) => PIECES[id].mobile && !PIECES[id].special);
    ids.forEach((id, k) => {
      const d = PIECES[id];
      box.appendChild(el("span", { class: "ladder__step", title: d.name + " (force " + d.rank + ")" }, [el("i", { text: d.icon }), el("b", { text: String(d.rank) })]));
      if (k < ids.length - 1) box.appendChild(el("span", { class: "ladder__sep", text: "›" }));
    });
    box.appendChild(el("p", { class: "muted small ladder__note", text: "Plus le chiffre est grand, plus la pièce est forte. Exception, le Rat (1) bat toujours le Roi (10), qu'il attaque ou qu'il se défende." }));
  })();

  const socket = io({ path: location.pathname.replace(/[^\/]*$/, "") + "socket.io", transports: ["websocket", "polling"] });
  let token = store.sget("goliath.token", null);
  if (!token) { token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2); store.sset("goliath.token", token); }
  let roomCode = store.sget("goliath.room", null);
  let room = null;
  let pendingSolo = false;
  let chatOpen = false;
  let unread = 0;
  let chat = [];

  function showScreen(name) {
    $$(".screen").forEach((s) => s.classList.toggle("screen--active", s.id === "screen-" + name));
    const inRoom = name === "lobby" || name === "game";
    $("#btn-chat-fab").classList.toggle("hidden", !(name === "lobby"));
    if (!inRoom) { closeChat(); }
    document.body.dataset.screen = name;
  }

  function myName() {
    const v = ($("#input-name").value || "").trim();
    if (v) store.set("goliath.name", v);
    return v || "Joueur";
  }

  // ---------- connexion ----------
  socket.on("connect", () => {
    if (roomCode) socket.emit("room:reconnect", { code: roomCode, token });
  });
  socket.on("disconnect", () => UI.toast("Connexion perdue, reconnexion...", "error"));

  socket.on("room:joined", ({ code, token: t }) => {
    roomCode = code; token = t || token;
    store.sset("goliath.room", code); store.sset("goliath.token", token);
    if (pendingSolo) { pendingSolo = false; socket.emit("room:addAi", { level: "normal" }); }
  });
  socket.on("room:gone", () => { clearSession(); showScreen("home"); });
  socket.on("room:kicked", () => { UI.toast("Tu as été expulsé du salon.", "error"); clearSession(); Game.reset(); showScreen("home"); });
  socket.on("room:lobbyAgain", () => { Game.reset(); showScreen("lobby"); });
  socket.on("toast", ({ text, type }) => UI.toast(text, type || "error"));

  socket.on("room:state", (r) => {
    room = r;
    Lobby.setRoom(r);
    if (r.status === "lobby") { Lobby.render(r); showScreen("lobby"); }
    else { Game.refreshHostButtons(); }
  });

  socket.on("game:state", (s) => {
    if (document.body.dataset.screen !== "game") { showScreen("game"); }
    Game.onState(s);
  });

  function clearSession() {
    store.sdel("goliath.room"); roomCode = null; room = null; chat = []; renderChat();
  }

  function leaveRoom() {
    socket.emit("room:leave");
    clearSession(); Game.reset(); showScreen("home");
  }

  // ---------- accueil ----------
  function initHome() {
    $("#input-name").value = store.get("goliath.name", "");
    $("#btn-create").addEventListener("click", () => { UI.Sound.click(); socket.emit("room:create", { name: myName(), token }); });
    $("#btn-solo").addEventListener("click", () => { UI.Sound.click(); pendingSolo = true; socket.emit("room:create", { name: myName(), token }); });
    const join = () => {
      const code = ($("#input-code").value || "").trim().toUpperCase();
      if (code.length !== 4) return UI.toast("Le code du royaume fait 4 lettres.", "error");
      socket.emit("room:join", { code, name: myName(), token });
    };
    $("#btn-join").addEventListener("click", join);
    $("#input-code").addEventListener("keydown", (e) => { if (e.key === "Enter") join(); });
    $("#input-code").addEventListener("input", (e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, ""); });
    $("#input-name").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#btn-create").click(); });
    $("#btn-rules").addEventListener("click", () => RulesModal.open());
    $("#btn-lobby-rules").addEventListener("click", () => RulesModal.open());
    $("#btn-lobby-leave").addEventListener("click", leaveRoom);
  }

  // ---------- menu de partie ----------
  function initMenu() {
    const pop = $("#menu-pop");
    $("#btn-menu").addEventListener("click", (e) => { e.stopPropagation(); pop.classList.toggle("hidden"); });
    document.addEventListener("click", () => pop.classList.add("hidden"));
    $("#btn-menu-rules").addEventListener("click", () => RulesModal.open());
    $("#btn-menu-resign").addEventListener("click", () => confirm("Abandonner la partie ? Ton armée sera réduite en ruines.", () => socket.emit("game:resign")));
    $("#btn-menu-quit").addEventListener("click", () => confirm("Quitter le royaume ? Tu abandonneras la partie en cours.", leaveRoom));
    $("#btn-sound").addEventListener("click", () => { UI.Sound.toggle(); $("#btn-sound").textContent = UI.Sound.enabled ? "🔊" : "🔇"; });
  }

  function confirm(text, yes) {
    $("#confirm-text").textContent = text;
    const ov = $("#confirm-overlay");
    ov.classList.remove("hidden");
    const close = () => ov.classList.add("hidden");
    $("#btn-confirm-no").onclick = close;
    $("#btn-confirm-yes").onclick = () => { close(); yes(); };
  }

  // ---------- tchat ----------
  function renderChat() {
    const box = $("#chat-messages");
    box.innerHTML = "";
    chat.slice(-60).forEach((m) => {
      if (m.system) { box.appendChild(el("div", { class: "chat-msg chat-msg--sys", text: m.text })); return; }
      const h = HOUSES[(m.house || 0) % HOUSES.length];
      box.appendChild(el("div", { class: "chat-msg", style: { "--hc": h.color } }, [el("b", { text: m.name + " " }), el("span", { text: m.text })]));
    });
    box.scrollTop = box.scrollHeight;
  }
  function setBadge() {
    ["#chat-badge", "#chat-fab-badge"].forEach((s) => { const b = $(s); b.textContent = unread; b.classList.toggle("hidden", unread === 0); });
  }
  function openChat() { chatOpen = true; unread = 0; setBadge(); $("#chat-panel").classList.remove("hidden"); renderChat(); setTimeout(() => $("#chat-input").focus(), 50); }
  function closeChat() { chatOpen = false; $("#chat-panel").classList.add("hidden"); }
  function initChat() {
    socket.on("chat:history", (h) => { chat = h || []; renderChat(); });
    socket.on("chat:message", (m) => {
      chat.push(m); if (chat.length > 80) chat.shift();
      if (chatOpen) renderChat(); else { unread++; setBadge(); if (!m.system) UI.Sound.click(); }
    });
    $("#btn-chat-toggle").addEventListener("click", () => (chatOpen ? closeChat() : openChat()));
    $("#btn-chat-fab").addEventListener("click", () => (chatOpen ? closeChat() : openChat()));
    $("#btn-chat-close").addEventListener("click", closeChat);
    $("#chat-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = $("#chat-input").value.trim();
      if (!v) return;
      socket.emit("chat:send", { text: v });
      $("#chat-input").value = "";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    Lobby.init(socket);
    Game.init(socket, Lobby.isHost);
    initHome(); initMenu(); initChat();
    $("#confirm-overlay").addEventListener("click", (e) => { if (e.target.id === "confirm-overlay") e.target.classList.add("hidden"); });
    showScreen("home");
  });

  window.App = { leaveRoom, confirm, socket };
})();
