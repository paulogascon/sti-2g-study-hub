// ==========================================================================
// SERVICE WORKER - STI 2G STUDY HUB (v2)
// Network-First for Data + Stale-While-Revalidate for Assets
// Enables instant automatic cloud synchronization on refresh & 100% offline access
// ==========================================================================

const CACHE_NAME = 'sti-2g-hub-v5';
const OFFLINE_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/app.js',
  './js/schedule.js',
  './js/quiz.js',
  './js/tasks.js',
  './js/offline-storage.js',
  './js/data/seeds.js',
  './js/data/subjects.json',
  './js/data/schedule.json',
  './js/data/quizzes.json',
  './js/data/handouts.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

// Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching core app shell for offline use');
      return cache.addAll(OFFLINE_SHELL);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean old caches & claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Evicting outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Dynamic routing strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isDataOrHtml = 
    url.pathname.includes('/js/data/') || 
    url.pathname.endsWith('.json') || 
    url.pathname.endsWith('.html') || 
    event.request.mode === 'navigate';

  if (isDataOrHtml) {
    // -------------------------------------------------------------
    // NETWORK-FIRST STRATEGY (Schedules, Handouts, Quizzes, HTML)
    // Always fetch fresh data if online, fall back to offline cache
    // -------------------------------------------------------------
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
        })
    );
  } else {
    // -------------------------------------------------------------
    // STALE-WHILE-REVALIDATE STRATEGY (CSS, JS, Icons, Fonts)
    // Serve instant cache, refresh behind the scenes
    // -------------------------------------------------------------
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Ignore network errors when cached response exists
        });

        return cachedResponse || fetchPromise;
      })
    );
  }
});
