
import { User, LoginRequest } from '@/types/auth';
import { Temple, Family, Village, DanaAssignment, SystemStats } from '@/types/api';

const API_BASE_URL = 'http://localhost:8081/api';

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return {} as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<{ token: string; user: User }> {
    return this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  // Temple endpoints
  async getTemples(): Promise<Temple[]> {
    return this.request<Temple[]>('/temples');
  }

  async getTemple(id: number): Promise<Temple> {
    return this.request<Temple>(`/temples/${id}`);
  }

  async createTemple(temple: Partial<Temple>): Promise<Temple> {
    return this.request<Temple>('/temples', {
      method: 'POST',
      body: JSON.stringify(temple),
    });
  }

  async updateTemple(id: number, temple: Partial<Temple>): Promise<Temple> {
    return this.request<Temple>(`/temples/${id}`, {
      method: 'PUT',
      body: JSON.stringify(temple),
    });
  }

  async deleteTemple(id: number): Promise<void> {
    return this.request<void>(`/temples/${id}`, {
      method: 'DELETE',
    });
  }

  // Family endpoints
  async getFamilies(): Promise<Family[]> {
    return this.request<Family[]>('/families');
  }

  async getFamily(id: number): Promise<Family> {
    return this.request<Family>(`/families/${id}`);
  }

  async getFamiliesByTemple(templeId: number): Promise<Family[]> {
    return this.request<Family[]>(`/families/temple/${templeId}`);
  }

  async createFamily(family: Partial<Family>): Promise<Family> {
    return this.request<Family>('/families', {
      method: 'POST',
      body: JSON.stringify(family),
    });
  }

  async updateFamily(id: number, family: Partial<Family>): Promise<Family> {
    return this.request<Family>(`/families/${id}`, {
      method: 'PUT',
      body: JSON.stringify(family),
    });
  }

  async deleteFamily(id: number): Promise<void> {
    return this.request<void>(`/families/${id}`, {
      method: 'DELETE',
    });
  }

  // Village endpoints
  async getVillages(): Promise<Village[]> {
    return this.request<Village[]>('/villages');
  }

  async getVillage(id: number): Promise<Village> {
    return this.request<Village>(`/villages/${id}`);
  }

  async getVillagesByTemple(templeId: number): Promise<Village[]> {
    return this.request<Village[]>(`/villages/temple/${templeId}`);
  }

  async createVillage(village: Partial<Village>): Promise<Village> {
    return this.request<Village>('/villages', {
      method: 'POST',
      body: JSON.stringify(village),
    });
  }

  async updateVillage(id: number, village: Partial<Village>): Promise<Village> {
    return this.request<Village>(`/villages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(village),
    });
  }

  async deleteVillage(id: number): Promise<void> {
    return this.request<void>(`/villages/${id}`, {
      method: 'DELETE',
    });
  }

  // Dana endpoints
  async getFamilyAssignments(familyId: number): Promise<DanaAssignment[]> {
    return this.request<DanaAssignment[]>(`/dana/assignments/family/${familyId}`);
  }

  async createDanaAssignment(assignment: any): Promise<DanaAssignment> {
    return this.request<DanaAssignment>('/dana/assignments', {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
  }

  // Admin endpoints
  async getSystemStats(): Promise<SystemStats> {
    return this.request<SystemStats>('/admin/stats');
  }

  async getAllUsers(): Promise<User[]> {
    return this.request<User[]>('/admin/users');
  }

  async createUser(userData: any): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: any): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<void> {
    return this.request<void>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
