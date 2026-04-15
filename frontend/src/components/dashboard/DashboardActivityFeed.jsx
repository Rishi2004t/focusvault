import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2, Database, Zap, Cpu, Shield, Clock, Activity } from 'lucide-react';

function TimeAgo({ date }) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `Just now`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function DashboardActivityFeed({ activities = [] }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2.5rem] p-8 shadow-2xl shadow-[var(--accent-glow)]/5 h-full flex flex-col transition-all duration-300 relative overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-glow)]/5 blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--bg-silk)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent-glow)]">
            <Shield size={18} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary-text)] italic">Intelligence Feed</h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Live</span>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        <AnimatePresence initial={false}>
          {(activities || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-[var(--muted-text)] opacity-40">
              <Zap size={32} className="mb-4 animate-pulse" />
              <p className="text-[9px] font-black uppercase tracking-[0.2em]">Syncing Telemetry...</p>
            </div>
          ) : (
            activities.map((activity, i) => {
              const baseMap = {
                'VAULT_ADD': { icon: <Database />, color: 'var(--accent-glow)', bg: 'bg-blue-500/5' },
                'NOTE_CREATE': { icon: <FileText />, color: 'var(--accent-secondary)', bg: 'bg-purple-500/5' },
                'TASK_OK': { icon: <CheckCircle2 />, color: '#10B981', bg: 'bg-emerald-500/5' },
                'BREAK_SYNC': { icon: <Zap />, color: '#F59E0B', bg: 'bg-orange-500/5' },
                'TASK_ADD': { icon: <Activity />, color: '#6366F1', bg: 'bg-indigo-500/5' },
              };
              const config = baseMap[activity.type] || { icon: <Activity />, color: 'var(--accent-glow)', bg: 'bg-blue-500/5' };
              return (
                <motion.div
                  key={activity._id || i}
                  layout
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    layout: { duration: 0.4 }
                  }}
                  className="flex gap-4 group cursor-default items-start"
                >
                  <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0 border border-[var(--glass-border)] group-hover:border-[var(--accent-glow)]/40 transition-all`}
                       style={{ color: config.color }}>
                    {React.cloneElement(config.icon, { size: 14 })}
                  </div>
                  <div className="flex-1 pb-4 border-b border-[var(--glass-border)]/50 last:border-0 group-hover:border-[var(--accent-glow)]/20 transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-[11px] font-bold text-[var(--primary-text)] leading-normal group-hover:text-[var(--accent-glow)] transition-colors">
                          {activity.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded bg-[var(--bg-silk)] border border-[var(--glass-border)] text-[var(--muted-text)]">
                             {activity.type || 'PROTOCOL'}
                           </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-[var(--muted-text)] uppercase tracking-tighter shrink-0 flex items-center gap-1 mt-0.5">
                        <Clock size={10} />
                        <TimeAgo date={activity.timestamp} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
      
      <button className="mt-8 w-full py-3.5 rounded-2xl bg-[var(--bg-silk)] border border-[var(--glass-border)] text-[9px] font-black uppercase tracking-[0.2em] text-[var(--secondary-text)] hover:bg-[var(--primary-text)] hover:text-white hover:border-[var(--primary-text)] transition-all shadow-sm group/all">
        Operational Log <span className="opacity-0 group-hover/all:opacity-100 group-hover/all:translate-x-1 inline-block transition-all">→</span>
      </button>
    </div>
  );
}

