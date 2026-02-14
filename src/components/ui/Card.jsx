// src/components/ui/Card.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', onClick, hoverable = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={hoverable ? { y: -4 } : {}}
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl shadow-lg 
        backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90
        border border-gray-200 dark:border-gray-700
        transition-all duration-300
        ${hoverable ? 'cursor-pointer hover:shadow-xl' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;