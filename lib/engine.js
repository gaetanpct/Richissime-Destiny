// ============================================================
// RICHISSIME DESTINY — Moteur de partie
// Une année = une manche. Tous les joueurs vivent la même année en parallèle.
// Phases : agenda → réponses → scène collective → événements → bilan.
// ============================================================
const R = require("./rules");
const C = require("./core");
const FX = require("./fx");
const kit = require("./content");
const { POOLS, pick, firstName } = require("./pools");
const settingsLib = require("./settings");
const social = require("./social");
const sys = require("./sys");
const life = require("./life");
const EXP = require("./experience");

const HABITS = {
  sport: { key: "sport", stat: "sport", spill: { charme: 1, sante: 1, courage: 0.4 }, ic: "💪", flag: "athletique", milestone: ["Trois ans de régularité. Ton corps change, ton allure aussi, et les regards avec.", "Six ans à t'entretenir. Ta silhouette et ta confiance te précèdent dans toutes les pièces.", "Dix ans de discipline. Tu es devenu(e) quelqu'un qu'on remarque dès l'entrée."], click: "Un déclic à la salle. Tu repousses tes limites, et ton charme grimpe avec ta forme." },
  sport_prison: { key: "sport", stat: "sport", spill: { courage: 0.6, charme: 0.4 }, ic: "💪", milestone: ["Trois ans de fonte en cellule. Les autres te regardent différemment.", "Six ans de pompes. Tu as un physique redoutable.", "Dix ans d'entraînement. Tu es une légende de la cour."], click: "Tu soulèves plus lourd que jamais, la cour s'en rend compte." },
  formation: { key: "intel", stat: "intel", spill: { ambition: 0.6, repute: 0.3 }, ic: "🎓", flag: "formation_recente", milestone: ["Trois formations de suite. Tu deviens la personne qu'on consulte pour les sujets difficiles.", "Six ans de formation continue. On te confie les dossiers que personne d'autre ne comprend.", "Dix ans d'apprentissage. On t'appelle pour ton avis dans les grandes décisions."], click: "Un cours te fait tout comprendre d'un coup. Ton cerveau passe à la vitesse supérieure." },
  formation_metier: { key: "intel", stat: "intel", spill: { ambition: 0.5 }, ic: "🎓", flag: "formation_recente", milestone: ["Trois ans de formations. Ton métier n'a plus de secrets.", "Six ans à te perfectionner. Tu formes les autres.", "Dix ans de savoir-faire accumulé. Tu es une référence."], click: "Tu comprends enfin un point technique qui bloquait tout. Tu progresses d'un coup." },
  lecture: { key: "intel", stat: "intel", spill: { creatif: 0.5 }, ic: "📖", milestone: ["Trois ans de lecture. Tu cites des auteurs sans y penser.", "Six ans de bibliothèque. Tu as une culture qui impressionne.", "Dix ans de livres. Tu es un puits de références."], click: "Un livre te bouleverse et change ta façon de penser." },
  langue: { key: "intel", stat: "intel", spill: { sociable: 0.5, charme: 0.3 }, ic: "🗣️", flag: "formation_recente", milestone: ["Trois ans de pratique. Tu rêves déjà dans une autre langue.", "Six ans de cours. Tu parles couramment et tu t'ouvres des portes.", "Dix ans de langues. Tu passes d'un pays à l'autre sans effort."], click: "Tu te mets à penser dans la langue étrangère. Tout devient plus simple." },
  theatre: { key: "charme", stat: "charme", spill: { sociable: 0.8, creatif: 0.6, courage: 0.4 }, ic: "🎭", milestone: ["Trois ans de scène. Tu captes une salle sans effort.", "Six ans de théâtre. Ta voix et ta présence marquent les esprits.", "Dix ans de planches. Tu as une présence incroyable."], click: "Un soir, la salle est suspendue à ta voix. Tu comprends ce que tu peux faire." },
  soiree_mondaine: { key: "charme", stat: "charme", spill: { sociable: 0.8, repute: 0.5 }, ic: "🍾", milestone: ["Trois ans de soirées. Ton carnet d'adresses est impressionnant.", "Six ans de mondanités. Tout le monde veut t'inviter.", "Dix ans de cocktails. Tu es un habitué de la haute société."], click: "Une conversation lors d'une soirée ouvre toutes les portes. Ton aura grandit." },
  arts: { key: "creatif", stat: "creatif", spill: { charme: 0.5, bonheur: 0.5 }, ic: "🎨", milestone: ["Trois ans de pratique. Ton style se dessine.", "Six ans d'art. Tu as un style reconnaissable.", "Dix ans de création. On parle de toi dans le milieu."], click: "Une idée géniale te traverse. Ta créativité bondit." },
};
const GRAND_BETA = { immo: 0.3, entreprise: 0.45, art: 0.55, or: -0.5, voiture: 0 };
const MARKET_BETA = { etf: 1, actions: 1.3, matieres: 0.6, crypto: 1.8, levier: 2, startup: 0.5, pierre: 0.25, art: 0.5 };
const SHADY = ["magouille", "contrebande", "faux_diplome", "detournement", "sabotage_collegue", "incendie_assurance", "casse_bande", "evasion", "fausse_maladie", "fausses_montres", "pari_clandestin", "soiree_clandestine"];
const PROJECT_FLAGS = ["cherche_amour", "en_voyage", "fete_annee", "magouille_annee", "side_annee", "travail_acharne", "famille_annee", "formation_annee", "epargne_annee", "sport_annee", "soin_annee"];

const DEATH_CAUSES = {
  enfance: ["d'une chute de toboggan légendaire", "d'une maladie très rare", "d'une grippe qui a mal tourné", "d'une pneumonie fulgurante", "d'une allergie imprévue", "d'une fièvre qui ne descend pas"],
  ado: ["d'un accident de trottinette", "d'une chute en skate", "d'une maladie foudroyante", "d'une infection mal soignée", "d'un malaise pendant un cours de sport", "d'une leucémie fulgurante"],
  jeune: ["d'un accident de la route", "d'une maladie soudaine", "d'une chute en randonnée", "d'un cancer découvert trop tard", "d'une infection sévère", "d'un malaise cardiaque inattendu", "d'un lymphome agressif"],
  adulte: ["d'une crise cardiaque", "d'une longue maladie", "d'un surmenage fatal", "d'un cancer du poumon", "d'un cancer du pancréas", "d'une cirrhose", "d'une insuffisance rénale", "d'une infection pulmonaire sévère", "d'un cancer du sein", "d'un cancer de la prostate", "d'un diabète mal soigné", "d'un lymphome", "d'un AVC"],
  senior: ["de vieillesse, paisiblement", "dans son sommeil", "d'une grippe tenace", "d'un cœur fatigué", "en faisant la sieste au soleil", "d'une pneumonie", "d'un cancer", "d'une insuffisance cardiaque", "d'une maladie neurodégénérative", "d'une insuffisance respiratoire", "d'une attaque cérébrale", "d'une infection urinaire non soignée", "de ses nombreuses années, entouré de ses proches"],
};

function incomeTax(s) {
  const br = [[18000, 0.12], [45000, 0.27], [110000, 0.38], [Infinity, 0.47]];
  let t = 0, prev = 0;
  for (const [lim, r] of br) { if (s > prev) t += (Math.min(s, lim) - prev) * r; prev = lim; }
  return Math.round(t);
}

class Game {
  constructor(opts) {
    this.settings = settingsLib.normalize(opts.settings);
    this.rng = opts.rng || Math.random;
    this.clock = opts.clock || (() => Date.now());
    this.timeScale = opts.timeScale || 1;
    this.players = [];
    this.gazette = [];
    this.offers = [];
    this.loans = [];
    this.companies = [];
    this.bonds = {};
    this.group = null;
    this.minigames = require("./minigames");
    this.minis = [];
    this.round = 0;
    this.phase = "lobby";
    this.deadline = 0;
    this.chat = [];
    this.history = [];
    this.startAge = 8;
    this.age = this.startAge;
    this.endedReason = null;
    (opts.players || []).forEach((info, seat) => this.players.push(this._newChar(info, seat)));
  }

  // ---------- création ----------
  _newChar(info, seat) {
    const rng = this.rng;
    const gender = info.gender === "f" ? "f" : "m";
    const giftIds = Object.keys(R.GIFTS);
    const gift = this.settings.giftMode === "chaos" ? giftIds[Math.floor(rng() * giftIds.length)] : (R.GIFTS[info.gift] ? info.gift : "cerveau");
    const chaos = (v, opts) => (v === "chaos" ? opts[Math.floor(rng() * opts.length)] : v);
    const cfg = {
      startClass: chaos(this.settings.startClass, ["modeste", "moyenne", "aisee"]),
      danger: chaos(this.settings.danger, ["douce", "normal", "dure"]),
      loufoque: Number(chaos(this.settings.loufoque, ["0", "1", "2", "3"])),
    };
    const j = () => Math.floor(rng() * 7) - 3;
    const p = {
      seat, name: info.name, gender, bot: !!info.bot, auto: false, gift, cfg,
      life: { income: 0, expenses: 0, gains: 0, losses: 0 },
      avatar: info.avatar || { acc: "🎩", color: "#c9a13b" },
      age: this.age, alive: true, death: null, dying: null,
      stats: { sante: 78 + j(), bonheur: 62 + j(), intel: 45 + j(), charme: 45 + j(), sport: 40 + j(), repute: 50 },
      traits: { courage: 50, bonte: 50, ambition: 50, sociable: 50, honnete: 50, creatif: 50, prudent: 50 },
      cash: 0, debt: 0, assets: [], assetSeq: 0,
      job: null, jobHistory: [], exp: {}, yearsWorked: 0, retired: false, pension: 0,
      school: { phase: "primaire", grade: 55, diplomas: ["aucun"], edu: 0, endAge: null, track: null },
      npcs: [], flags: {}, flagTtl: {}, queue: [], seen: {}, lastTag: null, badges: {}, bande: ({ off: 0, parfois: 0.4, souvent: 0.8, partout: 0.95 })[this.settings.bande] || 0,
      lifestyle: "normal", home: "parents", city: pick(rng, POOLS.villes),
      partner: null, prison: null, record: 0, heir: null,
      wealthHistory: [], journal: [], yearLog: [],
      plan: null, ready: false, scene: null, eventsLeft: 0, eventsDone: false, report: null,
      botAt: 0, missed: 0, pendingEvents: [],
      mem: { peakNet: 0, richYears: 0, poorYears: 0, bigLossAt: null, ruinedAt: null, divorces: 0, kidsLost: 0, jailYears: 0, fired: 0, tracksTried: {} }, arcs: {}, forced: [], lifeSeen: {}, lifeDone: {}, lifeOffer: [], socialOffer: [], project: null,
    };
    const G = R.GIFTS[gift];
    if (G.stats) Object.keys(G.stats).forEach((k) => { p.stats[k] += G.stats[k]; });
    if (G.traits) Object.keys(G.traits).forEach((k) => { p.traits[k] += G.traits[k]; });
    if (G.flags) G.flags.forEach((f) => { p.flags[f] = 1; });
    const cls = cfg.startClass;
    p.cash = cls === "aisee" ? 500 : cls === "modeste" ? 40 : 150;
    p.flags["classe_" + cls] = 1;
    p.journal.push({ age: this.age, text: "Tu nais dans une famille " + ({ modeste: "modeste", moyenne: "de classe moyenne", aisee: "aisée" })[cls] + ".", ic: ({ modeste: "🏚️", moyenne: "🏠", aisee: "🏰" })[cls], tag: "naissance" });
    // la famille
    const nm = (n) => n;
    C.addNpc(p, rng, "mere", { gender: "f", age: this.age + C.rint(rng, 26, 36), close: C.rint(rng, 55, 85) });
    C.addNpc(p, rng, "pere", { gender: "m", age: this.age + C.rint(rng, 27, 38), close: C.rint(rng, 45, 80) });
    const sibs = rng() < 0.55 ? (rng() < 0.3 ? 2 : 1) : 0;
    for (let i = 0; i < sibs; i++) C.addNpc(p, rng, "sibling", { age: this.age + C.rint(rng, -4, 4) });
    C.addNpc(p, rng, "bestfriend", { age: this.age, close: C.rint(rng, 60, 85) });
    for (let i = 0; i < 2; i++) C.addNpc(p, rng, "friend", { age: this.age });
    C.addNpc(p, rng, "rival", { age: this.age, close: C.rint(rng, 5, 30) });
    C.addNpc(p, rng, "teacher", { age: C.rint(rng, 30, 58), close: C.rint(rng, 30, 60) });
    if (rng() < 0.3) C.addNpc(p, rng, "pet", { name: pick(rng, ["Pistache", "Biscotte", "Noisette", "Réglisse", "Gaufrette"]), age: 2, close: 85 });
    // les autres joueurs sont dans la même classe
    return p;
  }

