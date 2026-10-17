// Retraite, grand âge et vie derrière les barreaux
const { reg, out, tier, kidsCount } = require("../lifekit");
const C = require("../core");

const ret = { retired: true, noprison: true };
const old = { ages: [60, 120], noprison: true };

reg({ id: "jardin", grp: "loisir", l: "Jardinage et siestes", ic: "🌻", d: "Les tomates te comprennent.", need: ret, fx: { bonheur: 3, sante: 2 }, w: 5 });
reg({ id: "petits", grp: "famille", l: "Gâter les petits-enfants", ic: "🧸", d: "Tu fonds comme un chocolat chaud.", need: Object.assign({ rel: "child" }, ret), fx: { bonheur: 4, repute: 1 }, cost: 800, w: 5, fit: (p) => (C.findNpc(p, "child").some((n) => n.age >= 28) ? 1.4 : 0) });
reg({ id: "croisiere", grp: "voyage", l: "Croisière de rêve", ic: "🚢", d: "Une longue traversée (7 000 €).", need: ret, fx: { bonheur: 7, sante: 1 }, cost: 7000, hook: "trip", cool: 2, w: 4, fit: (p) => (tier(p) >= 2 ? 1.3 : 0) });
reg({ id: "bridge", grp: "social", l: "Tournoi de bridge", ic: "🃏", d: "Des cartes, des commentaires, et des adversaires qui ont tous plus de soixante-quinze ans.", need: old, cool: 2, w: 5,
  outs: [out(0.5, "Tu gagnes le tournoi du comité des fêtes. La coupe est plus lourde que toi, et ta partenaire n'en démord plus.", { intel: 2, sociable: 2, bonheur: 4, repute: 2 }, true), out(0.5, "Tu perds sans gloire, mais tes adversaires t'invitent à prendre le thé. Tu y retournes volontiers.", { intel: 1, sociable: 2, bonheur: 3 })] });
reg({ id: "memoires", grp: "arts", l: "Écrire tes mémoires", ic: "📖", d: "Une vie, trois cents pages, quelques chapitres supprimés par prudence.", need: { ages: [60, 120], noprison: true }, cool: 5, w: 4,
  outs: [out(0.7, "Tu écris tes souvenirs, en changeant les noms des gens vexants. Tes enfants lisent le livre d'une traite, avec une pointe d'émotion et de surprise.", { creatif: 3, bonheur: 5, rel: { child: 8 } }, true), out(0.3, "Ton livre est lu par six personnes, dont ta voisine, qui n'a pas aimé le chapitre sur elle.", { creatif: 2, bonheur: 3, repute: -1 })] });
reg({ id: "chorale", grp: "social", l: "Rejoindre la chorale de la paroisse", ic: "🎶", d: "Des cantiques, des partitions et un chef de chœur qui t'appelle « mon petit ».", need: { ages: [55, 120], noprison: true }, cool: 3, w: 4,
  outs: [out(1, "Tu chantes un peu faux mais avec cœur. Le concert de Noël est un petit triomphe, surtout pour la quête.", { creatif: 2, sociable: 3, bonheur: 4, sante: 1 })] });
reg({ id: "thermes", grp: "sante", l: "Aller aux thermes chaque semaine", ic: "♨️", d: "Des bains, des conversations et un maillot de bain qui date de Pompidou.", need: old, cost: 600, cool: 2, w: 4, fit: (p) => (p.stats.sante < 70 ? 1.5 : 0.8),
  outs: [out(1, "Les bains te font un bien fou, aux articulations et au moral. Tu y croises une amie d'enfance qui n'a rien oublié.", { sante: 4, bonheur: 4, sociable: 1 })] });
reg({ id: "voyage_nostalgie", grp: "voyage", l: "Revoir les lieux de ton enfance", ic: "🏘️", d: "La même place, la même boulangerie, mais plus le même boulanger.", need: old, cost: 900, cool: 4, w: 4,
  outs: [out(1, "Tu retrouves ta vieille école devenue supermarché, ton premier banc devenu parking, et ton premier amour devenu pharmacien. La vie est grande.", { bonheur: 5, sante: 0, creatif: 1 }, true)] });
