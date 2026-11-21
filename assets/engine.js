/* =====================================================================
   Moteur du site de révision — thèmes, décors figés, diapositives,
   version Complète / Essentiel, mémoire (localStorage), quiz.
   Partagé par l'accueil (body[data-page="home"]) et les cours
   (body[data-page="course"][data-course="<id>"]).
   ===================================================================== */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var STORE = "revision-data-engineer-v1";
  var app = document.getElementById("app");
  var page = document.body.getAttribute("data-page");
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  /* ---------- Mémoire ---------- */
  var S = (function () { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } })();
  if (!S.courses) S.courses = {};
  function save() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) {} }
  function course(id) {
    var c = S.courses[id] || (S.courses[id] = {});
    if (!c.pos) c.pos = {}; if (!c.ch) c.ch = {}; if (!c.ver) c.ver = "c";
    return c;
  }
  window.REV = {
    state: S, save: save, course: course,
    resetAll: function () { var th = S.theme; S = { courses: {}, theme: th }; window.REV.state = S; save(); }
  };

  /* ---------- Thèmes (les 10 du modèle) ---------- */
  var themes = [
    { id: "neon", name: "Néon", sub: "noir et lime", sw: "linear-gradient(135deg,#1b3a10,#c6ff2e)" },
    { id: "sauge", name: "Sauge", sub: "doux et vert", sw: "linear-gradient(135deg,#cfd9d3,#4d6f5b)" },
    { id: "nuit", name: "Nuit", sub: "indigo et rose", sw: "linear-gradient(135deg,#171530,#ff2a63)" },
    { id: "verre", name: "Verre", sub: "verre dépoli", sw: "linear-gradient(135deg,#1b86b3,#ff7a59)" },
    { id: "papier", name: "Papier", sub: "crème, brun, bleu", sw: "linear-gradient(135deg,#f3e6d2,#2f5d8a)" },
    { id: "bulles", name: "Bulles", sub: "vert et turquoise", sw: "linear-gradient(135deg,#8fb85a,#1b8aa6)" },
    { id: "hexa", name: "Hexa", sub: "émeraude, alvéoles", sw: "linear-gradient(135deg,#2a9d72,#0b3d2e)" },
    { id: "points", name: "Points", sub: "bleu nuit, trame", sw: "linear-gradient(135deg,#04203d,#35d0d8)" },
    { id: "rubans", name: "Rubans", sub: "blanc, bleu, turquoise", sw: "linear-gradient(135deg,#ffffff 30%,#1b7fd6 60%,#12c4b2)" },
    { id: "facettes", name: "Facettes", sub: "blanc, triangles bleu-vert", sw: "linear-gradient(135deg,#2a88d8,#2fb7b0 45%,#b9de4a)" }
  ];

  /* Décors générés UNE fois (graine fixe) : le fond ne bouge plus d'une diapo à l'autre. */
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var FC_STOPS = [[42, 136, 216], [90, 176, 232], [47, 183, 176], [111, 207, 106], [196, 224, 74]];
  function fcColor(t, lift) {
    t = Math.max(0, Math.min(1, t)) * (FC_STOPS.length - 1); var i = Math.min(FC_STOPS.length - 2, Math.floor(t)), f = t - i, a = FC_STOPS[i], b = FC_STOPS[i + 1], c = [];
    for (var k = 0; k < 3; k++) c.push(Math.round((a[k] + (b[k] - a[k]) * f) * (1 - lift) + 255 * lift));
    return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
  }
  function fcBand(g, rnd, bottom, bandH, t0, t1, flip) {
    if (!g) return;
    var W = 1600, H = 900, cell = 78, nx = Math.ceil(W / cell) + 2, ny = Math.ceil(bandH / cell) + 2, pts = [], html = "", i, j;
    for (j = 0; j <= ny; j++) { pts.push([]); for (i = 0; i <= nx; i++) pts[j].push([(i - 1) * cell + (rnd() - .5) * cell * .75, (j - 1) * cell + (rnd() - .5) * cell * .75]); }
    for (j = 0; j < ny; j++) for (i = 0; i < nx; i++) {
      var p00 = pts[j][i], p10 = pts[j][i + 1], p01 = pts[j + 1][i], p11 = pts[j + 1][i + 1], tris = rnd() < .5 ? [[p00, p10, p01], [p10, p11, p01]] : [[p00, p10, p11], [p00, p11, p01]];
      tris.forEach(function (tr) {
        var cx = (tr[0][0] + tr[1][0] + tr[2][0]) / 3, cy = (tr[0][1] + tr[1][1] + tr[2][1]) / 3, d = Math.max(0, cy) / bandH, fade = Math.pow(Math.max(0, 1 - d), 1.05) * (.85 + rnd() * .4);
        if (fade < .06) return;
        var u = cx / W; if (flip) u = 1 - u;
        var col = fcColor(t0 + (t1 - t0) * u + (rnd() - .5) * .12, rnd() * .45);
        var p = tr.map(function (q) { return q[0].toFixed(1) + "," + (bottom ? H - q[1] : q[1]).toFixed(1); }).join(" ");
        html += '<polygon points="' + p + '" fill="' + col + '" fill-opacity="' + Math.min(1, fade).toFixed(2) + '"/>';
      });
    }
    g.innerHTML = html;
  }
  function rbRibbon(r, side, zone) {
    var sx = side === "L" ? 1 : -1, x0 = side === "L" ? -40 - r() * 50 : 1640 + r() * 50;
    var y0 = zone === "T" ? -60 + r() * 130 : zone === "B" ? 830 + r() * 160 : 240 + r() * 420;
    var sy = zone === "T" ? 1 : zone === "B" ? -1 : (r() < .5 ? 1 : -1);
    var ang = [.52, .79, 1.05][Math.floor(r() * 3)], c = Math.cos(ang), s = Math.sin(ang), depth = 100 + r() * 90, ex = side === "L" ? depth : 1600 - depth;
    var L1 = Math.abs(ex - x0) / c, el = [x0 + sx * c * L1, y0 + sy * s * L1], w = 66 + r() * 46, d;
    function f(v) { return v.toFixed(1); }
    if (r() < .62) {
      var ph = [.52, .79, 1.05][Math.floor(r() * 3)], c2 = Math.cos(ph), s2 = Math.sin(ph), L2 = (Math.abs(ex - x0) + 20) / c2, rad = 40 + r() * 30;
      var d1 = [sx * c, sy * s], d2 = [-sx * c2, sy * s2 * (r() < .5 ? 1 : -1)], end = [el[0] + d2[0] * L2, el[1] + d2[1] * L2];
      d = "M" + f(x0) + " " + f(y0) + " L" + f(el[0] - d1[0] * rad) + " " + f(el[1] - d1[1] * rad) + " Q" + f(el[0]) + " " + f(el[1]) + " " + f(el[0] + d2[0] * rad) + " " + f(el[1] + d2[1] * rad) + " L" + f(end[0]) + " " + f(end[1]);
    } else {
      var ext = 1 + r() * .35; d = "M" + f(x0) + " " + f(y0) + " L" + f(x0 + (el[0] - x0) * ext) + " " + f(y0 + (el[1] - y0) * ext); w *= .85;
    }
    return { d: d, w: w, g: "rg" + (1 + Math.floor(r() * 3)) };
  }
  var decorDone = {};
  function decor(id) {
    if (decorDone[id]) return; decorDone[id] = true;
    if (id === "facettes") {
      var r = mulberry(4242);
      fcBand($("#fc-top"), r, false, 150, .0, .62, false);
      fcBand($("#fc-bot"), r, true, 170, .38, 1, true);
    } else if (id === "rubans") {
      var rr = mulberry(1337), slots = [["L", "T"], ["R", "B"], ["L", "B"], ["R", "T"]], a = "", b = "", sa = "", sb = "";
      for (var i = 0; i < 4; i++) {
        var rb = rbRibbon(rr, slots[i][0], slots[i][1]);
        var main = '<path d="' + rb.d + '" stroke="url(#' + rb.g + ')" stroke-width="' + rb.w.toFixed(0) + '"/>', sh = '<path d="' + rb.d + '" stroke-width="' + rb.w.toFixed(0) + '"/>';
        if (i % 2) { b += main; sb += sh; } else { a += main; sa += sh; }
      }
      function fill(g, shadow, m) { if (g) g.innerHTML = '<g filter="url(#rsh)" stroke="#0b2f4d" stroke-opacity=".13" transform="translate(18 22)">' + shadow + "</g>" + m; }
      fill($("#rb-a"), sa, a); fill($("#rb-b"), sb, b);
    }
  }

  var menu = $("#menu");
  function paintMenu() { var c = app.getAttribute("data-theme"); $$("button", menu).forEach(function (b) { b.classList.toggle("cur", b.dataset.id === c); }); }
  function setTheme(id) {
    if (!themes.some(function (t) { return t.id === id; })) id = "papier";
    decor(id); app.setAttribute("data-theme", id);
    app.style.setProperty("--panel", id === "sauge" ? "12vw" : "0vw");
    paintMenu(); S.theme = id; save();
  }
  function cycleTheme() { var i = themes.findIndex(function (t) { return t.id === app.getAttribute("data-theme"); }); setTheme(themes[(i + 1) % themes.length].id); }
  function toggleMenu(force) { if (menu) menu.classList.toggle("on", typeof force === "boolean" ? force : !menu.classList.contains("on")); }
  if (menu) {
    themes.forEach(function (t) {
      var b = document.createElement("button");
      b.setAttribute("role", "menuitem"); b.dataset.id = t.id; b.type = "button";
      b.innerHTML = '<span class="sw" style="background:' + t.sw + '"></span><span>' + t.name + "<small>" + t.sub + "</small></span>";
      b.addEventListener("click", function () { setTheme(t.id); toggleMenu(false); });
      menu.appendChild(b);
    });
    $("#tbtn").addEventListener("click", function (e) { e.stopPropagation(); toggleMenu(); });
    document.addEventListener("click", function (e) { if (!e.target.closest("#themebtn")) toggleMenu(false); });
  }
  setTheme(S.theme || "papier");

  /* ---------- Accordéon : une seule section ouverte à la fois dans un même groupe ---------- */
  function accToggle(acc) {
    var opening = !acc.classList.contains("open");
    if (opening && acc.parentNode) Array.prototype.forEach.call(acc.parentNode.children, function (s) { if (s !== acc) s.classList.remove("open"); });
    acc.classList.toggle("open", opening);
    if (opening) setTimeout(function () { try { acc.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) {} }, 520);
  }
  /* ---------- Accordéons génériques (corrigés, questions du jury) ---------- */
  function wireAcc(root) {
    $$(".acc:not(.qz) > .ah", root).forEach(function (h) {
      if (h.dataset.w) return; h.dataset.w = 1;
      if (!h.querySelector(".chev")) h.insertAdjacentHTML("beforeend", '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>');
      h.addEventListener("click", function () { accToggle(h.parentNode); });
    });
    $$(".acc > .ab", root).forEach(function (ab) {
      if (ab.querySelector(":scope > .abi")) return;
      var abi = document.createElement("div"), abp = document.createElement("div"); abi.className = "abi"; abp.className = "abp";
      while (ab.firstChild) abp.appendChild(ab.firstChild);
      abi.appendChild(abp); ab.appendChild(abi);
    });
  }
  /* Boutons « Copier » des blocs de code */
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".cpy"); if (!b) return;
    var pre = b.closest(".code").querySelector("pre");
    var txt = pre ? pre.innerText : "";
    function ok() { var t = b.textContent; b.textContent = "Copié ✓"; setTimeout(function () { b.textContent = t; }, 1200); }
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, function () {}); else ok();
  });

  /* =====================================================================
     AMPOULE — les concepts du glossaire sont soulignés dans le texte ;
     en mode ampoule (bouton 💡 ou touche H), leur survol ouvre une infobulle.
     Format d'une entrée : clé → [titre, définition, analogie, [alias…]] ;
     un alias préfixé par « = » respecte la casse.
     ===================================================================== */
  var GL = window.GLOSSARY || {}, cxRe = null, cxMap = {};
  (function () {
    var alts = [];
    Object.keys(GL).forEach(function (k) {
      (GL[k][3] || []).forEach(function (a) {
        var cs = a.charAt(0) === "=", raw = cs ? a.slice(1) : a;
        cxMap[raw.toLowerCase()] = { k: k, cs: cs, raw: raw };
        alts.push(raw);
      });
    });
    if (!alts.length) return;
    alts.sort(function (a, b) { return b.length - a.length; });
    var body = alts.map(function (a) { return a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|");
    try { cxRe = new RegExp("(?<![\\p{L}\\p{N}_])(" + body + ")(?![\\p{L}\\p{N}_])", "giu"); } catch (e) { cxRe = null; }
  })();
  var CX_SKIP = "pre, .code, svg, script, style, .opts, .ah, h1, h2, .kicker, .pq, .lab, .cx, a, button, .gl b, .qtag, .scorebar, .qtools, .codeline, .chips, #ctip";
  var CX_BLOCK = "p, li, td, th, dd, dt, .why, .analogy, .step, .punch, .note, .card, .trap-list > div";
  function markCx(root) {
    if (!cxRe || !root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || n.nodeValue.trim().length < 2) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement; if (!p || p.closest(CX_SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      var blk = n.parentElement.closest(CX_BLOCK) || root;
      var done = blk.__cx || (blk.__cx = {});
      var txt = n.nodeValue, last = 0, frag = null, m;
      cxRe.lastIndex = 0;
      while ((m = cxRe.exec(txt))) {
        var e = cxMap[m[1].toLowerCase()];
        if (!e || (e.cs && m[1] !== e.raw) || done[e.k]) continue;
        done[e.k] = 1;
        frag = frag || document.createDocumentFragment();
        frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
        var s = document.createElement("span"); s.className = "cx"; s.setAttribute("data-k", e.k); s.textContent = m[1];
        frag.appendChild(s); last = m.index + m[1].length;
      }
      if (frag) { frag.appendChild(document.createTextNode(txt.slice(last))); n.parentNode.replaceChild(frag, n); }
    });
    if (app.classList.contains("help")) $$(".cx", root).forEach(function (c) { c.setAttribute("tabindex", "0"); });
  }
  var ctip = $("#ctip");
  function showTip(t) {
    var g = GL[t.getAttribute("data-k")]; if (!g || !ctip) return;
    ctip.innerHTML = "<b></b><p></p><em></em>";
    ctip.querySelector("b").textContent = g[0]; ctip.querySelector("p").textContent = g[1];
    var em = ctip.querySelector("em"); em.innerHTML = g[2] ? ICO("bulb") + " " + esc(g[2]) : ""; em.style.display = g[2] ? "" : "none";
    ctip.classList.add("on");
    var r = t.getBoundingClientRect(), ar = app.getBoundingClientRect(), w = ctip.offsetWidth, h = ctip.offsetHeight;
    var x = Math.max(10, Math.min(ar.width - w - 10, r.left - ar.left + r.width / 2 - w / 2));
    var y = r.top - ar.top - h - 10; if (y < 10) y = r.bottom - ar.top + 10;
    ctip.style.left = x + "px"; ctip.style.top = y + "px";
  }
  function hideTip() { if (ctip) ctip.classList.remove("on"); }
  window.REV.markCx = markCx;

  /* =====================================================================
     QUIZ — rendu à partir des données, mélange à chaque tentative.
     Une question : { id, ch, type: "single"|"multi"|"tf", q, opts: [[texte, 1|0], …], why }
     Les explications ne citent JAMAIS de lettre (l'ordre change à chaque tentative).
     ===================================================================== */
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var L = "ABCDEFGH";
  function Quiz(box, qs, opts) {
    this.box = box; this.src = qs; this.o = opts || {}; this.render(true);
  }
  Quiz.prototype.render = function (shuffleQuestions) {
    var self = this, box = this.box, list = shuffleQuestions && this.o.shuffleQ ? shuffle(this.src) : this.src.slice();
    this.qs = list; this.res = {};
    var tot = list.length;
    var html = '<div class="scorebar"><span class="scorepill"><span class="js-got">0</span> / ' + tot + '</span><div class="bar"><i class="js-bar" style="--w:0%"></i></div><span class="mini"><span class="js-ans">0</span> / ' + tot + ' répondues' + (this.o.best != null ? ' · <span class="js-best"></span>' : "") + "</span></div>";
    if (this.o.tools) html += '<div class="btnrow qtools"><button class="btn js-errs" type="button">' + ICO("search") + ' Revoir mes erreurs</button><button class="btn js-all" type="button">Tout afficher</button><button class="btn pri js-restart" type="button">↺ Recommencer (nouveau mélange)</button></div>';
    html += '<div class="accg">';
    list.forEach(function (q, k) {
      var tag = q.type === "multi" ? '<span class="qtag">plusieurs réponses</span>' : q.type === "tf" ? '<span class="qtag">vrai / faux</span>' : "";
      html += '<div class="acc qz" data-k="' + k + '"><button class="ah" type="button"><span class="qn">' + (k + 1) + '</span><span class="qt">' + q.q + tag + '</span><span class="qs"></span></button><div class="ab"><div class="abi"><div class="abp"></div></div></div></div>';
    });
    html += "</div>";
    if (this.o.end) html += '<div class="qend card" hidden></div>';
    box.innerHTML = html;
    $$(".qz", box).forEach(function (el) { self.mount(el, +el.dataset.k); });
    if (this.o.tools) {
      $(".js-restart", box).addEventListener("click", function () { self.render(true); });
      $(".js-errs", box).addEventListener("click", function () { $$(".qz", box).forEach(function (q) { var ko = q.classList.contains("ko"); q.classList.toggle("hide", !ko); q.classList.remove("open"); }); });
      $(".js-all", box).addEventListener("click", function () { $$(".qz", box).forEach(function (q) { q.classList.remove("hide"); }); });
    }
    this.score();
  };
  Quiz.prototype.mount = function (el, k) {
    var self = this, q = this.qs[k], abp = $(".abp", el);
    var opts = q.type === "tf" ? q.opts.slice() : shuffle(q.opts);
    var h = '<ul class="opts">';
    opts.forEach(function (o, i) { h += '<li><button class="opt" type="button" data-ok="' + (o[1] ? 1 : 0) + '"' + (q.type === "multi" ? ' aria-pressed="false"' : "") + "><b>" + L[i] + "</b><span>" + o[0] + "</span></button></li>"; });
    h += "</ul>";
    if (q.type === "multi") h += '<div class="btnrow"><button class="btn pri js-valid" type="button" disabled>Valider ma sélection</button><span class="mini">Coche toutes les bonnes réponses, puis valide.</span></div>';
    h += '<div class="why"><span class="vd2"></span>' + q.why + (q.ch && this.o.chLink ? ' <span class="mini">À revoir : <a data-goch="' + q.ch + '">→ chapitre ' + q.ch + "</a></span>" : "") + '</div><button class="btn qretry" type="button" hidden>↺ Réessayer cette question</button>';
    abp.innerHTML = h;
    markCx($(".why", el));
    el.classList.remove("done", "ok", "ko");
    $(".qs", el).textContent = "";
    var head = $(".ah", el);
    if (!head.dataset.w) { head.dataset.w = 1; head.addEventListener("click", function () { accToggle(el); }); }
    var btns = $$(".opt", el), valid = $(".js-valid", el);
    function finish(good) {
      el.classList.add("done", good ? "ok" : "ko");
      $(".qs", el).textContent = good ? "✓" : "✗";
      $(".vd2", el).textContent = good ? "✓ Bonne réponse" : "✗ Pas tout à fait — la bonne réponse est surlignée en vert";
      btns.forEach(function (b) { b.disabled = true; });
      if (valid) valid.disabled = true;
      $(".qretry", el).hidden = false;
      self.res[k] = good; self.score();
    }
    if (q.type === "multi") {
      btns.forEach(function (b) { b.addEventListener("click", function () { var on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); valid.disabled = !btns.some(function (x) { return x.getAttribute("aria-pressed") === "true"; }); }); });
      valid.addEventListener("click", function () {
        var good = true;
        btns.forEach(function (b) {
          var sel = b.getAttribute("aria-pressed") === "true", ok = b.dataset.ok === "1";
          if (ok && sel) b.classList.add("right"); else if (!ok && sel) { b.classList.add("wrong"); good = false; } else if (ok && !sel) { b.classList.add("miss"); good = false; } else b.classList.add("dim");
        });
        btns.forEach(function (b) { b.removeAttribute("aria-pressed"); }); /* la correction prime sur l'état « sélectionné » */
        finish(good);
      });
    } else {
      btns.forEach(function (b) {
        b.addEventListener("click", function () {
          var good = b.dataset.ok === "1";
          btns.forEach(function (x) { if (x.dataset.ok === "1") x.classList.add("right"); else if (x === b) x.classList.add("wrong"); else x.classList.add("dim"); });
          finish(good);
        });
      });
    }
    $(".qretry", el).addEventListener("click", function () { delete self.res[k]; self.mount(el, k); el.classList.add("open"); self.score(); });
  };
  Quiz.prototype.score = function () {
    var box = this.box, tot = this.qs.length, keys = Object.keys(this.res), got = keys.filter(function (k) { return this.res[k]; }, this).length;
    $(".js-got", box).textContent = got; $(".js-ans", box).textContent = keys.length;
    $(".js-bar", box).style.setProperty("--w", (keys.length ? (got / tot) * 100 : 0) + "%");
    if (this.o.onScore) this.o.onScore(got, keys.length, tot, this);
  };

  /* =====================================================================
     PAGE COURS
     ===================================================================== */
  if (page === "course") (function () {
    var cid = document.body.getAttribute("data-course"), C = course(cid), QD = window.QUIZ_DATA || {};
    var all = $$(".slide"), deck = $("#deck");
    all.forEach(function (s) {
      var w = document.createElement("div"); w.className = "sin";
      while (s.firstChild) w.appendChild(s.firstChild);
      s.appendChild(w); s.setAttribute("tabindex", "-1");
      $$(":scope > *", w).forEach(function (c, k) { c.classList.add("rv"); c.style.setProperty("--i", Math.min(k, 12)); });
    });
    wireAcc(document);
    all.forEach(function (s) { markCx($(".sin", s)); });

    /* --- ampoule : bouton, touche H, infobulles --- */
    var helpBtn = $("#helpbtn"), bulbHint = $("#bulbhint");
    function paintBulb() {
      if (!bulbHint) return;
      var sl = cur >= 0 ? slides[cur] : null, n = sl ? $$(".cx", sl).length : 0, on = n > 0 && !app.classList.contains("help");
      bulbHint.classList.toggle("on", on);
      if (on) bulbHint.innerHTML = ICO("bulb") + " " + n + " concept" + (n > 1 ? "s" : "") + " expliqué" + (n > 1 ? "s" : "") + " ici · cliquer";
    }
    function setHelp(on) {
      app.classList.toggle("help", on);
      if (helpBtn) { helpBtn.classList.toggle("on", on); helpBtn.setAttribute("aria-pressed", on); }
      $$(".cx").forEach(function (c) { if (on) c.setAttribute("tabindex", "0"); else c.removeAttribute("tabindex"); });
      if (!on) hideTip();
      S.help = on; save(); paintBulb();
    }
    if (helpBtn) helpBtn.addEventListener("click", function (e) { e.stopPropagation(); setHelp(!app.classList.contains("help")); helpBtn.blur(); });
    if (bulbHint) bulbHint.addEventListener("click", function (e) { e.stopPropagation(); setHelp(true); });
    deck.addEventListener("pointerover", function (e) { if (!app.classList.contains("help")) return; var c = e.target.closest(".cx"); if (c) showTip(c); });
    deck.addEventListener("pointerout", function (e) { if (e.target.closest(".cx")) hideTip(); });
    deck.addEventListener("focusin", function (e) { var c = e.target.closest && e.target.closest(".cx"); if (c && app.classList.contains("help")) showTip(c); });
    deck.addEventListener("focusout", hideTip);
    deck.addEventListener("click", function (e) {
      if (!app.classList.contains("help")) return;
      var c = e.target.closest(".cx"); if (c) { e.stopPropagation(); showTip(c); } else hideTip();
    }, true);
    deck.addEventListener("scroll", hideTip, true);

    /* chapitres (dans l'ordre d'apparition) */
    var chapters = [], chMap = {};
    all.forEach(function (s) {
      var id = s.dataset.ch || "00";
      if (!chMap[id]) { chMap[id] = { id: id, title: s.dataset.title || s.dataset.sec || id, sec: s.dataset.sec || id }; chapters.push(chMap[id]); }
      else if (s.dataset.title) chMap[id].title = s.dataset.title;
    });
    var countable = chapters.filter(function (c) { return /^\d+$/.test(c.id) && c.id !== "00"; });
    C.total = countable.length; save();

    var ver = C.ver === "e" ? "e" : "c", slides = [], cur = -1;
    function inVer(s, v) { var d = s.dataset.v || "ce"; return d.indexOf(v) >= 0; }

    /* --- barre du haut --- */
    var vbtns = $$("#vseg button"), mast = $("#mast");
    function paintVer() { vbtns.forEach(function (b) { b.classList.toggle("on", b.dataset.v === ver); b.setAttribute("aria-pressed", b.dataset.v === ver); }); app.setAttribute("data-ver", ver); }
    function chOf(i) { return slides[i] ? (slides[i].dataset.ch || "00") : "00"; }
    function paintMast() {
      var ch = chOf(cur), st = C.ch[ch] || {}, ok = !!st.ok, can = /^\d+$/.test(ch) && ch !== "00";
      mast.hidden = !can; mast.classList.toggle("on", ok); mast.setAttribute("aria-pressed", ok);
      mast.innerHTML = ok ? "✓ Chapitre maîtrisé" : "☐ Marquer maîtrisé";
      var n = countable.filter(function (c) { return (C.ch[c.id] || {}).ok; }).length;
      $("#prog").innerHTML = '<i style="--w:' + (countable.length ? n / countable.length * 100 : 0) + '%"></i>';
      $("#prog").title = n + " / " + countable.length + " chapitres maîtrisés";
    }
    mast.addEventListener("click", function () { var ch = chOf(cur), st = C.ch[ch] || (C.ch[ch] = {}); st.ok = !st.ok; st.seen = true; save(); paintMast(); paintNav(); });

    /* --- frise + sommaire --- */
    var tl = $("#tl"), tocg = $("#toc .tg"), secs = [];
    function buildNav() {
      secs = []; tl.innerHTML = ""; tocg.innerHTML = "";
      slides.forEach(function (s, i) { var ch = s.dataset.ch || "00"; if (!secs.length || secs[secs.length - 1].ch !== ch) secs.push({ ch: ch, first: i }); });
      secs.forEach(function (sec) {
        var c = chMap[sec.ch];
        var b = document.createElement("button"); b.type = "button";
        b.innerHTML = "<span>" + esc(c.sec) + '</span><i class="d"></i>';
        b.addEventListener("click", function () { go(sec.first); });
        tl.appendChild(b); sec.btn = b;
        var t = document.createElement("button"); t.type = "button"; t.className = "ti";
        t.innerHTML = '<span>' + esc(/^\d+$/.test(sec.ch) ? sec.ch : "·") + "</span><b>" + esc(c.title) + '</b><small class="js-st"></small>';
        t.addEventListener("click", function () { go(sec.first); toggleToc(false); });
        tocg.appendChild(t); sec.tbtn = t;
      });
    }
    function paintNav() {
      var si = -1; secs.forEach(function (s, k) { if (s.first <= cur) si = k; });
      secs.forEach(function (s, k) {
        var st = C.ch[s.ch] || {};
        s.btn.classList.toggle("on", k === si); s.btn.classList.toggle("done", k < si || !!st.ok); s.btn.classList.toggle("ok", !!st.ok);
        s.tbtn.classList.toggle("cur", k === si);
        $(".js-st", s.tbtn).textContent = st.ok ? "✓ maîtrisé" : st.seen ? "en cours" : "";
      });
    }
    var toc = $("#toc");
    function toggleToc(force) { toc.classList.toggle("on", typeof force === "boolean" ? force : !toc.classList.contains("on")); }
    $("#tocbtn").addEventListener("click", function (e) { e.stopPropagation(); toggleToc(); });
    $("#tocx").addEventListener("click", function () { toggleToc(false); });

    /* --- navigation --- */
    var restoring = false;
    function go(n, top) {
      n = Math.max(0, Math.min(slides.length - 1, n));
      if (n !== cur) {
        all.forEach(function (s) { s.classList.remove("active", "past"); s.setAttribute("aria-hidden", "true"); });
        slides.forEach(function (s, i) { s.classList.toggle("past", i < n); });
        var s = slides[n]; s.classList.add("active"); s.setAttribute("aria-hidden", "false");
        cur = n;
      }
      var sl = slides[cur];
      sl.scrollTop = top || 0;
      if (top) { restoring = true; setTimeout(function () { sl.scrollTop = top; restoring = false; }, 450); }
      try { sl.focus({ preventScroll: true }); } catch (e) {}
      $("#count").textContent = (cur + 1) + " / " + slides.length;
      var ch = chOf(cur); if (/^\d+$/.test(ch)) { var st = C.ch[ch] || (C.ch[ch] = {}); st.seen = true; }
      C.pos[ver] = { i: cur, top: top || 0 }; C.ver = ver;
      S.last = { course: cid, ver: ver, i: cur, ch: ch, title: document.body.getAttribute("data-title"), chTitle: (chMap[ch] || {}).title || "" };
      save();
      try { history.replaceState(null, "", "#" + ver + (cur + 1)); } catch (e) {}
      paintNav(); paintMast(); hideTip(); paintBulb();
    }
    var tScroll = null;
    all.forEach(function (s) {
      s.addEventListener("scroll", function () {
        if (restoring || !s.classList.contains("active")) return;
        clearTimeout(tScroll); tScroll = setTimeout(function () { C.pos[ver] = { i: cur, top: s.scrollTop }; save(); }, 250);
      }, { passive: true });
    });
    function setVer(v, keepChapter) {
      var ch = cur >= 0 ? chOf(cur) : null;
      ver = v; C.ver = v;
      slides = all.filter(function (s) { return inVer(s, v); });
      all.forEach(function (s) { s.classList.toggle("off", !inVer(s, v)); });
      buildNav(); paintVer(); cur = -1;
      if (keepChapter && ch) {
        var idx = slides.findIndex(function (s) { return (s.dataset.ch || "00") === ch; });
        go(idx < 0 ? 0 : idx);
      }
    }
    vbtns.forEach(function (b) { b.addEventListener("click", function () { if (b.dataset.v !== ver) setVer(b.dataset.v, true); }); });
    function next() { go(cur + 1); } function prev() { go(cur - 1); }
    $("#next").addEventListener("click", next); $("#prev").addEventListener("click", prev);
    document.addEventListener("keydown", function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var k = e.key, t = e.target;
      if (t.matches && t.matches("input, textarea, select")) return;
      if (k === "Escape") { toggleToc(false); toggleMenu(false); return; }
      if (toc.classList.contains("on")) return;
      var onBtn = t.closest && t.closest("button, a, summary");
      if (k === "ArrowRight") { e.preventDefault(); next(); }
      else if (k === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (k === "Home") go(0); else if (k === "End") go(slides.length - 1);
      else if (k === "t" || k === "T") cycleTheme();
      else if (k === "s" || k === "S") toggleToc();
      else if (k === "e" || k === "E") setVer(ver === "c" ? "e" : "c", true);
      else if (k === "m" || k === "M") mast.click();
      else if (k === "h" || k === "H") setHelp(!app.classList.contains("help"));
      else if ((k === " " || k === "Enter") && !onBtn) { e.preventDefault(); next(); }
    });
    var sx = null;
    deck.addEventListener("pointerdown", function (e) { sx = e.pointerType === "touch" && !e.target.closest("pre, svg, .opts") ? e.clientX : null; });
    deck.addEventListener("pointerup", function (e) { if (sx === null) return; var d = e.clientX - sx; sx = null; if (Math.abs(d) > 70) (d < 0 ? next : prev)(); });
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-goch]"); if (!a) return; e.preventDefault();
      var idx = slides.findIndex(function (s) { return (s.dataset.ch || "00") === a.dataset.goch; }); if (idx >= 0) go(idx);
    });
    var hint = $("#hint"); if (hint) setTimeout(function () { hint.classList.add("off"); }, 9000);

    /* --- quiz --- */
    $$("[data-quiz]").forEach(function (box) {
      var key = box.dataset.quiz, isFinal = key === "final", qs = isFinal ? QD.final : (QD.chapters || {})[key];
      if (!qs || !qs.length) { box.innerHTML = '<p class="mini">Quiz à venir.</p>'; return; }
      new Quiz(box, qs, {
        shuffleQ: isFinal, tools: isFinal, chLink: isFinal, best: isFinal ? true : null,
        onScore: function (got, ans, tot) {
          if (!isFinal) return;
          var q = C.quiz || {};
          var b = $(".js-best", box); if (b) b.textContent = "meilleur score : " + (q.best != null ? q.best + " / " + tot : "—");
          if (ans === tot) {
            if (q.best == null || got > q.best) { C.quiz = { best: got, total: tot, at: Date.now() }; save(); if (b) b.textContent = "meilleur score : " + got + " / " + tot; }
            var end = $(".qend", box) || box.appendChild(Object.assign(document.createElement("div"), { className: "qend card" }));
            var pct = Math.round(got / tot * 100);
            end.hidden = false;
            end.innerHTML = "<h3>" + (pct >= 80 ? ICO("target") + " Prêt pour le jury" : pct >= 60 ? ICO("thumb-up") + " Bonne base — consolide tes erreurs" : ICO("books") + " À retravailler") + "</h3><p>" + got + " / " + tot + " (" + pct + " %). " +
              (pct >= 80 ? "Refais le quiz dans quelques jours pour ancrer." : "Clique sur « Revoir mes erreurs », relis les chapitres liés, puis recommence.") + "</p>";
          }
        }
      });
    });

    window.addEventListener("hashchange", function () {
      var h = /^#([ce])(\d+)$/.exec(location.hash || ""); if (!h) return;
      if (h[1] !== ver) setVer(h[1]);
      if (+h[2] - 1 !== cur) go(+h[2] - 1);
    });

    /* --- démarrage : ancre > position mémorisée > début --- */
    if (S.help) setHelp(true);
    var m = /^#([ce])(\d+)$/.exec(location.hash || "");
    if (m) { setVer(m[1]); go(+m[2] - 1); }
    else { setVer(ver); var p = C.pos[ver]; go(p ? p.i : 0, p ? p.top : 0); }
  })();

  /* =====================================================================
     PAGE D'ACCUEIL
     ===================================================================== */
  if (page === "home") (function () {
    var R = window.RNCP, CO = window.COURSES || [];
    var root = $("#home");
    function pct(c) { var st = S.courses[c.id]; if (!st || !st.total) return 0; var n = Object.keys(st.ch || {}).filter(function (k) { return st.ch[k].ok; }).length; return Math.round(n / st.total * 100); }
    function card(c) {
      var st = S.courses[c.id] || {}, p = pct(c), q = st.quiz;
      var meta = c.ready ? (p + " % maîtrisé" + (q ? " · quiz " + q.best + "/" + q.total : "")) : "bientôt";
      return '<a class="ccard' + (c.ready ? "" : " soon") + '"' + (c.ready ? ' href="' + c.file + '"' : ' aria-disabled="true"') + '>' +
        '<span class="cico">' + (c.logo ? '<img src="' + c.logo + '" alt="Logo ' + esc(c.title) + '">' : HEX(c.icon)) + "</span><span class=\"ctit\">" + esc(c.title) + '</span><span class="cdesc">' + esc(c.desc) + "</span>" +
        
        '<span class="cprog"><i style="--w:' + p + '%"></i></span><span class="cmeta">' + meta + "</span></a>";
    }
    var h = "";
    var L0 = S.last;
    if (L0 && L0.course) {
      var lc = CO.filter(function (c) { return c.id === L0.course; })[0];
      if (lc && lc.ready) h += '<a class="resume card hl" href="' + lc.file + "#" + L0.ver + (L0.i + 1) + '"><span class="kicker">Reprendre la lecture</span><b>' + esc(lc.title) + "</b><span>" + (L0.ch && L0.ch !== "00" ? "Chapitre " + esc(L0.ch) + " · " : "") + esc(L0.chTitle || "") + " — version " + (L0.ver === "e" ? "Essentiel" : "Complète") + "</span><span class=\"go\">→</span></a>";
    }
    h += '<a class="card pipe" href="pipeline.html"><span class="kicker">Vue d\'ensemble</span><b>' + ICO("route") + ' Le pipeline data de bout en bout</b><span>Ingestion → stockage → traitement → orchestration → exposition : où se place chaque cours.</span></a>';
    var jury = CO.filter(function (c) { return c.bloc === "JURY"; });
    if (jury.length) h += '<section class="bloc spe"><div class="bh"><span class="kicker">Examen · Titre 7 EISI</span><h2>Préparer le jury</h2></div><div class="cgrid">' + jury.map(card).join("") + "</div></section>";
    R.blocs.slice().sort(function (a, b) { return (b.specialite ? 1 : 0) - (a.specialite ? 1 : 0); }).forEach(function (b) {
      var list = CO.filter(function (c) { return c.bloc === b.id; });
      if (!list.length) return;
      var comps = [];
      b.exemples.forEach(function (ex) { Object.keys(ex.comp).forEach(function (k) { comps.push('<i title="' + esc(ex.comp[k]) + '">' + k + "</i>"); }); });
      h += '<section class="bloc' + (b.specialite ? " spe" : "") + '"><div class="bh"><span class="kicker">' + (b.specialite ? "Spécialité · Bloc 4B" : "Tronc commun · Activité " + b.id.slice(1)) + "</span><h2>" + esc(b.titre) + '</h2></div><div class="cgrid">' + list.map(card).join("") + "</div></section>";
    });
    h += '<div class="homefoot"><button class="btn" id="resetall" type="button">⟲ Réinitialiser toute ma progression</button><span class="mini">La progression est enregistrée dans ce navigateur.</span></div>';
    root.innerHTML = h;
    $("#resetall").addEventListener("click", function () {
      if (confirm("Effacer toute la progression (chapitres maîtrisés, positions de lecture, scores des quiz) ? Le thème est conservé.")) { window.REV.resetAll(); location.reload(); }
    });
  })();

  if (page === "pipeline") wireAcc(document);
})();