  alivePlayers() { return this.players.filter((p) => p.alive); }
  controlled(p) { return p.bot || p.auto; }
  timerMs(k) { const s = R.TIMERS[this.settings.timer]; return s ? s * 1000 * k * this.timeScale : 0; }
  now() { return this.clock(); }

  // ---------- Gazette (nouvelles publiques) ----------
  news(p, text, kind) {
    this.gazette.push({ age: this.age, round: this.round, seat: p ? p.seat : null, text, kind: kind || "info" });
    if (this.gazette.length > 400) this.gazette.shift();
  }

  // ---------- démarrage ----------
  start() {
    this.round = 0;
    this.age = this.startAge;
    this.news(null, "🎓 La rentrée ! " + this.players.map((p) => p.name).join(", ") + " entrent dans la même classe, à " + this.startAge + " ans.", "start");
    this._beginRound();
  }

  _beginRound() {
    this.age = this.startAge + this.round;
    this._economy();
    if (!this.alivePlayers().length) return this._finishGame("allDead");
    const cap = this.settings.ageCap;
    const capAge = cap === "none" ? 9999 : Number(cap);
    if (this.age > capAge || this.age > 111) return this._finishGame(this.age > 111 ? "age" : "cap");
    this.alivePlayers().forEach((p) => {
      p.age = this.age;
      p.plan = null; p.draft = null; p.ready = false; p.scene = null; p.eventsDone = false; p.report = null;
      p.yearLog = [];
      p.botAt = this.now() + 300 + Math.floor(this.rng() * 900) * this.timeScale;
      this._rollFate(p);
      p.lifeOffer = life.offer(this, p);
      p.proOffer = life.offerPro(this, p);
      p.socialOffer = this.alivePlayers().length > 1 && social.offerActions ? social.offerActions(this, p) : [];
    });
    this.offers = [];
    this.group = null;
    this.minis = []; this.miniHold = 0;
    this.phase = "agenda";
    const ms = this.timerMs(0.9);
    this.deadline = ms ? this.now() + ms + 8000 * this.timeScale : 0;
    this.alivePlayers().forEach((p) => {
      if (p.prison) { /* peut quand même choisir un projet de prison */ }
    });
  }

  // L'économie de l'année. Chacun place son argent de son côté. Seuls de rares krachs touchent tout le monde d'un coup.
  _economy() {
    const e = this.eco = this.eco || { zero: 0, recession: 0 };
    const rng = this.rng;
    this.bigCrash = false; this.bubblePop = false; this.cryptoShift = 0;
    const mr = rng();
    this.market = mr < 0.05 ? -(0.22 + rng() * 0.25) : 0;
    if (this.market < 0) this.news(null, "📉 Krach boursier. Les marchés plongent pour tout le monde.", "eco");
    // grand krach, très rare, puis récession
    if (e.recession > 0) { e.recession--; this.market = Math.min(this.market, -0.06 - rng() * 0.08); }
    else if (rng() < 0.015) {
      this.bigCrash = true; this.market = -(0.38 + rng() * 0.27); e.recession = 1 + Math.floor(rng() * 2);
      this.news(null, "💥 GRAND KRACH. Les places financières s'effondrent, l'immobilier et les entreprises trinquent, seul l'or brille.", "eco");
    }
  }

  // Les habitudes installent des qualités. Plus on répète le même choix d'année en année, plus ça se voit, avec des paliers et parfois un déclic.
  _habit(p, pr, rep) {
    const H = HABITS[pr.id];
    p.habits = p.habits || {};
    if (!H) return;
    const e = p.habits[H.key] = p.habits[H.key] || { streak: 0, last: -9, total: 0 };
    e.streak = this.round - e.last <= 2 ? e.streak + 1 : 1;
    e.last = this.round; e.total++;
    const rng = this.rng;
    const bump = (k, d) => { if (!d) return; if (k in p.stats) p.stats[k] = C.clamp(p.stats[k] + d, 0, 100); else if (k in p.traits) p.traits[k] = C.clamp(p.traits[k] + d, 0, 100); };
    // effet de la régularité, un peu plus fort chaque année de suite
    if (e.streak >= 2) { Object.keys(H.spill).forEach((k) => bump(k, Math.round(H.spill[k] * Math.min(e.streak, 4) / 2))); }
    // paliers
    if ([3, 6, 10].includes(e.streak)) {
      const big = e.streak === 3 ? 3 : e.streak === 6 ? 5 : 7;
      bump(H.stat, big); Object.keys(H.spill).forEach((k) => bump(k, Math.ceil(big * 0.7 * H.spill[k])));
      rep.lines.push(H.ic + " " + H.milestone[e.streak === 3 ? 0 : e.streak === 6 ? 1 : 2]);
      p.journal.push({ age: p.age, text: H.milestone[e.streak === 3 ? 0 : e.streak === 6 ? 1 : 2], ic: H.ic, tag: "habitude" });
      if (H.flag) { p.flags[H.flag] = 1; p.flagTtl[H.flag] = 6; }
    } else if (rng() < Math.min(0.5, 0.08 + 0.06 * (e.streak - 1))) {
      // déclic : un progrès soudain bien plus grand que d'habitude
      const gain = C.rint(rng, 5, 10);
      bump(H.stat, gain); Object.keys(H.spill).forEach((k) => bump(k, Math.round(gain * 0.6 * H.spill[k])));
      rep.lines.push("💥 " + H.click);
      if (H.flag) { p.flags[H.flag] = 1; p.flagTtl[H.flag] = 6; }
    }
  }

  // La mémoire de la vie, pour que les choix d'aujourd'hui tiennent compte de ce qui s'est passé il y a des années
  _remember(p, rep) {
    const m = p.mem; const nw = rep.netAfter;
    m.peakNet = Math.max(m.peakNet, nw);
    if (nw > 1000000) m.richYears++;
    if (nw < 2000) m.poorYears++;
    if (rep.netBefore > 60000 && nw < rep.netBefore * 0.6) m.bigLossAt = p.age;
    if (nw < 0 && !m.inRuin) { m.ruinedAt = p.age; m.inRuin = true; }
    if (nw >= 0) m.inRuin = false;
    if (p.prison) m.jailYears++;
    if (p.job) m.tracksTried[p.job.track] = (m.tracksTried[p.job.track] || 0) + 1;
    const kids = p.npcs.filter((n) => n.kind === "child" && !n.alive).length;
    m.kidsLost = Math.max(m.kidsLost, kids);
  }

  // Le destin frappe parfois (perte d'argent, coup dur familial, bonne surprise). Plus on a à perdre, plus il y a de prises.
  _rollFate(p) {
    if (p.age < 16 || p.prison || p.retired && p.age > 90) return;
    if (p.lastFate !== undefined && this.round - p.lastFate < 3) return;
    const nw = C.netWorth(p);
    let prob = 0.12;
    if (nw > 80000) prob += 0.02;
    if (nw > 300000) prob += 0.03;
    if (nw > 1000000) prob += 0.04;
    if (nw > 4000000) prob += 0.04;
    if (nw < 3000) prob += 0.02;
    if (this.rng() >= prob) return;
    const pool = kit.EVENTS.filter((e) => e.shock && this._eligible(p, e));
    if (!pool.length) return;
    // plus on est riche, moins les bonnes surprises dépendent d'un hasard pur (elles ciblent les petits patrimoines via leurs conditions)
    const ws = pool.map((e) => (e.w === undefined ? 5 : e.w));
    let r = this.rng() * ws.reduce((a, b) => a + b, 0), pick = pool[pool.length - 1];
    for (let i = 0; i < pool.length; i++) { r -= ws[i]; if (r <= 0) { pick = pool[i]; break; } }
    p.forced.push({ id: pick.id });
    p.lastFate = this.round;
  }

