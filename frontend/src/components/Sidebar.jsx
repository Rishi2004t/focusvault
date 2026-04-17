import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  LogOut, 
  CheckSquare, 
  FileText,
  File,
  Users,
  Activity,
  ShieldCheck,
  Terminal,
  Code2,
  Settings as SettingsIcon,
  Coffee,
  Brain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FocusFlowGame from './games/FocusFlowGame';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const [isGameOpen, setIsGameOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Brain size={20} />, label: 'Neural Web', path: '/neural-web' },
    { icon: <FileText size={20} />, label: 'Neural Notes', path: '/notes' },
    { icon: <ShieldCheck size={20} />, label: 'Soul Vault', path: '/soul' },
    { icon: <CheckSquare size={20} />, label: 'Daily Planner', path: '/tasks' },
    { icon: <File size={20} />, label: 'Asset Vault', path: '/files' },
    { icon: <Users size={20} />, label: 'Collab Hub', path: '/projects' },
    { icon: <Code2 size={20} />, label: 'Neural IDE', path: '/ide' },
    { icon: <Activity size={20} />, label: 'Analytics Suite', path: '/analytics' },
    { icon: <SettingsIcon size={20} />, label: 'System Console', path: '/settings' },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`
        w-72 h-screen fixed left-0 top-0 z-[60] flex flex-col p-6 bg-[var(--bg-silk)] border-r border-[var(--glass-border)] 
        shadow-[4px_0_24px_rgba(0,0,0,0.01)] overflow-hidden transition-transform duration-500
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* ── Brand Header ── */}
        <div className="flex items-center gap-4 mb-16 px-2">
          <div className="w-12 h-12 rounded-2xl bg-[var(--brand-gradient)] flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--primary-text)] tracking-tight leading-none">FocusVault</h1>
            <span className="text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-widest mt-1.5 block">Sync-Operational</span>
          </div>
        </div>

        {/* ── Navigation Shell ── */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group relative
                ${isActive 
                  ? 'bg-[var(--bg-card)] text-[var(--nav-active-text)] shadow-sm border border-[var(--glass-border)]' 
                  : 'text-[var(--secondary-text)] hover:bg-[var(--bg-card)]/50 hover:text-[var(--primary-text)]'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-[var(--accent-glow)]' : 'text-[var(--muted-text)] group-hover:text-[var(--accent-glow)]'}`}>
                    {item.icon}
                  </span>
                  <span className="font-bold text-[13px] tracking-tight">{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeSideIndicator"
                      className="absolute right-0 w-1 h-5 bg-[var(--accent-glow)] rounded-l-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Security / Profile ── */}
        <div className="mt-auto pt-8 border-t border-[var(--glass-border)] space-y-4">
          <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--glass-border)] shadow-sm hidden sm:block">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-glow)]/10 flex items-center justify-center text-[var(--accent-glow)]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-widest leading-none">Security</p>
                  <p className="text-xs font-bold text-[var(--primary-text)] mt-1">Status: Operational</p>
                </div>
             </div>
             
             <div className="space-y-2 mt-4">
                <div className="flex justify-between text-[9px] font-bold text-[var(--muted-text)] uppercase tracking-widest">
                  <span>XP Progress</span>
                  <span className="text-[var(--primary-text)]">{user?.xp || 0} / {(user?.productivityLevel || 1) * 500}</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--bg-silk)] rounded-full overflow-hidden">
                  <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${((user?.xp || 0) % 500) / 5}%` }}
                     className="h-full bg-[var(--brand-gradient)] rounded-full"
                  />
                </div>
             </div>
          </div>

          <button
            onClick={() => setIsGameOpen(true)}
            className="w-full flex items-center gap-4 px-6 py-3.5 rounded-xl text-[var(--secondary-text)] hover:bg-orange-50 hover:text-orange-500 transition-all duration-300 border border-transparent group"
          >
            <Coffee size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[13px] tracking-tight">Break</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-6 py-3.5 rounded-xl text-[var(--secondary-text)] hover:bg-red-50 hover:text-red-500 transition-all duration-300 border border-transparent group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-[13px] tracking-tight">Logout Shell</span>
          </button>
        </div>

        <AnimatePresence>
          {isGameOpen && (
            <FocusFlowGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Sidebar;
