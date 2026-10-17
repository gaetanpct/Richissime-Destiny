// ============================================================
// RICHISSIME DESTINY — Les causes de mort imprévues
// À chaque fin d'année, en plus de la mortalité liée à l'âge et à la santé, un joueur peut mourir d'un accident,
// d'un coup du sort ou d'une circonstance improbable, même quand tout va très bien dans sa vie.
// Chaque cause a un poids relatif, une tranche d'âge et parfois une condition. Les causes improbables ont un poids minuscule.
// Les textes évitent les deux-points. {e} devient un e pour une joueuse.
// ============================================================
const C = require("./core");
const R = require("./rules");

const LIST = [];
// D(poids, [âgeMin, âgeMax], cause, histoire, options)
function D(w, ages, cause, story, opt) { LIST.push(Object.assign({ w, ages, cause, story }, opt || {})); }

const job = (p, tr) => !!(p.job && (Array.isArray(tr) ? tr.includes(p.job.track) : p.job.track === tr));
const danger = (p) => (p.job ? (R.TRACKS[p.job.track].danger || 0) : 0);
const rich = (p) => C.netWorth(p) >= 800000;
const sporty = (p) => p.stats.sport >= 60;
const old = (p) => p.age >= 65;
const MAT = { tag: "mature" };
const LOU = { tag: "loufoque" };

// ---------- route et transports ----------
D(3.0, [14, 95], "renversé{e} par une voiture sur un passage piéton", "Tu traverses sur un passage piéton, au vert. Une voiture ne s'arrête pas.");
D(2.0, [16, 90], "dans un accident de voiture sur l'autoroute", "Un pneu éclate à pleine vitesse, la voiture part en travers.");
D(1.3, [16, 75], "dans un accident de scooter", "Un camion tourne sans te voir, tu n'as pas le temps de freiner.");
D(1.1, [16, 80], "dans un accident de moto", "Une plaque de gravier dans un virage, et la route disparaît.", { mult: (p) => 1 + Math.max(0, p.traits.courage - 55) / 40 });
D(1.2, [8, 85], "écrasé{e} par un camion en faisant du vélo", "Tu roules sur la piste cyclable. Un camion déboîte, l'angle mort fait le reste.");
D(0.6, [10, 40], "dans un accident de trottinette électrique", "Un trottoir, une bordure, et une vitesse que personne ne contrôle.", { mult: (p) => (p.age < 40 ? 1 : 0.3) });
D(0.5, [14, 90], "percuté{e} par un train à un passage à niveau", "La barrière ne descend pas, le train arrive plus vite qu'on le croit.");
D(0.4, [10, 90], "dans un accident de car de tourisme", "Une route de montagne, un virage serré, un chauffeur qui s'endort.");
D(0.1, [10, 95], "dans la catastrophe d'un avion de ligne", "À dix mille mètres, l'équipage annonce un incident technique. Il n'y aura pas d'atterrissage.");
D(0.06, [10, 95], "dans le naufrage d'un ferry", "Une tempête de nuit, un ferry surchargé et trop peu de canots.");
D(0.05, [12, 85], "dans l'incendie d'un tunnel", "Un poids lourd s'enflamme devant toi dans un tunnel. La fumée est plus rapide que les secours.");
D(0.3, [14, 90], "dans un accident de taxi", "Une course de nuit, un conducteur pressé et un feu rouge brûlé.");
D(0.04, [18, 80], "dans l'explosion d'un montgolfière en plein vol", "Le ballon prend feu au-dessus d'un champ. La vue était superbe jusqu'ici.");
D(0.25, [20, 85], "en tombant d'un tramway en marche", "Les portes se referment sur ton sac, et tu es entraîné{e} sur les rails.");
D(0.3, [16, 90], "dans une collision sur un rond-point", "Un conducteur ne cède pas la priorité, tu n'as même pas le temps de klaxonner.");

