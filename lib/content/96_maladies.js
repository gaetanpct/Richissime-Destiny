// Maladies, accidents graves et frôlements de la mort. Tout cela reste rare, mais cela peut arriver.
const { ev, flash, O, C, D } = require("../kit");

// ---------- Enfance et jeunesse ----------
ev("appendicite", {
  ages: [6, 35], tags: ["sante"], ic: "🤢🏥", w: 3,
  t: "Une douleur vrille ton ventre depuis ce matin. Tu te tords sur le lit, le front moite, et tu n'as plus faim du tout, ce qui est inquiétant.",
  c: [
    D("Appeler les secours tout de suite", "🚑", "Les médecins t'opèrent sans attendre. Une cicatrice et une histoire à raconter.", { sante: -2, argent: -150, prudent: 1 }),
    C("Attendre que ça passe", "🙈", [O(0.82, "La douleur finit par passer. Tu as de la chance.", { sante: -2 }), O(0.15, "Une opération d'urgence in extremis. Tu as eu très peur.", { sante: -6, argent: -400, prudent: 3 }), O(0.03, "L'appendice éclate. Il est trop tard.", { die: "d'une appendicite négligée" })], { risk: 3 }),
    D("Boire une tisane et prier", "🍵", "Tu gémis une nuit entière, puis tu consultes. Ouf.", { sante: -3, argent: -120 }),
  ],
});

ev("meningite_alerte", {
  ages: [6, 30], tags: ["sante"], ic: "🌡️😵", w: 1,
  t: "Une fièvre brutale, une nuque raide, une migraine qui t'écrase le front. Tu n'arrives plus à regarder la lumière. Ton entourage s'agite.",
  c: [
    D("Aller aux urgences immédiatement", "🚑", "Un diagnostic rapide, un traitement puissant. Tu restes une semaine à l'hôpital mais tu t'en sors.", { sante: -5, argent: -200, prudent: 2, bonheur: -2 }),
    C("Dormir, ça ira mieux demain", "😴", [O(0.6, "Le lendemain, ta famille t'emmène de force à l'hôpital. Il était temps.", { sante: -8, argent: -400, prudent: 3 }), O(0.4, "Trop tard. La maladie a gagné.", { die: "d'une méningite foudroyante" })], { risk: 3 }),
  ],
});

ev("leucemie_enfant", {
  ages: [6, 17], tags: ["sante"], ic: "🩸🏥", w: 0.4,
  t: "Une grande fatigue, des bleus inexpliqués, et le médecin qui fronce les sourcils devant les résultats. Les mots sont lourds, mais l'hôpital pour enfants est plein de couleurs et de courage.",
  c: [
    C("Se battre de toutes tes forces", "🦁", [O(0.88, "Des mois de traitement, de dessins collés aux murs et de visites. La rémission arrive.", { sante: -10, courage: 6, bonheur: -3, flag: "survivant" , later: { id: "apres_maladie", in: 1 } }), O(0.12, "Le traitement ne suffit pas. Tu laisses derrière toi des amis qui n'oublieront jamais ton sourire.", { die: "d'une maladie rare du sang, entouré des siens" })], { risk: 3 }),
    D("Te reposer sur ta famille", "🧸", "Ta famille ne te quitte plus, ses bras te tiennent chaud. Le traitement avance bien.", { sante: -8, bonheur: -1, bonte: 3, flag: "survivant", later: { id: "apres_maladie", in: 1 } }),
  ],
});

ev("apres_maladie", {
  chainOnly: true, tags: ["sante"], ic: "🌈💪",
  t: "Tu as survécu à plus fort que toi. Le monde te paraît plus beau et chaque petit plaisir a le goût d'une victoire.",
  c: [
    D("Vivre à fond", "🎉", "Tu savoures chaque instant et chaque rire.", { bonheur: 8, courage: 3, sociable: 2 }),
    D("Aider les autres malades", "🤲", "Tu deviens bénévole. Tu apprends que la gentillesse soigne aussi.", { bonte: 5, repute: 5, bonheur: 4 }),
    D("Devenir plus prudent", "🛡️", "Tu fais attention à tout. Parfois trop.", { prudent: 5, sante: 2 }),
  ],
});

