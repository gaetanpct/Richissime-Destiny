// Fin de partie par vote — fiche de vie, notation, résultats
(function () {
  const RD = window.RD;
  const { h, clear } = RD;
  const S = () => RD.S;
  const emit = (ev, d) => RD.emit(ev, d);
  const BIRTH = { modeste: "Née dans une famille modeste", moyenne: "Née dans une famille de classe moyenne", aisee: "Née dans une famille aisée" };
  const fmt1 = (n) => (Math.round(n * 10) / 10).toString().replace(".", ",");
  const signed = (n) => (n > 0 ? "+ " : n < 0 ? "− " : "") + RD.money(Math.abs(n));

  function statBar(s) {
    const cl = s.v < 35 ? "low" : s.v < 65 ? "mid" : "hi";
    return h("div.stat", h("span", { title: s.l }, s.ic), h("div", h("div.lab", s.l), h("div.bar." + cl, h("i", { style: { width: s.v + "%" } }))), h("span.v", s.v));
  }
  function tile(label, value, sub, tone) {
    return h("div.rvtile" + (tone ? "." + tone : ""), h("div.k", label), h("div.v", value), sub ? h("div.s", sub) : null);
  }

  // La fiche d'une vie, utilisée pendant le vote et dans les résultats
  RD.lifeCard = function (f) {
    const m = f.money;
    const fem = f.gender === "f";
    const out = [];
    out.push(h("div.rvhead", RD.avatar(f.avatar, 64, true), h("div.grow",
      h("h2", { style: { margin: 0 } }, f.name),
      h("div.muted", (f.survivor ? "Toujours en vie à " : (fem ? "Morte à " : "Mort à ")) + f.age + " ans, " + (f.survivor ? "la partie s'arrête là" : f.cause)),
      h("div.rvtitle", f.title),
      f.birth ? h("div.small.muted", BIRTH[f.birth].replace("Née", fem ? "Née" : "Né")) : null)));
    out.push(h("div.rvtiles",
      tile("Fortune finale", RD.money(m.net), null, m.net >= 0 ? "good" : "bad"),
      tile("Sommet de fortune", RD.money(m.peak), "à " + m.peakAge + " ans"),
      tile("Pire moment", RD.money(m.low), "à " + m.lowAge + " ans", m.low < 0 ? "bad" : null),
      tile("Argent gagné au fil des années", RD.money(m.income), "salaires, aides, revenus"),
      tile("Argent dépensé", RD.money(m.expenses), "vie, loyers, impôts, frais"),
      tile("Coups du sort", signed(m.gains - m.losses), "gagné " + RD.money(m.gains) + " et perdu " + RD.money(m.losses)),
      tile("Dettes à la fin", RD.money(m.debt), null, m.debt > 0 ? "bad" : null)));
    out.push(h("div.rvcols",
      h("div", h("h4", "Ses états à la fin"), f.stats.map(statBar)),
      h("div", h("h4", "Son parcours"),
        h("ul.rvlist",
          h("li", "💼 " + (f.jobs.length ? f.jobs.join(", ") : "Aucun métier") + (f.yearsWorked ? " (" + f.yearsWorked + " ans de travail)" : "")),
          h("li", "🎓 " + (f.diplomas.length ? f.diplomas.join(", ") : "Pas de diplôme")),
          h("li", "💘 " + (f.love.length ? "En couple avec " + f.love.join(", ") : "Seul" + (fem ? "e" : "") + " à la fin") + (f.exes ? ", " + f.exes + " ex" : "")),
          h("li", "👶 " + (f.kids ? f.kids + " enfant" + (f.kids > 1 ? "s" : "") + " (" + f.kidNames.join(", ") + ")" : "Aucun enfant")),
          h("li", "🏠 " + (f.assets.length ? f.assets.join(", ") : "Aucun bien")),
          h("li", "⚖️ " + (f.record ? f.record + " ennui" + (f.record > 1 ? "s" : "") + " avec la justice" + (f.prison ? ", passage en prison" : "") : "Casier vierge"))))));
    out.push(h("h4", { style: { marginTop: "12px" } }, "Les moments clés"));
    out.push(h("div.rvmoments", f.moments.map((x) => h("div.mo", h("b", x.age + " ans"), h("span", x.ic + " " + x.text)))));
    out.push(h("h4", { style: { marginTop: "12px" } }, "La fortune au fil des années"));
    out.push(RD.wealthChart([{ name: f.name, color: f.avatar.color, points: f.wealth, dead: true }], { height: 200 }));
    return h("div.card.rvcard", out);
  };

  // ======================================================
  // ÉCRAN DE VOTE
  // ======================================================
  RD.renderReview = function (root) {
    const st = S().game; const rv = st.review; const room = S().room;
    const isHost = room && room.players.find((p) => p.you && room.hostId === p.id);
    clear(root);
    const mine = rv.mine;
    const self = rv.target === st.seat;
    const stars = h("div.rvscale", Array.from({ length: 10 }, (_, i) => i + 1).map((n) =>
      h("button" + (mine === n ? ".sel" : ""), { type: "button", disabled: !rv.canRate, "aria-label": "note " + n + " sur 10", on: { click: () => { RD.play("select"); emit("game:rate", { score: n }); } } }, n)));
    const waiting = rv.raters.filter((r) => !r.done);
    const prog = h("div.rvprog", rv.order.map((o, i) => h("div.rvstep" + (i === rv.idx ? ".cur" : i < rv.idx ? ".done" : ""), RD.avatar(o.avatar, 28), h("span", i < rv.idx ? "✓" : String(i + 1)))));
    root.appendChild(h("div.screen",
      h("div.topbar", h("div.in", h("div.logo", "RICHISSIME", h("small", "DESTINY")), h("div.phasebadge", "Le vote, vie " + (rv.idx + 1) + " sur " + rv.total), h("div.grow"),
        isHost ? h("button.btn.small.light", { title: "Passe à la vie suivante", on: { click: () => emit("host:force") } }, "⏩ Accélérer") : null,
        h("button.iconbtn", { "aria-label": "son", on: { click: () => { RD.setSound(!RD.sound.on); RD.render(); } } }, RD.sound.on ? "🔊" : "🔇"))),
      h("div.wrap",
        h("div.center", h("div.ribbon", "Tout le monde est mort"), h("h1", { style: { fontSize: "clamp(1.8rem,5vw,3rem)" } }, "Le jury de la vie"),
          h("p.muted", "Chaque vie défile une par une. Donne ta note de 1 à 10, la meilleure moyenne remporte la partie.")),
        prog,
        rv.totalMs && rv.deadline ? RD.timerBar(rv.deadline, rv.totalMs) : null,
        h("div.center", h("button.btn.small.light", { type: "button", on: { click: () => { const n = document.getElementById("rvvote"); if (n) n.scrollIntoView({ behavior: "smooth" }); } } }, "⬇ Aller au vote")),
        RD.lifeCard(rv.file),
        h("div.card.gold.rvvote", { id: "rvvote" },
          h("h3", self && !rv.canRate ? "C'est ta propre vie" : "Quelle note pour la vie de " + rv.file.name + " ?"),
          rv.canRate ? h("p.small", "Fortune, aventures, drames, ironie du sort, tout compte. Tu peux changer ta note tant que le temps n'est pas écoulé.") : h("p.small", "Tu ne votes pas pour toi. Regarde les autres noter."),
          rv.canRate ? stars : null,
          rv.canRate ? h("p.small", mine ? "Ta note actuelle est " + mine + " sur 10." : "Tu n'as pas encore voté.") : null,
          h("div.rvwho", rv.raters.map((r) => h("span.pill" + (r.done ? ".good" : ""), r.name + (r.done ? " a voté" : " réfléchit")))),
          waiting.length ? h("p.small.muted", "En attente de " + waiting.map((w) => w.name).join(", ") + ".") : h("p.small.muted", "Tout le monde a voté, on passe à la suite.")),
      )));
  };

  // ======================================================
  // BLOC DES RÉSULTATS DU VOTE (écran final)
  // ======================================================
  RD.voteResults = function (F) {
    const files = F.files;
    return h("div",
      h("div.card", { style: { marginTop: "14px" } }, h("h3", "Les notes détaillées"),
        h("div.rvgrid", F.ranking.map((r) => h("div.rvres", h("div.rvres-h", RD.avatar(files.find((x) => x.seat === r.seat).avatar, 30), h("b", r.name), h("span.pill.gold", r.avg === null ? "sans note" : fmt1(r.avg) + " sur 10")),
          r.scores.length ? h("div.rvscores", r.scores.map((s) => h("span.pill", s.from + " " + s.v))) : h("p.small.muted", "Personne n'a voté."))))),
      h("div.card", { style: { marginTop: "14px" } }, h("h3", "Revoir les vies"),
        files.map((f) => {
          const d = h("details.acc", h("summary", f.name + ", " + f.age + " ans", h("span", "▾")), h("div.in", RD.lifeCard(f)));
          return d;
        })));
  };
  RD.fmtAvg = fmt1;
})();
