import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, LogOut, Settings, Zap, ChevronDown, Clock, CheckCircle2, Database, FileText, Palette, Sparkles, Menu } from 'lucide-react';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isExperiencePanelOpen, setIsExperiencePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (err) {
      console.error('Notif fetch failed', err);
    }
  };

  useEffect(() => {
    if (user) fetchNotifs();
  }, [user]);

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  // Handle Search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          const res = await api.get(`/search?q=${searchQuery}`);
          setSearchResults(res.data);
        } catch (err) {
          console.error('Search failed', err);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchQuery('');
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <>
      <header className="h-20 fixed top-0 right-0 lg:left-72 left-0 z-40 px-4 lg:px-8 flex items-center justify-between bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--glass-border)] shadow-[0_2px_24px_rgba(0,0,0,0.02)] transition-all duration-500">
        
        {/* ── Mobile Menu Toggle ── */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 mr-2 text-[var(--secondary-text)] hover:text-[var(--accent-glow)] transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* ── Global Search ── */}
        <div className="relative flex-1 max-w-xl" ref={searchRef}>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--secondary-text)] group-focus-within:text-[var(--accent-glow)] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search neural notes, tasks, files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] rounded-xl py-2.5 pl-12 pr-4 text-sm text-[var(--primary-text)] placeholder:text-[var(--muted-text)] focus:outline-none focus:border-[var(--accent-glow)]/50 focus:ring-4 focus:ring-[var(--accent-glow)]/5 transition-all"
            />
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {(searchQuery.length > 0 || isSearching) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-3 bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-2xl shadow-2xl shadow-[var(--accent-glow)]/5 overflow-hidden"
              >
                {isSearching ? (
                  <div className="p-8 text-center text-[var(--muted-text)] text-xs font-bold animate-pulse uppercase tracking-widest">Scanning Vault...</div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2 space-y-1">
                    {searchResults.map((res) => (
                      <div 
                        key={res.id} 
                        onClick={() => { navigate(res.path); setSearchQuery(''); }}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--nav-active)] cursor-pointer transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-glow)]/10 flex items-center justify-center text-[var(--accent-glow)] group-hover:bg-[var(--accent-glow)] group-hover:text-white transition-colors">
                          {res.type === 'note' && <FileText size={16} />}
                          {res.type === 'task' && <CheckCircle2 size={16} />}
                          {res.type === 'file' && <Database size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--primary-text)]">{res.title}</p>
                          <p className="text-[10px] text-[var(--muted-text)] uppercase font-bold tracking-tight">{res.type} • {res.meta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[var(--muted-text)] text-xs font-bold uppercase tracking-widest">No entries found</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-4">
          
          {/* Experience Panel Trigger */}
          <button 
            onClick={() => setIsExperiencePanelOpen(true)}
            className="w-11 h-11 rounded-xl bg-[var(--bg-card)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--secondary-text)] hover:text-[var(--accent-glow)] hover:border-[var(--accent-glow)]/30 transition-all relative group shadow-sm bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10"
            title="Product Experience Showcase"
          >
            <Sparkles size={20} className="group-hover:rotate-12 transition-transform text-indigo-500" />
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse" />
          </button>

          {/* Appearance Customizer */}
          <button 
            onClick={() => setIsThemeOpen(true)}
            className="w-11 h-11 rounded-xl bg-[var(--bg-card)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--secondary-text)] hover:text-[var(--accent-glow)] hover:border-[var(--accent-glow)]/30 transition-all relative group shadow-sm"
            title="Neural Appearance"
          >
            <Palette size={20} className="group-hover:rotate-12 transition-transform" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="w-11 h-11 rounded-xl bg-[var(--bg-card)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--secondary-text)] hover:text-[var(--accent-glow)] hover:border-[var(--accent-glow)]/30 transition-all relative group shadow-sm"
            >
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                 <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-black shadow-[0_0_10px_rgba(239,68,68,0.5)] border-2 border-[var(--bg-card)] animate-in fade-in zoom-in">
                    {unreadCount > 9 ? '9+' : unreadCount}
                 </span>
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-3 w-80 bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-2xl shadow-2xl shadow-slate-200/50 p-4"
                >
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h4 className="text-[10px] font-black tracking-widest text-[var(--muted-text)] uppercase text-indigo-500">Intelligence Feed</h4>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[9px] font-black uppercase text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        Purge Alerts
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div 
                          key={n._id} 
                          onClick={() => {
                            markAsRead(n._id);
                            if (n.data?.url || n.data?.link) navigate(n.data.url || n.data.link);
                            setIsNotifOpen(false);
                          }}
                          className={`flex gap-3 p-3 rounded-xl transition-all border group cursor-pointer ${
                            n.read 
                              ? 'bg-transparent border-transparent opacity-60' 
                              : 'bg-indigo-50/30 border-indigo-100 hover:bg-indigo-50/50 hover:border-indigo-200'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            n.read 
                              ? 'bg-slate-100 text-slate-400' 
                              : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                          }`}>
                            {n.type === 'TASK_REMINDER' ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-[11px] font-bold leading-tight ${n.read ? 'text-[var(--secondary-text)]' : 'text-slate-900 font-black'}`}>
                              {n.message}
                            </p>
                            <p className="text-[9px] text-[var(--muted-text)] mt-1 uppercase font-black tracking-tight flex items-center gap-2">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {!n.read && <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center opacity-40">
                         <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mx-auto mb-3">
                            <Bell size={16} className="text-slate-300" />
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Zero Alerts Detected</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1.5 pl-4 rounded-xl bg-[var(--bg-card)] border border-[var(--glass-border)] hover:border-[var(--accent-glow)]/30 transition-all group shadow-sm shadow-slate-200/50"
            >
              <div className="text-right">
                <p className="text-xs font-bold text-[var(--primary-text)] tracking-tight">{user?.name || user?.username || 'Observer'}</p>
                <p className="text-[9px] font-bold text-[var(--accent-glow)] uppercase tracking-widest mt-0.5">Lv {user?.productivityLevel || 1} Pro</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-[var(--bg-silk)] flex items-center justify-center text-[var(--secondary-text)] border border-[var(--glass-border)]">
                <User size={18} />
              </div>
              <ChevronDown size={14} className={`text-[var(--muted-text)] transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-3 w-56 bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-2xl shadow-2xl shadow-slate-200/50 p-2"
                >
                  <div className="space-y-1">
                    <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--nav-active)] text-[var(--secondary-text)] hover:text-[var(--primary-text)] transition-all text-sm font-bold">
                      <Settings size={16} /> System Config
                    </button>
                    <button onClick={logout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-[var(--secondary-text)] hover:text-red-500 transition-all text-sm font-bold">
                      <LogOut size={16} /> Disconnect
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      <ThemePicker isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />
      <ProductExperiencePanel isOpen={isExperiencePanelOpen} onClose={() => setIsExperiencePanelOpen(false)} />
    </>
  );
}
