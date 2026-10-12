// ============================================================
// RICHISSIME DESTINY — Interactions entre joueurs
//  1) Actions sociales (une par année et par joueur) : cadeau, prêt, demande d'aide,
//     couple, mariage, entreprise commune, vol, rumeur, défi, dénonciation.
//  2) Scènes collectives : dilemme, cagnotte, enchères, élection, partage, braquage.
// ============================================================
const R = require("./rules");
const C = require("./core");
const FX = require("./fx");
const { pick, POOLS } = require("./pools");

const HOSTILE = ["steal", "rumor", "denounce"];
const KINDS = {
  gift: { l: "Faire un cadeau", ic: "🎁", d: "Tu offres de l'argent. Pas besoin de réponse." },
  loan: { l: "Prêter de l'argent", ic: "🏦", d: "Avec intérêts, remboursable dans quelques années." },
  ask: { l: "Demander de l'aide", ic: "🙏", d: "Tu supplies de l'argent. À lui ou elle de décider." },
  couple: { l: "Sortir ensemble", ic: "💘", d: "Vous deviendrez un couple (dépenses partagées, plus de bonheur)." },
  marry: { l: "Demander en mariage", ic: "💍", d: "Il faut déjà être en couple. Le mariage lie vos fortunes en cas de décès ou de divorce." },
  company: { l: "Fonder une entreprise", ic: "🤝", d: "Chacun investit la même somme dans une société à parts égales." },
  steal: { l: "Voler", ic: "🦹", d: "Tu piques de l'argent. Risque d'être attrapé(e).", hostile: true },
  rumor: { l: "Répandre une rumeur", ic: "🗣️", d: "Tu salis sa réputation. Si c'est découvert, ça se retourne contre toi.", hostile: true },
  duel: { l: "Lancer un défi", ic: "⚔️", d: "Un pari d'argent sur une épreuve (course, quiz, charme ou poker)." },
  denounce: { l: "Dénoncer", ic: "📢", d: "Tu signales ses casseroles à la police. Si c'est faux, ça te coûte cher.", hostile: true },
};
const DUELS = { course: { l: "Course", ic: "🏃", stat: "sport" }, quiz: { l: "Quiz", ic: "🧠", stat: "intel" }, charme: { l: "Concours de charme", ic: "✨", stat: "charme" }, poker: { l: "Poker", ic: "🃏", stat: "poker" } };

function seatName(g, s) { return g.players[s].name; }
function G(p, a, b) { return p.gender === "f" ? b : a; }
function wealthWord(g, amount) { return g.settings.wealthView === "exact" ? " (" + C.fmt(amount) + ")" : ""; }

// ---------- validation d'une action ----------
function validate(g, p, a) {
  const def = KINDS[a.kind];
  if (!def) return { ok: false, error: "Action inconnue." };
  if (def.hostile && !g.settings.hostile) return { ok: false, error: "Les coups bas sont désactivés." };
  if (p.prison) return { ok: false, error: "Impossible depuis la prison." };
  const t = g.players[Number(a.target)];
  if (!t || t === p || !t.alive) return { ok: false, error: "Cible invalide." };
  const num = (v, lo, hi, d) => { v = Math.floor(Number(v)); if (!isFinite(v)) v = d; return Math.max(lo, Math.min(hi, v)); };
  const act = { kind: a.kind, target: t.seat };
  const minAge = { loan: 16, company: 18, couple: 15, marry: 18 }[a.kind];
  if (minAge && (p.age < minAge || t.age < minAge)) return { ok: false, error: "Vous êtes trop jeunes pour ça, il faut avoir " + minAge + " ans." };
  switch (a.kind) {
    case "gift": act.amount = num(a.amount, 50, Math.floor(p.cash), 0); if (act.amount < 50) return { ok: false, error: "Tu n'as pas assez d'argent." }; break;
    case "loan": act.amount = num(a.amount, 100, Math.floor(p.cash), 0); if (act.amount < 100) return { ok: false, error: "Tu n'as pas assez d'argent." };
      act.rate = num(a.rate, 0, 25, 8); act.years = num(a.years, 1, 10, 3); break;
    case "ask": act.amount = num(a.amount, 100, 200000, 1000); break;
    case "couple": if (p.partner || t.partner) return { ok: false, error: "L'un de vous est déjà en couple." }; break;
    case "marry": if (!(p.partner && p.partner.player === t.seat && p.partner.status === "couple")) return { ok: false, error: "Il faut d'abord être en couple avec ce joueur." }; break;
    case "company": act.amount = num(a.amount, 1000, Math.floor(p.cash), 0); if (act.amount < 1000) return { ok: false, error: "Il faut au moins 1 000 € à investir." }; break;
    case "steal": act.tier = ["petit", "moyen", "gros"].includes(a.tier) ? a.tier : "petit"; break;
    case "duel": act.game = DUELS[a.game] ? a.game : "course"; act.amount = num(a.amount, 0, Math.floor(p.cash), 0); break;
    case "rumor": case "denounce": break;
  }
  return { ok: true, action: act };
}

// ---------- résolution des actions choisies ----------
function resolveActions(g) {
  g.offers = []; let seq = 1;
  const order = g.alivePlayers().slice().sort(() => g.rng() - 0.5);
  for (const p of order) {
    const a = p.plan && p.plan.social;
    if (!a || !p.alive) continue;
    const t = g.players[a.target];
    if (!t.alive) continue;
    switch (a.kind) {
      case "gift": {
        const amt = Math.min(a.amount, Math.floor(p.cash));
        if (amt < 1) break;
        p.cash -= amt; t.cash += amt;
        p.yearLog.push("🎁 Tu as offert " + C.fmt(amt) + " à " + t.name + ".");
        t.yearLog.push("🎁 " + p.name + " t'a offert " + C.fmt(amt) + " !");
        t.stats.bonheur = C.clamp(t.stats.bonheur + 4, 0, 100); p.stats.repute = C.clamp(p.stats.repute + 2, 0, 100); p.traits.bonte = C.clamp(p.traits.bonte + 2, 0, 100);
        g.news(p, "🎁 " + p.name + " a fait un cadeau à " + t.name + wealthWord(g, amt) + ".");
        break;
      }
      case "steal": doSteal(g, p, t, a); break;
      case "rumor": doRumor(g, p, t); break;
      case "denounce": doDenounce(g, p, t); break;
      default: g.offers.push({ id: seq++, from: p.seat, to: t.seat, a, status: "pending" });
    }
  }
}

