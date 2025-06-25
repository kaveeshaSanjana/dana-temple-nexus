
import { API_CONFIG } from '@/config/api';
import { AuthService } from '@/services/authService';

export interface HeadMonkProfile {
  id: number;
  monkName: string;
  email: string;
  phoneNumber: string;
  address: string;
  templeId: number;
}

export class HeadMonkService {
  static async getHeadMonkProfile(userId: number): Promise<HeadMonkProfile> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEAD_MONK}/${userId}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch head monk profile');
    }

    return response.json();
  }

  static async updateHeadMonkProfile(userId: number, profileData: Partial<HeadMonkProfile>): Promise<HeadMonkProfile> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEAD_MONK}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeaders(),
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to update head monk profile');
    }

    return response.json();
  }
}
