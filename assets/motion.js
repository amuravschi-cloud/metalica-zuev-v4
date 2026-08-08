(function () {
  'use strict';

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* ============ Loaded state (hero mask reveal) ============ */
  function initLoaded() {
    var root = qs('#mzRoot');
    if (!root) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { root.classList.add('is-loaded'); });
    });
  }

  /* ============ Magnetic buttons ============ */
  function initMagnetic() {
    if (touch || reduce) return;
    qsa('.magnetic').forEach(function (btn) {
      var strength = 0.32;
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * strength;
        var y = (e.clientY - r.top - r.height / 2) * strength;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ============ Scrollspy nav ============ */
  function initScrollspy() {
    var links = qsa('.main-nav a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (l) {
      var id = l.getAttribute('href');
      var section = qs(id);
      if (section) map[id] = { link: l, section: section };
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = '#' + entry.target.id;
        if (!map[id]) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          map[id].link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    Object.keys(map).forEach(function (id) { io.observe(map[id].section); });
  }

  /* ============ Floating call/Viber buttons: reveal after hero ============ */
  function initFabReveal() {
    var stack = qs('.fab-stack'), hero = qs('.hero');
    if (!stack || !hero) return;
    if (!('IntersectionObserver' in window)) { stack.classList.add('is-visible'); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        stack.classList.toggle('is-visible', !entry.isIntersecting || entry.intersectionRatio < 0.35);
      });
    }, { threshold: [0, 0.35, 1] });
    io.observe(hero);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLoaded();
    initMagnetic();
    initScrollspy();
    initFabReveal();
  });
})();
