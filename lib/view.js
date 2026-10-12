// ============================================================
// RICHISSIME DESTINY — Vue filtrée par joueur
// Rien de ce que le joueur n'a pas le droit de savoir ne sort d'ici :
// fortunes des autres (selon le réglage), traits, drapeaux, journaux, offres des autres,
// choix en cours dans les scènes collectives.
// ============================================================
const R = require("./rules");
const C = require("./core");
const social = require("./social");

const KIND_LABEL = {
  mere: ["Mère", "Mère"], pere: ["Père", "Père"], sibling: ["Frère", "Sœur"], friend: ["Ami", "Amie"], bestfriend: ["Meilleur ami", "Meilleure amie"],
  rival: ["Rival", "Rivale"], teacher: ["Professeur", "Professeure"], partner: ["Partenaire", "Partenaire"], spouse: ["Époux", "Épouse"], child: ["Enfant", "Enfant"],
  neighbor: ["Voisin", "Voisine"], mentor: ["Mentor", "Mentor"], ex: ["Ex", "Ex"], crush: ["Béguin", "Béguin"], boss: ["Patron", "Patronne"], colleague: ["Collègue", "Collègue"],
  grandparent: ["Grand-père", "Grand-mère"], enemy: ["Ennemi", "Ennemie"], pet: ["Compagnon", "Compagnon"], stranger: ["Connaissance", "Connaissance"], star: ["Star", "Star"], client: ["Client", "Cliente"],
};
const KIND_ICON = { mere: "👩", pere: "👨", sibling: "🧒", friend: "🙂", bestfriend: "🤝", rival: "😤", teacher: "🧑‍🏫", partner: "💘", spouse: "💍", child: "👶", neighbor: "🏡", mentor: "🧙", ex: "💔", crush: "😍", boss: "👔", colleague: "💼", grandparent: "👵", enemy: "😈", pet: "🐾", stranger: "👤", star: "🌟", client: "🧾" };
const SCHOOL_LABEL = { primaire: "École primaire", college: "Collège", lycee: "Lycée", sup: "Études supérieures", none: "Hors école" };

function relLabel(n) { const l = KIND_LABEL[n.kind] || ["Proche", "Proche"]; return n.gender === "f" ? l[1] : l[0]; }

function marital(g, p) {
  if (!p.partner) return "Célibataire";
  let who = "";
  if (p.partner.player !== undefined) who = g.players[p.partner.player] ? g.players[p.partner.player].name : "";
  else { const n = p.npcs.find((x) => x.id === p.partner.npc); who = n ? n.name : ""; }
  return (p.partner.status === "marie" ? (p.gender === "f" ? "Mariée à " : "Marié à ") : "En couple avec ") + who;
}

function statusLine(g, p) {
  if (!p.alive) return "Décédé" + (p.gender === "f" ? "e" : "");
  if (p.prison) return "En prison";
  if (p.job) return p.job.title;
  if (p.retired) return "Retraité" + (p.gender === "f" ? "e" : "");
  if (R.TRACKS && p.school.phase === "sup") return "Étudiant" + (p.gender === "f" ? "e" : "");
  if (["primaire", "college", "lycee"].includes(p.school.phase)) return p.age < 11 ? "Écolier" + (p.gender === "f" ? "ère" : "") : p.age < 15 ? "Collégien" + (p.gender === "f" ? "ne" : "") : "Lycéen" + (p.gender === "f" ? "ne" : "");
  return "Sans emploi";
}

function wealthPublic(g, q, viewerSeat) {
  const net = C.netWorth(q);
  const t = C.wealthTier(net);
  if (q.seat === viewerSeat || !q.alive) return { net: q.alive ? net : (q.finalWorth !== undefined ? q.finalWorth : net), tier: t.l, k: t.k };
  const wv = g.settings.wealthView;
  if (wv === "exact") return { net, tier: t.l, k: t.k };
  if (wv === "tiers") return { net: null, tier: t.l, k: t.k };
  return { net: null, tier: null, k: null };
}

