// Database service with support for both MySQL and PostgreSQL
// Automatically detects which database to use based on environment variables
// Includes client-side fallback for browser environments

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  ssl?: any;
}

interface IDatabaseService {
  query: (sql: string, params?: any[]) => Promise<any>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Detect database type based on environment variables
const isSupabase = !isBrowser && process.env.SUPABASE_HOST && process.env.SUPABASE_PASSWORD;
const isMySQL = !isBrowser && process.env.DB_HOST && process.env.DB_PASSWORD;

let dbService: IDatabaseService | null = null;

async function initializeDatabase(): Promise<IDatabaseService> {
  if (dbService) {
    return dbService;
  }

  // In browser environment, always use mock database service
  if (isBrowser) {
    console.log('🌐 Browser environment detected, using mock database service');
    dbService = createMockDatabaseService();
    return dbService;
  }

  if (isSupabase) {
    try {
      // Use PostgreSQL (Supabase)
      const { Client } = await import('pg');
      
      const config: DatabaseConfig = {
        host: process.env.SUPABASE_HOST!,
        user: process.env.SUPABASE_USER || 'postgres',
        password: process.env.SUPABASE_PASSWORD!,
        database: process.env.SUPABASE_DATABASE || 'postgres',
        port: parseInt(process.env.SUPABASE_PORT || '5432'),
        ssl: {
          rejectUnauthorized: false
        }
      };

      const client = new Client(config);
      
      dbService = {
        async connect() {
          await client.connect();
        },
        async disconnect() {
          await client.end();
        },
        async query(sql: string, params: any[] = []) {
          const result = await client.query(sql, params);
          return result.rows;
        }
      };

      console.log('🔗 Connected to Supabase PostgreSQL database');
    } catch (error) {
      console.error('❌ Failed to connect to Supabase:', error);
      dbService = createMockDatabaseService();
    }
  } else if (isMySQL) {
    try {
      // Use MySQL
      const mysql = await import('mysql2/promise');
      
      const config: DatabaseConfig = {
        host: process.env.DB_HOST!,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
        port: parseInt(process.env.DB_PORT || '3306')
      };

      const connection = await mysql.createConnection(config);
      
      dbService = {
        async connect() {
          // Connection already established
        },
        async disconnect() {
          await connection.end();
        },
        async query(sql: string, params: any[] = []) {
          const [rows] = await connection.execute(sql, params);
          return rows;
        }
      };

      console.log('🔗 Connected to MySQL database');
    } catch (error) {
      console.error('❌ Failed to connect to MySQL:', error);
      dbService = createMockDatabaseService();
    }
  } else {
    // Fallback to mock data
    console.log('⚠️ No database configuration found, using mock data');
    dbService = createMockDatabaseService();
  }

  return dbService;
}

function createMockDatabaseService(): IDatabaseService {
  // Mock user data for authentication
  const mockUsers = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@messfood.ae',
      role: 'admin',
      status: 'approved',
      plan_type: 'yearly',
      join_date: '2024-01-01',
      delivery_plans: { afternoon: '12:00 PM', night: '8:00 PM' },
      payment_status: 'paid',
      days_active: 25,
      avatar_config: {},
    },
    {
      id: 2,
      username: 'user',
      email: 'user@example.com',
      role: 'user',
      status: 'approved',
      plan_type: 'monthly',
      join_date: '2024-01-15',
      delivery_plans: { afternoon: '1:00 PM' },
      payment_status: 'paid',
      days_active: 10,
      expiry_date: '2024-02-15',
      avatar_config: {},
    },
    {
      id: 3,
      username: 'fatima_hassan',
      email: 'fatima@example.com',
      role: 'user',
      status: 'approved',
      plan_type: 'yearly',
      join_date: '2024-01-10',
      delivery_plans: { night: '8:30 PM' },
      payment_status: 'unpaid',
      payment_method: 'cash',
      days_active: 15,
      expiry_date: '2025-01-10',
      avatar_config: {},
    },
    {
      id: 4,
      username: 'omar_khalil',
      email: 'omar@example.com',
      role: 'user',
      status: 'pending',
      plan_type: 'monthly',
      join_date: '2024-01-20',
      delivery_plans: { afternoon: '2:00 PM', night: '9:00 PM' },
      payment_status: 'unpaid',
      days_active: 5,
      expiry_date: '2024-02-20',
      avatar_config: {},
    },
    {
      id: 5,
      username: 'no_plans_user',
      email: 'noplans@example.com',
      role: 'user',
      status: 'approved',
      plan_type: 'monthly',
      join_date: '2024-01-25',
      delivery_plans: {},
      payment_status: 'unpaid',
      days_active: 2,
      expiry_date: '2024-02-25',
      avatar_config: {},
    },
  ];

  return {
    async connect() {
      console.log('🎭 Using mock database service');
    },
    async disconnect() {
      console.log('🎭 Mock database disconnected');
    },
    async query(sql: string, params: any[] = []) {
      console.log('🎭 Mock query:', sql, params);
      
      // Handle user queries
      if (sql.includes('SELECT * FROM users WHERE username = ?')) {
        const username = params[0];
        const user = mockUsers.find(u => u.username === username);
        return user ? [user] : [];
      }
      
      if (sql.includes('SELECT * FROM users WHERE id = ?')) {
        const id = params[0];
        const user = mockUsers.find(u => u.id === id);
        return user ? [user] : [];
      }
      
      if (sql.includes('SELECT * FROM users ORDER BY')) {
        return mockUsers;
      }
      
      // Return empty array for other queries
      return [];
    }
  };
}

