
import { API_CONFIG } from '@/config/api';
import { TempleDanaAssignment } from '@/types/assignment';

export const assignmentService = {
  getAssignmentsByFamily: async (familyId: number): Promise<TempleDanaAssignment[]> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ASSIGNMENTS_BY_FAMILY}/${familyId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assignments by family');
    }

    return response.json();
  },

  getAssignmentsByDate: async (date: string): Promise<TempleDanaAssignment[]> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ASSIGNMENTS_BY_DATE}/${date}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assignments by date');
    }

    return response.json();
  },

  getAssignmentsByMember: async (phoneNumber: string): Promise<TempleDanaAssignment[]> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ASSIGNMENTS_BY_MEMBER}/${phoneNumber}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assignments by member');
    }

    return response.json();
  },
};
