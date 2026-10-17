// ============================================================
// RICHISSIME DESTINY — Filières et spécialisations
// Après le choix du lycée (général, technologique, professionnel, apprentissage) et après le bac
// (fac, prépa, école de commerce, ingénieurs, médecine, droit, BTS, école d'art), on choisit une spécialisation.
// Elle change vraiment le futur.
//   pendant les études  les qualités qui comptent pour le domaine progressent chaque année
//   à la sortie         les métiers du domaine sont proposés bien plus souvent, avec un meilleur salaire,
//                       et on y entre avec déjà un peu d'expérience
//   dans la carrière    la fiche professionnelle démarre avec de la compétence et un réseau
// ============================================================
const R = require("./rules");
const C = require("./core");

const LIST = [];
const byId = Object.create(null);

// S(id, icône, libellé, étapes, métiers, domaines d'intérêt, bonus de départ, progrès annuel, description)
function S(id, ic, l, stages, tracks, dom, start, grow, d) {
  if (byId[id]) throw new Error("filière en double " + id);
  const spec = { id, ic, l, stages, tracks, dom, start: start || {}, grow: grow || {}, d };
  LIST.push(spec);
  byId[id] = spec;
}

// ---------- lycée professionnel et apprentissage ----------
const PRO_ST = ["pro", "apprenti"];
S("p_bouche", "🍳", "Cuisine, pâtisserie et métiers de bouche", PRO_ST, ["resto", "patisserie", "chocolatier", "sommelier", "critique_gastro"], ["cuisine"], { creatif: 3, sport: 1 }, { creatif: 1 }, "Fourneaux, farine et coups de feu. Les restaurants et les pâtisseries te tendront les bras.");
S("p_batiment", "🧱", "Bâtiment et travaux publics", PRO_ST, ["btp", "artisan", "paysagiste"], ["hands"], { sport: 3, courage: 1 }, { sport: 1 }, "Maçonnerie, charpente, plomberie. Les chantiers manquent toujours de bras compétents.");
S("p_meca", "🔩", "Mécanique, automobile et aéronautique", PRO_ST, ["transport", "artisan", "f1", "marin", "vtc"], ["hands", "tech"], { intel: 2, sport: 1 }, { intel: 1 }, "Moteurs, freins et diagnostics. Garages, transporteurs et circuits recrutent.");
S("p_elec", "🔌", "Électricité et numérique", PRO_ST, ["tech", "artisan", "hacker", "gamedev"], ["tech"], { intel: 3 }, { intel: 1 }, "Câbles, réseaux et domotique. Un pied dans le métier, un autre dans l'informatique.");
S("p_soins", "🩹", "Soins et services à la personne", PRO_ST, ["sante", "psy", "enseignement", "clerge"], ["care"], { bonte: 4, intel: 1 }, { bonte: 1 }, "Auprès des malades, des enfants et des personnes âgées. Des métiers qui comptent et qui épuisent.");
S("p_vente", "🛍️", "Commerce, vente et relation client", PRO_ST, ["commerce", "immo", "hotel", "libre"], ["business", "social"], { charme: 3, sociable: 2 }, { charme: 1 }, "Rayons, caisses, négociation. Tu apprends à vendre un frigo à un pingouin.");
S("p_coiffure", "💇", "Coiffure, esthétique et mode", PRO_ST, ["coiffeur", "mode", "mannequin", "createur", "tatoueur"], ["social", "arts"], { charme: 4, creatif: 2 }, { charme: 1 }, "Ciseaux, couleurs et petites histoires de salon. Les salons et les maisons de mode s'intéressent à toi.");
S("p_hotel", "🏨", "Hôtellerie, restauration et tourisme", PRO_ST, ["hotel", "resto", "nuit", "sommelier", "cabaret"], ["social", "cuisine"], { charme: 2, sociable: 3 }, { sociable: 1 }, "Accueil, salle, étages. Tu parles aux gens de tous les pays, et tu leur souris même quand tu es épuisé.");
S("p_agri", "🌾", "Agriculture, paysage et viticulture", PRO_ST, ["agri", "paysagiste", "veto", "explorateur"], ["nature"], { sport: 2, sante: 2 }, { sport: 1 }, "Champs, vignes et jardins. Une vie dehors, loin des écrans.");
S("p_securite", "🛡️", "Sécurité, secours et métiers en uniforme", PRO_ST, ["ordre", "pompier", "militaire", "detective"], ["order"], { courage: 4, sport: 2 }, { courage: 1 }, "Prévention, secours, surveillance. Les concours de la sécurité te sont plus ouverts.");
S("p_spectacle", "🎭", "Arts du spectacle, théâtre et cinéma", PRO_ST, ["arts", "cinema", "humour", "cirque", "cabaret", "medium_tele"], ["arts", "screen"], { creatif: 3, charme: 3, sociable: 2 }, { creatif: 1, charme: 1 }, "Cours de théâtre, de jeu face caméra et d'improvisation. Les castings te regardent autrement, et les rôles arrivent plus vite.");
S("p_musique", "🎶", "Musique, chant et danse", PRO_ST, ["chanteur", "dj", "danse", "arts"], ["music"], { creatif: 4, charme: 2 }, { creatif: 1 }, "Conservatoire, répétitions et scènes. Les labels et les cabarets prennent ton appel.");
S("p_art", "🖌️", "Métiers d'art et design", PRO_ST, ["peintre", "photo", "mode", "createur", "tatoueur", "artisan"], ["arts", "hands"], { creatif: 5 }, { creatif: 1 }, "Dessin, volumes, matières. Ateliers, galeries et maisons de design te sont plus accessibles.");
S("p_sport", "🏅", "Sport études", PRO_ST, ["sportpro", "foot", "tennis", "rugby", "cyclisme", "boxe", "natation", "ski", "coach", "golf_pro"], ["sport"], { sport: 7, sante: 2 }, { sport: 2 }, "Entraînements tous les matins. Les clubs te repèrent plus tôt, mais le corps encaisse.");
S("p_logistique", "🚚", "Transport et logistique", PRO_ST, ["transport", "marin", "vtc", "commerce"], ["hands"], { sport: 2, prudent: 2 }, { prudent: 1 }, "Camions, entrepôts, navires. Les entreprises de transport ont toujours de la place.");
S("p_numerique", "🎮", "Informatique et jeux vidéo", PRO_ST, ["tech", "gamedev", "esport", "hacker", "createur"], ["tech", "screen"], { intel: 3, creatif: 2 }, { intel: 1 }, "Code, graphismes, moteurs de jeu. Les studios et les sociétés de services te recrutent plus volontiers.");
S("p_audiovisuel", "🎬", "Audiovisuel, médias et communication", PRO_ST, ["media", "photo", "cinema", "presse", "createur", "paparazzi"], ["screen"], { creatif: 3, charme: 2 }, { creatif: 1 }, "Caméras, montage, micro. Les chaînes et les agences cherchent ce genre de profil.");