ev("allergie_choc", {
  ages: [6, 70], tags: ["sante"], ic: "🥜😮‍💨", w: 2,
  t: "Une bouchée d'un gâteau inconnu, et ta gorge se serre. Ton visage gonfle, les yeux piquent. L'étiquette mentionnait « traces de fruits à coque ». Tu l'as lue trop tard.",
  c: [
    D("Utiliser le stylo d'adrénaline", "💉", "Tu as le réflexe qui sauve. L'hôpital te garde une nuit.", { sante: -3, prudent: 3, argent: -100 }),
    C("Attendre que ça passe", "⏳", [O(0.7, "Ça se calme, par miracle, avec de grandes frayeurs.", { sante: -5, prudent: 2 }), O(0.3, "Une réaction fatale. Les secours arrivent trop tard.", { die: "d'un choc allergique après une bouchée de gâteau" })], { risk: 3 }),
  ],
});

ev("noyade_frole", {
  ages: [7, 55], tags: ["sante"], ic: "🌊😱", w: 1.5,
  t: "Un courant de baïne t'emporte à vingt mètres du bord. Les vagues te giflent. Tu entends au loin le maître-nageur siffler, puis crier, puis courir.",
  c: [
    C("Nager en travers du courant", "🏊", [O(0.9, "Tu t'extrais, épuisé{|e} mais vivant{|e}. Tu ne te baigneras plus jamais seul{|e}.", { sante: -2, courage: 3, prudent: 3, sport: 1 }), O(0.1, "Les forces te lâchent. Les secours arrivent trop tard.", { die: "noyé{|e} lors d'une baignade imprudente" })], { risk: 3 }),
    D("Rester calme et faire la planche", "🛟", "Tu attends. Le maître-nageur te sort de l'eau. Quelle belle leçon d'humilité.", { sante: -1, prudent: 3, repute: 1 }),
    D("Appeler à l'aide à pleins poumons", "📣", "Les secours arrivent vite. Tu es sauvé{|e}.", { sante: -1, bonheur: -1, prudent: 2 }),
  ],
});

ev("foudre_rarissime", {
  ages: [10, 85], tags: ["sante", "loufoque"], ic: "⛈️⚡", w: 0.3,
  t: "Un orage éclate en pleine randonnée. Un éclair frappe un arbre à dix mètres de toi, la terre tremble, tes cheveux se dressent sur ta tête.",
  c: [
    D("Courir te mettre à l'abri", "🏃", "Tu t'abrites dans une grange. Ton cœur bat à cent à l'heure et tu ris nerveusement.", { courage: 2, prudent: 2, bonheur: 1 }),
    C("Rester sous l'arbre le plus proche", "🌳", [O(0.8, "Rien ne se passe. Tu as eu un peu trop de chance.", { courage: 1 }), O(0.2, "Le ciel te frappe. C'est un accident rarissime.", { die: "foudroyé{|e} par un éclair en pleine randonnée" })], { risk: 3 }),
  ],
});

ev("intoxication_alim", {
  ages: [6, 90], tags: ["sante"], ic: "🤮🍣", w: 3,
  t: "Un sushi oublié sur un comptoir, une mayonnaise douteuse ou une huître qui avait l'air un peu triste. Ton ventre fait des bruits d'orage.",
  c: [
    D("Boire beaucoup d'eau et dormir", "💧", "Une nuit éprouvante, mais tu t'en sors.", { sante: -2, prudent: 1 }),
    D("Consulter un médecin", "🩺", "Un diagnostic rapide et un traitement efficace.", { sante: -1, argent: -60 }),
    D("Manger encore pour tester", "🍕", "Mauvaise idée. Deux jours de plus à haïr tes choix.", { sante: -4, bonheur: -2 }),
  ],
});

ev("asthme_decouverte", {
  ages: [6, 40], tags: ["sante"], ic: "🌬️😮‍💨", w: 2, need: { noflag: "asthme" },
  t: "À chaque effort, ton souffle siffle comme une bouilloire. Un médecin te fait respirer dans un tube et hoche la tête avec gravité. C'est de l'asthme.",
  c: [
    D("Suivre le traitement", "💊", "Un inhalateur devient ton compagnon de route. La vie reprend son cours.", { sante: 1, prudent: 2, flag: "asthme" }),
    D("Faire du sport malgré tout", "🏃", "Tu apprends à gérer ton souffle. Ça prend du temps.", { sport: 2, courage: 2, sante: -1, flag: "asthme" }),
  ],
});