  // ---------- boucle ----------
  tick() {
    const t = this.now();
    let changed = false;
    if (this.phase === "agenda") {
      for (const p of this.alivePlayers()) {
        if (!p.ready && this.controlled(p) && t >= p.botAt) { this._botAgenda(p); changed = true; }
      }
      const all = this.alivePlayers().every((p) => p.ready);
      if (all || (this.deadline && t >= this.deadline)) { this._closeAgenda(); changed = true; }
    } else if (this.phase === "respond") {
      for (const o of this.offers.filter((o) => o.status === "pending")) {
        const tp = this.players[o.to];
        if (this.controlled(tp) && t >= tp.botAt) { social.botRespond(this, o); changed = true; }
      }
      const pend = this.offers.some((o) => o.status === "pending");
      if (!pend || (this.deadline && t >= this.deadline)) { this._closeRespond(); changed = true; }
    } else if (this.phase === "mini") {
      if (this.minigames.tick(this, t)) changed = true;
      if (!this.minigames.pending(this)) { this._afterMini(); changed = true; }
    } else if (this.phase === "group") {
      if (social.groupTick(this, t)) changed = true;
    } else if (this.phase === "event") {
      for (const p of this.alivePlayers()) {
        if (p.eventsDone) continue;
        const sc = p.scene;
        if (!sc) { this._nextScene(p); changed = true; continue; }
        const lateHuman = !this.controlled(p) && sc.deadline && t >= sc.deadline;
        if (sc.state === "choose" && ((this.controlled(p) && t >= p.botAt) || lateHuman)) {
          if (lateHuman) { p.missed++; this._maybeAuto(p); }
          this._autoChoose(p); changed = true;
        } else if (sc.state === "result" && ((this.controlled(p) && t >= p.botAt) || (sc.deadline && t >= sc.deadline))) {
          this._continueScene(p); changed = true;
        }
      }
      if (this.alivePlayers().every((p) => p.eventsDone)) { this._closeEvents(); changed = true; }
    } else if (this.phase === "review") {
      if (this._reviewTick(t)) changed = true;
    } else if (this.phase === "recap") {
      for (const p of this.alivePlayers()) if (!p.ready && this.controlled(p) && t >= p.botAt) { p.ready = true; changed = true; }
      const all = this.alivePlayers().every((p) => p.ready);
      if (all || (this.deadline && t >= this.deadline)) { this.round++; this._beginRound(); changed = true; }
    }
    return changed;
  }

  _maybeAuto(p) { if (p.missed >= 3 && !p.bot) p.auto = true; }

  // ---------- agenda ----------
  // Les choix de l'année pour ce joueur, déjà décrits, avec l'année tranquille toujours en dernier
  availableProjects(p) {
    const list = (p.lifeOffer || []).map((id) => life.describe(this, p, id)).filter(Boolean);
    list.push(life.describe(this, p, "routine"));
    return list;
  }

  // Les options de l'onglet Professionnel, décrites, sans "aucune" (elle se choisit en ne cliquant rien)
  availablePro(p) {
    return (p.proOffer || []).map((id) => life.describe(this, p, id)).filter(Boolean);
  }

  // Démission à tout moment de l'agenda, sans passer par les choix de vie. Le salaire de l'année est perdu.
  quitJob(seat) {
    const p = this.players[seat];
    if (!p || !p.alive || this.phase !== "agenda" || p.ready) return { ok: false, error: "Pas le moment." };
    if (!p.job) return { ok: false, error: "Tu n'as pas d'emploi à quitter." };
    if (p.prison) return { ok: false, error: "Impossible depuis la prison." };
    const title = p.job.title, years = p.age - p.job.since;
    FX.applyFx(this, p, { quit: true, bonheur: years >= 3 ? 1 : 3 }, null);
    if (years < 1) FX.applyFx(this, p, { repute: -2 }, null);
    p.mem.quits = (p.mem.quits || 0) + 1;
    p.proOffer = ["emploi_candidater"].concat((p.proOffer || []).filter((id) => id !== "emploi_candidater"));
    p.yearLog.push("🚪 Tu quittes ton poste de " + title.toLowerCase() + ". Tu ne toucheras pas de salaire cette année.");
    p.journal.push({ age: p.age, text: "Tu as quitté ton emploi de " + title.toLowerCase() + ".", ic: "🚪", tag: "travail" });
    if (p.plan && p.plan.project && !(p.lifeOffer || []).includes(p.plan.project)) p.plan = null;
    if (p.plan && p.plan.pro && !(p.proOffer || []).includes(p.plan.pro)) p.plan.pro = null;
    return { ok: true };
  }

  // Construit le plan de l'année à partir de ce que le joueur a choisi. Utilisé pour la validation et pour le brouillon.
  _buildPlan(p, plan, strict) {
    plan = plan || {};
    const avail = this.availableProjects(p);
    let project = avail.find((x) => x.id === plan.project);
    if (!project) project = avail.find((x) => x.id === "routine");
    let act = null;
    if (plan.social && plan.social.kind) {
      const v = social.validate(this, p, plan.social);
      if (!v.ok) { if (strict) return { ok: false, error: v.error }; }
      else act = v.action;
    }
    let pro = null;
    if (plan.pro) {
      const pp = this.availablePro(p).find((x) => x.id === plan.pro);
      if (pp) pro = pp.id;
      else if (strict) return { ok: false, error: "Cette option professionnelle n'est plus disponible." };
    }
    return { ok: true, plan: { project: project.id, social: act, pro } };
  }

  submitAgenda(seat, plan) {
    const p = this.players[seat];
    if (!p || !p.alive || this.phase !== "agenda" || p.ready) return { ok: false };
    const b = this._buildPlan(p, plan, true);
    if (!b.ok) return b;
    p.plan = b.plan; p.draft = null;
    p.ready = true; p.missed = 0; p.auto = p.auto && p.bot;
    return { ok: true };
  }

  // Le brouillon garde les clics du joueur. Si le chrono s'arrête avant qu'il valide, ce brouillon devient son année.
  saveDraft(seat, plan) {
    const p = this.players[seat];
    if (!p || !p.alive || this.phase !== "agenda" || p.ready) return { ok: false };
    if (!plan || typeof plan !== "object") return { ok: false };
    const clean = { project: String(plan.project || "").slice(0, 60), pro: plan.pro ? String(plan.pro).slice(0, 60) : null };
    if (plan.social && plan.social.kind) clean.social = Object.assign({}, plan.social, { kind: String(plan.social.kind).slice(0, 60) });
    p.draft = clean;
    return { ok: true };
  }

  _botAgenda(p) {
    const rng = this.rng;
    const avail = this.availableProjects(p).filter((x) => !SHADY.includes(x.id) || rng() < 0.15);
    // les robots aiment avancer dans leur parcours (examen, rendez-vous, candidature)
    const ws = avail.map((x) => (x.step ? 3 : 1) * (x.id === "routine" ? 0.3 : 1) * (x.cost && x.cost > p.cash * 0.5 ? 0.3 : 1));
    let r = rng() * ws.reduce((a, b) => a + b, 0), pr = avail[avail.length - 1];
    for (let i = 0; i < avail.length; i++) { r -= ws[i]; if (r <= 0) { pr = avail[i]; break; } }
    // le bot gère un peu son argent
    if (p.cash > 8000 && rng() < 0.4) social.botFinance(this, p);
    let act = null;
    if (this.alivePlayers().length > 1 && rng() < social.botActChance(this, p)) act = social.botAction(this, p);
    // et une option professionnelle dans la plupart des années
    let pro = null;
    const opts = this.availablePro(p).filter((x) => (!SHADY.includes(x.id) || rng() < 0.2) && !(x.cost && x.cost > p.cash * 0.6));
    if (opts.length && rng() < 0.75) {
      const w = opts.map((x) => (x.step ? 3 : 1) * (x.ill ? (p.traits.honnete < 45 ? 1 : 0.25) : 1));
      let r2 = rng() * w.reduce((a, b) => a + b, 0), pick = opts[opts.length - 1];
      for (let i = 0; i < opts.length; i++) { r2 -= w[i]; if (r2 <= 0) { pick = opts[i]; break; } }
      pro = pick.id;
    }
    p.plan = { project: pr.id, social: act, pro };
    p.ready = true;
  }

  _closeAgenda() {
    const alive = this.alivePlayers();
    alive.forEach((p) => {
      if (!p.plan) {
        // joueur trop lent : on retient ses clics non validés, sinon une année tranquille
        const b = p.draft && !this.controlled(p) ? this._buildPlan(p, p.draft, false) : null;
        if (b && b.ok && (b.plan.project !== "routine" || b.plan.social || b.plan.pro)) {
          p.plan = b.plan;
          p.yearLog.push("⏱️ Le temps était écoulé. Tes choix non validés ont été retenus pour cette année.");
          p.missed = 0;
        } else {
          p.plan = { project: "routine", social: null, pro: null };
          if (!this.controlled(p)) { p.missed++; this._maybeAuto(p); }
        }
      }
      p.draft = null;
      let pr = life.byId[p.plan.project] || life.ROUTINE;
      const cost = life.ev(pr, "cost", p, this) || 0;
      if (cost) { if (p.cash >= cost) p.cash -= cost; else pr = life.ROUTINE; }
      this._startProject(p, pr);
      // l'option professionnelle de l'année, payée à part
      let pp = p.plan.pro ? life.byId[p.plan.pro] : null;
      if (pp) {
        const c2 = life.ev(pp, "cost", p, this) || 0;
        if (c2) { if (p.cash >= c2) p.cash -= c2; else pp = null; }
      }
      p.projectPro = pp ? pp.id : null;
      if (pp) this._startProject(p, pp, true);
    });
    social.resolveActions(this);
    const pend = this.offers.some((o) => o.status === "pending");
    if (pend) {
      this.phase = "respond";
      this.deadline = this.timerMs(0.6) ? this.now() + this.timerMs(0.6) : 0;
      this.alivePlayers().forEach((p) => { p.botAt = this.now() + 400 + Math.floor(this.rng() * 800) * this.timeScale; });
    } else this._afterRespond();
  }

  _closeRespond() {
    social.expireOffers(this);
    this._afterRespond();
  }

  _afterRespond() {
    this.deadline = 0;
    if (this.minigames.pending(this)) { this.minigames.open(this); return; }
    this._afterMini();
  }

  _afterMini() {
    this.deadline = 0;
    if (social.planGroup(this)) { this.phase = "group"; return; }
    this._startEvents();
  }

  _startProject(p, pr, isPro) {
    const hookFlags = { love: "cherche_amour", trip: "en_voyage", party: "fete_annee", scam: "magouille_annee", side: "side_annee", work: "travail_acharne", family: "famille_annee", formation: "formation_annee", save: "epargne_annee", gym: "sport_annee", care: "soin_annee" };
    if (pr.hook && hookFlags[pr.hook]) { p.flags[hookFlags[pr.hook]] = 1; p.flagTtl[hookFlags[pr.hook]] = 1; }
    if (!isPro) p.project = pr.id;
    p.lifeDone[pr.id] = this.round;
    if (pr.flag) { p.flags[pr.flag] = 1; p.flagTtl[pr.flag] = 1; }
    if (pr.scene) {
      const s = typeof pr.scene === "function" ? pr.scene(p, this) : pr.scene;
      (Array.isArray(s) ? s : [s]).forEach((f) => { if (f) p.forced.push(typeof f === "string" ? { id: f } : f); });
    }
  }

