// ============================================================
// RICHISSIME DESTINY — Effets des actions de statut
// Vendetta (coups très durs contre un ennemi juré), couple, prison et anciens partenaires.
// Appelé par feud.special quand l'effet n'est pas reconnu. Les textes évitent les deux-points.
// ============================================================
const C = require("./core");
const FX = require("./fx");
const R = require("./rules");
const SK = require("./socialkit");

const clamp = C.clamp;
const fmt = C.fmt;
const G = (p, a, b) => (p.gender === "f" ? b : a);
const int = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));
function cut(p, pct, cap, floor) { const m = Math.round(Math.min(Math.max(0, p.cash) * pct, cap)); if (m < (floor || 50)) return 0; p.cash -= m; return m; }
function pickAsset(p, kinds, rng) { const l = p.assets.filter((a) => kinds.includes(a.kind) && !a.partnerCompany); return l.length ? l[Math.floor(rng() * l.length)] : null; }
function grievance(g, victim, culprit, kind, loot) { g.grievances = (g.grievances || []).filter((x) => x.round >= g.round - 2); g.grievances.push({ v: victim.seat, c: culprit.seat, kind, round: g.round, loot: loot || 0 }); }
function note(g, bd, text) { bd.log = (bd.log || []).concat([{ round: g.round, age: g.age, text }]).slice(-6); }
const mature = (g) => !!g.settings.mature;
const sentence = (g, A, yrs, why, lines) => {
  if (!mature(g)) { FX.applyFx(g, A, { repute: -20, bonheur: -8 }, null); lines.a.push("🚨 Tu es pris" + G(A, "", "e") + " la main dans le sac, " + why + ". Sans la prison, mais la honte est totale."); return; }
  FX.applyFx(g, A, { prison: yrs, repute: -25, bonheur: -12 }, null);
  lines.a.push("⛓️ " + why + ". Tu es condamné" + G(A, "", "e") + " à " + yrs + " an" + (yrs > 1 ? "s" : "") + " de prison.");
  g.news(A, "⛓️ " + A.name + " est condamné" + G(A, "", "e") + " à " + yrs + " an" + (yrs > 1 ? "s" : "") + " de prison.", "crime");
};
function hurt(B, n) { B.stats.sante = clamp(B.stats.sante - n, 3, 100); }
function partnerOf(g, B) {
  if (B.partner && B.partner.player !== undefined) return { kind: "player", p: g.players[B.partner.player] };
  const n = B.npcs.find((x) => (x.kind === "partner" || x.kind === "spouse") && x.alive);
  return n ? { kind: "npc", n } : null;
}
function endPartner(g, B, why) {
  const pr = partnerOf(g, B);
  if (!pr) return null;
  if (pr.kind === "player") { require("./social").breakUp(g, B, pr.p, B.partner && B.partner.status === "marie"); return pr; }
  if (pr.n.kind === "spouse") B.mem.divorces = (B.mem.divorces || 0) + 1;
  pr.n.kind = "ex"; pr.n.close = Math.min(pr.n.close, 15);
  if (B.partner && B.partner.npc === pr.n.id) B.partner = null;
  B.stats.bonheur = clamp(B.stats.bonheur - 14, 0, 100);
  return pr;
}

