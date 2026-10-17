// Écran de jeu — personnage, année, scènes, argent, interactions, bilan, fin de partie
(function () {
  const RD = window.RD;
  const { h, clear } = RD;
  const S = () => RD.S;
  const emit = (ev, d) => RD.emit(ev, d);

  const PHASE_LABEL = { agenda: "Prépare ton année", respond: "Réponds aux propositions", group: "Scène collective", mini: "Parties de cartes", event: "Les événements de l'année", recap: "Bilan de l'année", over: "Fin de partie" };
  const TAG_LABEL = { ecole: "École", famille: "Famille", amour: "Amour", travail: "Travail", argent: "Argent", sante: "Santé", social: "Vie sociale", loufoque: "Aventure", voyage: "Voyage", sport: "Sport", mature: "Vie d'adulte", jalon: "Grand moment", saga: "Grande histoire", logement: "Logement", calme: "Année calme" };
  const RISK = ["", "⚠️", "⚠️⚠️", "☠️"];

  const barClass = (v) => (v < 35 ? "low" : v < 65 ? "mid" : "hi");
  const statBar = (s) => h("div.stat", h("span", { title: s.l }, s.ic), h("div", h("div.lab", s.l), h("div.bar." + barClass(s.v), h("i", { style: { width: s.v + "%" } }))), h("span.v", s.v));
  function val(k, d) { const v = S().ui.vals[k]; return v === undefined ? d : v; }
  function setVal(k, v) { S().ui.vals[k] = v; }
  function numInput(k, def, extra) {
    const n = h("input", Object.assign({ type: "number", inputmode: "numeric", value: val(k, def), "data-k": k }, extra || {}));
    n.addEventListener("input", () => setVal(k, n.value));
    return n;
  }
  function sel(k, options, def, onch) {
    const n = h("select", { "data-k": k }, options.map((o) => h("option", { value: o[0], selected: String(val(k, def)) === String(o[0]) }, o[1])));
    n.addEventListener("change", () => { setVal(k, n.value); onch && onch(); RD.render(); });
    return n;
  }
  function openDetails(key, summary, body, def) {
    const open = S().ui.open[key] === undefined ? !!def : S().ui.open[key];
    const d = h("details.acc", { open }, h("summary", summary, h("span", "▾")), h("div.in", body));
    d.addEventListener("toggle", () => { S().ui.open[key] = d.open; });
    return d;
  }

  // ---------- puces de résultat ----------
  function chip(c) {
    if (c.t) return h("span.chip" + (c.bad ? ".down" : ".info"), c.t);
    const up = c.bad ? c.d < 0 : c.d > 0;
    const txt = c.money ? (c.d > 0 ? "+" : "−") + RD.money(Math.abs(c.d)) : RD.signed(c.d);
    return h("span.chip." + (up ? "up" : "down"), (c.ic || "") + " " + (c.l || "") + " " + txt);
  }

  // ======================================================
  // COLONNE DE GAUCHE — mon personnage
  // ======================================================
  function meCard(st) {
    const m = st.me; const ui = S().ui;
    const tabs = [["vie", "Vie"], ["rel", "Proches"], ["biens", "Biens"], ["job", "Carrière"]];
    const body = h("div");
    if (ui.tab === "vie") {
      const j = m.journal;
      body.appendChild(j.length ? h("div", { "data-keepscroll": "journal", style: { maxHeight: "300px", overflow: "auto" } }, j.slice(0, 40).map((e) => h("div.jr", h("b", e.age + " ans"), " ", e.ic || "", " ", e.text))) : h("p.muted.small", "Ta vie commence. Les souvenirs s'accumuleront ici."));
      body.appendChild(openDetails("traits", "Ma personnalité", h("div", m.traits.map(statBar))));
    } else if (ui.tab === "rel") {
      if (m.others && m.others.length) {
        body.appendChild(h("h4", { style: { margin: "0 0 6px" } }, "Les autres joueurs et moi"));
        body.appendChild(h("div.list", m.others.map((o) => h("div.item" + (o.alive ? "" : ".dead"), RD.avatar(o.avatar, 34, !o.alive),
          h("div.main", h("b", o.name), " ", h("span.pill" + (o.tone === "bad" ? ".coral" : o.tone === "good" ? ".gold" : ""), { style: { fontSize: ".7rem" } }, o.ic + " " + o.role),
            h("div.sub", o.alive ? o.age + " ans" + (o.notes.length ? " · " + o.notes.join(" · ") : "") : "Disparu(e)"),
            o.alive ? h("div", { title: "Affinité " + o.aff + " sur 100, rivalité " + o.riv + " sur 100", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginTop: "4px" } },
              h("div.mini", h("i", { style: { width: o.aff + "%" } })), h("div.mini", h("i", { style: { width: o.riv + "%", background: "var(--bad)" } }))) : null,
            o.log && o.log.length ? h("div.sub", { style: { fontStyle: "italic" } }, o.log[o.log.length - 1]) : null)))));
        body.appendChild(h("p.small.muted", "Barre de gauche l'affinité, barre de droite la rivalité. Plus la rivalité monte, plus les coups deviennent graves, même quand tu ne fais rien.")); 
        body.appendChild(h("h4", { style: { margin: "12px 0 6px" } }, "Ma famille et mes proches"));
      }
      body.appendChild(h("div.list", m.relations.length ? m.relations.map((r) => h("div.item" + (r.alive ? "" : ".dead"), h("span.ic", r.ic), h("div.main", h("b", r.name), " ", h("span.sub", r.label + " · " + r.age + " ans" + (r.alive ? "" : " · disparu(e)")), r.alive ? h("div.mini", h("i", { style: { width: r.close + "%" } })) : null))) : [h("p.muted.small", "Personne pour l'instant.")]));
    } else if (ui.tab === "biens") {
      body.appendChild(h("div.list", m.assets.length ? m.assets.map((a) => h("div.item", h("span.ic", a.ic), h("div.main", h("b", a.name), h("div.sub", RD.money(a.value) + (a.income ? " · rapporte " + RD.money(a.income) + " par an" : "") + (a.upkeep ? " · entretien " + RD.money(a.upkeep) : ""))))) : [h("p.muted.small", "Tu ne possèdes rien pour l'instant.")]));
      body.appendChild(h("p.small.muted", { style: { marginTop: "8px" } }, "Logement " + ({ parents: "chez les parents", own: "propriétaire", coloc: "colocation", location: "locataire", street: "dans la rue" }[m.home] || m.home) + " · " + m.city));
    } else {
      if (m.job) {
        body.appendChild(h("div.item", h("span.ic", m.job.ic), h("div.main", h("b", m.job.title), h("div.sub", m.job.track + " · " + RD.money(m.job.salary) + " par an brut · depuis " + m.job.since + " ans"), h("div.bar", { style: { marginTop: "4px" } }, h("i", { style: { width: m.job.perf + "%" } })), h("div.sub", "Performance " + m.job.perf + " sur 100" + (m.job.next ? " · prochain niveau " + m.job.next : "")))));
      } else if (m.retired) body.appendChild(h("p", "Retraité, pension de " + RD.money(m.pension) + " par an."));
      else body.appendChild(h("p.muted.small", m.school.inSchool || m.school.studying ? "Tu es encore aux études." : "Tu n'as pas d'emploi. Les idées de l'année contiennent des pistes pour en trouver un."));
      body.appendChild(h("div.item", { style: { marginTop: "8px" } }, h("span.ic", "🎓"), h("div.main", h("b", m.school.phase), h("div.sub", "Niveau scolaire " + m.school.grade + " sur 100" + (m.school.diplomas.length ? " · " + m.school.diplomas.join(", ") : "")))));
    }
    return h("div.card",
      h("div.me-head", RD.avatar(m.avatar, 52, !m.alive), h("div", h("div.nm", m.name), h("div.small.muted", m.age + " ans · " + (st.players[m.seat].status)))),
      h("div.row.between", h("div", h("div.small.muted", "Argent"), h("div.bigmoney" + (m.cash < 0 ? ".neg" : ""), RD.money(m.cash))),
        h("div", { style: { textAlign: "right" } }, h("div.small.muted", "Patrimoine"), h("div.bigmoney" + (m.net < 0 ? ".neg" : ""), RD.moneyShort(m.net)))),
      m.debt > 0 ? h("div.small", { style: { color: "var(--bad)", fontWeight: 700, margin: "4px 0" } }, "Dettes " + RD.money(m.debt)) : null,
      h("div.pill.gold", { style: { margin: "6px 0 8px" } }, m.tier),
      m.prison ? h("div.pill.coral", { style: { marginLeft: "6px" } }, "⛓️ Prison " + m.prison.left + " an(s)") : null,
      m.stats.map(statBar),
      h("div.tabs", { style: { marginTop: "12px" } }, tabs.map(([k, l]) => h("button" + (ui.tab === k ? ".sel" : ""), { on: { click: () => { ui.tab = k; RD.render(); } } }, l))),
      body);
  }

  // ======================================================
  // COLONNE DE DROITE — joueurs, gazette, tchat
  // ======================================================
  function playersPanel(st) {
    return h("div.card", h("h3", "Les joueurs"),
      h("div.list", st.players.map((p) => h("div.pl" + (p.you ? ".you" : "") + (p.alive ? "" : ".dead"),
        RD.avatar(p.avatar, 38, !p.alive),
        h("div", h("div.nm", p.name, p.you ? " (toi)" : "", p.bot ? h("span.pill.navy", { style: { marginLeft: "5px" } }, "auto") : (S().game.autoSeats && S().game.autoSeats[p.seat] && !p.you ? h("span.pill", { style: { marginLeft: "5px" } }, "absent") : null)),
          h("div.meta", p.alive ? p.age + " ans · " + p.status + (p.prison ? " ⛓️" : "") : "Mort(e) à " + p.deathAge + " ans, " + p.cause),
          h("div.meta", p.marital + (p.kids ? " · " + p.kids + " enfant" + (p.kids > 1 ? "s" : "") : "")),
          p.role ? h("div.meta", h("span.pill" + (p.role.tone === "bad" ? ".coral" : p.role.tone === "good" ? ".gold" : ""), { style: { fontSize: ".65rem" } }, p.role.ic + " " + p.role.word + " pour toi")) : null,
          h("div.meta", p.net !== null && p.net !== undefined ? h("b", RD.money(p.net)) : p.tier ? h("b", "Niveau " + p.tier) : "Fortune secrète", " · ", h("span.stars", { title: "Réputation sur 100. Tout le monde commence à 50." }, "⭐ " + p.repute))),
        p.alive && ["agenda", "recap", "event"].includes(st.phase) ? h("span.dot" + (p.ready ? ".on" : ""), { title: p.ready ? "a terminé" : "réfléchit" }) : null))),
      h("p.small.muted.starnote", "⭐ Les étoiles sont la réputation, sur 100. Tout le monde commence à 50. Elle monte avec les bons gestes (cadeaux, bénévolat, exploits, belle carrière) et baisse avec les coups bas, les scandales et la prison. Elle influence les rencontres et les réactions des autres."));
  }

  RD.refreshChat = function () {
    const box = document.querySelector("#chatbox"); if (!box) return;
    clear(box);
    S().chat.forEach((m) => box.appendChild(m.system ? h("div.sys", m.text) : h("div", h("span.who", m.name, " "), m.text)));
    box.scrollTop = box.scrollHeight;
  };

  function rightTabs(st) {
    const ui = S().ui;
    const tabs = [["gazette", "📰 La Gazette"], ["chat", "💬 Tchat"]];
    const body = h("div");
    if (ui.rtab === "gazette") {
      body.appendChild(h("div", { "data-keepscroll": "gaz", style: { maxHeight: "300px", overflow: "auto" } }, st.gazette.length ? st.gazette.map((n) => h("div.news", h("b", n.age + " ans"), " ", n.text)) : h("p.muted.small", "Rien à signaler pour l'instant.")));
    } else {
      const input = h("input", { type: "text", maxlength: 200, placeholder: "Écris un message", "data-k": "chat", value: val("chat", "") });
      input.addEventListener("input", () => setVal("chat", input.value));
      const send = () => { const t = input.value.trim(); if (!t) return; emit("chat:send", { text: t }); setVal("chat", ""); input.value = ""; };
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
      body.appendChild(h("div#chatbox.chatbox"));
      body.appendChild(h("div.row", { style: { marginTop: "6px" } }, h("div.grow", input), h("button.btn.small", { on: { click: send } }, "Envoyer")));
      setTimeout(RD.refreshChat, 0);
    }
    return h("div.card", h("div.tabs", tabs.map(([k, l]) => h("button" + (ui.rtab === k ? ".sel" : ""), { on: { click: () => { ui.rtab = k; RD.render(); } } }, l))), body);
  }

  // ======================================================
  // SCÈNES (événements)
  // ======================================================
  function sceneView(st) {
    const sc = st.scene; const m = st.me;
    const tag = (sc.tags && sc.tags[0]) || "";
    const banner = h("div.banner", h("span.tagline", (TAG_LABEL[tag] || "Événement") + (sc.depth ? " · la suite" : "")), h("span.tagline", m.age + " ans"));
    const parts = [banner];
    const body = h("div.body", h("div.big", sc.ic), sc.title ? h("h3.center", sc.title) : null);
    if (sc.state === "choose") {
      body.appendChild(h("div.txt", sc.text));
      if (sc.deadline) body.appendChild(RD.timerBar(sc.deadline, 25000));
      body.appendChild(h("div.choices", sc.choices.map((c) => h("button.choice", { disabled: !c.ok, on: { click: () => { RD.play("click"); emit("game:scene", { i: c.i }); } } },
        h("span.ic", c.ic), h("span.lab", c.l, c.hint && c.ok ? h("span.hint", c.hint) : null, !c.ok && c.why ? h("span.why", c.why) : null),
        c.cost ? h("span.cost", RD.money(c.cost)) : null, c.risk ? h("span.risk", { title: "Choix risqué" }, RISK[c.risk]) : null))));
    } else {
      const r = sc.result;
      if (r.death) {
        body.appendChild(h("div.deathcard.card", h("div.stone", "🪦"), h("h2", m.name + " s'éteint"), h("p", r.text), h("p", "Mort" + (m.gender === "f" ? "e" : "") + " à " + m.age + " ans, " + r.death.cause + "."), h("p.small", "Fortune finale " + RD.money(r.death.net))));
      } else {
        body.appendChild(h("div.txt", sc.text));
        body.appendChild(h("div.result", h("div.said", "Tu as choisi · " + r.choice), h("div.out", r.text), h("div.chips", r.chips.map(chip))));
      }
      if (sc.deadline && !r.death) body.appendChild(RD.timerBar(sc.deadline, 15000));
      body.appendChild(h("div", { style: { marginTop: "12px", textAlign: "center" } }, h("button.btn.big", { on: { click: () => { RD.play("click"); emit("game:continue"); } } }, r.death ? "Voir la suite" : r.hasNext ? "Et ensuite" : "Continuer")));
    }
    parts.push(body);
    return h("div.card.scene", parts);
  }

  function waitCard(title, sub, extra) {
    return h("div.card.waiting", h("h3", title), sub ? h("p.muted", sub) : null, h("div.dots", h("span", "•"), h("span", "•"), h("span", "•")), extra);
  }

  // ======================================================
  // AGENDA — projet de vie, argent, action sociale
  // ======================================================
  function financePanel(st) {
    const m = st.me; const F = st.agenda.finance;
    const body = h("div");
    // résumé
    body.appendChild(h("div.rep-nums",
      h("div.num", h("span.small", "Argent disponible"), h("b", RD.money(m.cash))),
      h("div.num" + (m.debt > 0 ? ".neg" : ""), h("span.small", "Dettes"), h("b", RD.money(m.debt))),
      h("div.num", h("span.small", "Patrimoine total"), h("b", RD.money(m.net)))));
    // placer
    const kinds = F.kinds;
    const kindSel = sel("fin.kind", kinds.map((k) => [k.id, k.ic + " " + k.l + " · risque " + k.risk + " sur 5"]), "livret");
    const cur = kinds.find((k) => k.id === val("fin.kind", "livret")) || kinds[0];
    const amt = numInput("fin.amount", "", { min: 100, step: 100, placeholder: "Montant à placer" });
    const quick = (f) => h("button.btn.small.light", { type: "button", on: { click: () => { setVal("fin.amount", String(Math.floor(m.cash * f))); RD.render(); } } }, f === 1 ? "Tout" : Math.round(f * 100) + " %");
    const pct = (v) => (v * 100).toFixed(1).replace(".", ",") + " %";
    const RISK_NAME = ["Aucun risque", "Très prudent", "Prudent", "Équilibré", "Risqué", "Tout ou rien"];
    const meter = h("span.riskmeter.r" + cur.risk, { title: RISK_NAME[cur.risk] }, [0, 1, 2, 3, 4].map((i) => h("i" + (i < cur.risk ? ".on" : ""))), h("b", " " + RISK_NAME[cur.risk]));
    body.appendChild(h("h4", "Placer de l'argent"));
    body.appendChild(h("div.grid2", h("div", kindSel), h("div", amt)));
    body.appendChild(h("div.riskline", h("span", "Niveau de risque "), meter));
    body.appendChild(h("p.rate", (cur.d ? cur.d + " " : "") + "Rendement moyen " + pct(cur.rate) + " par an" + (cur.risk > 0 ? ", avec des écarts de l'ordre de " + Math.round(cur.vol * 100) + " % d'une année sur l'autre." : ".") + (cur.jackpot ? " Une année sur " + Math.round(1 / cur.jackpotP) + " environ, la mise est multipliée par " + cur.jackpot + ". Le reste du temps, elle fond." : "") + (cur.fee ? " Retrait avec " + Math.round(cur.fee * 100) + " % de frais." : "")));
    body.appendChild(h("div.row", quick(0.25), quick(0.5), quick(1), h("button.btn.small", { on: { click: () => { RD.play("coin"); emit("game:finance", { op: "invest", kind: val("fin.kind", "livret"), amount: Number(val("fin.amount", 0)) }); setVal("fin.amount", ""); } } }, "Placer")));
    // placements et biens
    const pools = m.assets.filter((a) => a.pool);
    const goods = m.assets.filter((a) => !a.pool);
    if (pools.length || goods.length) body.appendChild(h("h4", { style: { marginTop: "14px" } }, "Mes placements et mes biens"));
    pools.forEach((a) => {
      const wd = numInput("wd." + a.id, "", { min: 0, placeholder: "tout", style: { maxWidth: "120px" } });
      body.appendChild(h("div.item", h("span.ic", a.ic), h("div.main", h("b", a.name), h("div.sub", RD.money(a.value) + " (mis " + RD.money(a.cost) + ")")), wd, h("button.btn.small.light", { on: { click: () => { RD.play("coin"); emit("game:finance", { op: "withdraw", id: a.id, amount: Number(val("wd." + a.id, 0)) || 0 }); setVal("wd." + a.id, ""); } } }, "Retirer")));
    });
    goods.forEach((a) => body.appendChild(h("div.item", h("span.ic", a.ic), h("div.main", h("b", a.name), h("div.sub", RD.money(a.value) + (a.income ? " · rapporte " + RD.money(a.income) : "") + (a.upkeep ? " · entretien " + RD.money(a.upkeep) : "") + (a.shared ? " · société commune" : ""))), a.sellable ? h("button.btn.small.light", { title: "Vente avec 10 % de perte", on: { click: () => { if (confirm("Vendre " + a.name + " pour " + RD.money(a.value * 0.9) + " (10 % de frais) ?")) { RD.play("coin"); emit("game:finance", { op: "sell", id: a.id }); } } } }, "Vendre") : null)));
    // dettes
    if (m.debt > 0) {
      body.appendChild(h("h4", { style: { marginTop: "14px" } }, "Rembourser une dette"));
      body.appendChild(h("div.row", h("div.grow", numInput("fin.repay", String(Math.min(m.cash, m.debt)), { min: 1, step: 100 })), h("button.btn.small", { on: { click: () => { RD.play("coin"); emit("game:finance", { op: "repay", amount: Number(val("fin.repay", 0)) }); } } }, "Rembourser")));
    }
    // train de vie
    body.appendChild(h("h4", { style: { marginTop: "14px" } }, "Mon train de vie"));
    body.appendChild(h("div.opts", F.lifestyles.map((l) => h("button.opt" + (m.lifestyle === l.id ? ".sel" : ""), { type: "button", on: { click: () => { RD.play("click"); emit("game:finance", { op: "lifestyle", value: l.id }); } } }, h("div.t", l.ic + " " + l.l), h("div.d", l.d)))));
    // héritier
    const others = st.players.filter((p) => p.alive && !p.you);
    if (F.canInherit && others.length) {
      body.appendChild(h("h4", { style: { marginTop: "14px" } }, "Mon héritier parmi les joueurs"));
      const heirSel = sel("fin.heir", [["", "Personne"]].concat(others.map((p) => [String(p.seat), p.name])), m.heir === null || m.heir === undefined ? "" : String(m.heir), () => emit("game:finance", { op: "heir", seat: val("fin.heir", "") }));
      body.appendChild(heirSel);
      body.appendChild(h("p.rate", "À ta mort, 30 % de ta fortune ira à ton héritier (ou 40 % à ton conjoint si tu es marié)."));
    }
    return openDetails("fin", h("span", "💰 Mon argent"), body, false);
  }

  function socialPanel(st) {
    const SO = st.agenda.social;
    const acts = SO.actions || [];
    const body = h("div");
    const title = "🤝 Une action envers un autre joueur" + (acts.length ? " (" + acts.length + " idées cette année)" : "");
    if (SO.blocked) { body.appendChild(h("p.muted", SO.blocked)); return openDetails("soc", title, body, false); }
    if (!acts.length) { body.appendChild(h("p.muted", "Rien d'adapté cette année entre vous. Les idées changent chaque année selon l'âge, la situation et les liens.")); return openDetails("soc", title, body, false); }
    const kind = val("soc.kind", "");
    body.appendChild(h("p.small.muted", "Tu peux faire une seule chose par année, envers un seul joueur. C'est facultatif. Les idées changent chaque année, elles dépendent de votre âge, de vos liens et de votre situation."));
    body.appendChild(h("div.kinds", [h("button.opt" + (!kind ? ".sel" : ""), { type: "button", on: { click: () => { setVal("soc.kind", ""); RD.render(); } } }, h("div.t", "🚫 Aucune action"))].concat(acts.map((k) =>
      h("button.opt" + (kind === k.id ? ".sel" : "") + (k.hostile ? ".hostile" : ""), { type: "button", title: k.d, on: { click: () => { setVal("soc.kind", k.id); setVal("soc.target", ""); RD.render(); } } },
        h("div.t", k.ic + " " + k.l), k.step ? h("span.pill.gold", { style: { fontSize: ".65rem" } }, "étape") : null)))));
    if (kind) {
      const def = acts.find((k) => k.id === kind);
      if (!def) { setVal("soc.kind", ""); return openDetails("soc", title, body, false); }
      body.appendChild(h("p.small", { style: { marginTop: "8px" } }, def.d));
      const cur0 = String(val("soc.target", ""));
      const curT = def.targets.find((t) => String(t.seat) === cur0) || def.targets[0];
      setVal("soc.target", String(curT.seat));
      const tsel = sel("soc.target", def.targets.map((t) => [String(t.seat), t.name + " (" + t.word + ")"]), String(curT.seat));
      body.appendChild(h("label.field", "Pour qui")); body.appendChild(tsel);
      body.appendChild(h("p.small.muted", (def.mode === "offer" ? "L'autre joueur devra accepter. " : "Cela se passe sans son accord. ") + (def.cost ? (def.split ? "Coût de " + RD.money(def.cost) + " pour chacun." : "Coût de " + RD.money(def.cost) + " pour toi.") : "")));
      const f = [];
      if (["gift", "loan", "ask", "company", "duel"].includes(kind)) f.push(h("div", h("label.field", kind === "duel" ? ((val("soc.game", "") || (curT.games && curT.games[0])) === "blackjack" ? "Mise (obligatoire au blackjack, un robot ne peut pas refuser)" : "Mise (0 pour l'honneur)") : "Montant"), numInput("soc.amount", "", { min: 0, step: 100 })));
      if (kind === "loan") { f.push(h("div", h("label.field", "Taux d'intérêt en %"), numInput("soc.rate", "8", { min: 0, max: 25 }))); f.push(h("div", h("label.field", "Durée en années"), numInput("soc.years", "3", { min: 1, max: 10 }))); }
      if (kind === "steal") f.push(h("div", h("label.field", "Ampleur du vol"), sel("soc.tier", [["petit", "Petit (discret)"], ["moyen", "Moyen"], ["gros", "Gros (très risqué)"]], "petit")));
      if (kind === "duel") { const gm = (curT.games && curT.games.length ? curT.games : []).map((id) => { const d = SO.duels.find((x) => x.id === id); return [id, d.ic + " " + d.l]; }); f.push(h("div", h("label.field", "Épreuve adaptée à votre âge"), sel("soc.game", gm, gm.length ? gm[0][0] : ""))); }
      if (f.length) body.appendChild(h("div.grid2", f));
    }
    return openDetails("soc", title, body, !!kind);
  }

  // ---- onglet Professionnel ----
  const RISK_WORD = ["Sans risque", "Risque faible", "Risque moyen", "Risque élevé"];
  function proTab(st) {
    const A = st.agenda; const m = st.me; const P = A.pro;
    const cur = val("pro", "");
    const meter = (l, v, color) => h("div.pmeter", { title: l + " " + v + " sur 100" }, h("span.small", l), h("div.mini", h("i", { style: { width: v + "%", background: color } })), h("b", String(v)));
    const head = h("div.prohead",
      h("div", h("strong", P.main.ic + " " + P.main.l), P.contexts.length > 1 ? h("div.small.muted", "Aussi " + P.contexts.slice(1).map((c) => c.ic + " " + c.l.toLowerCase()).join(", ")) : null),
      h("div.pmeters", meter("Compétence", P.meters.skill, "var(--good)"), meter("Réseau", P.meters.net, "var(--navy)"), meter("Réputation", P.meters.rep, "var(--gold)"), P.meters.showHeat ? meter("Pression", P.meters.heat, "var(--bad)") : null));
    const speCard = P.spe ? h("p.small", { style: { margin: "8px 0 0" } }, P.spe.ic + " Filière " + P.spe.l.toLowerCase() + (P.spe.done ? " (terminée)" : " (année " + Math.max(1, Math.floor(P.spe.xp) + 1) + ")") + ". Elle pèse sur les offres d'emploi, les salaires et la progression de ton métier.") : null;
    const quit = m.job && !m.prison ? h("div.offer", { style: { display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", margin: "10px 0" } },
      h("div", h("strong", m.job.ic + " " + m.job.title), h("div.small.muted", "En poste depuis " + Math.max(0, m.age - m.job.since) + " an(s), " + RD.money(m.job.salary) + " par an. Tu peux partir quand tu veux, mais tu ne toucheras pas de salaire cette année.")),
      h("button.btn.bad", { type: "button", on: { click: () => { if (confirm("Quitter ton poste de " + m.job.title.toLowerCase() + " ?")) { RD.play("bad"); emit("game:quitjob"); } } } }, "🚪 Quitter mon emploi")) : null;
    const none = h("button.proj" + (!cur ? ".sel" : ""), { type: "button", on: { click: () => { RD.play("select"); setVal("pro", ""); RD.render(); } } },
      h("div.t", "⏸️ Continuer comme avant"), h("div.d", "Tu ne tentes rien de particulier côté professionnel cette année."));
    const opts = P.options.map((o) => {
      const on = cur === o.id;
      return h("button.proj" + (on ? ".sel" : "") + (o.ill ? ".ill" : ""), { type: "button", disabled: o.cost > m.cash, on: { click: () => { RD.play("select"); setVal("pro", on ? "" : o.id); RD.render(); } } },
        h("div.t", o.ic + " " + o.l), h("div.d", o.d),
        h("div.pills",
          o.step ? h("span.pill.gold", "étape") : null, o.ill ? h("span.pill.coral", "illégal") : null,
          o.cost ? h("span.pill", RD.money(o.cost)) : null,
          o.risk >= 0 ? h("span.pill", RISK_WORD[o.risk]) : null,
          o.build ? h("span.pill.good", "Construit " + o.build.toLowerCase()) : null));
    });
    return h("div",
      head, speCard,
      h("p.small.muted", { style: { margin: "8px 0" } }, "Tu peux tenter une option professionnelle cette année, en plus de ton choix de vie. Les options changent selon ton activité du moment. Les pastilles disent ce que chacune construit pour ton avenir et le risque qu'elle comporte."),
      quit,
      h("div.projects", [none].concat(opts)));
  }

  const draftState = { sent: "", build: null, round: -1, timer: null };
  function pushDraft() {
    try {
      const st = S().game;
      if (!draftState.build || !st || st.phase !== "agenda" || (st.agenda && st.agenda.ready)) return;
      const key = st.round + "|" + JSON.stringify(draftState.build());
      if (key === draftState.sent) return;
      draftState.sent = key;
      emit("game:draft", draftState.build());
    } catch (e) { /* le brouillon est un confort, jamais bloquant */ }
  }
  if (!draftState.timer) draftState.timer = setInterval(pushDraft, 1500);

  function agendaView(st) {
    const A = st.agenda; const m = st.me; const ui = S().ui;
    if (ui.round !== st.round) { ui.round = st.round; setVal("project", ""); setVal("pro", ""); ui.atab = "vie"; setVal("soc.kind", ""); setVal("soc.amount", ""); }
    if (A.ready) {
      const pending = st.players.filter((p) => p.alive && !p.ready).map((p) => p.name);
      return waitCard("Ton année est prête", pending.length ? "On attend " + pending.join(", ") + "." : "Tout le monde est prêt.");
    }
    const projects = h("div.projects", A.projects.map((p) => {
      const on = val("project", "") === p.id;
      return h("button.proj" + (on ? ".sel" : ""), { type: "button", disabled: p.cost > m.cash, on: { click: () => { RD.play("select"); setVal("project", on ? "" : p.id); RD.render(); } } },
        h("div.t", p.ic + " " + p.l), h("div.d", p.d), p.step ? h("span.pill.gold", { style: { marginTop: "4px", marginRight: "4px" } }, "étape") : null, p.cost ? h("span.pill", { style: { marginTop: "4px" } }, RD.money(p.cost)) : null);
    }));
    const buildPlan = () => {
      const plan = { project: val("project", "") || "routine", pro: (A.pro && A.pro.options.some((o) => o.id === val("pro", ""))) ? val("pro", "") : null };
      const kind = val("soc.kind", "");
      const defA = (A.social.actions || []).find((a) => a.id === kind);
      if (kind && defA) plan.social = { kind, target: Number(val("soc.target", defA.targets[0].seat)), amount: Number(val("soc.amount", 0)), rate: Number(val("soc.rate", 8)), years: Number(val("soc.years", 3)), tier: val("soc.tier", "petit"), game: val("soc.game", "") };
      return plan;
    };
    const submit = () => {
      const plan = buildPlan();
      RD.play("year");
      draftState.sent = JSON.stringify(plan);
      emit("game:agenda", plan);
    };
    // Brouillon envoyé au serveur dès qu'un choix change, pour que le chrono ne perde pas les clics non validés
    draftState.build = buildPlan; draftState.round = st.round;
    pushDraft();
    const warn = m.prison ? h("p.small", { style: { color: "var(--bad)", fontWeight: 700 } }, "Tu es en prison. Les projets sont limités à la vie derrière les barreaux.") : null;
    const modal = [];
    if (!ui.atab) ui.atab = "vie";
    const mark = (on) => (on ? " ✔" : "");
    const hasPro = !!(A.pro && (A.pro.options.length || m.job));
    if (!hasPro) ui.atab = "vie";
    const atabs = !hasPro ? null : h("div.tabs.atabs", [["vie", "🎲 Vie" + mark(!!val("project", ""))], ["pro", "💼 Professionnel" + mark(!!val("pro", "")) + (A.pro && A.pro.options.length ? " (" + A.pro.options.length + ")" : "")]].map(([k, l]) =>
      h("button" + (ui.atab === k ? ".sel" : ""), { type: "button", on: { click: () => { RD.play("click"); ui.atab = k; RD.render(); } } }, l)));
    return h("div.card",
      h("div.kicker", "Année " + (st.round + 1) + " · " + m.age + " ans"),
      h("h2", "Que fais-tu de cette année ?"),
      warn,
      h("p.small.muted", "Voici " + (A.projects.length - 1) + " idées pour ton année. Elles changent chaque année et collent à ta vie (âge, travail, couple, argent, goûts). Le mot « étape » repère une suite logique de ton parcours. Si tu ne choisis rien, ce sera une année tranquille." + (A.pro && A.pro.options.length ? " Tout ce qui fait avancer ta carrière ou rapporte de l'argent se trouve dans l'onglet Professionnel, et tu peux y faire un choix en plus de celui-ci." : "")),
      st.deadline ? RD.timerBar(st.deadline, 45000) : null,
      atabs,
      ui.atab === "pro" ? proTab(st) : h("div", projects,
        h("div", { style: { display: "grid", gap: "10px", marginTop: "14px" } }, financePanel(st), socialPanel(st))),
      h("div", { style: { marginTop: "16px", textAlign: "center" } }, h("button.btn.big", { on: { click: submit } }, "Valider mon année")),
      modal);
  }

  // ======================================================
  // RÉPONSES AUX OFFRES
  // ======================================================
  function respondView(st) {
    const offers = st.offers || [];
    if (!offers.length) {
      return waitCard("Des propositions circulent", st.waitingOffers ? "Les autres joueurs répondent aux offres." : "On passe à la suite.");
    }
    return h("div.card", h("div.kicker", "Propositions reçues"), h("h2", "On te sollicite"),
      st.deadline ? RD.timerBar(st.deadline, 30000) : null,
      h("div", { style: { display: "grid", gap: "10px" } }, offers.map((o) => h("div.offer", h("p", { style: { fontWeight: 700, fontSize: "1.05rem" } }, o.text),
        h("div.row",
          h("button.btn.good", { on: { click: () => { RD.play("good"); emit("game:respond", { id: o.id, answer: "yes" }); } } }, "Accepter"),
          o.canHalf ? h("button.btn", { on: { click: () => emit("game:respond", { id: o.id, answer: "half" }) } }, "Donner la moitié") : null,
          h("button.btn.bad", { on: { click: () => { RD.play("bad"); emit("game:respond", { id: o.id, answer: "no" }); } } }, "Refuser"))))));
  }

  // ======================================================
  // SCÈNE COLLECTIVE
  // ======================================================
  function groupView(st) {
    const g = st.group;
    if (!g) return waitCard("Scène collective", "");
    const head = h("div.scene-head", h("div.big", { style: { fontSize: "3rem", textAlign: "center" } }, g.ic), h("p.txt", g.text),
      h("div.row", g.seats.map((s) => h("span.pill" + (g.state === "choose" && s.chose ? ".good" : ""), s.name + (g.state === "choose" ? (s.chose ? " a choisi" : " réfléchit") : "")))));
    if (g.state === "choose") {
      if (!g.inside) return h("div.card", h("div.kicker", "Scène collective"), head, h("p.muted", "Tu regardes cette scène depuis les gradins."));
      const opts = g.options || [];
      return h("div.card", h("div.kicker", "Scène collective"), head, g.deadline ? RD.timerBar(g.deadline, 30000) : null,
        g.myChoice !== null && g.myChoice !== undefined ? h("p", { style: { fontWeight: 700 } }, "Choix enregistré, tu peux encore changer d'avis.") : null,
        h("div.choices", { style: { marginTop: "10px" } }, opts.map((o) => h("button.choice" + (g.myChoice === o.v ? ".sel" : ""), { disabled: !o.ok, style: g.myChoice === o.v ? { background: "var(--gold-2)" } : null, on: { click: () => { RD.play("select"); emit("game:group", { value: o.v }); } } },
          h("span.ic", o.ic), h("span.lab", o.l, h("span.sub", { style: { display: "block", fontWeight: 400, fontSize: ".82rem" } }, o.d)), o.cost ? h("span.cost", RD.money(o.cost)) : null))));
    }
    const r = g.result || {};
    return h("div.card", h("div.kicker", "Résultat"), head,
      h("div.result", h("div.out", r.line || r.public || "")),
      g.deadline ? RD.timerBar(g.deadline, 15000) : null,
      h("div", { style: { marginTop: "12px", textAlign: "center" } }, h("button.btn.big", { disabled: g.iAmReady, on: { click: () => emit("game:groupReady") } }, g.iAmReady ? "En attente des autres" : "Continuer")));
  }

  // ======================================================
  // BILAN DE L'ANNÉE
  // ======================================================
  function recapView(st) {
    const R = st.recap; const m = st.me;
    if (!R.report) {
      return h("div.card", h("h2", "Une année s'achève"), h("p", "Tu n'as pas de bilan cette année."), !m.alive ? null : h("button.btn", { on: { click: () => emit("game:recapReady") } }, "Continuer"));
    }
    const rp = R.report;
    const nums = [
      ["Revenus", RD.money(rp.income), ""], ["Dépenses", RD.money(-rp.expenses), ""],
      ["Impôts déjà retirés", RD.money(rp.tax || 0), ""],
      ["Placements", (rp.assetDelta >= 0 ? "+" : "") + RD.money(rp.assetDelta), rp.assetDelta >= 0 ? ".pos" : ".neg"],
      ["Patrimoine", RD.money(rp.netAfter), rp.netAfter >= rp.netBefore ? ".pos" : ".neg"],
    ];
    const stats = Object.keys(rp.stats).map((k) => ({ k, v: rp.stats[k] })).filter((s) => s.v.d !== 0);
    const meta = S().meta.stats;
    return h("div.card",
      h("div.kicker", "Bilan"), h("h2", "Tes " + rp.age + " ans"),
      h("div.rep-nums", nums.map(([l, v, c]) => h("div.num" + c, h("span.small", l), h("b", v)))),
      rp.lines.length ? h("div", rp.lines.map((l) => h("div.rep-line", l))) : null,
      rp.flashes.length ? h("div", { style: { marginTop: "8px" } }, h("h4", "Dans les journaux"), rp.flashes.map((f) => h("div.rep-line", f.ic + " " + f.t))) : null,
      stats.length ? h("div.chips", { style: { marginTop: "10px" } }, stats.map((s) => h("span.chip." + (s.v.d > 0 ? "up" : "down"), meta[s.k].ic + " " + meta[s.k].l + " " + RD.signed(s.v.d)))) : null,
      st.deadline ? RD.timerBar(st.deadline, 20000) : null,
      h("div", { style: { marginTop: "14px", textAlign: "center" } }, m.alive ? h("button.btn.big", { disabled: R.ready, on: { click: () => { RD.play("year"); emit("game:recapReady"); } } }, R.ready ? "En attente des autres" : "Année suivante") : null));
  }

  // ======================================================
  // SPECTATEUR (mort)
  // ======================================================
  function spectatorView(st) {
    const m = st.me; const d = m.deathInfo || {};
    const alive = st.players.filter((p) => p.alive);
    const series = [{ name: m.name, color: m.avatar.color, points: m.history }];
    return h("div.card.deathcard",
      h("div.stone", "🪦"), h("h2", m.name),
      h("p", (m.gender === "f" ? "Morte" : "Mort") + " à " + (d.age || m.age) + " ans, " + (d.cause || "")),
      h("p", "Fortune finale ", h("b", RD.money(d.net !== undefined ? d.net : m.net))),
      m.history.length > 1 ? h("div", { style: { background: "#fff", borderRadius: "12px", padding: "4px" } }, RD.wealthChart(series, { height: 220 })) : null,
      h("p.small", { style: { marginTop: "10px" } }, alive.length ? "La partie continue pour " + alive.map((p) => p.name).join(", ") + ". Tu peux regarder, discuter, et surveiller ton héritage." : "La partie est sur le point de se terminer."));
  }

  // ======================================================
  // ASSEMBLAGE
  // ======================================================
  function stageFor(st) {
    const m = st.me;
    if (!m.alive && !(st.scene)) return spectatorView(st);
    if (st.scene && (st.phase === "event" || !m.alive || st.scene.state === "result")) return sceneView(st);
    switch (st.phase) {
      case "agenda": return agendaView(st);
      case "respond": return respondView(st);
      case "group": return groupView(st);
      case "mini": return RD.miniView(st);
      case "event": {
        const others = st.players.filter((p) => p.alive && !p.ready && !p.you).map((p) => p.name);
        return waitCard("Tu as vécu ta part de l'année", others.length ? "On attend " + others.join(", ") + "." : "Le bilan arrive.");
      }
      case "recap": return recapView(st);
      default: return waitCard("Un instant", "");
    }
  }

  RD.renderGame = function (root, fresh) {
    const st = S().game; const room = S().room; const ui = S().ui;
    clear(root);
    const isHost = room && room.players.find((p) => p.you && room.hostId === p.id);
    const grid = h("div.game-grid" + (ui.mob === "moi" ? ".show-me" : ui.mob === "autres" ? ".show-others" : ""),
      h("div.col.left", h("div.sticky", meCard(st))),
      h("div.stage", stageFor(st)),
      h("div.col.right", playersPanel(st), rightTabs(st)));
    root.appendChild(h("div.screen",
      h("div.topbar", h("div.in",
        h("div.logo", "RICHISSIME", h("small", "DESTINY")),
        h("div.yearbadge", "Année " + (st.round + 1) + " · " + st.me.age + " ans"),
        h("div.phasebadge", PHASE_LABEL[st.phase] || ""),
        h("div.grow"),
        isHost && st.phase !== "over" ? h("button.btn.small.light" + (st.turbo === "on" ? ".sel" : ""), { title: "Fait avancer les étapes automatiquement (choix au hasard). S'arrête tout seul avant le vote.", disabled: st.turbo === "on", on: { click: () => emit("host:turbo", { on: true }) } }, st.turbo === "on" ? "⏩ Accélération en cours" : st.turbo === "stop" ? "⏩ Reprendre l'accélération" : "⏩ Accélérer") : null,
        isHost && st.phase !== "over" ? h("button.btn.small.light", { title: "L'accélération s'arrête à la fin de l'année en cours", disabled: !st.turbo || st.turbo === "off", on: { click: () => emit("host:turbo", { on: false }) } }, st.turbo === "stop" ? "⏹ Arrêt à la fin de l'année" : "⏹ Arrêter d'accélérer") : null,
        h("button.iconbtn", { title: RD.sound.on ? "Couper le son" : "Activer le son", "aria-label": "son", on: { click: () => { RD.setSound(!RD.sound.on); RD.render(); } } }, RD.sound.on ? "🔊" : "🔇"),
        h("button.iconbtn", { title: "Quitter la partie", "aria-label": "quitter", on: { click: () => { if (confirm("Quitter la partie ? Un pilote automatique prendra ta place.")) RD.leaveRoom(); } } }, "🚪"))),
      h("div.wrap", grid),
      h("div.mobilebar", [["jeu", "🎲 Jeu"], ["moi", "🙂 Moi"], ["autres", "👥 Autres"]].map(([k, l]) => h("button" + (ui.mob === k ? ".sel" : ""), { on: { click: () => { ui.mob = k; RD.render(); window.scrollTo(0, 0); } } }, l)))));
  };

  // ======================================================
  // SONS SELON L'ÉVOLUTION DE L'ÉTAT
  // ======================================================
  RD.onGameState = function (prev, st) {
    if (!prev) return;
    if (st.round !== prev.round && st.phase === "agenda") RD.play("year");
    const a = prev.scene, b = st.scene;
    if (b && b.state === "result" && (!a || a.state !== "result" || a.id !== b.id)) {
      const ups = b.result.chips.filter((c) => (c.bad ? c.d < 0 : c.d > 0) || (c.t && !c.bad)).length;
      const downs = b.result.chips.filter((c) => (c.bad ? c.d > 0 : c.d < 0) || (c.t && c.bad)).length;
      RD.play(b.result.death ? "death" : ups > downs ? "good" : downs > ups ? "bad" : "click");
    }
    if (st.offers && st.offers.length && !(prev.offers && prev.offers.length)) RD.play("coin");
  };

  // ======================================================
  // FIN DE PARTIE
  // ======================================================
  RD.renderEnd = function (root) {
    const st = S().game; const room = S().room; const F = st.final;
    const isHost = room && room.players.find((p) => p.you && room.hostId === p.id);
    clear(root);
    const order = [1, 0, 2];
    const top = F.ranking.slice(0, 3);
    const pods = (top.length === 3 ? order : top.map((_, i) => i)).map((i) => top[i]).filter(Boolean);
    const vote = F.mode === "vote";
    const podium = h("div.podium", pods.map((r) => h("div.pod" + (r.rank === 1 ? ".first" : r.rank === 2 ? ".second" : r.rank === 3 ? ".third" : ".other"),
      h("div.rk", r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : "🥉"), RD.avatar(r.avatar, 52), h("div.nm", r.name), vote ? h("div.net", r.avg === null ? "sans note" : RD.fmtAvg(r.avg) + " sur 10") : h("div.net", RD.money(r.net)), h("div.small.muted", vote ? RD.money(r.net) : r.tier), h("div.small", r.age + " ans"))));
    const series = F.histories.map((x) => ({ name: x.name, color: x.avatar.color, points: x.points, dead: true }));
    const mine = F.ranking.find((r) => r.seat === st.seat);
    if (!S().ui.fanfared) { S().ui.fanfared = true; RD.play("fanfare"); }
    root.appendChild(h("div.screen",
      h("div.topbar", h("div.in", h("div.logo", "RICHISSIME", h("small", "DESTINY")), h("div.grow"),
        h("button.iconbtn", { "aria-label": "son", on: { click: () => { RD.setSound(!RD.sound.on); RD.render(); } } }, RD.sound.on ? "🔊" : "🔇"))),
      h("div.wrap",
        h("div.center", h("div.ribbon", "Fin de la partie"), h("h1", { style: { fontSize: "clamp(2rem,6vw,3.6rem)" } }, F.ranking.length > 1 ? F.ranking[0].name + " remporte la partie" : "Le rideau tombe"),
          mine ? (vote ? h("p", "Tu termines ", h("b", "n° " + mine.rank), mine.avg === null ? "" : [" avec une moyenne de ", h("b", RD.fmtAvg(mine.avg) + " sur 10")], ".") : h("p", "Tu termines ", h("b", "n° " + mine.rank), " avec ", h("b", RD.money(mine.net)), ".")) : null),
        podium,
        h("div.card", h("h3", vote ? "Classement du vote" : "Classement final"),
          h("div.list", F.ranking.map((r) => h("div.item", h("b", r.rank + "."), RD.avatar(r.avatar, 34), h("div.main", h("b", r.name), h("div.sub", (r.survivor ? "Encore en vie" : "Mort") + " à " + r.age + " ans · " + (r.survivor ? "la partie s'arrête là" : r.cause) + (r.status ? " · " + r.status : "")), r.life ? h("div.sub", { style: { fontStyle: "italic" } }, r.life.text) : null), vote ? h("div", { style: { textAlign: "right" } }, h("b", r.avg === null ? "sans note" : RD.fmtAvg(r.avg) + " sur 10"), h("div.small.muted", RD.money(r.net))) : h("b", RD.money(r.net)))))),
        vote ? RD.voteResults(F) : null,
        h("div.card", { style: { marginTop: "14px" } }, h("h3", "La fortune au fil des années"), RD.wealthChart(series, { height: 360 }), RD.legend(series)),
        h("div.card", { style: { marginTop: "14px" } }, h("h3", "Les trophées"), F.awards.length ? h("div.awards", F.awards.map((a) => h("div.award", h("span.ic", a.ic), h("div", h("b", a.l), h("div.small.muted", a.name + " · " + a.d))))) : h("p.muted", "Pas de trophée cette fois.")),
        h("div", { style: { marginTop: "14px" } }, h("h3", "Les pierres tombales"), h("div.tombs", F.ranking.map((r) => h("div.tomb", h("div.rip", "REPOSE EN PAIX"), RD.avatar(r.avatar, 48), h("div.nm", r.name), h("div.small", r.age + " ans"), h("div.small", r.survivor ? "Arrêté en pleine forme" : r.cause), h("b", RD.money(r.net)))))),
        h("div.center", { style: { margin: "24px 0" } },
          isHost ? h("button.btn.big", { on: { click: () => emit("room:backToLobby") } }, "Rejouer avec le même groupe") : h("p.muted", "L'hôte peut relancer une partie."),
          " ", h("button.btn.light", { on: { click: () => RD.leaveRoom() } }, "Quitter")))));
  };
})();