function offerText(g, o) {
  const f = g.players[o.from], a = o.a;
  switch (a.kind) {
    case "loan": return f.name + " te propose un prêt de " + C.fmt(a.amount) + " à " + a.rate + " % sur " + a.years + " an" + (a.years > 1 ? "s" : "") + ".";
    case "ask": return f.name + " te demande de l'aide, " + C.fmt(a.amount) + " pour s'en sortir.";
    case "couple": return f.name + " te propose de sortir ensemble.";
    case "marry": return f.name + " te demande en mariage !";
    case "company": return f.name + " te propose de monter une entreprise ensemble, avec " + C.fmt(a.amount) + " chacun.";
    case "duel": return f.name + " te lance un défi de " + DUELS[a.game].l.toLowerCase() + (a.amount ? " avec " + C.fmt(a.amount) + " en jeu." : " pour l'honneur.");
    default: return "";
  }
}

function respond(g, seat, offerId, answer) {
  if (g.phase !== "respond") return { ok: false };
  const o = g.offers.find((x) => x.id === offerId && x.to === seat && x.status === "pending");
  if (!o) return { ok: false };
  const yes = answer === "yes" || answer === "half";
  applyOffer(g, o, yes, answer);
  return { ok: true };
}

function expireOffers(g) { g.offers.filter((o) => o.status === "pending").forEach((o) => applyOffer(g, o, false, "no")); }

function applyOffer(g, o, yes, answer) {
  const f = g.players[o.from], t = g.players[o.to], a = o.a;
  o.status = yes ? "yes" : "no";
  if (!f.alive || !t.alive) { o.status = "void"; return; }
  if (!yes) {
    f.yearLog.push("❌ " + t.name + " a refusé ta proposition (" + KINDS[a.kind].l.toLowerCase() + ").");
    if (a.kind === "marry" || a.kind === "couple") { f.stats.bonheur = C.clamp(f.stats.bonheur - 8, 0, 100); g.news(f, "💔 " + f.name + " s'est fait" + G(f, "", "e") + " éconduire par " + t.name + "."); }
    return;
  }
  switch (a.kind) {
    case "loan": {
      const amt = Math.min(a.amount, Math.floor(f.cash));
      if (amt < 100) { o.status = "void"; return; }
      f.cash -= amt; t.cash += amt;
      g.loans.push({ from: f.seat, to: t.seat, principal: amt, rate: a.rate / 100, due: g.round + a.years, balance: amt });
      f.yearLog.push("🏦 Tu as prêté " + C.fmt(amt) + " à " + t.name + ".");
      t.yearLog.push("🏦 " + f.name + " t'a prêté " + C.fmt(amt) + ".");
      g.news(f, "🏦 " + f.name + " a prêté de l'argent à " + t.name + ".");
      break;
    }
    case "ask": {
      let amt = a.amount; if (answer === "half") amt = Math.floor(amt / 2);
      amt = Math.min(amt, Math.floor(t.cash));
      if (amt < 50) { o.status = "void"; return; }
      t.cash -= amt; f.cash += amt;
      t.stats.repute = C.clamp(t.stats.repute + 2, 0, 100); f.stats.bonheur = C.clamp(f.stats.bonheur + 3, 0, 100);
      f.yearLog.push("🙏 " + t.name + " t'a donné " + C.fmt(amt) + ".");
      t.yearLog.push("🙏 Tu as aidé " + f.name + " avec " + C.fmt(amt) + ".");
      g.news(t, "🙏 " + t.name + " a aidé " + f.name + wealthWord(g, amt) + ".");
      break;
    }
    case "couple": {
      if (f.partner || t.partner) { o.status = "void"; return; }
      f.partner = { player: t.seat, status: "couple" }; t.partner = { player: f.seat, status: "couple" };
      f.stats.bonheur = C.clamp(f.stats.bonheur + 8, 0, 100); t.stats.bonheur = C.clamp(t.stats.bonheur + 8, 0, 100);
      f.yearLog.push("💘 Tu sors maintenant avec " + t.name + " !"); t.yearLog.push("💘 Tu sors maintenant avec " + f.name + " !");
      g.news(f, "💘 " + f.name + " et " + t.name + " sont en couple !", "love");
      f.journal.push({ age: g.age, text: "Tu es en couple avec " + t.name + ".", ic: "💘", tag: "amour" });
      t.journal.push({ age: g.age, text: "Tu es en couple avec " + f.name + ".", ic: "💘", tag: "amour" });
      break;
    }
    case "marry": {
      if (!(f.partner && f.partner.player === t.seat)) { o.status = "void"; return; }
      f.partner.status = "marie"; t.partner = { player: f.seat, status: "marie" };
      f.stats.bonheur = C.clamp(f.stats.bonheur + 10, 0, 100); t.stats.bonheur = C.clamp(t.stats.bonheur + 10, 0, 100);
      const party = 2500; f.cash -= Math.min(f.cash, party / 2); t.cash -= Math.min(t.cash, party / 2);
      f.yearLog.push("💍 Tu épouses " + t.name + " !"); t.yearLog.push("💍 Tu épouses " + f.name + " !");
      g.news(f, "💍 " + f.name + " et " + t.name + " se marient !", "love");
      f.journal.push({ age: g.age, text: "Mariage avec " + t.name + ".", ic: "💍", tag: "amour" });
      t.journal.push({ age: g.age, text: "Mariage avec " + f.name + ".", ic: "💍", tag: "amour" });
      break;
    }
    case "company": {
      const amt = Math.min(a.amount, Math.floor(f.cash), Math.floor(t.cash));
      if (amt < 1000) { o.status = "void"; f.yearLog.push("Votre projet d'entreprise est tombé à l'eau, faute de fonds."); return; }
      f.cash -= amt; t.cash -= amt;
      const id = "c" + (g.companies.length + 1) + "_" + g.round;
      const co = { id, a: f.seat, b: t.seat, value: amt * 2, name: pick(g.rng, POOLS.boites), born: g.round };
      g.companies.push(co);
      [f, t].forEach((x) => { x.assets.push({ id: "a" + (++x.assetSeq), kind: "entreprise", name: co.name + " (société commune)", value: amt, cost: amt, upkeep: 0, income: 0, partnerCompany: id }); });
      f.yearLog.push("🤝 Tu fondes " + co.name + " avec " + t.name + "."); t.yearLog.push("🤝 Tu fondes " + co.name + " avec " + f.name + ".");
      g.news(f, "🤝 " + f.name + " et " + t.name + " fondent l'entreprise " + co.name + ".", "money");
      break;
    }
    case "duel": doDuel(g, f, t, a); break;
  }
}

