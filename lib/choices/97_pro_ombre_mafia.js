// Fichier regroupé. Ombre, mafia, études, apprentissage, chômage, retraite, détention et options pour tous.
// ---------- 97_pro_ombre_mafia ----------
{
// Onglet Professionnel. Activités dans l'ombre et organisation criminelle.
// La pression (heat) monte avec les gros coups et redescend quand on se fait discret. Elle pèse sur chaque arrestation.
const K = require("../prokit");
const { P, out, chance, fail, S, sal, scale, clamp, adult, net } = K;
const C = require("../core");

const noPrison = { nostudy: true, noprison: true };
const shadow = Object.assign({ job: { illicit: true } }, noPrison, { ages: [16, 75] });
const gang = Object.assign({ any: ["mafia", "parrain"] }, noPrison, { ages: [18, 90] });
const boss = Object.assign({ flag: "parrain" }, noPrison, { ages: [25, 90] });
const hot = (p) => S(p).heat;
const jail = (lo, hi) => (p, x, g) => C.rint(g ? g.rng : Math.random, lo, hi);

// ================= activités dans l'ombre =================
{
  const ch = (p) => clamp(0.5 + S(p).skill * 0.004 + (p.stats.intel - 50) / 250 - hot(p) * 0.004, 0.1, 0.85);
  P("o_gros_coup", "ombre", "💎", "Préparer le gros coup", "Un plan minutieux, une équipe, une seule chance. Si ça marche, tu changes de vie. Sinon, la police n'oublie pas.",
    { need: shadow, cool: 2, w: 9, risk: 3, ill: true, tag: "mature",
      outs: [
        out(ch, "Le coup réussit au-delà de tes espérances. Le butin est énorme, les bonnes histoires se racontent dans les ruelles.", { argent: (p) => scale(p, 0.12, 25000, 6000000), pro: { skill: 4, rep: 6, heat: 20 }, honnete: -4, bonheur: 5, pub: "💎 Un gros coup défraie la chronique. La police cherche les auteurs." }, true),
        out((p) => (1 - ch(p)) * 0.5, "Le coup tourne court. Tu repars les mains vides, mais libre.", { pro: { skill: 2, heat: 8 }, bonheur: -3 }),
        out((p) => (1 - ch(p)) * 0.5, "Tu te fais cueillir par les enquêteurs à la sortie. Procès, condamnation et ton nom dans le journal.", { prison: jail(2, 6), pro: { rep: -4, heat: 12 }, repute: -10, bonheur: -9, pub: "🚔 $nom est arrêté(e) à l'issue d'un coup manqué." }, true),
      ] });
}
P("o_discret", "ombre", "🕯️", "Te faire oublier toute l'année", "Pas de coup, pas de bruit, pas de sorties dans les endroits fréquentés. La pression retombe, les affaires attendent.",
  { need: shadow, cool: 1, w: 8, risk: 0, fit: (p) => (hot(p) >= 20 ? 2.4 : 0.8),
    outs: [out(0.9, "Tu mènes une vie presque honnête. Les enquêteurs t'oublient doucement, et les revenus fondent.", { pro: { heat: -26, net: -2 }, argent: (p) => sal(p, 0.03), sante: 1, bonheur: 1 }, true), out(0.1, "Tu t'ennuies tellement que tu en fais un peu trop. La pression ne descend pas beaucoup.", { pro: { heat: -8 }, bonheur: -1 })] });
P("o_reperages", "ombre", "🔭", "Faire des repérages minutieux", "Heures de planque, plans griffonnés, horaires d'ouverture. Ce n'est pas glorieux, c'est ce qui sauve.",
  { need: shadow, cool: 2, w: 7, risk: 1,
    outs: [out(0.8, "Tu connais désormais les failles par cœur. Tes prochains coups auront bien moins de hasard.", { pro: { skill: 7, heat: 2 }, intel: 1, prudent: 2 }, true), out(0.2, "Un voisin trop curieux te remarque. Tu abandonnes le plan et ton nom reste dans sa mémoire.", { pro: { skill: 3, heat: 8 }, bonheur: -2 })] });
P("o_complice", "ombre", "🤝", "Recruter un complice de confiance", "Quelqu'un qui connaît le milieu et qui n'a pas peur. Reste à savoir s'il tiendra sous interrogatoire.",
  { need: shadow, cool: 3, w: 6, risk: 2,
    outs: [
      out(0.6, "Ton complice est loyal, adroit et discret. Votre duo a de l'avenir.", { pro: { net: 7, skill: 3 }, meet: "friend", bonheur: 3 }, true),
      out(0.25, "Il parle trop, mais il est utile. Tu apprends à choisir tes confidences.", { pro: { net: 3, heat: 6 }, bonheur: 0 }),
      out(0.15, "C'était un indicateur de la police. Une perquisition a lieu quelques semaines plus tard.", { pro: { heat: 22, net: -4 }, argent: (p) => -sal(p, 0.15), record: 1, bonheur: -6, prison: 1 }, true),
    ] });
{
  const ch = chance(0.55, "intel", { net: 0.003 });
  P("o_papiers", "ombre", "🪪", "Te procurer de nouveaux papiers", "Une identité propre pour repartir à zéro. Les faussaires aiment le liquide.",
    { need: shadow, cost: 3000, cool: 4, w: 5, risk: 2, ill: true, tag: "mature", fit: (p) => (hot(p) >= 25 ? 2.2 : 0.5),
      outs: [
        out(ch, "Les papiers sont impeccables. Ton dossier s'allège et tu peux respirer à nouveau.", { pro: { heat: -30 }, honnete: -2, bonheur: 4 }, true),
        out(fail(ch), "Le faussaire a bâclé son travail. Tu perds ton argent, et on remarque ton nom.", { pro: { heat: 10 }, bonheur: -4 }),
      ] });
}
{
  const ch = chance(0.5, "intel", { skill: 0.003, net: 0.002 });
  P("o_blanchir", "ombre", "🧼", "Blanchir ton argent dans un commerce", "Une laverie, un bar, un petit garage où le tiroir-caisse a beaucoup d'imagination.",
    { need: shadow, cost: 5000, cool: 4, w: 6, risk: 2, ill: true, tag: "mature",
      outs: [
        out(ch, "Ta façade tourne bien. Tes revenus ont désormais une origine presque plausible, et les contrôles s'éloignent.", { pro: { heat: -22, skill: 3 }, argent: (p) => sal(p, 0.06), item: { kind: "entreprise", name: "Ta petite façade légale", value: 14000, income: 2200, upkeep: 800 }, honnete: -2, bonheur: 2 }, true),
        out(fail(ch), "Un contrôleur trop zélé épluche tes comptes. Le commerce ferme, avec une belle amende.", { dette: 6000, pro: { heat: 14 }, bonheur: -5 }, true),
      ] });
}
{
  const ch = chance(0.45, "charme", { net: 0.004 });
  P("o_corrompre", "ombre", "🕴️", "Arroser un policier", "Un petit cadeau, une grosse enveloppe, des yeux qui se ferment. Ça marche jusqu'au jour où ça ne marche plus.",
    { need: shadow, cost: 2500, cool: 3, w: 5, risk: 3, ill: true, tag: "mature", fit: (p) => (hot(p) >= 15 ? 2 : 0.6),
      outs: [
        out(ch, "Le policier se montre compréhensif. Ton dossier se perd dans un tiroir.", { pro: { heat: -24, net: 3 }, honnete: -4, bonheur: 2 }, true),
        out(fail(ch), "Le policier refuse et note ton nom. Tu passes l'année à surveiller tes arrières.", { pro: { heat: 16 }, bonheur: -5 }),
      ] });
}
{
  const ch = chance(0.45, "intel", { skill: 0.004, net: 0.002 });
  P("o_riche", "ombre", "🎯", "Viser une cible riche", "Un collectionneur, un patron trop sûr de lui, un héritier qui laisse sa porte ouverte.",
    { need: shadow, cool: 2, w: 7, risk: 3, ill: true, tag: "mature",
      outs: [
        out(ch, "L'opération est propre. Ta cible porte plainte, mais n'a rien vu.", { argent: (p) => scale(p, 0.09, 15000, 4000000), pro: { skill: 3, heat: 14, rep: 2 }, honnete: -4, bonheur: 4 }),
        out((p) => (1 - ch(p)) * 0.55, "La cible avait prévu le coup. Tu repars bredouille et inquiet(e).", { pro: { skill: 2, heat: 8 }, bonheur: -3 }),
        out((p) => (1 - ch(p)) * 0.45, "Une caméra cachée t'a filmé(e). Dans les jours qui suivent, les enquêteurs sonnent à ta porte.", { prison: jail(1, 4), record: 1, pro: { rep: -4, heat: 12 }, repute: -8, bonheur: -8, pub: "🚔 $nom est arrêté(e) après un vol chez un notable." }, true),
      ] });
}
P("o_recel", "ombre", "📦", "Écouler la marchandise par un receleur", "Des objets sans histoire, des prix sans factures et un receleur qui connaît le marché.",
  { need: shadow, cool: 1, w: 7, risk: 2, ill: true, tag: "mature",
    outs: [
      out((p) => 0.65 - hot(p) * 0.003, "Le receleur est correct. La marchandise s'écoule et l'argent arrive en petites coupures.", { argent: (p) => scale(p, 0.04, 6000, 1500000), pro: { net: 3, heat: 8 }, honnete: -3 }),
      out((p) => 0.25, "Le receleur te paie moins que promis, et tu n'as pas de recours.", { argent: (p) => scale(p, 0.015, 2500, 400000), pro: { heat: 4 }, bonheur: -2 }),
      out((p) => 0.1 + hot(p) * 0.003, "Le receleur est sur écoute. Tout s'écroule en une matinée.", { prison: jail(1, 3), record: 1, pro: { heat: 14, net: -6 }, repute: -6, bonheur: -8 }, true),
    ] });
P("o_indic", "ombre", "📞", "Devenir informateur de la police", "Tu donnes des noms de gens que tu connais. En échange, tu gagnes du répit et une réputation de traître.",
  { need: shadow, cool: 5, w: 3, risk: 3, tag: "mature", fit: (p) => (hot(p) >= 35 ? 2.5 : 0.3),
    outs: [
      out(0.55, "Les enquêteurs oublient ton dossier. Mais dans le milieu, on te regarde de travers.", { pro: { heat: -40, net: -10, rep: -6 }, honnete: -3, bonheur: -3 }, true),
      out(0.3, "Ton nom fuite. Un ancien complice te le fait payer dans une ruelle sombre.", { pro: { heat: -20, net: -14, rep: -8 }, sante: -12, bonheur: -8 }, true),
      out(0.15, "Les enquêteurs ne tiennent aucune promesse. Tu es seul(e) face à tes ennemis.", { pro: { heat: 5, net: -8 }, bonheur: -6 }),
    ] });
{
  const ch = chance(0.55, "intel", { skill: 0.003 });
  P("o_materiel", "ombre", "🧰", "T'équiper comme un professionnel", "Outils de précision, brouilleurs, voiture que personne ne regarde. Ça ne se trouve pas au supermarché.",
    { need: shadow, cost: 4000, cool: 3, w: 5, risk: 1, ill: true, tag: "mature",
      outs: [out(ch, "Ton équipement fait la différence. Tes coups sont plus rapides et plus propres.", { pro: { skill: 8, heat: 3 }, bonheur: 2 }, true), out(fail(ch), "Une partie du matériel ne marche pas comme prévu. Une leçon coûteuse.", { pro: { skill: 3 }, bonheur: -1 })] });
}
P("o_raccrocher", "ombre", "🚪", "Raccrocher pour de bon", "Tu quittes l'ombre. Ta pression retombe, ton compte en banque aussi, ta conscience respire.",
  { need: shadow, cool: 4, w: 4, risk: 0, fit: (p) => (p.age >= 40 || hot(p) >= 50 ? 2.2 : 0.4),
    outs: [out(0.85, "Tu raccroches. Tu as le sentiment de redevenir quelqu'un de normal, et c'est inattendu.", { quit: true, pro: { heat: -30 }, honnete: 5, bonheur: 6 }, true), out(0.15, "Un ancien complice te rattrape et te propose une dernière affaire. Tu refuses, difficilement.", { quit: true, pro: { heat: -15 }, honnete: 3, bonheur: 2 })] });
P("o_hack_cible", "ombre", "💻", "Pirater une grande entreprise", "Une faille, une nuit, des fichiers qui valent plus cher que ta voiture. Les enquêteurs du numérique n'oublient rien.",
  { need: Object.assign({ job: { track: "hacker" } }, noPrison, { ages: [16, 70] }), cool: 2, w: 8, risk: 3, ill: true, tag: "mature",
    outs: [
      out((p) => clamp(0.5 + S(p).skill * 0.004 + (p.stats.intel - 50) / 200 - hot(p) * 0.004, 0.1, 0.85), "Tu entres, tu prends, tu ressors sans laisser de traces. La revente rapporte beaucoup.", { argent: (p) => scale(p, 0.1, 18000, 5000000), pro: { skill: 5, rep: 3, heat: 18 }, honnete: -3, bonheur: 4, pub: "💻 Une grande entreprise annonce avoir été piratée." }, true),
      out((p) => 0.3, "Le système t'a repéré(e) en cours de route. Tu t'enfuis, sans butin et sans traces.", { pro: { skill: 3, heat: 10 }, bonheur: -3 }),
      out((p) => 0.2 + hot(p) * 0.003, "Un enquêteur remonte jusqu'à ton adresse. Perquisition à l'aube.", { prison: jail(2, 5), record: 1, pro: { heat: 14, rep: -3 }, repute: -8, bonheur: -9, pub: "🚔 $nom est arrêté(e) pour piratage informatique." }, true),
    ] });

// ================= organisation criminelle =================
P("m_racket", "mafia", "🚪", "Faire la tournée des commerçants", "Le sourire en coin, la main sur l'épaule et la protection qui se paie en liquide.",
  { need: gang, cool: 1, w: 9, risk: 2, ill: true, tag: "mature",
    outs: [
      out((p) => 0.7 - hot(p) * 0.003, "La tournée est fructueuse. Les commerçants paient, l'organisation te félicite.", { argent: (p) => scale(p, 0.025, 8000, 2000000), pro: { rep: 4, heat: 8, net: 2 }, honnete: -3 }),
      out((p) => 0.22, "Un commerçant refuse et ameute le quartier. Tu règles l'affaire à l'amiable, ce qui t'oblige à une visite supplémentaire.", { argent: (p) => scale(p, 0.01, 3000, 500000), pro: { rep: 1, heat: 10 }, bonheur: -2 }),
      out((p) => 0.08 + hot(p) * 0.002, "Un commerçant porte plainte et la police tend un piège à la tournée suivante.", { prison: jail(1, 4), record: 1, pro: { heat: 14, rep: -3 }, repute: -6, bonheur: -8 }, true),
    ] });
{
  const ch = chance(0.55, "intel", { skill: 0.004, net: 0.002 });
  P("m_blanchiment", "mafia", "🧾", "Superviser le blanchiment de l'organisation", "Des sociétés écrans, des factures qui n'ont jamais vu un service, un comptable qui fait des heures supplémentaires.",
    { need: gang, cool: 2, w: 8, risk: 2, ill: true, tag: "mature",
      outs: [
        out(ch, "Les flux sont propres. Les parrains t'apprécient et la police ne voit que du feu.", { argent: (p) => scale(p, 0.03, 10000, 3000000), pro: { skill: 5, rep: 4, heat: -12 }, honnete: -2, bonheur: 2 }, true),
        out(fail(ch), "Un contrôle fiscal tombe sur l'une des sociétés. Il faut vite effacer des traces.", { argent: (p) => -scale(p, 0.01, 2000, 600000), pro: { heat: 14, rep: -2 }, bonheur: -3 }),
      ] });
}
P("m_recruter", "mafia", "🧑‍🤝‍🧑", "Recruter de jeunes talents", "Des petits qui veulent grimper vite et qui ont besoin d'un grand frère. Tu bâtis ta propre équipe.",
  { need: gang, cool: 3, w: 6, risk: 2, tag: "mature",
    outs: [
      out(0.65, "Tes recrues sont ambitieuses et loyales. Ton équipe grandit et ton nom pèse.", { pro: { rep: 6, net: 6 }, bonheur: 2 }, true),
      out(0.25, "Une recrue fait des bêtises et attire l'attention des enquêteurs sur ton secteur.", { pro: { rep: 2, net: 3, heat: 16 }, bonheur: -3 }),
      out(0.1, "Une recrue te dénonce pour sauver sa peau. Tu es arrêté(e) pour quelques années.", { prison: jail(2, 6), record: 1, pro: { heat: 20, net: -6 }, repute: -8, bonheur: -9 }, true),
    ] });
{
  const ch = chance(0.5, "charme", { rep: 0.004, net: 0.003 });
  P("m_alliance", "mafia", "🍷", "Négocier une alliance avec une autre famille", "Un repas lent, des sourires polis, un contrat que personne n'écrit.",
    { need: gang, cool: 4, w: 5, risk: 2, tag: "mature",
      outs: [
        out(ch, "L'alliance est scellée. Vos territoires s'accordent et vos ennuis se divisent.", { pro: { rep: 7, net: 5, heat: -5 }, argent: (p) => scale(p, 0.015, 5000, 1000000), bonheur: 3 }, true),
        out(fail(ch), "Le repas tourne court. L'autre famille se sent insultée et les tensions montent.", { pro: { rep: -3, heat: 8 }, bonheur: -4 }),
      ] });
}
{
  const ch = chance(0.45, "courage", { rep: 0.004, skill: 0.003 });
  P("m_guerre", "mafia", "⚔️", "Écraser une famille rivale", "Une offensive, des menaces, des incendies. Ça se gagne vite, ça se paie longtemps.",
    { need: gang, cool: 4, w: 4, risk: 3, ill: true, tag: "mature", fit: (p) => (p.traits.courage >= 50 ? 1.5 : 0.5),
      outs: [
        out(ch, "L'offensive réussit. Le territoire rival tombe, ton prestige explose.", { argent: (p) => scale(p, 0.08, 20000, 12000000), pro: { rep: 12, heat: 24 }, honnete: -6, bonheur: 4, pub: "⚔️ Une guerre de gangs éclate dans $ville." }, true),
        out((p) => (1 - ch(p)) * 0.55, "La riposte est brutale. Tu perds des hommes et de l'argent, mais tu tiens bon.", { argent: (p) => -scale(p, 0.02, 4000, 3000000), pro: { rep: -3, heat: 18 }, sante: -8, bonheur: -6 }),
        out((p) => (1 - ch(p)) * 0.3, "La police profite du désordre pour frapper. Tu es arrêté(e) en pleine action.", { prison: jail(4, 12), record: 1, pro: { heat: 26 }, repute: -12, bonheur: -10 }, true),
        out((p) => (1 - ch(p)) * 0.15, "Une embuscade au coin d'une rue. Tu n'en réchappes pas.", { die: "un règlement de comptes entre familles", pro: { heat: 20 } }, true),
      ] });
}
{
  const ch = chance(0.5, "charme", { net: 0.004 });
  P("m_juge", "mafia", "⚖️", "Arroser un juge ou un élu", "Une invitation, une enveloppe, un service rendu. On ne vous reproche rien tant que vous donnez.",
    { need: gang, cost: 6000, cool: 3, w: 6, risk: 3, ill: true, tag: "mature", fit: (p) => (hot(p) >= 18 ? 2 : 0.8),
      outs: [
        out(ch, "L'élu devient un ami fidèle. Un dossier brûlant disparaît et les contrôles se font plus rares.", { pro: { heat: -28, net: 6, rep: 2 }, honnete: -4, bonheur: 2 }, true),
        out(fail(ch), "Le juge enregistre la conversation. Tu évites le pire de justesse, après des mois d'avocats.", { argent: (p) => -scale(p, 0.01, 3000, 800000), pro: { heat: 14, net: -3 }, bonheur: -5 }, true),
      ] });
}
P("m_facade", "mafia", "🎗️", "Financer une œuvre de charité de façade", "Un gala, un chèque géant, une plaque avec ton nom. Les photographes adorent.",
  { need: gang, cost: (p) => clamp(Math.round(Math.max(0, net(p)) * 0.01 / 100) * 100, 2000, 800000), cool: 3, w: 6, risk: 0, tag: "mature",
    outs: [out(0.8, "La ville te voit comme un bienfaiteur. La police hésite à t'embêter, et les journalistes écrivent des portraits flatteurs.", { pro: { heat: -18, rep: 4 }, repute: 6, bonte: 1, bonheur: 3, pub: "🎗️ $nom finance une œuvre de charité très médiatisée." }, true), out(0.2, "Un journaliste curieux creuse. Il ne trouve rien cette fois, mais il a noté.", { pro: { heat: -6, rep: 2 }, repute: 2 })] });
P("m_omerta", "mafia", "🤐", "Faire respecter la loi du silence", "Un avertissement ici, un regard là. Ceux qui parlent trop apprennent à se taire.",
  { need: gang, cool: 2, w: 6, risk: 2, ill: true, tag: "mature",
    outs: [
      out(0.7, "Plus personne ne bavarde autour de toi. Les enquêteurs se heurtent à des murs.", { pro: { heat: -16, rep: 4, net: 2 }, honnete: -3, bonheur: -1 }),
      out(0.3, "Un témoin appelle la police au lieu de se taire. L'affaire fait du bruit.", { pro: { heat: 12, rep: -2 }, bonheur: -4 }),
    ] });
{
  const ch = chance(0.5, "courage", { rep: 0.004, net: 0.003 });
  P("m_territoire", "mafia", "🗺️", "Ouvrir un nouveau territoire", "Un quartier, un port, une nouvelle ville. Plus de revenus, plus de monde à surveiller.",
    { need: gang, cool: 4, w: 5, risk: 3, ill: true, tag: "mature",
      outs: [
        out(ch, "Le nouveau territoire est un succès. Les revenus affluent et ton prestige avec eux.", { argent: (p) => scale(p, 0.05, 15000, 8000000), pro: { rep: 7, net: 4, heat: 14 }, honnete: -3, bonheur: 4 }, true),
        out(fail(ch), "Le terrain est déjà occupé. Tu bats en retraite avec des pertes.", { argent: (p) => -scale(p, 0.015, 3000, 1500000), pro: { rep: -2, heat: 10 }, bonheur: -4 }),
      ] });
}
P("m_lieutenant", "mafia", "🕵️", "Te méfier d'un lieutenant", "Il sourit trop, il sait trop, il rentre trop tard. Tu enquêtes avant qu'il n'agisse.",
  { need: boss, cool: 3, w: 6, risk: 2, ill: true, tag: "mature",
    outs: [
      out(0.45, "Tu déjoues un complot de justesse. Le lieutenant disparaît de la ville et ta position est affermie.", { pro: { rep: 6, net: -2, heat: 8 }, honnete: -3, bonheur: 2 }, true),
      out(0.35, "Fausse alerte. Le lieutenant, vexé, prend ses distances.", { pro: { net: -4, rep: -1 }, bonheur: -2 }),
      out(0.2, "Tu avais raison trop tard. Une partie de ton réseau bascule dans l'autre camp.", { argent: (p) => -scale(p, 0.03, 8000, 6000000), pro: { rep: -6, net: -6, heat: 12 }, bonheur: -6 }, true),
    ] });
P("m_dauphin", "mafia", "👑", "Préparer ta succession", "Un héritier, une retraite possible, un conseil des anciens qui te surveille.",
  { need: Object.assign({ flag: "parrain", ages: [45, 95] }, noPrison), cool: 5, w: 4, risk: 1, tag: "mature", fit: (p) => (p.age >= 55 ? 2 : 0.5),
    outs: [out(0.7, "Tu choisis un successeur de confiance. L'organisation respire et les rivaux se calment.", { pro: { rep: 5, net: 5, heat: -14 }, bonheur: 5 }, true), out(0.3, "Deux prétendants se disputent ta place. Tu passes l'année à calmer le jeu.", { pro: { rep: 2, heat: 8 }, bonheur: -3 })] });
}

