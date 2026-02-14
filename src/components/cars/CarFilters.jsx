import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../ui/Input';

const CarFilters = ({ filters, onFilterChange }) => {
  const { t } = useTranslation();

  const fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid'];
  const seatOptions = [2, 4, 5, 7];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        {t('common.filter')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Input
          name="brand"
          placeholder={t('cars.filters.brand')}
          value={filters.brand}
          onChange={onFilterChange}
        />
        
        <Input
          name="minPrice"
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={onFilterChange}
        />
        
        <Input
          name="maxPrice"
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={onFilterChange}
        />
        
        <select
          name="seats"
          value={filters.seats}
          onChange={onFilterChange}
          className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
        >
          <option value="">{t('cars.filters.seats')}</option>
          {seatOptions.map(seats => (
            <option key={seats} value={seats}>{seats} seats</option>
          ))}
        </select>
        
        <select
          name="fuelType"
          value={filters.fuelType}
          onChange={onFilterChange}
          className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
        >
          <option value="">{t('cars.filters.fuel_type')}</option>
          {fuelTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CarFilters;