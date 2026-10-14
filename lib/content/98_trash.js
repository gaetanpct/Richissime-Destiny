// Soirées, scandales et dérapages. Thèmes adultes, traités avec humour et sans rien montrer.
const { ev, flash, O, C, D } = require("../kit");

ev("trash_lendemain", {
  ages: [18, 50], tags: ["mature", "fete"], ic: "🥴🍾", w: 5, once: false, cool: 3,
  t: "Tu te réveilles sur un canapé inconnu, avec un cône de signalisation sur la tête, une moitié de moustache dessinée au feutre et aucun souvenir de la soirée. Ton téléphone affiche trente-sept messages.",
  c: [
    D("Reconstituer la soirée avec les messages", "🕵️", "Tu découvres que tu as chanté l'hymne national sur un toit. Cent vues, deux applaudissements.", { bonheur: 3, repute: 1, sante: -2 }),
    D("Rentrer discrètement et faire comme si de rien n'était", "🤫", "Personne ne saura jamais. Sauf les trois témoins et le chat.", { bonheur: 1, sante: -2 }),
    C("Poster une photo sur les réseaux", "📸", [O(0.5, "La photo fait rire tout le monde. Tu gagnes en popularité.", { repute: 4, bonheur: 4, charme: 1 }), O(0.5, "Ton patron voit la photo. Rendez-vous demain matin.", { repute: -4, perf: -4, bonheur: -3 })], { risk: 1 }),
  ],
});

ev("trash_tatouage", {
  ages: [18, 45], tags: ["mature", "fete"], ic: "💉😬", w: 3, once: true,
  t: "Après un pari stupide entre amis, tu te retrouves devant un tatoueur, un formulaire et une grande envie de dire non. Sur le mur, un dessin de dauphin portant un chapeau te regarde fixement.",
  c: [
    C("Aller jusqu'au bout", "🐬", [O(0.5, "Le dauphin est magnifique. Il devient ton emblème.", { courage: 3, bonheur: 4, charme: 1, flag: "tatoue" }), O(0.5, "Le dauphin ressemble à un poulet. Tu le regretteras longtemps.", { bonheur: -3, charme: -2, repute: -1, flag: "tatoue" })], { risk: 1, cost: 150 }),
    D("Te dégonfler avec honneur", "🐔", "Tu rentres chez toi, ta peau est intacte. Tes amis te traitent de poule.", { prudent: 2, bonheur: -1 }),
    D("Proposer un autre dessin", "✏️", "Tu choisis un petit symbole discret. Une bonne décision.", { creatif: 2, bonheur: 2, argent: -100, flag: "tatoue" }),
  ],
});

ev("trash_chantage_photo", {
  ages: [20, 65], tags: ["mature", "scandale"], ic: "📸😰", w: 2, once: false, cool: 12, need: { stat: { repute: [45, null] } },
  t: "Un message anonyme arrive. Il contient une photo de toi dans une situation embarrassante, prise lors d'une soirée oubliée. L'expéditeur réclame 5 000 € en échange de son silence.",
  c: [
    C("Payer discrètement", "💸", [O(0.5, "L'affaire s'arrête là. Personne ne saura rien.", { argent: -5000, bonheur: -3 }), O(0.5, "Un second message arrive deux mois plus tard. Le chantage recommence.", { argent: -5000, bonheur: -5, honnete: -1 })], { risk: 2, cost: 5000 }),
    D("Prévenir la police", "🚔", "L'enquête remonte jusqu'à un ancien collègue maladroit. La photo disparaît.", { honnete: 3, courage: 3, bonheur: 2, repute: 1 }),
    C("Publier toi-même la photo avec humour", "😂", [O(0.6, "Ta franchise désarme tout le monde. Le chantage perd tout son venin.", { repute: 5, courage: 5, bonheur: 5, charme: 1 }), O(0.4, "L'humour ne passe pas. Ta réputation en prend un coup.", { repute: -6, bonheur: -3 })], { risk: 2 }),
    D("Ignorer le message", "🙈", "L'expéditeur n'y donne pas suite. Tu as eu raison, ou de la chance.", { courage: 2, bonheur: -1 }),
  ],
});

