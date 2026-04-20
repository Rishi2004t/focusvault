import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const generateMockHeatmapData = (daysCount = 84) => {
  const data = [];
  const today = new Date();
  
  for (let i = 0; i < daysCount; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (daysCount - 1 - i));
    
    // Weighted random to have some 0s and some high values
    const rand = Math.random();
    let minutes = 0;
    if (rand > 0.3) {
      minutes = Math.floor(Math.random() * 180); // max 3 hours
    }
    
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      minutes
    });
  }
  return data;
};

const getColorClass = (minutes) => {
  if (minutes === 0) return 'bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50';
  if (minutes < 30) return 'bg-indigo-200 dark:bg-indigo-500/20 shadow-[0_0_8px_rgba(199,210,254,0.4)] border border-indigo-300 dark:border-indigo-500/30';
  if (minutes < 60) return 'bg-indigo-300 dark:bg-indigo-500/40 shadow-[0_0_12px_rgba(165,180,252,0.5)] border border-indigo-400 dark:border-indigo-400/50';
  if (minutes < 120) return 'bg-indigo-500 dark:bg-indigo-500/70 shadow-[0_0_16px_rgba(99,102,241,0.6)] border border-indigo-500 dark:border-indigo-400/70';
  return 'bg-indigo-600 dark:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.8)] border border-indigo-600 dark:border-indigo-400';
};

export default function FocusHeatmap() {
  const data = useMemo(() => generateMockHeatmapData(84), []); // 12 weeks of data
  
  // Group by weeks
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <div className="bg-[var(--bg-card)]/40 rounded-[2.5rem] p-8 sm:p-10 border border-[var(--glass-border)] relative overflow-hidden group shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-inner">
          <Activity size={18} />
        </div>
        <div>
          <h3 className="text-[12px] font-black uppercase tracking-[0.25em] text-[var(--primary-text)] italic leading-tight">Focus Heatmap</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)] mt-1">Daily Neural Activity (Minutes)</p>
        </div>
      </div>

      <div className="flex justify-center pb-4">
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {data.map((day, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.01, duration: 0.2 }}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md relative group/square transition-all duration-300 hover:scale-[1.25] hover:z-10 cursor-pointer ${getColorClass(day.minutes)}`}
            >
              {/* Tooltip */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 backdrop-blur-md text-white text-[10px] font-semibold rounded-lg opacity-0 group-hover/square:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg z-50">
                <span className="font-bold text-indigo-300">{day.minutes} mins</span> on {day.date}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-8 flex items-center justify-end gap-2 text-[9px] font-bold uppercase tracking-widest text-[var(--muted-text)]">
        <span>Less</span>
        <div className="flex gap-1.5 mx-1">
          <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50"></div>
          <div className="w-3 h-3 rounded-sm bg-indigo-200 dark:bg-indigo-500/20 border border-indigo-300 dark:border-indigo-500/30"></div>
          <div className="w-3 h-3 rounded-sm bg-indigo-300 dark:bg-indigo-500/40 border border-indigo-400 dark:border-indigo-400/50"></div>
          <div className="w-3 h-3 rounded-sm bg-indigo-500 dark:bg-indigo-500/70 border border-indigo-500 dark:border-indigo-400/70"></div>
          <div className="w-3 h-3 rounded-sm bg-indigo-600 dark:bg-indigo-500 border border-indigo-600 dark:border-indigo-400"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
