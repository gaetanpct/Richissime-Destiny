// Petit bouton de retour vers Picuite Games, en haut à gauche de chaque jeu
(function () {
  if (document.getElementById("pg-back")) return;
  var st = document.createElement("style");
  st.textContent = "#pg-back{position:fixed;left:6px;top:6px;z-index:99999;display:flex;align-items:center;gap:8px;height:34px;padding:3px;border:2.5px solid #1a1a2e;border-radius:99px;background:#ffd23f;color:#1a1a2e;font:700 13px/1 system-ui,sans-serif;text-decoration:none;box-shadow:2px 2px 0 #1a1a2e;opacity:.9;overflow:hidden;max-width:34px;transition:max-width .2s,opacity .2s}#pg-back:hover,#pg-back:focus-visible{opacity:1;max-width:170px;padding-right:12px}#pg-back img{width:24px;height:24px;flex:none}#pg-back span{white-space:nowrap}";
  document.head.appendChild(st);
  var a = document.createElement("a");
  a.id = "pg-back"; a.href = "/"; a.title = "Retour à Picuite Games"; a.setAttribute("aria-label", "Retour à Picuite Games");
  a.innerHTML = '<img src="/logos/picuite.svg" alt=""><span>Picuite Games</span>';
  document.body.appendChild(a);
})();