// ---------- coups bas ----------
function doSteal(g, p, t, a) {
  const pct = { petit: 0.06, moyen: 0.14, gros: 0.28 }[a.tier];
  const loot = Math.floor(t.cash * pct);
  if (loot < 50) { p.yearLog.push("🦹 " + t.name + " n'avait presque rien à voler."); return; }
  let pr = 0.5 + (p.stats.intel - t.stats.intel) / 220 + (p.traits.courage - 50) / 300 - (t.traits.prudent - 50) / 250 - { petit: 0, moyen: 0.08, gros: 0.18 }[a.tier];
  if (p.flags.bagout) pr += 0.05;
  pr = C.clamp(pr, 0.12, 0.88);
  if (g.rng() < pr) {
    t.cash -= loot; p.cash += loot;
    p.traits.honnete = C.clamp(p.traits.honnete - 4, 0, 100); p.stats.bonheur = C.clamp(p.stats.bonheur + 2, 0, 100);
    p.yearLog.push("🦹 Tu as volé " + C.fmt(loot) + " à " + t.name + " sans te faire prendre.");
    const known = g.rng() < 0.3;
    t.yearLog.push("😡 On t'a volé " + C.fmt(loot) + " !" + (known ? " Tu soupçonnes fortement " + p.name + "." : " Tu ignores qui est le coupable."));
    t.stats.bonheur = C.clamp(t.stats.bonheur - 6, 0, 100);
    p.flags.voleur = 1; p.flagTtl.voleur = 12; p.record += g.rng() < 0.4 ? 1 : 0;
    g.news(null, "🦹 Un vol mystérieux a eu lieu chez " + t.name + ".", "crime");
  } else {
    p.stats.repute = C.clamp(p.stats.repute - 15, 0, 100);
    const fine = Math.min(Math.floor(p.cash), 600);
    p.cash -= fine; t.cash += fine;
    p.yearLog.push("🚔 Tu t'es fait" + G(p, "", "e") + " prendre en train de voler " + t.name + ". Amende de " + C.fmt(fine) + ".");
    t.yearLog.push("🚔 " + p.name + " a essayé de te voler, mais tu l'as pris(e) sur le fait !");
    g.news(p, "🚔 " + p.name + " a été pris" + G(p, "", "e") + " la main dans le sac chez " + t.name + ".", "crime");
    if (g.settings.mature && g.rng() < 0.2) { FX.applyFx(g, p, { prison: 1 }, null); p.yearLog.push("⛓️ Le juge t'envoie un an en prison."); }
  }
}
function doRumor(g, p, t) {
  let pr = 0.68 + (p.flags.bagout ? 0.1 : 0) + (p.stats.charme - 50) / 400;
  if (g.rng() < pr) {
    t.stats.repute = C.clamp(t.stats.repute - 12, 0, 100); t.stats.bonheur = C.clamp(t.stats.bonheur - 5, 0, 100);
    p.traits.bonte = C.clamp(p.traits.bonte - 3, 0, 100); p.traits.honnete = C.clamp(p.traits.honnete - 3, 0, 100);
    p.yearLog.push("🗣️ Ta rumeur sur " + t.name + " a fait le tour de la ville.");
    t.yearLog.push("🗣️ Une rumeur horrible circule sur toi. Ta réputation en prend un coup.");
    g.news(null, "🗣️ Une rumeur circule sur " + t.name + "…", "gossip");
  } else {
    p.stats.repute = C.clamp(p.stats.repute - 10, 0, 100);
    p.yearLog.push("😬 Ta rumeur a été découverte. Tout le monde sait que c'était toi.");
    t.yearLog.push("😤 Une rumeur sur toi a été lancée par " + p.name + ", mais tout le monde l'a découvert.");
    g.news(p, "😬 " + p.name + " a été démasqué" + G(p, "", "e") + " en train de répandre une rumeur sur " + t.name + ".", "gossip");
  }
}
function doDenounce(g, p, t) {
  const guilty = t.record > 0 || t.flags.illicite || t.flags.voleur || t.flags.fugitif || (t.job && R.TRACKS[t.job.track].illicit);
  if (guilty && g.rng() < 0.8) {
    FX.applyFx(g, t, { prison: C.rint(g.rng, 1, 3), repute: -10 }, null);
    p.stats.repute = C.clamp(p.stats.repute + 3, 0, 100);
    p.yearLog.push("📢 Ta dénonciation a fonctionné, " + t.name + " est en prison.");
    t.yearLog.push("🚔 Quelqu'un t'a dénoncé(e). Tu es arrêté(e) !");
    g.news(null, "🚔 " + t.name + " a été arrêté(e) après une dénonciation.", "crime");
  } else {
    p.stats.repute = C.clamp(p.stats.repute - 12, 0, 100);
    p.yearLog.push("📢 Ta dénonciation était sans preuve, tu passes pour un(e) calomniateur(trice).");
    t.yearLog.push("📢 Quelqu'un a essayé de te dénoncer à tort.");
    g.news(p, "📢 " + p.name + " a dénoncé " + t.name + " sans preuves.", "gossip");
  }
}
function doDuel(g, f, t, a) {
  const D = DUELS[a.game];
  const score = (p) => {
    let s;
    if (D.stat === "poker") s = (p.stats.intel + p.traits.courage + p.stats.charme) / 3;
    else s = p.stats[D.stat];
    return s + g.rng() * 55;
  };
  const sf = score(f), st = score(t);
  const winner = sf >= st ? f : t, loser = winner === f ? t : f;
  const amt = Math.min(a.amount, Math.floor(loser.cash));
  if (amt > 0) { loser.cash -= amt; winner.cash += amt; }
  winner.stats.bonheur = C.clamp(winner.stats.bonheur + 4, 0, 100); loser.stats.bonheur = C.clamp(loser.stats.bonheur - 3, 0, 100);
  winner.stats.repute = C.clamp(winner.stats.repute + 3, 0, 100);
  winner.yearLog.push(D.ic + " Tu as battu " + loser.name + " à l'épreuve de " + D.l.toLowerCase() + (amt ? " et gagné " + C.fmt(amt) + "." : "."));
  loser.yearLog.push(D.ic + " Tu as perdu contre " + winner.name + (amt ? " et laissé " + C.fmt(amt) + "." : "."));
  g.news(winner, D.ic + " " + winner.name + " a battu " + loser.name + " (" + D.l.toLowerCase() + ")" + (amt ? wealthWord(g, amt) : "") + ".", "duel");
}

