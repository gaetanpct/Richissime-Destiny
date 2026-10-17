// Onglet Professionnel. Métiers sérieux, chefs d'entreprise et indépendants.
const K = require("../prokit");
const { P, out, chance, fail, S, sal, scale, clamp, job, adult, net } = K;

const share = (ch, f) => (p) => (1 - ch(p)) * f;

// ---------- métier sérieux ----------
{
  const ch = chance(0.5, "intel", { net: 0.002, rep: 0.002 });
  P("b_dossier", "bureau", "📂", "Prendre en charge un dossier difficile", "Celui que personne ne veut. S'il aboutit, ton nom circule dans les couloirs. Sinon, on s'en souvient aussi.",
    { need: job({ ages: [22, 66] }), cool: 1, w: 9, risk: 2,
      outs: [
        out(ch, "Tu portes le dossier à bout de bras et il aboutit. Ton nom circule désormais dans les couloirs de l'entreprise.", { pro: { skill: 5, rep: 4 }, perf: 8, raise: 0.03, bonheur: 3, argent: (p) => sal(p, 0.05) }, true),
        out(share(ch, 0.6), "Le dossier se solde par un compromis. Rien de glorieux, mais personne ne t'en veut.", { pro: { skill: 2 }, perf: 2 }),
        out(share(ch, 0.4), "Le dossier t'échappe et ton chef te le fait remarquer, devant tout le monde.", { pro: { rep: -3 }, perf: -5, bonheur: -3, sante: -1 }),
      ] });
}
{
  const ch = chance(0.62, "intel");
  P("b_certif", "bureau", "🎖️", "Passer une certification de ton métier", "Un examen reconnu dans ta branche, quelques soirées de révision et 1 200 €. Elle rassure les recruteurs et ton patron.",
    { need: job({ ages: [21, 62] }), cost: 1200, cool: 3, w: 7, risk: 1,
      outs: [
        out(ch, "Tu décroches la certification du premier coup. Ton CV brille, ton patron aussi un peu.", { pro: { skill: 8, rep: 2 }, raise: 0.05, intel: 1, flag: { formation_recente: 3 } }, true),
        out(fail(ch), "Tu rates l'examen de peu, mais tu as appris l'essentiel. La prochaine fois sera la bonne.", { pro: { skill: 3 }, bonheur: -2 }),
      ] });
}
P("b_mentor", "bureau", "🧙", "Te trouver un mentor dans la maison", "Un ancien, un directeur, quelqu'un qui connaît les règles non écrites de l'entreprise.",
  { need: job({ ages: [20, 58] }), cool: 3, w: 7, risk: 0,
    outs: [
      out(0.65, "Un directeur te prend sous son aile. Il te raconte comment les choses se décident vraiment.", { pro: { skill: 3, net: 7 }, meet: "mentor", bonheur: 2 }, true),
      out(0.35, "Tu invites plusieurs seniors à déjeuner. L'un d'eux te donne de précieux conseils, les autres paient l'addition en soupirant.", { pro: { skill: 2, net: 3 }, argent: -80 }),
    ] });
{
  const ch = chance(0.5, "charme", { net: 0.002, rep: 0.002 });
  P("b_equipe", "bureau", "🧑‍🤝‍🧑", "Prendre la tête d'une petite équipe", "Plus de responsabilités, plus de réunions, et la chance de prouver que tu sais faire grandir les autres.",
    { need: job({ ages: [24, 62], exp: [2, null] }), cool: 3, w: 8, risk: 2,
      outs: [
        out((p) => ch(p) * 0.18, "Ton équipe devient un modèle pour toute la maison. La direction te propose un nouveau poste.", { promote: true, pro: { skill: 4, rep: 5 }, bonheur: 5, perf: 10 }, true),
        out((p) => ch(p) * 0.82, "Ton équipe tient bien, ton management aussi. Ta réputation de chef sérieux se bâtit.", { pro: { skill: 3, rep: 4 }, perf: 8, raise: 0.05, bonheur: 2 }),
        out(fail(ch), "L'équipe te résiste et un collaborateur démissionne. Tu apprends durement ce que manager veut dire.", { pro: { skill: 2, rep: -2 }, sante: -3, bonheur: -4, perf: -4 }),
      ] });
}
{
  const ch = chance(0.55, "sociable", { net: 0.001 });
  P("b_conference", "bureau", "🎤", "Intervenir dans une conférence de ton secteur", "Un pupitre, un micro, trois cents professionnels qui regardent leurs téléphones.",
    { need: job({ ages: [24, 68] }), cool: 3, w: 6, risk: 1,
      outs: [
        out(ch, "Ton intervention fait mouche. Des cartes de visite pleuvent et un journaliste te cite dans sa chronique.", { pro: { rep: 6, net: 6, skill: 2 }, bonheur: 3, meet: "colleague" }, true),
        out(fail(ch), "Le trac te trahit. Tu perds ton fil devant tout le monde, mais le café était très bon.", { pro: { rep: -2, net: 2 }, bonheur: -3 }),
      ] });
}
P("b_note", "bureau", "📝", "Rédiger une note stratégique pour la direction", "Dix pages denses qui disent ce que tout le monde pense tout bas. Elle peut te propulser ou te griller.",
  { need: job({ ages: [24, 66], exp: [1, null] }), cool: 3, w: 6, risk: 2,
    outs: [
      out((p) => chance(0.45, "intel", { net: 0.001 })(p), "La direction reprend tes idées presque mot pour mot. On te félicite, et on t'ajoute à la liste des gens qui comptent.", { pro: { skill: 3, rep: 5 }, raise: 0.04, perf: 6 }, true),
      out((p) => 0.4, "Ta note est lue, annotée et classée. Mais tes idées circulent.", { pro: { skill: 3, rep: 1 } }),
      out((p) => 0.15, "Ta franchise froisse un directeur. L'ambiance se rafraîchit dans ton service.", { pro: { rep: -3 }, perf: -5, bonheur: -3 }),
    ] });