ev("trash_video_gene", {
  ages: [16, 60], tags: ["mature", "scandale"], ic: "🎥😖", w: 3, once: false, cool: 8,
  t: "Une vidéo de toi, filmée à ton insu, fait le tour du quartier. On t'y voit danser sur une table en chantant faux, un manteau de fourrure sur le dos et un poisson dans la main.",
  c: [
    D("Assumer, rire de toi-même", "😅", "Tu partages la vidéo avec une légende drôle. Les gens adorent ton autodérision.", { repute: 5, bonheur: 4, courage: 3 }),
    D("Demander le retrait de la vidéo", "📧", "Après quelques courriers, la vidéo est supprimée. Il en reste des copies dans le monde.", { argent: -100, bonheur: -1, prudent: 2 }),
    C("En faire un spectacle", "🎭", [O(0.4, "Un producteur remarque ton talent et t'offre un contrat.", { repute: 7, argent: 3000, bonheur: 6, creatif: 3 }), O(0.6, "Personne n'apprécie. Tu deviens un meme triste.", { repute: -4, bonheur: -3 })], { risk: 1 }),
  ],
});

ev("trash_enterrement_vie", {
  ages: [22, 45], tags: ["mature", "fete"], ic: "🎊🍻", w: 3, once: false, cool: 6,
  t: "Tu es chargé{|e} d'organiser l'enterrement de vie de célibataire d'un proche. Budget de 2 000 €, un week-end à l'étranger, quinze amis et la consigne « faites en sorte que ça reste secret ».",
  c: [
    D("Organiser une soirée mémorable et raisonnable", "🥂", "Une belle fête sans dégâts. Le futur marié pleure de bonheur.", { sociable: 3, bonheur: 6, repute: 3, argent: -300 }),
    C("Tout miser sur une soirée démesurée", "🎰", [O(0.5, "La soirée est légendaire. On en parlera pendant trente ans.", { bonheur: 9, sociable: 4, repute: 5, argent: -1500, sante: -2 }), O(0.5, "Le futur marié se retrouve à l'autre bout de la ville en slip.", { bonheur: 3, repute: -3, argent: -1500, sante: -2 })], { risk: 2 }),
    D("Proposer un week-end à la campagne", "🌾", "Des randonnées, du barbecue, de belles discussions. Peu de folie, beaucoup de rires.", { bonheur: 4, sante: 1, argent: -200 }),
  ],
});

ev("trash_arnaque_amour", {
  ages: [22, 85], tags: ["mature", "amour", "scandale"], ic: "💔💻", w: 2, once: false, cool: 12, need: { single: true, money: [1000, null] },
  t: "Une belle inconnue te contacte en ligne et te jure un amour éternel après trois jours. Elle vit à l'étranger, son téléphone est en panne et elle a besoin de 1 500 € pour un billet d'avion.",
  c: [
    C("Envoyer l'argent", "💸", [O(0.15, "Elle existe, vous vous retrouvez. Une histoire d'amour improbable commence.", { bonheur: 8, argent: -1500, charme: 1 }), O(0.85, "Elle disparaît avec l'argent. La honte te ronge.", { argent: -1500, bonheur: -6, repute: -1, prudent: 4 })], { risk: 3, cost: 1500 }),
    D("Demander une vidéo en direct", "📹", "Elle esquive chaque fois. Tu coupes court, un peu triste mais sauf.", { intel: 2, prudent: 3, bonheur: -1 }),
    D("Bloquer et signaler", "🚫", "Tu protèges ta fierté et ton compte en banque.", { prudent: 3, honnete: 1 }),
  ],
});

