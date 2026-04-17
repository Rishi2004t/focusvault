import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CloudRain, 
  Coffee, 
  Wind, 
  X, 
  Zap, 
  Volume2, 
  VolumeX,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const SOUNDS = {
  rain: 'https://raw.githubusercontent.com/rafael-m-silva/rainy-mood/master/public/sounds/rain.mp3',
  cafe: 'https://github.com/rafael-m-silva/rainy-mood/raw/master/public/sounds/cafe.mp3',
  whiteNoise: 'https://github.com/rafael-m-silva/rainy-mood/raw/master/public/sounds/white-noise.mp3'
};

export default function FocusModePage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [notes, setNotes] = useState('');
  const [activeSounds, setActiveSounds] = useState([]);
  
  // Audio Refs
  const audioRefs = {
    rain: useRef(new Audio(SOUNDS.rain)),
    cafe: useRef(new Audio(SOUNDS.cafe)),
    whiteNoise: useRef(new Audio(SOUNDS.whiteNoise))
  };

  // Configure Audio
  useEffect(() => {
    Object.values(audioRefs).forEach(ref => {
      ref.current.loop = true;
      ref.current.volume = 0.5;
    });
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleSessionEnd();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleSessionEnd = () => {
    const sessionType = isBreak ? 'Break' : 'Focus';
    if (!isBreak) {
      setShowSummary(true);
      toast.success('Focus session synchronized successfully.', { icon: '🎯' });
    } else {
      toast('Break over. Ready to dive back in?', { icon: '🚀' });
      setTimeLeft(25 * 60);
      setIsBreak(false);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const toggleSound = (soundKey) => {
    const audio = audioRefs[soundKey].current;
    if (activeSounds.includes(soundKey)) {
      audio.pause();
      setActiveSounds(prev => prev.filter(s => s !== soundKey));
    } else {
      audio.play().catch(e => console.error('Audio playback blocked:', e));
      setActiveSounds(prev => [...prev, soundKey]);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExit = () => {
    // Stop all sounds
    Object.values(audioRefs).forEach(ref => ref.current.pause());
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-hidden relative border-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Exit Button */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleExit}
        className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all z-20"
      >
        <X size={20} />
      </motion.button>

      {/* Main Workspace */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        
        {/* Status Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20"
        >
          <div className={`w-2 h-2 rounded-full bg-emerald-500 ${isActive ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 italic">
            Focus Mode Active
          </span>
        </motion.div>

        {/* Timer Core */}
        <div className="text-center group mb-16">
          <motion.h1 
            key={timeLeft}
            initial={{ opacity: 0.8, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10rem] sm:text-[14rem] font-black tracking-tighter tabular-nums text-white leading-none italic drop-shadow-[0_0_50px_rgba(255,255,255,0.05)]"
          >
            {formatTime(timeLeft)}
          </motion.h1>
          
          <div className="flex items-center justify-center gap-6 mt-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTimer}
              className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
                isActive 
                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.1)]' 
                  : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
              }`}
            >
              {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, rotate: -180 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetTimer}
              className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <RotateCcw size={28} />
            </motion.button>
          </div>
        </div>

        {/* Ambient & Notes Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* Sounds Section */}
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Volume2 size={18} className="text-emerald-500" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Ambient Engine</h3>
            </div>
            <div className="flex gap-4">
              {[
                { key: 'rain', icon: <CloudRain />, label: 'Rain' },
                { key: 'cafe', icon: <Coffee />, label: 'Cafe' },
                { key: 'whiteNoise', icon: <Wind />, label: 'White Noise' }
              ].map(sound => (
                <button
                  key={sound.key}
                  onClick={() => toggleSound(sound.key)}
                  className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                    activeSounds.includes(sound.key)
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
                  }`}
                >
                  {sound.icon}
                  <span className="text-[9px] font-black uppercase tracking-widest">{sound.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Notes */}
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare size={18} className="text-blue-500" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Internal Monologue</h3>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down distracting thoughts here..."
              className="w-full h-24 bg-transparent border-none resize-none text-sm text-slate-300 placeholder:text-slate-600 focus:ring-0"
            />
            <div className="absolute bottom-4 right-8 opacity-0 group-hover:opacity-40 transition-opacity">
               <Sparkles size={14} className="text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Session Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg p-12 rounded-[3rem] bg-slate-900 border border-emerald-500/30 text-center shadow-[0_0_100px_rgba(16,185,129,0.1)] relative"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
                 <Zap size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-4xl font-black text-white italic tracking-tighter mb-4 uppercase">Cycle Complete</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
                Great job! You maintained neural coherence for <span className="text-emerald-500 font-black">25 MINUTES</span>. Your focus signal has been boosted.
              </p>
              <button 
                onClick={() => {
                  setShowSummary(false);
                  setTimeLeft(5 * 60);
                  setIsBreak(true);
                  setIsActive(true);
                }}
                className="w-full py-5 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-xl shadow-emerald-500/20"
              >
                Start Recovery Break
              </button>
              <button 
                onClick={() => setShowSummary(false)}
                className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
              >
                Close Summary
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white italic">Focus Vault Calibration Environment</p>
      </footer>
    </div>
  );
}