ev("diabete_decouverte", {
  ages: [8, 70], tags: ["sante"], ic: "🩸🍬", w: 1, need: { noflag: "diabete" },
  t: "Une soif intense, des envies pressantes, une fatigue qui te colle au dos. Les analyses sont claires. Le diabète vient de rentrer dans ta vie.",
  c: [
    D("Apprendre à te soigner sérieusement", "📓", "Tu deviens un expert de ta propre santé. Une discipline nouvelle s'installe.", { prudent: 4, sante: 1, argent: -200, flag: "diabete" }),
    C("Faire semblant de ne rien avoir", "🙈", [O(0.6, "Tu t'en sors malgré tout, mais les années seront plus dures.", { sante: -5, flag: "diabete" }), O(0.4, "Une complication grave te cloue à l'hôpital.", { sante: -12, argent: -800, flag: "diabete" })], { risk: 2 }),
  ],
});

// ---------- Santé mentale et addictions ----------
ev("burn_out", {
  ages: [24, 62], tags: ["sante", "travail"], ic: "🪫😶", w: 3, need: { job: true, stat: { bonheur: [null, 66] } },
  t: "Un matin, ton corps refuse de se lever. Tu fixes l'écran sans rien voir. Le mail suivant te donne envie de pleurer. Tu es à bout de forces.",
  c: [
    D("Prendre un long congé", "🏖️", "Tu t'arrêtes six mois. Doucement, la couleur revient dans tes journées.", { sante: 6, bonheur: 6, perf: -6, argent: -2000, ambition: -2 }),
    C("Serrer les dents et continuer", "💪", [O(0.5, "Tu tiens bon. Mais tu n'es plus le ou la même.", { sante: -5, bonheur: -4, perf: -2 }), O(0.5, "Tu t'effondres en pleine réunion. Hospitalisation et arrêt long.", { sante: -10, bonheur: -8, perf: -10, argent: -1500 })], { risk: 2 }),
    D("Démissionner et changer de vie", "🚪", "Tu claques la porte. L'avenir est flou mais tu respires.", { quit: true, bonheur: 6, sante: 4 }),
    D("Parler à un psychologue", "🛋️", "Une série de séances t'aide à poser des limites.", { argent: -400, sante: 4, bonheur: 5, prudent: 2 }),
  ],
});

ev("coup_de_blues", {
  ages: [14, 85], tags: ["sante"], ic: "🌧️🫥", w: 3, need: { stat: { bonheur: [null, 62] } },
  t: "Les journées se ressemblent, grises et lentes. Rien ne te donne envie, pas même ton plat préféré. Une voix dans ta tête répète que ça n'ira pas mieux.",
  c: [
    D("En parler à quelqu'un de proche", "🫂", "Une longue discussion, un thé tiède, et une promesse de se revoir bientôt. Ça aide plus que tu ne l'aurais cru.", { bonheur: 6, sociable: 2, bonte: 1 }),
    D("Consulter un professionnel", "🛋️", "Tu avances pas à pas. Le chemin est long mais tu le prends.", { bonheur: 8, sante: 3, argent: -300 }),
    C("Te cacher et attendre", "🛏️", [O(0.6, "Les semaines passent. Peu à peu, la lumière revient.", { bonheur: 2, sante: -2 }), O(0.4, "La grisaille s'installe et s'agrandit.", { bonheur: -8, sante: -4, sociable: -3 })], { risk: 1 }),
    D("Sortir marcher dehors", "🚶", "L'air frais fait du bien. Un chien te suit pendant un kilomètre.", { bonheur: 4, sport: 1, sante: 1 }),
  ],
});

