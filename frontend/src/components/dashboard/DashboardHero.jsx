import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Flame, Award, Clock, Activity, Zap, RefreshCw, Send, Target } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import AnimatedCounter from '../shared/AnimatedCounter';

// ── Stagger animation variants ──
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

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
    /* ── Outer wrapper: max-width capped, centered, soft gradient bg ── */
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative mx-auto mb-8 sm:mb-12 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden"
      style={{
        maxWidth: '900px',
        /* Soft radial gradient background */
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(var(--accent-color-rgb, 20,184,166),0.06) 0%, transparent 70%), var(--bg-card)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
        padding: 'clamp(1.25rem, 4vw, 2.25rem)',
      }}
    >
      {/* ── Decorative radial glow (top-right, subtle) ── */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: '320px',
          height: '200px',
          background: 'radial-gradient(ellipse at top right, rgba(var(--accent-color-rgb, 20,184,166),0.08) 0%, transparent 70%)',
        }}
      />

      <div className="flex flex-col xl:flex-row items-start justify-between gap-6 relative z-10">

        {/* ────────────────── LEFT COLUMN ────────────────── */}
        <div className="flex-1 w-full min-w-0">

          {/* Status pills + refresh */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2.5 mb-4">
            <div className="px-3 py-1 bg-[var(--accent-glow)]/10 border border-[var(--glass-border)] rounded-full flex items-center gap-2 group cursor-pointer hover:bg-[var(--accent-glow)]/20 transition-all duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-glow)] animate-pulse shadow-[0_0_8px_var(--accent-glow)]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--accent-glow)] group-hover:text-white transition-colors duration-300">Live: Neural Link Active</span>
            </div>

            <div className="px-3 py-1 bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] rounded-full flex items-center gap-2 text-[var(--muted-text)] text-[9px] font-bold uppercase tracking-widest">
              <Send size={10} className="text-emerald-500" /> System Syncing...
            </div>

            <button
              onClick={onRefresh}
              className="group cursor-pointer bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-xl p-2 text-[var(--muted-text)] hover:text-[var(--accent-glow)] hover:scale-110 hover:border-[var(--accent-glow)]/50 transition-all duration-300"
              title="Manual Telemetry Sync"
            >
              <RefreshCw size={13} className="group-active:rotate-180 transition-transform duration-500" />
            </button>
          </motion.div>

          {/* Greeting heading */}
          <motion.h1
            variants={itemVariants}
            className="font-black text-[var(--primary-text)] tracking-tight italic leading-tight"
            style={{ fontSize: 'clamp(1.45rem, 4vw, 2.6rem)' }}
          >
            {greeting},{' '}
            <span className="text-[var(--accent-glow)] opacity-90 drop-shadow-[0_0_12px_rgba(var(--accent-color-rgb),0.45)]">
              {user?.name || user?.username || 'Operative'}
            </span>
          </motion.h1>

          {/* Rotating smart message */}
          <AnimatePresence mode="wait">
            <motion.p
              key={smartMessage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="text-[12px] sm:text-sm font-bold text-[var(--muted-text)] mt-2.5 italic max-w-md leading-relaxed"
            >
              {smartMessage}
            </motion.p>
          </AnimatePresence>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <button
              onClick={() => navigate('/focus')}
              className="flex items-center justify-center gap-3 px-6 py-3 bg-white text-slate-950 rounded-xl font-black uppercase tracking-widest text-[11px] hover:scale-[1.03] hover:shadow-lg transition-all shadow-md shadow-white/5 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              <Play size={14} className="fill-current" /> Enter Focus Mode
            </button>

            <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest italic group hover:text-emerald-500 transition-colors cursor-default">
              <Target size={13} className="group-hover:animate-spin" /> Deep Work Protocol
            </div>
          </motion.div>

          {/* ── Mini stats row ── */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-5 sm:gap-8 mt-6"
          >
            {/* Streak */}
            <div className="flex flex-col group hover:-translate-y-1 transition-transform duration-300 cursor-default">
              <span className="text-[9px] font-black text-[var(--muted-text)] uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                <Flame size={11} className="text-orange-500 group-hover:animate-pulse" /> Current Streak
              </span>
              <div className="flex items-end gap-1.5 text-xl font-black italic text-[var(--primary-text)]">
                <AnimatedCounter value={user?.streak || 0} />
                <span className="text-[10px] uppercase text-[var(--muted-text)] mb-0.5">Days</span>
              </div>
            </div>

            <div className="w-px h-10 bg-[var(--glass-border)] hidden sm:block self-center" />

            {/* Tasks solved */}
            <div className="flex flex-col group hover:-translate-y-1 transition-transform duration-300 cursor-default">
              <span className="text-[9px] font-black text-[var(--muted-text)] uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                <Activity size={11} className="text-emerald-500" /> Tasks Solved
              </span>
              <div className="flex items-end gap-1.5 text-xl font-black italic text-[var(--primary-text)]">
                <AnimatedCounter value={stats?.completedTasks || 0} />
                <span className="text-[10px] uppercase text-[var(--muted-text)] mb-0.5">Total</span>
              </div>
            </div>

            <div className="w-px h-10 bg-[var(--glass-border)] hidden sm:block self-center" />

            {/* Neural state / level */}
            <div className="flex flex-col group hover:-translate-y-1 transition-transform duration-300 cursor-default">
              <span className="text-[9px] font-black text-[var(--muted-text)] uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                <Zap size={11} className="text-yellow-500" /> Neural State
              </span>
              <div className="flex items-end gap-1.5 text-xl font-black italic text-[var(--primary-text)]">
                {user?.productivityLevel || 1}
                <span className="text-[10px] uppercase text-[var(--muted-text)] mb-0.5">Level</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ────────────────── RIGHT COLUMN — XP Card ────────────────── */}
        <motion.div
          variants={itemVariants}
          className="w-full xl:w-80 p-5 sm:p-6 rounded-[1.5rem] border relative overflow-hidden group cursor-pointer transition-all duration-500 hover:-translate-y-1"
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderColor: 'var(--glass-border)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}
          whileHover={{
            boxShadow: '0 12px 36px rgba(var(--accent-color-rgb, 20,184,166),0.12), 0 2px 8px rgba(0,0,0,0.06)',
            borderColor: 'rgba(var(--accent-color-rgb, 20,184,166),0.35)',
          }}
        >
          {/* Animated dot-grid glow */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-500"
            style={{ backgroundImage: 'radial-gradient(var(--accent-glow) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
          />

          {/* Shimmer sweep */}
          <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:animate-shimmer pointer-events-none" />

          {/* Header row */}
          <div className="flex items-center justify-between mb-5 relative z-10">
            <p className="text-[10px] font-black text-[var(--muted-text)] uppercase tracking-[0.2em] italic group-hover:text-[var(--accent-glow)] transition-colors duration-300">
              Neural Calibration
            </p>
            <Award size={16} className="text-[var(--accent-glow)] group-hover:scale-125 transition-transform duration-500" />
          </div>

          {/* XP counter */}
          <div className="flex items-end justify-between mb-4 relative z-10">
            <span className="text-3xl font-black text-[var(--primary-text)] italic tracking-tighter group-hover:text-white transition-colors duration-300">
              <AnimatedCounter value={user?.xp || 0} />
              <span className="text-xs text-[var(--muted-text)] font-bold ml-2">XP</span>

              <AnimatePresence>
                <motion.span
                  key={user?.xp}
                  initial={{ opacity: 0, scale: 0.5, y: 0 }}
                  animate={{ opacity: 1, scale: 1, y: -36 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-0 text-[var(--accent-glow)] font-black italic text-lg pointer-events-none"
                >
                  +XP
                </motion.span>
              </AnimatePresence>
            </span>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-[var(--primary-text)] leading-none italic group-hover:text-white transition-colors">
                Level Upgrade
              </span>
              <span className="text-lg font-black text-[var(--accent-glow)] mt-1 group-hover:scale-110 transition-transform origin-right">
                {((user?.xp || 0) % 500)}{' '}
                <span className="text-[10px] text-[var(--muted-text)]">/ 500</span>
              </span>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="h-3 w-full bg-[var(--bg-silk)] rounded-full overflow-hidden p-[3px] relative shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((user?.xp || 0) % 500) / 5}%` }}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
              className="h-full bg-gradient-to-r from-[var(--accent-glow)] via-[var(--accent-secondary)] to-[var(--accent-glow)] rounded-full relative z-10"
              style={{ backgroundSize: '200% 100%' }}
            />
            <motion.div
              animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-x-0 h-full bg-[var(--accent-glow)]/30 filter blur-xl rounded-full"
              style={{ width: `${((user?.xp || 0) % 500) / 5}%` }}
            />
          </div>

          {/* Last synced + telemetry link */}
          <div className="mt-5 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
              <Clock size={11} className="text-[var(--muted-text)]" />
              <span className="text-[9px] font-black uppercase text-[var(--muted-text)] tracking-wider">
                Last calibrated: {lastSynced ? format(lastSynced, 'HH:mm:ss') : 'Connecting...'}
              </span>
            </div>
            <button className="text-[9px] font-black uppercase tracking-widest text-[var(--accent-glow)] hover:underline group-hover:scale-105 transition-transform">
              Telemetry Details
            </button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
