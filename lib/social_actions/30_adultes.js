// Actions de l'âge adulte. Dîners de couples, enfants, carrière, mentorat, affaires et amitiés qui durent.
const { reg, bond, single, employed, coupleWith, publicKids, married } = require("../socialkit");

reg({ id: "diner_couples", grp: "famille", ic: "🍽️", l: "Inviter à un dîner de couples", d: "Deux couples, un menu ambitieux et un silence gêné quand l'un des conjoints raconte sa blague pour la troisième fois.",
  ages: [22, 90], w: 8, cool: 3, cost: 150, ok: (g, A, B) => !!A.partner && !!B.partner && !coupleWith(A, B),
  yes: [
    { w: 0.65, a: { bonheur: 5, sociable: 2 }, b: { bonheur: 5, sociable: 2 }, ta: "Le dîner se passe dans la bonne humeur. Les conjoints s'entendent mieux que prévu, et le dessert est un triomphe.", tb: "Dîner chez $A. Les plats sont délicieux et les conjoints se découvrent une passion commune pour les puzzles.", bond: { aff: 12 } },
    { w: 0.35, a: { bonheur: 1 }, b: { bonheur: 2 }, ta: "L'un des conjoints raconte une blague de mauvais goût devant tout le monde. Le gratin sauve la soirée.", tb: "Le dîner chez $A se termine par une dispute légère sur l'ordre des plats. Le gratin met tout le monde d'accord.", bond: { aff: 6 } },
  ],
  no: { ta: "$B s'excuse, la baby-sitter a annulé. Le dîner est reporté aux calendes grecques.", bond: { aff: -1 } } });

reg({ id: "parrain", grp: "famille", ic: "🍼", l: "Devenir parrain ou marraine", d: "Tu proposes de parrainer le dernier bébé de la famille. Une couronne, un cadeau, et une vie de souvenirs.",
  ages: [18, 100], w: 14, prio: 2, cool: 0, coolPair: 6, ok: (g, A, B, b) => B.npcs.some((n) => n.kind === "child" && n.alive && n.age <= 2) && b.aff >= 20 && !b.tags.parrain,
  yes: [
    { w: 1, a: { bonheur: 5, bonte: 2, repute: 1 }, b: { bonheur: 6 }, ta: "Tu tiens le bébé de $B pour la première fois, avec la prudence d'un artificier. Tu es officiellement parrain ou marraine.", tb: "$A accepte le rôle de parrain ou marraine. Tu es heureux(se), et l'enfant bave sur son costume.", bond: { aff: 25 }, tag: "parrain" },
  ],
  no: { ta: "$B a déjà choisi quelqu'un d'autre pour le parrainage. Tu offres quand même un doudou.", bond: { aff: -2 } } });

reg({ id: "gater_filleul", grp: "famille", ic: "🧸", l: "Gâter ton filleul", d: "Un gros cadeau et un sourire. Les parents lèvent les yeux au ciel, l'enfant ne te lâche plus.", mode: "direct",
  ages: [20, 100], w: 9, cool: 2, coolPair: 2, cost: 200, ok: (g, A, B, b) => !!b.tags.parrain && publicKids(B) > 0,
  direct: [
    { w: 1, a: { bonheur: 4, bonte: 1 }, b: { bonheur: 4, argent: 100 }, ta: "Le filleul déchire le papier en trois secondes et crie de joie. Tes oreilles sifflent mais ton cœur fond.", tb: "$A arrive avec un énorme cadeau pour ton enfant, qui devient fan à vie.", bond: { aff: 8 } },
  ] });