ev("addiction_alcool", {
  ages: [18, 70], tags: ["sante", "mature"], ic: "🍷🌀", w: 2, need: { tr: { prudent: [null, 55] }, noflag: "sobre_alcool" },
  t: "Un verre pour oublier la journée, puis deux, puis une bouteille en regardant le plafond. Tu t'aperçois que ça fait des mois que tu ne passes plus une soirée sans verre.",
  c: [
    D("Demander de l'aide", "🤝", "Un groupe de parole, un médecin, de longues semaines difficiles. Peu à peu, tu retrouves ta voie.", { sante: 6, bonheur: 4, honnete: 3, courage: 3, flag: "sobre_alcool" }),
    C("Arrêter tout seul", "💪", [O(0.5, "Tu tiens, à force de volonté et de thé glacé.", { sante: 4, courage: 4, flag: "sobre_alcool" }), O(0.5, "La rechute arrive vite. L'engrenage se resserre.", { sante: -6, bonheur: -5, repute: -3 })], { risk: 2 }),
    D("Continuer comme avant", "🍾", "Les soirées s'étirent. Ton foie fait la grimace.", { sante: -6, bonheur: -3, argent: -500 }),
  ],
});

ev("addiction_jeu", {
  ages: [18, 70], tags: ["sante", "mature"], ic: "🎲🌀", w: 2, need: { money: [500, null], noflag: "sobre_jeu" },
  t: "Un petit pari pour le plaisir, un autre pour se refaire, puis un autre pour oublier. Ton compte en banque ressemble à une petite flaque. Tu y retournes quand même.",
  c: [
    D("Te faire interdire de jeu", "🚫", "Tu t'inscris sur la liste d'interdiction. Un poids tombe de tes épaules.", { bonheur: 4, honnete: 3, courage: 3, flag: "sobre_jeu" }),
    C("Miser une dernière fois", "🎰", [O(0.2, "Tu gagnes ! Mais tu sais que ça ne règle rien.", { argent: 3000, bonheur: 2 }), O(0.8, "Tu perds ce que tu avais mis de côté.", { argent: -2500, bonheur: -6, repute: -2 })], { risk: 3 }),
    D("Confier ta carte bancaire à un proche", "🤝", "Une honte, un soulagement. Ta confiance se reconstruit peu à peu.", { honnete: 2, bonheur: 2, flag: "sobre_jeu", rel: { friend: 6 } }),
  ],
});

ev("tabac_sevrage", {
  ages: [18, 65], tags: ["sante"], ic: "🚬🌫️", w: 3, need: { noflag: "fumeur_stop" },
  t: "Ta toux du matin commence à ressembler à un moteur de tracteur. Ton médecin te regarde par-dessus ses lunettes, puis ouvre un dossier avec le mot « poumons » écrit dessus.",
  c: [
    C("Arrêter pour de bon", "🚭", [O(0.55, "Tu tiens, malgré trois semaines d'humeur de dogue.", { sante: 5, bonheur: 2, courage: 3, argent: 400, flag: "fumeur_stop" }), O(0.45, "Tu craques après deux mois. Mais tu essaieras encore.", { sante: 1, bonheur: -1 })]),
    D("Continuer comme avant", "🚬", "Tu t'offres une dernière cigarette. Puis une autre, puis...", { sante: -4, argent: -300 }),
    D("Passer à la cigarette électronique", "💨", "Tu vapotes des nuages parfumés à la fraise.", { sante: 1, argent: -150 }),
  ],
});

ev("insomnie_chronique", {
  ages: [20, 80], tags: ["sante"], ic: "🌙👀", w: 3,
  t: "Les nuits blanches s'enchaînent. Tu comptes les moutons, puis les chèvres, puis les agneaux. Ton plafond n'a plus de secrets pour toi.",
  c: [
    D("Changer ton hygiène de vie", "🧘", "Moins d'écrans, plus de marche. Les nuits s'améliorent doucement.", { sante: 3, bonheur: 2, prudent: 1 }),
    D("Prendre des somnifères", "💊", "Tu dors, mais le matin est un peu cotonneux.", { sante: 0, argent: -50 }),
    D("Profiter de la nuit pour créer", "🎨", "Tu écris, tu peins, tu bricoles. Le jour est plus dur, mais tes œuvres progressent.", { creatif: 4, sante: -2, bonheur: 1 }),
  ],
});

