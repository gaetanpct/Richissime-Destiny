// Travail. Sans emploi tu cherches, avec un emploi tu progresses, tu changes ou tu pars.
// Jamais de recherche d'emploi quand on a déjà un poste, jamais de blocage quand on n'en a pas.
const { reg, out, tier, net, brainy } = require("../lifekit");
const C = require("../core");

const free = { nojob: true, nostudy: true, school: false, retired: false, noprison: true };
const working = { job: true, nostudy: true, noprison: true };
const yearsInJob = (p) => (p.job ? p.age - p.job.since : 0);

// ---------- sans emploi ----------
reg({ id: "emploi_candidater", grp: "emploi", prio: 3, cool: 0, w: 14, ic: "🔎", l: "Chercher un emploi", d: "Tu envoies des candidatures. Les offres reçues correspondent à ton profil, à ton âge et à ton niveau de vie.",
  need: Object.assign({ ages: [16, 72] }, free), scene: "sys:jobhunt" });
reg({ id: "emploi_reseau", grp: "emploi", cool: 2, w: 7, ic: "🤝", l: "Activer ton réseau", d: "Un café avec d'anciens collègues, un coup de fil à un ami d'ami. Les propositions sont de meilleure qualité.",
  need: Object.assign({ ages: [20, 70] }, free), fit: (p) => (C.hasRel(p, "friend") || C.hasRel(p, "boss") || C.hasRel(p, "colleague") || C.hasRel(p, "mentor") ? 1.4 : 0),
  scene: { id: "sys:jobhunt", vals: { reseau: 1 } } });
reg({ id: "emploi_bilan", grp: "emploi", cool: 4, w: 4, ic: "🧭", l: "Faire un bilan de compétences", d: "Un conseiller t'explique ce que tu sais faire, ce que tu aimes, et que ce n'est pas la même chose.",
  need: Object.assign({ ages: [20, 62] }, free), cost: 300,
  outs: [out(1, "Le bilan te surprend, tu découvres des qualités que personne ne t'avait jamais soupçonnées. Les futures candidatures seront plus solides.", { intel: 1, ambition: 2, flag: { bilan_competences: 3 } })] });
reg({ id: "emploi_freelance", grp: "emploi", cool: 3, w: 6, ic: "🧰", l: "Te lancer en indépendant", d: "Plus de patron, plus de salaire fixe, plus d'excuses.",
  need: Object.assign({ ages: [18, 66] }, free), fit: (p) => (p.traits.ambition >= 50 ? 1.5 : 0.8) * (tier(p) >= 3 ? 0.4 : 1),
  outs: [out(1, "Tu te déclares indépendant, tu imprimes des cartes de visite qui font beaucoup d'effet à ta famille. Les premiers clients arrivent timidement.", { job: { track: "libre", level: 0, mul: 1 }, ambition: 3, courage: 2, bonheur: 2 }, true)] });
reg({ id: "emploi_interim", grp: "emploi", cool: 1, w: 6, ic: "🧾", l: "Enchaîner les missions d'intérim", d: "Un peu d'argent tout de suite, un CV qui s'étoffe, un badge qui ne marche plus le lundi.",
  need: Object.assign({ ages: [18, 66] }, free), fit: (p) => (tier(p) <= 2 ? 1.5 : 0.2),
  outs: [out(0.75, "Entre une usine de yaourts et un entrepôt de coussins, tu gagnes de quoi tenir et un joli lot de rencontres.", { argent: 5200, sante: -1, ambition: 1 }), out(0.25, "Les missions s'enchaînent, avec une pause déjeuner de trois minutes. Mais tu as gagné de quoi respirer.", { argent: 6800, sante: -2, bonheur: -1 })] });
reg({ id: "emploi_concours", grp: "emploi", cool: 4, w: 4, ic: "🏛️", l: "Passer un concours de la fonction publique", d: "Une montagne de cours, une salle d'examen glaciale et la sécurité de l'emploi au bout.",
  need: Object.assign({ ages: [20, 55], edu: 2 }, free), fit: (p) => (p.traits.prudent >= 50 ? 1.4 : 0.7),
  outs: [out((p) => 0.3 + (p.stats.intel - 50) / 150 + (p.school.edu - 2) * 0.08, "Tu es reçu(e) au concours, avec un classement qui ne te fait pas honte. Te voilà fonctionnaire, avec une sécurité qui rend jaloux.", { job: { track: "public", level: 0, mul: 1 }, bonheur: 5, prudent: 3 }, true), out((p) => 0.7 - (p.stats.intel - 50) / 150 - (p.school.edu - 2) * 0.08, "Tu échoues de quelques places. Le jury t'écrit une lettre très aimable qui ne sert à rien.", { bonheur: -3, intel: 1 })] });

