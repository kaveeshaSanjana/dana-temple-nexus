
import { User, LoginRequest } from '@/types/auth';
import { Temple, Family, FamilyMember, Village, DanaAssignment, SystemStats } from '@/types/api';

const API_BASE_URL = 'http://localhost:8081';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<{ token: string; user: User }> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/api/users/me');
  }

  // Temple endpoints
  async getTemples(): Promise<Temple[]> {
    return this.request('/api/temples');
  }

  async getTemple(id: number): Promise<Temple> {
    return this.request(`/api/temples/${id}`);
  }

  async createTemple(temple: Partial<Temple>): Promise<Temple> {
    return this.request('/api/temples', {
      method: 'POST',
      body: JSON.stringify(temple),
    });
  }

  async updateTemple(id: number, temple: Partial<Temple>): Promise<Temple> {
    return this.request(`/api/temples/${id}`, {
      method: 'PUT',
      body: JSON.stringify(temple),
    });
  }

  async deleteTemple(id: number): Promise<void> {
    return this.request(`/api/temples/${id}`, {
      method: 'DELETE',
    });
  }

  // Family endpoints
  async getFamilies(): Promise<Family[]> {
    return this.request('/api/families');
  }

  async getFamiliesByTemple(templeId: number): Promise<Family[]> {
    return this.request(`/api/families/temple/${templeId}`);
  }

  async getFamily(id: number): Promise<Family> {
    return this.request(`/api/families/${id}`);
  }

  async createFamily(family: Partial<Family>): Promise<Family> {
    return this.request('/api/families', {
      method: 'POST',
      body: JSON.stringify(family),
    });
  }

  async updateFamily(id: number, family: Partial<Family>): Promise<Family> {
    return this.request(`/api/families/${id}`, {
      method: 'PUT',
      body: JSON.stringify(family),
    });
  }

  async deleteFamily(id: number): Promise<void> {
    return this.request(`/api/families/${id}`, {
      method: 'DELETE',
    });
  }

  async addFamilyMember(familyId: number, member: Partial<FamilyMember>): Promise<Family> {
    return this.request(`/api/families/${familyId}/members`, {
      method: 'POST',
      body: JSON.stringify(member),
    });
  }

  // Village endpoints
  async getVillages(): Promise<Village[]> {
    return this.request('/api/villages');
  }

  async getVillagesByTemple(templeId: number): Promise<Village[]> {
    return this.request(`/api/villages/temple/${templeId}`);
  }

  // Dana endpoints
  async getFamilyAssignments(familyId: number): Promise<DanaAssignment[]> {
    return this.request(`/api/dana/assignments/family/${familyId}`);
  }

  async createDanaAssignment(assignment: {
    templeId: number;
    familyIds: number[];
    date: string;
    timeSlot: string;
    notes?: string;
  }): Promise<DanaAssignment> {
    return this.request('/api/dana/assignments', {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
  }

  async autoAssignDana(templeId: number, startDate: string, endDate: string): Promise<DanaAssignment[]> {
    return this.request(`/api/dana/assignments/auto?templeId=${templeId}&startDate=${startDate}&endDate=${endDate}`, {
      method: 'POST',
    });
  }

  // Admin endpoints
  async getAllUsers(): Promise<User[]> {
    return this.request('/api/admin/users');
  }

  async getSystemStats(): Promise<SystemStats> {
    return this.request('/api/admin/stats');
  }

  async updateUserStatus(userId: number, enabled: boolean): Promise<User> {
    return this.request(`/api/admin/users/${userId}/status?enabled=${enabled}`, {
      method: 'PUT',
    });
  }

  async updateUserRole(userId: number, role: string): Promise<User> {
    return this.request(`/api/admin/users/${userId}/role?role=${role}`, {
      method: 'PUT',
    });
  }
}

export const apiService = new ApiService();