// ---------- bots ----------
function botRespond(g, o) {
  const a = o.a, t = g.players[o.to];
  const r = g.rng();
  let yes;
  if (a.kind === "ask") yes = r < 0.4; else if (a.kind === "duel") yes = r < 0.6; else if (a.kind === "marry" || a.kind === "couple") yes = r < 0.55; else yes = r < 0.6;
  applyOffer(g, o, yes, yes && a.kind === "ask" && g.rng() < 0.4 ? "half" : yes ? "yes" : "no");
}
function botAction(g, p) {
  const others = g.alivePlayers().filter((x) => x !== p);
  if (!others.length) return null;
  const t = pick(g.rng, others);
  const kinds = ["gift", "loan", "ask", "couple", "company", "steal", "rumor", "duel"];
  const k = pick(g.rng, kinds);
  const v = validate(g, p, { kind: k, target: t.seat, amount: Math.max(100, Math.floor(p.cash * 0.1)), tier: "petit", game: "course", rate: 8, years: 3 });
  return v.ok ? v.action : null;
}
function botFinance(g, p) { g.finance(p.seat, { op: "invest", kind: pick(g.rng, ["livret", "actions"]), amount: Math.floor(p.cash * 0.4) }); }

// ---------- prêts et sociétés (fin d'année) ----------
function loanTick(g, p, rep) { /* les prêts se règlent dans yearEnd pour avoir les deux parties */ }

function yearEnd(g) {
  // prêts
  for (const l of g.loans.slice()) {
    const bor = g.players[l.to], len = g.players[l.from];
    l.balance = Math.round(l.balance * (1 + l.rate));
    if (!bor.alive) { g.loans.splice(g.loans.indexOf(l), 1); continue; }
    if (g.round >= l.due) {
      const pay = Math.min(l.balance, Math.floor(bor.cash));
      bor.cash -= pay; len.cash += pay;
      if (pay >= l.balance) {
        len.yearLog.push("🏦 " + bor.name + " t'a remboursé " + C.fmt(pay) + ".");
        bor.yearLog.push("🏦 Tu as remboursé ton prêt à " + len.name + " (" + C.fmt(pay) + ").");
      } else {
        const rest = l.balance - pay;
        bor.debt += rest; bor.stats.repute = C.clamp(bor.stats.repute - 10, 0, 100);
        len.yearLog.push("😠 " + bor.name + " ne t'a rendu que " + C.fmt(pay) + " sur " + C.fmt(l.balance) + ".");
        bor.yearLog.push("😬 Tu n'as pas pu rembourser entièrement " + len.name + ". Le reste devient une dette.");
        g.news(bor, "😬 " + bor.name + " est mauvais payeur envers " + len.name + ".", "money");
      }
      g.loans.splice(g.loans.indexOf(l), 1);
    }
  }
  // entreprises communes
  for (const co of g.companies.slice()) {
    const A = g.players[co.a], B = g.players[co.b];
    if (!A.alive || !B.alive) continue;
    const skill = ((A.stats.intel + A.traits.ambition + B.stats.intel + B.traits.ambition) / 4 - 50) / 250;
    const noise = (g.rng() + g.rng() + g.rng() - 1.5) * 0.5;
    const rate = 0.06 + skill + noise;
    co.value = Math.max(0, Math.round(co.value * (1 + rate)));
    [A, B].forEach((x) => { const as = x.assets.find((s) => s.partnerCompany === co.id); if (as) as.value = Math.round(co.value / 2); });
    if (rate < -0.25) { const m = co.name + " traverse une grosse crise."; A.yearLog.push("📉 " + m); B.yearLog.push("📉 " + m); }
    if (rate > 0.35) { const m = co.name + " explose les compteurs cette année !"; A.yearLog.push("🚀 " + m); B.yearLog.push("🚀 " + m); g.news(A, "🚀 L'entreprise " + co.name + " de " + A.name + " et " + B.name + " cartonne !", "money"); }
  }
  // couples de joueurs
  const seen = new Set();
  g.alivePlayers().forEach((p) => {
    if (!p.partner || p.partner.player === undefined || seen.has(p.seat)) return;
    const q = g.players[p.partner.player];
    seen.add(p.seat); seen.add(q.seat);
    if (!q.alive) { p.partner = null; return; }
    const married = p.partner.status === "marie";
    p.stats.bonheur = C.clamp(p.stats.bonheur + 2, 0, 100); q.stats.bonheur = C.clamp(q.stats.bonheur + 2, 0, 100);
    const brk = married ? 0.035 : 0.1;
    if (g.rng() < brk) breakUp(g, p, q, married);
  });
}
function breakUp(g, p, q, married) {
  p.partner = null; q.partner = null;
  [p, q].forEach((x) => { x.stats.bonheur = C.clamp(x.stats.bonheur - (married ? 12 : 7), 0, 100); });
  if (married) {
    const rich = p.cash >= q.cash ? p : q, poor = rich === p ? q : p;
    const alim = Math.floor(rich.cash * 0.25);
    rich.cash -= alim; poor.cash += alim;
    p.yearLog.push("💔 Ton mariage avec " + q.name + " prend fin. Pension et partage, " + C.fmt(alim) + " changent de main.");
    q.yearLog.push("💔 Ton mariage avec " + p.name + " prend fin. Pension et partage, " + C.fmt(alim) + " changent de main.");
    g.news(p, "💔 " + p.name + " et " + q.name + " divorcent.", "love");
  } else {
    p.yearLog.push("💔 Ton couple avec " + q.name + " s'arrête."); q.yearLog.push("💔 Ton couple avec " + p.name + " s'arrête.");
    g.news(p, "💔 " + p.name + " et " + q.name + " se séparent.", "love");
  }
}

