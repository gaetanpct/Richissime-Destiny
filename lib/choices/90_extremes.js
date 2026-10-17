// Fichier regroupé. Des vies hors norme, empire et cartels, passions.
// ---------- 90_extremes ----------
{
// Des vies qui sortent de la moyenne. Paris fous, emprunts démesurés, monde de la mafia et de ses longues peines.
const { reg, out, tier, net } = require("../lifekit");
const C = require("../core");

const adult = { ages: [20, 82], nostudy: true, noprison: true, school: false };
const bold = (p) => (p.traits.courage >= 55 ? 1.4 : 0.9);
const crooked = (p) => (p.traits.honnete < 45 ? 1.9 : p.traits.honnete < 65 ? 0.9 : 0.25);
const stake = (p) => Math.max(1500, Math.round(Math.max(p.cash, 0) * 0.8));
const cap = (n, m) => Math.round(Math.min(m, n));

reg({ id: "pari_fou", grp: "argent", l: "Tout miser sur une idée folle", ic: "🎰", d: "Tu mets presque tout ton argent liquide sur une idée que personne ne comprend. Une fois sur quarante, elle change ta vie. Le plus souvent, elle te la complique.",
  need: Object.assign({ money: [3000, null] }, adult), cool: 6, w: 5, j: true, fit: (p) => (p.traits.courage >= 45 ? 1.4 * bold(p) : 0.5),
  outs: [
    out(0.03, "L'impossible arrive. Ton idée devient une entreprise colossale, le genre dont on parle dans les écoles de commerce. Tu n'as plus jamais besoin de regarder le prix de rien.",
      { argent: (p) => -stake(p), item: { kind: "entreprise", name: "Empire né d'une idée folle", value: (p) => cap(Math.max(3000000, stake(p) * 120 + Math.max(0, net(p)) * 4), 2500000000) }, repute: 20, bonheur: 14, ambition: 6, pub: "🦄 $nom a tout misé sur une idée folle, et gagné." }, true),
    out(0.17, "Ton pari paie bien. Tu triples ta mise et tu t'offres un dîner dont tu te souviendras.", { argent: (p) => stake(p) * 2, bonheur: 7, courage: 2 }),
    out(0.4, "Ça marche à moitié. Tu récupères la moitié de ta mise et une belle histoire.", { argent: (p) => -Math.round(stake(p) / 2), bonheur: -2, courage: 2 }),
    out(0.4, "Tout est perdu. L'idée était brillante, le marché n'a jamais suivi.", { argent: (p) => -stake(p), bonheur: -8, prudent: 3 }, true),
  ] });

reg({ id: "emprunt_demesure", grp: "argent", l: "Emprunter énormément pour spéculer", ic: "💣", d: "Un prêt géant, une position à effet de levier. Si ça marche, tu changes de catégorie. Si ça rate, la dette te suit toute ta vie.",
  need: Object.assign({ net: [20000, null], ages: [24, 70] }, { nostudy: true, noprison: true, school: false }), cool: 8, w: 3, j: true,
  fit: (p) => (p.traits.courage >= 55 && p.traits.prudent < 60 ? 1.6 : 0.4),
  outs: [
    out(0.06, "Le coup de poker du siècle. Ton levier explose le plafond, tu rembourses tout, et il reste une fortune.", { argent: (p) => cap(Math.max(250000, net(p) * 12), 900000000), bonheur: 12, repute: 8, pub: "🚀 $nom empoche une fortune après un pari à effet de levier." }, true),
    out(0.34, "Le pari rapporte, sans miracle. Tu rembourses l'emprunt et tu gardes un joli bénéfice.", { argent: (p) => cap(Math.max(15000, net(p) * 0.6), 4000000), bonheur: 4 }),
    out(0.6, "Le marché se retourne. La banque te réclame tout, et les intérêts continuent de courir.", { dette: (p) => cap(Math.max(60000, net(p) * 3), 80000000), bonheur: -12, repute: -3, prudent: 4 }, true),
  ] });

reg({ id: "entrer_mafia", grp: "argent", l: "Rejoindre une organisation criminelle", ic: "🕴️", d: "Quelqu'un te propose de rejoindre la famille. L'argent coule vite, les amis sont fidèles, et le jour où la police frappe, on t'oublie longtemps dans une cellule.", tag: "mature",
  need: Object.assign({ noflag: ["mafia", "parrain"] }, adult, { ages: [18, 60] }), cool: 8, w: 5, j: true, fit: (p) => (C.hasFlag(p, "mafia") || C.hasFlag(p, "parrain") ? 0 : crooked(p) * (tier(p) <= 1 ? 1.5 : 1)),
  outs: [
    out(0.5, "On t'accueille avec un dîner silencieux. Tu es désormais dans la famille. Tu as de l'argent liquide, des obligations, et des amis qui ne posent pas de question.", { argent: 12000, honnete: -10, repute: -3, bonheur: 3, flag: "mafia" }, true),
    out(0.3, "On te teste, puis on te laisse tranquille. Tu n'es pas retenu, mais tu gardes un petit billet.", { argent: 3000, honnete: -3 }),
    out(0.2, "Le dîner était piégé, la police était assise à la table d'à côté. Tu passes quelques années en prison.", { prison: 4, honnete: -6, repute: -10, bonheur: -8 }, true),
  ] });

reg({ id: "monter_en_grade", grp: "argent", l: "Grimper dans la famille", ic: "🪜", d: "Tu veux plus de territoire, plus de respect, plus de coups à jouer. Le sommet est un poste de parrain, et le prix de la chute est énorme.", tag: "mature", prio: 1,
  need: Object.assign({ flag: "mafia" }, { noprison: true, nostudy: true, ages: [20, 80] }), cool: 4, w: 14, j: true, fit: (p) => (C.hasFlag(p, "mafia") && !C.hasFlag(p, "parrain") ? 2 : 0),
  outs: [
    out(0.45, "Le vieux parrain s'efface, tu prends sa place. Désormais on baisse les yeux quand tu passes. Les gains sont immenses, et les années à prévoir en prison aussi.", { argent: (p) => cap(Math.max(60000, net(p) * 0.1), 30000000), honnete: -8, repute: -4, flag: "parrain", unflag: "mafia" }, true),
    out(0.4, "Tu prends du galon et des responsabilités. Rien de définitif, mais les poches se remplissent.", { argent: 30000, honnete: -4 }),
    out(0.15, "Un rival te dénonce. Perquisition, procès, verdict lourd.", { prison: 9, honnete: -4, repute: -12, bonheur: -10 }, true),
  ] });

reg({ id: "quitter_mafia", grp: "argent", l: "Tourner la page de la famille", ic: "🚪", d: "Tu dis que c'est fini. Certains te laissent partir, d'autres te le font payer.", tag: "mature", prio: 1,
  need: { noprison: true, nostudy: true, ages: [20, 90] }, cool: 3, w: 8, fit: (p) => ((C.hasFlag(p, "mafia") || C.hasFlag(p, "parrain")) && (p.mem.jailYears > 0 || p.age > 45) ? 1.6 : (C.hasFlag(p, "mafia") || C.hasFlag(p, "parrain")) ? 0.5 : 0),
  outs: [
    out(0.55, "On te laisse partir, avec un regard qui dit tout. Tu changes de ville et tu dors enfin.", { unflag: ["mafia", "parrain"], honnete: 6, bonheur: 8, repute: 2 }, true),
    out(0.3, "On te laisse partir, mais pas sans une facture lourde.", { unflag: ["mafia", "parrain"], argent: (p) => -Math.round(Math.max(0, net(p)) * 0.3), bonheur: 3 }),
    out(0.15, "Le départ tourne mal. On te fait comprendre que la porte reste fermée, avec ton portefeuille en prime.", { argent: (p) => -Math.round(Math.max(0, net(p)) * 0.25), bonheur: -8, repute: -3 }, true),
  ] });
}

