// Fichier regroupé. Réactions, classiques, alliances.
// ---------- 55_reactions ----------
{
// Réactions. Quand on a été volé, calomnié ou trompé, on peut répondre l'année suivante, mais pas à chaque fois.
// Quand on a perdu une partie, on peut proposer une revanche, double ou rien.
const { reg } = require("../socialkit");

const fresh = (g, A, B) => (g.grievances || []).find((x) => x.v === A.seat && x.c === B.seat && x.round === g.round - 1 && !x.used);
const lost = (g, A, B) => (g.lostGames || []).find((x) => x.loser === A.seat && x.winner === B.seat && x.round === g.round - 1 && !x.used);
const gate = (g, A, B, pct) => ((g.round * 7 + A.seat * 3 + B.seat * 5) % 10) < pct;
const GAMES = { course: "la course", quiz: "le quiz", charme: "le concours de charme", blackjack: "le blackjack", echecs: "les échecs", petanque: "la pétanque", cartes: "les cartes" };

reg({ id: "porter_plainte", grp: "reaction", ic: "⚖️", l: "Porter plainte", mode: "direct", ages: [14, 110], w: 30, cool: 0, coolPair: 0,
  d: (A, g) => "On t'a fait du tort l'an dernier. Tu peux saisir la justice, avec des chances variables de gagner. Si tu perds, tu as perdu ton temps.",
  ok: (g, A, B) => !!fresh(g, A, B) && gate(g, A, B, 7), fit: () => 3,
  direct: [
    { w: (g, A, B) => Math.max(0.2, Math.min(0.8, 0.5 + (A.stats.intel - B.stats.intel) / 250 + (A.stats.repute - B.stats.repute) / 300)), special: "plainte_ok",
      a: { bonheur: 6, repute: 2 }, b: { repute: -10, bonheur: -5 },
      ta: "Tu portes plainte contre $B. L'enquête tient la route et le juge te donne raison. Tu ressors du tribunal la tête haute.", tb: "$A t'a traîné(e) devant la justice et tu as perdu. Le jugement fait le tour de la ville.", bond: { riv: 8 }, news: "⚖️ $A a gagné son procès contre $B." },
    { w: (g, A, B) => 1 - Math.max(0.2, Math.min(0.8, 0.5 + (A.stats.intel - B.stats.intel) / 250 + (A.stats.repute - B.stats.repute) / 300)), special: "plainte_ko",
      a: { bonheur: -4 }, b: { bonheur: 1 },
      ta: "Ta plainte contre $B est classée sans suite, faute de preuves. Tu as payé un avocat pour rien.", tb: "$A a porté plainte contre toi, qui a été classée sans suite. Tu te contentes de hausser les épaules.", bond: { riv: 6 } },
  ] });

reg({ id: "demenir_rumeur", grp: "reaction", ic: "📣", l: "Démentir publiquement", mode: "direct", ages: [12, 110], w: 20, cool: 0, coolPair: 0,
  d: "Une rumeur t'a visé. Tu prends la parole devant tout le monde pour rétablir les faits.",
  ok: (g, A, B) => { const x = fresh(g, A, B); return !!x && (x.kind === "rumor" || x.kind === "denounce") && gate(g, A, B, 8); }, fit: () => 2.5,
  direct: [
    { w: 0.65, a: { repute: 9, bonheur: 4 }, b: { repute: -5 }, ta: "Ton démenti est limpide et ton adversaire n'a rien à répondre. Les gens te croient à nouveau.", tb: "$A prend la parole et ruine la rumeur que tu avais lancée. Tu passes pour un(e) menteur(se).", bond: { riv: 6 }, special: "plainte_ko" },
    { w: 0.35, a: { repute: -3, bonheur: -3 }, b: { repute: 1 }, ta: "Ton démenti sonne faux, et chacun y voit un aveu. La rumeur continue sa route.", tb: "Le démenti de $A est si maladroit qu'il te rend service.", bond: { riv: 4 }, special: "plainte_ko" },
  ] });

reg({ id: "revanche", grp: "reaction", ic: "🔁", l: "Demander une revanche", mode: "offer", ages: [8, 110], w: 30, cool: 0, coolPair: 0,
  d: (A, g) => "Tu as perdu la dernière fois. Tu proposes une revanche, double ou rien.",
  ask: "$A veut sa revanche, double ou rien.",
  ok: (g, A, B) => !!lost(g, A, B) && gate(g, A, B, 6), fit: () => 3,
  no: { ta: "$B refuse la revanche, en disant qu'il vaut mieux rester sur une victoire.", bond: { aff: -1, riv: 3 } },
  yes: [{ w: 1, special: "revanche", ta: "Tu acceptes la revanche avec $B.", tb: "$A obtient sa revanche.", bond: { riv: 3, aff: 1 } }] });
}

