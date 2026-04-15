import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, MoreVertical, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function PlannerTaskCard({ task, onToggle, onDelete }) {
  const isCompleted = task.completed;
  
  const priorityColors = {
    high: 'text-rose-500 bg-rose-50 border-rose-100',
    medium: 'text-amber-500 bg-amber-50 border-amber-100',
    low: 'text-emerald-500 bg-emerald-50 border-emerald-100'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative p-5 rounded-[2rem] border transition-all duration-300 ${
        isCompleted 
          ? 'bg-slate-50/50 border-slate-100 opacity-70' 
          : 'bg-white border-slate-200/60 shadow-sm shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Custom Animated Checkbox */}
        <button
          onClick={() => onToggle(task._id, isCompleted)}
          className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative overflow-hidden ${
            isCompleted 
              ? 'bg-indigo-500 border-indigo-500' 
              : 'bg-white border-slate-200 hover:border-indigo-400'
          }`}
        >
          {isCompleted && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-white"
            >
              <Check size={18} strokeWidth={3} />
            </motion.div>
          )}
          {!isCompleted && (
            <div className="w-0 h-0 bg-indigo-50 group-hover:w-full group-hover:h-full absolute inset-0 transition-all duration-300 rounded-full" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${priorityColors[task.priority]}`}>
              {task.priority || 'Routine'}
            </span>
            {task.projectContext && (
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                • {task.projectContext}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between gap-4 mb-1">
            <h4 className={`text-sm font-bold tracking-tight transition-all duration-300 ${
              isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 group-hover:text-indigo-600'
            }`}>
              {task.title}
            </h4>
            
            {!isCompleted && task.link && (
              <a 
                href={task.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all"
              >
                Start Mission
              </a>
            )}
          </div>

          <div className="flex items-center gap-3 mt-3">
             {task.dueDate && !isCompleted && (
               <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 lowercase bg-indigo-50/50 px-2 py-0.5 rounded-md border border-indigo-100/50">
                 <Clock size={12} className="animate-pulse" />
                 {format(new Date(task.dueDate), 'h:mm a')}
               </div>
             )}
             {isCompleted && task.completedAt && (
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 lowercase">
                 <Check size={12} className="text-emerald-500" />
                 Secured at {format(new Date(task.completedAt), 'h:mm a')}
               </div>
             )}
             {!isCompleted && !task.dueDate && (
               <div className="text-[10px] font-bold text-slate-400">
                 No time set
               </div>
             )}
             <div className="h-1 w-1 rounded-full bg-slate-200" />
             <div className="text-[10px] font-bold text-slate-400">
               Focus Protocol
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
            <button 
              onClick={() => onDelete(task._id)}
              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
        </div>
      </div>

      {/* Subtle Progress Indicator */}
      {!isCompleted && (
        <div className="absolute bottom-0 left-10 right-10 h-[2px] bg-slate-50 overflow-hidden rounded-full">
           <motion.div 
             initial={{ x: '-100%' }}
             whileHover={{ x: '0%' }}
             transition={{ duration: 0.6 }}
             className="w-full h-full bg-indigo-500/10"
           />
        </div>
      )}
    </motion.div>
  );
}
