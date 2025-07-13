import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserDashboard } from './components/user/UserDashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};