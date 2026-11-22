/* Iqra — noyau : utilitaires, stockage, répétition espacée, audio, chronomètre d'étude. */
(function () {
  'use strict';
  const IQRA = (window.IQRA = window.IQRA || {});

  /* ------------------------------------------------------------------ utilitaires */
  const AR = '؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿';
  const AR_RUN = new RegExp('[' + AR + '](?:[' + AR + '\\s←]*[' + AR + '])?', 'g');
  const AR_ONE = new RegExp('[' + AR + ']');

  const U = (IQRA.U = {
    $: (sel, root) => (root || document).querySelector(sel),
    $$: (sel, root) => Array.from((root || document).querySelectorAll(sel)),
    esc: (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]),
    hasAr: (s) => AR_ONE.test(s || ''),
    /** Échappe le texte et entoure automatiquement les passages arabes. */
    rich: (s) => U.esc(s).replace(AR_RUN, (m) => '<span class="ar" lang="ar" dir="rtl">' + m + '</span>'),
    h(html) {
      const t = document.createElement('template');
      t.innerHTML = html.trim();
      return t.content.firstElementChild;
    },
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    sample: (arr, n) => U.shuffle(arr).slice(0, n),
    today() {
      const d = new Date();
      return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
    },
    dayKey: (idx) => new Date(idx * 86400000).toISOString().slice(0, 10),
    num: (n) => Number(n).toLocaleString('fr-FR'),
    pct: (x, d) => (x * 100).toLocaleString('fr-FR', { maximumFractionDigits: d == null ? 1 : d, minimumFractionDigits: d == null ? 1 : d }) + ' %',
    mmss(sec) {
      sec = Math.max(0, Math.round(sec));
      return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
    },
    minutes: (sec) => Math.round(sec / 60),
    pad3: (n) => String(n).padStart(3, '0'),
    ref(s, v) {
      const name = (IQRA.surahs && IQRA.surahs[s - 1]) || 'Sourate ' + s;
      return name + ' ' + s + ':' + v;
    },
    plural: (n, one, many) => n + ' ' + (n > 1 ? many : one),
    debounce(fn, ms) {
      let t;
      return (...a) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...a), ms);
      };
    },
    firstVariant: (ar) => String(ar).split('/')[0].replace(/ـ/g, '').trim()
  });

  /* ------------------------------------------------------------------ stockage */
  const KEY = 'iqra.v1';
  const defaults = () => ({
    v: 1,
    settings: { goal: 15, translit: true, arSize: 'm', theme: 'auto', free: false, reciter: 'Alafasy_128kbps', rate: 0.75, maxReviews: 60 },
    lessons: {},
    cards: {},
    days: {},
    xp: 0,
    chrono: { best: 0, games: 0 },
    read: {},
    created: Date.now()
  });
  let memoryFallback = null;
  /** Empreinte de l'état sans l'horodatage : sert à ne dater que les vrais changements. */
  const fingerprint = (st) => JSON.stringify(Object.assign({}, st, { updated: 0 }));
  const merge = (data) => {
    const d = defaults();
    return Object.assign(d, data, { settings: Object.assign(d.settings, (data && data.settings) || {}) });
  };
  const Store = (IQRA.Store = {
    state: defaults(),
    _print: '',
    load() {
      let raw = null;
      try {
        raw = localStorage.getItem(KEY);
      } catch (e) {
        raw = memoryFallback;
      }
      if (raw) {
        try {
          this.state = merge(JSON.parse(raw));
        } catch (e) {
          console.warn('Données illisibles, réinitialisation.', e);
        }
      }
      this._print = fingerprint(this.state);
      return this.state;
    },
    write() {
      const raw = JSON.stringify(this.state);
      try {
        localStorage.setItem(KEY, raw);
      } catch (e) {
        memoryFallback = raw;
      }
    },
    saveNow() {
      const print = fingerprint(this.state);
      if (print !== this._print) {
        // Toujours plus récent que la dernière version connue, même si l'horloge d'un autre appareil avance.
        this.state.updated = Math.max(Date.now(), (this.state.updated || 0) + 1);
        this._print = print;
      }
      this.write();
    },
    /** Remplace l'état local par celui du compte (sans le redater). */
    adopt(data, updated) {
      this.state = merge(data);
      this.state.updated = Math.max(this.state.updated || 0, updated || 0);
      this._print = fingerprint(this.state);
      this.write();
    },
    save: null,
    sync: () => {},
    day(idx) {
      const k = U.dayKey(idx == null ? U.today() : idx);
      if (!this.state.days[k]) this.state.days[k] = { sec: 0, xp: 0, rev: 0, les: 0 };
      return this.state.days[k];
    },
    addXP(n) {
      this.state.xp += n;
      this.day().xp += n;
      this.save();
      this.sync();
    },
    exportJSON: () => JSON.stringify(Store.state, null, 1),
    importJSON(text) {
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object' || !data.settings) throw new Error('Fichier invalide');
      this.state = merge(data);
      this.saveNow();
      Cloud.push();
    },
    reset() {
      this.state = defaults();
      this.saveNow();
      Cloud.push();
    }
  });
  Store.save = U.debounce(() => Store.saveNow(), 400);
  window.addEventListener('pagehide', () => {
    Store.saveNow();
    Cloud.push();
  });

  /* ------------------------------------------------------------------ page partagée sur claude.ai
     Dans une page claude.ai (cadre), la progression d'une personne connectée est aussi gardée
     dans son espace privé du compte (data/users/<id>/progress) : elle la retrouve sur tous ses
     appareils. Sans compte ou hors claude.ai, elle reste dans ce navigateur. */
  IQRA.embedded = (function () {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  })();
  const Cloud = (IQRA.Cloud = {
    ref: null,
    status: 'local',
    pushing: false,
    again: false,
    lastPushed: 0,
    async init() {
      if (!(window.claude && typeof window.claude.use === 'function')) return;
      try {
        const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
        if (!db || !user) return;
        const id = await user.id();
        if (!id) return;
        const ref = db.doc('data/users/' + id + '/progress');
        const snap = await Promise.race([ref.get(), new Promise((resolve, reject) => setTimeout(() => reject(new Error('délai dépassé')), 10000))]);
        const remote = snap && snap.exists ? snap.data() : null;
        this.ref = ref;
        this.status = 'synced';
        const local = Store.state;
        if (remote && remote.state && (remote.updated || 0) > (local.updated || 0)) {
          this.lastPushed = remote.updated || 0;
          Store.adopt(remote.state, remote.updated);
          IQRA.app.applySettings();
          IQRA.app.reload();
          IQRA.ui.toast('Progression récupérée depuis votre compte.', 'ok');
        } else {
          this.lastPushed = remote ? remote.updated || 0 : 0;
          await this.push();
        }
      } catch (e) {
        this.ref = null;
        this.status = 'local';
      }
    },
    async push() {
      if (!this.ref) return;
      if (this.pushing) {
        this.again = true;
        return;
      }
      Store.saveNow();
      const st = Store.state;
      if (!st.updated || st.updated <= this.lastPushed) return;
      this.pushing = true;
      const updated = st.updated;
      try {
        await this.ref.set({ updated, state: JSON.parse(JSON.stringify(st)) });
        this.lastPushed = updated;
        this.status = 'synced';
      } catch (e) {
        const code = e && e.code;
        if (code === 'unavailable' || code === 'resource_exhausted') this.again = true;
        else {
          this.ref = null;
          this.status = 'local';
        }
      }
      this.pushing = false;
      if (this.again) {
        this.again = false;
        setTimeout(() => this.push(), 5000);
      }
    }
  });
  Store.sync = U.debounce(() => Cloud.push(), 4000);

  /* ------------------------------------------------------------------ index des données */
  const D = (IQRA.D = { byId: {}, lessonById: {}, lessonWords: {}, verseIndex: {}, readerById: {} });
  D.init = function () {
    IQRA.vocab.forEach((w) => {
      D.byId[w.id] = w;
      (D.lessonWords[w.l] = D.lessonWords[w.l] || []).push(w);
    });
    IQRA.lessons.forEach((l, i) => {
      l.index = i;
      D.lessonById[l.id] = l;
    });
    Object.keys(IQRA.verses).forEach((k) => (D.verseIndex[k] = IQRA.verses[k].map((t) => ({ t: t[0], id: t[1] }))));
    IQRA.reader.forEach((p) => {
      D.readerById[p.id] = p;
      p.verses.forEach((v) => {
        D.verseIndex[p.s + ':' + v.v] = v.w.map((w) => ({ t: w[0], g: w[1], id: w[2], r: w[3] }));
      });
    });
  };
  /** Mots d'un verset : [{t, id, g?, r?}] */
  D.verse = (sv) => D.verseIndex[sv] || null;
  D.lessonMinutes = function (l) {
    const words = (D.lessonWords[l.id] || []).length;
    const raw = 3 + l.theory.length * 0.8 + words * 0.7 + l.quiz.length * 0.5 + (l.read ? 3 : 0);
    return Math.max(10, Math.round(raw / 5) * 5);
  };

  /* ------------------------------------------------------------------ répétition espacée (SM-2 adapté) */
  const SRS = (IQRA.SRS = {
    card: (id) => Store.state.cards[id],
    has: (id) => !!Store.state.cards[id],
    /** Ajoute un mot appris en leçon. weak = erreur pendant la leçon → révision dès aujourd'hui. */
    add(id, weak) {
      if (Store.state.cards[id]) return false;
      const t = U.today();
      Store.state.cards[id] = { due: weak ? t : t + 1, ivl: weak ? 0 : 1, ease: 2.5, reps: weak ? 0 : 1, lapses: 0, last: t, added: t };
      return true;
    },
    dueList() {
      const t = U.today();
      const cards = Store.state.cards;
      return U.shuffle(Object.keys(cards).filter((id) => cards[id].due <= t && D.byId[id])).sort((a, b) => cards[a].due - cards[b].due);
    },
    dueCount() {
      const t = U.today();
      const cards = Store.state.cards;
      let n = 0;
      for (const id in cards) if (cards[id].due <= t && D.byId[id]) n++;
      return n;
    },
    dueTomorrow() {
      const t = U.today() + 1;
      const cards = Store.state.cards;
      let n = 0;
      for (const id in cards) if (cards[id].due <= t && D.byId[id]) n++;
      return n;
    },
    next(c, r) {
      let { ivl, ease, reps, lapses } = c;
      if (r === 1) {
        lapses += 1;
        reps = 0;
        ease = Math.max(1.3, ease - 0.2);
        ivl = 0;
      } else {
        // Intervalles toujours strictement croissants : Difficile < Bien < Facile
        const old = ivl;
        const good = Math.max(reps === 0 ? 2 : reps === 1 ? 4 : Math.round(old * ease), old + 1);
        const hard = Math.max(1, Math.min(reps < 2 ? 1 : Math.round(old * 1.2), good - 1));
        const easy = Math.max(reps === 0 ? 4 : reps === 1 ? 7 : Math.round(old * ease * 1.3), good + 1);
        if (r === 2) {
          ivl = hard;
          ease = Math.max(1.3, ease - 0.15);
        } else if (r === 3) ivl = good;
        else {
          ivl = easy;
          ease += 0.15;
        }
        reps += 1;
      }
      ivl = Math.min(ivl, 365);
      return { ivl, ease, reps, lapses };
    },
    preview(id) {
      const c = Store.state.cards[id];
      return [1, 2, 3, 4].map((r) => SRS.next(c, r).ivl);
    },
    rate(id, r) {
      const c = Store.state.cards[id];
      if (!c) return;
      const n = SRS.next(c, r);
      if (n.ivl > 4) n.ivl = Math.round(n.ivl * (0.95 + Math.random() * 0.1));
      const t = U.today();
      Object.assign(c, n, { due: t + n.ivl, last: t });
      Store.day().rev += 1;
      Store.save();
    },
    status(id) {
      const c = Store.state.cards[id];
      if (!c) return 'new';
      if (c.ivl >= 21) return 'mature';
      if (c.ivl >= 4) return 'young';
      return 'learning';
    },
    ivlLabel(d) {
      if (d <= 0) return '< 10 min';
      if (d < 31) return d + ' j';
      if (d < 365) return Math.round(d / 30) + ' mois';
      return '1 an';
    },
    knownIds: () => Object.keys(Store.state.cards).filter((id) => D.byId[id]),
    coverage(extraIds) {
      const set = new Set(SRS.knownIds());
      (extraIds || []).forEach((id) => set.add(id));
      let n = 0;
      set.forEach((id) => {
        const w = D.byId[id];
        if (w && w.k === 'w') n += w.n;
      });
      return n / IQRA.stats.tokens;
    },
    counts() {
      const res = { total: 0, learning: 0, young: 0, mature: 0 };
      SRS.knownIds().forEach((id) => {
        res.total++;
        res[SRS.status(id)]++;
      });
      return res;
    }
  });

  /* ------------------------------------------------------------------ audio */
  const Audio_ = (IQRA.Audio = {
    warned: {},
    warn(key, msg) {
      const now = Date.now();
      if (this.warned[key] && now - this.warned[key] < 120000) return;
      this.warned[key] = now;
      IQRA.ui.toast(msg, 'warn', 4500);
    },
    voice: null,
    ttsReady: false,
    player: new Audio(),
    init() {
      if (!('speechSynthesis' in window)) return;
      const pick = () => {
        const voices = speechSynthesis.getVoices();
        const ar = voices.filter((v) => /^ar/i.test(v.lang));
        this.voice = ar.find((v) => /SA|EG/i.test(v.lang)) || ar[0] || null;
        this.ttsReady = !!this.voice;
      };
      pick();
      speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', pick);
    },
    stop() {
      try {
        const p = this.player;
        p.onerror = null;
        p.onended = null;
        p.pause();
      } catch (e) {}
      if (this._resolve) {
        const r = this._resolve;
        this._resolve = null;
        r(false);
      }
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    },
    /** Prononce un mot (synthèse vocale) ; sinon joue la récitation d'une occurrence coranique. */
    say(text, fallbackLoc) {
      this.stop();
      if (this.ttsReady) {
        const u = new SpeechSynthesisUtterance(U.firstVariant(text));
        u.voice = this.voice;
        u.lang = this.voice.lang;
        u.rate = Store.state.settings.rate || 0.75;
        speechSynthesis.speak(u);
        return Promise.resolve();
      }
      if (fallbackLoc && !IQRA.embedded) return this.word(fallbackLoc);
      this.warn('tts', "Aucune voix arabe n'est installée sur cet appareil : la récitation du mot n'est disponible que pour les mots tirés d'un verset.");
      return Promise.resolve();
    },
    play(url) {
      this.stop();
      const self = this;
      return new Promise((resolve) => {
        const p = this.player;
        const done = (ok) => {
          if (self._resolve === done) self._resolve = null;
          resolve(ok);
        };
        self._resolve = done;
        p.src = url;
        p.onended = () => done(true);
        p.onerror = () => {
          self.warn('net', IQRA.embedded ? 'Les récitations ne sont pas disponibles dans cette version partagée.' : 'Audio indisponible : une connexion internet est nécessaire pour les récitations.');
          done(false);
        };
        const pr = p.play();
        if (pr && pr.catch) pr.catch(() => done(false));
      });
    },
    /** Récitation mot à mot (quran.com) — loc = "s:v:w" */
    word(loc) {
      const [s, v, w] = String(loc).split(':');
      return this.play('https://audio.qurancdn.com/wbw/' + U.pad3(s) + '_' + U.pad3(v) + '_' + U.pad3(w) + '.mp3');
    },
    /** Récitation d'un verset (everyayah.com) */
    verse(s, v) {
      const r = Store.state.settings.reciter || 'Alafasy_128kbps';
      return this.play('https://everyayah.com/data/' + r + '/' + U.pad3(s) + U.pad3(v) + '.mp3');
    }
  });

  /* ------------------------------------------------------------------ chronomètre d'étude */
  const Timer = (IQRA.Timer = {
    active: false,
    session: 0,
    lastInput: Date.now(),
    breakShown: false,
    listeners: [],
    init() {
      const bump = () => (this.lastInput = Date.now());
      ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'].forEach((e) => window.addEventListener(e, bump, { passive: true }));
      setInterval(() => this.tick(), 1000);
    },
    setActive(on) {
      this.active = on;
      if (on) this.lastInput = Date.now();
      this.emit();
    },
    tick() {
      if (!this.active || document.hidden || Date.now() - this.lastInput > 90000) return;
      const day = Store.day();
      const goal = Store.state.settings.goal * 60;
      const before = day.sec;
      day.sec += 1;
      this.session += 1;
      if (day.sec % 5 === 0) Store.save();
      if (before < goal && day.sec >= goal) {
        Store.saveNow();
        IQRA.ui.celebrate('Objectif du jour atteint !', 'Série : ' + U.plural(Stats.streak(), 'jour', 'jours') + '. Continuez sur votre lancée.');
      }
      if (!this.breakShown && this.session >= 25 * 60) {
        this.breakShown = true;
        IQRA.ui.toast('25 minutes d’étude : une pause de 5 minutes aide votre mémoire à consolider.', 'info', 7000);
      }
      this.emit();
    },
    on(fn) {
      this.listeners.push(fn);
    },
    emit() {
      this.listeners.forEach((fn) => fn());
    }
  });

  /* ------------------------------------------------------------------ statistiques */
  const Stats = (IQRA.Stats = {
    dayValid(rec, goal) {
      return !!rec && (rec.sec >= goal * 60 || rec.les > 0 || rec.rev >= 20);
    },
    streak() {
      const goal = Store.state.settings.goal;
      const t = U.today();
      let n = 0;
      let d = Stats.dayValid(Store.state.days[U.dayKey(t)], goal) ? t : t - 1;
      while (Stats.dayValid(Store.state.days[U.dayKey(d)], goal)) {
        n++;
        d--;
      }
      return n;
    },
    week() {
      const t = U.today();
      const out = [];
      for (let i = 6; i >= 0; i--) {
        const k = U.dayKey(t - i);
        const rec = Store.state.days[k] || { sec: 0 };
        out.push({ key: k, idx: t - i, sec: rec.sec || 0, valid: Stats.dayValid(rec, Store.state.settings.goal) });
      }
      return out;
    },
    totalSec: () => Object.values(Store.state.days).reduce((a, d) => a + (d.sec || 0), 0)
  });
})();
