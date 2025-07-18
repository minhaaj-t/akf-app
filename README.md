# 🍽️ MessFood - Subscription-Based Food Delivery App

A modern React application for managing subscription-based food delivery services with time-based menu filtering, user management, and comprehensive admin features.

## ✨ Features

### 🍽️ **Menu Management**
- **Time-based filtering**: Users see menus only for their subscribed delivery times (afternoon/night)
- **Daily menu updates**: Admin can create and manage daily menus
- **Alternative options**: Multiple food alternatives for each dish
- **Cutoff times**: Configurable order cutoff times

### 👥 **User Management**
- **Role-based access**: Admin and user roles with different permissions
- **Delivery plans**: Users can subscribe to afternoon, night, or both delivery times
- **Payment tracking**: Monitor payment status and methods
- **User profiles**: Comprehensive user information management

### 🚚 **Delivery Management**
- **Time requests**: Users can request delivery time changes
- **Status tracking**: Monitor delivery request approvals/rejections
- **Flexible scheduling**: Support for different delivery time slots

### 💬 **Feedback System**
- **User feedback**: Rating and review system for food quality
- **Admin review**: Approve/reject feedback submissions
- **Rating analytics**: Track user satisfaction

### 🛠️ **Developer Tools**
- **Bug reporting**: Comprehensive bug tracking system
- **App reviews**: User feedback on app features and UI
- **Issue management**: Project management for development tasks
- **Documentation**: User and admin guides

### 📱 **Modern UI/UX**
- **Responsive design**: Works on desktop, tablet, and mobile
- **Dark/Light themes**: User preference support
- **Real-time updates**: Live data synchronization
- **Intuitive navigation**: Easy-to-use interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd messfood-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🗄️ Database Setup

### Option 1: Local MySQL (Development)

1. **Install MySQL** on your system
2. **Create database**
   ```sql
   CREATE DATABASE messfood_db;
   ```
3. **Update .env file**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=messfood_db
   DB_PORT=3306
   ```
4. **Run migrations**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

### Option 2: Supabase (Free Hosting - Recommended)

1. **Create Supabase account** at [supabase.com](https://supabase.com)
2. **Create new project**
3. **Get connection details** from Settings → Database
4. **Update .env file**
   ```env
   SUPABASE_HOST=db.your-project.supabase.co
   SUPABASE_USER=postgres
   SUPABASE_PASSWORD=your_password
   SUPABASE_DATABASE=postgres
   SUPABASE_PORT=5432
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   ```
5. **Run Supabase migrations**
   ```bash
   npm run db:migrate:supabase
   npm run db:seed:supabase
   ```

## 🌐 Free Hosting Options

### 🆓 **Recommended: Supabase + Vercel (No Credit Card Required)**

#### **Why This Stack?**
- ✅ **Completely free forever**
- ✅ **No credit card required**
- ✅ **Professional hosting**
- ✅ **Excellent performance**

#### **Quick Deployment**

1. **Set up Supabase Database**
   ```bash
   # Visit https://supabase.com
   # Create account with GitHub (free)
   # Create new project
   # Copy connection details to .env
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

3. **Configure Environment Variables**
   - Add all `SUPABASE_*` variables in Vercel dashboard

4. **Run Database Migration**
   ```bash
   npm run db:migrate:supabase
   npm run db:seed:supabase
   ```

**Your app will be live at: `https://your-app.vercel.app`**

#### **Alternative Free Options**
- **Railway + Netlify**: $5 free credit monthly
- **GitHub Pages + Supabase**: Static hosting with database
- **Render + Supabase**: Free tier available

📖 **Complete hosting guide**: See [FREE_HOSTING_GUIDE.md](./FREE_HOSTING_GUIDE.md)

## 👤 Default Users

### Admin Account
- **Username**: `admin`
- **Password**: `password123`
- **Role**: Admin (full access)

### Test Users
- **Username**: `user` - Afternoon delivery only
- **Username**: `fatima_hassan` - Night delivery only  
- **Username**: `omar_khalil` - Both delivery times
- **Username**: `no_plans_user` - No delivery plans (for testing)

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Database (MySQL)
npm run db:migrate       # Run MySQL migrations
npm run db:seed          # Seed MySQL database

# Database (Supabase)
npm run db:migrate:supabase  # Run Supabase migrations
npm run db:seed:supabase     # Seed Supabase database

# Database (Cloud)
npm run db:migrate:cloud     # Run cloud migrations
npm run db:seed:cloud        # Seed cloud database
```

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin dashboard components
│   ├── user/            # User dashboard components
│   ├── developer/       # Developer tools components
│   └── ui/              # Reusable UI components
├── contexts/            # React contexts
├── data/                # Mock data and types
├── services/            # API and database services
├── types/               # TypeScript type definitions
└── lib/                 # Utility functions
```

## 🎨 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Database**: MySQL/PostgreSQL (Supabase)
- **Authentication**: Custom JWT-based auth
- **Deployment**: Vercel/Netlify
- **Database Hosting**: Supabase/Railway

## 🔧 Configuration

### Environment Variables

```env
# Database Configuration (Choose one)
DB_HOST=localhost          # MySQL host
DB_USER=root              # MySQL user
DB_PASSWORD=password      # MySQL password
DB_NAME=messfood_db       # MySQL database name

# OR Supabase Configuration
SUPABASE_HOST=db.project.supabase.co
SUPABASE_USER=postgres
SUPABASE_PASSWORD=password
SUPABASE_DATABASE=postgres
SUPABASE_URL=https://project.supabase.co
SUPABASE_ANON_KEY=your_anon_key

# Application
NODE_ENV=development
JWT_SECRET=your_jwt_secret
```

## 🧪 Testing Different Scenarios

### Test Menu Filtering
1. Login as `user` (afternoon only) - see only afternoon menus
2. Login as `fatima_hassan` (night only) - see only night menus  
3. Login as `omar_khalil` (both times) - see all menus
4. Login as `no_plans_user` - see "No Delivery Plans Found" message

### Test Admin Features
1. Login as `admin`
2. Navigate to Admin Dashboard
3. Test user management, menu creation, banner management

### Test Developer Tools
1. Login as any user
2. Navigate to Developer Page
3. Test bug reporting, app reviews, issue tracking

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel
```

### Netlify
```bash
npm run build
# Drag dist/ folder to Netlify
```

### GitHub Pages
```bash
npm install --save-dev gh-pages
npm run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check the [FREE_HOSTING_GUIDE.md](./FREE_HOSTING_GUIDE.md)
- **Issues**: Create an issue in the repository
- **Questions**: Check the documentation or create a discussion

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Push notifications

---

**Built with ❤️ for the MessFood community**