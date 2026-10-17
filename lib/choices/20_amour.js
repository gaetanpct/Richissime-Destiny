// Amour, couple, famille. Chaque étape ouvre la suivante, rien ne reste bloqué.
// Rencontre, rendez-vous, couple, emménagement, demande en mariage, mariage, bébé.
const { reg, out, loveNpc, crushOf, partnerYears, kidsCount, tier, arc, sporty, charming } = require("../lifekit");
const C = require("../core");

const single = { single: true, noprison: true };
const noCrush = (p) => (crushOf(p) ? 0.18 : 1);
const ageFit = (p) => (p.age < 18 ? 0.5 : p.age < 45 ? 1.2 : p.age < 65 ? 0.9 : 0.7);
const NPC = (p, k) => C.findNpc(p, k)[0] || null;

// ---------- 1. rencontrer quelqu'un ----------
const MEET = [
  ["rencontre_appli", "S'inscrire sur une appli de rencontres", "📱", "Un profil, trois photos et une description qui ment un peu.", [18, 80], "sur une appli de rencontres", 0, (p) => ageFit(p)],
  ["rencontre_soiree", "Sortir en soirée", "🪩", "Une soirée, des gens, un buffet à protéger.", [16, 45], "pendant une soirée", 60, (p) => (p.traits.sociable >= 50 ? 1.5 : 0.8)],
  ["rencontre_rando", "Rejoindre un club de randonnée", "🥾", "Des cailloux, des bâtons et des regards qui se croisent au sommet.", [20, 85], "pendant une randonnée", 0, (p) => (sporty(p) ? 1.8 : 0.9)],
  ["rencontre_danse", "S'inscrire à des cours de danse", "💃", "Un pas en avant, deux pas sur les pieds de ton partenaire.", [18, 75], "pendant un cours de danse", 300, (p) => (charming(p) ? 1.4 : 0.9)],
  ["rencontre_speed", "Tenter un speed-dating", "⏱️", "Sept minutes pour séduire, sept minutes pour fuir.", [25, 65], "pendant un speed-dating", 40, () => 1],
  ["rencontre_asso", "T'engager dans une association", "🤲", "Tu donnes de ton temps, quelqu'un te donne un sourire.", [18, 88], "pendant une collecte de dons", 0, (p) => (p.traits.bonte >= 55 ? 1.6 : 0.9)],
  ["rencontre_entremise", "Laisser tes amis t'arranger un dîner", "🍽️", "Ils jurent que cette personne est parfaite, ce qui est inquiétant.", [20, 85], "pendant un dîner arrangé", 0, (p) => (C.hasRel(p, "friend") ? 1.3 : 0)],
  ["rencontre_bal", "Aller au bal du village", "🪗", "Un accordéon, du mousseux et une mazurka historique.", [45, 90], "pendant le bal du village", 20, (p) => (p.age >= 55 ? 1.8 : 0.8)],
  ["rencontre_coworking", "Te mettre au café-coworking du coin", "☕", "Du wifi, un oat latte à six euros et des regards derrière les écrans.", [22, 55], "dans un café-coworking", 30, (p) => (p.job ? 1.2 : 0.7)],
];
MEET.forEach(([id, l, ic, d, ages, lieu, cost, fit]) => reg({
  id, grp: "amour", l, ic, d, tag: undefined, need: Object.assign({ ages }, single), cost, w: 7, cool: 1,
  fit: (p) => noCrush(p) * fit(p),
  scene: { id: "love_rencontre", vals: { lieu } },
}));

// ---------- 2. proposer un rendez-vous ----------
reg({ id: "love_date", grp: "amour", prio: 2, cool: 0, w: 14, ic: "💌", need: Object.assign({ ages: [15, 95] }, single),
  fit: (p) => (crushOf(p) ? 1 : 0),
  l: (p) => "Proposer un rendez-vous à " + crushOf(p).name,
  d: (p) => "Tu as rencontré " + crushOf(p).name + ", c'est le moment de transformer l'essai. Un vrai rendez-vous, pas un message à moitié écrit.",
  scene: "love_date" });
reg({ id: "love_ex", grp: "amour", w: 4, ic: "📞", need: Object.assign({ ages: [20, 90] }, single), cool: 4,
  fit: (p) => (NPC(p, "ex") ? 1 : 0),
  l: (p) => "Reprendre contact avec " + NPC(p, "ex").name,
  d: "Une vieille histoire, un message un peu trop tard le soir.",
  scene: "love_ex" });

