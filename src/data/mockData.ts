import { User, MenuItem, Banner, Feedback, DeliveryRequest, BugReport, AppReview, Issue, IssueComment, Documentation } from '../types';

export const mockUsers: User[] = [
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

export const mockMenuItems: MenuItem[] = [
  // Today's menus
  {
    id: '1',
    date: new Date().toISOString().split('T')[0], // Today's date
    timeSlot: 'afternoon',
    mainDish: 'Chicken Biryani',
    sideDish: 'Raita',
    rice: 'Basmati Rice',
    dessert: 'Kheer',
    alternatives: {
      'Chicken Biryani': ['Chapati + Fish Curry', 'Vegetable Pulao'],
      'Raita': ['Pickle', 'Salad'],
    },
    notes: 'Extra spicy available on request',
    cutoffTime: '12:00 PM',
  },
  {
    id: '2',
    date: new Date().toISOString().split('T')[0], // Today's date
    timeSlot: 'night',
    mainDish: 'Mutton Curry',
    sideDish: 'Naan',
    rice: 'Jeera Rice',
    dessert: 'Gulab Jamun',
    alternatives: {
      'Mutton Curry': ['Chicken Tikka', 'Dal Tadka'],
      'Naan': ['Roti', 'Paratha'],
    },
    notes: 'Fresh mutton from local supplier',
    cutoffTime: '6:00 PM',
  },
  // Tomorrow's menus
  {
    id: '3',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow's date
    timeSlot: 'afternoon',
    mainDish: 'Fish Curry',
    sideDish: 'Steamed Rice',
    rice: 'Plain Rice',
    dessert: 'Rasgulla',
    alternatives: {
      'Fish Curry': ['Chicken Curry', 'Egg Curry'],
      'Steamed Rice': ['Fried Rice', 'Pulao'],
    },
    notes: 'Fresh fish from local market',
    cutoffTime: '12:00 PM',
  },
  {
    id: '4',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow's date
    timeSlot: 'night',
    mainDish: 'Beef Steak',
    sideDish: 'Mashed Potatoes',
    rice: 'Brown Rice',
    dessert: 'Chocolate Cake',
    alternatives: {
      'Beef Steak': ['Chicken Breast', 'Grilled Fish'],
      'Mashed Potatoes': ['French Fries', 'Baked Potato'],
    },
    notes: 'Premium quality beef',
    cutoffTime: '6:00 PM',
  },
  // Day after tomorrow's menus
  {
    id: '5',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    timeSlot: 'afternoon',
    mainDish: 'Vegetable Pulao',
    sideDish: 'Dal Fry',
    rice: 'Mixed Rice',
    dessert: 'Fruit Salad',
    alternatives: {
      'Vegetable Pulao': ['Plain Rice + Curry', 'Biryani'],
      'Dal Fry': ['Raita', 'Pickle'],
    },
    notes: 'Vegetarian special',
    cutoffTime: '12:00 PM',
  },
  {
    id: '6',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    timeSlot: 'night',
    mainDish: 'Chicken Tikka',
    sideDish: 'Onion Salad',
    rice: 'Saffron Rice',
    dessert: 'Ice Cream',
    alternatives: {
      'Chicken Tikka': ['Fish Tikka', 'Paneer Tikka'],
      'Onion Salad': ['Cucumber Salad', 'Mixed Salad'],
    },
    notes: 'Tandoori style cooking',
    cutoffTime: '6:00 PM',
  },
  // Additional future dates for variety
  {
    id: '7',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    timeSlot: 'afternoon',
    mainDish: 'Lamb Biryani',
    sideDish: 'Cucumber Raita',
    rice: 'Saffron Basmati',
    dessert: 'Jalebi',
    alternatives: {
      'Lamb Biryani': ['Chicken Biryani', 'Vegetable Biryani'],
      'Cucumber Raita': ['Mint Raita', 'Onion Raita'],
    },
    notes: 'Traditional lamb biryani with aromatic spices',
    cutoffTime: '12:00 PM',
  },
  {
    id: '8',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    timeSlot: 'night',
    mainDish: 'Grilled Salmon',
    sideDish: 'Quinoa Salad',
    rice: 'Wild Rice',
    dessert: 'Cheesecake',
    alternatives: {
      'Grilled Salmon': ['Grilled Chicken', 'Grilled Vegetables'],
      'Quinoa Salad': ['Greek Salad', 'Caesar Salad'],
    },
    notes: 'Healthy and nutritious meal option',
    cutoffTime: '6:00 PM',
  },
];

export const mockBanners: Banner[] = [
  {
    id: '1',
    title: 'Welcome to Ajman Mess Food',
    message: 'Enjoy fresh, homemade meals delivered to your doorstep daily!',
    type: 'info',
    active: true,
    createdAt: '2024-01-20',
  },
  {
    id: '2',
    title: 'Payment Reminder',
    message: 'Monthly payments are due by the 5th of each month. Please ensure timely payment.',
    type: 'warning',
    active: true,
    createdAt: '2024-01-22',
  },
  {
    id: '3',
    title: 'Emergency Notice',
    message: 'Due to weather conditions, delivery may be delayed by 30 minutes today.',
    type: 'emergency',
    active: false,
    createdAt: '2024-01-24',
  },
];

export const mockFeedback: Feedback[] = [
  {
    id: '1',
    userId: '2',
    username: 'ahmed_ali',
    message: 'Excellent food quality and timely delivery. Very satisfied with the service!',
    rating: 5,
    status: 'approved',
    createdAt: '2024-01-23',
  },
  {
    id: '2',
    userId: '3',
    username: 'fatima_hassan',
    message: 'Good food but sometimes delivery is late. Overall happy with the taste.',
    rating: 4,
    status: 'pending',
    createdAt: '2024-01-24',
  },
  {
    id: '3',
    userId: '2',
    username: 'ahmed_ali',
    message: 'The biryani was amazing yesterday! Keep up the good work.',
    rating: 5,
    status: 'approved',
    createdAt: '2024-01-24',
  },
];

export const mockDeliveryRequests: DeliveryRequest[] = [
  {
    id: '1',
    userId: '2',
    username: 'ahmed_ali',
    currentTime: '1:00 PM',
    requestedTime: '2:30 PM',
    reason: 'Office meeting until 2:00 PM',
    status: 'pending',
    createdAt: '2024-01-24',
  },
  {
    id: '2',
    userId: '3',
    username: 'fatima_hassan',
    currentTime: '12:30 PM',
    requestedTime: '11:30 AM',
    reason: 'Early lunch break',
    status: 'approved',
    createdAt: '2024-01-23',
  },
];

export const mockBugReports: BugReport[] = [
  {
    id: '1',
    title: 'Menu not loading for night shift users',
    description: 'Users with only night shift delivery plans are not seeing any menu items',
    severity: 'high',
    status: 'open',
    reporterId: '2',
    reporterName: 'user',
    stepsToReproduce: '1. Login as user with only night shift plan\n2. Navigate to Menu section\n3. No menu items are displayed',
    expectedBehavior: 'Should show night shift menu items',
    actualBehavior: 'No menu items displayed',
    environment: 'Chrome 120.0.0, Windows 11',
    createdAt: '2024-01-25T10:30:00Z',
    updatedAt: '2024-01-25T10:30:00Z',
    priority: 'high',
    category: 'ui'
  },
  {
    id: '2',
    title: 'Payment status not updating after successful payment',
    description: 'Payment status remains unpaid even after successful bank transfer',
    severity: 'medium',
    status: 'in-progress',
    reporterId: '3',
    reporterName: 'fatima_hassan',
    stepsToReproduce: '1. Complete bank transfer\n2. Check payment status\n3. Status still shows unpaid',
    expectedBehavior: 'Payment status should update to paid',
    actualBehavior: 'Status remains unpaid',
    environment: 'Safari 17.0, macOS 14.0',
    createdAt: '2024-01-24T15:45:00Z',
    updatedAt: '2024-01-25T09:15:00Z',
    assignedTo: 'admin',
    priority: 'medium',
    category: 'backend'
  },
  {
    id: '3',
    title: 'Delivery tracking map not loading on mobile',
    description: 'Map component fails to load on mobile devices',
    severity: 'medium',
    status: 'resolved',
    reporterId: '4',
    reporterName: 'omar_khalil',
    stepsToReproduce: '1. Open app on mobile\n2. Navigate to dashboard\n3. Map shows loading spinner indefinitely',
    expectedBehavior: 'Map should load and show delivery route',
    actualBehavior: 'Map stuck on loading',
    environment: 'Chrome Mobile 120.0.0, Android 14',
    createdAt: '2024-01-23T08:20:00Z',
    updatedAt: '2024-01-24T16:30:00Z',
    assignedTo: 'admin',
    priority: 'medium',
    category: 'ui'
  }
];

export const mockAppReviews: AppReview[] = [
  {
    id: '1',
    userId: '2',
    username: 'user',
    rating: 4,
    title: 'Great app, but needs some improvements',
    review: 'The app is very useful for managing meal deliveries. The interface is clean and easy to use. However, I would like to see more menu customization options and better notification system.',
    category: 'feature',
    status: 'reviewed',
    createdAt: '2024-01-25T12:00:00Z',
    updatedAt: '2024-01-25T14:30:00Z',
    adminResponse: 'Thank you for your feedback! We are working on adding more customization options and improving notifications in the next update.'
  },
  {
    id: '2',
    userId: '3',
    username: 'fatima_hassan',
    rating: 5,
    title: 'Excellent service and app',
    review: 'The food quality is amazing and the app makes it so easy to manage my deliveries. Love the real-time tracking feature!',
    category: 'general',
    status: 'reviewed',
    createdAt: '2024-01-24T18:30:00Z',
    updatedAt: '2024-01-25T10:15:00Z',
    adminResponse: 'Thank you for your kind words! We are glad you enjoy our service.'
  },
  {
    id: '3',
    userId: '4',
    username: 'omar_khalil',
    rating: 3,
    title: 'Good but slow on mobile',
    review: 'The app works well but is quite slow on my mobile device. Also, some buttons are too small to tap easily.',
    category: 'performance',
    status: 'pending',
    createdAt: '2024-01-23T20:15:00Z',
    updatedAt: '2024-01-23T20:15:00Z'
  }
];

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Implement time-based menu filtering',
    description: 'Users should only see menus for their subscribed delivery times (afternoon/night)',
    type: 'feature',
    status: 'in-progress',
    priority: 'high',
    reporterId: '1',
    reporterName: 'admin',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-25T11:30:00Z',
    dueDate: '2024-01-30T17:00:00Z',
    tags: ['menu', 'filtering', 'user-experience'],
    comments: [
      {
        id: '1',
        issueId: '1',
        userId: '1',
        username: 'admin',
        comment: 'This feature is critical for user experience. Users are confused when they see menus for times they don\'t subscribe to.',
        createdAt: '2024-01-20T09:00:00Z'
      },
      {
        id: '2',
        issueId: '1',
        userId: '2',
        username: 'user',
        comment: 'Agreed! I only have afternoon delivery but I see night menus which is confusing.',
        createdAt: '2024-01-21T14:20:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Fix payment status update bug',
    description: 'Payment status is not updating automatically after successful bank transfers',
    type: 'bug',
    status: 'open',
    priority: 'high',
    reporterId: '3',
    reporterName: 'fatima_hassan',
    createdAt: '2024-01-24T15:45:00Z',
    updatedAt: '2024-01-24T15:45:00Z',
    tags: ['payment', 'backend', 'bug'],
    comments: []
  },
  {
    id: '3',
    title: 'Add dark mode support',
    description: 'Implement dark mode theme for better user experience in low-light conditions',
    type: 'improvement',
    status: 'open',
    priority: 'medium',
    reporterId: '4',
    reporterName: 'omar_khalil',
    createdAt: '2024-01-22T16:30:00Z',
    updatedAt: '2024-01-22T16:30:00Z',
    tags: ['ui', 'theme', 'accessibility'],
    comments: []
  }
];

export const mockDocumentation: Documentation[] = [
  {
    id: '1',
    title: 'User Guide - Getting Started',
    content: `# Getting Started with Ajman Mess Food

## Welcome to Ajman Mess Food Service!

This guide will help you get started with our meal delivery service.

### 1. Account Setup
- Create your account with your email and preferred username
- Choose your delivery plan (afternoon, night, or both)
- Set your delivery address and preferences

### 2. Menu Management
- View daily menus for your subscribed delivery times
- Customize your meals with available alternatives
- Submit special dietary requirements

### 3. Payment
- Choose between cash or bank transfer
- Monthly or yearly subscription plans
- Automatic payment reminders

### 4. Delivery Tracking
- Real-time delivery tracking on the map
- Estimated delivery times
- Delivery status updates

### 5. Support
- Contact admin for any issues
- Submit feedback and reviews
- Request delivery time changes

For technical support, please contact: admin@messfood.ae`,
    category: 'user-guide',
    version: '1.0.0',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
    author: 'admin',
    isPublished: true
  },
  {
    id: '2',
    title: 'Admin Guide - System Management',
    content: `# Admin Guide - System Management

## Overview
This guide covers all administrative functions of the Ajman Mess Food system.

### User Management
- Approve/reject new user registrations
- Manage user delivery plans and preferences
- View user activity and payment status

### Menu Management
- Create and edit daily menus for afternoon and night shifts
- Set alternative meal options
- Manage cutoff times for menu changes

### Payment Management
- Track payment status for all users
- Manage payment methods and plans
- Generate payment reports

### Banner Management
- Create and manage system announcements
- Set emergency notices and warnings
- Control banner visibility and timing

### Delivery Management
- Handle delivery time change requests
- Monitor delivery status
- Manage delivery routes and tracking

### System Configuration
- Email settings and notifications
- System preferences and defaults
- Backup and maintenance procedures

For technical issues, contact the development team.`,
    category: 'admin-guide',
    version: '1.0.0',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
    author: 'admin',
    isPublished: true
  },
  {
    id: '3',
    title: 'API Documentation',
    content: `# API Documentation

## Authentication
All API endpoints require authentication using JWT tokens.

### Base URL
\`\`\`
https://api.messfood.ae/v1
\`\`\`

### Authentication Header
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Endpoints

### Users
- \`GET /users\` - Get all users (admin only)
- \`POST /users\` - Create new user
- \`PUT /users/:id\` - Update user
- \`DELETE /users/:id\` - Delete user (admin only)

### Menus
- \`GET /menus\` - Get menus for date range
- \`POST /menus\` - Create new menu (admin only)
- \`PUT /menus/:id\` - Update menu (admin only)
- \`DELETE /menus/:id\` - Delete menu (admin only)

### Payments
- \`GET /payments\` - Get payment history
- \`POST /payments\` - Create payment record
- \`PUT /payments/:id\` - Update payment status

### Feedback
- \`GET /feedback\` - Get feedback submissions
- \`POST /feedback\` - Submit new feedback
- \`PUT /feedback/:id\` - Update feedback status

## Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error`,
    category: 'api',
    version: '1.0.0',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
    author: 'admin',
    isPublished: true
  }
];