// ============================================================
// RICHISSIME DESTINY — Réactions automatiques au statut d'un joueur
// Quelqu'un est en prison, ruiné ou libéré. Les autres joueurs et ses proches réagissent, même sans cliquer.
// Les conjoints finissent par partir, les amis s'éloignent, les ennemis en profitent, les alliés viennent au parloir.
// Les textes évitent les deux-points.
// ============================================================
const C = require("./core");
const FX = require("./fx");
const SK = require("./socialkit");
const FEUD = require("./feud");
const REL = require("./relations");

const clamp = C.clamp;
const G = (p, a, b) => (p.gender === "f" ? b : a);
const fmt = C.fmt;
const tell = (p, t) => p.yearLog.push(t);

function partnerLeaves(g, X, why) {
  const pr = REL.partnerOf(g, X);
  if (!pr) return false;
  const married = X.partner && X.partner.status === "marie";
  if (pr.kind === "player") {
    const Q = pr.p;
    require("./social").breakUp(g, X, Q, married);
    tell(X, why.x); tell(Q, why.q.replace("$X", X.name));
    X.journal.push({ age: X.age, text: why.x, ic: "💔", tag: "amour" });
    return true;
  }
  const n = pr.n;
  const wasSpouse = n.kind === "spouse";
  if (wasSpouse) X.mem.divorces = (X.mem.divorces || 0) + 1;
  n.kind = "ex"; n.close = Math.min(n.close, 12);
  if (X.partner && X.partner.npc === n.id) X.partner = null;
  X.stats.bonheur = clamp(X.stats.bonheur - (wasSpouse ? 16 : 10), 0, 100);
  const t = why.x.replace("$N", n.name);
  tell(X, t); X.journal.push({ age: X.age, text: t, ic: "💔", tag: "amour" });
  g.news(X, "💔 " + n.name + " quitte " + X.name + " pendant son incarcération.", "love");
  return true;
}

