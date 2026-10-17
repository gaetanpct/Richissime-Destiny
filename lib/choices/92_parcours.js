// Des parcours en boule de neige. Une passion suivie année après année ouvre des occasions, qui en ouvrent d'autres,
// et à chaque marche un accident peut tout casser. Sport de haut niveau, cinéma, musique.
const { reg, out } = require("../lifekit");
const IN = require("../interests");
const C = require("../core");

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const flagOf = (lad, n) => "par_" + lad + "_" + n;

// Chaque marche a une chance de réussite qui dépend de la qualité du joueur, de son intérêt et du chemin déjà parcouru.
function chance(base, stat, dom) {
  return (p) => {
    const sv = stat in p.stats ? p.stats[stat] : p.traits[stat];
    return clamp(base + (sv - 55) / 320 + Math.min(10, IN.val(p, dom)) / 130, 0.06, 0.85);
  };
}

function ladder(L) {
  L.steps.forEach((S, i) => {
    const n = i + 1;
    const win = chance(S.base, L.stat, L.dom);
    const failShare = S.fail;
    const need = Object.assign({ noprison: true }, S.need || {});
    if (n > 1) { need.flag = flagOf(L.id, n - 1); }
    need.noflag = flagOf(L.id, n);
    const fx = (S.fx || {});
    reg({ id: "par_" + L.id + "_" + n, grp: "parcours", dom: [L.dom], l: S.l, ic: S.ic, d: S.d, need, cool: S.cool === undefined ? (n >= 4 ? 3 : n === 3 ? 2 : 1) : S.cool, w: S.w || 12, prio: 0, j: true, tag: S.tag,
      fit: (p) => {
        if (IN.val(p, L.dom) < (S.minInterest || 0)) return 0;
        if (((p.parTry || {})["par_" + L.id + "_" + n] || 0) >= (n <= 1 ? 4 : n === 2 ? 3 : n === 3 ? 3 : 2)) return 0;
        if (S.minStat && (S.minStat[0] in p.stats ? p.stats[S.minStat[0]] : p.traits[S.minStat[0]]) < S.minStat[1]) return 0;
        // plus on s'est investi, plus l'occasion se présente
        return 0.8 + Math.min(IN.val(p, L.dom), 12) / 4;
      },
      outs: [
        out((p) => win(p), S.ok, Object.assign({ flag: flagOf(L.id, n) }, fx, S.pub ? { pub: S.pub } : {}), true),
        out((p) => Math.max(0.02, 1 - win(p) - failShare), S.flat, S.flatFx || { bonheur: -1 }),
        out(failShare, S.ko, Object.assign({}, L.fail.fx, S.koFx || {}, { unflag: S.dropTo ? resetFrom(L.id, S.dropTo, L.steps.length) : [] }), true),
      ] });
  });
}

const resetFrom = (id, n, total) => { const a = []; for (let k = n; k <= total; k++) a.push(flagOf(id, k)); return a; };