ev("trash_bagarre_bar", {
  ages: [18, 55], tags: ["mature"], ic: "🍺👊", w: 3, once: false, cool: 8,
  t: "Dans un bar, un inconnu te bouscule et renverse ta bière sur ton plus beau pull. Il rit. Ses amis aussi. L'ambiance monte d'un cran.",
  c: [
    C("Répondre avec les poings", "👊", [O(0.35, "Tu mets le plus grand à terre. La salle applaudit.", { courage: 3, repute: 2, sante: -2 }), O(0.65, "Tu te retrouves avec un œil au beurre noir et une dent en moins.", { sante: -6, repute: -3, argent: -300 })], { risk: 2 }),
    D("Payer une tournée pour désamorcer", "🍻", "Les rires reviennent. Tu repars avec trois nouveaux amis.", { sociable: 3, argent: -60, bonheur: 3 }),
    D("Partir sans un mot", "🚶", "Tu quittes la salle la tête haute. Ton pull a l'odeur de la défaite.", { prudent: 2, bonheur: -1 }),
  ],
});

ev("trash_course_clandestine", {
  ages: [18, 45], tags: ["mature"], ic: "🏎️🌃", w: 2, once: false, cool: 10,
  t: "Un ami te propose une course clandestine sur un parking désert. Des voitures bricolées, des phares allumés, des paris échangés dans la pénombre.",
  c: [
    C("Participer au pari", "💵", [O(0.4, "Ton ami gagne. Tu empoches une jolie somme.", { argent: 1200, bonheur: 4 }), O(0.6, "Il perd. Tu perds aussi.", { argent: -600, bonheur: -2 })], { risk: 2 }),
    C("Participer à la course", "🏁", [O(0.3, "Tu gagnes ! Une gloire éphémère et un trophée en plastique.", { courage: 3, argent: 2000, repute: 2, bonheur: 5 }), O(0.5, "Tu perds, vexé{|e}, mais intact{|e}.", { bonheur: -2, courage: 1 }), O(0.2, "Un accident bête t'envoie à l'hôpital.", { sante: -10, argent: -1500, record: 1 })], { risk: 3 }),
    D("Rester spectateur", "👀", "Tu regardes en mangeant des chips. Ton ami revient en héros.", { bonheur: 2, prudent: 1 }),
  ],
});

ev("trash_liaison_secrete", {
  ages: [25, 65], tags: ["mature", "amour"], ic: "🤫💋", w: 2, once: false, cool: 10, need: { partner: true },
  t: "Un collègue te lance des regards de plus en plus appuyés. Un soir, après le travail, il te propose un dernier verre. Ton téléphone vibre, c'est un message tendre de ton partenaire.",
  c: [
    D("Refuser et rentrer chez toi", "🏠", "Tu rentres. Ton couple t'en est reconnaissant sans jamais savoir pourquoi.", { honnete: 3, bonheur: 2 }),
    C("Céder à la tentation", "🔥", [O(0.45, "Personne n'en sait rien. Le remords pèse un peu.", { honnete: -5, bonheur: -2 }), O(0.55, "L'affaire s'ébruite. Ton couple vole en éclats.", { honnete: -5, bonheur: -8, repute: -5, flag: "rupture_trahison" })], { risk: 3 }),
    D("Tout avouer à ton partenaire", "🕊️", "Une grande discussion, des larmes, une promesse. Votre couple se renforce.", { honnete: 4, bonheur: -2, courage: 3 }),
  ],
});

ev("trash_soiree_privee", {
  ages: [22, 60], tags: ["mature", "monde"], ic: "🥂🕶️", w: 2, once: false, cool: 8, need: { stat: { repute: [55, null] } },
  t: "Une invitation dorée atterrit dans ta boîte aux lettres. Une soirée privée dans un château, sur invitation, avec des masques, des inconnus et un champagne très cher.",
  c: [
    D("Y aller sans poser de questions", "🎭", "Une soirée de rêve. Tu repars avec trois cartes de visite et un mystérieux sourire.", { bonheur: 7, sociable: 3, charme: 2, repute: 2, argent: -150 }),
    C("Y aller pour faire des affaires", "💼", [O(0.5, "Tu décroches un contrat colossal avec un inconnu élégant.", { argent: 6000, ambition: 3, repute: 3 }), O(0.5, "Tu te retrouves mêlé{|e} à un scandale. Les journaux s'en emparent.", { repute: -6, bonheur: -2 })], { risk: 2 }),
    D("Décliner l'invitation", "🙅", "Tu restes chez toi, un livre à la main. Tu ne sauras jamais.", { prudent: 2, bonheur: 1 }),
  ],
});

