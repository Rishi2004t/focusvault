import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Clock, Zap,
  BookOpen, CheckSquare, Target, FileText, Coffee,
  BarChart2, ChevronLeft, Flame,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

// ── Mock Timeline Data ──
const MOCK_EVENTS = [
  { time: 6,   label: 'Morning Ritual',    detail: 'Started the day with journaling in Soul Vault',      icon: '☀️', type: 'ritual',   xp: 10,  color: 'from-amber-400 to-yellow-500',   glow: 'rgba(251,191,36,0.18)'  },
  { time: 7,   label: 'Deep Focus Block',  detail: 'Worked on Project Alpha for 45 minutes straight',    icon: '🧠', type: 'focus',    xp: 50,  color: 'from-violet-500 to-purple-600',  glow: 'rgba(139,92,246,0.18)' },
  { time: 8,   label: 'Task Completed',    detail: 'Finished "Design System Tokens" — high priority',    icon: '✅', type: 'task',     xp: 30,  color: 'from-emerald-400 to-teal-500',   glow: 'rgba(52,211,153,0.18)' },
  { time: 9,   label: 'Note Created',      detail: 'Captured 3 key ideas in Neural Web',                 icon: '📝', type: 'note',     xp: 15,  color: 'from-sky-400 to-blue-500',       glow: 'rgba(56,189,248,0.18)' },
  { time: 10,  label: 'Break Time',        detail: 'Short walk — cognitive reset',                        icon: '☕', type: 'break',    xp: 5,   color: 'from-rose-400 to-pink-500',      glow: 'rgba(251,113,133,0.18)'},
  { time: 11,  label: 'Focus Session',     detail: 'Pomodoro × 3: API Integration work',                 icon: '⚡', type: 'focus',    xp: 45,  color: 'from-violet-500 to-purple-600',  glow: 'rgba(139,92,246,0.18)' },
  { time: 12,  label: 'Lunch Break',       detail: 'Away from desk — recharge mode activated',           icon: '🍽️', type: 'break',   xp: 5,   color: 'from-orange-400 to-amber-500',   glow: 'rgba(251,146,60,0.18)' },
  { time: 13,  label: 'Analytics Review',  detail: 'Checked weekly velocity — up 12% from last week',    icon: '📊', type: 'review',   xp: 20,  color: 'from-indigo-400 to-blue-600',    glow: 'rgba(99,102,241,0.18)' },
  { time: 14,  label: 'Deep Focus Block',  detail: 'Neural IDE session: wrote 200 lines of clean code',  icon: '💻', type: 'focus',    xp: 60,  color: 'from-violet-500 to-purple-600',  glow: 'rgba(139,92,246,0.18)' },
  { time: 15,  label: 'Task Completed',    detail: 'Closed 4 tasks — project milestone reached!',        icon: '🎯', type: 'task',     xp: 40,  color: 'from-emerald-400 to-teal-500',   glow: 'rgba(52,211,153,0.18)' },
  { time: 16,  label: 'Team Sync',         detail: 'Review call with collaborators — 30 min',            icon: '👥', type: 'social',   xp: 15,  color: 'from-cyan-400 to-sky-500',       glow: 'rgba(34,211,238,0.18)' },
  { time: 17,  label: 'Focus Session',     detail: 'End-of-day sprint: documentation + cleanup',         icon: '🔥', type: 'focus',    xp: 35,  color: 'from-violet-500 to-purple-600',  glow: 'rgba(139,92,246,0.18)' },
  { time: 18,  label: 'Evening Wind-down', detail: 'Reviewed progress, set tomorrow\'s priorities',       icon: '🌙', type: 'ritual',   xp: 15,  color: 'from-slate-400 to-slate-600',    glow: 'rgba(148,163,184,0.18)'},
  { time: 19,  label: 'Streak Maintained', detail: '7-day streak achieved! XP bonus applied',            icon: '💎', type: 'achievement', xp: 100, color: 'from-yellow-400 to-amber-500', glow: 'rgba(251,191,36,0.25)' },
];