P("b_conflit", "bureau", "🤝", "Désamorcer un conflit avec ton supérieur", "Un malentendu qui dure depuis des mois. Tu choisis la discussion avant que ça n'explose.",
  { need: job({ ages: [20, 66] }), cool: 2, w: 5, risk: 1, fit: (p) => (p.job && p.job.perf < 55 ? 1.8 : 0.8),
    outs: [
      out((p) => 0.5 + p.traits.sociable / 400, "Vous mettez les choses à plat autour d'un café. L'ambiance redevient respirable et ton chef te confie un dossier.", { pro: { net: 3, rep: 2 }, perf: 6, bonheur: 4 }),
      out((p) => 0.35, "La discussion est polie et ne règle pas grand-chose. Tu gagnes au moins un peu de calme.", { bonheur: 1, perf: 2 }),
      out((p) => 0.15, "Ton chef prend ça pour une attaque. Tu quittes son bureau avec un sourire figé.", { pro: { rep: -2 }, perf: -4, bonheur: -3 }),
    ] });
{
  const ch = chance(0.45, "courage", { net: 0.002, skill: 0.002 });
  P("b_expat", "bureau", "✈️", "Demander une mission à l'étranger", "Un an dans une filiale lointaine. Un autre fuseau horaire, une autre langue, une autre manière de travailler.",
    { need: job({ ages: [24, 56], exp: [2, null] }), cool: 5, w: 4, risk: 2,
      outs: [
        out(ch, "Tu pars pour une filiale à l'étranger. Tu en reviens plus compétent, mieux payé et avec un carnet d'adresses mondial.", { city: true, raise: 0.08, pro: { skill: 7, net: 6 }, bonheur: 4, courage: 3 }, true),
        out(fail(ch), "Ta demande est refusée, mais ton ambition est notée au dossier.", { pro: { rep: 1 }, ambition: 2 }),
      ] });
}
P("b_alerte", "bureau", "📣", "Signaler une pratique douteuse dans ton entreprise", "Tu as vu ce que tu n'aurais pas dû voir. Te taire est confortable, parler peut coûter cher.",
  { need: job({ ages: [22, 64] }), cool: 5, w: 4, risk: 3, fit: (p) => (p.traits.honnete >= 55 ? 2 : 0.5),
    outs: [
      out(0.4, "La direction te remercie et corrige le tir. Ta droiture est reconnue de tous, et c'est rare.", { pro: { rep: 7, skill: 2 }, honnete: 4, bonheur: 5, perf: 6 }, true),
      out(0.35, "Rien ne bouge officiellement, mais tu deviens l'homme ou la femme dont on se méfie. Les invitations au déjeuner se raréfient.", { pro: { net: -4, rep: 1 }, honnete: 3, perf: -8, bonheur: -3 }),
      out(0.25, "On te pousse vers la sortie avec un prétexte plausible. Tu pars la tête haute et le portefeuille léger.", { fire: true, pro: { rep: 4 }, honnete: 5, bonheur: -5, pub: "📣 $nom a été licencié(e) après avoir signalé des pratiques douteuses." }, true),
    ] });