// ---------- mort et héritage ----------
function onDeath(g, p, net) {
  // prêts
  g.loans = g.loans.filter((l) => l.from !== p.seat && l.to !== p.seat);
  // société commune
  g.companies.forEach((co) => {
    if (co.a !== p.seat && co.b !== p.seat) return;
    if (co.dead) return;
    co.dead = true;
    const other = g.players[co.a === p.seat ? co.b : co.a];
    if (other.alive) { other.assets = other.assets.filter((s) => s.partnerCompany !== co.id); other.cash += Math.round(co.value * 0.5 * 0.9); other.yearLog.push("🕯️ " + p.name + " est mort" + G(p, "", "e") + ". Tu liquides votre société et récupères " + C.fmt(co.value * 0.45) + "."); }
    p.assets = p.assets.filter((s) => s.partnerCompany !== co.id);
  });
  g.companies = g.companies.filter((co) => !co.dead);
  // conjoint
  if (p.partner && p.partner.player !== undefined) {
    const q = g.players[p.partner.player];
    if (q && q.alive) {
      if (p.partner.status === "marie" && net > 0) {
        const part = Math.floor(net * 0.4);
        q.cash += part;
        q.yearLog.push("🕯️ " + p.name + " est mort" + G(p, "", "e") + ". Tu hérites de " + C.fmt(part) + ".");
        g.news(q, "📜 " + q.name + " hérite de son conjoint" + G(p, "", "e") + " " + p.name + wealthWord(g, part) + ".", "money");
        q.stats.bonheur = C.clamp(q.stats.bonheur - 18, 0, 100);
      } else q.stats.bonheur = C.clamp(q.stats.bonheur - 8, 0, 100);
      q.partner = null;
    }
  }
  // héritage librement choisi
  if (g.settings.inheritance && p.heir !== null && p.heir !== undefined && net > 0) {
    const h = g.players[p.heir];
    if (h && h.alive && !(p.partner && p.partner.status === "marie" && p.partner.player === h.seat)) {
      const part = Math.floor(net * 0.3);
      h.cash += part;
      h.yearLog.push("📜 " + p.name + " t'a légué " + C.fmt(part) + " dans son testament.");
      g.news(h, "📜 " + h.name + " reçoit un héritage de " + p.name + wealthWord(g, part) + ".", "money");
    }
  }
  g.players.forEach((x) => { if (x.heir === p.seat) x.heir = null; if (x.partner && x.partner.player === p.seat) x.partner = null; });
}

// ---------- scènes collectives ----------
const STAKE = { enfance: 30, ado: 200, jeune: 1500, adulte: 6000, senior: 4000 };
const GROUPS = {
  dilemma: {
    ages: [6, 120], min: 2, max: 2,
    skins: [
      { t: "Hier soir, $A et $B ont été vus près de $lieu pendant un incident. Un enquêteur propose à chacun un marché en tête à tête. Parler peut rapporter gros, mais si les deux parlent, personne n'en sort grandi.", ic: "🕵️", stat: "gaffe" },
      { t: "Un sac de pièces d'or oublié sur un banc. $A et $B l'ont vu en même temps. Partager, ou tout rafler discrètement avant que l'autre ne s'en aperçoive ?", ic: "💰", stat: "or" },
      { t: "$A et $B ont chacun reçu une offre secrète du même acheteur pour un bien commun. Faire front ensemble, ou vendre dans le dos de l'autre ?", ic: "📜", stat: "offre" },
      { t: "Un concours de pâtisserie oppose $A et $B. Un juge corrompu propose de glisser la défaite à l'autre contre un petit pot-de-vin. Jouer propre ou tricher ?", ic: "🎂", stat: "triche" },
      { t: "Une vitre cassée dans la rue. $A et $B sont les seuls témoins. On peut s'accuser ou se couvrir mutuellement.", ic: "🪟", stat: "vitre" },
      { t: "$A et $B se retrouvent coincés sur un radeau avec une seule bouée. Partager la peur ou pousser l'autre à l'eau ?", ic: "🛟", stat: "radeau" },
    ],
    opts: [{ v: "coop", l: "Coopérer", ic: "🤝", d: "On se serre les coudes." }, { v: "betray", l: "Trahir", ic: "🔪", d: "Chacun pour soi." }],
  },
  public: {
    ages: [8, 120], min: 3, max: 6, minPlayers: 3,
    skins: [
      { t: "La cagnotte de la fête de quartier ! Chacun peut y mettre de l'argent. Ce qui est collecté est augmenté de moitié par la mairie, puis redistribué à parts égales entre tous les joueurs, même ceux qui n'ont rien donné.", ic: "🎪" },
      { t: "Un fonds commun pour acheter un cadeau géant. Plus la cagnotte grossit, plus la mairie ajoute. Mais les égoïstes en profitent aussi…", ic: "🎁" },
      { t: "Le grand projet du village (une fontaine à chocolat). Chacun investit s'il le souhaite. Les bénéfices sont partagés entre tous.", ic: "⛲" },
    ],
    opts: [{ v: "0", l: "Ne rien donner", ic: "🙈", d: "Je garde tout." }, { v: "1", l: "Participer un peu", ic: "🪙", d: "Une mise normale." }, { v: "2", l: "Participer beaucoup", ic: "💎", d: "Une grosse mise." }],
  },
  auction: {
    ages: [10, 120], min: 2, max: 6,
    skins: [
      { t: "Une vente aux enchères secrète ! Un tableau mystérieux, trouvé dans un grenier. Son vrai prix est inconnu, il peut valoir une fortune ou ne rien valoir. Chacun mise en secret, le plus offrant l'emporte.", ic: "🖼️", item: { kind: "art", name: "Tableau douteux" } },
      { t: "Une poule dorée ? Un vieux paysan vend son animal « miraculeux » aux enchères. Plus ou moins d'œufs d'or, qui sait ?", ic: "🐔", item: { kind: "loufoque", name: "Poule suspecte" } },
      { t: "Un terrain vague, avec une cabane et une rumeur de trésor enterré. Les enchères sont ouvertes en secret.", ic: "🏞️", item: { kind: "immo", name: "Terrain vague" } },
      { t: "Un coffre sans clé, mis aux enchères tel quel. Contenu inconnu, mystère garanti.", ic: "🧰", item: { kind: "loufoque", name: "Coffre sans clé" } },
    ],
    opts: [{ v: "0", l: "Ne pas miser", ic: "🙅", d: "Je regarde passer." }, { v: "1", l: "Mise prudente", ic: "🪙", d: "La moitié de l'estimation." }, { v: "2", l: "Mise honnête", ic: "💶", d: "L'estimation." }, { v: "3", l: "Grosse mise", ic: "🔥", d: "60 % de plus que l'estimation." }],
  },
  vote: {
    ages: [8, 120], min: 3, max: 6, minPlayers: 3,
    skins: [
      { t: "Élection du ou de la délégué(e) ! Chacun vote pour quelqu'un d'autre. Celui ou celle qui en rassemble le plus gagne la gloire.", ic: "🗳️", title: "délégué(e)" },
      { t: "C'est le grand vote du Roi ou de la Reine du carnaval. Vote pour qui tu veux, sauf toi-même.", ic: "👑", title: "roi ou reine du carnaval" },
      { t: "L'association des amis de la tarte cherche un président ou une présidente. Chacun vote pour son préféré.", ic: "🥧", title: "président(e) de l'association de la tarte" },
      { t: "Élection du maire ! Les promesses fusent, les poignées de mains aussi. À toi de voter.", ic: "🏛️", title: "maire" },
    ],
  },
  split: {
    ages: [8, 120], min: 2, max: 6,
    skins: [
      { t: "Un héritage tombe du ciel, la fameuse tante Gertrude vous a tous couchés sur son testament. À vous de réclamer votre part. Mais si tout le monde en demande trop, les avocats mangent le gâteau !", ic: "📜" },
      { t: "Vous avez trouvé un trésor ensemble. Combien en réclamer ? Celui qui exagère risque de provoquer une bagarre générale.", ic: "🏴‍☠️" },
      { t: "Une loterie commune a été gagnée. Le gain doit être partagé, mais personne n'a décidé de la règle !", ic: "🎟️" },
    ],
    opts: [{ v: "1", l: "Part modeste", ic: "🙂", d: "Je me contente de peu." }, { v: "2", l: "Part normale", ic: "😐", d: "Un partage honnête." }, { v: "4", l: "Part gourmande", ic: "😈", d: "J'en veux beaucoup." }],
  },
  heist: {
    ages: [16, 120], min: 2, max: 6, mature: true,
    skins: [
      { t: "Le casse du siècle ! Une banque mal gardée, un plan douteux, et d'autres joueurs motivés. Plus vous êtes nombreux, plus ça passe, mais le butin est partagé. Un échec, c'est la prison ou l'amende.", ic: "🏦" },
      { t: "Un musée avec un diamant géant et un seul gardien qui dort. Qui en est ? Plus la bande est grande, plus les chances augmentent.", ic: "💎" },
      { t: "Un train de marchandises rempli de fromages rares. Un casse tout à fait réaliste, forcément.", ic: "🚂" },
    ],
    opts: [{ v: "in", l: "Je suis de la partie", ic: "🦹", d: "Je tente le coup." }, { v: "out", l: "Je reste à l'écart", ic: "😇", d: "Pas de ça chez moi." }],
  },
};

