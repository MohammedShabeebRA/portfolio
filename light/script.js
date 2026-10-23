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
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
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
