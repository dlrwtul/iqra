/* Iqra — pages : accueil, parcours, lexique, méthode, réglages, plus. */
(function () {
  'use strict';
  const { U, D, Store, SRS, Stats, Audio, ui } = IQRA;
  const V = (IQRA.views = IQRA.views || {});
  const icon = ui.icon;

  /* ---------------------------------------------------------------- état des leçons */
  V.lessonState = function (l) {
    const rec = Store.state.lessons[l.id];
    if (rec && rec.done) return 'done';
    if (Store.state.settings.free || l.index === 0) return 'open';
    const prev = IQRA.lessons[l.index - 1];
    const prec = Store.state.lessons[prev.id];
    return prec && prec.done ? 'open' : 'locked';
  };
  V.nextLesson = () => IQRA.lessons.find((l) => V.lessonState(l) !== 'done') || null;
  V.lessonsDone = () => IQRA.lessons.filter((l) => V.lessonState(l) === 'done').length;
  V.starsFor = (best) => (best >= 90 ? 3 : best >= 80 ? 2 : best >= 70 ? 1 : 0);

  /* ---------------------------------------------------------------- accueil */
  const TIPS = [
    "Mieux vaut 15 minutes chaque jour qu’une heure le dimanche : la régularité ancre la mémoire à long terme.",
    "Faites vos révisions en premier : c’est le moment où l’oubli se combat le plus efficacement.",
    "Récitez à voix haute les mots et les versets : la mémoire auditive renforce la mémoire visuelle.",
    "Pendant la prière, essayez de penser au sens de chaque mot d’Al-Fâtiha que vous avez appris.",
    "Une erreur n’est pas un échec : se tromper puis corriger grave mieux l’information qu’une réponse facile.",
    "Cherchez la racine de chaque nouveau mot : elle vous relie à toute une famille de mots déjà connus.",
    "Notez votre « Encore » sans tricher : l’algorithme ne peut vous aider que si vous êtes honnête.",
    "Écoutez la récitation d’une sourate étudiée en suivant le mot à mot : c’est de l’input compréhensible."
  ];

  V.home = function (root) {
    const st = Store.state;
    const day = Store.day();
    const goal = st.settings.goal;
    const due = SRS.dueCount();
    const next = V.nextLesson();
    const cov = SRS.coverage();
    const counts = SRS.counts();
    const streak = Stats.streak();
    const done = V.lessonsDone();
    const hello = 'As-salâmu ʿalaykum';
    const minutes = Math.floor(day.sec / 60);
    const fresh = done === 0 && counts.total === 0;

    // étapes de la session du jour
    const steps = [];
    steps.push({
      key: 'review', icon: 'review', title: 'Révisions',
      sub: due ? U.plural(due, 'carte à réviser', 'cartes à réviser') + ' · ≈ ' + Math.max(1, Math.round(due * 0.15)) + ' min' : counts.total ? 'Rien à réviser aujourd’hui' : 'Débloquées après votre première leçon',
      done: due === 0 && counts.total > 0, href: due ? '#/revision' : counts.total ? '#/entrainement' : null, cta: due ? 'Réviser' : 'S’entraîner'
    });
    if (next) {
      const lr = st.lessons[next.id];
      const doneToday = day.les > 0;
      const label = 'Leçon ' + (next.index + 1) + ' · ' + next.title;
      steps.push({
        key: 'lesson', icon: 'layers', title: doneToday ? 'Leçon du jour terminée' : label,
        sub: (doneToday ? 'En bonus : ' + label + ' · ' : '') + '≈ ' + D.lessonMinutes(next) + ' min · ' + U.plural((D.lessonWords[next.id] || []).length, 'mot', 'mots') + (lr ? ' · meilleur score ' + lr.best + ' %' : ''),
        done: doneToday, href: V.lessonState(next) === 'locked' ? null : '#/lecon/' + next.id, cta: doneToday ? 'Continuer' : lr ? 'Reprendre' : 'Commencer'
      });
    } else {
      steps.push({ key: 'lesson', icon: 'layers', title: 'Parcours terminé, félicitations !', sub: 'Continuez les révisions pour garder vos mots à vie.', done: true, href: '#/parcours', cta: 'Revoir' });
    }
    const passage = V.suggestPassage();
    steps.push({
      key: 'read', icon: 'book', title: passage ? 'Lecture : ' + passage.name : 'Défi chrono',
      sub: passage ? 'Relire avec le mot à mot · ≈ 3 min' : '60 secondes pour réactiver vos mots',
      done: passage ? st.read[passage.id] === U.today() : false, href: passage ? '#/lecture/' + passage.id : '#/chrono', cta: passage ? 'Lire' : 'Jouer'
    });

    const week = Stats.week();
    const maxSec = Math.max(goal * 60, ...week.map((d) => d.sec));
    const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

    root.innerHTML =
      '<section class="home">' +
      '<header class="hello"><div><p class="eyebrow">' + hello + '</p><h1>' + (fresh ? 'Bienvenue sur Iqra' : 'Votre séance du jour') + '</h1>' +
      '<p class="muted">' + (fresh ? 'Comprendre le Coran, un mot fréquent à la fois.' : new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })) + '</p></div>' +
      '<div class="hello-ar ar" lang="ar">اقْرَأْ</div></header>' +

      (fresh
        ? '<div class="card hero"><div><h2>Comprenez ' + U.pct(IQRA.stats.covered / IQRA.stats.tokens, 0) + ' des mots du Coran</h2><p>Les ' + U.num(IQRA.stats.words) + ' mots de ce parcours représentent <b>' + U.pct(IQRA.stats.covered / IQRA.stats.tokens, 0) + '</b> des ' + U.num(IQRA.stats.tokens) +
          ' mots du texte coranique. Chaque leçon dure 15 à 20 minutes : explication courte, mots fréquents, exercices, puis lecture d’un vrai verset.</p>' +
          '<div class="row gap wrap"><a class="btn btn-primary btn-lg" href="#/lecon/l01">' + icon('play') + ' Commencer la leçon 1</a><a class="btn btn-ghost" href="#/methode">Découvrir la méthode</a></div></div></div>'
        : '') +

      '<div class="grid-2">' +
      '<div class="card today">' +
      ui.ring(day.sec / (goal * 60), 112, '<b>' + minutes + '</b><small>/ ' + goal + ' min</small>') +
      '<div class="today-txt"><h3>Objectif du jour</h3><p class="muted">' + (day.sec >= goal * 60 ? 'Atteint, bravo ! Tout ce qui suit est du bonus.' : 'Encore ' + Math.max(1, goal - minutes) + ' min d’étude active.') + '</p>' +
      '<div class="chips"><span class="chip chip-flame">' + icon('flame') + ' ' + U.plural(streak, 'jour', 'jours') + '</span><span class="chip">' + icon('bolt') + ' ' + U.num(st.xp) + ' XP</span></div></div>' +
      '</div>' +
      '<div class="card coverage">' +
      '<h3>Votre compréhension du Coran</h3>' +
      '<div class="big-num">' + U.pct(cov) + '</div>' +
      '<div class="meter"><div class="meter-fill" style="width:' + (cov * 100).toFixed(2) + '%"></div><div class="meter-goal" style="left:' + (IQRA.stats.covered / IQRA.stats.tokens * 100).toFixed(1) + '%" title="Objectif du parcours"></div></div>' +
      '<p class="muted small">des ' + U.num(IQRA.stats.tokens) + ' mots du texte sont des mots que vous avez appris · ' + U.plural(counts.total, 'mot appris', 'mots appris') + ' · ' + done + '/' + IQRA.lessons.length + ' leçons</p>' +
      '</div></div>' +

      '<div class="card session"><div class="row between center-v"><h3>Session du jour</h3>' +
      '<button class="btn btn-primary" id="start-session">' + icon('play') + ' Démarrer</button></div>' +
      '<ol class="steps">' +
      steps
        .map(
          (s, i) =>
            '<li class="step' + (s.done ? ' done' : '') + '"><span class="step-num">' + (s.done ? icon('check') : i + 1) + '</span>' +
            '<div class="step-txt"><b>' + U.esc(s.title) + '</b><span class="muted small">' + U.esc(s.sub) + '</span></div>' +
            (s.href ? '<a class="btn btn-soft btn-sm" href="' + s.href + '">' + s.cta + '</a>' : '<span class="muted small">' + icon('lock') + '</span>') +
            '</li>'
        )
        .join('') +
      '</ol></div>' +

      '<div class="grid-2">' +
      '<div class="card"><h3>7 derniers jours</h3><div class="bars">' +
      week
        .map((d) => {
          const hgt = Math.round((d.sec / maxSec) * 100);
          const dow = new Date(d.idx * 86400000).getUTCDay();
          return '<div class="bar-col' + (d.idx === U.today() ? ' today' : '') + '" title="' + U.minutes(d.sec) + ' min"><div class="bar-track"><div class="bar' + (d.valid ? ' valid' : '') + '" style="height:' + hgt + '%"></div></div><span>' + days[dow] + '</span></div>';
        })
        .join('') +
      '<div class="bar-goal" style="bottom:' + (22 + Math.round(((goal * 60) / maxSec) * 96)) + 'px" title="Objectif : ' + goal + ' min"></div>' +
      '</div><p class="muted small">Temps d’étude total : ' + U.plural(U.minutes(Stats.totalSec()), 'minute', 'minutes') + '</p></div>' +
      '<div class="card tip"><h3>' + icon('bulb') + ' Conseil</h3><p>' + U.esc(TIPS[U.today() % TIPS.length]) + '</p>' +
      '<div class="row gap wrap mt"><a class="btn btn-ghost btn-sm" href="#/chrono">' + icon('clock') + ' Défi 60 s</a><a class="btn btn-ghost btn-sm" href="#/mots">' + icon('list') + ' Mes mots</a></div></div>' +
      '</div></section>';

    U.$('#start-session', root).addEventListener('click', () => IQRA.app.startSession());
  };

  V.suggestPassage = function () {
    // le passage de la dernière leçon de lecture terminée, sinon Al-Fâtiha si la leçon 1 est faite
    const doneReads = IQRA.lessons.filter((l) => l.read && V.lessonState(l) === 'done');
    if (!doneReads.length) return Store.state.lessons.l01 ? D.readerById.fatiha : null;
    const last = doneReads[doneReads.length - 1];
    return D.readerById[last.read[last.read.length - 1][0]];
  };

  /* ---------------------------------------------------------------- parcours */
  V.path = function (root) {
    const next = V.nextLesson();
    let html = '<section class="path"><header class="page-head"><h1>Parcours</h1><p class="muted">' + IQRA.lessons.length + ' leçons en 7 étapes, des mots les plus fréquents aux plus spécifiques. ' +
      (Store.state.settings.free ? 'Mode libre activé : toutes les leçons sont ouvertes.' : 'Obtenez au moins 70 % pour débloquer la leçon suivante.') + '</p></header>';
    IQRA.units.forEach((u) => {
      const ls = IQRA.lessons.filter((l) => l.unit === u.id);
      const nDone = ls.filter((l) => V.lessonState(l) === 'done').length;
      const words = ls.reduce((a, l) => a + (D.lessonWords[l.id] || []).filter((w) => w.k === 'w').reduce((s, w) => s + w.n, 0), 0);
      html +=
        '<div class="unit"><div class="unit-head"><div class="unit-num">' + u.id + '</div><div class="unit-txt"><h2>' + U.esc(u.title) + '</h2><p class="muted small">' + U.esc(u.desc) +
        ' · couvre ' + U.pct(words / IQRA.stats.tokens) + ' du Coran</p></div><div class="unit-ar ar" lang="ar">' + u.ar + '</div></div>' +
        '<div class="unit-progress"><div style="width:' + (nDone / ls.length) * 100 + '%"></div></div><ul class="lessons">';
      ls.forEach((l) => {
        const s = V.lessonState(l);
        const rec = Store.state.lessons[l.id];
        const isNext = next && next.id === l.id;
        const ws = D.lessonWords[l.id] || [];
        html +=
          '<li><a class="lesson ' + s + (isNext ? ' next' : '') + (l.reading ? ' reading' : '') + '" href="' + (s === 'locked' ? '#/parcours' : '#/lecon/' + l.id) + '"' + (s === 'locked' ? ' aria-disabled="true" data-locked="1"' : '') + '>' +
          '<span class="lesson-badge">' + (s === 'done' ? icon('check') : s === 'locked' ? icon('lock') : l.reading ? icon('book') : l.index + 1) + '</span>' +
          '<span class="lesson-txt"><b>' + U.esc(l.title) + '</b><span class="muted small">' + U.esc(l.goal) + '</span>' +
          '<span class="lesson-meta">' + icon('clock') + ' ' + D.lessonMinutes(l) + ' min · ' + U.plural(ws.length, 'mot', 'mots') + (rec ? ' · ' + rec.best + ' %' : '') + '</span></span>' +
          (rec && rec.done ? ui.stars(V.starsFor(rec.best)) : isNext ? '<span class="pill">À suivre</span>' : '') +
          '</a></li>';
      });
      html += '</ul></div>';
    });
    html += '</section>';
    root.innerHTML = html;
    root.addEventListener('click', (e) => {
      const a = e.target.closest('[data-locked]');
      if (a) {
        e.preventDefault();
        ui.toast('Terminez d’abord la leçon précédente (≥ 70 %), ou activez le mode libre dans les réglages.', 'info');
      }
    });
  };

  /* ---------------------------------------------------------------- lexique */
  V.words = function (root) {
    const counts = SRS.counts();
    root.innerHTML =
      '<section class="words"><header class="page-head"><h1>Mes mots</h1><p class="muted">' + U.num(IQRA.vocab.length) + ' éléments : ' + IQRA.vocab.filter((w) => w.k === 'w').length + ' mots, ' + IQRA.vocab.filter((w) => w.k === 'a').length + ' préfixes et ' + IQRA.vocab.filter((w) => w.k === 's').length + ' pronoms suffixes. Classés par leçon ou par fréquence dans le Coran.</p></header>' +
      '<div class="stat-row">' +
      '<div class="stat"><b>' + counts.total + '</b><span>appris</span></div>' +
      '<div class="stat"><b>' + counts.learning + '</b><span>en apprentissage</span></div>' +
      '<div class="stat"><b>' + counts.young + '</b><span>bien connus</span></div>' +
      '<div class="stat"><b>' + counts.mature + '</b><span>maîtrisés</span></div></div>' +
      '<div class="toolbar"><label class="search">' + icon('search') + '<input type="search" placeholder="Rechercher (arabe, français, translittération)" aria-label="Rechercher"></label>' +
      '<div class="seg" role="tablist"><button data-f="all" class="on">Tous</button><button data-f="known">Appris</button><button data-f="new">À apprendre</button></div>' +
      '<div class="seg"><button data-s="lesson" class="on">Par leçon</button><button data-s="freq">Par fréquence</button></div></div>' +
      '<div class="word-list"></div></section>';
    const list = U.$('.word-list', root);
    let f = 'all';
    let s = 'lesson';
    let q = '';
    const norm = (x) => String(x).normalize('NFD').replace(/[̀-ًͯ-ٰٟ]/g, '').toLowerCase();
    function draw() {
      let items = IQRA.vocab.filter((w) => (f === 'all' ? true : f === 'known' ? SRS.has(w.id) : !SRS.has(w.id)));
      if (q) {
        const nq = norm(q);
        items = items.filter((w) => norm(w.fr).includes(nq) || norm(w.tr).includes(nq) || norm(w.ar).includes(nq));
      }
      if (s === 'freq') items = items.slice().sort((a, b) => b.n - a.n);
      let html = '';
      let cur = null;
      items.forEach((w) => {
        if (s === 'lesson' && w.l !== cur) {
          cur = w.l;
          const l = D.lessonById[w.l];
          html += '<h3 class="list-head">Leçon ' + (l.index + 1) + ' · ' + U.esc(l.title) + '</h3>';
        }
        const stt = SRS.status(w.id);
        html +=
          '<button class="wrow" data-id="' + w.id + '"><span class="dot dot-' + stt + '" title="' + stt + '"></span>' +
          '<span class="wrow-ar ar" lang="ar" dir="rtl">' + U.esc(w.ar) + '</span>' +
          '<span class="wrow-fr"><b>' + U.esc(w.fr) + '</b><span class="muted small">' + U.esc(w.tr) + '</span></span>' +
          '<span class="wrow-n">' + (w.n ? U.num(w.n) + '×' : '') + '</span></button>';
      });
      list.innerHTML = html || '<p class="empty">Aucun mot ne correspond.</p>';
    }
    root.addEventListener('click', (e) => {
      const fb = e.target.closest('[data-f]');
      const sb = e.target.closest('[data-s]');
      const row = e.target.closest('.wrow');
      if (fb) {
        f = fb.dataset.f;
        U.$$('[data-f]', root).forEach((b) => b.classList.toggle('on', b === fb));
        draw();
      } else if (sb) {
        s = sb.dataset.s;
        U.$$('[data-s]', root).forEach((b) => b.classList.toggle('on', b === sb));
        draw();
      } else if (row) ui.showWord(row.dataset.id);
    });
    U.$('input', root).addEventListener('input', U.debounce((e) => {
      q = e.target.value.trim();
      draw();
    }, 150));
    draw();
  };

  /* ---------------------------------------------------------------- plus */
  V.more = function (root) {
    const counts = SRS.counts();
    const tiles = [
      ['#/mots', 'list', 'Mes mots', 'Le lexique complet, avec fréquences et exemples'],
      ['#/chrono', 'clock', 'Défi chrono', '60 secondes pour répondre au maximum de questions'],
      ['#/entrainement', 'target', 'Entraînement libre', 'Exercices variés sur vos mots, sans pression'],
      ['#/methode', 'bulb', 'La méthode', 'Pourquoi et comment ce parcours fonctionne'],
      ['#/reglages', 'settings', 'Réglages', 'Objectif, affichage, audio, sauvegarde']
    ];
    root.innerHTML =
      '<section><header class="page-head"><h1>Plus</h1></header>' +
      '<div class="stat-row">' +
      '<div class="stat"><b>' + U.num(U.minutes(Stats.totalSec())) + '</b><span>minutes d’étude</span></div>' +
      '<div class="stat"><b>' + U.num(Store.state.xp) + '</b><span>XP</span></div>' +
      '<div class="stat"><b>' + counts.total + '</b><span>mots appris</span></div>' +
      '<div class="stat"><b>' + Store.state.chrono.best + '</b><span>record chrono</span></div></div>' +
      '<div class="tiles">' +
      tiles.map((t) => '<a class="tile" href="' + t[0] + '"><span class="tile-ic">' + icon(t[1]) + '</span><b>' + t[2] + '</b><span class="muted small">' + t[3] + '</span></a>').join('') +
      '</div></section>';
  };

  /* ---------------------------------------------------------------- méthode */
  V.method = function (root) {
    const s = IQRA.stats;
    const pillars = [
      ['bolt', 'La fréquence d’abord', 'Le Coran compte ' + U.num(s.tokens) + ' mots, mais quelques centaines de mots reviennent sans cesse. Les ' + U.num(s.words) + ' mots de ce parcours couvrent ' + U.pct(s.covered / s.tokens, 0) + ' du texte : chaque mot appris est choisi pour son utilité réelle (loi de Pareto).'],
      ['review', 'La répétition espacée', 'Chaque mot revient juste avant que vous ne l’oubliiez : le lendemain, puis 4 jours plus tard, puis 10 jours, un mois… (algorithme de type SM-2, celui d’Anki). C’est la méthode la plus efficace connue pour la mémoire à long terme.'],
      ['target', 'Le rappel actif', 'On n’apprend pas en relisant, mais en cherchant la réponse. Chaque mot est testé dans les deux sens (arabe → français, français → arabe), en contexte, et les erreurs reviennent jusqu’à être corrigées.'],
      ['layers', 'Les racines et les schèmes', 'L’arabe construit ses mots sur des racines de trois lettres et des « moules ». Comprendre ce système permet de deviner des centaines de mots nouveaux à partir de ceux que vous connaissez.'],
      ['book', 'Le vrai texte, dès le premier jour', 'Pas de phrases artificielles : vous commencez par Al-Fâtiha et chaque leçon de lecture porte sur une sourate que vous récitez. Les versets d’exemple sont choisis pour contenir un maximum de mots déjà connus (input compréhensible).'],
      ['clock', 'Des séances courtes et chronométrées', 'Une séance de 15 à 20 minutes par jour : révisions, nouvelle leçon, lecture. Le chronomètre ne compte que le temps d’étude active, l’objectif quotidien et la série entretiennent la régularité.']
    ];
    root.innerHTML =
      '<section class="method"><header class="page-head"><h1>La méthode Iqra</h1><p class="muted">Inspirée des approches les plus efficaces : apprentissage par fréquence (type « Understand Quran »), répétition espacée, rappel actif, enseignement par racines et lecture du texte réel.</p></header>' +
      '<div class="pillars">' + pillars.map((p) => '<div class="card pillar"><span class="tile-ic">' + icon(p[0]) + '</span><h3>' + p[1] + '</h3><p>' + U.esc(p[2]) + '</p></div>').join('') + '</div>' +
      '<div class="card"><h2>Votre routine quotidienne (15 à 20 min)</h2><ol class="routine">' +
      '<li><b>Révisions — 5 min.</b> Les cartes du jour d’abord : c’est là que se joue la mémoire à long terme. Soyez honnête : « Encore » si vous avez hésité longtemps.</li>' +
      '<li><b>Nouvelle leçon — 10 min.</b> Explication courte, découverte des mots, exercices variés. Visez 80 % ou plus ; refaites la leçon le lendemain sinon.</li>' +
      '<li><b>Lecture — 3 à 5 min.</b> Relisez la sourate étudiée avec le mot à mot, écoutez la récitation et répétez à voix haute.</li></ol>' +
      '<p class="muted">Rythme conseillé : une leçon par jour, 5 à 6 jours par semaine. Le parcours se termine en 5 à 6 semaines ; les révisions continuent ensuite quelques minutes par jour.</p></div>' +
      '<div class="card"><h2>Le Coran en chiffres</h2><div class="stat-row">' +
      '<div class="stat"><b>' + U.num(s.tokens) + '</b><span>mots</span></div><div class="stat"><b>' + U.num(s.lemmas) + '</b><span>mots distincts (lemmes)</span></div>' +
      '<div class="stat"><b>' + U.num(s.roots) + '</b><span>racines</span></div><div class="stat"><b>' + U.pct(s.covered / s.tokens, 0) + '</b><span>couverts par ce parcours</span></div></div>' +
      '<p class="muted small">Fréquences calculées sur le Quranic Arabic Corpus. Un mot compte pour toutes ses formes (par exemple, قَالَ inclut يَقُولُ et قُلْ) ; les préfixes et pronoms suffixes sont enseignés à part.</p></div>' +
      '<div class="card"><h2>Sources et crédits</h2><ul class="credits">' +
      '<li>Texte coranique (écriture uthmanie) et analyse morphologique : <a href="https://corpus.quran.com" target="_blank" rel="noopener">Quranic Arabic Corpus</a> (Université de Leeds), d’après le texte de Tanzil.</li>' +
      '<li>Récitations des versets : <a href="https://everyayah.com" target="_blank" rel="noopener">EveryAyah</a> ; récitation mot à mot : <a href="https://quran.com" target="_blank" rel="noopener">Quran.com</a>.</li>' +
      '<li>Gloses et traductions en français : traductions indicatives du sens, rédigées pour l’apprentissage. Elles ne remplacent pas une traduction de référence ni l’exégèse.</li></ul></div>' +
      '</section>';
  };

  /* ---------------------------------------------------------------- réglages */
  V.settings = function (root) {
    const st = Store.state.settings;
    const opt = (v, cur, label) => '<option value="' + v + '"' + (String(v) === String(cur) ? ' selected' : '') + '>' + label + '</option>';
    root.innerHTML =
      '<section class="settings"><header class="page-head"><h1>Réglages</h1></header>' +
      '<div class="card form">' +
      '<label class="field"><span>Objectif quotidien</span><select data-k="goal" data-num="1">' + [5, 10, 15, 20, 30, 45].map((m) => opt(m, st.goal, m + ' minutes')).join('') + '</select></label>' +
      '<label class="field"><span>Révisions maximum par séance</span><select data-k="maxReviews" data-num="1">' + [20, 40, 60, 100, 200].map((m) => opt(m, st.maxReviews, m + ' cartes')).join('') + '</select></label>' +
      '<label class="field switch"><span>Afficher la translittération</span><input type="checkbox" data-k="translit"' + (st.translit ? ' checked' : '') + '></label>' +
      '<label class="field switch"><span>Sons de réussite et d’erreur</span><input type="checkbox" data-k="sfx"' + (st.sfx !== false ? ' checked' : '') + '></label>' +
      '<label class="field switch"><span>Mode libre (toutes les leçons ouvertes)</span><input type="checkbox" data-k="free"' + (st.free ? ' checked' : '') + '></label>' +
      '<label class="field"><span>Taille du texte arabe</span><select data-k="arSize">' + opt('s', st.arSize, 'Petite') + opt('m', st.arSize, 'Moyenne') + opt('l', st.arSize, 'Grande') + opt('xl', st.arSize, 'Très grande') + '</select></label>' +
      '<label class="field"><span>Thème</span><select data-k="theme">' + opt('auto', st.theme, 'Automatique') + opt('light', st.theme, 'Clair') + opt('dark', st.theme, 'Sombre') + '</select></label>' +
      '</div>' +
      '<div class="card form"><h3>Audio</h3>' +
      '<label class="field"><span>Récitateur des versets</span><select data-k="reciter">' +
      opt('Alafasy_128kbps', st.reciter, 'Mishary Rashid Alafasy') + opt('Husary_128kbps', st.reciter, 'Mahmoud Khalil Al-Husary') + opt('Minshawy_Murattal_128kbps', st.reciter, 'Mohamed Siddiq Al-Minshawi') +
      '</select></label>' +
      '<label class="field"><span>Vitesse de la voix (mots)</span><select data-k="rate" data-num="1">' + opt(0.6, st.rate, 'Lente') + opt(0.75, st.rate, 'Normale') + opt(0.9, st.rate, 'Rapide') + '</select></label>' +
      '<p class="muted small">' + (Audio.ttsReady ? 'Voix arabe détectée : ' + U.esc(Audio.voice.name) + '.' : 'Aucune voix arabe de synthèse sur cet appareil : la récitation coranique du mot est utilisée à la place.') + '</p>' +
      '<div class="row gap wrap"><button class="btn btn-ghost btn-sm" data-say="بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ" data-loc="1:1:1">' + icon('sound') + ' Tester la voix</button>' +
      '<button class="btn btn-ghost btn-sm" data-verse="1:1">' + icon('play') + ' Tester la récitation</button></div></div>' +
      '<div class="card form"><h3>Sauvegarde</h3><p class="muted small">Votre progression est enregistrée dans ce navigateur. Exportez-la pour la conserver ou la transférer sur un autre appareil.</p>' +
      '<div class="row gap wrap"><button class="btn btn-ghost" id="exp">' + icon('download') + ' Exporter</button>' +
      '<label class="btn btn-ghost">' + icon('upload') + ' Importer<input type="file" accept="application/json,.json" id="imp" hidden></label>' +
      '<button class="btn btn-danger-ghost" id="rst">' + icon('trash') + ' Tout réinitialiser</button></div></div>' +
      '</section>';

    root.addEventListener('change', (e) => {
      const el = e.target;
      const k = el.dataset.k;
      if (!k) return;
      st[k] = el.type === 'checkbox' ? el.checked : el.dataset.num ? Number(el.value) : el.value;
      Store.saveNow();
      IQRA.app.applySettings();
      ui.toast('Réglage enregistré.', 'ok', 1500);
    });
    U.$('#exp', root).addEventListener('click', () => {
      const blob = new Blob([Store.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'iqra-progression-' + U.dayKey(U.today()) + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 500);
    });
    U.$('#imp', root).addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      file.text().then((txt) => {
        try {
          Store.importJSON(txt);
          IQRA.app.applySettings();
          ui.toast('Progression importée.', 'ok');
          IQRA.app.go('#/');
        } catch (err) {
          ui.toast('Fichier invalide : ' + err.message, 'warn');
        }
      });
    });
    U.$('#rst', root).addEventListener('click', async () => {
      if (await ui.confirm('Effacer toute votre progression ? Cette action est irréversible.', 'Tout effacer')) {
        Store.reset();
        IQRA.app.applySettings();
        ui.toast('Progression réinitialisée.', 'ok');
        IQRA.app.go('#/');
      }
    });
  };
})();
