/* Iqra — routeur, en-tête, session guidée, démarrage. */
(function () {
  'use strict';
  const { U, D, Store, SRS, Stats, Timer, Audio, ui } = IQRA;
  const V = IQRA.views;
  const icon = ui.icon;

  const ROUTES = [
    [/^$/, 'home', V.home, ''],
    [/^parcours$/, 'path', V.path, ''],
    [/^lecon\/(\w+)$/, 'path', V.lesson, 'focus'],
    [/^revision$/, 'review', V.review, 'focus'],
    [/^entrainement$/, 'more', V.practice, 'focus'],
    [/^chrono$/, 'more', V.chrono, 'focus'],
    [/^lecture$/, 'read', V.readerList, ''],
    [/^lecture\/(\w+)$/, 'read', V.reader, 'study'],
    [/^mots$/, 'more', V.words, ''],
    [/^methode$/, 'more', V.method, ''],
    [/^reglages$/, 'more', V.settings, ''],
    [/^plus$/, 'more', V.more, '']
  ];

  const TABS = [
    ['#/', 'home', 'home', 'Accueil'],
    ['#/parcours', 'path', 'path', 'Parcours'],
    ['#/revision', 'review', 'review', 'Réviser'],
    ['#/lecture', 'read', 'book', 'Lecture'],
    ['#/plus', 'more', 'grid', 'Plus']
  ];

  let leaveFns = [];

  const app = (IQRA.app = {
    session: null,
    onLeave(fn) {
      leaveFns.push(fn);
    },
    go(hash) {
      if (location.hash === hash) app.reload();
      else location.hash = hash;
    },
    reload: () => route(),

    applySettings() {
      const st = Store.state.settings;
      const html = document.documentElement;
      if (st.theme === 'auto') html.removeAttribute('data-theme');
      else html.setAttribute('data-theme', st.theme);
      html.setAttribute('data-arsize', st.arSize || 'm');
      updateChips();
    },

    /* ---------------- session guidée : révisions → leçon → lecture */
    startSession() {
      const steps = [];
      if (SRS.dueCount() > 0) steps.push({ k: 'review', href: '#/revision', label: 'Révisions' });
      const next = V.nextLesson();
      if (next && V.lessonState(next) !== 'locked') steps.push({ k: 'lesson', href: '#/lecon/' + next.id, label: 'Leçon ' + (next.index + 1) });
      const p = V.suggestPassage();
      steps.push(p ? { k: 'read', href: '#/lecture/' + p.id, label: 'Lecture : ' + p.name } : { k: 'read', href: '#/chrono', label: 'Défi chrono' });
      app.session = { steps, i: 0 };
      ui.toast('Session lancée : ' + steps.map((s) => s.label).join(' → '), 'info', 4000);
      app.go(steps[0].href);
    },
    stepDone(k) {
      const s = app.session;
      if (!s) return;
      for (let j = s.i; j < s.steps.length; j++) {
        if (s.steps[j].k === k) {
          s.i = j + 1;
          break;
        }
      }
    },
    sessionNextButton(k) {
      if (k) app.stepDone(k);
      const s = app.session;
      if (!s) return '';
      if (s.i >= s.steps.length) {
        app.session = null;
        setTimeout(() => ui.toast('Session du jour terminée. Qu’Allah vous facilite !', 'ok', 4000), 300);
        return '<span class="pill pill-ok">' + icon('check') + ' Session terminée</span>';
      }
      const nx = s.steps[s.i];
      return '<a class="btn btn-primary" href="' + nx.href + '">Étape suivante : ' + U.esc(nx.label) + ' ' + icon('right') + '</a>';
    }
  });

  /* ---------------------------------------------------------------- squelette */
  function shell() {
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<a class="skip" href="#view">Aller au contenu</a>' +
        '<header class="topbar"><div class="topbar-in">' +
        '<a class="brand" href="#/" aria-label="Iqra, accueil"><span class="brand-mark" lang="ar">اقرأ</span><span class="brand-name">Iqra</span></a>' +
        '<nav class="topnav" aria-label="Navigation principale">' + TABS.map((t) => '<a href="' + t[0] + '" data-tab="' + t[1] + '">' + t[3] + '</a>').join('') + '</nav>' +
        '<div class="top-chips"><a class="chip chip-time" href="#/" title="Temps d’étude aujourd’hui"><span class="mini-ring"></span><span class="ct"></span></a>' +
        '<span class="chip chip-flame" title="Série de jours"><span class="cf-ic">' + icon('flame') + '</span><span class="cs"></span></span></div>' +
        '</div></header>' +
        '<main id="view" tabindex="-1"></main>' +
        '<nav class="tabbar" aria-label="Navigation">' +
        TABS.map((t) => '<a href="' + t[0] + '" data-tab="' + t[1] + '">' + icon(t[2]) + '<span>' + t[3] + '</span>' + (t[1] === 'review' ? '<em class="tab-badge" hidden></em>' : '') + '</a>').join('') +
        '</nav>'
    );
  }

  function updateChips() {
    const day = Store.day();
    const goal = Store.state.settings.goal;
    const ratio = Math.min(1, day.sec / (goal * 60));
    const ct = U.$('.ct');
    if (!ct) return;
    ct.textContent = Math.floor(day.sec / 60) + '/' + goal + ' min';
    U.$('.mini-ring').style.setProperty('--p', ratio * 360 + 'deg');
    U.$('.chip-time').classList.toggle('reached', ratio >= 1);
    U.$('.chip-time').classList.toggle('running', Timer.active);
    const streak = Stats.streak();
    U.$('.cs').textContent = streak;
    U.$('.chip-flame').classList.toggle('lit', Stats.dayValid(day, goal));
    const due = SRS.dueCount();
    U.$$('.tab-badge').forEach((b) => {
      b.hidden = !due;
      b.textContent = due > 99 ? '99+' : due;
    });
  }
  let lastChip = 0;
  Timer.on(() => {
    const now = Date.now();
    if (now - lastChip > 900) {
      lastChip = now;
      updateChips();
    }
  });

  /* ---------------------------------------------------------------- routeur */
  function route() {
    leaveFns.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    });
    leaveFns = [];
    ui.closeSheet();
    Audio.stop();
    const path = decodeURIComponent(location.hash.replace(/^#\/?/, '')).replace(/\/$/, '');
    let match = null;
    for (const r of ROUTES) {
      const m = path.match(r[0]);
      if (m) {
        match = { tab: r[1], fn: r[2], mode: r[3], arg: m[1] };
        break;
      }
    }
    const old = document.getElementById('view');
    const view = old.cloneNode(false);
    old.replaceWith(view);
    document.body.classList.toggle('focus-mode', !!match && match.mode === 'focus');
    Timer.setActive(!!match && (match.mode === 'focus' || match.mode === 'study'));
    U.$$('[data-tab]').forEach((a) => a.classList.toggle('active', !!match && a.dataset.tab === match.tab));
    try {
      if (match) match.fn(view, match.arg);
      else V.notFound(view);
    } catch (e) {
      console.error(e);
      view.innerHTML = '<section class="center-msg card"><h2>Oups, une erreur est survenue</h2><p class="muted">' + U.esc(e.message) + '</p><a class="btn btn-primary" href="#/">Accueil</a></section>';
    }
    window.scrollTo(0, 0);
    updateChips();
    const h1 = view.querySelector('h1');
    document.title = (h1 && match && match.tab !== 'home' ? h1.textContent.trim() + ' · ' : '') + 'Iqra — l’arabe du Coran';
  }

  /* ---------------------------------------------------------------- démarrage */
  function start() {
    Store.load();
    D.init();
    Audio.init();
    shell();
    app.applySettings();
    Timer.init();
    window.addEventListener('hashchange', route);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) Store.saveNow();
      else updateChips();
    });
    route();
    if ('serviceWorker' in navigator && /^https?:/.test(location.protocol) && !/localhost|127\.0\.0\.1/.test(location.hostname)) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