// ---------- lycée général ----------
S("g_sciences", "🧪", "Mathématiques et physique-chimie", ["general"], ["science", "ingenierie", "tech", "astronaute", "finance", "archi"], ["intel", "tech"], { intel: 4 }, { intel: 1 }, "Équations et laboratoires. Les grandes écoles scientifiques te sont ouvertes.");
S("g_lettres", "📚", "Lettres, langues et philosophie", ["general"], ["presse", "enseignement", "biblio", "diplomate_honneur", "politique", "droit"], ["intel", "arts"], { intel: 2, creatif: 3 }, { creatif: 1 }, "Textes, débats et langues vivantes. Journalisme, enseignement et droit te tendent les bras.");
S("g_eco", "📈", "Sciences économiques et sociales", ["general"], ["finance", "consultant", "politique", "commerce", "immo", "droit"], ["business", "social"], { intel: 3, ambition: 2 }, { ambition: 1 }, "Marchés, sociétés et statistiques. Tu comprends pourquoi tout coûte cher.");
S("g_arts", "🎨", "Arts, théâtre et cinéma audiovisuel", ["general"], ["arts", "cinema", "peintre", "photo", "humour", "media"], ["arts", "screen"], { creatif: 5, charme: 1 }, { creatif: 1 }, "Un lycée général avec option artistique, atelier de théâtre et ciné-club.");
S("g_numerique", "💻", "Numérique et sciences informatiques", ["general"], ["tech", "gamedev", "hacker", "ingenierie", "esport"], ["tech"], { intel: 4 }, { intel: 1 }, "Algorithmes et projets. Tu codes plus tôt que les autres.");
S("g_vivant", "🧬", "Sciences de la vie et de la terre", ["general"], ["sante", "veto", "pharmacien", "dentiste", "science", "psy"], ["care", "nature", "intel"], { intel: 3, bonte: 1 }, { intel: 1 }, "Biologie, santé, écologie. La voie royale pour les études de santé.");

