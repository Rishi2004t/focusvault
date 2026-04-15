import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  Activity, 
  PieChart as PieIcon, 
  BarChart3, 
  TrendingUp, 
  Zap,
  Target,
  Users,
  RefreshCw,
  FileText,
  Database
} from 'lucide-react';
import MainLayout from '../components/MainLayout';
import GlassCard from '../components/GlassCard';
import api from '../utils/api';

export default function Analytics() {
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [globalStats, setGlobalStats] = useState({
    totalNotes: 0,
    totalAssets: 0,
    totalTeamMembers: 0,
    projectCompletionPercent: 0
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchAnalytics = async () => {
    setIsSyncing(true);
    try {
      const [storageRes, velocityRes, overviewRes] = await Promise.all([
        api.get('/analytics/storage'),
        api.get('/analytics/velocity'),
        api.get('/analytics/overview')
      ]);

      // Assign Neon Colors to Pie Chart dynamically
      const colors = ['#00f2fe', '#4facfe', '#bf5af2', '#30d158', '#f5a623'];
      const mappedPie = (storageRes.data || []).map((item, i) => ({
        ...item,
        color: colors[i % colors.length]
      }));

      // Fallback if pie is empty
      if (mappedPie.length === 0) {
        mappedPie.push({ name: 'Empty Vault', value: 1, color: '#334155' });
      }

      setPieData(mappedPie);
      setLineData(velocityRes.data || []);
      setGlobalStats(overviewRes.data || {});
    } catch (error) {
      console.error('Failed to sync analytics:', error);
    }
    setIsSyncing(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Mock data for second bar chart to maintain the aesthetic as req didn't specify second bar data specifically, but I will format it nicely
  const barData = [
    { name: 'Core', current: globalStats.projectCompletionPercent || 0, goal: 100 },
  ];

  if (isSyncing && !lineData.length && !pieData.length) {
    return (
      <MainLayout>
        <div className="max-w-[1500px] mx-auto pb-20 px-4 mt-8 animate-pulse">
           <div className="h-20 w-1/3 bg-white/5 rounded-3xl mb-12" />
           <div className="h-[550px] w-full bg-white/5 rounded-[3rem] mb-12" />
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="h-[450px] bg-white/5 rounded-[3rem]" />
              <div className="h-[450px] bg-white/5 rounded-[3rem]" />
           </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-[1500px] mx-auto pb-20 px-4 mt-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-white">
              Analytics <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-[#4facfe]">Suite</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs mt-2">
              Deep Data Analysis & Telemetry
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={fetchAnalytics}
              disabled={isSyncing}
              className="px-5 py-2.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/40 text-cyan-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_15px_transparent] hover:shadow-[0_0_20px_rgba(0,242,254,0.15)] disabled:opacity-50"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              Sync Analytics
            </button>
            <div className="flex items-center gap-6 p-4 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-md">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Global Efficiency</span>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00f2fe] to-[#4facfe]">
                  {globalStats.projectCompletionPercent || 0}%
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
                 <Zap size={20} className="fill-current" />
              </div>
            </div>
          </div>
        </header>

        {/* SVG Gradients Definition */}
        <svg style={{ height: 0, width: 0, position: 'absolute' }}>
          <defs>
            <linearGradient id="neonTeal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="neonPurple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bf5af2" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#bf5af2" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </svg>

        {/* Primary Line Chart (7-Day Task Velocity) */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
              <TrendingUp size={16} className="text-cyan-400" />
              7-Day Task Velocity
            </h3>
          </div>

          <GlassCard className="p-10 h-[550px] bg-slate-900/50 border-white/5 transform hover:scale-[1.01] transition-transform duration-500">
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    fontSize={11} 
                    fontWeight="bold" 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11} 
                    fontWeight="bold" 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(0, 242, 254, 0.3)', 
                      borderRadius: '16px',
                      boxShadow: '0 0 30px rgba(0, 242, 254, 0.1)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#00f2fe' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#00f2fe" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#neonTeal)" 
                    activeDot={{ r: 8, fill: '#00f2fe' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                 <Activity size={48} className="mb-4 opacity-20" />
                 <p className="text-xs font-black uppercase tracking-[0.3em]">No Velocity Data Detected</p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Secondary Charts (Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Vault Storage (Radial Pie) */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
              <Database size={16} className="text-purple-400" />
              Vault Composition (MB)
            </h3>
            <GlassCard className="p-8 h-[450px] flex items-center justify-center bg-slate-900/50 border-white/5 relative transform hover:scale-[1.02] transition-transform duration-500">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={pieData}
                     cx="50%"
                     cy="50%"
                     innerRadius={90}
                     outerRadius={140}
                     paddingAngle={8}
                     dataKey="value"
                     stroke="none"
                   >
                     {pieData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff', fontWeight: 'bold' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
               {/* Center Badge */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-28 h-28 rounded-full bg-slate-950/90 border border-white/5 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(191,90,242,0.15)] backdrop-blur-xl">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Storage</span>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#bf5af2] to-[#4facfe]">
                       {pieData.reduce((acc, curr) => acc + (curr.value || 0), 0).toFixed(1)}
                    </span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase">MB</span>
                 </div>
               </div>
            </GlassCard>
          </div>

          {/* Core Metrics Distribution (BarChart) */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
              <BarChart3 size={16} className="text-indigo-400" />
              Macro Analytics
            </h3>
            <GlassCard className="p-8 h-[450px] bg-slate-900/50 border-white/5 transform hover:scale-[1.02] transition-transform duration-500">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                   { name: 'Notes', value: globalStats.totalNotes || 0 },
                   { name: 'Assets', value: globalStats.totalAssets || 0 },
                   { name: 'Members', value: globalStats.totalTeamMembers || 0 },
                ]} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#64748b" 
                    fontSize={11} 
                    fontWeight="bold" 
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip 
                     contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff', fontWeight: 'bold' }}
                     cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  />
                  <Bar dataKey="value" fill="url(#neonPurple)" radius={[0, 6, 6, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
           {[
             { label: 'Total Notes', value: globalStats.totalNotes || 0, icon: <FileText size={20} />, color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10' },
             { label: 'Vault Assets', value: globalStats.totalAssets || 0, icon: <Database size={20} />, color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/10' },
             { label: 'Network Size', value: globalStats.totalTeamMembers || 0, icon: <Users size={20} />, color: 'text-indigo-400', border: 'border-indigo-500/20', bg: 'bg-indigo-500/10' },
             { label: 'Objective Ratio', value: (globalStats.projectCompletionPercent || 0) + '%', icon: <Target size={20} />, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' }
           ].map((stat, i) => (
             <GlassCard key={i} className="p-6 bg-slate-900/40 flex flex-col items-center justify-center gap-3 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 hover:shadow-2xl">
                <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.border} border ${stat.color} mb-1 shadow-lg`}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{stat.label}</span>
                <span className="text-3xl font-black text-white tracking-tighter shadow-black drop-shadow-md">{stat.value}</span>
             </GlassCard>
           ))}
        </div>
      </div>
    </MainLayout>
  );
}
