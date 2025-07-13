import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

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

async function seedCloudDatabase() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    console.log('🌱 Starting cloud database seeding...');
    console.log(`📊 Database: ${process.env.DB_NAME}`);
    console.log(`🌐 Host: ${process.env.DB_HOST}`);

    // Seed users
    await seedUsers(connection);
    
    // Seed menus
    await seedMenus(connection);
    
    // Seed banners
    await seedBanners(connection);
    
    // Seed feedback
    await seedFeedback(connection);
    
    // Seed delivery requests
    await seedDeliveryRequests(connection);
    
    // Seed bug reports
    await seedBugReports(connection);
    
    // Seed app reviews
    await seedAppReviews(connection);
    
    // Seed issues
    await seedIssues(connection);
    
    // Seed documentation
    await seedDocumentation(connection);

    console.log('✅ Cloud database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Cloud database seeding failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function seedUsers(connection) {
  console.log('👥 Seeding users...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = [
    {
      username: 'admin',
      email: 'admin@messfood.ae',
      password_hash: hashedPassword,
      role: 'admin',
      status: 'approved',
      plan_type: 'yearly',
      join_date: '2024-01-01',
      delivery_plans_afternoon: '12:00:00',
      delivery_plans_night: '20:00:00',
      payment_status: 'paid',
      days_active: 25,
      avatar_config: JSON.stringify({}),
    },
    {
      username: 'user',
      email: 'user@example.com',
      password_hash: hashedPassword,
      role: 'user',
      status: 'approved',
      plan_type: 'monthly',
      join_date: '2024-01-15',
      delivery_plans_afternoon: '13:00:00',
      payment_status: 'paid',
      days_active: 10,
      expiry_date: '2024-02-15',
      avatar_config: JSON.stringify({}),
    },
    {
      username: 'fatima_hassan',
      email: 'fatima@example.com',
      password_hash: hashedPassword,
      role: 'user',
      status: 'approved',
      plan_type: 'yearly',
      join_date: '2024-01-10',
      delivery_plans_night: '20:30:00',
      payment_status: 'unpaid',
      payment_method: 'cash',
      days_active: 15,
      expiry_date: '2025-01-10',
      avatar_config: JSON.stringify({}),
    },
    {
      username: 'omar_khalil',
      email: 'omar@example.com',
      password_hash: hashedPassword,
      role: 'user',
      status: 'pending',
      plan_type: 'monthly',
      join_date: '2024-01-20',
      delivery_plans_afternoon: '14:00:00',
      delivery_plans_night: '21:00:00',
      payment_status: 'unpaid',
      days_active: 5,
      expiry_date: '2024-02-20',
      avatar_config: JSON.stringify({}),
    },
    {
      username: 'no_plans_user',
      email: 'noplans@example.com',
      password_hash: hashedPassword,
      role: 'user',
      status: 'approved',
      plan_type: 'monthly',
      join_date: '2024-01-25',
      payment_status: 'unpaid',
      days_active: 2,
      expiry_date: '2024-02-25',
      avatar_config: JSON.stringify({}),
    },
  ];

  for (const user of users) {
    await connection.execute(`
      INSERT IGNORE INTO users (
        username, email, password_hash, role, status, plan_type, join_date,
        delivery_plans_afternoon, delivery_plans_night, payment_status, 
        payment_method, days_active, expiry_date, avatar_config
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user.username, user.email, user.password_hash, user.role, user.status,
      user.plan_type, user.join_date, user.delivery_plans_afternoon,
      user.delivery_plans_night, user.payment_status, user.payment_method,
      user.days_active, user.expiry_date, user.avatar_config
    ]);
  }
  
  console.log('✅ Users seeded');
}

async function seedMenus(connection) {
  console.log('🍽️ Seeding menus...');
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const menus = [
    {
      date: today,
      time_slot: 'afternoon',
      main_dish: 'Chicken Biryani',
      side_dish: 'Raita',
      rice: 'Basmati Rice',
      dessert: 'Kheer',
      alternatives: JSON.stringify({
        'Chicken Biryani': ['Chapati + Fish Curry', 'Vegetable Pulao'],
        'Raita': ['Pickle', 'Salad'],
      }),
      notes: 'Extra spicy available on request',
      cutoff_time: '12:00:00',
    },
    {
      date: today,
      time_slot: 'night',
      main_dish: 'Mutton Curry',
      side_dish: 'Naan',
      rice: 'Jeera Rice',
      dessert: 'Gulab Jamun',
      alternatives: JSON.stringify({
        'Mutton Curry': ['Chicken Tikka', 'Dal Tadka'],
        'Naan': ['Roti', 'Paratha'],
      }),
      notes: 'Fresh mutton from local supplier',
      cutoff_time: '18:00:00',
    },
    {
      date: tomorrow,
      time_slot: 'afternoon',
      main_dish: 'Fish Curry',
      side_dish: 'Steamed Rice',
      rice: 'Plain Rice',
      dessert: 'Rasgulla',
      alternatives: JSON.stringify({
        'Fish Curry': ['Chicken Curry', 'Egg Curry'],
        'Steamed Rice': ['Fried Rice', 'Pulao'],
      }),
      notes: 'Fresh fish from local market',
      cutoff_time: '12:00:00',
    },
    {
      date: tomorrow,
      time_slot: 'night',
      main_dish: 'Beef Steak',
      side_dish: 'Mashed Potatoes',
      rice: 'Brown Rice',
      dessert: 'Chocolate Cake',
      alternatives: JSON.stringify({
        'Beef Steak': ['Chicken Breast', 'Grilled Fish'],
        'Mashed Potatoes': ['French Fries', 'Baked Potato'],
      }),
      notes: 'Premium quality beef',
      cutoff_time: '18:00:00',
    },
  ];

  for (const menu of menus) {
    await connection.execute(`
      INSERT IGNORE INTO menus (
        date, time_slot, main_dish, side_dish, rice, dessert,
        alternatives, notes, cutoff_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      menu.date, menu.time_slot, menu.main_dish, menu.side_dish,
      menu.rice, menu.dessert, menu.alternatives, menu.notes, menu.cutoff_time
    ]);
  }
  
  console.log('✅ Menus seeded');
}

