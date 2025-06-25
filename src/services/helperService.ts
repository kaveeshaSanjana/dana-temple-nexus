
import { API_CONFIG } from '@/config/api';

export interface HelperDTO {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  templeId: number;
}

export const helperService = {
  getAllHelpers: async (): Promise<HelperDTO[]> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HELPER}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch helpers');
    }

    return response.json();
  },

  getHelpersByTemple: async (templeId: number): Promise<HelperDTO[]> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HELPER_BY_TEMPLE}/${templeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch helpers by temple');
    }

    return response.json();
  },

  createHelper: async (helperData: Omit<HelperDTO, 'id'>): Promise<HelperDTO> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HELPER}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(helperData),
    });

    if (!response.ok) {
      throw new Error('Failed to create helper');
    }

    return response.json();
  },

  updateHelper: async (id: number, helperData: Partial<HelperDTO>): Promise<HelperDTO> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HELPER}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(helperData),
    });

    if (!response.ok) {
      throw new Error('Failed to update helper');
    }

    return response.json();
  },

  getHelperById: async (id: number): Promise<HelperDTO> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HELPER}/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch helper');
    }

    return response.json();
  },
};
