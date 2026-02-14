import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useFetch } from '../hooks/useFetch';
import { carService } from '../services/car.service';
import { bookingService } from '../services/booking.service';
import { authService } from '../services/auth.service';
import { faqService } from '../services/faq.service';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-24">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'dashboard'
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => setActiveSection('cars')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'cars'
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  🚗 Manage Cars
                </button>
                <button
                  onClick={() => setActiveSection('bookings')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'bookings'
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  📋 Manage Bookings
                </button>
                <button
                  onClick={() => setActiveSection('users')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'users'
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  👥 Manage Users
                </button>
                <button
                  onClick={() => setActiveSection('faq')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'faq'
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  ❓ Manage FAQ
                </button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {activeSection === 'dashboard' && <AdminStats />}
            {activeSection === 'cars' && <ManageCars />}
            {activeSection === 'bookings' && <ManageBookings />}
            {activeSection === 'users' && <ManageUsers />}
            {activeSection === 'faq' && <ManageFAQ />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Stats Component
const AdminStats = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalBookings: 0,
    totalUsers: 0,
    pendingBookings: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cars, bookings, users] = await Promise.all([
          carService.getCars({ limit: 1 }),
          bookingService.getAllBookings({ limit: 1 }),
          authService.getUsers({ limit: 1 })
        ]);
        
        setStats({
          totalCars: cars.data.meta?.pagination?.total || 0,
          totalBookings: bookings.data.meta?.pagination?.total || 0,
          totalUsers: users.data.meta?.pagination?.total || 0,
          pendingBookings: bookings.data.data?.filter(b => b.status === 'pending').length || 0
        });
      } catch (error) {
        toast.error('Failed to load stats');
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Cars', value: stats.totalCars, icon: '🚗', color: 'bg-blue-500' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: '📋', color: 'bg-green-500' },
    { title: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-purple-500' },
    { title: 'Pending Bookings', value: stats.pendingBookings, icon: '⏳', color: 'bg-yellow-500' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold dark:text-white mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Manage Cars Component
const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    pricePerDay: '',
    type: 'sedan',
    fuelType: 'petrol',
    seats: 4,
    images: [],
    withDriver: false,
    driverPricePerDay: '',
    location: '',
    availability: true
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await carService.getCars({ limit: 100 });
      setCars(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCar) {
        await carService.updateCar(editingCar._id, formData);
        toast.success('Car updated successfully');
      } else {
        await carService.createCar(formData);
        toast.success('Car added successfully');
      }
      setShowForm(false);
      setEditingCar(null);
      setFormData({
        name: '', brand: '', pricePerDay: '', type: 'sedan',
        fuelType: 'petrol', seats: 4, images: [], withDriver: false,
        driverPricePerDay: '', location: '', availability: true
      });
      fetchCars();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await carService.deleteCar(id);
        toast.success('Car deleted successfully');
        fetchCars();
      } catch (error) {
        toast.error('Failed to delete car');
      }
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      brand: car.brand,
      pricePerDay: car.pricePerDay,
      type: car.type,
      fuelType: car.fuelType,
      seats: car.seats,
      images: car.images,
      withDriver: car.withDriver,
      driverPricePerDay: car.driverPricePerDay || '',
      location: car.location,
      availability: car.availability
    });
    setShowForm(true);
  };

  const toggleAvailability = async (car) => {
    try {
      await carService.updateStatus(car._id, !car.availability);
      toast.success('Car availability updated');
      fetchCars();
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Manage Cars</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditingCar(null); }}>
          {showForm ? 'Cancel' : 'Add New Car'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 dark:text-white">
            {editingCar ? 'Edit Car' : 'Add New Car'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Car Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <Input
                label="Brand"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                required
              />
              <Input
                label="Price Per Day ($)"
                type="number"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})}
                required
              />
              <Input
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
              >
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
              </select>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <Input
                label="Seats"
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData({...formData, seats: parseInt(e.target.value)})}
                required
              />
              <Input
                label="Image URLs (comma separated)"
                value={formData.images.join(', ')}
                onChange={(e) => setFormData({...formData, images: e.target.value.split(',').map(url => url.trim())})}
              />
            </div>
            
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.withDriver}
                  onChange={(e) => setFormData({...formData, withDriver: e.target.checked})}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Available with driver</span>
              </label>
              {formData.withDriver && (
                <Input
                  label="Driver Price Per Day ($)"
                  type="number"
                  value={formData.driverPricePerDay}
                  onChange={(e) => setFormData({...formData, driverPricePerDay: e.target.value})}
                  className="w-48"
                />
              )}
            </div>
            
            <Button type="submit" variant="primary">
              {editingCar ? 'Update Car' : 'Add Car'}
            </Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {cars.map((car) => (
          <Card key={car._id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={car.images[0]} 
                  alt={car.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold dark:text-white">{car.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{car.brand}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ${car.pricePerDay}/day • {car.seats} seats • {car.fuelType}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAvailability(car)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    car.availability
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {car.availability ? 'Available' : 'Unavailable'}
                </button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(car)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(car._id)}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Manage Bookings Component
const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getAllBookings({ limit: 100 });
      setBookings(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      toast.success(`Booking ${status} successfully`);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking');
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Manage Bookings</h2>
      
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking._id} className="p-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">
                      {booking.userId?.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.userId?.email}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Car</p>
                    <p className="dark:text-white">{booking.carId?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Dates</p>
                    <p className="text-sm dark:text-white">
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Days</p>
                    <p className="dark:text-white">{booking.days}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Total</p>
                    <p className="font-bold text-primary-600">${booking.totalPrice}</p>
                  </div>
                </div>
                
                {booking.status === 'pending' && (
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="primary" onClick={() => updateBookingStatus(booking._id, 'approved')}>
                      Approve
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => updateBookingStatus(booking._id, 'rejected')}>
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Manage Users Component
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await authService.getUsers({ limit: 100 });
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (id, status) => {
    try {
      await authService.updateUserStatus(id, status);
      toast.success(`User ${status} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      await authService.updateUserRole(id, role);
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Manage Users</h2>
      
      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user._id} className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold dark:text-white">{user.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      : user.role === 'employee'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {user.role}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {user.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user.email}</p>
                {user.phone && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.phone}</p>
                )}
              </div>
              
              <div className="flex space-x-2 mt-4 md:mt-0">
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user._id, e.target.value)}
                  className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                >
                  <option value="user">User</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
                
                {user.status === 'active' ? (
                  <Button 
                    size="sm" 
                    variant="danger"
                    onClick={() => updateUserStatus(user._id, 'blocked')}
                  >
                    Block
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="primary"
                    onClick={() => updateUserStatus(user._id, 'active')}
                  >
                    Activate
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Manage FAQ Component
const ManageFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    status: 'active'
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await faqService.getFAQs({ limit: 100 });
      setFaqs(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await faqService.updateFAQ(editingFaq._id, formData);
        toast.success('FAQ updated successfully');
      } else {
        await faqService.createFAQ(formData);
        toast.success('FAQ added successfully');
      }
      setShowForm(false);
      setEditingFaq(null);
      setFormData({ question: '', answer: '', status: 'active' });
      fetchFAQs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await faqService.deleteFAQ(id);
        toast.success('FAQ deleted successfully');
        fetchFAQs();
      } catch (error) {
        toast.error('Failed to delete FAQ');
      }
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      status: faq.status
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Manage FAQ</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditingFaq(null); }}>
          {showForm ? 'Cancel' : 'Add New FAQ'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 dark:text-white">
            {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Question"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              required
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Answer
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                rows="4"
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                required
              />
            </div>
            
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
            
            <Button type="submit" variant="primary">
              {editingFaq ? 'Update FAQ' : 'Add FAQ'}
            </Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq._id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold dark:text-white">{faq.question}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    faq.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {faq.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(faq)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(faq._id)}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;