ladder({ id: "sport", dom: "sport", stat: "sport", fail: { fx: {} },
  steps: [
    { l: "Entrer en section sport-études", ic: "🏟️", d: "Tu aménages tes études autour de ton sport. Entraînements tous les jours, cours le reste du temps. Si tu t'accroches, des portes s'ouvrent.",
      need: { school: true, ages: [11, 17] }, minInterest: 2.5, minStat: ["sport", 45], base: 0.5, fail: 0.05,
      ok: "On t'accepte en sport-études. Tes journées tournent autour des entraînements, ton corps change, et ton niveau grimpe très vite.", fx: { sport: 7, sante: 2, courage: 3, notes: -3, repute: 2 },
      flat: "Le dossier est refusé cette année, faute de places. Tu t'entraînes encore plus fort pour l'an prochain.", flatFx: { sport: 3, courage: 1 },
      ko: "Tu te blesses à l'entraînement avant même le concours. Tu rates l'année.", koFx: { sport: -6, sante: -4, bonheur: -6 } },
    { l: "Être repéré par un centre de formation", ic: "🔭", d: "Un recruteur vient te voir jouer. Si tu brilles ce jour-là, ton nom circule dans le milieu.",
      need: { ages: [13, 24] }, minInterest: 4, minStat: ["sport", 55], base: 0.42, fail: 0.12,
      ok: "Un recruteur te repère et te fait intégrer un centre de formation. Tu quittes la maison pour vivre pour ton sport.", fx: { sport: 6, repute: 6, courage: 3, bonheur: 5, argent: 2000 }, pub: "🏅 $nom est repéré(e) par un centre de formation.",
      flat: "Le recruteur note ton nom mais ne dit rien. Tu restes sur la liste d'attente.", flatFx: { sport: 3, bonheur: -1 },
      ko: "Tu te blesses au genou le jour du match devant le recruteur. La saison est perdue, ton élan aussi.", koFx: { sport: -14, sante: -10, bonheur: -12, repute: -2 }, dropTo: 0 },
    { l: "Signer un contrat professionnel", ic: "✍️", d: "Un club te propose un vrai contrat. Fini l'amateurisme, tu es payé pour ton sport, et sous surveillance à chaque match.",
      need: { ages: [16, 34], nostudy: true, retired: false }, minInterest: 5, minStat: ["sport", 58], base: 0.28, fail: 0.2,
      ok: "Tu signes ton premier contrat professionnel. Les maillots à ton nom se vendent dans la boutique du club.", fx: { job: { track: "sportpro", level: 1 }, repute: 8, bonheur: 8, argent: 8000, courage: 2 }, pub: "✍️ $nom signe un contrat professionnel.",
      flat: "Le club te garde en réserve cette année. Tu joues peu, mais tu progresses.", flatFx: { sport: 2 },
      ko: "Une rupture des ligaments croisés te met sur la touche pour deux saisons. Le club ne te prolonge pas.", koFx: { fire: true, sport: -20, sante: -14, bonheur: -15, repute: -4 }, dropTo: 2 },
    { l: "Devenir la vedette de ton sport", ic: "🏆", d: "Une saison où tout se joue. Si tu y arrives, tu deviens un nom connu de tout le pays, avec les sponsors qui vont avec.",
      need: { ages: [18, 36], nostudy: true, retired: false }, minInterest: 6, minStat: ["sport", 62], base: 0.15, fail: 0.28,
      ok: "Tu réalises la saison de ta vie. Titre, médias, sponsors et affiches géantes, ton nom est connu de tout le pays.", fx: { job: { track: "sportpro", level: 3 }, repute: 16, charme: 5, bonheur: 10, argent: 250000 }, pub: "🏆 $nom devient la vedette de son sport.",
      flat: "Une belle saison, sans exploit. Tu restes un joueur respecté.", flatFx: { repute: 2, argent: 6000 },
      ko: "Une blessure grave en pleine saison brise ta carrière. On parle de toi aux informations, mais pour de mauvaises raisons.", koFx: { fire: true, sport: -28, sante: -18, bonheur: -22, repute: -3 }, dropTo: 3 },
  ] });

