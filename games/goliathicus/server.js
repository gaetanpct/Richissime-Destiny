// ============================================================
// GOLIATHICUS — Serveur (Express + Socket.io)
// Serveur autoritaire : le client ne reçoit jamais le rang des pièces
// cachées de ses adversaires.
// ============================================================
const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const { GoliathEngine } = require("./public/game/engine.js");
const Rules = require("./public/game/rules-schema.js");
const AI = require("./public/game/ai.js");
const Pieces = require("./public/game/pieces.js");
const Boards = require("./public/game/boards.js");

const PORT = process.env.PORT || 3000;
module.exports = function mount(server, prefix) {
const app = express.Router();
const io = new Server(server, { path: prefix + "/socket.io", pingInterval: 10000, pingTimeout: 20000, maxHttpBufferSize: 1e6 });

app.get("/health", (req, res) => res.json({ ok: true, rooms: rooms.size }));
app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"], maxAge: 0 }));

// ---------- salons ----------
const rooms = new Map();
const MAX_PLAYERS = 4;
const TS = Math.max(0.001, Number(process.env.GOLIATH_TIME_SCALE) || 1); // pour les tests
const GRACE_LOBBY_MS = 60 * 1000 * TS;
const AFK_AUTOPLAY_MS = 40 * 1000 * TS; // joueur déconnecté : l'IA joue à sa place
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

function freeHouse(room, wanted) {
  const used = new Set(room.players.map((p) => p.house));
  if (wanted != null && wanted >= 0 && wanted < Pieces.HOUSES.length && !used.has(wanted)) return wanted;
  for (let h = 0; h < Pieces.HOUSES.length; h++) if (!used.has(h)) return h;
  return 0;
}

function publicRoom(room, forToken) {
  return {
    code: room.code,
    status: room.status,
    hostId: room.players.find((p) => p.token === room.hostToken) ? room.players.find((p) => p.token === room.hostToken).id : null,
    settings: room.settings,
    players: room.players.map((p, seat) => ({
      id: p.id, seat, name: p.name, house: p.house, isAI: p.isAI, level: p.level, ready: p.ready,
      connected: p.connected, you: p.token === forToken, auto: !!p.auto,
    })),
  };
}

function broadcastRoom(room) {
  room.players.forEach((p) => {
    if (p.isAI || !p.socketId) return;
    try { io.to(p.socketId).emit("room:state", publicRoom(room, p.token)); } catch (e) { /* ignore */ }
  });
}

function sendGame(room) {
  if (!room.engine) return;
  const eng = room.engine;
  room.players.forEach((p, seat) => {
    if (p.isAI || !p.socketId) return;
    try {
      const st = eng.getStateFor(seat);
      st.deadline = room.deadline || null;
      st.serverTime = Date.now();
      st.autoSeats = room.players.map((q) => !!q.auto);
      io.to(p.socketId).emit("game:state", st);
    } catch (e) { console.error("sendGame", e); }
  });
}

function sysChat(room, text) {
  const msg = { id: makeId(), system: true, text, t: Date.now() };
  room.chat.push(msg); if (room.chat.length > 60) room.chat.shift();
  room.players.forEach((p) => { if (!p.isAI && p.socketId) io.to(p.socketId).emit("chat:message", msg); });
}

function deleteRoomIfEmpty(room) {
  const humans = room.players.filter((p) => !p.isAI && !p.left);
  if (!humans.length) { clearTimers(room); rooms.delete(room.code); }
}
function clearTimers(room) {
  if (room.aiTimer) clearTimeout(room.aiTimer);
  if (room.turnTimer) clearTimeout(room.turnTimer);
  if (room.setupTimer) clearTimeout(room.setupTimer);
  room.aiTimer = room.turnTimer = room.setupTimer = null;
}

function ensureHost(room) {
  const host = room.players.find((p) => p.token === room.hostToken && !p.isAI && !p.left);
  if (host) return;
  const next = room.players.find((p) => !p.isAI && !p.left && p.connected) || room.players.find((p) => !p.isAI && !p.left);
  if (next) room.hostToken = next.token;
}

// ---------- déroulement de la partie ----------
function startGame(room) {
  const humans = room.players.filter((p) => !p.isAI);
  const players = room.players.map((p) => ({ id: p.id, name: p.name, house: p.house, isAI: p.isAI, level: p.level }));
  const settings = Rules.normalize(room.settings, players.length);
  room.engine = new GoliathEngine({ players, settings });
  room.mem = players.map(() => AI.newMemory());
  room.status = "game";
  room.players.forEach((p) => { p.left = false; p.auto = false; p.ready = p.isAI; });
  room.deadline = null;
  room.setupArmed = false;
  sysChat(room, room.engine.phase === "compose" ? "🛠️ Composez vos armées, sans limite de temps." : "⚔️ La partie commence ! Disposez vos armées.");
  broadcastRoom(room);
  afterEngineChange(room);
}

// Le minuteur de placement n'existe que si l'hôte l'a demandé.
function armSetupTimer(room) {
  const eng = room.engine;
  room.setupArmed = true;
  const secs = Number(eng.settings.setupTimer) || 0;
  if (room.setupTimer) { clearTimeout(room.setupTimer); room.setupTimer = null; }
  if (secs <= 0) { room.deadline = null; return; }
  room.deadline = Date.now() + secs * 1000 * TS;
  room.setupTimer = setTimeout(() => {
    room.setupTimer = null;
    if (!room.engine || room.engine.phase !== "setup") return;
    room.engine.players.forEach((_, i) => { if (!room.engine.players[i].ready) room.engine.setupReady(i); });
    afterEngineChange(room);
  }, secs * 1000 * TS);
}

function afterEngineChange(room) {
  const eng = room.engine;
  if (!eng) return;
  if (eng.phase === "setup" && !room.setupArmed) armSetupTimer(room);
  if (eng.phase === "playing") {
    if (room.setupTimer) { clearTimeout(room.setupTimer); room.setupTimer = null; }
    // nouveau tour ? recalcule la limite de temps
    const key = eng.turn + ":" + eng.current;
    if (room.turnKey !== key) {
      room.turnKey = key;
      armTurnTimer(room);
    }
  } else if (eng.phase === "finished") {
    clearTimers(room);
    room.deadline = null;
  }
  sendGame(room);
  scheduleAi(room);
}

function armTurnTimer(room) {
  const eng = room.engine;
  if (room.turnTimer) { clearTimeout(room.turnTimer); room.turnTimer = null; }
  const secs = eng.settings.turnTimer;
  room.deadline = secs > 0 ? Date.now() + secs * 1000 * TS : null;
  if (secs > 0) {
    const key = room.turnKey;
    room.turnTimer = setTimeout(() => {
      if (!room.engine || room.turnKey !== key || room.engine.phase !== "playing") return;
      forcePlay(room, room.engine.current);
    }, secs * 1000 * TS + 300 * TS);
  }
}

// Joue un coup raisonnable à la place d'un joueur (temps écoulé ou absent).
function forcePlay(room, seat) {
  const eng = room.engine;
  if (!eng || eng.phase !== "playing" || eng.current !== seat) return;
  const level = "normal";
  let acted = false;
  for (let k = 0; k < 3 && !acted; k++) {
    let act = null;
    try { act = AI.act(eng.getStateFor(seat), room.mem[seat], level, rng); } catch (e) { console.error("forcePlay ai", e); }
    if (act && act.kind === "move") {
      const r = eng.move(seat, act.pieceId, act.to);
      if (r.ok) { acted = true; break; }
    }
    if (act && act.kind === "power") continue; // pas de pouvoir automatique : on rejoue
  }
  if (!acted) {
    const m = eng.randomLegalMove(seat);
    if (m) eng.move(seat, m.pieceId, m.to);
  }
  afterEngineChange(room);
}

function seatIsAutomatic(room, seat) {
  const p = room.players[seat];
  return p.isAI || p.auto;
}

function scheduleAi(room) {
  const eng = room.engine;
  if (!eng || room.aiTimer) return;
  if (eng.phase === "compose") {
    const pending = [];
    room.players.forEach((p, seat) => { if (seatIsAutomatic(room, seat) && !eng.players[seat].ready && !eng.players[seat].eliminated) pending.push(seat); });
    if (!pending.length) return;
    room.aiTimer = setTimeout(() => {
      room.aiTimer = null;
      if (!room.engine || room.engine.phase !== "compose") return;
      pending.forEach((seat) => {
        try {
          const lvl = room.players[seat].level || "normal";
          const act = AI.act(eng.getStateFor(seat), room.mem[seat], lvl, rng);
          if (act && act.kind === "compose") eng.composeSet(seat, act.counts);
        } catch (e) { console.error("ai compose", e); }
        eng.composeReady(seat);
      });
      afterEngineChange(room);
    }, 900 + rng() * 900);
    return;
  }
  if (eng.phase === "setup") {
    const pending = [];
    room.players.forEach((p, seat) => { if (seatIsAutomatic(room, seat) && !eng.players[seat].ready && !eng.players[seat].eliminated) pending.push(seat); });
    if (!pending.length) return;
    room.aiTimer = setTimeout(() => {
      room.aiTimer = null;
      if (!room.engine || room.engine.phase !== "setup") return;
      pending.forEach((seat) => {
        try {
          const lvl = room.players[seat].level || "normal";
          const act = AI.act(eng.getStateFor(seat), room.mem[seat], lvl, rng);
          if (act && act.kind === "place") eng.setupApply(seat, act.placement);
        } catch (e) { console.error("ai place", e); }
        eng.setupReady(seat);
      });
      afterEngineChange(room);
    }, 700 + rng() * 900);
    return;
  }
  if (eng.phase !== "playing") return;
  const seat = eng.current;
  const p = room.players[seat];
  if (!seatIsAutomatic(room, seat)) {
    // un humain déconnecté : après un délai, l'IA joue son tour
    if (!p.connected && !p.isAI) {
      room.aiTimer = setTimeout(() => {
        room.aiTimer = null;
        if (!room.engine || room.engine.phase !== "playing" || room.engine.current !== seat) return;
        if (!room.players[seat].connected) forcePlay(room, seat);
      }, AFK_AUTOPLAY_MS);
    }
    return;
  }
  const lvl = p.level || "normal";
  const slow = !!eng.settings.slowMode;
  const delay = AI.thinkDelay(lvl, slow, rng);
  const key = room.turnKey + ":" + eng.version;
  room.aiTimer = setTimeout(() => {
    room.aiTimer = null;
    if (!room.engine || room.engine.phase !== "playing" || room.engine.current !== seat) return;
    let acted = false;
    try {
      const act = AI.act(eng.getStateFor(seat), room.mem[seat], lvl, rng);
      if (act && act.kind === "move") { acted = eng.move(seat, act.pieceId, act.to).ok; }
      else if (act && act.kind === "power") { acted = eng.usePower(seat, act.data).ok; if (!acted) { /* retente un déplacement */ const m = eng.randomLegalMove(seat); if (m) { eng.move(seat, m.pieceId, m.to); } acted = true; } }
    } catch (e) { console.error("ai act", e); }
    if (!acted) {
      const m = eng.randomLegalMove(seat);
      if (m) eng.move(seat, m.pieceId, m.to);
    }
    afterEngineChange(room);
  }, delay);
}

// ---------- sockets ----------
io.on("connection", (socket) => {
  let ctx = { room: null, token: null };

  const safe = (fn) => (...args) => {
    try { fn(...args); } catch (e) { console.error("handler", e); socket.emit("toast", { type: "error", text: "Oups, une erreur est survenue côté serveur." }); }
  };
  const me = () => (ctx.room ? ctx.room.players.find((p) => p.token === ctx.token) : null);
  const seatOf = () => (ctx.room ? ctx.room.players.findIndex((p) => p.token === ctx.token) : -1);
  const toast = (text, type = "error") => socket.emit("toast", { type, text });
  const isHost = () => ctx.room && ctx.room.hostToken === ctx.token;

  function attach(room, player) {
    ctx.room = room; ctx.token = player.token;
    player.socketId = socket.id; player.connected = true; player.disconnectedAt = null;
    if (player.auto) { player.auto = false; }
    socket.join(room.code);
  }

  socket.on("room:create", safe(({ name, token }) => {
    if (ctx.room) return;
    const code = makeCode();
    if (!code) return toast("Trop de salons ouverts, réessaie dans un instant.");
    const tok = String(token || makeId() + makeId());
    const room = {
      code, status: "lobby", hostToken: tok, players: [], settings: Rules.defaults(), chat: [],
      engine: null, mem: null, aiTimer: null, turnTimer: null, setupTimer: null, deadline: null, turnKey: null, created: Date.now(),
    };
    const player = { id: makeId(), token: tok, socketId: socket.id, name: cleanName(name, "Joueur 1"), house: 0, isAI: false, level: null, ready: true, connected: true, left: false, auto: false };
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
    // reconnexion éventuelle
    const existing = room.players.find((p) => p.token === tok && !p.isAI);
    if (existing) {
      attach(room, existing);
      socket.emit("room:joined", { code, token: tok });
      broadcastRoom(room);
      if (room.engine) { sendGame(room); socket.emit("chat:history", room.chat); }
      else socket.emit("chat:history", room.chat);
      if (room.engine) scheduleAi(room);
      return;
    }
    if (room.status !== "lobby") return toast("Cette partie a déjà commencé.");
    if (room.players.length >= MAX_PLAYERS) return toast("Le salon est complet (4 joueurs maximum).");
    const player = { id: makeId(), token: tok, socketId: socket.id, name: cleanName(name, "Joueur " + (room.players.length + 1)), house: freeHouse(room, null), isAI: false, level: null, ready: false, connected: true, left: false, auto: false };
    room.players.push(player);
    attach(room, player);
    socket.emit("room:joined", { code, token: tok });
    socket.emit("chat:history", room.chat);
    sysChat(room, `${player.name} rejoint le royaume.`);
    broadcastRoom(room);
  }));

  socket.on("room:reconnect", safe(({ code, token }) => {
    if (ctx.room) return;
    const room = rooms.get(String(code || "").toUpperCase());
    if (!room) return socket.emit("room:gone");
    const p = room.players.find((x) => x.token === token && !x.isAI && !x.left);
    if (!p) return socket.emit("room:gone");
    attach(room, p);
    socket.emit("room:joined", { code: room.code, token });
    socket.emit("chat:history", room.chat);
    broadcastRoom(room);
    if (room.engine) { sendGame(room); scheduleAi(room); }
  }));

  socket.on("room:leave", safe(() => leave(true)));

  function leave(explicit) {
    const room = ctx.room;
    if (!room) return;
    const p = me();
    const seat = seatOf();
    socket.leave(room.code);
    if (p) {
      if (room.status === "lobby") {
        room.players = room.players.filter((x) => x !== p);
        sysChat(room, `${p.name} quitte le salon.`);
      } else if (explicit) {
        p.left = true; p.connected = false; p.socketId = null;
        if (room.engine && room.engine.phase !== "finished") {
          room.engine.resign(seat);
          afterEngineChange(room);
        }
        sysChat(room, `${p.name} a quitté la partie.`);
      }
    }
    ctx.room = null; ctx.token = null;
    ensureHost(room);
    if (room.status === "lobby") { broadcastRoom(room); }
    else { broadcastRoom(room); }
    deleteRoomIfEmpty(room);
  }

  socket.on("disconnect", safe(() => {
    const room = ctx.room; const p = me();
    if (!room || !p) return;
    p.connected = false; p.socketId = null; p.disconnectedAt = Date.now();
    if (room.status === "lobby") {
      setTimeout(() => {
        if (!rooms.has(room.code)) return;
        const still = room.players.find((x) => x === p);
        if (still && !still.connected && room.status === "lobby") {
          room.players = room.players.filter((x) => x !== p);
          ensureHost(room); broadcastRoom(room); deleteRoomIfEmpty(room);
        }
      }, GRACE_LOBBY_MS);
    } else {
      // en partie : on garde la place, l'IA prend la relève si nécessaire
      setTimeout(() => {
        if (!rooms.has(room.code)) return;
        const still = room.players.find((x) => x === p);
        if (still && !still.connected && room.engine && room.engine.phase !== "finished") {
          still.auto = true; broadcastRoom(room); sendGame(room); scheduleAi(room);
        }
        deleteRoomIfEmpty(room);
      }, 120 * 1000 * TS);
      // si tous les humains sont partis depuis longtemps, on libère la mémoire
      setTimeout(() => {
        if (!rooms.has(room.code)) return;
        if (room.players.filter((x) => !x.isAI && x.connected).length === 0 && Date.now() - p.disconnectedAt > 9 * 60 * 1000) {
          clearTimers(room); rooms.delete(room.code);
        }
      }, 10 * 60 * 1000);
      ensureHost(room);
      broadcastRoom(room);
      if (room.engine) { sendGame(room); scheduleAi(room); }
    }
  }));

  // ----- salon -----
  socket.on("room:settings", safe(({ settings }) => {
    const room = ctx.room; if (!room || !isHost() || room.status !== "lobby") return;
    room.settings = Rules.normalize(Object.assign({}, room.settings, settings || {}), room.players.length);
    broadcastRoom(room);
  }));

  socket.on("room:house", safe(({ house }) => {
    const room = ctx.room; const p = me(); if (!room || !p || room.status !== "lobby") return;
    house = Number(house);
    if (!(house >= 0 && house < Pieces.HOUSES.length)) return;
    const holder = room.players.find((x) => x !== p && x.house === house);
    if (holder && !holder.isAI) return toast("Cette maison est déjà prise !");
    if (holder) holder.house = p.house; // une IA cède volontiers sa maison
    p.house = house;
    broadcastRoom(room);
  }));

  socket.on("room:name", safe(({ name }) => {
    const room = ctx.room; const p = me(); if (!room || !p || room.status !== "lobby") return;
    p.name = cleanName(name, p.name);
    broadcastRoom(room);
  }));

  socket.on("room:ready", safe(({ ready }) => {
    const room = ctx.room; const p = me(); if (!room || !p || room.status !== "lobby") return;
    p.ready = !!ready;
    broadcastRoom(room);
  }));

  socket.on("room:addAi", safe(({ level }) => {
    const room = ctx.room; if (!room || !isHost() || room.status !== "lobby") return;
    if (room.players.length >= MAX_PLAYERS) return toast("Le salon est complet.");
    const lv = AI.LEVELS[level] ? level : "normal";
    const used = new Set(room.players.map((p) => p.name));
    const pool = AI.NAMES.filter((n) => !used.has(n));
    const name = (pool.length ? pool[Math.floor(rng() * pool.length)] : "Robot " + room.players.length);
    room.players.push({ id: makeId(), token: null, socketId: null, name, house: freeHouse(room, null), isAI: true, level: lv, ready: true, connected: true, left: false, auto: false });
    room.settings = Rules.normalize(room.settings, room.players.length);
    broadcastRoom(room);
  }));

  socket.on("room:removeAi", safe(({ id }) => {
    const room = ctx.room; if (!room || !isHost() || room.status !== "lobby") return;
    room.players = room.players.filter((p) => !(p.isAI && p.id === id));
    room.settings = Rules.normalize(room.settings, room.players.length);
    broadcastRoom(room);
  }));

  socket.on("room:aiLevel", safe(({ id, level }) => {
    const room = ctx.room; if (!room || !isHost() || room.status !== "lobby") return;
    const p = room.players.find((x) => x.isAI && x.id === id);
    if (p && AI.LEVELS[level]) { p.level = level; broadcastRoom(room); }
  }));

  socket.on("room:kick", safe(({ id }) => {
    const room = ctx.room; if (!room || !isHost() || room.status !== "lobby") return;
    const p = room.players.find((x) => x.id === id);
    if (!p || p.token === ctx.token) return;
    if (!p.isAI && p.socketId) io.to(p.socketId).emit("room:kicked");
    room.players = room.players.filter((x) => x !== p);
    if (!p.isAI && p.socketId) {
      const s = io.sockets.sockets.get(p.socketId);
      if (s) s.leave(room.code);
    }
    room.settings = Rules.normalize(room.settings, room.players.length);
    broadcastRoom(room);
  }));

  socket.on("room:moveSeat", safe(({ id, dir }) => {
    const room = ctx.room; if (!room || !isHost() || room.status !== "lobby") return;
    const i = room.players.findIndex((p) => p.id === id);
    const j = i + (dir > 0 ? 1 : -1);
    if (i < 0 || j < 0 || j >= room.players.length) return;
    [room.players[i], room.players[j]] = [room.players[j], room.players[i]];
    broadcastRoom(room);
  }));

  socket.on("room:start", safe(() => {
    const room = ctx.room; if (!room || !isHost() || room.status !== "lobby") return;
    if (room.players.length < 2) return toast("Il faut au moins 2 joueurs (tu peux ajouter une IA !).");
    if (room.players.some((p) => !p.isAI && !p.ready && p.token !== ctx.token)) return toast("Tous les joueurs ne sont pas prêts.");
    room.settings = Rules.normalize(room.settings, room.players.length);
    if (room.settings.teams && room.players.length !== 4) room.settings.teams = false;
    startGame(room);
  }));

  socket.on("room:backToLobby", safe(() => {
    const room = ctx.room; if (!room || !isHost()) return;
    if (!room.engine || room.engine.phase !== "finished") return;
    clearTimers(room);
    room.engine = null; room.mem = null; room.status = "lobby"; room.turnKey = null; room.deadline = null; room.setupArmed = false;
    room.players = room.players.filter((p) => !p.left && (p.isAI || p.connected));
    room.players.forEach((p) => { p.ready = p.isAI || p.token === room.hostToken; p.auto = false; });
    ensureHost(room);
    room.settings = Rules.normalize(room.settings, room.players.length);
    io.to(room.code).emit("room:lobbyAgain");
    broadcastRoom(room);
  }));

  // ----- partie -----
  const inGame = () => ctx.room && ctx.room.engine && ctx.room.status === "game";

  socket.on("game:compose", safe(({ counts }) => {
    if (!inGame()) return;
    const r = ctx.room.engine.composeSet(seatOf(), counts && typeof counts === "object" ? counts : {});
    if (!r.ok) return toast(r.error);
    sendGame(ctx.room);
  }));
  socket.on("game:composePreset", safe(({ preset }) => {
    if (!inGame()) return;
    const r = ctx.room.engine.composePreset(seatOf(), String(preset || ""));
    if (!r.ok) return toast(r.error);
    sendGame(ctx.room);
  }));
  socket.on("game:composeReady", safe(({ ready }) => {
    if (!inGame()) return;
    const room = ctx.room;
    const r = room.engine.composeReady(seatOf(), ready !== false);
    if (!r.ok) return toast(r.error);
    afterEngineChange(room);
    broadcastRoom(room);
  }));
  socket.on("game:setupSwap", safe(({ a, b }) => {
    if (!inGame()) return;
    const r = ctx.room.engine.setupSwap(seatOf(), a, b);
    if (!r.ok) return toast(r.error);
    sendGame(ctx.room);
  }));
  socket.on("game:setupRandom", safe(({ style }) => {
    if (!inGame()) return;
    const st = ["random", "defensive", "aggressive"].includes(style) ? style : "random";
    const r = ctx.room.engine.setupRandom(seatOf(), st);
    if (!r.ok) return toast(r.error);
    sendGame(ctx.room);
  }));
  socket.on("game:setupReady", safe(({ ready }) => {
    if (!inGame()) return;
    const room = ctx.room;
    const seat = seatOf();
    const r = room.engine.setupReady(seat, ready !== false);
    if (!r.ok) return toast(r.error);
    afterEngineChange(room);
    broadcastRoom(room);
  }));
  socket.on("game:move", safe(({ pieceId, to }) => {
    if (!inGame()) return;
    const room = ctx.room;
    const r = room.engine.move(seatOf(), String(pieceId), to);
    if (!r.ok) return toast(r.error);
    afterEngineChange(room);
  }));
  socket.on("game:power", safe(({ data }) => {
    if (!inGame()) return;
    const room = ctx.room;
    const r = room.engine.usePower(seatOf(), data || {});
    if (!r.ok) return toast(r.error);
    afterEngineChange(room);
  }));
  socket.on("game:resign", safe(() => {
    if (!inGame()) return;
    const room = ctx.room;
    const seat = seatOf();
    room.engine.resign(seat);
    afterEngineChange(room);
  }));

  // ----- tchat -----
  socket.on("chat:send", safe(({ text }) => {
    const room = ctx.room; const p = me(); if (!room || !p) return;
    const t = String(text || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 200);
    if (!t) return;
    const msg = { id: makeId(), from: p.id, name: p.name, house: p.house, text: t, t: Date.now() };
    room.chat.push(msg); if (room.chat.length > 60) room.chat.shift();
    room.players.forEach((q) => { if (!q.isAI && q.socketId) io.to(q.socketId).emit("chat:message", msg); });
  }));
});

// ménage des salons abandonnés
setInterval(() => {
  const now = Date.now();
  rooms.forEach((room, code) => {
    const anyConnected = room.players.some((p) => !p.isAI && p.connected);
    if (!anyConnected && now - room.created > 15 * 60 * 1000) { clearTimers(room); rooms.delete(code); }
  });
}, 5 * 60 * 1000);

return app;
};