// ---------- 60_classiques ----------
{
// Actions de base, gérées par social.js (argent, couple, mariage, entreprise, vol, rumeur, dénonciation, défi).
// Elles sont proposées selon l'âge, le couple et les liens, comme toutes les autres.
const { reg, bond, single, coupleWith, married } = require("../socialkit");

reg({ id: "gift", legacy: true, grp: "argent", ic: "🎁", l: "Faire un cadeau", d: "Tu offres de l'argent. Pas besoin de réponse.", mode: "direct", ui: "amount",
  ages: [10, 120], w: 6, cool: 1, coolPair: 2 });

reg({ id: "loan", legacy: true, grp: "argent", ic: "🏦", l: "Prêter de l'argent", d: "Avec intérêts, remboursable dans quelques années.", ui: "loan",
  ages: [16, 120], w: 5, cool: 2, coolPair: 3, ok: (g, A) => A.cash >= 1000 });

reg({ id: "ask", legacy: true, grp: "argent", ic: "🙏", l: "Demander de l'aide", d: "Tu demandes de l'argent. À l'autre de décider, entièrement ou à moitié.", ui: "amount",
  ages: [12, 120], w: 5, cool: 2, coolPair: 3, fit: (g, A) => (A.cash < 3000 || A.debt > 0 ? 1.6 : 0.5) });

reg({ id: "couple", legacy: true, grp: "coeur", ic: "💘", l: "Sortir ensemble", d: "Vous deviendrez un couple, avec dépenses partagées et un petit plus de bonheur. Une rupture est toujours possible.",
  ages: [15, 100], w: 8, cool: 2, coolPair: 2, prio: 1, ok: (g, A, B, b) => single(A) && single(B) && Math.abs(A.age - B.age) <= 25 && (b.aff >= 14 || !!b.tags.crush),
  fit: (g, A, B, b) => (b.tags.crush ? 3 : b.aff >= 30 ? 1.5 : 0.8) * (Math.abs(A.age - B.age) <= 8 ? 1 : 0.4) });

reg({ id: "marry", legacy: true, grp: "coeur", ic: "💍", l: "Demander en mariage", d: "Il faut déjà être en couple. Le mariage lie vos fortunes en cas de décès ou de divorce.",
  ages: [18, 120], w: 12, cool: 1, coolPair: 2, prio: 2, ok: (g, A, B, b) => !!(A.partner && A.partner.player === B.seat && A.partner.status === "couple") && (g.round - (b.tags.couple !== undefined ? b.tags.couple : g.round - 1)) >= 1 });

reg({ id: "company", legacy: true, grp: "argent", ic: "🤝", l: "Fonder une entreprise", d: "Chacun investit la même somme dans une société à parts égales.", ui: "amount",
  ages: [18, 80], w: 5, cool: 3, coolPair: 4, ok: (g, A, B) => A.cash >= 3000 && !A.retired, fit: (g, A, B, b) => (b.aff >= 20 ? 1.3 : 0.6) });

reg({ id: "steal", legacy: true, grp: "coup_bas", ic: "🦹", l: "Voler", d: "Tu piques de l'argent. Risque d'être attrapé(e).", hostile: true, mode: "direct", ui: "tier",
  ages: [10, 80], w: 4, cool: 2, coolPair: 2, ok: (g, A, B, b) => b.aff < 60 });

reg({ id: "rumor", legacy: true, grp: "coup_bas", ic: "🗣️", l: "Répandre une rumeur", d: "Tu salis sa réputation. Si c'est découvert, ça se retourne contre toi.", hostile: true, mode: "direct",
  ages: [12, 100], w: 5, cool: 2, coolPair: 2, ok: (g, A, B, b) => b.aff < 70 });

reg({ id: "denounce", legacy: true, grp: "coup_bas", ic: "📢", l: "Dénoncer", d: "Tu signales ses casseroles à la police. Si c'est faux, ça te coûte cher.", hostile: true, mode: "direct",
  ages: [18, 100], w: 3, cool: 3, coolPair: 3, ok: (g, A, B, b) => b.riv >= 10 || !!b.tags.ex });

reg({ id: "duel", legacy: true, grp: "jeu", ic: "⚔️", l: "Lancer un défi", d: "Un pari d'argent sur une épreuve adaptée à votre âge à tous les deux.", ui: "game",
  ages: [8, 110], w: 6, cool: 1, coolPair: 2,
  fit: (g, A, B) => (Math.max(A.age, B.age) >= 55 ? 0.5 : Math.max(A.age, B.age) >= 40 ? 0.7 : 1.2),
  label: (A) => (A.age < 14 ? "Défier à la récré" : A.age >= 55 ? "Proposer une partie" : A.age >= 40 ? "Proposer un pari amical" : "Lancer un défi") });
}