// ---------- chez soi ----------
D(1.8, [55, 100], "d'une chute dans l'escalier", "Une marche mal vue, la rampe qui lâche, et l'escalier fait le reste.", { mult: (p) => (p.age >= 70 ? 2.2 : 1) });
D(1.0, [60, 100], "d'une chute dans la salle de bain", "Un carrelage mouillé, une hanche qui cède et personne à la maison.", { need: old, mult: (p) => (p.age >= 80 ? 2.5 : 1) });
D(0.6, [18, 100], "électrocuté{e} en changeant une ampoule", "Tu n'avais pas coupé le courant. L'ampoule, elle, est restée intacte.");
D(0.6, [4, 100], "intoxiqué{e} par le monoxyde de carbone", "Une chaudière défectueuse, une nuit d'hiver, et personne ne se réveille.");
D(0.7, [4, 100], "dans l'incendie de sa maison", "Un court-circuit pendant la nuit. Les détecteurs de fumée n'avaient plus de piles.");
D(0.12, [10, 100], "dans l'explosion d'une fuite de gaz", "Tu allumes la cuisinière sans sentir l'odeur. Tout l'immeuble tremble.");
D(0.25, [1, 8], "noyé{e} dans le bain", "Quelques secondes sans surveillance suffisent.", { need: (p) => p.age <= 8 });
D(0.3, [3, 100], "noyé{e} dans sa baignoire", "Un malaise dans l'eau chaude, et la porte était fermée à clé.", { need: (p) => p.age >= 20 });
D(0.9, [5, 100], "étouffé{e} par un morceau de viande", "Un repas de famille, un rire au mauvais moment, et la fausse route fatale.");
D(0.3, [20, 100], "en tombant d'une échelle en nettoyant les gouttières", "Un dimanche de bricolage. L'échelle glisse, le sol arrive vite.");
D(0.2, [30, 100], "écrasé{e} par une étagère mal fixée", "L'étagère de la cave contenait tous tes souvenirs. Tous.");
D(0.12, [20, 100], "en tombant par la fenêtre en accrochant des rideaux", "Un rideau, une chaise, un étage trop haut.");
D(0.15, [25, 100], "d'une intoxication au barbecue", "Un barbecue à l'intérieur, parce qu'il pleuvait dehors.");
D(0.1, [30, 100], "brûlé{e} par une friteuse en feu", "Un soir de fête, de l'huile, de l'eau au mauvais moment.");

// ---------- nature et loisirs ----------
D(0.9, [6, 95], "noyé{e} en mer", "Un courant de baïne emporte le baigneur le plus confiant de la plage.", { mult: (p) => (p.flags.en_voyage ? 1.8 : 1) });
D(0.35, [14, 85], "dans une avalanche", "Un hors-piste interdit, une plaque qui se détache, un silence blanc.", { mult: (p) => 1 + Math.max(0, p.traits.courage - 55) / 50 });
D(0.5, [12, 85], "d'une chute en randonnée", "Un sentier de crête, un caillou qui roule, une photo de trop au bord du vide.", { mult: (p) => (sporty(p) ? 1.4 : 1) });
D(0.12, [8, 90], "foudroyé{e} en plein orage", "Un pique-nique sous un grand arbre, et le ciel qui décide.");
D(0.1, [8, 90], "d'une morsure de vipère", "Une promenade en sandales dans les rochers. La vipère n'avait pas prévu de te croiser non plus.");
D(0.25, [4, 100], "d'un choc anaphylactique après une piqûre de guêpe", "Tu ne savais pas que tu étais allergique. Maintenant tu le sais.");
D(0.2, [14, 80], "dans un éboulement en montagne", "Un bruit sourd au-dessus du sentier, puis plus rien.");
D(0.1, [18, 80], "lors d'une expédition d'alpinisme", "Le sommet est atteint. La descente ne le sera pas.", { mult: (p) => 1 + Math.max(0, p.traits.courage - 60) / 30 });
D(0.15, [16, 70], "dans un accident de parachute", "Le parachute principal ne s'ouvre pas. Celui de secours non plus.", { mult: (p) => 1 + Math.max(0, p.traits.courage - 60) / 30 });
D(0.2, [16, 75], "d'un accident de plongée sous-marine", "Une remontée trop rapide, une bouteille mal contrôlée.");
D(0.2, [10, 85], "emporté{e} en kayak par une rivière en crue", "Le débit double en une heure. La rivière ne prévient pas.");
D(0.25, [8, 90], "d'une chute de cheval", "Le cheval se cabre à la vue d'un sac plastique.");
D(0.12, [16, 70], "dans un accident de parapente", "Une rafale, un décrochage, une prairie qui monte à toute vitesse.");
D(0.12, [8, 90], "surpris{e} par la marée montante", "Une balade au Mont-Saint-Michel. La mer revient plus vite qu'un cheval au galop.");
D(0.4, [50, 100], "d'une glissade sur le verglas", "Un trottoir gelé, un matin de janvier, une tête qui touche le bord.", { mult: (p) => (p.age >= 70 ? 1.8 : 1) });
D(0.15, [10, 100], "après avoir mangé des champignons empoisonnés", "Un panier de champignons, un voisin qui jurait les connaître.");
D(0.08, [6, 100], "de froid lors d'une randonnée hivernale", "Un col, un brouillard, un abri trop loin.");
D(0.2, [4, 100], "d'un coup de chaleur", "Un été de canicule, une longue promenade, et pas une goutte d'eau.", { mult: (p) => (p.age >= 70 || p.age <= 6 ? 2.2 : 1) });
D(0.1, [8, 100], "écrasé{e} par un arbre tombé pendant une tempête", "Le vent souffle à cent trente. L'arbre a choisi son moment.");
D(0.01, [8, 100], "d'une noix de coco tombée d'un cocotier", "Des vacances au soleil, une sieste à l'ombre. La noix de coco n'avait pas lu la brochure.", { need: (p) => !!p.flags.en_voyage || p.age > 20, tag: "loufoque" });
D(0.08, [8, 100], "emporté{e} par une crue soudaine", "Un orage sur les hauteurs, un ruisseau qui devient torrent en quelques minutes.");
D(0.03, [8, 100], "d'une attaque de requin", "Une baignade à l'aube sur une plage connue des surfeurs. Les statistiques étaient avec toi, jusque là.");
D(0.1, [10, 100], "d'une chute dans une crevasse", "Un glacier, une corde mal fixée, un pas de côté.");

