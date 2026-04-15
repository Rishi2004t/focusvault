import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { X, Palette } from 'lucide-react';

const themes = [
  { id: 'perpetuity', name: 'Perpetuity', colors: ['#14b8a6', '#10b981', '#f0fdfa'] },
  { id: 'cyberpunk', name: 'Cyberpunk', colors: ['#ff00ff', '#00ffff', '#fdf2f8'] },
  { id: 'midnight-indigo', name: 'Midnight Indigo', colors: ['#6366f1', '#818cf8', '#f5f3ff'] },
  { id: 'lime-fusion', name: 'Lime Fusion', colors: ['#a3e635', '#fde047', '#f7fee7'] },
  { id: 'sky-blue', name: 'Sky Blue', colors: ['#38bdf8', '#0ea5e9', '#f0f9ff'] },
  { id: 'cherry-blossom', name: 'Cherry Blossom', colors: ['#fb7185', '#f472b6', '#fff1f2'] },
  { id: 'sunset-amber', name: 'Sunset Amber', colors: ['#f59e0b', '#fbbf24', '#fffbeb'] },
  { id: 'forest-phantom', name: 'Forest Phantom', colors: ['#4ade80', '#10b981', '#f0fdf4'] },
  { id: 'royal-velvet', name: 'Royal Velvet', colors: ['#a855f7', '#d946ef', '#faf5ff'] },
  { id: 'crimson-void', name: 'Crimson Void', colors: ['#ef4444', '#f87171', '#fef2f2'] },
  { id: 'electric-violet', name: 'Electric Violet', colors: ['#8b5cf6', '#d8b4fe', '#f5f3ff'] },
  { id: 'monochrome-pro', name: 'Monochrome Pro', colors: ['#334155', '#94a3b8', '#f8fafc'] }
];

const ThemePicker = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[100]"
          />

          {/* Bottom Sheet UI */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[101] p-4 flex justify-center items-end"
          >
            <div className="w-full max-w-lg bg-[var(--bg-card)]/90 backdrop-blur-2xl border border-[var(--glass-border)] rounded-[40px] shadow-[0_-20px_80px_rgba(0,0,0,0.1)] overflow-hidden">
              {/* Drag Handle Top Bar */}
              <div className="flex justify-center py-4">
                <div className="w-12 h-1.5 bg-[var(--glass-border)] rounded-full" />
              </div>

              <div className="px-8 pb-10">
                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-[var(--primary-text)] flex items-center gap-3">
                      <Palette className="text-[var(--accent-glow)]" size={24} />
                      Choose Look
                    </h2>
                    <p className="text-[var(--muted-text)] text-xs font-bold uppercase tracking-widest mt-1">
                      Neural Interface Settings
                    </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-[var(--bg-silk)] flex items-center justify-center text-[var(--muted-text)] hover:bg-[var(--accent-glow)]/10 hover:text-[var(--accent-glow)] transition-all"
                  >
                    <X size={20} />
                  </button>
                </header>

                {/* Theme Grid */}
                <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                  {themes.map((t) => (
                    <motion.button
                      key={t.id}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setTheme(t.id)}
                      className={`
                        w-full flex items-center justify-between gap-4 px-6 py-5 rounded-3xl transition-all duration-300 group
                        ${theme === t.id 
                          ? 'bg-[var(--nav-active)] border border-[var(--accent-glow)]/20 shadow-sm' 
                          : 'bg-[var(--bg-card)] border border-[var(--glass-border)] hover:border-[var(--muted-text)]/30 hover:bg-[var(--bg-silk)]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        {/* 3 Color Dots Grid */}
                        <div className="flex -space-x-1.5">
                          {t.colors.map((c, i) => (
                            <div 
                              key={i} 
                              className="w-4 h-4 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: c, zIndex: 3 - i }}
                            />
                          ))}
                        </div>
                        <span className={`font-bold text-[13px] tracking-tight ${theme === t.id ? 'text-[var(--nav-active-text)]' : 'text-[var(--secondary-text)] group-hover:text-[var(--primary-text)]'}`}>
                          {t.name}
                        </span>
                      </div>

                      {theme === t.id && (
                        <div className="w-2 h-2 rounded-full bg-[var(--accent-glow)] shadow-[0_0_10px_rgba(var(--accent-glow),0.5)]" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ThemePicker;