ev("trash_pari_stupide", {
  ages: [16, 40], tags: ["mature", "fete"], ic: "🎲🤡", w: 3, once: false, cool: 5,
  t: "Entre amis, un pari absurde est lancé, traverser la place à reculons, déguisé{|e} en poulet, en chantant l'hymne à pleins poumons. La mise est de 100 €.",
  c: [
    C("Relever le défi", "🐔", [O(0.7, "Tu remportes le pari sous les acclamations. La vidéo circule pendant des semaines.", { argent: 100, repute: 2, courage: 3, bonheur: 5 }), O(0.3, "Tu tombes dans une fontaine devant le maire.", { repute: -3, bonheur: -1, courage: 2 })], { risk: 1 }),
    D("Refuser avec élégance", "🙅", "Tu laisses l'honneur à plus audacieux que toi.", { prudent: 2 }),
    D("Proposer un défi plus raisonnable", "🧠", "Tu proposes un concours de blagues. Ça fait un tabac.", { creatif: 2, bonheur: 3 }),
  ],
});

ev("trash_sugar", {
  ages: [18, 35], tags: ["mature", "argent"], ic: "💍💸", w: 1.5, once: true, need: { money: [null, 1500] },
  t: "Un homme fortuné, très élégant, te propose un arrangement singulier. Il paiera ton loyer, tes sorties et tes voyages en échange de ta compagnie, sans plus de précisions. Il sourit comme un chat.",
  c: [
    C("Accepter l'arrangement", "💰", [O(0.5, "Tu vis à ses frais pendant un an, le temps de te lancer. Tout reste correct.", { argent: 12000, bonheur: 3, honnete: -3, repute: -1 }), O(0.5, "Les exigences augmentent, tu quittes l'arrangement la tête basse.", { argent: 3000, bonheur: -6, honnete: -3, repute: -3 })], { risk: 2 }),
    D("Refuser net", "🚫", "Tu gardes ta dignité. Le loyer reste lourd.", { honnete: 3, courage: 2, bonheur: 0 }),
    D("Lui proposer un emploi à la place", "💼", "Il rit, puis accepte. Tu deviens son assistant{|e} personnel{|le}.", { argent: 4000, perf: 3, ambition: 2, bonheur: 2 }),
  ],
});

ev("trash_paparazzi_pris", {
  ages: [20, 60], tags: ["mature", "scandale"], ic: "📸🤦", w: 2, once: false, cool: 10, need: { stat: { repute: [60, null] } },
  t: "Un photographe t'a pris en photo dans une situation embarrassante, un gâteau à la main, un clown dans les bras, un verre de trop. Le titre du journal promet une « soirée choc ».",
  c: [
    D("Faire un communiqué sobre", "📰", "Tu rappelles les faits. L'affaire s'éteint en deux jours.", { honnete: 2, repute: 1 }),
    D("Faire un grand sourire à la presse", "😁", "Tu retournes la situation à ton avantage. Tu fais la une... du bon côté.", { repute: 4, charme: 2, bonheur: 3 }),
    C("Poursuivre en justice", "⚖️", [O(0.4, "Tu gagnes. Le journal verse une indemnité.", { argent: 6000, repute: 2, honnete: 1 }), O(0.6, "Le procès s'éternise et coûte cher.", { argent: -2000, bonheur: -3, repute: -1 })], { risk: 2 }),
  ],
});

