/* Portfolio interactions: theme toggle, mobile nav, active section, reveal-on-scroll. */
(function () {
  'use strict';

  var root = document.documentElement;
  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var themeToggle = document.querySelector('.theme-toggle');

  /* ---- Theme toggle (persisted) ---- */
  function currentTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit) return explicit;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme-terminal', next); } catch (e) { /* storage unavailable */ }
    });
  }

  /* ---- Mobile navigation ---- */
  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navLinks.forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---- Header shadow on scroll ---- */
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Active nav link ---- */
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (s) { activeObserver.observe(s); });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Footer year ---- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

/* Engineering motion: scroll progress, floating glyphs, counters, timeline draw, card spotlight. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ---- Scroll progress ---- */
  function progress() {
    var max = root.scrollHeight - root.clientHeight;
    root.style.setProperty('--scroll', (max > 0 ? root.scrollTop / max : 0).toFixed(4));
  }
  window.addEventListener('scroll', progress, { passive: true });
  window.addEventListener('resize', progress);
  progress();

  /* ---- Floating code glyphs in the hero ---- */
  var layer = document.querySelector('.hero-glyphs');
  if (layer && !reduce) {
    var glyphs = ['{ }', '</>', '=>', 'SELECT *', 'async', 'await', 'INNER JOIN', '[HttpGet]', 'var', 'INSERT INTO',
                  'class', 'λ', '&&', 'ng-click', 'dotnet build', 'git push', 'EXEC SP_', 'Task<T>', '0x1F', 'COMMIT'];
    for (var i = 0; i < 16; i++) {
      var s = document.createElement('span');
      s.textContent = glyphs[i % glyphs.length];
      s.style.setProperty('--x', (Math.random() * 96).toFixed(1) + '%');
      s.style.setProperty('--y', (Math.random() * 100).toFixed(1) + '%');
      s.style.setProperty('--dur', (12 + Math.random() * 14).toFixed(1) + 's');
      s.style.setProperty('--delay', (-Math.random() * 20).toFixed(1) + 's');
      s.style.setProperty('--size', (11 + Math.random() * 10).toFixed(0) + 'px');
      layer.appendChild(s);
    }
  }

  /* ---- Stagger index for tag chips ---- */
  Array.prototype.forEach.call(document.querySelectorAll('.tags'), function (ul) {
    Array.prototype.forEach.call(ul.children, function (li, i) { li.style.setProperty('--i', i); });
  });

  /* ---- Count-up numbers ---- */
  function format(value, decimals) {
    return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-US');
  }
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if (isNaN(target)) return;
    if (reduce) { el.textContent = format(target, decimals); return; }
    var start = null, duration = 1500;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased, decimals);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('.count');
  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { countUp(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    Array.prototype.forEach.call(counters, function (c) { countObserver.observe(c); });
  } else {
    Array.prototype.forEach.call(counters, countUp);
  }

  /* ---- Timeline draws itself when it scrolls into view ---- */
  var timeline = document.querySelector('.timeline');
  if (timeline) {
    if ('IntersectionObserver' in window) {
      var tlObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { timeline.classList.add('drawn'); obs.disconnect(); }
        });
      }, { threshold: 0.15 });
      tlObserver.observe(timeline);
    } else {
      timeline.classList.add('drawn');
    }
  }

  /* ---- Cursor spotlight on cards ---- */
  if (!reduce && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('.project-card, .skill-card'), function (card) {
      card.addEventListener('pointermove', function (ev) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
        card.style.setProperty('--my', (ev.clientY - r.top) + 'px');
      });
    });
  }
})();