P("b_arrondir", "bureau", "🧮", "Arranger les chiffres pour une grosse prime", "Une écriture comptable qui « anticipe » un contrat, un tableau un peu optimiste. Personne ne regarde jamais de près, jusqu'au jour où quelqu'un regarde.",
  { need: job({ ages: [24, 64], exp: [1, null] }), cool: 4, w: 3, risk: 3, ill: true, tag: "mature", fit: (p) => (p.traits.honnete < 50 ? 1.7 : 0.25),
    outs: [
      out((p) => 0.62 - S(p).heat * 0.004, "La prime tombe, personne ne pose de question. Tu respires.", { argent: (p) => sal(p, 0.3), pro: { heat: 14, rep: 1 }, honnete: -5, bonheur: 3 }),
      out((p) => 0.26 + S(p).heat * 0.003, "Un audit découvre la manipulation. Tu es remercié(e) sur-le-champ, sans lettre de recommandation.", { fire: true, pro: { rep: -8, heat: 12 }, honnete: -3, repute: -6, bonheur: -8, pub: "🧮 $nom est licencié(e) après la découverte de chiffres truqués." }, true),
      out((p) => 0.12 + S(p).heat * 0.002, "Le parquet s'en mêle. Procès, condamnation, et ton nom dans les journaux.", { prison: 2, fire: true, record: 1, pro: { rep: -12, heat: 20 }, repute: -12, bonheur: -10, pub: "🚔 $nom est condamné(e) pour fraude comptable." }, true),
    ] });
{
  const ch = chance(0.5, "charme", { rep: 0.003, skill: 0.002 });
  P("b_prime", "bureau", "💶", "Négocier une prime sur objectifs", "Tu mets tes résultats sur la table avant la période des bilans.",
    { need: job({ ages: [22, 66], exp: [1, null] }), cool: 2, w: 8, risk: 1,
      outs: [
        out(ch, "Ton patron cède. Une prime tombe et ton salaire de base monte un peu.", { argent: (p) => sal(p, 0.12), raise: 0.04, pro: { rep: 1 }, bonheur: 3 }),
        out(fail(ch), "On te répond que ce n'est pas le bon moment. Tu repars avec un sourire et rien d'autre.", { bonheur: -2, perf: -2 }),
      ] });
}
P("b_coach", "bureau", "🧭", "Prendre un coach de carrière", "Quelques séances pour clarifier tes ambitions, travailler ta posture et éviter les erreurs classiques.",
  { need: job({ ages: [24, 62] }), cost: 900, cool: 3, w: 5, risk: 0,
    outs: [
      out(0.2, "Le coach t'aide à saisir une opportunité que tu ne voyais pas. Une promotion arrive dans la foulée.", { promote: true, pro: { skill: 4, net: 2 }, bonheur: 4 }, true),
      out(0.8, "Tu apprends à parler de toi sans rougir ni gonfler les chiffres. Ça paie un peu partout.", { pro: { skill: 4, rep: 2 }, ambition: 2, bonheur: 2 }),
    ] });
