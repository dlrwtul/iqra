/* Iqra — routeur, en-tête, session guidée, démarrage. */
(function () {
  'use strict';
  const { U, D, Store, SRS, Stats, Timer, Audio, ui } = IQRA;
  const V = IQRA.views;
  const icon = ui.icon;

  const ROUTES = [
    [/^(?:accueil)?$/, 'home', V.home, ''],
    [/^parcours$/, 'path', V.path, ''],
    [/^lecon[-/](\w+)$/, 'path', V.lesson, 'focus'],
    [/^revision$/, 'review', V.review, 'focus'],
    [/^entrainement$/, 'more', V.practice, 'focus'],
    [/^chrono$/, 'more', V.chrono, 'focus'],
    [/^lecture$/, 'read', V.readerList, ''],
    [/^lecture[-/](\w+)$/, 'read', V.reader, 'study'],
    [/^mots$/, 'more', V.words, ''],
    [/^methode$/, 'more', V.method, ''],
    [/^reglages$/, 'more', V.settings, ''],
    [/^plus$/, 'more', V.more, '']
  ];

  const TABS = [
    ['#accueil', 'home', 'home', 'Accueil'],
    ['#parcours', 'path', 'path', 'Parcours'],
    ['#revision', 'review', 'review', 'Réviser'],
    ['#lecture', 'read', 'book', 'Lecture'],
    ['#plus', 'more', 'grid', 'Plus']
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

    /** Lien « ← retour » d'une sous-page : vers la page d'où l'on vient si c'est une page principale, sinon vers le parent. */
    lastPage: '',
    backLink(parentHref, parentLabel) {
      const LABELS = { '#accueil': 'Accueil', '#plus': 'Plus', '#parcours': 'Parcours', '#lecture': 'Lecture', '#mots': 'Mes mots' };
      const here = '#' + decodeURIComponent(location.hash.replace(/^#\/?/, ''));
      const from = app.lastPage && app.lastPage !== here && LABELS[app.lastPage] ? app.lastPage : parentHref;
      return '<a class="back" href="' + from + '">' + icon('left') + ' ' + U.esc(LABELS[from] || parentLabel) + '</a>';
    },

    applySettings() {
      const st = Store.state.settings;
      const html = document.documentElement;
      // Ne retirer data-theme que si c'est Iqra qui l'a posé (l'hôte d'une page partagée peut le fixer lui-même).
      if (st.theme === 'auto') {
        if (html.dataset.iqraTheme) {
          html.removeAttribute('data-theme');
          delete html.dataset.iqraTheme;
        }
      } else {
        html.setAttribute('data-theme', st.theme);
        html.dataset.iqraTheme = '1';
      }
      html.setAttribute('data-arsize', st.arSize || 'm');
      updateChips();
    },

    /* ---------------- session guidée : révisions → leçon → lecture */
    startSession() {
      const steps = [];
      if (SRS.dueCount() > 0) steps.push({ k: 'review', href: '#revision', label: 'Révisions' });
      const next = V.nextLesson();
      if (next && V.lessonState(next) !== 'locked') steps.push({ k: 'lesson', href: '#lecon-' + next.id, label: 'Leçon ' + (next.index + 1) });
      const p = V.suggestPassage();
      steps.push(p ? { k: 'read', href: '#lecture-' + p.id, label: 'Lecture : ' + p.name } : { k: 'read', href: '#chrono', label: 'Défi chrono' });
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
        '<a class="brand" href="#accueil" aria-label="Iqra, accueil"><span class="brand-mark" lang="ar">اقرأ</span><span class="brand-name">Iqra</span></a>' +
        '<nav class="topnav" aria-label="Navigation principale">' + TABS.map((t) => '<a href="' + t[0] + '" data-tab="' + t[1] + '">' + t[3] + '</a>').join('') + '</nav>' +
        '<div class="top-chips"><a class="chip chip-time" href="#accueil" title="Temps d’étude aujourd’hui"><span class="mini-ring"></span><span class="ct"></span></a>' +
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
    U.$$('#toasts .toast-warn').forEach((t) => t.parentNode.removeChild(t));
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
    U.$$('[data-tab]').forEach((a) => a.classList.toggle('active', !!match && a.dataset.tab === match.tab));
    let mode = match ? match.mode : '';
    try {
      if (match) {
        // Une page d'étude sans rien à étudier (révisions vides…) renvoie 'page' : barres de navigation visibles.
        if (match.fn(view, match.arg) === 'page') mode = '';
      } else V.notFound(view);
    } catch (e) {
      console.error(e);
      mode = '';
      view.innerHTML = '<section class="center-msg card"><h2>Oups, une erreur est survenue</h2><p class="muted">' + U.esc(e.message) + '</p><a class="btn btn-primary" href="#accueil">Accueil</a></section>';
    }
    document.body.classList.toggle('focus-mode', mode === 'focus');
    Timer.setActive(mode === 'focus' || mode === 'study');
    // Dernière page « normale » visitée : c'est là que ramène le bouton retour des pages d'étude.
    // (Les pages d'étude vides n'en font pas partie : y revenir ne mènerait nulle part.)
    if (!match || match.mode !== 'focus') app.lastPage = '#' + (path || 'accueil');
    window.scrollTo(0, 0);
    updateChips();
    IQRA.LocalDB.daily();
    IQRA.LocalDB.autoProtect();
    const h1 = view.querySelector('h1');
    document.title = (h1 && match && match.tab !== 'home' ? h1.textContent.trim() + ' · ' : '') + (IQRA.embedded ? 'Iqra' : 'Iqra — l’arabe du Coran');
  }

  /* ---------------------------------------------------------------- typographie française
     Espace fine insécable avant : ; ! ? » et après «, apostrophe typographique. */
  const NNBSP = '\u202F';
  const TYPO_TEST = /\s[:;!?»]|«\s|[A-Za-zÀ-ÿ]'[A-Za-zÀ-ÿ]|(?:^|[\s(])-[a-zâîû]/;
  function typoText(t) {
    const v = t.nodeValue;
    if (!v || !TYPO_TEST.test(v)) return;
    const nv = v
      .replace(/[ \u00A0]([:;!?»])/g, NNBSP + '$1')
      .replace(/«[ \u00A0]/g, '«' + NNBSP)
      .replace(/([A-Za-zÀ-ÿ])'([A-Za-zÀ-ÿ])/g, '$1’$2')
      .replace(/(^|[\s(])-(?=[a-zâîû])/g, '$1‑');
    if (nv !== v) t.nodeValue = nv;
  }
  function typo(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const list = [];
    while (w.nextNode()) list.push(w.currentNode);
    list.forEach(typoText);
  }
  function watchTypo() {
    new MutationObserver((muts) => {
      muts.forEach((m) =>
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 3) typoText(n);
          else if (n.nodeType === 1 && n.tagName !== 'SCRIPT') typo(n);
        })
      );
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ---------------------------------------------------------------- démarrage */
  function start() {
    Store.load();
    D.init();
    Audio.init();
    if (IQRA.embedded) document.documentElement.classList.add('embedded');
    watchTypo();
    shell();
    U.$('.skip').addEventListener('click', (e) => {
      e.preventDefault();
      U.$('#view').focus();
    });
    app.applySettings();
    Timer.init();
    window.addEventListener('hashchange', route);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        Store.saveNow();
        IQRA.Cloud.push();
      } else updateChips();
    });
    route();
    // Base locale d'abord (la copie la plus récente l'emporte), puis compte claude.ai s'il y en a un.
    IQRA.LocalDB.init().then(
      () => IQRA.Cloud.init(),
      () => IQRA.Cloud.init()
    );
    if (!IQRA.embedded && 'serviceWorker' in navigator && /^https?:/.test(location.protocol) && !/localhost|127\.0\.0\.1/.test(location.hostname)) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
