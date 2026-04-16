import { useEffect } from 'react';
import api from '../utils/api';

// Helper: Convert VAPID base64 key to Uint8Array for PushManager
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const useNotifications = (isAuthenticated) => {
  const registerNeuralSync = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('❌ Neural Sync: Web Push not supported on this terminal.');
      return;
    }

    try {
      // 1. Register Service Worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('📡 Service Worker Synchronized:', registration.scope);

      // 2. Request Notification Permissions
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('❌ Neural Sync: Perception permissions denied.');
          return;
        }
      }

      if (Notification.permission === 'denied') {
        console.warn('❌ Neural Sync: Permissions already denied.');
        return;
      }

      // 3. Subscribe to Push Manager
      const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!VAPID_PUBLIC_KEY) {
        console.error('❌ VAPID Public Key missing — set VITE_VAPID_PUBLIC_KEY in Vercel env vars.');
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      // 4. Record Subscription in Focus Vault Backend
      await api.post('/notifications/subscribe', subscription.toJSON());
      console.log('✅ Neural Sync Established Successfully.');
      return true;
    } catch (error) {
      console.error('❌ Neural Sync Error:', error);
      return false;
    }
  };

  useEffect(() => {
    if (isAuthenticated && Notification.permission === 'granted') {
      registerNeuralSync();
    }
  }, [isAuthenticated]);

  return { registerNeuralSync };
};
