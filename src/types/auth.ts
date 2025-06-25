
export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface Family {
  id: number;
  familyName: string;
  address: string;
  telephone: string;
}

export interface LoginResponse {
  token: string;
  userType: 'ADMIN' | 'HEADMONK' | 'HELPER' | 'MEMBER';
  name: string;
  phoneNumber: string;
  email: string;
  userId: number;
  templeId?: number;
  templeName?: string;
  family?: Family[];
}
