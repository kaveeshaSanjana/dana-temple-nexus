
import { API_CONFIG } from '@/config/api';
import { AuthService } from '@/services/authService';

export interface VillageDTO {
  id?: number;
  name: string;
  province: string;
  district: string;
  country: string;
  postalCode: string;
}

export class VillageService {
  static async getAllVillages(): Promise<VillageDTO[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VILLAGE}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch villages');
    }

    return response.json();
  }

  static async createVillage(villageData: VillageDTO): Promise<VillageDTO> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VILLAGE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeaders(),
      },
      body: JSON.stringify(villageData),
    });

    if (!response.ok) {
      throw new Error('Failed to create village');
    }

    return response.json();
  }
}
