// Onglet Professionnel. Métiers manuels et de service, métiers de création et de scène, sport et aventure.
const K = require("../prokit");
const { P, out, chance, fail, S, sal, scale, clamp, job, net, tier } = K;

const share = (ch, f) => (p) => (1 - ch(p)) * f;
const fitTrack = (list) => (p) => (p.job && list.includes(p.job.track) ? 1.9 : 1);

// ================= métiers manuels et de service =================
P("t_nuit", "terrain", "🌙", "Prendre les postes de nuit et de week-end", "Une meilleure paie, des horaires de chauve-souris et des amis qui ne comprennent plus quand tu dors.",
  { need: job({ ages: [18, 62] }), cool: 1, w: 8, risk: 1,
    outs: [
      out(0.8, "Les primes de nuit et de week-end gonflent ton salaire. Ton sommeil fait la grève.", { argent: (p) => sal(p, 0.14), pro: { skill: 1 }, sante: -3, bonheur: -2 }),
      out(0.2, "Un client difficile à trois heures du matin te donne la meilleure histoire de l'année, mais pas de pourboire.", { argent: (p) => sal(p, 0.08), pro: { skill: 2, rep: 1 }, sante: -2 }),
    ] });
{
  const ch = chance(0.62, "intel");
  P("t_qualif", "terrain", "🎓", "Passer une qualification de ton métier", "Un diplôme professionnel reconnu, quelques samedis sacrifiés et 800 €. Les employeurs paient mieux ceux qui ont un papier.",
    { need: job({ ages: [18, 62] }), cost: 800, cool: 3, w: 8, risk: 1,
      outs: [
        out(ch, "Tu décroches la qualification. Ton patron te regarde autrement et ta fiche de paie aussi.", { pro: { skill: 8, rep: 2 }, raise: 0.06, bonheur: 3, flag: { formation_recente: 3 } }, true),
        out(fail(ch), "Tu échoues à l'épreuve pratique à cause d'un détail ridicule. Tu repasseras, mais tu en sais plus qu'avant.", { pro: { skill: 3 }, bonheur: -2 }),
      ] });
}
{
  const ch = chance(0.55, "sociable", { skill: 0.003, rep: 0.003 });
  P("t_referent", "terrain", "🧢", "Devenir le référent de l'équipe", "Celui ou celle à qui l'on pose les questions, qui forme les nouveaux et ferme à clé le soir.",
    { need: job({ ages: [20, 62], exp: [2, null] }), cool: 3, w: 8, risk: 1,
      outs: [
        out((p) => ch(p) * 0.2, "Ta façon de tenir l'équipe n'échappe à personne. On te propose un poste de responsable.", { promote: true, pro: { skill: 3, rep: 4 }, bonheur: 4 }, true),
        out((p) => ch(p) * 0.8, "Les nouveaux t'appellent par ton prénom et le patron te fait confiance. Ta prime en profite.", { pro: { skill: 3, rep: 4 }, raise: 0.04, perf: 7, bonheur: 3 }),
        out(fail(ch), "Tu prends trop sur toi et tu t'épuises à courir derrière tout le monde.", { pro: { skill: 2 }, sante: -3, bonheur: -3, perf: 2 }),
      ] });
}
P("t_materiel", "terrain", "🧰", "Investir dans ton propre matériel", "Des outils pro à toi, un véhicule mieux équipé, une machine qui change tout. Ça se rembourse, ou pas.",
  { need: job({ ages: [20, 64] }), cost: 2500, cool: 4, w: 6, risk: 1,
    outs: [
      out(0.75, "Ton nouveau matériel te rend plus rapide et plus précis. Les clients le remarquent et ton chef aussi.", { pro: { skill: 3, rep: 2 }, raise: 0.08, perf: 6 }, true),
      out(0.25, "Le matériel est magnifique, ta productivité n'a pas bougé d'un millimètre.", { pro: { skill: 1 }, bonheur: 1 }),
    ] });
