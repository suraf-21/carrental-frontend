// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { SkeletonCard } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { bookings, fetchMyBookings, isLoading } = useBooking();
  const [activeTab, setActiveTab] = useState('bookings');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    console.log('Fetching bookings...');
    fetchMyBookings();
  }, [fetchMyBookings]);

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await authService.updateProfile(profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    };
    return colors[status] || colors.pending;
  };

  // Format date safely
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  // Get bookings array safely
  const bookingsList = bookings?.data || bookings || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-primary-600 dark:text-primary-400">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold dark:text-white">{user?.name || 'User'}</h3>
                <p className="text-gray-600 dark:text-gray-400">{user?.email || ''}</p>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'bookings'
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  📋 {t('dashboard.my_bookings')}
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  👤 {t('dashboard.profile')}
                </button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-2xl font-bold mb-6 dark:text-white">
                  {t('dashboard.my_bookings')}
                </h2>
                
                {isLoading ? (
                  <div className="grid grid-cols-1 gap-6">
                    {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : bookingsList.length > 0 ? (
                  <div className="space-y-4">
                    {bookingsList.map((booking) => (
                      <Card key={booking._id || Math.random()} className="p-6">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold dark:text-white mb-2">
                              {booking.carId?.name || 'Car'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {booking.carId?.brand || ''}
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500 dark:text-gray-500">Start:</span>
                                <span className="ml-2 dark:text-white">
                                  {formatDate(booking.startDate)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-500">End:</span>
                                <span className="ml-2 dark:text-white">
                                  {formatDate(booking.endDate)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-500">Days:</span>
                                <span className="ml-2 dark:text-white">{booking.days || 0}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-500">Total:</span>
                                <span className="ml-2 font-bold text-primary-600">
                                  ${booking.totalPrice || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {t(`dashboard.status.${booking.status || 'pending'}`)}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                              {formatDate(booking.createdAt)}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="📅"
                    title="No bookings yet"
                    description="Start by booking your first car!"
                  />
                )}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6 dark:text-white">
                    {t('dashboard.profile')}
                  </h2>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
                    <Input
                      label="Full Name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                    
                    <Input
                      label="Email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                      disabled
                    />
                    
                    <Input
                      label="Phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                    
                    <Button type="submit" variant="primary" loading={isUpdating}>
                      Update Profile
                    </Button>
                  </form>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;