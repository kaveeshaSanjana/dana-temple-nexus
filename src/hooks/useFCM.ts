import { useState, useEffect, useCallback } from 'react';
import { requestNotificationPermission, onMessageListener, getDeviceInfo } from '@/services/fcmService';
import { registerFCMToken, updateTokenLastSeen } from '@/api/fcm.api';
import { toast } from 'sonner';

interface FCMNotification {
  title?: string;
  body?: string;
  data?: any;
}

/**
 * Custom hook for FCM integration
 * Only activates when userId is provided (user is logged in)
 */
export const useFCM = (userId?: string) => {
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<FCMNotification | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Request notification permission and register token
   */
  const requestPermission = useCallback(async () => {
    if (!userId) {
      console.warn('Cannot request FCM permission without userId');
      return;
    }

    setLoading(true);
    try {
      const fcmToken = await requestNotificationPermission();
      
      if (fcmToken) {
        setToken(fcmToken);
        setPermissionGranted(true);

        // Register with backend
        const deviceInfo = getDeviceInfo();
        const result = await registerFCMToken(userId, fcmToken, deviceInfo);
        
        console.log('✅ FCM token registered with backend');

        // Store token and ID locally
        localStorage.setItem('fcm_token', fcmToken);
        localStorage.setItem('fcm_token_id', result.id?.toString() || '');
        
        toast.success('🔔 Notifications enabled successfully!');
      }
    } catch (error) {
      console.error('Error requesting FCM permission:', error);
      toast.error('Failed to enable notifications');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Listen for foreground messages
   */
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onMessageListener((payload) => {
      console.log('📬 Notification received:', payload);
      
      const notificationData = {
        title: payload.notification?.title,
        body: payload.notification?.body,
        data: payload.data
      };
      
      setNotification(notificationData);

      // Show toast notification
      toast(payload.notification?.title || 'New Notification', {
        description: payload.notification?.body,
        duration: 5000,
      });
    });

    return unsubscribe;
  }, [userId]);

  /**
   * Auto-request permission on login if not already granted
   */
  useEffect(() => {
    if (!userId) {
      // User logged out - clear token
      setToken(null);
      setPermissionGranted(false);
      return;
    }

    const savedToken = localStorage.getItem('fcm_token');
    if (savedToken && Notification.permission === 'granted') {
      setToken(savedToken);
      setPermissionGranted(true);
    } else if (Notification.permission === 'default') {
      // Don't auto-request, wait for user action
      console.log('FCM: Waiting for user to grant permission');
    }
  }, [userId]);

  /**
   * Update last seen every 5 minutes
   */
  useEffect(() => {
    if (!token || !userId) return;

    const interval = setInterval(() => {
      const tokenId = localStorage.getItem('fcm_token_id');
      if (tokenId) {
        updateTokenLastSeen(parseInt(tokenId)).catch(console.error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [token, userId]);

  return {
    token,
    notification,
    permissionGranted,
    loading,
    requestPermission
  };
};
