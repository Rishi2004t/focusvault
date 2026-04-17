import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  UploadCloud, 
  Terminal,
  Sparkles,
  Search,
  BookOpen,
  Plus,
  Zap
} from 'lucide-react';

export default function DashboardQuickActions({ onTestPulse }) {
  const navigate = useNavigate();

  const actions = [
    { 
      label: 'New Protocol', 
      sub: 'Create Note',
      icon: <FileText size={22} />, 
      path: '/notes/new', 
      color: 'var(--accent-glow)',
      bg: 'bg-blue-500/10',
      shadowColor: 'rgba(59, 130, 246, 0.5)'
    },
    { 
      label: 'Mission Init', 
      sub: 'Add Task',
      icon: <CheckCircle2 size={22} />, 
      path: '/tasks', 
      color: 'var(--accent-secondary)',
      bg: 'bg-purple-500/10',
      shadowColor: 'rgba(168, 85, 247, 0.5)'
    },
    { 
      label: 'Neural Sync', 
      sub: 'Upload File',
      icon: <UploadCloud size={22} />, 
      path: '/files', 
      color: '#F59E0B',
      bg: 'bg-orange-500/10',
      shadowColor: 'rgba(245, 158, 11, 0.5)'
    },
    { 
      label: 'Neural Pulse', 
      sub: 'Test Alerts',
      icon: <Zap size={22} className="animate-pulse" />, 
      action: onTestPulse,
      color: '#10B981',
      bg: 'bg-emerald-500/10',
      shadowColor: 'rgba(16, 185, 129, 0.5)'
    }
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent-glow)]/10 border border-[var(--accent-glow)]/20 flex items-center justify-center text-[var(--accent-glow)] group hover:scale-110 transition-transform">
          <Terminal size={16} className="group-hover:animate-pulse" />
        </div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--primary-text)] italic">Command Center</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8, scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => action.action ? action.action() : navigate(action.path)}
            className="group relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-[var(--bg-card)] border border-[var(--glass-border)] shadow-xl shadow-[var(--accent-glow)]/5 hover:border-[var(--accent-glow)]/50 transition-all overflow-hidden"
            style={{ '--hover-shadow': action.shadowColor }}
          >
            {/* Background Accent */}
            <div className={`absolute inset-0 ${action.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
            
            {/* Cool gradient flash on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110 shadow-lg shadow-black/5"
                style={{ 
                   backgroundColor: `${action.color}15`, 
                   color: action.color, 
                   border: `1px solid ${action.color}30`,
                   boxShadow: `0 10px 20px -10px ${action.color}`
                }}
              >
                {action.icon}
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--primary-text)] mb-1 italic group-hover:text-white transition-colors duration-300">
                {action.label}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted-text)] group-hover:text-white/70 transition-colors duration-300">
                {action.sub}
              </p>
            </div>

            {/* Pulsing indicator */}
            <div className="absolute top-4 right-4">
              <div className={`w-1.5 h-1.5 rounded-full bg-[var(--accent-glow)] ${action.action ? 'animate-ping' : 'opacity-0'} group-hover:opacity-100 shadow-[0_0_8px_var(--accent-glow)]`} />
            </div>
            
            {/* Plus icon on hover */}
            <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
               <div className="w-8 h-8 rounded-full bg-[var(--primary-text)] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  {action.action ? <Zap size={16} /> : <Plus size={16} />}
               </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