function tickPrisoner(g, X) {
  const rng = g.rng;
  const served = Math.max(0, (X.prison.total || 0) - (X.prison.left || 0));
  const left = X.prison.left || 0;
  X._inPrison = true;
  // 1) le conjoint ou le partenaire finit par partir, plus vite quand la peine est longue
  const pr = REL.partnerOf(g, X);
  if (pr) {
    let p = 0.05 + 0.03 * served + (left >= 8 ? 0.03 : 0);
    const kids = X.npcs.filter((n) => n.kind === "child" && n.alive).length;
    p -= kids * 0.02;
    if (X.partner && X.partner.status === "marie") p -= 0.04;
    if (pr.kind === "player") { const bd = SK.bond(g, X.seat, pr.p.seat); p -= bd.aff / 500; p -= (pr.p.traits.bonte - 50) / 600; p -= (pr.p.traits.honnete - 50) / 900; }
    else { p -= (pr.n.close - 50) / 600; }
    p = clamp(p, 0.025, 0.5);
    if (rng() < p) {
      partnerLeaves(g, X, {
        x: pr.kind === "player" ? "💔 Après " + served + " an" + (served > 1 ? "s" : "") + " d'attente, " + pr.p.name + " ne peut plus continuer. Vous vous séparez." : "💔 Après " + served + " an" + (served > 1 ? "s" : "") + " de parloirs et de lettres, $N te quitte. La vie ne l'attendait plus.",
        q: "💔 Après des années à attendre $X, tu décides de refaire ta vie.",
      });
    } else if (rng() < 0.35) {
      const t = "🕊️ " + (pr.kind === "player" ? pr.p.name : pr.n.name) + " continue de venir au parloir malgré les années. Ça t'aide à tenir.";
      tell(X, t); X.stats.bonheur = clamp(X.stats.bonheur + 3, 0, 100);
    }
  }
  // 2) les liens s'effritent, sauf les alliances
  g.players.forEach((Y) => {
    if (Y === X || !Y.alive) return;
    const bd = SK.bond(g, X.seat, Y.seat);
    const isP = X.partner && X.partner.player === Y.seat;
    if (isP) return;
    if (bd.tags.allie) bd.aff = Math.max(10, bd.aff - 0.5); else if (bd.aff > 12) bd.aff = Math.max(8, bd.aff - 2);
    // 3) les fidèles viennent au parloir
    if ((bd.aff >= 55 || bd.tags.allie) && bd.riv < 20 && !Y.prison && rng() < 0.4) {
      SK.touch(g, X.seat, Y.seat, { aff: 3 });
      X.stats.bonheur = clamp(X.stats.bonheur + 4, 0, 100);
      tell(X, "🕊️ " + Y.name + " vient te voir au parloir. Tu ne te sens pas oublié" + G(X, "", "e") + ".");
      tell(Y, "🕊️ Tu rends visite à " + X.name + " au parloir.");
      Y.traits.bonte = clamp(Y.traits.bonte + 1, 0, 100);
    }
    // 4) les ennemis profitent de l'absence
    const lv = FEUD.level(bd);
    if (lv >= 2 && !Y.prison && rng() < 0.12 * (lv - 1)) {
      const roll = rng();
      if (roll < 0.4 && X.assets.length) {
        const a = X.assets.filter((x) => !x.partnerCompany).sort((u, v) => v.value - u.value)[0];
        if (a) { const take = Math.round(a.value * 0.25); a.value = Math.max(0, a.value - take); Y.cash += Math.round(take * 0.5); tell(X, "🦈 Pendant ton absence, " + Y.name + " grignote ton patrimoine. " + a.name + " perd " + fmt(take) + "."); tell(Y, "🦈 Tu profites de l'absence de " + X.name + " pour mettre la main sur une part de " + a.name.toLowerCase() + "."); SK.touch(g, Y.seat, X.seat, { riv: 6 }); }
      } else if (roll < 0.75) {
        X.stats.repute = clamp(X.stats.repute - 6, 0, 100); tell(X, "🗞️ Pendant que tu es enfermé" + G(X, "", "e") + ", " + Y.name + " salit ton nom partout."); tell(Y, "🗞️ Tu en profites pour salir le nom de " + X.name + "."); SK.touch(g, Y.seat, X.seat, { riv: 4 });
      } else if (REL.partnerOf(g, X) && rng() < 0.5) {
        if (partnerLeaves(g, X, { x: "💔 " + Y.name + " a su profiter de ton absence pour séduire ta moitié. Tu es quitté" + G(X, "", "e") + " en prison.", q: "💔 Tu quittes $X pour de bon." })) tell(Y, "😏 Tu as su séduire la moitié de " + X.name + " pendant son séjour en prison.");
      }
    }
  });
  // 5) les enfants grandissent sans toi
  X.npcs.forEach((n) => { if (n.kind === "child" && n.alive) n.close = Math.max(8, n.close - 4); });
  if (served === 3 || served === 8 || served === 15) tell(X, "⏳ " + served + " ans que tu es derrière les barreaux. Le monde dehors avance sans toi.");
}

function tickRelease(g, X) {
  X._inPrison = false;
  const pr = REL.partnerOf(g, X);
  const friends = g.players.filter((Y) => Y !== X && Y.alive && SK.bond(g, X.seat, Y.seat).aff >= 40);
  if (pr) { X.stats.bonheur = clamp(X.stats.bonheur + 12, 0, 100); tell(X, "💞 À ta sortie, " + (pr.kind === "player" ? pr.p.name : pr.n.name) + " t'attend devant la porte. Tu n'as jamais été aussi ému" + G(X, "", "e") + "."); }
  else if (friends.length) { X.stats.bonheur = clamp(X.stats.bonheur + 6, 0, 100); tell(X, "🤝 À ta sortie, " + friends[0].name + " est là. Ça aide à reprendre pied."); }
  else { X.stats.bonheur = clamp(X.stats.bonheur - 4, 0, 100); tell(X, "🚪 À ta sortie, personne ne t'attend. Tout est à reconstruire."); }
  X.journal.push({ age: X.age, text: "Libéré" + G(X, "", "e") + " de prison.", ic: "🔓", tag: "justice" });
}

function tickRuin(g, X) {
  const nw = C.netWorth(X);
  if (nw > -50000 && X.debt < 150000) return;
  const pr = REL.partnerOf(g, X);
  if (!pr || g.rng() > 0.07) return;
  partnerLeaves(g, X, { x: "💔 Les dettes et les huissiers ont eu raison de ton couple. Ton ou ta partenaire fait ses valises.", q: "💔 Tu quittes $X, ruiné" + "(e) et criblé" + "(e) de dettes." });
}

function tick(g) {
  g.alivePlayers().forEach((X) => {
    if (X.prison) tickPrisoner(g, X);
    else if (X._inPrison) tickRelease(g, X);
    tickRuin(g, X);
  });
}

module.exports = { tick };
