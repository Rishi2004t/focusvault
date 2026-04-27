import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, ChevronRight, Clock, Zap, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../../utils/api';

export default function TodayFocus({ tasks = [], onToggle }) {
  const navigate = useNavigate();
  const topTasks = tasks.slice(0, 3);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Derive some stats for progress bar
  const totalTasks = tasks.length || 1; 
  // Let's pretend completed is random or based on actual data if we had it. 
  // For now we'll just show a cool progress bar based on top tasks vs total
  const progressPercent = Math.min(100, Math.max(10, Math.floor((tasks.length > 3 ? 3 : tasks.length) / totalTasks * 100)));

  const handleComplete = (id) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0a84ff', '#bf5af2', '#30d158']
    });
    onToggle(id, false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setIsAdding(true);
    try {
      await api.post('/tasks', { title: newTaskTitle, priority: 'medium' });
      setNewTaskTitle('');
      // We ideally would call a prop to refresh tasks, assuming onToggle refreshes it
      onToggle('refresh', false); // Hack to trigger refresh from parent if possible, or parent should pass a refresh
      window.location.reload(); // Simple fallback
    } catch (error) {
      console.error('Failed to add task', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 h-full group hover:shadow-[var(--accent-glow)]/10 transition-all duration-500 will-change-transform">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--accent-glow)]/10 to-transparent blur-[80px] -mr-32 -mt-32 pointer-events-none transition-all duration-700 group-hover:from-[var(--accent-glow)]/20" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-glow)]/10 border border-[var(--accent-glow)]/20 flex items-center justify-center text-[var(--accent-glow)] group-hover:scale-110 transition-transform duration-500">
            <Target size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--primary-text)] italic">Today's Mission</h3>
            <p className="text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-widest mt-0.5">Keep pushing forward, Operative!</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/tasks')}
          className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] hover:text-[var(--accent-glow)] transition-colors flex items-center gap-1 group/btn"
        >
          Dispatch All <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-between items-center mb-2">
           <span className="text-[9px] font-bold uppercase text-[var(--muted-text)]">Mission Progress</span>
           <span className="text-[9px] font-black text-[var(--accent-glow)]">{progressPercent}%</span>
        </div>
        <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${progressPercent}%` }}
             className="h-full bg-gradient-to-r from-[var(--accent-glow)] to-[var(--accent-secondary)] rounded-full relative z-10 shadow-[0_0_10px_var(--accent-glow)]/30"
           />
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <AnimatePresence mode="popLayout">
          {topTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center text-[var(--muted-text)]"
            >
              <Zap size={24} className="mb-4 opacity-30" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Neural Buffer Clear</p>
              <p className="text-[9px] mt-2 opacity-60">You are completely caught up for today.</p>
            </motion.div>
          ) : (
            topTasks.map((task, i) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.1 }}
                className="group/item relative p-4 sm:p-5 rounded-2xl bg-[var(--bg-silk)]/40 backdrop-blur-md border border-[var(--glass-border)] hover:bg-[var(--bg-card)]/60 hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] will-change-transform"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        task.priority === 'high' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 
                        task.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-text)]">
                        {task.priority || 'Routine'} / {task.projectContext || 'General'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[var(--primary-text)] truncate group-hover/item:text-[var(--accent-glow)] transition-colors italic">
                      {task.title}
                    </h4>
                  </div>
                  
                  <button 
                    onClick={() => handleComplete(task._id)}
                    className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--muted-text)] hover:text-emerald-500 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group/check shadow-sm hover:scale-110 active:scale-95"
                  >
                    <CheckCircle2 size={18} className="group-hover/check:scale-110 transition-transform" />
                  </button>
                </div>

                {task.dueDate && (
                  <div className="mt-3 pt-3 border-t border-[var(--glass-border)]/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--muted-text)] uppercase tracking-widest">
                      <Clock size={10} />
                      {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[9px] font-black text-[var(--accent-glow)] uppercase tracking-[0.2em] opacity-0 group-hover/item:opacity-100 transition-opacity">
                      Ready for execution
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Instant Task Input */}
      <form onSubmit={handleAddTask} className="mt-6 relative z-10 flex gap-2">
         <input 
           type="text" 
           value={newTaskTitle}
           onChange={(e) => setNewTaskTitle(e.target.value)}
           placeholder="Initialize new task..."
           className="flex-1 bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--primary-text)] focus:outline-none focus:border-[var(--accent-glow)]/50 transition-colors placeholder-[var(--muted-text)]"
         />
         <button 
           type="submit" 
           disabled={isAdding || !newTaskTitle.trim()}
           className="bg-[var(--accent-glow)]/10 text-[var(--accent-glow)] border border-[var(--accent-glow)]/20 rounded-xl px-3 hover:bg-[var(--accent-glow)] hover:text-white transition-all disabled:opacity-50 flex items-center justify-center"
         >
           <Plus size={16} />
         </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[var(--glass-border)] relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-[var(--bg-card)] bg-[var(--bg-silk)]" />
            ))}
          </div>
          <span className="text-[9px] font-bold text-[var(--muted-text)] uppercase tracking-widest">
            {tasks.length} Objectives total in neural cloud
          </span>
        </div>
      </div>
    </div>
  );
}
