import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
};

async function migrateCloud() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('✅ Connected to cloud database');
    console.log(`📊 Database: ${process.env.DB_NAME}`);
    console.log(`🌐 Host: ${process.env.DB_HOST}`);
    
    // Create tables
    await createTables(connection);
    
    console.log('✅ Cloud migration completed successfully!');
  } catch (error) {
    console.error('❌ Cloud migration failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function createTables(connection) {
  // Users table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      plan_type ENUM('monthly', 'yearly') DEFAULT 'monthly',
      join_date DATE NOT NULL,
      delivery_plans_afternoon TIME NULL,
      delivery_plans_night TIME NULL,
      payment_status ENUM('paid', 'unpaid') DEFAULT 'unpaid',
      payment_method ENUM('cash', 'bank') NULL,
      days_active INT DEFAULT 0,
      expiry_date DATE NULL,
      avatar_config JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_username (username),
      INDEX idx_email (email),
      INDEX idx_status (status),
      INDEX idx_role (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Users table created');

  // Menus table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS menus (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATE NOT NULL,
      time_slot ENUM('afternoon', 'night', 'both') NOT NULL,
      main_dish VARCHAR(100) NOT NULL,
      side_dish VARCHAR(100) NOT NULL,
      rice VARCHAR(100) NOT NULL,
      dessert VARCHAR(100) NULL,
      alternatives JSON NULL,
      notes TEXT NULL,
      cutoff_time TIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_date (date),
      INDEX idx_time_slot (time_slot),
      INDEX idx_date_time (date, time_slot),
      UNIQUE KEY unique_menu_date_time (date, time_slot)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Menus table created');

  // Banners table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS banners (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      type ENUM('info', 'warning', 'emergency') DEFAULT 'info',
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_active (active),
      INDEX idx_type (type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Banners table created');

  // Feedback table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      message TEXT NOT NULL,
      rating INT CHECK (rating >= 1 AND rating <= 5),
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_status (status),
      INDEX idx_rating (rating)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Feedback table created');

  // Delivery requests table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS delivery_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      current_time TIME NOT NULL,
      requested_time TIME NOT NULL,
      reason TEXT NOT NULL,
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_status (status),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Delivery requests table created');

  // Bug reports table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS bug_reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
      status ENUM('open', 'in-progress', 'resolved', 'closed') DEFAULT 'open',
      reporter_id INT NOT NULL,
      steps_to_reproduce TEXT NULL,
      expected_behavior TEXT NULL,
      actual_behavior TEXT NULL,
      environment VARCHAR(200) NULL,
      assigned_to INT NULL,
      priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
      category ENUM('ui', 'backend', 'database', 'performance', 'security', 'other') DEFAULT 'other',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_reporter_id (reporter_id),
      INDEX idx_status (status),
      INDEX idx_severity (severity),
      INDEX idx_priority (priority),
      INDEX idx_category (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Bug reports table created');

  // App reviews table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS app_reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      rating INT CHECK (rating >= 1 AND rating <= 5),
      title VARCHAR(200) NOT NULL,
      review TEXT NOT NULL,
      category ENUM('feature', 'ui', 'performance', 'bug', 'suggestion', 'general') DEFAULT 'general',
      status ENUM('pending', 'reviewed', 'implemented', 'rejected') DEFAULT 'pending',
      admin_response TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_rating (rating),
      INDEX idx_status (status),
      INDEX idx_category (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ App reviews table created');

  // Issues table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS issues (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      type ENUM('bug', 'feature', 'improvement', 'task') DEFAULT 'task',
      status ENUM('open', 'in-progress', 'review', 'resolved', 'closed') DEFAULT 'open',
      priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
      assignee_id INT NULL,
      reporter_id INT NOT NULL,
      due_date DATE NULL,
      tags JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_reporter_id (reporter_id),
      INDEX idx_assignee_id (assignee_id),
      INDEX idx_status (status),
      INDEX idx_priority (priority),
      INDEX idx_type (type),
      INDEX idx_due_date (due_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Issues table created');

  // Issue comments table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS issue_comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      issue_id INT NOT NULL,
      user_id INT NOT NULL,
      comment TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_issue_id (issue_id),
      INDEX idx_user_id (user_id),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Issue comments table created');

  // Documentation table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS documentation (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      content LONGTEXT NOT NULL,
      category ENUM('user-guide', 'admin-guide', 'api', 'deployment', 'troubleshooting') DEFAULT 'user-guide',
      version VARCHAR(20) DEFAULT '1.0.0',
      author_id INT NOT NULL,
      is_published BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_category (category),
      INDEX idx_version (version),
      INDEX idx_author_id (author_id),
      INDEX idx_is_published (is_published)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Documentation table created');

  // Orders table (for future use)
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      menu_id INT NOT NULL,
      order_date DATE NOT NULL,
      delivery_time TIME NOT NULL,
      status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
      special_instructions TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_menu_id (menu_id),
      INDEX idx_order_date (order_date),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Orders table created');

  // Payments table (for future use)
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      payment_method ENUM('cash', 'bank', 'card') NOT NULL,
      status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
      transaction_id VARCHAR(100) NULL,
      payment_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_status (status),
      INDEX idx_payment_date (payment_date),
      INDEX idx_transaction_id (transaction_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('✅ Payments table created');
}

// Run migration
migrateCloud().catch(console.error); 