/* Terminal edition — advanced motion: boot sequence, code rain, name decode,
   card tilt, cursor ring, magnetic buttons, journey stagger, rail clock. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---- Boot sequence ---- */
  var boot = document.getElementById('boot');
  var skipBoot = root.getAttribute('data-boot') === 'skip' || reduce || !boot;

  function finishBoot() {
    if (root.classList.contains('booted')) return;
    root.classList.add('booted');
    try { sessionStorage.setItem('booted', '1'); } catch (e) { /* ignore */ }
    if (boot) {
      boot.classList.add('done');
      setTimeout(function () { if (boot.parentNode) boot.parentNode.removeChild(boot); }, 700);
    }
    decodeName();
  }

  if (skipBoot) {
    if (boot && boot.parentNode) boot.parentNode.removeChild(boot);
    root.classList.add('booted');
    decodeName();
  } else {
    var log = boot.querySelector('.boot-log');
    var lines = [
      { text: '$ ./portfolio --user shabeeb --mode engineer', cls: 'cmd' },
      { text: '> loading modules .......... erp, api, sql, reports', ok: true },
      { text: '> restoring 1,892 work items from azure devops', ok: true },
      { text: '> compiling 4 years of experience', ok: true },
      { text: '> wiring angularjs, razor, ssrs', ok: true },
      { text: '> ready.', cls: 'cmd' }
    ];
    var li = 0, ci = 0, cancelled = false;
    var caret = document.createElement('span'); caret.className = 'caret';
    log.appendChild(caret);

    function typeStep() {
      if (cancelled) return;
      if (li >= lines.length) { setTimeout(finishBoot, 420); return; }
      var line = lines[li];
      if (ci === 0) {
        var span = document.createElement('span');
        if (line.cls) span.className = line.cls;
        line.el = span; log.insertBefore(span, caret);
      }
      ci++;
      line.el.textContent = line.text.slice(0, ci);
      if (ci >= line.text.length) {
        if (line.ok) {
          var ok = document.createElement('span'); ok.className = 'ok'; ok.textContent = '  [ok]';
          log.insertBefore(ok, caret);
        }
        log.insertBefore(document.createTextNode('\n'), caret);
        li++; ci = 0;
        setTimeout(typeStep, line.ok ? 140 : 260);
      } else {
        setTimeout(typeStep, line.cls === 'cmd' ? 26 : 9);
      }
    }
    setTimeout(typeStep, 250);

    function skip() { cancelled = true; finishBoot(); }
    window.addEventListener('keydown', skip, { once: true });
    boot.addEventListener('click', skip, { once: true });
    setTimeout(function () { if (!root.classList.contains('booted')) finishBoot(); }, 6000); // safety net
  }

  /* ---- Name decode (scramble -> resolve) ---- */
  var decoded = false;
  function decodeName() {
    if (decoded) return; decoded = true;
    var h1 = document.querySelector('.hero h1');
    if (!h1 || reduce) return;
    var glyphs = '01<>{}[]/\\=+*#$%&;:';
    var walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = walker.nextNode())) { if (n.nodeValue.trim()) nodes.push({ node: n, final: n.nodeValue }); }
    var start = null, duration = 1300;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      nodes.forEach(function (item) {
        var out = '';
        for (var i = 0; i < item.final.length; i++) {
          var ch = item.final[i];
          if (ch === ' ') { out += ' '; continue; }
          var resolveAt = (i + 1) / item.final.length * 0.85;
          out += p >= resolveAt ? ch : glyphs[Math.floor(Math.random() * glyphs.length)];
        }
        item.node.nodeValue = out;
      });
      if (p < 1) requestAnimationFrame(frame);
      else nodes.forEach(function (item) { item.node.nodeValue = item.final; });
    }
    requestAnimationFrame(frame);
  }

  /* ---- Code rain behind the hero ---- */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg && !reduce) {
    var canvas = document.createElement('canvas'); canvas.className = 'rain';
    heroBg.insertBefore(canvas, heroBg.firstChild);
    var ctx = canvas.getContext('2d');
    var cols = [], fontSize = 14, running = false, last = 0;
    var chars = '01{}[]<>=/;$#@&*+-ABCDEF';
    function resize() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      var rect = heroBg.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr); canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.floor(rect.width / fontSize);
      cols = [];
      for (var i = 0; i < count; i++) cols.push(Math.random() * -50);
      ctx.clearRect(0, 0, rect.width, rect.height);
    }
    function accent() {
      var light = root.getAttribute('data-theme') === 'light';
      return light ? 'rgba(77,124,15,' : 'rgba(163,230,53,';
    }
    function draw(ts) {
      if (!running) return;
      if (ts - last > 55) {
        last = ts;
        var w = canvas.width / (Math.min(2, window.devicePixelRatio || 1));
        var h = canvas.height / (Math.min(2, window.devicePixelRatio || 1));
        var light = root.getAttribute('data-theme') === 'light';
        ctx.fillStyle = light ? 'rgba(243,243,238,0.12)' : 'rgba(9,9,12,0.12)';
        ctx.fillRect(0, 0, w, h);
        ctx.font = fontSize + 'px "JetBrains Mono", monospace';
        for (var i = 0; i < cols.length; i++) {
          var y = cols[i] * fontSize;
          var ch = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillStyle = accent() + (Math.random() < 0.08 ? '0.95)' : '0.45)');
          ctx.fillText(ch, i * fontSize, y);
          if (y > h && Math.random() > 0.975) cols[i] = 0;
          cols[i] += 1;
        }
      }
      requestAnimationFrame(draw);
    }
    function setRunning(on) {
      if (on && !running) { running = true; requestAnimationFrame(draw); }
      else if (!on) running = false;
    }
    resize();
    window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { setRunning(e.isIntersecting && !document.hidden); });
      }, { threshold: 0.05 }).observe(heroBg);
    } else { setRunning(true); }
    document.addEventListener('visibilitychange', function () { setRunning(!document.hidden); });
  }

  /* ---- 3D tilt + glare on the code card ---- */
  var heroCard = document.querySelector('.hero-card');
  var codeCard = document.querySelector('.code-card');
  if (heroCard && codeCard && finePointer && !reduce) {
    heroCard.addEventListener('pointermove', function (ev) {
      var r = codeCard.getBoundingClientRect();
      var px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
      codeCard.style.setProperty('--ry', ((px - 0.5) * 10).toFixed(2) + 'deg');
      codeCard.style.setProperty('--rx', ((0.5 - py) * 10).toFixed(2) + 'deg');
      codeCard.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      codeCard.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      codeCard.style.setProperty('--glare', '1');
    });
    heroCard.addEventListener('pointerleave', function () {
      codeCard.style.setProperty('--rx', '0deg'); codeCard.style.setProperty('--ry', '0deg'); codeCard.style.setProperty('--glare', '0');
    });
  }

  /* ---- Cursor ring ---- */
  if (finePointer && !reduce) {
    var ring = document.createElement('div'); ring.className = 'cursor-ring'; document.body.appendChild(ring);
    var tx = -100, ty = -100, cx = -100, cy = -100, shown = false;
    document.addEventListener('pointermove', function (ev) {
      tx = ev.clientX; ty = ev.clientY;
      if (!shown) { shown = true; cx = tx; cy = ty; ring.classList.add('visible'); }
      var hot = ev.target.closest && ev.target.closest('a, button, .project-card, .skill-card');
      ring.classList.toggle('hot', !!hot);
    });
    document.addEventListener('pointerleave', function () { ring.classList.remove('visible'); shown = false; });
    (function follow() {
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      ring.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      requestAnimationFrame(follow);
    })();
  }

  /* ---- Magnetic primary buttons ---- */
  if (finePointer && !reduce) {
    Array.prototype.forEach.call(document.querySelectorAll('.btn-primary'), function (btn) {
      btn.addEventListener('pointermove', function (ev) {
        var r = btn.getBoundingClientRect();
        btn.style.setProperty('--tx', ((ev.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + 'px');
        btn.style.setProperty('--ty', ((ev.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + 'px');
      });
      btn.addEventListener('pointerleave', function () { btn.style.setProperty('--tx', '0px'); btn.style.setProperty('--ty', '0px'); });
    });
  }

  /* ---- Journey stagger index ---- */
  Array.prototype.forEach.call(document.querySelectorAll('.journey-list li'), function (li, i) { li.style.setProperty('--i', i); });

  /* ---- Rail status clock ---- */
  var actions = document.querySelector('.nav-actions');
  if (actions) {
    var status = document.createElement('div'); status.className = 'rail-status';
    status.innerHTML = '<span class="dot" aria-hidden="true"></span><span>online</span><span aria-hidden="true">·</span><time></time>';
    actions.appendChild(status);
    var t = status.querySelector('time');
    function tick() {
      var d = new Date();
      var hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0'), ss = String(d.getSeconds()).padStart(2, '0');
      t.textContent = hh + ':' + mm + ':' + ss; t.setAttribute('datetime', d.toISOString());
    }
    tick(); setInterval(tick, 1000);
  }
})();

/* Floating back-to-top button: shows after the hero, scrolls smoothly to the top. */
(function () {
  'use strict';
  var btn = document.querySelector('.to-top');
  if (!btn) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function update() { btn.classList.toggle('show', window.scrollY > 320); }
  window.addEventListener('scroll', update, { passive: true });
  update();
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    var target = document.querySelector('.nav-links a') || document.body;
    if (target.focus) setTimeout(function () { target.focus({ preventScroll: true }); }, reduce ? 0 : 500);
  });
})();
