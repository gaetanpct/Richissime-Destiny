// Graphique de fortune (SVG, échelle logarithmique symétrique) — aucune bibliothèque
(function () {
  const RD = window.RD;
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => {
    const n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach((k) => n.setAttribute(k, attrs[k]));
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const f = (v) => Math.sign(v) * Math.log10(1 + Math.abs(v) / 1000);

  RD.wealthChart = function (series, opt) {
    opt = opt || {};
    const W = 760, H = opt.height || 340, L = 62, R = 16, T = 14, B = 34;
    const svg = sv("svg", { viewBox: "0 0 " + W + " " + H, class: "chart", role: "img", "aria-label": "Évolution de la fortune de chaque joueur au fil des années" });
    let minA = Infinity, maxA = -Infinity, minV = 0, maxV = 0;
    series.forEach((s) => s.points.forEach((p) => { minA = Math.min(minA, p.age); maxA = Math.max(maxA, p.age); minV = Math.min(minV, p.net); maxV = Math.max(maxV, p.net); }));
    if (!isFinite(minA)) { minA = 0; maxA = 1; }
    if (maxA === minA) maxA = minA + 1;
    const lo = f(Math.min(minV, 0)), hi = f(Math.max(maxV, 5000));
    const X = (a) => L + ((a - minA) / (maxA - minA)) * (W - L - R);
    const Y = (v) => T + (1 - (f(v) - lo) / (hi - lo || 1)) * (H - T - B);
    const ticks = [-1e6, -1e5, -1e4, 0, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8].filter((v) => f(v) >= lo - 0.01 && f(v) <= hi + 0.01);
    ticks.forEach((v) => {
      svg.appendChild(sv("line", { x1: L, x2: W - R, y1: Y(v), y2: Y(v), stroke: v === 0 ? "#14213d" : "#d9cfb3", "stroke-width": v === 0 ? 1.6 : 1, "stroke-dasharray": v === 0 ? "" : "3 4" }));
      svg.appendChild(sv("text", { x: L - 6, y: Y(v) + 4, "text-anchor": "end" }, RD.moneyShort(v)));
    });
    const step = Math.max(5, Math.ceil((maxA - minA) / 8 / 5) * 5);
    for (let a = Math.ceil(minA / step) * step; a <= maxA; a += step) {
      svg.appendChild(sv("line", { x1: X(a), x2: X(a), y1: T, y2: H - B, stroke: "#eee6cf", "stroke-width": 1 }));
      svg.appendChild(sv("text", { x: X(a), y: H - B + 16, "text-anchor": "middle" }, a + " ans"));
    }
    series.forEach((s) => {
      if (!s.points.length) return;
      const d = s.points.map((p, i) => (i ? "L" : "M") + X(p.age).toFixed(1) + " " + Y(p.net).toFixed(1)).join(" ");
      svg.appendChild(sv("path", { d, fill: "none", stroke: s.color, "stroke-width": 3.2, "stroke-linejoin": "round", "stroke-linecap": "round" }));
      const last = s.points[s.points.length - 1];
      svg.appendChild(sv("circle", { cx: X(last.age), cy: Y(last.net), r: 5.5, fill: s.color, stroke: "#14213d", "stroke-width": 2 }));
      if (s.dead) svg.appendChild(sv("text", { x: X(last.age) + 8, y: Y(last.net) - 8, style: "font-size:14px" }, "🪦"));
    });
    return svg;
  };

  RD.legend = function (series) {
    return RD.h("div.legend", series.map((s) => RD.h("span", RD.h("i", { style: { background: s.color } }), s.name)));
  };
})();