P("b_reseau_pro", "bureau", "🪪", "T'inscrire dans une association professionnelle", "Un annuaire, des dîners mensuels et des gens qui se recommandent entre eux.",
  { need: job({ ages: [22, 68] }), cost: 300, cool: 4, w: 5, risk: 0,
    outs: [
      out(0.7, "Les dîners sont longs, mais les contacts sont solides. Un confrère te recommande pour un beau poste.", { pro: { net: 8, rep: 3 }, meet: "colleague", flag: { piston: 3 } }, true),
      out(0.3, "Tu paies ta cotisation et tu manges beaucoup de petits-fours. Rien d'autre.", { pro: { net: 2 }, bonheur: 1 }),
    ] });
P("b_cours_soir", "bureau", "🏫", "Donner des cours du soir dans ton domaine", "Transmettre ce que tu sais, rencontrer des futurs collègues et arrondir tes fins de mois.",
  { need: job({ ages: [25, 70], exp: [3, null] }), cool: 2, w: 5, risk: 0,
    outs: [
      out(0.75, "Tes élèves t'adorent. Tu en profites pour revoir tes bases, et deux d'entre eux te proposent un stage dans leur boîte.", { argent: (p) => sal(p, 0.05), pro: { skill: 3, net: 3, rep: 2 }, bonheur: 3, sante: -1 }),
      out(0.25, "La salle est à moitié vide et les élèves regardent leurs téléphones. Au moins, tu as été payé(e).", { argent: (p) => sal(p, 0.03), sante: -1 }),
    ] });

