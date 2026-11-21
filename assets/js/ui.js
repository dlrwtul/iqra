/* Iqra — composants d'interface partagés. */
(function () {
  'use strict';
  const { U, D, Store, SRS, Audio } = IQRA;

  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    path: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H16"/>',
    review: '<path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/>',
    book: '<path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    sound: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
    play: '<path d="M7 4v16l13-8z" fill="currentColor"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    flame: '<path d="M12 22c4.4 0 7-2.9 7-6.8 0-3.2-2-5.6-3.6-7.4-.4 1.9-1.4 3-2.6 3.6.3-3.5-1.3-6.6-4.3-8.4.2 3.2-1.6 5.2-3 7C4.3 11.6 5 13.3 5 15.2 5 19.1 7.6 22 12 22z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    right: '<path d="m9 6 6 6-6 6"/>',
    left: '<path d="m15 6-6 6 6 6"/>',
    settings: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    upload: '<path d="M12 21V9M7 14l5-5 5 5M5 3h14"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>'
  };
  const icon = (name, cls) =>
    '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';

  const ui = (IQRA.ui = { icon });

  /* ---------------------------------------------------------------- notifications */
  const lastToast = {};
  ui.toast = function (msg, type, ms) {
    const now = Date.now();
    if (lastToast[msg] && now - lastToast[msg] < 10000) return;
    lastToast[msg] = now;
    let wrap = U.$('#toasts');
    if (!wrap) {
      wrap = U.h('<div id="toasts" aria-live="polite"></div>');
      document.body.appendChild(wrap);
    }
    const el = U.h('<div class="toast toast-' + (type || 'info') + '">' + U.rich(msg) + '</div>');
    wrap.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    }, ms || 3200);
  };

  ui.celebrate = function (title, text) {
    const el = U.h(
      '<div class="celebrate" role="status"><div class="celebrate-card">' +
        '<div class="celebrate-icon">' + icon('flame') + '</div>' +
        '<h3>' + U.esc(title) + '</h3><p>' + U.esc(text) + '</p>' +
        '<button class="btn btn-primary">Super !</button></div></div>'
    );
    document.body.appendChild(el);
    ui.confetti();
    const close = () => el.remove();
    el.querySelector('button').addEventListener('click', close);
    el.addEventListener('click', (e) => e.target === el && close());
    setTimeout(close, 6000);
  };

  ui.confetti = function () {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#0f766e', '#c08a2e', '#14b8a6', '#f59e0b', '#65a30d'];
    const layer = U.h('<div class="confetti" aria-hidden="true"></div>');
    for (let i = 0; i < 40; i++) {
      const s = document.createElement('i');
      s.style.left = Math.random() * 100 + '%';
      s.style.background = colors[i % colors.length];
      s.style.animationDelay = Math.random() * 0.4 + 's';
      s.style.animationDuration = 1.6 + Math.random() * 1.2 + 's';
      s.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      layer.appendChild(s);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 3200);
  };

  /* ---------------------------------------------------------------- fenêtre modale (feuille) */
  ui.sheet = function (html, opts) {
    ui.closeSheet();
    const el = U.h(
      '<div class="sheet-backdrop"><div class="sheet" role="dialog" aria-modal="true">' +
        '<button class="sheet-close btn-icon" aria-label="Fermer">' + icon('x') + '</button>' +
        '<div class="sheet-body"></div></div></div>'
    );
    const body = el.querySelector('.sheet-body');
    if (typeof html === 'string') body.innerHTML = html;
    else body.appendChild(html);
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('open'));
    const close = () => ui.closeSheet();
    el.addEventListener('click', (e) => e.target === el && close());
    el.querySelector('.sheet-close').addEventListener('click', close);
    ui._sheetKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', ui._sheetKey);
    if (opts && opts.onOpen) opts.onOpen(body);
    return body;
  };
  ui.closeSheet = function () {
    const el = U.$('.sheet-backdrop');
    if (el) el.remove();
    if (ui._sheetKey) document.removeEventListener('keydown', ui._sheetKey);
  };

  ui.confirm = function (text, okLabel) {
    return new Promise((resolve) => {
      const body = ui.sheet(
        '<h3>' + U.esc(text) + '</h3><div class="row gap end mt">' +
          '<button class="btn btn-ghost" data-a="0">Annuler</button>' +
          '<button class="btn btn-danger" data-a="1">' + U.esc(okLabel || 'Confirmer') + '</button></div>'
      );
      body.addEventListener('click', (e) => {
        const b = e.target.closest('[data-a]');
        if (!b) return;
        ui.closeSheet();
        resolve(b.dataset.a === '1');
      });
    });
  };

  /* ---------------------------------------------------------------- audio : délégation globale */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-say],[data-verse],[data-wbw]');
    if (!b) return;
    e.stopPropagation();
    if (b.dataset.say != null) Audio.say(b.dataset.say, b.dataset.loc);
    else if (b.dataset.verse) {
      const [s, v] = b.dataset.verse.split(':').map(Number);
      Audio.verse(s, v);
    } else if (b.dataset.wbw) Audio.word(b.dataset.wbw);
  });

  ui.sayBtn = (ar, loc, label) =>
    '<button class="btn-icon audio" data-say="' + U.esc(ar) + '"' + (loc ? ' data-loc="' + loc + '"' : '') + ' aria-label="' + (label || 'Écouter') + '">' + icon('sound') + '</button>';

  /* ---------------------------------------------------------------- verset (avec mot surligné) */
  ui.verseHTML = function (loc, opts) {
    opts = opts || {};
    const [s, v, w] = String(loc).split(':').map(Number);
    const toks = D.verse(s + ':' + v);
    if (!toks) return '';
    const words = toks
      .map((t, i) => {
        const hit = (w && i + 1 === w) || (opts.hl && t.id && t.id === opts.hl);
        return '<span class="vw' + (hit ? ' hl' : '') + '">' + U.esc(t.t) + '</span>';
      })
      .join(' ');
    return (
      '<figure class="verse-ex">' +
      '<blockquote class="quran" lang="ar" dir="rtl">' + words + ' <span class="ayah-num">' + toArabicDigits(v) + '</span></blockquote>' +
      '<figcaption><span>' + U.esc(U.ref(s, v)) + '</span>' +
      '<button class="link-btn" data-verse="' + s + ':' + v + '">' + icon('play') + ' Écouter le verset</button>' +
      (w ? '<button class="link-btn" data-wbw="' + s + ':' + v + ':' + w + '">' + icon('sound') + ' Le mot</button>' : '') +
      '</figcaption></figure>'
    );
  };

  function toArabicDigits(n) {
    return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  }
  ui.arDigits = toArabicDigits;

  /* ---------------------------------------------------------------- carte de vocabulaire */
  ui.freqBadge = function (w) {
    if (!w.n) return '';
    const kind = w.k === 'a' ? 'préfixe' : w.k === 's' ? 'suffixe' : '';
    let s = '<span class="badge badge-freq">' + icon('bolt') + ' ' + U.num(w.n) + ' fois' + (kind ? ' (' + kind + ')' : '') + '</span>';
    if (w.rk && w.rk <= 500) s += '<span class="badge">n° ' + w.rk + ' du Coran</span>';
    return s;
  };

  ui.wordCard = function (w, opts) {
    opts = opts || {};
    const st = Store.state.settings;
    const ex = (w.ex || [])[0];
    const status = SRS.status(w.id);
    const statusLabel = { new: '', learning: 'En apprentissage', young: 'Bien connu', mature: 'Maîtrisé' }[status];
    return (
      '<article class="wcard">' +
      '<div class="wcard-badges">' + ui.freqBadge(w) + (statusLabel && opts.status ? '<span class="badge badge-' + status + '">' + statusLabel + '</span>' : '') + '</div>' +
      '<div class="wcard-main">' +
      '<div class="wcard-ar ar" lang="ar" dir="rtl">' + U.esc(w.ar) + '</div>' +
      ui.sayBtn(w.ar, ex) +
      '</div>' +
      (st.translit ? '<div class="wcard-tr">' + U.esc(w.tr) + '</div>' : '') +
      '<div class="wcard-fr">' + U.esc(w.fr) + '</div>' +
      (w.r ? '<div class="wcard-root">Racine <span class="ar root" lang="ar">' + U.esc(w.r) + '</span></div>' : '') +
      (w.note ? '<p class="wcard-note">' + U.rich(w.note) + '</p>' : '') +
      (ex && !opts.noEx ? '<div class="wcard-ex">' + ui.verseHTML(ex, { hl: w.k === 'w' ? w.id : null }) + '</div>' : '') +
      '</article>'
    );
  };

  ui.showWord = function (id) {
    const w = D.byId[id];
    if (!w) return;
    const body = ui.sheet(ui.wordCard(w, { status: true }) + (w.ex && w.ex[1] ? '<h4 class="mt">Autre exemple</h4>' + ui.verseHTML(w.ex[1], { hl: w.k === 'w' ? w.id : null }) : ''));
    return body;
  };

  /* ---------------------------------------------------------------- anneau de progression */
  ui.ring = function (ratio, size, inner) {
    const r = 42;
    const c = 2 * Math.PI * r;
    const off = c * (1 - Math.max(0, Math.min(1, ratio)));
    return (
      '<div class="ring" style="width:' + size + 'px;height:' + size + 'px">' +
      '<svg viewBox="0 0 100 100"><circle class="ring-bg" cx="50" cy="50" r="' + r + '"/>' +
      '<circle class="ring-fg" cx="50" cy="50" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"' + (ratio <= 0.005 ? ' style="opacity:0"' : '') + '/></svg>' +
      '<div class="ring-inner">' + inner + '</div></div>'
    );
  };

  ui.stars = (n) => '<span class="stars">' + [1, 2, 3].map((i) => icon('star', i <= n ? 'star-on' : 'star-off')).join('') + '</span>';
})();
