import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { databaseService } from '../services/database';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      // In browser environment, always use mock authentication
      // Database connections are handled server-side only
      console.log('Using mock authentication (database not available in browser)');
      return await mockLogin(username, password);
      
      // Note: Database authentication would be handled server-side
      // For now, we use mock authentication in browser environment
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to mock authentication
      return await mockLogin(username, password);
    }
  };

  const mockLogin = async (username: string, password: string): Promise<boolean> => {
    // Mock users for development when database is not available
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@messfood.ae',
        role: 'admin',
        status: 'approved',
        planType: 'yearly',
        joinDate: '2024-01-01',
        deliveryPlans: { afternoon: '12:00 PM', night: '8:00 PM' },
        paymentStatus: 'paid',
        daysActive: 25,
        avatarConfig: {},
      },
      {
        id: '2',
        username: 'user',
        email: 'user@example.com',
        role: 'user',
        status: 'approved',
        planType: 'monthly',
        joinDate: '2024-01-15',
        deliveryPlans: { afternoon: '1:00 PM' },
        paymentStatus: 'paid',
        daysActive: 10,
        expiryDate: '2024-02-15',
        avatarConfig: {},
      },
      {
        id: '3',
        username: 'fatima_hassan',
        email: 'fatima@example.com',
        role: 'user',
        status: 'approved',
        planType: 'yearly',
        joinDate: '2024-01-10',
        deliveryPlans: { night: '8:30 PM' },
        paymentStatus: 'unpaid',
        paymentMethod: 'cash',
        daysActive: 15,
        expiryDate: '2025-01-10',
        avatarConfig: {},
      },
      {
        id: '4',
        username: 'omar_khalil',
        email: 'omar@example.com',
        role: 'user',
        status: 'pending',
        planType: 'monthly',
        joinDate: '2024-01-20',
        deliveryPlans: { afternoon: '2:00 PM', night: '9:00 PM' },
        paymentStatus: 'unpaid',
        daysActive: 5,
        expiryDate: '2024-02-20',
        avatarConfig: {},
      },
      {
        id: '5',
        username: 'no_plans_user',
        email: 'noplans@example.com',
        role: 'user',
        status: 'approved',
        planType: 'monthly',
        joinDate: '2024-01-25',
        deliveryPlans: {}, // No delivery plans
        paymentStatus: 'unpaid',
        daysActive: 2,
        expiryDate: '2024-02-25',
        avatarConfig: {},
      },
    ];

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let user: User | null = null;
    
    if (username === 'admin' && password === 'admin') {
      user = mockUsers.find(u => u.username === 'admin') || null;
    } else if (username === 'user' && password === 'user') {
      user = mockUsers.find(u => u.username === 'user') || null;
    } else if (username === 'no_plans_user' && password === 'no_plans_user') {
      user = mockUsers.find(u => u.username === 'no_plans_user') || null;
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