ladder({ id: "cine", dom: "screen", stat: "creatif", fail: { fx: {} },
  steps: [
    { l: "Tourner des courts métrages dans ton garage", ic: "🎬", d: "Un téléphone, des amis, des idées. Tu écris et tu tournes tes propres histoires.",
      need: { ages: [11, 70] }, minInterest: 1.5, base: 0.55, fail: 0.05, w: 10,
      ok: "Ton court métrage fait rire ou pleurer tous ceux qui le voient. Tes amis le partagent, et quelques inconnus aussi.", fx: { creatif: 6, charme: 2, bonheur: 6, repute: 2 },
      flat: "Personne ne regarde ton film, sauf ta famille. Tu apprends quand même énormément.", flatFx: { creatif: 3 },
      ko: "Le film part en vrille, ton matériel casse et ton budget s'envole.", koFx: { argent: -300, bonheur: -3 } },
    { l: "Présenter ton film à un petit festival", ic: "🎞️", d: "Une salle, un jury et du public. Une première occasion pour que quelqu'un d'influent te voie.",
      need: { ages: [13, 75] }, minInterest: 3, base: 0.42, fail: 0.15,
      ok: "Ton film obtient un prix du public. Une critique locale parle de toi, et plusieurs personnes te laissent leur carte.", fx: { repute: 7, creatif: 4, charme: 3, bonheur: 8, argent: 800 }, pub: "🎞️ Le court métrage de $nom marque un petit festival.",
      flat: "Ton film passe, sans éclat. Tu rencontres quand même quelques passionnés.", flatFx: { sociable: 2, creatif: 2 },
      ko: "La projection est un fiasco. Le son lâche, la salle rit au mauvais moment, et ton nom est associé à l'incident.", koFx: { repute: -4, bonheur: -8 }, dropTo: 0 },
    { l: "Un producteur te remarque", ic: "🤝", d: "Quelqu'un du métier a vu ton film et te propose un rendez-vous. Il faut convaincre.",
      need: { ages: [16, 75], nostudy: true }, minInterest: 4, base: 0.28, fail: 0.2,
      ok: "Le producteur te confie un petit rôle dans un projet professionnel. Tu passes de ton garage aux vrais plateaux.", fx: { job: { track: "cinema", level: 0 }, repute: 8, bonheur: 8, argent: 3000, charme: 3 }, pub: "🤝 $nom décroche un premier rôle professionnel.",
      flat: "Le producteur te promet de te rappeler. Tu attends longtemps.", flatFx: { bonheur: -2 },
      ko: "Le producteur disparaît avec ton scénario, que tu retrouves dans un film sans que ton nom y figure.", koFx: { repute: -3, bonheur: -9, honnete: -1 }, dropTo: 2 },
    { l: "Décrocher un rôle principal", ic: "🌟", d: "Un casting où des centaines de personnes se battent pour le même rôle. Une seule gagne.",
      need: { ages: [18, 78], nostudy: true }, minInterest: 5, base: 0.15, fail: 0.28,
      ok: "On te choisit pour le rôle principal. Le film sort, il marche, et les magazines t'envoient des photographes.", fx: { job: { track: "cinema", level: 3 }, repute: 14, charme: 6, bonheur: 10, argent: 150000 }, pub: "🌟 $nom devient une tête d'affiche.",
      flat: "On te donne un bon second rôle, qui t'apporte un peu de notoriété.", flatFx: { repute: 3, argent: 12000 },
      ko: "Le tournage tourne au scandale, le film est retiré de l'affiche et ton nom est cité partout pour de mauvaises raisons.", koFx: { fire: true, repute: -15, bonheur: -15, argent: -20000 }, dropTo: 3 },
    { l: "Devenir une star mondiale", ic: "💫", d: "Les plus grandes productions du monde te contactent. Tu changes de statut, et tu te fais des ennemis.",
      need: { ages: [20, 80], nostudy: true }, minInterest: 6, base: 0.09, fail: 0.34,
      ok: "Ton film bat des records mondiaux. Tu deviens une star, dont le nom attire les foules et dont les cachets donnent le vertige.", fx: { job: { track: "cinema", level: 4 }, repute: 20, charme: 8, bonheur: 10, argent: 3000000 }, pub: "💫 $nom devient une star mondiale du cinéma.",
      flat: "Tu enchaînes les rôles, sans percée mondiale. Ta carrière reste solide.", flatFx: { repute: 2, argent: 40000 },
      ko: "Une affaire privée sort dans la presse. Les studios coupent les ponts, et tu disparais des écrans pendant des années.", koFx: { fire: true, repute: -22, bonheur: -20, argent: -150000 }, dropTo: 4 },
  ] });