const TYPE_ICONS = {
  ritual: Coffee, focus: Zap, task: CheckSquare,
  note: FileText, break: Coffee, review: BarChart2,
  social: Target, achievement: Flame,
};

// ── Format hour label ──
const formatHour = (h) => {
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
};

// ── XP Badge ──
const XPBadge = ({ xp }) => (
  <span className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-amber-400/10 text-amber-600 border border-amber-400/20">
    +{xp} XP
  </span>
);

// ── Timeline Event Card ──
const EventCard = ({ event, isActive, isPast }) => {
  const IconComp = TYPE_ICONS[event.type] || Zap;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{
        opacity: isPast ? 0.45 : 1,
        x: 0,
        scale: isActive ? 1.02 : 1,
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-start gap-4 p-5 rounded-3xl border transition-all duration-300"
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${event.glow}, rgba(255,255,255,0.85))`
          : isPast
          ? 'rgba(248,250,252,0.5)'
          : 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderColor: isActive ? 'rgba(139,92,246,0.25)' : 'rgba(226,232,240,0.6)',
        boxShadow: isActive
          ? `0 12px 30px -8px ${event.glow}, 0 4px 12px rgba(0,0,0,0.04)`
          : '0 2px 8px rgba(0,0,0,0.03)',
      }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${event.glow}, rgba(255,255,255,0.9))`,
          border: `1px solid ${event.glow}`,
        }}
      >
        {event.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {formatHour(event.time)}
          </span>
          <XPBadge xp={event.xp} />
          {isActive && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-violet-500/10 text-violet-600 border border-violet-500/20 animate-pulse">
              ● LIVE
            </span>
          )}
        </div>
        <h4 className="text-sm font-black text-slate-800 mb-0.5">{event.label}</h4>
        <p className="text-[11px] font-medium text-slate-500 leading-relaxed truncate">{event.detail}</p>
      </div>

      {/* Active glow line */}
      {isActive && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl"
          style={{ background: `linear-gradient(to bottom, ${event.glow.replace('0.18', '0.6')}, transparent)` }}
          layoutId="active-bar"
        />
      )}
    </motion.div>
  );
};

// ── Stats Summary ──
const StatPill = ({ label, value, icon: Icon, color }) => (
  <div
    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border"
    style={{
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(12px)',
      borderColor: 'rgba(226,232,240,0.6)',
    }}
  >
    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
      <Icon size={12} className="text-white" />
    </div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-xs font-black text-slate-800">{value}</p>
    </div>
  </div>
);

