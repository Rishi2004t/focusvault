import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, CheckCircle2, X, Activity, ShieldCheck, Zap, ArrowRight, Brain } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import SilkBackground from '../components/SilkBackground';

export default function FocusMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTask = useCallback(async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      toast.error('Mission data corrupted');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      new Audio('/neural-alert.mp3').play().catch(() => {});
      toast.success('Focus Cycle Complete. Synchronizing neural nodes.');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completeTask = async () => {
    try {
      await api.put(`/tasks/${id}`, { completed: true });
      toast.success('Objective Secured. +XP Synchronized.');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Uplink failed. Retrying...');
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <SilkBackground />
      </div>

      {/* Minimal Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-12 left-12 flex items-center gap-4 z-10"
      >
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">Deep Focus Protocol</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Isolated execution environment</p>
        </div>
      </motion.div>

      <button 
        onClick={() => navigate('/dashboard')}
        className="absolute top-12 right-12 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all z-10"
      >
        <X size={20} />
      </button>

      {/* Main Content */}
      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center text-center">
        
        {/* Timer UI */}
        <div className="relative mb-16">
            <svg className="w-[320px] h-[320px] transform -rotate-90">
                <circle 
                    cx="160" cy="160" r="140" 
                    className="stroke-slate-900 fill-none" 
                    strokeWidth="8"
                />
                <motion.circle 
                    cx="160" cy="160" r="140" 
                    className="stroke-indigo-500 fill-none" 
                    strokeWidth="8"
                    strokeDasharray={880}
                    animate={{ strokeDashoffset: 880 - (880 * (timeLeft / (25 * 60))) }}
                    transition={{ duration: 1, ease: "linear" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                    key={timeLeft}
                    initial={{ scale: 0.9, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-8xl font-black text-white italic tracking-tighter"
                >
                    {formatTime(timeLeft)}
                </motion.span>
                <div className="flex gap-4 mt-8">
                    <button 
                        onClick={() => setIsActive(!isActive)}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                            isActive ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        }`}
                    >
                        {isActive ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </button>
                    <button 
                        onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }}
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>
        </div>

        {/* Task Details */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">
                <Zap size={12} /> Active Objective
            </div>
            <h2 className="text-5xl font-black text-white tracking-tight italic max-w-2xl leading-tight">
                {task?.title || 'No mission selected'}
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
                Maintain neural coherence. External stimuli have been suppressed.
            </p>
        </motion.div>

        {/* Actions */}
        <div className="mt-20 flex flex-col items-center gap-6 w-full max-w-xs">
            <button 
                onClick={completeTask}
                className="w-full flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-950 rounded-3xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl shadow-white/5 group"
            >
                Secure Objective <CheckCircle2 size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">+50 XP Protocol Synchronized</p>
        </div>
      </div>

      {/* Bottom Telemetry */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end z-10">
        <div className="flex items-center gap-3">
            <Brain size={20} className="text-indigo-500" />
            <div className="space-y-1">
                <p className="text-[9px] font-black text-white uppercase tracking-widest">Neural Load: Minimal</p>
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '15%' }}
                        className="h-full bg-indigo-500"
                    />
                </div>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Priority Path</p>
            <div className="flex gap-1">
                {[1,2,3,4,5].map(v => (
                    <div key={v} className={`w-1 h-3 rounded-full ${v <= 4 ? 'bg-indigo-500' : 'bg-white/10'}`} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
