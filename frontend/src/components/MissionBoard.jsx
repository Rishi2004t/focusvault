import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Trash2, 
  Check, 
  Zap, 
  Layout, 
  Grid, 
  Target, 
  ShieldAlert,
  Map
} from 'lucide-react';
import { format } from 'date-fns';

// 1. Mission Card Component (Sortable)
const MissionCard = ({ task, isOverlay, onToggle, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const priorityColors = {
    high: 'border-red-500/50 text-red-500 bg-red-500/5',
    medium: 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5',
    low: 'border-green-500/50 text-green-500 bg-green-500/5',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group relative glass-card p-5 mb-4 border-white/5 hover:border-white/10 transition-all duration-300 ${
        isOverlay ? 'shadow-2xl shadow-theme-accent/20 ring-2 ring-theme-accent cursor-grabbing' : 'cursor-grab px-0'
      } ${task.completed ? 'opacity-40 grayscale-[0.5]' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle Area */}
        <div {...listeners} className="mt-1 opacity-0 group-hover:opacity-40 transition-opacity pl-2">
           <Layout size={14} className="text-theme-secondary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
             <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${priorityColors[task.priority] || priorityColors.medium}`}>
                {task.priorityMatrix || task.priority}
             </div>
             <div className="flex items-center gap-1 text-[8px] font-black text-theme-secondary uppercase tracking-widest">
                <Target size={10} className="text-theme-accent" /> {task.projectContext || 'General'}
             </div>
          </div>

          <h3 className={`font-black text-sm tracking-tight mb-3 break-words ${task.completed ? 'line-through text-theme-secondary' : 'text-theme-text'}`}>
             {task.title}
          </h3>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
             <div className="flex items-center gap-3">
                {task.dueDate && (
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-theme-secondary">
                    <Clock size={12} className="text-theme-accent" />
                    {format(new Date(task.dueDate), 'MMM dd')}
                  </div>
                )}
                <div className="flex items-center gap-1 text-[9px] font-bold text-neon-green">
                  <Zap size={10} fill="currentColor" /> +50 XP
                </div>
             </div>

             <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggle(task._id, task.completed); }}
                  className={`p-1.5 rounded-lg transition-all ${
                    task.completed 
                    ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' 
                    : 'bg-white/5 text-slate-600 hover:text-white border border-transparent'
                  }`}
                >
                  <Check size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
                  className="p-1.5 bg-white/5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 size={14} />
                </button>
             </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-neon-blue/5 blur-2xl group-hover:bg-neon-blue/10 transition-all" />
    </div>
  );
};

// 2. Main Board Component
const MissionBoard = ({ tasks, onToggle, onDelete }) => {
  const [activeId, setActiveId] = useState(null);
  const [viewMode, setViewMode] = useState('matrix'); // 'matrix' or 'kanban'

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
  };

  const activeTask = tasks.find(t => t._id === activeId);

  // Categorization Logic
  const getMatrixQuadrants = () => {
    return {
      'Urgent/Important': tasks.filter(t => t.priorityMatrix === 'Urgent/Important'),
      'Urgent/Not-Important': tasks.filter(t => t.priorityMatrix === 'Urgent/Not-Important'),
      'Not-Urgent/Important': tasks.filter(t => t.priorityMatrix === 'Not-Urgent/Important'),
      'Not-Urgent/Not-Important': tasks.filter(t => t.priorityMatrix === 'Not-Urgent/Not-Important' || !t.priorityMatrix),
    };
  };

  const getKanbanColumns = () => {
    return {
      '⚡ IN PROGRESS': tasks.filter(t => !t.completed && t.priority === 'high'),
      '🧠 PLANNED': tasks.filter(t => !t.completed && t.priority !== 'high'),
      '✅ ARCHIVED': tasks.filter(t => t.completed),
    };
  };

  const quadrants = getMatrixQuadrants();
  const columns = getKanbanColumns();

  return (
    <section className="space-y-8">
      {/* Board Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
              viewMode === 'matrix' ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'text-slate-500 hover:text-white'
            }`}
          >
            <Grid size={14} /> Strategic Matrix
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
              viewMode === 'kanban' ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'text-slate-500 hover:text-white'
            }`}
          >
            <Layout size={14} /> Tactical Board
          </button>
        </div>
        
        <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">
           Status: Ready for deployment
        </div>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          {viewMode === 'matrix' ? (
            <motion.div 
              key="matrix"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full"
            >
              {[
                { id: 'Urgent/Important', label: 'Critical Ops', icon: <ShieldAlert className="text-red-500" /> },
                { id: 'Not-Urgent/Important', label: 'Strategic Growth', icon: <Map className="text-neon-blue" /> },
                { id: 'Urgent/Not-Important', label: 'Rapid Response', icon: <Zap className="text-yellow-500" /> },
                { id: 'Not-Urgent/Not-Important', label: 'Neutral Zone', icon: <Grid className="text-slate-600" /> },
              ].map(quad => (
                <div key={quad.id} className="glass-card p-6 bg-white/[0.01] border-white/5 flex flex-col h-full min-h-[300px]">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                    {quad.icon}
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">{quad.label}</h3>
                    <span className="ml-auto text-[9px] font-black px-2 py-0.5 rounded-full bg-white/5 text-slate-500">
                      {quadrants[quad.id]?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <SortableContext items={quadrants[quad.id]?.map(t => t._id) || []} strategy={verticalListSortingStrategy}>
                      {quadrants[quad.id]?.map(task => (
                        <MissionCard 
                          key={task._id} 
                          task={task} 
                          onToggle={onToggle} 
                          onDelete={onDelete} 
                        />
                      ))}
                    </SortableContext>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="kanban"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {Object.entries(columns).map(([name, columnTasks]) => (
                <div key={name} className="flex flex-col h-full">
                   <div className="flex items-center gap-3 mb-6 px-2">
                      <div className="w-2 h-2 rounded-full bg-neon-blue shadow-[0_0_8px_rgba(10,132,255,1)]" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">{name}</h3>
                      <span className="text-[9px] font-black text-slate-700">{columnTasks.length}</span>
                   </div>
                   
                   <div className="flex-1 min-h-[500px] glass-card bg-white/[0.01] border-white/5 p-4">
                      <SortableContext items={columnTasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                        {columnTasks.map(task => (
                          <MissionCard 
                            key={task._id} 
                            task={task} 
                            onToggle={onToggle} 
                            onDelete={onDelete} 
                          />
                        ))}
                      </SortableContext>
                   </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <DragOverlay>
          {activeId && activeTask ? (
            <MissionCard task={activeTask} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
};

export default MissionBoard;
