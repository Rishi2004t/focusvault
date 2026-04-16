/* Focus Vault Neural Service Worker - V3 (PWA & Sync) */

const CACHE_NAME = 'focus-vault-core-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/badge-72x72.png'
];

// Install: Cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📡 [SW] Pre-caching Core Neural Assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ [SW] Purging Obsolete Cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
  // Only cache GET requests from our own origin
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip API calls for now to prevent caching stale auth/data
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Cache the new response
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Failure: Return cached response if available
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// ── Existing Push Notification Logic ──

self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('📡 Push Signal Received:', data);
      
      const options = {
        body: data.body || 'New Neural Alert Received.',
        icon: data.icon || '/icons/icon-192x192.png',
        badge: data.badge || '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        tag: data.tag || 'focus-vault-notification',
        renotify: true,
        data: data.data || {},
        actions: [
          {
            action: 'open_vault',
            title: 'Open Mission Board',
            icon: '/icons/open-vault.png'
          }
        ]
      };

      event.waitUntil(
        self.registration.showNotification(data.title || 'FocusVault Neural Alert', options)
      );
    } catch (err) {
      console.error('❌ Service Worker Push Parsing Error:', err);
      // Fallback for simple string payloads
      const text = event.data.text();
      event.waitUntil(
        self.registration.showNotification('FocusVault Alert', {
          body: text,
          icon: '/icons/icon-192x192.png'
        })
      );
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  // Determine target URL
  let targetUrl = '/tasks';
  if (event.notification.data) {
    targetUrl = event.notification.data.link || event.notification.data.url || '/tasks';
  }
  
  const urlToOpen = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(windowClients) {
        // Look for a window with the same URL or any FocusVault window
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If no matching window, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
