import React from 'react';
import { motion } from 'framer-motion';
import { 
  MoreVertical, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  BookOpen
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  YAxis 
} from 'recharts';

const ProjectCard = ({ project, index }) => {
  // Contextual color mapping based on priority
  const getPriorityTheme = (priority) => {
    switch (priority) {
      case 'Critical':
        return {
          accent: '#ff4d4d',
          gradient: 'from-red-500/20 to-amber-500/10',
          border: 'border-red-500/30',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]'
        };
      case 'High':
        return {
          accent: '#9dc183',
          gradient: 'from-emerald-500/20 to-cyan-500/10',
          border: 'border-[#9dc183]/30',
          glow: 'shadow-[0_0_20px_rgba(157,193,131,0.2)]'
        };
      default:
        return {
          accent: '#00f2ff',
          gradient: 'from-cyan-500/20 to-blue-500/10',
          border: 'border-cyan-500/30',
          glow: 'shadow-[0_0_20px_rgba(0,242,255,0.1)]'
        };
    }
  };

  const theme = getPriorityTheme(project.priority);
  const progressPercent = Math.round((project.completedTasks / project.taskCount) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className={`relative group bg-[#111827]/60 backdrop-blur-xl rounded-[2rem] p-8 border ${theme.border} ${theme.glow} transition-all duration-500 hover:scale-[1.02] hover:bg-[#111827]/80`}
    >
      {/* Background Glow Ornament */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${theme.gradient} rounded-full blur-[80px] opacity-20`} />

      {/* Header Area */}
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${theme.border} bg-white/5`} style={{ color: theme.accent }}>
                {project.status}
             </span>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                {project.priority}
             </span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight leading-tight pt-2">
            {project.title}
          </h3>
        </div>
        <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Progress & Metrics */}
      <div className="space-y-6 mb-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sprint Progress</p>
             <p className="text-xl font-black text-white">{project.completedTasks} / {project.taskCount} <span className="text-sm text-slate-500 font-bold ml-1">Tasks</span></p>
          </div>
          <p className="text-2xl font-black" style={{ color: theme.accent }}>{progressPercent}%</p>
        </div>

        <div className="w-full h-2.5 bg-black/40 rounded-full border border-white/5 p-0.5 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            style={{ 
              background: `linear-gradient(90deg, ${theme.accent}dd, ${theme.accent})`,
              boxShadow: `0 0 15px ${theme.accent}44`
            }}
          />
        </div>

        <div className="flex items-center gap-2 text-slate-400">
           <Clock size={14} className="text-amber-400" />
           <p className="text-[10px] font-bold uppercase tracking-widest">
             Next Milestone: <span className="text-white ml-1">{project.nextMilestone}</span>
           </p>
        </div>
      </div>

      {/* Sparkline & Team Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <div className="flex -space-x-3">
          {project.team.map((member, i) => (
            <div key={i} className="w-10 h-10 rounded-xl border-2 border-[#111827] bg-slate-800 shadow-xl overflow-hidden grayscale hover:grayscale-0 transition-all">
               <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
            </div>
          ))}
          {project.taskCount > 20 && (
            <div className="w-10 h-10 rounded-xl border-2 border-[#111827] bg-black/50 flex items-center justify-center text-[10px] font-black text-white backdrop-blur-md">
              +3
            </div>
          )}
        </div>

        {/* Mini Activity Sparkline */}
        <div className="w-24 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={project.activityLog}>
              <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={theme.accent} 
                strokeWidth={3} 
                dot={false}
                strokeLinecap="round"
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-4">
           <div className="text-right">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Notes</p>
              <p className="text-xs font-bold text-white uppercase tracking-tighter flex items-center gap-1 justify-end">
                <BookOpen size={10} className="text-[#9dc183]" />
                {project.noteCount || 0} Synced
              </p>
           </div>
           <div className="w-[1px] h-8 bg-white/5" />
           <div className="text-right">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Final Sync</p>
              <p className="text-xs font-bold text-white uppercase tracking-tighter">Apr 25, 2026</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
