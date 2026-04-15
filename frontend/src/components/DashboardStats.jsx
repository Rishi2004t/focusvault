import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Database, CheckCircle2, Activity } from 'lucide-react';

export const MetricCard = ({ title, value, icon, trend, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-500 shadow-lg backdrop-blur-md"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h4>
        <p className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{value}</p>
      </div>
    </div>
    {trend && (
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
          {trend}
        </span>
      </div>
    )}
  </motion.div>
);

export const DashboardStatsHero = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <MetricCard 
        title="Active Projects" 
        value={stats.activeProjects || '0'} 
        icon={<Briefcase size={20} />} 
        delay={0.1}
      />
      <MetricCard 
        title="Storage Used" 
        value={stats.storageUsed || '0.00GB / 5GB'} 
        icon={<Database size={20} />} 
        delay={0.2}
      />
      <MetricCard 
        title="Task Completion" 
        value={stats.taskCompletion || '0%'} 
        icon={<CheckCircle2 size={20} />} 
        trend="Weekly High"
        delay={0.3}
      />
      <MetricCard 
        title="System Health" 
        value={stats.systemHealth || 'All Nodes Operational'} 
        icon={<Activity size={20} className="animate-pulse" />} 
        delay={0.4}
      />
    </div>
  );
};