// ---------- avec un emploi ----------
reg({ id: "travail_carriere", grp: "travail", cool: 0, w: 6, ic: "💼", l: "Tout donner au travail", d: "Promotion en vue, santé en danger.", need: working, fx: { sante: -2, bonheur: -2, ambition: 2 }, hook: "work", fit: (p) => (p.traits.ambition >= 50 ? 1.4 : 0.7) });
reg({ id: "equilibre", grp: "travail", cool: 0, w: 5, ic: "⚖️", l: "Vie équilibrée", d: "Du travail, des loisirs, des siestes.", need: { ages: [18, 120], nostudy: true, noprison: true }, fx: { bonheur: 2, sante: 1 } });
reg({ id: "travail_augmentation", grp: "travail", cool: 2, w: 8, ic: "💰", l: "Demander une augmentation", d: "Un rendez-vous avec ton patron, un tableau de chiffres et la gorge sèche.",
  need: Object.assign({ ages: [20, 66] }, working), fit: (p) => (yearsInJob(p) >= 1 ? 1.3 : 0), scene: "job_raise" });
reg({ id: "travail_changer", grp: "travail", cool: 3, w: 6, ic: "🔁", l: "Écouter les offres d'autres entreprises", d: "Un chasseur de têtes t'appelle. Tu prétends ne pas être intéressé(e), puis tu écoutes.",
  need: Object.assign({ ages: [20, 62] }, working), fit: (p) => (yearsInJob(p) >= 2 ? 1.2 : 0), scene: "sys:jobswitch" });
reg({ id: "travail_demission", grp: "travail", cool: 3, w: 3, ic: "🚪", l: "Quitter ton emploi", d: "Une lettre, une porte, un grand saut dans le vide.",
  need: Object.assign({ ages: [18, 68] }, working), fit: (p) => (p.stats.bonheur < 40 ? 3 : p.stats.bonheur < 55 ? 1 : 0.35), scene: "job_quit" });
reg({ id: "travail_reseau", grp: "travail", cool: 2, w: 5, ic: "🥂", l: "Réseauter dans les cocktails", d: "Des cartes de visite, des petits fours et des sourires de contrat.",
  need: Object.assign({ ages: [22, 65] }, working), cost: (p) => (tier(p) >= 3 ? 600 : 150), fit: (p) => (p.traits.sociable >= 45 ? 1.3 : 0.7),
  outs: [out(0.55, "Tu repars avec onze cartes de visite et un nouveau contact utile, qui t'appelle « mon cher ».", { ambition: 2, charme: 1, sociable: 2, meet: "mentor", bonheur: 2 }), out(0.3, "Tu reviens avec le mal de crâne des petits fours et une promesse de déjeuner jamais tenue.", { sociable: 1, bonheur: 1 }), out(0.15, "Tu te retrouves à parler d'ornithologie avec le directeur général. Il te propose un poste, et tu ne sais pas pourquoi.", { ambition: 3, bonheur: 3, raise: 0.08 }, true)] });
