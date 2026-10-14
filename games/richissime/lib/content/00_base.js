const { ev, flash, O, C, D } = require("../kit");

ev("annee_tranquille", {
  chainOnly: true, once: false, tags: ["calme"], ic: "🌤️",
  t: "Une année sans grand événement. Les saisons passent, tu observes la vie autour de toi.",
  c: [
    D("Profiter de la routine", "☕", "Tu savoures le calme. Il y a des années comme ça.", { bonheur: 2 }),
    D("Tenter quelque chose de nouveau", "✨", "Tu essaies une nouveauté. Ça ne change pas ta vie, mais ça amuse.", { creatif: 2, bonheur: 1 }),
  ],
});
