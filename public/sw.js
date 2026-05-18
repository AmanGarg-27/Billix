// Minimal Service Worker required for PWA installation
const CACHE_NAME = 'billix-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // A fetch handler is strictly required by Chrome to trigger the WebAPK install banner
  // and run the app in standalone/fullscreen mode. We just pass through requests.
  event.respondWith(fetch(event.request).catch(() => new Response("Network error")));
});
