import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  FileText, 
  Download, 
  Eye, 
  ChevronDown, 
  Plus, 
  FileUp, 
  StickyNote, 
  CheckSquare 
} from 'lucide-react';

/**
 * System Logs Terminal
 */
export const SystemLogs = ({ logs }) => (
  <div className="bg-black/40 border border-white/5 rounded-3xl p-6 font-mono text-[11px] h-[200px] overflow-y-auto shadow-inner">
    <div className="flex items-center gap-2 mb-4 text-emerald-400/70 border-b border-white/5 pb-2">
      <Terminal size={14} />
      <span className="uppercase tracking-widest font-black">Live Command Logs</span>
    </div>
    <div className="space-y-1.5">
      {logs.map((log, i) => (
        <div key={i} className="flex gap-3 opacity-80 hover:opacity-100 transition-opacity">
          <span className="text-slate-600">[{log.time}]</span>
          <span className="text-emerald-500/80">{log.source}:</span>
          <span className="text-slate-300">{log.message}</span>
        </div>
      ))}
      <div className="animate-pulse inline-block w-2 h-4 bg-emerald-500 ml-1 translate-y-1" />
    </div>
  </div>
);

/**
 * Recent Neural Syncs
 */
export const RecentSyncs = ({ assets }) => (
  <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 shadow-xl">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Recent Neural Sync</h3>
      <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 rounded-md">Vault Active</span>
    </div>
    <div className="space-y-4">
      {assets.length > 0 ? assets.map((asset, i) => (
        <div key={i} className="flex items-center justify-between group p-2 rounded-xl hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
              <FileUp size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-white truncate max-w-[150px]">{asset.filename}</p>
              <p className="text-[10px] text-slate-500 uppercase font-black">{asset.fileType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 hover:text-emerald-400 transition-colors"><Eye size={14} /></button>
            <a href={asset.url} download className="p-2 hover:text-emerald-400 transition-colors"><Download size={14} /></a>
          </div>
        </div>
      )) : (
        <p className="text-xs text-slate-600 italic">No recent syncs detected.</p>
      )}
    </div>
  </div>
);

/**
 * Quick Action Dropdown
 */
export const QuickActionDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
      >
        <Plus size={18} />
        Quick Action
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-3 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl"
          >
            {[
              { label: 'Upload Asset', icon: <FileUp size={16} />, color: 'text-emerald-400' },
              { label: 'Create Note', icon: <StickyNote size={16} />, color: 'text-cyan-400' },
              { label: 'Add Task', icon: <CheckSquare size={16} />, color: 'text-indigo-400' },
            ].map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
              >
                <span className={`${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</span>
                <span className="text-xs font-bold text-slate-300 group-hover:text-white">{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