// ---------- sport ----------
D(0.35, [20, 70], "d'un arrêt cardiaque en plein marathon", "Au trentième kilomètre, le cœur dit non. La foule applaudit encore.", { need: sporty });
D(0.3, [14, 60], "après un choc violent pendant un match", "Un duel, un genou, une tête qui touche le sol au mauvais angle.", { need: sporty });
D(0.15, [14, 55], "d'un coup reçu sur un ring", "Un round de trop, un coup que personne n'a vu venir.", { need: (p) => p.stats.sport >= 55 });
D(0.15, [10, 50], "d'une chute à skateboard", "Un trick trop ambitieux sur une rampe trop haute.", { need: (p) => p.age <= 50 });
D(0.15, [14, 70], "d'une vague trop grosse en surf", "Une série de vagues géantes, et une planche qui ne remonte pas.");
D(0.1, [16, 60], "dans une course automobile", "Un dernier virage pris à fond, et une barrière trop proche.", { need: (p) => p.cash > 20000 });

// ---------- santé foudroyante ----------
D(1.2, [20, 100], "d'une rupture d'anévrisme", "Un mal de tête brutal en pleine soirée, puis le noir.");
D(1.2, [30, 100], "d'un AVC foudroyant", "Une phrase qui devient incompréhensible, un bras qui ne répond plus.");
D(0.9, [22, 100], "d'une embolie pulmonaire", "Après un long vol, une douleur dans le mollet que tu avais ignorée.");
D(1.1, [30, 100], "d'une crise cardiaque en plein repas", "Un déjeuner d'affaires, une main sur la poitrine, une chaise qui tombe.");
D(0.35, [3, 70], "d'une méningite fulgurante", "Une fièvre, un cou raide, et vingt-quatre heures pour tout perdre.");
D(0.4, [8, 100], "d'une septicémie", "Une petite plaie négligée devient en trois jours une urgence absolue.");
D(0.2, [6, 100], "d'une appendicite non soignée", "Une douleur au ventre qu'on met sur le compte du stress.");
D(0.3, [3, 100], "d'un choc anaphylactique après un repas", "Un plat avec une trace de cacahuète, un stylo d'adrénaline resté à la maison.");
D(0.25, [6, 100], "d'une crise d'asthme", "L'inhalateur est resté dans un autre manteau.");
D(0.4, [20, 100], "d'une mort subite dans son sommeil", "Rien d'anormal le soir. Le lendemain, plus rien.");
D(0.15, [8, 100], "d'une infection tropicale rare", "Un souvenir de voyage dont tu te serais bien passé.", { need: (p) => !!p.flags.en_voyage || p.age > 22 });
D(0.15, [20, 100], "d'une intoxication alimentaire sévère", "Des huîtres un soir de réveillon.");
D(0.08, [3, 50], "d'une maladie génétique foudroyante", "Un trait familial que personne ne connaissait, et qui n'a pas attendu.");
D(0.2, [15, 100], "d'une dissection de l'aorte", "Une douleur déchirante dans le dos pendant une réunion banale.");
D(0.1, [18, 100], "d'un coma éthylique", "Une soirée de trop, une nuit sans surveillance.", MAT);

