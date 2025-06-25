
import { API_CONFIG } from '@/config/api';

export interface DanaType {
  id: number;
  name: string;
  description: string;
  time: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
}

export interface TempleDana {
  templeId: number | null;
  dana: DanaType;
  minNumberOfFamilies: number;
}

export const danaService = {
  getTempleDanas: async (templeId: number): Promise<TempleDana[]> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEMPLE_DANA}/${templeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch temple danas');
    }

    return response.json();
  },

  getAllDanaTypes: async (): Promise<DanaType[]> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DANA_TYPES}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dana types');
    }

    return response.json();
  },

  assignDanaToTemple: async (danaId: number, minCount: number): Promise<void> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ASSIGN_DANA}/${danaId}/${minCount}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to assign dana to temple');
    }
  },
};