function planGroup(g) {
  const alive = g.alivePlayers();
  if (alive.length < 2) return false;
  const freq = { rare: 0.125, normal: 0.25, frequent: 0.34 }[g.settings.social];
  if (g.rng() >= freq) return false;
  const age = g.age;
  const kinds = Object.keys(GROUPS).filter((k) => {
    const d = GROUPS[k];
    if (age < d.ages[0]) return false;
    if (d.mature && !g.settings.mature) return false;
    const need = d.minPlayers || d.min;
    return alive.length >= need;
  });
  if (!kinds.length) return false;
  const kind = pick(g.rng, kinds);
  const d = GROUPS[kind];
  const skin = pick(g.rng, d.skins);
  let seats = alive.map((p) => p.seat);
  if (kind === "dilemma") seats = seats.sort(() => g.rng() - 0.5).slice(0, 2);
  else if (seats.length > d.max) seats = seats.sort(() => g.rng() - 0.5).slice(0, d.max);
  const stake = STAKE[R.stageOf(age)];
  const names = seats.map((s) => g.players[s].name);
  let text = skin.t;
  if (kind === "dilemma") text = text.replace(/\$A/g, names[0]).replace(/\$B/g, names[1]).replace("$lieu", pick(g.rng, POOLS.lieux));
  const grp = { kind, skin, seats, stake, choices: {}, state: "choose", text, ic: skin.ic, result: null, deadline: 0, extra: {} };
  if (kind === "auction") grp.extra.est = Math.round(stake * 2 * (0.8 + g.rng() * 0.6));
  if (kind === "split") grp.extra.pot = stake * seats.length * 1.3;
  const ms = g.timerMs(1);
  grp.deadline = ms ? g.now() + ms : 0;
  g.group = grp;
  seats.forEach((s) => { const pl = g.players[s]; pl.botAt = g.now() + 500 + Math.floor(g.rng() * 1200) * g.timeScale; });
  return true;
}

function groupOptions(g, p) {
  const grp = g.group; if (!grp) return [];
  const d = GROUPS[grp.kind];
  if (grp.kind === "vote") return grp.seats.filter((s) => s !== p.seat).map((s) => ({ v: String(s), l: g.players[s].name, ic: g.players[s].avatar.acc || "👤", d: "Voter pour " + g.players[s].name })).concat([{ v: "blank", l: "Voter blanc", ic: "⚪", d: "Je m'abstiens." }]);
  const opts = d.opts.map((o) => Object.assign({}, o));
  const S = grp.stake;
  if (grp.kind === "public") { opts[1].l = "Donner " + C.fmt(S); opts[2].l = "Donner " + C.fmt(S * 2.5); opts.forEach((o, i) => { o.cost = [0, S, S * 2.5][i]; o.ok = o.cost === 0 || p.cash >= o.cost; }); }
  if (grp.kind === "auction") { const E = grp.extra.est; opts[1].l = "Miser " + C.fmt(E * 0.5); opts[2].l = "Miser " + C.fmt(E); opts[3].l = "Miser " + C.fmt(E * 1.6); opts.forEach((o, i) => { o.cost = [0, E * 0.5, E, E * 1.6][i]; o.ok = o.cost === 0 || p.cash >= o.cost; }); }
  if (grp.kind === "heist") opts.forEach((o) => { o.ok = true; });
  opts.forEach((o) => { if (o.ok === undefined) o.ok = true; });
  return opts;
}

