// Les grands coups réservés aux ennemis jurés et aux vendettas. Plus la haine est forte, plus les idées sont folles.
// Tout se joue sur le rapport de force. Un échec se paie cher, parfois en prison.
const { reg } = require("../socialkit");
const F = require("../feud");

const win = (base) => (g, A, B) => F.odds(g, A, B, base);
const lose = (base) => (g, A, B) => 1 - F.odds(g, A, B, base);
const hot = (n) => (g, A, B, b) => b.riv >= n;
const common = { hostile: true, mode: "direct", grp: "vendetta", status: "ennemi", cool: 3, coolPair: 4 };

function big(id, ic, l, d, o) {
  reg(Object.assign({ id, ic, l, d }, common, o.spec, {
    direct: [
      { w: win(o.p), special: id + "_ok", a: o.okA || { bonheur: 4, honnete: -4 }, b: o.okB || { bonheur: -6 }, ta: o.okTa, tb: o.okTb, bond: { riv: o.okRiv || 16, aff: -8 } },
      { w: lose(o.p), special: id + "_ko", a: o.koA || { bonheur: -4 }, b: o.koB || { bonheur: 2 }, ta: o.koTa, tb: o.koTb, bond: { riv: o.koRiv || 10 } },
    ],
  }));
}

big("poison", "☠️", "L'empoisonner", "Un repas, une boisson, une dose bien choisie. Si ça marche, il ou elle finit à l'hôpital pour longtemps. Si on te prend, c'est la prison.", { p: 0.45, spec: { mature: true, ages: [22, 90], cost: 4000, w: 5, ok: hot(60), fit: () => 1.5 }, okTa: "Ton plan a fonctionné.", okTb: "Tu t'effondres à table.", koTa: "Tout s'effondre dès la première analyse.", koTb: "Une tentative d'empoisonnement est déjouée." });
big("arson", "🔥", "Incendier son bien", "Une nuit sans lune, un bidon d'essence, et sa maison ou son affaire prend feu. Si on te voit, c'est la prison.", { p: 0.5, spec: { mature: true, ages: [20, 90], cost: 5000, w: 5, ok: hot(60), fit: () => 1.4 }, okTa: "La nuit est belle et le feu est haut.", okTb: "Tu es réveillé" + "(e) par l'odeur de fumée.", koTa: "Un voisin te voit, tout est fini.", koTb: "Un incendie criminel est déjoué." });
big("kidnap", "🕶️", "L'enlever contre rançon", "Un enlèvement soigné, une cave, une demande de rançon. Si ça marche, tu repars avec un quart de sa fortune. Si ça rate, c'est une très longue peine.", { p: 0.4, spec: { mature: true, ages: [25, 85], cost: 8000, w: 4, ok: (g, A, B, b) => b.riv >= 70 && B.cash > 30000, fit: () => 1.2 }, okTa: "L'argent est tombé.", okTb: "On t'a enlevé" + "(e).", koTa: "Le plan s'écroule.", koTb: "Un enlèvement échoue." });
big("press", "📰", "Lancer une campagne de presse", "Un dossier, des journalistes, des photos choisies, et la réputation de ta cible s'effondre. Si on remonte jusqu'à toi, c'est toi qui es condamné pour diffamation.", { p: 0.55, spec: { ages: [20, 90], cost: 6000, w: 5, ok: hot(45), fit: () => 1.4 }, okTa: "La presse te mange dans la main.", okTb: "La presse se déchaîne.", koTa: "Les journalistes remontent jusqu'à toi.", koTb: "Une campagne de presse contre toi échoue." });
big("doubt", "💔", "Briser son couple", "Un mot mal placé, une photo, une rumeur bien dosée. Si ça marche, son couple explose. Si ça rate, ils sont plus unis que jamais.", { p: 0.55, spec: { ages: [18, 90], cost: 1500, w: 5, ok: (g, A, B, b) => b.riv >= 35 && !!(B.partner || B.npcs.some((n) => (n.kind === "partner" || n.kind === "spouse") && n.alive)), fit: () => 1.8 }, okTa: "Ça a pris, comme prévu.", okTb: "Quelque chose cloche dans ton couple.", koTa: "Le plan est éventé.", koTb: "Quelqu'un a tenté de briser ton couple." });
big("seduce", "😏", "Lui prendre sa moitié", "Tu séduis la personne qui partage sa vie. Si tu réussis, la rupture est cruelle et publique. Si tu échoues, tout le monde en rit.", { p: 0.4, spec: { mature: true, ages: [20, 80], cost: 2000, w: 4, ok: (g, A, B, b) => b.riv >= 45 && !!(B.partner || B.npcs.some((n) => (n.kind === "partner" || n.kind === "spouse") && n.alive)), fit: () => 1.5 }, okTa: "Ton charme a fait le travail.", okTb: "Tu apprends la trahison.", koTa: "La tentative tourne au ridicule.", koTb: "Quelqu'un a tenté de séduire ta moitié." });
big("hack", "💻", "Pirater ses comptes", "Un spécialiste, un mot de passe oublié, et une partie de sa fortune change de main. Une erreur, et la police débarque.", { p: 0.5, spec: { ages: [18, 80], cost: 3000, w: 5, ok: (g, A, B, b) => b.riv >= 40 && B.cash > 5000, fit: () => 1.3 }, okTa: "Les virements passent.", okTb: "Tes comptes ont été vidés.", koTa: "La police remonte le piratage.", koTb: "Un piratage échoue." });
big("brake", "🚗", "Saboter sa voiture", "Les freins qui lâchent au mauvais virage. Il ou elle peut s'en sortir de justesse ou ne pas s'en sortir du tout.", { p: 0.5, spec: { mature: true, ages: [20, 85], cost: 2500, w: 4, ok: hot(50), fit: () => 1.1 }, okTa: "L'accident a l'air banal.", okTb: "Un virage de trop.", koTa: "Une caméra a tout filmé.", koTb: "Un sabotage est découvert à temps." });
big("family", "🕸️", "Retourner sa famille contre lui", "Un repas, quelques confidences bien placées, et sa famille ne lui parle plus. Cruel et efficace.", { p: 0.6, spec: { ages: [18, 90], cost: 500, w: 4, ok: (g, A, B, b) => b.riv >= 40 && B.npcs.some((n) => n.alive && ["pere", "mere", "frere", "soeur", "child"].includes(n.kind)), fit: () => 1.3 }, okTa: "La famille de ta cible t'a écouté.", okTb: "Tes proches se détournent.", koTa: "La famille ne t'a pas cru.", koTb: "Un proche te dit qu'on a médit de toi." });
big("beating", "🥊", "Le faire tabasser", "Trois costauds dans une ruelle. Le message sera clair.", { p: 0.55, spec: { mature: true, ages: [18, 80], cost: 3500, w: 4, ok: hot(50), fit: () => 1.2 }, okTa: "Le message est passé.", okTb: "Tu t'effondres sous les coups.", koTa: "Les costauds parlent.", koTb: "Une agression échoue." });
big("partners", "🕴️", "Retourner ses associés", "Tu rencontres ses associés, tu leur proposes mieux. Si ça marche, son affaire perd un tiers de sa valeur. Sinon, tu perds la face.", { p: 0.5, spec: { ages: [24, 85], cost: 4000, w: 4, ok: (g, A, B, b) => b.riv >= 40 && B.assets.some((a) => a.kind === "entreprise"), fit: () => 1.4 }, okTa: "Tes appuis ont retourné la situation.", okTb: "Tes associés te lâchent.", koTa: "Les associés refusent.", koTb: "Les associés te le racontent." });
big("tax", "🧾", "Le dénoncer au fisc", "Une lettre anonyme, un dossier épais, un inspecteur zélé. Si ça marche, un redressement lourd.", { p: 0.6, spec: { ages: [22, 90], cost: 2000, w: 4, ok: hot(40), fit: () => 1.2 }, okTa: "Le contrôle tombe.", okTb: "Un contrôle fiscal tombe.", koTa: "Rien à signaler.", koTb: "Un contrôle te trouve en règle." });

