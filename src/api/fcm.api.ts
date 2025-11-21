import { getBaseUrl, getApiHeaders } from '@/contexts/utils/auth.api';

interface DeviceInfo {
  deviceId: string;
  deviceType: 'WEB';
  deviceName: string;
  appVersion: string;
  osVersion: string;
}

/**
 * Register FCM token with backend
 */
export const registerFCMToken = async (
  userId: string,
  fcmToken: string,
  deviceInfo: DeviceInfo
): Promise<any> => {
  const baseUrl = getBaseUrl();
  
  const response = await fetch(`${baseUrl}/users/fcm-tokens`, {
    method: 'POST',
    headers: getApiHeaders(),
    credentials: 'include',
    body: JSON.stringify({
      userId,
      fcmToken,
      ...deviceInfo
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to register FCM token: ${response.status}`);
  }

  return response.json();
};

/**
 * Update FCM token last seen
 */
export const updateTokenLastSeen = async (tokenId: number): Promise<void> => {
  const baseUrl = getBaseUrl();
  
  await fetch(`${baseUrl}/users/fcm-tokens/${tokenId}/last-seen`, {
    method: 'PATCH',
    headers: getApiHeaders(),
    credentials: 'include'
  });
};

/**
 * Deactivate FCM token (logout)
 */
export const deactivateFCMToken = async (tokenId: number): Promise<void> => {
  const baseUrl = getBaseUrl();
  
  await fetch(`${baseUrl}/users/fcm-tokens/${tokenId}/deactivate`, {
    method: 'PATCH',
    headers: getApiHeaders(),
    credentials: 'include'
  });
};