// ---------- chef d'entreprise ----------
const ent = { asset: "entreprise", nostudy: true, noprison: true, ages: [22, 85] };
const mul = (m) => ({ scaleAssets: { kind: "entreprise", mul: m } });
P("pa_bras_droit", "patron", "🧑‍💼", "Recruter un bras droit", "Un numéro deux qui connaît le métier et qui te libère du quotidien. Il coûte cher et il peut aussi partir chez un concurrent.",
  { need: ent, cost: (p) => clamp(Math.round(net(p) * 0.01 / 100) * 100, 3000, 60000), cool: 4, w: 9, risk: 1,
    outs: [
      out(0.6, "Ton bras droit est une trouvaille. L'entreprise tourne mieux, et toi aussi.", Object.assign({ pro: { skill: 4, net: 3 }, bonheur: 4, sante: 1 }, mul(1.12)), true),
      out(0.28, "Il fait le travail correctement, sans éclat. L'entreprise garde son rythme.", Object.assign({ pro: { skill: 1 } }, mul(1.03))),
      out(0.12, "Il s'en va chez un concurrent avec une partie de ton carnet d'adresses. Mauvaise pioche.", Object.assign({ pro: { net: -4, rep: -2 }, bonheur: -4 }, mul(0.96))),
    ] });
{
  const ch = chance(0.4, "charme", { rep: 0.004, skill: 0.003 });
  P("pa_levee", "patron", "🏦", "Lever des fonds auprès d'investisseurs", "Un dossier de présentation, des rendez-vous qui se ressemblent, et une part de ton entreprise en échange d'argent frais.",
    { need: Object.assign({ net: [30000, null] }, ent), cool: 4, w: 7, risk: 2,
      outs: [
        out(ch, "Les investisseurs signent. L'entreprise change d'échelle et ton carnet de contacts aussi.", Object.assign({ argent: (p) => scale(p, 0.15, 20000, 60000000), pro: { skill: 3, net: 6, rep: 4 }, bonheur: 4, pub: "🏦 L'entreprise de $nom lève des fonds auprès d'investisseurs." }, mul(1.2)), true),
        out(fail(ch), "Les rendez-vous s'enchaînent sans résultat. Tu en retiens tout de même de bons conseils.", { pro: { skill: 2, net: 2 }, bonheur: -2 }),
      ] });
}
{
  const ch = chance(0.4, "courage", { net: 0.002, skill: 0.003 });
  P("pa_export", "patron", "🌍", "Conquérir un marché à l'étranger", "Un salon professionnel, un distributeur local, des normes qui changent à chaque frontière.",
    { need: Object.assign({ net: [20000, null] }, ent), cost: (p) => clamp(Math.round(net(p) * 0.008 / 100) * 100, 2000, 80000), cool: 4, w: 6, risk: 3,
      outs: [
        out(ch, "Ton produit séduit les distributeurs étrangers. Les commandes dépassent toutes tes prévisions.", Object.assign({ pro: { skill: 4, net: 5, rep: 3 }, bonheur: 5 }, mul(1.3)), true),
        out((p) => (1 - ch(p)) * 0.6, "Le marché est plus dur que prévu. Tu repars avec quelques contrats modestes et beaucoup de factures de taxi.", Object.assign({ pro: { skill: 2, net: 2 } }, mul(1.02))),
        out((p) => (1 - ch(p)) * 0.4, "Un distributeur indélicat disparaît avec ton stock. Une leçon coûteuse sur la confiance.", Object.assign({ pro: { rep: -2 }, bonheur: -5 }, mul(0.88)), true),
      ] });
}
{
  const ch = chance(0.38, "creatif", { skill: 0.003 });
  P("pa_pivot", "patron", "🔀", "Changer de modèle économique", "Ton activité s'essouffle. Tu parles de « virage stratégique » à tes salariés, qui comprennent « on va devoir tout refaire ».",
    { need: ent, cool: 5, w: 4, risk: 3,
      outs: [
        out(ch, "Le virage réussit au-delà de tes espérances. Tu es cité en exemple dans les magazines.", Object.assign({ pro: { skill: 6, rep: 6 }, bonheur: 6, pub: "🔀 $nom réussit le pari de réinventer son entreprise." }, mul(1.35)), true),
        out(fail(ch), "Le virage est mal pris. Des clients historiques partent et la trésorerie fond.", Object.assign({ pro: { skill: 2, rep: -3 }, bonheur: -6, sante: -2 }, mul(0.8)), true),
      ] });
}
P("pa_rachat", "patron", "🤝", "Racheter un petit concurrent", "Il est en difficulté, tu as de la trésorerie. Absorber les clients, les équipes et les ennuis.",
  { need: Object.assign({ net: [60000, null] }, ent), cost: (p) => clamp(Math.round(net(p) * 0.06 / 100) * 100, 8000, 8000000), cool: 6, w: 5, risk: 2,
    outs: [
      out(0.55, "L'intégration se passe bien. Les clients restent, les équipes se mélangent et l'entreprise grandit d'un bloc.", Object.assign({ pro: { skill: 4, rep: 4, net: 3 }, bonheur: 3 }, mul(1.28)), true),
      out(0.45, "Les équipes ne se supportent pas et les clients s'évaporent. Le rachat coûte plus qu'il ne rapporte.", Object.assign({ pro: { skill: 3, rep: -2 }, bonheur: -5, sante: -3 }, mul(1.05)), true),
    ] });
P("pa_equipe", "patron", "🎉", "Soigner tes salariés", "Primes, jours de congé en plus, une vraie salle de pause. Tu fidélises, et tu profites aussi du café.",
  { need: ent, cost: (p) => clamp(Math.round(net(p) * 0.004 / 100) * 100, 1000, 40000), cool: 3, w: 6, risk: 0,
    outs: [
      out(0.8, "L'ambiance s'améliore, les départs se raréfient et les clients le sentent. L'entreprise tourne plus fort.", Object.assign({ pro: { rep: 4, net: 2 }, bonte: 2, bonheur: 4 }, mul(1.06))),
      out(0.2, "Tes salariés apprécient, mais le chiffre d'affaires n'en profite pas vraiment cette année.", { pro: { rep: 3 }, bonte: 2, bonheur: 3 }),
    ] });
