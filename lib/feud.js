// ============================================================
// RICHISSIME DESTINY — Rôles, rivalités, alliances et conséquences
// Chaque paire de joueurs a un lien (affinité, rivalité, étiquettes). Ici on en tire
//  1) un rôle lisible (meilleur ami, rival, ennemi juré, allié, associé, ex, créancier...),
//  2) des incidents de fin d'année quand une rivalité s'envenime (même si personne ne clique),
//  3) des solidarités entre alliés (défendre, éponger une dette),
//  4) les effets spéciaux des actions de conflit (ruiner, piéger, contrat...) et d'entraide.
// Tous les textes évitent les deux-points.
// ============================================================
const C = require("./core");
const FX = require("./fx");
const R = require("./rules");
const SK = require("./socialkit");

const clamp = C.clamp;
const STAGES = ["calme", "tension", "rival", "ennemi juré", "vendetta"];
// 0 calme, 1 tension, 2 rival, 3 ennemi juré, 4 vendetta
const level = (bd) => (bd.riv >= 80 ? 4 : bd.riv >= 60 ? 3 : bd.riv >= 30 ? 2 : bd.riv >= 15 ? 1 : 0);
const stageWord = (bd) => STAGES[level(bd)];

function note(g, bd, text) {
  bd.log = (bd.log || []).concat([{ round: g.round, age: g.age, text }]).slice(-6);
}
// une ligne dans le bilan de l'année d'un joueur (avant ou après le calcul du bilan)
function tell(p, text) {
  p.yearLog.push(text);
}
function cut(p, pct, cap, floor) {
  const m = Math.round(Math.min(Math.max(0, p.cash) * pct, cap));
  if (m < (floor || 50)) return 0;
  p.cash -= m;
  return m;
}
const G = (p, a, b) => (p.gender === "f" ? b : a);
const alive = (p) => p && p.alive;

// ---------- rôle d'un joueur vu par un autre ----------
function loansBetween(g, A, B) {
  let owedToA = 0, owedByA = 0;
  (g.loans || []).forEach((l) => {
    if (l.from === A.seat && l.to === B.seat) owedToA += l.balance;
    if (l.from === B.seat && l.to === A.seat) owedByA += l.balance;
  });
  return { owedToA: Math.round(owedToA), owedByA: Math.round(owedByA) };
}
function roleOf(g, A, B) {
  const bd = SK.bond(g, A.seat, B.seat);
  const lv = level(bd);
  let word, ic, tone;
  if (A.partner && A.partner.player === B.seat) { word = A.partner.status === "marie" ? "conjoint" + G(B, "", "e") : "en couple"; ic = A.partner.status === "marie" ? "💍" : "❤️"; tone = "good"; }
  else if (lv >= 4) { word = "ennemi" + G(B, "", "e") + " juré" + G(B, "", "e") + ", vendetta"; ic = "☠️"; tone = "bad"; }
  else if (lv === 3) { word = "ennemi" + G(B, "", "e") + " juré" + G(B, "", "e"); ic = "🗡️"; tone = "bad"; }
  else if (lv === 2) { word = "rival" + G(B, "", "e"); ic = "⚔️"; tone = "bad"; }
  else if (bd.tags.allie) { word = "allié" + G(B, "", "e"); ic = "🤝"; tone = "good"; }
  else if (bd.tags.ex) { word = "ex"; ic = "💔"; tone = "mixed"; }
  else if (bd.aff >= 60) { word = "meilleur" + G(B, "", "e") + " ami" + G(B, "", "e"); ic = "💛"; tone = "good"; }
  else if (bd.aff >= 35) { word = "ami" + G(B, "", "e"); ic = "🙂"; tone = "good"; }
  else if (bd.aff >= 18) { word = "camarade"; ic = "👋"; tone = "neutral"; }
  else { word = "simple connaissance"; ic = "🫥"; tone = "neutral"; }
  if (lv === 1 && tone === "neutral") { word += ", tension"; ic = "😒"; }
  const notes = [];
  if (bd.tags.allie && (lv >= 2)) notes.push("une ancienne alliance en ruines");
  if (bd.tags.ex && word !== "ex") notes.push("ancien" + G(B, "", "ne") + " partenaire");
  if (bd.tags.betrayed) notes.push("trahison passée");
  if (bd.tags.sauve) notes.push("t'a sauvé" + G(A, "", "e") + " d'une dette");
  if (bd.tags.confident) notes.push("connaît tes secrets");
  if (bd.tags.contract) notes.push("un contrat a été lancé");
  const ln = loansBetween(g, A, B);
  if (ln.owedToA) notes.push("te doit " + C.fmt(ln.owedToA));
  if (ln.owedByA) notes.push("tu lui dois " + C.fmt(ln.owedByA));
  (g.companies || []).forEach((co) => { if ((co.a === A.seat && co.b === B.seat) || (co.a === B.seat && co.b === A.seat)) notes.push("associés dans " + co.name); });
  return { word, ic, tone, level: lv, stage: STAGES[lv], aff: Math.round(bd.aff), riv: Math.round(bd.riv), notes, log: (bd.log || []).slice(-3).map((l) => l.text) };
}

