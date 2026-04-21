import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, Clock, Zap, ArrowRight, RefreshCw, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Mock AI logic: generates smart insights based on simulated activity patterns ──
const generateInsights = () => {
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();

  const pool = [
    {
      id: 1,
      icon: '🌅',
      color: 'from-amber-400 to-orange-500',
      glowColor: 'rgba(251,191,36,0.15)',
      borderColor: 'rgba(251,191,36,0.2)',
      badge: 'Peak Hours',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      title: 'You focus best in the morning',
      detail: 'Your deep work sessions between 8–11 AM show 3× higher task completion.',
      actionLabel: 'Schedule Focus Block',
      actionPath: '/tasks',
      confidence: 94,
    },
    {
      id: 2,
      icon: '⏱️',
      color: 'from-violet-500 to-purple-600',
      glowColor: 'rgba(139,92,246,0.15)',
      borderColor: 'rgba(139,92,246,0.2)',
      badge: 'Attention Span',
      badgeColor: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
      title: 'You lose focus after 20 minutes',
      detail: 'Switching to 20/5 Pomodoro cycles could improve your output by 40%.',
      actionLabel: 'Start Focus Mode',
      actionPath: '/focus',
      confidence: 87,
    },
    {
      id: 3,
      icon: '📅',
      color: 'from-emerald-400 to-teal-500',
      glowColor: 'rgba(52,211,153,0.15)',
      borderColor: 'rgba(52,211,153,0.2)',
      badge: 'Weekly Pattern',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      title: 'Tuesdays are your most productive day',
      detail: 'You complete 2.4× more tasks on Tuesdays. Front-load your week!',
      actionLabel: 'View Analytics',
      actionPath: '/analytics',
      confidence: 91,
    },
    {
      id: 4,
      icon: '🔥',
      color: 'from-rose-400 to-pink-500',
      glowColor: 'rgba(251,113,133,0.15)',
      borderColor: 'rgba(251,113,133,0.2)',
      badge: 'Streak Boost',
      badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      title: 'Your streak is at risk today',
      detail: hour > 18
        ? 'You haven\'t logged a session yet today. Quick 10-min sprint can save your streak!'
        : 'Keep up the momentum — you\'re on track for a 7-day streak.',
      actionLabel: 'Log Session',
      actionPath: '/focus',
      confidence: 99,
    },
    {
      id: 5,
      icon: '🧘',
      color: 'from-sky-400 to-blue-500',
      glowColor: 'rgba(56,189,248,0.15)',
      borderColor: 'rgba(56,189,248,0.2)',
      badge: 'Recovery',
      badgeColor: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
      title: 'Take more breaks between sessions',
      detail: 'Sessions with 5-min breaks show 28% better recall and fewer errors.',
      actionLabel: 'Daily Replay',
      actionPath: '/replay',
      confidence: 82,
    },
  ];

  // Smart selection: show 3 contextually relevant insights
  const selected = [];
  if (hour < 12) selected.push(pool[0]); // Morning tip
  if (dayOfWeek === 2) selected.push(pool[2]); // Tuesday tip
  selected.push(pool[1]); // Always show attention span
  if (hour > 18 || selected.length < 3) selected.push(pool[3]);
  if (selected.length < 3) selected.push(pool[4]);
  return selected.slice(0, 3);
};

// ── Confidence Meter ──
const ConfidenceMeter = ({ value, color }) => (
  <div className="flex items-center gap-2 mt-3">
    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">AI Confidence</span>
    <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
      />
    </div>
    <span className="text-[9px] font-black text-slate-500">{value}%</span>
  </div>
);

// ── Single Insight Card ──
const InsightCard = ({ insight, index }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group flex flex-col p-6 rounded-3xl border transition-all duration-300 cursor-default"
      style={{
        background: hovered ? `linear-gradient(135deg, ${insight.glowColor}, rgba(255,255,255,0.8))` : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: hovered ? insight.borderColor : 'rgba(226,232,240,0.6)',
        boxShadow: hovered
          ? `0 20px 40px -10px ${insight.glowColor}, 0 4px 12px rgba(0,0,0,0.04)`
          : '0 4px 20px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      {/* Icon + Badge */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${insight.glowColor}, rgba(255,255,255,0.9))`,
            border: `1px solid ${insight.borderColor}`,
          }}
        >
          {insight.icon}
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase border ${insight.badgeColor}`}>
          {insight.badge}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-black text-slate-800 mb-1.5 leading-snug">
        {insight.title}
      </h4>

      {/* Detail */}
      <p className="text-[11px] font-medium text-slate-500 leading-relaxed flex-1">
        {insight.detail}
      </p>

      {/* Confidence */}
      <ConfidenceMeter value={insight.confidence} color={insight.color} />

      {/* Action */}
      <button
        onClick={() => navigate(insight.actionPath)}
        className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900 transition-colors"
      >
        <span>{insight.actionLabel}</span>
        <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </motion.div>
  );
};

// ── Main AICoachInsights Component ──
export default function AICoachInsights() {
  const [insights, setInsights] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadInsights = () => {
    setInsights(generateInsights());
    setLastUpdated(new Date());
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setInsights([]);
    await new Promise(r => setTimeout(r, 600));
    loadInsights();
    setRefreshing(false);
  };

  const timeAgo = () => {
    const diff = Math.floor((new Date() - lastUpdated) / 1000);
    if (diff < 60) return 'just now';
    return `${Math.floor(diff / 60)}m ago`;
  };

  return (
    <section className="mt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.08))',
              border: '1px solid rgba(139,92,246,0.2)',
            }}
          >
            <Brain size={18} className="text-violet-600" />
          </div>
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-800 italic">
              🧠 Focus AI Insights
            </h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Updated {timeAgo()} · Mock Intelligence Engine
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all duration-200"
        >
          <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Cards Grid */}
      <AnimatePresence mode="wait">
        {insights.length > 0 ? (
          <motion.div
            key="insights"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {insights.map((insight, i) => (
              <InsightCard key={insight.id} insight={insight} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-52 rounded-3xl border border-slate-100 animate-pulse"
                style={{ background: 'rgba(248,250,252,0.8)' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer note */}
      <div className="flex items-center gap-2 mt-6">
        <Lightbulb size={11} className="text-amber-400" />
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Insights are generated from your session patterns · Real AI coming soon
        </p>
      </div>
    </section>
  );
}