// ---------- travail ----------
D(0.6, [16, 70], "dans une chute d'échafaudage", "Un harnais mal accroché sur un chantier. Ce n'est pas la première fois qu'on t'avertissait.", { need: (p) => job(p, ["btp", "artisan", "paysagiste"]), mult: () => 1.5 });
D(0.3, [16, 70], "dans un accident de chantier", "Une grue, une charge qui se balance, un hurlement que personne n'entend à temps.", { need: (p) => danger(p) >= 1 });
D(0.15, [18, 70], "dans l'explosion d'une usine", "Une alarme qui sonne trop tard dans un atelier plein de produits chimiques.", { need: (p) => danger(p) >= 1 });
D(0.25, [20, 70], "dans l'incendie d'un immeuble en tentant de sauver des habitants", "Tu es entré{e} une dernière fois, pour la troisième personne.", { need: (p) => job(p, ["pompier", "militaire"]) || danger(p) >= 2 });
D(0.2, [20, 70], "au cours d'une mission en mer", "Une vague plus haute que le pont, et tout bascule.", { need: (p) => job(p, ["marin", "explorateur"]) });
D(0.3, [18, 80], "d'un malaise après des mois de surmenage", "Un dossier de plus, un café de plus, une marche d'escalier de trop.", { need: (p) => !!p.flags.travail_acharne || (p.job && p.job.level >= 2) });
D(0.1, [20, 70], "écrasé{e} par une charge dans un entrepôt", "Une palette mal sanglée sur un chariot élévateur.", { need: (p) => !!p.job });
D(0.08, [18, 75], "frappé{e} par un patient dans une urgence psychiatrique", "Une nuit de garde, une porte qui s'ouvre au mauvais moment.", { need: (p) => job(p, ["sante", "psy"]) });

// ---------- violence et crime ----------
D(0.35, [18, 80], "poignardé{e} à la sortie d'un bar", "Une dispute pour une broutille, un couteau, personne pour te porter secours.", MAT);
D(0.3, [18, 85], "tué{e} lors d'un braquage qui tourne mal", "Tu étais au mauvais endroit, au mauvais moment, avec le mauvais caissier.", MAT);
D(0.9, [20, 70], "dans un règlement de comptes", "Une voiture sans plaque au pied de ton immeuble. Tu as compris trop tard.", { tag: "mature", need: (p) => !!(p.job && R.TRACKS[p.job.track].illicit) || !!p.flags.illicite });
D(0.5, [18, 70], "d'une balle perdue", "Une fête de quartier, des tirs en l'air, une balle qui redescend.", MAT);
D(0.04, [14, 100], "dans un attentat", "Un quartier animé, un jour ordinaire, une explosion que rien n'annonçait.", MAT);
D(0.2, [20, 100], "lors d'un cambriolage", "Tu rentres plus tôt que prévu. Les cambrioleurs aussi sont surpris.", MAT);
D(0.15, [25, 100], "à la suite d'un conflit de voisinage", "Une haie, un arbre, une dispute qui dégénère.", MAT);
D(1.0, [20, 80], "dans une bagarre en prison", "Un couloir, une dette, un règlement de comptes au parloir.", { tag: "mature", need: (p) => !!p.prison, mult: (p) => 1 + p.record * 0.15 });
D(0.1, [18, 80], "lors d'une émeute", "Une manifestation qui dégénère, un mouvement de foule.", MAT);
D(0.25, [20, 70], "d'une overdose", "Une soirée, un cachet de trop, une fête qui ne s'est jamais arrêtée.", { tag: "mature", need: (p) => p.stats.sante < 70 || !!p.flags.fumeur, mult: (p) => 1 + p.record * 0.1 });
D(0.1, [20, 80], "d'un coup de couteau lors d'une tentative de vol de sa voiture", "Tu t'approches du voleur pour l'empêcher de partir.", MAT);
D(0.25, [20, 75], "dans une fusillade lors d'une transaction douteuse", "L'acheteur n'était pas celui qu'on attendait.", { tag: "mature", need: (p) => !!p.flags.illicite });

