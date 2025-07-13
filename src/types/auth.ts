export interface User {
  id: string;
  username: string;
  role: 'user' | 'admin';
  email?: string;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}