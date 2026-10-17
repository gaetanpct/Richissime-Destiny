// Santé, accidents, frôlements de la mort
const { ev, flash, O, C, D } = require("../kit");

ev("grippe_costaud", {
  ages: [6, 90], tags: ["sante"], ic: "🤧🌡️", w: 6,
  t: "Une grippe monstrueuse te cloue au lit. Ton nez coule comme une fontaine, ta tête résonne comme un gong, et tu n'as plus de mouchoirs.",
  c: [
    D("Se reposer comme un moine", "🛏️", "Quelques jours de tisane, de plaid et de séries. Tu en ressors régénéré{|e}.", { sante: 1, bonheur: 1, perf: -1 }),
    C("Travailler malgré la fièvre", "💪", [O(0.5, "Tu passes entre les gouttes.", { courage: 2, perf: 3, sante: -2 }), O(0.5, "Tu contamines tout le bureau.", { sante: -4, repute: -2, perf: -2 })]),
    D("Prendre des médicaments miracles", "💊", "Cela soulage, un peu.", { argent: -30, sante: 0 }),
  ],
});

ev("accident_velo", {
  ages: [8, 75], tags: ["sante"], ic: "🚲💥", w: 4,
  t: "Un chat traverse, tu freines, le vélo glisse sur une flaque d'huile et tu atterris dans une haie d'épines. Spectacle assuré.",
  c: [
    D("Te relever, rire", "😅", "Quelques égratignures, un pantalon troué, un sourire.", { sante: -2, courage: 1, bonheur: 1 }),
    C("Aller aux urgences", "🏥", [O(0.7, "Rien de cassé. Quelques points de suture.", { sante: -1, argent: -120, prudent: 2 }), O(0.3, "Un poignet cassé, six semaines de plâtre.", { sante: -4, sport: -2, argent: -200 })]),
    D("Remonter et continuer", "🚴", "Têtu{|e} comme une mule, tu n'as que quelques bleus.", { sante: -2, courage: 2, sport: 1 }),
  ],
});

ev("accident_voiture", {
  ages: [18, 85], tags: ["sante"], ic: "🚗💥", w: 3, need: { asset: "voiture" },
  t: "Un carrefour, un feu orange, une voiture qui déboule. Le choc est violent mais tu t'en sors, sonné{|e}, avec la voiture en accordéon.",
  c: [
    D("Appeler les secours et l'assurance", "📞", "Tout se passe pour le mieux, à part la voiture.", { sante: -4, argent: -600, prudent: 2, loseItem: "voiture" }),
    C("Fuir le lieu de l'accident", "🏃", [O(0.5, "Personne ne t'a vu. Mais tu portes ce poids.", { honnete: -6, sante: -3, loseItem: "voiture" }), O(0.5, "Un témoin t'a identifié{|e}. La justice s'en mêle.", { honnete: -6, argent: -2500, record: 1, repute: -5, loseItem: "voiture" })], { risk: 2 }),
  ],
});

ev("dent_douleur", {
  ages: [10, 90], tags: ["sante"], ic: "🦷😖", w: 4,
  t: "Une dent te lance, un soir sans dentiste ouvert. Ton visage ressemble à un ballon de baudruche, et ta tisane au clou de girofle ne sert à rien.",
  c: [
    D("Aller chez le dentiste", "🦷", "Un petit soin, une longue facture.", { sante: 2, argent: -250 }),
    D("Serrer les dents", "😬", "Tu supportes. Jusqu'au prochain accès.", { sante: -2, courage: 1 }),
    C("Arracher soi-même", "🛠️", [O(0.2, "Miracle, la dent sort sans souci.", { courage: 4, sante: 0 }), O(0.8, "Infection, hôpital, grosse facture.", { sante: -5, argent: -600, bonheur: -3 })], { risk: 2 }),
  ],
});

ev("mauvais_dos", {
  ages: [28, 80], tags: ["sante"], ic: "🧱😩", w: 5,
  t: "Un matin, tu te penches pour attacher un lacet et ton dos se bloque. Plus un geste. Tu restes figé{|e} comme une statue de sel.",
  c: [
    D("Aller voir un kiné", "💆", "Séances, étirements et conseils. Tu retrouves ta souplesse.", { sante: 3, argent: -250, sport: 1 }),
    D("Prendre des anti-inflammatoires", "💊", "Le soulagement est rapide mais temporaire.", { sante: -1, argent: -20 }),
    D("Se mettre au yoga", "🧘", "Un changement de vie. Tu t'étires comme un chat.", { sante: 3, sport: 2, bonheur: 3, argent: -100 }),
  ],
});

