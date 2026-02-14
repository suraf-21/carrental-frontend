// src/components/ui/ErrorState.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

const ErrorState = ({ message, onRetry }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-12 px-4">
      <div className="text-6xl mb-4">😕</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {t('common.error')}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {message || t('common.error')}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;