P("t_clientele", "terrain", "💞", "Te constituer une clientèle fidèle", "Se souvenir des prénoms, des préférences et des anniversaires. Ça prend du temps et ça se rentabilise toute la vie.",
  { need: job({ ages: [18, 70] }), cool: 2, w: 8, risk: 0, fit: fitTrack(["resto", "commerce", "hotel", "coiffeur", "patisserie", "vtc", "nuit", "sommelier"]),
    outs: [
      out(0.7, "Tes habitués te suivent partout, te recommandent à leurs amis et laissent des pourboires généreux.", { argent: (p) => sal(p, 0.07), pro: { net: 6, rep: 4 }, bonheur: 3, sociable: 1 }, true),
      out(0.3, "Les clients défilent sans s'attacher. Tu progresses dans la patience.", { pro: { net: 2, rep: 1 }, bonheur: 1 }),
    ] });
{
  const ch = chance(0.62, "courage", { skill: 0.003 });
  P("t_chantier_risque", "terrain", "⚠️", "Accepter le chantier le plus dangereux", "Mieux payé, plus tendu, avec un casque obligatoire et un chef qui ne sourit pas.",
    { need: job({ ages: [20, 56] }), cool: 2, w: 5, risk: 3, fit: fitTrack(["btp", "agri", "marin", "transport", "pompier", "militaire", "artisan"]),
      outs: [
        out(ch, "Tout se passe bien. La prime de risque est belle et ton nom devient celui qu'on cite quand il faut quelqu'un de fiable.", { argent: (p) => sal(p, 0.22), pro: { skill: 4, rep: 4 }, courage: 2, bonheur: 2 }, true),
        out((p) => (1 - ch(p)) * 0.7, "Un incident te vaut une belle frayeur et quelques jours d'arrêt. La prime est maigre.", { argent: (p) => sal(p, 0.06), pro: { skill: 2 }, sante: -6, bonheur: -3 }),
        out((p) => (1 - ch(p)) * 0.3, "Un accident te cloue au lit pour de longues semaines. Tu t'en sors, mais tu as eu très peur.", { sante: -16, pro: { skill: 1 }, bonheur: -6 }, true),
      ] });
}
P("t_atelier", "terrain", "🏪", "Ouvrir ton propre atelier ou ton commerce", "Un local, un prêt, une enseigne qui porte ton nom. Fini le patron, bonjour les impôts.",
  { need: job({ ages: [24, 58], exp: [3, null], money: [8000, null], noasset: "entreprise" }), cost: 8000, cool: 6, w: 4, risk: 3, fit: fitTrack(["resto", "commerce", "btp", "coiffeur", "patisserie", "artisan", "paysagiste", "hotel", "vtc"]),
    outs: [
      out((p) => clamp(0.4 + S(p).skill * 0.004 + S(p).net * 0.003, 0.2, 0.8), "Le local ne désemplit pas. Ton enseigne devient une adresse du quartier.", { job: { track: "libre", level: 1, mul: 1 }, item: { kind: "entreprise", name: "Ton atelier de quartier", value: 24000, income: 4500, upkeep: 1500 }, pro: { skill: 3, rep: 5, net: 3 }, bonheur: 6, pub: "🏪 $nom ouvre sa propre affaire." }, true),
      out((p) => 0.4, "L'activité démarre doucement. Tu travailles beaucoup, tu gagnes peu, mais c'est à toi.", { job: { track: "libre", level: 0, mul: 1 }, item: { kind: "entreprise", name: "Ton petit atelier", value: 11000, income: 800, upkeep: 900 }, pro: { skill: 3 }, bonheur: 2 }),
      out((p) => 0.2, "Le loyer et les charges t'étranglent. Tu fermes au bout de quelques mois avec une jolie dette.", { dette: 9000, pro: { skill: 2, rep: -2 }, bonheur: -8 }, true),
    ] });
