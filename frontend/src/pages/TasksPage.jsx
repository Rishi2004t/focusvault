import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Calendar, 
  Flag, 
  Plus, 
  Filter,
  Check,
  CheckSquare,
  Clock,
  Zap,
  ArrowUpRight,
  PlusCircle,
  Layout,
  Grid,
  Map,
  ShieldAlert,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../utils/api';
import MainLayout from '../components/MainLayout';
import GlassCard from '../components/GlassCard';
import ConfirmModal from '../components/ConfirmModal';
import NeonButton from '../components/NeonButton';
import MissionBoard from '../components/MissionBoard';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { requestNotificationPermission, registerServiceWorker, subscribeToPush } from '../utils/notifications';

export default function TasksPage() {
  const { user, fetchUserProfile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('personal');
  const [priorityMatrix, setPriorityMatrix] = useState('Not-Urgent/Not-Important');
  const [projectContext, setProjectContext] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [filterCompleted, setFilterCompleted] = useState('');
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(Notification.permission === 'granted');

  useEffect(() => {
    fetchTasks();
  }, [filterPriority, filterCompleted]);

  const handleEnableNotifications = async () => {
    const hasPermission = await requestNotificationPermission();
    if (hasPermission) {
      const registration = await registerServiceWorker();
      if (registration) {
        const success = await subscribeToPush(registration);
        if (success) {
          setNotificationsEnabled(true);
          toast.success('Neural Alerts Synchronized! 📡');
        } else {
          toast.error('Neural Link failed. Check console.');
        }
      }
    } else {
      toast.warning('Neural Alerts rejected by browser.');
    }
  };

  // Floating XP Animation
  const triggerXPPop = (amount, isCompletion = true) => {
    const portal = document.getElementById('xp-portal');
    if (!portal) return;

    const pop = document.createElement('div');
    pop.className = `fixed font-black italic pointer-events-none animate-float-up z-[100] ${isCompletion ? 'text-neon-green text-2xl' : 'text-neon-blue text-lg'}`;
    pop.style.left = `${Math.random() * 40 + 30}%`;
    pop.style.top = `60%`;
    pop.innerText = `+${amount} XP`;
    
    portal.appendChild(pop);
    setTimeout(() => pop.remove(), 2000);
  };

  const fetchTasks = async () => {
    try {
      let url = '/tasks?sortBy=-dueDate';
      if (filterPriority) url += `&priority=${filterPriority}`;
      if (filterCompleted) url += `&completed=${filterCompleted === 'completed'}`;

      const response = await api.get(url);
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Mission Objective Required');
      return;
    }

    try {
      const response = await api.post('/tasks', {
        title,
        priority,
        priorityMatrix,
        projectContext: projectContext || 'General',
        dueDate: dueDate || null,
        category,
      });

      setTasks(prev => [response.data.task, ...prev]);
      setTitle('');
      setPriority('medium');
      setDueDate('');
      setPriorityMatrix('Not-Urgent/Not-Important');
      setProjectContext('');
      triggerXPPop(10, false);
      if (typeof fetchUserProfile === 'function') {
        fetchUserProfile(); // Sync Telemetry
      }
      toast.success('Mission Launched! +10 XP');
    } catch (error) {
      console.error('Launch sequence failure:', error);
      toast.error(error.parsedMessage || 'Launch Sequence Failure');
    }
  };

  const toggleTaskComplete = async (id, isCurrentlyCompleted) => {
    try {
      const response = await api.put(`/tasks/${id}`, { completed: !isCurrentlyCompleted });
      
      if (!isCurrentlyCompleted) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#0a84ff', '#bf5af2', '#30d158']
        });
        triggerXPPop(50, true);
        if (typeof fetchUserProfile === 'function') {
          fetchUserProfile(); // Sync Telemetry
        }
        toast.success('Mission Accomplished! +50 XP');
      }

      setTasks(prev => prev.map((t) => (t._id === id ? response.data.task : t)));
    } catch (error) {
      console.error('Communication link failure:', error);
      toast.error(error.parsedMessage || 'Communication Link Failure');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/tasks/${deleteId}`);
      setTasks(tasks.filter((t) => t._id !== deleteId));
      toast.success('Task successfully purged');
      setDeleteId(null);
    } catch (error) {
      toast.error(error.parsedMessage || 'Purge sequence failure');
    }
  };

  return (
    <MainLayout bgColor="bg-[#05070a]">
      <div className="max-w-6xl mx-auto pb-32 px-4">
        
        {/* HERO SECTION: MISSION CONTROL TELEMETRY */}
        <section className="mb-12 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Neural Sync: Active</span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter italic text-white leading-none">
                Mission <span className="text-neon-blue opacity-50">Control</span>
              </h1>
              <p className="mt-2 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Execute your priorities with precision</p>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="glass-card px-6 py-4 border-white/5 flex flex-col items-center">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Streak</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black italic text-orange-500">{user?.streak || 0}</span>
                  <Zap size={20} className="text-orange-500 fill-orange-500/20" />
                </div>
              </div>
              
              <div className="glass-card px-6 py-4 border-white/5 flex flex-col items-center">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">XP Earned</span>
                <span className="text-2xl font-black italic text-neon-blue">{user?.xp || 0}</span>
              </div>

              <div className="glass-card px-8 py-4 border-white/5 flex flex-col min-w-[240px]">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Productivity Level {user?.productivityLevel || 1}</span>
                  <span className="text-[10px] font-bold text-white italic">{((user?.xp || 0) % 500)} / 500 XP</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((user?.xp || 0) % 500) / 5}%` }}
                    className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full shadow-[0_0_10px_rgba(10,132,255,0.5)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/5">
            <div className="flex items-center gap-6">
              <button 
                onClick={handleEnableNotifications}
                className={`group flex items-center gap-2 transition-all ${
                  notificationsEnabled ? 'text-neon-green' : 'text-slate-500 hover:text-neon-blue'
                }`}
              >
                <div className={`p-2 rounded-lg border transition-all ${
                  notificationsEnabled 
                    ? 'bg-neon-green/10 border-neon-green/30' 
                    : 'bg-white/5 border-white/10 group-hover:border-neon-blue/50'
                }`}>
                  <Zap size={14} className={notificationsEnabled ? 'fill-current' : ''} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {notificationsEnabled ? 'Neural Alert: Operational' : 'Enable Sync'}
                </span>
              </button>

              <div className="h-4 w-[1px] bg-white/5" />

              <div className="flex items-center gap-3">
                <Filter size={14} className="text-slate-500" />
                <div className="flex gap-2">
                  {['', 'high', 'medium', 'low'].map(p => (
                    <button
                      key={p}
                      onClick={() => setFilterPriority(p)}
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                        filterPriority === p 
                          ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' 
                          : 'bg-white/5 text-slate-500 border border-transparent hover:border-white/10'
                      }`}
                    >
                      {p || 'All Missions'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mr-2">Status Port:</span>
               <select
                 value={filterCompleted}
                 onChange={(e) => setFilterCompleted(e.target.value)}
                 className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-slate-400 hover:text-neon-blue"
               >
                 <option value="">Active Link</option>
                 <option value="completed">Archive Only</option>
               </select>
            </div>
          </div>
        </section>

        {/* TASK INPUT PANEL: MISSION LAUNCHER */}
        <section className="mb-20">
          <GlassCard className="p-8 bg-gradient-to-br from-white/[0.03] to-neon-blue/[0.03] border-white/5 shadow-2xl relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-blue/10 blur-[100px] pointer-events-none group-hover:bg-neon-blue/20 transition-all duration-700" />
            
            <form onSubmit={handleAddTask} className="relative z-10 space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <PlusCircle size={18} className="text-neon-blue" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white italic">Initialize New Mission</h2>
              </div>

              <div className="relative group/input">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Designate Mission Objective..."
                  className="w-full bg-transparent border-b border-white/10 py-4 text-2xl font-black italic outline-none focus:border-neon-blue transition-all placeholder:text-slate-700 tracking-tight"
                />
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-500 group-focus-within/input:w-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <Zap size={10} className="text-yellow-500" /> Project Context
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={projectContext}
                      onChange={(e) => setProjectContext(e.target.value)}
                      placeholder="General"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-neon-blue/50 transition-all focus:bg-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <Flag size={10} className="text-red-500" /> Threat Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-neon-blue/50 transition-all cursor-pointer hover:bg-white/10 appearance-none"
                  >
                    <option value="low">LOW (Routine)</option>
                    <option value="medium">MEDIUM (Tactical)</option>
                    <option value="high">HIGH (Critical)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <Calendar size={10} className="text-neon-blue" /> Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-neon-blue/50 transition-all cursor-pointer [color-scheme:dark]"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest text-slate-500">
                    Quadrant
                  </label>
                  <select
                    value={priorityMatrix}
                    onChange={(e) => setPriorityMatrix(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[10px] font-bold outline-none focus:border-neon-blue/50 transition-all cursor-pointer appearance-none"
                  >
                    <option value="Urgent/Important">Urgent & Important</option>
                    <option value="Urgent/Not-Important">Urgent & Not Important</option>
                    <option value="Not-Urgent/Important">Not Urgent & Important</option>
                    <option value="Not-Urgent/Not-Important">Neutral Zone</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-neon-blue/20 transition-all"
                >
                  Launch Mission <ArrowUpRight size={16} />
                </motion.button>
              </div>
            </form>
          </GlassCard>
        </section>

        <section id="mission-board" className="mt-12 relative min-h-[500px]">
          <MissionBoard 
            tasks={tasks} 
            onToggle={toggleTaskComplete} 
            onDelete={setDeleteId} 
          />
          
          {/* XP POPUP LAYER */}
          <div id="xp-portal" className="fixed inset-0 pointer-events-none z-[100]" />
          
          {!loading && tasks.length === 0 && (
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="py-32 flex flex-col items-center justify-center text-center"
            >
               <div className="w-24 h-24 glass-card rounded-full flex items-center justify-center mb-8 bg-neon-blue/5 border-white/5 opacity-50 relative group">
                  <div className="absolute inset-0 bg-neon-blue/20 blur-2xl rounded-full group-hover:bg-neon-blue/40 transition-all duration-700" />
                  <Target size={32} className="text-neon-blue relative z-10" />
               </div>
               <h2 className="text-2xl font-black italic text-white mb-2">Awaiting Orders</h2>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10">No missions detected in the current sector</p>
               <button 
                 onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                 className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-[#8E8A7D] hover:text-white hover:border-white/20 transition-all"
               >
                 Initialize First Mission
               </button>
            </motion.div>
          )}
        </section>

        <ConfirmModal 
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Neural Purge Protocol"
          message="Are you sure you want to permanently erase this operational task from the vault?"
          confirmText="Confirm Purge"
        />
      </div>
    </MainLayout>
  );
}