function pubPlayer(g, q, viewerSeat, extra) {
  const w = wealthPublic(g, q, viewerSeat);
  const o = {
    seat: q.seat, name: q.name, gender: q.gender, avatar: q.avatar, age: q.alive ? q.age : (q.death ? q.death.age : q.age), alive: q.alive,
    status: statusLine(g, q), marital: marital(g, q), prison: !!q.prison, repute: Math.round(q.stats.repute),
    net: w.net, tier: w.tier, tierK: w.k, bot: !!q.bot, auto: !!q.auto, you: q.seat === viewerSeat,
    ready: g.phase === "agenda" || g.phase === "recap" ? !!q.ready : g.phase === "event" ? !!q.eventsDone : false,
    kids: q.npcs.filter((n) => n.kind === "child" && n.alive).length,
    cause: q.death ? q.death.cause : null, deathAge: q.death ? q.death.age : null, survivor: !!(q.death && q.death.survivor),
  };
  if (extra && extra[q.seat]) Object.assign(o, extra[q.seat]);
  return o;
}

function meView(g, p) {
  const T = p.job ? R.TRACKS[p.job.track] : null;
  const nw = C.netWorth(p);
  return {
    seat: p.seat, name: p.name, gender: p.gender, avatar: p.avatar, alive: p.alive, age: p.age, gift: p.gift, city: p.city,
    stats: Object.keys(R.STATS).map((k) => ({ id: k, l: R.STATS[k].l, ic: R.STATS[k].ic, v: Math.round(p.stats[k]) })),
    traits: Object.keys(R.TRAITS).map((k) => ({ id: k, l: R.TRAITS[k].l, ic: R.TRAITS[k].ic, v: Math.round(p.traits[k]) })),
    cash: Math.round(p.cash), debt: Math.round(p.debt), net: nw, tier: C.wealthTier(nw).l, tierK: C.wealthTier(nw).k,
    lifestyle: p.lifestyle, home: p.home, prison: p.prison ? { left: p.prison.left, total: p.prison.total } : null, record: p.record,
    retired: !!p.retired, pension: Math.round(p.pension || 0),
    job: p.job ? { title: p.job.title, salary: p.job.salary, level: p.job.level, since: p.job.since, perf: Math.round(p.job.perf), track: T.l, ic: T.ic, illicit: !!T.illicit, next: T.levels[p.job.level + 1] ? T.levels[p.job.level + 1][0] : null, levels: T.levels.map((l) => l[0]) } : null,
    school: { phase: SCHOOL_LABEL[p.school.phase] || "", grade: Math.round(p.school.grade), diplomas: p.school.diplomas.filter((d) => d !== "aucun").map((d) => R.DIPLOMAS[d].l), edu: p.school.edu, eduLabel: Object.values(R.DIPLOMAS).filter((d) => d.rank === p.school.edu).map((d) => d.l)[0] || "", studying: p.school.phase === "sup", inSchool: ["primaire", "college", "lycee"].includes(p.school.phase), endAge: p.school.endAge },
    relations: p.npcs.filter((n) => n.alive || n.deadAge !== undefined).map((n) => ({ id: n.id, name: n.name, age: n.alive ? n.age : n.deadAge, gender: n.gender, kind: n.kind, label: relLabel(n), ic: KIND_ICON[n.kind] || "👤", close: Math.round(n.close), alive: n.alive, tag: n.tag })),
    partner: marital(g, p),
    assets: p.assets.map((a) => ({ id: a.id, kind: a.kind, name: a.name, value: Math.round(a.value), cost: Math.round(a.cost || 0), ic: (R.ASSET_KINDS[a.kind] || {}).ic || "📦", pool: !!a.pool, sellable: !a.pool && !a.partnerCompany, income: a.income || 0, upkeep: a.upkeep || 0, shared: !!a.partnerCompany })),
    heir: p.heir,
    history: p.wealthHistory.slice(),
    journal: p.journal.slice(-120).reverse(),
    flags: Object.keys(p.flags).filter((f) => ["fumeur", "ex_detenu", "ange_gardien", "fiducie", "mini_influenceur", "fantome_ami", "braqueur", "fraudeur", "peluche_geante"].includes(f)),
  };
}

