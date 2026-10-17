// Petites nouvelles de l'année pour les nouveaux métiers, des plus chics aux plus délirants.
const { flash } = require("../kit");

const J = (track, ages) => ({ ages: ages || [16, 80], need: { job: track } });
const L = (track, ages) => ({ ages: ages || [16, 80], need: { job: track }, tag: "loufoque" });

// ---------- postes de gens très riches ----------
flash("Au conseil d'administration, on vote à main levée. Tu lèves la main en retard et tu découvres que tu as accepté de racheter une usine de trombones.", { bonheur: 1, prudent: -1 }, J("admin_ca"));
flash("Un administrateur s'endort pendant la réunion annuelle. Ton café discret et ton coude amical lui sauvent la mise.", { repute: 2 }, J("admin_ca"));
flash("Le comité de direction te nomme « sage de la maison ». Tu ne sais pas si c'est un compliment ou une invitation à te taire.", { repute: 2, bonheur: 1 }, J("admin_ca"));
flash("Ton premier vernissage de mécène tourne à la fête. Un jeune sculpteur te remercie en pleurant dans son œuvre.", { bonheur: 3, bonte: 1 }, J("mecene_pro"));
flash("Une fondation te nomme président d'honneur. Le buffet était excellent, le discours aussi.", { repute: 3 }, J("mecene_pro"));
flash("Tu prononces un toast dans une langue que tu ne parles pas. Personne ne remarque rien, tout le monde applaudit.", { repute: 2, charme: 1 }, J("diplomate_honneur"));
flash("Au dîner officiel, tu t'assois par erreur à côté de l'ennemi juré de ton pays. Tu lui parles de recettes de cuisine pendant trois heures. Un traité de paix en sort, presque.", { repute: 3, bonheur: 2 }, J("diplomate_honneur"));
flash("Ta dernière critique fait pleurer un chef trois étoiles, et rire tout un quartier. La table se remplit pour six mois.", { repute: 2, creatif: 1 }, J("critique_gastro"));
flash("Tu goûtes un plat servi dans une assiette en forme de chaussure. Tu écris « audacieux » et tu prends un antiacide.", { sante: -1, bonheur: 1 }, J("critique_gastro"));
flash("Un client te demande un vin « qui fait rire ». Tu lui en trouves un. Il rit toute la soirée.", { bonheur: 3, repute: 1 }, J("sommelier"));
flash("Tu reconnais un vin les yeux fermés, l'année, le domaine, le jour de la vendange. La salle applaudit. Tu n'oses pas dire que tu avais vu l'étiquette.", { repute: 2 }, J("sommelier"));
flash("Ta dernière praline à la violette fait pleurer un client. Il demande la recette, tu refuses, il revient le lendemain.", { repute: 2, bonheur: 2 }, J("chocolatier"));
flash("Tu rates un tempérage devant un journaliste. Le chocolat fait une mousse énorme que tout le monde trouve géniale.", { bonheur: 2, creatif: 1 }, J("chocolatier"));
flash("Tu réussis un coup de golf aussi beau qu'inattendu. Un homme d'affaires te donne sa carte et sa confiance.", { repute: 2, bonheur: 2 }, J("golf_pro"));