reg({ id: "mentorat", grp: "travail", ic: "🧙", l: "Prendre sous son aile", d: "Tu transmets ton expérience à un collègue plus novice que toi. Il ou elle y gagne un coup de pouce, toi la fierté.",
  ages: [26, 90], w: 8, cool: 3, ok: (g, A, B, b) => employed(A) && employed(B) && A.yearsWorked - B.yearsWorked >= 5 && !b.tags.mentor,
  yes: [
    { w: 0.8, a: { bonheur: 4, bonte: 2, repute: 2 }, b: { intel: 2, ambition: 3, bonheur: 4, perf: 8 }, ta: "Tu apprends à $B les règles non écrites du métier, ses pièges et ses meilleurs cafés. Tu te revois à son âge.", tb: "$A t'apprend des astuces qu'aucun livre n'enseigne. Ta carrière avance plus vite.", bond: { aff: 16 }, tag: "mentor" },
    { w: 0.2, a: { bonheur: 2 }, b: { ambition: 2, bonheur: 2, perf: 2 }, ta: "$B écoute poliment tes conseils, avec le regard de quelqu'un qui a déjà tout compris. Tu souris.", tb: "$A te donne beaucoup de conseils, dont la moitié date d'une autre époque. L'autre moitié est excellente.", bond: { aff: 8 }, tag: "mentor" },
  ],
  no: { ta: "$B préfère faire ses erreurs lui-même ou elle-même. Tu respectes, avec un soupir.", bond: { aff: -1 } } });

reg({ id: "coup_pouce_carriere", grp: "travail", ic: "🚀", l: "Pousser pour une promotion", d: "Tu parles à ton patron pour qu'on remarque enfin ton protégé. Le moment est stratégique.", mode: "direct",
  ages: [28, 80], w: 14, prio: 1, cool: 3, coolPair: 4, ok: (g, A, B, b) => !!b.tags.mentor && employed(A) && employed(B),
  direct: [
    { w: 0.6, a: { repute: 2, bonheur: 4 }, b: { raise: 0.06, perf: 6, bonheur: 6 }, ta: "Ton intervention porte ses fruits. $B décroche une augmentation et t'invite au restaurant pour fêter ça.", tb: "$A a plaidé ta cause. Tu obtiens une augmentation méritée et un peu aidée par le destin.", bond: { aff: 12 } },
    { w: 0.4, a: { bonheur: 1 }, b: { perf: 3, bonheur: 2 }, ta: "Ton patron promet d'y réfléchir. Il y réfléchira longtemps.", tb: "$A parle de toi au patron. Rien ne change, mais on connaît ton nom.", bond: { aff: 6 } },
  ] });

reg({ id: "embaucher_ami", grp: "travail", ic: "🤝", l: "Embaucher dans ton entreprise", d: "Tu offres un poste à un ami sans emploi. Une main tendue, un contrat, et le risque de mélanger amitié et travail.",
  ages: [25, 70], w: 8, cool: 3, ok: (g, A, B, b) => A.assets.some((a) => a.kind === "entreprise" && !a.partnerCompany) && !employed(B) && !B.retired && B.age >= 18 && !B.prison && b.aff >= 20,
  yes: [
    { w: 0.7, a: { bonheur: 4, repute: 2 }, b: { bonheur: 7 }, ta: "$B travaille dans ton entreprise avec un enthousiasme communicatif. Les collègues l'adorent, ton comptable moins.", tb: "$A t'offre un poste dans son entreprise. Tu y arrives avec le sourire et deux chemises en trop.", bond: { aff: 14 }, special: "hire", news: "🤝 $A a embauché $B dans son entreprise." },
    { w: 0.3, a: { bonheur: -2, repute: -1, argent: -400 }, b: { bonheur: 2 }, ta: "$B s'avère charmant mais catastrophique. L'imprimante, le café et un client exigeant en font les frais.", tb: "Ton passage chez $A se termine en vaudeville avec l'imprimante. Mais le salaire est tombé.", bond: { aff: 4 }, special: "hire" },
  ],
  no: { ta: "$B préfère garder son indépendance. Tu embauches quelqu'un d'autre, et tu t'en veux un peu.", bond: { aff: -1 } } });

