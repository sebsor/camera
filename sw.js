// Bump this string whenever you ship a change to any cached file — it's the
// only way the browser knows to throw out the old cache and fetch fresh copies.
// Forgetting this is the #1 reason a deployed PWA update "doesn't show up":
// the service worker keeps serving the old cached version until this changes.
const CACHE_NAME = 'wide-open-v5';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first: instant loads and full offline support, since this app has no
// live data to go stale. Falls back to the network for anything not cached
// (e.g. the Google Fonts files), and just lets that fail offline gracefully.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