// ---------- rapport de force ----------
function power(g, p) {
  const nw = Math.max(0, C.netWorth(p));
  return Math.log10(nw + 1000) * 12 + p.stats.intel * 0.3 + p.stats.charme * 0.2 + p.stats.repute * 0.2 + p.traits.courage * 0.15;
}
// chance de réussir un coup contre un autre, entre 0.12 et 0.85
function odds(g, A, B, base) {
  return clamp((base === undefined ? 0.5 : base) + (power(g, A) - power(g, B)) / 140 - (B.traits.prudent - 50) / 400 + (A.traits.courage - 50) / 500, 0.12, 0.85);
}

// ---------- après une action hostile ----------
// trahison d'un allié ou d'un proche, changement de stade, alliés de la victime qui réagissent
function afterHostile(g, A, B) {
  const bd = SK.bond(g, A.seat, B.seat);
  const before = bd._lv === undefined ? level(bd) : bd._lv;
  if (bd.tags.allie) {
    delete bd.tags.allie; bd.tags.betrayed = g.round;
    SK.touch(g, A.seat, B.seat, { aff: -30, riv: 25 });
    tell(B, "🗡️ " + A.name + " t'a trahi" + G(B, "", "e") + " alors que vous étiez alliés. Tu ne l'oublieras pas.");
    note(g, bd, A.name + " a trahi son allié" + G(B, "", "e") + " " + B.name);
    g.news(A, "🗡️ " + A.name + " trahit son allié" + G(B, "", "e") + " " + B.name + ".", "gossip");
  }
  // les alliés de la victime peuvent prendre sa défense
  g.players.forEach((X) => {
    if (X === A || X === B || !alive(X)) return;
    const xb = SK.bond(g, X.seat, B.seat);
    if (!xb.tags.allie) return;
    if (g.rng() < 0.55) (g.avengers = g.avengers || []).push({ x: X.seat, culprit: A.seat, victim: B.seat, round: g.round });
  });
  const after = level(bd);
  bd._lv = after;
  if (after > before && after >= 3) {
    g.news(null, (after >= 4 ? "☠️ Une vendetta éclate entre " : "🗡️ La guerre est déclarée entre ") + A.name + " et " + B.name + ".", "gossip");
    note(g, bd, after >= 4 ? "La vendetta est lancée" : "La guerre est déclarée");
  }
}