P("t_apprenti", "terrain", "🧑‍🏫", "Former un apprenti", "Transmettre ton geste à un jeune qui t'écoute presque. Tu apprends à expliquer, ce qui revient à apprendre.",
  { need: job({ ages: [28, 68], exp: [4, null] }), cool: 3, w: 5, risk: 0,
    outs: [
      out(0.75, "Ton apprenti progresse et te remercie à sa façon. Ta réputation de bon formateur circule dans la profession.", { pro: { rep: 5, net: 3, skill: 2 }, bonte: 3, bonheur: 4 }, true),
      out(0.25, "Ton apprenti n'est pas fait pour le métier, mais tu gardes un joli souvenir d'élève.", { pro: { rep: 1 }, bonte: 1 }),
    ] });
{
  const ch = chance(0.42, "intel", { skill: 0.004 });
  P("t_concours", "terrain", "🏅", "Passer l'examen professionnel interne", "Une épreuve écrite, une épreuve pratique et un oral devant des gradés qui ne te lâchent pas des yeux.",
    { need: job({ ages: [21, 55], exp: [2, null] }), cool: 3, w: 6, risk: 2, fit: fitTrack(["ordre", "pompier", "militaire", "transport", "public", "enseignement"]),
      outs: [
        out(ch, "Tu es reçu(e) avec un bon classement. Un galon, une augmentation et quelques regards fiers.", { promote: true, pro: { skill: 4, rep: 3 }, bonheur: 5 }, true),
        out(fail(ch), "Tu échoues de peu. Ton dossier est noté pour la prochaine session.", { pro: { skill: 3 }, bonheur: -3 }),
      ] });
}
P("t_saison", "terrain", "🏖️", "Faire une saison dans un autre endroit", "Six mois sur la côte ou à la montagne. Du travail, du soleil ou de la neige, et de nouvelles têtes.",
  { need: job({ ages: [18, 50] }), cool: 4, w: 5, risk: 1, fit: fitTrack(["resto", "hotel", "agri", "nuit", "commerce", "coiffeur"]),
    outs: [
      out(0.7, "La saison est dure et belle. Tu reviens avec de l'argent de côté, une nouvelle ville dans le cœur et un carnet d'adresses élargi.", { city: true, argent: (p) => sal(p, 0.2), pro: { net: 5, skill: 2 }, bonheur: 5 }, true),
      out(0.3, "Le patron de la saison est un tyran. Tu supportes, tu gagnes de quoi tenir, tu repars sans regret.", { argent: (p) => sal(p, 0.1), pro: { skill: 2 }, bonheur: -2, sante: -2 }),
    ] });
{
  const ch = chance(0.4, "creatif", { skill: 0.004, rep: 0.003 });
  P("t_label", "terrain", "⭐", "Viser un label de qualité", "Un guide, une étoile, une distinction régionale. Les inspecteurs passent sans prévenir.",
    { need: job({ ages: [24, 66], exp: [3, null] }), cool: 4, w: 5, risk: 2, fit: fitTrack(["resto", "patisserie", "chocolatier", "sommelier", "agri", "artisan", "hotel", "coiffeur", "paysagiste"]),
      outs: [
        out(ch, "Le label tombe. Les réservations explosent et ton nom est cité dans la presse spécialisée.", { raise: 0.1, pro: { rep: 8, skill: 3, net: 3 }, repute: 3, bonheur: 6, pub: "⭐ $nom décroche une distinction de qualité." }, true),
        out(fail(ch), "L'inspecteur passe, goûte, note, et repart sans un mot. Tu attends les résultats avec angoisse, puis avec résignation.", { pro: { skill: 2 }, bonheur: -3 }),
      ] });
}