// ---------- 3. vie de couple ----------
const couple = { partner: true, noprison: true };
const hasNpcPartner = (p) => !!loveNpc(p);
const close = (p) => (loveNpc(p) ? loveNpc(p).close : 50);
const pname = (p) => (loveNpc(p) ? loveNpc(p).name : "ton ou ta partenaire");

reg({ id: "weekend_romantique", grp: "amour", w: 6, ic: "🥂", need: Object.assign({ ages: [18, 95] }, couple), cost: 400, cool: 2, fit: (p) => (hasNpcPartner(p) ? 1 : 0),
  l: (p) => "Un week-end romantique avec " + pname(p), d: "Un hôtel, un lit double et un peignoir pour deux.",
  outs: [out(0.7, "Le week-end est parfait. Vous revenez détendus, un peu gras et totalement amoureux.", { bonheur: 5, rel: { partner: 10 } }), out(0.2, "L'hôtel a perdu votre réservation. Vous finissez dans une cabane de jardinier au bord d'un lac. C'est le plus beau week-end de votre vie.", { bonheur: 7, rel: { partner: 14 }, creatif: 1 }, true), out(0.1, "Vous vous disputez pour savoir quelle route prendre, et ça dure tout le week-end. Le retour en voiture est silencieux.", { bonheur: -2, rel: { partner: -8 } })] });
reg({ id: "love_emmenager", grp: "amour", prio: 2, cool: 0, w: 12, ic: "🔑", need: Object.assign({ ages: [18, 90], noflag: "cohab" }, couple), fit: (p) => (hasNpcPartner(p) && partnerYears(p) >= 1 && close(p) >= 50 && p.partner.status === "couple" ? 1 : 0),
  l: (p) => "Emménager avec " + pname(p), d: "Deux brosses à dents dans le même verre, pour de bon.",
  scene: "love_emmenager" });
reg({ id: "love_demande", grp: "amour", prio: 2, cool: 0, w: 14, ic: "💍", need: Object.assign({ ages: [18, 95], noflag: "demande_refusee" }, couple), fit: (p) => (hasNpcPartner(p) && p.partner.status === "couple" && partnerYears(p) >= 1 && close(p) >= 55 ? 1 : 0),
  l: (p) => "Demander " + pname(p) + " en mariage", d: "Une bague, un genou à terre, ou n'importe quelle autre mise en scène qui ne finit pas aux urgences.",
  scene: "love_demande" });
reg({ id: "love_bebe", grp: "famille", prio: 1, cool: 1, w: 10, ic: "👶", need: Object.assign({ ages: [20, 44] }, couple), fit: (p) => (hasNpcPartner(p) && (p.partner.status === "marie" || (p.flags.cohab && partnerYears(p) >= 2)) && kidsCount(p) < 4 && close(p) >= 55 ? 1 : 0),
  l: "Essayer de fonder une famille", d: "Un berceau, des nuits blanches et un amour qui change de taille.",
  scene: "love_bebe" });
reg({ id: "love_adopter", grp: "famille", cool: 3, w: 4, ic: "🍼", need: Object.assign({ ages: [25, 55] }, couple), fit: (p) => (hasNpcPartner(p) && (p.partner.status === "marie" || p.flags.cohab) && kidsCount(p) < 3 && close(p) >= 60 && tier(p) >= 1 ? 1 : 0), cost: 3000,
  l: "Adopter un enfant", d: "Des dossiers, des visites, et un jour une petite voix qui t'appelle comme si de rien n'était.",
  scene: "love_adoption" });
reg({ id: "love_rupture", grp: "amour", cool: 1, w: 5, ic: "💔", need: Object.assign({ ages: [15, 95] }, couple), fit: (p) => (hasNpcPartner(p) && p.partner.status === "couple" ? (close(p) < 40 ? 6 : close(p) < 55 ? 1.2 : 0.12) : 0),
  l: (p) => "Rompre avec " + pname(p), d: "Parfois l'amour s'arrête avant le dernier métro.",
  scene: "love_rupture" });
reg({ id: "love_divorce", grp: "amour", cool: 1, w: 5, ic: "⚖️", need: Object.assign({ ages: [20, 95] }, couple), fit: (p) => (hasNpcPartner(p) && p.partner.status === "marie" ? (close(p) < 35 ? 7 : close(p) < 55 ? 1.2 : 0.08) : 0),
  l: (p) => "Divorcer de " + pname(p), d: "Des avocats, des cartons, et la question du chat.",
  scene: "love_divorce" });