// ---------- absurde et improbable ----------
D(0.004, [10, 100], "écrasé{e} par un piano tombé d'un balcon", "Un déménagement, une corde qui casse, et le seul piano de la rue.", LOU);
D(0.001, [8, 100], "touché{e} par une météorite", "Un soir d'été, une traînée de feu. Le ciel s'est souvenu de toi.", LOU);
D(0.006, [8, 100], "écrasé{e} par un distributeur de boissons", "Tu as secoué la machine pour récupérer ta cannette. La machine a gagné.", LOU);
D(0.01, [12, 100], "d'avoir mangé un poisson-globe mal préparé", "Un restaurant discret, un menu audacieux, un cuisinier qui n'avait pas son diplôme.", LOU);
D(0.01, [12, 100], "d'un fou rire interminable", "Un spectacle, une blague, un hoquet de trop. Tu es parti{e} en riant.", LOU);
D(0.008, [12, 100], "tombé{e} d'un toit en rattrapant son chapeau", "Un coup de vent, un réflexe, un toit sans rambarde.", LOU);
D(0.006, [10, 100], "écrasé{e} par une statue lors d'une inauguration", "Le maire coupe le ruban. La statue, elle, se détache.", LOU);
D(0.01, [8, 100], "touché{e} par une balle de golf", "Une promenade sur un parcours de golf. Le cri « attention » est arrivé en retard.", LOU);
D(0.006, [12, 100], "enseveli{e} par un déménagement de livres", "Une bibliothèque entière s'effondre, tu es mort{e} entouré{e} de culture.", LOU);
D(0.004, [10, 100], "étouffé{e} par un ballon de baudruche géant", "Une fête d'anniversaire, un pari, un souffle de trop.", LOU);
D(0.005, [14, 100], "dans un escape game qui a mal tourné", "La porte de sortie était bien là. Elle ne s'ouvrait simplement pas.", LOU);
D(0.003, [8, 100], "mangé{e} par un animal échappé d'un cirque", "Un fait divers que personne n'aurait cru.", LOU);
D(0.005, [14, 100], "d'une indigestion de tarte à la crème", "Un concours organisé dans la bonne humeur, un chronomètre et trop de zèle.", LOU);
D(0.004, [10, 100], "emporté{e} par une montgolfière lors d'un décollage raté", "Tu t'étais accroché{e} à la corde pour aider.", LOU);
D(0.003, [8, 100], "dans l'effondrement d'une pyramide de verres de champagne", "Une réception luxueuse, une pyramide trop ambitieuse.", { tag: "loufoque", need: rich });
D(0.004, [10, 100], "coincé{e} dans un ascenseur en panne pendant trois jours", "Personne n'a remarqué ton absence avant lundi.", LOU);
D(0.003, [8, 100], "d'un coup de sabot de licorne", "Il y a des animaux qu'on n'approche pas par derrière.", LOU);

// ---------- environnement et catastrophes ----------
D(0.05, [0, 120], "dans un tremblement de terre", "Un mardi matin, les murs bougent, le plafond ne tient pas.");
D(0.05, [0, 120], "dans une inondation", "Une nuit de pluie, un fleuve qui déborde, une cave qui devient un piège.");
D(0.04, [0, 120], "dans un incendie de forêt", "Un été sec, un vent qui tourne, une route coupée.");
D(0.01, [0, 120], "dans un tsunami", "Une plage tranquille, une mer qui se retire trop loin.");
D(0.02, [0, 120], "dans l'effondrement d'un pont", "Un pont que tout le monde empruntait depuis cinquante ans.");
D(0.05, [0, 120], "dans une tornade", "Un ciel jaune, une sirène, un abri trop loin.");
D(0.03, [0, 120], "dans un glissement de terrain", "Trois semaines de pluie, une colline qui avance.");
D(0.02, [10, 120], "dans l'effondrement d'un immeuble", "Un immeuble ancien, des travaux voisins, et un bruit sourd à six heures du matin.");