// ---------- lycée technologique ----------
S("t_industrie", "⚙️", "Sciences et technologies industrielles", ["techno"], ["ingenierie", "tech", "artisan", "btp", "transport", "archi"], ["tech", "hands"], { intel: 3, sport: 1 }, { intel: 1 }, "Maquettes, prototypes et bureaux d'études.");
S("t_gestion", "📊", "Gestion et management", ["techno"], ["commerce", "finance", "immo", "consultant", "libre", "public"], ["business"], { intel: 2, ambition: 3 }, { ambition: 1 }, "Comptabilité, marketing, entreprise simulée. Ton futur patron sera content.");
S("t_sante", "🩺", "Santé et social", ["techno"], ["sante", "psy", "enseignement", "pharmacien"], ["care"], { bonte: 4, intel: 2 }, { bonte: 1 }, "Stages en hôpital, en crèche et en maison de retraite. Une vocation se construit là.");
S("t_hotellerie", "🍽️", "Hôtellerie et restauration", ["techno"], ["hotel", "resto", "patisserie", "sommelier", "chocolatier"], ["cuisine", "social"], { creatif: 2, sociable: 3 }, { sociable: 1 }, "Cuisine, service et accueil, avec un diplôme général en prime.");
S("t_design", "✏️", "Design et métiers d'art", ["techno"], ["archi", "mode", "createur", "peintre", "photo", "gamedev"], ["arts"], { creatif: 5 }, { creatif: 1 }, "Volumes, couleurs et projets graphiques.");
S("t_musique", "🎻", "Musique et danse", ["techno"], ["chanteur", "dj", "danse", "arts"], ["music"], { creatif: 4, charme: 1 }, { creatif: 1 }, "Un lycée aménagé qui laisse du temps aux répétitions.");
S("t_agro", "🌱", "Agronomie et vivant", ["techno"], ["agri", "veto", "paysagiste", "explorateur", "science"], ["nature"], { intel: 2, sante: 2 }, { intel: 1 }, "Sols, animaux et exploitations. Les fermes et les laboratoires te regardent d'un bon œil.");

// ---------- fac ----------
S("f_lettres", "📖", "Lettres et sciences humaines", ["fac"], ["presse", "enseignement", "biblio", "diplomate_honneur", "politique", "media"], ["intel", "arts"], { intel: 2, creatif: 2 }, { creatif: 1 }, "Histoire, littérature, linguistique. Une culture immense, et des débouchés à construire.");
S("f_sciences", "🔬", "Sciences et recherche", ["fac"], ["science", "ingenierie", "pharmacien", "tech"], ["intel"], { intel: 4 }, { intel: 1 }, "Laboratoire, thèse et publications. Le chemin vers la recherche.");
S("f_eco", "💶", "Économie et gestion", ["fac"], ["finance", "consultant", "commerce", "public", "immo"], ["business"], { intel: 2, ambition: 2 }, { ambition: 1 }, "Modèles, marchés et comptes. Banques et cabinets reçoivent ton CV.");
S("f_psy", "🧠", "Psychologie", ["fac"], ["psy", "enseignement", "sante", "coach"], ["care", "social"], { intel: 2, bonte: 2 }, { bonte: 1 }, "Écoute, tests et supervision. On te confie des histoires qui ne sont pas les tiennes.");
S("f_staps", "🏃", "Sport et éducation physique", ["fac"], ["coach", "enseignement", "sportpro", "natation", "golf_pro"], ["sport"], { sport: 5, sante: 1 }, { sport: 1 }, "Anatomie, entraînement et pédagogie. Tu apprends à faire bouger les autres.");
S("f_spectacle", "🎭", "Arts du spectacle et cinéma", ["fac"], ["arts", "cinema", "humour", "media", "cirque", "medium_tele"], ["arts", "screen"], { creatif: 4, charme: 2 }, { creatif: 1 }, "Histoire du théâtre, analyse de films, ateliers de jeu. Un tremplin vers les plateaux.");
S("f_info", "🖥️", "Informatique", ["fac"], ["tech", "gamedev", "hacker", "ingenierie", "science"], ["tech"], { intel: 4 }, { intel: 1 }, "Algorithmique, bases de données, intelligence artificielle. Le marché de l'emploi te sourit.");
S("f_langues", "🌍", "Langues et relations internationales", ["fac"], ["diplomate_honneur", "hotel", "presse", "enseignement", "politique"], ["social", "intel"], { intel: 2, sociable: 3 }, { sociable: 1 }, "Trois langues et des séjours à l'étranger. Les portes du monde s'ouvrent.");