reg({ id: "testament", grp: "famille", l: "Revoir ton testament", ic: "📜", d: "Un notaire, un stylo et une liste de gens qui seront très gentils ensuite.", need: { ages: [60, 120], noprison: true, money: [5000, null] }, cost: 400, cool: 5, w: 3,
  outs: [out(1, "Tu fais le tri entre ceux qui te rendent visite avec des fleurs et ceux qui viennent avec un tableau Excel. Le testament est limpide.", { prudent: 2, bonheur: 2 })] });
reg({ id: "dentier_pari", grp: "social", tag: "loufoque", l: "Organiser des courses de déambulateurs", ic: "🦽", d: "Une piste, une ligne d'arrivée, un public qui crie « Allez Gisèle ».", need: { ages: [70, 120], noprison: true }, cool: 4, w: 3,
  outs: [out(0.6, "La course est un grand moment de vitesse et de dignité. Gisèle gagne, comme toujours, avec un sourire de pilote.", { sante: 1, sociable: 3, bonheur: 5, repute: 2 }, true), out(0.4, "Un déambulateur dérape et finit dans la haie. Personne n'est blessé, la haie, elle, est vengeuse.", { sociable: 2, bonheur: 4 })] });

// ---------- prison ----------
const jail = { prison: true };
reg({ id: "bonne_conduite", grp: "prison", l: "Bonne conduite", ic: "🙇", d: "Tu fais profil bas. Peine adoucie.", need: jail, fx: { bonheur: -2, repute: 1, honnete: 2 }, hook: "goodbehavior", cool: 0, w: 6 });
reg({ id: "evasion", grp: "prison", l: "Préparer une évasion", ic: "🕳️", d: "Cuillère, courage et très peu de plan.", need: jail, fx: { courage: 3, sante: -1 }, hook: "escape", cool: 0, w: 4 });
reg({ id: "etudes_prison", grp: "prison", l: "Étudier derrière les barreaux", ic: "📓", d: "Les livres rendent libre, parfois.", need: jail, fx: { intel: 4, bonheur: -1 }, cool: 0, w: 5 });
reg({ id: "atelier_prison", grp: "prison", l: "T'inscrire à l'atelier de la prison", ic: "🧵", d: "Menuiserie, couture, ou fabrication de petits meubles en bois d'allumettes.", need: jail, cool: 1, w: 4,
  outs: [out(0.8, "Tu fabriques d'adorables petits meubles pour poupées. Le directeur de la prison en commande dix.", { creatif: 3, bonheur: 2, argent: 200 }), out(0.2, "Tu confectionnes une chaise qui s'effondre sous le poids du surveillant. Tu es suspendu(e) d'atelier pour un trimestre.", { creatif: 2, repute: -1, bonheur: -1 })] });
reg({ id: "sport_prison", grp: "prison", l: "Soulever de la fonte dans la cour", ic: "🏋️", d: "Des pompes, des barres, et des regards qui jugent ta posture.", need: jail, cool: 1, w: 4,
  outs: [out(1, "Tu t'entraînes tous les jours. Ton corps est plus fort, ton biceps plus intimidant, et personne ne te cherche d'ennuis.", { sport: 5, sante: 2, courage: 1, bonheur: 1 })] });
reg({ id: "lettre_dehors", grp: "prison", l: "Écrire à ceux du dehors", ic: "✉️", d: "Une lettre, un timbre, un espoir de réponse.", need: jail, cool: 1, w: 4,
  outs: [out(0.7, "Tu reçois enfin des nouvelles de quelqu'un qui n'a pas oublié ton nom.", { bonheur: 3, rel: { friend: 8 }, bonte: 1 }), out(0.3, "Tu écris dix lettres et tu n'obtiens qu'une réponse, d'une personne qui te demande quand tu rends le canapé.", { bonheur: 0 })] });