function financeInfo(g, p) {
  return {
    kinds: R.INVEST_KINDS.map((k) => ({ id: k, l: R.ASSET_KINDS[k].l, ic: R.ASSET_KINDS[k].ic, rate: R.ASSET_KINDS[k].g, vol: R.ASSET_KINDS[k].v })),
    lifestyles: Object.keys(R.LIFESTYLES).map((k) => ({ id: k, l: R.LIFESTYLES[k].l, ic: R.LIFESTYLES[k].ic, d: R.LIFESTYLES[k].d, cost: R.LIFESTYLES[k].cost })),
    canInherit: !!g.settings.inheritance,
  };
}

function socialInfo(g, p) {
  const others = g.players.filter((q) => q.seat !== p.seat && q.alive);
  const kinds = Object.keys(social.KINDS).filter((k) => !(social.KINDS[k].hostile && !g.settings.hostile)).map((k) => ({ id: k, l: social.KINDS[k].l, ic: social.KINDS[k].ic, d: social.KINDS[k].d, hostile: !!social.KINDS[k].hostile }));
  return {
    kinds, duels: Object.keys(social.DUELS).map((k) => ({ id: k, l: social.DUELS[k].l, ic: social.DUELS[k].ic })),
    targets: others.map((q) => ({ seat: q.seat, name: q.name, avatar: q.avatar, coupleWithMe: !!(p.partner && p.partner.player === q.seat), single: !q.partner, married: !!(p.partner && p.partner.player === q.seat && p.partner.status === "marie") })),
    blocked: p.prison ? "Impossible depuis la prison." : null,
  };
}

function sceneView(g, p) {
  const sc = p.scene; if (!sc) return null;
  return {
    id: sc.id, ic: sc.ic, title: sc.title, text: sc.text, state: sc.state, tags: sc.tags, depth: sc.depth,
    choices: sc.choices.filter((c) => !c.hid).map((c) => ({ i: c.i, l: c.l, ic: c.ic, cost: c.cost || 0, ok: c.ok, why: c.why, risk: g.settings.hints ? c.risk : 0 })),
    result: sc.result ? { text: sc.result.text, chips: sc.result.chips, death: sc.result.death, saved: sc.result.saved, choice: sc.result.choiceLabel, hasNext: sc.result.hasNext } : null,
    deadline: sc.deadline || 0,
  };
}

function groupView(g, seat) {
  const grp = g.group; if (!grp || g.phase !== "group") return null;
  const inside = grp.seats.includes(seat);
  const p = g.players[seat];
  const v = {
    kind: grp.kind, ic: grp.ic, text: grp.text, state: grp.state, seats: grp.seats.map((s) => ({ seat: s, name: g.players[s].name, avatar: g.players[s].avatar, chose: grp.choices[s] !== undefined })),
    inside, deadline: grp.deadline || 0, stake: Math.round(grp.stake), title: grp.skin.title || null,
  };
  if (inside && grp.state === "choose") {
    v.options = social.groupOptions(g, p).map((o) => ({ v: o.v, l: o.l, ic: o.ic, d: o.d, ok: o.ok !== false, cost: o.cost || 0 }));
    v.myChoice = grp.choices[seat] !== undefined ? grp.choices[seat] : null;
  }
  if (grp.state === "result" && grp.result) {
    v.result = { line: grp.result.lines[seat] || null, public: grp.result.public };
    v.iAmReady = !!(grp.ready && grp.ready[seat]);
  }
  return v;
}