  // ---------- finance (instantané pendant l'agenda) ----------
  finance(seat, op) {
    const p = this.players[seat];
    if (!p || !p.alive || this.phase !== "agenda" || p.ready) return { ok: false, error: "Pas le moment." };
    const num = (v) => Math.max(0, Math.floor(Number(v) || 0));
    switch (op.op) {
      case "invest": {
        const kind = op.kind; const amt = Math.min(num(op.amount), Math.floor(p.cash));
        if (!R.INVEST_KINDS.includes(kind) || amt < 100) return { ok: false, error: "Montant minimal 100 €." };
        let a = p.assets.find((x) => x.kind === kind && x.liquid !== false && x.pool);
        if (!a) { a = { id: "a" + (++p.assetSeq), kind, name: R.ASSET_KINDS[kind].l, value: 0, cost: 0, upkeep: 0, income: 0, pool: true }; p.assets.push(a); }
        p.cash -= amt; a.value += amt; a.cost += amt;
        return { ok: true };
      }
      case "withdraw": {
        const a = p.assets.find((x) => x.id === op.id);
        if (!a || !a.pool) return { ok: false, error: "Placement introuvable." };
        const amt = Math.min(num(op.amount) || a.value, Math.floor(a.value));
        const fee = (R.ASSET_KINDS[a.kind] || {}).jackpot && a.kind === "startup" ? 0.1 : 0;
        a.value -= amt; p.cash += Math.round(amt * (1 - fee));
        if (a.value < 1) p.assets = p.assets.filter((x) => x !== a);
        return { ok: true };
      }
      case "sell": {
        const a = p.assets.find((x) => x.id === op.id);
        if (!a || a.pool) return { ok: false, error: "Bien introuvable." };
        if (a.partnerCompany) return { ok: false, error: "Une entreprise commune se liquide autrement." };
        p.cash += Math.round(a.value * 0.9);
        p.assets = p.assets.filter((x) => x !== a);
        p.yearLog.push("Tu as vendu " + a.name + " pour " + C.fmt(a.value * 0.9) + ".");
        return { ok: true };
      }
      case "repay": {
        const amt = Math.min(num(op.amount), Math.floor(p.cash), Math.ceil(p.debt));
        if (amt < 1) return { ok: false, error: "Rien à rembourser." };
        p.cash -= amt; p.debt -= amt;
        return { ok: true };
      }
      case "lifestyle": {
        if (!R.LIFESTYLES[op.value]) return { ok: false };
        p.lifestyle = op.value; return { ok: true };
      }
      case "heir": {
        if (op.seat === null || op.seat === undefined || op.seat === "") { p.heir = null; return { ok: true }; }
        const t = this.players[Number(op.seat)];
        if (!t || t === p) return { ok: false, error: "Héritier invalide." };
        p.heir = t.seat; return { ok: true };
      }
      default: return { ok: false };
    }
  }

  // ---------- événements ----------
  _startEvents() {
    this.phase = "event";
    this.deadline = 0;
    this.alivePlayers().forEach((p) => {
      p.scene = null; p.eventsDone = false;
      const extra = this.rng() < (R.stageOf(p.age) === "enfance" ? 0.2 : 0.3) ? 1 : 0;
      // une scène préparée par le choix de l'année remplace le tirage au hasard, mais les jalons (bac, diplôme...) passent toujours
      const due = p.queue.filter((q) => q.at <= p.age).length + kit.EVENTS.filter((e) => e.must && this._eligible(p, e)).length;
      p.eventsLeft = Math.max(p.forced.length ? extra : 1 + extra, Math.min(due, 4));
      p.botAt = this.now() + 300;
    });
  }

  _eligible(p, e) {
    if (e.ages && (p.age < e.ages[0] || p.age > e.ages[1])) return false;
    if (e.once && p.seen[e.id]) return false;
    if (!e.once && p.seen[e.id] && e.cool !== undefined && this.round + 1 - p.seen[e.id] < e.cool) return false;
    if (!e.once && p.seen[e.id] && e.cool === undefined && this.round + 1 - p.seen[e.id] < 5) return false;
    const mature = e.tags && e.tags.includes("mature");
    if (mature && !this.settings.mature) return false;
    if (e.tags && e.tags.includes("loufoque") && p.cfg.loufoque === 0) return false;
    if (p.prison && !(e.need && e.need.prison)) return false;
    if (e.need && !C.check(p, e.need, this)) return false;
    if (e.multi && this.alivePlayers().length < 2) return false;
    return true;
  }

  _weight(p, e) {
    let w = e.w === undefined ? 5 : e.w;
    const tags = e.tags || [];
    if (tags.includes("loufoque")) w *= [0, 0.35, 1, 2.6][p.cfg.loufoque];
    if (tags.length && tags[0] === p.lastTag) w *= 0.45;
    if (!e.once && p.seen[e.id]) w *= 0.5;
    const nf = e.need && e.need.flag;
    if (nf) { const arr = Array.isArray(nf) ? nf : [nf]; if (arr.some((f) => PROJECT_FLAGS.includes(f) && C.hasFlag(p, f))) w *= 5; }
    return w;
  }

  _pickEvent(p) {
    // 1. scènes programmées
    for (let i = 0; i < p.queue.length; i++) {
      const q = p.queue[i];
      if (q.at <= p.age) {
        p.queue.splice(i, 1);
        const e = kit.byId[q.id];
        if (!e) continue;
        if (e.need && !C.check(p, e.need, this)) continue;
        if (p.prison && !(e.need && e.need.prison) && !e.anywhere) continue;
        return { e, saved: q.slots };
      }
    }
    // 2. jalons obligatoires
    const musts = kit.EVENTS.filter((e) => e.must && this._eligible(p, e));
    if (musts.length) { musts.sort((a, b) => (b.must === true ? 1 : b.must) - (a.must === true ? 1 : a.must)); return { e: musts[0] }; }
    // 3. tirage pondéré
    const pool = kit.EVENTS.filter((e) => !e.must && !e.chainOnly && this._eligible(p, e));
    let total = 0;
    const ws = pool.map((e) => { const w = this._weight(p, e); total += w; return w; });
    if (!pool.length || total <= 0) return { e: kit.byId.annee_tranquille };
    let r = this.rng() * total;
    for (let i = 0; i < pool.length; i++) { r -= ws[i]; if (r <= 0) return { e: pool[i] }; }
    return { e: pool[pool.length - 1] };
  }

  _makeCtx(p, e, prev, saved, preset) {
    const rng = this.rng;
    const x = { slots: {}, vals: {}, next: null };
    if (prev) { Object.assign(x.slots, prev.slots); Object.assign(x.vals, prev.vals); }
    if (saved) Object.keys(saved).forEach((k) => { const n = p.npcs.find((q) => q.id === saved[k]); if (n) x.slots[k] = n; });
    if (e.who) {
      Object.keys(e.who).forEach((slot) => {
        let spec = e.who[slot];
        if (typeof spec === "string") spec = { kind: spec };
        if (x.slots[slot] && !spec.fresh) return;
        if (spec.fresh) {
          const ag = typeof spec.age === "function" ? spec.age(p, rng, this) : spec.age;
          const n = C.addNpc(p, rng, spec.kind, { age: ag !== undefined ? ag : p.age + C.rint(rng, -2, 4), close: spec.close !== undefined ? spec.close : C.rint(rng, 20, 50), gender: spec.gender });
          x.slots[slot] = n;
        } else x.slots[slot] = C.getOrMakeNpc(p, rng, spec.kind);
      });
    }
    if (e.roll) {
      Object.keys(e.roll).forEach((k) => {
        const spec = e.roll[k];
        if (typeof spec === "string") x.vals[k] = pick(rng, POOLS[spec]);
        else if (Array.isArray(spec) && typeof spec[0] === "number") {
          const step = spec[2] || 1;
          const n = Math.floor((spec[1] - spec[0]) / step) + 1;
          x.vals[k] = spec[0] + Math.floor(rng() * n) * step;
        } else if (Array.isArray(spec)) x.vals[k] = pick(rng, spec);
        else if (typeof spec === "function") x.vals[k] = spec(p, rng, this);
      });
    }
    if (preset) Object.assign(x.vals, preset);
    // quelques valeurs toujours disponibles
    if (!x.vals.ville) x.vals.ville = p.city;
    x.vals.n_age = p.age;
    return x;
  }

  _nextScene(p) {
    let picked = null;
    let prevCtx = null;
    while (!picked) {
      if (p.chainNext) { const id = p.chainNext.id; prevCtx = p.chainNext.ctx; p.chainNext = null; picked = { e: kit.byId[id] }; if (!picked.e) throw new Error("scène suivante inconnue " + id); }
      else if (p.forced.length) {
        const f = p.forced.shift();
        if (f.id.indexOf("sys:") === 0) {
          const name = f.id.slice(4);
          if (!sys[name]) throw new Error("scène système inconnue " + f.id);
          if (name === "jobhunt" && (p.job || p.retired || p.prison)) continue;
          if (name === "jobswitch" && (!p.job || p.prison)) continue;
          if (name === "startup" && (p.prison || p.cash < 1000)) continue;
          picked = { e: sys[name](this, p, f.vals || {}) };
        } else {
          const e0 = kit.byId[f.id];
          if (!e0) throw new Error("scène préparée inconnue " + f.id);
          if (e0.need && !C.check(p, e0.need, this)) continue;
          if (p.prison && !(e0.need && e0.need.prison) && !e0.anywhere) continue;
          picked = { e: e0, preset: f.vals };
        }
      }
      else if (p.eventsLeft > 0) { p.eventsLeft--; picked = this._pickEvent(p); }
      else { p.eventsDone = true; return; }
    }
    const e = picked.e;
    const x = this._makeCtx(p, e, prevCtx, picked.saved, picked.preset);
    x.render = (t) => C.render(t, p, x);
    let choices = typeof e.c === "function" ? e.c(p, x, this) : e.c;
    choices = (choices || []).map((c, i) => {
      const cost = typeof c.cost === "function" ? c.cost(p, x) : c.cost || 0;
      let ok = true, why = "";
      if (cost && p.cash < cost && !c.credit) { ok = false; why = "Pas assez d'argent"; }
      if (c.need && !C.check(p, c.need, this, x)) { ok = false; why = c.why || "Tu ne remplis pas les conditions"; }
      return { i, def: c, l: C.render(c.l, p, x), ic: c.ic || "", hint: c.hint ? C.render(c.hint, p, x) : "", cost, ok, why, risk: c.risk || 0, hid: !!(c.hid && !ok) };
    });
    if (!choices.some((c) => c.ok)) {
      // sécurité : toujours un choix possible
      choices.push({ i: choices.length, def: { l: "Laisser faire", o: [{ w: 1, t: "Tu laisses les choses suivre leur cours.", fx: {} }] }, l: "Laisser faire", ic: "🤷", cost: 0, ok: true, why: "", risk: 0, hid: false });
    }
    p.seen[e.id] = this.round + 1;
    if (e.tags && e.tags.length) p.lastTag = e.tags[0];
    const dl = this.timerMs(1);
    p.scene = {
      id: e.id, ev: e, x, state: "choose", ic: e.ic || "🎲", tags: e.tags || [], title: e.title ? C.render(e.title, p, x) : null,
      text: C.render(typeof e.t === "function" ? e.t(p, x, this) : e.t, p, x), choices,
      deadline: dl ? this.now() + dl : 0, result: null, depth: prevCtx ? (p.sceneDepth || 0) + 1 : 0,
    };
    p.sceneDepth = p.scene.depth;
    p.botAt = this.now() + 400 + Math.floor(this.rng() * 1200) * this.timeScale;
  }