// ---------- métiers étranges ----------
flash("Tu testes un matelas à mémoire de forme qui mémorise surtout ton ronflement. Il te le rejoue la nuit suivante. Tu ne dors plus.", { bonheur: -1, creatif: 1 }, L("testeur_matelas"));
flash("Un client te félicite pour la qualité de ton sommeil. C'est la plus belle phrase qu'on t'ait dite depuis longtemps.", { bonheur: 3 }, L("testeur_matelas"));
flash("Un fantôme te réclame un meilleur salaire. Tu négocies avec lui, il retire une exigence sur trois.", { courage: 1, bonheur: 1 }, L("chasseur_fantomes"));
flash("Tu passes la nuit dans un manoir hanté qui n'est hanté que par des souris. Elles te laissent un petit mot d'excuse.", { courage: 2, bonheur: 1 }, L("chasseur_fantomes"));
flash("Une licorne refuse de manger avant d'avoir écouté la météo. Tu apprends à lire les prévisions à voix haute.", { creatif: 2, bonheur: 2 }, L("dresseur_licornes"));
flash("Tu gagnes le concours régional de dressage de licornes. Le jury a pleuré, la licorne aussi.", { repute: 3, bonheur: 4 }, L("dresseur_licornes"));
flash("Ta sculpture de beurre représentant la cathédrale fond lentement pendant l'inauguration. Le public trouve ça poétique et lèche discrètement la nef.", { creatif: 2, bonheur: 1 }, L("sculpteur_beurre"));
flash("Une exposition entièrement en beurre est annulée pour cause de canicule. Les pigeons, eux, n'ont pas à se plaindre.", { creatif: 1, bonheur: -1 }, L("sculpteur_beurre"));
flash("Un chat te confie un secret que tu traduis avec un sérieux absolu. Son propriétaire écrit « merci » et fait un virement.", { bonheur: 3, argent: 300 }, L("traducteur_chats"));
flash("Tu annonces aux propriétaires que leur chat est « insatisfait de la décoration ». Ils refont le salon.", { repute: 1, bonheur: 2, argent: 200 }, L("traducteur_chats"));
flash("Tu annonces l'ouverture d'un marché sur la place, avec un chapeau à plumes. Une femme te supplie de recommencer.", { sociable: 2, bonheur: 3 }, L("crieur_public"));
flash("Ta voix couvre le bruit d'une fanfare entière. La fanfare te propose un rôle, tu refuses poliment.", { sociable: 1, repute: 1 }, L("crieur_public"));
flash("Tu testes un toboggan de quarante mètres. Tu en ressors avec un sourire immense et une tenue à jeter.", { bonheur: 4, sport: 1 }, L("testeur_toboggans"));
flash("Un toboggan trop rapide t'expédie dans la piscine du voisin. Le voisin t'invite à un barbecue.", { bonheur: 3, sociable: 1 }, L("testeur_toboggans"));
flash("Un prince te consulte sur la couleur de ses chaussettes. Tu réponds avec une assurance déconcertante, et il te remercie en te nommant officiellement.", { repute: 3, bonheur: 2 }, L("consultant_prince"));
flash("Tu prédis la météo, le prochain gagnant du quiz et la prochaine panne de télé. Seule la panne se produit, tu ne laisses pas le public s'en apercevoir.", { repute: 2, bonheur: 1 }, L("medium_tele"));
flash("Tu vois une grande aventure dans ton futur proche. Le lendemain, tu perds ton parapluie. La frontière est fine.", { bonheur: 1, creatif: 1 }, L("medium_tele"));

// ---------- métiers pas très nets ----------
flash("Tu surprends une star sortant d'un restaurant à trois heures du matin. La photo se vend très bien, la star ne te parlera plus jamais.", { argent: 900, repute: -3 }, { ages: [18, 65], need: { job: "paparazzi" }, tag: "mature" });
flash("Tu passes dix-huit heures dans un buisson pour photographier un pot de fleurs, qui était le vrai scoop. Tu comprends que la vie est cruelle et verte.", { bonheur: -2 }, { ages: [18, 65], need: { job: "paparazzi" }, tag: "mature" });
flash("Tu vends une voiture « révisée la semaine dernière » à un homme qui t'a juré qu'il ne s'y connaissait pas. Il s'y connaissait.", { honnete: -2, repute: -2 }, { ages: [18, 70], need: { job: "vendeur_douteux" }, tag: "mature" });
flash("Un client rapporte la voiture le lendemain avec un chat à l'intérieur. Tu lui offres le chat et un contrat d'entretien.", { bonheur: 1, argent: 300 }, { ages: [18, 70], need: { job: "vendeur_douteux" }, tag: "mature" });
flash("Un débiteur t'ouvre la porte en pyjama, avec un sourire effrayé. Tu le laisses payer en trois fois. Tu rentres un peu moins fier(e) mais plus léger(e).", { bonte: 1, honnete: 1 }, { ages: [18, 70], need: { job: "recouvrement" }, tag: "mature" });
flash("Un chasseur de primes t'apporte son butin dans un sac de sport. Le sac de sport est pris, le butin s'enfuit.", { courage: 1, bonheur: 0 }, { ages: [18, 55], need: { job: "chasseur_primes" }, tag: "mature" });
