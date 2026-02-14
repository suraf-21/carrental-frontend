// src/pages/Cars.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { SkeletonCard } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { useFetch } from '../hooks/useFetch';
import { carService } from '../services/car.service';
import { useDebounce } from '../hooks/useDebounce';

const Cars = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    seats: '',
    fuelType: '',
    withDriver: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const { data, loading, error, execute } = useFetch(
    carService.getCars,
    {
      search: debouncedSearch,
      ...filters,
      page: 1,
      limit: 9
    },
    true
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    execute({
      search: debouncedSearch,
      ...filters,
      page: 1,
      limit: 9
    });
  }, [debouncedSearch, filters]);

  if (error) {
    return <ErrorState message={error} onRetry={execute} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <Input
            type="search"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Input
            name="brand"
            placeholder={t('cars.filters.brand')}
            value={filters.brand}
            onChange={handleFilterChange}
          />
          <Input
            name="minPrice"
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <Input
            name="maxPrice"
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
          <select
            name="seats"
            value={filters.seats}
            onChange={handleFilterChange}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          >
            <option value="">{t('cars.filters.seats')}</option>
            <option value="2">2 {t('cars.card.seats')}</option>
            <option value="4">4 {t('cars.card.seats')}</option>
            <option value="5">5 {t('cars.card.seats')}</option>
            <option value="7">7 {t('cars.card.seats')}</option>
          </select>
          <select
            name="withDriver"
            value={filters.withDriver}
            onChange={handleFilterChange}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          >
            <option value="">{t('cars.filters.driver')}</option>
            <option value="true">{t('cars.card.with_driver')}</option>
            <option value="false">{t('cars.card.without_driver')}</option>
          </select>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : data?.data?.length > 0 ? (
            data.data.map((car) => (
              <motion.div
                key={car._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Link to={`/cars/${car._id}`}>
                  <Card hoverable className="h-full">
                    <img
                      src={car.images[0]}
                      alt={car.name}
                      className="w-full h-48 object-cover rounded-t-xl"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold dark:text-white">{car.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{car.brand}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                          {car.seats} {t('cars.card.seats')}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {car.fuelType}
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
                          <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                            {t('cars.card.with_driver')}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                icon="🚗"
                title={t('cars.empty')}
                description="Try adjusting your filters"
              />
            </div>
          )}
        </div>

        {/* Pagination */}
        {data?.meta?.pagination && (
          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(Math.ceil(data.meta.pagination.total / data.meta.pagination.limit))].map((_, i) => (
              <button
                key={i}
                onClick={() => execute({ ...filters, page: i + 1, limit: 9 })}
                className={`px-4 py-2 rounded-lg ${
                  data.meta.pagination.page === i + 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;