  chooseScene(seat, idx) {
    const p = this.players[seat];
    if (!p || !p.alive || this.phase !== "event" || !p.scene || p.scene.state !== "choose") return { ok: false };
    const ch = p.scene.choices[idx];
    if (!ch || !ch.ok) return { ok: false, error: ch ? ch.why : "" };
    p.missed = 0; if (!p.bot) p.auto = false;
    this._resolveChoice(p, ch);
    return { ok: true };
  }

  _autoChoose(p) {
    const sc = p.scene;
    const ok = sc.choices.filter((c) => c.ok && c.risk < 3);
    const pool = ok.length ? ok : sc.choices.filter((c) => c.ok);
    if (sc.id === "choix_filiere" && pool.length > 1) {
      // une spécialisation choisie par défaut reste cohérente avec les goûts et les qualités
      const FIL = require("./filieres");
      const ws = pool.map((c) => { const o = c.def.o && c.def.o[0]; const id = o && o.fx && o.fx.spe; return id ? FIL.fitScore(p, id) : 0.6; });
      let r = this.rng() * ws.reduce((a, b) => a + b, 0), idx = pool.length - 1;
      for (let i = 0; i < pool.length; i++) { r -= ws[i]; if (r <= 0) { idx = i; break; } }
      return this._resolveChoice(p, pool[idx]);
    }
    this._resolveChoice(p, pick(this.rng, pool));
  }

  _resolveChoice(p, ch) {
    const sc = p.scene; const x = sc.x; const rng = this.rng;
    const def = ch.def;
    const before = snapshot(p);
    if (ch.cost) {
      if (p.cash >= ch.cost) p.cash -= ch.cost;
      else { const miss = ch.cost - Math.max(0, p.cash); p.cash = Math.max(0, p.cash - ch.cost); p.debt += miss; }
    }
    // issue
    const outs = def.o;
    const wts = outs.map((o) => Math.max(0, typeof o.w === "function" ? o.w(p, x, this) : o.w));
    let total = 0; wts.forEach((w) => { total += w; });
    let r = rng() * (total || 1); let out = outs[outs.length - 1];
    for (let i = 0; i < outs.length; i++) { r -= wts[i]; if (r <= 0) { out = outs[i]; break; } }
    x.next = null;
    FX.applyFx(this, p, out.fx, x);
    const text = C.render(out.t, p, x);
    // ange gardien
    let saved = false;
    if (p.dying && !p.dying.final && p.flags.ange_gardien) {
      delete p.flags.ange_gardien; saved = true;
      p.stats.sante = Math.max(p.stats.sante, 30);
      p.dying = null;
    }
    let death = null;
    if (p.dying) { death = this.die(p, p.dying.cause); }
    const after = snapshot(p);
    const chips = diffChips(before, after, p, ch.cost);
    if (saved) chips.push({ k: "ange", t: "😇 Ton ange gardien t'a sauvé la vie !" });
    sc.state = "result";
    sc.result = { text, chips, death, saved, choiceLabel: ch.l, hasNext: !!x.next && !death };
    const dl = this.timerMs(0.6);
    sc.deadline = dl ? this.now() + dl : 0;
    p.botAt = this.now() + 300 + Math.floor(rng() * 700) * this.timeScale;
    if (x.next && !death) p.chainNext = { id: x.next, ctx: x };
    p.journal.push({ age: p.age, text, ic: sc.ic, tag: (sc.tags && sc.tags[0]) || null });
    p.yearLog.push(text);
    if (death) { p.chainNext = null; p.eventsLeft = 0; p.forced = []; }
  }

  continueScene(seat) {
    const p = this.players[seat];
    if (!p || !p.scene || p.scene.state !== "result") return { ok: false };
    if (p.alive && this.phase !== "event") return { ok: false };
    p.missed = 0;
    this._continueScene(p);
    return { ok: true };
  }

  _continueScene(p) {
    const dead = !p.alive;
    p.scene = null;
    if (dead) { p.eventsDone = true; p.eventsLeft = 0; }
  }

  // ---------- fin de l'événementiel → bilan ----------
  _closeEvents() {
    require("./feud").tick(this);
    require("./statut").tick(this);
    this.alivePlayers().forEach((p) => this._yearEnd(p));
    social.yearEnd(this);
    if (!this.alivePlayers().length) { this._finishGame("allDead"); return; }
    // réalise les morts de fin d'année
    this.players.forEach((p) => { if (p.alive && p.dying) { /* déjà traité */ } });
    this.phase = "recap";
    const ms = this.timerMs(0.5);
    this.deadline = ms ? this.now() + Math.max(ms, 10000 * this.timeScale) : 0;
    this.players.forEach((p) => { p.ready = !p.alive || false; p.botAt = this.now() + 500 + Math.floor(this.rng() * 900) * this.timeScale; });
    // les joueurs morts cette année doivent aussi voir leur bilan
    this.players.forEach((p) => { if (!p.alive && p.death && p.death.round === this.round) p.ready = false; });
  }

  // ---------- bilan de fin d'année pour un joueur ----------
  _yearEnd(p) {
    const rng = this.rng;
    const rep = { age: p.age, lines: p.yearLog.slice(), income: 0, expenses: 0, assetDelta: 0, flashes: [], netBefore: C.netWorth(p) };
    const st0 = Object.assign({}, p.stats);
    const pr = life.byId[p.project] || life.ROUTINE;
    // projet de vie de l'année, puis option professionnelle
    this._runProject(p, pr, rep);
    const ppr = p.projectPro ? life.byId[p.projectPro] : null;
    if (ppr) this._runProject(p, ppr, rep, true);
    p.projectPro = null;
    require("./pro").tick(this, p, rep);
    // école
    this._schoolTick(p, rep);
    // vie professionnelle et argent
    this._money(p, rep);
    // vieillissement
    this._aging(p);
    // personnages secondaires
    this._npcTick(p);
    // petite nouvelle de l'année
    this._flashes(p, rep);
    // fin de peine
    if (p.prison) { p.prison.left--; if (p.prison.left <= 0) { p.prison = null; rep.lines.push("🔓 Tu sors de prison. Il faut reprendre une vie normale."); p.journal.push({ age: p.age, text: "Libéré après sa peine.", ic: "🔓", tag: "justice" }); this.news(p, "🔓 " + p.name + " est sorti(e) de prison."); } }
    // drapeaux à durée
    Object.keys(p.flagTtl).forEach((f) => { p.flagTtl[f]--; if (p.flagTtl[f] <= 0) { delete p.flags[f]; delete p.flagTtl[f]; } });
    // mort naturelle
    if (!p.dying) this._naturalDeath(p, rep);
    if (p.dying) {
      if (!p.dying.final && p.flags.ange_gardien) { delete p.flags.ange_gardien; p.stats.sante = Math.max(p.stats.sante, 30); rep.lines.push("😇 Ton ange gardien t'a sauvé de justesse cette année."); p.dying = null; }
      else this.die(p, p.dying.cause);
    }
    rep.netAfter = C.netWorth(p);
    this._remember(p, rep);
    require("./ledger").scan(this, p);
    rep.cash = Math.round(p.cash); rep.debt = Math.round(p.debt);
    rep.stats = {};
    Object.keys(p.stats).forEach((k) => { rep.stats[k] = { v: Math.round(p.stats[k]), d: Math.round(p.stats[k]) - Math.round(st0[k]) }; });
    p.wealthHistory.push({ age: p.age, net: rep.netAfter });
    p.life.income += rep.income || 0; p.life.expenses += rep.expenses || 0;
    p.report = rep;
    p.yearsWorked += p.job ? 1 : 0;
    if (p.job) p.exp[p.job.track] = (p.exp[p.job.track] || 0) + 1;
  }

  _runProject(p, pr, rep, second) {
    if (pr.fx && Object.keys(pr.fx).length) FX.applyFx(this, p, pr.fx, null);
    this._habit(p, pr, rep);
    require("./interests").update(p, pr, second);
    if (pr.id.startsWith("par_")) { p.parTry = p.parTry || {}; p.parTry[pr.id] = (p.parTry[pr.id] || 0) + 1; }
    this._lifeOutcome(p, pr, rep);
    EXP.variance(this, p, pr, rep);
    this._projectHook(p, pr, rep);
  }

  // Issue tirée au sort du choix de vie, quand il n'a pas de scène dédiée
  _lifeOutcome(p, pr, rep) {
    if (!pr.outs || !pr.outs.length || p.dying) return;
    const x = { slots: {}, vals: {}, next: null };
    x.render = (t) => C.render(t, p, x);
    const base = pr.outs.map((o) => Math.max(0, typeof o.w === "function" ? o.w(p, x, this) : o.w));
    const info = EXP.tilt(this, p, pr, pr.outs, base, x);
    const ws = info.ws;
    const total = ws.reduce((a, b) => a + b, 0);
    if (total <= 0) return;
    let r = this.rng() * total, o = pr.outs[pr.outs.length - 1], oi = pr.outs.length - 1;
    for (let i = 0; i < pr.outs.length; i++) { r -= ws[i]; if (r <= 0) { o = pr.outs[i]; oi = i; break; } }
    const pre = EXP.record(this, p, pr, info.risky ? info.tones[oi] : 0, info);
    FX.applyFx(this, p, o.fx, x);
    const text = pre + C.render(o.t, p, x);
    rep.lines.push(text);
    if (o.j) p.journal.push({ age: p.age, text, ic: pr.ic, tag: "projet" });
  }