// ================= création et scène =================
{
  const ch = chance(0.35, "charme", { net: 0.004, rep: 0.004, skill: 0.003 });
  P("s_casting", "scene", "🎬", "Enchaîner les castings et les auditions", "Des couloirs d'attente, des numéros épinglés et la phrase « on vous rappellera ».",
    { need: job({ ages: [16, 62] }), cool: 1, w: 10, risk: 2,
      outs: [
        out((p) => ch(p) * 0.25, "Un rôle important t'est confié. Ton nom apparaît sur l'affiche et les propositions suivantes arrivent toutes seules.", { raise: 0.2, exp: 1, pro: { skill: 4, rep: 9, net: 4 }, repute: 4, bonheur: 7, pub: "🎬 $nom décroche un rôle important." }, true),
        out((p) => ch(p) * 0.75, "Tu décroches un petit rôle. Ce n'est pas la gloire, mais c'est ton nom au générique.", { argent: (p) => sal(p, 0.08), exp: 1, pro: { skill: 3, rep: 3, net: 3 }, bonheur: 3 }),
        out(fail(ch), "Les refus s'enchaînent. Tu apprends à encaisser, à sourire, et à changer de métro.", { pro: { skill: 2, net: 1 }, bonheur: -3 }),
      ] });
}
{
  const ch = chance(0.5, "charme", { net: 0.003, rep: 0.004 });
  P("s_agent", "scene", "📇", "Trouver un agent", "Quelqu'un qui défend tes intérêts et prend un pourcentage sur chaque contrat.",
    { need: job({ ages: [18, 66] }), cool: 5, w: 6, risk: 1, fit: (p) => (S(p).net >= 15 ? 1.5 : 0.8),
      outs: [
        out(ch, "Ton agent est excellent. Les contrats sont meilleurs, les négociations plus fermes et ton temps plus libre.", { raise: 0.12, pro: { net: 8, rep: 3, skill: 1 }, bonheur: 3 }, true),
        out(fail(ch), "Ton agent n'a pas le temps de s'occuper de toi, mais il prend quand même son pourcentage.", { argent: (p) => -sal(p, 0.03), pro: { net: 2 }, bonheur: -2 }),
      ] });
}
{
  const ch = chance(0.3, "creatif", { skill: 0.004, net: 0.002, rep: 0.003 });
  P("s_projet", "scene", "🎞️", "Monter un projet personnel", "Un court métrage, un album, une expo, un spectacle de ton cru. Tu y crois, ça te coûte cher.",
    { need: job({ ages: [18, 70] }), cost: 2500, cool: 3, w: 8, risk: 3,
      outs: [
        out((p) => ch(p) * 0.2, "Ton projet est repéré par un festival et la presse. Tout le monde te veut soudain.", { raise: 0.25, argent: (p) => sal(p, 0.15), pro: { skill: 5, rep: 12, net: 6 }, repute: 6, bonheur: 9, pub: "🌟 Le projet de $nom fait sensation." }, true),
        out((p) => ch(p) * 0.8 + 0.15, "Ton projet est salué par un public restreint et enthousiaste. Tu rentres dans tes frais, plus ou moins.", { pro: { skill: 4, rep: 4, net: 3 }, bonheur: 5, creatif: 2 }),
        out((p) => Math.max(0.05, 0.85 - ch(p) - 0.15), "Le projet passe inaperçu. Tu l'aimes encore plus que personne d'autre.", { pro: { skill: 3 }, bonheur: 1, creatif: 1 }),
      ] });
}
P("s_tournee", "scene", "🚐", "Partir en tournée ou en résidence", "Des villes que tu ne connaissais pas, des salles de taille variable et des hôtels de passage.",
  { need: job({ ages: [18, 64] }), cool: 3, w: 6, risk: 1,
    outs: [
      out(0.7, "La tournée est fatigante et belle. Tu reviens avec de l'argent, des contacts partout et un public qui sait ton nom.", { argent: (p) => sal(p, 0.15), pro: { net: 6, rep: 5, skill: 2 }, sante: -2, bonheur: 4 }, true),
      out(0.3, "Les salles sont à moitié vides et les hôtels trop chauds. La tournée n'est pas rentable, mais tu progresses.", { argent: (p) => sal(p, 0.02), pro: { skill: 4, net: 2 }, sante: -3, bonheur: -1 }),
    ] });
{
  const ch = chance(0.4, "sociable", { skill: 0.002 });
  P("s_communaute", "scene", "📱", "Construire ta communauté en ligne", "Publier tous les jours, répondre aux commentaires, ne pas lire les mauvais.",
    { need: job({ ages: [14, 60] }), cool: 2, w: 8, risk: 1,
      outs: [
        out((p) => ch(p) * 0.12, "Une de tes publications devient virale. Du jour au lendemain, des milliers de gens te suivent.", { raise: 0.18, pro: { rep: 9, net: 5 }, repute: 8, bonheur: 6, pub: "📱 $nom devient viral(e) du jour au lendemain." }, true),
        out((p) => ch(p) * 0.88 + 0.2, "Ta communauté grandit doucement, avec des fidèles qui commentent, partagent et achètent.", { argent: (p) => sal(p, 0.05), pro: { rep: 4, net: 3 }, repute: 2, bonheur: 2 }),
        out((p) => Math.max(0.05, 1 - ch(p) - 0.2), "Tu publies dans le vide. Le plus gros de ton public est ta tante, qui commente tout.", { pro: { skill: 1 }, bonheur: -1 }),
      ] });
}
P("s_maitre", "scene", "🧑‍🎨", "Prendre des cours avec un maître", "Un artiste reconnu accepte de te prendre en cours. Il est exigeant, souvent injuste et toujours instructif.",
  { need: job({ ages: [16, 70] }), cost: 1500, cool: 3, w: 6, risk: 0,
    outs: [
      out(0.8, "Le maître t'oblige à tout recommencer, puis à tout reprendre. Tu en sors méconnaissable et meilleur(e).", { pro: { skill: 9, net: 3 }, creatif: 3, bonheur: 2 }, true),
      out(0.2, "Le maître te trouve « sans promesse ». Tu travailles trois fois plus pour lui donner tort.", { pro: { skill: 6 }, creatif: 2, bonheur: -2, courage: 1 }),
    ] });
{
  const ch = chance(0.3, "creatif", { skill: 0.005, rep: 0.003 });
  P("s_festival", "scene", "🏆", "Se présenter à un festival ou à un concours", "Un jury, un public et une photo du lauréat dans le journal du lendemain.",
    { need: job({ ages: [16, 70] }), cool: 3, w: 7, risk: 2,
      outs: [
        out((p) => ch(p) * 0.4, "Tu remportes le prix. Les portes qui restaient fermées s'ouvrent comme par magie.", { raise: 0.2, argent: (p) => sal(p, 0.12), pro: { rep: 12, net: 6, skill: 3 }, repute: 6, bonheur: 8, pub: "🏆 $nom remporte un prix prestigieux." }, true),
        out((p) => ch(p) * 0.6 + 0.2, "Tu fais bonne figure sans gagner. Un directeur de théâtre ou de label note ton nom.", { pro: { rep: 4, net: 5, skill: 2 }, bonheur: 3 }),
        out((p) => Math.max(0.05, 0.8 - ch(p)), "Tu repars bredouille. Le prix revient à un cousin du président du jury.", { pro: { skill: 2 }, bonheur: -3 }),
      ] });
}
P("s_collab", "scene", "🤜", "Collaborer avec une figure du milieu", "Un nom connu accepte de travailler avec toi. Tu apprends beaucoup et tu risques d'être éclipsé(e).",
  { need: job({ ages: [18, 66] }), cool: 3, w: 5, risk: 2, fit: (p) => (S(p).net >= 12 || S(p).rep >= 12 ? 1.6 : 0.6),
    outs: [
      out(0.6, "Ta collaboration remporte un franc succès. Les deux noms sont sur l'affiche, et le tien s'en trouve valorisé.", { pro: { net: 6, rep: 7, skill: 3 }, repute: 3, bonheur: 5 }, true),
      out(0.4, "La star prend toute la lumière. Mais tu as appris beaucoup à son contact.", { pro: { net: 3, skill: 4 }, bonheur: 0 }),
    ] });
