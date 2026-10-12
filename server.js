// ============================================================
// RICHISSIME DESTINY — Serveur (Express + Socket.io)
// Serveur autoritaire. Le contenu des scènes et le moteur restent dans lib/,
// jamais envoyés au navigateur. Chaque joueur reçoit uniquement sa vue filtrée.
// ============================================================
const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const { Game } = require("./lib/engine");
const R = require("./lib/rules");
const Settings = require("./lib/settings");
const social = require("./lib/social");
const View = require("./lib/view");
const kit = require("./lib/content");

const PORT = process.env.PORT || 3000;
const TS = Math.max(0.001, Number(process.env.RICHISSIME_TIME_SCALE) || 1);
const app = express();
const server = http.createServer(app);
const io = new Server(server, { pingInterval: 10000, pingTimeout: 20000, maxHttpBufferSize: 1e6 });

app.get("/health", (req, res) => res.json({ ok: true, rooms: rooms.size, scenes: kit.EVENTS.length }));
app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"], maxAge: 0 }));

const rooms = new Map();
const MAX_PLAYERS = 6;
const GRACE_LOBBY_MS = 60 * 1000 * TS;
const AFK_AUTO_MS = 45 * 1000 * TS;
const ACCESSORIES = ["🎩", "👑", "🕶️", "🎀", "🧢", "🎓", "🪖", "🤠", "🧐", "🎧", "🌸", "🦊", "🐱", "🐸", "🦄", "🐙"];
const COLORS = ["#c9a13b", "#e5583c", "#2f7f9d", "#6a4fb3", "#2e9a62", "#d4549a", "#e08a1e", "#3a3f6b"];
const BOT_NAMES = ["Gaston", "Mélusine", "Barnabé", "Pétronille", "Anselme", "Clémentine", "Fulbert", "Gudule", "Hippolyte", "Josette", "Léonce", "Marcelline"];
const rng = Math.random;

function makeCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  for (let tries = 0; tries < 200; tries++) {
    let c = "";
    for (let i = 0; i < 4; i++) c += letters[Math.floor(rng() * letters.length)];
    if (!rooms.has(c)) return c;
  }
  return null;
}
function makeId() { return Math.random().toString(36).slice(2, 10); }
function cleanName(s, fallback) {
  const t = String(s || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 16);
  return t || fallback;
}
function cleanAvatar(a, prev) {
  const acc = a && ACCESSORIES.includes(a.acc) ? a.acc : prev ? prev.acc : ACCESSORIES[0];
  const color = a && /^#[0-9a-fA-F]{6}$/.test(String(a.color || "")) ? a.color : prev ? prev.color : COLORS[0];
  return { acc, color };
}

function META() {
  return {
    schema: Settings.SCHEMA,
    gifts: Object.keys(R.GIFTS).map((k) => ({ id: k, l: R.GIFTS[k].l, ic: R.GIFTS[k].ic, d: R.GIFTS[k].d })),
    accessories: ACCESSORIES, colors: COLORS, maxPlayers: MAX_PLAYERS,
    stats: R.STATS, traits: R.TRAITS,
    scenes: kit.EVENTS.length,
  };
}

function publicRoom(room, forToken) {
  const host = room.players.find((p) => p.token === room.hostToken);
  return {
    code: room.code, status: room.status, hostId: host ? host.id : null, settings: room.settings,
    players: room.players.map((p, seat) => ({
      id: p.id, seat, name: p.name, gender: p.gender, avatar: p.avatar, gift: p.gift, bot: p.isBot, ready: p.ready,
      connected: p.isBot ? true : p.connected, you: p.token === forToken, auto: !!p.auto, left: !!p.left,
    })),
  };
}
function broadcastRoom(room) {
  room.players.forEach((p) => {
    if (p.isBot || !p.socketId) return;
    try { io.to(p.socketId).emit("room:state", publicRoom(room, p.token)); } catch (e) { /* ignore */ }
  });
}

