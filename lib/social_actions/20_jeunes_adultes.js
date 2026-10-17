// Actions de la vingtaine. Colocation, voyages, soirées, premiers boulots et premiers amours qui s'installent.
const { reg, bond, single, employed, justWed, coupleWith } = require("../socialkit");

reg({ id: "coloc", grp: "vie", ic: "🏘️", l: "Prendre une colocation ensemble", d: "Un loyer partagé, un frigo partagé, et une guerre froide à propos de la vaisselle.",
  ages: [18, 32], w: 7, cool: 3, ok: (g, A, B, b) => !A.partner && !B.partner && b.aff >= 14,
  yes: [
    { w: 0.55, a: { argent: 1500, bonheur: 4, sociable: 2 }, b: { argent: 1500, bonheur: 4, sociable: 2 }, ta: "La colocation avec $B est une réussite, avec un planning de ménage qui tient presque jusqu'à la fin de l'année. Le loyer partagé fait du bien aux comptes.", tb: "Tu t'installes chez $A. Les soirées pizzas et les débats de minuit sont la meilleure partie de l'année.", bond: { aff: 14 }, tag: "coloc" },
    { w: 0.3, a: { argent: 1200, bonheur: 1 }, b: { argent: 1200, bonheur: 1 }, ta: "La vaisselle devient un sujet de politique intérieure. Vous vous parlez par post-it, avec une courtoisie tendue.", tb: "La guerre de la vaisselle fait rage chez $A. Vous écrivez vos reproches sur des post-it, avec des dessins.", bond: { aff: -4, riv: 8 } },
    { w: 0.15, a: { argent: 1000, bonheur: -3 }, b: { argent: 1000, bonheur: -3 }, ta: "Vous découvrez que $B n'a jamais lavé une assiette. Il ou elle découvre que tu ronfles. Vous vous quittez en bons termes, presque.", tb: "Coloc terminée. $A ronfle comme un tracteur, tu laves toute la vaisselle, la vie est cruelle.", bond: { aff: -6, riv: 4 } },
  ],
  no: { ta: "$B préfère vivre seul(e), ou avec son chat. Tu cherches un autre colocataire.", bond: { aff: -1 } } });

reg({ id: "voyage_duo", grp: "voyage", ic: "🧳", l: "Partir en voyage à deux", d: "Un billet, un sac à dos et toute la complicité (ou toute la dispute) qu'un long trajet peut contenir. Frais partagés.",
  ages: [18, 80], w: 8, cool: 3, cost: 1600, split: true, ok: (g, A, B, b) => b.aff >= 20 || coupleWith(A, B),
  yes: [
    { w: 0.55, a: { bonheur: 7, intel: 1 }, b: { bonheur: 7, intel: 1 }, ta: "Le voyage est magnifique. Vous vous perdez dans une ville inconnue, vous mangez des choses que vous ne savez pas nommer, et vous rentrez plus proches.", tb: "Voyager avec $A est un souvenir pour toute la vie. Vous parlez encore de ce tramway.", bond: { aff: 16 }, tag: "voyage" },
    { w: 0.3, a: { bonheur: 4 }, b: { bonheur: 4 }, ta: "Le voyage est à moitié catastrophique. Les valises sont perdues, l'hôtel est un champ de travaux, mais la compagnie sauve tout.", tb: "Entre la valise perdue et l'hôtel en travaux, tu ris plus que prévu avec $A.", bond: { aff: 10 } },
    { w: 0.15, a: { bonheur: -2 }, b: { bonheur: -2 }, ta: "Après trois jours, vous ne vous parlez plus qu'à travers le guide touristique. Vous rentrez séparément.", tb: "Le voyage tourne à la dispute sur la carte, la température du café et le sens du monde. Vous rentrez fâchés.", bond: { aff: -10, riv: 10 } },
  ],
  no: { ta: "$B n'a pas pu se libérer. Tu pars seul(e) ou tu annules, tu hésites.", bond: { aff: -1 } } });

reg({ id: "karaoke", grp: "fete", ic: "🎤", l: "Faire une soirée karaoké", d: "Un micro, un public indulgent et une chanson que personne n'aurait dû choisir.",
  ages: [16, 70], w: 7, cool: 2, cost: 80,
  yes: [
    { w: 0.35, a: { bonheur: 6, repute: 2, creatif: 1 }, b: { bonheur: 6, repute: 2 }, ta: "Votre duo sur une ballade romantique surprend la salle. Quelqu'un pleure, quelqu'un filme, personne n'oubliera.", tb: "Ton duo avec $A fait un triomphe. Le gérant du bar vous offre une tournée.", bond: { aff: 10 } },
    { w: 0.45, a: { bonheur: 5, repute: -1 }, b: { bonheur: 5, repute: -1 }, ta: "Vous chantez faux, avec une confiance étonnante. Les applaudissements sont polis, sincères et un peu inquiets.", tb: "Tu chantes tellement faux que même $A se bouche les oreilles en riant.", bond: { aff: 10 } },
    { w: 0.2, a: { bonheur: 2, repute: -3 }, b: { bonheur: 4, repute: 1 }, ta: "Tu attaques une note aiguë sans préparation. Un verre explose, le micro grésille, la salle applaudit par réflexe.", tb: "$A tente une note impossible. Un verre se brise. Le patron garde la vidéo en souvenir.", bond: { aff: 8 } },
  ],
  no: { ta: "$B jure qu'il ou elle ne chante qu'en privé. Tu fais ton karaoké en solo devant la glace.", bond: { aff: -1 } } });

