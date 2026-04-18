import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Plus, 
  Calendar, 
  Clock, 
  History, 
  Zap, 
  Trophy, 
  ArrowRight,
  ChevronRight,
  PlusCircle,
  Hash
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { format, isToday, isTomorrow, isPast, addDays, isSameDay, startOfToday } from 'date-fns';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import MainLayout from '../components/MainLayout';
import PlannerTaskCard from '../components/planner/PlannerTaskCard';
import AnimatedCounter from '../components/shared/AnimatedCounter';

export default function DailyPlanner() {
  const { isAuthenticated, user, fetchUserProfile } = useAuth();
  const { registerNeuralSync } = useNotifications(isAuthenticated);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('planner'); // planner, history
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [taskTime, setTaskTime] = useState(format(new Date(), 'HH:mm'));
  const [link, setLink] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(Notification.permission === 'granted');
  
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEnableSync = async () => {
    try {
      const success = await registerNeuralSync();
      if (success) {
        setNotificationsEnabled(true);
        toast.success('Neural Link Synchronized');
      } else {
        toast.error('Sync Protocol Failure');
      }
    } catch (err) {
      toast.error('Sync Protocol Failure');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks?sortBy=dueDate');
      setTasks(response.data);
    } catch (error) {
      toast.error('Uplink Interrupted');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      // Combine selected date and time
      const date = new Date(selectedDate);
      
      const [hours, minutes] = taskTime.split(':');
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const response = await api.post('/tasks', {
        title,
        priority,
        dueDate: date,
        link: link.trim() || null,
        category: 'work'
      });

      setTasks([response.data.task, ...tasks]);
      setTitle('');
      setLink('');
      triggerXPPop(10);
      toast.success('Mission Launched');
    } catch (error) {
      toast.error('Mission Failed to Launch');
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      const response = await api.put(`/tasks/${id}`, { completed: !currentStatus });
      setTasks(tasks.map(t => t._id === id ? response.data.task : t));
      
      if (!currentStatus) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#A855F7', '#EC4899']
        });
        triggerXPPop(50);
        if (fetchUserProfile) fetchUserProfile();
      }
    } catch (error) {
      toast.error('Sync Error');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task Purged');
    } catch (error) {
      toast.error('Purge Failed');
    }
  };

  const triggerXPPop = (amount) => {
    const portal = document.getElementById('xp-portal');
    if (!portal) return;
    const pop = document.createElement('div');
    pop.className = 'fixed font-black italic pointer-events-none animate-float-up z-[100] text-indigo-600 text-2xl';
    pop.style.left = `${Math.random() * 40 + 30}%`;
    pop.style.top = `60%`;
    pop.innerText = `+${amount} XP`;
    portal.appendChild(pop);
    setTimeout(() => pop.remove(), 2000);
  };

  // Filtering Logic
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'history') return task.completed || (task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)));
    
    if (!task.dueDate) return isToday(selectedDate) && !task.completed;
    const date = new Date(task.dueDate);
    
    // Show tasks for the selected date that aren't completed
    return isSameDay(date, selectedDate) && !task.completed;
  });

  const overdueTasks = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date());

  const completedToday = tasks.filter(t => isToday(new Date(t.dueDate || t.updatedAt)) && t.completed).length;
  const totalToday = tasks.filter(t => isToday(new Date(t.dueDate || t.createdAt))).length;
  const progressPercent = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const greeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Rise and Shine';
    if (hr < 18) return 'Optimal Performance';
    return 'Evening Sync';
  };

  return (
    <MainLayout bgColor="bg-[#F8FAFC]">
      <div className="planner-light min-h-[calc(100vh-5rem)] pb-20">
        <div id="xp-portal" className="fixed inset-0 pointer-events-none z-[100]" />
        
        <div className="max-w-5xl mx-auto px-6 pt-12">
          
          {/* ── HERO SECTION ── */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6"
              >
                <Sparkles size={14} className="animate-pulse" />
                Planetary Calibration Active
              </motion.div>
              
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                {greeting()}, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {user?.name || user?.username || 'Observer'}
                </span>
              </h1>
              
              <div className="flex items-center gap-6 mt-6">
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] italic">
                  {format(new Date(), 'EEEE, MMMM do')}
                </p>
                <div className="h-4 w-[1px] bg-slate-200" />
                <button 
                  onClick={handleEnableSync}
                  className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                    notificationsEnabled ? 'text-emerald-500' : 'text-indigo-600 hover:text-indigo-700'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${notificationsEnabled ? 'bg-emerald-500' : 'bg-indigo-600 animate-pulse'}`} />
                  {notificationsEnabled ? 'Neural Sync: Active' : 'Enable Neural Sync'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-10">
               {/* Daily Progress Ring */}
               <div className="relative w-32 h-32 group">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100" />
                    <motion.circle 
                      cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" 
                      strokeDasharray={364.4}
                      initial={{ strokeDashoffset: 364.4 }}
                      animate={{ strokeDashoffset: 364.4 - (364.4 * progressPercent) / 100 }}
                      className="text-indigo-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900 leading-none">
                      {Math.round(progressPercent)}%
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase mt-1">Status</span>
                  </div>
                  {/* Floating Elements on completion */}
                  {progressPercent === 100 && (
                     <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                        <Trophy size={14} />
                     </div>
                  )}
               </div>

               <div className="h-16 w-[1px] bg-slate-200 hidden md:block" />

               <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
                        <Zap size={20} fill="currentColor" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streak</p>
                        <p className="text-xl font-black text-slate-900 tabular-nums">
                           <AnimatedCounter value={user?.streak || 0} /> Days
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
                        <Trophy size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</p>
                        <p className="text-xl font-black text-slate-900 tabular-nums">
                           <AnimatedCounter value={user?.xp || 0} /> XP
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* ── INTERACTIVE TABS ── */}
          <div className="flex items-center justify-between mb-10 border-b border-slate-200/60 pb-4">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 border-b border-slate-200/60 pb-6">
             <div className="flex items-center gap-6">
                {['planner', 'history'].map(tab => (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`relative text-[11px] font-black uppercase tracking-[0.2em] py-2 transition-all ${
                       activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                     }`}
                   >
                     {tab}
                     {activeTab === tab && (
                        <motion.div 
                          layoutId="tab-underline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                        />
                     )}
                   </button>
                ))}
             </div>

             {activeTab === 'planner' && (
                <div className="flex-1 max-w-2xl">
                   <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
                      {[...Array(14)].map((_, i) => {
                         const date = addDays(startOfToday(), i);
                         const isSelected = isSameDay(date, selectedDate);
                         return (
                            <motion.button
                              key={i}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedDate(date)}
                              className={`flex flex-col items-center min-w-[50px] py-3 rounded-2xl border transition-all ${
                                 isSelected 
                                    ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200 text-white' 
                                    : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-400'
                              }`}
                            >
                               <span className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-70">
                                  {format(date, 'EEE')}
                               </span>
                               <span className="text-sm font-black italic">
                                  {format(date, 'd')}
                               </span>
                            </motion.button>
                         );
                      })}
                      
                      {/* Custom Date Picker Trigger */}
                      <div className="relative group">
                        <input 
                          type="date"
                          onChange={(e) => setSelectedDate(new Date(e.target.value))}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center min-w-[50px] py-3 rounded-2xl border border-dashed border-slate-200 text-slate-300 group-hover:border-indigo-300 group-hover:text-indigo-400 transition-all">
                           <Calendar size={14} className="mb-1" />
                           <span className="text-[7px] font-black uppercase">More</span>
                        </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        </div>

          {/* ── QUICK ADD SECTION ── */}
          <section className="mb-12">
             <div className="bg-white/40 backdrop-blur-sm border border-slate-200/60 rounded-[2.5rem] p-4 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all focus-within:border-indigo-300 group">
                <form onSubmit={handleAddTask} className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-inner">
                      <Plus size={24} strokeWidth={3} />
                   </div>
                   <input 
                     type="text"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     placeholder={`Ready for ${format(selectedDate, 'EEEE')}? Launch a mission...`}
                     className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-900 placeholder:text-slate-200 placeholder:font-normal"
                   />
                   <div className="flex items-center gap-3">
                       <div className="bg-slate-50/50 border border-slate-100 rounded-xl px-3 py-2 flex items-center gap-2">
                          <Clock size={12} className="text-indigo-400" />
                          <input 
                            type="time"
                            value={taskTime}
                            onChange={(e) => setTaskTime(e.target.value)}
                            className="bg-transparent text-[11px] font-black text-slate-600 outline-none"
                          />
                       </div>
                       <div className="bg-slate-50/50 border border-slate-100 rounded-xl px-3 py-2 flex items-center gap-2 w-48">
                          <Hash size={12} className="text-purple-400" />
                          <input 
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="Action Link (URL)"
                            className="bg-transparent text-[11px] font-bold text-slate-600 outline-none w-full placeholder:font-normal"
                          />
                       </div>
                       <select 
                         value={priority} 
                         onChange={(e) => setPriority(e.target.value)}
                         className="bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer outline-none hover:bg-slate-100 transition-colors"
                       >
                          <option value="low">P3: Minor</option>
                          <option value="medium">P2: Tactical</option>
                          <option value="high">P1: Critical</option>
                       </select>
                       <button 
                         type="submit"
                         disabled={!title.trim()}
                         className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-30 disabled:hover:shadow-none"
                       >
                         Launch Task <ArrowRight size={14} />
                       </button>
                   </div>
                </form>
             </div>
          </section>

          {/* ── MISSIONS BOARD ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 content-start">
             <div>
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Current Loadout ({filteredTasks.filter(t => !t.completed).length})</h3>
                   </div>
                   {overdueTasks.length > 0 && (
                     <div className="px-3 py-1 rounded-full bg-rose-50 text-rose-500 text-[9px] font-black uppercase tracking-widest border border-rose-100 flex items-center gap-2">
                        <Clock size={12} className="animate-bounce" />
                        {overdueTasks.length} Overdue Mission{overdueTasks.length > 1 ? 's' : ''}
                     </div>
                   )}
                </div>
                
                <div className="space-y-4">
                   <AnimatePresence mode="popLayout">
                    {filteredTasks.filter(t => !t.completed).map(task => (
                      <PlannerTaskCard 
                        key={task._id} 
                        task={task} 
                        onToggle={toggleTask} 
                        onDelete={deleteTask} 
                      />
                    ))}
                   </AnimatePresence>

                   {!loading && filteredTasks.filter(t => !t.completed).length === 0 && (
                      <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                         <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mb-6">
                            <Plus size={24} className="text-slate-300" />
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">All objectives secured.</p>
                      </div>
                   )}
                </div>
             </div>

             <div>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-2 h-2 rounded-full bg-slate-300" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Recently Secured</h3>
                </div>

                <div className="space-y-4">
                   <AnimatePresence mode="popLayout">
                    {filteredTasks
                      .filter(t => t.completed)
                      .sort((a,b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0))
                      .slice(0, 10)
                      .map(task => (
                        <PlannerTaskCard 
                          key={task._id} 
                          task={task} 
                          onToggle={toggleTask} 
                          onDelete={deleteTask} 
                        />
                      ))}
                   </AnimatePresence>
                   
                   {!loading && filteredTasks.filter(t => t.completed).length === 0 && (
                      <div className="py-20 border-2 border-dashed border-slate-50 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                         <Hash size={24} className="text-slate-100 mb-4" />
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-200">History Nullified.</p>
                      </div>
                   )}
                </div>
             </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
