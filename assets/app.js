(function () {
  'use strict';

  var CATALOG = window.MZ_CATALOG || [];
  var CALC_FORMULAS = window.MZ_CALC_FORMULAS || {};
  var GROUP_ORDER = ['all', 'rebar', 'bar', 'pipe', 'beam', 'sheet', 'fence', 'lumber'];

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ============ i18n helpers ============ */
  function lang() { return window.MZ_I18N ? window.MZ_I18N.lang : 'ro'; }
  function T(key) { return window.MZ_I18N ? window.MZ_I18N.t(key) : key; }
  function locale() { return lang() === 'ru' ? 'ru-RU' : 'ro-RO'; }
  function weightUnit() { return lang() === 'ru' ? 'кг' : 'kg'; }
  function groupLabel(key) {
    var map = lang() === 'ru' ? (window.MZ_GROUP_LABELS || {}) : (window.MZ_GROUP_LABELS_RO || window.MZ_GROUP_LABELS || {});
    return map[key] || key;
  }
  function catTitle(cat) { return lang() === 'ru' ? cat.title : (cat.titleRo || cat.title); }
  function catStandard(cat) { return lang() === 'ru' ? cat.standard : (cat.standardRo || cat.standard); }
  function catDimLabel(cat) { return lang() === 'ru' ? cat.dimLabel : (cat.dimLabelRo || cat.dimLabel); }
  function sizeSub(size) {
    if (!size.sub) return null;
    if (typeof size.sub === 'string') return size.sub;
    return lang() === 'ru' ? size.sub.ru : size.sub.ro;
  }
  function fmtWeight(w) {
    if (w == null) return '—';
    return w.toLocaleString(locale(), { maximumFractionDigits: w >= 1 ? 2 : 3 }) + ' ' + weightUnit();
  }

  /* ============ Mobile nav ============ */
  function initMobileNav() {
    var burger = qs('#burgerBtn'), panel = qs('#mobilePanel'), icon = qs('#burgerIcon');
    if (!burger) return;
    burger.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      icon.innerHTML = open ? '<use href="#i-close"></use>' : '<use href="#i-menu"></use>';
    });
    qsa('a', panel).forEach(function (a) {
      a.addEventListener('click', function () {
        panel.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        icon.innerHTML = '<use href="#i-menu"></use>';
      });
    });
  }

  /* ============ Sticky header shrink ============ */
  function initStickyHeader() {
    var header = qs('.site-header');
    if (!header) return;
    var ticking = false;
    function apply() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(apply); ticking = true; }
    }, { passive: true });
    apply();
  }

  /* ============ Reveal on scroll ============ */
  function initReveal() {
    var targets = qsa('.reveal, .reveal-stagger');
    if (!targets.length) return;
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ============ Ledger stat counters ============ */
  function initStatCounters() {
    var nums = qsa('.ledger .num');
    if (!nums.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        animateNum(entry.target);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  }
  function animateNum(node) {
    var raw = node.textContent;
    var m = raw.match(/(\d+(?:[.,]\d+)?)/);
    if (!m) return;
    var target = parseFloat(m[1].replace(',', '.'));
    var prefix = raw.slice(0, m.index), suffix = raw.slice(m.index + m[1].length);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    var dur = 900, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      var display = (target % 1 === 0) ? Math.round(val).toString() : val.toFixed(1);
      node.textContent = prefix + display + suffix;
      if (p < 1) requestAnimationFrame(step); else node.textContent = raw;
    }
    requestAnimationFrame(step);
  }

  /* ============ Catalog render (informational, no cart) ============ */
  function buildFilters() {
    var wrap = qs('#filters');
    if (!wrap) return;
    wrap.innerHTML = '';
    GROUP_ORDER.forEach(function (g, i) {
      var btn = el('button', 'chip', esc(groupLabel(g)));
      btn.setAttribute('data-group', g);
      btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      wrap.appendChild(btn);
    });
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      qsa('.chip', wrap).forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      filterCatalog(btn.getAttribute('data-group'));
    });
  }

  function sizeRowHtml(cat, size) {
    var weightLabel = size.weight == null ? T('catalog.tagOrder') : fmtWeight(size.weight) + '/' + cat.unit;
    var subText = sizeSub(size);
    var sub = subText ? '<span class="sz-sub">' + esc(subText) + '</span>' : '';
    return (
      '<tr>' +
      '<td><span class="sz-label">' + esc(size.label) + '</span>' + sub + '</td>' +
      '<td class="sz-weight">' + weightLabel + '</td>' +
      '</tr>'
    );
  }

  function buildCatalogGrid() {
    var grid = qs('#catGrid');
    if (!grid) return;
    grid.innerHTML = '';
    var sizesLabel = T('catalog.sizesShow'), hideLabel = T('catalog.sizesHide');
    CATALOG.forEach(function (cat) {
      var card = el('article', 'cat-card reveal');
      card.setAttribute('data-group', cat.group);
      card.setAttribute('data-key', cat.key);

      var rowsHtml = cat.sizes.map(function (s) { return sizeRowHtml(cat, s); }).join('');
      var tagClass = cat.tag === 'stock' ? 'tag-avail' : 'tag-order';
      var tagLabel = cat.tag === 'stock' ? T('catalog.tagStock') : T('catalog.tagOrder');
      var title = catTitle(cat), dimLabel = catDimLabel(cat), standard = catStandard(cat);

      card.innerHTML =
        '<div class="cat-top">' +
          '<div class="cat-icon-wrap"><svg><use href="#' + cat.icon + '"></use></svg></div>' +
          '<span class="cat-tag ' + tagClass + '">' + esc(tagLabel) + '</span>' +
        '</div>' +
        '<h3>' + esc(title) + '</h3>' +
        '<p class="cat-spec"><b>' + esc(dimLabel) + '</b><br>' + esc(standard) + '</p>' +
        '<div class="cat-foot">' +
          '<button type="button" class="cat-link" data-toggle>' + esc(sizesLabel) + ' ' +
            '<svg viewBox="0 0 24 24" width="12" height="12"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</button>' +
          '<button type="button" class="link-brass" data-quote="' + esc(title) + '">' + esc(T('catalog.quote')) +
            '<svg viewBox="0 0 24 24"><use href="#i-arrow"></use></svg>' +
          '</button>' +
        '</div>' +
        '<div class="cat-sizes"><div class="cat-sizes-inner">' +
          '<table class="size-table"><thead><tr>' +
            '<th>' + esc(dimLabel) + '</th><th>' + esc(T('calc.wpmLabel')) + '</th>' +
          '</tr></thead><tbody>' + rowsHtml + '</tbody></table>' +
          '<div class="cat-sizes-foot"><span>' + cat.sizes.length + ' · ' + esc(standard) + '</span></div>' +
        '</div></div>';

      grid.appendChild(card);

      var toggleBtn = qs('[data-toggle]', card);
      toggleBtn.addEventListener('click', function () {
        var open = card.classList.toggle('is-open');
        toggleBtn.firstChild.textContent = (open ? hideLabel : sizesLabel) + ' ';
      });

      var quoteBtn = qs('[data-quote]', card);
      quoteBtn.addEventListener('click', function () {
        goToQuote(quoteBtn.getAttribute('data-quote'));
      });
    });
    updateCatCount('all');
  }

  function goToQuote(categoryTitle) {
    var msg = qs('#fMsg');
    if (msg && !msg.value) msg.value = categoryTitle + ' — ';
    var target = qs('#contacts');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var nameInput = qs('#fName');
    if (nameInput) setTimeout(function () { nameInput.focus(); }, 550);
  }

  function filterCatalog(group) {
    qsa('.cat-card', qs('#catGrid')).forEach(function (card) {
      var match = group === 'all' || card.getAttribute('data-group') === group;
      card.classList.toggle('is-hidden', !match);
    });
    updateCatCount(group);
  }
  function updateCatCount(group) {
    var countEl = qs('#catCount');
    if (!countEl) return;
    var n = group === 'all' ? CATALOG.length : CATALOG.filter(function (c) { return c.group === group; }).length;
    countEl.textContent = n;
  }

  /* ============ Toast ============ */
  var toastTimer = null;
  function toast(msg) {
    var t = qs('#toast');
    if (!t) return;
    t.innerHTML = '<svg viewBox="0 0 24 24"><use href="#i-check"></use></svg><span>' + esc(msg) + '</span>';
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ============ Calculator: category -> exact GOST size -> weight ============
     Only metal stock sold and recalculated by running length (м) — rebar, round/square
     bar, tube, beam, channel, angle, strip, wire, rope, wire rod. Sheets/mesh/fencing/
     lumber are excluded: they don't recalculate into linear metres. */
  var CALC_KEYS = ['rebar', 'circle', 'tube-sq', 'tube-rd', 'beam', 'beam-euro', 'angle', 'channel', 'rope', 'katanka', 'square', 'strip', 'wire'];
  var calcRepopulate = null;
  function initCalculator() {
    var catSel = qs('#calcCategory'), sizeSel = qs('#calcSize');
    var qtyWrap = qs('#calcQtyWrap'), qtyInput = qs('#calcQty'), qtyLabel = qs('#calcQtyLabel');
    var unavailable = qs('#calcUnavailable');
    var priceInput = qs('#calcPrice');
    if (!catSel) return;

    var CALC_CATALOG = CATALOG.filter(function (c) { return CALC_KEYS.indexOf(c.key) !== -1; });

    function repopulateCategories() {
      var prevCatKey = catSel.value;
      catSel.innerHTML = CALC_CATALOG.map(function (c) {
        return '<option value="' + esc(c.key) + '">' + esc(catTitle(c)) + '</option>';
      }).join('');
      if (prevCatKey && CALC_CATALOG.some(function (c) { return c.key === prevCatKey; })) catSel.value = prevCatKey;
      renderSizes();
    }
    calcRepopulate = repopulateCategories;

    function currentCat() { return CALC_CATALOG.filter(function (c) { return c.key === catSel.value; })[0]; }
    function currentSize() {
      var cat = currentCat();
      if (!cat) return null;
      var idx = parseInt(sizeSel.value, 10);
      return cat.sizes[idx] || null;
    }

    function renderSizes() {
      var cat = currentCat();
      if (!cat) return;
      sizeSel.innerHTML = cat.sizes.map(function (s, i) {
        var subText = sizeSub(s);
        return '<option value="' + i + '">' + esc(s.label) + (subText ? ', ' + esc(subText) : '') + '</option>';
      }).join('');
      qtyLabel.textContent = T('calc.qtyLabel');
      compute();
    }

    function compute() {
      var cat = currentCat();
      var size = currentSize();
      if (!cat || !size) return;

      if (size.weight == null) {
        unavailable.style.display = '';
        qtyWrap.style.display = 'none';
        qs('#calcWpmLabel').textContent = T('calc.wpmLabel');
        qs('#calcWpm').textContent = lang() === 'ru' ? 'по запросу' : 'la cerere';
        qs('#calcWeight').textContent = '—';
        qs('#calcCostRow').style.display = 'none';
        return;
      }
      unavailable.style.display = 'none';
      qtyWrap.style.display = '';

      var qty = parseFloat(qtyInput.value) || 0;
      var totalWeight = size.weight * qty;
      var price = parseFloat(priceInput.value) || 0;
      var cost = price ? (totalWeight / 1000) * price : null;

      qs('#calcWpmLabel').textContent = T('calc.wpmLabel') + ' (' + weightUnit() + '/' + cat.unit + ')';
      qs('#calcWpm').textContent = fmtWeight(size.weight);
      qs('#calcWeight').textContent = fmtWeight(totalWeight);
      var costRow = qs('#calcCostRow'), costEl = qs('#calcCost');
      if (cost != null) { costRow.style.display = ''; costEl.textContent = '≈ ' + Math.round(cost).toLocaleString(locale()) + ' MDL'; }
      else { costRow.style.display = 'none'; }
    }

    catSel.addEventListener('change', renderSizes);
    sizeSel.addEventListener('change', compute);
    qtyInput.addEventListener('input', compute);
    priceInput.addEventListener('input', compute);
    repopulateCategories();
  }

  /* ============ Quote form ============ */
  function initQuoteForm() {
    var form = qs('#quoteForm'), fields = qs('#formFields'), success = qs('#formSuccess'), resetBtn = qs('#formReset');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      fields.classList.add('hide');
      success.classList.add('show');
      toast(T('form.toast'));
    });
    resetBtn.addEventListener('click', function () {
      form.reset();
      success.classList.remove('show');
      fields.classList.remove('hide');
    });
  }

  /* ============ Language change: rebuild dynamic content ============ */
  function rebuildForLanguage() {
    var activeGroup = 'all';
    var pressed = qs('.chip[aria-pressed="true"]');
    if (pressed) activeGroup = pressed.getAttribute('data-group');
    buildFilters();
    var again = qs('.chip[data-group="' + activeGroup + '"]');
    if (again) {
      qsa('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      again.setAttribute('aria-pressed', 'true');
    }
    buildCatalogGrid();
    filterCatalog(activeGroup);
    if (calcRepopulate) calcRepopulate();
    initReveal();
  }

  /* ============ Init ============ */
  document.addEventListener('DOMContentLoaded', function () {
    buildFilters();
    buildCatalogGrid();
    initMobileNav();
    initStickyHeader();
    initCalculator();
    initQuoteForm();
    initReveal();
    initStatCounters();
    document.addEventListener('mz:langchange', rebuildForLanguage);
  });
})();
