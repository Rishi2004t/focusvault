import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RotateCcw, Trophy, Zap, Clock, MousePointer2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function FocusFlowGame({ isOpen, onClose }) {
  const { fetchUserProfile } = useAuth();
  const [gameState, setGameState] = useState('IDLE'); // IDLE, PLAYING, FINISHED
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 second rounds
  const [targets, setTargets] = useState([]);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('focus_flow_highscore') || '0'));
  
  const gameRef = useRef(null);
  const nextTargetId = useRef(0);

  // ── Game Logic ──
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setGameState('PLAYING');
  };

  const spawnTarget = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    const id = nextTargetId.current++;
    const x = Math.random() * 80 + 10; // 10% to 90%
    const y = Math.random() * 80 + 10;
    const size = Math.random() * 40 + 40; // 40px to 80px
    const type = Math.random() > 0.8 ? 'BONUS' : 'REGULAR';

    setTargets(prev => [...prev, { id, x, y, size, type }]);

    // Auto-remove target after 2 seconds if not clicked
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== id));
    }, 2000);
  }, [gameState]);

  // Main Game Loop
  useEffect(() => {
    let timer;
    let spawnInterval;

    if (gameState === 'PLAYING') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('FINISHED');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      spawnInterval = setInterval(spawnTarget, 800);
    }

    return () => {
      clearInterval(timer);
      clearInterval(spawnInterval);
    };
  }, [gameState, spawnTarget]);

  // Handle Game Finish
  useEffect(() => {
    if (gameState === 'FINISHED') {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('focus_flow_highscore', score.toString());
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#10b981', '#ffffff']
        });
      }

      // Award XP Reward (+5 XP)
      const awardXP = async () => {
        try {
          await api.post('/analytics/activity', {
            type: 'BREAK_SYNC',
            message: `Neural Refresh Complete. Score: ${score}`,
            category: 'neural',
            metadata: { score }
          });
          if (fetchUserProfile) fetchUserProfile();
        } catch (err) {
          console.error('XP Sync failed', err);
        }
      };
      awardXP();
    }
  }, [gameState, score, highScore, fetchUserProfile]);

  const handleTargetClick = (target) => {
    setScore(prev => prev + (target.type === 'BONUS' ? 50 : 10));
    setTargets(prev => prev.filter(t => t.id !== target.id));
    
    // Tiny haptic-like vibration or visual pop is handled by framer-motion
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl"
      />

      {/* Game Stage */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl aspect-video bg-white/5 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header UI */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Score</p>
              <p className="text-3xl font-black text-white tabular-nums">{score}</p>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Time Remaining</p>
              <div className="flex items-center gap-2 text-3xl font-black text-indigo-400 tabular-nums">
                <Clock size={24} />
                {timeLeft}s
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vault High Score</p>
              <p className="text-sm font-bold text-white">{highScore}</p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all border border-white/5"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Playing Field */}
        <div 
          ref={gameRef}
          className="relative flex-1 cursor-crosshair overflow-hidden"
        >
          <AnimatePresence>
            {gameState === 'IDLE' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-24 h-24 rounded-[2rem] bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-8 animate-bounce">
                  <Play size={40} fill="currentColor" />
                </div>
                <h2 className="text-5xl font-black text-white tracking-tighter mb-4">Focus Flow</h2>
                <p className="text-slate-400 text-lg max-w-md mb-12 font-medium">
                  Brief neural reset: Pop the distraction nodes as they appear. Quick reflexes grant more XP.
                </p>
                <button 
                  onClick={startGame}
                  className="px-12 py-5 rounded-3xl bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-4 group"
                >
                  Initiate Reset <Zap size={18} className="group-hover:scale-125 transition-transform" />
                </button>
              </motion.div>
            )}

            {gameState === 'PLAYING' && targets.map(target => (
              <motion.button
                key={target.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                onClick={() => handleTargetClick(target)}
                className={`absolute rounded-full border flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-90 ${
                  target.type === 'BONUS' 
                    ? 'bg-amber-400/20 border-amber-400 text-amber-400 shadow-amber-400/20' 
                    : 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-indigo-500/20'
                }`}
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  width: `${target.size}px`,
                  height: `${target.size}px`
                }}
              >
                {target.type === 'BONUS' ? <Trophy size={target.size / 2} /> : <Zap size={target.size / 2} />}
              </motion.button>
            ))}

            {gameState === 'FINISHED' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-indigo-950/40 backdrop-blur-md"
              >
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-8">
                  <Trophy size={48} />
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Refining Complete</h2>
                <p className="text-emerald-400 font-black uppercase tracking-widest text-xs mb-8">+5 XP Synchronized</p>
                
                <div className="flex gap-12 mb-12">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Session Score</p>
                     <p className="text-5xl font-black text-white tabular-nums">{score}</p>
                   </div>
                   <div className="h-16 w-[1px] bg-white/10" />
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Neural High Score</p>
                     <p className="text-5xl font-black text-white tabular-nums">{highScore}</p>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={startGame}
                    className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] border border-white/10 flex items-center gap-3 transition-all"
                  >
                    <RotateCcw size={16} /> Another Round
                  </button>
                  <button 
                    onClick={onClose}
                    className="px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all"
                  >
                    Back to Focus <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Advice */}
        <div className="p-6 bg-white/5 border-t border-white/5 flex items-center justify-center gap-3">
           <MousePointer2 size={14} className="text-indigo-400" />
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Objective: Rapid Target Acquisition</p>
        </div>
      </motion.div>
    </div>
  );
}

function ArrowRight({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