  _projectHook(p, pr, rep) {
    const rng = this.rng;
    switch (pr.hook) {
      case "study": if (p.job) p.job.perf = C.clamp(p.job.perf + 2, 0, 100); break;
      case "petitboulot": { const g = C.rint(rng, 8, 22) * 100; p.cash += g; rep.income += g; rep.lines.push("💶 Ton petit boulot t'a rapporté " + C.fmt(g) + "."); break; }
      case "work": if (p.job) { p.job.perf = C.clamp(p.job.perf + 9, 0, 100); } break;
      case "formation": if (p.job) p.job.perf = C.clamp(p.job.perf + 6, 0, 100); p.stats.intel = C.clamp(p.stats.intel + 1, 0, 100); break;
      case "party": if (rng() < 0.25) { p.stats.repute = C.clamp(p.stats.repute + (rng() < 0.5 ? 4 : -5), 0, 100); } break;
      case "gym": if (rng() < 0.12) { p.stats.sante -= 5; rep.lines.push("🤕 Tu t'es blessé(e) à l'entraînement."); } break;
      case "side": { const g = C.rint(rng, 0, 60) * 100; p.cash += g; rep.income += g; rep.lines.push(g > 0 ? "🛠️ Ton business parallèle a rapporté " + C.fmt(g) + "." : "🛠️ Ton business parallèle n'a rien rapporté."); break; }
      case "scam": {
        const win = rng() < 0.5 + (p.stats.intel - 50) / 200;
        if (win) { const g = C.rint(rng, 20, 120) * 100; p.cash += g; rep.income += g; rep.lines.push("🕶️ Une magouille a rapporté " + C.fmt(g) + "."); }
        else if (rng() < 0.35 + p.record * 0.05) { FX.applyFx(this, p, { prison: C.rint(rng, 1, 2), repute: -12, bonheur: -8 }, null); rep.lines.push("🚔 Tu t'es fait attraper. Direction la prison."); this.news(p, "🚔 " + p.name + " a été arrêté(e) pour magouilles."); p.journal.push({ age: p.age, text: "Arrêté(e) pour magouilles, tu fais de la prison.", ic: "🚔", tag: "justice" }); }
        else rep.lines.push("🕶️ La magouille a mal tourné, mais personne ne t'a attrapé.");
        break;
      }
      case "goodbehavior": if (p.prison && rng() < 0.55) { p.prison.left = Math.max(0, p.prison.left - 1); } break;
      case "escape": {
        if (p.prison && rng() < 0.18) { p.prison = null; p.flags.fugitif = 1; p.flagTtl.fugitif = 4; rep.lines.push("🏃 Tu t'es évadé(e) ! Tu es recherché(e)."); this.news(p, "🏃 " + p.name + " s'est évadé(e) de prison !", "crime"); p.journal.push({ age: p.age, text: "Évasion de prison !", ic: "🏃", tag: "justice" }); }
        else if (p.prison) { p.prison.left += 1; p.stats.bonheur = C.clamp(p.stats.bonheur - 4, 0, 100); rep.lines.push("🔒 Ta tentative d'évasion a échoué. Un an de plus."); }
        break;
      }
      default: break;
    }
  }

  _schoolTick(p, rep) {
    const s = p.school;
    require("./filieres").tick(this, p, rep);
    if (s.phase === "sup" && s.endAge !== null && p.age + 1 >= s.endAge) { p.queue.push({ id: "diplome_sup", at: p.age + 1 }); s.endAge = null; }
    // les notes reviennent doucement vers l'intelligence
    if (["primaire", "college", "lycee", "sup"].includes(s.phase)) {
      s.grade = C.clamp(s.grade + (p.stats.intel - 50) * 0.04, 0, 100);
    }
  }

  _money(p, rep) {
    const rng = this.rng;
    // salaire ou pension
    if (p.job && !p.prison && R.TRACKS[p.job.track].maxAge && p.age > R.TRACKS[p.job.track].maxAge) {
      const T0 = R.TRACKS[p.job.track];
      p.jobHistory.push({ title: p.job.title, track: p.job.track, from: p.job.since, to: p.age, why: "fin de carrière" });
      rep.lines.push("🏁 Ta carrière de " + p.job.title.toLowerCase() + " s'achève, le corps ne suit plus. Il faut se réinventer.");
      p.journal.push({ age: p.age, text: "Fin de carrière dans " + T0.l.toLowerCase() + ".", ic: "🏁", tag: "travail" });
      p.job = null; p.flags.ancienne_gloire = 1; p.stats.bonheur = C.clamp(p.stats.bonheur - 5, 0, 100);
    }
    if (p.job && !p.prison) {
      const T = R.TRACKS[p.job.track];
      let sal = p.job.salary * (0.9 + p.job.perf / 500);
      if (T.variable) sal = p.job.salary * Math.max(0, 1 + T.variable * (rng() - 0.45) * 1.6);
      if (C.hasFlag(p, "travail_acharne")) sal *= 1.08;
      // performance
      const statv = T.stat in p.traits ? p.traits[T.stat] : p.stats[T.stat];
      p.job.perf = C.clamp(p.job.perf + (statv - 50) * 0.06 + (rng() - 0.5) * 8, 0, 100);
      sal = Math.round(sal);
      const net = sal - incomeTax(sal);
      p.cash += net; rep.income += net; rep.tax = (rep.tax || 0) + (sal - net);
      p.lastNetSalary = net;
      if (T.illicit && rng() < 0.08 + p.job.level * 0.03 - (p.stats.intel - 50) / 500 + require("./pro").state(p).heat / 700) {
        const jt = p.job.title;
        FX.applyFx(this, p, { prison: C.rint(rng, 1, 3 + p.job.level), repute: -15, bonheur: -8 }, null);
        rep.lines.push("🚔 Ton activité illégale a été découverte, tu es arrêté(e).");
        this.news(p, "🚔 " + p.name + " (" + jt.toLowerCase() + ") est tombé(e) dans un coup de filet.", "crime");
        p.journal.push({ age: p.age, text: "Arrêté(e) par la police, direction la prison.", ic: "🚔", tag: "justice" });
      }
    } else if (p.retired) {
      const pn = p.pension - Math.round(incomeTax(p.pension) * 0.5);
      p.cash += pn; rep.income += pn; p.lastNetSalary = pn;
    } else if (C.studying(p) && !p.prison) {
      const bourse = 3200; p.cash += bourse; rep.income += bourse;
    } else if (p.age >= 18 && !p.job && !p.prison) {
      // aides minimales
      const aide = 6000; p.cash += aide; rep.income += aide;
    }
    // la mafia paie bien, jusqu'au jour de la chute
    if (!p.prison && (C.hasFlag(p, "mafia") || C.hasFlag(p, "parrain"))) {
      const boss = C.hasFlag(p, "parrain");
      const cl = [1, 2, 3].filter((i) => C.hasFlag(p, "cartel_" + i)).length;
      const PS = require("./pro").state(p);
      const respect = 1 + PS.rep / 220;
      const gain = Math.round((boss ? Math.min(2000000000, Math.max(150000, Math.max(0, C.netWorth(p)) * (0.07 + cl * 0.06))) : C.rint(rng, 25000, 110000)) * respect);
      p.cash += gain; rep.income += gain;
      rep.lines.push("🕴️ La famille t'a rapporté " + C.fmt(gain) + " en liquide cette année.");
      if (rng() < (boss ? 0.075 + cl * 0.03 : 0.075) - (p.stats.intel - 50) / 900 + PS.heat / 900 - PS.net / 2500) {
        const yrs = boss ? C.rint(rng, 12 + cl * 3, 30 + cl * 5) : C.rint(rng, 5, 14);
        FX.applyFx(this, p, { prison: yrs, repute: -20, bonheur: -12, unflag: ["mafia", "parrain", "cartel_1", "cartel_2", "cartel_3"] }, null);
        p.cash = Math.round(p.cash * (cl ? 0.15 : 0.4)); p.assets.forEach((a) => { a.value = Math.round(a.value * (cl ? 0.3 : 0.65)); });
        rep.lines.push("🚔 Le coup de filet a eu lieu. Tu es condamné(e) à " + yrs + " ans de prison, et la justice saisit une grande partie de tes biens.");
        this.news(p, "🚔 " + p.name + " tombe pour " + yrs + " ans après le démantèlement de son organisation.", "crime");
        p.journal.push({ age: p.age, text: "Condamné(e) à " + yrs + " ans de prison pour appartenance à la mafia.", ic: "🚔", tag: "justice" });
      } else if (rng() < 0.014) {
        p.dying = { cause: "un règlement de comptes entre familles", final: false };
        this.news(p, "🔫 " + p.name + " est retrouvé(e) sans vie, règlement de comptes.", "crime");
      }
    }
    // revenus et coûts des actifs
    let assetDelta = 0;
    if (this.market && p.assets.some((a) => MARKET_BETA[a.kind] && !a.partnerCompany)) rep.lines.push(this.bigCrash ? "💥 GRAND KRACH mondial. Presque tout s'effondre, même les biens les plus solides." : this.market < 0 ? "📉 Krach sur les marchés cette année. Les placements en bourse prennent cher." : "📈 Belle année sur les marchés, les placements en bourse en profitent.");
    p.assets.forEach((a) => {
      if (a.partnerCompany) return;
      const K = R.ASSET_KINDS[a.kind];
      let rate = K.g + K.v * gauss(rng);
      if (a.rate !== undefined) rate = a.rate + K.v * gauss(rng);
      if (this.market && MARKET_BETA[a.kind]) rate += this.market * MARKET_BETA[a.kind];
      if (this.bigCrash && GRAND_BETA[a.kind] !== undefined) rate += this.market * GRAND_BETA[a.kind];
      if (a.kind === "crypto") rate += this.cryptoShift;
      if ((a.kind === "livret" || a.kind === "obligations") && this.eco.zero > 0) rate = a.kind === "livret" ? 0 : -0.005;
      else if (a.kind === "livret" && rng() < 0.12) rate = 0;
      if (a.kind === "voiture" && a.rate === undefined) rate = -0.12;
      if (a.kind === "loufoque") rate = K.g + 0.25 * gauss(rng);
      if (a.empire) {
        // un empire est volatil, il peut doubler comme s'effondrer en une année
        rate = 0.1 + 0.3 * gauss(rng);
        if (rng() < 0.04 + a.level * 0.008) {
          rate = -(0.6 + rng() * 0.38);
          rep.lines.push("💥 Scandale, fraude découverte ou mauvais pari. Ton empire perd presque toute sa valeur en quelques semaines.");
          this.news(p, "💥 L'empire de " + p.name + " s'effondre brutalement.", "eco");
          p.flags["empire_" + a.level] && delete p.flags["empire_" + a.level];
        } else if (rate > 0.4) rep.lines.push("📈 Ton empire connaît une année extraordinaire.");
        const div = Math.round(Math.max(0, a.value) * 0.02); p.cash += div; rep.income += div;
      } else if (a.kind === "entreprise" && !a.partnerCompany && a.value >= 30000 && rng() < 0.014) {
        const m = 5 + rng() * 25; rate = m - 1;
        rep.lines.push("🦄 Ton entreprise devient une licorne. Sa valeur est multipliée par " + Math.round(m) + ".");
        this.news(p, "🦄 L'entreprise de " + p.name + " explose, valorisation multipliée par " + Math.round(m) + ".", "eco");
      }
      if (a.pool) {
        // placements risqués, un coup de génie ou un effondrement peuvent tout changer en une année
        if (K.jackpot && rng() < K.jackpot[0]) { const m = K.jackpot[1] * (rng() < 0.12 ? 4 : 1); rate = m - 1; rep.lines.push("🚀 " + K.ic + " " + K.l + " ont frappé un grand coup, ta position a été multipliée par " + m + "."); this.news(p, "🚀 " + p.name + " touche le gros lot avec ses " + K.l.toLowerCase() + ", position multipliée par " + m + ".", "eco"); }
        else if (K.crash && rng() < K.crash[0]) { rate = -K.crash[1]; rep.lines.push("📉 " + K.ic + " " + K.l + " s'effondrent cette année. Tu perds une bonne partie de ta mise."); }
        if (a.kind === "levier" && this.bigCrash) { const call = Math.round(a.value * (1 + rng() * 1.5)); p.debt += call; rep.lines.push("📞 Appel de marge. Ton courtier te réclame " + C.fmt(call) + " en plus de la mise perdue."); rate = -0.95; }
      }
      if (K.floor !== undefined) rate = Math.max(K.floor, rate);
      const nv = Math.max(0, Math.round(a.value * (1 + rate)));
      assetDelta += nv - a.value;
      a.value = nv;
      if (a.income) { p.cash += a.income; rep.income += a.income; }
      if (a.upkeep) { p.cash -= a.upkeep; rep.expenses += a.upkeep; }
      if (a.kind === "immo" && a.rent) { p.cash += a.rent; rep.income += a.rent; }
    });
    p.assets = p.assets.filter((a) => a.value > 0 || a.income || a.partnerCompany);
    rep.assetDelta = assetDelta;
    // dépenses de vie
    let cost = 0;
    if (!p.prison && p.age >= 18) {
      const L = R.LIFESTYLES[p.lifestyle];
      const ns = p.lastNetSalary || 0;
      const creep = Math.max(0, Math.min(ns, 80000) - 22000) * 0.55 + Math.max(0, ns - 80000) * 0.72;
      let base = (14000 + creep) * L.cost;
      const homeF = p.home === "parents" ? (p.age < 25 ? 0.35 : p.age < 30 ? 0.6 : 0.9) : p.home === "own" ? 0.85 : p.home === "street" ? 0.4 : 1;
      base *= homeF;
      if (p.home === "own") base += 0.012 * p.assets.filter((a) => a.kind === "immo").reduce((s, a) => s + a.value, 0);
      const kids = p.npcs.filter((n) => n.kind === "child" && n.alive && n.age < 19).length;
      base += kids * 4200;
      if (p.partner) base *= 0.82;
      if (C.hasFlag(p, "epargne_annee")) base *= 0.7;
      const pets = p.npcs.filter((n) => n.kind === "pet" && n.alive).length;
      base += pets * 500;
      if (C.studying(p)) base *= 0.8;
      if (p.retired) base *= 0.9;
      cost = Math.round(base);
    } else if (p.age < 18) {
      // l'argent de poche
      const ap = p.flags.classe_aisee ? 400 : p.flags.classe_modeste ? 90 : 200;
      if (p.age >= 8) { p.cash += ap; rep.income += ap; }
      cost = p.age >= 8 ? Math.round(ap * 0.8 * (R.LIFESTYLES[p.lifestyle].cost > 1 ? 1.15 : 1)) : 0;
    }
    p.cash -= cost; rep.expenses += cost;
    // inflation sur l'argent qui dort, et charges des grandes fortunes
    if (p.cash > 5000) { const infl = Math.round(p.cash * 0.015); p.cash -= infl; rep.expenses += infl; }
    const nw = C.netWorth(p);
    if (nw > 150000) {
      // charges d'une fortune, qui s'allègent chez les très grandes fortunes (elles s'organisent)
      const seg = (lo, hi, r) => Math.max(0, Math.min(nw, hi) - lo) * r;
      const wt = Math.round(seg(150000, 1e6, 0.012) + seg(1e6, 4e6, 0.032) + seg(4e6, 3e7, 0.052) + seg(3e7, 3e8, 0.02) + seg(3e8, 1e12, 0.008));
      p.cash -= wt; rep.expenses += wt;
    }
    // bonheur selon le niveau de vie
    p.stats.bonheur = C.clamp(p.stats.bonheur + R.LIFESTYLES[p.lifestyle].bonheur, 0, 100);
    if (p.lifestyle === "luxe" || p.lifestyle === "folie") p.stats.repute = C.clamp(p.stats.repute + 1, 0, 100);
    // découvert, d'abord couvert par la vente d'actifs liquides
    if (p.cash < 0) {
      const liq = p.assets.filter((a) => (R.ASSET_KINDS[a.kind] || {}).liquid && a.value > 0).sort((a, b) => b.value - a.value);
      for (const a of liq) {
        if (p.cash >= 0) break;
        const take = Math.min(a.value, -p.cash);
        a.value -= take; p.cash += take;
      }
      p.assets = p.assets.filter((a) => a.value > 0 || a.income || a.partnerCompany);
    }
    // découvert et intérêts
    if (p.cash < 0) { p.debt += Math.round(-p.cash); p.cash = 0; }
    if (p.debt > 0) {
      const interest = Math.round(p.debt * 0.055);
      p.debt += interest; rep.expenses += interest;
      // rembourse automatiquement quand il y a de l'argent
      const pay = Math.min(p.debt, Math.max(0, p.cash - 300));
      if (pay > 0 && p.age >= 18) { p.debt -= pay; p.cash -= pay; }
    }
    p.debt = Math.round(p.debt); p.cash = Math.round(p.cash);
    // prêts entre joueurs
    social.loanTick(this, p, rep);
    if (p.debt > 60000 && !p.flags.surendette) { p.flags.surendette = 1; p.queue.push({ id: "surendette", at: p.age + 1 }); }
    if (p.debt < 5000 && p.flags.surendette) delete p.flags.surendette;
  }