reg({ id: "course_ensemble", grp: "sport", ic: "🏃", l: "S'entraîner pour un marathon ensemble", d: "Des sorties à six heures du matin, des genoux sensibles et un dossard qui rend fier.",
  ages: [20, 55], w: 6, cool: 3, fit: (g, A) => (A.stats.sport >= 48 ? 1.3 : 0.4),
  yes: [
    { w: 0.7, a: { sport: 4, sante: 2, bonheur: 5 }, b: { sport: 4, sante: 2, bonheur: 5 }, ta: "Vous franchissez la ligne d'arrivée main dans la main, trempés et radieux. La médaille pèse plus lourd que prévu.", tb: "Tu termines le marathon avec $A. Tu ne sens plus tes jambes, mais ton cœur chante.", bond: { aff: 14 } },
    { w: 0.3, a: { sport: 2, sante: -3, bonheur: 1 }, b: { sport: 3, sante: 1, bonheur: 4 }, ta: "Tu te blesses au quinzième kilomètre. $B finit la course et te rapporte une médaille et une banane.", tb: "$A se tord la cheville en pleine course. Tu termines pour deux et tu rapportes une banane en trophée.", bond: { aff: 12 } },
  ],
  no: { ta: "$B n'est pas prêt(e) à courir dix kilomètres sans une bonne raison. Tu t'entraînes avec ton ombre.", bond: { aff: -1 } } });

reg({ id: "recommander_poste", grp: "travail", ic: "🧾", l: "Recommander pour un poste", d: "Tu glisses le nom d'un ami au bon endroit. S'il fait bonne impression, il ou elle s'en souviendra longtemps.", mode: "direct",
  ages: [22, 62], w: 8, cool: 3, ok: (g, A, B, b) => employed(A) && !employed(B) && !B.retired && B.age >= 20 && b.aff >= 18 && !B.prison,
  direct: [
    { w: 0.7, a: { repute: 2, bonheur: 3 }, b: { bonheur: 6 }, ta: "Ton ancien collègue a bien reçu ta recommandation. $B a passé l'entretien avec brio, ou au moins sans trop de dégâts.", tb: "$A t'a recommandé(e). Un entretien plus tard, tu es embauché(e), et tu mesures la valeur d'un bon réseau.", bond: { aff: 16 }, special: "hire", news: "🧾 $A a fait embaucher $B." },
    { w: 0.3, a: { bonheur: 1 }, b: { bonheur: 2 }, ta: "L'entreprise cherchait quelqu'un d'autre. Ta recommandation n'a pas suffi, mais $B a apprécié le geste.", tb: "$A t'a recommandé(e), mais le poste est déjà pourvu. Le geste compte, pas le salaire.", bond: { aff: 8 } },
  ] });

reg({ id: "temoin_mariage", grp: "famille", ic: "💍", l: "Être témoin pour son mariage", d: "Tu tiens les alliances, tu prépares un discours et tu surveilles discrètement l'oncle un peu trop heureux.",
  ages: [20, 90], w: 14, prio: 2, cool: 0, coolPair: 5, ok: (g, A, B, b) => justWed(B) && b.aff >= 20 && !b.tags.temoin,
  yes: [
    { w: 0.6, a: { bonheur: 5, repute: 1, sociable: 2 }, b: { bonheur: 6 }, ta: "Ton discours de témoin fait rire puis pleurer la salle. Les alliances sont bien là, la bague de $B aussi.", tb: "$A prononce un discours inoubliable à ton mariage. Même ta grand-mère a pleuré.", bond: { aff: 22 }, tag: "temoin" },
    { w: 0.4, a: { bonheur: 3, repute: -1 }, b: { bonheur: 4 }, ta: "Tu perds les alliances une minute avant la cérémonie. Elles sont retrouvées dans ta poche gauche. Tout le monde respire.", tb: "$A perd les alliances avant la cérémonie, les retrouve dans sa poche et salue l'assistance. Tu t'en souviendras toute ta vie.", bond: { aff: 18 }, tag: "temoin" },
  ],
  no: { ta: "$B a déjà choisi un autre témoin. La vie est faite de petits deuils.", bond: { aff: -3 } } });

