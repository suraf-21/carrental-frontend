// src/routes/index.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import { useAuth } from '../context/AuthContext';
import { SkeletonCard } from '../components/ui/Skeleton';

// Lazy load pages for code splitting
const Home = lazy(() => import('../pages/Home'));
const Cars = lazy(() => import('../pages/Cars'));
const CarDetail = lazy(() => import('../pages/CarDetail'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const UserDashboard = lazy(() => import('../pages/UserDashboard'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const About = lazy(() => import('../pages/About'));
const FAQ = lazy(() => import('../pages/FAQ'));
const Contact = lazy(() => import('../pages/Contact'));

// Dashboard redirect component - FIXED
const DashboardRedirect = () => {
  const { user, isLoading } = useAuth();
  
  console.log('DashboardRedirect - User:', user);
  console.log('DashboardRedirect - Role:', user?.role);
  console.log('DashboardRedirect - Loading:', isLoading);
  
  // Show loading while user data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }
  
  // If no user yet, show loading
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }
  
  // Redirect admin to admin dashboard
  if (user?.role === 'admin') {
    console.log('Redirecting admin to /admin');
    return <Navigate to="/admin" replace />;
  }
  
  // Regular user goes to user dashboard
  console.log('Redirecting user to UserDashboard');
  return <UserDashboard />;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <SkeletonCard />
      </div>
    }>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="cars" element={<Cars />} />
          <Route path="cars/:id" element={<CarDetail />} />
          <Route path="about" element={<About />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          
          {/* Auth Routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected Dashboard Route - Redirects based on role */}
          <Route path="dashboard" element={
            <PrivateRoute>
              <DashboardRedirect />
            </PrivateRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="admin/*" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;