import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Key, Send, Code2, Shield, Copy, Check,
  Trash2, Terminal, LogOut, Eye, ChevronRight,
  UserPlus, Lock, RefreshCw, X, FileCode
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';
import api from '../utils/api';
import MainLayout from '../components/MainLayout';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'https://backend-06et.onrender.com';
const SOCKET_URL = API.replace(/\/api$/, '');

// ─── Syntax Highlight Colours ─────────────────────────────────────────────────
const LANG_COLORS = {
  javascript: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  python:     'text-blue-400 bg-blue-500/10 border-blue-500/20',
  sql:        'text-orange-400 bg-orange-500/10 border-orange-500/20',
  bash:       'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  json:       'text-purple-400 bg-purple-500/10 border-purple-500/20',
  typescript: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
};

// ─── Entry Screen ─────────────────────────────────────────────────────────────
function EntryScreen({ onCreate, onJoin, loading }) {
  const [teamName, setTeamName] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [mode, setMode] = useState(null); // 'create' | 'join'

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center gap-12 px-4 relative overflow-hidden bg-slate-50/50">
      {/* ── Neural Grid & Glow ── */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-400/10 rounded-full blur-[160px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center relative z-20"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
          className="relative w-24 h-24 mx-auto mb-10"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl"
          />
          <div className="relative w-full h-full rounded-[2.5rem] bg-slate-900 flex items-center justify-center shadow-2xl border border-emerald-500/30">
            <Users size={40} className="text-emerald-400 relative z-10" />
          </div>
        </motion.div>

        <h1 className="text-7xl sm:text-8xl font-black tracking-tighter text-slate-900 mb-6">
          Collab<span className="text-emerald-500">Hub</span>
        </h1>
        
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="space-y-6"
        >
          <p className="text-emerald-600 text-xs sm:text-sm font-black uppercase tracking-[0.4em]">
             Collaborate. Code. Build — Together in Real-Time.
          </p>
          <p className="text-slate-500 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed border-t border-slate-200 pt-6">
            Create squads, collaborate with your team, share ideas, and build projects together in real-time — all in one place.
          </p>
        </motion.div>
      </motion.div>

      {!mode && (
        <div className="space-y-12 w-full flex flex-col items-center relative z-30">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setMode('create')}
              className="group relative flex items-center gap-4 px-10 py-5 rounded-[2rem] bg-slate-900 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-900/40 border border-emerald-500/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Plus size={18} /> Start a New Squad
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setMode('join')}
              className="flex items-center gap-4 px-10 py-5 rounded-[2rem] bg-white border border-slate-200 text-slate-900 font-black text-xs uppercase tracking-widest shadow-xl transition-all"
            >
              <Key size={18} className="text-emerald-500" /> Join with Access Key
            </motion.button>
          </motion.div>

          {/* Minimal Features Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap justify-center gap-x-12 gap-y-4 px-6"
          >
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="text-emerald-500 text-sm">⚡</span> Real-time collaboration
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="text-emerald-500 text-sm">🔐</span> Secure team access
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="text-emerald-500 text-sm">🚀</span> Distraction-free workspace
            </div>
          </motion.div>
        </div>
      )}

      {/* Scrolling Feedback Marquee */}
      <div className="absolute bottom-0 left-0 w-full bg-white/50 backdrop-blur-md border-t border-slate-200 py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee hover:pause-on-hover">
          {[1, 2, 3].map((set) => (
            <div key={set} className="flex gap-16 px-8 items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                <span className="text-emerald-500">🔥</span> Loved by developers worldwide
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                <span className="text-emerald-500">💬</span> Boosted productivity by 2x
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                <span className="text-emerald-500">🚀</span> Seamless real-time collaboration
              </span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {mode === 'create' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2.5rem] p-8 shadow-2xl shadow-[var(--accent-glow)]/5"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-[var(--primary-text)]">Initialize Squad</h2>
              <button onClick={() => setMode(null)} className="text-[var(--muted-text)] hover:text-[var(--primary-text)] transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <input
                type="text" value={teamName} onChange={e => setTeamName(e.target.value)}
                placeholder="Squad name (e.g. Frontend-Alpha)"
                className="w-full bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-[var(--accent-glow)]/50 transition-all placeholder:text-[var(--muted-text)] tracking-wide text-[var(--primary-text)]"
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { onCreate(teamName); setTeamName(''); }}
                disabled={loading || !teamName.trim()}
                className="w-full py-3.5 rounded-2xl bg-[var(--brand-gradient)] text-white font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Initializing...' : 'Create Squad →'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {mode === 'join' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2.5rem] p-8 shadow-2xl shadow-[var(--accent-glow)]/5"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-[var(--primary-text)]">Join via Access Key</h2>
              <button onClick={() => setMode(null)} className="text-[var(--muted-text)] hover:text-[var(--primary-text)] transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <input
                type="text" value={accessKey} onChange={e => setAccessKey(e.target.value)}
                placeholder="Paste your squad access key..."
                className="w-full bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] rounded-2xl px-5 py-3.5 text-sm font-mono outline-none focus:border-[var(--accent-glow)]/50 transition-all placeholder:text-[var(--muted-text)] text-[var(--primary-text)]"
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { onJoin(accessKey); setAccessKey(''); }}
                disabled={loading || !accessKey.trim()}
                className="w-full py-3.5 rounded-2xl bg-[#6366f1] text-white font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all hover:bg-[#4f46e5]"
              >
                {loading ? 'Syncing...' : 'Connect to Squad →'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Access Key Modal ─────────────────────────────────────────────────────────
function AccessKeyModal({ team, userId, onClose, onRemove, onRegen }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(team.accessKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2.5rem] p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[var(--accent-glow)]/10 flex items-center justify-center">
              <Shield size={16} className="text-[var(--accent-glow)]" />
            </div>
            <h2 className="font-black text-[var(--primary-text)]">Access Control</h2>
          </div>
          <button onClick={onClose}><X size={18} className="text-[var(--muted-text)] hover:text-[var(--primary-text)] transition-colors" /></button>
        </div>

        <div className="mb-6">
          <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-text)] mb-2">Squad Access Key</p>
          <div className="flex items-center gap-3 bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] rounded-2xl px-4 py-3">
            <code className="text-xs text-[var(--accent-glow)] font-mono flex-1 truncate">{team.accessKey}</code>
            <button onClick={copy} className="text-[var(--muted-text)] hover:text-[var(--accent-glow)] transition-colors flex-shrink-0">
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
            {team.adminId === userId && (
              <button onClick={onRegen} className="text-[var(--muted-text)] hover:text-yellow-500 transition-colors">
                <RefreshCw size={16} />
              </button>
            )}
          </div>
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-text)] mb-3">Member Roster ({team.members.length})</p>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
            {team.members.map((m, i) => {
              const member = m.userId;
              const isAdmin = team.adminId === (member?._id || member);
              return (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-silk)]/30 border border-[var(--glass-border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--accent-glow)]/10 border border-[var(--accent-glow)]/20 flex items-center justify-center text-xs font-black text-[var(--accent-glow)]">
                      {(member?.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--primary-text)]">{member?.username || 'Unknown'}</p>
                      <p className="text-[9px] text-[var(--muted-text)] font-bold">{m.role?.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <span className="text-[8px] font-black text-[var(--accent-glow)] bg-[var(--accent-glow)]/10 px-2 py-0.5 rounded-lg border border-[var(--accent-glow)]/20">ADMIN</span>
                    )}
                    {team.adminId === userId && !isAdmin && (
                      <button onClick={() => onRemove(member?._id)} className="text-[var(--muted-text)] hover:text-rose-500 transition-colors p-1">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Add Snippet Modal ────────────────────────────────────────────────────────
function AddSnippetModal({ onAdd, onClose, loading }) {
  const [form, setForm] = useState({ title: '', language: 'javascript', code: '' });
  return (
    <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2.5rem] p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-[var(--primary-text)]">Add Code Snippet</h2>
          <button onClick={onClose}><X size={18} className="text-[var(--muted-text)] hover:text-[var(--primary-text)] transition-colors" /></button>
        </div>
        <div className="space-y-4">
          <input
            value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Snippet title (e.g. Auth Middleware)"
            className="w-full bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-[var(--accent-glow)]/50 transition-all placeholder:text-[var(--muted-text)] text-[var(--primary-text)]"
          />
          <select
            value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
            className="w-full bg-[var(--bg-silk)]/80 border border-[var(--glass-border)] rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-[var(--accent-glow)]/50 text-[var(--primary-text)]"
          >
            {Object.keys(LANG_COLORS).map(lang => (
              <option key={lang} value={lang} className="bg-[var(--bg-card)]">{lang.toUpperCase()}</option>
            ))}
          </select>
          <textarea
            value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
            placeholder="// Paste your critical logic here..."
            className="w-full bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] rounded-2xl px-4 py-3 text-sm font-mono outline-none focus:border-[var(--accent-glow)]/50 transition-all placeholder:text-[var(--muted-text)] text-[var(--primary-text)] resize-none h-48 md:h-64"
          />
          <button
            onClick={() => onAdd(form)} disabled={loading || !form.title || !form.code}
            className="w-full py-3.5 rounded-2xl bg-[var(--brand-gradient)] text-white font-black text-xs uppercase tracking-widest disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Encrypting...' : 'Add to Vault →'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Workspace ────────────────────────────────────────────────────────────────
function Workspace({ team, userId, userName, socket, onLeave, onRefresh }) {
  const [messages, setMessages]     = useState(team.messages?.slice(-50) || []);
  const [msg, setMsg]               = useState('');
  const [typing, setTyping]         = useState('');
  const [showKeyModal, setShowKey]  = useState(false);
  const [showSnippet, setShowSnip]  = useState(false);
  const [snippetLoad, setSnipLoad]  = useState(false);
  const [collabLogs, setLogs]       = useState([
    { type: 'TEAM_SYNC', message: `Squad "${team.teamName}" workspace initialized.` },
    { type: 'COLLAB',    message: 'Neural link established for all members.' },
  ]);
  const chatBottom = useRef(null);

  useEffect(() => {
    if (!socket) return;
    socket.emit('join_team', team._id);

    socket.on('team_message', (newMsg) => {
      setMessages(prev => [...prev, newMsg]);
    });
    socket.on('user_typing', ({ userName: u }) => {
      setTyping(`${u} is typing...`);
      setTimeout(() => setTyping(''), 2500);
    });
    socket.on('member_joined', () => onRefresh());
    socket.on('collab_log', (log) => setLogs(prev => [...prev, log]));

    return () => {
      socket.off('team_message');
      socket.off('user_typing');
      socket.off('member_joined');
      socket.off('collab_log');
      socket.emit('leave_team', team._id);
    };
  }, [socket, team._id]);

  useEffect(() => {
    chatBottom.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!msg.trim()) return;
    try {
      await api.post(`/teams/${team._id}/message`, { text: msg, senderName: userName });
      setMsg('');
    } catch { toast.error('Message failed'); }
  };

  const addSnippet = async (form) => {
    setSnipLoad(true);
    try {
      await api.post(`/teams/${team._id}/snippet`, form);
      toast.success('Snippet added to vault!');
      setShowSnip(false);
      onRefresh();
      setLogs(prev => [...prev, { type: 'SNIPPET_ADD', message: `"${form.title}" added to Code Vault.` }]);
    } catch { toast.error('Snippet failed'); }
    finally { setSnipLoad(false); }
  };

  const removeMember = async (uid) => {
    try {
      await api.delete(`/teams/${team._id}/member/${uid}`);
      toast.success('Member removed');
      onRefresh();
    } catch { toast.error('Remove failed'); }
  };

  const regenKey = async () => {
    try {
      const res = await api.patch(`/teams/${team._id}/regen-key`);
      toast.success('Access key regenerated!');
      onRefresh();
    } catch { toast.error('Failed'); }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-glow)]/10 border border-[var(--accent-glow)]/20 flex items-center justify-center shadow-sm">
            <Users size={22} className="text-[var(--accent-glow)]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--primary-text)] tracking-tight">{team.teamName}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-text)]">
                {team.members.length} Members
              </span>
              <span className="text-[var(--glass-border)]">•</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Live</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowKey(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--glass-border)] text-[10px] sm:text-xs font-black uppercase tracking-widest hover:border-[var(--accent-glow)]/40 hover:text-[var(--accent-glow)] transition-all shadow-sm"
          >
            <Lock size={14} /> Manage Access
          </button>
          <button
            onClick={onLeave}
            className="p-2.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 transition-all shadow-sm flex-shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Member Roster Pills */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {team.members.map((m, i) => {
          const member = m.userId;
          return (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--glass-border)] shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-[var(--brand-gradient)] flex items-center justify-center text-[9px] font-black text-white">
                {(member?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="text-[10px] font-bold text-[var(--secondary-text)]">{member?.username}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.3)]" />
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Left Column: Assets + Code Snippets */}
        <div className="xl:col-span-7 space-y-6">

          {/* Shared Asset Vault */}
          <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)]">Shared Asset Vault</h3>
              <span className="text-[8px] text-[var(--accent-secondary)] font-black px-2 py-0.5 bg-[var(--accent-secondary)]/10 rounded-lg border border-[var(--accent-secondary)]/20">
                {team.sharedAssets?.length || 0} Files
              </span>
            </div>
            {team.sharedAssets?.length > 0 ? (
              <div className="space-y-2">
                {team.sharedAssets.map((a, i) => (
                  <div key={i} className="group flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-silk)]/30 border border-[var(--glass-border)] hover:border-[var(--accent-glow)]/20 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[var(--bg-card)] border border-[var(--glass-border)] flex items-center justify-center text-[10px] font-black text-[var(--muted-text)]">
                        {a.fileType?.toUpperCase().slice(0, 3)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--primary-text)]">{a.filename}</p>
                        <p className="text-[9px] text-[var(--muted-text)] font-bold">{a.fileType?.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[var(--muted-text)] hover:text-[var(--accent-glow)] transition-colors"><Eye size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--muted-text)] italic py-4 text-center">No shared assets yet. Upload files to collaborate.</p>
            )}
          </div>

          {/* Code Snippet Vault */}
          <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)]">Code Snippet Vault</h3>
              <button
                onClick={() => setShowSnip(true)}
                className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white hover:opacity-90 transition-all px-4 py-1.5 rounded-xl bg-[var(--accent-secondary)] shadow-lg shadow-[var(--accent-secondary)]/20"
              >
                <Plus size={12} /> Add Snippet
              </button>
            </div>
            {team.codeSnippets?.length > 0 ? (
              <div className="space-y-3">
                {team.codeSnippets.slice(-4).map((s, i) => (
                  <div key={i} className="rounded-2xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 border-b border-[var(--glass-border)] gap-2">
                      <div className="flex items-center gap-2">
                        <FileCode size={13} className="text-[var(--accent-glow)]" />
                        <span className="text-xs font-bold text-[var(--primary-text)] truncate">{s.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border ${LANG_COLORS[s.language] || 'text-[var(--muted-text)] bg-[var(--bg-card)] border-[var(--glass-border)]'}`}>
                          {s.language}
                        </span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(s.code);
                            toast.success('Snippet copied!');
                          }}
                          className="p-1.5 rounded-lg hover:bg-[var(--accent-glow)]/10 text-[var(--muted-text)] hover:text-[var(--accent-glow)] transition-all"
                          title="Copy Code"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                    <pre className="text-[10px] text-[var(--secondary-text)] font-mono overflow-x-auto px-4 py-3 max-h-[120px] leading-relaxed custom-scrollbar">
                      {s.code}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--muted-text)] italic py-4 text-center">No snippets yet. Add critical logic to vault.</p>
            )}
          </div>

          {/* Live Collab Log */}
          <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2rem] p-5 shadow-sm font-mono">
            <div className="flex items-center gap-2 mb-3 text-[9px] font-black uppercase tracking-widest text-emerald-500/70">
              <Terminal size={12} /> Live Collaboration Stream
            </div>
            <div className="space-y-1.5 max-h-[120px] overflow-y-auto custom-scrollbar">
              {collabLogs.map((log, i) => (
                <div key={i} className="flex gap-3 text-[10px]">
                  <span className="text-[var(--accent-glow)] font-black flex-shrink-0">[{log.type}]</span>
                  <span className="text-[var(--secondary-text)]">{log.message}</span>
                </div>
              ))}
              <div className="w-2 h-3 bg-[var(--accent-glow)]/40 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right Column: Neural Discussion */}
        <div className="xl:col-span-5 flex flex-col">
          <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2.5rem] flex flex-col h-[600px] overflow-hidden shadow-sm">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)]">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)]">Neural Discussion</h3>
                {typing && <p className="text-[9px] text-[var(--accent-glow)] animate-pulse">{typing}</p>}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] text-emerald-400 font-black tracking-widest uppercase">Live</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar bg-[var(--bg-silk)]/10">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
                  <Users size={32} className="text-[var(--muted-text)]" />
                  <p className="text-xs text-[var(--muted-text)] text-center">No messages yet.<br/>Start the discussion.</p>
                </div>
              )}
              {messages.map((m, i) => {
                const isMe = (m.senderId?._id || m.senderId) === userId || m.senderName === userName;
                return (
                  <div key={i} className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] text-[var(--muted-text)] font-bold px-2">{m.senderName || 'Unknown'}</span>
                    <div className={`px-5 py-3 rounded-2xl max-w-[85%] text-[11px] leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-[var(--brand-gradient)] text-white rounded-tr-sm'
                        : 'bg-[var(--bg-card)] border border-[var(--glass-border)] text-[var(--primary-text)] rounded-tl-sm'
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[8px] text-[var(--muted-text)] font-semibold px-2">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={chatBottom} />
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-[var(--glass-border)]">
              <div className="flex items-center gap-3 bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] rounded-2xl px-4 py-3 shadow-sm group focus-within:border-[var(--accent-glow)]/30 transition-all">
                <input
                  value={msg}
                  onChange={e => {
                    setMsg(e.target.value);
                    socket?.emit('typing', { teamId: team._id, userName });
                  }}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-text)] text-[var(--primary-text)] font-medium"
                />
                <button
                  onClick={sendMessage}
                  disabled={!msg.trim()}
                  className="w-10 h-10 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center text-white disabled:opacity-20 disabled:scale-95 hover:scale-105 transition-all shadow-lg shadow-[var(--accent-glow)]/20"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[8px] text-[var(--muted-text)] font-bold uppercase tracking-[0.2em] mt-3 px-1">
                @Assets/filename • @username • [Enter] to Sync
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showKeyModal && (
          <AccessKeyModal
            team={team} userId={userId}
            onClose={() => setShowKey(false)}
            onRemove={removeMember}
            onRegen={regenKey}
          />
        )}
        {showSnippet && (
          <AddSnippetModal loading={snippetLoad} onAdd={addSnippet} onClose={() => setShowSnip(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { user } = useAuth();
  const [teams, setTeams]         = useState([]);
  const [activeTeam, setActive]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);
  const [socket, setSocket]       = useState(null);

  // Establish socket connection
  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    s.emit('join_user', user?._id || user?.id);
    setSocket(s);
    return () => s.disconnect();
  }, [user]);

  const fetchTeams = async () => {
    try {
      const res = await api.get('/teams/my');
      setTeams(res.data || []);
    } catch (e) {
      console.error('Failed to fetch teams', e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchTeams(); }, []);

  const refreshActive = async () => {
    if (!activeTeam?._id) return;
    try {
      const res = await api.get(`/teams/${activeTeam._id}`);
      setActive(res.data);
      setTeams(prev => prev.map(t => t._id === res.data._id ? res.data : t));
    } catch {}
  };

  const createTeam = async (teamName) => {
    if (!teamName) return;
    setLoading(true);
    try {
      const res = await api.post('/teams', { teamName });
      setTeams(prev => [...prev, res.data]);
      setActive(res.data);
      toast.success(`🏗️ Squad "${teamName}" initialized!`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Creation failed');
    } finally { setLoading(false); }
  };

  const joinTeam = async (accessKey) => {
    if (!accessKey) return;
    setLoading(true);
    try {
      const res = await api.post('/teams/join', { accessKey });
      setTeams(prev => [...prev, res.data]);
      setActive(res.data);
      toast.success(`Connected to "${res.data.teamName}"!`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid access key');
    } finally { setLoading(false); }
  };

  if (fetching) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin mx-auto" />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Syncing Neural Links...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-[1600px] mx-auto pb-24 px-6 relative">
        {/* ── Background Glows ── */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -z-10" />
        
        {/* Squad Switcher at top if user has teams */}
        {teams.length > 0 && !activeTeam && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
                  Collab<span className="text-emerald-500">Hub</span>
                </h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 leading-none opacity-70">Neural Workspaces Architecture</p>
              </motion.div>
              
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => createTeam(prompt('Enter squad name:') || '')}
                  className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20 transition-all border border-transparent"
                >
                  <Plus size={16} /> Create Squad
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => joinTeam(prompt('Paste access key:') || '')}
                  className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-white/50 backdrop-blur-md border border-slate-200 text-slate-900 font-bold text-xs uppercase tracking-widest hover:border-emerald-500/40 transition-all shadow-sm"
                >
                  <Key size={16} /> Join via Key
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {teams.map((t, i) => (
                <motion.button
                  key={t._id} onClick={() => setActive(t)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative text-left bg-white/40 backdrop-blur-sm border border-slate-200/60 rounded-[3rem] p-8 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:border-emerald-500/30 hover:bg-white/80"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -z-10 group-hover:bg-emerald-500/10 transition-colors" />
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <Users size={24} className="text-emerald-600" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                      <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-emerald-600 transition-colors">{t.teamName}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-none mb-8">{t.members.length} Members • {t.codeSnippets?.length || 0} Assets</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-center -space-x-3">
                      {(t.members || []).slice(0, 4).map((m, j) => (
                        <div 
                          key={j} 
                          className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-[10px] font-black text-white border-2 border-white shadow-md transform hover:z-10 hover:-translate-y-1 transition-all"
                          title={m.userId?.username}
                        >
                          {(m.userId?.username || 'U').charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {(t.members?.length || 0) > 4 && (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 border-2 border-white shadow-sm">
                          +{t.members.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100/50 shadow-sm">Active Sync</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Entry screen if no teams */}
        {teams.length === 0 && !activeTeam && (
          <EntryScreen onCreate={createTeam} onJoin={joinTeam} loading={loading} />
        )}

        {/* Active Workspace */}
        {activeTeam && (
          <Workspace
            team={activeTeam}
            userId={user?._id || user?.id}
            userName={user?.username}
            socket={socket}
            onLeave={() => setActive(null)}
            onRefresh={refreshActive}
          />
        )}
      </div>
    </MainLayout>
  );
}