reg({ id: "soiree_folle", grp: "fete", ic: "🥳", l: "Organiser la soirée de l'année", d: "Le lieu, le DJ, le buffet, la liste d'invités. Tout peut arriver, surtout ce qu'on n'a pas prévu.", mature: true,
  ages: [18, 40], w: 6, cool: 3, cost: 500,
  yes: [
    { w: 0.5, a: { bonheur: 7, repute: 3, sociable: 3, sante: -2 }, b: { bonheur: 7, repute: 2, sante: -2 }, ta: "La soirée est légendaire. Un inconnu gagne le concours de danse, un autre épouse symboliquement la machine à fumée.", tb: "La soirée de $A est un raz-de-marée. Tu rentres à l'aube, avec des fleurs dans les cheveux.", bond: { aff: 12 }, news: "🥳 $A et $B ont fait la fête la plus folle de l'année." },
    { w: 0.3, a: { bonheur: 4, argent: -300, sante: -2 }, b: { bonheur: 4, sante: -2 }, ta: "L'évier déborde, la playlist plante, un invité dort dans la baignoire. Mais vous rirez encore de cette soirée dans dix ans.", tb: "La fête vire au grand n'importe quoi, et c'est exactement ce que tu voulais.", bond: { aff: 10 } },
    { w: 0.2, a: { bonheur: -3, repute: -3, argent: -400 }, b: { bonheur: 1, repute: -1 }, ta: "Le propriétaire passe en pleine soirée, en pyjama, avec un air peu amical. Tu perds un peu de ta caution et beaucoup de ta dignité.", tb: "Le propriétaire de $A fait irruption pendant que tu danses avec un cône sur la tête. Fin de partie.", bond: { aff: 5 } },
  ],
  no: { ta: "$B a un autre plan ce soir-là. Tu fais la fête sans cette personne, mais pas sans y penser.", bond: { aff: -2 } } });

reg({ id: "startup_ensemble", grp: "travail", ic: "💡", l: "Se lancer dans une idée folle à deux", d: "Un cahier de charges sur une serviette en papier. Si l'idée plaît, l'entreprise démarre pour de bon.",
  ages: [19, 40], w: 6, cool: 3, ok: (g, A, B, b) => b.aff >= 20 && !b.tags.idee,
  yes: [
    { w: 0.3, a: { ambition: 3, bonheur: 5, argent: 2500 }, b: { ambition: 3, bonheur: 5, argent: 2500 }, ta: "Votre idée plaît à un investisseur éclairé qui vous verse un petit chèque pour voir. Tout est possible.", tb: "L'idée de $A convainc un investisseur. Tu touches un petit chèque, et tu sens le goût de l'aventure.", bond: { aff: 14 }, tag: "idee" },
    { w: 0.7, a: { ambition: 2, bonheur: 2 }, b: { ambition: 2, bonheur: 2 }, ta: "L'idée est brillante, mais personne ne sait comment la construire. Vous gardez le plan, la serviette et une belle complicité.", tb: "Avec $A, vous passez des heures à rêver d'une entreprise. Le projet reste sur la serviette, mais c'était bien.", bond: { aff: 9 }, tag: "idee" },
  ],
  no: { ta: "$B préfère un vrai salaire à tes rêves de serviette. Tu lui en veux un peu.", bond: { aff: -2 } } });

reg({ id: "tuyau_placement", grp: "argent", ic: "📈", l: "Partager un tuyau de placement", d: "« Je ne devrais pas te le dire, mais... ». Il peut rapporter ou coûter cher, surtout à celui qui l'a donné.", mode: "direct",
  ages: [22, 90], w: 5, cool: 3, ok: (g, A, B, b) => b.aff >= 18,
  direct: [
    { w: 0.5, a: { repute: 2, bonheur: 3 }, b: { argent: 1800, bonheur: 4 }, ta: "Ton tuyau était bon. $B gagne un joli petit pactole et te remercie en offrant le café pendant six mois.", tb: "Le tuyau de $A était excellent. Tu gagnes un joli petit pactole sans rien faire, ce qui est la meilleure façon de gagner.", bond: { aff: 14 } },
    { w: 0.5, a: { repute: -3, bonheur: -3 }, b: { argent: -1200, bonheur: -4 }, ta: "Ton tuyau s'effondre le lendemain. $B perd un peu d'argent et ne te laisse pas oublier ton « je ne devrais pas te le dire ».", tb: "Le tuyau de $A était percé. Tu y laisses un peu d'argent et beaucoup d'illusions.", bond: { aff: -10, riv: 6 } },
  ] });

reg({ id: "visite_prison", grp: "paix", ic: "🔗", l: "Rendre visite en prison", d: "Un parloir, un panier de fruits et un immense besoin de se dire que ça ira.",
  ages: [14, 110], w: 12, prio: 1, cool: 1, coolPair: 1, prison: true, ok: (g, A, B, b) => !!B.prison && !A.prison,
  yes: [
    { w: 1, a: { bonheur: 2, bonte: 2 }, b: { bonheur: 6 }, ta: "Le parloir est étroit, les gardiens sont polis, et $B pleure presque en te voyant. Tu repars avec le cœur lourd et léger à la fois.", tb: "$A vient te voir derrière la vitre. Tu te souviens que tu comptes pour quelqu'un.", bond: { aff: 16 } },
  ],
  no: { ta: "Le parloir est complet cette semaine. Tu laisses un mot et un panier.", bond: { aff: 2 } } });
