import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subMonths, eachDayOfInterval, isSameDay } from 'date-fns';
import api from '../../utils/api';
import { Sparkles, Activity } from 'lucide-react';

export default function NeuralHeatmap() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const res = await api.get('/analytics/heatmap');
        setData(res.data);
      } catch (err) {
        console.error('Heatmap uplink failure', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeatmap();
  }, []);

  const days = eachDayOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date()
  });

  const getIntensity = (count) => {
    if (!count) return 'bg-slate-100/10';
    if (count < 2) return 'bg-indigo-300/40 shadow-[0_0_8px_rgba(165,180,252,0.3)]';
    if (count < 4) return 'bg-indigo-500/60 shadow-[0_0_12px_rgba(99,102,241,0.5)]';
    return 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.8)]';
  };

  if (loading) return <div className="h-40 w-full animate-pulse bg-slate-100/5 rounded-3xl" />;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary-text)] italic">Neural Velocity Graph</h3>
            <p className="text-[8px] font-bold text-[var(--muted-text)] uppercase tracking-widest mt-0.5">Historical Completion Density</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="flex gap-1">
                {[0, 1, 3, 5].map(v => (
                    <div key={v} className={`w-2 h-2 rounded-sm ${getIntensity(v)}`} />
                ))}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--muted-text)]">Density</span>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto pb-4 custom-scrollbar">
          {days.map((day, i) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const count = data[dateStr] || 0;
            return (
              <motion.div
                key={dateStr}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.001 }}
                onMouseEnter={() => setHoveredDay({ day, count })}
                onMouseLeave={() => setHoveredDay(null)}
                className={`w-3.5 h-3.5 rounded-sm transition-all duration-300 cursor-crosshair hover:ring-2 hover:ring-indigo-400 ${getIntensity(count)}`}
              />
            );
          })}
        </div>

        <AnimatePresence>
          {hoveredDay && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/90 text-white rounded-xl text-[9px] font-bold whitespace-nowrap z-20 backdrop-blur-md border border-white/10"
            >
              <span className="text-indigo-400">{hoveredDay.count}</span> mission(s) on {format(hoveredDay.day, 'MMM do, yyyy')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-8">
            <span className="text-[8px] font-black uppercase text-[var(--muted-text)] tracking-widest italic">{format(days[0], 'MMMM yyyy')}</span>
            <span className="text-[8px] font-black uppercase text-[var(--muted-text)] tracking-widest italic">{format(days[days.length-1], 'MMMM yyyy')}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/5 rounded-full border border-indigo-500/10">
            <Sparkles size={10} className="text-indigo-400" />
            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Spectral Integrity High</span>
        </div>
      </div>
    </div>
  );
}