async function seedBanners(connection) {
  console.log('📢 Seeding banners...');
  
  const banners = [
    {
      title: 'Welcome to MessFood!',
      message: 'Delicious meals delivered to your doorstep. Subscribe to our meal plans today!',
      type: 'info',
      active: true,
    },
    {
      title: 'Special Offer',
      message: 'Get 20% off on yearly subscriptions. Limited time offer!',
      type: 'warning',
      active: true,
    },
    {
      title: 'Maintenance Notice',
      message: 'System maintenance scheduled for tonight 2-4 AM. Service may be temporarily unavailable.',
      type: 'emergency',
      active: true,
    },
  ];

  for (const banner of banners) {
    await connection.execute(`
      INSERT IGNORE INTO banners (title, message, type, active)
      VALUES (?, ?, ?, ?)
    `, [banner.title, banner.message, banner.type, banner.active]);
  }
  
  console.log('✅ Banners seeded');
}

async function seedFeedback(connection) {
  console.log('💬 Seeding feedback...');
  
  const feedback = [
    {
      user_id: 2,
      message: 'The food quality is excellent! Love the variety of options.',
      rating: 5,
      status: 'approved',
    },
    {
      user_id: 3,
      message: 'Delivery is always on time. Great service!',
      rating: 4,
      status: 'approved',
    },
    {
      user_id: 4,
      message: 'Would love to see more vegetarian options.',
      rating: 3,
      status: 'pending',
    },
  ];

  for (const item of feedback) {
    await connection.execute(`
      INSERT IGNORE INTO feedback (user_id, message, rating, status)
      VALUES (?, ?, ?, ?)
    `, [item.user_id, item.message, item.rating, item.status]);
  }
  
  console.log('✅ Feedback seeded');
}

async function seedDeliveryRequests(connection) {
  console.log('🚚 Seeding delivery requests...');
  
  const requests = [
    {
      user_id: 2,
      current_time: '13:00:00',
      requested_time: '14:00:00',
      reason: 'Working from home today, need lunch later',
      status: 'approved',
    },
    {
      user_id: 3,
      current_time: '20:30:00',
      requested_time: '21:30:00',
      reason: 'Late meeting, need dinner delayed',
      status: 'pending',
    },
  ];

  for (const request of requests) {
    await connection.execute(`
      INSERT IGNORE INTO delivery_requests (user_id, current_time, requested_time, reason, status)
      VALUES (?, ?, ?, ?, ?)
    `, [request.user_id, request.current_time, request.requested_time, request.reason, request.status]);
  }
  
  console.log('✅ Delivery requests seeded');
}

