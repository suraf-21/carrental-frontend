// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useFetch } from '../hooks/useFetch';
import { carService } from '../services/car.service';
import { SkeletonCard } from '../components/ui/Skeleton';

// Import background image
import heroBg from '../assets/images/hero-bg.jpg'; // Add this line

const Home = () => {
  const { t } = useTranslation();
  const { data: cars, loading } = useFetch(carService.getCars, { limit: 3 });

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section 
        className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 text-white py-20 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroBg})`,
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {t('home.hero.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 mb-8"
            >
              {t('home.hero.subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/cars">
                <Button size="lg" variant="primary">
                  {t('home.hero.cta')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of the component remains the same... */}
      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['fast_booking', 'best_price', 'with_driver'].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center">
                  <div className="text-4xl mb-4">
                    {feature === 'fast_booking' && '⚡'}
                    {feature === 'best_price' && '💰'}
                    {feature === 'with_driver' && '👨‍✈️'}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">
                    {t(`home.features.${feature}.title`)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t(`home.features.${feature}.description`)}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            {t('cars.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
            ) : (
              cars?.data?.map((car) => (
                <Link to={`/cars/${car._id}`} key={car._id}>
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
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-2xl font-bold text-primary-600">
                          ${car.pricePerDay} <span className="text-sm text-gray-500">{t('cars.card.per_day')}</span>
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {car.seats} {t('cars.card.seats')}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;