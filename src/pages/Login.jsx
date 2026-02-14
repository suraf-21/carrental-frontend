// src/pages/Login.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Already authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (data) => {
    try {
      console.log('Login attempt with:', data.email);
      await login(data.email, data.password);
      // No need to navigate here - the useEffect above will handle it
      // Or the DashboardRedirect will handle based on role
    } catch (error) {
      console.error('Login page error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('auth.login.title')}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('auth.login.subtitle')}
            </p>
          </div>
          
          <LoginForm onSubmit={handleSubmit} loading={isLoading} />
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;