// ---------- 75_alliances ----------
{
// Les liens positifs qui comptent pour de vrai. Alliances, secours financier, carnet d'adresses, financement d'un projet.
const { reg } = require("../socialkit");

reg({ id: "pacte_alliance", grp: "amitie", ic: "🤝", l: "Sceller une alliance", mode: "offer", ages: [14, 100], w: 6, cool: 4, coolPair: 8,
  d: "Une vraie alliance. Vous vous défendez l'un l'autre, vous pouvez compter l'un sur l'autre quand ça va mal, et si l'un de vous trahit l'autre, la rupture sera brutale.",
  ask: "$A te propose une alliance, pour se défendre et se soutenir quoi qu'il arrive.",
  ok: (g, A, B, b) => b.aff >= 25 && b.riv < 20 && !b.tags.allie && !b.tags.betrayed, fit: (g, A, B, b) => 0.8 + b.aff / 60,
  no: { ta: "$B préfère garder sa liberté pour le moment.", bond: { aff: -1 } },
  yes: [{ w: 1, tag: "allie", a: { bonheur: 5, repute: 1 }, b: { bonheur: 5, repute: 1 }, ta: "$B serre ta main. Vous voilà alliés, pour le meilleur et pour le pire.", tb: "Tu serres la main de $A. Vous voilà alliés, pour le meilleur et pour le pire.", bond: { aff: 12 }, news: "🤝 $A et $B scellent une alliance." }] });

reg({ id: "sauver_dettes", grp: "amitie", ic: "🛟", l: "Éponger ses dettes", mode: "direct", ages: [20, 100], w: 4, cool: 4, coolPair: 5,
  d: "Tu règles une bonne partie de ses dettes, jusqu'à 40 % de ton argent. Il ou elle ne l'oubliera jamais.",
  ok: (g, A, B, b) => B.debt >= 5000 && A.cash >= 3000 && (b.aff >= 30 || b.tags.allie || !!(A.partner && A.partner.player === B.seat)), fit: (g, A, B, b) => 1.2 + b.aff / 100,
  direct: [{ w: 1, special: "bailout", a: { bonheur: 3, bonte: 2, repute: 3 }, b: { bonheur: 8 }, ta: "Tu tends la main à $B au pire moment.", tb: "$A tend la main au pire moment.", bond: { aff: 25 } }] });

reg({ id: "presenter_reseau", grp: "travail", ic: "🥂", l: "Ouvrir son carnet d'adresses", mode: "direct", ages: [22, 75], w: 4, cool: 3, coolPair: 4,
  d: "Tu présentes ton proche aux bonnes personnes. Son travail est remarqué, il ou elle peut obtenir une augmentation, ou une piste d'emploi sérieuse s'il ou elle n'en a pas.",
  ok: (g, A, B) => A.stats.repute >= 55 || A.cash >= 100000, fit: (g, A, B, b) => (b.aff >= 25 ? 1.2 : 0.4) + (A.stats.repute >= 70 ? 0.5 : 0),
  direct: [{ w: 1, special: "intro_network", a: { bonheur: 3 }, b: { bonheur: 5 }, ta: "Tu fais jouer ton réseau pour $B.", tb: "$A fait jouer son réseau pour toi.", bond: { aff: 8 } }] });

reg({ id: "financer_projet", grp: "argent", ic: "💼", l: "Financer son projet", mode: "offer", ages: [22, 85], w: 4, cool: 4, coolPair: 5,
  d: "Tu mises environ 8 % de ton argent sur son idée. Si ça prend, tu retrouves ta mise avec un très joli bénéfice. Sinon, tu perds tout.",
  ask: "$A veut financer ton projet, en échange d'une part des bénéfices.",
  ok: (g, A, B, b) => A.cash >= 15000 && b.aff >= 20 && b.riv < 25, fit: (g, A, B, b) => 0.8 + b.aff / 100 + (B.traits.ambition >= 60 ? 0.4 : 0),
  no: { ta: "$B ne veut pas mélanger l'argent et l'amitié.", bond: { aff: -1 } },
  yes: [{ w: 1, special: "fund", ta: "$B accepte ton financement.", tb: "Tu acceptes l'argent de $A.", bond: { aff: 3 } }] });

reg({ id: "confidences", grp: "amitie", ic: "🤫", l: "Partager un secret", mode: "offer", ages: [12, 100], w: 5, cool: 5, coolPair: 8,
  d: "Tu confies quelque chose que personne ne sait. Ça vous rapproche beaucoup, mais si vous vous fâchez un jour, l'autre pourra s'en servir.",
  ask: "$A veut te confier un secret.",
  ok: (g, A, B, b) => b.aff >= 25 && b.riv < 15 && !b.tags.confident, fit: (g, A, B, b) => 0.7 + b.aff / 70,
  no: { ta: "$B préfère ne rien savoir.", bond: { aff: -1 } },
  yes: [{ w: 1, tag: "confident", a: { bonheur: 5 }, b: { bonheur: 4 }, ta: "$B écoute sans juger. Quelque chose de lourd s'envole.", tb: "$A te confie un secret. Tu mesures la confiance qu'on te fait.", bond: { aff: 16 } }] });
}
