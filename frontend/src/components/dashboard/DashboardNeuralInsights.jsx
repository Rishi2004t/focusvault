import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, AlertCircle, TrendingUp, Target } from 'lucide-react';

export default function DashboardNeuralInsights({ insights = [] }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-theme-accent/10 border border-theme-accent/20 flex items-center justify-center text-theme-accent shadow-[0_0_15px_var(--accent-glow)]">
          <Sparkles size={16} />
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-theme-text">Neural Insights</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 hover:border-theme-accent/20 hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.05)] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-theme-accent transition-colors shrink-0">
               {i === 0 ? <TrendingUp size={18} /> : i === 1 ? <Target size={18} /> : <AlertCircle size={18} />}
            </div>
            <p className="text-xs font-bold text-slate-300 leading-snug">
              {insight}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
