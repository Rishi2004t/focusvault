import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Share2, 
  RotateCcw, 
  Zap, 
  Users, 
  Shield, 
  Activity, 
  Cpu,
  Info,
  Maximize2
} from 'lucide-react';

const INITIAL_NODES = [
  { id: 1, label: 'Neural Core', type: 'system', icon: <Cpu />, x: 400, y: 300 },
  { id: 2, label: 'Squad A', type: 'squad', icon: <Users />, x: 200, y: 150 },
  { id: 3, label: 'Squad B', type: 'squad', icon: <Users />, x: 600, y: 150 },
  { id: 4, label: 'Security Unit', type: 'system', icon: <Shield />, x: 200, y: 450 },
  { id: 5, label: 'Analytic Node', type: 'system', icon: <Activity />, x: 600, y: 450 },
];

const CONNECTIONS = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 1, to: 5 },
  { from: 2, to: 3 },
];

export default function NetworkPage() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleDrag = (id, info) => {
    // Basic drag handling is handled by motion, 
    // but we might need to update state for line drawing if we don't use refs.
    // For performance, we'll reach into the DOM or use state updates on drag.
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, x: node.x + info.delta.x, y: node.y + info.delta.y } : node
    ));
  };

  const resetLayout = () => setNodes(INITIAL_NODES);

  return (
    <div className="min-h-screen bg-[#020408] text-slate-200 overflow-hidden relative font-sans selection:bg-cyan-500/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[1000px] h-[300px] sm:h-[1000px] bg-cyan-500/5 rounded-full blur-[60px] sm:blur-[120px]" />
      </div>

      {/* Header UI */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row justify-between items-start sm:items-center z-20 pointer-events-none gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 pointer-events-auto"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <Share2 size={24} />
          </div>
          <div>
             <h1 className="text-xl font-black italic tracking-tighter uppercase text-white">Neural Network Topology</h1>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Interactive System Map v2.4</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={resetLayout}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <RotateCcw size={14} /> Reset Topology
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div 
        ref={containerRef}
        className="relative w-full h-screen cursor-crosshair z-10"
      >
        {/* SVG Connection Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.1)" />
              <stop offset="50%" stopColor="rgba(6, 182, 212, 0.5)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0.1)" />
            </linearGradient>
          </defs>
          
          {CONNECTIONS.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            return (
              <g key={`${conn.from}-${conn.to}-${idx}`}>
                {/* Base Connection Line */}
                <motion.line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="rgba(6, 182, 212, 0.15)"
                  strokeWidth="1"
                  className="transition-all duration-75"
                />
                
                {/* Pulsing Data Path */}
                <motion.line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="url(#lineGrad)"
                  strokeWidth="2"
                  strokeDasharray="10, 20"
                  animate={{ 
                    strokeDashoffset: [0, -30],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Draggable Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            drag
            dragMomentum={false}
            onDrag={(e, info) => handleDrag(node.id, info)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300, delay: node.id * 0.1 }}
            style={{ x: node.x - 40, y: node.y - 40, position: 'absolute' }}
            className={`w-20 h-20 rounded-3xl border flex items-center justify-center cursor-grab active:cursor-grabbing group transition-colors duration-500 ${
              selectedNode === node.id 
                ? 'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]' 
                : 'bg-[#0a0f18]/80 border-white/10 backdrop-blur-md hover:border-cyan-500/30'
            }`}
            onPointerDown={() => setSelectedNode(node.id)}
          >
             {/* Glow Effect */}
             <div className="absolute inset-x-0 inset-y-0 bg-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
             
             {/* Content */}
             <div className="relative z-10 flex flex-col items-center gap-1">
                <div className={`transition-transform duration-500 group-hover:scale-110 ${selectedNode === node.id ? 'text-cyan-400' : 'text-slate-400'}`}>
                   {React.cloneElement(node.icon, { size: 28 })}
                </div>
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-cyan-300">
                  {node.label}
                </span>
             </div>

             {/* Type Indicator */}
             <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${node.type === 'system' ? 'bg-cyan-500 shadow-[0_0_5px_#06b6d4]' : 'bg-purple-500 shadow-[0_0_5px_#a855f7]'}`} />
          </motion.div>
        ))}
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-4 sm:bottom-12 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-full max-w-sm z-30"
          >
             <div className="p-6 rounded-[2.5rem] bg-[#0a0f18]/90 border border-white/10 backdrop-blur-2xl shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                         {nodes.find(n => n.id === selectedNode)?.icon}
                      </div>
                      <div>
                         <h3 className="text-sm font-black italic uppercase text-white">{nodes.find(n => n.id === selectedNode)?.label}</h3>
                         <p className="text-[8px] font-bold text-cyan-500/70 uppercase tracking-widest">Active Neural Link</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-white transition-colors">
                      <X size={14} />
                   </button>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500 p-3 bg-white/5 rounded-xl border border-white/5">
                      <span>Telemetry Status</span>
                      <span className="text-emerald-400 flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                         Nominal
                      </span>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1">
                         <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Connectivity</span>
                         <span className="text-xs font-black text-white italic">98.2%</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1">
                         <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Latency</span>
                         <span className="text-xs font-black text-white italic">14ms</span>
                      </div>
                   </div>
                   <button className="w-full py-3 bg-cyan-500 text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all shadow-lg shadow-cyan-500/20">
                      Sync Neural Stream
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Hint */}
      <div className="absolute bottom-8 left-8 flex items-center gap-3 opacity-30 select-none">
         <Info size={14} />
         <span className="text-[9px] font-black uppercase tracking-[0.5em] italic">Drag Nodes to optimize topology view</span>
      </div>
      <div className="absolute bottom-8 right-8 flex items-center gap-3 opacity-30 select-none">
         <Maximize2 size={14} />
         <span className="text-[9px] font-black uppercase tracking-[0.5em] italic">Full Spatial Mapping Active</span>
      </div>
    </div>
  );
}