// ---------- Gros risques de l'âge adulte ----------
ev("depistage_cancer", {
  ages: [38, 85], tags: ["sante"], ic: "🩺📋", w: 2.2,
  t: "Un examen de routine met en évidence quelque chose d'étrange. Le médecin garde un ton calme mais te demande de revenir pour d'autres examens. Tu sors du cabinet les jambes en coton.",
  c: [
    D("Faire immédiatement tous les examens", "🔬", "Un diagnostic précoce vaut de l'or. L'équipe médicale s'organise.", { sante: -2, argent: -200, prudent: 3, next: "traitement_lourd" }),
    C("Repousser le rendez-vous", "🙈", [O(0.5, "C'était bénin, rien à signaler. Tu as eu très peur pour rien.", { bonheur: 2 }), O(0.5, "Le retard coûte cher. Les examens révèlent une maladie avancée.", { sante: -8, next: "traitement_lourd" })], { risk: 3 }),
    D("Demander un deuxième avis", "👩‍⚕️", "Un autre médecin confirme le diagnostic. Tu entames ton parcours de soin.", { argent: -150, next: "traitement_lourd" }),
  ],
});

ev("traitement_lourd", {
  chainOnly: true, tags: ["sante"], ic: "💉🏥",
  t: "Chimiothérapie, chirurgie, longues semaines à l'hôpital. Les infirmières deviennent ta famille et la salle d'attente ton salon. Le moral monte et descend comme un yoyo.",
  c: [
    C("S'accrocher avec le sourire", "😊", [O(0.78, "La rémission arrive après des mois d'épreuve. Tu as retrouvé le goût des petits bonheurs.", { sante: -8, courage: 5, bonheur: 4, flag: "rescape", later: { id: "apres_maladie", in: 1 } }), O(0.14, "Le traitement est long, mais tu t'en sors avec de lourdes séquelles.", { sante: -18, courage: 4, flag: "rescape", later: { id: "apres_maladie", in: 1 } }), O(0.08, "La maladie est plus forte que tout. Tu laisses derrière toi des gens qui t'aimaient.", { die: "d'une longue maladie, entouré{|e} de ses proches" })], { risk: 3 }),
    C("Tenter un traitement expérimental", "🧪", [O(0.5, "Le traitement fonctionne au-delà des espérances.", { sante: -4, courage: 6, bonheur: 6, flag: "rescape", later: { id: "apres_maladie", in: 1 } }), O(0.35, "Les effets sont mitigés, mais tu tiens bon.", { sante: -12, flag: "rescape", later: { id: "apres_maladie", in: 1 } }), O(0.15, "Le traitement n'est pas assez fort.", { die: "d'une maladie grave malgré un traitement audacieux" })], { risk: 3, cost: 3000 }),
    D("Te reposer sur ta famille et tes amis", "🫂", "Ils t'accompagnent à chaque étape. Tu retrouves peu à peu des forces.", { sante: -9, bonheur: 3, bonte: 3, flag: "rescape", later: { id: "apres_maladie", in: 1 } }),
  ],
});

ev("infarctus", {
  ages: [40, 92], tags: ["sante"], ic: "❤️‍🔥🚑", w: 2, need: { stat: { sante: [null, 72] } },
  t: "Une douleur dans la poitrine, un bras engourdi, le souffle court. Tu comprends avant même que les mots arrivent. Ton cœur te lance un avertissement.",
  c: [
    D("Appeler les secours immédiatement", "🚑", "Les pompiers arrivent en sept minutes. Tu en sors vivant{|e} avec un stent et des conseils sévères.", { sante: -6, prudent: 4, argent: -400 }),
    C("Attendre que la douleur passe", "⏳", [O(0.5, "La douleur passe. Tu consultes finalement, avec un bon coup de chance.", { sante: -8, prudent: 3 }), O(0.5, "Le cœur lâche. Les secours arrivent trop tard.", { die: "d'un infarctus fulgurant" })], { risk: 3 }),
  ],
});

