import React, { useEffect, useState, useRef } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';

export default function SystemConsole({ onReboot }) {
  const [logs, setLogs] = useState([]);
  const [isRebooting, setIsRebooting] = useState(false);
  const socket = useSocket();
  const endRef = useRef(null);

  useEffect(() => {
    // Fetch initial logs
    const fetchLogs = async () => {
      try {
        const res = await api.get('/system/logs?limit=50');
        if (res.data) setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch system logs', err);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handleNewLog = (logEntry) => {
      setLogs((prev) => [...prev, logEntry].slice(-100)); // Keep last 100
    };

    socket.on('system_log', handleNewLog);
    return () => socket.off('system_log', handleNewLog);
  }, [socket]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleReboot = async () => {
    setIsRebooting(true);
    try {
      await api.post('/system/clear-cache');
      if (onReboot) onReboot();
    } catch (err) {
      console.error('Reboot failed:', err);
    }
    setTimeout(() => setIsRebooting(false), 2000);
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-emerald-400';
      case 'system': return 'text-cyan-400';
      default: return 'text-emerald-400/90';
    }
  };

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] font-mono flex flex-col h-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/70 shadow-[0_0_5px_rgba(248,113,113,0.5)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70 shadow-[0_0_5px_rgba(250,204,21,0.5)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70 shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/80">
            <Terminal size={13} />
            System Console
          </div>
        </div>
        <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest font-bold">
          <div className="flex items-center gap-1.5 opacity-80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-emerald-500">Live Sync</span>
          </div>
          <button 
            onClick={handleReboot}
            disabled={isRebooting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${isRebooting ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 opacity-50 cursor-not-allowed' : 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`}
          >
            <RefreshCw size={11} className={isRebooting ? 'animate-spin' : ''} />
            System Reboot
          </button>
        </div>
      </div>
      
      {/* Log Output */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2 space-y-1">
        {logs.length === 0 ? (
          <div className="text-emerald-500/50 text-[10px] uppercase font-black tracking-widest animate-pulse h-full flex flex-col items-center justify-center">
             <Terminal size={24} className="mb-2 opacity-50" />
             Awaiting neural telemetry events...
          </div>
        ) : logs.map((log, i) => {
          const formattedTime = new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
          return (
            <div key={log._id || i} className="flex gap-3 text-[11px] hover:bg-white/[0.02] px-2 py-0.5 rounded transition-colors group">
              <span className="text-slate-600 font-bold shrink-0">[{formattedTime}]</span>
              <span className={`font-black shrink-0 w-[80px] ${getLogColor(log.type)}`}>
                [{log.type.toUpperCase()}]
              </span>
              <span className={`break-words ${getLogColor(log.type)} opacity-90 group-hover:opacity-100 transition-opacity`}>
                {log.message}
              </span>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
    </div>
  );
}