// ---------- état de jeu, envoyé seulement s'il a changé ----------
function sendGame(room, force) {
  if (!room.engine) return;
  const eng = room.engine;
  room.players.forEach((p, seat) => {
    if (p.isBot || !p.socketId) return;
    try {
      const st = View.getStateFor(eng, seat);
      const key = JSON.stringify(st);
      if (!force && p.lastKey === key) return;
      p.lastKey = key;
      st.serverTime = Date.now();
      st.autoSeats = room.players.map((q) => !!q.auto);
      io.to(p.socketId).emit("game:state", st);
    } catch (e) { console.error("sendGame", e); }
  });
}

function sysChat(room, text) {
  const msg = { id: makeId(), system: true, text, t: Date.now() };
  room.chat.push(msg); if (room.chat.length > 60) room.chat.shift();
  room.players.forEach((p) => { if (!p.isBot && p.socketId) io.to(p.socketId).emit("chat:message", msg); });
}

function clearTimers(room) { if (room.loop) clearInterval(room.loop); room.loop = null; }
function deleteRoomIfEmpty(room) {
  const humans = room.players.filter((p) => !p.isBot && !p.left);
  if (!humans.length) { clearTimers(room); rooms.delete(room.code); }
}
function ensureHost(room) {
  const host = room.players.find((p) => p.token === room.hostToken && !p.isBot && !p.left);
  if (host) return;
  const next = room.players.find((p) => !p.isBot && !p.left && p.connected) || room.players.find((p) => !p.isBot && !p.left);
  if (next) room.hostToken = next.token;
}

// ---------- partie ----------
function startGame(room) {
  const players = room.players.map((p) => ({ name: p.name, gender: p.gender, gift: p.gift, avatar: p.avatar, bot: p.isBot }));
  room.settings = Settings.normalize(room.settings);
  room.engine = new Game({ settings: room.settings, rng: Math.random, timeScale: TS, players });
  room.status = "game";
  room.players.forEach((p) => { p.left = false; p.auto = false; p.lastKey = null; });
  room.engine.start();
  sysChat(room, "🎓 La partie commence ! Bonne vie à tous.");
  broadcastRoom(room);
  clearTimers(room);
  room.loop = setInterval(() => stepRoom(room), 400);
  sendGame(room, true);
}

function syncAuto(room) {
  const eng = room.engine;
  room.players.forEach((p, seat) => {
    if (p.isBot) return;
    const ep = eng.players[seat];
    const away = p.left || (!p.connected && p.disconnectedAt && Date.now() - p.disconnectedAt > AFK_AUTO_MS);
    if (away && !ep.auto) { ep.auto = true; p.auto = true; broadcastRoom(room); }
    if (!away && p.connected && p.auto && ep.auto && !p.left) { /* reprise de contrôle à la reconnexion */ }
  });
}

function stepRoom(room) {
  const eng = room.engine;
  if (!eng) return;
  try {
    syncAuto(room);
    eng.tick();
    if (eng.phase === "over" && room.status === "game") {
      room.status = "over";
      sysChat(room, "🪦 La partie est terminée. Découvrez le classement.");
      broadcastRoom(room);
    }
  } catch (e) { console.error("tick", e); }
  sendGame(room);
}

