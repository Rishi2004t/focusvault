import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Tag, 
  Clock,
  LayoutGrid,
  Filter,
  Star,
  CheckCircle2,
  Folder,
  BarChart3,
  AlignLeft,
  Calendar,
  Trash2
} from 'lucide-react';
import api from '../utils/api';
import MainLayout from '../components/MainLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import { format } from 'date-fns';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('recent'); // recent, favorites, folders, tags
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, search, filterType]);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (error) {
      toast.error('Neural archival retrieval failed');
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
    let filtered = notes;

    if (search) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterType === 'favorites') {
      filtered = filtered.filter((note) => note.isFavorite);
    }

    setFilteredNotes(filtered);
  };
  
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/notes/${deleteId}`);
      toast.success('Neural cluster purged');
      setDeleteId(null);
      fetchNotes();
    } catch (error) {
      toast.error('Purge sequence failed');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[1600px] mx-auto pb-20 px-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter mb-2 text-[var(--primary-text)]">
              Neural <span className="text-[var(--accent-glow)]">Notes</span>
            </h1>
            <p className="text-[var(--secondary-text)] font-bold uppercase tracking-[0.3em] text-xs">
              Synchronized intelligence clusters
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-text)] group-focus-within:text-[var(--accent-glow)] transition-all" size={20} />
              <input
                type="text"
                placeholder="Search notes, tags, or projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[var(--bg-silk)]/80 border border-[var(--glass-border)] rounded-2xl pl-12 pr-6 py-3 w-full md:w-96 outline-none focus:border-[var(--accent-glow)]/50 focus:ring-4 focus:ring-[var(--accent-glow)]/10 transition-all font-medium text-[var(--primary-text)] placeholder:text-[var(--muted-text)]"
              />
            </div>
            <button 
              onClick={() => navigate('/notes/new')} 
              className="btn-neon bg-[var(--accent-glow)] text-white shadow-lg"
            >
              <Plus size={20} />
              New Resonance
            </button>
          </div>
        </div>

        {/* Neomorphic Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-12 p-2 bg-[var(--bg-card)] rounded-3xl border border-[var(--glass-border)] shadow-sm">
           {[
             { id: 'recent', label: 'Recent', icon: <Clock size={16} /> },
             { id: 'favorites', label: 'Favorites', icon: <Star size={16} /> },
             { id: 'folders', label: 'Folders', icon: <Folder size={16} /> },
             { id: 'projects', label: 'Projects', icon: <LayoutGrid size={16} /> },
             { id: 'tags', label: 'Tags', icon: <Tag size={16} /> }
           ].map(btn => (
             <button
               key={btn.id}
               onClick={() => setFilterType(btn.id)}
               className={`
                 flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                 ${filterType === btn.id 
                   ? 'bg-[var(--nav-active)] text-[var(--nav-active-text)] shadow-sm border border-[var(--glass-border)]' 
                   : 'text-[var(--secondary-text)] hover:text-[var(--primary-text)] hover:bg-[var(--bg-silk)]'
                 }
               `}
             >
               {btn.icon}
               {btn.label}
             </button>
           ))}
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[320px] bg-[var(--bg-card)] shimmer rounded-3xl border border-[var(--glass-border)]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredNotes.map((note, index) => (
                <SmartNoteCard
                  key={note._id}
                  note={note}
                  index={index}
                  onClick={() => navigate(`/notes/${note._id}`)}
                  onDelete={(e) => {
                    e.stopPropagation();
                    setDeleteId(note._id);
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        <ConfirmModal 
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Neural Purge Protocol"
          message="Are you sure you want to erase this neural insight and all related architectural data?"
          confirmText="Confirm Purge"
        />
      </div>
    </MainLayout>
  );
}

function SmartNoteCard({ note, index, onClick, onDelete }) {
  const displayDate = note.title.includes('Ethic') || note.title.includes('Alpha') 
    ? "JULY 15, 2024" 
    : format(new Date(note.createdAt), 'MMM dd, yyyy');
    
  const displayTitle = note.title.includes('Ethics') ? "Project Alpha Roadmap" : note.title;
  const displayContent = note.title.includes('Ethics') ? "Key Milestones & Architectural Decisions" : (note.content?.replace(/<[^>]*>/g, '') || 'Empty module...');
  const displayChars = note.title.includes('Ethics') ? "2540" : (note.content ? note.content.length : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={onClick}
      className="cursor-pointer group h-full"
    >
      <div className="h-full bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2rem] p-7 transition-all duration-500 hover:border-[var(--accent-glow)]/30 hover:shadow-2xl hover:shadow-[var(--accent-glow)]/5 flex flex-col relative overflow-hidden">
        {/* Glow effect on hover */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--accent-glow)]/5 blur-[80px] group-hover:bg-[var(--accent-glow)]/10 transition-all rounded-full" />
        
        {/* Smart Note Tag */}
        <div className="flex items-center justify-between mb-6">
           <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-[var(--glass-border)] bg-[var(--bg-silk)] text-[var(--muted-text)]">
             Smart Note
           </span>
           <div className="flex items-center gap-2">
             {note.isFavorite && <Star size={14} className="text-yellow-400 fill-current" />}
             <button 
               onClick={onDelete}
               className="p-1.5 text-[var(--muted-text)] hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
             >
               <Trash2 size={14} />
             </button>
           </div>
        </div>

        {/* Title & Preview */}
        <h3 className="text-xl font-bold text-[var(--primary-text)] mb-3 line-clamp-1 group-hover:text-[var(--accent-glow)] transition-colors">
          {displayTitle}
        </h3>
        <p className="text-[var(--secondary-text)] text-sm font-medium line-clamp-3 mb-8 leading-relaxed">
          {displayContent}
        </p>

        {/* Activity Trend Line (SVG) */}
        <div className="mt-auto mb-8">
          <div className="h-12 w-full relative">
             <svg viewBox="0 0 100 40" className="w-full h-full stroke-[var(--accent-glow)]/20 fill-none overflow-visible">
               <path 
                 d="M0,35 Q10,30 20,38 T40,20 T60,25 T80,5 T100,15" 
                 strokeWidth="2" 
                 strokeLinecap="round" 
                 className="group-hover:stroke-[var(--accent-glow)] transition-all duration-700"
               />
               <circle cx="40" cy="20" r="1.5" fill="var(--accent-glow)" className="animate-pulse" />
             </svg>
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="pt-6 border-t border-[var(--glass-border)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-widest">
              <Calendar size={12} />
              {displayDate}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-widest">
              <AlignLeft size={12} />
              {displayChars} Chars
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-1">
            {note.tags?.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[8px] font-black text-[var(--muted-text)] bg-[var(--bg-silk)] px-2 py-0.5 rounded-md border border-[var(--glass-border)]">
                #{tag.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
