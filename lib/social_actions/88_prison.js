// Les actions envers un joueur en prison. Les alliés, les proches et les ennemis ne font pas du tout la même chose.
const { reg, coupleWith } = require("../socialkit");
const F = require("../feud");
const win = (base) => (g, A, B) => F.odds(g, A, B, base);
const lose = (base) => (g, A, B) => 1 - F.odds(g, A, B, base);
const close = (g, A, B, b) => b.aff >= 30 || !!b.tags.allie || coupleWith(A, B);
const P = { grp: "prison", status: "prisonnier", prison: true, mode: "direct", cool: 2, coolPair: 3, ages: [14, 110] };

reg(Object.assign({ id: "colis_prison", ic: "📦", l: "Envoyer un colis", cost: 300, w: 6,
  d: "Des livres, du chocolat, des lettres. Ça ne change pas la peine, mais ça change les journées.", ok: (g, A, B, b) => b.aff >= 12 || coupleWith(A, B), fit: (g, A, B, b) => 1 + b.aff / 80,
  direct: [{ w: 1, a: { bonheur: 2, bonte: 1 }, b: { bonheur: 5 }, ta: "Tu envoies un colis à $B.", tb: "Un colis de $A arrive jusqu'à ta cellule.", bond: { aff: 5 } }] }, P));

reg(Object.assign({ id: "payer_avocat", ic: "⚖️", l: "Payer un grand avocat", cost: 15000, w: 5,
  d: "Un cabinet réputé, un dossier repris à zéro. Tu peux faire réduire la peine de plusieurs années, ou perdre ton argent.", ok: (g, A, B, b) => close(g, A, B, b) && B.prison && B.prison.left >= 2, fit: (g, A, B, b) => 1.6 + (B.prison ? B.prison.left / 12 : 0),
  direct: [{ w: 1, special: "lawyer", a: { bonheur: 3, bonte: 1 }, b: {}, ta: "Tu finances la défense de $B.", tb: "$A finance ton avocat.", bond: { aff: 12 } }] }, P));

reg(Object.assign({ id: "evasion", ic: "🏃", l: "Organiser son évasion", cost: 20000, mature: true, hostile: true, w: 3, cool: 4, coolPair: 8,
  d: "Une corde, un camion, une nuit sans lune. Si ça marche, " + "ton proche est libre mais en cavale. Si ça rate, vous ajoutez des années de prison à la peine.", ok: (g, A, B, b) => (b.aff >= 45 || b.tags.allie || coupleWith(A, B)) && B.prison && B.prison.left >= 4, fit: () => 1,
  direct: [{ w: win(0.35), special: "jailbreak_ok", a: { bonheur: 6, honnete: -6 }, b: {}, ta: "Le plan a fonctionné.", tb: "Quelqu'un te sort de là.", bond: { aff: 25 } }, { w: lose(0.35), special: "jailbreak_ko", a: {}, b: { bonheur: -8 }, ta: "Le plan s'écroule.", tb: "Une évasion échoue.", bond: { aff: 5 } }] }, P));

reg(Object.assign({ id: "tourner_la_page", ic: "🚪", l: "Tourner la page", w: 3,
  d: "Tu cesses de lui écrire et de venir. Tu n'as plus la force d'attendre. Si vous êtes en couple, c'est une rupture.", ok: (g, A, B, b) => b.aff < 70 && B.prison && B.prison.left >= 3, fit: (g, A, B, b) => 0.4 + (B.prison ? B.prison.left / 10 : 0) + (b.aff < 40 ? 0.5 : 0),
  direct: [{ w: 1, special: "abandon", a: { bonheur: -3 }, b: {}, ta: "Tu laisses $B derrière toi.", tb: "$A ne répond plus à tes lettres.", bond: {} }] }, P));

reg(Object.assign({ id: "gerer_biens", ic: "📒", l: "Gérer ses biens pendant son absence", w: 3,
  d: "Tu prends la main sur son patrimoine et tu le fais fructifier honnêtement, pour une petite commission.", ok: (g, A, B, b) => close(g, A, B, b) && B.assets.length > 0, fit: () => 1.1,
  direct: [{ w: 1, special: "manage_assets", a: { bonheur: 1 }, b: { bonheur: 3 }, ta: "Tu veilles sur le patrimoine de $B.", tb: "$A veille sur ton patrimoine.", bond: { aff: 6 } }] }, P));

reg(Object.assign({ id: "narguer_detenu", ic: "😏", l: "Venir le narguer au parloir", hostile: true, w: 5, cost: 0,
  d: "Tu viens le regarder droit dans les yeux derrière la vitre. Ça ne coûte rien, ça fait mal, ça nourrit la haine.", ok: (g, A, B, b) => b.riv >= 30, fit: (g, A, B, b) => 1.2 + b.riv / 60,
  direct: [{ w: 1, special: "taunt", a: {}, b: {}, ta: "Tu savoures la scène.", tb: "Tu vois $A sourire derrière la vitre.", bond: { riv: 8 } }] }, P));

reg(Object.assign({ id: "menacer_famille", ic: "😈", l: "S'en prendre à sa famille", hostile: true, mature: true, w: 3, cool: 3,
  d: "Pendant qu'il ou elle est enfermé, tu fais passer des messages à sa famille. Les liens se défont, la peur s'installe.", ok: (g, A, B, b) => b.riv >= 55, fit: () => 1.1,
  direct: [{ w: 1, special: "threaten_family", a: { honnete: -4, bonte: -3 }, b: {}, ta: "Le message est arrivé.", tb: "Tu apprends les menaces.", bond: { riv: 14 } }] }, P));

reg(Object.assign({ id: "faire_prolonger", ic: "⛓️", l: "Faire prolonger sa peine", hostile: true, mature: true, cost: 10000, w: 3, cool: 4, coolPair: 6,
  d: "Un avocat retors, des témoignages orientés, un nouveau chef d'accusation. Si ça marche, il ou elle reste plus longtemps derrière les barreaux.", ok: (g, A, B, b) => b.riv >= 60, fit: () => 1.1,
  direct: [{ w: 1, special: "extend", a: { honnete: -3 }, b: {}, ta: "Tes avocats passent à l'action.", tb: "Un nouveau dossier est ouvert contre toi.", bond: { riv: 10 } }] }, P));
