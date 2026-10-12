// Accueil, salon, création du personnage et réglages
(function () {
  const RD = window.RD;
  const { h, clear, $ } = RD;
  const S = () => RD.S;

  function val(k, d) { const v = S().ui.vals[k]; return v === undefined ? d : v; }
  function bindInput(k, node, onChange) {
    node.dataset.k = k;
    node.addEventListener("input", () => { S().ui.vals[k] = node.value; onChange && onChange(node.value); });
    return node;
  }

  function topbar(right) {
    return h("div.topbar", h("div.in",
      h("div.logo", "RICHISSIME", h("small", "DESTINY")),
      h("div.grow"), right));
  }

  // ======================================================
  // ACCUEIL
  // ======================================================
  RD.renderHome = function (root) {
    clear(root);
    const nameDef = RD.store.get("name", "");
    const nameIn = bindInput("home.name", h("input", { type: "text", maxlength: 16, placeholder: "Ton prénom", value: val("home.name", nameDef), autocomplete: "nickname" }));
    const codeIn = bindInput("home.code", h("input", { type: "text", maxlength: 4, placeholder: "ABCD", value: val("home.code", S().ui.joinCode || ""), style: { textTransform: "uppercase", letterSpacing: ".3em", textAlign: "center", fontWeight: 700 }, autocapitalize: "characters" }));
    const go = (ev) => {
      const nm = nameIn.value.trim();
      if (!nm) { RD.toast("Dis-nous comment tu t'appelles !", "error"); nameIn.focus(); return; }
      RD.store.set("name", nm);
      RD.play("select");
      if (ev === "room:create") RD.emit("room:create", { name: nm, token: S().token || undefined });
      else {
        const c = codeIn.value.trim().toUpperCase();
        if (c.length !== 4) { RD.toast("Le code du salon fait 4 lettres.", "error"); codeIn.focus(); return; }
        RD.emit("room:join", { code: c, name: nm, token: undefined });
      }
    };
    root.appendChild(h("div.screen",
      h("div.wrap",
        h("div.hero",
          h("div.coins", "💰 🎩 💎"),
          h("div.ribbon", "1 à 6 joueurs en ligne, ou tout seul"),
          h("h1", "Richissime ", h("span", "Destiny")),
          h("p.tag", "Vis une vie entière, une année à la fois, du CP jusqu'à la tombe. Les choix, les rencontres, les catastrophes, les coups de chance. À la fin, une seule question compte, qui a fini le plus riche ?")),
        h("div.home-grid",
          h("div.card",
            h("h3", "Créer une partie"),
            h("p.muted.small", "Tu seras l'hôte. Tu pourras régler la partie, inviter jusqu'à 5 amis, ajouter des joueurs automatiques ou jouer tout seul."),
            h("label.field", "Ton prénom"), nameIn,
            h("div", { style: { marginTop: "14px" } }, h("button.btn.big", { on: { click: () => go("room:create") } }, "Créer le salon"))),
          h("div.card",
            h("h3", "Rejoindre des amis"),
            h("p.muted.small", "Demande le code à quatre lettres à l'hôte, ou ouvre directement son lien d'invitation."),
            h("label.field", "Code du salon"), codeIn,
            h("div", { style: { marginTop: "14px" } }, h("button.btn.navy.big", { on: { click: () => go("room:join") } }, "Rejoindre")))),
        h("div.howto",
          [["1", "Même départ pour tous", "Tout le monde entre dans la même classe à 6, 7 ou 8 ans, avec un petit don de naissance."],
           ["2", "Une année par tour", "Chaque année, tu choisis un projet de vie, tu gères ton argent, puis tu vis tes événements."],
           ["3", "Des choix qui comptent", "Études, métier, amour, famille, magouilles. Chaque décision laisse des traces."],
           ["4", "Entre joueurs", "Prêts, mariages, sociétés, coups bas, enchères, braquages. Qui coopère, qui trahit ?"],
           ["5", "Tous mortels", "On meurt chacun son tour. Les héritages comptent. Celui qui finit le plus riche gagne."]]
            .map(([n, t, d]) => h("div.card.flat", h("div.n", n), h("h4", t), h("p.small", d)))),
        h("div.footer", S().meta ? S().meta.scenes + " scènes de vie, des centaines de rebondissements, aucune partie identique." : ""))));
  };

  // ======================================================
  // SALON
  // ======================================================
  function settingsPanel(room, isHost) {
    const cur = room.settings;
    const box = h("div");
    S().meta.schema.forEach((cat) => {
      const c = h("div.setcat", h("h4", cat.category));
      cat.items.forEach((it) => {
        const row = h("div.setting", h("div.lab", it.label), h("div.info", it.info));
        if (it.type === "bool") {
          const on = !!cur[it.id];
          row.appendChild(h("div.switch",
            h("button" + (on ? ".on" : ""), { type: "button", disabled: !isHost, "aria-pressed": on, "aria-label": it.label, on: { click: () => { RD.play("click"); RD.emit("room:settings", { settings: { [it.id]: !on } }); } } }),
            h("span.small", on ? "Activé" : "Désactivé")));
        } else {
          row.appendChild(h("div.opts", it.options.map((o) =>
            h("button.opt" + (String(cur[it.id]) === o.value ? ".sel" : ""), { type: "button", disabled: !isHost, on: { click: () => { RD.play("click"); RD.emit("room:settings", { settings: { [it.id]: o.value } }); } } },
              h("div.t", o.icon + " " + o.label), h("div.d", o.desc)))));
        }
        c.appendChild(row);
      });
      box.appendChild(c);
    });
    return box;
  }

  function charCard(me) {
    const meta = S().meta;
    const nameIn = bindInput("char.name", h("input", { type: "text", maxlength: 16, value: val("char.name", me.name) }), (v) => {
      clearTimeout(RD._nameT); RD._nameT = setTimeout(() => { RD.store.set("name", v.trim()); RD.emit("room:char", { name: v }); }, 350);
    });
    const av = me.avatar;
    return h("div.card",
      h("div.row", RD.avatar(av, 64), h("div.grow", h("h3", { style: { margin: 0 } }, "Ton personnage"), h("div.small.muted", "Tu vivras sa vie, de l'enfance à la mort."))),
      h("label.field", "Prénom"), nameIn,
      h("label.field", "Tu es"),
      h("div.seg", ["f", "m"].map((g) => h("button" + (me.gender === g ? ".sel" : ""), { type: "button", on: { click: () => RD.emit("room:char", { gender: g }) } }, g === "f" ? "Une fille" : "Un garçon"))),
      h("label.field", "Accessoire"),
      h("div.accgrid", meta.accessories.map((a) => h("button" + (av.acc === a ? ".sel" : ""), { type: "button", "aria-label": "accessoire " + a, on: { click: () => RD.emit("room:char", { avatar: { acc: a, color: av.color } }) } }, a))),
      h("label.field", "Couleur"),
      h("div.swatches", meta.colors.map((c) => h("button" + (av.color === c ? ".sel" : ""), { type: "button", "aria-label": "couleur", style: { background: c }, on: { click: () => RD.emit("room:char", { avatar: { acc: av.acc, color: c } }) } }))),
      h("label.field", "Ton don de naissance"),
      h("div.giftgrid", meta.gifts.map((g) => h("button.gift" + (me.gift === g.id ? ".sel" : ""), { type: "button", on: { click: () => { RD.play("select"); RD.emit("room:char", { gift: g.id }); } } }, h("b", g.ic + " " + g.l), h("span", g.d)))));
  }

  RD.renderLobby = function (root) {
    const room = S().room;
    const me = room.players.find((p) => p.you);
    const isHost = me && room.hostId === me.id;
    clear(root);
    const link = location.origin + location.pathname + "?room=" + room.code;
    const copy = () => { try { navigator.clipboard.writeText(link); RD.toast("Lien d'invitation copié !", "info"); } catch (e) { RD.toast(link, "info"); } };
    const plist = h("div.plist", room.players.map((p) => h("div.prow" + (p.you ? ".you" : ""),
      RD.avatar(p.avatar, 38),
      h("div.nm", p.name, p.bot ? h("span.pill.navy", { style: { marginLeft: "6px" } }, "auto") : null, room.hostId === p.id ? h("span.pill.gold", { style: { marginLeft: "6px" } }, "hôte") : null),
      p.bot ? null : h("span", { title: p.connected ? "connecté" : "déconnecté" }, h("span.dot" + (p.connected ? ".on" : ".off"))),
      !p.bot && !p.ready ? h("span.pill", "pas prêt") : h("span.pill.good", "prêt"),
      isHost && !p.you ? h("button.btn.small.light", { "aria-label": "retirer " + p.name, on: { click: () => RD.emit(p.bot ? "room:removeBot" : "room:kick", { id: p.id }) } }, "✕") : null)));
    const startBtn = isHost
      ? h("button.btn.big", { on: { click: () => { RD.play("fanfare"); RD.emit("room:start"); } } }, room.players.length === 1 ? "Commencer ma vie (solo)" : "Lancer la partie")
      : h("button.btn.big" + (me.ready ? ".light" : ""), { on: { click: () => { RD.play("click"); RD.emit("room:ready", { ready: !me.ready }); } } }, me.ready ? "Je ne suis plus prêt" : "Je suis prêt");
    root.appendChild(h("div.screen",
      topbar(h("button.btn.small.light", { on: { click: () => RD.leaveRoom() } }, "Quitter le salon")),
      h("div.wrap",
        h("div.lobby-grid",
          h("div.col",
            h("div.card.codebox", h("div.kicker", "Code du salon"), h("div.code", { title: "Copier le lien", on: { click: copy } }, room.code), h("button.btn.small.light", { on: { click: copy } }, "Copier le lien d'invitation")),
            h("div.card", h("h3", "Les joueurs (" + room.players.length + " sur " + S().meta.maxPlayers + ")"), plist,
              isHost ? h("div", { style: { marginTop: "10px" } }, h("button.btn.small.navy", { disabled: room.players.length >= S().meta.maxPlayers, on: { click: () => RD.emit("room:addBot") } }, "+ Joueur automatique")) : null,
              h("p.small.muted", { style: { marginTop: "8px" } }, "Les joueurs automatiques vivent leur vie tout seuls. Tu peux aussi jouer sans personne d'autre.")),
            me ? charCard(me) : null,
            h("div", startBtn)),
          h("div.card", h("h2", "Réglages de la partie"),
            h("p.small.muted", isHost ? "Tu es l'hôte, tout est réglable. Chaque option est expliquée juste en dessous." : "Seul l'hôte peut changer les réglages. Tu peux les consulter."),
            settingsPanel(room, isHost))))));
  };
})();