ev("trash_message_3h", {
  ages: [20, 60], tags: ["mature", "amour"], ic: "📱🌙", w: 3, once: false, cool: 6, need: { single: true },
  t: "À trois heures du matin, ton téléphone vibre. Un message de ton ex, trois mots, un point d'interrogation. Tu réfléchis avec un soupçon de lucidité et beaucoup de fatigue.",
  c: [
    D("Répondre avec chaleur", "💬", "Une conversation sincère qui dure jusqu'à l'aube. Rien ne change, tout s'apaise.", { bonheur: 3, bonte: 1, sante: -1 }),
    D("Ignorer et dormir", "😴", "Le sommeil gagne. Au matin, tu n'y penses presque plus.", { sante: 1, prudent: 1 }),
    C("Répondre avec une blague cruelle", "😈", [O(0.5, "Il rit et ne revient jamais.", { bonheur: 2, bonte: -1 }), O(0.5, "Un drame de messages en capitales éclate.", { bonheur: -4, repute: -1 })], { risk: 1 }),
  ],
});

ev("trash_poker_nuit", {
  ages: [20, 65], tags: ["mature", "argent"], ic: "🃏🌃", w: 3, once: false, cool: 6, need: { money: [1000, null] },
  t: "Des amis t'invitent à une partie de poker dans une arrière-salle enfumée. La mise d'entrée est de 500 €. La banque tourne, les cartes claquent et un monsieur dort sur sa chaise, un cigare éteint à la main.",
  c: [
    C("Jouer sérieusement", "♠️", [O(0.4, "Tu rafles la mise. Les adversaires te serrent la main avec respect.", { argent: 2500, intel: 1, bonheur: 5 }), O(0.6, "Tu perds ta mise, doucement, avec élégance.", { argent: -500, bonheur: -2 })], { risk: 2, cost: 500 }),
    C("Bluffer à fond", "🎭", [O(0.3, "Ton bluff passe. Tu quittes la table avec un butin.", { argent: 4000, courage: 3, bonheur: 6 }), O(0.7, "Ton bluff est repéré en trois secondes.", { argent: -1000, bonheur: -3 })], { risk: 3, cost: 1000 }),
    D("Regarder et boire un jus d'orange", "🍊", "Tu observes les joueurs. Leurs tics te passionnent plus que les cartes.", { intel: 1, bonheur: 2 }),
  ],
});

ev("trash_voisin_bruit", {
  ages: [18, 70], tags: ["mature", "voisinage"], ic: "🔊😡", w: 3, once: false, cool: 6, who: { voisin: "neighbor" },
  t: "$voisin fait la fête chaque soir jusqu'à quatre heures. Basses énormes, rires, une trompette de temps en temps. Tu n'as pas fermé l'œil depuis trois nuits.",
  c: [
    D("Frapper à sa porte poliment", "🚪", "Il s'excuse, baisse le son et t'invite à la prochaine fête, plus tôt.", { bonheur: 2, sociable: 2, rel: { voisin: 8 } }),
    D("Appeler la police", "📞", "Une patrouille passe. La fête s'arrête, la rancune commence.", { bonheur: -1, rel: { voisin: -15 } }),
    C("Lui rendre la monnaie de sa pièce", "🥁", [O(0.5, "Un concert de batterie à six heures du matin. Il comprend.", { bonheur: 3, creatif: 1, rel: { voisin: -5 } }), O(0.5, "Il te répond avec une chorale, tu perds la partie.", { bonheur: -3, rel: { voisin: -10 } })], { risk: 1 }),
  ],
});

flash("Un inconnu t'offre un verre en échange d'une histoire drôle. Tu lui racontes celle du poisson.", { bonheur: 2, sociable: 1 }, { ages: [18, 70], tag: "mature" });
flash("Tu te réveilles avec un bonnet de père Noël en plein mois de juillet. Personne ne veut t'expliquer.", { bonheur: 1 }, { ages: [18, 50], tag: "mature" });
flash("Ton karaoké de la veille a fait le tour du quartier. Les voisins ont applaudi, sauf un.", { bonheur: 2, repute: 1 }, { ages: [18, 60], tag: "mature" });
flash("Tu retrouves un vieux tatouage fait un soir d'été. Il ressemble à un cornichon.", { bonheur: 0 }, { ages: [20, 70], tag: "mature" });
flash("Un taxi te ramène à 5 heures du matin et te fait la morale. Tu écoutes poliment.", { bonheur: 1, argent: -45 }, { ages: [18, 60], tag: "mature" });
