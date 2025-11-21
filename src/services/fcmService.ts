import { getToken, onMessage } from 'firebase/messaging';
import { messaging, VAPID_KEY } from '@/config/firebase';

/**
 * Request notification permission and get FCM token
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.warn('Firebase Messaging is not supported in this browser');
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('✅ Service Worker registered');

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    console.log('✅ FCM Token obtained');
    return token;

  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

/**
 * Listen for foreground messages
 */
export const onMessageListener = (callback: (payload: any) => void) => {
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    console.log('📬 Foreground message received:', payload);
    callback(payload);
  });
};

/**
 * Generate unique device ID for this browser
 */
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('deviceId');
  
  if (!deviceId) {
    deviceId = `web-${navigator.userAgent.split(' ').slice(-1)[0]}-${Date.now()}`;
    localStorage.setItem('deviceId', deviceId);
  }
  
  return deviceId;
};

/**
 * Get device info
 */
export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  // Detect browser
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';

  // Detect OS
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';

  return {
    deviceId: getDeviceId(),
    deviceType: 'WEB' as const,
    deviceName: `${browser} on ${os}`,
    appVersion: '1.0.0',
    osVersion: os
  };
};
