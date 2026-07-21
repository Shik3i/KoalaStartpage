const CACHE_NAME = 'koala-startpage-v202607210112';
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
  './apple-touch-icon.png',
  './manifest.json',
  './fonts/inter-300.woff2',
  './fonts/inter-400.woff2',
  './fonts/inter-500.woff2',
  './fonts/inter-600.woff2',
  './fonts/inter-700.woff2',
  './fonts/inter-800.woff2',
  './fonts/Phosphor.woff2'
];

// Install Event: Cache assets individually so one failure doesn't block the SW
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(ASSETS.map(url =>
        cache.add(url).catch(() => {})
      ));
      return;
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up old caches only if new cache exists
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.has(CACHE_NAME).then((exists) => {
      if (!exists) return self.clients.claim();
      return caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      }).then(() => self.clients.claim());
    })
  );
});

// Fetch Event: Cache-first for static assets, Network-first for HTML
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (new URL(event.request.url).origin !== self.location.origin) return;

  // Cache-first for fonts, CSS, JS, images, SVG
  const isStatic = /\.(woff2?|css|js|png|jpg|jpeg|gif|svg|ico|json)$/i.test(event.request.url);

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Network-first for navigation (HTML) so fresh content is always shown
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') return caches.match('./index.html');
        });
      })
  );
});
