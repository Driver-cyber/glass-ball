/* =====================================================================
   The Glass Ball · service worker · v0.9.5
   The offline shelf. Strategy, in keeping with the storage seam:

   - The app's data never passes through here. All state lives in
     localStorage behind the save()/load() seam in index.html; the cloud
     copy lives behind the sync Worker. This worker caches only the app
     SHELL (the single file + its PWA companions).
   - Navigations are NETWORK-FIRST: a fresh deploy arrives silently on the
     next online open — no "update available" banner, no nagging (the
     anti-engagement ethos applies to plumbing too). Offline falls back to
     the cached shell, so the room is always enterable.
   - Cross-origin requests (the sync Worker) are never intercepted.
   - Bump CACHE with the app version on release-worthy builds — same
     convention as the subtitle + JS header.
   ===================================================================== */
const CACHE = 'glass-ball-v0.9.5';
const SHELL = [
  './',
  './index.html',
  './guide.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // sync Worker et al. pass straight through

  if (req.mode === 'navigate') {
    // network-first: fresh deploys win; offline gets the held copy
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          // cache each page under its own key, so an offline visit to the
          // guide gets the guide, not the app
          const page = /guide(\.html)?$/.test(url.pathname) ? './guide.html' : './index.html';
          caches.open(CACHE).then((c) => c.put(page, copy));
          return res;
        })
        .catch(() => caches.match(/guide(\.html)?$/.test(url.pathname) ? './guide.html' : './index.html'))
    );
    return;
  }

  // shell assets: cache-first, fill on miss
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }))
  );
});