P("pa_marque", "patron", "🏷️", "Investir dans ta marque", "Un logo repensé, une campagne, un stand tape-à-l'œil. Les clients se souviennent de ce qu'ils voient.",
  { need: ent, cost: (p) => clamp(Math.round(net(p) * 0.006 / 100) * 100, 1500, 90000), cool: 3, w: 6, risk: 1,
    outs: [
      out(0.62, "La marque devient reconnaissable. Les commandes suivent, les journalistes aussi.", Object.assign({ pro: { rep: 6, net: 3 }, repute: 3, bonheur: 3 }, mul(1.1)), true),
      out(0.38, "La campagne passe inaperçue. Tu gardes un très beau logo.", { pro: { rep: 1 }, bonheur: -1 }),
    ] });
P("pa_fisc", "patron", "📑", "Monter un montage fiscal très astucieux", "Une holding à l'étranger, des factures croisées, un comptable qui ne dort plus. Légal sur le papier, surtout.",
  { need: Object.assign({ net: [150000, null] }, ent), cool: 5, w: 3, risk: 3, ill: true, tag: "mature", fit: (p) => (p.traits.honnete < 55 ? 1.5 : 0.5),
    outs: [
      out((p) => 0.62 - S(p).heat * 0.004, "Le montage passe sous les radars. Tu économises beaucoup d'impôts et tu dors presque bien.", { argent: (p) => scale(p, 0.04, 8000, 20000000), pro: { heat: 14 }, honnete: -4, bonheur: 2 }),
      out((p) => 0.38 + S(p).heat * 0.003, "L'administration fiscale redresse tout, avec pénalités. Ton nom sort dans la presse économique.", { argent: (p) => -scale(p, 0.06, 15000, 30000000), pro: { rep: -6, heat: 10 }, repute: -6, bonheur: -6, pub: "📑 $nom subit un redressement fiscal retentissant." }, true),
    ] });
P("pa_vendre", "patron", "💼", "Mettre ton entreprise en vente", "Après tant d'années, tu rêves d'une plage. Les acheteurs sont nombreux, les prix moins.",
  { need: Object.assign({ ages: [45, 85] }, { asset: "entreprise", nostudy: true, noprison: true }), cool: 6, w: 3, risk: 1, fit: (p) => (p.age >= 58 ? 1.8 : 0.6),
    outs: [
      out(0.6, "Un groupe rachète ton entreprise à un bon prix. Tu empoches le fruit de ta vie de travail.", { sell: "entreprise", bonheur: 8, pro: { rep: 3 }, pub: "💼 $nom vend son entreprise à un grand groupe." }, true),
      out(0.4, "Les offres sont décevantes. Tu gardes ton entreprise et tu gagnes une meilleure vue sur sa valeur réelle.", { bonheur: -1, pro: { skill: 2 } }),
    ] });