ev("check_up_surprise", {
  ages: [40, 85], tags: ["sante"], ic: "🩺📊", w: 5, once: false, cool: 5,
  t: "Ton médecin te convoque pour un bilan de santé. Il tapote sur son clavier avec une moue étrange et te conseille un peu de repos et beaucoup de légumes.",
  c: [
    D("Suivre ses conseils", "🥦", "Tu mets de l'ordre dans tes habitudes.", { sante: 5, sport: 2, bonheur: 1 }),
    D("Ignorer l'avertissement", "🙉", "Tu continues comme avant. Pour l'instant.", { sante: -2, prudent: -1 }),
    C("Se faire un régime strict", "🥗", [O(0.6, "Tu perds du poids et gagnes en énergie.", { sante: 6, sport: 3, bonheur: -1 }), O(0.4, "Tu craques au bout de trois jours.", { sante: 0, bonheur: -1 })]),
  ],
});

ev("tabac_arret", {
  ages: [18, 80], tags: ["sante"], ic: "🚭💪", w: 5, need: { flag: "fumeur" },
  t: "Tu tousses de plus en plus, le médecin fronce les sourcils et ton conjoint sent la fumée à des kilomètres. Arrêter, c'est l'idée du moment.",
  c: [
    C("Arrêter net", "🛑", [O(0.5, "Tu y arrives ! Les poumons te remercient.", { unflag: "fumeur", sante: 6, courage: 3, bonheur: 2 }), O(0.5, "Tu craques au bout de deux semaines.", { courage: 1, bonheur: -2 })]),
    D("Passer à la cigarette électronique", "🔋", "Tu fumes d'un autre genre, l'odeur de barbe à papa.", { sante: 1, argent: -80 }),
    D("Continuer comme avant", "🚬", "Tu rationalises. Ta santé en prend un coup.", { sante: -4, bonheur: 0 }),
  ],
});

ev("intoxication_alimentaire", {
  ages: [6, 90], tags: ["sante", "loufoque"], ic: "🤢🍤", w: 4,
  t: "Ce petit restaurant de bord de route avait pourtant l'air accueillant. Mais ta soupe était « un peu spéciale ». Quelques heures plus tard, ton ventre devient une salle de concert.",
  c: [
    D("Boire de l'eau et dormir", "💧", "La nuit est longue, le matin plus doux.", { sante: -2, bonheur: -2 }),
    D("Aller aux urgences", "🏥", "On te met sous perfusion. Tu apprécies la télévision.", { sante: -1, argent: -120 }),
    D("Se plaindre à l'établissement", "📣", "Le restaurateur te rembourse en pleurant.", { argent: 40, honnete: 1, bonheur: 1 }),
  ],
});

ev("choc_cardiaque_alerte", {
  ages: [50, 90], tags: ["sante"], ic: "❤️⚡", w: 3, need: { stat: { sante: [null, 60] } },
  t: "Un jour, alors que tu gravis une simple marche, ta poitrine se serre. Tes mains tremblent et ton souffle se raccourcit. Le médecin parle d'un avertissement sérieux.",
  c: [
    D("Changer de mode de vie", "🌿", "Tu marches chaque jour, tu manges mieux, tu respires plus profondément.", { sante: 6, sport: 3, bonheur: 1, ambition: -1 }),
    C("Se faire opérer", "🏥", [O(0.85, "Une opération réussie. Tu repars avec un pontage et des conseils.", { sante: 6, argent: -500, bonheur: 2 }), O(0.15, "Complications sérieuses, mais tu te rétablis.", { sante: -4, argent: -800 })], { risk: 1 }),
    C("Ignorer et continuer", "🙈", [O(0.65, "Tu t'en tires, cette fois.", { sante: -4 }), O(0.35, "Le cœur ne fait plus d'efforts pour toi.", { die: "d'une crise cardiaque en pleine ascension de marche" })], { risk: 3 }),
  ],
});

ev("covid_style_pandemie", {
  ages: [10, 90], tags: ["sante"], ic: "😷🏠", w: 2,
  t: "Une épidémie fait tout fermer. Cafés, cinémas, bureaux, écoles. Les gens se parlent à deux mètres et se lavent les mains en chantant.",
  c: [
    D("Respecter scrupuleusement les gestes", "🧴", "Tu traverses la crise avec patience et du gel hydroalcoolique.", { prudent: 3, sante: 1, bonheur: -3 }),
    D("Profiter du temps pour créer", "🎨", "Pain au levain, peinture, ukulélé. Ton talent éclate.", { creatif: 4, bonheur: 2, intel: 1 }),
    C("Faire la fête en cachette", "🥳", [O(0.5, "Personne ne dit rien. Quelle soirée !", { bonheur: 5, honnete: -1 }), O(0.5, "Tu attrapes le virus. Il te cloue au lit.", { sante: -6, bonheur: -3, argent: -300 })], { risk: 1 }),
  ],
});

ev("sport_blessure", {
  ages: [14, 60], tags: ["sante", "sport"], ic: "🏃🩹", w: 4, need: { stat: { sport: [50, null] } },
  t: "Pendant un match endiablé, ton genou craque. Tu t'effondres sous les cris du public. L'arbitre siffle, la douleur aussi.",
  c: [
    D("Se faire opérer", "🏥", "Une longue rééducation, mais tu reviens plus fort.", { sante: -3, sport: -4, courage: 2, argent: -400 }),
    D("Se reposer et reprendre doucement", "🧊", "Quelques semaines de repos, de glace et de patience.", { sante: -1, sport: -1, prudent: 2 }),
    C("Reprendre tout de suite", "💥", [O(0.3, "Ça tient, tu es un héros.", { courage: 3, sport: 1, repute: 2 }), O(0.7, "Tu aggraves la blessure.", { sante: -5, sport: -5 })], { risk: 2 }),
  ],
});