ev("avc", {
  ages: [50, 95], tags: ["sante"], ic: "🧠⚠️", w: 1.8, need: { stat: { sante: [null, 75] } },
  t: "Ton sourire s'efface d'un côté. Les mots sortent dans le désordre, ta main refuse d'obéir. Un proche comprend aussitôt et compose le numéro d'urgence.",
  c: [
    D("Faire confiance aux secours", "🚑", "Prise en charge rapide, rééducation patiente. Tu retrouves presque tout.", { sante: -10, courage: 4, bonheur: -2, flag: "rescape" }),
    C("Refuser d'aller à l'hôpital", "🙅", [O(0.4, "Cela passe. Tu consultes ensuite, très secoué{|e}.", { sante: -12, prudent: 3 }), O(0.6, "La situation s'aggrave dans la nuit.", { die: "d'un accident vasculaire cérébral" })], { risk: 3 }),
  ],
});

ev("accident_moto", {
  ages: [16, 55], tags: ["sante"], ic: "🏍️💥", w: 1.5, need: { stat: { sport: [35, null] } },
  t: "Un carrefour, une moto, une voiture qui change de voie sans prévenir. Tu entends un crissement de pneus, puis un silence irréel.",
  c: [
    C("Freiner à fond", "🛑", [O(0.88, "Tu t'en sors avec des bleus et un grand coup de chaud.", { sante: -4, prudent: 3, courage: 1 }), O(0.1, "Fractures, hospitalisation, mois de rééducation.", { sante: -14, sport: -6, argent: -900, prudent: 4 }), O(0.02, "Le choc est trop violent.", { die: "d'un accident de moto" })], { risk: 3 }),
    C("Tenter l'évitement", "🏍️", [O(0.7, "Tu esquives avec brio. Tu te sens invincible.", { courage: 3, sport: 1 }), O(0.25, "Chute sérieuse, mais tu es casqué.", { sante: -8, argent: -400 }), O(0.05, "Tu n'as pas pu éviter l'obstacle.", { die: "d'un accident de moto" })], { risk: 3 }),
  ],
});

ev("accident_ski", {
  ages: [8, 65], tags: ["sante"], ic: "🎿💥", w: 2,
  t: "Une plaque de glace sur la piste rouge, un skieur pressé, un virage qui se transforme en vol plané de quarante mètres. Un chamois te regarde passer, impressionné.",
  c: [
    D("Se relever en riant", "😅", "Une belle frayeur. Tu repars en boitillant.", { sante: -3, courage: 2, bonheur: 1 }),
    C("Continuer pour finir la journée", "🏂", [O(0.8, "Tu termines sur les rotules, mais sans mal.", { courage: 2, sante: -2 }), O(0.19, "Un genou qui fait des siennes. Six semaines de plâtre.", { sante: -8, sport: -4, argent: -300 }), O(0.01, "La chute est plus grave qu'il n'y paraissait.", { die: "d'un accident de ski sur une piste verglacée" })], { risk: 3 }),
    D("Appeler les secours", "🚁", "Un hélicoptère t'évacue. Tu es choyé{|e} comme un VIP.", { sante: -4, argent: -500, prudent: 2 }),
  ],
});

ev("coma_reveil", {
  ages: [6, 85], tags: ["sante"], ic: "😴🏥", w: 0.6,
  t: "Un choc violent, un trou noir, des voix lointaines. Quand tu rouvres les yeux, plusieurs semaines ont passé. Un infirmier te sourit. Tout est blanc autour de toi.",
  c: [
    D("Reprendre ta vie lentement", "🐢", "Une longue rééducation. Les gens autour de toi sont plus beaux que jamais.", { sante: -10, bonheur: 4, bonte: 3, flag: "rescape", later: { id: "apres_maladie", in: 1 } }),
    D("Te battre pour tout retrouver", "🏋️", "Tu mets une rage de vivre dans chaque exercice. Les médecins sont stupéfaits.", { sante: -6, courage: 6, sport: -2, flag: "rescape", later: { id: "apres_maladie", in: 1 } }),
  ],
});

ev("maladie_rare", {
  ages: [8, 60], tags: ["sante"], ic: "🧬❓", w: 0.6, need: { noflag: "maladie_rare" },
  t: "Des symptômes étranges que personne ne comprend. Dix médecins, vingt examens, un diagnostic qui arrive enfin. Une maladie dont le nom ne se prononce pas du premier coup.",
  c: [
    D("Rejoindre une association de patients", "🤝", "Tu rencontres des personnes qui te comprennent. La force du groupe te réconforte.", { sante: -4, bonte: 4, sociable: 3, bonheur: 2, flag: "maladie_rare" }),
    D("Devenir expert de ta maladie", "📚", "Tu lis tout, tu poses mille questions. Les médecins te consultent presque.", { intel: 4, prudent: 3, sante: -3, flag: "maladie_rare" }),
    D("Refuser de te laisser définir par elle", "🦁", "Tu continues à vivre pleinement. Tu adaptes ton rythme.", { courage: 5, sante: -4, bonheur: 3, flag: "maladie_rare" }),
  ],
});