async function seedBugReports(connection) {
  console.log('🐛 Seeding bug reports...');
  
  const bugReports = [
    {
      title: 'Menu filtering not working properly',
      description: 'Users are seeing menus for times they don\'t subscribe to',
      severity: 'high',
      status: 'in-progress',
      reporter_id: 1,
      steps_to_reproduce: '1. Login as user with only afternoon delivery\n2. Go to menu section\n3. See night menus displayed',
      expected_behavior: 'Only afternoon menus should be visible',
      actual_behavior: 'Both afternoon and night menus are shown',
      environment: 'Chrome 120.0, Windows 11',
      priority: 'high',
      category: 'ui',
    },
    {
      title: 'Payment status not updating',
      description: 'Payment status remains unpaid after successful bank transfer',
      severity: 'medium',
      status: 'open',
      reporter_id: 3,
      steps_to_reproduce: '1. Make bank transfer\n2. Check payment status\n3. Status still shows unpaid',
      expected_behavior: 'Payment status should update to paid',
      actual_behavior: 'Status remains unpaid',
      environment: 'Mobile app, Android 14',
      priority: 'medium',
      category: 'backend',
    },
  ];

  for (const report of bugReports) {
    await connection.execute(`
      INSERT IGNORE INTO bug_reports (
        title, description, severity, status, reporter_id,
        steps_to_reproduce, expected_behavior, actual_behavior,
        environment, priority, category
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      report.title, report.description, report.severity, report.status,
      report.reporter_id, report.steps_to_reproduce, report.expected_behavior,
      report.actual_behavior, report.environment, report.priority, report.category
    ]);
  }
  
  console.log('✅ Bug reports seeded');
}

async function seedAppReviews(connection) {
  console.log('⭐ Seeding app reviews...');
  
  const reviews = [
    {
      user_id: 2,
      rating: 5,
      title: 'Excellent Food Delivery Service',
      review: 'The app is very user-friendly and the food quality is consistently good. Delivery is always on time!',
      category: 'feature',
      status: 'reviewed',
    },
    {
      user_id: 3,
      rating: 4,
      title: 'Great App, Minor Issues',
      review: 'Overall great experience. Would love to see more payment options and better menu filtering.',
      category: 'ui',
      status: 'pending',
    },
  ];

  for (const review of reviews) {
    await connection.execute(`
      INSERT IGNORE INTO app_reviews (user_id, rating, title, review, category, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [review.user_id, review.rating, review.title, review.review, review.category, review.status]);
  }
  
  console.log('✅ App reviews seeded');
}

async function seedIssues(connection) {
  console.log('📋 Seeding issues...');
  
  const issues = [
    {
      title: 'Implement time-based menu filtering',
      description: 'Users should only see menus for their subscribed delivery times (afternoon/night)',
      type: 'feature',
      status: 'in-progress',
      priority: 'high',
      reporter_id: 1,
      due_date: '2024-01-30',
      tags: JSON.stringify(['menu', 'filtering', 'user-experience']),
    },
    {
      title: 'Fix payment status update bug',
      description: 'Payment status is not updating automatically after successful bank transfers',
      type: 'bug',
      status: 'open',
      priority: 'high',
      reporter_id: 3,
      tags: JSON.stringify(['payment', 'backend', 'bug']),
    },
  ];

  for (const issue of issues) {
    const [result] = await connection.execute(`
      INSERT IGNORE INTO issues (title, description, type, status, priority, reporter_id, due_date, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      issue.title, issue.description, issue.type, issue.status,
      issue.priority, issue.reporter_id, issue.due_date, issue.tags
    ]);

    // Add comments to issues
    if (result.insertId) {
      await connection.execute(`
        INSERT IGNORE INTO issue_comments (issue_id, user_id, comment)
        VALUES (?, ?, ?)
      `, [result.insertId, 1, 'This feature is critical for user experience. Users are confused when they see menus for times they don\'t subscribe to.']);
    }
  }
  
  console.log('✅ Issues seeded');
}

async function seedDocumentation(connection) {
  console.log('📚 Seeding documentation...');
  
  const docs = [
    {
      title: 'User Guide',
      content: `# MessFood User Guide

## Getting Started
1. Create an account
2. Choose your delivery plan (afternoon/night)
3. Browse daily menus
4. Place your order

## Features
- Time-based menu filtering
- Delivery time requests
- Payment management
- Feedback system`,
      category: 'user-guide',
      version: '1.0.0',
      author_id: 1,
      is_published: true,
    },
    {
      title: 'Admin Guide',
      content: `# MessFood Admin Guide

## User Management
- Approve/reject user registrations
- Manage delivery plans
- Update payment status

## Menu Management
- Create daily menus
- Set time slots (afternoon/night)
- Manage alternatives and notes`,
      category: 'admin-guide',
      version: '1.0.0',
      author_id: 1,
      is_published: true,
    },
  ];

  for (const doc of docs) {
    await connection.execute(`
      INSERT IGNORE INTO documentation (title, content, category, version, author_id, is_published)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [doc.title, doc.content, doc.category, doc.version, doc.author_id, doc.is_published]);
  }
  
  console.log('✅ Documentation seeded');
}

// Run seeding
seedCloudDatabase().catch(console.error); 