// ---------- statut et richesse ----------
D(0.15, [25, 85], "dans le crash de son hélicoptère privé", "Un brouillard à la montagne, un pilote pressé, un week-end de rêve.", { need: rich });
D(0.12, [25, 85], "dans le naufrage de son yacht", "Une tempête, une panne de radio et un équipage en congé.", { need: rich });
D(0.1, [25, 85], "d'une chute de cheval lors d'un concours hippique", "Un parcours d'obstacles, un cheval ombrageux, une barre mal placée.", { need: rich });
D(0.1, [30, 85], "d'un empoisonnement lors d'un dîner mondain", "Une coupe de trop, une rumeur de conspiration, une enquête jamais résolue.", { tag: "mature", need: (p) => C.netWorth(p) >= 3000000 });
D(0.1, [25, 70], "lors d'une chasse au gros gibier", "Un safari entre amis, une erreur de visée, un buffle en colère.", { need: rich });
D(0.25, [20, 90], "d'un accident de ski hors-piste", "Un week-end à la neige, une pente irrésistible.", { need: (p) => C.netWorth(p) >= 150000 });

// ---------- enfance et adolescence ----------
D(0.4, [2, 12], "étouffé{e} par un jouet", "Un jouet trop petit, une seconde d'inattention.");
D(0.4, [2, 12], "noyé{e} dans une piscine", "Un après-midi d'été, un portail resté ouvert.");
D(0.3, [3, 12], "d'une chute de balançoire", "Un sol dur, un élan trop haut.");
D(0.4, [3, 14], "renversé{e} en traversant devant l'école", "Un camion de livraison, une voix qui appelle trop tard.");
D(0.25, [11, 18], "noyé{e} lors d'une baignade avec les copains", "Un lac, un défi de traversée, personne pour surveiller.");
D(0.25, [12, 19], "à la suite d'un défi stupide posté sur Internet", "Un pari entre amis, une vidéo, un geste que l'on ne refera plus.", LOU);
D(0.3, [15, 22], "dans un accident de voiture après une soirée", "Le conducteur n'avait pas voulu dire qu'il avait bu.", MAT);
D(0.15, [14, 20], "d'un coma éthylique lors d'une fête sans parents", "Une première soirée trop arrosée.", MAT);

// ---------- seniors ----------
D(1.3, [75, 120], "d'une pneumonie", "Un hiver rude, une toux qui s'attarde, un poumon fatigué.", { need: old });
D(0.8, [70, 120], "d'une fausse route", "Un déjeuner paisible, une bouchée de travers.", { need: old });
D(0.6, [70, 120], "d'une canicule", "Un été de trop, une maison mal ventilée.", { need: old });
D(0.5, [70, 120], "en tombant de son lit pendant la nuit", "Une chute sans témoin, retrouvé{e} à l'aube.", { need: old });
D(0.4, [70, 120], "d'une chute lors d'une promenade avec son déambulateur", "Un trottoir inégal, une main qui lâche.", { need: old });
D(0.3, [65, 120], "dans l'incendie d'une résidence pour seniors", "Une bougie oubliée, un couloir enfumé.", { need: old });

// ---------- poids de tirage ----------
const K = 0.00005;
function eligible(p, g) {
  const out = [];
  for (const d of LIST) {
    if (p.age < d.ages[0] || p.age > d.ages[1]) continue;
    if (d.tag === "mature" && !(g.settings && g.settings.mature)) continue;
    if (d.tag === "loufoque" && p.cfg && p.cfg.loufoque === 0) continue;
    if (d.need && !d.need(p, g)) continue;
    out.push(d);
  }
  return out;
}
function hazard(p, d) {
  return d.w * K * (d.mult ? d.mult(p) : 1);
}
// retourne une mort imprévue ou null
function roll(g, p) {
  const dm = p.cfg && p.cfg.danger === "douce" ? 0.55 : p.cfg && p.cfg.danger === "dure" ? 1.8 : 1;
  const el = eligible(p, g);
  const hs = el.map((d) => hazard(p, d) * dm);
  const total = hs.reduce((a, b) => a + b, 0);
  if (g.rng() >= total) return null;
  let r = g.rng() * total, d = el[el.length - 1];
  for (let i = 0; i < el.length; i++) { r -= hs[i]; if (r <= 0) { d = el[i]; break; } }
  const f = p.gender === "f";
  const fix = (t) => String(t).replace(/\{e\}/g, f ? "e" : "");
  return { cause: fix(d.cause), story: fix(d.story), id: d.cause };
}
// probabilité annuelle de toutes les morts imprévues (pour les tests)
function totalHazard(g, p) { return eligible(p, g).reduce((a, d) => a + hazard(p, d), 0); }

module.exports = { LIST, roll, totalHazard, eligible };