P("s_alimentaire", "scene", "💰", "Accepter une commande alimentaire bien payée", "Une publicité, un jingle, un contrat « pour la maison ». Pas ton rêve, mais le loyer sera payé.",
  { need: job({ ages: [18, 66] }), cool: 1, w: 8, risk: 1, fit: (p) => (tier(p) <= 2 ? 1.5 : 0.5),
    outs: [
      out(0.75, "La commande est bien payée et vite oubliée. Ton compte en banque respire, ta fierté un peu moins.", { argent: (p) => sal(p, 0.2), pro: { skill: 1, net: 1 }, creatif: -1, bonheur: -1 }),
      out(0.25, "La commande te vaut un client fidèle qui t'en proposera d'autres. Tu fais ton deuil de l'originalité.", { argent: (p) => sal(p, 0.28), pro: { net: 3, rep: 1 }, creatif: -2, bonheur: 0 }),
    ] });
P("s_polemique", "scene", "🔥", "Provoquer la polémique", "Une phrase, un geste, une œuvre qui dérange. Tout le monde en parle, le meilleur et le pire se mélangent.",
  { need: job({ ages: [18, 66] }), cool: 4, w: 3, risk: 3, tag: "loufoque", fit: (p) => (p.traits.courage >= 55 ? 1.7 : 0.5),
    outs: [
      out(0.4, "Le scandale te propulse. Tu es invité(e) partout, on te déteste ou on t'adore et tes tarifs montent.", { raise: 0.2, pro: { rep: 5, net: 4 }, repute: 6, bonheur: 4, pub: "🔥 $nom fait scandale et attire tous les regards." }, true),
      out(0.35, "On te boude pendant quelques mois, puis on oublie. Ton nom est devenu un peu connu.", { pro: { rep: 1 }, repute: 1, bonheur: -2 }),
      out(0.25, "Des partenaires prennent leurs distances. Tu paies cher ta provocation.", { raise: -0.08, pro: { rep: -6, net: -5 }, repute: -6, bonheur: -6 }, true),
    ] });
