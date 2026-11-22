/* Iqra — moteur d'exercices : génération (QCM, paires, verset, écoute, remise en ordre) et déroulé. */
(function () {
  'use strict';
  const { U, D, SRS, Audio, Store, ui } = IQRA;
  const Ex = (IQRA.Ex = {});
  const icon = ui.icon;

  /* ---------------------------------------------------------------- sons courts (Web Audio) */
  let actx = null;
  Ex.sfx = function (ok) {
    if (Store.state.settings.sfx === false) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = ok ? [660, 880] : [220];
      notes.forEach((f, i) => {
        const o = actx.createOscillator();
        const g = actx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        const t = actx.currentTime + i * 0.09;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        o.connect(g).connect(actx.destination);
        o.start(t);
        o.stop(t + 0.2);
      });
    } catch (e) {}
  };

  /* ---------------------------------------------------------------- sens proches
     Mots dont les traductions se recouvrent : ils ne sont jamais proposés ensemble
     (sinon deux réponses seraient correctes). */
  const SYN = [
    ['rabb', 'malik'], ['yawm', 'nahar'], ['abada', 'abd', 'abid'], ['sirat', 'sabil'], ['mustaqim', 'haqq', 'inna'],
    ['alladhi', 'man'], ['la', 'ma', 'lam', 'lan', 'laysa', 'ghayr'], ['inna', 'qad'], ['in', 'law', 'illa'], ['bal', 'lakin'],
    ['aw', 'am'], ['idha', 'idh', 'lamma'], ['an', 'anna'], ['ila', 'hatta'], ['ma', 'madha'], ['amila', 'jaala', 'faala'],
    ['jaa', 'ata'], ['aata', 'aata2'], ['shaa', 'arada'], ['akhadha', 'ittakhadha'], ['nasr', 'fath'], ['nas', 'ahl', 'ashab', 'insan', 'rajul'],
    ['ittaqa', 'khafa'], ['kalima', 'qawl'], ['alima', 'ilm'], ['dhakara', 'dhikr'], ['amana', 'iman', 'mumin'], ['tawwab', 'taba'],
    ['ghafara', 'maghfira'], ['saliha', 'amal'], ['kadhdhaba', 'kadhib'], ['zalama', 'zalim'], ['khabir', 'alam_c'], ['salla', 'salat', 'daa'],
    ['hada', 'huda'], ['sabara', 'sabr'], ['khalaqa', 'khalq'], ['amara', 'amr'], ['hasada', 'hasid'], ['kafara', 'kufr', 'kafir']
  ];
  const synOf = {};
  SYN.forEach((g, gi) => g.forEach((id) => (synOf[id] = (synOf[id] || []).concat(gi))));
  const normFr = (s) => String(s).toLowerCase().replace(/\([^)]*\)/g, '').replace(/[^a-zà-ÿœ' ]/g, ' ').replace(/\s+/g, ' ').trim();
  Ex.conflict = function (a, b) {
    if (a.id === b.id) return true;
    if (normFr(a.fr) === normFr(b.fr) || a.ar === b.ar) return true;
    const ga = synOf[a.id];
    const gb = synOf[b.id];
    return !!(ga && gb && ga.some((g) => gb.includes(g)));
  };

  /* ---------------------------------------------------------------- distracteurs */
  function distractors(w, n, field) {
    const li = D.lessonById[w.l] ? D.lessonById[w.l].index : 0;
    const seen = new Set([w[field]]);
    const cands = IQRA.vocab.filter((x) => x.k === w.k && x.id !== w.id);
    const score = (x) =>
      (x.l === w.l ? 3 : 0) + (SRS.has(x.id) ? 2 : 0) + (D.lessonById[x.l] && D.lessonById[x.l].index <= li ? 1 : 0) + Math.random() * 2.5;
    const out = [];
    cands
      .map((x) => [score(x), x])
      .sort((a, b) => b[0] - a[0])
      .forEach(([, x]) => {
        if (out.length < n && !seen.has(x[field]) && !Ex.conflict(w, x) && !out.some((o) => Ex.conflict(o, x))) {
          seen.add(x[field]);
          out.push(x);
        }
      });
    return out;
  }

  /* ---------------------------------------------------------------- fabriques d'exercices */
  Ex.mcqArFr = function (w) {
    const opts = U.shuffle([w].concat(distractors(w, 3, 'fr')));
    return {
      type: 'mcq', wordId: w.id, tag: 'Reconnaître',
      prompt: '<div class="q-label">Que signifie ce mot ?</div><div class="q-ar-row"><div class="q-ar ar" lang="ar" dir="rtl">' + U.esc(w.ar) + '</div>' + ui.sayBtn(w.ar, (w.ex || [])[0]) + '</div>' +
        (Store.state.settings.translit ? '<div class="q-tr">' + U.esc(w.tr) + '</div>' : ''),
      options: opts.map((x) => ({ html: U.esc(x.fr), ok: x.id === w.id, label: x.fr })),
      answer: w.fr
    };
  };

  Ex.mcqFrAr = function (w) {
    const opts = U.shuffle([w].concat(distractors(w, 3, 'ar')));
    return {
      type: 'mcq', wordId: w.id, tag: 'Retrouver', arOpts: true,
      prompt: '<div class="q-label">Quel mot arabe signifie…</div><div class="q-fr">« ' + U.esc(w.fr) + ' »</div>',
      options: opts.map((x) => ({ html: '<span class="ar" lang="ar" dir="rtl">' + U.esc(x.ar) + '</span>', ok: x.id === w.id, label: x.ar })),
      answer: w.ar
    };
  };

  Ex.listen = function (w) {
    const opts = U.shuffle([w].concat(distractors(w, 3, 'ar')));
    return {
      type: 'mcq', wordId: w.id, tag: 'Écouter', arOpts: true, autoSay: w.ar, loc: (w.ex || [])[0],
      prompt: '<div class="q-label">Écoutez et choisissez le mot entendu</div><button class="btn-listen" data-say="' + U.esc(w.ar) + '" data-loc="' + ((w.ex || [])[0] || '') + '">' + icon('sound') + '</button>',
      options: opts.map((x) => ({ html: '<span class="ar" lang="ar" dir="rtl">' + U.esc(x.ar) + '</span>', ok: x.id === w.id, label: x.ar })),
      answer: w.ar + ' — ' + w.fr
    };
  };

  Ex.verseFor = function (w) {
    if (w.k !== 'w' || !w.ex) return null;
    for (const loc of w.ex) {
      const [s, v] = loc.split(':');
      const toks = D.verse(s + ':' + v);
      const clash = toks && toks.some((t) => t.id && t.id !== w.id && D.byId[t.id] && Ex.conflict(w, D.byId[t.id]));
      if (toks && !clash && toks.length <= 26 && toks.some((t) => t.id === w.id)) {
        return { type: 'verse', wordId: w.id, tag: 'Dans le Coran', sv: s + ':' + v, toks, target: w.id, fr: w.fr };
      }
    }
    return null;
  };

  Ex.pairs = function (words) {
    const list = [];
    U.shuffle(words).forEach((w) => {
      if (list.length < 5 && !list.some((x) => Ex.conflict(x, w))) list.push(w);
    });
    return list.length >= 3 ? { type: 'pairs', tag: 'Associer', words: list } : null;
  };

  Ex.fromQuiz = function (q) {
    if (q.t === 'order') return { type: 'order', tag: 'Construire', words: q.ar, fr: q.fr };
    const good = q.o[0];
    const opts = U.shuffle(q.o.map((o, i) => ({ html: U.rich(o), ok: i === 0, label: o })));
    return { type: 'mcq', tag: 'Grammaire', prompt: '<div class="q-text">' + U.rich(q.q) + '</div>', options: opts, answer: good, why: q.why };
  };

  /** Liste d'exercices d'une leçon, entrelacés (interleaving) du plus simple au plus exigeant. */
  Ex.forLesson = function (lesson) {
    const words = D.lessonWords[lesson.id] || [];
    const recog = U.shuffle(words).map(Ex.mcqArFr);
    const rest = [];
    U.sample(words, Math.ceil(words.length / 2)).forEach((w) => rest.push(Ex.mcqFrAr(w)));
    if (words.length >= 4) {
      const p = Ex.pairs(words);
      if (p) rest.push(p);
    }
    U.shuffle(words)
      .map(Ex.verseFor)
      .filter(Boolean)
      .slice(0, 3)
      .forEach((x) => rest.push(x));
    if (Audio.ttsReady) U.sample(words, Math.min(2, words.length)).forEach((w) => rest.push(Ex.listen(w)));
    const quiz = lesson.quiz.map(Ex.fromQuiz);
    const orders = quiz.filter((q) => q.type === 'order');
    const mixed = U.shuffle(rest.concat(quiz.filter((q) => q.type !== 'order')));
    // 1re moitié : reconnaissance entrecoupée de quelques exercices variés ; fin : construction de phrases
    const out = [];
    const r = recog.slice();
    const m = mixed.slice();
    while (r.length || m.length) {
      if (r.length) out.push(r.shift());
      if (r.length && Math.random() < 0.5) out.push(r.shift());
      if (m.length) out.push(m.shift());
    }
    return out.concat(orders);
  };

  /** Entraînement libre sur des mots déjà appris. */
  Ex.practice = function (ids, n) {
    const words = U.sample(ids.map((id) => D.byId[id]).filter(Boolean), n);
    return words.map((w) => {
      const r = Math.random();
      if (r < 0.2) return Ex.verseFor(w) || Ex.mcqArFr(w);
      if (r < 0.5) return Ex.mcqFrAr(w);
      return Ex.mcqArFr(w);
    });
  };

  /* ---------------------------------------------------------------- moteur */
  const PRAISE = ['Bravo !', 'Excellent !', 'Parfait !', 'Bien joué !', 'Mâ shâʾ Allâh !', 'Exact !'];
  const OOPS = ['Pas tout à fait…', 'Presque !', 'À revoir'];

  Ex.run = function (root, items, opts) {
    opts = opts || {};
    const queue = items.slice();
    const st = { total: items.length, first: 0, done: 0, wrong: new Set(), start: Date.now(), xp: 0, streak: 0, bestStreak: 0 };
    let keyHandler = null;
    let locked = false;

    root.innerHTML =
      '<div class="ex">' +
      '<div class="ex-top"><div class="progress"><div class="progress-bar"></div></div><span class="ex-count"></span></div>' +
      '<div class="ex-stage"></div>' +
      '<div class="feedback" hidden></div>' +
      '</div>';
    const stage = root.querySelector('.ex-stage');
    const fb = root.querySelector('.feedback');
    const bar = root.querySelector('.progress-bar');
    const count = root.querySelector('.ex-count');

    const setKeys = (fn) => {
      if (keyHandler) document.removeEventListener('keydown', keyHandler);
      keyHandler = fn;
      if (fn) document.addEventListener('keydown', fn);
    };
    const cleanup = () => setKeys(null);
    if (opts.onLeave) opts.onLeave(cleanup);

    function updateProgress() {
      const ratio = st.done / (st.done + queue.length || 1);
      bar.style.width = ratio * 100 + '%';
      count.textContent = st.done + ' / ' + (st.done + queue.length);
    }

    function render() {
      updateProgress();
      fb.hidden = true;
      fb.className = 'feedback';
      locked = false;
      if (!queue.length) return finish();
      const item = queue[0];
      stage.innerHTML = '';
      const el = U.h('<div class="ex-card"><span class="ex-tag">' + U.esc(item.tag || '') + (item._retry ? ' · deuxième chance' : '') + '</span></div>');
      stage.appendChild(el);
      R[item.type](item, el, (ok, info) => answer(item, ok, info));
      if (item.autoSay) setTimeout(() => Audio.say(item.autoSay, item.loc), 250);
    }

    function answer(item, ok, info) {
      if (locked) return;
      locked = true;
      if (!item._retry) {
        if (ok) {
          st.first++;
          st.xp += 10;
        }
      } else if (ok) st.xp += 4;
      if (ok) {
        st.streak++;
        st.bestStreak = Math.max(st.bestStreak, st.streak);
      } else st.streak = 0;
      if (!ok && item.wordId) st.wrong.add(item.wordId);
      const requeue = !ok && !item._retry && item.type !== 'pairs';
      Ex.sfx(ok);
      const title = ok ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : OOPS[Math.floor(Math.random() * OOPS.length)];
      let detail = '';
      if (!ok && item.answer) detail += '<div>Réponse : <b>' + U.rich(item.answer) + '</b></div>';
      if (info) detail += '<div>' + info + '</div>';
      if (item.why) detail += '<div class="why">' + icon('bulb') + ' ' + U.rich(item.why) + '</div>';
      if (requeue) detail += '<div class="muted small">Cette question reviendra un peu plus tard.</div>';
      fb.className = 'feedback ' + (ok ? 'ok' : 'ko');
      fb.innerHTML =
        '<div class="fb-icon">' + icon(ok ? 'check' : 'x') + '</div><div class="fb-text"><strong>' + title + '</strong>' + detail + '</div>' +
        '<button class="btn ' + (ok ? 'btn-primary' : 'btn-warn') + ' fb-next">Continuer</button>';
      fb.hidden = false;
      const next = () => {
        queue.shift();
        if (requeue) {
          const copy = Object.assign({}, item, { _retry: true });
          if (copy.options) copy.options = U.shuffle(copy.options);
          const pos = Math.min(queue.length, 2 + Math.floor(Math.random() * 3));
          queue.splice(pos, 0, copy);
        }
        st.done++;
        render();
      };
      const btn = fb.querySelector('.fb-next');
      btn.addEventListener('click', next);
      setTimeout(() => btn.focus({ preventScroll: true }), 30);
      setKeys((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          next();
        }
      });
    }

    function finish() {
      cleanup();
      bar.style.width = '100%';
      const res = { total: st.total, first: st.first, score: st.total ? st.first / st.total : 1, wrong: st.wrong, seconds: (Date.now() - st.start) / 1000, xp: st.xp, bestStreak: st.bestStreak };
      if (opts.onDone) opts.onDone(res);
    }

    /* ------------------------------ rendus */
    const R = {
      mcq(item, el, done) {
        el.insertAdjacentHTML('beforeend', '<div class="q">' + item.prompt + '</div><div class="opts' + (item.arOpts ? ' opts-ar' : '') + '"></div>');
        const box = el.querySelector('.opts');
        item.options.forEach((o, i) => {
          const b = U.h('<button class="opt"><kbd>' + (i + 1) + '</kbd><span class="opt-txt">' + o.html + '</span></button>');
          b.addEventListener('click', () => choose(i));
          box.appendChild(b);
        });
        function choose(i) {
          if (locked) return;
          const btns = U.$$('.opt', box);
          btns.forEach((b, j) => {
            b.disabled = true;
            if (item.options[j].ok) b.classList.add('correct');
          });
          if (!item.options[i].ok) btns[i].classList.add('wrong');
          done(item.options[i].ok);
        }
        setKeys((e) => {
          const n = parseInt(e.key, 10);
          if (n >= 1 && n <= item.options.length) choose(n - 1);
        });
      },

      verse(item, el, done) {
        el.insertAdjacentHTML(
          'beforeend',
          '<div class="q"><div class="q-label">Touchez dans ce verset le mot qui signifie</div><div class="q-fr">« ' + U.esc(item.fr) + ' »</div></div>' +
            '<div class="verse-pick quran" lang="ar" dir="rtl"></div>' +
            '<div class="verse-ref muted small">' + U.esc(U.ref(...item.sv.split(':').map(Number))) + '</div>'
        );
        const box = el.querySelector('.verse-pick');
        item.toks.forEach((t, i) => {
          const b = U.h('<button class="vtok">' + U.esc(t.t) + '</button>');
          b.addEventListener('click', () => {
            if (locked) return;
            const ok = t.id === item.target;
            U.$$('.vtok', box).forEach((x, j) => {
              x.disabled = true;
              if (item.toks[j].id === item.target) x.classList.add('correct');
            });
            if (!ok) b.classList.add('wrong');
            let info = '';
            if (!ok) {
              const tw = t.id && D.byId[t.id];
              info = 'Vous avez touché <span class="ar">' + U.esc(t.t) + '</span>' + (t.g ? ' : « ' + U.esc(t.g) + ' »' : tw ? ' : « ' + U.esc(tw.fr) + ' »' : '') + '.';
            }
            done(ok, info);
          });
          box.appendChild(b);
        });
        setKeys(null);
      },

      pairs(item, el, done) {
        el.insertAdjacentHTML('beforeend', '<div class="q"><div class="q-label">Associez chaque mot à son sens</div></div><div class="pairs"><div class="pcol pcol-ar"></div><div class="pcol pcol-fr"></div></div>');
        const colAr = el.querySelector('.pcol-ar');
        const colFr = el.querySelector('.pcol-fr');
        let selAr = null;
        let selFr = null;
        let mistakes = 0;
        let matched = 0;
        const mk = (w, side) => {
          const b = U.h('<button class="ptile' + (side === 'ar' ? ' ar' : '') + '"' + (side === 'ar' ? ' lang="ar" dir="rtl"' : '') + '>' + U.esc(side === 'ar' ? w.ar : w.fr) + '</button>');
          b.dataset.id = w.id;
          b.addEventListener('click', () => pick(b, side));
          return b;
        };
        U.shuffle(item.words).forEach((w) => colAr.appendChild(mk(w, 'ar')));
        U.shuffle(item.words).forEach((w) => colFr.appendChild(mk(w, 'fr')));
        function pick(b, side) {
          if (b.disabled) return;
          if (side === 'ar') {
            if (selAr) selAr.classList.remove('sel');
            selAr = b;
            const w = D.byId[b.dataset.id];
            if (w) Audio.say(w.ar, (w.ex || [])[0]);
          } else {
            if (selFr) selFr.classList.remove('sel');
            selFr = b;
          }
          b.classList.add('sel');
          if (selAr && selFr) {
            const a = selAr;
            const f = selFr;
            selAr = selFr = null;
            if (a.dataset.id === f.dataset.id) {
              [a, f].forEach((x) => {
                x.classList.remove('sel');
                x.classList.add('matched');
                x.disabled = true;
              });
              matched++;
              if (matched === item.words.length) done(mistakes === 0, mistakes ? U.plural(mistakes, 'erreur', 'erreurs') + ' d’association.' : 'Aucune erreur !');
            } else {
              mistakes++;
              Ex.sfx(false);
              [a, f].forEach((x) => x.classList.add('shake'));
              setTimeout(() => [a, f].forEach((x) => x.classList.remove('shake', 'sel')), 450);
            }
          }
        }
        setKeys(null);
      },

      order(item, el, done) {
        el.insertAdjacentHTML(
          'beforeend',
          '<div class="q"><div class="q-label">Remettez les mots dans l’ordre</div><div class="q-fr small">« ' + U.esc(item.fr) + ' »</div></div>' +
            '<div class="order-answer quran" lang="ar" dir="rtl"></div><div class="order-bank" lang="ar" dir="rtl"></div>' +
            '<div class="row center mt"><button class="btn btn-primary order-check" disabled>Vérifier</button></div>'
        );
        const ans = el.querySelector('.order-answer');
        const bank = el.querySelector('.order-bank');
        const check = el.querySelector('.order-check');
        let tiles = item.words.map((t, i) => ({ t, i }));
        let shuffled = U.shuffle(tiles);
        if (shuffled.every((x, k) => x.i === k) && tiles.length > 1) shuffled = shuffled.slice(1).concat(shuffled[0]);
        shuffled.forEach((x) => {
          const b = U.h('<button class="otile ar">' + U.esc(x.t) + '</button>');
          b.dataset.i = x.i;
          b.addEventListener('click', () => {
            if (locked) return;
            (b.parentElement === bank ? ans : bank).appendChild(b);
            check.disabled = ans.children.length !== item.words.length;
          });
          bank.appendChild(b);
        });
        check.addEventListener('click', () => {
          const got = U.$$('.otile', ans).map((b) => item.words[+b.dataset.i]);
          const ok = got.join(' ') === item.words.join(' ');
          U.$$('.otile', el).forEach((b) => (b.disabled = true));
          check.disabled = true;
          ans.classList.add(ok ? 'correct' : 'wrong');
          done(ok, ok ? '' : 'Ordre correct : <span class="ar">' + U.esc(item.words.join(' ')) + '</span>');
        });
        setKeys(null);
      }
    };

    render();
    return { cleanup };
  };
})();
