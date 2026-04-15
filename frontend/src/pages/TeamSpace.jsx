import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  UserPlus, 
  Filter,
  MoreVertical,
  ChevronRight,
  Shield,
  Edit3,
  Eye,
  Settings
} from 'lucide-react';
import MainLayout from '../components/MainLayout';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';

export default function TeamSpace() {
  const [feedItems, setFeedItems] = useState([
    {
      id: 1,
      user: "Neha",
      role: "Team Lead",
      action: "added a new document",
      target: "Marketing Phase 2",
      time: "12 mins ago",
      comments: 4,
      avatar: "N"
    },
    {
      id: 2,
      user: "Rahul",
      role: "Editor",
      action: "finalized the objective",
      target: "Database Migration",
      time: "1 hour ago",
      comments: 0,
      avatar: "R"
    },
    {
      id: 3,
      user: "Sanya",
      role: "Admin",
      action: "updated permissions for",
      target: "External Consultants",
      time: "3 hours ago",
      comments: 12,
      avatar: "S"
    },
    {
      id: 4,
      user: "Aman",
      role: "Viewer",
      action: "completed the module",
      target: "Auth Service Refactor",
      time: "Yesterday",
      comments: 2,
      avatar: "A"
    }
  ]);

  const teamMembers = [
    { name: "Neha Sharma", role: "Admin", status: "Active", link: "Lead" },
    { name: "Rahul Varma", role: "Editor", status: "Online", link: "Sync" },
    { name: "Sanya Malhotra", role: "Admin", status: "Busy", link: "Core" },
    { name: "Aman Gupta", role: "Viewer", status: "Offline", link: "Node" }
  ];

  return (
    <MainLayout>
      <div className="max-w-[1400px] mx-auto pb-20 px-4">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">
              Team <span className="text-[#9dc183]">Space</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs mt-2">
              Collective Neural Synchronization
            </p>
          </div>

          <div className="flex items-center gap-4">
            <NeonButton className="bg-slate-800 text-[#9dc183] border-[#9dc183]/20 shadow-none">
              <UserPlus size={18} />
              Invite Member
            </NeonButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Feed Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                <Clock size={16} className="text-[#9dc183]" />
                Recent Activity Stream
              </h3>
              <button className="p-2 bg-white/5 rounded-xl border border-white/5 text-slate-500 hover:text-white transition-all">
                <Filter size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {feedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard className="p-0 overflow-hidden border-white/5 hover:border-[#9dc183]/30 transition-all duration-500 group">
                      <div className="flex items-center p-6 gap-6">
                        {/* Profile Photo */}
                        <div className="w-14 h-14 rounded-2xl bg-[#9dc183]/10 border border-[#9dc183]/20 flex items-center justify-center text-[#9dc183] font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
                          {item.avatar}
                        </div>

                        {/* Description */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-black text-white text-base">{item.user}</span>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">
                              {item.role}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm font-medium">
                            {item.action} <span className="text-white font-bold">"{item.target}"</span>
                          </p>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-col items-end gap-3 min-w-[120px]">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                            {item.time}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-slate-600 group-hover:text-cyan-400 transition-colors">
                              <MessageSquare size={14} />
                              <span className="text-[10px] font-bold">{item.comments}</span>
                            </div>
                            <button className="text-slate-700 hover:text-white transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button className="w-full py-4 rounded-2xl border border-dashed border-white/10 text-slate-600 font-black uppercase tracking-widest text-[10px] hover:bg-white/[0.02] hover:text-slate-400 transition-all">
              Synchronize Older Logs
            </button>
          </div>

          {/* Permissions Sidebar Section */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
              <ShieldCheck size={16} className="text-[#9dc183]" />
              Strategic Access Control
            </h3>

            <GlassCard className="p-6 bg-gradient-to-br from-[#1c2e1c]/40 to-transparent border-[#9dc183]/10">
              <div className="space-y-6">
                {teamMembers.map((member, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className={`w-2 h-2 rounded-full ${
                         member.status === 'Active' || member.status === 'Online' ? 'bg-[#30d158] shadow-[0_0_8px_rgba(48,209,88,0.5)]' : 
                         member.status === 'Busy' ? 'bg-orange-500' : 'bg-slate-700'
                       }`} />
                       <div>
                         <h4 className="text-sm font-bold text-white mb-0.5">{member.name}</h4>
                         <span className="text-[9px] font-black text-[#9dc183]/60 uppercase tracking-widest italic">{member.link}-NODE</span>
                       </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <PermissionBadge role={member.role} />
                      <button className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-white/5 border border-white/5 text-slate-600 hover:text-[#9dc183] transition-all">
                        <Settings size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                 <div className="p-4 rounded-2xl bg-[#9dc183]/5 border border-[#9dc183]/10">
                   <h5 className="text-[10px] font-black text-[#9dc183] uppercase tracking-widest mb-1 flex items-center gap-2">
                     <Shield size={12} />
                     Admin Insight
                   </h5>
                   <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest">
                     Cross-project synchronization is currently set to SECTOR-4 protocols.
                   </p>
                 </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-800 mb-4">
                 <Settings size={28} />
               </div>
               <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Space Infrastructure</h4>
               <p className="text-[10px] text-slate-800 uppercase tracking-widest font-bold">Configure team-wide synthesis limits and archival rules.</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function PermissionBadge({ role }) {
  const styles = {
    Admin: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400',
      icon: <Shield size={10} />
    },
    Editor: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      text: 'text-cyan-400',
      icon: <Edit3 size={10} />
    },
    Viewer: {
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20',
      text: 'text-slate-400',
      icon: <Eye size={10} />
    }
  };

  const style = styles[role] || styles.Viewer;

  return (
    <div className={`
      flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[9px] font-black uppercase tracking-widest
      shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.02),inset_2px_2px_4px_rgba(0,0,0,0.2)]
      ${style.bg} ${style.border} ${style.text}
    `}>
      {style.icon}
      {role}
    </div>
  );
}
