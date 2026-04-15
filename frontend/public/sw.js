/* Focus Vault Neural Service Worker */

self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      
      const options = {
        body: data.body,
        icon: data.icon || '/icons/icon-192x192.png',
        badge: data.badge || '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: data.data,
        actions: [
          {
            action: 'open_vault',
            title: 'Open Vault',
            icon: '/icons/open-vault.png'
          }
        ]
      };

      event.waitUntil(
        self.registration.showNotification(data.title || 'Neural Alert', options)
      );
    } catch (err) {
      console.error('❌ Service Worker Push Error:', err);
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'open_vault' || !event.action) {
    // Open the direct mission link if it exists, otherwise fallback to vault
    const targetUrl = event.notification.data.link || event.notification.data.url || '/tasks';
    const urlToOpen = new URL(targetUrl, self.location.origin).href;

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(function(windowClients) {
          for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});