ev("accident_handicap", {
  ages: [18, 70], tags: ["sante"], ic: "🦽💫", w: 0.7, need: { noflag: "handicap" },
  t: "Un accident, un long séjour à l'hôpital, puis la nouvelle. Ton corps ne fonctionnera plus tout à fait comme avant. Les premiers jours sont durs, ton entourage se serre autour de toi.",
  c: [
    D("Te lancer dans la rééducation", "💪", "Chaque petit progrès est une victoire. Tu apprends une nouvelle façon de vivre.", { sante: -8, courage: 6, bonheur: -1, flag: "handicap", later: { id: "adaptation_handicap", in: 1 } }),
    D("Te faire aider par ta famille", "🫂", "Ceux qui t'aiment se mobilisent. Tu apprends à accepter l'aide.", { sante: -8, bonte: 3, flag: "handicap", later: { id: "adaptation_handicap", in: 1 } }),
  ],
});
ev("adaptation_handicap", {
  chainOnly: true, tags: ["sante"], ic: "🌟🦽",
  t: "Les mois ont passé, tu t'es fait à ta nouvelle vie. Les regards ont changé, certains se sont éloignés, d'autres se sont rapprochés. Tu as découvert une force que tu ne soupçonnais pas.",
  c: [
    D("Te lancer dans le sport adapté", "🏅", "Tu t'entraînes avec acharnement, tu gagnes tes premières médailles.", { sport: 5, courage: 4, bonheur: 5, repute: 4 }),
    D("Militer pour l'accessibilité", "📣", "Tu deviens la voix de ceux que l'on n'entend pas. Ton combat inspire.", { repute: 8, bonte: 4, bonheur: 3 }),
    D("Vivre simplement", "🌱", "Tu cultives les petits bonheurs, un jour à la fois.", { bonheur: 5, sante: 1 }),
  ],
});

ev("greffe_urgente", {
  ages: [15, 70], tags: ["sante"], ic: "🫀🏥", w: 0.5, need: { stat: { sante: [null, 55] } },
  t: "Un organe qui fatigue, une liste d'attente, un téléphone qui sonne en pleine nuit. « On a un donneur ». Tu pars en trombe à l'hôpital.",
  c: [
    C("Accepter la greffe", "🫀", [O(0.85, "L'opération réussit. Tu respires, littéralement, comme jamais.", { sante: 10, bonheur: 8, bonte: 3, argent: -300 }), O(0.15, "Les complications s'enchaînent. Tu t'en sors, très affaibli{|e}.", { sante: -10, bonheur: 2 })], { risk: 2 }),
    C("Attendre un autre donneur", "⏳", [O(0.5, "Un autre donneur arrive, plus compatible.", { sante: 6, bonheur: 5 }), O(0.5, "Ton état s'aggrave pendant l'attente.", { sante: -10, bonheur: -3 })], { risk: 3 }),
  ],
});

ev("grippe_mondiale", {
  ages: [5, 95], tags: ["sante"], ic: "😷🌍", w: 0.8, cool: 40, once: false,
  t: "Un virus inconnu traverse les frontières. Les écoles ferment, les masques se vendent à prix d'or et les supermarchés se vident de papier toilette.",
  c: [
    D("Rester confiné chez toi", "🏠", "Tu passes des semaines à faire du pain, des puzzles et des visioconférences. Tu t'en sors indemne.", { sante: 1, bonheur: -3, intel: 1, creatif: 2 }),
    C("Continuer à vivre normalement", "🎉", [O(0.65, "Tu passes entre les gouttes.", { bonheur: 3, sociable: 2 }), O(0.3, "Tu attrapes le virus, quelques semaines difficiles.", { sante: -8, bonheur: -3, repute: -2 }), O(0.05, "Le virus est plus fort que toi.", { die: "d'une pandémie mondiale" })], { risk: 3 }),
    D("Se porter volontaire pour aider", "🤲", "Tu livres des repas, tu soutiens les voisins. Ta réputation grandit.", { repute: 6, bonte: 5, sante: -2, bonheur: 2 }),
  ],
});

