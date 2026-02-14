// src/components/ui/EmptyState.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const EmptyState = ({ title, description, icon = '📭' }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-12 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title || t('common.empty')}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;