function special(g, name, A, B, out, lines) {
  const rng = g.rng;
  const bd = SK.bond(g, A.seat, B.seat);
  switch (name) {
    // ===== vendetta =====
    case "poison_ok": {
      const n = int(rng, 18, 34); hurt(B, n); B.stats.bonheur = clamp(B.stats.bonheur - 8, 0, 100);
      lines.a.push("☠️ Le repas de " + B.name + " était bien assaisonné. Il ou elle passera des semaines à l'hôpital.");
      lines.b.push("☠️ Un repas qui passe mal, puis l'hôpital. Les médecins parlent d'un empoisonnement, tu perds " + n + " points de santé.");
      if (mature(g) && rng() < 0.06) { B.dying = { cause: "empoisonné", final: false, story: "Tu es mort{|e} d'un empoisonnement, sans jamais savoir qui l'avait voulu." }; lines.b.push("🕯️ Les médecins arrivent trop tard."); }
      if (rng() < 0.6) grievance(g, B, A, "contrat", 0);
      note(g, bd, A.name + " a empoisonné " + B.name); g.news(null, "☠️ " + B.name + " est hospitalisé" + G(B, "", "e") + " pour empoisonnement.", "crime"); return;
    }
    case "poison_ko": sentence(g, A, int(rng, 2, 4), "Le poison a été retrouvé chez toi", lines); lines.b.push("🚔 Quelqu'un a tenté de t'empoisonner. La police a arrêté " + A.name + "."); return;
    case "arson_ok": {
      const a = pickAsset(B, ["immo", "entreprise"], rng) || pickAsset(B, ["voiture", "art", "loufoque"], rng);
      if (a) { B.assets.splice(B.assets.indexOf(a), 1); lines.a.push("🔥 " + a.name + " de " + B.name + " part en fumée en pleine nuit."); lines.b.push("🔥 Ton bien " + a.name.toLowerCase() + " brûle entièrement. La perte est de " + fmt(a.value) + "."); }
      else { const m = cut(B, 0.12, 300000, 100); lines.a.push("🔥 Tu mets le feu à ce que possède " + B.name + ". Il y a peu à brûler, mais ça lui coûte " + fmt(m) + "."); lines.b.push("🔥 Un incendie criminel te coûte " + fmt(m) + "."); }
      B.stats.bonheur = clamp(B.stats.bonheur - 12, 0, 100); note(g, bd, A.name + " a incendié un bien de " + B.name); grievance(g, B, A, "incendie", 0); g.news(null, "🔥 Un incendie criminel frappe " + B.name + ".", "crime"); return;
    }
    case "arson_ko": sentence(g, A, int(rng, 3, 6), "Un voisin t'a vu verser l'essence", lines); lines.b.push("🚔 L'auteur de l'incendie est arrêté, c'était " + A.name + "."); return;
    case "kidnap_ok": {
      const m = cut(B, 0.3, 800000, 500);
      A.cash += Math.round(m * 0.7); B.stats.bonheur = clamp(B.stats.bonheur - 18, 0, 100); B.stats.sante = clamp(B.stats.sante - 6, 3, 100);
      lines.a.push("🕶️ La rançon tombe. Tu empoches " + fmt(Math.round(m * 0.7)) + ", et personne ne te soupçonne pour l'instant.");
      lines.b.push("🕶️ Trois jours dans une cave. Tu paies une rançon de " + fmt(m) + " et tu ne dors plus depuis.");
      note(g, bd, A.name + " a fait enlever " + B.name); grievance(g, B, A, "contrat", m); g.news(null, "🕶️ L'enlèvement de " + B.name + " fait la une.", "crime"); return;
    }
    case "kidnap_ko": sentence(g, A, int(rng, 6, 10), "L'enlèvement tourne mal et la police remonte jusqu'à toi", lines); lines.b.push("🚔 Tes ravisseurs ont été arrêtés. Le commanditaire est " + A.name + "."); B.stats.repute = clamp(B.stats.repute + 5, 0, 100); return;
    case "press_ok": {
      B.stats.repute = clamp(B.stats.repute - 30, 0, 100); B.stats.bonheur = clamp(B.stats.bonheur - 8, 0, 100);
      lines.a.push("📰 Ta campagne de presse démolit la réputation de " + B.name + ". Les journalistes se régalent.");
      lines.b.push("📰 Une campagne de presse te démolit. Des articles, des plateaux télé, des voisins qui te regardent de travers.");
      if (B.job && rng() < 0.3) { FX.applyFx(g, B, { fire: true }, null); lines.b.push("💼 Ton employeur ne veut plus de toi après ça."); }
      note(g, bd, A.name + " a lancé une campagne de presse contre " + B.name); g.news(null, "📰 Une campagne de presse accable " + B.name + ".", "gossip"); return;
    }
    case "press_ko": {
      const m = cut(A, 0.02, 12000, 100); A.stats.repute = clamp(A.stats.repute - 15, 0, 100);
      lines.a.push("📰 Les journalistes découvrent d'où viennent les rumeurs sur " + B.name + ". Tu es condamné" + G(A, "", "e") + " pour diffamation, " + fmt(m) + " d'amende.");
      lines.b.push("📰 Une campagne de presse contre toi est démasquée. Elle venait de " + A.name + ". Tu es lavé" + G(B, "", "e") + " de tout soupçon."); B.stats.repute = clamp(B.stats.repute + 6, 0, 100); return;
    }
    case "doubt_ok": {
      const pr = endPartner(g, B);
      if (pr) { lines.a.push("💔 Tes petits mots, tes photos et tes mensonges font leur travail. " + B.name + " se sépare."); lines.b.push("💔 Quelqu'un a semé le doute dans ton couple. Tu perds la personne que tu aimais." + (pr.kind === "player" ? "" : " Elle ne t'a plus parlé.")); if (pr.kind === "player") pr.p.yearLog.push("💔 Des rumeurs t'ont convaincu" + G(pr.p, "", "e") + " de quitter " + B.name + ". Elles venaient de " + A.name + "."); g.news(B, "💔 " + B.name + " est quitté" + G(B, "", "e") + " à la suite d'un coup monté.", "love"); }
      else lines.a.push("💔 " + B.name + " n'a personne à qui semer le doute.");
      note(g, bd, A.name + " a brisé le couple de " + B.name); return;
    }
    case "doubt_ko": { A.stats.repute = clamp(A.stats.repute - 6, 0, 100); const pr = partnerOf(g, B); if (pr && pr.kind === "player") SK.touch(g, B.seat, pr.p.seat, { aff: 6 }); lines.a.push("💔 Ton plan est éventé. Le couple de " + B.name + " en sort plus soudé."); lines.b.push("💞 Quelqu'un a essayé de monter ton couple contre toi. Vous en sortez plus proches."); B.stats.bonheur = clamp(B.stats.bonheur + 3, 0, 100); return; }
    case "seduce_ok": {
      const pr = endPartner(g, B);
      if (pr) {
        A.stats.bonheur = clamp(A.stats.bonheur + 8, 0, 100); A.stats.repute = clamp(A.stats.repute - 4, 0, 100);
        lines.a.push("😏 Tu séduis le ou la partenaire de " + B.name + ". La rupture est consommée.");
        lines.b.push("💔 Ton ou ta partenaire te quitte pour " + A.name + ". Le coup est cruel.");
        if (pr.kind === "player") { SK.touch(g, A.seat, pr.p.seat, { aff: 25 }); if (!A.partner && !pr.p.partner) { A.partner = { player: pr.p.seat, status: "couple", since: A.age }; pr.p.partner = { player: A.seat, status: "couple", since: pr.p.age }; lines.a.push("❤️ Vous voilà en couple, " + pr.p.name + " et toi."); pr.p.yearLog.push("❤️ Tu t'es mis" + G(pr.p, "", "e") + " en couple avec " + A.name + " après la rupture."); } else pr.p.yearLog.push("💔 Tu as quitté " + B.name + " pour " + A.name + "."); }
        g.news(null, "😏 " + A.name + " a pris le ou la partenaire de " + B.name + ".", "love");
      } else lines.a.push("😏 " + B.name + " n'a personne à séduire.");
      note(g, bd, A.name + " a pris le ou la partenaire de " + B.name); return;
    }
    case "seduce_ko": { A.stats.repute = clamp(A.stats.repute - 12, 0, 100); A.stats.bonheur = clamp(A.stats.bonheur - 5, 0, 100); lines.a.push("😳 Ta tentative de séduction est repoussée avec fracas. Tout le monde en parle."); lines.b.push("😤 " + A.name + " a tenté de séduire ton ou ta partenaire. Il ou elle t'a tout raconté."); B.stats.bonheur = clamp(B.stats.bonheur + 2, 0, 100); return; }
    case "hack_ok": {
      const m = cut(B, 0.12 + rng() * 0.13, 500000, 200);
      A.cash += m; lines.a.push("💻 Tu siphonnes " + fmt(m) + " sur les comptes de " + B.name + ". Une belle opération."); lines.b.push("💻 Quelqu'un a siphonné " + fmt(m) + " sur tes comptes.");
      note(g, bd, A.name + " a piraté les comptes de " + B.name); grievance(g, B, A, "arnaque", m); return;
    }
    case "hack_ko": { const m = cut(A, 0.05, 40000, 100); lines.a.push("💻 Ton piratage est remonté par la police. Amende de " + fmt(m) + "."); if (mature(g) && rng() < 0.5) sentence(g, A, 1, "Tu es condamné" + G(A, "", "e") + " pour piratage", lines); lines.b.push("💻 Une tentative de piratage de tes comptes est déjouée. L'IP mène à " + A.name + "."); return; }
    case "brake_ok": {
      const n = int(rng, 10, 26); hurt(B, n); const car = pickAsset(B, ["voiture"], rng); if (car) B.assets.splice(B.assets.indexOf(car), 1);
      lines.a.push("🚗 La voiture de " + B.name + " finit dans le fossé. " + (car ? "Épave." : "")); lines.b.push("🚗 Les freins lâchent sur la route. Tu t'en sors avec " + n + " points de santé en moins" + (car ? " et ta voiture est détruite." : "."));
      if (rng() < 0.04) { B.dying = { cause: "accident de la route provoqué", final: false, story: "Tu es mort{|e} dans un accident de voiture aux freins sabotés." }; lines.b.push("🕯️ Les secours arrivent trop tard."); }
      note(g, bd, A.name + " a saboté la voiture de " + B.name); grievance(g, B, A, "contrat", 0); return;
    }
    case "brake_ko": sentence(g, A, 1, "Un garagiste t'a reconnu" + G(A, "", "e") + " sur la vidéo", lines); lines.b.push("🚗 Un sabotage de ta voiture est découvert à temps. L'auteur est " + A.name + "."); return;
    case "family_ok": {
      B.npcs.forEach((n) => { if (n.alive && ["pere", "mere", "frere", "soeur", "child", "spouse", "partner", "ami"].includes(n.kind)) n.close = Math.max(5, n.close - 25); });
      B.stats.bonheur = clamp(B.stats.bonheur - 10, 0, 100);
      lines.a.push("🕸️ Tu montes la famille de " + B.name + " contre lui ou elle, un mot après l'autre."); lines.b.push("🕸️ Ta famille se refroidit sans raison. Quelqu'un a travaillé dans l'ombre."); note(g, bd, A.name + " a retourné la famille de " + B.name); return;
    }
    case "family_ko": A.stats.repute = clamp(A.stats.repute - 6, 0, 100); lines.a.push("🕸️ La famille de " + B.name + " fait front et te claque la porte au nez."); lines.b.push("🕸️ Ta famille te dit que " + A.name + " est venu" + G(A, "", "e") + " dire du mal de toi. Personne n'y croit."); return;
    case "duel_final": {
      const pa = require("./feud").power(g, A), pb = require("./feud").power(g, B);
      const aWins = rng() < clamp(0.5 + (pa - pb) * 0.15, 0.2, 0.8);
      const W = aWins ? A : B, L = aWins ? B : A;
      const pot = Math.round(Math.min(W.cash, L.cash) * 0.5);
      L.cash -= pot; W.cash += pot; hurt(L, int(rng, 8, 20)); W.stats.repute = clamp(W.stats.repute + 10, 0, 100); L.stats.repute = clamp(L.stats.repute - 6, 0, 100);
      lines.a.push(aWins ? "⚔️ Le duel est à ton avantage. " + B.name + " paie " + fmt(pot) + " et s'effondre." : "⚔️ Tu perds le duel et paies " + fmt(pot) + " à " + B.name + ". La blessure sera longue à guérir.");
      lines.b.push(aWins ? "⚔️ Tu perds le duel contre " + A.name + " et paies " + fmt(pot) + "." : "⚔️ Tu gagnes le duel contre " + A.name + " et empoches " + fmt(pot) + ".");
      if (rng() < 0.04) { L.dying = { cause: "mort en duel", final: false, story: "Tu es mort{|e} au cours d'un duel de vengeance." }; (aWins ? lines.b : lines.a).push("🕯️ Le duel te coûte la vie."); }
      g.news(null, "⚔️ " + W.name + " l'emporte dans un duel à mort contre " + L.name + ".", "gossip"); note(g, bd, "Duel entre " + A.name + " et " + B.name); return;
    }
    case "exile": {
      if (B.job) FX.applyFx(g, B, { fire: true }, null);
      B.stats.repute = clamp(B.stats.repute - 10, 0, 100); B.stats.bonheur = clamp(B.stats.bonheur - 10, 0, 100);
      try { FX.applyFx(g, B, { city: true }, null); } catch (e) { /* pas de ville */ }
      bd.riv = Math.max(40, bd.riv - 25);
      lines.a.push("🚪 Ton argent a parlé. " + B.name + " plie bagage et quitte la ville."); lines.b.push("🚪 On t'a fait comprendre qu'il valait mieux partir. Tu quittes la ville avec ce que tu peux emporter, et sans emploi.");
      note(g, bd, A.name + " a fait quitter la ville à " + B.name); g.news(null, "🚪 " + B.name + " a quitté la ville précipitamment.", "gossip"); return;
    }
    case "beating_ok": {
      const n = int(rng, 18, 32); hurt(B, n); B.stats.bonheur = clamp(B.stats.bonheur - 10, 0, 100); B.stats.charme = clamp(B.stats.charme - 4, 0, 100);
      lines.a.push("🥊 Tes hommes de main ont fait leur travail. " + B.name + " n'est pas près d'oublier."); lines.b.push("🥊 Trois hommes dans une ruelle. Tu perds " + n + " points de santé, et tu sais qui est derrière ça.");
      note(g, bd, A.name + " a fait tabasser " + B.name); grievance(g, B, A, "contrat", 0); return;
    }
    case "beating_ko": sentence(g, A, int(rng, 1, 2), "Tes hommes de main ont parlé", lines); lines.b.push("🥊 Une agression te visant échoue, et les agresseurs avouent que " + A.name + " les a payés."); return;
    case "partners_ok": {
      const a = pickAsset(B, ["entreprise"], rng);
      const base = a ? a.value : Math.max(0, B.cash) * 0.2; const loss = Math.round(base * 0.35);
      if (a) a.value = Math.round(a.value * 0.65); else B.cash -= loss;
      A.cash += Math.round(loss * 0.3); B.stats.bonheur = clamp(B.stats.bonheur - 6, 0, 100);
      lines.a.push("🕴️ Tes appuis retournent les associés de " + B.name + ". Tu en retires " + fmt(Math.round(loss * 0.3)) + "."); lines.b.push("🕴️ Tes associés t'abandonnent un à un, ton affaire perd environ " + fmt(loss) + ".");
      note(g, bd, A.name + " a retourné les associés de " + B.name); return;
    }
    case "partners_ko": A.stats.repute = clamp(A.stats.repute - 8, 0, 100); lines.a.push("🕴️ Tes manœuvres auprès des associés de " + B.name + " sont éventées."); lines.b.push("🕴️ Tes associés t'avouent qu'on a tenté de les retourner contre toi, ils ont refusé."); return;
    case "tax_ok": {
      const m = cut(B, 0.08 + (B.record > 0 ? 0.06 : 0) + rng() * 0.05, 300000, 150);
      B.stats.repute = clamp(B.stats.repute - 3, 0, 100);
      lines.a.push("🧾 Ta dénonciation au fisc déclenche un contrôle. " + B.name + " paie " + fmt(m) + "."); lines.b.push("🧾 Un contrôle fiscal tombe du ciel, il te coûte " + fmt(m) + ".");
      grievance(g, B, A, "denounce", m); note(g, bd, A.name + " a dénoncé " + B.name + " au fisc"); return;
    }
    case "tax_ko": A.stats.repute = clamp(A.stats.repute - 3, 0, 100); lines.a.push("🧾 Le fisc classe ta dénonciation. " + B.name + " est irréprochable."); lines.b.push("🧾 Un contrôle fiscal te trouve en règle. Tu apprends qui t'avait dénoncé."); return;
    case "curse": {
      const roll = rng();
      if (roll < 0.45) { B.stats.bonheur = clamp(B.stats.bonheur - 6, 0, 100); lines.a.push("🔮 Ton sort fait effet, ou c'est un hasard. " + B.name + " passe une année exécrable."); lines.b.push("🔮 Une année de malchance noire, comme si on t'avait jeté un sort."); }
      else if (roll < 0.8) { lines.a.push("🔮 Le sort ne fait rien, sauf un éclat de rire."); lines.b.push("🔮 Quelqu'un te raconte qu'on t'a jeté un sort. Tu en ris pendant une semaine."); B.stats.bonheur = clamp(B.stats.bonheur + 2, 0, 100); }
      else { A.stats.bonheur = clamp(A.stats.bonheur - 7, 0, 100); lines.a.push("🔮 Le sort se retourne contre toi. Une année de malchance."); lines.b.push("🔮 Un sort lancé contre toi se retourne contre son auteur."); }
      return;
    }
    case "armistice": { bd.riv = Math.max(0, bd.riv - 35); bd.aff = Math.min(100, bd.aff + 8); lines.a.push("🕊️ Un cessez-le-feu froid est conclu."); lines.b.push("🕊️ Un cessez-le-feu froid est conclu."); return; }
    // ===== couple =====
    case "couple_break": {
      const married = A.partner && A.partner.status === "marie";
      require("./social").breakUp(g, A, B, married); return;
    }
    case "couple_pause": { bd.tags.pause = g.round; SK.touch(g, A.seat, B.seat, { aff: -6 }); if (rng() < 0.3) { require("./social").breakUp(g, A, B, false); lines.a.push("💔 La pause se transforme en rupture."); } else { lines.a.push("⏸️ La pause fait du bien à tout le monde."); A.stats.bonheur = clamp(A.stats.bonheur + 2, 0, 100); B.stats.bonheur = clamp(B.stats.bonheur + 2, 0, 100); } return; }
    case "mutual_will": { A.heir = B.seat; B.heir = A.seat; lines.a.push("📜 Chacun couche l'autre sur son testament."); lines.b.push("📜 Chacun couche l'autre sur son testament."); return; }
    case "home_buy": {
      const price = 120000; const h = Math.round(price / 2);
      if (A.cash < h || B.cash < h) { lines.a.push("🏡 Vous n'avez pas de quoi vous offrir la maison."); return; }
      A.cash -= h; B.cash -= h;
      [A, B].forEach((x) => { x.assets.push({ id: "a" + (x.assetSeq = (x.assetSeq || 0) + 1), kind: "immo", name: "Maison de couple", value: h, cost: h, upkeep: 600, income: 0 }); x.stats.bonheur = clamp(x.stats.bonheur + 6, 0, 100); });
      lines.a.push("🏡 Vous achetez une maison ensemble, " + fmt(h) + " chacun."); return;
    }
    case "pet_adopt": { [A, B].forEach((x) => { try { FX.applyFx(g, x, { pet: true }, null); } catch (e) { /* ignore */ } x.stats.bonheur = clamp(x.stats.bonheur + 4, 0, 100); }); lines.a.push("🐾 Un nouvel habitant arrive à la maison."); return; }
    case "therapy": { bd.tags.soigne = g.round; SK.touch(g, A.seat, B.seat, { aff: 10, riv: -8 }); lines.a.push("🛋️ La thérapie vous rapproche, vous dites enfin ce que vous n'osiez pas dire."); return; }
    case "affair": {
      A.stats.bonheur = clamp(A.stats.bonheur + 5, 0, 100);
      if (rng() < 0.45) {
        A.stats.repute = clamp(A.stats.repute - 6, 0, 100); SK.touch(g, A.seat, B.seat, { aff: -25, riv: 18 }); B.stats.bonheur = clamp(B.stats.bonheur - 15, 0, 100);
        lines.a.push("😬 Ton aventure est découverte. " + B.name + " ne te le pardonne pas facilement."); lines.b.push("💔 Tu découvres que " + A.name + " te trompait.");
        if (rng() < 0.55) { const married = A.partner && A.partner.status === "marie"; require("./social").breakUp(g, A, B, married); }
        grievance(g, B, A, "trahison", 0);
      } else lines.a.push("🤫 Une aventure discrète, que personne ne découvre. Pour l'instant.");
      return;
    }
    case "jealous_scene": { SK.touch(g, A.seat, B.seat, { aff: -6, riv: 6 }); A.stats.bonheur = clamp(A.stats.bonheur - 2, 0, 100); B.stats.bonheur = clamp(B.stats.bonheur - 4, 0, 100); lines.a.push("😤 La dispute est mémorable."); return; }
    case "reunite": {
      if (A.partner || B.partner) { lines.a.push("💞 L'un de vous est déjà en couple, ça complique les retrouvailles."); return; }
      A.partner = { player: B.seat, status: "couple", since: A.age }; B.partner = { player: A.seat, status: "couple", since: B.age }; delete bd.tags.ex; bd.tags.couple = g.round; lines.a.push("💞 Vous vous remettez ensemble."); g.news(A, "💞 " + A.name + " et " + B.name + " se remettent ensemble.", "love"); return;
    }
    case "vow_renew": { A.stats.repute = clamp(A.stats.repute + 1, 0, 100); lines.a.push("💍 Vous renouvelez vos vœux devant tous vos proches."); g.news(A, "💍 " + A.name + " et " + B.name + " renouvellent leurs vœux.", "love"); return; }
    case "honeymoon": { lines.a.push("🌴 Un voyage de noces qui restera dans les mémoires."); return; }
    // ===== prison =====
    case "lawyer": {
      if (!B.prison) return;
      const cut1 = rng() < 0.65 ? int(rng, 1, 4) : 0;
      if (cut1) { B.prison.left = Math.max(0, B.prison.left - cut1); if (B.prison.left <= 0) { FX.applyFx(g, B, { free: true }, null); lines.b.push("🔓 Ton avocat obtient ta libération immédiate."); } else lines.b.push("⚖️ L'avocat obtient " + cut1 + " an" + (cut1 > 1 ? "s" : "") + " de moins sur ta peine."); lines.a.push("⚖️ L'avocat paie. " + B.name + " voit sa peine réduite de " + cut1 + " an" + (cut1 > 1 ? "s" : "") + "."); B.stats.bonheur = clamp(B.stats.bonheur + 8, 0, 100); }
      else { lines.a.push("⚖️ L'avocat fait ce qu'il peut, sans résultat."); lines.b.push("⚖️ Un avocat envoyé par " + A.name + " se casse les dents sur ton dossier."); B.stats.bonheur = clamp(B.stats.bonheur + 2, 0, 100); }
      return;
    }
    case "jailbreak_ok": {
      if (!B.prison) return; FX.applyFx(g, B, { free: true }, null); B.flags.fugitif = 1; B.flagTtl.fugitif = 15; B.record += 1; B.stats.bonheur = clamp(B.stats.bonheur + 15, 0, 100);
      lines.a.push("🏃 L'évasion réussit. " + B.name + " est libre, mais recherché" + G(B, "", "e") + "."); lines.b.push("🏃 Une nuit, une porte s'ouvre. Tu es libre, et tu vas devoir te cacher."); g.news(null, "🏃 " + B.name + " s'est évadé" + G(B, "", "e") + " de prison.", "crime"); return;
    }
    case "jailbreak_ko": { if (B.prison) B.prison.left += int(rng, 1, 3); sentence(g, A, int(rng, 3, 5), "Ta tentative d'évasion échoue", lines); lines.b.push("🚨 Une tentative d'évasion échoue et ta peine s'allonge."); return; }
    case "abandon": { bd.aff = Math.max(5, bd.aff - 30); B.stats.bonheur = clamp(B.stats.bonheur - 10, 0, 100); const pr = partnerOf(g, B); if (A.partner && A.partner.player === B.seat) require("./social").breakUp(g, A, B, A.partner.status === "marie"); lines.a.push("🚪 Tu tournes la page."); lines.b.push("🚪 Tu comprends que " + A.name + " ne reviendra plus te voir."); return; }
    case "taunt": { B.stats.bonheur = clamp(B.stats.bonheur - 10, 0, 100); A.stats.bonheur = clamp(A.stats.bonheur + 3, 0, 100); lines.a.push("😏 Tu savoures ton passage au parloir."); lines.b.push("😠 " + A.name + " vient te narguer derrière la vitre."); return; }
    case "extend": { if (B.prison && rng() < 0.5) { const n = int(rng, 1, 3); B.prison.left += n; B.prison.total += n; lines.a.push("⚖️ Tes pistes font prolonger la peine de " + B.name + " de " + n + " an" + (n > 1 ? "s" : "") + "."); lines.b.push("⚖️ Ta peine est prolongée de " + n + " an" + (n > 1 ? "s" : "") + " à la suite de nouveaux éléments."); grievance(g, B, A, "tendre_piege", 0); } else { lines.a.push("⚖️ Tes démarches pour prolonger la peine de " + B.name + " n'aboutissent pas."); A.stats.repute = clamp(A.stats.repute - 3, 0, 100); } return; }
    case "manage_assets": {
      const v = B.assets.reduce((s, a) => s + a.value, 0); const fee = Math.round(v * 0.03);
      B.assets.forEach((a) => { a.value = Math.round(a.value * 1.04); }); A.cash += fee; lines.a.push("📒 Tu gères les biens de " + B.name + " pendant son absence et touches " + fmt(fee) + " de commission."); lines.b.push("📒 Tes biens sont bien gérés pendant ton absence."); return;
    }
    case "threaten_family": {
      B.npcs.forEach((n) => { if (n.alive && ["mere", "pere", "child", "spouse", "partner", "frere", "soeur"].includes(n.kind)) n.close = Math.max(5, n.close - 20); });
      B.stats.bonheur = clamp(B.stats.bonheur - 14, 0, 100); lines.a.push("😈 Tu fais passer le message à la famille de " + B.name + "."); lines.b.push("😈 Des menaces visent ta famille pendant que tu es enfermé" + G(B, "", "e") + "."); grievance(g, B, A, "contrat", 0); return;
    }
    default: return;
  }
}

module.exports = { special, partnerOf, endPartner };