io.on("connection", (socket) => {
  const ctx = { room: null, token: null };
  const safe = (fn) => (...args) => {
    try { fn(...args); } catch (e) { console.error("handler", e); socket.emit("toast", { type: "error", text: "Oups, une erreur est survenue côté serveur." }); }
  };
  const me = () => (ctx.room ? ctx.room.players.find((p) => p.token === ctx.token) : null);
  const seatOf = () => (ctx.room ? ctx.room.players.findIndex((p) => p.token === ctx.token) : -1);
  const toast = (text, type = "error") => socket.emit("toast", { type, text });
  const isHost = () => ctx.room && ctx.room.hostToken === ctx.token;
  socket.emit("meta", META());

  function attach(room, player) {
    ctx.room = room; ctx.token = player.token;
    player.socketId = socket.id; player.connected = true; player.disconnectedAt = null; player.lastKey = null;
    if (room.engine && room.status !== "lobby") {
      const ep = room.engine.players[room.players.indexOf(player)];
      if (ep && !ep.bot) { ep.auto = false; ep.missed = 0; }
      player.auto = false;
    }
    socket.join(room.code);
  }
  function newPlayer(room, tok, name) {
    const idx = room.players.length;
    return { id: makeId(), token: tok, socketId: socket.id, name: cleanName(name, "Joueur " + (idx + 1)), gender: idx % 2 ? "m" : "f", avatar: { acc: ACCESSORIES[idx % ACCESSORIES.length], color: COLORS[idx % COLORS.length] }, gift: "cerveau", isBot: false, ready: false, connected: true, left: false, auto: false };
  }

  socket.on("room:create", safe(({ name, token }) => {
    if (ctx.room) return;
    const code = makeCode();
    if (!code) return toast("Trop de salons ouverts, réessaie dans un instant.");
    const tok = String(token || makeId() + makeId());
    const room = { code, status: "lobby", hostToken: tok, players: [], settings: Settings.defaults(), chat: [], engine: null, loop: null, created: Date.now() };
    const player = newPlayer(room, tok, name); player.ready = true;
    room.players.push(player);
    rooms.set(code, room);
    attach(room, player);
    socket.emit("room:joined", { code, token: tok });
    broadcastRoom(room);
  }));

  socket.on("room:join", safe(({ code, name, token }) => {
    if (ctx.room) return;
    code = String(code || "").toUpperCase().trim();
    const room = rooms.get(code);
    if (!room) return toast("Ce salon n'existe pas. Vérifie le code !");
    const tok = String(token || makeId() + makeId());
    const existing = room.players.find((p) => p.token === tok && !p.isBot);
    if (existing) {
      attach(room, existing);
      socket.emit("room:joined", { code, token: tok });
      socket.emit("chat:history", room.chat);
      broadcastRoom(room);
      if (room.engine) sendGame(room, true);
      return;
    }
    if (room.status !== "lobby") return toast("Cette partie a déjà commencé.");
    if (room.players.length >= MAX_PLAYERS) return toast("Le salon est complet (6 joueurs maximum).");
    const player = newPlayer(room, tok, name);
    room.players.push(player);
    attach(room, player);
    socket.emit("room:joined", { code, token: tok });
    socket.emit("chat:history", room.chat);
    sysChat(room, player.name + " rejoint la partie.");
    broadcastRoom(room);
  }));

  socket.on("room:reconnect", safe(({ code, token }) => {
    if (ctx.room) return;
    const room = rooms.get(String(code || "").toUpperCase());
    if (!room) return socket.emit("room:gone");
    const p = room.players.find((x) => x.token === token && !x.isBot && !x.left);
    if (!p) return socket.emit("room:gone");
    attach(room, p);
    socket.emit("room:joined", { code: room.code, token });
    socket.emit("chat:history", room.chat);
    broadcastRoom(room);
    if (room.engine) sendGame(room, true);
  }));

  function leave(explicit) {
    const room = ctx.room; if (!room) return;
    const p = me(); const seat = seatOf();
    socket.leave(room.code);
    if (p) {
      if (room.status === "lobby") {
        room.players = room.players.filter((x) => x !== p);
        sysChat(room, p.name + " quitte le salon.");
      } else if (explicit) {
        p.left = true; p.connected = false; p.socketId = null;
        if (room.engine && room.engine.players[seat]) room.engine.players[seat].auto = true;
        sysChat(room, p.name + " a quitté la partie, un pilote automatique prend la relève.");
      }
    }
    ctx.room = null; ctx.token = null;
    ensureHost(room);
    broadcastRoom(room);
    deleteRoomIfEmpty(room);
  }
  socket.on("room:leave", safe(() => leave(true)));

  socket.on("disconnect", safe(() => {
    const room = ctx.room; const p = me();
    if (!room || !p) return;
    p.connected = false; p.socketId = null; p.disconnectedAt = Date.now();
    if (room.status === "lobby") {
      setTimeout(() => {
        if (!rooms.has(room.code)) return;
        if (!p.connected && room.status === "lobby") {
          room.players = room.players.filter((x) => x !== p);
          ensureHost(room); broadcastRoom(room); deleteRoomIfEmpty(room);
        }
      }, GRACE_LOBBY_MS);
    } else {
      ensureHost(room);
      broadcastRoom(room);
      setTimeout(() => {
        if (!rooms.has(room.code)) return;
        if (room.players.filter((x) => !x.isBot && x.connected).length === 0 && room.status !== "lobby") { clearTimers(room); rooms.delete(room.code); }
      }, 12 * 60 * 1000);
    }
  }));

  // ----- salon -----
  socket.on("room:settings", safe(({ settings }) => {
    const room = ctx.room; if (!room || !isHost() || room.status !== "lobby") return;
    room.settings = Settings.normalize(Object.assign({}, room.settings, settings || {}));
    broadcastRoom(room);
  }));
  socket.on("room:char", safe(({ name, gender, avatar, gift }) => {
    const room = ctx.room; const p = me(); if (!room || !p || room.status !== "lobby") return;
    if (name !== undefined) p.name = cleanName(name, p.name);
    if (gender === "m" || gender === "f") p.gender = gender;
    if (avatar) p.avatar = cleanAvatar(avatar, p.avatar);
    if (gift && R.GIFTS[gift]) p.gift = gift;
    broadcastRoom(room);
  }));
  socket.on("room:ready", safe(({ ready }) => {
    const room = ctx.room; const p = me(); if (!room || !p || room.status !== "lobby") return;
    p.ready = !!ready; broadcastRoom(room);
  }));
  socket.on("room:addBot", safe(() => {
    const room = ctx.room; if (!room || !isHost() || room.status !== "lobby") return;
    if (room.players.length >= MAX_PLAYERS) return toast("Le salon est complet.");
    const used = new Set(room.players.map((p) => p.name));
    const pool = BOT_NAMES.filter((n) => !used.has(n));
    const name = pool.length ? pool[Math.floor(rng() * pool.length)] : "Robot " + room.players.length;
    const idx = room.players.length;
    const gifts = Object.keys(R.GIFTS);
    room.players.push({ id: makeId(), token: null, socketId: null, name, gender: rng() < 0.5 ? "m" : "f", avatar: { acc: ACCESSORIES[(idx * 3 + 5) % ACCESSORIES.length], color: COLORS[(idx + 2) % COLORS.length] }, gift: gifts[Math.floor(rng() * gifts.length)], isBot: true, ready: true, connected: true, left: false, auto: false });
    broadcastRoom(room);
  }));
  socket.on("room:removeBot", safe(({ id }) => {
    const room = ctx.room; if (!room || !isHost() || room.status !== "lobby") return;
    room.players = room.players.filter((p) => !(p.isBot && p.id === id));
    broadcastRoom(room);
  }));
  socket.on("room:kick", safe(({ id }) => {
    const room = ctx.room; if (!room || !isHost() || room.status !== "lobby") return;
    const p = room.players.find((x) => x.id === id);
    if (!p || p.token === ctx.token) return;
    if (!p.isBot && p.socketId) { io.to(p.socketId).emit("room:kicked"); const s = io.sockets.sockets.get(p.socketId); if (s) s.leave(room.code); }
    room.players = room.players.filter((x) => x !== p);
    broadcastRoom(room);
  }));
  socket.on("room:start", safe(() => {
    const room = ctx.room; if (!room || !isHost() || room.status !== "lobby") return;
    if (room.players.length < 1) return toast("Il faut au moins un joueur.");
    if (room.players.some((p) => !p.isBot && !p.ready && p.token !== ctx.token)) return toast("Tous les joueurs ne sont pas prêts.");
    startGame(room);
  }));
  socket.on("room:backToLobby", safe(() => {
    const room = ctx.room; if (!room || !isHost()) return;
    if (!room.engine || room.engine.phase !== "over") return;
    clearTimers(room);
    room.engine = null; room.status = "lobby";
    room.players = room.players.filter((p) => !p.left && (p.isBot || p.connected));
    room.players.forEach((p) => { p.ready = p.isBot || p.token === room.hostToken; p.auto = false; p.lastKey = null; });
    ensureHost(room);
    io.to(room.code).emit("room:lobbyAgain");
    broadcastRoom(room);
  }));
  socket.on("host:force", safe(() => {
    const room = ctx.room; if (!room || !isHost() || !room.engine) return;
    const eng = room.engine; const now = Date.now();
    if (["agenda", "respond", "recap"].includes(eng.phase)) eng.deadline = now - 1;
    else if (eng.phase === "group" && eng.group) eng.group.deadline = now - 1;
    else if (eng.phase === "event") eng.players.forEach((p) => { if (p.alive && p.scene) p.scene.deadline = now - 1; });
    stepRoom(room);
  }));

  // ----- partie -----
  const inGame = () => ctx.room && ctx.room.engine && ctx.room.status === "game";
  const after = () => { sendGame(ctx.room); };
  socket.on("game:agenda", safe((plan) => {
    if (!inGame()) return;
    const r = ctx.room.engine.submitAgenda(seatOf(), plan || {});
    if (!r.ok && r.error) toast(r.error);
    after();
  }));
  socket.on("game:finance", safe((op) => {
    if (!inGame()) return;
    const r = ctx.room.engine.finance(seatOf(), op || {});
    if (!r.ok && r.error) toast(r.error);
    after();
  }));
  socket.on("game:scene", safe(({ i }) => {
    if (!inGame()) return;
    const r = ctx.room.engine.chooseScene(seatOf(), Number(i));
    if (!r.ok && r.error) toast(r.error);
    after();
  }));
  socket.on("game:continue", safe(() => {
    if (!inGame()) return;
    ctx.room.engine.continueScene(seatOf());
    after();
  }));
  socket.on("game:respond", safe(({ id, answer }) => {
    if (!inGame()) return;
    social.respond(ctx.room.engine, seatOf(), Number(id), ["yes", "no", "half"].includes(answer) ? answer : "no");
    after();
  }));
  socket.on("game:group", safe(({ value }) => {
    if (!inGame()) return;
    const r = social.groupChoose(ctx.room.engine, seatOf(), value);
    if (!r.ok && r.error) toast(r.error);
    after();
  }));
  socket.on("game:groupReady", safe(() => {
    if (!inGame()) return;
    social.groupReady(ctx.room.engine, seatOf());
    after();
  }));
  socket.on("game:recapReady", safe(() => {
    if (!inGame()) return;
    ctx.room.engine.readyRecap(seatOf());
    after();
  }));

  // ----- tchat -----
  socket.on("chat:send", safe(({ text }) => {
    const room = ctx.room; const p = me(); if (!room || !p) return;
    const t = String(text || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 200);
    if (!t) return;
    const msg = { id: makeId(), from: p.id, name: p.name, avatar: p.avatar, text: t, t: Date.now() };
    room.chat.push(msg); if (room.chat.length > 60) room.chat.shift();
    room.players.forEach((q) => { if (!q.isBot && q.socketId) io.to(q.socketId).emit("chat:message", msg); });
  }));
});

setInterval(() => {
  const now = Date.now();
  rooms.forEach((room, code) => {
    const anyConnected = room.players.some((p) => !p.isBot && p.connected);
    if (!anyConnected && now - room.created > 15 * 60 * 1000) { clearTimers(room); rooms.delete(code); }
  });
}, 5 * 60 * 1000);

server.listen(PORT, () => console.log("Richissime Destiny écoute sur le port " + PORT));
