/* Iqra — service worker : fonctionnement hors ligne (hors audio). */
const CACHE = 'iqra-v4';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/css/app.css',
  'assets/icons/icon.svg',
  'assets/js/data/vocab.js',
  'assets/js/data/quran.js',
  'assets/js/data/lessons.js',
  'assets/js/core.js',
  'assets/js/ui.js',
  'assets/js/exercises.js',
  'assets/js/views-main.js',
  'assets/js/views-study.js',
  'assets/js/app.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !fonts) return; // audio et autres : réseau direct
  // stale-while-revalidate : réponse immédiate depuis le cache, mise à jour en arrière-plan
  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(req, { ignoreSearch: sameOrigin }).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});
