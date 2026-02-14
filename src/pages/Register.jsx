import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const { t } = useTranslation();
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (error) {
      // Error handled in context
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('auth.register.title')}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('auth.register.subtitle')}
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('auth.register.name')}
              {...register('name')}
              error={errors.name?.message}
              touched={!!errors.name}
            />
            
            <Input
              label={t('auth.register.email')}
              type="email"
              {...register('email')}
              error={errors.email?.message}
              touched={!!errors.email}
            />
            
            <Input
              label={t('auth.register.password')}
              type="password"
              {...register('password')}
              error={errors.password?.message}
              touched={!!errors.password}
            />
            
            <Input
              label={t('auth.register.confirm_password')}
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              touched={!!errors.confirmPassword}
            />
            
            <Input
              label="Phone (Optional)"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
              touched={!!errors.phone}
            />
            
            <Button type="submit" variant="primary" fullWidth loading={isLoading}>
              {t('auth.register.title')}
            </Button>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              {t('auth.register.have_account')}{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold">
                {t('auth.register.sign_in')}
              </Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;