reg({ id: "pret_ami", grp: "argent", ic: "💶", l: "Aider un ami à boucler le mois", d: "Une enveloppe discrète, une phrase gênée, et la promesse de ne jamais en reparler.", mode: "direct",
  ages: [22, 100], w: 6, cool: 3, cost: 800, ok: (g, A, B, b) => b.aff >= 25,
  direct: [
    { w: 1, a: { bonheur: 3, bonte: 2, repute: 1 }, b: { argent: 800, bonheur: 5 }, ta: "Tu glisses l'enveloppe à $B sans un mot. Il ou elle la garde, les yeux humides.", tb: "$A te donne une enveloppe sans commentaires. Tu n'oublieras pas.", bond: { aff: 18 } },
  ] });

reg({ id: "fete_surprise", grp: "amitie", ic: "🎉", l: "Organiser une fête surprise", d: "Un gâteau caché, quinze complices et et la personne concernée qui rentre une heure trop tôt.",
  ages: [14, 100], w: 7, cool: 3, cost: 200, ok: (g, A, B, b) => b.aff >= 18,
  yes: [
    { w: 0.6, a: { bonheur: 5, sociable: 2 }, b: { bonheur: 8, repute: 1 }, ta: "$B pousse la porte, tout le monde crie « surprise ». L'émotion est immédiate, la bougie aussi.", tb: "Tu pousses la porte et tu découvres tes amis, des ballons et un gâteau. Tu rougis, tu ris, tu pleures un peu.", bond: { aff: 14 } },
    { w: 0.4, a: { bonheur: 3 }, b: { bonheur: 5 }, ta: "$B avait deviné depuis trois semaines. Il ou elle joue la surprise avec un talent d'acteur.", tb: "Tu avais deviné la fête, mais tu joues la surprise avec un talent qui mérite un prix. $A est ravi(e).", bond: { aff: 10 } },
  ],
  no: { ta: "$B est déjà pris(e) ce soir-là. Le gâteau finit en dîner pour toi seul(e).", bond: { aff: -1 } } });

reg({ id: "anniv_rond", grp: "famille", ic: "🎈", l: "Inviter à ton anniversaire rond", d: "Trente, quarante, cinquante, soixante ans. Une année d'exception pour une grande fête et un discours embarrassant.",
  ages: [20, 100], w: 16, prio: 2, cool: 0, coolPair: 0, ok: (g, A, B, b) => A.age % 10 === 0 && !b.tags["anniv" + A.age], cost: 400,
  yes: [
    { w: 0.7, a: { bonheur: 6, repute: 1, sociable: 2 }, b: { bonheur: 5 }, ta: "Tu souffles tes bougies devant tes amis. Il y a un gâteau, une chanson et une photo qui finira dans toutes les galeries.", tb: "Tu fêtes les années rondes de $A. La fête est joyeuse, le gâteau énorme, les discours un peu longs.", bond: { aff: 12 } },
    { w: 0.3, a: { bonheur: 4 }, b: { bonheur: 4 }, ta: "Le gâteau tombe, l'orchestre est en retard, mais $B reste jusqu'à la fin. Tu retiens ça.", tb: "Chez $A, le gâteau s'écroule au moment des bougies. Tout le monde applaudit.", bond: { aff: 10 } },
  ],
  no: { a: { bonheur: -3 }, ta: "$B ne peut pas venir à ta grande fête. Tu masques ta déception avec une part de gâteau.", bond: { aff: -3 } } });

reg({ id: "garde_enfants", grp: "famille", ic: "🧒", l: "Demander de garder les enfants", d: "Un week-end tranquille contre un service rendu. L'autre doit être très courageux.",
  ages: [25, 55], w: 7, cool: 2, ok: (g, A, B, b) => publicKids(A) > 0 && b.aff >= 18,
  yes: [
    { w: 0.6, a: { bonheur: 5, sante: 2 }, b: { bonheur: 1, sante: -1 }, ta: "Tes enfants adorent leur week-end. Toi tu dors enfin dix heures d'affilée, et tu te sens revivre.", tb: "Tu gardes les enfants de $A. Ils ont mangé les bonbons, déplacé les meubles et appris deux gros mots. Tu les aimes.", bond: { aff: 10 } },
    { w: 0.4, a: { bonheur: 4 }, b: { bonheur: -3, sante: -2, argent: -150 }, ta: "$B appelle à trois heures du matin, perdu(e). Tu rentres aider mais l'essentiel est fait. Vous riez ensemble.", tb: "Les enfants de $A détruisent la cuisine et enterrent le chat dans les coussins. Le chat s'en remet, toi moins.", bond: { aff: 6 } },
  ],
  no: { ta: "$B n'aime pas trop les enfants des autres. Tu comprends, tu hésites à le dire à haute voix.", bond: { aff: -1 } } });