// ---------- incidents d'une rivalité qui s'envenime ----------
const PROB = [0, 0.04, 0.12, 0.28, 0.45];
function aggressorOf(g, a, b) {
  const wa = 1 + (50 - a.traits.honnete) / 100 + (50 - a.traits.bonte) / 100 + a.traits.courage / 100 + Math.max(0, power(g, a) - power(g, b)) / 50;
  const wb = 1 + (50 - b.traits.honnete) / 100 + (50 - b.traits.bonte) / 100 + b.traits.courage / 100 + Math.max(0, power(g, b) - power(g, a)) / 50;
  return g.rng() * (wa + wb) < wa ? [a, b] : [b, a];
}
function grievance(g, victim, culprit, kind, loot) {
  g.grievances = (g.grievances || []).filter((x) => x.round >= g.round - 2);
  g.grievances.push({ v: victim.seat, c: culprit.seat, kind, round: g.round, loot: loot || 0 });
}
function pickAsset(p, kinds, rng) {
  const l = p.assets.filter((a) => !a.empire && !a.pool && !a.partnerCompany && (!kinds || kinds.includes(a.kind)));
  return l.length ? l[Math.floor((rng || Math.random)() * l.length)] : null;
}
function incident(g, agg, vic, bd, lv) {
  const rng = g.rng, mature = !!g.settings.mature;
  const r = rng();
  let lossA = "", lossV = "", pub = null, amt = 0;
  if (lv <= 2) {
    if (r < 0.5) {
      vic.stats.repute = clamp(vic.stats.repute - 3, 0, 100); vic.stats.bonheur = clamp(vic.stats.bonheur - 3, 0, 100);
      lossA = "🗣️ Tu laisses traîner un mot bien placé sur " + vic.name + ". Ça fait son effet.";
      lossV = "🗣️ Des remarques perfides sur toi circulent en ville, et elles viennent de " + agg.name + ".";
    } else {
      amt = cut(vic, 0.03, 12000, 80);
      lossA = "🧾 Un coup de fil bien placé complique la vie de " + vic.name + ".";
      lossV = "🧾 Un contretemps administratif te coûte " + (amt ? C.fmt(amt) : "du temps") + ", et tu sais à qui il profite.";
    }
  } else if (lv === 3) {
    if (r < 0.35) {
      amt = cut(vic, 0.06, 90000, 150);
      lossA = "📉 Tu fais fuir un client important de " + vic.name + ".";
      lossV = "📉 Un client important te lâche et te fait perdre " + (amt ? C.fmt(amt) : "gros") + ". " + agg.name + " n'y est pas pour rien.";
      pub = "📉 Les affaires de " + vic.name + " vacillent, " + agg.name + " sourit un peu trop.";
    } else if (r < 0.65 && vic.job) {
      vic.job.perf = clamp(vic.job.perf - 14, 0, 100);
      let fired = false;
      if (vic.job.perf < 38 && rng() < 0.4) { FX.applyFx(g, vic, { fire: true, repute: -3 }, null); fired = true; }
      lossA = "💼 Tu dis deux mots à l'oreille d'un supérieur de " + vic.name + ".";
      lossV = fired ? "💼 Un rapport accablant te coûte ton poste. La main de " + agg.name + " se devine." : "💼 Ta direction te regarde de travers depuis un rapport accablant. " + agg.name + " a de l'influence.";
    } else {
      amt = cut(vic, 0.03, 40000, 100); const am2 = cut(agg, 0.015, 20000, 50);
      lossA = "⚖️ Tu attaques " + vic.name + " en justice. Les avocats coûtent cher, des deux côtés.";
      lossV = "⚖️ " + agg.name + " te traîne devant un tribunal. Ta défense te coûte " + (amt ? C.fmt(amt) : "cher") + ".";
    }
  } else {
    if (r < 0.3) {
      const a = pickAsset(vic, ["voiture", "immo", "loufoque", "art"], rng);
      if (a) {
        if (a.kind === "voiture" || rng() < 0.4) { vic.assets.splice(vic.assets.indexOf(a), 1); lossV = "🔥 Ton bien " + a.name.toLowerCase() + " part en fumée en pleine nuit. Les soupçons se tournent vers " + agg.name + "."; }
        else { a.value = Math.round(a.value * 0.7); lossV = "🔥 Des dégâts volontaires ruinent une partie de ton bien " + a.name.toLowerCase() + ". " + agg.name + " est ton principal suspect."; }
        lossA = "🔥 Une nuit sans lune, un bidon d'essence, et " + vic.name + " comprend la leçon.";
        pub = "🔥 Un incendie criminel chez " + vic.name + ", la rumeur désigne " + agg.name + ".";
      } else { amt = cut(vic, 0.08, 150000, 150); lossA = "📉 Tu étrangles les finances de " + vic.name + "."; lossV = "📉 Tes comptes se vident par à-coups, et tu sais qui tire les ficelles (" + agg.name + ")."; }
    } else if (r < 0.6 && mature) {
      const dmg = 10 + Math.floor(rng() * 14);
      vic.stats.sante = clamp(vic.stats.sante - dmg, 0, 100); amt = cut(vic, 0.02, 15000, 50); vic.stats.bonheur = clamp(vic.stats.bonheur - 8, 0, 100);
      lossA = "👊 Tu fais régler ses comptes à " + vic.name + ". L'affaire est brutale.";
      lossV = "👊 Tu te fais tabasser à la sortie d'un bar. L'hôpital te garde quelques jours, et " + agg.name + " ne se cache même plus.";
      if (rng() < 0.3) { FX.applyFx(g, agg, { repute: -12, prison: 1 }, null); lossA += " La police remonte jusqu'à toi, tu écopes d'un an de prison."; pub = "🚔 " + agg.name + " est condamné" + G(agg, "", "e") + " pour une agression sur " + vic.name + "."; }
    } else {
      amt = cut(vic, 0.1, 250000, 200); vic.stats.repute = clamp(vic.stats.repute - 6, 0, 100);
      lossA = "📉 Tu coupes à " + vic.name + " les vivres, les relations et les clients.";
      lossV = "📉 On te ferme des portes une à une et ta trésorerie s'effondre de " + (amt ? C.fmt(amt) : "beaucoup") + ". " + agg.name + " mène la danse.";
      pub = "📉 " + vic.name + " voit ses affaires s'effondrer, la guerre contre " + agg.name + " fait des dégâts.";
    }
  }
  if (amt && lv >= 3 && rng() < 0.5) { agg.cash += Math.round(amt * 0.3); }
  tell(agg, lossA); tell(vic, lossV);
  vic.stats.bonheur = clamp(vic.stats.bonheur - 3, 0, 100);
  SK.touch(g, agg.seat, vic.seat, { riv: 3 });
  note(g, bd, "Incident entre " + agg.name + " et " + vic.name + " (" + stageWord(bd) + ")");
  grievance(g, vic, agg, "incident", amt);
  if (pub) g.news(agg, pub, "gossip");
  // les alliés de la victime
  afterHostile(g, agg, vic);
}