// Database operations
export class DatabaseService {
  private static instance: DatabaseService | null = null;
  private db: IDatabaseService | null = null;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async connect(): Promise<void> {
    try {
      this.db = await initializeDatabase();
      await this.db.connect();
    } catch (error) {
      console.error('Failed to connect to database:', error);
      this.db = createMockDatabaseService();
    }
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      try {
        await this.db.disconnect();
      } catch (error) {
        console.error('Failed to disconnect from database:', error);
      }
    }
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    if (!this.db) {
      await this.connect();
    }
    try {
      return await this.db!.query(sql, params);
    } catch (error) {
      console.error('Database query failed:', error);
      return [];
    }
  }

  // User operations
  async getUserByUsername(username: string): Promise<any> {
    try {
      const users = await this.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return users[0] || null;
    } catch (error) {
      console.error('Failed to get user by username:', error);
      return null;
    }
  }

  async getUserById(id: number): Promise<any> {
    try {
      const users = await this.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return users[0] || null;
    } catch (error) {
      console.error('Failed to get user by ID:', error);
      return null;
    }
  }

  async createUser(userData: any): Promise<any> {
    try {
      const result = await this.query(
        'INSERT INTO users (username, email, password_hash, role, status, plan_type, join_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userData.username, userData.email, userData.password_hash, userData.role, userData.status, userData.plan_type, userData.join_date]
      );
      return result;
    } catch (error) {
      console.error('Failed to create user:', error);
      return null;
    }
  }

  async updateUser(id: number, updates: any): Promise<any> {
    try {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(id);
      
      return await this.query(
        `UPDATE users SET ${fields} WHERE id = ?`,
        values
      );
    } catch (error) {
      console.error('Failed to update user:', error);
      return null;
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      return await this.query('SELECT * FROM users ORDER BY created_at DESC');
    } catch (error) {
      console.error('Failed to get all users:', error);
      return [];
    }
  }

  // Menu operations
  async getMenusByDateAndTimeSlot(date: string, timeSlot: string): Promise<any[]> {
    try {
      return await this.query(
        'SELECT * FROM menus WHERE date = ? AND time_slot = ? ORDER BY created_at DESC',
        [date, timeSlot]
      );
    } catch (error) {
      console.error('Failed to get menus by date and time slot:', error);
      return [];
    }
  }

  async createMenu(menuData: any): Promise<any> {
    try {
      return await this.query(
        'INSERT INTO menus (date, time_slot, main_dish, side_dish, rice, dessert, alternatives, notes, cutoff_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [menuData.date, menuData.timeSlot, menuData.mainDish, menuData.sideDish, menuData.rice, menuData.dessert, menuData.alternatives, menuData.notes, menuData.cutoffTime]
      );
    } catch (error) {
      console.error('Failed to create menu:', error);
      return null;
    }
  }

  async updateMenu(id: number, updates: any): Promise<any> {
    try {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(id);
      
      return await this.query(
        `UPDATE menus SET ${fields} WHERE id = ?`,
        values
      );
    } catch (error) {
      console.error('Failed to update menu:', error);
      return null;
    }
  }

  async deleteMenu(id: number): Promise<any> {
    try {
      return await this.query('DELETE FROM menus WHERE id = ?', [id]);
    } catch (error) {
      console.error('Failed to delete menu:', error);
      return null;
    }
  }

  async getAllMenus(): Promise<any[]> {
    try {
      return await this.query('SELECT * FROM menus ORDER BY date DESC, time_slot ASC');
    } catch (error) {
      console.error('Failed to get all menus:', error);
      return [];
    }
  }

  // Banner operations
  async getActiveBanners(): Promise<any[]> {
    try {
      return await this.query('SELECT * FROM banners WHERE active = true ORDER BY created_at DESC');
    } catch (error) {
      console.error('Failed to get active banners:', error);
      return [];
    }
  }

  async createBanner(bannerData: any): Promise<any> {
    try {
      return await this.query(
        'INSERT INTO banners (title, message, type, active) VALUES (?, ?, ?, ?)',
        [bannerData.title, bannerData.message, bannerData.type, bannerData.active]
      );
    } catch (error) {
      console.error('Failed to create banner:', error);
      return null;
    }
  }

  async updateBanner(id: number, updates: any): Promise<any> {
    try {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(id);
      
      return await this.query(
        `UPDATE banners SET ${fields} WHERE id = ?`,
        values
      );
    } catch (error) {
      console.error('Failed to update banner:', error);
      return null;
    }
  }

  async deleteBanner(id: number): Promise<any> {
    try {
      return await this.query('DELETE FROM banners WHERE id = ?', [id]);
    } catch (error) {
      console.error('Failed to delete banner:', error);
      return null;
    }
  }

  // Feedback operations
  async createFeedback(feedbackData: any): Promise<any> {
    try {
      return await this.query(
        'INSERT INTO feedback (user_id, username, message, rating, status) VALUES (?, ?, ?, ?, ?)',
        [feedbackData.userId, feedbackData.username, feedbackData.message, feedbackData.rating, feedbackData.status]
      );
    } catch (error) {
      console.error('Failed to create feedback:', error);
      return null;
    }
  }

  async getFeedbackByUser(userId: number): Promise<any[]> {
    try {
      return await this.query(
        'SELECT * FROM feedback WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
    } catch (error) {
      console.error('Failed to get feedback by user:', error);
      return [];
    }
  }

  async getAllFeedback(): Promise<any[]> {
    try {
      return await this.query('SELECT * FROM feedback ORDER BY created_at DESC');
    } catch (error) {
      console.error('Failed to get all feedback:', error);
      return [];
    }
  }

  // Delivery request operations
  async createDeliveryRequest(requestData: any): Promise<any> {
    try {
      return await this.query(
        'INSERT INTO delivery_requests (user_id, username, current_delivery_time, requested_delivery_time, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
        [requestData.userId, requestData.username, requestData.currentTime, requestData.requestedTime, requestData.reason, requestData.status]
      );
    } catch (error) {
      console.error('Failed to create delivery request:', error);
      return null;
    }
  }

  async getDeliveryRequestsByUser(userId: number): Promise<any[]> {
    try {
      return await this.query(
        'SELECT * FROM delivery_requests WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
    } catch (error) {
      console.error('Failed to get delivery requests by user:', error);
      return [];
    }
  }

  async getAllDeliveryRequests(): Promise<any[]> {
    try {
      return await this.query('SELECT * FROM delivery_requests ORDER BY created_at DESC');
    } catch (error) {
      console.error('Failed to get all delivery requests:', error);
      return [];
    }
  }

  // Bug report operations
  async createBugReport(reportData: any): Promise<any> {
    try {
      return await this.query(
        'INSERT INTO bug_reports (title, description, severity, status, reporter_id, reporter_name, steps_to_reproduce, expected_behavior, actual_behavior, environment, priority, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [reportData.title, reportData.description, reportData.severity, reportData.status, reportData.reporterId, reportData.reporterName, reportData.stepsToReproduce, reportData.expectedBehavior, reportData.actualBehavior, reportData.environment, reportData.priority, reportData.category]
      );
    } catch (error) {
      console.error('Failed to create bug report:', error);
      return null;
    }
  }

  async getAllBugReports(): Promise<any[]> {
    try {
      return await this.query('SELECT * FROM bug_reports ORDER BY created_at DESC');
    } catch (error) {
      console.error('Failed to get all bug reports:', error);
      return [];
    }
  }

  // App review operations
  async createAppReview(reviewData: any): Promise<any> {
    try {
      return await this.query(
        'INSERT INTO app_reviews (user_id, username, rating, title, review, category, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [reviewData.userId, reviewData.username, reviewData.rating, reviewData.title, reviewData.review, reviewData.category, reviewData.status]
      );
    } catch (error) {
      console.error('Failed to create app review:', error);
      return null;
    }
  }

  async getAllAppReviews(): Promise<any[]> {
    try {
      return await this.query('SELECT * FROM app_reviews ORDER BY created_at DESC');
    } catch (error) {
      console.error('Failed to get all app reviews:', error);
      return [];
    }
  }

  // Issue operations
  async createIssue(issueData: any): Promise<any> {
    try {
      return await this.query(
        'INSERT INTO issues (title, description, type, status, priority, reporter_id, reporter_name, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [issueData.title, issueData.description, issueData.type, issueData.status, issueData.priority, issueData.reporterId, issueData.reporterName, JSON.stringify(issueData.tags)]
      );
    } catch (error) {
      console.error('Failed to create issue:', error);
      return null;
    }
  }

  async getAllIssues(): Promise<any[]> {
    try {
      return await this.query('SELECT * FROM issues ORDER BY created_at DESC');
    } catch (error) {
      console.error('Failed to get all issues:', error);
      return [];
    }
  }

  // Documentation operations
  async createDocumentation(docData: any): Promise<any> {
    try {
      return await this.query(
        'INSERT INTO documentation (title, content, category, version, author, is_published) VALUES (?, ?, ?, ?, ?, ?)',
        [docData.title, docData.content, docData.category, docData.version, docData.author, docData.isPublished]
      );
    } catch (error) {
      console.error('Failed to create documentation:', error);
      return null;
    }
  }

  async getPublishedDocumentation(): Promise<any[]> {
    try {
      return await this.query('SELECT * FROM documentation WHERE is_published = true ORDER BY created_at DESC');
    } catch (error) {
      console.error('Failed to get published documentation:', error);
      return [];
    }
  }

  async getAllDocumentation(): Promise<any[]> {
    try {
      return await this.query('SELECT * FROM documentation ORDER BY created_at DESC');
    } catch (error) {
      console.error('Failed to get all documentation:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const databaseService = DatabaseService.getInstance(); 