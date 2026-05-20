// FieldForce Pro — Service Worker
// Always serves fresh content, no stale cache issues

const CACHE = 'fieldforce-v2';

self.addEventListener('install', e => {
  self.skipWaiting(); // Activate immediately, don't wait
});

self.addEventListener('activate', e => {
  // Delete ALL old caches
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Never cache — always fetch fresh from network
  // This ensures updates deploy instantly without hard refresh
  if(e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request).catch(() => {
      // Only use cache as fallback when completely offline
      return caches.match(e.request);
    })
  );
});
