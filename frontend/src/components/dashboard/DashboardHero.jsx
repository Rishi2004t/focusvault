import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Flame, Award, Clock, Activity, Zap, RefreshCw, Send, Target } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import AnimatedCounter from '../shared/AnimatedCounter';

export default function DashboardHero({ user, stats, lastSynced, onRefresh }) {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Operational Morning' : hour < 18 ? 'Systems Active' : 'System Standby';
  
  const messages = [
    "Ready to bend reality today?",
    "Your neural pathways are optimized.",
    "System telemetry indicates a high productivity variance.",
    "Acknowledge mission parameters and execute.",
    "Silence the noise. Focus the signal."
  ];
  
  const [smartMessage, setSmartMessage] = useState(messages[0]);
  
  useEffect(() => {
     const interval = setInterval(() => {
        setSmartMessage(messages[Math.floor(Math.random() * messages.length)]);
     }, 10000);
     return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between gap-8 mb-8 sm:mb-12">
      <div className="flex-1 w-full">
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex flex-wrap items-center justify-center xl:justify-start gap-4 mb-6"
        >
           <div className="px-3 py-1 bg-[var(--accent-glow)]/10 border border-[var(--glass-border)] backdrop-blur-sm rounded-full flex items-center gap-2 group cursor-pointer hover:bg-[var(--accent-glow)]/20 transition-all duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-glow)] animate-pulse shadow-[0_0_10px_var(--accent-glow)]" />
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--accent-glow)] group-hover:text-white transition-colors duration-300">Live: Neural Link Active</span>
           </div>
           
           <div className="px-3 py-1 bg-[var(--bg-silk)]/40 border border-[var(--glass-border)] backdrop-blur-sm rounded-full flex items-center gap-2 text-[var(--muted-text)] text-[9px] font-bold uppercase tracking-[0.1em]">
              <Send size={10} className="text-emerald-500 opacity-80" /> System Syncing...
           </div>

           <button 
             onClick={onRefresh}
             className="group cursor-pointer bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-full p-2 neural-card-hover relative overflow-hidden text-[var(--muted-text)] hover:text-[var(--accent-glow)] hover:scale-105 hover:border-[var(--accent-glow)]/50 transition-all duration-300"
             title="Manual Telemetry Sync"
           >
             <RefreshCw size={12} className="group-active:rotate-180 transition-transform duration-500" />
           </button>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-4xl lg:text-5xl font-black text-[var(--primary-text)] tracking-tight italic text-center xl:text-left"
        >
          {greeting}, <span className="text-[var(--accent-glow)] opacity-90 drop-shadow-[0_0_20px_rgba(var(--accent-color-rgb),0.3)]">{user?.name || user?.username || 'Operative'}</span>
        </motion.h1>

        <motion.p 
          key={smartMessage}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-sm font-bold text-[var(--muted-text)] mt-3 italic max-w-lg opacity-80 text-center xl:text-left mx-auto xl:mx-0"
        >
          {smartMessage}
        </motion.p>

        {/* Focus Mode CTA */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.3 }}
           className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center xl:justify-start gap-4"
        >
           <button 
             onClick={() => navigate('/focus')}
             className="flex items-center justify-center gap-4 px-8 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5 hover:shadow-white/10 group relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              <Play size={16} className="fill-current" /> Enter Focus Mode
           </button>
           
           <div className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic group hover:text-emerald-500 hover:border-emerald-500/30 transition-all cursor-default">
              <Target size={14} className="group-hover:animate-spin-slow" /> Deep Work Protocol
           </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center xl:justify-start gap-6 sm:gap-12 mt-10 group/stats"
        >
          <div className="flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <span className="text-[9px] font-black text-[var(--muted-text)] uppercase tracking-[0.25em] mb-2 flex items-center gap-2 opacity-70">
               <Flame size={12} className="text-orange-500 group-hover/stats:animate-pulse" /> Current Streak
            </span>
            <div className="flex items-end gap-2 text-3xl font-black italic text-[var(--primary-text)] drop-shadow-md">
              <AnimatedCounter value={user?.streak || 0} />
              <span className="text-[10px] font-bold uppercase text-[var(--muted-text)] mb-1.5 opacity-60">Days</span>
            </div>
          </div>

          <div className="w-[1px] h-12 bg-[var(--glass-border)] opacity-30 hidden sm:block" />

          <div className="flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <span className="text-[9px] font-black text-[var(--muted-text)] uppercase tracking-[0.25em] mb-2 flex items-center gap-2 opacity-70">
               <Activity size={12} className="text-emerald-500" /> Tasks Solved
            </span>
            <div className="flex items-end gap-2 text-3xl font-black italic text-[var(--primary-text)] drop-shadow-md">
              <AnimatedCounter value={stats?.completedTasks || 0} />
              <span className="text-[10px] font-bold uppercase text-[var(--muted-text)] mb-1.5 opacity-60">Total</span>
            </div>
          </div>

          <div className="w-[1px] h-12 bg-[var(--glass-border)] opacity-30 hidden sm:block" />

          <div className="flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <span className="text-[9px] font-black text-[var(--muted-text)] uppercase tracking-[0.25em] mb-2 flex items-center gap-2 opacity-70">
               <Zap size={12} className="text-yellow-500" /> Neural State
            </span>
            <div className="flex items-end gap-2 text-3xl font-black italic text-[var(--primary-text)] drop-shadow-md">
              {user?.productivityLevel || 1}
              <span className="text-[10px] font-bold uppercase text-[var(--muted-text)] mb-1.5 opacity-60">Level</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Experience Tracker Card */}
      <div className="w-full xl:w-96 p-6 sm:p-8 rounded-[2.5rem] bg-[var(--bg-card)]/40 backdrop-blur-xl border border-[var(--glass-border)] shadow-premium relative overflow-hidden group hover:shadow-[var(--accent-glow)]/10 hover:border-[var(--accent-glow)]/40 transition-all duration-500 hover:-translate-y-1 will-change-transform cursor-pointer">
        {/* Animated Glow Grid */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-500" 
             style={{ backgroundImage: 'radial-gradient(var(--accent-glow) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        {/* Hover Highlight */}
        <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:animate-shimmer pointer-events-none" />

        <div className="flex items-center justify-between mb-6 relative z-10">
           <p className="text-[10px] font-black text-[var(--muted-text)] uppercase tracking-[0.25em] italic group-hover:text-[var(--accent-glow)] transition-colors duration-300 opacity-80">Neural Calibration</p>
           <Award size={16} className="text-[var(--accent-glow)] group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
        </div>

        <div className="flex items-end justify-between mb-5 relative z-10">
          <span className="text-4xl font-black text-[var(--primary-text)] italic tracking-tighter group-hover:text-white transition-colors duration-300">
            <AnimatedCounter value={user?.xp || 0} /> 
            <span className="text-xs text-[var(--muted-text)] font-bold ml-2 opacity-60">XP</span>
            
            <AnimatePresence>
              <motion.span
                key={user?.xp}
                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: -30 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 text-[var(--accent-glow)] font-black italic text-lg pointer-events-none drop-shadow-[0_0_10px_var(--accent-glow)]"
              >
                +XP
              </motion.span>
            </AnimatePresence>
          </span>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-[var(--primary-text)] leading-none italic group-hover:text-white transition-colors opacity-70">Level Upgrade</span>
            <span className="text-[22px] font-black text-[var(--accent-glow)] mt-1 group-hover:scale-105 transition-all origin-right drop-shadow-[0_0_15px_rgba(var(--accent-color-rgb),0.2)]">
              {((user?.xp || 0) % 500)} <span className="text-[10px] text-[var(--muted-text)] opacity-50">/ 500</span>
            </span>
          </div>
        </div>

        <div className="h-4 w-full bg-black/20 rounded-full overflow-hidden p-1 relative shadow-inner group-hover:shadow-[inset_0_0_15px_rgba(var(--accent-color-rgb),0.1)] transition-shadow">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((user?.xp || 0) % 500) / 5}%` }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            className="h-full bg-gradient-to-r from-[var(--accent-glow)] via-[var(--accent-secondary)] to-[var(--accent-glow)] rounded-full relative z-10 group-hover:animate-shimmer shadow-[0_0_15px_var(--accent-glow)]"
            style={{ backgroundSize: '200% 100%' }}
          />
          <motion.div 
            animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-x-0 h-full bg-[var(--accent-glow)]/20 filter blur-xl rounded-full"
            style={{ width: `${((user?.xp || 0) % 500) / 5}%` }}
          />
        </div>
        
        <div className="mt-7 flex justify-between items-center relative z-10">
           <div className="flex items-center gap-2 opacity-50 group-hover:opacity-80 transition-opacity">
              <Clock size={11} className="text-[var(--muted-text)]" />
              <span className="text-[9px] font-black uppercase text-[var(--muted-text)] tracking-widest">
                Last calibrated: {lastSynced ? format(lastSynced, 'HH:mm:ss') : 'Connecting...'}
              </span>
           </div>
           <button className="text-[9px] font-black uppercase tracking-widest text-[var(--accent-glow)] hover:underline group-hover:scale-105 transition-transform opacity-70 hover:opacity-100">Telemetry Details</button>
        </div>
      </div>
    </div>
  );
}
