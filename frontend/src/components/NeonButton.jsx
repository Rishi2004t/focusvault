import React from 'react';
import { motion } from 'framer-motion';

const NeonButton = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'btn-neon',
    glass: 'btn-glass',
    sage: 'btn-sage',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type={type}
      onClick={onClick}
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default NeonButton;
