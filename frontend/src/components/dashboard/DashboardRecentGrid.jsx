import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Database, AlertCircle, Clock, ChevronRight } from 'lucide-react';

function TimeAgo({ date }) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${Math.floor(seconds)}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function RecentPanel({ title, icon, color, items = [], type, path }) {
  const navigate = useNavigate();

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2.5rem] p-8 shadow-2xl shadow-[var(--accent-glow)]/5 flex flex-col h-full transition-all duration-500 hover:border-[var(--accent-glow)]/50 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(var(--accent-color-rgb),0.3)] group/panel relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-glow)]/5 blur-3xl group-hover/panel:bg-[var(--accent-glow)]/20 transition-colors duration-700 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm border border-[var(--glass-border)]" 
               style={{ backgroundColor: `${color}10`, color: color }}>
            {React.cloneElement(icon, { size: 18 })}
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary-text)] italic">{title}</h3>
            <p className="text-[8px] font-bold text-[var(--muted-text)] uppercase tracking-widest mt-0.5">Neural Cache</p>
          </div>
        </div>
        <button 
          onClick={() => navigate(path)}
          className="w-8 h-8 rounded-full bg-[var(--bg-silk)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--muted-text)] hover:text-[var(--accent-glow)] hover:border-[var(--accent-glow)]/30 transition-all group/btn"
        >
          <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {(items || []).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[var(--muted-text)] text-center h-full">
            <motion.div 
               animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="mb-4"
            >
              <Database size={32} />
            </motion.div>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--muted-text)] mb-4">Neural Buffer Empty</p>
            <button 
              onClick={() => navigate(path)}
              className="px-6 py-2 bg-[var(--bg-silk)] border border-[var(--glass-border)] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[var(--accent-glow)] hover:text-white transition-all duration-300"
            >
              Initialize Entry
            </button>
          </div>
        ) : items.map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
            onClick={() => navigate(type === 'note' ? `/notes/${item._id}` : path)}
            className="group flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-silk)]/50 border border-transparent hover:border-[var(--glass-border)] hover:bg-[var(--bg-card)] hover:shadow-lg hover:shadow-[var(--accent-glow)]/5 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-card)] border border-[var(--glass-border)] flex items-center justify-center shrink-0 shadow-sm transition-colors group-hover:bg-[var(--bg-silk)]">
                {type === 'note' && <FileText size={13} className="text-[var(--accent-glow)]" />}
                {type === 'file' && <Database size={13} className="text-orange-400" />}
                {type === 'task' && <AlertCircle size={13} className="text-rose-500" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--primary-text)] truncate group-hover:text-[var(--accent-glow)] transition-colors">
                  {item.title || item.filename}
                </p>
                <p className="text-[9px] text-[var(--muted-text)] uppercase font-bold flex items-center gap-1.5 mt-1">
                  <TimeAgo date={item.updatedAt || item.createdAt} />
                </p>
              </div>
            </div>
            {item.category && (
              <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--muted-text)] px-2 py-0.5 rounded-md bg-[var(--bg-silk)] border border-[var(--glass-border)]">
                {item.category}
              </span>
            )}
            </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardRecentGrid({ notes = [], assets = [], tasks = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <RecentPanel 
        title="Neural Notes" 
        icon={<FileText size={16} />} 
        color="#A855F7" 
        items={notes.slice(0, 4)} 
        type="note" 
        path="/notes" 
      />
      <RecentPanel 
        title="Vault Assets" 
        icon={<Database size={16} />} 
        color="#F59E0B" 
        items={assets.slice(0, 4)} 
        type="file" 
        path="/files" 
      />
      <RecentPanel 
        title="Priority Tasks" 
        icon={<AlertCircle size={16} />} 
        color="#F43F5E" 
        items={tasks.filter(t => !t.completed).slice(0, 4)} 
        type="task" 
        path="/tasks" 
      />
    </div>
  );
}
