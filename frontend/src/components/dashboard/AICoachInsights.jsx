import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, Clock, Zap, ArrowRight, RefreshCw, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

// ── AI logic: fetches smart insights from backend ──

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

  const loadInsights = async () => {
    try {
      const res = await api.get('/ai/coach');
      if (res.data && res.data.insights) {
        setInsights(res.data.insights);
      }
    } catch (error) {
      console.error('Failed to load AI insights', error);
      // Keep existing insights or show error state
    }
    setLastUpdated(new Date());
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setInsights([]);
    await loadInsights();
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
              Updated {timeAgo()} · Live Neural Intelligence
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
          Insights are generated dynamically from your recent tasks and activity by Focus AI.
        </p>
      </div>
    </section>
  );
}
