// Métiers supplémentaires de la grande mise à jour.
//  lunar    métier délirant, proposé seulement si la loufoquerie n'est pas à zéro
//  passion  métier de passion, accepté même par ceux qui n'ont pas besoin d'argent
//  minNet   fortune minimale pour qu'on te propose ce poste (réseau, prestige)
//  maxNet   fortune maximale au-delà de laquelle on ne te le propose plus
//  mature   métier réservé aux thèmes adultes
module.exports = {
  // ---------- postes de gens très riches ----------
  admin_ca: { l: "Conseils d'administration", ic: "🪑", edu: 0, age: 30, minNet: 300000, stat: "intel", stress: 1, levels: [["Observateur au conseil", 60000], ["Administrateur", 120000], ["Président du conseil", 260000], ["Doyen des grands patrons", 520000]] },
  mecene_pro: { l: "Mécénat et fondations", ic: "🏛️", edu: 0, age: 35, minNet: 600000, passion: true, stat: "charme", stress: 1, levels: [["Mécène de quartier", 30000], ["Collectionneur reconnu", 80000], ["Grand mécène", 180000]] },
  diplomate_honneur: { l: "Diplomatie et réceptions", ic: "🎩", edu: 0, age: 35, minNet: 900000, stat: "charme", stress: 1, levels: [["Ambassadeur des petits fours", 70000], ["Attaché de réception", 130000], ["Ambassadeur de la bonne humeur", 260000]] },
  critique_gastro: { l: "Critique gastronomique", ic: "🍽️", edu: 0, age: 24, passion: true, stat: "creatif", stress: 1, variable: 0.4, levels: [["Blogueur culinaire", 12000], ["Critique de presse", 36000], ["Pape de la gastronomie", 120000]] },
  sommelier: { l: "Vins et spiritueux", ic: "🍷", edu: 0, age: 20, passion: true, stat: "charme", stress: 1, levels: [["Serveur en cave", 19000], ["Sommelier", 34000], ["Chef sommelier d'un palace", 72000], ["Légende du verre à pied", 130000]] },
  chocolatier: { l: "Chocolaterie", ic: "🍫", edu: 0, age: 18, passion: true, stat: "creatif", stress: 1, levels: [["Apprenti chocolatier", 17000], ["Chocolatier", 28000], ["Maître chocolatier", 58000], ["Roi du cacao", 120000]] },
  golf_pro: { l: "Golf et clubs privés", ic: "⛳", edu: 0, age: 28, maxAge: 62, minStat: ["sport", 50], stat: "sport", stress: 1, levels: [["Employé de club", 18000], ["Moniteur de golf", 32000], ["Pro du circuit senior", 80000], ["Légende du green", 190000]] },
  // ---------- métiers étranges et pas très nets ----------
  testeur_matelas: { l: "Sommeil et matelas", ic: "🛏️", edu: 0, age: 18, lunar: true, maxNet: 150000, stat: "bonheur", stress: 0, levels: [["Testeur de matelas", 15000], ["Testeur en chef", 24000], ["Directeur du repos", 52000]] },
  chasseur_fantomes: { l: "Chasseurs de fantômes", ic: "👻", edu: 0, age: 18, lunar: true, stat: "courage", stress: 2, variable: 0.8, levels: [["Apprenti spectre", 11000], ["Chasseur de fantômes", 27000], ["Exorciste agréé", 56000], ["Légende du manoir hanté", 110000]] },
  dresseur_licornes: { l: "Dressage de licornes", ic: "🦄", edu: 0, age: 18, lunar: true, stat: "creatif", stress: 2, levels: [["Palefrenier de licornes", 14000], ["Dresseur de licornes", 31000], ["Écuyer du roi", 78000], ["Maître de la grande écurie", 140000]] },
  sculpteur_beurre: { l: "Sculpture de beurre", ic: "🧈", edu: 0, age: 16, lunar: true, passion: true, stat: "creatif", stress: 1, variable: 0.5, levels: [["Apprenti sculpteur", 10000], ["Sculpteur de beurre", 23000], ["Artiste monumental", 60000], ["Maître du buffet royal", 120000]] },
  traducteur_chats: { l: "Communication avec les animaux", ic: "🐈", edu: 0, age: 18, lunar: true, stat: "creatif", stress: 1, variable: 0.7, levels: [["Traducteur de miaulements", 10000], ["Interprète animalier", 26000], ["Conseiller des chats célèbres", 70000]] },
  crieur_public: { l: "Crieur public", ic: "📣", edu: 0, age: 18, lunar: true, stat: "sociable", stress: 1, levels: [["Crieur de village", 14000], ["Crieur de la ville", 24000], ["Voix officielle du royaume", 54000]] },
  testeur_toboggans: { l: "Testeur de toboggans", ic: "🛝", edu: 0, age: 18, maxAge: 52, lunar: true, maxNet: 400000, stat: "sport", stress: 0, levels: [["Testeur junior", 15000], ["Testeur certifié", 26000], ["Directeur des glissades", 59000]] },
  consultant_prince: { l: "Conseil auprès de personnalités", ic: "👑", edu: 0, age: 35, lunar: true, minNet: 500000, stat: "charme", stress: 1, variable: 0.6, levels: [["Conseiller en licornes du Prince", 90000], ["Grand maître des cérémonies absurdes", 170000], ["Devin officiel du palais", 320000]] },
  medium_tele: { l: "Médiums de télévision", ic: "🔮", edu: 0, age: 22, lunar: true, stat: "charme", stress: 2, variable: 1, levels: [["Médium de plateau", 22000], ["Voyante vedette", 70000], ["Prophète du prime time", 200000]] },
  paparazzi: { l: "Photographes de people", ic: "📸", edu: 0, age: 20, mature: true, stat: "courage", stress: 2, variable: 0.9, levels: [["Paparazzi débutant", 13000], ["Chasseur de scoops", 38000], ["Roi des révélations", 110000]] },
  vendeur_douteux: { l: "Vente peu scrupuleuse", ic: "🚙", edu: 0, age: 20, mature: true, maxNet: 250000, stat: "charme", stress: 2, variable: 0.8, levels: [["Vendeur de voitures d'occasion", 22000], ["Marchand de tapis volants", 44000], ["Roi du bon plan", 98000]] },
  recouvrement: { l: "Recouvrement de dettes", ic: "📞", edu: 0, age: 20, mature: true, maxNet: 200000, stat: "courage", stress: 3, levels: [["Agent de recouvrement", 21000], ["Chef d'équipe d'huissiers", 41000], ["Directeur des créances", 78000]] },
  chasseur_primes: { l: "Chasseurs de primes", ic: "🤠", edu: 0, age: 21, maxAge: 55, mature: true, minStat: ["courage", 55], stat: "courage", stress: 3, danger: 2, variable: 1, levels: [["Apprenti traqueur", 14000], ["Chasseur de primes", 42000], ["Légende du Far West", 110000]] },
};
