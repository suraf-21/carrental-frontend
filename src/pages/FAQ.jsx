// src/pages/FAQ.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useFetch } from '../hooks/useFetch';
import { faqService } from '../services/faq.service';
import { SkeletonCard } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import faqHeroBg from '../assets/images/faq-bg.jpg';

const FAQ = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState({});
  
  const { data: faqs, loading, error, execute } = useFetch(faqService.getFAQs);

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs = faqs?.data?.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return <ErrorState message={error} onRetry={execute} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Background Image */}
      <section 
        className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 text-white py-16 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${faqHeroBg})`,
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl font-bold mb-4">
              {t('faq.title')}
            </h1>
            <p className="text-xl text-gray-300">
              {t('faq.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Input
              type="search"
              placeholder={t('faq.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
            ) : filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <button
                      onClick={() => toggleItem(faq._id)}
                      className="w-full text-left p-6 focus:outline-none"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold dark:text-white pr-8">
                          {faq.question}
                        </h3>
                        <span className="text-2xl text-primary-600">
                          {openItems[faq._id] ? '−' : '+'}
                        </span>
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {openItems[faq._id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6"
                        >
                          <p className="text-gray-600 dark:text-gray-400 border-t dark:border-gray-700 pt-4">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  {t('faq.noResults')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;