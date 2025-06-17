
export type UserRole = 'SUPER_ADMIN' | 'HEAD_MONK' | 'HELPER' | 'MEMBER';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  templeRoles: Record<number, UserRole>;
  enabled: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}
