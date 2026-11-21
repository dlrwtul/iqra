/* Iqra — pages d'étude : leçon, révisions, entraînement, défi chrono, lecture des sourates. */
(function () {
  'use strict';
  const { U, D, Store, SRS, Audio, Ex, ui } = IQRA;
  const V = (IQRA.views = IQRA.views || {});
  const icon = ui.icon;

  function focusBar(title, closeHref, extra) {
    return (
      '<div class="focus-bar"><a class="btn-icon" href="' + closeHref + '" aria-label="Quitter">' + icon('x') + '</a>' +
      '<div class="focus-title">' + title + '</div><div class="focus-extra">' + (extra || '') + '</div></div>'
    );
  }

  /* ================================================================ LEÇON */
  V.lesson = function (root, id) {
    const l = D.lessonById[id];
    if (!l) return V.notFound(root);
    if (V.lessonState(l) === 'locked') {
      root.innerHTML = '<section class="center-msg card"><div class="big-ic">' + icon('lock') + '</div><h2>Leçon verrouillée</h2><p class="muted">Terminez la leçon précédente avec au moins 70 %, ou activez le mode libre dans les réglages.</p><a class="btn btn-primary" href="#/parcours">Voir le parcours</a></section>';
      return;
    }
    const words = D.lessonWords[l.id] || [];
    const unit = IQRA.units.find((u) => u.id === l.unit);
    const est = D.lessonMinutes(l);
    const start = Date.now();
    const steps = [{ k: 'intro' }]
      .concat(l.theory.map((t, i) => ({ k: 'theory', i })))
      .concat(l.ex && l.ex.length ? [{ k: 'examples' }] : [])
      .concat(words.map((w, i) => ({ k: 'word', i })))
      .concat([{ k: 'exercises' }])
      .concat(l.read ? [{ k: 'read' }] : [])
      .concat([{ k: 'summary' }]);
    let idx = 0;
    let result = null;
    let keyH = null;

    root.innerHTML =
      focusBar('<span class="muted">Leçon ' + (l.index + 1) + '</span> ' + U.esc(l.title), '#/parcours', '<span class="timer-pill">' + icon('clock') + ' <span class="lt">0:00</span> / ' + est + ' min</span>') +
      '<div class="lesson-steps"><div class="dots"></div></div><div class="lesson-body"></div>';
    const body = U.$('.lesson-body', root);
    const dots = U.$('.dots', root);
    const lt = U.$('.lt', root);
    const tick = setInterval(() => (lt.textContent = U.mmss((Date.now() - start) / 1000)), 1000);
    IQRA.app.onLeave(() => {
      clearInterval(tick);
      setKey(null);
      Audio.stop();
    });

    function setKey(fn) {
      if (keyH) document.removeEventListener('keydown', keyH);
      keyH = fn;
      if (fn) document.addEventListener('keydown', fn);
    }

    function phaseOf(k) {
      return k === 'intro' || k === 'theory' || k === 'examples' ? 0 : k === 'word' ? 1 : k === 'exercises' ? 2 : k === 'read' ? 3 : 4;
    }
    function drawDots() {
      const labels = ['Comprendre', 'Mémoriser', 'S’exercer'].concat(l.read ? ['Lire'] : []).concat(['Bilan']);
      const cur = phaseOf(steps[idx].k);
      const map = l.read ? [0, 1, 2, 3, 4] : [0, 1, 2, 4];
      dots.innerHTML = labels.map((lab, i) => '<span class="dot-step' + (map[i] < cur ? ' past' : map[i] === cur ? ' cur' : '') + '">' + lab + '</span>').join('');
    }

    function nav(prevOk, nextLabel) {
      return (
        '<div class="nav-row">' +
        (prevOk ? '<button class="btn btn-ghost" data-nav="-1">' + icon('left') + ' Précédent</button>' : '<span></span>') +
        '<button class="btn btn-primary" data-nav="1">' + (nextLabel || 'Suivant') + ' ' + icon('right') + '</button></div>'
      );
    }

    function go(d) {
      idx = Math.max(0, Math.min(steps.length - 1, idx + d));
      render();
      window.scrollTo({ top: 0 });
    }

    body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-nav]');
      if (b) go(+b.dataset.nav);
    });

    function render() {
      drawDots();
      const s = steps[idx];
      setKey(null);
      Audio.stop();
      if (s.k === 'intro') {
        body.innerHTML =
          '<div class="card lesson-intro"><p class="eyebrow">Étape ' + unit.id + ' · ' + U.esc(unit.title) + '</p><h1>' + U.esc(l.title) + '</h1><p class="lead">' + U.esc(l.goal) + '</p>' +
          '<ul class="intro-meta"><li>' + icon('clock') + ' ≈ ' + est + ' minutes</li><li>' + icon('list') + ' ' + U.plural(words.length, 'nouveau mot', 'nouveaux mots') + '</li>' +
          (l.read ? '<li>' + icon('book') + ' Lecture : ' + l.read.map((r) => U.esc(D.readerById[r[0]].name)).join(' et ') + '</li>' : '') + '</ul>' +
          '<div class="word-preview">' + words.map((w) => '<span class="ar" lang="ar">' + U.esc(w.ar) + '</span>').join('') + '</div>' +
          '<p class="muted small">Déroulé : explication courte → découverte des mots → exercices (les erreurs reviennent) → ' + (l.read ? 'lecture du texte → ' : '') + 'bilan. Les mots rejoignent ensuite vos révisions espacées.</p></div>' +
          nav(false, 'Commencer');
        setKey((e) => e.key === 'Enter' && go(1));
      } else if (s.k === 'theory') {
        const t = l.theory[s.i];
        body.innerHTML =
          '<div class="card theory"><p class="eyebrow">Comprendre · ' + (s.i + 1) + '/' + l.theory.length + '</p><h2>' + U.esc(t.h) + '</h2><p class="lead">' + U.rich(t.p) + '</p>' +
          (t.tbl ? '<div class="tbl">' + t.tbl.map((r) => '<div class="tbl-row"><span class="tbl-ar ar" lang="ar" dir="rtl">' + U.esc(r[0]) + '</span>' + ui.sayBtn(r[0].split('←').pop().split('/')[0]) + '<span class="tbl-fr">' + U.rich(r[1]) + '</span></div>').join('') + '</div>' : '') +
          '</div>' + nav(true);
        setKey(arrowKeys);
      } else if (s.k === 'examples') {
        body.innerHTML =
          '<div class="card theory"><p class="eyebrow">Dans le Coran</p><h2>Exemples à lire à voix haute</h2><div class="examples">' +
          l.ex.map((x) => '<div class="example"><div class="ex-ar quran" lang="ar" dir="rtl">' + U.esc(x[0]) + '</div>' + ui.sayBtn(x[0]) + '<div class="ex-fr">' + U.esc(x[1]) + '</div></div>').join('') +
          '</div></div>' + nav(true, 'Découvrir les mots');
        setKey(arrowKeys);
      } else if (s.k === 'word') {
        const w = words[s.i];
        body.innerHTML = '<p class="eyebrow center">Nouveau mot · ' + (s.i + 1) + '/' + words.length + '</p>' + ui.wordCard(w) + nav(true, s.i === words.length - 1 ? 'Passer aux exercices' : 'Mot suivant');
        setTimeout(() => Audio.say(w.ar, (w.ex || [])[0]), 300);
        setKey(arrowKeys);
      } else if (s.k === 'exercises') {
        body.innerHTML = '<div class="ex-host"></div>';
        Ex.run(U.$('.ex-host', body), Ex.forLesson(l), {
          onLeave: (fn) => IQRA.app.onLeave(fn),
          onDone: (res) => {
            result = res;
            saveResult(res);
            go(1);
          }
        });
      } else if (s.k === 'read') {
        body.innerHTML =
          '<div class="card"><p class="eyebrow">Lire le texte</p><h2>Lecture guidée</h2><p class="muted">Lisez chaque verset à voix haute, puis écoutez la récitation. Touchez un mot pour voir son sens. Les mots soulignés sont ceux que vous avez appris.</p></div>' +
          l.read.map((r) => V.passageHTML(D.readerById[r[0]], r[1], r[2], { interlinear: true, translation: true })).join('') +
          nav(false, 'Voir le bilan');
        V.bindPassage(body);
      } else if (s.k === 'summary') renderSummary();
    }

    function arrowKeys(e) {
      if (e.key === 'ArrowRight' || e.key === 'Enter') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    }

    let covBefore = 0;
    let covAfter = 0;
    let added = 0;
    function saveResult(res) {
      covBefore = SRS.coverage();
      added = 0;
      words.forEach((w) => {
        if (SRS.add(w.id, res.wrong.has(w.id))) added++;
      });
      covAfter = SRS.coverage();
      const st = Store.state;
      const rec = st.lessons[l.id] || { best: 0, count: 0 };
      const pct = Math.round(res.score * 100);
      rec.firstDone = rec.firstDone || (pct >= 70 ? U.today() : 0);
      rec.best = Math.max(rec.best, pct);
      rec.last = pct;
      rec.count += 1;
      rec.done = rec.best >= 70;
      st.lessons[l.id] = rec;
      const day = Store.day();
      day.les += 1;
      Store.addXP(res.xp + (pct >= 70 ? 20 : 5));
      Store.saveNow();
    }

    function renderSummary() {
      const res = result || { score: 0, xp: 0, seconds: (Date.now() - start) / 1000, total: 0, first: 0, bestStreak: 0 };
      const pct = Math.round(res.score * 100);
      const passed = pct >= 70;
      const next = IQRA.lessons[l.index + 1];
      if (passed) ui.confetti();
      body.innerHTML =
        '<div class="card summary">' +
        '<div class="summary-top">' + ui.ring(res.score, 132, '<b>' + pct + ' %</b><small>' + res.first + '/' + res.total + '</small>') +
        '<div><h1>' + (pct >= 90 ? 'Excellent !' : passed ? 'Leçon réussie' : 'Encore un effort') + '</h1>' + ui.stars(V.starsFor(pct)) +
        '<p class="muted">' + (passed ? 'Les mots de cette leçon rejoignent vos révisions : le premier rappel aura lieu demain.' : 'Il faut 70 % pour débloquer la suite. Les mots sont déjà dans vos révisions ; refaites la leçon pour consolider.') + '</p></div></div>' +
        '<div class="stat-row">' +
        '<div class="stat"><b>' + U.mmss((Date.now() - start) / 1000) + '</b><span>durée</span></div>' +
        '<div class="stat"><b>+' + (res.xp + (passed ? 20 : 5)) + '</b><span>XP</span></div>' +
        '<div class="stat"><b>' + res.bestStreak + '</b><span>bonnes réponses d’affilée</span></div>' +
        '<div class="stat"><b>' + added + '</b><span>mots ajoutés aux révisions</span></div></div>' +
        (covAfter > covBefore
          ? '<div class="cov-up"><span>Votre compréhension du Coran</span><b>' + U.pct(covBefore) + ' → ' + U.pct(covAfter) + '</b><div class="meter"><div class="meter-fill" style="width:' + covAfter * 100 + '%"></div></div></div>'
          : '') +
        (res.wrong && res.wrong.size
          ? '<div class="to-review"><h3>À revoir en priorité</h3><div class="chips">' + Array.from(res.wrong).map((id) => '<button class="chip chip-word" data-word="' + id + '"><span class="ar">' + U.esc(D.byId[id].ar) + '</span> ' + U.esc(D.byId[id].fr) + '</button>').join('') + '</div></div>'
          : '') +
        '<div class="row gap wrap center mt">' +
        IQRA.app.sessionNextButton('lesson') +
        (passed && next ? '<a class="btn btn-primary" href="#/lecon/' + next.id + '">Leçon suivante ' + icon('right') + '</a>' : '') +
        '<a class="btn btn-ghost" href="#/lecon/' + l.id + '" data-reload="1">Recommencer</a>' +
        '<a class="btn btn-ghost" href="#/parcours">Parcours</a></div></div>';
      body.addEventListener('click', (e) => {
        const c = e.target.closest('[data-word]');
        if (c) ui.showWord(c.dataset.word);
        const r = e.target.closest('[data-reload]');
        if (r) {
          e.preventDefault();
          IQRA.app.reload();
        }
      });
    }

    render();
  };

  /* ================================================================ RÉVISIONS (cartes SRS) */
  V.review = function (root) {
    const due = SRS.dueList().slice(0, Store.state.settings.maxReviews || 60);
    if (!due.length) return V.reviewEmpty(root);
    const queue = due.map((id) => ({ id, rev: false }));
    const total = due.length;
    const start = Date.now();
    const stats = { n: 0, again: 0, ok: 0 };
    let keyH = null;
    const setKey = (fn) => {
      if (keyH) document.removeEventListener('keydown', keyH);
      keyH = fn;
      if (fn) document.addEventListener('keydown', fn);
    };
    IQRA.app.onLeave(() => {
      setKey(null);
      Audio.stop();
    });

    root.innerHTML = focusBar('Révisions', '#/', '<span class="timer-pill"><span class="rv-left"></span></span>') + '<div class="progress thin"><div class="progress-bar"></div></div><div class="review-body"></div>';
    const body = U.$('.review-body', root);
    const left = U.$('.rv-left', root);
    const bar = U.$('.progress-bar', root);

    function show() {
      const doneCount = total - new Set(queue.map((q) => q.id)).size;
      bar.style.width = (doneCount / total) * 100 + '%';
      left.textContent = 'Reste ' + queue.length;
      if (!queue.length) return finish();
      const item = queue[0];
      const w = D.byId[item.id];
      const card = SRS.card(item.id);
      const reverse = card.reps >= 2 && !item.again && Math.random() < 0.35;
      const st = Store.state.settings;
      body.innerHTML =
        '<div class="flash card">' +
        '<p class="eyebrow center">' + (reverse ? 'Comment dit-on en arabe ?' : 'Que signifie ce mot ?') + '</p>' +
        (reverse
          ? '<div class="flash-fr">' + U.esc(w.fr) + '</div>'
          : '<div class="flash-ar ar" lang="ar" dir="rtl">' + U.esc(w.ar) + '</div>' + ui.sayBtn(w.ar, (w.ex || [])[0])) +
        '<div class="flash-back" hidden></div>' +
        '</div>' +
        '<div class="flash-actions"><button class="btn btn-primary btn-lg reveal">Afficher la réponse <kbd>Espace</kbd></button></div>';
      if (!reverse) setTimeout(() => Audio.say(w.ar, (w.ex || [])[0]), 200);
      const reveal = () => {
        const back = U.$('.flash-back', body);
        back.hidden = false;
        back.innerHTML =
          (reverse ? '<div class="flash-ar ar" lang="ar" dir="rtl">' + U.esc(w.ar) + '</div>' + ui.sayBtn(w.ar, (w.ex || [])[0]) : '<div class="flash-fr">' + U.esc(w.fr) + '</div>') +
          (st.translit ? '<div class="wcard-tr center">' + U.esc(w.tr) + '</div>' : '') +
          (w.r ? '<div class="wcard-root center">Racine <span class="ar root">' + U.esc(w.r) + '</span></div>' : '') +
          (w.ex ? ui.verseHTML(w.ex[0], { hl: w.k === 'w' ? w.id : null }) : '');
        if (reverse) Audio.say(w.ar, (w.ex || [])[0]);
        const pv = SRS.preview(item.id);
        const labels = ['Encore', 'Difficile', 'Bien', 'Facile'];
        U.$('.flash-actions', body).innerHTML =
          '<div class="rate">' + labels.map((lab, i) => '<button class="rate-btn r' + (i + 1) + '" data-r="' + (i + 1) + '"><b>' + lab + '</b><span>' + SRS.ivlLabel(pv[i]) + '</span><kbd>' + (i + 1) + '</kbd></button>').join('') + '</div>';
        U.$('.rate', body).addEventListener('click', (e) => {
          const b = e.target.closest('[data-r]');
          if (b) rate(+b.dataset.r);
        });
        setKey((e) => {
          const n = parseInt(e.key, 10);
          if (n >= 1 && n <= 4) rate(n);
        });
      };
      U.$('.reveal', body).addEventListener('click', reveal);
      setKey((e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          reveal();
        }
      });
    }

    function rate(r) {
      const item = queue.shift();
      SRS.rate(item.id, r);
      stats.n++;
      if (r === 1) {
        stats.again++;
        const pos = Math.min(queue.length, 3 + Math.floor(Math.random() * 3));
        queue.splice(pos, 0, { id: item.id, again: true });
      } else stats.ok++;
      Store.addXP(2);
      show();
    }

    function finish() {
      setKey(null);
      const acc = stats.n ? stats.ok / stats.n : 1;
      ui.confetti();
      body.innerHTML =
        '<div class="card summary"><div class="summary-top">' + ui.ring(acc, 120, '<b>' + total + '</b><small>cartes</small>') +
        '<div><h1>Révisions terminées</h1><p class="muted">Chaque mot reviendra au moment idéal. ' + (SRS.dueTomorrow() ? 'Demain : ' + U.plural(SRS.dueTomorrow(), 'carte', 'cartes') + '.' : '') + '</p></div></div>' +
        '<div class="stat-row"><div class="stat"><b>' + U.mmss((Date.now() - start) / 1000) + '</b><span>durée</span></div>' +
        '<div class="stat"><b>' + Math.round(acc * 100) + ' %</b><span>réussite</span></div>' +
        '<div class="stat"><b>' + stats.again + '</b><span>« Encore »</span></div>' +
        '<div class="stat"><b>+' + stats.n * 2 + '</b><span>XP</span></div></div>' +
        '<div class="row gap wrap center mt">' + IQRA.app.sessionNextButton('review') + '<a class="btn btn-ghost" href="#/">Accueil</a><a class="btn btn-ghost" href="#/chrono">Défi chrono</a></div></div>';
    }

    show();
  };

  V.reviewEmpty = function (root) {
    const known = SRS.knownIds().length;
    const tomorrow = SRS.dueTomorrow();
    root.innerHTML =
      '<section class="center-msg card"><div class="big-ic ok">' + icon('check') + '</div><h2>' + (known ? 'Rien à réviser pour l’instant' : 'Pas encore de mots à réviser') + '</h2>' +
      '<p class="muted">' + (known ? 'Vos ' + known + ' mots sont programmés au moment optimal. ' + (tomorrow ? 'Demain : ' + U.plural(tomorrow, 'carte', 'cartes') + '.' : '') : 'Terminez une leçon : ses mots arriveront ici, programmés selon la répétition espacée.') + '</p>' +
      '<div class="row gap wrap center">' + IQRA.app.sessionNextButton('review') +
      (known >= 4 ? '<a class="btn btn-primary" href="#/entrainement">' + icon('target') + ' Entraînement libre</a><a class="btn btn-ghost" href="#/chrono">' + icon('clock') + ' Défi chrono</a>' : '<a class="btn btn-primary" href="#/parcours">Aller au parcours</a>') +
      '</div></section>';
  };

  /* ================================================================ ENTRAÎNEMENT LIBRE */
  V.practice = function (root) {
    const ids = SRS.knownIds();
    if (ids.length < 4) {
      root.innerHTML = '<section class="center-msg card"><h2>Apprenez d’abord quelques mots</h2><p class="muted">L’entraînement libre utilise les mots de vos leçons terminées.</p><a class="btn btn-primary" href="#/parcours">Aller au parcours</a></section>';
      return;
    }
    root.innerHTML = focusBar('Entraînement libre', '#/plus') + '<div class="ex-host"></div>';
    // priorité aux mots fragiles (intervalle court, oublis)
    const weighted = ids.slice().sort((a, b) => SRS.card(a).ivl - SRS.card(b).ivl + (SRS.card(b).lapses - SRS.card(a).lapses) + (Math.random() - 0.5) * 6);
    const items = Ex.practice(weighted.slice(0, Math.max(12, Math.round(weighted.length * 0.6))), 12);
    Ex.run(U.$('.ex-host', root), items, {
      onLeave: (fn) => IQRA.app.onLeave(fn),
      onDone: (res) => {
        Store.addXP(Math.round(res.xp / 2));
        U.$('.ex-host', root).innerHTML =
          '<div class="card summary"><div class="summary-top">' + ui.ring(res.score, 120, '<b>' + Math.round(res.score * 100) + ' %</b><small>' + res.first + '/' + res.total + '</small>') +
          '<div><h1>Entraînement terminé</h1><p class="muted">L’entraînement libre ne modifie pas votre planning de révision.</p></div></div>' +
          '<div class="row gap wrap center mt"><a class="btn btn-primary" href="#/entrainement" data-reload="1">Recommencer</a><a class="btn btn-ghost" href="#/">Accueil</a></div></div>';
        U.$('[data-reload]', root).addEventListener('click', (e) => {
          e.preventDefault();
          IQRA.app.reload();
        });
      }
    });
  };

  /* ================================================================ DÉFI CHRONO */
  V.chrono = function (root) {
    let pool = SRS.knownIds().map((id) => D.byId[id]);
    let note = '';
    if (pool.length < 8) {
      pool = IQRA.vocab.filter((w) => ['l01', 'l02', 'l03', 'l04'].includes(w.l));
      note = '<p class="muted small">Vous avez encore peu de mots appris : le défi utilise les mots des premières leçons.</p>';
    }
    const best = Store.state.chrono.best;
    root.innerHTML =
      focusBar('Défi chrono', '#/', '') +
      '<section class="center-msg card chrono-intro"><div class="big-ic">' + icon('clock') + '</div><h1>60 secondes</h1>' +
      '<p class="lead">Traduisez le plus de mots possible. +1 par bonne réponse ; une erreur coûte 3 secondes.</p>' + note +
      '<p class="muted">Record : <b>' + best + '</b></p><button class="btn btn-primary btn-lg" id="go">' + icon('play') + ' Lancer le chrono</button></section>';
    let timer = null;
    let keyH = null;
    const setKey = (fn) => {
      if (keyH) document.removeEventListener('keydown', keyH);
      keyH = fn;
      if (fn) document.addEventListener('keydown', fn);
    };
    IQRA.app.onLeave(() => {
      clearInterval(timer);
      setKey(null);
    });
    U.$('#go', root).addEventListener('click', play);

    function play() {
      const DURATION = 60;
      let left = DURATION;
      let score = 0;
      let errors = 0;
      let bag = [];
      const stage = U.h('<section class="chrono"><div class="chrono-head"><div class="chrono-time"><div class="chrono-bar"></div></div><div class="chrono-score">' + icon('bolt') + ' <b>0</b></div></div><div class="chrono-q"></div></section>');
      U.$('.chrono-intro', root).replaceWith(stage);
      const tbar = U.$('.chrono-bar', stage);
      const sc = U.$('.chrono-score b', stage);
      const q = U.$('.chrono-q', stage);
      const t0 = Date.now();
      let penalty = 0;
      timer = setInterval(() => {
        left = DURATION - (Date.now() - t0) / 1000 - penalty;
        tbar.style.width = Math.max(0, (left / DURATION) * 100) + '%';
        tbar.classList.toggle('low', left < 10);
        if (left <= 0) end();
      }, 100);
      function nextQ() {
        if (!bag.length) bag = U.shuffle(pool);
        const w = bag.pop();
        const item = Math.random() < 0.7 ? Ex.mcqArFr(w) : Ex.mcqFrAr(w);
        q.innerHTML = '<div class="q">' + item.prompt.replace(/<button[^>]*data-say[\s\S]*?<\/button>/, '') + '</div><div class="opts' + (item.arOpts ? ' opts-ar' : '') + '">' +
          item.options.map((o, i) => '<button class="opt" data-i="' + i + '"><kbd>' + (i + 1) + '</kbd><span class="opt-txt">' + o.html + '</span></button>').join('') + '</div>';
        let lock = false;
        const choose = (i) => {
          if (lock || left <= 0) return;
          lock = true;
          const ok = item.options[i].ok;
          const btns = U.$$('.opt', q);
          btns[i].classList.add(ok ? 'correct' : 'wrong');
          if (!ok) btns[item.options.findIndex((o) => o.ok)].classList.add('correct');
          Ex.sfx(ok);
          if (ok) score++;
          else {
            errors++;
            penalty += 3;
          }
          sc.textContent = score;
          setTimeout(nextQ, ok ? 220 : 650);
        };
        U.$$('.opt', q).forEach((b) => b.addEventListener('click', () => choose(+b.dataset.i)));
        setKey((e) => {
          const n = parseInt(e.key, 10);
          if (n >= 1 && n <= 4) choose(n - 1);
        });
      }
      function end() {
        clearInterval(timer);
        setKey(null);
        const st = Store.state.chrono;
        const record = score > st.best;
        st.best = Math.max(st.best, score);
        st.games = (st.games || 0) + 1;
        Store.addXP(score);
        Store.saveNow();
        if (record && score > 0) ui.confetti();
        stage.innerHTML =
          '<div class="center-msg card"><div class="big-ic">' + icon('trophy') + '</div><h1>' + score + ' ' + (score > 1 ? 'bonnes réponses' : 'bonne réponse') + '</h1>' +
          '<p class="lead">' + (record && score > 0 ? 'Nouveau record !' : 'Record : ' + st.best) + '</p><p class="muted">' + U.plural(errors, 'erreur', 'erreurs') + ' · +' + score + ' XP</p>' +
          '<div class="row gap wrap center"><button class="btn btn-primary" id="again">' + icon('review') + ' Rejouer</button>' + IQRA.app.sessionNextButton('read') + '<a class="btn btn-ghost" href="#/">Accueil</a></div></div>';
        U.$('#again', stage).addEventListener('click', () => IQRA.app.reload());
      }
      nextQ();
    }
  };

  /* ================================================================ LECTURE */
  V.knownRatio = function (p) {
    let n = 0;
    let k = 0;
    p.verses.forEach((v) =>
      v.w.forEach((w) => {
        n++;
        if (w[2] && SRS.has(w[2])) k++;
      })
    );
    return n ? k / n : 0;
  };

  V.readerList = function (root) {
    root.innerHTML =
      '<section><header class="page-head"><h1>Lecture</h1><p class="muted">Les sourates récitées dans la prière, avec le mot à mot. Le pourcentage indique la part des mots que vous avez déjà appris.</p></header>' +
      '<div class="passages">' +
      IQRA.reader
        .map((p) => {
          const r = V.knownRatio(p);
          const read = Store.state.read[p.id];
          return (
            '<a class="passage-card card" href="#/lecture/' + p.id + '"><div class="pc-top"><span class="pc-num">' + (p.s === 2 ? '2:255' : p.s) + '</span><span class="pc-ar ar" lang="ar">' + U.esc(p.ar) + '</span></div>' +
            '<b>' + U.esc(p.name) + '</b><span class="muted small">' + U.esc(p.meaning) + ' · ' + U.plural(p.verses.length, 'verset', 'versets') + '</span>' +
            '<div class="meter sm"><div class="meter-fill" style="width:' + r * 100 + '%"></div></div><span class="small">' + Math.round(r * 100) + ' % des mots connus' + (read ? ' · ' + icon('check') + ' lue' : '') + '</span></a>'
          );
        })
        .join('') +
      '</div></section>';
  };

  V.passageHTML = function (p, from, to, opts) {
    opts = opts || {};
    const vs = p.verses.filter((v) => (!from || v.v >= from) && (!to || v.v <= to));
    return (
      '<div class="passage' + (opts.interlinear ? ' interlinear' : '') + (opts.translation === false ? ' no-tr' : '') + '" data-p="' + p.id + '">' +
      (p.s !== 9 && p.s !== 1 && (!from || from === 1) && opts.basmala ? '<div class="basmala quran" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>' : '') +
      vs
        .map(
          (v) =>
            '<div class="verse" data-v="' + v.v + '"><div class="verse-ar quran" lang="ar" dir="rtl">' +
            v.w
              .map((w, i) => '<button class="rw' + (w[2] && SRS.has(w[2]) ? ' known' : '') + '" data-w="' + i + '"><span class="rw-ar">' + U.esc(w[0]) + '</span><span class="rw-gl" dir="ltr">' + U.esc(w[1]) + '</span></button>')
              .join('') +
            '<span class="ayah-num">' + ui.arDigits(v.v) + '</span></div>' +
            '<div class="verse-tools"><button class="link-btn" data-verse="' + p.s + ':' + v.v + '">' + icon('play') + ' ' + p.s + ':' + v.v + '</button><p class="verse-tr">' + U.esc(v.t) + '</p></div></div>'
        )
        .join('') +
      '</div>'
    );
  };

  V.bindPassage = function (root) {
    root.addEventListener('click', (e) => {
      const b = e.target.closest('.rw');
      if (!b) return;
      const pEl = b.closest('.passage');
      const vEl = b.closest('.verse');
      const p = D.readerById[pEl.dataset.p];
      const v = p.verses.find((x) => x.v === +vEl.dataset.v);
      const w = v.w[+b.dataset.w];
      const item = w[2] && D.byId[w[2]];
      const loc = p.s + ':' + v.v + ':' + (+b.dataset.w + 1);
      const known = item && SRS.has(item.id);
      const sheet = ui.sheet(
        '<div class="word-pop"><div class="wp-ar quran" lang="ar" dir="rtl">' + U.esc(w[0]) + '</div>' +
          '<button class="btn btn-soft btn-sm" data-wbw="' + loc + '">' + icon('sound') + ' Récitation du mot</button>' +
          '<div class="wp-gl">« ' + U.esc(w[1]) + ' »</div>' +
          (w[3] ? '<div class="wcard-root">Racine <span class="ar root">' + U.esc(w[3]) + '</span></div>' : '') +
          (item
            ? '<div class="wp-item"><span class="muted small">Mot du parcours (' + (known ? 'appris' : 'leçon ' + (D.lessonById[item.l].index + 1)) + ')</span>' +
              '<div class="row gap center-v"><span class="ar wp-lemma">' + U.esc(item.ar) + '</span><span>' + U.esc(item.fr) + '</span></div>' + ui.freqBadge(item) +
              '<div class="row gap wrap mt"><button class="btn btn-ghost btn-sm" data-show="' + item.id + '">Voir la fiche</button>' +
              (!known ? '<button class="btn btn-primary btn-sm" data-learn="' + item.id + '">' + icon('plus') + ' Ajouter à mes révisions</button>' : '') + '</div></div>'
            : '<p class="muted small">Ce mot est moins fréquent : il ne fait pas partie du parcours.</p>') +
          '<p class="muted small">' + U.esc(U.ref(p.s, v.v)) + ', mot ' + (+b.dataset.w + 1) + '</p></div>'
      );
      sheet.addEventListener('click', (ev) => {
        const s = ev.target.closest('[data-show]');
        const l = ev.target.closest('[data-learn]');
        if (s) ui.showWord(s.dataset.show);
        if (l) {
          SRS.add(l.dataset.learn, true);
          Store.saveNow();
          ui.toast('Ajouté : ce mot apparaîtra dans vos révisions.', 'ok');
          U.$$('.rw', root).forEach(() => 0);
          ui.closeSheet();
          b.classList.add('known');
        }
      });
    });
  };

  V.reader = function (root, id) {
    const p = D.readerById[id];
    if (!p) return V.notFound(root);
    const r = V.knownRatio(p);
    const prefs = (Store.state.readerPrefs = Store.state.readerPrefs || { inter: true, tr: true });
    root.innerHTML =
      '<section class="reader"><a class="back" href="#/lecture">' + icon('left') + ' Toutes les sourates</a>' +
      '<header class="reader-head card"><div><p class="eyebrow">' + (p.s === 2 ? 'Sourate Al-Baqara, verset 255' : 'Sourate ' + p.s) + '</p><h1>' + U.esc(p.name) + ' <span class="muted">· ' + U.esc(p.meaning) + '</span></h1>' +
      '<p class="muted">' + U.esc(p.intro) + '</p></div><div class="reader-ar ar" lang="ar">' + U.esc(p.ar) + '</div>' +
      '<div class="reader-known">' + ui.ring(r, 64, '<b>' + Math.round(r * 100) + '%</b>') + '<span class="small muted">des mots<br>connus</span></div></header>' +
      '<div class="reader-tools"><div class="seg"><button data-t="inter" class="' + (prefs.inter ? 'on' : '') + '">Mot à mot</button><button data-t="tr" class="' + (prefs.tr ? 'on' : '') + '">Traduction</button></div>' +
      '<button class="btn btn-primary btn-sm" id="playall">' + icon('play') + ' Écouter tout</button></div>' +
      V.passageHTML(p, 0, 0, { interlinear: prefs.inter, translation: prefs.tr, basmala: true }) +
      '<div class="row center mt"><button class="btn btn-primary" id="mark">' + icon('check') + ' J’ai lu et compris</button></div>' +
      '<p class="muted small center">Traduction indicative du sens, rédigée pour l’apprentissage.</p></section>';
    V.bindPassage(root);
    const pass = U.$('.passage', root);
    root.addEventListener('click', (e) => {
      const t = e.target.closest('[data-t]');
      if (!t) return;
      const k = t.dataset.t;
      prefs[k] = !prefs[k];
      t.classList.toggle('on', prefs[k]);
      pass.classList.toggle(k === 'inter' ? 'interlinear' : 'no-tr', k === 'inter' ? prefs.inter : !prefs.tr);
      Store.save();
    });
    let playing = false;
    const playBtn = U.$('#playall', root);
    playBtn.addEventListener('click', async () => {
      if (playing) {
        playing = false;
        Audio.stop();
        return;
      }
      playing = true;
      playBtn.innerHTML = icon('pause') + ' Arrêter';
      for (const v of p.verses) {
        if (!playing) break;
        const el = U.$('.verse[data-v="' + v.v + '"]', root);
        U.$$('.verse.playing', root).forEach((x) => x.classList.remove('playing'));
        el.classList.add('playing');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const ok = await Audio.verse(p.s, v.v);
        if (!ok) break;
      }
      playing = false;
      U.$$('.verse.playing', root).forEach((x) => x.classList.remove('playing'));
      playBtn.innerHTML = icon('play') + ' Écouter tout';
    });
    IQRA.app.onLeave(() => {
      playing = false;
      Audio.stop();
    });
    U.$('#mark', root).addEventListener('click', () => {
      const first = Store.state.read[p.id] !== U.today();
      Store.state.read[p.id] = U.today();
      if (first) Store.addXP(15);
      Store.saveNow();
      ui.toast(first ? 'Lecture enregistrée : +15 XP' : 'Déjà enregistrée aujourd’hui.', 'ok');
      const nb = IQRA.app.sessionNextButton('read');
      if (nb) U.$('#mark', root).insertAdjacentHTML('afterend', nb);
    });
  };

  V.notFound = function (root) {
    root.innerHTML = '<section class="center-msg card"><h2>Page introuvable</h2><a class="btn btn-primary" href="#/">Accueil</a></section>';
  };
})();
