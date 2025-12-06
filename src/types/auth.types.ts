export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  maxCities: number;
  createdAt: number;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface StoredCredentials {
  email: string;
  password: string;
  user: User;
}
