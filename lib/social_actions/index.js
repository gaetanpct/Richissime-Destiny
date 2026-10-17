require("./10_jeunesse");
require("./20_jeunes_adultes");
require("./30_adultes");
require("./40_seniors");
require("./50_rivalite_trash");
require("./55_reactions");
require("./70_conflits");
require("./80_vendetta");
require("./85_couple");
require("./88_prison");

// Phrases affichées à la personne qui reçoit la proposition
const { byId } = require("../socialkit");
const ASK = {
  pacte_copains: "$A te propose de faire un pacte de copains pour la vie.",
  cabane_commune: "$A te propose de construire une cabane ensemble.",
  echange_cartes: "$A te propose d'échanger des cartes à collectionner.",
  cache_cache: "$A te propose une partie de cache-cache géant.",
  defi_trottinette: "$A te défie à la trottinette.",
  copier_devoirs: "$A voudrait copier sur tes devoirs, en promettant de changer deux mots.",
  invitation_anniversaire: "$A t'invite à son anniversaire.",
  soiree_pyjama: "$A t'invite à une soirée pyjama.",
  bal_lyceen: "$A t'invite au bal du lycée.",
  groupe_ensemble: "$A te propose de monter un groupe de musique ensemble.",
  defi_skate: "$A te défie au skate.",
  fete_sans_parents: "$A t'invite à une fête, parents absents.",
  faire_la_paix: "$A veut faire la paix avec toi.",
  coloc: "$A te propose de partager une colocation.",
  voyage_duo: "$A te propose de partir en voyage à deux.",
  karaoke: "$A t'invite à une soirée karaoké.",
  course_ensemble: "$A te propose de vous entraîner pour un marathon ensemble.",
  temoin_mariage: "$A voudrait être ton témoin de mariage.",
  soiree_folle: "$A t'invite à la soirée de l'année.",
  startup_ensemble: "$A te propose de vous lancer dans une idée d'entreprise à deux.",
  visite_prison: "$A demande à te rendre visite au parloir.",
  diner_couples: "$A vous invite à dîner, avec vos conjoints.",
  parrain: "$A propose de devenir le parrain ou la marraine de ton enfant.",
  mentorat: "$A te propose de te prendre sous son aile.",
  embaucher_ami: "$A te propose un poste dans son entreprise.",
  fete_surprise: "$A organise une fête pour toi, en t'avertissant à peine.",
  anniv_rond: "$A t'invite à son grand anniversaire.",
  garde_enfants: "$A te demande de garder ses enfants pour un week-end.",
  voyage_famille: "$A te propose des vacances entre amis, enfants compris.",
  association_affaires: "$A te propose de fonder une société de conseil ensemble.",
  petanque: "$A te propose une partie de pétanque.",
  veillee_souvenirs: "$A te propose une soirée de vieilles photos.",
  voyage_retraites: "$A te propose un voyage organisé à deux.",
  derniere_reconciliation: "$A veut se réconcilier avec toi, avant qu'il soit trop tard.",
  pot_retraite: "$A organise ton pot de départ en retraite.",
  course_deambulateurs: "$A te défie à une course de déambulateurs.",
  amis_apres_rupture: "$A te propose un café, pour voir si vous pouvez rester amis.",
  pari_absurde: "$A te propose un pari absurde.",
  chasse_tresor: "$A te propose de partir à la chasse au trésor.",
  echange_vies: "$A te propose d'échanger vos vies pendant une journée.",
  secte_tarte: "$A te propose de fonder la secte de la tarte.",
  concours_moustache: "$A te défie à un concours de moustache.",
};
Object.keys(ASK).forEach((k) => { if (!byId[k]) throw new Error("phrase pour une action inconnue " + k); byId[k].ask = ASK[k]; });
