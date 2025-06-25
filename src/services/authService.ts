
import { API_CONFIG } from '@/config/api';
import { LoginRequest, LoginResponse } from '@/types/auth';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  static setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  static removeToken(): void {
    localStorage.removeItem('authToken');
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