// ---------- Bilan de vie : un titre et une épitaphe, calculés à partir de ce que le joueur a réellement vécu ----------
const ARCHETYPES = [
  ["Fripouille", (p) => p.record >= 2 || (p.traits.honnete < 25 && p.record >= 1)],
  ["Cœur d'or", (p) => p.traits.bonte >= 72],
  ["Ambitieux sans scrupules", (p) => p.traits.ambition >= 72 && p.traits.honnete < 40],
  ["Bourreau de travail", (p) => p.traits.ambition >= 72],
  ["Aventurier", (p) => p.traits.courage >= 72],
  ["Artiste dans l'âme", (p) => p.traits.creatif >= 72],
  ["Âme de la fête", (p) => p.traits.sociable >= 72],
  ["Prudent invétéré", (p) => p.traits.prudent >= 72],
  ["Honnête jusqu'au bout", (p) => p.traits.honnete >= 72],
  ["Rescapé de la vie", (p) => p.flags.rescape || p.flags.survivant],
  ["Éternel rêveur", (p) => p.stats.bonheur >= 70],
];
function mainTrack(p) {
  let best = null, n = 0;
  Object.keys(p.exp || {}).forEach((k) => { if (R.TRACKS[k] && p.exp[k] > n) { n = p.exp[k]; best = k; } });
  if (!best && p.job) best = p.job.track;
  return best;
}
function lifeTitle(g, p, survivor) {
  const arche = (ARCHETYPES.find((a) => a[1](p)) || ["Vie tranquille"])[0];
  const tr = mainTrack(p);
  const career = tr ? R.TRACKS[tr].l : (p.school.edu >= 5 ? "Études et savoirs" : "Sans métier fixe");
  const net = p.finalWorth !== undefined ? p.finalWorth : C.netWorth(p);
  const tier = C.wealthTier(net).l;
  const age = p.death ? p.death.age : p.age;
  const kids = p.npcs.filter((n) => n.kind === "child").length;
  let tail = age < 35 ? "parti{|e} bien trop tôt" : age < 60 ? "disparu{|e} en pleine vie" : age >= 90 ? "centenaire dans l'âme" : "au terme d'une longue vie";
  if (survivor) tail = "toujours en vie à la fin de la partie";
  tail = tail.replace(/\{\|e\}/g, p.gender === "f" ? "e" : "");
  const bits = [arche + " du secteur " + career.toLowerCase(), tier.toLowerCase(), kids >= 3 ? "grande famille" : kids === 0 ? "sans enfant" : kids + " enfant" + (kids > 1 ? "s" : ""), tail];
  return { arche, career, tier, text: bits.join(", ") };
}


// ---------- fiche de vie (fin par vote) ----------
const MOMENT_W = { mort: 10, naissance: 10, jalon: 6, saga: 6, justice: 6, amour: 5, famille: 4, argent: 4, sante: 4, travail: 3, social: 3, ecole: 2, flash: 1 };
function lifeFile(g, p) {
  if (p._lf && p._lfAge === (p.death ? p.death.age : p.age)) return p._lf;
  const net = p.finalWorth !== undefined ? p.finalWorth : C.netWorth(p);
  const age = p.death ? p.death.age : p.age;
  const wh = p.wealthHistory.length ? p.wealthHistory : [{ age, net }];
  const peak = wh.reduce((a, b) => (b.net > a.net ? b : a), wh[0]);
  const low = wh.reduce((a, b) => (b.net < a.net ? b : a), wh[0]);
  const scored = p.journal.map((j, i) => ({ j, sc: (MOMENT_W[j.tag] || 2) + ((i * 2654435761) >>> 0) % 1000 / 400 }));
  const keep = new Set(scored.filter((x) => x.j.tag === "naissance" || x.j.tag === "mort").map((x) => x));
  scored.filter((x) => !keep.has(x)).sort((a, b) => b.sc - a.sc).slice(0, 12 - keep.size).forEach((x) => keep.add(x));
  const moments = scored.filter((x) => keep.has(x)).map((x) => ({ age: x.j.age, ic: x.j.ic || "•", text: x.j.text }));
  const jobs = p.jobHistory.map((j) => j.title).concat(p.job ? [p.job.title] : []);
  const uniqJobs = jobs.filter((t, i) => jobs.indexOf(t) === i);
  const kids = p.npcs.filter((n) => n.kind === "child");
  const lt = lifeTitle(g, p, !!(p.death && p.death.survivor));
  p._lfAge = age;
  p._lf = {
    seat: p.seat, name: p.name, avatar: p.avatar, gender: p.gender, age, cause: p.death ? p.death.cause : "", survivor: !!(p.death && p.death.survivor),
    title: lt.text, arche: lt.arche, birth: p.cfg ? p.cfg.startClass : null,
    money: { net, peak: Math.round(peak.net), peakAge: peak.age, low: Math.round(low.net), lowAge: low.age, income: Math.round(p.life.income), expenses: Math.round(p.life.expenses), gains: Math.round(p.life.gains), losses: Math.round(p.life.losses), debt: Math.round(p.debt) },
    stats: Object.keys(R.STATS).map((k) => ({ id: k, ic: R.STATS[k].ic, l: R.STATS[k].l, v: Math.round(p.stats[k]) })),
    jobs: uniqJobs.slice(0, 8), jobCount: uniqJobs.length, yearsWorked: p.yearsWorked,
    diplomas: (p.school.diplomas || []).filter((d) => d !== "aucun").slice(-3),
    assets: p.assets.slice().sort((a, b) => b.value - a.value).slice(0, 5).map((a) => a.name),
    love: p.npcs.filter((n) => ["spouse", "partner"].includes(n.kind)).map((n) => n.name).concat(p.partner && p.partner.player !== undefined && g.players[p.partner.player] ? [g.players[p.partner.player].name] : []).slice(0, 3),
    exes: p.npcs.filter((n) => n.kind === "ex").length,
    kids: kids.length, kidNames: kids.slice(0, 5).map((n) => n.name),
    record: p.record, prison: !!p.flags.ex_detenu,
    moments, wealth: wh.map((w) => ({ age: w.age, net: Math.round(w.net) })),
  };
  return p._lf;
}

