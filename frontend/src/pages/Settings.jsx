import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  CreditCard, 
  Lock, 
  Smartphone, 
  Key, 
  Check, 
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  Globe,
  Monitor,
  Download
} from 'lucide-react';
import MainLayout from '../components/MainLayout';
import GlassCard from '../components/GlassCard';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <MainLayout>
      <div className="max-w-[1400px] mx-auto pb-20 px-4">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter">
              Advanced <span className="text-[#9dc183]">Console</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs mt-2">
              Neural Integrity & Identity Scaling
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 p-1.5 sm:p-2 bg-slate-900 border border-white/5 rounded-3xl shadow-[inset_2px_2px_8px_rgba(0,0,0,0.3)]">
             {['profile', 'security', 'billing'].map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`flex-1 sm:flex-none px-4 sm:px-8 py-2 sm:py-2.5 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                   activeTab === tab 
                    ? 'bg-slate-800 text-[#9dc183] border border-white/5 shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.05),inset_2px_2px_6px_rgba(0,0,0,0.5)]' 
                    : 'text-slate-500 hover:text-slate-300'
                 }`}
               >
                 {tab}
               </button>
             ))}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && <ProfilePanel key="profile" />}
            {activeTab === 'security' && <SecurityPanel key="security" />}
            {activeTab === 'billing' && <BillingPanel key="billing" />}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}

function ProfilePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Details */}
        <div className="lg:col-span-2">
          <GlassCard className="glass-card-embossed p-5 sm:p-10 space-y-8">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
               <h3 className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                 <User size={16} className="text-[#9dc183]" />
                 Neural Identity
               </h3>
               <div className="px-3 py-1 rounded-full bg-[#9dc183]/10 border border-[#9dc183]/20 flex items-center gap-2">
                 <Star size={12} className="text-[#9dc183] fill-current" />
                 <span className="text-[9px] font-black text-[#9dc183] uppercase tracking-widest">Premium User</span>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Identity Vector</label>
                  <input type="text" placeholder="Neural Observer" className="w-full input-debossed px-6 py-4 rounded-2xl text-white font-medium outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Archive Link</label>
                  <input type="email" placeholder="neural@focusvault.com" className="w-full input-debossed px-6 py-4 rounded-2xl text-white font-medium outline-none" />
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Synthesizer Bio</label>
                   <textarea placeholder="Synthesizing project management with neural archival protocols..." className="w-full input-debossed px-6 py-4 rounded-2xl text-white font-medium outline-none h-32 resize-none" />
                </div>
             </div>

             <div className="pt-4 flex justify-end">
               <button className="btn-embossed px-10 py-4 rounded-2xl text-[#9dc183] font-black uppercase tracking-[0.2em] text-xs">
                 Update Identity
               </button>
             </div>
          </GlassCard>
        </div>

        {/* Global Node Info */}
        <div className="space-y-8">
           <GlassCard className="glass-card-embossed p-8 text-center bg-gradient-to-br from-[#1c2e1c]/40 to-transparent">
              <div className="w-24 h-24 rounded-3xl bg-slate-900 mx-auto mb-6 flex items-center justify-center border border-white/5 shadow-[6px_6px_16px_rgba(0,0,0,0.5),-6px_-6px_16px_rgba(255,255,255,0.03)]">
                <ShieldCheck size={48} className="text-[#9dc183] drop-shadow-[0_0_12px_rgba(157,193,131,0.4)]" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">VALIDATED OBSERVER</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed mb-6">
                Your neural link is certified & encrypted across sector 4-alpha protocols.
              </p>
              <div className="flex justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i <= 4 ? 'bg-[#9dc183]' : 'bg-slate-800'}`} />
                ))}
              </div>
           </GlassCard>

           <GlassCard className="p-6 border border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mb-4">Core Telemetry</span>
              <div className="flex gap-8">
                 <div className="flex flex-col">
                   <span className="text-2xl font-black text-slate-800">4,124</span>
                   <span className="text-[8px] font-black text-slate-700 uppercase">Resonances</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-2xl font-black text-slate-800">12</span>
                   <span className="text-[8px] font-black text-slate-700 uppercase">Nodes</span>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}

function SecurityPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* E2E Encryption Cluster */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <GlassCard className="glass-card-embossed p-10 bg-gradient-to-r from-slate-900 to-black/40">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
              <Lock size={16} className="text-cyan-400" />
              Neural Encryption Clusters (E2E)
            </h3>
            
            <div className="relative h-48 flex items-center justify-center">
               {/* Visual representation of nodes */}
               <div className="absolute inset-0 flex items-center justify-around opacity-20 pointer-events-none">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className="w-px h-full bg-cyan-400/50" />
                 ))}
               </div>
               
               <div className="grid grid-cols-3 gap-12 text-center relative z-10">
                  {[
                    { label: 'Vault Crypt', status: 'Active', color: 'text-cyan-400' },
                    { label: 'Asset Node', status: 'Validated', color: 'text-[#30d158]' },
                    { label: 'Sync bridge', status: 'Secured', color: 'text-cyan-400' }
                  ].map((node, i) => (
                    <div key={i} className="space-y-3">
                       <div className={`w-12 h-12 rounded-2xl bg-slate-950 border border-white/5 mx-auto flex items-center justify-center shadow-2xl ${node.color}`}>
                          <Shield size={24} />
                       </div>
                       <h5 className="text-[10px] font-black text-white uppercase tracking-widest">{node.label}</h5>
                       <span className={`text-[8px] font-black uppercase tracking-widest ${node.color}`}>{node.status}</span>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="mt-10 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <AlertCircle size={18} className="text-cyan-400 animate-pulse" />
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Encryption Integrity at 100%. No breaches detected.</p>
              </div>
              <button className="text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:text-white transition-colors underline">Refresh Scan</button>
            </div>
          </GlassCard>

          {/* Device Matrix */}
          <GlassCard className="glass-card-embossed p-5 sm:p-10">
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
               <Smartphone size={16} className="text-[#9dc183]" />
               Authorized Neural Terminals
             </h3>
             
             <div className="space-y-4">
                {[
                  { name: 'MacBook Pro Neural Node', location: 'New Delhi, India', time: 'Active now', icon: <Monitor size={20} /> },
                  { name: 'iPhone Sector 1', location: 'New Delhi, India', time: '2 hours ago', icon: <Smartphone size={20} /> },
                  { name: 'Cloud Terminal 4', location: 'Distant Sync', time: 'Last week', icon: <Globe size={20} /> }
                ].map((device, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-[#9dc183]/30 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-[#9dc183] transition-all">
                        {device.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{device.name}</h4>
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{device.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] font-black text-[#30d158] uppercase tracking-widest">{device.time}</span>
                       <button className="block text-[8px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest mt-1">Disconnect</button>
                    </div>
                  </div>
                ))}
             </div>
          </GlassCard>
        </div>

        {/* Metallic Key Management */}
        <div className="lg:col-span-4 self-start">
           <div className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border border-white/10 shadow-[20px_20px_60px_rgba(0,0,0,0.6),-10px_-10px_30px_rgba(255,255,255,0.05)] relative overflow-hidden">
              {/* Metallic Texture Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner shadow-white/5">
                   <Key size={32} className="text-slate-300" />
                </div>
                <h4 className="text-xl font-black text-white tracking-widest mb-2 uppercase">Key Management</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-8">
                  Synchronize your private sector keys for local machine archival.
                </p>
                
                <div className="space-y-6">
                   <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-2">Primary Fragment</span>
                      <div className="flex items-center justify-between">
                         <span className="font-mono text-xs text-[#9dc183]">•••• •••• •••• 4124</span>
                         <Download size={14} className="text-slate-600 hover:text-white cursor-pointer" />
                      </div>
                   </div>
                   <button className="w-full btn-embossed py-4 rounded-2xl text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3">
                      Generate New Key
                   </button>
                </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function BillingPanel() {
  const features = [
    { name: 'Neural Memory Storage', free: '1GB', premium: 'UNLIMITED' },
    { name: 'AI Synthesis Modules', free: 'BASIC', premium: 'ADVANCED' },
    { name: 'Multi-Node Sync', free: '2 DEVICES', premium: 'UNLIMITED' },
    { name: 'E2E Encryption Clusters', free: 'NO', premium: 'YES' },
    { name: 'Team Collaborations', free: 'UP TO 1', premium: 'UNLIMITED' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Plan Management */}
         <GlassCard className="glass-card-embossed p-5 sm:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                <CreditCard size={16} className="text-purple-400" />
                Subscription Calibration
              </h3>
              
              <div className="p-10 rounded-3xl bg-slate-800 border-2 border-slate-700 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.4)] flex flex-col items-center text-center">
                 <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center mb-6 shadow-2xl">
                    <Zap size={40} className="text-white fill-current" />
                 </div>
                 <h4 className="text-3xl font-black text-white tracking-widest mb-1 uppercase">PREMIUM SYNC</h4>
                 <p className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-widest">$12.00 / CYCLE</p>
                 <div className="px-6 py-2 rounded-full bg-slate-900 border border-white/5 text-[9px] font-black text-[#9dc183] uppercase tracking-[0.2em]">Next Sync: Oct 24, 2026</div>
              </div>
            </div>
            
            <div className="mt-12 flex gap-4">
               <button className="flex-1 btn-embossed py-4 rounded-2xl text-slate-400 font-black uppercase tracking-widest text-xs">Switch to Basic</button>
               <button className="flex-1 btn-embossed py-4 rounded-2xl text-[#9dc183] font-black uppercase tracking-widest text-xs">Manage Billing</button>
            </div>
         </GlassCard>

         {/* Feature Matrix */}
         <GlassCard className="glass-card-embossed p-10">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
              <ShieldCheck size={16} className="text-cyan-400" />
              Strategic Feature Matrix
            </h3>
            
            <div className="overflow-hidden border border-white/5 rounded-2xl">
               <table className="w-full text-left">
                  <thead className="bg-white/5">
                     <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Basic</th>
                        <th className="px-6 py-4 text-[10px] font-black text-[#9dc183] uppercase tracking-widest">Premium</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {features.map((f, i) => (
                       <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{f.name}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-700">{f.free}</td>
                          <td className="px-6 py-4 text-xs font-black text-[#9dc183]">{f.premium}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            
            <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
               <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <Check size={16} />
               </div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">You have successfully unlocked all advanced neural synthesis protocols.</p>
            </div>
         </GlassCard>
      </div>
    </motion.div>
  );
}
