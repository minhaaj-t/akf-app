import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@messfood.ae',
    role: 'admin',
    status: 'approved',
    planType: 'yearly',
    joinDate: '2024-01-01',
    deliveryTime: '12:00 PM',
    paymentStatus: 'paid',
    daysActive: 25,
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    role: 'user',
    status: 'approved',
    planType: 'monthly',
    joinDate: '2024-01-15',
    deliveryTime: '1:00 PM',
    paymentStatus: 'paid',
    daysActive: 10,
    expiryDate: '2024-02-15',
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let user: User | null = null;
    
    if (username === 'admin' && password === 'admin') {
      user = mockUsers.find(u => u.username === 'admin') || null;
    } else if (username === 'user' && password === 'user') {
      user = mockUsers.find(u => u.username === 'user') || null;
    }
    
    if (user && user.status === 'approved') {
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });
      return true;
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};