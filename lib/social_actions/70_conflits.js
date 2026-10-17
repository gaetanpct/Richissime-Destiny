// Les grands coups des rivalités. Ils changent vraiment la vie de la cible, en bien pour celui qui réussit et en mal pour celui qui échoue.
// Chaque coup dépend du rapport de force entre les deux joueurs (fortune, intelligence, charme, réputation, culot).
const { reg } = require("../socialkit");
const F = require("../feud");

const win = (base) => (g, A, B) => F.odds(g, A, B, base);
const lose = (base) => (g, A, B) => 1 - F.odds(g, A, B, base);
const guilty = (B) => B.record > 0 || B.flags.illicite || B.flags.voleur || B.flags.fugitif || (B.job && /illicite/.test(B.job.track || ""));

reg({ id: "ruiner_affaires", grp: "coup_bas", ic: "📉", l: "Ruiner ses affaires", hostile: true, mode: "direct", ages: [22, 90], w: 5, cool: 3, coolPair: 3,
  d: "Tu actives tes contacts, tu débauches ses clients, tu fais pression sur ses fournisseurs. Si tu es plus fort, il ou elle perd beaucoup d'argent et tu en récupères une partie. Si tu es plus faible, c'est toi qui paies.",
  cost: 2000, ok: (g, A, B) => B.cash > 3000, fit: (g, A, B, b) => (b.riv >= 25 ? 1.6 + b.riv / 80 : 0),
  direct: [
    { w: win(0.5), special: "ruin_ok", a: { bonheur: 5, honnete: -3 }, b: { bonheur: -8 }, ta: "Tes manœuvres portent leurs fruits. Les clients de $B changent de crémerie, un par un.", tb: "Tes clients te quittent un par un et personne ne veut te dire pourquoi.", bond: { riv: 14, aff: -8 } },
    { w: lose(0.5), special: "ruin_ko", a: { bonheur: -4 }, b: { bonheur: 1 }, ta: "$B a des amis plus puissants que prévu, et ton plan se retourne contre toi.", tb: "Tu déjoues une manœuvre de $A grâce à de bons appuis. Tu notes l'adresse.", bond: { riv: 8 } },
  ] });

reg({ id: "faire_licencier", grp: "coup_bas", ic: "🚪", l: "Faire perdre son emploi", hostile: true, mode: "direct", ages: [20, 65], w: 4, cool: 4, coolPair: 4,
  d: "Une lettre anonyme, un mot à l'oreille de sa direction, un rapport qui circule. Si ça marche, il ou elle perd son poste.",
  cost: 800, ok: (g, A, B) => !!B.job, fit: (g, A, B, b) => (b.riv >= 22 ? 1.4 : 0),
  direct: [
    { w: win(0.4), special: "fire_ok", a: { bonheur: 4, honnete: -3 }, b: { bonheur: -6 }, ta: "Ton dossier fait mouche chez l'employeur de $B.", tb: "Un dossier arrive sur le bureau de ta direction.", bond: { riv: 14, aff: -8 } },
    { w: lose(0.4), a: { bonheur: -3, repute: -4 }, b: { bonheur: 2, repute: 2 }, ta: "Ta manœuvre est découverte et la direction de $B prend sa défense. Tu perds la face.", tb: "La direction de ton employeur t'apprend qu'on a voulu te nuire. Elle te soutient.", bond: { riv: 10 } },
  ] });

reg({ id: "fouiller_passe", grp: "coup_bas", ic: "🗂️", l: "Déterrer son passé", hostile: true, mature: true, mode: "direct", ages: [25, 85], w: 4, cool: 4, coolPair: 4,
  d: "Tu paies un enquêteur pour fouiller la vie de ta cible. Mieux vaut qu'elle ait quelque chose à cacher, sinon tu auras jeté ton argent.",
  cost: 2500, fit: (g, A, B, b) => (b.riv >= 25 ? 1.3 : 0),
  direct: [
    { w: (g, A, B) => (guilty(B) ? 0.78 : 0.3), special: "dirt_ok", a: { bonheur: 3, honnete: -2 }, b: { bonheur: -6 }, ta: "L'enquêteur revient avec une enveloppe épaisse sur $B.", tb: "Quelqu'un a fouillé ton passé.", bond: { riv: 16, aff: -8 } },
    { w: (g, A, B) => (guilty(B) ? 0.22 : 0.7), a: { bonheur: -3 }, b: { bonheur: 0 }, ta: "L'enquêteur ne trouve rien de croustillant sur $B. Tu as payé pour apprendre que c'est quelqu'un de bien.", tb: "Un enquêteur rôde autour de toi, mais n'a rien à trouver. Tu es plus tranquille que jamais.", bond: { riv: 6 } },
  ] });

