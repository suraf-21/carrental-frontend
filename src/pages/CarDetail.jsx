// src/pages/CarDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ErrorState from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { carService } from '../services/car.service';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { createBooking } = useBooking();
  
  const [bookingData, setBookingData] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
    withDriver: false
  });

  const { data: car, loading, error } = useFetch(() => carService.getCarById(id));

  const calculatePrice = () => {
    if (!car?.data) return 0;
    const days = differenceInDays(new Date(bookingData.endDate), new Date(bookingData.startDate));
    const basePrice = days * car.data.pricePerDay;
    const driverFee = bookingData.withDriver ? days * (car.data.driverPricePerDay || 0) : 0;
    return { days: days || 1, total: basePrice + driverFee };
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a car');
      navigate('/login');
      return;
    }

    try {
      const price = calculatePrice();
      await createBooking({
        carId: car.data._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        withDriver: bookingData.withDriver,
        days: price.days,
        totalPrice: price.total
      });
      navigate('/dashboard');
    } catch (error) {
      // Error handled in context
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonCard />
      </div>
    );
  }

  if (error || !car?.data) {
    return <ErrorState message={t('cars.error')} onRetry={() => window.location.reload()} />;
  }

  const price = calculatePrice();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={car.data.images[0]}
                alt={car.data.name}
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {car.data.images.slice(1, 4).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${car.data.name} ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                />
              ))}
            </div>
          </div>

          {/* Car Info & Booking */}
          <div className="space-y-6">
            <Card className="p-6">
              <h1 className="text-3xl font-bold dark:text-white mb-2">{car.data.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{car.data.brand}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">🪑</span>
                  <span>{car.data.seats} {t('cars.card.seats')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">⛽</span>
                  <span>{car.data.fuelType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">📍</span>
                  <span>{car.data.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">⭐</span>
                  <span>{car.data.rating} / 5</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">
                  {t('booking.book_now')}
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label={t('booking.start_date')}
                      type="date"
                      value={bookingData.startDate}
                      onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                    <Input
                      label={t('booking.end_date')}
                      type="date"
                      value={bookingData.endDate}
                      onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                      min={bookingData.startDate}
                    />
                  </div>

                  {car.data.withDriver && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="withDriver"
                        checked={bookingData.withDriver}
                        onChange={(e) => setBookingData({ ...bookingData, withDriver: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="withDriver" className="text-gray-700 dark:text-gray-300">
                        {t('booking.with_driver')} (+${car.data.driverPricePerDay}/{t('cars.card.per_day')})
                      </label>
                    </div>
                  )}

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        ${car.data.pricePerDay} x {price.days} {t('booking.days')}
                      </span>
                      <span className="dark:text-white">${car.data.pricePerDay * price.days}</span>
                    </div>
                    {bookingData.withDriver && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t('booking.with_driver')} (${car.data.driverPricePerDay} x {price.days} {t('booking.days')})
                        </span>
                        <span className="dark:text-white">${car.data.driverPricePerDay * price.days}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                      <div className="flex justify-between font-bold">
                        <span className="dark:text-white">{t('booking.total_price')}</span>
                        <span className="text-2xl text-primary-600">${price.total}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleBooking}
                  >
                    {t('booking.book_now')}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;