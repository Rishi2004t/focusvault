import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  File, 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Trash2, 
  Search,
  ExternalLink,
  Filter
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import MainLayout from '../components/MainLayout';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';

export default function FileManager() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      // Fetches assets directly from the new Asset Vault API
      const response = await api.get('/upload/assets');
      setFiles(response.data);
    } catch (error) {
      console.error('Vault access failure:', error);
      toast.error(error.parsedMessage || 'Failed to load file library');
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (assetId) => {
    if (!window.confirm('Are you sure you want to delete this file from the vault?')) return;
    try {
      await api.delete(`/upload/assets/${assetId}`);
      setFiles(prev => prev.filter(f => f._id !== assetId));
      toast.success('Asset purged from vault');
    } catch (error) {
      console.error('Asset purge failure:', error);
      toast.error(error.parsedMessage || 'Failed to delete file');
    }
  };

  const getFileIcon = (type) => {
    if (type?.includes('image')) return <ImageIcon className="text-pink-400" size={24} />;
    if (type?.includes('pdf')) return <FileText className="text-red-400" size={24} />;
    if (type?.includes('ppt') || type?.includes('presentation')) return <File className="text-orange-400" size={24} />;
    return <File className="text-blue-400" size={24} />;
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'image' && file.fileType?.includes('image')) ||
                         (filter === 'pdf' && file.fileType?.includes('pdf')) ||
                         (filter === 'doc' && (file.fileType?.includes('doc') || file.fileType?.includes('ppt')));
    return matchesSearch && matchesFilter;
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Asset <span className="neon-text-blue">Library</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium uppercase tracking-[0.2em] text-[10px]">
              Manage your linked intelligence assets
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-neon-blue transition-colors" size={18} />
              <input
                type="text"
                placeholder="Locate asset..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-neon pl-10 py-2 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {['all', 'image', 'pdf', 'doc'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                filter === type 
                  ? 'bg-neon-blue text-white shadow-neon-glow border border-neon-blue/30' 
                  : 'bg-white/5 text-slate-500 border border-white/10 hover:bg-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-card h-48 shimmer rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file, index) => (
                  <motion.div
                    key={file._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassCard className="h-full group hover:border-neon-blue/30 p-5 flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                          {getFileIcon(file.fileType)}
                        </div>
                        <div className="flex gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => deleteFile(file._id)}
                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4 flex-1 overflow-hidden">
                        <h3 className="font-bold text-sm text-white truncate mb-1" title={file.filename}>
                          {file.filename}
                        </h3>
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest truncate">
                          Synced via: {file.noteId?.title || 'Standalone Asset'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <a 
                          href={file.url} 
                          download={file.filename}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <NeonButton variant="glass" className="w-full py-2 text-[10px] gap-1 shadow-none">
                            <Download size={14} />
                            GET
                          </NeonButton>
                        </a>
                        <a 
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-neon-blue hover:bg-neon-blue/10 hover:border-neon-blue/30 transition-all">
                            <ExternalLink size={14} />
                          </div>
                        </a>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <File size={32} className="text-slate-800" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-600">No assets detected</h2>
                  <p className="text-slate-700 text-sm mt-2 font-medium">Link files to your notes to see them here.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
