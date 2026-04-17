import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2, Database, Briefcase, ArrowUpRight, ArrowDownRight, X, Activity, Zap } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import AnimatedCounter from '../shared/AnimatedCounter';

function StatCard({ label, value, icon, change, sparkline, path, color, index, onDetail }) {
  const navigate = useNavigate();
  const isPositive = (change || 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, type: "spring", stiffness: 100 }}
      layoutId={`card-${label}`}
      className="group cursor-pointer bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-3xl p-6 neural-card-hover relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
             style={{ backgroundColor: `${color}10`, border: `1px solid ${color}20` }}>
          {React.cloneElement(icon, { size: 22, style: { color: color } })}
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(change || 0)}%
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); onDetail(); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-black uppercase tracking-tighter px-2 py-1 rounded bg-[var(--bg-silk)] border border-[var(--glass-border)] text-[var(--muted-text)] hover:text-[var(--accent-glow)]"
            >
                Neural Deep-Dive
            </button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4" onClick={() => navigate(path)}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)] mb-1">{label}</p>
          <p className="text-3xl font-black text-[var(--primary-text)] tracking-tight">
            {label === 'Vault Storage' ? value : <AnimatedCounter value={typeof value === 'number' ? value : 0} />}
          </p>
        </div>
        <div className="w-24 h-12 flex-shrink-0 opacity-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={(sparkline || [0,0,0,0,0,0,0]).map((v, i) => ({ value: v, id: i }))}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2} 
                dot={false} 
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardStatsGrid({ stats }) {
  const [selectedStat, setSelectedStat] = useState(null);

  const cards = [
    {
      label: 'Neural Notes',
      value: stats?.totalNotes || 0,
      icon: <FileText />,
      change: stats?.trends?.notes || 0,
      sparkline: stats?.sparklines?.notes || [0,0,0,0,0,0,0],
      path: '/notes',
      color: '#A855F7' // Purple
    },
    {
      label: 'Completed Tasks',
      value: stats?.completedTasks || 0,
      icon: <CheckCircle2 />,
      change: stats?.trends?.tasks || 0,
      sparkline: stats?.sparklines?.tasks || [0,0,0,0,0,0,0],
      path: '/tasks',
      color: '#10B981' // Emerald
    },
    {
      label: 'Vault Storage',
      value: stats?.storageUsed?.split(' / ')[0] || '0GB',
      icon: <Database />,
      change: 2,
      sparkline: [40, 42, 45, 44, 48, 50, 52],
      path: '/files',
      color: '#06B6D4' // Cyan
    },
    {
      label: 'Active Projects',
      value: stats?.activeProjects || 0,
      icon: <Briefcase />,
      change: 0,
      sparkline: [2, 3, 3, 4, 4, 4, 4],
      path: '/projects',
      color: '#F59E0B' // Orange
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, i) => (
          <StatCard 
            key={i} 
            {...card} 
            index={i} 
            onDetail={() => setSelectedStat(card)} 
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedStat && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/20 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              layoutId={`card-${selectedStat.label}`}
              className="w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 opacity-10 blur-3xl rounded-full" style={{ backgroundColor: selectedStat.color }} />

              <div className="flex justify-between items-start relative z-10 mb-8 sm:mb-10">
                <div className="flex items-center gap-4 sm:gap-5">
                   <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center shadow-lg shrink-0"
                        style={{ backgroundColor: `${selectedStat.color}10`, border: `1px solid ${selectedStat.color}30` }}>
                     {React.cloneElement(selectedStat.icon, { size: 24, className: "sm:w-7 sm:h-7", style: { color: selectedStat.color } })}
                   </div>
                   <div>
                     <h2 className="text-xl sm:text-2xl font-black text-[var(--primary-text)] italic tracking-tight">{selectedStat.label}</h2>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted-text)] mt-1">Telemetry Data Output</p>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedStat(null)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--bg-silk)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--muted-text)] hover:text-[var(--accent-glow)] transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-10 sm:mb-12 relative z-10">
                 <div className="p-4 sm:p-6 rounded-3xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)]">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-text)] mb-2">Real-Time Value</p>
                    <p className="text-2xl sm:text-3xl font-black text-[var(--primary-text)] tracking-tighter">
                      {selectedStat.label === 'Vault Storage' ? selectedStat.value : <AnimatedCounter value={selectedStat.value} />}
                    </p>
                 </div>
                 <div className="p-6 rounded-3xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)]">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-text)] mb-2">7D Delta</p>
                    <p className={`text-3xl font-black tracking-tighter ${selectedStat.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {selectedStat.change >= 0 ? '+' : ''}{selectedStat.change}%
                    </p>
                 </div>
                 <div className="p-6 rounded-3xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)]">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-text)] mb-2">Status</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Operational</span>
                    </div>
                 </div>
              </div>

              <div className="h-48 w-full relative z-10 bg-[var(--bg-silk)]/30 rounded-3xl p-6 border border-[var(--glass-border)]">
                 <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-text)] mb-4 flex items-center gap-2">
                    <Activity size={12} /> Intelligence Flow Chart
                 </p>
                 <ResponsiveContainer width="100%" height="80%">
                    <AreaChart data={selectedStat.sparkline.map((v, i) => ({ value: v, name: `Day ${i + 1}` }))}>
                      <defs>
                        <linearGradient id="detailGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={selectedStat.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={selectedStat.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                          backdropFilter: 'blur(10px)',
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={selectedStat.color} 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#detailGradient)" 
                      />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>

              <div className="mt-10 flex justify-end gap-4 relative z-10">
                 <button 
                  onClick={() => setSelectedStat(null)}
                  className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)] hover:text-[var(--primary-text)] transition-all"
                 >
                   Deactivate View
                 </button>
                 <button 
                  className="px-8 py-3 rounded-2xl bg-[var(--primary-text)] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-xl transition-all"
                  style={{ backgroundColor: selectedStat.color }}
                 >
                   Sync Neural Node
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