ladder({ id: "music", dom: "music", stat: "creatif", fail: { fx: {} },
  steps: [
    { l: "Monter un groupe dans ton garage", ic: "🎸", d: "Des amis, des instruments et un voisin très patient. C'est le début d'une aventure qui peut mener loin.",
      need: { ages: [11, 70] }, minInterest: 1.5, base: 0.6, fail: 0.04, w: 10,
      ok: "Ton groupe trouve un son et quelques chansons à vous. Vos répétitions attirent déjà un petit public dans la rue.", fx: { creatif: 6, sociable: 3, bonheur: 7 },
      flat: "Vous avez beaucoup de bruit et peu de chansons. Les voisins demandent un autre créneau.", flatFx: { creatif: 3 },
      ko: "Le groupe se sépare en pleine répétition pour une histoire de couleur de pochette.", koFx: { bonheur: -5, sociable: -1 } },
    { l: "Jouer vos premiers concerts", ic: "🎤", d: "Un bar, une scène ouverte, une fête de quartier. Il faut tenir devant du vrai public.",
      need: { ages: [13, 75] }, minInterest: 3, base: 0.45, fail: 0.12,
      ok: "Votre premier concert fait salle comble. Tout le monde chante vos refrains, et des inconnus vous demandent vos disques.", fx: { repute: 6, charme: 3, creatif: 4, bonheur: 8, argent: 600 }, pub: "🎤 Le groupe de $nom électrise une petite salle.",
      flat: "Le public est tiède. Vous jouez, vous apprenez.", flatFx: { creatif: 2, courage: 2 },
      ko: "Une panne de courant et un micro qui crache. Vous finissez a cappella devant dix personnes.", koFx: { repute: -3, bonheur: -6 }, dropTo: 0 },
    { l: "Signer chez un label", ic: "💿", d: "Un petit label te propose un contrat. Studio, clips, distribution, mais en échange de ton temps et de tes droits.",
      need: { ages: [16, 75], nostudy: true }, minInterest: 4, base: 0.28, fail: 0.2,
      ok: "Le label sort ton premier disque. Les radios locales le passent, et tu vis enfin de ta musique.", fx: { job: { track: "chanteur", level: 1 }, repute: 8, bonheur: 9, argent: 4000, charme: 3 }, pub: "💿 $nom signe chez un label.",
      flat: "Le label temporise, la maquette dort dans un tiroir.", flatFx: { bonheur: -2 },
      ko: "Le contrat cache des clauses terribles. Tu perds tes droits et une grande partie de tes premiers revenus.", koFx: { argent: -2000, repute: -3, bonheur: -9 }, dropTo: 2 },
    { l: "Sortir un tube", ic: "🎶", d: "Une chanson, un clip, un coup de chance. Si ça prend, tu passes en boucle partout.",
      need: { ages: [18, 78], nostudy: true }, minInterest: 5, base: 0.15, fail: 0.28,
      ok: "Ta chanson devient le tube de l'été. On la fredonne dans les supermarchés, les stades et les mariages.", fx: { job: { track: "chanteur", level: 3 }, repute: 15, charme: 6, bonheur: 10, argent: 120000 }, pub: "🎶 $nom sort le tube de l'été.",
      flat: "La chanson passe bien, sans devenir un phénomène.", flatFx: { repute: 3, argent: 9000 },
      ko: "Une polémique éclate autour de ta chanson, accusée d'être copiée. Les radios la retirent.", koFx: { fire: true, repute: -12, bonheur: -13, argent: -15000 }, dropTo: 3 },
    { l: "Remplir les stades du monde entier", ic: "🌍", d: "Une tournée mondiale, des millions de fans, un entourage énorme. La gloire coûte cher à tenir.",
      need: { ages: [20, 80], nostudy: true }, minInterest: 6, base: 0.09, fail: 0.34,
      ok: "Ta tournée mondiale affiche complet partout. Tu deviens une superstar, avec les cachets qui vont avec.", fx: { job: { track: "chanteur", level: 4 }, repute: 20, charme: 8, bonheur: 10, argent: 2500000 }, pub: "🌍 $nom remplit des stades sur tous les continents.",
      flat: "La tournée remplit les salles, sans fièvre mondiale.", flatFx: { repute: 2, argent: 50000 },
      ko: "Une extinction de voix, un procès, une rupture avec ton producteur. La tournée est annulée, et ton image avec.", koFx: { fire: true, repute: -18, bonheur: -18, argent: -250000 }, dropTo: 4 },
  ] });