  _aging(p) {
    const rng = this.rng;
    const a = p.age;
    let drift = 0;
    if (a > 30) drift -= (a - 30) * 0.045;
    drift += (p.stats.sport - 50) * 0.012;
    if (p.lifestyle === "folie") drift -= 0.8;
    if (p.stats.bonheur < 25) drift -= 1;
    if (p.stats.bonheur > 75) drift += 0.4;
    drift += (rng() - 0.5) * 2;
    p.stats.sante = C.clamp(p.stats.sante + drift, 0, 100);
    // l'usure du corps
    if (a > 25) p.stats.sport = C.clamp(p.stats.sport - 0.4 - (a > 50 ? 0.5 : 0), 0, 100);
    if (a > 65) p.stats.charme = C.clamp(p.stats.charme - 0.6, 0, 100);
    if (a > 75) p.stats.intel = C.clamp(p.stats.intel - 0.6, 0, 100);
    // le bonheur revient lentement vers 55
    p.stats.bonheur = C.clamp(p.stats.bonheur + (55 - p.stats.bonheur) * 0.06, 0, 100);
    if (p.stats.sante <= 0) p.dying = { cause: "d'épuisement total", final: false };
  }

  _naturalDeath(p, rep) {
    const rng = this.rng;
    const lifespanAdj = 1;
    const base = R.baseMortality(p.age * lifespanAdj);
    const hf = C.clamp(1 + (50 - p.stats.sante) / 38, 0.35, 5);
    const dm = p.cfg.danger === "douce" ? 0.55 : p.cfg.danger === "dure" ? 1.7 : 1;
    let pr = base * hf * dm;
    if (p.age < 14) pr *= 0.5;
    if (p.age > 100) pr = Math.max(pr, 0.4);
    if (rng() < pr) {
      const st = R.stageOf(p.age);
      p.dying = { cause: pick(rng, DEATH_CAUSES[st]), final: false };
      return;
    }
    // un accident ou un coup du sort, même quand tout va bien
    const acc = require("./mort").roll(this, p);
    if (acc) {
      p.dying = { cause: acc.cause, final: false, story: acc.story };
      if (rep) rep.lines.push("💥 " + acc.story);
    }
  }

  _npcTick(p) {
    const rng = this.rng;
    p.npcs.forEach((n) => {
      if (!n.alive) return;
      n.age++;
      if (n.kind === "pet") { if (n.age > 14 && rng() < 0.15) { n.alive = false; p.queue.push({ id: "deuil_animal", at: p.age + 1, slots: { pet: n.id } }); } return; }
      // décès naturels des proches
      if (n.age > 65) {
        const pr = R.baseMortality(n.age) * 0.9;
        if (rng() < pr) {
          n.alive = false; n.deadAge = n.age;
          if (n.kind === "mere" || n.kind === "pere" || n.kind === "spouse" || n.kind === "grandparent") p.queue.push({ id: "deuil_proche", at: p.age + 1, slots: { proche: n.id } });
          if (n.kind === "spouse" && p.partner && p.partner.npc === n.id) { p.partner = null; p.stats.bonheur = C.clamp(p.stats.bonheur - 12, 0, 100); }
        }
      }
      // l'amitié s'effrite sans entretien
      if (["friend", "bestfriend", "sibling"].includes(n.kind) && rng() < 0.2) n.close = C.clamp(n.close - 2, 0, 100);
    });
    // les enfants grandissent : étiquette
  }

  _flashes(p, rep) {
    const rng = this.rng;
    if (rng() > 0.62) return;
    const pool = kit.FLASHES.filter((f) => (!f.ages || (p.age >= f.ages[0] && p.age <= f.ages[1])) && (!f.need || C.check(p, f.need, this)) && !(f.tag === "loufoque" && p.cfg.loufoque === 0) && !(f.tag === "mature" && !this.settings.mature) && (!p.prison || (f.need && f.need.prison)));
    if (!pool.length) return;
    const f = pick(rng, pool);
    const x = { slots: {}, vals: { ville: p.city } };
    if (f.who) Object.keys(f.who).forEach((slot) => { x.slots[slot] = C.getOrMakeNpc(p, rng, f.who[slot]); });
    FX.applyFx(this, p, f.fx, x);
    const text = C.render(f.t, p, x);
    rep.flashes.push({ t: text, ic: f.ic || "📰" });
    p.journal.push({ age: p.age, text, ic: f.ic || "📰", tag: "flash" });
  }

  // ---------- mort ----------
  die(p, cause) {
    p.alive = false;
    p.dying = null;
    const net = C.netWorth(p);
    p.death = { age: p.age, cause, round: this.round, net, survivor: false };
    p.finalWorth = net;
    p.eventsDone = true;
    this.news(p, "☠️ " + p.name + " est mort" + (p.gender === "f" ? "e" : "") + " à " + p.age + " ans, " + cause + ".", "death");
    p.journal.push({ age: p.age, text: "Tu es mort" + (p.gender === "f" ? "e" : "") + " à " + p.age + " ans, " + cause + ".", ic: "⚰️", tag: "mort" });
    social.onDeath(this, p, net);
    return { cause, age: p.age, net };
  }

  _finishGame(reason) {
    this.endedReason = reason;
    this.alivePlayers().forEach((p) => {
      p.alive = false;
      const net = C.netWorth(p);
      p.death = { age: p.age, cause: reason === "cap" ? "arrêté(e) en pleine forme (fin de partie anticipée)" : "d'un grand âge de légende", round: this.round, net, survivor: true };
      p.finalWorth = net;
      p.wealthHistory.push({ age: p.age, net });
    });
    this.results = this._results();
    if (this.settings.ending === "vote") this._startReview();
    else this.phase = "over";
  }

