import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});

const LoginForm = ({ onSubmit, loading }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={t('auth.login.email')}
        type="email"
        {...register('email')}
        error={errors.email?.message}
        touched={!!errors.email}
      />
      
      <Input
        label={t('auth.login.password')}
        type="password"
        {...register('password')}
        error={errors.password?.message}
        touched={!!errors.password}
      />
      
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.login.remember')}
          </span>
        </label>
        
        <Link
          to="/forgot-password"
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          {t('auth.login.forgot_password')}
        </Link>
      </div>
      
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {t('auth.login.title')}
      </Button>
      
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t('auth.login.no_account')}{' '}
        <Link to="/register" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold">
          {t('auth.login.sign_up')}
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;