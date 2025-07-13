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
  timeSlot: 'afternoon' | 'night' | 'both';
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

export interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  reporterId: string;
  reporterName: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  environment: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'ui' | 'backend' | 'database' | 'performance' | 'security' | 'other';
}

export interface AppReview {
  id: string;
  userId: string;
  username: string;
  rating: number;
  title: string;
  review: string;
  category: 'feature' | 'ui' | 'performance' | 'bug' | 'suggestion' | 'general';
  status: 'pending' | 'reviewed' | 'implemented' | 'rejected';
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  type: 'bug' | 'feature' | 'improvement' | 'task';
  status: 'open' | 'in-progress' | 'review' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  reporterId: string;
  reporterName: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags: string[];
  comments: IssueComment[];
}

export interface IssueComment {
  id: string;
  issueId: string;
  userId: string;
  username: string;
  comment: string;
  createdAt: string;
}

export interface Documentation {
  id: string;
  title: string;
  content: string;
  category: 'user-guide' | 'admin-guide' | 'api' | 'deployment' | 'troubleshooting';
  version: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  isPublished: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}