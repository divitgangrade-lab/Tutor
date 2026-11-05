/*
 * ui.js — shared shell, overlays, icons, and the small interaction layer
 * (scroll reveal, counters, tilt, canvas atmosphere).
 */
(function (global) {
  'use strict';

  var Data = global.MoodyData;
  var Store = global.MoodyStore;
  var Safe = global.MoodySecurity;
  var esc = Safe.esc;
  var money = Safe.money;

  var ICONS = {
    cart: '<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.55L21 8H6"/><circle cx="10" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close: '<path d="M5 5l14 14M19 5L5 19"/>',
    arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
    check: '<path d="M4 12.5l5 5L20 6.5"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    user: '<circle cx="12" cy="8" r="3.4"/><path d="M4.5 20c.8-3.6 3.7-5.5 7.5-5.5s6.7 1.9 7.5 5.5"/>',
    spark: '<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/>',
    atom: '<circle cx="12" cy="12" r="2"/><path d="M12 2c5 0 9 4.5 9 10s-4 10-9 10-9-4.5-9-10S7 2 12 2z"/><path d="M2.5 12c0-5 4.3-8.5 9.5-8.5S21.5 7 21.5 12s-4.3 8.5-9.5 8.5S2.5 17 2.5 12z" transform="rotate(60 12 12)"/>',
    grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    book: '<path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3z"/><path d="M8 4v16"/>',
    crest: '<path d="M12 3l7 3v6c0 4-3 7.2-7 9-4-1.8-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5h10"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    cash: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9h.01M18 15h.01"/>',
    logout: '<path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    edit: '<path d="M4 20h4L20 8l-4-4L4 16z"/>'
  };

  function icon(name, className) {
    var body = ICONS[name] || ICONS.spark;
    return (
      '<svg class="icon ' +
      (className || '') +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      body +
      '</svg>'
    );
  }

  function date(value) {
    if (!value) return '—';
    var parsed = new Date(String(value).length <= 10 ? value + 'T12:00:00' : value);
    if (isNaN(parsed.getTime())) return esc(value);
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function shortDate(value) {
    if (!value) return '—';
    var parsed = new Date(String(value).length <= 10 ? value + 'T12:00:00' : value);
    if (isNaN(parsed.getTime())) return esc(value);
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function timeAgo(value) {
    var parsed = new Date(value);
    if (isNaN(parsed.getTime())) return '—';
    var diff = Date.now() - parsed.getTime();
    var minutes = Math.round(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return minutes + ' min ago';
    var hours = Math.round(minutes / 60);
    if (hours < 24) return hours + ' hr ago';
    var days = Math.round(hours / 24);
    if (days < 30) return days + ' day' + (days === 1 ? '' : 's') + ' ago';
    return date(value);
  }

  function subjectName(id) {
    if (id === 'ib') return 'Moody IB';
    if (id === 'specialty') return 'Specialty';
    return Data.SUBJECTS[id] ? Data.SUBJECTS[id].name : id;
  }

  /* ------------------------------------------------------------------ Shell */

  var NAV = [
    { id: 'science', label: 'Science', href: '#/science' },
    { id: 'math', label: 'Math', href: '#/math' },
    { id: 'english', label: 'English', href: '#/english' },
    { id: 'ib', label: 'Moody IB', href: '#/ib' },
    { id: 'specialty', label: 'Specialty', href: '#/specialty' }
  ];

  function navLinks(active, mobile) {
    return NAV.map(function (item) {
      return (
        '<a class="nav-link ' +
        (active === item.id ? 'is-active' : '') +
        '" href="' +
        item.href +
        '" data-action="goto" data-target="' +
        item.href +
        '"' +
        (mobile ? '' : ' aria-current="' + (active === item.id ? 'page' : 'false') + '"') +
        '>' +
        esc(item.label) +
        '</a>'
      );
    }).join('');
  }

  function header(active) {
    var count = Store.cartCount();
    var signedIn = Store.isFamily();
    return (
      '<header class="site-header" data-header>' +
      '<div class="header-inner container">' +
      '<a class="brand" href="#/" data-action="goto" data-target="#/" aria-label="Moody and Co. Academy home">' +
      '<span class="brand-mark">' +
      esc(Data.SITE.mark) +
      '</span>' +
      '<span class="brand-word">Moody &amp; Co.<span>Academy</span></span>' +
      '</a>' +
      '<nav class="site-nav" aria-label="Primary">' +
      navLinks(active, false) +
      '</nav>' +
      '<div class="header-actions">' +
      '<button class="cart-btn" type="button" data-action="open-cart" aria-label="Open cart (' +
      count +
      ' items)">' +
      icon('cart') +
      '<span class="cart-count" data-cart-count>' +
      count +
      '</span>' +
      '</button>' +
      '<a class="btn btn-sm btn-outline login-link" href="' +
      (signedIn ? '#/portal' : '#/login') +
      '" data-action="goto" data-target="' +
      (signedIn ? '#/portal' : '#/login') +
      '">' +
      (signedIn ? 'My portal' : 'Family login') +
      '</a>' +
      '<button class="menu-btn" type="button" data-action="toggle-menu" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">' +
      icon('menu') +
      '</button>' +
      '</div>' +
      '</div>' +
      '<div class="mobile-nav" id="mobile-nav" hidden>' +
      '<div class="container mobile-nav-inner">' +
      navLinks(active, true) +
      '<a class="nav-link" href="#/specialty" data-action="goto" data-target="#/specialty">Specialty Center</a>' +
      '<a class="nav-link" href="#/request" data-action="goto" data-target="#/request">Request a meeting</a>' +
      '<a class="nav-link" href="' +
      (signedIn ? '#/portal' : '#/login') +
      '" data-action="goto" data-target="' +
      (signedIn ? '#/portal' : '#/login') +
      '">' +
      (signedIn ? 'My portal' : 'Family &amp; student login') +
      '</a>' +
      '</div>' +
      '</div>' +
      '</header>'
    );
  }

  function footer() {
    return (
      '<footer class="site-footer">' +
      '<div class="container footer-grid">' +
      '<div class="footer-brand">' +
      '<span class="brand-mark">' +
      esc(Data.SITE.mark) +
      '</span>' +
      '<p class="footer-name">Moody &amp; Co. Academy</p>' +
      '<p class="footer-blurb">Small-room tutoring for grades 1–8 and George H. Moody IB preparation. Plans, not promises.</p>' +
      '</div>' +
      '<div class="footer-col"><h4>Rooms</h4><a href="#/science" data-action="goto" data-target="#/science">Science · Sci-Fi Lab</a><a href="#/math" data-action="goto" data-target="#/math">Math · Matrix</a><a href="#/english" data-action="goto" data-target="#/english">English · Story Hall</a><a href="#/ib" data-action="goto" data-target="#/ib">Moody IB</a></div>' +
      '<div class="footer-col"><h4>Families</h4><a href="#/specialty" data-action="goto" data-target="#/specialty">Specialty Center</a><a href="#/login" data-action="goto" data-target="#/login">Family &amp; student login</a><a href="#/request" data-action="goto" data-target="#/request">Request a meeting</a><a href="#/science" data-action="goto" data-target="#/science">Grade courses</a></div>' +
      '<div class="footer-col"><h4>Studio</h4><p>' +
      esc(Data.SITE.hours) +
      '</p><p>' +
      esc(Data.SITE.location) +
      '</p><p><a href="mailto:' +
      esc(Data.SITE.email) +
      '">' +
      esc(Data.SITE.email) +
      '</a></p><p class="footer-cash">Cash after consultation · no online payment</p></div>' +
      '</div>' +
      '<div class="footer-bottom container">' +
      '<p>© 2026 Moody &amp; Co. Academy. Independent tutoring — not affiliated with or endorsed by George H. Moody Middle School or the International Baccalaureate Organization.</p>' +
      '<a class="staff-link" href="#/instructor" data-action="goto" data-target="#/instructor">Instructor access ' +
      icon('lock') +
      '</a>' +
      '</div>' +
      '</footer>'
    );
  }

  function shell(options) {
    var opts = options || {};
    var theme = opts.theme || 'neutral';
    return (
      '<div class="page theme-' +
      esc(theme) +
      '">' +
      header(opts.active || '') +
      '<main id="main" tabindex="-1">' +
      (opts.html || '') +
      '</main>' +
      footer() +
      '</div>'
    );
  }

  function sectionHead(kicker, title, lede, align) {
    return (
      '<div class="section-head ' +
      (align === 'center' ? 'is-center' : '') +
      ' reveal">' +
      (kicker ? '<p class="eyebrow">' + esc(kicker) + '</p>' : '') +
      '<h2 class="section-title">' + title + '</h2>' +
      (lede ? '<p class="section-lede">' + lede + '</p>' : '') +
      '</div>'
    );
  }

  /* ------------------------------------------------------------------ Toast */

  function toast(message, kind) {
    var root = document.getElementById('toast-root');
    if (!root) return;
    var node = document.createElement('div');
    node.className = 'toast toast-' + (kind || 'info');
    node.innerHTML =
      '<span class="toast-icon">' +
      icon(kind === 'error' ? 'close' : ('check')) +
      '</span><p>' +
      esc(message) +
      '</p>';
    root.appendChild(node);
    global.setTimeout(function () {
      node.classList.add('is-leaving');
      global.setTimeout(function () {
        node.remove();
      }, 260);
    }, 3600);
  }

  /* ---------------------------------------------------------------- Overlay */

  var overlayState = { lastFocus: null, onKey: null, open: false };

  function closeOverlay() {
    var root = document.getElementById('overlay-root');
    if (root) root.innerHTML = '';
    document.body.classList.remove('overlay-open');
    if (overlayState.onKey) {
      document.removeEventListener('keydown', overlayState.onKey);
      overlayState.onKey = null;
    }
    if (overlayState.lastFocus && typeof overlayState.lastFocus.focus === 'function') {
      try {
        overlayState.lastFocus.focus();
      } catch (error) {
        /* ignore */
      }
    }
    overlayState.lastFocus = null;
    overlayState.open = false;
  }

  function mountOverlay(inner, options) {
    var root = document.getElementById('overlay-root');
    if (!root) return;
    var opts = options || {};
    overlayState.lastFocus = document.activeElement;
    overlayState.open = true;
    root.innerHTML = inner;
    document.body.classList.add('overlay-open');
    var dialog = root.querySelector('[role="dialog"]');
    if (dialog) {
      var focusables = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length) {
        try {
          focusables[0].focus();
        } catch (error) {
          /* ignore */
        }
      }
    }
    overlayState.onKey = function (event) {
      if (event.key === 'Escape') {
        closeOverlay();
        return;
      }
      if (event.key === 'Tab' && dialog) {
        var items = Array.prototype.slice.call(
          dialog.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      if (opts.onKey) opts.onKey(event);
    };
    document.addEventListener('keydown', overlayState.onKey);
    root.addEventListener(
      'click',
      function (event) {
        if (event.target === root || event.target.classList.contains('overlay-backdrop')) {
          closeOverlay();
        }
      },
      { once: true }
    );
  }

  function modal(options) {
    var opts = options || {};
    mountOverlay(
      '<div class="overlay-backdrop">' +
        '<div class="modal ' +
        (opts.wide ? 'modal-wide' : '') +
        '" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
        '<div class="modal-head">' +
        '<div><p class="eyebrow">' +
        esc(opts.kicker || 'Moody & Co.') +
        '</p><h2 id="modal-title" class="modal-title">' +
        esc(opts.title || '') +
        '</h2></div>' +
        '<button class="icon-btn" type="button" data-action="close-overlay" aria-label="Close">' +
        icon('close') +
        '</button>' +
        '</div>' +
        '<div class="modal-body">' +
        (opts.body || '') +
        '</div>' +
        '</div></div>'
    );
  }

  function confirmDialog(options) {
    var opts = options || {};
    return new Promise(function (resolve) {
      var settled = false;
      function finish(value) {
        if (settled) return;
        settled = true;
        closeOverlay();
        resolve(value);
      }
      mountOverlay(
        '<div class="overlay-backdrop"><div class="modal modal-confirm" role="dialog" aria-modal="true" aria-labelledby="confirm-title">' +
          '<div class="modal-body"><p class="eyebrow">Please confirm</p><h2 id="confirm-title" class="modal-title">' +
          esc(opts.title || 'Are you sure?') +
          '</h2><p class="modal-copy">' +
          esc(opts.body || '') +
          '</p><div class="modal-actions"><button class="btn btn-quiet" type="button" data-confirm="no">' +
          esc(opts.cancel || 'Cancel') +
          '</button><button class="btn btn-danger" type="button" data-confirm="yes">' +
          esc(opts.confirm || 'Confirm') +
          '</button></div></div></div></div>'
      );
      var root = document.getElementById('overlay-root');
      if (!root) return finish(false);
      root.querySelectorAll('[data-confirm]').forEach(function (button) {
        button.addEventListener('click', function () {
          finish(button.getAttribute('data-confirm') === 'yes');
        });
      });
    });
  }

  /* ------------------------------------------------------------------- Cart */

  function cartLineHtml(line) {
    return (
      '<li class="cart-line">' +
      '<div class="cart-line-main"><p class="cart-line-title">' +
      esc(line.title) +
      '</p><p class="cart-line-sub">' +
      esc(line.subtitle) +
      '</p></div>' +
      '<div class="cart-line-controls">' +
      '<button class="qty-btn" type="button" data-action="cart-dec" data-key="' +
      esc(line.key) +
      '" aria-label="Decrease quantity">' +
      icon('minus') +
      '</button>' +
      '<span class="qty-value">' +
      line.qty +
      '</span>' +
      '<button class="qty-btn" type="button" data-action="cart-inc" data-key="' +
      esc(line.key) +
      '" aria-label="Increase quantity">' +
      icon('plus') +
      '</button>' +
      '<span class="cart-line-price">' +
      money(line.price * line.qty) +
      '</span>' +
      '<button class="icon-btn cart-remove" type="button" data-action="cart-remove" data-key="' +
      esc(line.key) +
      '" aria-label="Remove ' +
      esc(line.title) +
      '">' +
      icon('trash') +
      '</button>' +
      '</div></li>'
    );
  }

  function cartBodyHtml() {
    var lines = Store.cart();
    if (!lines.length) {
      return (
        '<div class="cart-empty">' +
        '<span class="cart-empty-mark">' +
        icon('cart') +
        '</span>' +
        '<h3>Your cart is empty</h3>' +
        '<p>Start with a grade course in any room, or add a signature plan.</p>' +
        '<a class="btn btn-ink" href="#/science" data-action="goto" data-target="#/science">Explore Science</a>' +
        '</div>'
      );
    }
    return (
      '<ul class="cart-lines">' +
      lines.map(cartLineHtml).join('') +
      '</ul>' +
      '<div class="cart-total"><span>Estimated total</span><strong data-cart-total>' +
      money(Store.cartTotal()) +
      '</strong></div>' +
      '<p class="cart-note">' +
      icon('cash') +
      '<span>No online payment. You will request a meeting and pay cash in person after the consultation.</span></p>' +
      '<div class="cart-actions">' +
      '<a class="btn btn-accent btn-block" href="#/request" data-action="goto" data-target="#/request">Request the meeting ' +
      icon('arrow') +
      '</a>' +
      '<button class="btn btn-quiet btn-block" type="button" data-action="clear-cart">Clear cart</button>' +
      '</div>'
    );
  }

  function openCart() {
    mountOverlay(
      '<div class="overlay-backdrop overlay-right"><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">' +
        '<div class="drawer-head"><div><p class="eyebrow">Not a checkout</p><h2 id="cart-title" class="modal-title">Your cart</h2></div><button class="icon-btn" type="button" data-action="close-overlay" aria-label="Close cart">' +
        icon('close') +
        '</button></div>' +
        '<div class="drawer-body" data-cart-body>' +
        cartBodyHtml() +
        '</div></aside></div>'
    );
  }

  function refreshCart() {
    var body = document.querySelector('[data-cart-body]');
    if (body) body.innerHTML = cartBodyHtml();
    updateCartBadges();
  }

  function updateCartBadges() {
    var count = Store.cartCount();
    document.querySelectorAll('[data-cart-count]').forEach(function (node) {
      node.textContent = String(count);
      node.classList.toggle('is-empty', count === 0);
    });
  }

  /* ------------------------------------------------------------- Plan detail */

  function planCard(plan, options) {
    var opts = options || {};
    var featured = plan.featured;
    return (
      '<article class="plan-card ' +
      (featured ? 'is-featured ' : '') +
      'reveal" data-tilt>' +
      (plan.badge ? '<span class="plan-badge">' + esc(plan.badge) + '</span>' : '') +
      '<p class="plan-sub">' +
      esc(plan.subtitle) +
      '</p>' +
      '<h3 class="plan-title">' +
      esc(plan.title) +
      '</h3>' +
      '<p class="plan-price">' +
      money(plan.price) +
      '<span>' +
      esc(plan.unit) +
      '</span></p>' +
      '<p class="plan-summary">' +
      esc(plan.summary) +
      '</p>' +
      '<ul class="tick-list">' +
      plan.includes
        .slice(0, 3)
        .map(function (item) {
          return '<li>' + icon('check') + '<span>' + esc(item) + '</span></li>';
        })
        .join('') +
      '</ul>' +
      '<div class="plan-actions">' +
      '<button class="btn btn-accent btn-sm" type="button" data-action="add-item" data-item="plan:' +
      esc(plan.id) +
      '">Add to cart</button>' +
      '<button class="btn btn-quiet btn-sm" type="button" data-action="open-plan" data-plan="' +
      esc(plan.id) +
      '">Full details</button>' +
      '</div>' +
      (opts.note ? '<p class="plan-note">' + esc(opts.note) + '</p>' : '') +
      '</article>'
    );
  }

  function openPlan(id) {
    var plan = Data.planById(id);
    if (!plan) return;
    var subject = plan.subject === 'ib' ? 'Moody IB' : Data.SUBJECTS[plan.subject].name;
    modal({
      wide: true,
      kicker: subject + ' · ' + plan.subtitle,
      title: plan.title,
      body:
        '<div class="plan-detail-top"><div><p class="detail-price">' +
        money(plan.price) +
        '<span>' +
        esc(plan.unit) +
        '</span></p><p class="detail-summary">' +
        esc(plan.summary) +
        '</p></div><button class="btn btn-accent" type="button" data-action="add-item" data-item="plan:' +
        esc(plan.id) +
        '">Add to cart</button></div>' +
        '<div class="detail-columns"><div><h3>What is included</h3><ul class="tick-list">' +
        plan.includes
          .map(function (item) {
            return '<li>' + icon('check') + '<span>' + esc(item) + '</span></li>';
          })
          .join('') +
        '</ul></div><div><h3>What changes</h3><ul class="tick-list">' +
        plan.outcomes
          .map(function (item) {
            return '<li>' + icon('spark') + '<span>' + esc(item) + '</span></li>';
          })
          .join('') +
        '</ul></div></div>' +
        '<div class="detail-spec"><div><span>Format</span><strong>' +
        esc(plan.format) +
        '</strong></div><div><span>Rhythm</span><strong>' +
        esc(plan.rhythm) +
        '</strong></div><div><span>Best for</span><strong>' +
        esc(plan.bestFor) +
        '</strong></div><div><span>Materials</span><strong>' +
        esc(plan.materials) +
        '</strong></div><div><span>Assessment</span><strong>' +
        esc(plan.assessment) +
        '</strong></div></div>' +
        '<div class="detail-arc"><h3>Session arc</h3><ol>' +
        plan.arc
          .map(function (step) {
            return '<li>' + esc(step) + '</li>';
          })
          .join('') +
        '</ol></div>' +
        '<p class="detail-footnote">' +
        icon('cash') +
        '<span>Adding this to your cart does not charge anything. The next step is a meeting; payment is cash in person.</span></p>'
    });
  }

  /* ------------------------------------------------------------ Atmosphere */

  function atmosphere(canvas, variant) {
    if (!canvas) return function () {};
    var ctx = null;
    try {
      ctx = canvas.getContext('2d');
    } catch (error) {
      ctx = null;
    }
    if (!ctx) return function () {};
    var reduce =
      global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var host = canvas.parentElement || canvas;
    var width = 0;
    var height = 0;
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var frame = 0;
    var running = true;
    var particles = [];
    var columns = 0;
    var drops = [];
    var palette = {
      scifi: { dot: 'rgba(120, 220, 255, ALPHA)', line: 'rgba(94, 234, 212, 0.12)' },
      matrix: { dot: 'rgba(74, 222, 128, ALPHA)', line: 'rgba(74, 222, 128, 0.10)' },
      story: { dot: 'rgba(198, 155, 74, ALPHA)', line: 'rgba(140, 47, 47, 0.10)' },
      ib: { dot: 'rgba(198, 161, 91, ALPHA)', line: 'rgba(198, 161, 91, 0.14)' },
      grid: { dot: 'rgba(22, 26, 24, ALPHA)', line: 'rgba(22, 26, 24, 0.07)' }
    };
    var theme = palette[variant] || palette.grid;

    function resize() {
      var rect = host.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      var count = Math.min(90, Math.round((width * height) / 26000));
      particles = new Array(count).fill(0).map(function () {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.6 + Math.random() * 1.8,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          a: 0.25 + Math.random() * 0.5
        };
      });
      columns = Math.max(1, Math.floor(width / 18));
      drops = new Array(columns).fill(0).map(function () {
        return Math.random() * height;
      });
    }

    function drawStars() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(function (particle, index) {
        if (!reduce) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        }
        ctx.beginPath();
        ctx.fillStyle = theme.dot.replace('ALPHA', String(particle.a));
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
        for (var next = index + 1; next < particles.length; next += 1) {
          var other = particles[next];
          var dx = particle.x - other.x;
          var dy = particle.y - other.y;
          if (dx * dx + dy * dy < 110 * 110) {
            ctx.strokeStyle = theme.line;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });
    }

    function drawRain() {
      ctx.clearRect(0, 0, width, height);
      ctx.font = '14px ui-monospace, monospace';
      var glyphs = '01アイウエオカキクケコサシスセソタチツテト';
      for (var index = 0; index < columns; index += 1) {
        var x = index * 18 + 9;
        var y = drops[index];
        var glyph = glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        ctx.fillStyle = 'rgba(74, 222, 128, ' + (0.1 + Math.random() * 0.35) + ')';
        ctx.fillText(glyph, x, y);
        if (drops[index] > height && Math.random() > 0.975) drops[index] = 0;
        else drops[index] += 14;
      }
    }

    function drawPetals() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(function (particle) {
        if (!reduce) {
          particle.y += 0.35 + particle.r * 0.12;
          particle.x += Math.sin((particle.y + particle.r * 30) / 45) * 0.4;
          if (particle.y > height) {
            particle.y = -6;
            particle.x = Math.random() * width;
          }
        }
        ctx.beginPath();
        ctx.fillStyle = theme.dot.replace('ALPHA', String(particle.a * 0.8));
        ctx.ellipse(particle.x, particle.y, particle.r * 1.7, particle.r, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function drawGrid() {
      ctx.clearRect(0, 0, width, height);
      var step = 52;
      ctx.strokeStyle = theme.line;
      ctx.lineWidth = 1;
      for (var x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (var y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      particles.forEach(function (particle, index) {
        if (!reduce) {
          particle.x += particle.vx * 0.5;
          particle.y += particle.vy * 0.5;
          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        }
        ctx.beginPath();
        ctx.fillStyle = theme.dot.replace('ALPHA', String(particle.a * 0.7));
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
        for (var next = index + 1; next < particles.length; next += 1) {
          var other = particles[next];
          var dx = particle.x - other.x;
          var dy = particle.y - other.y;
          if (dx * dx + dy * dy < 130 * 130) {
            ctx.strokeStyle = theme.line;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });
    }

    function render() {
      if (!running) return;
      if (variant === 'matrix') drawRain();
      else if (variant === 'story') drawPetals();
      else if (variant === 'scifi' || variant === 'ib') drawStars();
      else drawGrid();
      if (!reduce) frame = global.requestAnimationFrame(render);
    }

    function onVisibility() {
      if (document.hidden) {
        running = false;
        if (frame) global.cancelAnimationFrame(frame);
      } else if (!reduce) {
        running = true;
        frame = global.requestAnimationFrame(render);
      }
    }

    resize();
    render();
    global.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    return function cleanup() {
      running = false;
      if (frame) global.cancelAnimationFrame(frame);
      global.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }

  /* ------------------------------------------------------- Page interactions */

  var cleanups = [];
  var observer = null;

  function initPage() {
    cleanupPage();

    document.querySelectorAll('[data-atmosphere]').forEach(function (canvas) {
      cleanups.push(atmosphere(canvas, canvas.getAttribute('data-atmosphere')));
    });

    var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in global) || (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      reveals.forEach(function (node) {
        node.classList.add('is-visible');
      });
    } else {
      observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
      reveals.forEach(function (node) {
        observer.observe(node);
      });
    }

    document.querySelectorAll('[data-count-to]').forEach(function (node) {
      var target = Number(node.getAttribute('data-count-to'));
      if (!isFinite(target)) return;
      if (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        node.textContent = String(target);
        return;
      }
      var start = null;
      function tick(now) {
        if (start === null) start = now;
        var progress = Math.min(1, (now - start) / 1200);
        var eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = String(Math.round(target * eased));
        if (progress < 1) global.requestAnimationFrame(tick);
      }
      global.requestAnimationFrame(tick);
    });

    if (global.matchMedia && global.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('[data-tilt]').forEach(function (card) {
        function move(event) {
          var rect = card.getBoundingClientRect();
          var px = (event.clientX - rect.left) / rect.width - 0.5;
          var py = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.transform =
            'perspective(900px) rotateX(' + (-py * 3).toFixed(2) + 'deg) rotateY(' + (px * 3).toFixed(2) + 'deg)';
        }
        function leave() {
          card.style.transform = '';
        }
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerleave', leave);
        cleanups.push(function () {
          card.removeEventListener('pointermove', move);
          card.removeEventListener('pointerleave', leave);
        });
      });
    }
  }

  function cleanupPage() {
    cleanups.forEach(function (fn) {
      try {
        fn();
      } catch (error) {
        /* ignore */
      }
    });
    cleanups = [];
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function scrollToId(id) {
    var node = document.getElementById(id);
    if (!node) return;
    node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function progressBar(value, label) {
    var pct = Safe.clamp(value == null ? 0 : value, 0, 100);
    return (
      '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
      Math.round(pct) +
      '" aria-label="' +
      esc(label || 'Progress') +
      '"><span class="progress-fill" style="width:' +
      pct +
      '%"></span></div>'
    );
  }

  function emptyState(title, body) {
    return (
      '<div class="empty-state"><span class="empty-mark">' +
      icon('spark') +
      '</span><h3>' +
      esc(title) +
      '</h3><p>' +
      esc(body) +
      '</p></div>'
    );
  }

  global.MoodyUI = {
    icon: icon,
    esc: esc,
    money: money,
    date: date,
    shortDate: shortDate,
    timeAgo: timeAgo,
    subjectName: subjectName,
    header: header,
    footer: footer,
    shell: shell,
    sectionHead: sectionHead,
    toast: toast,
    modal: modal,
    closeOverlay: closeOverlay,
    confirmDialog: confirmDialog,
    openCart: openCart,
    refreshCart: refreshCart,
    updateCartBadges: updateCartBadges,
    planCard: planCard,
    openPlan: openPlan,
    atmosphere: atmosphere,
    initPage: initPage,
    cleanupPage: cleanupPage,
    scrollToId: scrollToId,
    progressBar: progressBar,
    emptyState: emptyState
  };
})(window);