function groupChoose(g, seat, value) {
  const grp = g.group;
  if (g.phase !== "group" || !grp || grp.state !== "choose" || !grp.seats.includes(seat)) return { ok: false };
  const p = g.players[seat];
  const opts = groupOptions(g, p);
  const o = opts.find((x) => x.v === String(value));
  if (!o || o.ok === false) return { ok: false, error: "Choix impossible." };
  grp.choices[seat] = String(value);
  p.missed = 0; if (!p.bot) p.auto = false;
  return { ok: true };
}

function groupDefault(g, p) {
  const grp = g.group;
  const all = groupOptions(g, p);
  const opts = all.filter((o) => o.ok !== false);
  if (!opts.length) { console.error('GROUP VIDE', grp.kind, all.length); return all.length ? all[0].v : 'blank'; }
  if (grp.kind === "vote") return pick(g.rng, opts).v;
  if (grp.kind === "dilemma") return g.rng() < 0.7 ? "coop" : "betray";
  if (grp.kind === "heist") return g.rng() < 0.4 ? "in" : "out";
  return pick(g.rng, opts).v;
}

function groupTick(g, t) {
  const grp = g.group;
  if (!grp) { g._startEvents(); return true; }
  let changed = false;
  if (grp.state === "choose") {
    grp.seats.forEach((s) => {
      const p = g.players[s];
      if (grp.choices[s] === undefined && g.controlled(p) && t >= p.botAt) { grp.choices[s] = groupDefault(g, p); changed = true; }
    });
    const all = grp.seats.every((s) => grp.choices[s] !== undefined);
    const late = grp.deadline && t >= grp.deadline;
    if (all || late) {
      grp.seats.forEach((s) => { if (grp.choices[s] === undefined) { const p = g.players[s]; grp.choices[s] = groupDefault(g, p); if (!g.controlled(p)) { p.missed++; g._maybeAuto(p); } } });
      resolveGroup(g);
      grp.state = "result";
      const ms = g.timerMs(0.5);
      grp.deadline = ms ? t + Math.max(ms, 9000 * g.timeScale) : t + 9000 * g.timeScale;
      grp.ready = {};
      g.alivePlayers().forEach((p) => { p.botAt = t + 400 + Math.floor(g.rng() * 900) * g.timeScale; });
      changed = true;
    }
  } else if (grp.state === "result") {
    g.alivePlayers().forEach((p) => { if (!grp.ready[p.seat] && g.controlled(p) && t >= p.botAt) { grp.ready[p.seat] = true; changed = true; } });
    const all = g.alivePlayers().every((p) => grp.ready[p.seat]);
    if (all || t >= grp.deadline) { g.group = null; g._startEvents(); changed = true; }
  }
  return changed;
}

function groupReady(g, seat) {
  if (g.phase !== "group" || !g.group || g.group.state !== "result") return { ok: false };
  g.group.ready[seat] = true; return { ok: true };
}

