// ============================================================
// Utilitaires d'interface : DOM, toasts, sons
// ============================================================
(function () {
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        const v = attrs[k];
        if (v === undefined || v === null || v === false) return;
        if (k === "class") n.className = v;
        else if (k === "text") n.textContent = v;
        else if (k === "html") n.innerHTML = v;
        else if (k === "style" && typeof v === "object") Object.assign(n.style, v);
        else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
        else if (k === "dataset") Object.assign(n.dataset, v);
        else n.setAttribute(k, v === true ? "" : v);
      });
    }
    (children || []).forEach((c) => { if (c !== null && c !== undefined && c !== false) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  function toast(text, type) {
    const box = $("#toasts");
    const t = el("div", { class: "toast toast--" + (type || "info"), text });
    box.appendChild(t);
    setTimeout(() => t.classList.add("toast--out"), 3200);
    setTimeout(() => t.remove(), 3700);
  }

  // ---------- stockage sûr ----------
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v === null ? fallback : v; } catch (e) { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
    sget(k, fallback) { try { const v = sessionStorage.getItem(k); return v === null ? fallback : v; } catch (e) { return fallback; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } },
    sdel(k) { try { sessionStorage.removeItem(k); } catch (e) { /* ignore */ } },
  };

  // ---------- sons (synthèse, aucun fichier) ----------
  const Sound = (function () {
    let ctx = null; let enabled = store.get("goliath.sound", "1") !== "0";
    function ac() {
      if (!enabled) return null;
      try {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === "suspended") ctx.resume();
        return ctx;
      } catch (e) { return null; }
    }
    function tone(freq, dur, type, vol, delay, slideTo) {
      const c = ac(); if (!c) return;
      const t0 = c.currentTime + (delay || 0);
      const o = c.createOscillator(); const g = c.createGain();
      o.type = type || "sine"; o.frequency.setValueAtTime(freq, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + dur + 0.02);
    }
    function noise(dur, vol, delay) {
      const c = ac(); if (!c) return;
      const t0 = c.currentTime + (delay || 0);
      const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const s = c.createBufferSource(); s.buffer = buf;
      const g = c.createGain(); g.gain.value = vol || 0.15;
      s.connect(g); g.connect(c.destination); s.start(t0);
    }
    return {
      get enabled() { return enabled; },
      toggle() { enabled = !enabled; store.set("goliath.sound", enabled ? "1" : "0"); if (enabled) this.click(); return enabled; },
      click() { tone(520, 0.07, "triangle", 0.08); },
      select() { tone(660, 0.08, "triangle", 0.09); },
      move() { tone(300, 0.09, "sine", 0.1, 0, 220); },
      clash() { noise(0.18, 0.18); tone(180, 0.2, "sawtooth", 0.1, 0, 70); },
      win() { tone(520, 0.12, "triangle", 0.1); tone(660, 0.12, "triangle", 0.1, 0.1); },
      boom() { noise(0.5, 0.28); tone(120, 0.45, "sawtooth", 0.14, 0, 40); },
      power() { [880, 1175, 1480].forEach((f, i) => tone(f, 0.14, "sine", 0.08, i * 0.07)); },
      turn() { tone(740, 0.1, "sine", 0.09); tone(988, 0.14, "sine", 0.09, 0.09); },
      victory() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, "triangle", 0.12, i * 0.14)); },
      defeat() { [392, 330, 262].forEach((f, i) => tone(f, 0.3, "triangle", 0.1, i * 0.2)); },
      chaos() { tone(200, 0.5, "square", 0.07, 0, 600); tone(600, 0.4, "square", 0.05, 0.25, 150); },
    };
  })();

  window.UI = { $, $$, el, esc, toast, store, Sound };
})();
