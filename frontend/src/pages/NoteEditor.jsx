import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X, 
  FileText, 
  Tag, 
  Grid, 
  Paperclip,
  Check,
  Star,
  Trash2,
  CheckCircle2,
  Plus,
  MinusCircle,
  BookOpen,
  Image as ImageIcon,
  File,
  Shield,
  Activity,
  Cpu,
  Layers,
  LayoutGrid
} from 'lucide-react';
import api from '../utils/api';
import MainLayout from '../components/MainLayout';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';

export default function NoteEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('work');
  const [assets, setAssets] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [type, setType] = useState('standard');
  const [todoItems, setTodoItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [relatedTasks, setRelatedTasks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // Load existing note or initialize demo data
  useEffect(() => {
    if (id && id !== 'new') {
      fetchNote();
    } else {
      // Initialize with demo data as requested: 'Project Alpha Roadmap'
      setTitle('Project Alpha Roadmap');
      setContent('## Phase 1: Neural Architecture\n- Scalable transformer layers\n- Real-time token synchronization\n- Contextual memory shards\n\n## Phase 2: Resonance Sync\n- Multi-terminal persistence\n- Latency mitigation protocols');
      setTags('ROADMAP, AI, CORE');
      setAssets([
        { _id: 'demo1', filename: 'Sprint_Report.pdf', fileType: 'pdf', size: 1258291 },
        { _id: 'demo2', filename: 'Pitch_Deck.ppt', fileType: 'ppt', size: 4718592 }
      ]);
    }
    fetchProjects();
  }, [id]);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchRelatedTasks();
    }
  }, [id]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects');
    }
  };

  const fetchRelatedTasks = async () => {
    try {
      const response = await api.get('/tasks');
      // Filter tasks related to this note
      const filtered = response.data.filter(t => t.notesId === id);
      setRelatedTasks(filtered);
    } catch (error) {
      console.error('Error fetching related tasks');
    }
  };

  const fetchNote = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/notes/${id}`);
      const note = response.data;
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags.join(', '));
      setCategory(note.category);
      setAssets(note.assets || []);
      setIsCompleted(note.isCompleted || false);
      setIsFavorite(note.isFavorite || false);
      setType(note.type || 'standard');
      setTodoItems(note.todoItems || []);
      setProjectId(note.projectId?._id || note.projectId || '');
    } catch (error) {
      toast.error('Neural retrieval failed');
      navigate('/notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const noteData = {
        title: title || 'Untitled resonance',
        content,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        category,
        isCompleted,
        isFavorite,
        type,
        todoItems,
        projectId: projectId || null
      };

      if (id && id !== 'new') {
        await api.put(`/notes/${id}`, noteData);
        toast.success('Resonance synchronized with vault');
      } else {
        const response = await api.post('/notes', noteData);
        toast.success('New insight captured! +40 XP');
        navigate(`/notes/${response.data.note._id}`, { replace: true });
      }
    } catch (error) {
      console.error('Save failure:', error);
      toast.error(error.parsedMessage || 'Synchronization barrier detected');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (id === 'new' || !id) {
      toast.info('Please save the note first to link assets');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('noteId', id);
    files.forEach(file => formData.append('files', file));

    try {
      await api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`${files.length} assets synchronized`);
      fetchNote(); // Reload to get updated assets
    } catch (error) {
      console.error('Upload failure:', error);
      toast.error(error.parsedMessage || 'Upload sequence interrupted');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#9dc183]/20 border-t-[#9dc183] rounded-full animate-spin shadow-[0_0_20px_rgba(157,193,131,0.2)]"></div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-[1400px] mx-auto pb-20 px-6">
        {/* Superior Control Bar */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/notes')}
            className="flex items-center gap-3 text-slate-500 hover:text-[#9dc183] transition-all font-black uppercase tracking-[0.3em] text-[10px]"
          >
            <ArrowLeft size={16} />
            Archival Matrix
          </button>
          
          <div className="flex items-center gap-6">
             <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-3 py-1.5 backdrop-blur-md">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2.5 rounded-xl transition-all ${isFavorite ? 'text-yellow-400 fill-current shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'text-slate-500 hover:text-white'}`}
                >
                  <Star size={20} />
                </button>
                <button
                  onClick={() => setIsCompleted(!isCompleted)}
                  className={`p-2.5 rounded-xl transition-all ${isCompleted ? 'text-[#9dc183] shadow-[0_0_15px_rgba(157,193,131,0.2)]' : 'text-slate-500 hover:text-white'}`}
                >
                  <CheckCircle2 size={20} />
                </button>
                <div className="w-[1px] h-6 bg-white/10 mx-2" />
                <button
                  onClick={async () => {
                    if (window.confirm('Erase this neural insight and all linked tasks from the vault?')) {
                       try {
                          await api.delete(`/notes/${id}`);
                          toast.success('Neural cluster purged');
                          navigate('/notes');
                       } catch (e) {
                          toast.error('Purge sequence failed');
                       }
                    }
                  }}
                  className="p-2.5 text-slate-500 hover:text-red-400 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
             </div>
          </div>
        </div>

        {/* Neural Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          
          {/* Main Intelligence Sector (Column 1-3) */}
          <div className="lg:col-span-3 space-y-10">
            <div className="bg-[#111827]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
              {/* Neomorphic Design Ornament */}
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#9dc183] to-transparent opacity-30 px-0.5" />
              
              <div className="space-y-12">
                <div className="flex items-center gap-4 text-slate-600 font-bold uppercase tracking-[0.5em] text-[10px]">
                  <Activity size={16} className="text-[#9dc183]" />
                  Internal Resonance: {id === 'new' ? 'ALPHA-SYNC' : 'STABLE-LINK'}
                </div>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Topic: Untitled Perception..."
                  className="w-full bg-transparent text-6xl font-black text-white outline-none border-none placeholder:text-slate-900 tracking-tighter"
                />

                {/* Requirement 2: Project Mapping Selection */}
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[9px]">
                      <LayoutGrid size={14} className="text-[#9dc183]" />
                      Project Context:
                   </div>
                   <select 
                     value={projectId || ''}
                     onChange={(e) => setProjectId(e.target.value)}
                     className="bg-white/5 border border-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none focus:border-[#9dc183]/30 transition-all cursor-pointer"
                   >
                      <option value="" className="bg-slate-950">Select Resonance Project (Optional)</option>
                      {Array.isArray(projects) && projects.map(p => (
                        <option key={p?._id} value={p?._id} className="bg-slate-950">{p?.title || 'Untitled Project'}</option>
                      ))}
                   </select>
                </div>

                <div className="flex flex-wrap gap-4">
                  {['standard', 'neural-todo', 'blueprint'].map(t => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
                        type === t 
                         ? 'bg-[#9dc183]/10 text-[#9dc183] border-[#9dc183]/30 shadow-[0_0_20px_rgba(157,193,131,0.1)]' 
                         : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {t.replace('-', ' ')} sector
                    </button>
                  ))}
                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Initialize intelligence stream..."
                  className="w-full min-h-[500px] bg-transparent outline-none resize-none text-xl text-slate-300 leading-relaxed placeholder:text-slate-800 font-medium font-inter"
                />
              </div>
            </div>

            {/* Neural Sync Pulsar */}
            <div className="flex flex-col items-center gap-6 pt-4">
               <motion.button
                 onClick={handleSave}
                 disabled={saving}
                 className={`btn-sage px-16 py-5 h-auto text-sm tracking-[0.3em] font-black group relative overflow-hidden animate-sage-pulse`}
               >
                 <motion.div 
                   className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                 />
                 <Save size={20} className="relative z-10 group-hover:rotate-12 transition-transform" />
                 <span className="relative z-10">{saving ? 'SYNCHRONIZING...' : 'SYNC TO VAULT'}</span>
               </motion.button>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 LAST SYNC: JULY 15, 2024, 4:32 PM | STATUS: <span className="text-[#9dc183]">OPTIMAL</span>
               </p>
            </div>
          </div>

          <div className="space-y-8">
            <GlassCard className="p-8 space-y-8 border-white/5 ring-1 ring-white/5">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 text-neon-purple">
                    <Paperclip size={18} />
                    Asset Vault
                  </h3>
                  <span className="text-[8px] font-black text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5 uppercase tracking-widest">
                    v2.4 Stable
                  </span>
                </div>
                
                {/* Category A: DOCUMENTS */}
                <div className="space-y-4">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] border-l-2 border-neon-purple pl-3">A: DOCUMENTS (PDF/PPT)</p>
                   <div className="space-y-3">
                      {assets.filter(a => ['pdf', 'ppt', 'pptx', 'document'].includes(a.fileType) || a.filename.endsWith('.ppt') || a.filename.endsWith('.pptx')).map((asset, i) => (
                         <motion.div 
                           key={asset._id || i}
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           className="group vault-embossed-sm p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden"
                         >
                            <a href={asset.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 relative z-10">
                               <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-inner">
                                  <FileText size={20} />
                               </div>
                               <div className="min-w-0 flex-1">
                                  <p className="text-[10px] font-black text-white truncate uppercase tracking-tight">{asset.filename}</p>
                                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{asset.size ? (asset.size/1024).toFixed(1) + ' KB' : 'Active Link'}</p>
                                </div>
                               <div className="w-6 h-6 rounded-lg bg-[#9dc183]/10 flex items-center justify-center">
                                  <CheckCircle2 size={12} className="text-[#9dc183]" />
                               </div>
                            </a>
                         </motion.div>
                      ))}
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       disabled={uploading}
                       className="w-full py-3 bg-white/5 border border-dashed border-white/10 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
                     >
                        <Upload size={14} className={`text-slate-600 group-hover:text-neon-purple ${uploading ? 'animate-bounce' : ''}`} />
                        <span className="text-[9px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest">
                          {uploading ? 'Archiving...' : 'Upload Docs'}
                        </span>
                     </button>
                     <input 
                       type="file" 
                       ref={fileInputRef} 
                       onChange={handleFileUpload} 
                       multiple 
                       className="hidden" 
                     />
                   </div>
                </div>

                {/* Category B: VISUAL FRAMES */}
                <div className="space-y-4">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] border-l-2 border-neon-purple pl-3">B: VISUAL FRAMES (IMG)</p>
                   <div className="grid grid-cols-2 gap-3">
                       {assets.filter(a => a.fileType === 'image' || ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(a.fileType)).map((asset, i) => (
                         <a 
                           key={asset._id || i} 
                           href={asset.url} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="aspect-square bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center overflow-hidden group cursor-pointer hover:border-[#9dc183]/30 transition-all relative"
                         >
                            <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                               <p className="text-[8px] font-black text-white uppercase truncate">{asset.filename}</p>
                            </div>
                         </a>
                       ))}
                      <div className="aspect-square border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-[#9dc183]/5 hover:border-[#9dc183]/30 transition-all group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                         <Upload size={20} className="text-slate-700 group-hover:text-[#9dc183]" />
                         <span className="text-[8px] font-black text-slate-600 group-hover:text-white uppercase tracking-tighter text-center px-1">Archive Image</span>
                      </div>
                   </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                   <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest text-center">
                     Last Modified: July 15, 2024, 4:32 PM
                   </p>
                </div>
              </div>

              {/* Requirement 2: Related Tasks Section */}
              <div className="pt-8 border-t border-white/5 space-y-8">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 text-[#9dc183]">
                      <CheckCircle2 size={18} />
                      Related Tasks
                    </h3>
                    <span className="text-[8px] font-black text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5 uppercase tracking-widest">
                      {relatedTasks.length} Active
                    </span>
                 </div>

                 <div className="space-y-4">
                    {relatedTasks.length > 0 ? (
                      relatedTasks.map((task, i) => (
                        <div 
                          key={task._id}
                          className="p-4 bg-[#111827]/30 border border-white/5 rounded-2xl flex items-center justify-between group cursor-default"
                        >
                           <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-[#9dc183]' : 'bg-slate-700'}`} />
                              <span className={`text-[10px] font-bold uppercase tracking-tight ${task.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                 {task.title}
                              </span>
                           </div>
                           <span className="text-[8px] font-black text-slate-600 uppercase">
                              {task.priority}
                           </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-3xl">
                         <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">No integrated tasks found</p>
                      </div>
                    )}

                    <NeonButton 
                      onClick={() => navigate('/tasks')}
                      className="w-full py-3 bg-white/5 border border-white/5 hover:border-[#9dc183]/30"
                    >
                       <span className="text-[9px] font-black text-slate-500 group-hover:text-white uppercase tracking-[0.2em]">Deploy New Task</span>
                    </NeonButton>
                 </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 block underline decoration-[#9dc183]/30 underline-offset-4">Sector Mapping</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['work', 'neural'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all ${
                          category === cat 
                            ? 'bg-[#9dc183] text-[#1c2e1c]' 
                            : 'bg-white/5 text-slate-500 hover:bg-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 block underline decoration-[#9dc183]/30 underline-offset-4">Resonance Tags</label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-[#9dc183]" size={14} />
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="MINDMAP, ALPHA..."
                      className="w-full bg-[#111827]/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-[10px] outline-none focus:border-[#9dc183]/50 transition-all font-black uppercase tracking-[0.2em]"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="bg-gradient-to-br from-[#9dc183]/10 to-transparent border-[#9dc183]/10">
               <h3 className="text-xs font-black text-[#9dc183] uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                 <Shield size={18} />
                 Neural Safety
               </h3>
               <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest">
                 Synchronized notes are encrypted using 256-bit neural protocols before being archived in the vault memory.
               </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