// ---------- prépa ----------
S("pr_maths", "📐", "Prépa scientifique", ["prepa"], ["ingenierie", "science", "finance", "astronaute", "tech"], ["intel"], { intel: 5, courage: 1 }, { intel: 1 }, "Mathématiques sans pitié. Si tu tiens, les grandes écoles s'ouvrent.");
S("pr_lettres", "🏛️", "Prépa littéraire", ["prepa"], ["presse", "diplomate_honneur", "politique", "droit", "enseignement"], ["intel", "arts"], { intel: 4, creatif: 2 }, { intel: 1 }, "Dissertations et latin. Ton esprit devient un couteau suisse.");
S("pr_eco", "💼", "Prépa économique", ["prepa"], ["finance", "consultant", "admin_ca", "politique"], ["business", "intel"], { intel: 4, ambition: 3 }, { ambition: 1 }, "Maths, culture générale et pression. Direction les écoles de commerce.");

// ---------- école de commerce ----------
S("c_finance", "🏦", "Finance de marché", ["commerce"], ["finance", "consultant", "immo", "admin_ca"], ["business"], { intel: 2, ambition: 3 }, { ambition: 1 }, "Salles de marchés, produits dérivés et café serré.");
S("c_marketing", "📣", "Marketing et communication", ["commerce"], ["media", "commerce", "createur", "mode", "presse"], ["business", "screen"], { charme: 3, creatif: 2 }, { charme: 1 }, "Marques, campagnes et réseaux. Tu apprends à faire désirer.");
S("c_luxe", "👜", "Luxe, mode et hôtellerie", ["commerce"], ["mode", "hotel", "createur", "mannequin", "sommelier"], ["business", "social"], { charme: 4, sociable: 2 }, { charme: 1 }, "Maisons de couture, grands hôtels et clients très exigeants.");
S("c_entre", "🚀", "Entrepreneuriat", ["commerce"], ["libre", "createur", "gamedev", "commerce", "immo"], ["business"], { ambition: 5, courage: 2 }, { ambition: 1 }, "Incubateur, pitchs et levées de fonds. Tu sors avec une idée et trop de dettes.");

// ---------- ingénieurs ----------
S("i_info", "💾", "Informatique et données", ["ingenieur"], ["tech", "ingenierie", "hacker", "gamedev", "science"], ["tech"], { intel: 4 }, { intel: 1 }, "Logiciels, réseaux et intelligence artificielle.");
S("i_civil", "🏗️", "Génie civil et architecture", ["ingenieur"], ["ingenierie", "archi", "btp", "public"], ["hands", "tech"], { intel: 3, creatif: 2 }, { intel: 1 }, "Ponts, tunnels et grands chantiers.");
S("i_aero", "✈️", "Aéronautique et spatial", ["ingenieur"], ["ingenierie", "astronaute", "transport", "science"], ["tech", "intel"], { intel: 5, courage: 1 }, { intel: 1 }, "Avions, fusées et simulations. Le ciel n'est plus la limite.");
S("i_energie", "⚡", "Énergie et mécanique", ["ingenieur"], ["ingenierie", "public", "consultant", "marin"], ["tech", "hands"], { intel: 4 }, { intel: 1 }, "Centrales, moteurs et réseaux électriques.");
S("i_bio", "🧫", "Biotechnologies", ["ingenieur"], ["science", "pharmacien", "ingenierie", "veto"], ["intel", "care"], { intel: 4, bonte: 1 }, { intel: 1 }, "Laboratoires, brevets et molécules.");