function reviewView(g, seat) {
  const Rv = g.review;
  const t = g.reviewTarget();
  const target = g.players[t];
  return {
    idx: Rv.idx, total: Rv.order.length, target: t, file: lifeFile(g, target),
    deadline: Rv.deadline || 0, totalMs: g.settings.reviewTime === "none" ? 0 : Number(g.settings.reviewTime) * 1000 * g.timeScale,
    canRate: g.canRate(seat, t), mine: Rv.ratings[t][seat] || 0,
    raters: g.raters(t).map((p) => ({ seat: p.seat, name: p.name, avatar: p.avatar, done: Rv.ratings[t][p.seat] !== undefined, bot: g.controlled(p) })),
    order: Rv.order.map((o) => ({ seat: o, name: g.players[o].name, avatar: g.players[o].avatar })),
    selfRate: !!g.settings.selfRate,
  };
}

function awards(g) {
  const list = g.players.map((p) => ({
    p, net: p.finalWorth !== undefined ? p.finalWorth : C.netWorth(p), age: p.death ? p.death.age : p.age,
    bonte: p.traits.bonte, honnete: p.traits.honnete, repute: p.stats.repute, record: p.record, bonheur: p.stats.bonheur,
    level: p.jobHistory.length + (p.job ? 1 : 0), kids: p.npcs.filter((n) => n.kind === "child").length,
    diplomas: p.school.edu,
  }));
  const best = (f, min) => { const s = list.slice().sort((a, b) => f(b) - f(a)); return s[0] && f(s[0]) >= (min || -Infinity) ? s[0].p : null; };
  const out = [];
  const add = (ic, l, d, p) => { if (p) out.push({ ic, l, d, seat: p.seat, name: p.name }); };
  add("💰", "Le plus riche", "A fini avec la plus belle fortune.", best((x) => x.net));
  add("🕰️", "La plus longue vie", "A vécu le plus longtemps.", best((x) => x.age));
  add("💗", "Grand cœur", "La bonté personnifiée.", best((x) => x.bonte, 60));
  add("📣", "Star incontestée", "La plus belle réputation.", best((x) => x.repute, 60));
  add("🦹", "Casier chargé", "A fait le plus de bêtises avec la justice.", best((x) => x.record, 1));
  add("👨‍👩‍👧‍👦", "Famille nombreuse", "A eu le plus d'enfants.", best((x) => x.kids, 1));
  add("🎓", "Tête bien faite", "Le plus haut niveau d'études.", best((x) => x.diplomas, 3));
  add("🤪", "Bonne humeur", "Le plus heureux à la fin de sa vie.", best((x) => x.bonheur, 60));
  add("🧳", "Touche-à-tout", "A enchaîné le plus de métiers.", best((x) => x.level, 4));
  return out;
}