// ---------- 98_pro_debuts_fin ----------
{
// Onglet Professionnel. Études et débuts, apprentissage, recherche d'activité, retraite active, détention, et options pour tous.
const K = require("../prokit");
const { P, out, chance, fail, S, sal, scale, clamp, tier, net } = K;
const FX = require("../fx");

const studentNeed = (extra) => Object.assign({ fn: (p) => ["lycee", "sup"].includes(p.school.phase), noprison: true, ages: [15, 40] }, extra || {});
const hasSpe = (p) => !!(p.spe && !p.spe.done);
const speFit = (p) => (hasSpe(p) ? 2 : 1);
const sweet = (p) => 0.5 + (hasSpe(p) ? 0.12 : 0) + (p.stats.intel - 50) / 300;

// ================= études et débuts =================
P("e_job_domaine", "etudes", "🧑‍🍳", "Prendre un job étudiant dans ton domaine", "Quelques heures par semaine chez un professionnel de ta filière. On gagne un peu et on apprend beaucoup.",
  { need: studentNeed(), cool: 1, w: 9, risk: 0, fit: speFit,
    outs: [
      out(sweet, "Ton patron aime ton sérieux. Tu apprends plus que dans les cours et tu gagnes de quoi payer tes sorties.", { argent: 2800, speXp: 0.5, pro: { skill: 3, net: 3 }, bonheur: 2, sante: -1 }, true),
      out((p) => 1 - sweet(p), "Le job se limite à porter des cartons. Tu gagnes quelques sous et des courbatures.", { argent: 1800, pro: { net: 1 }, sante: -1 }),
    ] });
{
  const ch = (p) => clamp(0.45 + (hasSpe(p) ? 0.15 : 0) + S(p).net * 0.004 + (p.stats.charme - 50) / 300, 0.15, 0.9);
  P("e_stage", "etudes", "🏢", "Décrocher un stage dans ton domaine", "Quelques semaines ou quelques mois dans une vraie entreprise. Le CV s'étoffe, le monde du travail se dévoile.",
    { need: studentNeed({ ages: [16, 35] }), cool: 2, w: 9, risk: 1, fit: speFit,
      outs: [
        out(ch, "Ton stage est un succès. On te propose de revenir à la fin de tes études, et tu gardes plusieurs contacts précieux.", { speXp: 1, pro: { skill: 4, net: 6, rep: 2 }, flag: { piston: 4 }, bonheur: 4 }, true),
        out(fail(ch), "Tu passes ton stage à photocopier. Mais tu observes tout, et le CV y gagne une ligne.", { speXp: 0.5, pro: { skill: 2, net: 2 }, bonheur: -1 }),
      ] });
}
{
  const ch = (p) => clamp(0.4 + (p.stats.intel - 50) / 200 + (hasSpe(p) ? 0.1 : 0), 0.15, 0.85);
  P("e_projet", "etudes", "🛠️", "Monter un projet ambitieux dans ta filière", "Un prototype, un spectacle, un chantier, un dossier. Quelque chose qu'on peut montrer à un recruteur.",
    { need: studentNeed(), cool: 2, w: 7, risk: 2, fit: speFit,
      outs: [
        out(ch, "Ton projet est remarqué par les professeurs et par un recruteur de passage. Ton avenir s'éclaircit.", { speXp: 1, pro: { skill: 6, rep: 4, net: 3 }, notes: 4, bonheur: 5 }, true),
        out(fail(ch), "Le projet s'enlise, mais tu apprends à travailler en équipe.", { speXp: 0.5, pro: { skill: 3 }, notes: 1, bonheur: -1 }),
      ] });
}
P("e_asso_pro", "etudes", "🎟️", "Rejoindre l'association de ta filière", "Soirées, conférences de professionnels, annuaire des anciens. Un réseau qui servira bien après les cours.",
  { need: studentNeed(), cool: 3, w: 6, risk: 0, fit: speFit,
    outs: [out(0.8, "L'association t'ouvre des portes. Un ancien te recommande pour ton premier emploi.", { pro: { net: 8, rep: 2 }, sociable: 2, bonheur: 3 }, true), out(0.2, "L'association organise surtout des soirées. Tu t'y fais de bons amis, et quelques contacts.", { pro: { net: 3 }, bonheur: 3, sociable: 1 })] });
{
  const ch = (p) => clamp(0.3 + (p.stats.intel - 50) / 180 + (hasSpe(p) ? 0.12 : 0) + (p.school.grade - 50) / 400, 0.1, 0.8);
  P("e_concours", "etudes", "🏆", "Participer à un concours de ta filière", "Un concours entre élèves, devant des professionnels. Une médaille vaut une ligne de CV qui compte.",
    { need: studentNeed(), cool: 3, w: 6, risk: 2, fit: speFit,
      outs: [
        out((p) => ch(p) * 0.35, "Tu remportes le concours. On parle de toi dans la presse locale et les professionnels te remarquent.", { speXp: 1, pro: { skill: 4, rep: 8, net: 4 }, repute: 4, bonheur: 7, pub: "🏆 $nom remporte un concours de sa filière." }, true),
        out((p) => ch(p) * 0.65 + 0.15, "Tu fais bonne figure et tu repars avec une mention. Les jurés ont noté ton nom.", { pro: { skill: 3, rep: 3 }, bonheur: 3 }),
        out((p) => Math.max(0.05, 0.85 - ch(p)), "Tu rates ta présentation. Ça arrive à tout le monde, y compris aux champions.", { pro: { skill: 2 }, bonheur: -3 }),
      ] });
}
P("e_alternance", "etudes", "🔁", "Passer en alternance", "Une semaine à l'école, une semaine en entreprise. Moins de cours, plus de vrai travail, et un salaire en prime.",
  { need: { studying: true, noprison: true, ages: [18, 35] }, cool: 3, w: 5, risk: 1, fit: speFit,
    outs: [
      out(0.75, "L'alternance te va bien. Tu gagnes ta vie, ton entreprise te teste, et ton école te laisse passer.", { argent: 7500, speXp: 1, pro: { skill: 6, net: 5 }, notes: -2, bonheur: 2, sante: -1 }, true),
      out(0.25, "Le rythme est épuisant. Tes notes baissent et ton patron se plaint, mais tu tiens bon.", { argent: 5500, speXp: 0.5, pro: { skill: 4, net: 3 }, notes: -5, sante: -3, bonheur: -3 }),
    ] });
P("e_ancien", "etudes", "☎️", "Demander conseil à un ancien de ta filière", "Un café avec quelqu'un qui est passé par là. Il te dit ce que les brochures n'osent pas écrire.",
  { need: studentNeed(), cool: 2, w: 6, risk: 0, fit: speFit,
    outs: [out(0.8, "L'ancien te donne des conseils précieux et te présente deux de ses contacts. Tu ne regardes plus ton avenir de la même façon.", { pro: { net: 6, skill: 2 }, meet: "mentor", ambition: 2, bonheur: 2 }, true), out(0.2, "Il te parle de ses regrets pendant une heure. Tu notes au moins deux erreurs à ne pas faire.", { pro: { skill: 2, net: 2 }, bonheur: -1 })] });
P("e_changer", "etudes", "🔀", "Changer de spécialisation", "Tu t'es trompé(e) de voie, ou tu as découvert autre chose. Tu perds un peu de temps et tu gagnes de la cohérence.",
  { need: studentNeed({ fn: (p) => ["lycee", "sup"].includes(p.school.phase) && !!p.spe && p.spe.xp >= 1 && p.spe.xp <= 3 }), cool: 4, w: 3, risk: 1, scene: "choix_filiere", fx: { notes: -4, bonheur: -1 } });

// ================= apprentissage =================
const appr = { fn: (p) => p.school.track === "apprenti" && p.age <= 20, noprison: true, ages: [15, 21] };
P("a_polyvalence", "apprenti", "🔧", "Demander à tourner sur tous les postes", "Cuisine, salle, caisse, atelier, livraison. Tu apprends le métier en entier plutôt qu'une seule tâche.",
  { need: appr, cool: 1, w: 8, risk: 0,
    outs: [out(0.8, "Tu touches à tout et tu retiens beaucoup. Ton maître d'apprentissage dit « celui-là ira loin ».", { speXp: 0.5, pro: { skill: 6, rep: 2 }, bonheur: 2, sante: -1 }, true), out(0.2, "On te donne les corvées sans te montrer les gestes. Tu apprends à observer.", { pro: { skill: 3 }, bonheur: -2 })] });
P("a_maitre", "apprenti", "🧑‍🔧", "Gagner la confiance de ton maître d'apprentissage", "Arriver tôt, partir tard, poser les bonnes questions. Un patron qui croit en toi est un trésor.",
  { need: appr, cool: 2, w: 8, risk: 0,
    outs: [out(0.75, "Ton maître d'apprentissage te traite en futur collègue. Il te promet une place après le diplôme.", { pro: { net: 5, rep: 3, skill: 3 }, meet: "mentor", flag: { piston: 4 }, bonheur: 4 }, true), out(0.25, "Il reste distant mais juste. Tu gagnes son respect doucement.", { pro: { skill: 3, rep: 1 }, bonheur: 0 })] });
{
  const ch = (p) => clamp(0.3 + S(p).skill * 0.005 + (p.stats.creatif || p.traits.creatif - 50) / 400 + (p.stats.sport - 50) / 500, 0.1, 0.8);
  P("a_concours", "apprenti", "🥇", "Se présenter au concours du meilleur apprenti", "Une épreuve devant des professionnels, avec une médaille et un carnet d'adresses à la clé.",
    { need: appr, cool: 3, w: 6, risk: 2,
      outs: [
        out((p) => ch(p) * 0.4, "Tu décroches une médaille. Les employeurs de la région t'écrivent avant même ton diplôme.", { speXp: 1, pro: { skill: 5, rep: 9, net: 5 }, repute: 4, bonheur: 7, pub: "🥇 $nom remporte le concours du meilleur apprenti." }, true),
        out((p) => ch(p) * 0.6 + 0.2, "Tu fais un beau parcours. On te remarque sans te couronner.", { pro: { skill: 4, rep: 3 }, bonheur: 3 }),
        out((p) => Math.max(0.05, 0.8 - ch(p)), "Le trac te joue des tours. Tu apprends à garder tes nerfs.", { pro: { skill: 2 }, bonheur: -2 }),
      ] });
}
P("a_embauche", "apprenti", "✅", "Demander à être embauché(e) à la fin", "Tu mets ton avenir sur la table. Ton patron peut dire oui, non ou « on verra ».",
  { need: Object.assign({}, appr, { nojob: true, ages: [17, 21] }), cool: 2, w: 7, risk: 1, fit: (p) => (S(p).net >= 10 ? 1.7 : 1),
    outs: [
      out((p) => clamp(0.45 + S(p).net * 0.006 + S(p).skill * 0.004, 0.2, 0.9), "Ton patron te propose un contrat. Tu entres dans la vie active avec un métier et un poste.", {
        job: (p) => { const T = (p.spe && p.spe.tracks.find((t) => FX.canWork(p, t))) || "commerce"; return { track: T, level: 0, mul: 1.05 }; }, pro: { rep: 3 }, bonheur: 6 }, true),
      out((p) => 0.4, "Ton patron n'a pas les moyens de t'embaucher, mais il te recommande à un confrère.", { pro: { net: 4 }, flag: { piston: 3 }, bonheur: 0 }),
    ] });
P("a_gratification", "apprenti", "💶", "Négocier une meilleure gratification", "Tu travailles beaucoup pour peu. Tu demandes, poliment, ce que ton travail vaut.",
  { need: appr, cool: 2, w: 5, risk: 1,
    outs: [out(0.5, "Ton patron cède. Un petit complément chaque mois et un regard plus respectueux.", { argent: 1800, pro: { rep: 2 }, bonheur: 3 }), out(0.5, "On te répond que l'apprentissage est un cadeau. Tu apprends à choisir tes combats.", { pro: { skill: 1 }, bonheur: -2 })] });

// ================= recherche d'activité =================
const nojob = { nojob: true, nostudy: true, noprison: true, retired: false, ages: [17, 72] };
P("c_cible", "chomage", "🎯", "Cibler tes candidatures dans ta spécialité", "Moins d'envois, mieux ciblés. Tu relis chaque annonce, tu adaptes chaque lettre.",
  { prio: 2, need: nojob, cool: 0, w: 14, risk: 0, scene: { id: "sys:jobhunt", vals: { reseau: 1 } }, fit: (p) => (p.spe || p.jobHistory.length ? 1.6 : 1) });
P("c_formation", "chomage", "📚", "Suivre une formation courte", "Quelques semaines pour remettre à niveau ta compétence ou en acquérir une nouvelle. Un certificat vaut mieux que des promesses.",
  { need: nojob, cost: 600, cool: 3, w: 8, risk: 0,
    outs: [out(0.85, "Ta formation débouche sur un certificat solide. Les recruteurs te regardent autrement.", { pro: { skill: 6, net: 2 }, flag: { formation_recente: 3 }, intel: 1, bonheur: 3 }, true), out(0.15, "Le formateur est mauvais, mais le certificat reste valable.", { pro: { skill: 3 }, flag: { formation_recente: 2 } })] });
P("c_benevolat", "chomage", "🤲", "Faire du bénévolat dans ton domaine", "Une association, un club, une petite entreprise qui a besoin de bras. Gratuit, utile, et plein de contacts.",
  { need: nojob, cool: 2, w: 7, risk: 0,
    outs: [out(0.8, "Le bénévolat te remet en selle. Une responsable te propose de te recommander, et ton moral remonte.", { pro: { skill: 3, net: 6, rep: 2 }, bonte: 2, bonheur: 4 }, true), out(0.2, "Tu travailles beaucoup sans rien récolter, sauf le plaisir d'être utile.", { pro: { skill: 2, net: 2 }, bonte: 1, bonheur: 2 })] });
P("c_contrats", "chomage", "🧾", "Enchaîner de petits contrats", "Une mission ici, un remplacement là. Ce n'est pas stable, mais ça paie et ça réchauffe le CV.",
  { need: nojob, cool: 1, w: 8, risk: 0, fit: (p) => (tier(p) <= 2 ? 1.6 : 0.4),
    outs: [out(0.75, "Les petits contrats s'enchaînent. Tu gagnes de quoi vivre et une réputation de personne fiable.", { argent: 6500, pro: { skill: 2, net: 3, rep: 1 }, sante: -1, bonheur: 0 }), out(0.25, "Un contrat est annulé sans préavis. Tu apprends à ne jamais compter sur une promesse verbale.", { argent: 3200, pro: { skill: 1 }, bonheur: -2 })] });
P("c_ancien", "chomage", "📞", "Reprendre contact avec un ancien employeur", "Tu n'as pas claqué la porte, tu as juste laissé le temps passer. Un appel, un café, un possible retour.",
  { need: nojob, cool: 3, w: 6, risk: 1, fit: (p) => (p.jobHistory.length ? 1.7 : 0),
    outs: [out(0.5, "Ton ancien patron t'accueille à bras ouverts. Il te reprend, à un meilleur poste que tu ne le craignais.", { jobHunt: true, pro: { net: 3, rep: 2 }, bonheur: 5 }, true), out(0.5, "Il n'a rien de disponible, mais il te recommande à des amis. C'est un début.", { pro: { net: 4 }, flag: { piston: 3 } })] });
P("c_salon", "chomage", "🏟️", "Aller à un salon de l'emploi", "Cent stands, mille CV, un buffet décevant. Quelques bonnes rencontres, avec un peu de chance.",
  { need: nojob, cool: 2, w: 6, risk: 0, scene: { id: "sys:jobhunt", vals: { reseau: 1 } }, fx: { pro: { net: 3 } } });

// ================= retraite active =================
const retired = { retired: true, noprison: true, ages: [58, 105] };
P("r_conseil", "retraite", "🧓", "Devenir conseiller dans ton ancien secteur", "Tu connais tous les pièges. Les jeunes boîtes paient pour les éviter.",
  { need: retired, cool: 2, w: 8, risk: 0, fit: (p) => (S(p).skill >= 15 || (p.exp && Object.values(p.exp).some((v) => v >= 8)) ? 1.7 : 0.8),
    outs: [out(0.8, "Tes conseils sont précieux. Des jeunes dirigeants t'écoutent comme un oracle et te payent pour ça.", { argent: (p) => Math.max(2500, sal(p, 0.15)), pro: { rep: 4, net: 3 }, bonheur: 5 }, true), out(0.2, "On t'écoute poliment et on fait l'inverse. Tu es quand même payé(e).", { argent: (p) => Math.max(1200, sal(p, 0.06)), bonheur: 0 })] });
P("r_transmettre", "retraite", "🎓", "Transmettre ton savoir à la nouvelle génération", "Un atelier, un cours, des rencontres avec des étudiants qui ne savent pas qu'ils t'écoutent.",
  { need: retired, cool: 2, w: 7, risk: 0,
    outs: [out(0.85, "Tes élèves boivent tes paroles. Plusieurs te donnent des nouvelles longtemps après, ce qui vaut tous les salaires.", { pro: { rep: 5, net: 3 }, bonte: 2, bonheur: 7, sante: 1 }, true), out(0.15, "Ils regardent leurs téléphones, mais l'un d'eux te remercie à la fin.", { pro: { rep: 1 }, bonheur: 3 })] });
P("r_gestion", "retraite", "🗂️", "Gérer tes placements avec attention", "Un an à suivre les marchés, à discuter avec ton conseiller et à ne pas céder à la panique.",
  { need: Object.assign({ money: [10000, null] }, retired), cool: 2, w: 6, risk: 1,
    outs: [out(0.6, "Ta gestion méthodique porte ses fruits. Tes économies tiennent mieux le coup que celles des autres.", { argent: (p) => Math.max(800, scale(p, 0.01, 800, 5000000)), pro: { skill: 2 }, bonheur: 2 }), out(0.4, "Les marchés font leur marché. Tu gardes ton calme, ce qui compte.", { prudent: 2, bonheur: 1 })] });
P("r_mi_temps", "retraite", "🕰️", "Reprendre une activité à temps partiel", "Pas par besoin, par goût. Un client fidèle, un ancien collègue ou un voisin qui t'appelle.",
  { need: retired, cool: 1, w: 7, risk: 0, fit: (p) => (tier(p) <= 2 ? 1.6 : 0.8),
    outs: [out(0.85, "Quelques jours par semaine suffisent pour arrondir tes fins de mois et garder le moral.", { argent: (p) => Math.max(3000, sal(p, 0.2)), pro: { net: 2 }, bonheur: 3, sante: -1 }), out(0.15, "Tu reprends vite goût aux réunions inutiles. Tu arrêtes au bout de trois mois.", { argent: 1200, bonheur: -1 })] });
P("r_jeune", "retraite", "🌱", "Financer le projet d'un jeune", "Un petit-neveu, une voisine, un ancien stagiaire avec une idée. Tu ouvres ton portefeuille.",
  { need: Object.assign({ money: [8000, null] }, retired), cost: (p) => clamp(Math.round(Math.max(0, net(p)) * 0.02 / 100) * 100, 2000, 400000), cool: 3, w: 5, risk: 2, fit: (p) => (p.traits.bonte >= 50 ? 1.6 : 0.8),
    outs: [out(0.3, "Le projet décolle. Le jeune te rembourse bien plus que tu n'avais investi et te remercie publiquement.", { argent: (p) => clamp(Math.round(Math.max(0, net(p)) * 0.06 / 100) * 100, 4000, 1200000), pro: { rep: 5 }, bonte: 2, bonheur: 8, pub: "🌱 $nom soutient un jeune entrepreneur, qui réussit." }, true), out(0.4, "Le projet tient debout sans éclat. Tu es fier(e) de lui.", { argent: (p) => clamp(Math.round(Math.max(0, net(p)) * 0.018 / 100) * 100, 1500, 400000), bonheur: 4 }), out(0.3, "L'argent est parti sans retour. Mais il t'a remercié(e) pour la confiance, et c'est déjà beaucoup.", { bonte: 1, bonheur: 1 })] });

// ================= détention =================
const cell = { prison: true };
P("pr_formation", "prison", "📘", "Suivre une formation professionnelle en détention", "Menuiserie, cuisine, informatique, bâtiment. Un certificat de plus pour préparer l'après.",
  { prio: 1, need: cell, cool: 2, w: 12, risk: 0, anywhere: true,
    outs: [out(0.85, "Tu décroches un vrai certificat. En prison, c'est rare, et à la sortie ce sera très utile.", { pro: { skill: 8, rep: 1 }, intel: 1, bonheur: 3, flag: { formation_recente: 6 } }, true), out(0.15, "Les cours sont irréguliers, mais tu t'accroches. L'effort finira par se voir.", { pro: { skill: 4 }, bonheur: 0 })] });
P("pr_reinsertion", "prison", "🧭", "Préparer ta réinsertion avec un conseiller", "Entretiens, projet de sortie, promesses d'employeurs. Un dossier solide aide aussi à obtenir des remises de peine.",
  { need: cell, cool: 2, w: 10, risk: 0, anywhere: true, hook: "goodbehavior",
    outs: [out(0.8, "Ton dossier de sortie est sérieux. Un employeur t'écrit pour t'attendre, et le juge note ton engagement.", { pro: { net: 4, rep: 2, heat: -10 }, honnete: 3, bonheur: 4 }, true), out(0.2, "Le conseiller est débordé et ne peut te recevoir que deux fois. Le dossier reste mince.", { pro: { net: 1, heat: -4 }, bonheur: -1 })] });
P("pr_contacts", "prison", "🕸️", "Nouer des contacts utiles en cellule", "On y croise des gens bien informés. Ils t'apprennent des choses qui ne s'enseignent pas à l'école, et que tu retiendras.",
  { need: cell, cool: 2, w: 6, risk: 2, anywhere: true, ill: true, tag: "mature",
    outs: [out(0.65, "Tu te fais respecter et tu repars avec une liste de noms. À la sortie, certaines portes s'ouvriront plus vite.", { pro: { net: 8, rep: 4, heat: 6 }, honnete: -3, bonheur: 0 }, true), out(0.35, "Tu te méfies et tu fais bien. Tu tiens ton rang sans t'engager.", { pro: { net: 2, rep: 1 }, prudent: 2 })] });
P("pr_dossier", "prison", "⚖️", "Travailler ton dossier juridique", "Livres de droit, courriers à l'avocat, appels à la commission. Un recours bien fait change parfois une peine.",
  { need: cell, cool: 3, w: 6, risk: 1, anywhere: true,
    outs: [out(0.35, "Ton recours aboutit. La peine est révisée et ton avocat a l'air presque admiratif.", { pro: { skill: 3 }, intel: 1, free: true, bonheur: 10, pub: "⚖️ $nom obtient une révision de sa peine." }, true), out(0.65, "Le recours est rejeté, mais tu en sors avec de vraies notions de droit.", { pro: { skill: 3 }, intel: 1, bonheur: 0 })] });

// ================= pour tout le monde =================
const adultNeed = { nostudy: true, noprison: true, ages: [19, 80] };
P("x_cv", "tous", "📄", "Refaire ton CV et ton profil en ligne", "Mettre en valeur tes réussites, enlever les erreurs de jeunesse, soigner la photo.",
  { need: Object.assign({ nojob: true }, adultNeed), cool: 3, w: 3, risk: 0,
    outs: [out(1, "Ton nouveau CV a fière allure. Les recruteurs réagissent plus vite et plus gentiment.", { pro: { net: 2, rep: 1 }, flag: { bilan_competences: 2 }, bonheur: 1 })] });
P("x_langue", "tous", "🗣️", "Apprendre une langue utile pour le travail", "Anglais des affaires, espagnol, allemand, mandarin. Quelques soirées par semaine pendant un an.",
  { need: adultNeed, cost: 500, cool: 3, w: 4, risk: 0,
    outs: [out(0.75, "Tu te débrouilles enfin dans la langue de tes futurs clients. Les offres plus internationales commencent à arriver.", { pro: { skill: 4, net: 3 }, intel: 1, bonheur: 2 }, true), out(0.25, "Tu apprends surtout à commander un café. C'est déjà ça.", { pro: { skill: 1 }, bonheur: 1 })] });
P("x_numerique", "tous", "💾", "Apprendre un outil numérique utile partout", "Tableur, outil de gestion, intelligence artificielle. Rien d'extraordinaire, mais tout le monde en a besoin.",
  { need: adultNeed, cost: 300, cool: 3, w: 4, risk: 0,
    outs: [out(0.85, "Tu gagnes du temps sur toutes tes tâches. Ton chef ne comprend pas comment tu fais, et ne pose pas de question.", { pro: { skill: 4 }, intel: 1, perf: 3 }, true), out(0.15, "L'outil est difficile à comprendre. Tu en tires au moins quelques raccourcis clavier.", { pro: { skill: 2 } })] });
}