reg({ id: "love_aventure", grp: "amour", tag: "mature", cool: 4, w: 3, ic: "🤫", need: Object.assign({ ages: [22, 70] }, couple), fit: (p) => (hasNpcPartner(p) && p.traits.honnete < 65 && close(p) < 75 ? 1 : 0),
  l: "Avoir une aventure en cachette", d: "Une mauvaise idée avec de beaux arguments.",
  outs: [out(0.55, "Personne ne se doute de rien. Tu as un secret qui te rend un peu plus vivant(e) et beaucoup plus inquiet(e).", { bonheur: 3, honnete: -5, charme: 1, sante: -1 }, true), out(0.45, "Un message envoyé à la mauvaise personne dévoile tout. Ton ou ta partenaire n'a pas apprécié le choix des emojis.", { rel: { partner: -35 }, honnete: -5, bonheur: -8, repute: -4 }, true)] });
reg({ id: "therapie_couple", grp: "amour", cool: 3, w: 5, ic: "🛋️", need: Object.assign({ ages: [22, 90] }, couple), cost: 600, fit: (p) => (hasNpcPartner(p) && close(p) < 60 ? 2.2 : hasNpcPartner(p) ? 0.15 : 0),
  l: "Consulter un thérapeute de couple", d: "Un fauteuil, un mouchoir et une phrase qui commence par « Moi je ressens ».",
  outs: [out(0.7, "Vous apprenez à vous parler sans vous couper. Vous découvrez qu'il y a eu un tiroir à chaussettes qui a causé trois disputes.", { rel: { partner: 14 }, bonheur: 3 }), out(0.3, "La thérapie vous fait comprendre que vous avez des projets différents. Ça fait mal, mais c'est utile.", { rel: { partner: 2 }, bonheur: -1 })] });
reg({ id: "surprise_couple", grp: "amour", cool: 2, w: 5, ic: "🎁", need: Object.assign({ ages: [16, 95] }, couple), cost: 150, fit: (p) => (hasNpcPartner(p) ? 1 : 0),
  l: (p) => "Préparer une surprise pour " + pname(p), d: "Un dîner-surprise ou une chasse au trésor, c'est selon le budget.",
  outs: [out(0.75, "La surprise fonctionne à merveille, ton ou ta partenaire a les yeux qui brillent et la bouche qui tremble.", { rel: { partner: 12 }, bonheur: 5 }), out(0.25, "La surprise est un fiasco, mais comme tout le monde finit par en rire, ça compte quand même.", { rel: { partner: 6 }, bonheur: 2 })] });
reg({ id: "renouveler_voeux", grp: "amour", cool: 6, w: 3, ic: "🎊", need: Object.assign({ ages: [40, 95], partner: "marie" }, { noprison: true }), cost: 2500, fit: (p) => (hasNpcPartner(p) && partnerYears(p) >= 10 && close(p) >= 60 ? 1 : 0),
  l: "Renouveler vos vœux de mariage", d: "Vingt ans après, le même oui, avec des invités qui ont pris de l'âge et du ventre.",
  outs: [out(1, "La cérémonie est pleine de larmes et de rires. Quelqu'un chante faux, mais personne n'ose le lui dire.", { rel: { partner: 14 }, bonheur: 7 }, true)] });

// ---------- 4. enfants et famille ----------
const hasKids = (p) => kidsCount(p) > 0;
reg({ id: "enfant_temps", grp: "famille", cool: 1, w: 7, ic: "🧸", need: { ages: [20, 70], noprison: true }, fit: (p) => (C.findNpc(p, "child").some((n) => n.age < 14) ? 1.8 : 0),
  l: "Passer du temps avec tes enfants", d: "Jeux de société, tartines brûlées et questions auxquelles personne n'a de réponse.",
  outs: [out(0.8, "Vous passez une année pleine de petits bonheurs. Le plus jeune a décidé que tu étais un héros.", { bonheur: 5, bonte: 2, rel: { enfant: 12 } }), out(0.2, "Tu perds à tous les jeux contre un enfant de six ans. Ça te vexe, mais tu rayonnes.", { bonheur: 4, rel: { enfant: 10 } })] });