P("s_ateliers", "scene", "🧑‍🏫", "Animer des ateliers", "Initier des débutants à ce que tu fais. Le plaisir de transmettre, avec de la craie sur les doigts.",
  { need: job({ ages: [20, 75], exp: [2, null] }), cool: 2, w: 5, risk: 0,
    outs: [
      out(0.8, "Tes ateliers sont complets. Quelques élèves deviennent des fidèles et des amis.", { argent: (p) => sal(p, 0.07), pro: { net: 4, rep: 3, skill: 2 }, bonte: 2, bonheur: 4 }),
      out(0.2, "Tes élèves sont dissipés mais généreux. Tu retiens deux ou trois idées en les regardant.", { argent: (p) => sal(p, 0.04), pro: { skill: 2 }, bonheur: 1 }),
    ] });
P("s_mecene", "scene", "🏛️", "Chercher un mécène", "Un dîner, un dossier, un portefeuille qui s'ouvre. Il y a des gens riches qui aiment avoir un artiste dans leur salon.",
  { need: job({ ages: [20, 75] }), cool: 4, w: 5, risk: 1, fit: (p) => (S(p).net >= 12 ? 1.7 : 0.8),
    outs: [
      out((p) => clamp(0.35 + S(p).net * 0.004 + S(p).rep * 0.004, 0.2, 0.8), "Un mécène te soutient. Tu travailles l'esprit libre pendant un an, et ton œuvre y gagne.", { argent: (p) => sal(p, 0.35), pro: { skill: 4, rep: 4, net: 4 }, bonheur: 5 }, true),
      out((p) => 0.4, "Le mécène t'invite, t'écoute, te félicite, et ne signe rien.", { pro: { net: 3 }, bonheur: -1 }),
    ] });
{
  const ch = chance(0.4, "ambition", { net: 0.003, rep: 0.003 });
  P("s_contrat", "scene", "📃", "Signer avec une grande maison", "Un label, un studio, une chaîne ou une maison d'édition. Plus de moyens, moins de liberté.",
    { need: job({ ages: [18, 60] }), cool: 5, w: 4, risk: 2, fit: (p) => (S(p).rep >= 20 ? 2 : 0.4),
      outs: [
        out(ch, "La grande maison te donne des moyens que tu n'avais jamais eus. Ta notoriété bondit.", { raise: 0.3, pro: { rep: 8, net: 5, skill: 3 }, repute: 5, bonheur: 6, pub: "📃 $nom signe avec une grande maison." }, true),
        out(fail(ch), "Les exigences de la maison te pèsent. Tu gagnes plus et tu t'amuses beaucoup moins.", { raise: 0.15, pro: { rep: 2 }, creatif: -3, bonheur: -4 }),
      ] });
}

