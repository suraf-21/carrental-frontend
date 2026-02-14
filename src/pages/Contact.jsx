// src/pages/Contact.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { contactService } from '../services/contact.service';
import contactHeroBg from '../assets/images/contact-bg.jpg';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

const Contact = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await contactService.submitContact(data);
      toast.success(t('contact.form.success'));
      reset();
    } catch (error) {
      toast.error(t('contact.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Background Image */}
      <section 
        className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 text-white py-16 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${contactHeroBg})`,
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
              {t('contact.title')}
            </h1>
            <p className="text-xl text-gray-300">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 h-full">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">
                {t('contact.info.title')}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">📍</div>
                  <div>
                    <h3 className="font-semibold dark:text-white">{t('contact.info.address')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('contact.info.addressLine1')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">📞</div>
                  <div>
                    <h3 className="font-semibold dark:text-white">{t('contact.info.phone')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('contact.info.phone1')}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('contact.info.phone2')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">✉️</div>
                  <div>
                    <h3 className="font-semibold dark:text-white">{t('contact.info.email')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('contact.info.email1')}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('contact.info.email2')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">⏰</div>
                  <div>
                    <h3 className="font-semibold dark:text-white">{t('contact.info.hours')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('contact.info.hoursWeek')}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('contact.info.hoursWeekend')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">
                {t('contact.form.title')}
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label={t('contact.form.name')}
                  {...register('name')}
                  error={errors.name?.message}
                  touched={!!errors.name}
                />
                
                <Input
                  label={t('contact.form.email')}
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  touched={!!errors.email}
                />
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    {...register('message')}
                    rows="5"
                    className={`
                      w-full px-4 py-2 
                      bg-white dark:bg-gray-700 
                      border rounded-lg 
                      focus:outline-none focus:ring-2 
                      transition-all duration-200
                      ${errors.message 
                        ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-200 dark:focus:ring-primary-800'
                      }
                      dark:text-white
                    `}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.message.message}
                    </p>
                  )}
                </div>
                
                <Button type="submit" variant="primary" fullWidth loading={isSubmitting}>
                  {t('contact.form.send')}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="p-2 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.793509938728!2d38.757931!3d9.009783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDAnMzUuMiJOIDM4wrA0NSczMC4wIkU!5e0!3m2!1sen!2set!4v1620000000000!5m2!1sen!2set"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title={t('contact.title')}
                className="rounded-lg"
              />
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;