// Petits outils partagés — DOM, formats, sons, mémoire locale
(function () {
  const RD = (window.RD = window.RD || {});

  // ---------- DOM ----------
  RD.$ = (sel, root) => (root || document).querySelector(sel);
  RD.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  // h("div.classe#id", {attrs, on:{click}}, enfants…)
  RD.h = function (tag, attrs, ...kids) {
    const m = /^([a-z0-9]+)((?:[.#][\w-]+)*)$/i.exec(tag) || [null, "div", ""];
    const node = document.createElement(m[1]);
    (m[2].match(/[.#][\w-]+/g) || []).forEach((t) => { if (t[0] === ".") node.classList.add(t.slice(1)); else node.id = t.slice(1); });
    if (attrs && typeof attrs === "object" && !(attrs instanceof Node) && !Array.isArray(attrs)) {
      Object.keys(attrs).forEach((k) => {
        const v = attrs[k];
        if (v === undefined || v === null || v === false) return;
        if (k === "on") Object.keys(v).forEach((ev) => node.addEventListener(ev, v[ev]));
        else if (k === "style" && typeof v === "object") Object.assign(node.style, v);
        else if (k === "class") String(v).split(" ").filter(Boolean).forEach((c) => node.classList.add(c));
        else if (k === "html") node.innerHTML = v;
        else if (k === "value") node.value = v;
        else if (k === "checked" || k === "disabled" || k === "selected") { if (v) node[k] = true; }
        else node.setAttribute(k, v === true ? "" : v);
      });
    } else if (attrs !== undefined && attrs !== null) kids.unshift(attrs);
    const add = (c) => {
      if (c === undefined || c === null || c === false) return;
      if (Array.isArray(c)) return c.forEach(add);
      node.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    };
    kids.forEach(add);
    return node;
  };
  RD.clear = (n) => { while (n.firstChild) n.removeChild(n.firstChild); return n; };
  RD.esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- formats ----------
  RD.money = (n) => {
    if (n === null || n === undefined) return "?";
    const s = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (n < 0 ? "−" : "") + s + " €";
  };
  RD.moneyShort = (n) => {
    const a = Math.abs(n);
    const sign = n < 0 ? "−" : "";
    if (a >= 1e6) return sign + (a / 1e6).toFixed(a >= 1e7 ? 0 : 1).replace(".", ",") + " M€";
    if (a >= 1e4) return sign + Math.round(a / 1e3) + " k€";
    if (a >= 1e3) return sign + (a / 1e3).toFixed(1).replace(".", ",") + " k€";
    return sign + Math.round(a) + " €";
  };
  RD.signed = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n);

  // ---------- mémoire locale ----------
  RD.store = {
    get(k, d) { try { const v = localStorage.getItem("rd." + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("rd." + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
    del(k) { try { localStorage.removeItem("rd." + k); } catch (e) { /* ignore */ } },
  };

  // ---------- sons ----------
  let actx = null;
  RD.sound = { on: RD.store.get("sound", true) };
  function ctx() {
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = false; } }
    if (actx && actx.state === "suspended") actx.resume();
    return actx;
  }
  function tone(freq, t0, dur, type, vol) {
    const c = ctx(); if (!c) return;
    const o = c.createOscillator(); const g = c.createGain();
    o.type = type || "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, c.currentTime + t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.08, c.currentTime + t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t0 + dur);
    o.connect(g); g.connect(c.destination);
    o.start(c.currentTime + t0); o.stop(c.currentTime + t0 + dur + 0.05);
  }
  const SOUNDS = {
    click: () => tone(520, 0, 0.07, "triangle", 0.05),
    select: () => { tone(660, 0, 0.08, "triangle", 0.06); tone(880, 0.06, 0.1, "triangle", 0.05); },
    coin: () => { tone(988, 0, 0.09, "square", 0.04); tone(1319, 0.08, 0.16, "square", 0.04); },
    good: () => { tone(523, 0, 0.12, "triangle", 0.07); tone(659, 0.1, 0.12, "triangle", 0.07); tone(784, 0.2, 0.2, "triangle", 0.07); },
    bad: () => { tone(300, 0, 0.18, "sawtooth", 0.05); tone(220, 0.15, 0.28, "sawtooth", 0.05); },
    year: () => { tone(392, 0, 0.1, "sine", 0.06); tone(494, 0.1, 0.1, "sine", 0.06); tone(587, 0.2, 0.18, "sine", 0.06); },
    death: () => { tone(196, 0, 0.5, "sine", 0.09); tone(147, 0.4, 0.8, "sine", 0.09); },
    fanfare: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.14, 0.3, "triangle", 0.08)); },
    tick: () => tone(1200, 0, 0.03, "square", 0.02),
  };
  RD.play = (name) => { if (!RD.sound.on) return; try { (SOUNDS[name] || SOUNDS.click)(); } catch (e) { /* ignore */ } };
  RD.setSound = (on) => { RD.sound.on = on; RD.store.set("sound", on); };

  // ---------- toasts ----------
  RD.toast = (text, type) => {
    const box = RD.$("#toasts"); if (!box) return;
    const t = RD.h("div.toast." + (type || "info"), text);
    box.appendChild(t);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 400); }, 3600);
  };

  // ---------- avatar ----------
  RD.avatar = (a, size, dead) => {
    const s = size || 44;
    const n = RD.h("div.avatar" + (dead ? ".dead" : ""), { style: { width: s + "px", height: s + "px", fontSize: Math.round(s * 0.52) + "px", background: (a && a.color) || "#c9a13b" } }, dead ? "🪦" : (a && a.acc) || "🙂");
    return n;
  };

  // ---------- compte à rebours ----------
  RD.serverOffset = 0;
  RD.remaining = (deadline) => (deadline ? Math.max(0, deadline - (Date.now() + RD.serverOffset)) : 0);
})();
