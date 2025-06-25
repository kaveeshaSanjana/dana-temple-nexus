
import { API_CONFIG } from '@/config/api';
import { AuthService } from '@/services/authService';

export interface HeadMonkDTO {
  id?: number;
  monkName: string;
  email: string;
  phoneNumber: string;
  address: string;
  templeId: number;
}

export class HeadMonkService {
  static async getAllHeadMonks(): Promise<HeadMonkDTO[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEAD_MONK}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch head monks');
    }

    return response.json();
  }

  static async getHeadMonkById(id: number): Promise<HeadMonkDTO> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEAD_MONK}/${id}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch head monk');
    }

    return response.json();
  }

  static async getHeadMonksByTemple(templeId: number): Promise<HeadMonkDTO[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEAD_MONK_BY_TEMPLE}/${templeId}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch head monks by temple');
    }

    return response.json();
  }

  static async createHeadMonk(headMonkData: HeadMonkDTO): Promise<HeadMonkDTO> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEAD_MONK}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeaders(),
      },
      body: JSON.stringify(headMonkData),
    });

    if (!response.ok) {
      throw new Error('Failed to create head monk');
    }

    return response.json();
  }

  static async updateHeadMonk(id: number, headMonkData: HeadMonkDTO): Promise<HeadMonkDTO> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEAD_MONK}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeaders(),
      },
      body: JSON.stringify(headMonkData),
    });

    if (!response.ok) {
      throw new Error('Failed to update head monk');
    }

    return response.json();
  }

  static async deleteHeadMonk(id: number): Promise<void> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEAD_MONK}/${id}`, {
      method: 'DELETE',
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete head monk');
    }
  }
}