function tick(g) {
  if (!g.settings.hostile) { g.avengers = []; return; }
  const live = g.alivePlayers();
  // les alliés qui prennent la défense d'un proche attaqué
  (g.avengers || []).forEach((v) => {
    const X = g.players[v.x], A = g.players[v.culprit], V = g.players[v.victim];
    if (!alive(X) || !alive(A) || !alive(V) || X === A) return;
    const m = cut(A, 0.04, 50000, 100);
    A.stats.repute = clamp(A.stats.repute - 4, 0, 100);
    SK.touch(g, X.seat, A.seat, { riv: 22, aff: -15 });
    tell(X, "🛡️ Tu prends la défense de " + V.name + " contre " + A.name + ". Le message est reçu cinq sur cinq.");
    tell(V, "🛡️ " + X.name + ", ton allié" + G(X, "", "e") + ", a pris ta défense face à " + A.name + ".");
    tell(A, "🛡️ " + X.name + " s'en prend à toi pour venger " + V.name + (m ? " et te coûte " + C.fmt(m) : "") + ".");
    SK.touch(g, X.seat, V.seat, { aff: 8 });
    g.news(X, "🛡️ " + X.name + " prend la défense de " + V.name + " contre " + A.name + ".", "gossip");
    grievance(g, A, X, "defense", m);
  });
  g.avengers = [];
  // les alliances qui s'éteignent, les dettes épongées par un allié
  const seen = {};
  live.forEach((a) => live.forEach((b) => {
    if (a.seat >= b.seat) return;
    const bd = SK.bond(g, a.seat, b.seat);
    if (bd.tags.allie && bd.aff < 15) { delete bd.tags.allie; tell(a, "🤝 Ton alliance avec " + b.name + " s'est éteinte, faute d'entretien."); tell(b, "🤝 Ton alliance avec " + a.name + " s'est éteinte, faute d'entretien."); }
    if (bd.tags.allie) {
      [[a, b], [b, a]].forEach(([rich, poor]) => {
        if (seen[poor.seat]) return;
        if (poor.debt > 8000 && poor.debt > poor.cash && rich.cash > poor.debt * 0.8 && g.rng() < 0.3) {
          const pay = Math.round(Math.min(poor.debt * 0.4, rich.cash * 0.2));
          if (pay < 1000) return;
          seen[poor.seat] = 1;
          rich.cash -= pay; poor.debt = Math.max(0, poor.debt - pay);
          SK.touch(g, a.seat, b.seat, { aff: 10 });
          tell(rich, "🤝 Tu viens en aide à ton allié" + G(poor, "", "e") + " " + poor.name + " en épongeant " + C.fmt(pay) + " de ses dettes.");
          tell(poor, "🤝 " + rich.name + " éponge " + C.fmt(pay) + " de tes dettes sans rien demander.");
          g.news(rich, "🤝 " + rich.name + " vient en aide à " + poor.name + " pour ses dettes.", "love");
          bd.tags.sauve = g.round;
        }
      });
    }
    // incidents d'une rivalité qui s'envenime
    const lv = level(bd);
    bd._lv = lv;
    if (lv >= 1 && PROB[lv] > 0 && !a.prison && !b.prison && g.rng() < PROB[lv]) {
      const [agg, vic] = aggressorOf(g, a, b);
      incident(g, agg, vic, bd, lv);
    }
  }));
}