// ---------- 91_empire ----------
{
// Deux voies vers des fortunes indécentes, l'une légale, l'autre pas. Chaque étape réussie ouvre la suivante,
// et à n'importe quel moment tout peut s'effondrer d'un coup.
const { reg, out, net } = require("../lifekit");
const C = require("../core");

const base = { nostudy: true, noprison: true, school: false, retired: false };
const pct = (f, cap) => (p) => Math.round(Math.min(cap, Math.max(0, net(p)) * f));
const lose = (f) => (p) => -Math.round(Math.max(0, net(p)) * f);
const has = (p, f) => C.hasFlag(p, f);
const ambitious = (p) => (p.traits.ambition >= 55 ? 1.6 : 0.8);

// ---------- la voie légale ----------
reg({ id: "empire_1", grp: "argent", l: "Bâtir un empire", ic: "🏗️", d: "Tu mets tout ce que tu as dans une entreprise qui vise le monde. Une fois sur trois, elle décolle. Si elle décolle, d'autres étapes s'ouvriront, de plus en plus grandes, et de plus en plus dangereuses.",
  need: Object.assign({ money: [25000, null], net: [40000, null], ages: [22, 62], noflag: ["empire_1", "empire_2", "empire_3", "empire_4", "empire_5"] }, base), cost: 20000, cool: 5, w: 2, j: true,
  fit: (p) => ambitious(p) * (p.stats.intel >= 55 ? 1.4 : 0.8),
  outs: [
    out(0.35, "Ton idée prend. Les clients arrivent, les investisseurs aussi. En deux ans, tu diriges une vraie scale-up avec des centaines de salariés.", { empire: { to: 1 }, repute: 8, bonheur: 8, ambition: 4, pub: "🚀 $nom lance une scale-up qui fait parler d'elle." }, true),
    out(0.4, "L'entreprise végète, ni succès ni faillite. Tu gardes la tête hors de l'eau et l'envie d'essayer autre chose.", { bonheur: -2, courage: 2 }),
    out(0.25, "Les ventes ne décollent jamais. Tu fermes au bout de dix-huit mois, avec des dettes et des leçons.", { argent: (p) => -Math.min(Math.max(0, p.cash), 15000), dette: 30000, bonheur: -8, prudent: 2 }, true),
  ] });

const LV = [
  null,
  null,
  { n: 2, from: 1, name: "Passer à l'échelle nationale", d: "Ta scale-up rachète ses concurrents et ouvre dans tous les grands pays voisins.", win: 0.42, flat: 0.38, ok: "Ton groupe écrase ses concurrents. Tu diriges un champion national, avec des milliers de salariés.", ko: "L'expansion est trop rapide, les comptes dérapent et un fonds vend ses parts. Ton groupe perd la moitié de sa valeur." },
  { n: 3, from: 2, name: "Rachats en série et introduction en bourse", d: "Tu enchaînes les rachats, puis tu entres en bourse. Les chiffres deviennent vertigineux, les ennemis aussi.", win: 0.38, flat: 0.42, ok: "Ton introduction en bourse est un triomphe. La valeur de ton groupe s'envole, et les journaux t'appellent par ton prénom.", ko: "Ton introduction en bourse déçoit et un rapport accuse ton groupe de maquiller ses comptes. L'action s'effondre." },
  { n: 4, from: 3, name: "Conquérir le marché mondial", d: "Tu vises le monde entier, avec des usines, des satellites et des gouvernements à convaincre.", win: 0.33, flat: 0.47, ok: "Tu deviens un acteur incontournable de ton secteur sur tous les continents. Les chefs d'État prennent ton appel.", ko: "Une enquête internationale, une amende record et des départs en cascade. Ton empire perd l'essentiel de sa valeur." },
  { n: 5, from: 4, name: "Devenir la première entreprise du monde", d: "Il n'y a plus de limite, sauf celle de ta chute. Chaque décision se compte en dizaines de milliards.", win: 0.28, flat: 0.5, ok: "Ton entreprise passe devant toutes les autres. Ta fortune dépasse celle de plusieurs pays.", ko: "Une faille que tu n'avais pas vue, un scandale mondial, et tout s'écroule en quelques semaines." },
];
LV.forEach((L) => {
  if (!L) return;
  reg({ id: "empire_" + L.n, grp: "argent", l: L.name, ic: "🏢", d: L.d + " Si ça rate, tu peux perdre l'essentiel d'un coup.",
    need: Object.assign({ flag: "empire_" + L.from, noflag: "empire_" + L.n, ages: [24, 85] }, base), cool: 3, w: 5, j: true, fit: (p) => (has(p, "empire_" + L.from) ? 2.2 : 0),
    outs: [
      out(L.win, L.ok, { empire: { to: L.n }, repute: 6, bonheur: 6, ambition: 2, pub: "🏆 $nom pousse son entreprise à un niveau jamais vu." }, true),
      out(L.flat, "L'étape se passe sans accroc majeur, mais rien ne change vraiment. Tu retentes plus tard.", { bonheur: -1 }),
      out(1 - L.win - L.flat, L.ko, { empire: { fall: 0.6, debt: 0 }, repute: -8, bonheur: -12, pub: "💥 L'empire de $nom vacille." }, true),
    ] });
});

// ---------- la voie illégale ----------
const CART = [
  null,
  { n: 1, name: "Étendre le territoire de la famille", d: "Un port, des camions, des élus qui ferment les yeux. Les gains explosent, les ennemis aussi.", win: 0.48, flat: 0.34, gain: 0.7, ok: "Tu prends le contrôle de tout un port. Les valises de billets arrivent par camions.", ko: "Un rival te trahit, les autorités saisissent un énorme chargement et tu passes de longues années en prison." },
  { n: 2, name: "Tisser un réseau international", d: "Des routes entre trois continents, des banques complaisantes et un nom qui fait trembler les enquêteurs.", win: 0.42, flat: 0.38, gain: 0.9, ok: "Ton réseau couvre trois continents. Tu pèses plus que bien des entreprises légales.", ko: "Une opération internationale démantèle ton réseau. Tu es arrêté, et on gèle tes comptes partout dans le monde." },
  { n: 3, name: "Devenir le roi de l'ombre", d: "Un cartel que personne n'ose défier, des États qui négocient avec toi, et un bunker pour dormir.", win: 0.36, flat: 0.4, gain: 1.1, ok: "Tu règnes sur un empire de l'ombre. Ta fortune est indécente, tes nuits sont courtes.", ko: "Un traître de ton cercle proche te livre. Tu tombes pour très longtemps, avec une fortune saisie en quelques heures." },
];
CART.forEach((L) => {
  if (!L) return;
  const crooked = (p) => (p.traits.honnete < 45 ? 1.8 : p.traits.honnete < 70 ? 1 : 0.4);
  reg({ id: "cartel_" + L.n, grp: "argent", tag: "mature", l: L.name, ic: "🕴️", d: L.d + " Chaque étape te rapporte énormément, et tout peut s'arrêter du jour au lendemain, avec des peines de prison très lourdes.",
    need: Object.assign({ flag: L.n === 1 ? "parrain" : ["parrain", "cartel_" + (L.n - 1)], noflag: "cartel_" + L.n, ages: [28, 85] }, base), cool: 3, w: 8, j: true, fit: (p) => (has(p, "parrain") ? 1.8 * crooked(p) : 0),
    outs: [
      out(L.win, L.ok, { argent: pct(L.gain, 1500000000), flag: "cartel_" + L.n, honnete: -6, repute: -3, bonheur: 4, pub: "🕴️ La rumeur dit que $nom dirige un réseau très puissant." }, true),
      out(L.flat, "Les affaires continuent, sans grand changement. Tu restes prudent.", { argent: pct(0.04, 80000000), honnete: -2 }),
      out(1 - L.win - L.flat, L.ko, { prison: 18 + L.n * 6, argent: lose(0.85), unflag: ["mafia", "parrain", "cartel_1", "cartel_2", "cartel_3"], repute: -30, bonheur: -15, pub: "🚔 Le réseau de $nom est démantelé, une peine historique est prononcée." }, true),
    ] });
});
}