// ================= sport et aventure =================
P("sp_prepa", "sport", "🏋️", "Tout donner à la préparation physique", "Un programme de pro, des séances à l'aube et un corps qu'on écoute à peine.",
  { need: job({ ages: [16, 42] }), cool: 1, w: 9, risk: 2,
    outs: [
      out(0.78, "Ton corps répond. Tu gagnes en puissance et en endurance, et les chronos suivent.", { sport: 5, pro: { skill: 5 }, perf: 6, sante: 1, bonheur: 2 }, true),
      out(0.22, "Tu forces trop. Une blessure te rappelle que le corps a toujours le dernier mot.", { sport: 1, pro: { skill: 2 }, sante: -8, bonheur: -4 }, true),
    ] });
P("sp_soins", "sport", "🩹", "Soigner une vieille blessure", "Kiné, imagerie, repos forcé. Pas glorieux, mais utile pour durer.",
  { need: job({ ages: [18, 55] }), cost: 1200, cool: 2, w: 6, risk: 0, fit: (p) => (p.stats.sante < 70 ? 1.8 : 0.7),
    outs: [out(0.85, "Le traitement fonctionne. Tu retrouves des sensations oubliées et un calendrier moins stressant.", { sante: 7, sport: 2, pro: { skill: 2 }, bonheur: 3 }), out(0.15, "La guérison est lente. Tu apprends la patience, ce qui n'était pas prévu.", { sante: 3, bonheur: -1 })] });
{
  const ch = chance(0.4, "ambition", { skill: 0.004, rep: 0.004, net: 0.003 });
  P("sp_contrat", "sport", "✍️", "Négocier un nouveau contrat ou un transfert", "Ton agent, un directeur sportif et trois clubs qui font semblant de ne pas se parler.",
    { need: job({ ages: [17, 40] }), cool: 3, w: 8, risk: 2,
      outs: [
        out(ch, "Un meilleur club te veut. Ton nouveau contrat te permet de franchir un cap, en salaire comme en visibilité.", { raise: 0.25, city: true, pro: { rep: 6, net: 4, skill: 2 }, bonheur: 5, pub: "✍️ $nom signe un contrat plus prestigieux." }, true),
        out(fail(ch), "Aucun club ne s'engage. Tu restes où tu es, avec une prolongation moins avantageuse.", { raise: -0.03, pro: { net: 1 }, bonheur: -3 }),
      ] });
}
P("sp_sponsor", "sport", "🧢", "Chercher un sponsor", "Une marque qui colle son logo sur ton maillot en échange d'argent et d'apparitions.",
  { need: job({ ages: [16, 45] }), cool: 3, w: 6, risk: 1, fit: (p) => (S(p).rep >= 8 ? 1.5 : 0.7),
    outs: [
      out((p) => clamp(0.35 + S(p).rep * 0.005 + (p.stats.charme - 50) / 250, 0.15, 0.8), "Une marque te sponsorise. Tes revenus montent et ton visage est partout.", { argent: (p) => sal(p, 0.25), pro: { rep: 5, net: 3 }, repute: 3, bonheur: 4 }, true),
      out((p) => 0.3, "Les marques te trouvent « prometteur(se) » et ne signent pas. Tu continues de payer ton matériel.", { pro: { net: 2 }, bonheur: -1 }),
    ] });
P("sp_mental", "sport", "🧘", "Travailler avec un préparateur mental", "Respiration, visualisation et gestion des gros moments. Beaucoup d'athlètes jurent que tout se joue là.",
  { need: job({ ages: [16, 55] }), cost: 700, cool: 2, w: 6, risk: 0,
    outs: [out(0.8, "Tes nerfs tiennent mieux sous pression. Les moments qui comptent deviennent un terrain de jeu.", { pro: { skill: 5 }, courage: 2, perf: 6, bonheur: 3 }, true), out(0.2, "Tu retiens deux techniques utiles. Le reste ressemble à de la sophrologie pour grands sportifs.", { pro: { skill: 2 }, bonheur: 1 })] });