// ── Main Page ──
export default function DailyReplay() {
  const navigate = useNavigate();
  const [currentHour, setCurrentHour] = useState(6);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef(null);
  const MIN_HOUR = 6;
  const MAX_HOUR = 19;

  const activeEvent = MOCK_EVENTS.find(e => e.time === currentHour);
  const visibleEvents = MOCK_EVENTS.filter(e => e.time <= currentHour);

  const totalXP = MOCK_EVENTS
    .filter(e => e.time <= currentHour)
    .reduce((sum, e) => sum + e.xp, 0);
  const focusSessions = MOCK_EVENTS.filter(e => e.type === 'focus' && e.time <= currentHour).length;
  const tasksCompleted = MOCK_EVENTS.filter(e => e.type === 'task' && e.time <= currentHour).length;

  const tick = useCallback(() => {
    setCurrentHour(prev => {
      if (prev >= MAX_HOUR) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(tick, 1200 / speed);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, tick]);

  const handleSliderChange = (e) => {
    setIsPlaying(false);
    setCurrentHour(Number(e.target.value));
  };

  const togglePlay = () => {
    if (currentHour >= MAX_HOUR) setCurrentHour(MIN_HOUR);
    setIsPlaying(p => !p);
  };

  const progressPct = ((currentHour - MIN_HOUR) / (MAX_HOUR - MIN_HOUR)) * 100;

  return (
    <MainLayout>
      <div className="pb-24 max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all hover:bg-white"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Daily Replay</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <StatPill label="Total XP" value={`${totalXP} pts`} icon={Flame} color="from-amber-400 to-orange-500" />
          <StatPill label="Focus Sessions" value={`${focusSessions} sessions`} icon={Zap} color="from-violet-500 to-purple-600" />
          <StatPill label="Tasks Done" value={`${tasksCompleted} tasks`} icon={CheckSquare} color="from-emerald-400 to-teal-500" />
          <StatPill label="Time Reviewed" value={formatHour(currentHour)} icon={Clock} color="from-sky-400 to-blue-500" />
        </motion.div>

        {/* ── Player Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 rounded-[2rem] border mb-8"
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderColor: 'rgba(226,232,240,0.7)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
          }}
        >
          {/* Active Event Display */}
          <AnimatePresence mode="wait">
            {activeEvent ? (
              <motion.div
                key={activeEvent.time}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4 mb-6"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${activeEvent.glow}, rgba(255,255,255,0.9))`,
                    border: `1px solid ${activeEvent.glow}`,
                  }}
                >
                  {activeEvent.icon}
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                    Now Viewing · {formatHour(currentHour)}
                  </p>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">{activeEvent.label}</h3>
                  <p className="text-[11px] font-medium text-slate-500">{activeEvent.detail}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="no-event"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl">😴</div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">No Activity</p>
                  <h3 className="text-lg font-black text-slate-800">Nothing logged yet</h3>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Slider ── */}
          <div className="relative mb-5">
            {/* Hour labels */}
            <div className="flex justify-between mb-2">
              {[6, 9, 12, 15, 18, 19].map(h => (
                <span key={h} className="text-[8px] font-black uppercase tracking-wide text-slate-400">
                  {formatHour(h)}
                </span>
              ))}
            </div>

            {/* Track + progress */}
            <div className="relative h-2 rounded-full bg-slate-100 overflow-hidden cursor-pointer">
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, #8b5cf6, #6366f1)',
                }}
                transition={{ duration: 0.2 }}
              />
            </div>

            <input
              type="range"
              min={MIN_HOUR}
              max={MAX_HOUR}
              step={1}
              value={currentHour}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
              style={{ top: '1.2rem' }}
            />

            {/* Dot markers for events */}
            <div className="absolute top-7 left-0 right-0 pointer-events-none">
              {MOCK_EVENTS.map(e => {
                const pct = ((e.time - MIN_HOUR) / (MAX_HOUR - MIN_HOUR)) * 100;
                const isPast = e.time <= currentHour;
                return (
                  <motion.div
                    key={e.time}
                    className="absolute -translate-x-1/2 -top-[0.35rem]"
                    style={{ left: `${pct}%` }}
                    animate={{ scale: e.time === currentHour ? 1.6 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="w-2 h-2 rounded-full border border-white shadow-sm"
                      style={{
                        background: isPast
                          ? `linear-gradient(135deg, #8b5cf6, #6366f1)`
                          : '#e2e8f0',
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── Controls ── */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              {/* Skip back */}
              <button
                onClick={() => { setIsPlaying(false); setCurrentHour(h => Math.max(MIN_HOUR, h - 1)); }}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-white transition-all"
              >
                <SkipBack size={14} />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>

              {/* Skip forward */}
              <button
                onClick={() => { setIsPlaying(false); setCurrentHour(h => Math.min(MAX_HOUR, h + 1)); }}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-white transition-all"
              >
                <SkipForward size={14} />
              </button>
            </div>

            {/* Speed selector */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Speed</span>
              {[1, 2, 3].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-black transition-all"
                  style={{
                    background: speed === s ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'rgba(241,245,249,0.8)',
                    color: speed === s ? '#fff' : '#94a3b8',
                    border: speed === s ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(226,232,240,0.6)',
                  }}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Events Timeline ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={14} className="text-slate-400" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Activity Timeline
            </h3>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <AnimatePresence>
            {visibleEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-slate-400"
              >
                <p className="text-4xl mb-3">🌅</p>
                <p className="text-sm font-bold">Drag the slider to start the replay</p>
              </motion.div>
            ) : (
              [...visibleEvents].reverse().map((event) => (
                <EventCard
                  key={event.time}
                  event={event}
                  isActive={event.time === currentHour}
                  isPast={event.time < currentHour}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}