function resolveGroup(g) {
  const grp = g.group; const S = grp.stake; const rng = g.rng;
  const P = (s) => g.players[s];
  const res = { lines: {}, public: "" };
  const add = (s, text) => { res.lines[s] = text; P(s).yearLog.push(text); P(s).journal.push({ age: g.age, text, ic: grp.ic, tag: "social" }); };
  const money = (s, d) => { P(s).cash += Math.round(d); };
  const st = (s, k, d) => { P(s).stats[k] = C.clamp(P(s).stats[k] + d, 0, 100); };
  const seats = grp.seats;
  if (grp.kind === "dilemma") {
    const [a, b] = seats; const ca = grp.choices[a], cb = grp.choices[b];
    const nm = (s) => P(s).name;
    if (ca === "coop" && cb === "coop") { money(a, S); money(b, S); st(a, "bonheur", 4); st(b, "bonheur", 4); add(a, "🤝 Toi et " + nm(b) + " avez coopéré, vous gagnez " + C.fmt(S) + " chacun."); add(b, "🤝 Toi et " + nm(a) + " avez coopéré, vous gagnez " + C.fmt(S) + " chacun."); res.public = "🤝 " + nm(a) + " et " + nm(b) + " se sont serré les coudes."; }
    else if (ca === "betray" && cb === "betray") { money(a, -S / 2); money(b, -S / 2); st(a, "bonheur", -4); st(b, "bonheur", -4); add(a, "🔪 Vous vous êtes trahis tous les deux, " + C.fmt(S / 2) + " perdus chacun."); add(b, "🔪 Vous vous êtes trahis tous les deux, " + C.fmt(S / 2) + " perdus chacun."); res.public = "🔪 " + nm(a) + " et " + nm(b) + " se sont trahis mutuellement."; }
    else {
      const traitor = ca === "betray" ? a : b, victim = traitor === a ? b : a;
      money(traitor, S * 2); money(victim, -S); st(traitor, "repute", -5); st(victim, "bonheur", -6); P(traitor).traits.honnete = C.clamp(P(traitor).traits.honnete - 4, 0, 100);
      add(traitor, "🔪 Tu as trahi " + nm(victim) + " et empoché " + C.fmt(S * 2) + ".");
      add(victim, "😡 " + nm(traitor) + " t'a trahi ! Tu perds " + C.fmt(S) + ".");
      res.public = "🔪 " + nm(traitor) + " a trahi " + nm(victim) + ".";
    }
  } else if (grp.kind === "public") {
    const amounts = { "0": 0, "1": S, "2": S * 2.5 };
    let pot = 0; seats.forEach((s) => { const c = amounts[grp.choices[s]]; pot += c; money(s, -c); });
    const share = pot * 1.5 / seats.length;
    seats.forEach((s) => { money(s, share); const c = amounts[grp.choices[s]]; const net = share - c; add(s, (c ? "🪙 Tu as donné " + C.fmt(c) + ". " : "🙈 Tu n'as rien donné. ") + "La cagnotte te rapporte " + C.fmt(share) + ", soit " + (net >= 0 ? "+" : "") + C.fmt(net) + " au total."); if (c === 0 && pot > 0) st(s, "repute", -2); if (c === amounts["2"]) { st(s, "repute", 3); P(s).traits.bonte = C.clamp(P(s).traits.bonte + 2, 0, 100); } });
    res.public = "🎪 La cagnotte a récolté " + (g.settings.wealthView === "hidden" ? "une belle somme" : C.fmt(pot)) + ", multipliée par la mairie.";
  } else if (grp.kind === "auction") {
    const E = grp.extra.est; const lv = { "0": 0, "1": 0.5, "2": 1, "3": 1.6 };
    const bids = seats.map((s) => ({ s, bid: E * lv[grp.choices[s]], lvl: lv[grp.choices[s]] })).filter((x) => x.bid > 0);
    const real = Math.round(E * Math.exp((rng() + rng() + rng() - 1.5) * 1.1));
    if (!bids.length) { seats.forEach((s) => add(s, "🙅 Personne n'a misé. La vente est annulée.")); res.public = "🔨 Personne n'a misé, vente annulée."; }
    else {
      bids.sort((a, b) => b.bid - a.bid || rng() - 0.5);
      const w = bids[0];
      money(w.s, -w.bid);
      const item = grp.skin.item;
      const a = { id: "a" + (++P(w.s).assetSeq), kind: item.kind, name: item.name, value: real, cost: w.bid, upkeep: 0, income: 0 };
      P(w.s).assets.push(a);
      const verdict = real > w.bid * 1.4 ? "une affaire en or" : real < w.bid * 0.6 ? "une arnaque" : "un prix correct";
      seats.forEach((s) => { if (s === w.s) add(s, "🔨 Tu remportes l'enchère pour " + C.fmt(w.bid) + ". L'objet vaut en réalité " + C.fmt(real) + ", " + verdict + "."); else add(s, "🔨 " + P(w.s).name + " remporte les enchères. L'objet valait " + C.fmt(real) + "."); });
      st(w.s, "bonheur", real > w.bid ? 5 : -4);
      res.public = "🔨 " + P(w.s).name + " a remporté les enchères" + wealthWord(g, w.bid) + ". L'objet valait " + C.fmt(real) + ".";
    }
  } else if (grp.kind === "vote") {
    const tally = {}; seats.forEach((s) => { tally[s] = 0; });
    seats.forEach((s) => { const v = grp.choices[s]; if (v !== "blank" && tally[Number(v)] !== undefined) tally[Number(v)]++; });
    const max = Math.max.apply(null, Object.values(tally));
    const top = seats.filter((s) => tally[s] === max);
    const win = pick(rng, top);
    const title = grp.skin.title;
    seats.forEach((s) => { if (s === win) { st(s, "repute", 10); st(s, "bonheur", 6); money(s, S * 0.5); add(s, "🗳️ Tu es élu(e) " + title + " avec " + max + " voix !"); } else add(s, "🗳️ " + P(win).name + " est élu(e) " + title + " (" + max + " voix)."); });
    res.public = "🗳️ " + P(win).name + " est élu(e) " + title + (top.length > 1 ? " après un tirage au sort" : "") + ".";
  } else if (grp.kind === "split") {
    const pot = grp.extra.pot; const n = seats.length;
    const shares = {}; let sum = 0; seats.forEach((s) => { shares[s] = Number(grp.choices[s]); sum += shares[s]; });
    const brawl = sum > 2.1 * n;
    seats.forEach((s) => {
      let gain = brawl ? pot * shares[s] / sum * 0.6 : pot * shares[s] / (2 * n);
      money(s, gain);
      if (brawl) { st(s, "bonheur", -3); if (shares[s] === 4) st(s, "repute", -4); }
      if (!brawl && shares[s] === 1) { st(s, "repute", 3); P(s).traits.bonte = C.clamp(P(s).traits.bonte + 2, 0, 100); }
      add(s, (brawl ? "💥 Trop de monde en voulait beaucoup, les avocats ont mangé le gâteau. " : "📜 Partage réussi. ") + "Tu touches " + C.fmt(gain) + ".");
    });
    res.public = brawl ? "💥 Dispute générale pour l'héritage, les avocats s'enrichissent." : "📜 Le partage s'est fait dans le calme.";
  } else if (grp.kind === "heist") {
    const crew = seats.filter((s) => grp.choices[s] === "in");
    if (!crew.length) { seats.forEach((s) => add(s, "😇 Personne n'a voulu participer au casse.")); res.public = "😇 Personne n'a voulu tenter le coup."; }
    else {
      const n = crew.length;
      let pr = 0.28 + 0.16 * (n - 1);
      pr += crew.reduce((s, x) => s + (P(x).stats.intel + P(x).traits.courage + P(x).traits.prudent) / 3 - 50, 0) / n / 300;
      pr = C.clamp(pr, 0.15, 0.85);
      if (rng() < pr) {
        const loot = S * 4 * (0.8 + rng() * 0.8); const each = loot / n * (n === 1 ? 1 : 1.3);
        crew.forEach((s) => { money(s, each); st(s, "bonheur", 6); P(s).traits.honnete = C.clamp(P(s).traits.honnete - 6, 0, 100); P(s).flags.complice = 1; P(s).flagTtl.complice = 10; add(s, "🦹 Le casse a réussi ! Ta part est de " + C.fmt(each) + "."); });
        seats.filter((s) => !crew.includes(s)).forEach((s) => add(s, "🦹 Un casse a réussi sans toi (" + crew.length + " complice" + (crew.length > 1 ? "s" : "") + ")."));
        res.public = "🦹 Un casse spectaculaire a réussi. La police cherche les coupables.";
      } else {
        crew.forEach((s) => {
          if (rng() < 0.55) { FX.applyFx(g, P(s), { prison: C.rint(rng, 1, 3), repute: -15, bonheur: -8 }, null); add(s, "🚔 Le casse a échoué, la police t'arrête. Direction la prison."); }
          else { money(s, -S); st(s, "repute", -8); add(s, "🚔 Le casse a échoué, tu t'enfuis mais tu paies " + C.fmt(S) + " d'amende."); }
        });
        seats.filter((s) => !crew.includes(s)).forEach((s) => add(s, "😅 Tu as bien fait de ne pas venir, le casse a échoué."));
        res.public = "🚔 Un casse a échoué, des arrestations ont eu lieu.";
      }
    }
  }
  grp.result = res;
  g.news(null, res.public, "group");
}

module.exports = { KINDS, DUELS, GROUPS, validate, resolveActions, respond, expireOffers, offerText, botRespond, botAction, botFinance, loanTick, yearEnd, onDeath, planGroup, groupOptions, groupChoose, groupTick, groupReady, applyOffer };
