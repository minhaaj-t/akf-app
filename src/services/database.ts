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

  // In browser environment, always use mock service
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
  return {
    async connect() {
      console.log('🎭 Using mock database service');
    },
    async disconnect() {
      console.log('🎭 Mock database disconnected');
    },
    async query(sql: string, params: any[] = []) {
      console.log('🎭 Mock query:', sql, params);
      // Return empty result for mock
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
    this.db = await initializeDatabase();
    await this.db.connect();
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      await this.db.disconnect();
    }
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    if (!this.db) {
      await this.connect();
    }
    return this.db!.query(sql, params);
  }

  // User operations
  async getUserByUsername(username: string): Promise<any> {
    const users = await this.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return users[0] || null;
  }

  async getUserById(id: number): Promise<any> {
    const users = await this.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return users[0] || null;
  }

  async createUser(userData: any): Promise<any> {
    const result = await this.query(
      'INSERT INTO users (username, email, password_hash, role, status, plan_type, join_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userData.username, userData.email, userData.password_hash, userData.role, userData.status, userData.plan_type, userData.join_date]
    );
    return result;
  }

  async updateUser(id: number, updates: any): Promise<any> {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    
    return this.query(
      `UPDATE users SET ${fields} WHERE id = ?`,
      values
    );
  }

  async getAllUsers(): Promise<any[]> {
    return this.query('SELECT * FROM users ORDER BY created_at DESC');
  }

  // Menu operations
  async getMenusByDate(date: string): Promise<any[]> {
    return this.query(
      'SELECT * FROM menus WHERE date = ? ORDER BY time_slot',
      [date]
    );
  }

  async getMenusByDateAndTimeSlot(date: string, timeSlot: string): Promise<any[]> {
    return this.query(
      'SELECT * FROM menus WHERE date = ? AND time_slot IN (?, ?) ORDER BY time_slot',
      [date, timeSlot, 'both']
    );
  }

  async createMenu(menuData: any): Promise<any> {
    return this.query(
      'INSERT INTO menus (date, time_slot, main_dish, side_dish, rice, dessert, alternatives, notes, cutoff_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [menuData.date, menuData.time_slot, menuData.main_dish, menuData.side_dish, menuData.rice, menuData.dessert, menuData.alternatives, menuData.notes, menuData.cutoff_time]
    );
  }

  async updateMenu(id: number, updates: any): Promise<any> {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    
    return this.query(
      `UPDATE menus SET ${fields} WHERE id = ?`,
      values
    );
  }

  async deleteMenu(id: number): Promise<any> {
    return this.query('DELETE FROM menus WHERE id = ?', [id]);
  }

  async getAllMenus(): Promise<any[]> {
    return this.query('SELECT * FROM menus ORDER BY date DESC, time_slot');
  }

  // Banner operations
  async getActiveBanners(): Promise<any[]> {
    return this.query('SELECT * FROM banners WHERE active = true ORDER BY created_at DESC');
  }

  async createBanner(bannerData: any): Promise<any> {
    return this.query(
      'INSERT INTO banners (title, message, type, active) VALUES (?, ?, ?, ?)',
      [bannerData.title, bannerData.message, bannerData.type, bannerData.active]
    );
  }

  async updateBanner(id: number, updates: any): Promise<any> {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    
    return this.query(
      `UPDATE banners SET ${fields} WHERE id = ?`,
      values
    );
  }

  async deleteBanner(id: number): Promise<any> {
    return this.query('DELETE FROM banners WHERE id = ?', [id]);
  }

  // Feedback operations
  async createFeedback(feedbackData: any): Promise<any> {
    return this.query(
      'INSERT INTO feedback (user_id, message, rating, status) VALUES (?, ?, ?, ?)',
      [feedbackData.user_id, feedbackData.message, feedbackData.rating, feedbackData.status]
    );
  }

  async getFeedbackByUser(userId: number): Promise<any[]> {
    return this.query(
      'SELECT * FROM feedback WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  }

  async getAllFeedback(): Promise<any[]> {
    return this.query('SELECT f.*, u.username FROM feedback f JOIN users u ON f.user_id = u.id ORDER BY f.created_at DESC');
  }

  // Delivery request operations
  async createDeliveryRequest(requestData: any): Promise<any> {
    return this.query(
      'INSERT INTO delivery_requests (user_id, current_time, requested_time, reason, status) VALUES (?, ?, ?, ?, ?)',
      [requestData.user_id, requestData.current_time, requestData.requested_time, requestData.reason, requestData.status]
    );
  }

  async getDeliveryRequestsByUser(userId: number): Promise<any[]> {
    return this.query(
      'SELECT * FROM delivery_requests WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  }

  async getAllDeliveryRequests(): Promise<any[]> {
    return this.query('SELECT dr.*, u.username FROM delivery_requests dr JOIN users u ON dr.user_id = u.id ORDER BY dr.created_at DESC');
  }

  // Bug report operations
  async createBugReport(reportData: any): Promise<any> {
    return this.query(
      'INSERT INTO bug_reports (title, description, severity, status, reporter_id, steps_to_reproduce, expected_behavior, actual_behavior, environment, priority, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [reportData.title, reportData.description, reportData.severity, reportData.status, reportData.reporter_id, reportData.steps_to_reproduce, reportData.expected_behavior, reportData.actual_behavior, reportData.environment, reportData.priority, reportData.category]
    );
  }

  async getAllBugReports(): Promise<any[]> {
    return this.query('SELECT br.*, u.username as reporter_name FROM bug_reports br JOIN users u ON br.reporter_id = u.id ORDER BY br.created_at DESC');
  }

  // App review operations
  async createAppReview(reviewData: any): Promise<any> {
    return this.query(
      'INSERT INTO app_reviews (user_id, rating, title, review, category, status) VALUES (?, ?, ?, ?, ?, ?)',
      [reviewData.user_id, reviewData.rating, reviewData.title, reviewData.review, reviewData.category, reviewData.status]
    );
  }

  async getAllAppReviews(): Promise<any[]> {
    return this.query('SELECT ar.*, u.username FROM app_reviews ar JOIN users u ON ar.user_id = u.id ORDER BY ar.created_at DESC');
  }

  // Issue operations
  async createIssue(issueData: any): Promise<any> {
    return this.query(
      'INSERT INTO issues (title, description, type, status, priority, reporter_id, due_date, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [issueData.title, issueData.description, issueData.type, issueData.status, issueData.priority, issueData.reporter_id, issueData.due_date, issueData.tags]
    );
  }

  async getAllIssues(): Promise<any[]> {
    return this.query('SELECT i.*, u.username as reporter_name FROM issues i JOIN users u ON i.reporter_id = u.id ORDER BY i.created_at DESC');
  }

  // Documentation operations
  async createDocumentation(docData: any): Promise<any> {
    return this.query(
      'INSERT INTO documentation (title, content, category, version, author_id, is_published) VALUES (?, ?, ?, ?, ?, ?)',
      [docData.title, docData.content, docData.category, docData.version, docData.author_id, docData.is_published]
    );
  }

  async getPublishedDocumentation(): Promise<any[]> {
    return this.query('SELECT d.*, u.username as author_name FROM documentation d JOIN users u ON d.author_id = u.id WHERE d.is_published = true ORDER BY d.created_at DESC');
  }

  async getAllDocumentation(): Promise<any[]> {
    return this.query('SELECT d.*, u.username as author_name FROM documentation d JOIN users u ON d.author_id = u.id ORDER BY d.created_at DESC');
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance();

// Export for backward compatibility
export default databaseService; 