ev("chute_escalier_mortelle", {
  ages: [60, 100], tags: ["sante"], ic: "🪜💀", w: 2, need: { stat: { sante: [null, 40] } },
  t: "Un escalier un peu raide, des pantoufles un peu lisses, un chat qui passe au mauvais moment. Tu glisses, tu cries, tu dégringoles.",
  c: [
    C("S'accrocher à la rampe", "🪝", [O(0.7, "Tu t'accroches de justesse. Frayeur mais pas de casse.", { courage: 2, sante: -2 }), O(0.3, "Tu ne parviens pas à te rattraper.", { die: "après une chute dans l'escalier, entouré de son chat" })], { risk: 3 }),
    D("Appeler à l'aide", "📞", "Les secours arrivent à temps. Tu t'en sors avec des bleus.", { sante: -4, bonheur: -2 }),
  ],
});

ev("mort_ridicule", {
  ages: [30, 90], tags: ["loufoque", "sante"], ic: "🤡⚰️", w: 1,
  t: "Tout allait pour le mieux jusqu'à ce qu'un pigeon, une peau de banane et un seau de peinture s'alignent d'un seul coup devant toi, tels des planètes cosmiques.",
  c: [
    C("Éviter les trois", "🤸", [O(0.9, "Tu esquives avec grâce. La foule applaudit.", { sport: 2, charme: 2, repute: 3 }), O(0.1, "Tu ne les évites pas tous.", { die: "d'un accident rarissime impliquant un pigeon, une banane et un seau de peinture" })], { risk: 3 }),
    D("Rester immobile", "🗿", "Les objets passent sans t'atteindre. Quelle chance.", { prudent: 2, bonheur: 1 }),
  ],
});

ev("noyade_evitee", {
  ages: [8, 80], tags: ["sante"], ic: "🌊🛟", w: 2,
  t: "Une vague plus haute que prévu te surprend en pleine baignade. Le courant t'entraîne au large, la plage rapetisse, les mouettes se moquent.",
  c: [
    C("Nager vers la côte", "🏊", [O(0.7, "Tu t'en sors à bout de forces, avec une leçon de prudence.", { sport: 2, courage: 3, sante: -2 }), O(0.3, "Tu t'épuises. Un maître nageur te repêche de justesse.", { sante: -5, bonheur: -2, repute: 1 })], { risk: 2 }),
    D("Appeler à l'aide et flotter", "🆘", "Un sauveteur arrive en bateau. Tu es touché{|e} par son courage.", { prudent: 3, sante: -1, bonheur: 1 }),
  ],
});

ev("fievre_inconnue", {
  ages: [6, 90], tags: ["sante"], ic: "🌡️🔬", w: 3, once: false, cool: 6,
  t: "Une fièvre étrange, rebelle et fantasque, te prend un lundi. Le médecin hésite entre dix diagnostics et en choisit un avec une moue.",
  c: [
    D("Suivre le traitement", "💊", "Au bout de dix jours, tout rentre dans l'ordre.", { sante: -2, argent: -80 }),
    C("Demander un deuxième avis", "🩺", [O(0.6, "Le deuxième médecin trouve la bonne piste.", { sante: 2, argent: -150 }), O(0.4, "Il en trouve une autre. Ça se complique.", { sante: -4, argent: -150 })]),
    D("Se soigner à la tisane", "🍵", "Ça marche à peu près.", { sante: -1, bonheur: 1 }),
  ],
});

flash("Tu éternues sept fois de suite sans pouvoir t'arrêter.", { bonheur: 0, sante: 0 });
flash("Un coup de soleil te donne une allure de homard cuit.", { sante: -1, bonheur: -1 }, { ages: [8, 70] });
flash("Tu fais ta première séance de sport de l'année. Tes jambes s'en souviennent.", { sport: 1, sante: 1, bonheur: 0 }, { ages: [16, 70] });
flash("Un rhume bénin te cloue au lit trois jours. Tu apprécies les soupes de ta voisine.", { sante: -1, bonheur: 1 });
flash("Ton médecin t'annonce que tes analyses sont parfaites. Tu fêtes ça avec un éclair au chocolat.", { sante: 1, bonheur: 2 }, { ages: [30, 90] });
flash("Un moustique t'a choisi{|e} comme repas principal. Tu comptes quarante piqûres.", { sante: -1, bonheur: -1 }, { ages: [8, 80] });
flash("Tu dors quatorze heures d'affilée. Le monde semble neuf.", { sante: 2, bonheur: 2 }, { ages: [14, 70] });
flash("Tu oublies ton parapluie et reviens trempé{|e}. Un thé, un plaid, tout va bien.", { sante: -1, bonheur: 1 });