// ---------- indépendant ----------
const li = { job: { track: "libre" }, nostudy: true, noprison: true, ages: [18, 80] };
{
  const ch = chance(0.45, "charme", { net: 0.003, rep: 0.003 });
  P("li_client", "libre", "🎯", "Décrocher un gros client", "Un contrat qui change ton année et peut-être ta vie. Il exige un devis solide et un sourire naturel.",
    { need: li, cool: 2, w: 9, risk: 2,
      outs: [
        out(ch, "Le gros client signe. Ton carnet de commandes est plein pour des mois et ta banque t'appelle « cher client ».", { raise: 0.15, argent: (p) => sal(p, 0.08), pro: { net: 4, rep: 3, skill: 2 }, bonheur: 5 }, true),
        out(fail(ch), "Le contrat part chez un concurrent moins cher. Tu apprends qu'on ne gagne pas toujours à la qualité.", { pro: { skill: 1 }, bonheur: -3 }),
      ] });
}
P("li_vitrine", "libre", "🖼️", "Soigner ta vitrine", "Site web, portfolio, témoignages de clients. Les gens te jugent avant de te parler.",
  { need: li, cost: 600, cool: 3, w: 6, risk: 0,
    outs: [out(0.85, "Ta vitrine rassure. Les demandes entrantes doublent et les clients arrivent déjà convaincus.", { pro: { rep: 5, net: 3 }, raise: 0.05, bonheur: 2 }, true), out(0.15, "Ton nouveau site est très beau et presque personne ne le visite.", { pro: { rep: 1 } })] });
{
  const ch = chance(0.55, "ambition", { rep: 0.004, net: 0.002 });
  P("li_tarifs", "libre", "🏷️", "Relever tes tarifs", "Tu osais à peine demander. Cette année, tu annonces tes nouveaux prix sans trembler.",
    { need: li, cool: 3, w: 7, risk: 2,
      outs: [
        out(ch, "La plupart de tes clients restent, et tu gagnes plus pour le même travail.", { raise: 0.12, pro: { rep: 2, skill: 1 }, bonheur: 3 }, true),
        out(fail(ch), "Des clients partent. Les autres rouspètent, mais restent. Tu perds un peu et tu apprends beaucoup.", { raise: -0.05, pro: { skill: 2 }, bonheur: -2 }),
      ] });
}
P("li_collectif", "libre", "🫂", "Rejoindre un collectif d'indépendants", "Des bureaux partagés, des projets menés à plusieurs et des déjeuners où l'on se recommande mutuellement.",
  { need: li, cost: 400, cool: 3, w: 6, risk: 0,
    outs: [out(0.8, "Le collectif devient ta deuxième famille de travail. Les recommandations circulent et la solitude s'efface.", { pro: { net: 8, skill: 2 }, bonheur: 4, sociable: 2 }, true), out(0.2, "Le collectif est surtout un lieu de discussions interminables. Tu t'y fais quand même un ami.", { pro: { net: 2 }, bonheur: 1 })] });
P("li_salarie", "libre", "👥", "Embaucher ton premier salarié", "Plus de travail, plus de responsabilités, plus de fiches de paie. Tu changes de catégorie.",
  { need: Object.assign({}, li, { job: { track: "libre", min: 1 } }), cost: 3500, cool: 5, w: 4, risk: 2,
    outs: [
      out(0.6, "Ton salarié est efficace. Tu peux accepter plus de clients et tu respires.", { raise: 0.14, pro: { skill: 3, rep: 2 }, bonheur: 4 }, true),
      out(0.4, "Le nouveau venu coûte plus qu'il ne rapporte. Tu ne regrettes pas l'expérience, mais tu comptes tes sous.", { raise: 0.02, pro: { skill: 3 }, bonheur: -2, sante: -1 }),
    ] });
P("li_niche", "libre", "🔭", "Te spécialiser dans une niche", "Plutôt que tout faire, devenir celui ou celle qu'on appelle pour une chose précise.",
  { need: li, cool: 4, w: 6, risk: 1,
    outs: [
      out(0.65, "Ta niche est étroite et rentable. Tu deviens une référence et tes tarifs suivent.", { raise: 0.1, pro: { skill: 6, rep: 4 }, bonheur: 3 }, true),
      out(0.35, "La niche est un peu trop étroite. Tu perds quelques clients avant d'en trouver de nouveaux.", { pro: { skill: 4 }, bonheur: -1 }),
    ] });
P("li_factures", "libre", "📬", "Courir après les factures impayées", "Relances, appels, lettres recommandées. Ingrat et indispensable.",
  { need: li, cool: 2, w: 5, risk: 0,
    outs: [
      out(0.7, "Les virements finissent par arriver. Ta trésorerie respire et ton moral aussi.", { argent: (p) => sal(p, 0.1), bonheur: 2, sante: -1 }),
      out(0.3, "Un client a disparu avec ta facture. Tu apprends à demander un acompte.", { argent: (p) => sal(p, 0.03), pro: { skill: 2 }, bonheur: -2 }),
    ] });
