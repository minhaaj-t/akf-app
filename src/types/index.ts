export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'pending' | 'approved' | 'rejected';
  planType: 'monthly' | 'yearly';
  joinDate: string;
  deliveryPlans: {
    afternoon?: string;
    night?: string;
  };
  paymentStatus: 'paid' | 'unpaid';
  paymentMethod?: 'cash' | 'bank';
  daysActive: number;
  expiryDate?: string;
  profileSticker?: string;
  avatarConfig?: any; // react-nice-avatar config
}

export interface MenuItem {
  id: string;
  date: string;
  mainDish: string;
  sideDish: string;
  rice: string;
  dessert?: string;
  alternatives: {
    [key: string]: string[];
  };
  notes?: string;
  cutoffTime: string;
}

export interface Banner {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'emergency';
  active: boolean;
  createdAt: string;
}

export interface Feedback {
  id: string;
  userId: string;
  username: string;
  message: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface DeliveryRequest {
  id: string;
  userId: string;
  username: string;
  currentTime: string;
  requestedTime: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface MenuChange {
  id: string;
  userId: string;
  date: string;
  originalItem: string;
  replacementItem: string;
  specialNote?: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}