reg({ id: "duel_final", grp: "vendetta", status: "ennemi", hostile: true, mode: "direct", ic: "⚔️", l: "Provoquer en duel à mort", ages: [25, 85], w: 4, cool: 4, coolPair: 6,
  d: "Une provocation publique, une arme choisie à l'ancienne, et un enjeu énorme. Le vainqueur prend la moitié de l'argent du perdant, qui en sort blessé. On y laisse parfois sa vie.",
  ok: (g, A, B, b) => b.riv >= 70 && A.cash > 20000 && B.cash > 20000, fit: () => 1.2,
  direct: [{ w: 1, special: "duel_final", a: { bonheur: 1 }, b: { bonheur: 1 }, ta: "Vous vous retrouvez à l'aube pour régler vos comptes.", tb: "Tu relèves le défi de " + "$A.", bond: { riv: 15 } }] });

reg({ id: "exile", grp: "vendetta", status: "ennemi", hostile: true, mode: "direct", ic: "🚪", l: "Acheter son exil", ages: [25, 85], w: 4, cool: 5, coolPair: 8, cost: 25000,
  d: "Tu paies pour que ta cible quitte la ville. Elle perd son emploi, ses repères et sa réputation locale. Ça marche à tous les coups, mais la haine reste.",
  ok: (g, A, B, b) => b.riv >= 60 && !B.prison, fit: () => 1.1,
  direct: [{ w: 1, special: "exile", a: { bonheur: 3 }, b: { bonheur: -8 }, ta: "Ton argent a parlé.", tb: "On t'a fait comprendre qu'il valait mieux partir.", bond: { riv: -5 } }] });

