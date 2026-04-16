import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  FileText, 
  Image as ImageIcon, 
  Monitor, 
  Calendar, 
  ArrowUpRight,
  Shield,
  Download,
  Trash2,
  MoreVertical,
  Zap,
  PlusCircle,
  Upload as UploadIcon,
  Eye,
  X,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-toastify';
import MainLayout from '../components/MainLayout';
import api from '../utils/api';
import ConfirmModal from '../components/ConfirmModal';
import GlassCard from '../components/GlassCard';


const AssetVault = () => {
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [previewAsset, setPreviewAsset] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [cascadeNote, setCascadeNote] = useState(true);
  const fileInputRef = React.useRef(null);

  const filters = ['All', 'PDF Documents', 'Visual Frames', 'Slide Decks', 'Other'];

  React.useEffect(() => {
    fetchAssets();
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
      if (response.data.length > 0) {
        setSelectedNoteId(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching notes');
    }
  };

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/upload/assets');
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast.error(error.parsedMessage || 'Failed to load vault assets');
    } finally {
      setLoading(false);
    }
  };

  const handleVaultUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      await api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      toast.success(`${files.length} Neural Nodes successfully integrated`);
      fetchAssets();
      fetchNotes(); // Sync notes list as new ones were created
    } catch (error) {
      console.error('❌ Sync failure detected:', error);
      toast.error('Sync failure detected during upload');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/upload/assets/${deleteConfirm._id}?cascadeNote=${cascadeNote}`);
      toast.success(`Asset ${cascadeNote ? 'and linked note ' : ''}purged from vault`);
      setDeleteConfirm(null);
      fetchAssets();
    } catch (error) {
      console.error('Purge failure:', error);
      toast.error(error.parsedMessage || 'Purge sequence failed');
    }
  };

  const handleDownload = (asset) => {
    // Neural Proxy Download: Bypasses transformation blocks and CORS
    // Using a direct GET link to the proxy endpoint with token for auth
    const token = localStorage.getItem('authToken');
    const apiBase = import.meta.env.VITE_API_URL || 'https://backend-06et.onrender.com';
    const downloadUrl = `${apiBase}/upload/download/${asset._id}?token=${token}`;
    
    // We open in a new window, the server responds with attachment headers, browser downloads it
    window.open(downloadUrl, '_blank');
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || asset.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const categories = activeFilter === 'All' ? filters.slice(1) : [activeFilter];

  const getIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText size={20} className="text-slate-600" />;
      case 'image': return <ImageIcon size={20} className="text-slate-600" />;
      case 'ppt': return <Monitor size={20} className="text-slate-600" />;
      default: return <FileText size={20} className="text-slate-600" />;
    }
  };

  return (
    <MainLayout bgColor="bg-[#F1EFE7]" mainClassName="vault-theme">
      <div className="max-w-7xl mx-auto py-6 px-4">
        
        {/* Header Area */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg vault-embossed-sm flex items-center justify-center">
                <Shield size={16} className="text-[#8E8A7D]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8E8A7D]">Secure Storage</span>
            </div>
            <h1 className="text-5xl font-black vault-text tracking-tighter italic">Asset <span className="opacity-50">Vault</span></h1>
          </div>


          <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
             {/* Target Note Selector */}
             <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Target Note:</span>
                <select 
                  value={selectedNoteId}
                  onChange={(e) => setSelectedNoteId(e.target.value)}
                  className="bg-white/5 border border-white/5 vault-text text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none focus:border-[#8E8A7D]/30 transition-all cursor-pointer"
                >
                   {notes.map(n => (
                     <option key={n._id} value={n._id}>{n.title}</option>
                   ))}
                   {notes.length === 0 && <option value="">No Notes Found</option>}
                </select>
             </div>

             <button 
               onClick={() => fileInputRef.current?.click()}
               disabled={uploading}
               className="flex items-center gap-3 px-8 py-3.5 rounded-2xl vault-embossed hover:vault-debossed transition-all group disabled:opacity-50"
             >
                <UploadIcon size={18} className={`text-[#8E8A7D] group-hover:text-black ${uploading ? 'animate-bounce' : ''}`} />
                <span className="text-xs font-black text-[#8E8A7D] group-hover:text-black uppercase tracking-[0.2em]">{uploading ? 'Archiving...' : 'Upload Docs'}</span>
             </button>
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleVaultUpload} 
               multiple 
               className="hidden" 
             />

             {/* Deep Search */}
             <div className="relative group min-w-[320px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cccaae] group-focus-within:text-[#8E8A7D] transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Deep Search Assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl vault-debossed outline-none vault-text font-bold text-sm placeholder-[#cccaae]"
                />
             </div>
          </div>
        </header>

        {/* Neural Archival Progress (Neomorphic Feedback) */}
        <AnimatePresence>
          {uploading && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <div className="vault-debossed p-8 rounded-[3rem] bg-white/40 border border-[#cccaae]/20">
                <div className="flex justify-between items-center mb-6 px-2">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
                     <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#8E8A7D]">Neural Archival in Progress</span>
                  </div>
                  <span className="text-sm font-black vault-text italic tracking-tighter">{uploadProgress}% Complete</span>
                </div>
                <div className="h-6 w-full vault-debossed p-1.5 rounded-full bg-white/60">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${uploadProgress}%` }}
                     className="h-full bg-gradient-to-r from-slate-400 to-slate-950 rounded-full shadow-lg relative overflow-hidden"
                   >
                      <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                   </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-6 mb-12">
          <div className="flex items-center gap-2 text-[#8E8A7D] mr-4">
            <Filter size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Filter By</span>
          </div>
          <div className="flex gap-4">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeFilter === filter 
                  ? 'vault-debossed text-[#8E8A7D]' 
                  : 'vault-embossed-sm text-[#8E8A7D]/60 hover:text-[#8E8A7D]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Categorized Grid */}
        <div className="space-y-16">
          {categories.map(category => {
            const categoryAssets = filteredAssets.filter(a => a.category === category);
            if (categoryAssets.length === 0) return null;

            return (
              <section key={category}>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#cccaae] whitespace-nowrap">{category}</h2>
                  <div className="h-[1px] w-full bg-[#cccaae]/30" />
                  <span className="vault-embossed-sm px-3 py-1 rounded-full text-[9px] font-black text-[#8E8A7D]">{categoryAssets.length}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <AnimatePresence>
                    {categoryAssets.map((asset, index) => (
                      <motion.div
                        key={asset._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="group"
                      >
                        <div className="vault-embossed p-6 rounded-[2.5rem] relative overflow-hidden transition-all duration-500 hover:-translate-y-2">
                           <div className="flex justify-between items-start mb-10">
                              <div className="w-14 h-14 rounded-2xl vault-debossed flex items-center justify-center p-3">
                                {getIcon(asset.fileType)}
                              </div>
                              <button className="p-2 text-[#cccaae] hover:text-[#8E8A7D] transition-colors rounded-xl vault-embossed-sm opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                                <MoreVertical size={16} />
                              </button>
                           </div>

                           <div className="mb-8">
                              <h3 className="font-black vault-text text-sm break-all leading-tight mb-2 tracking-tight group-hover:text-black transition-colors">
                                {asset.filename}
                              </h3>
                              <div className="flex items-center gap-2 text-[#8a8870]">
                                <Calendar size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-tighter">
                                  {/* Requirement 1: Note Context Visibility */}
                                  Synced via: {asset.noteId?.title || 'External Source'}
                                </span>
                              </div>
                           </div>

                           <div className="pt-6 border-t border-[#cccaae]/20 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#8E8A7D]" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-[#8E8A7D]">Neural Linked</span>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => setPreviewAsset(asset)}
                                  className="p-2 vault-embossed-sm rounded-xl text-[#8E8A7D] hover:scale-110 active:scale-95 transition-all"
                                >
                                  <Eye size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDownload(asset)}
                                  className="p-2 vault-embossed-sm rounded-xl text-[#8E8A7D] hover:scale-110 active:scale-95 transition-all"
                                >
                                  <Download size={14} />
                                </button>
                                <button 
                                  onClick={() => setDeleteConfirm(asset)}
                                  className="p-2 vault-embossed-sm rounded-xl text-red-400/60 hover:text-red-500 hover:scale-110 active:scale-95 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                           </div>
                           
                           {/* Hover overlay hint */}
                           <div className="absolute top-4 right-4 text-[8px] font-black text-[#cccaae] uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                              Vault ID: {asset._id}
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAssets.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 vault-debossed rounded-full flex items-center justify-center mb-8 opacity-50">
                <Zap size={32} className="text-[#8E8A7D]" />
             </div>
             <h2 className="text-2xl font-black vault-text mb-2">No Matches Found</h2>
             <p className="text-sm font-bold text-[#8E8A7D] uppercase tracking-widest">Adjust your deep search or filters</p>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Neural Purge Protocol"
        message={`Are you sure you want to erase ${deleteConfirm?.filename} from the vault?`}
        confirmText="Confirm Purge"
        showCheckbox={true}
        checkboxLabel="Erase Linked Neural Note?"
        checkboxValue={cascadeNote}
        onCheckboxChange={setCascadeNote}
      />

      {/* Neural Preview Portal V2 (Advanced Professional Edition) */}
      <AnimatePresence>
        {previewAsset && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] backdrop-blur-[20px] bg-slate-950/60 flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="w-full h-full max-w-[90vw] max-h-[90vh] bg-[#F1EFE7] rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col md:flex-row"
            >
               {/* Metadata Sidebar (Professional Edge) */}
               <aside className="w-full md:w-80 bg-white/30 border-r border-[#cccaae]/20 p-8 flex flex-col gap-10">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl vault-embossed flex items-center justify-center text-[#8E8A7D]">
                       {getIcon(previewAsset.fileType)}
                    </div>
                    <h3 className="text-lg font-black vault-text break-words tracking-tighter leading-tight">
                      {previewAsset.filename}
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#8E8A7D]">Neural Linkage</span>
                      <p className="text-[10px] font-bold text-black uppercase">
                        {previewAsset.noteId?.title || 'Standalone Node'}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#8E8A7D]">Spectral Size</span>
                      <p className="text-[10px] font-bold text-black lowercase">
                        {(previewAsset.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#8E8A7D]">Archival Date</span>
                      <p className="text-[10px] font-bold text-black">
                        {new Date(previewAsset.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-[#cccaae]/20 flex flex-col gap-4">
                     <button 
                       onClick={() => handleDownload(previewAsset)}
                       className="w-full py-4 vault-embossed-sm rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:text-black transition-all"
                     >
                       <Download size={14} /> Download
                     </button>
                     <button 
                       onClick={() => setPreviewAsset(null)}
                       className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-[#8E8A7D] hover:text-red-500 transition-all"
                     >
                       Close Portal
                     </button>
                  </div>
               </aside>

               {/* Projection Zone */}
               <main className="flex-1 bg-white/10 relative">
                  <div className="absolute top-6 right-6 z-10">
                    <button 
                      onClick={() => setPreviewAsset(null)}
                      className="p-3 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/40 transition-all"
                    >
                      <X size={20} className="text-[#8E8A7D]" />
                    </button>
                  </div>

                   <div className="w-full h-full p-4 md:p-12">
                     <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-inner border border-[#cccaae]/10 bg-white/50">
                        {previewAsset.fileType === 'pdf' ? (
                          <object 
                            data={`${previewAsset.url}#toolbar=0`} 
                            type="application/pdf"
                            className="w-full h-full border-none" 
                          >
                            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900/5 text-center gap-4">
                              <p className="text-sm font-bold text-[#8E8A7D]">Browser plugin required to view PDF inline.</p>
                              <button onClick={() => handleDownload(previewAsset)} className="px-6 py-3 bg-white shadow-xl rounded-xl text-xs font-black uppercase text-black">Download PDF</button>
                            </div>
                          </object>
                        ) : ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'].includes(previewAsset.fileType) ? (
                          <iframe 
                            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewAsset.url)}`}
                            className="w-full h-full border-none"
                            title="Neural Document Projection"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-8 bg-slate-900/5 shadow-inner">
                             <img 
                               src={previewAsset.url} 
                               alt="Neural Visual" 
                               className="max-w-full max-h-full object-contain rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)]" 
                             />
                          </div>
                        )}
                     </div>
                  </div>
               </main>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default AssetVault;
