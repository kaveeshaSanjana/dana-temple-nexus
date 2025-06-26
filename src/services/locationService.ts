
import { API_CONFIG } from '@/config/api';
import { AuthService } from '@/services/authService';

export interface Temple {
  id: number;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  website: string;
  province: string | null;
  district: string | null;
  town: string | null;
}

export interface Province {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  province: Province;
}

export interface Town {
  id: number;
  name: string;
  district: District;
}

export class LocationService {
  static async getTempleById(templeId: number): Promise<Temple> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEMPLE}/${templeId}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch temple details');
    }

    return response.json();
  }

  static async getVillagesByTemple(templeId: number): Promise<any[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VILLAGE_BY_TEMPLE}/${templeId}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch temple villages');
    }

    return response.json();
  }
}