  // ---------- fin par vote ----------
  _startReview() {
    this.phase = "review";
    const order = this.players.slice().sort((a, b) => ((a.death ? a.death.age : a.age) - (b.death ? b.death.age : b.age)) || (a.seat - b.seat)).map((p) => p.seat);
    this.review = { order, idx: 0, ratings: {}, deadline: 0, minUntil: 0 };
    order.forEach((t) => { this.review.ratings[t] = {}; });
    this._beginLife();
  }

  _beginLife() {
    const R_ = this.review;
    const ms = this.settings.reviewTime === "none" ? 0 : Number(this.settings.reviewTime) * 1000 * this.timeScale;
    R_.deadline = ms ? this.now() + ms : 0;
    R_.minUntil = this.now() + 5000 * this.timeScale;
    this.players.forEach((p) => { p.botAt = this.now() + (1800 + Math.floor(this.rng() * 4000)) * this.timeScale; });
  }

  reviewTarget() { return this.review ? this.review.order[this.review.idx] : null; }
  canRate(seat, target) {
    if (seat === target) return this.settings.selfRate || this.players.length === 1;
    return !!this.players[seat];
  }
  raters(target) { return this.players.filter((p) => this.canRate(p.seat, target)); }

  rate(seat, score) {
    if (this.phase !== "review") return { ok: false };
    const t = this.reviewTarget();
    const n = Math.round(Number(score));
    if (!(n >= 1 && n <= 10) || !this.canRate(seat, t)) return { ok: false, error: "Tu ne peux pas noter cette vie." };
    this.review.ratings[t][seat] = n;
    this.players[seat].missed = 0;
    return { ok: true };
  }

  // Le jury d'une IA lit la vie en entier. Chaque IA a ses goûts (argent, bonheur, amour, morale, aventure),
  // mais personne ne peut donner un grand score à une vie passée en prison, ruinée ou gâchée.
  _botRate(p) {
    const t = this.players[this.reviewTarget()];
    const rng = this.rng;
    const net = t.finalWorth !== undefined ? t.finalWorth : C.netWorth(t);
    const age = t.death ? t.death.age : t.age;
    const m = t.mem || {};
    const taste = (k) => 0.55 + (((p.seat * 7919 + k * 104729 + (this.seed || 0)) >>> 0) % 1000) / 1000 * 0.9;
    const wMoney = taste(1), wHappy = taste(2), wLove = taste(3), wMoral = taste(4), wAdv = taste(5), wAmb = taste(6);
    let sc = 1.4;
    // fortune, avec un effet qui s'écrase vite
    sc += (net <= 0 ? -0.8 : Math.min(2.2, Math.log10(1 + net / 50000) * 1.1)) * wMoney;
    if (m.poorYears > 15) sc -= 0.8;
    // bonheur moyen sur toute la vie
    const hap = m.bhN ? m.bhSum / m.bhN : t.stats.bonheur;
    sc += C.clamp((hap - 82) / 10, -2.6, 1.2) * wHappy;
    // prison
    const jail = m.jailYears || 0;
    sc -= Math.min(4.8, jail * 0.3) * (0.8 + wMoral * 0.5);
    sc -= Math.max(0, (m.sentences || 1) - 1) * 0.3;
    // morale
    sc -= Math.min(1.5, (t.record || 0) * 0.25) * wMoral;
    // durée de vie
    sc += C.clamp((age - 55) / 30, -1.6, 0.6);
    // amour et famille
    sc += Math.min(1.0, (m.partnerYears || 0) / 40) * wLove;
    sc += Math.min(0.75, t.npcs.filter((n) => n.kind === "child" && n.alive).length * 0.25) * wLove;
    sc -= Math.min(0.6, (m.divorces || 0) * 0.2);
    // réussites racontées par le registre
    const wins = (t.ledger || []).filter((l) => ["metier", "argent", "etudes", "carriere"].includes(l.kind)).reduce((s, l) => s + l.w, 0);
    sc += Math.min(1.4, wins / 30) * wAmb;
    // vie remplie
    sc += Math.min(1.0, t.journal.length / 160) * wAdv;
    sc += gauss(rng) * 0.7;
    this.rate(p.seat, C.clamp(Math.round(sc), 1, 10));
  }

  _reviewTick(t) {
    const R_ = this.review;
    const target = this.reviewTarget();
    let changed = false;
    for (const p of this.raters(target)) {
      if (R_.ratings[target][p.seat] === undefined && this.controlled(p) && t >= p.botAt) { this._botRate(p); changed = true; }
    }
    const done = this.raters(target).every((p) => R_.ratings[target][p.seat] !== undefined);
    if ((done && t >= R_.minUntil) || (R_.deadline && t >= R_.deadline)) {
      R_.idx++;
      if (R_.idx >= R_.order.length) this._endReview();
      else this._beginLife();
      changed = true;
    }
    return changed;
  }

  _endReview() {
    this.results = this._results();
    this.phase = "over";
  }

  _results() {
    const list = this.players.map((p) => {
      const rs = this.review ? Object.values(this.review.ratings[p.seat] || {}) : [];
      const avg = rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : null;
      return { seat: p.seat, name: p.name, net: p.finalWorth !== undefined ? p.finalWorth : C.netWorth(p), age: p.death ? p.death.age : p.age, cause: p.death ? p.death.cause : "", survivor: !!(p.death && p.death.survivor), avg, votes: rs.length };
    });
    if (this.settings.ending === "vote") list.sort((a, b) => ((b.avg === null ? 5 : b.avg) - (a.avg === null ? 5 : a.avg)) || (b.votes - a.votes) || (b.net - a.net));
    else list.sort((a, b) => b.net - a.net);
    return list;
  }

  // prochaine action quand tout est mort (déclenché par tick)
  checkOver() {
    if (this.phase === "recap" && !this.alivePlayers().length) {
      // tous les joueurs ont vu leur bilan ou le délai est passé
      this._finishGame("allDead");
      return true;
    }
    return false;
  }

  readyRecap(seat) {
    const p = this.players[seat];
    if (!p || this.phase !== "recap") return { ok: false };
    p.ready = true; p.missed = 0;
    return { ok: true };
  }
}

function gauss(rng) { let u = 0, v = 0; while (u === 0) u = rng(); while (v === 0) v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

function snapshot(p) {
  return {
    stats: Object.assign({}, p.stats), traits: Object.assign({}, p.traits), cash: p.cash, debt: p.debt, grade: p.school.grade,
    job: p.job ? p.job.title + "|" + p.job.salary : null, jobTitle: p.job ? p.job.title : null, assets: p.assets.map((a) => a.id + "|" + a.name), prison: !!p.prison,
    npcs: p.npcs.map((n) => ({ id: n.id, close: n.close, alive: n.alive, kind: n.kind, name: n.name })), edu: p.school.edu, record: p.record, home: p.home,
  };
}

function diffChips(b, a, p, cost) {
  const chips = [];
  Object.keys(R.STATS).forEach((k) => { const d = Math.round(a.stats[k]) - Math.round(b.stats[k]); if (d) chips.push({ k: "stat", id: k, ic: R.STATS[k].ic, l: R.STATS[k].l, d }); });
  Object.keys(R.TRAITS).forEach((k) => { const d = Math.round(a.traits[k]) - Math.round(b.traits[k]); if (Math.abs(d) >= 1) chips.push({ k: "trait", id: k, ic: R.TRAITS[k].ic, l: R.TRAITS[k].l, d }); });
  const dc = Math.round(a.cash - b.cash);
  if (dc) chips.push({ k: "cash", ic: "💰", l: "Argent", d: dc, money: true });
  const dd = Math.round(a.debt - b.debt);
  if (dd) chips.push({ k: "debt", ic: "📉", l: "Dettes", d: dd, money: true, bad: dd > 0 });
  const dg = Math.round(a.grade - b.grade);
  if (dg) chips.push({ k: "notes", ic: "📝", l: "Niveau scolaire", d: dg });
  if (b.job !== a.job) {
    if (!b.job && a.job) chips.push({ k: "job", t: "💼 Nouveau métier " + a.jobTitle + " (" + C.fmt(Number(a.job.split("|")[1])) + " par an)" });
    else if (b.job && !a.job) chips.push({ k: "job", t: "💼 Tu n'as plus d'emploi" });
    else if (b.jobTitle !== a.jobTitle) chips.push({ k: "job", t: "💼 Nouveau poste " + a.jobTitle });
    else chips.push({ k: "job", t: "💼 Salaire modifié (" + C.fmt(Number(a.job.split("|")[1])) + " par an)" });
  }
  const bIds = new Set(b.assets); const aIds = new Set(a.assets);
  a.assets.forEach((s) => { if (!bIds.has(s)) chips.push({ k: "item", t: "🎁 Tu acquiers " + s.split("|")[1] }); });
  b.assets.forEach((s) => { if (!aIds.has(s)) chips.push({ k: "item", t: "🧳 Tu perds " + s.split("|")[1], bad: true }); });
  if (!b.prison && a.prison) chips.push({ k: "prison", t: "⛓️ Direction la prison", bad: true });
  if (b.prison && !a.prison) chips.push({ k: "prison", t: "🔓 Tu es libre" });
  a.npcs.forEach((n) => {
    const o = b.npcs.find((q) => q.id === n.id);
    if (!o) { if (n.kind !== "pet") chips.push({ k: "rel", t: "🤝 Nouvelle rencontre " + n.name }); else chips.push({ k: "rel", t: "🐾 " + n.name + " rejoint ta vie" }); return; }
    if (o.alive && !n.alive) chips.push({ k: "rel", t: "🕯️ " + n.name + " n'est plus là", bad: true });
    else if (n.close - o.close >= 5) chips.push({ k: "rel", t: "💞 Plus proche de " + n.name });
    else if (n.close - o.close <= -5) chips.push({ k: "rel", t: "💔 Moins proche de " + n.name, bad: true });
    if (o.kind !== n.kind && n.kind === "partner") chips.push({ k: "rel", t: "💘 " + n.name + " devient ton ou ta partenaire" });
    if (o.kind !== n.kind && n.kind === "spouse") chips.push({ k: "rel", t: "💍 Tu épouses " + n.name });
    if (o.kind !== n.kind && n.kind === "ex") chips.push({ k: "rel", t: "💔 Tu quittes " + n.name, bad: true });
  });
  if (b.edu !== a.edu) chips.push({ k: "edu", t: "🎓 Nouveau diplôme" });
  if (b.home !== a.home) chips.push({ k: "home", t: "🏠 Nouveau logement" });
  return chips;
}

module.exports = { Game, PROJECT_FLAGS };
