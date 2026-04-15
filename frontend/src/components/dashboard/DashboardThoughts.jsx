import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Lightbulb, Sparkles, Zap } from 'lucide-react';

const THOUGHTS = [
  { text: "Neural synchronization at 98.4%. System optimal.", icon: <Brain size={14} />, color: "text-theme-accent" },
  { text: "Consistency is the mother of mastery. Keep building.", icon: <Sparkles size={14} />, color: "text-purple-400" },
  { text: "Identify the signal. Ignore the noise.", icon: <Zap size={14} />, color: "text-yellow-400" },
  { text: "Your potential is a function of your focus.", icon: <Lightbulb size={14} />, color: "text-emerald-400" },
  { text: "Deep work is the superpower of the 21st century.", icon: <Brain size={14} />, color: "text-cyan-400" },
  { text: "Secure your legacy, one task at a time.", icon: <Sparkles size={14} />, color: "text-theme-accent" }
];

export default function DashboardThoughts() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % THOUGHTS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const current = THOUGHTS[index];

  return (
    <div className="h-12 overflow-hidden relative flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center gap-3 w-full"
        >
          <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${current.color}`}>
            {current.icon}
          </div>
          <p className="text-xs font-bold text-theme-text/80 uppercase tracking-widest whitespace-nowrap">
            {current.text}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