// ---------- Âge avancé ----------
ev("alzheimer_debut", {
  ages: [72, 100], tags: ["sante"], ic: "🧩🌫️", w: 2.5, need: { noflag: "memoire_floue" },
  t: "Tu cherches tes clés, tu les retrouves dans le frigo. Tu oublies le prénom de ta voisine, puis le tien un instant. Ta mémoire fait des siennes.",
  c: [
    D("Consulter un spécialiste", "🩺", "Un suivi attentif, des exercices, des conseils. Tu gagnes du temps et de la sérénité.", { sante: -2, bonheur: 1, intel: -2, argent: -200, flag: "memoire_floue" }),
    D("Tout noter dans un carnet", "📓", "Ton carnet devient ton meilleur ami. Tu t'organises avec humour.", { intel: -1, prudent: 3, bonheur: 2, flag: "memoire_floue" }),
    D("Ne rien dire à personne", "🤐", "Tu bricoles. Tes proches se doutent de quelque chose.", { bonheur: -3, intel: -3, flag: "memoire_floue" }),
  ],
});

ev("canicule_senior", {
  ages: [65, 100], tags: ["sante"], ic: "🌡️🥵", w: 2,
  t: "Quarante degrés à l'ombre. Les volets sont fermés, le ventilateur gémit, et ton thermomètre affiche une température qui ressemble à un record.",
  c: [
    D("Te rafraîchir et boire beaucoup", "🧊", "Tu passes la canicule à l'ombre, un linge humide sur le front.", { sante: -1, prudent: 2 }),
    D("Aller chez des proches climatisés", "🏡", "Une belle occasion de passer du temps avec la famille.", { bonheur: 3, bonte: 1 }),
    C("Sortir faire tes courses malgré la chaleur", "🥵", [O(0.9, "Tu rentres épuisé{|e} mais en un morceau.", { sante: -3 }), O(0.1, "Un malaise sévère t'allonge sur le trottoir.", { sante: -10 }), O(0.04, "La chaleur est trop forte pour ton cœur.", { die: "pendant une canicule étouffante" })], { risk: 3 }),
  ],
});

ev("surdite_vue", {
  ages: [55, 100], tags: ["sante"], ic: "👓👂", w: 3, need: { noflag: "lunettes_audio" },
  t: "Tu dis « pardon » à chaque phrase et tu confonds ta voisine avec un lampadaire. Ton médecin sourit, sort un cahier et te prescrit lunettes et appareil auditif.",
  c: [
    D("Accepter tes nouveaux accessoires", "🕶️", "Le monde reprend ses couleurs et ses sons. Tu redécouvres le chant des oiseaux.", { bonheur: 3, sante: 1, argent: -600, flag: "lunettes_audio" }),
    D("Refuser pour la fierté", "🙅", "Tu continues à crier « quoi ? ». Ta famille craque.", { bonheur: -2, flag: "lunettes_audio", sociable: -2 }),
  ],
});

flash("Un mal de dos soudain t'immobilise pendant une semaine. Tu apprends la patience, puis l'ennui.", { sante: -1, bonheur: -1 }, { ages: [25, 80] });
flash("Un rhume tenace te transforme en moulin à mouchoirs pendant dix jours.", { sante: -1, bonheur: -1 }, { ages: [6, 95] });
flash("Un examen de routine confirme que tu es en parfaite santé. Ton médecin te félicite.", { sante: 2, bonheur: 2 }, { ages: [20, 80] });
flash("Une entorse à la cheville te donne l'occasion de paresser sur le canapé.", { sante: -1, bonheur: 1 }, { ages: [8, 70] });
flash("Un moustique de compétition te laisse trente piqûres. Tu te grattes en cadence.", { bonheur: -1 }, { ages: [6, 90] });
flash("Tu passes une nuit blanche à regarder une série. Le café du lendemain a un goût de victoire.", { sante: -1, bonheur: 1 }, { ages: [14, 60] });