// ---------- médecine ----------
S("m_generaliste", "🩺", "Médecine générale", ["medecine"], ["sante", "psy", "clerge"], ["care"], { bonte: 3, intel: 2 }, { bonte: 1 }, "Cabinet de quartier, visites à domicile et vie de famille raisonnable.");
S("m_chirurgie", "🔪", "Chirurgie", ["medecine"], ["sante"], ["care"], { intel: 3, courage: 3 }, { courage: 1 }, "Blocs opératoires, gardes et mains qui ne tremblent pas. Le chemin vers les plus gros salaires de la santé.");
S("m_pharma", "💊", "Pharmacie", ["medecine"], ["pharmacien", "science", "sante"], ["care", "intel"], { intel: 4 }, { intel: 1 }, "Molécules, ordonnances et comptoir. Un métier stable et respecté.");
S("m_dentaire", "🦷", "Chirurgie dentaire", ["medecine"], ["dentiste", "sante"], ["care"], { intel: 3, charme: 2 }, { charme: 1 }, "Fraises, couronnes et sourires reconstruits. Un cabinet à soi, plus tôt qu'ailleurs.");
S("m_psy", "🛋️", "Psychiatrie", ["medecine"], ["psy", "sante", "science"], ["care", "intel"], { intel: 3, bonte: 3 }, { bonte: 1 }, "Écouter et soigner l'esprit.");

// ---------- droit ----------
S("d_affaires", "🏢", "Droit des affaires", ["droit"], ["droit", "finance", "consultant", "admin_ca"], ["business", "intel"], { intel: 2, ambition: 3 }, { ambition: 1 }, "Contrats, fusions et grands cabinets.");
S("d_penal", "⚖️", "Droit pénal et plaidoirie", ["droit"], ["droit", "politique", "detective"], ["social", "intel"], { charme: 3, courage: 2 }, { charme: 1 }, "Tribunaux, plaidoiries et clients très embêtés.");
S("d_public", "🏛️", "Droit public et administration", ["droit"], ["public", "politique", "diplomate_honneur", "droit"], ["social"], { intel: 3, prudent: 2 }, { intel: 1 }, "Collectivités, ministères et concours.");
S("d_notariat", "📜", "Notariat et immobilier", ["droit"], ["droit", "immo", "public"], ["business"], { intel: 2, prudent: 3 }, { prudent: 1 }, "Actes, successions et étude au centre-ville.");

// ---------- BTS et IUT ----------
S("b_info", "🖱️", "Services informatiques", ["bts"], ["tech", "gamedev", "hacker", "esport"], ["tech"], { intel: 3 }, { intel: 1 }, "Réseaux, développement et maintenance.");
S("b_commerce", "🧾", "Commerce et gestion", ["bts"], ["commerce", "immo", "libre", "public", "hotel"], ["business"], { charme: 2, ambition: 2 }, { ambition: 1 }, "Comptabilité, négociation et gestion de rayon.");
S("b_batiment", "🏠", "Bâtiment et travaux publics", ["bts"], ["btp", "ingenierie", "artisan", "archi"], ["hands"], { intel: 2, sport: 2 }, { intel: 1 }, "Plans, métrés et conduite de chantier.");
S("b_hotel", "🛎️", "Hôtellerie et tourisme", ["bts"], ["hotel", "resto", "sommelier", "patisserie"], ["social", "cuisine"], { sociable: 3, charme: 2 }, { sociable: 1 }, "Gestion d'hôtel et de restaurant.");
S("b_audio", "🎞️", "Audiovisuel et communication", ["bts"], ["media", "photo", "cinema", "createur", "presse"], ["screen"], { creatif: 4, charme: 1 }, { creatif: 1 }, "Caméras, régie et montage.");
S("b_design", "📐", "Design et graphisme", ["bts"], ["createur", "mode", "peintre", "gamedev", "archi"], ["arts"], { creatif: 5 }, { creatif: 1 }, "Dessin, identités visuelles et maquettes.");
S("b_sante", "🧴", "Santé et soins", ["bts"], ["sante", "pharmacien", "dentiste", "psy"], ["care"], { bonte: 3, intel: 2 }, { bonte: 1 }, "Techniques de santé et laboratoires.");
S("b_compta", "🧮", "Comptabilité et gestion", ["bts"], ["finance", "public", "consultant", "commerce"], ["business", "intel"], { intel: 3, prudent: 3 }, { prudent: 1 }, "Bilans, impôts et rigueur.");

