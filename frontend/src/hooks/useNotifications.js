import { useEffect } from 'react';
import api from '../utils/api';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export const useNotifications = (isAuthenticated) => {
  useEffect(() => {
    if (isAuthenticated) {
      registerNeuralSync();
    }
  }, [isAuthenticated]);

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
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('❌ Neural Sync: Perception permissions denied.');
        return;
      }

      // 3. Subscribe to Push Manager
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      // 4. Record Subscription in Focus Vault Backend
      await api.post('/notifications/subscribe', subscription);
      console.log('✅ Neural Sync Established Successfully.');
    } catch (error) {
      console.error('❌ Neural Sync Error:', error);
    }
  };

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
};
