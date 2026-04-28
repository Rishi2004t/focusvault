import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Zap, ShieldAlert, BookOpen, Sparkles, ArrowUpRight, Terminal } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// ── Components ──
import MainLayout from '../components/MainLayout';
import SystemConsole from '../components/SystemConsole';
import DashboardHero from '../components/dashboard/DashboardHero';
import DashboardStatsGrid from '../components/dashboard/DashboardStatsGrid';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import DashboardActivityFeed from '../components/dashboard/DashboardActivityFeed';
import DashboardRecentGrid from '../components/dashboard/DashboardRecentGrid';
import TodayFocus from '../components/dashboard/TodayFocus';
import DashboardQuickActions from '../components/dashboard/DashboardQuickActions';
import NeuralHeatmap from '../components/dashboard/NeuralHeatmap';
import DashboardVideo from '../components/dashboard/DashboardVideo';
import FeedbackMarquee from '../components/dashboard/FeedbackMarquee';
import CreatorSection from '../components/dashboard/CreatorSection';
import FocusHeatmap from '../components/dashboard/FocusHeatmap';
import AICoachInsights from '../components/dashboard/AICoachInsights';
import BadgesSection from '../components/dashboard/BadgesSection';
import DailyAnalyticsReport from '../components/dashboard/DailyAnalyticsReport';

import { 
  requestNotificationPermission, 
  registerServiceWorker, 
  subscribeToPush 
} from '../utils/notifications';

// ── Skeleton Loader ──
const DashboardSkeleton = () => (
  <div className="space-y-12 animate-pulse">
    <div className="h-64 bg-white/5 rounded-[3rem] border border-white/5" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl border border-white/5" />)}
    </div>
    <div className="h-96 bg-white/5 rounded-[3rem] border border-white/5" />
  </div>
);

