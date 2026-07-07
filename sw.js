// Bump this string whenever you ship a change to any cached file — it's the
// only way the browser knows to throw out the old cache and fetch fresh copies.
// Forgetting this is the #1 reason a deployed PWA update "doesn't show up":
// the service worker keeps serving the old cached version until this changes.
const CACHE_NAME = 'wide-open-v7';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './fonts/playfair-display-latin-500-normal.woff2',
  './fonts/playfair-display-latin-600-normal.woff2',
  './fonts/playfair-display-latin-700-normal.woff2',
  './fonts/playfair-display-latin-600-italic.woff2',
  './fonts/inter-latin-400-normal.woff2',
  './fonts/inter-latin-500-normal.woff2',
  './fonts/inter-latin-600-normal.woff2',
  './fonts/inter-latin-700-normal.woff2'
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

// Cache-first: instant loads and complete offline support. Every asset the
// app needs — HTML, icons, and now the font files too — is in APP_SHELL
// above, so there's no remaining dependency on a third-party CDN being
// reachable. Anything NOT in that list (there shouldn't be anything) falls
// through to the network and fails offline gracefully rather than crashing.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
