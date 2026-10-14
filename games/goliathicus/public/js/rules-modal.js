// ============================================================
// Fenêtre « Comment jouer ? » (générée depuis le contenu du jeu)
// ============================================================
(function () {
  const { $, el } = UI;
  const { PIECES, ORDER, HOUSES, CHAOS_EVENTS } = GoliathPieces;

  function section(title, children) {
    return el("section", { class: "rules__sec" }, [el("h3", { text: title })].concat(children));
  }
  function p(text) { return el("p", { html: text }); }

  function build() {
    const body = $("#rules-body");
    body.innerHTML = "";
    body.appendChild(section("🎯 Le but du jeu", [
      p("Chaque joueur dirige une armée posée <b>face cachée</b> dans son camp. Tu vois où sont les pièces adverses, mais pas ce qu'elles sont ! Ton objectif en mode classique est de <b>croquer l'Œuf de Dragon 🥚</b> d'un adversaire, bien caché parmi ses pièces."),
      p("Le dernier joueur (ou la dernière équipe) en lice remporte la bataille."),
    ]));
    body.appendChild(section("🎮 Comment se déroule une partie", [
      p("<b>1. Placement.</b> Clique sur une de tes pièces puis sur une autre case de ton camp pour les échanger. Tu peux aussi laisser le hasard faire, ou choisir une disposition défensive ou offensive. Quand tu es content, clique sur « Prêt »."),
      p("<b>2. Ton tour.</b> Clique sur une de tes pièces et les cases où elle peut aller s'allument. Un point vert = déplacement, un anneau rouge = attaque. Chaque tour, tu déplaces <b>une seule pièce</b> d'une case, dans les quatre directions."),
      p("<b>3. Combat.</b> Si tu avances sur une pièce ennemie, les deux se dévoilent. La plus haute valeur gagne et l'autre est éliminée. À égalité, les deux disparaissent."),
    ]));

    const grid = el("div", { class: "rules__pieces" });
    ORDER.forEach((id) => {
      const d = PIECES[id];
      grid.appendChild(el("div", { class: "rule-piece" }, [
        el("div", { class: "rule-piece__icon", text: d.icon }),
        el("div", { class: "rule-piece__txt" }, [
          el("b", { text: d.name }),
          el("span", { class: "rule-piece__rank", text: d.bomb ? "Piège" : d.id === "oeuf" ? "Cible" : "Force " + d.rank }),
          el("small", { text: d.desc }),
        ]),
      ]));
    });
    const ladder = el("div", { class: "ladder" });
    ORDER.filter((id) => PIECES[id].mobile && !PIECES[id].special).forEach((id, k, arr) => {
      const d = PIECES[id];
      ladder.appendChild(el("span", { class: "ladder__step", title: d.name }, [el("i", { text: d.icon }), el("b", { text: String(d.rank) })]));
      if (k < arr.length - 1) ladder.appendChild(el("span", { class: "ladder__sep", text: "›" }));
    });
    body.appendChild(section("🧩 Les pièces", [p("Plus la force est grande, plus la pièce est puissante. Le 10 est le meilleur. Le chiffre est écrit sur chaque pièce quand tu la vois."), ladder, grid]));

    body.appendChild(section("🌍 Le terrain", [
      p("💧 <b>Lac</b>, infranchissable. 🌲 <b>Forêt</b>, si le défenseur y gagne un combat, il reste caché. 🟤 <b>Marais</b>, une pièce qui s'y arrête s'endort un tour. 🪨 <b>Ruines</b>, infranchissables, ce sont les restes d'un camp éliminé. 🏆 <b>Reliques</b>, en mode Conquête, chaque relique tenue au début de ton tour rapporte un point."),
    ]));

    body.appendChild(section("🛡️ Les modes de jeu", [
      p("<b>Classique</b>, croque l'Œuf. <b>Conquête</b>, tiens les reliques et atteins l'objectif de points. <b>Chasse au roi</b>, pas d'œuf, la partie est perdue quand ton Roi tombe (un duel de deux rois est gagné par l'attaquant)."),
      p("En plus, il y a les <b>Équipes</b> 2 contre 2, le <b>Brouillard</b> (tu ne vois que près de tes pièces), <b>Chaos</b> (événements surprise), et <b>Express</b> (petit plateau, 10 minutes)."),
      p("<b>Composition sur mesure</b>, chaque joueur fabrique sa propre armée avec le même budget, sans limite de temps, avant le placement. La composition adverse reste secrète sauf si l'hôte choisit de la dévoiler."),
    ]));

    const houses = el("div", { class: "rules__houses" });
    HOUSES.forEach((h) => {
      houses.appendChild(el("div", { class: "rule-house", style: { "--hc": h.color, "--hd": h.dark } }, [
        el("div", { class: "rule-house__crest", text: h.icon }),
        el("div", {}, [el("b", { text: h.name }), el("div", { text: h.power.icon + " " + h.power.name }), el("small", { text: h.power.desc })]),
      ]));
    });
    body.appendChild(section("✨ Les maisons et leurs pouvoirs", [p("Chaque maison dispose d'un pouvoir à usage limité, à déclencher pendant ton tour avant de te déplacer."), houses]));

    const chaos = el("ul", { class: "rules__list" });
    Object.keys(CHAOS_EVENTS).forEach((k) => chaos.appendChild(el("li", { text: CHAOS_EVENTS[k].icon + " " + CHAOS_EVENTS[k].name + " — " + CHAOS_EVENTS[k].text })));
    body.appendChild(section("🎲 Événements du mode Chaos", [chaos]));

    body.appendChild(section("💡 Petits conseils", [
      el("ul", { class: "rules__list" }, [
        el("li", { text: "Un Lutin Éclaireur lancé sur une pièce inconnue coûte peu et t'apprend beaucoup." }),
        el("li", { text: "Une pièce qui n'a jamais bougé est peut-être une tarte piégée ou l'Œuf. Garde un Nain Démineur pour elles." }),
        el("li", { text: "Ton Roi est imbattable... sauf par un Rat Espion, même quand c'est ton Roi qui attaque. Méfie-toi des rats !" }),
        el("li", { text: "Une même pièce ne peut pas faire plus de 3 déplacements d'affilée entre deux mêmes cases." }),
      ]),
    ]));
  }

  function open() { build(); $("#rules-overlay").classList.remove("hidden"); }
  function close() { $("#rules-overlay").classList.add("hidden"); }

  document.addEventListener("DOMContentLoaded", () => {
    $("#btn-rules-close").addEventListener("click", close);
    $("#rules-overlay").addEventListener("click", (e) => { if (e.target.id === "rules-overlay") close(); });
  });
  window.RulesModal = { open, close };
})();