reg({ id: "enfant_vacances", grp: "voyage", cool: 2, w: 5, ic: "🏖️", need: { ages: [24, 65], noprison: true }, cost: 2200, fit: (p) => (C.findNpc(p, "child").some((n) => n.age < 17) && tier(p) >= 2 ? 1.5 : 0),
  l: "Partir en vacances en famille", d: "Quatre valises, deux enfants, un chat qui n'a rien demandé.",
  outs: [out(0.7, "Vacances réussies, malgré l'embouteillage et la chanson qui tourne en boucle dans la voiture.", { bonheur: 6, rel: { enfant: 12 } }), out(0.3, "Le camping est inondé, la tente emporte le chat. Le chat revient, mais plus jamais pareil.", { bonheur: 2, rel: { enfant: 8 }, creatif: 1 })] });
reg({ id: "enfant_aider", grp: "famille", cool: 3, w: 5, ic: "🤝", need: { ages: [40, 95], noprison: true }, cost: 4000, fit: (p) => (C.findNpc(p, "child").some((n) => n.age >= 20) && tier(p) >= 2 ? 1.5 : 0),
  l: "Aider ton enfant à s'installer", d: "Un apport, un canapé, quelques conseils qu'il fera mine d'écouter.",
  outs: [out(1, "Ton enfant s'installe dans son premier logement. Il te remercie d'une voix tremblante, puis te demande de repartir avant les voisins.", { bonte: 3, bonheur: 4, rel: { enfant: 14 } })] });
reg({ id: "parents_aider", grp: "famille", cool: 2, w: 5, ic: "🏡", need: { ages: [25, 80], noprison: true }, cost: 1200, fit: (p) => (C.hasRel(p, "parent") ? 1.2 : 0),
  l: "Aider tes parents", d: "Une réparation, un dossier, ou simplement une présence.",
  outs: [out(0.8, "Tu passes l'année à réparer, aider, expliquer. Tes parents te regardent différemment, avec une tendresse qui ne dit pas son nom.", { bonte: 3, bonheur: 3, rel: { parent: 12 } }), out(0.2, "Ton père refuse toute aide, ta mère te prépare sept plats. Tu repars avec un surplus de gratitude.", { bonheur: 4, rel: { parent: 10 } })] });
reg({ id: "appeler_famille", grp: "famille", cool: 1, w: 4, ic: "📞", need: { ages: [14, 95], noprison: true }, fit: (p) => (C.hasRel(p, "family") ? 1 : 0),
  l: "Prendre des nouvelles de la famille", d: "Un appel, un déjeuner, et l'inévitable « tu manges bien ? ».",
  outs: [out(0.8, "Tu reprends contact avec tout le monde. La famille se réjouit et te donne des conseils non sollicités.", { bonheur: 3, rel: { family: 6 }, bonte: 1 }), out(0.2, "Un oncle lointain t'annonce qu'il a été candidat à une émission de cuisine. Tu es touché(e).", { bonheur: 4, rel: { family: 4 } })] });
reg({ id: "retrouvailles", grp: "social", cool: 3, w: 4, ic: "🍻", need: { ages: [20, 95], noprison: true }, fit: (p) => (C.hasRel(p, "friend") || C.hasRel(p, "bestfriend") ? 1.1 : 0),
  l: "Retrouver un ami perdu de vue", d: "Un message, un café, trois heures de souvenirs.",
  outs: [out(0.75, "Vous vous retrouvez comme si rien n'avait changé, mis à part le ventre et le vocabulaire.", { bonheur: 5, sociable: 2, rel: { friend: 14 } }), out(0.25, "Vous n'avez plus rien à vous dire, et vous passez la soirée à regarder vos téléphones. Mais au moins, c'est clair.", { bonheur: -1, rel: { friend: 3 } })] });
reg({ id: "chien", grp: "famille", cool: 6, w: 3, ic: "🐕", need: { ages: [12, 90], noprison: true }, cost: 600, fit: (p) => (C.hasRel(p, "pet") ? 0.15 : 1),
  l: "Adopter un chien", d: "Quatre pattes, une queue, un intérêt réel pour tes chaussettes.",
  outs: [out(1, "Un chien débarque dans ta vie avec un vrai talent pour détruire les coussins. Tu es désormais incapable de vivre sans lui.", { pet: 1, bonheur: 5, sport: 1 }, true)] });
reg({ id: "chat", grp: "famille", cool: 6, w: 3, ic: "🐈", need: { ages: [12, 95], noprison: true }, cost: 250, fit: (p) => (C.hasRel(p, "pet") ? 0.15 : 1),
  l: "Adopter un chat", d: "Un petit tyran poilu qui accepte de vivre chez toi.",
  outs: [out(1, "Un chat s'installe chez toi comme si tu étais son locataire. Il te méprise avec beaucoup d'élégance.", { pet: 1, bonheur: 4 }, true)] });
