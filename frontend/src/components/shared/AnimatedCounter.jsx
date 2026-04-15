import React, { useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';

/**
 * AnimatedCounter - A premium number transition component
 * @param {number} value - The target number to count to
 * @param {string} className - Additional CSS classes
 */
const AnimatedCounter = ({ value, className }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
  
  const springValue = useSpring(count, {
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    count.set(value);
  }, [value, count]);

  return <motion.span className={className}>{rounded}</motion.span>;
};

export default AnimatedCounter;