// ---------- école d'art ----------
S("a_cinema", "🎥", "Cinéma, théâtre et jeu d'acteur", ["art"], ["cinema", "arts", "humour", "media", "cirque", "medium_tele"], ["arts", "screen"], { creatif: 4, charme: 4, sociable: 2 }, { charme: 1, creatif: 1 }, "Cours d'interprétation, plateaux et castings. Le rêve de beaucoup d'acteurs commence ici.");
S("a_musique", "🎼", "Musique et composition", ["art"], ["chanteur", "dj", "arts", "danse"], ["music"], { creatif: 6 }, { creatif: 1 }, "Harmonie, studio et scène.");
S("a_design", "🧩", "Design et graphisme", ["art"], ["createur", "mode", "gamedev", "archi", "photo"], ["arts"], { creatif: 6 }, { creatif: 1 }, "Identités visuelles, objets et interfaces.");
S("a_mode", "🧵", "Mode et stylisme", ["art"], ["mode", "createur", "mannequin", "coiffeur"], ["arts", "social"], { creatif: 4, charme: 3 }, { creatif: 1 }, "Patrons, défilés et maisons de couture.");
S("a_plastique", "🗿", "Arts plastiques et peinture", ["art"], ["peintre", "photo", "tatoueur", "artisan", "arts"], ["arts"], { creatif: 7 }, { creatif: 1 }, "Atelier, galerie et expos collectives.");
S("a_photo", "📷", "Photographie et image", ["art"], ["photo", "media", "paparazzi", "presse", "cinema"], ["screen", "arts"], { creatif: 4, charme: 1 }, { creatif: 1 }, "Argentique, studio et reportage.");

// ---------- listes de choix par étape ----------
function stageOf(p) {
  const t = p.school && p.school.track;
  if (t === "apprenti") return "apprenti";
  return t || "";
}
function forStage(stage) {
  const key = stage === "apprenti" ? "apprenti" : stage;
  return LIST.filter((s) => s.stages.includes(key));
}
// une filière ne s'ouvre pas à tout le monde, il faut un minimum de niveau pour certaines
const GATES = {
  m_chirurgie: { intel: 58 }, m_pharma: { intel: 52 }, m_dentaire: { intel: 55 }, m_psy: { intel: 52 },
  pr_maths: { intel: 55 }, i_aero: { intel: 55 }, i_bio: { intel: 52 }, p_sport: { sport: 50 }, g_sciences: { intel: 48 },
};
function gateOk(p, s) {
  const g = GATES[s.id];
  if (!g) return true;
  return Object.keys(g).every((k) => (k in p.stats ? p.stats[k] : p.traits[k]) >= g[k]);
}
function gateWhy(s) {
  const g = GATES[s.id];
  if (!g) return "";
  const N = { intel: "Intelligence", sport: "Forme" };
  return "Il faut " + Object.keys(g).map((k) => (N[k] || k) + " " + g[k]).join(" et ") + ".";
}

// ---------- effets ----------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function bumpAny(p, k, d) {
  if (k in p.stats) p.stats[k] = clamp(p.stats[k] + d, 0, 100);
  else if (k in p.traits) p.traits[k] = clamp(p.traits[k] + d, 0, 100);
}

// Le joueur choisit sa spécialisation. Les anciennes restent en mémoire, elles comptent toujours un peu.
function choose(g, p, id) {
  const s = byId[id];
  if (!s) return;
  p.speHist = p.speHist || [];
  if (p.spe) { if (!p.spe.done) { p.spe.done = true; p.spe.endAge = p.age; } p.speHist.push(p.spe); }
  p.spe = { id: s.id, l: s.l, ic: s.ic, stage: stageOf(p) || s.stages[0], xp: 0, done: false, dip: false, since: p.age, tracks: s.tracks.slice(), dom: s.dom.slice() };
  Object.keys(s.start).forEach((k) => bumpAny(p, k, s.start[k]));
  p.interest = p.interest || {};
  s.dom.forEach((d) => { p.interest[d] = (p.interest[d] || 0) + 2.2; });
  p.flags["spe_" + s.id] = 1;
  p.journal.push({ age: p.age, text: "Tu choisis une spécialisation en " + s.l.toLowerCase() + ".", ic: s.ic, tag: "études" });
}

