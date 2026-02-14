// src/components/ui/Input.jsx
import React from 'react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  touched,
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          px-4 py-2 
          bg-white dark:bg-gray-700 
          border rounded-lg 
          focus:outline-none focus:ring-2 
          transition-all duration-200
          ${fullWidth ? 'w-full' : ''}
          ${error && touched 
            ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800' 
            : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-200 dark:focus:ring-primary-800'
          }
          dark:text-white
          ${className}
        `}
        {...props}
      />
      {error && touched && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;