reg({ id: "tendre_piege", grp: "coup_bas", ic: "🪤", l: "Lui tendre un piège", hostile: true, mature: true, mode: "direct", ages: [22, 85], w: 3, cool: 5, coolPair: 5,
  d: "De fausses preuves, un faux témoin, un anonyme à la police. Si ça marche, ta cible va en prison. Si ça rate, c'est toi qui y vas.",
  cost: 6000, ok: (g, A, B, b) => b.riv >= 45, fit: (g, A, B, b) => 1.2,
  direct: [
    { w: win(0.36), special: "frame_ok", a: { bonheur: 5, honnete: -6 }, b: { bonheur: -8 }, ta: "Le piège se referme sans bruit.", tb: "Tout t'accuse. Tu ne comprends pas encore pourquoi.", bond: { riv: 20, aff: -15 } },
    { w: lose(0.36), special: "frame_ko", a: { bonheur: -8, honnete: -4 }, b: { bonheur: 2 }, ta: "Tout s'effondre dès le premier interrogatoire.", tb: "Un piège monté contre toi s'écroule.", bond: { riv: 14 } },
  ] });

reg({ id: "saccager_biens", grp: "coup_bas", ic: "🔥", l: "Saccager ses biens", hostile: true, mature: true, mode: "direct", ages: [20, 85], w: 3, cool: 4, coolPair: 4,
  d: "Une nuit, quelques complices, du matériel. Ta cible perd un bien. Une caméra, un voisin, et c'est toi qui paies.",
  cost: 1500, ok: (g, A, B, b) => b.riv >= 45, fit: () => 1,
  direct: [
    { w: win(0.58), special: "wreck_ok", a: { bonheur: 4, honnete: -5 }, b: { bonheur: -9 }, ta: "Tout s'est passé comme prévu.", tb: "Tu découvres le saccage au petit matin.", bond: { riv: 18, aff: -12 } },
    { w: lose(0.58), special: "wreck_ko", a: { bonheur: -5, honnete: -3 }, b: { bonheur: 1 }, ta: "Rien ne se passe comme prévu.", tb: "Une tentative de dégradation échoue.", bond: { riv: 12 } },
  ] });

reg({ id: "contrat_tueur", grp: "coup_bas", ic: "🕶️", l: "Mettre un contrat sur sa tête", hostile: true, mature: true, mode: "direct", ages: [25, 85], w: 3, cool: 4, coolPair: 6,
  d: "30 000 € dans une enveloppe, un nom, une adresse. Le contrat peut réussir, blesser gravement, rater complètement ou se retourner contre toi avec des années de prison. On ne revient pas en arrière.",
  cost: 30000, ok: (g, A, B, b) => b.riv >= 60, fit: () => 1,
  direct: [
    { w: 0.12, special: "hit_dead", a: { bonheur: -6, honnete: -10, bonte: -8 }, b: {}, ta: "Tu as franchi la dernière ligne.", tb: "Ta vie s'arrête là.", bond: { riv: 20 } },
    { w: 0.26, special: "hit_hurt", a: { bonheur: -3, honnete: -8, bonte: -6 }, b: {}, ta: "Tu as lancé les hostilités les plus sombres.", tb: "Quelqu'un a voulu ta mort.", bond: { riv: 20 } },
    { w: 0.3, special: "hit_miss", a: { bonheur: -5, honnete: -6 }, b: {}, ta: "Tu as perdu ton argent et ton sommeil.", tb: "Tu as senti passer le vent du boulet.", bond: { riv: 10 } },
    { w: 0.32, special: "hit_caught", a: {}, b: {}, ta: "Tout part en cacahuète.", tb: "Un tueur à gages vient d'être arrêté.", bond: { riv: 20 } },
  ] });
