const CACHE_NAME = 'koala-startpage-v202605201131';
const ASSETS = [
  './',
  './index.html',
  './impressum.html',
  './datenschutz.html',
  './style.css',
  './script.js',
  './js/legal.js',
  './js/lang-init.js',
  './icon.svg',
  './manifest.json',
  './fonts/inter-300.woff2',
  './fonts/inter-400.woff2',
  './fonts/inter-500.woff2',
  './fonts/inter-600.woff2',
  './fonts/inter-700.woff2',
  './fonts/inter-800.woff2',
  './fonts/Phosphor.woff2'
];

// Install Event: Cache all critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static shell assets');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network First, falling back to Cache
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and skip external APIs (like GitHub releases)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip GitHub API and Weather API requests (always network-only or direct network)
  if (url.origin === 'https://api.github.com' || url.pathname === '/api/weather') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Only cache valid, same-origin responses
        if (networkResponse && networkResponse.status === 200 && url.origin === self.location.origin) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if network fails (offline)
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback for document navigation when offline and not cached
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