function finalView(g) {
  return {
    mode: g.settings.ending,
    files: g.players.map((p) => lifeFile(g, p)),
    ranking: g.results.map((r, i) => ({ rank: i + 1, avg: r.avg === null || r.avg === undefined ? null : Math.round(r.avg * 100) / 100, votes: r.votes || 0, scores: g.review ? Object.keys(g.review.ratings[r.seat] || {}).map((k) => ({ from: g.players[Number(k)].name, v: g.review.ratings[r.seat][k] })) : [], seat: r.seat, name: r.name, avatar: g.players[r.seat].avatar, net: r.net, tier: C.wealthTier(r.net).l, age: r.age, cause: r.cause, survivor: r.survivor, status: g.players[r.seat].job ? g.players[r.seat].job.title : "", life: lifeTitle(g, g.players[r.seat], r.survivor) })),
    histories: g.players.map((p) => ({ seat: p.seat, name: p.name, avatar: p.avatar, points: p.wealthHistory.slice() })),
    awards: awards(g),
    reason: g.endedReason,
    highlights: g.players.map((p) => ({ seat: p.seat, name: p.name, lines: p.journal.filter((j) => !["flash"].includes(j.tag)).slice(-40).filter((_, i, a) => i % Math.max(1, Math.floor(a.length / 6)) === 0).slice(0, 6) })),
  };
}

function getStateFor(g, seat, now) {
  const p = g.players[seat];
  const st = {
    phase: g.phase, round: g.round, age: g.age, startAge: g.startAge, deadline: g.deadline || 0, settings: g.settings,
    players: g.players.map((q) => pubPlayer(g, q, seat)),
    me: p ? meView(g, p) : null,
    gazette: g.gazette.slice(-40).reverse(),
    seat,
  };
  if (!p) return st;
  st.scene = sceneView(g, p);
  if (g.phase === "agenda") {
    st.agenda = {
      ready: !!p.ready, plan: p.plan ? { project: p.plan.project, social: p.plan.social || null } : null,
      projects: g.availableProjects(p).map((pr) => ({ id: pr.id, l: pr.l, ic: pr.ic, d: pr.d, cost: pr.cost || 0 })),
      finance: financeInfo(g, p), social: socialInfo(g, p),
    };
  }
  if (g.phase === "respond") {
    st.offers = g.offers.filter((o) => o.to === seat && o.status === "pending").map((o) => ({ id: o.id, from: o.from, fromName: g.players[o.from].name, kind: o.a.kind, text: social.offerText(g, o), canHalf: o.a.kind === "ask" }));
    st.waitingOffers = g.offers.filter((o) => o.status === "pending").length;
    st.myOffers = g.offers.filter((o) => o.from === seat).map((o) => ({ id: o.id, toName: g.players[o.to].name, kind: o.a.kind, status: o.status }));
  }
  if (g.phase === "group") st.group = groupView(g, seat);
  if (g.phase === "recap" || g.phase === "event") {
    if (p.report && g.phase === "recap") st.report = p.report;
  }
  if (g.phase === "recap") {
    st.recap = { ready: !!p.ready, report: p.report || null, death: p.death || null };
  }
  if (g.phase === "review") st.review = reviewView(g, seat);
  if (g.phase === "over") st.final = finalView(g);
  st.me && (st.me.deathInfo = p.death ? { age: p.death.age, cause: p.death.cause, net: p.death.net, survivor: !!p.death.survivor } : null);
  return st;
}

module.exports = { getStateFor, KIND_LABEL };
