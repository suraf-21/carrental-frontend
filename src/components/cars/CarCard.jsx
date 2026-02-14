import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Card from '../ui/Card';

const CarCard = ({ car }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
    >
      <Link to={`/cars/${car._id}`}>
        <Card hoverable className="h-full">
          <div className="relative">
            <img
              src={car.images[0]}
              alt={car.name}
              className="w-full h-48 object-cover rounded-t-xl"
              loading="lazy"
            />
            {!car.availability && (
              <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                Unavailable
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold dark:text-white">{car.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{car.brand}</p>
            
            <div className="flex items-center mt-2 space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                🪑 {car.seats} {t('cars.card.seats')}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ⛽ {car.fuelType}
              </span>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div>
                <span className="text-2xl font-bold text-primary-600">
                  ${car.pricePerDay}
                </span>
                <span className="text-sm text-gray-500">/{t('cars.card.per_day')}</span>
              </div>
              {car.withDriver && (
                <span className="text-xs bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 px-2 py-1 rounded-full">
                  {t('cars.card.with_driver')}
                </span>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default CarCard;