// ---------- 93_passions ----------
{
// De quoi suivre une passion année après année dès l'enfance. Chaque domaine propose plusieurs façons de s'y investir.
const { reg, out } = require("../lifekit");

const young = { school: true, ages: [8, 17] };
const keen = (dom, f) => (p) => 0.8 + (p.interest && p.interest[dom] ? Math.min(p.interest[dom], 8) / 3 : 0) + (f ? f(p) : 0);

// ---- sport ----
reg({ id: "entrainement_extra", grp: "sport", dom: ["sport"], l: "T'entraîner en plus", ic: "🏃", d: "Des séances en plus après l'école. Tu progresses, tes devoirs un peu moins.", need: young, cool: 0, w: 6, fx: { sport: 6, sante: 1, courage: 1, notes: -2 }, fit: keen("sport", (p) => (p.stats.sport >= 50 ? 0.5 : 0)) });
reg({ id: "tournoi", grp: "sport", dom: ["sport"], l: "Disputer un tournoi", ic: "🥇", d: "Une compétition régionale, avec des vrais maillots et des gens qui crient depuis les gradins.", need: young, cool: 0, w: 6, fit: keen("sport"),
  outs: [out(0.3, "Tu gagnes le tournoi. On te porte en triomphe, et une coupe prend la place d'honneur sur la cheminée.", { sport: 5, repute: 4, bonheur: 7, courage: 2 }, true), out(0.5, "Tu finis en milieu de tableau, avec des progrès et quelques courbatures.", { sport: 4, bonheur: 2 }), out(0.2, "Tu te tords la cheville dès le premier match. Tu observes le reste depuis un banc.", { sport: -2, sante: -3, bonheur: -4 })] });
reg({ id: "stage_sportif", grp: "sport", dom: ["sport"], l: "Faire un stage sportif pendant les vacances", ic: "⛺", d: "Une semaine entière à t'entraîner avec des passionnés (300 €).", need: young, cost: 300, cool: 1, w: 4, fit: keen("sport"), fx: { sport: 7, sociable: 2, bonheur: 3 } });

// ---- arts ----
reg({ id: "atelier_dessin", grp: "arts", dom: ["arts"], l: "Suivre un atelier de dessin", ic: "🖌️", d: "Du fusain, de la peinture et des critiques gentilles.", need: young, cool: 0, w: 6, fx: { creatif: 5, bonheur: 3, notes: -1 }, fit: keen("arts", (p) => (p.traits.creatif >= 55 ? 0.5 : 0)) });
reg({ id: "expo_ecole", grp: "arts", dom: ["arts"], l: "Exposer tes œuvres à l'école", ic: "🖼️", d: "Tu accroches tes œuvres au mur du couloir. Tout le monde passe devant, et certains regardent.", need: young, cool: 1, w: 4, fit: keen("arts"),
  outs: [out(0.5, "On remarque ton travail, et une professeure te glisse que tu as du talent.", { creatif: 4, repute: 3, bonheur: 5 }, true), out(0.5, "Quelqu'un colle un chewing-gum sur ton chef-d'œuvre. Tu continues quand même.", { creatif: 2, courage: 2, bonheur: -1 })] });

// ---- musique ----
reg({ id: "cours_musique", grp: "arts", dom: ["music"], l: "Prendre des cours de musique", ic: "🎼", d: "Un instrument, un prof patient et des gammes à n'en plus finir (200 €).", need: young, cost: 200, cool: 0, w: 6, fx: { creatif: 4, intel: 1, bonheur: 2 }, fit: keen("music", (p) => (p.traits.creatif >= 55 ? 0.5 : 0)) });
reg({ id: "fanfare", grp: "arts", dom: ["music"], l: "Rejoindre la fanfare de la ville", ic: "🎺", d: "Défilés, kermesses et sourires crispés sous la pluie.", need: young, cool: 0, w: 5, fit: keen("music"), fx: { creatif: 3, sociable: 3, bonheur: 4 } });
reg({ id: "concert_ecole", grp: "arts", dom: ["music"], l: "Jouer au concert de l'école", ic: "🎤", d: "Tu montes sur scène devant tous les parents.", need: young, cool: 1, w: 4, fit: keen("music"),
  outs: [out(0.55, "Tu joues sans une fausse note et la salle applaudit longtemps.", { creatif: 4, repute: 3, bonheur: 6, courage: 2 }, true), out(0.45, "Ta corde casse au milieu du morceau. Tu finis en chantant, ce qui est pire.", { courage: 3, bonheur: -2 })] });

// ---- cinéma et vidéo ----
reg({ id: "video_amis", grp: "arts", dom: ["screen"], l: "Filmer des vidéos avec tes amis", ic: "📱", d: "Des scénarios improvisés, des cascades douteuses et des montages à la va-vite.", need: young, cool: 0, w: 6, fx: { creatif: 4, sociable: 2, bonheur: 4 }, fit: keen("screen", (p) => (p.traits.creatif >= 55 ? 0.5 : 0)) });
reg({ id: "montage_video", grp: "arts", dom: ["screen"], l: "Apprendre le montage vidéo", ic: "🎞️", d: "Des logiciels, des tutoriels et des nuits blanches devant l'écran.", need: young, cool: 0, w: 5, fx: { creatif: 4, intel: 2, notes: -1 }, fit: keen("screen") });

// ---- esprit ----
reg({ id: "club_sciences", grp: "ecole", dom: ["intel"], l: "Rejoindre le club de sciences", ic: "🔬", d: "Des expériences, des fumées colorées et un prof dont les cheveux se dressent.", need: young, cool: 0, w: 5, fx: { intel: 4, notes: 3, creatif: 1 }, fit: keen("intel", (p) => (p.stats.intel >= 55 ? 0.5 : 0)) });
reg({ id: "olympiades", grp: "ecole", dom: ["intel"], l: "Participer aux olympiades", ic: "🧮", d: "Un concours où l'on résout des problèmes que les adultes évitent.", need: { school: true, ages: [11, 17] }, cool: 1, w: 4, fit: keen("intel"),
  outs: [out(0.35, "Tu finis dans les premiers du département. Ton nom est lu à voix haute dans la cour.", { intel: 5, notes: 4, repute: 4, bonheur: 5 }, true), out(0.65, "Tu ne gagnes rien, mais tu rentres avec deux nouvelles idées et un stylo offert.", { intel: 3, notes: 1 })] });
}