P("sp_capitaine", "sport", "🎽", "Prendre le brassard de capitaine", "Parler aux arbitres, aux jeunes et au vestiaire quand ça va mal.",
  { need: job({ ages: [22, 42], exp: [3, null] }), cool: 4, w: 5, risk: 1,
    outs: [out(0.7, "Le vestiaire te suit. Ton leadership transforme l'équipe, et le public te le rend bien.", { pro: { rep: 6, net: 3, skill: 2 }, repute: 3, bonheur: 4, perf: 6 }, true), out(0.3, "Le brassard est lourd. Un conflit de vestiaire t'use plus que les matchs.", { pro: { rep: 1, skill: 2 }, bonheur: -3, sante: -1 })] });
P("sp_reconversion", "sport", "🔄", "Préparer ta reconversion", "Un diplôme d'entraîneur, un réseau hors du terrain, un plan B avant que le corps ne décide pour toi.",
  { need: job({ ages: [28, 60] }), cost: 1500, cool: 3, w: 6, risk: 0, fit: (p) => (p.age >= 32 ? 2 : 0.4),
    outs: [out(0.85, "Tu passes les diplômes et tu te fais un nom chez les jeunes. Quand la carrière s'arrêtera, tu ne tomberas pas dans le vide.", { pro: { skill: 4, net: 6, rep: 2 }, intel: 1, flag: { reconversion: 12 }, bonheur: 3 }, true), out(0.15, "Les cours sont ennuyeux, mais le diplôme est dans la poche.", { pro: { skill: 3, net: 2 }, bonheur: 0 })] });
{
  const ch = chance(0.3, "sport", { skill: 0.005, rep: 0.002 });
  P("sp_grand_rdv", "sport", "🥇", "Viser le grand rendez-vous de l'année", "Championnat, finale, course mythique. Toute ta saison converge vers un seul jour.",
    { need: job({ ages: [17, 42] }), cool: 2, w: 8, risk: 3,
      outs: [
        out((p) => ch(p) * 0.3, "Tu le fais. Le jour J, tout s'aligne, et tu réalises l'exploit dont tu rêvais depuis l'enfance.", { raise: 0.3, argent: (p) => sal(p, 0.25), pro: { rep: 14, net: 5, skill: 3 }, repute: 8, bonheur: 10, pub: "🥇 $nom réalise l'exploit de sa carrière." }, true),
        out((p) => ch(p) * 0.7 + 0.2, "Tu fais une belle course. Pas de titre, mais de la fierté et des sponsors rassurés.", { pro: { rep: 4, skill: 3 }, repute: 2, bonheur: 3 }),
        out((p) => Math.max(0.05, 0.8 - ch(p)), "Le jour J, rien ne va. Tu passes l'hiver à te demander pourquoi.", { pro: { rep: -1, skill: 2 }, bonheur: -5 }),
      ] });
}
P("sp_raccourci", "sport", "💉", "Prendre un raccourci douteux", "Un produit, un médecin discret, une promesse de performances. Les contrôles sont de plus en plus fins.",
  { need: job({ ages: [18, 40] }), cool: 4, w: 2, risk: 3, ill: true, tag: "mature", fit: (p) => (p.traits.honnete < 45 ? 1.8 : 0.2),
    outs: [
      out((p) => 0.6 - S(p).heat * 0.004, "Tes performances décollent. Personne ne se pose de questions, et ta fiche de paie non plus.", { sport: 6, raise: 0.15, pro: { skill: 4, heat: 16 }, honnete: -5, sante: -4, bonheur: 3 }),
      out((p) => 0.4 + S(p).heat * 0.003, "Un contrôle te rattrape. Suspension, titres retirés et sponsors qui s'éclipsent. Le monde du sport ne pardonne pas.", { fire: true, pro: { rep: -14, heat: 8 }, honnete: -4, repute: -12, bonheur: -9, pub: "💉 $nom est suspendu(e) pour dopage." }, true),
    ] });