reg({ id: "voyage_famille", grp: "voyage", ic: "🏝️", l: "Partir en vacances entre amis, avec les enfants", d: "Une location, un barbecue, des enfants hystériques. Les adultes sont aussi concernés.",
  ages: [28, 60], w: 6, cool: 3, cost: 2400, split: true, ok: (g, A, B, b) => (publicKids(A) > 0 || publicKids(B) > 0) && b.aff >= 20,
  yes: [
    { w: 0.7, a: { bonheur: 7, sante: 1 }, b: { bonheur: 7, sante: 1 }, ta: "Les enfants se lient d'amitié, les adultes aussi, la piscine déborde de rires. Tu es détendu(e) pour la première fois depuis six mois.", tb: "Les vacances avec $A restent un grand souvenir. Les enfants n'en reviennent pas de leur chance.", bond: { aff: 16 } },
    { w: 0.3, a: { bonheur: 3 }, b: { bonheur: 3 }, ta: "Il pleut toute la semaine. Vous jouez aux cartes, vous mangez des pâtes et vous apprenez à vous supporter.", tb: "La pluie ne cesse pas chez les amis. À force de jeux de société, on apprend que $A triche.", bond: { aff: 8 } },
  ],
  no: { ta: "$B part en vacances ailleurs. Tu regardes les brochures avec un soupir.", bond: { aff: -1 } } });

reg({ id: "association_affaires", grp: "travail", ic: "🏢", l: "Fonder une société de conseil ensemble", d: "Vos réseaux, vos talents et vos mauvaises habitudes réunis sous une plaque en laiton.",
  ages: [28, 65], w: 5, cool: 4, ok: (g, A, B, b) => employed(A) && b.aff >= 22,
  yes: [
    { w: 0.4, a: { argent: 4000, ambition: 3, bonheur: 5 }, b: { argent: 4000, ambition: 3, bonheur: 5 }, ta: "La société décroche un contrat important dès le premier trimestre. Vous encaissez avec un air de modestie bien peu convaincant.", tb: "Ta société avec $A décroche son premier gros contrat. Vous trinquez à la plaque en laiton.", bond: { aff: 14 }, news: "🏢 $A et $B fondent une société de conseil qui décolle." },
    { w: 0.6, a: { argent: 800, ambition: 1 }, b: { argent: 800, ambition: 1 }, ta: "La société tient, de justesse, et surtout grâce à un client fidèle qui apprécie votre humour.", tb: "Avec $A, la société survit grâce à un client fidèle et au café gratuit.", bond: { aff: 8 } },
  ],
  no: { ta: "$B préfère rester salarié(e) et dormir tranquille. Tu en prends note.", bond: { aff: -1 } } });

reg({ id: "prendre_nouvelles", grp: "amitie", ic: "☎️", l: "Prendre des nouvelles d'un ami", d: "Un coup de fil, une visite, une épaule. Pas besoin de grand discours pour faire plaisir.", mode: "direct",
  ages: [14, 110], w: 8, cool: 3, ok: (g, A, B, b) => b.aff >= 18 || !!b.tags.pacte,
  direct: [
    { w: 1, a: { bonheur: 3, bonte: 2 }, b: { bonheur: 7 }, ta: "Tu passes l'après-midi avec $B, sans conseils, avec des gâteaux. Ça suffit largement.", tb: "$A vient te voir au moment où tu en avais le plus besoin. Tu ne l'oublieras pas.", bond: { aff: 16 } },
  ] });