reg({ id: "formation", grp: "travail", cool: 2, w: 5, ic: "🧑‍🏫", l: "Se former", d: "Une formation pour progresser (1 500 €). Elle te rend nettement plus intelligent, et les salaires proposés suivent.", need: { ages: [20, 62], nostudy: true, noprison: true }, cost: 1500, fx: { intel: 7, ambition: 2, repute: 1 }, hook: "formation", fit: (p) => (p.job ? 1.2 : 0.8) });
reg({ id: "side", grp: "argent", cool: 2, w: 4, ic: "🛠️", l: "Business parallèle", d: "Revente, bricolage, idées douteuses.", need: { ages: [18, 80], nostudy: true, noprison: true }, fx: { ambition: 2, sante: -1 }, hook: "side", fit: (p) => (p.traits.ambition >= 45 ? 1.2 : 0.8) });
reg({ id: "heures_sup", grp: "travail", cool: 2, w: 4, ic: "🌙", l: "Enchaîner les heures supplémentaires", d: "Le bureau devient ta deuxième maison et ta troisième, et ton lit est une sorte de rumeur.",
  need: Object.assign({ ages: [20, 62] }, working), fit: (p) => (tier(p) <= 2 ? 1.4 : 0.3),
  outs: [out(0.7, "Les heures supplémentaires sont payées, la fatigue est offerte.", { argent: 3200, sante: -3, bonheur: -2, ambition: 1 }), out(0.3, "Tu t'endors sur ton clavier, ton patron appelle ça de l'engagement et te donne une prime.", { argent: 2200, sante: -2, ambition: 2, bonheur: 0 })] });
reg({ id: "projet_fou", grp: "travail", cool: 3, w: 4, ic: "💡", l: "Proposer un projet fou à ton patron", d: "Une idée jamais vue, ni vraiment comprise.",
  need: Object.assign({ ages: [22, 62] }, working), fit: (p) => (p.traits.creatif >= 55 ? 1.8 : 0.6),
  outs: [out(0.4, "Ton projet est accepté ! Tu deviens l'homme ou la femme de la situation, une demi-journée par semaine.", { raise: 0.12, repute: 3, ambition: 3, bonheur: 4, perf: 10 }, true), out(0.6, "Ton patron te remercie poliment et range ton idée dans un tiroir à fond double.", { creatif: 2, ambition: 1, bonheur: -1 })] });
reg({ id: "syndicat", grp: "travail", cool: 4, w: 2, ic: "✊", l: "T'engager au syndicat", d: "Tracts, assemblées et un café très militant.", need: Object.assign({ ages: [22, 62] }, working),
  outs: [out(0.65, "Tu obtiens quelques avancées pour ton équipe. Ton patron te salue, ce qui est bien pire qu'un regard noir.", { repute: 4, courage: 3, bonte: 2, bonheur: 2 }), out(0.35, "Ton patron prend ça pour une déclaration de guerre. Les relations sont fraîches comme un frigo.", { repute: 2, courage: 3, perf: -8, bonheur: -2 })] });
reg({ id: "mutation", grp: "travail", cool: 5, w: 3, ic: "🚚", l: "Demander une mutation dans une autre ville", d: "Nouvelle ville, nouveaux collègues, mêmes cartons.", need: Object.assign({ ages: [22, 60] }, working), fit: (p) => (yearsInJob(p) >= 3 ? 1 : 0.2),
  outs: [out(0.75, "Tu déménages dans une nouvelle ville, tu t'y fais des amis, et tu découvres un pain au chocolat inattendu.", { city: true, raise: 0.05, bonheur: 3, courage: 2 }, true), out(0.25, "La mutation est refusée, mais tu gagnes une prime de consolation et un regard noir de la DRH.", { argent: 500, bonheur: -1 })] });
reg({ id: "teletravail", grp: "travail", cool: 3, w: 4, ic: "🏠", l: "Négocier le télétravail", d: "Du pyjama en visioconférence, mais en haut seulement.", need: Object.assign({ ages: [22, 62] }, working), fit: (p) => (["tech", "finance", "presse", "droit", "consultant", "media", "immo"].includes(p.job.track) ? 1.3 : 0.4),
  outs: [out(0.65, "Ton patron accepte. Tu travailles chez toi, trop et mal, mais en pantoufles.", { bonheur: 4, sante: 1, perf: 3 }), out(0.35, "On te répond qu'il faut « garder la dynamique d'équipe ». Tu retournes au bureau en maudissant l'open space.", { bonheur: -2 })] });

// ---------- fin de carrière ----------
reg({ id: "travail_retraite", grp: "travail", cool: 0, prio: 2, w: 10, ic: "🏖️", l: "Prendre ta retraite", d: "Après une vie de bureau, d'ateliers ou de chantiers, les pantoufles te font de l'œil.",
  need: { ages: [60, 90], job: true, noprison: true }, fit: (p) => (p.age >= 64 ? 3 : 1), scene: "job_retraite" });
