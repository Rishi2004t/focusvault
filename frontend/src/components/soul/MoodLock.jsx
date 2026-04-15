import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, ShieldAlert, Heart, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const COLORS = [
  { hex: '#3B82F6', label: 'Ocean Blue' },
  { hex: '#10B981', label: 'Emerald Green' },
  { hex: '#8B5CF6', label: 'Mystic Purple' },
  { hex: '#F43F5E', label: 'Rose Red' },
  { hex: '#F59E0B', label: 'Amber Gold' },
  { hex: '#14B8A6', label: 'Teal' },
];

const EMOJIS = ['😊', '😔', '😡', '😌', '😎', '🤔', '😴', '✨'];

export default function MoodLock({ isSetup, onUnlock }) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lockoutMsg, setLockoutMsg] = useState('');

  const handleVerify = async () => {
    if (!selectedColor || !selectedEmoji) {
      toast.error('Select both a color and a mood to proceed.');
      return;
    }

    setLoading(true);
    try {
      if (isSetup) {
         await api.post('/soul/setup', { color: selectedColor, emoji: selectedEmoji });
         toast.success('MoodLock established');
         onUnlock(); // Treat setup as unlocked instantly
      } else {
         await api.post('/soul/verify', { color: selectedColor, emoji: selectedEmoji });
         toast.success('Soul Vault Unlocked');
         onUnlock();
      }
    } catch (error) {
       console.error('MoodLock error:', error);
       setIsShaking(true);
       setTimeout(() => setIsShaking(false), 500);
       
       if (error.response?.data?.message) {
         if (error.response.status === 403) {
           setLockoutMsg(error.response.data.message);
         } else {
           toast.error(error.response.data.message);
         }
       } else {
         toast.error('Authentication failed');
       }
       
       // Reset selections on failure
       setSelectedColor(null);
       setSelectedEmoji(null);
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div 
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`bg-white dark:bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[3rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden transition-all duration-300 ${isShaking ? 'border-red-500/50 shadow-red-500/20' : 'shadow-[var(--accent-glow)]/10'}`}
      >
        {/* Subtle Glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-slate-500/5 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col items-center text-center relative z-10 mb-8">
           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border transition-colors duration-500 ${isSetup ? 'bg-indigo-50 border-indigo-100 text-indigo-500 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400' : 'bg-slate-50 border-slate-100 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}`}>
              {isSetup ? <ShieldAlert size={32} /> : <Lock size={32} />}
           </div>
           <h2 className="text-2xl font-black text-[var(--primary-text)] tracking-tight">
             {isSetup ? 'Set Your MoodLock' : 'Unlock Soul Vault'}
           </h2>
           <p className="text-[12px] font-bold text-[var(--muted-text)] mt-2 italic max-w-xs">
             {isSetup ? 'Choose a secret color and mood combination to secure your private journal.' : 'Enter your secret color and mood combination.'}
           </p>
        </div>

        {lockoutMsg ? (
          <div className="p-6 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl text-center">
             <ShieldAlert className="mx-auto text-red-500 mb-2" size={24} />
             <p className="text-xs font-bold text-red-600 dark:text-red-400">{lockoutMsg}</p>
          </div>
        ) : (
          <div className="space-y-8 relative z-10">
            {/* Color Selection */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] mb-3 text-center">1. Select Color</p>
              <div className="grid grid-cols-3 gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.hex)}
                    className={`h-12 rounded-xl border-2 transition-all duration-300 ${selectedColor === color.hex ? 'scale-105 shadow-md shadow-black/10' : 'border-transparent hover:scale-105'} flex items-center justify-center`}
                    style={{ 
                      backgroundColor: color.hex, 
                      borderColor: selectedColor === color.hex ? 'var(--primary-text)' : 'transparent' 
                    }}
                    title={color.label}
                  >
                    {selectedColor === color.hex && <CheckCircle2 size={16} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Emoji Selection */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] mb-3 text-center">2. Select Mood</p>
              <div className="grid grid-cols-4 gap-3">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`h-14 rounded-xl text-2xl flex items-center justify-center transition-all duration-300 border ${selectedEmoji === emoji ? 'bg-[var(--bg-silk)] border-[var(--primary-text)] scale-110 shadow-md' : 'bg-[var(--bg-silk)]/50 border-[var(--glass-border)] hover:bg-[var(--bg-silk)] hover:scale-105'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || !selectedColor || !selectedEmoji}
              className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-500 ${selectedColor && selectedEmoji ? 'bg-[var(--primary-text)] text-white shadow-lg' : 'bg-[var(--bg-silk)] text-[var(--muted-text)] border border-[var(--glass-border)] opacity-50 cursor-not-allowed'}`}
              style={selectedColor && selectedEmoji ? { boxShadow: `0 10px 30px -10px ${selectedColor}80` } : {}}
            >
              {loading ? 'Processing...' : isSetup ? 'Seal Vault' : 'Unlock Vault'}
              {!loading && (isSetup ? <Heart size={16} /> : <Unlock size={16} />)}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