// ---------- effets spéciaux des actions ----------
function special(g, name, A, B, out, lines) {
  const rng = g.rng;
  const fmt = C.fmt;
  const bd = SK.bond(g, A.seat, B.seat);
  switch (name) {
    case "ruin_ok": {
      const m = cut(B, 0.1 + rng() * 0.12, 400000, 200);
      const co = pickAsset(B, ["entreprise"], rng);
      if (co) co.value = Math.round(co.value * 0.85);
      A.cash += Math.round(m * 0.35);
      lines.a.push("📉 Les affaires de " + B.name + " perdent environ " + fmt(m) + ", dont " + fmt(Math.round(m * 0.35)) + " passent chez toi.");
      lines.b.push("📉 Tes affaires s'effondrent, tu perds environ " + fmt(m) + ".");
      g.news(null, "📉 Les affaires de " + B.name + " s'effondrent, certains murmurent le nom de " + A.name + ".", "gossip");
      note(g, bd, A.name + " a ruiné les affaires de " + B.name);
      return;
    }
    case "ruin_ko": {
      const m = cut(A, 0.05, 60000, 100);
      A.stats.repute = clamp(A.stats.repute - 5, 0, 100);
      lines.a.push("💸 Tes manœuvres ont tourné court et t'ont coûté " + fmt(m) + " d'enquêteurs et d'avocats.");
      note(g, bd, A.name + " a tenté de ruiner " + B.name + " sans succès");
      return;
    }
    case "fire_ok": {
      if (B.job) { FX.applyFx(g, B, { fire: true, repute: -4, bonheur: -8 }, null); lines.b.push("💼 On te licencie après une série de rapports accablants, venus d'on ne sait où."); lines.a.push("💼 " + B.name + " a été licencié" + G(B, "", "e") + ". Ton coup de fil y est pour beaucoup."); g.news(null, "💼 " + B.name + " perd son poste, la rumeur désigne " + A.name + ".", "gossip"); note(g, bd, A.name + " a fait licencier " + B.name); }
      return;
    }
    case "dirt_ok": {
      const guilty = B.record > 0 || B.flags.illicite || B.flags.voleur || B.flags.fugitif;
      B.stats.repute = clamp(B.stats.repute - 18, 0, 100); B.stats.bonheur = clamp(B.stats.bonheur - 6, 0, 100);
      A.stats.repute = clamp(A.stats.repute + 2, 0, 100);
      lines.a.push("🗂️ Ton enquêteur déterre un vieux dossier sur " + B.name + ". Tu le fais fuiter au bon moment.");
      lines.b.push("🗂️ Un vieux dossier sur toi fuite dans la presse. Ta réputation en prend un sacré coup.");
      if (guilty && g.settings.mature && rng() < 0.5) { FX.applyFx(g, B, { prison: 1 + Math.floor(rng() * 2) }, null); lines.b.push("🚔 L'affaire est rouverte. Tu es arrêté" + G(B, "", "e") + "."); g.news(null, "🚔 " + B.name + " est arrêté" + G(B, "", "e") + " après des révélations.", "crime"); }
      note(g, bd, A.name + " a fait fuiter un dossier sur " + B.name);
      return;
    }
    case "frame_ok": {
      FX.applyFx(g, B, { prison: 1 + Math.floor(rng() * 3), repute: -20, bonheur: -12 }, null);
      lines.a.push("🪤 Ton piège fonctionne. " + B.name + " est arrêté" + G(B, "", "e") + " et tu n'es jamais cité" + G(A, "", "e") + ".");
      lines.b.push("🪤 Des preuves arrivent de nulle part. Tu es arrêté" + G(B, "", "e") + " pour une affaire qui n'est pas la tienne.");
      g.news(null, "🚔 " + B.name + " est arrêté" + G(B, "", "e") + " dans une affaire troublante.", "crime");
      note(g, bd, A.name + " a piégé " + B.name);
      return;
    }
    case "frame_ko": {
      A.stats.repute = clamp(A.stats.repute - 15, 0, 100);
      if (g.settings.mature) FX.applyFx(g, A, { prison: 1 }, null);
      lines.a.push("🪤 Le piège se retourne contre toi. La police remonte jusqu'à toi" + (g.settings.mature ? ", et tu passes un an en prison." : "."));
      lines.b.push("🪤 La police découvre que quelqu'un a monté un dossier contre toi. C'était " + A.name + ".");
      g.news(A, "🪤 " + A.name + " est démasqué" + G(A, "", "e") + " en train de piéger " + B.name + ".", "crime");
      return;
    }
    case "wreck_ok": {
      const a = pickAsset(B, ["voiture", "immo", "loufoque", "art"], rng);
      if (a) {
        if (a.kind === "voiture" || rng() < 0.4) B.assets.splice(B.assets.indexOf(a), 1); else a.value = Math.round(a.value * 0.7);
        lines.a.push("🔥 " + B.name + " ne sait pas encore qui a touché à son bien " + a.name.toLowerCase() + ". Toi si.");
        lines.b.push("🔥 Ton bien " + a.name.toLowerCase() + " est saccagé en pleine nuit.");
      } else {
        const m = cut(B, 0.06, 80000, 100);
        lines.a.push("🔥 Tu fais saccager ce que " + B.name + " possède. Il n'y a pas grand-chose à détruire, tu lui coûtes " + fmt(m) + ".");
        lines.b.push("🔥 On te saccage tes affaires, ça te coûte " + fmt(m) + ".");
      }
      g.news(null, "🔥 Un acte de vandalisme visant " + B.name + " fait grand bruit.", "crime");
      note(g, bd, A.name + " a saccagé les biens de " + B.name);
      return;
    }
    case "wreck_ko": {
      const m = cut(A, 0.05, 40000, 100);
      A.stats.repute = clamp(A.stats.repute - 8, 0, 100);
      lines.a.push("🚨 Une caméra te filme. Amende de " + fmt(m) + " et ta réputation en prend un coup.");
      if (g.settings.mature && rng() < 0.3) { FX.applyFx(g, A, { prison: 1 }, null); lines.a.push("⛓️ Tu passes un an en prison."); }
      lines.b.push("🚨 Un acte de vandalisme contre toi échoue, et " + A.name + " se fait prendre.");
      return;
    }
    case "hit_dead": {
      B.dying = { cause: "dans des circonstances suspectes", final: true };
      bd.tags.contract = g.round; bd.riv = 100;
      lines.a.push("🕯️ L'affaire est réglée. " + B.name + " ne se relèvera pas.");
      lines.b.push("🕯️ Ce soir-là, quelqu'un frappe à ta porte. C'est la dernière chose que tu verras.");
      if (g.settings.mature && rng() < 0.5) { FX.applyFx(g, A, { prison: 8 + Math.floor(rng() * 8), repute: -35 }, null); lines.a.push("🚔 Les enquêteurs remontent la piste jusqu'à toi. Tu es condamné" + G(A, "", "e") + " à une très lourde peine."); g.news(A, "🚔 " + A.name + " est condamné" + G(A, "", "e") + " pour avoir commandité la mort de " + B.name + ".", "crime"); }
      return;
    }
    case "hit_hurt": {
      B.stats.sante = clamp(B.stats.sante - (35 + Math.floor(rng() * 15)), 3, 100); B.stats.bonheur = clamp(B.stats.bonheur - 15, 0, 100);
      const m = cut(B, 0.04, 40000, 100);
      bd.tags.contract = g.round; SK.touch(g, A.seat, B.seat, { riv: 30 });
      lines.a.push("🩸 Le travail est fait, à moitié. " + B.name + " est entre la vie et la mort, mais respire encore.");
      lines.b.push("🩸 Des coups de feu dans la nuit. Tu t'en sors de justesse, des mois d'hôpital t'attendent (" + fmt(m) + " de frais)." + (rng() < 0.65 ? " Tu es persuadé" + G(B, "", "e") + " que " + A.name + " est derrière." : ""));
      grievance(g, B, A, "contrat", m);
      g.news(null, "🩸 " + B.name + " échappe de peu à une tentative d'assassinat.", "crime");
      return;
    }
    case "hit_miss": {
      B.stats.bonheur = clamp(B.stats.bonheur - 8, 0, 100);
      bd.tags.contract = g.round; SK.touch(g, A.seat, B.seat, { riv: 12 });
      lines.a.push("🎯 Le contrat échoue sans bruit. Ton argent est parti, " + B.name + " est intact.");
      lines.b.push("🎯 Une voiture noire te file toute la soirée, puis disparaît. Tu n'as jamais eu aussi peur." + (rng() < 0.5 ? " Tu penses à " + A.name + "." : ""));
      if (lines.b.length && rng() < 0.5) grievance(g, B, A, "contrat", 0);
      return;
    }
    case "hit_caught": {
      const yrs = g.settings.mature ? 6 + Math.floor(rng() * 7) : 2;
      FX.applyFx(g, A, { prison: yrs, repute: -30, bonheur: -15 }, null);
      B.stats.repute = clamp(B.stats.repute + 6, 0, 100); B.stats.bonheur = clamp(B.stats.bonheur - 10, 0, 100);
      bd.tags.contract = g.round; bd.riv = 100;
      lines.a.push("🚔 Le tueur parle. Tu es arrêté" + G(A, "", "e") + " pour tentative d'assassinat, " + yrs + " ans de prison.");
      lines.b.push("🚔 Un homme a été arrêté, il avouait travailler pour " + A.name + ". Tu as échappé à une tentative d'assassinat.");
      g.news(A, "🚔 " + A.name + " est arrêté" + G(A, "", "e") + " pour avoir voulu faire tuer " + B.name + ".", "crime");
      return;
    }
    case "bailout": {
      const pay = Math.round(Math.min(B.debt, A.cash * 0.4));
      if (pay < 500) { lines.a.push("🤝 Tu voulais éponger les dettes de " + B.name + ", mais tu n'as pas de quoi."); return; }
      A.cash -= pay; B.debt = Math.max(0, B.debt - pay);
      bd.tags.sauve = g.round;
      lines.a.push("🤝 Tu éponges " + fmt(pay) + " de dettes de " + B.name + ". Il ou elle n'oubliera jamais.");
      lines.b.push("🤝 " + A.name + " règle " + fmt(pay) + " de tes dettes. Tu lui dois bien plus que de l'argent.");
      g.news(A, "🤝 " + A.name + " vole au secours de " + B.name + " et éponge ses dettes.", "love");
      return;
    }
    case "intro_network": {
      if (B.job) {
        B.job.perf = clamp(B.job.perf + 14, 0, 100);
        if (rng() < 0.35) { FX.applyFx(g, B, { raise: 0.08 }, null); lines.b.push("📈 Une réunion bien placée débouche sur une augmentation de 8 %."); }
        lines.b.push("🥂 " + A.name + " te présente des gens qui comptent. Ton travail est remarqué.");
      } else if (!B.retired) {
        FX.applyFx(g, B, { jobHunt: true }, null);
        lines.b.push("🥂 " + A.name + " te présente des gens qui comptent. Une piste d'emploi sérieuse s'ouvre.");
      } else lines.b.push("🥂 " + A.name + " te présente des gens qui comptent, pour une retraite pleine de belles rencontres.");
      A.stats.repute = clamp(A.stats.repute + 2, 0, 100);
      lines.a.push("🥂 Tu ouvres ton carnet d'adresses à " + B.name + ". Ça te grandit.");
      return;
    }
    case "fund": {
      const stake = Math.round(clamp(A.cash * 0.08, 1500, 150000));
      if (A.cash < stake || stake < 1500) { lines.a.push("💼 Tu n'as pas assez d'argent pour financer le projet de " + B.name + "."); return; }
      A.cash -= stake; B.cash += stake;
      const ok = rng() < clamp(0.5 + (B.stats.intel - 50) / 200 + (B.traits.ambition - 50) / 300, 0.2, 0.8);
      if (ok) {
        const back = Math.round(stake * (1.5 + rng() * 1.2)); A.cash += back; B.cash += Math.round(stake * 0.5);
        lines.a.push("💼 Le projet de " + B.name + " décolle. Ta mise de " + fmt(stake) + " te revient à " + fmt(back) + ".");
        lines.b.push("💼 Grâce à l'argent de " + A.name + ", ton projet décolle. Tu gardes " + fmt(Math.round(stake * 1.5)) + " de bénéfice net.");
        g.news(A, "💼 " + A.name + " a bien investi dans le projet de " + B.name + ".", "money");
        SK.touch(g, A.seat, B.seat, { aff: 8 });
      } else {
        B.cash = Math.max(0, B.cash - Math.round(stake * 0.9)); B.stats.repute = clamp(B.stats.repute - 2, 0, 100);
        lines.a.push("💼 Le projet de " + B.name + " échoue. Tes " + fmt(stake) + " s'évaporent.");
        lines.b.push("💼 Ton projet n'a pas décollé et l'argent de " + A.name + " est parti avec. La gêne s'installe.");
        SK.touch(g, A.seat, B.seat, { aff: -4 });
      }
      return;
    }
    case "vengeance_ok": {
      const gr = (g.grievances || []).find((x) => x.v === A.seat && x.c === B.seat && x.round >= g.round - 2);
      const base = Math.max(gr && gr.loot ? gr.loot * 1.3 : 0, B.cash * (0.06 + rng() * 0.08));
      const m = cut(B, base / Math.max(1, B.cash), 250000, 150);
      A.cash += Math.round(m * 0.5);
      B.stats.repute = clamp(B.stats.repute - 6, 0, 100);
      if (m) { lines.a.push("💶 Ta vengeance coûte " + fmt(m) + " à " + B.name + ", et " + fmt(Math.round(m * 0.5)) + " finissent dans ta poche."); lines.b.push("💶 La vengeance de " + A.name + " te coûte " + fmt(m) + "."); }
      if (gr) gr.used = true;
      note(g, bd, A.name + " s'est vengé" + G(A, "", "e") + " de " + B.name);
      return;
    }
    case "vengeance_ko": {
      const m = cut(A, 0.04, 30000, 100);
      B.stats.repute = clamp(B.stats.repute + 2, 0, 100);
      if (m) lines.a.push("💸 Ta vengeance rate et te coûte " + fmt(m) + ".");
      const gr = (g.grievances || []).find((x) => x.v === A.seat && x.c === B.seat && x.round >= g.round - 2);
      if (gr) gr.used = true;
      note(g, bd, A.name + " a raté sa vengeance contre " + B.name);
      return;
    }
    case "sabotage_ok": {
      if (B.job) { B.job.perf = clamp(B.job.perf - 20, 0, 100); if (B.job.perf < 35 && rng() < 0.45) { FX.applyFx(g, B, { fire: true }, null); lines.b.push("💼 Après ce sabotage, ton employeur te remercie."); lines.a.push("💼 " + B.name + " est licencié" + G(B, "", "e") + ". Personne ne t'a vu."); } }
      return;
    }
    case "truce": {
      delete bd.tags.betrayed; bd._lv = level(bd);
      note(g, bd, "Une trêve est signée entre " + A.name + " et " + B.name);
      return;
    }
    default: return require("./relations").special(g, name, A, B, out, lines);
  }
}

module.exports = { level, stageWord, roleOf, power, odds, afterHostile, tick, special, note, STAGES };