export default function Dashboard() {
  const { user, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    stats: {},
    weeklyData: [],
    distributionData: [],
    recentNotes: [],
    recentAssets: [],
    urgentTasks: [],
    insights: [],
    activityLogs: [],
    suggestions: [],
    allBadges: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastSynced, setLastSynced] = useState(new Date());
  const socket = useSocket();

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, velocityRes, distributionRes, notesRes, assetsRes, tasksRes, suggestionsRes, badgesRes] = await Promise.all([
        api.get('/analytics/dashboard-stats'),
        api.get('/analytics/velocity'),
        api.get('/analytics/distribution'),
        api.get('/notes?limit=5'),
        api.get('/upload/assets?limit=5'),
        api.get('/tasks?sortBy=-priority'),
        api.get('/analytics/suggestions'),
        api.get('/analytics/badges'),
      ]);

      setData({
        stats: statsRes?.data?.metrics || {},
        weeklyData: velocityRes?.data || [],
        distributionData: distributionRes?.data || [],
        recentNotes: notesRes?.data || [],
        recentAssets: assetsRes?.data || [],
        urgentTasks: tasksRes?.data || [],
        insights: statsRes?.data?.insights || [],
        activityLogs: statsRes?.data?.activityLogs || [],
        suggestions: suggestionsRes?.data || [],
        allBadges: badgesRes?.data || [],
      });
    } catch (err) {
      console.error('❌ Dashboard Sync Error:', err);
      setError('Intelligence uplink failed. Re-initializing terminal...');
    } finally {
      setLoading(false);
      setLastSynced(new Date());
    }
  }, []);

  const handleRefresh = async () => {
    toast.promise(fetchDashboardData(), {
        loading: 'Synchronizing Neural Core...',
        success: 'Telemetry Optimal',
        error: 'Uplink Failed'
    });
  };

  const handleTestPulse = async () => {
    const loader = toast.loading('Initiating Neural Pulse...');
    try {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        toast.error('Neural alerts blocked. Please enable notifications in your browser settings.', { id: loader });
        return;
      }
      const registration = await registerServiceWorker();
      if (!registration) {
        toast.error('Service Worker sync failed. Background alerts unavailable.', { id: loader });
        return;
      }
      await subscribeToPush(registration);
      const res = await api.get('/notifications/test-push');
      toast.success(res.data.message || 'Signal broadcasted successfully!', { id: loader });
    } catch (err) {
      console.error('❌ Pulse Failure:', err);
      toast.error('Neural Pulse failed to transmit.', { id: loader });
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshKey]);

  useEffect(() => {
    if (socket) {
      const handleNewActivity = (activity) => {
        setData(prev => ({
          ...prev,
          activityLogs: [activity, ...(prev.activityLogs || [])].slice(0, 15)
        }));
        setLastSynced(new Date());
      };
      const handleBadgeUnlocked = ({ badge, message }) => {
        toast.success(message, {
          icon: '🏆',
          duration: 6000,
          style: {
            background: 'var(--bg-card)',
            color: 'var(--primary-text)',
            border: '1px solid var(--accent-glow)',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }
        });
        if (fetchUserProfile) fetchUserProfile();
      };

      socket.on('new_activity', handleNewActivity);
      socket.on('badge_unlocked', handleBadgeUnlocked);
      return () => {
        socket.off('new_activity', handleNewActivity);
        socket.off('badge_unlocked', handleBadgeUnlocked);
      };
    }
  }, [socket]);

  const handleTaskToggle = async (id, currentStatus) => {
    try {
      await api.put(`/tasks/${id}`, { completed: !currentStatus });
      fetchDashboardData();
      if (fetchUserProfile) fetchUserProfile();
    } catch (err) {
      console.error('Task toggle failed', err);
    }
  };

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-6 shadow-xl shadow-rose-100/50">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-black text-[var(--primary-text)] mb-2 uppercase tracking-tighter">Connection Terminated</h2>
          <p className="text-[var(--secondary-text)] font-bold text-sm mb-8 px-4 max-w-md">{error}</p>
          <button 
            onClick={() => setRefreshKey(k => k + 1)}
            className="flex items-center gap-3 px-8 py-3.5 bg-[var(--accent-glow)] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg shadow-[var(--accent-glow)]/20 btn-ripple"
          >
            <RefreshCw size={14} /> Re-establish Link
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        {loading ? (
          <DashboardSkeleton key="skeleton" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-32"
          >
            <DashboardHero user={user} stats={data?.stats} lastSynced={lastSynced} onRefresh={handleRefresh} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
              <div className="xl:col-span-2">
                <TodayFocus tasks={data?.urgentTasks} onToggle={handleTaskToggle} />
              </div>
              <div className="xl:col-span-1">
                <DashboardActivityFeed activities={data?.activityLogs} />
              </div>
            </div>

            <DashboardVideo />
            <DashboardQuickActions onTestPulse={handleTestPulse} />
            
            <div className="mt-12 sm:mt-16">
              <NeuralHeatmap />
            </div>

            <div className="mt-12 sm:mt-16">
              <FocusHeatmap />
            </div>

            {/* ── AI Coach Insights ── */}
            <AICoachInsights />

            <div className="mt-12 sm:mt-16 mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-silk)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--muted-text)]">
                  <BookOpen size={16} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary-text)] italic text-center sm:text-left w-full sm:w-auto">Archive Overviews</h3>
              </div>
              <DashboardRecentGrid notes={data?.recentNotes} assets={data?.recentAssets} tasks={data?.urgentTasks} />
            </div>

            {/* ── Badges Section ── */}
            <BadgesSection allBadges={data?.allBadges} userBadges={user?.badges} />

            {/* ── Daily Analytics Report ── */}
            <div className="mt-12 sm:mt-16">
              <DailyAnalyticsReport />
            </div>

            <div className="bg-[var(--bg-silk)]/30 rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-10 border border-[var(--glass-border)] mt-16 sm:mt-24">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--primary-text)] text-white flex items-center justify-center">
                    <Zap size={18} />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--primary-text)] italic text-center sm:text-left w-full sm:w-auto">Telemetry Analytics</h3>
                </div>
                <button className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-glow)] hidden sm:block">Export Intelligence</button>
              </div>
              <DashboardStatsGrid stats={data?.stats} />
              <div className="mt-12">
                <DashboardCharts weeklyData={data?.weeklyData} distributionData={data?.distributionData} />
              </div>
            </div>

            <div className="mt-20">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary-text)] italic text-center sm:text-left w-full sm:w-auto">Neural Predictions</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data?.suggestions?.map((s, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--glass-border)] hover:border-indigo-500/30 transition-all group cursor-pointer"
                      onClick={() => s.id && navigate(`/focus/${s.id}`)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2 py-1 rounded-md text-[8px] font-black tracking-widest uppercase ${
                          s.type === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                        }`}>
                          {s.type} Path
                        </span>
                        <ArrowUpRight size={14} className="text-slate-500 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                      <h4 className="text-sm font-black text-[var(--primary-text)] mb-1 group-hover:text-indigo-400 transition-colors uppercase italic">{s.title}</h4>
                      <p className="text-[9px] font-bold text-[var(--muted-text)] uppercase tracking-wider">{s.reason}</p>
                    </motion.div>
                  ))}
               </div>
            </div>

            <FeedbackMarquee />

            <div className="mt-20 pt-12 border-t border-[var(--glass-border)] opacity-60 hover:opacity-100 transition-opacity">
              <SystemConsole onReboot={() => setRefreshKey(k => k + 1)} />
            </div>
            <CreatorSection />

            {/* ── Version Tag for Verification ── */}
            <div className="fixed bottom-4 left-4 z-[50] pointer-events-none">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-500/40 bg-indigo-500/5 px-3 py-1.5 rounded-full border border-indigo-500/10 backdrop-blur-sm">
                Neural Build: 1.6.0-Badge-System
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
