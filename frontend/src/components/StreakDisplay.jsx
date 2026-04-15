import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const StreakDisplay = ({ streak = 0 }) => {
  if (streak === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
    >
      <Flame size={18} className="fill-current animate-pulse" />
      <span className="font-bold text-sm tracking-tighter">{streak} DAY STREAK</span>
    </motion.div>
  );
};

export default StreakDisplay;
