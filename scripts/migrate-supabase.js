import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dbConfig = {
  host: process.env.SUPABASE_HOST,
  user: process.env.SUPABASE_USER || 'postgres',
  password: process.env.SUPABASE_PASSWORD,
  database: process.env.SUPABASE_DATABASE || 'postgres',
  port: parseInt(process.env.SUPABASE_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false
  }
};

async function migrateSupabase() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Connected to Supabase database');
    console.log(`📊 Database: ${process.env.SUPABASE_DATABASE || 'postgres'}`);
    console.log(`🌐 Host: ${process.env.SUPABASE_HOST}`);
    
    // Create tables
    await createTables(client);
    
    console.log('✅ Supabase migration completed successfully!');
  } catch (error) {
    console.error('❌ Supabase migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function createTables(client) {
  // Users table
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      plan_type VARCHAR(10) DEFAULT 'monthly' CHECK (plan_type IN ('monthly', 'yearly')),
      join_date DATE NOT NULL,
      delivery_plans_afternoon TIME,
      delivery_plans_night TIME,
      payment_status VARCHAR(10) DEFAULT 'unpaid' CHECK (payment_status IN ('paid', 'unpaid')),
      payment_method VARCHAR(10) CHECK (payment_method IN ('cash', 'bank')),
      days_active INTEGER DEFAULT 0,
      expiry_date DATE,
      avatar_config JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Users table created');

  // Create indexes for users
  await client.query('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');

  // Menus table
  await client.query(`
    CREATE TABLE IF NOT EXISTS menus (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      time_slot VARCHAR(10) NOT NULL CHECK (time_slot IN ('afternoon', 'night', 'both')),
      main_dish VARCHAR(100) NOT NULL,
      side_dish VARCHAR(100) NOT NULL,
      rice VARCHAR(100) NOT NULL,
      dessert VARCHAR(100),
      alternatives JSONB,
      notes TEXT,
      cutoff_time TIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date, time_slot)
    )
  `);
  console.log('✅ Menus table created');

  // Create indexes for menus
  await client.query('CREATE INDEX IF NOT EXISTS idx_menus_date ON menus(date)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_menus_time_slot ON menus(time_slot)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_menus_date_time ON menus(date, time_slot)');

  // Banners table
  await client.query(`
    CREATE TABLE IF NOT EXISTS banners (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(10) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'emergency')),
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Banners table created');

  // Create indexes for banners
  await client.query('CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(active)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_banners_type ON banners(type)');

  // Feedback table
  await client.query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Feedback table created');

  // Create indexes for feedback
  await client.query('CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating)');

  // Delivery requests table
  await client.query(`
    CREATE TABLE IF NOT EXISTS delivery_requests (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      current_delivery_time TIME NOT NULL,
      requested_delivery_time TIME NOT NULL,
      reason TEXT NOT NULL,
      status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Delivery requests table created');

  // Create indexes for delivery requests
  await client.query('CREATE INDEX IF NOT EXISTS idx_delivery_requests_user_id ON delivery_requests(user_id)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_delivery_requests_status ON delivery_requests(status)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_delivery_requests_created_at ON delivery_requests(created_at)');

  // Bug reports table
  await client.query(`
    CREATE TABLE IF NOT EXISTS bug_reports (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      severity VARCHAR(10) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
      status VARCHAR(15) DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
      reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      steps_to_reproduce TEXT,
      expected_behavior TEXT,
      actual_behavior TEXT,
      environment VARCHAR(200),
      assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
      priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
      category VARCHAR(20) DEFAULT 'other' CHECK (category IN ('ui', 'backend', 'database', 'performance', 'security', 'other')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Bug reports table created');

  // Create indexes for bug reports
  await client.query('CREATE INDEX IF NOT EXISTS idx_bug_reports_reporter_id ON bug_reports(reporter_id)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_bug_reports_status ON bug_reports(status)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_bug_reports_severity ON bug_reports(severity)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_bug_reports_priority ON bug_reports(priority)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_bug_reports_category ON bug_reports(category)');

  // App reviews table
  await client.query(`
    CREATE TABLE IF NOT EXISTS app_reviews (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      title VARCHAR(200) NOT NULL,
      review TEXT NOT NULL,
      category VARCHAR(20) DEFAULT 'general' CHECK (category IN ('feature', 'ui', 'performance', 'bug', 'suggestion', 'general')),
      status VARCHAR(15) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'implemented', 'rejected')),
      admin_response TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ App reviews table created');

  // Create indexes for app reviews
  await client.query('CREATE INDEX IF NOT EXISTS idx_app_reviews_user_id ON app_reviews(user_id)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_app_reviews_rating ON app_reviews(rating)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_app_reviews_status ON app_reviews(status)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_app_reviews_category ON app_reviews(category)');

  // Issues table
  await client.query(`
    CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(15) DEFAULT 'task' CHECK (type IN ('bug', 'feature', 'improvement', 'task')),
      status VARCHAR(15) DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'review', 'resolved', 'closed')),
      priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
      assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      due_date DATE,
      tags JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Issues table created');

  // Create indexes for issues
  await client.query('CREATE INDEX IF NOT EXISTS idx_issues_reporter_id ON issues(reporter_id)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_issues_assignee_id ON issues(assignee_id)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_issues_priority ON issues(priority)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_issues_type ON issues(type)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_issues_due_date ON issues(due_date)');

  // Issue comments table
  await client.query(`
    CREATE TABLE IF NOT EXISTS issue_comments (
      id SERIAL PRIMARY KEY,
      issue_id INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      comment TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Issue comments table created');

  // Create indexes for issue comments
  await client.query('CREATE INDEX IF NOT EXISTS idx_issue_comments_issue_id ON issue_comments(issue_id)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_issue_comments_user_id ON issue_comments(user_id)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_issue_comments_created_at ON issue_comments(created_at)');

  // Documentation table
  await client.query(`
    CREATE TABLE IF NOT EXISTS documentation (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(20) DEFAULT 'user-guide' CHECK (category IN ('user-guide', 'admin-guide', 'api', 'deployment', 'troubleshooting')),
      version VARCHAR(20) DEFAULT '1.0.0',
      author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      is_published BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Documentation table created');

  // Create indexes for documentation
  await client.query('CREATE INDEX IF NOT EXISTS idx_documentation_category ON documentation(category)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_documentation_version ON documentation(version)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_documentation_author_id ON documentation(author_id)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_documentation_is_published ON documentation(is_published)');

  // Orders table (for future use)
  await client.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      menu_id INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
      order_date DATE NOT NULL,
      delivery_time TIME NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
      special_instructions TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Orders table created');

  // Create indexes for orders
  await client.query('CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_orders_menu_id ON orders(menu_id)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)');

  // Payments table (for future use)
  await client.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount DECIMAL(10,2) NOT NULL,
      payment_method VARCHAR(10) NOT NULL CHECK (payment_method IN ('cash', 'bank', 'card')),
      status VARCHAR(15) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
      transaction_id VARCHAR(100),
      payment_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Payments table created');

  // Create indexes for payments
  await client.query('CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id)');
}

// Run migration
migrateSupabase().catch(console.error); 