// Chaque année d'études dans la filière fait progresser les qualités du domaine
function tick(g, p, rep) {
  const s = p.spe;
  if (!s || s.done) return;
  const ph = p.school ? p.school.phase : "none";
  const t = p.school ? p.school.track : null;
  const inside = ((ph === "lycee" || ph === "sup") && t === s.stage) || (s.stage === "apprenti" && t === "apprenti" && p.age <= 20);
  if (inside) {
    s.xp++;
    const sp = byId[s.id];
    Object.keys(sp.grow).forEach((k) => bumpAny(p, k, sp.grow[k]));
    p.interest = p.interest || {};
    s.dom.forEach((d) => { p.interest[d] = (p.interest[d] || 0) + 0.8; });
    if (rep && s.xp === 2) rep.lines.push("📚 Ta spécialisation en " + s.l.toLowerCase() + " te donne un vrai bagage. Les professionnels du secteur commencent à te remarquer.");
    return;
  }
  // la formation est terminée, ou abandonnée
  if (s.xp > 0 || p.age > s.since + 1) {
    s.done = true; s.endAge = p.age;
    if (s.xp > 0 && s.dip) s.xp++;
    if (s.stage === "apprenti" && s.xp >= 3) {
      s.dip = true;
      const FX = require("./fx");
      if (!p.school.diplomas.includes("bacpro") && p.school.edu < 2) { FX.giveDiploma(p, "bacpro"); if (rep) rep.lines.push("📜 Tu décroches ton CAP à la fin de ton apprentissage."); p.journal.push({ age: p.age, text: "Diplôme de fin d'apprentissage obtenu.", ic: "📜", tag: "études" }); }
    }
    if (s.xp > 0) {
      const PRO = require("./pro");
      PRO.bump(p, { skill: 3 + Math.min(s.xp, 5) * 2 + (s.dip ? 4 : 0), net: 2 + Math.min(s.xp, 4) * 1.5, rep: s.dip ? 3 : 0 });
      if (rep) rep.lines.push("🎓 Ta formation en " + s.l.toLowerCase() + " s'achève. Tu sors avec " + (s.dip ? "un diplôme, " : "") + "de la compétence et un petit carnet d'adresses.");
      p.journal.push({ age: p.age, text: "Fin de ta formation en " + s.l.toLowerCase() + (s.dip ? ", diplôme en poche." : "."), ic: s.ic, tag: "études" });
    }
  }
}

// ---------- ce que la filière change dans la recherche d'emploi ----------
function matches(p, track) {
  const all = (p.speHist || []).concat(p.spe ? [p.spe] : []);
  return all.filter((s) => s.tracks.includes(track) && (s.xp > 0 || s.dip));
}
// expérience offerte au démarrage sur un métier du domaine
function bonusExp(p, track) {
  let b = 0;
  matches(p, track).forEach((s) => { b += Math.min(s.xp, 4) * 1.0 + (s.dip ? 2 : 0); });
  return Math.min(8, Math.round(b));
}
// poids supplémentaire dans les offres d'emploi
function affinityMul(p, track) {
  let m = 1;
  matches(p, track).forEach((s) => { m *= 1 + 1.7 * Math.min(1, (s.xp + (s.dip ? 1 : 0)) / 3); });
  return Math.min(m, 7);
}
// bonus de salaire proposé
function salaryBonus(p, track) {
  const n = matches(p, track).length;
  return n ? Math.min(0.14, 0.05 * n + (matches(p, track).some((s) => s.dip) ? 0.04 : 0)) : 0;
}
function labelFor(p, track) {
  const m = matches(p, track)[0];
  return m ? "dans la lignée de ta formation en " + m.l.toLowerCase() : "";
}
// À défaut de choix du joueur, on prend la filière qui colle le mieux à ses goûts et à ses qualités
function fitScore(p, id) {
  const s = byId[id];
  if (!s) return 0.6;
  let v = 1;
  (s.dom || []).forEach((d) => { v += ((p.interest && p.interest[d]) || 0) * 1.1; });
  Object.keys(s.start).forEach((k) => { const cur = k in p.stats ? p.stats[k] : p.traits[k]; v += Math.max(0, (cur - 45) / 22); });
  return v;
}
function markDiploma(p) {
  if (p.spe && !p.spe.done) p.spe.dip = true;
}

module.exports = { fitScore, LIST, byId, forStage, stageOf, gateOk, gateWhy, choose, tick, bonusExp, affinityMul, salaryBonus, labelFor, markDiploma, matches };