reg({ id: "sort_noir", grp: "vendetta", status: "ennemi", hostile: true, loufoque: true, mode: "direct", ic: "🔮", l: "Lui jeter un sort", ages: [14, 100], w: 4, cool: 3, coolPair: 3, cost: 100,
  d: "Une poupée, une cire noire, des mots anciens. Le sort peut rater, ne rien faire, ou se retourner contre toi.",
  ok: hot(30), fit: () => 1,
  direct: [{ w: 1, special: "curse", a: {}, b: {}, ta: "Tu lances le sort dans une cave humide.", tb: "Un souffle froid passe dans ta vie.", bond: { riv: 5 } }] });

reg({ id: "armistice_froid", grp: "vendetta", status: "ennemi", hostile: false, mode: "offer", ic: "🕊️", l: "Proposer un cessez-le-feu", ages: [20, 100], w: 3, cool: 3, coolPair: 5,
  d: "Tu mets un genou à terre, ou tu fais mine. Un cessez-le-feu froid peut calmer les choses. Il ne ramène pas la confiance.",
  ask: "$A te propose un cessez-le-feu.", ok: (g, A, B, b) => b.riv >= 40, fit: () => 0.9,
  no: { ta: "$B refuse de baisser les armes.", bond: { riv: 3 } },
  yes: [{ w: 1, special: "armistice", a: { bonheur: 3 }, b: { bonheur: 3 }, ta: "$B accepte, du bout des lèvres.", tb: "Tu acceptes, du bout des lèvres.", bond: { riv: -10 } }] });

// Les anciens coups bas comptent aussi comme des actions d'ennemi.
const SKIT = require("../socialkit");
["ruiner_affaires", "faire_licencier", "fouiller_passe", "tendre_piege", "saccager_biens", "contrat_tueur"].forEach((id) => { if (SKIT.byId[id] && !SKIT.byId[id].status) SKIT.byId[id].status = "ennemi"; });
if (SKIT.byId.contrat_tueur) SKIT.byId.contrat_tueur.w = 6;
