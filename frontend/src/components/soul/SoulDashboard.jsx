import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😎', label: 'Motivated' },
];

export default function SoulDashboard() {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState(MOODS[3].emoji); // Default Calm
  const [saving, setSaving] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const fetchEntries = async () => {
    try {
      const { data } = await api.get('/soul/entries');
      setEntries(data);
    } catch (err) {
      console.error('Failed to fetch soul entries', err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await api.post('/soul/entries', { content, emotion });
      toast.success('Entry written in diary');
      setContent('');
      setSelectedEntry(null);
      fetchEntries();
    } catch (error) {
      toast.error('Failed to write entry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[85vh] gap-8 animate-fade-in relative z-10 p-6 -m-4 rounded-3xl notebook-desk">
      
      {/* Archive / Left Panel */}
      <div className="w-full lg:w-80 flex flex-col pt-4 pr-4 border-r border-[#eae2d3]">
         <div className="pb-6 px-2 flex items-center justify-between">
            <h3 className="text-3xl font-handwritten text-ink tracking-wide">My Diary</h3>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 px-2 pb-8">
            {entries.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-40 text-ink-muted opacity-60">
                  <span className="text-xl font-handwritten">No entries yet...</span>
               </div>
            ) : entries.map(entry => (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 key={entry._id}
                 onClick={() => setSelectedEntry(entry)}
                 className={`p-4 cursor-pointer notebook-card ${selectedEntry?._id === entry._id ? 'notebook-card-active' : ''}`}
               >
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-2xl opacity-90">{entry.emotion}</span>
                     <span className="text-base font-handwritten text-ink-muted">
                        {format(new Date(entry.timestamp), 'MMM d, yyyy')}
                     </span>
                  </div>
                  <p className="text-[14px] text-ink line-clamp-3 leading-relaxed mt-2 opacity-85" style={{ fontFamily: 'Georgia, serif' }}>
                     {entry.content}
                  </p>
               </motion.div>
            ))}
         </div>
      </div>
      
      {/* Writing Area / Notebook Page */}
      <div className="flex-1 notebook-paper relative h-full">

        {/* Absolute Background Lines */}
        <div className="notebook-lines-bg" />
        <div className="notebook-margin-line" />

        {/* Date and Time Header */}
        <div className="absolute top-[1.4rem] right-10 text-right select-none z-20 pointer-events-none">
            <p className="text-2xl font-handwritten text-ink-muted leading-none">
               {selectedEntry ? format(new Date(selectedEntry.timestamp), 'EEEE, MMMM do, yyyy') : format(new Date(), 'EEEE, MMMM do, yyyy')}
            </p>
            <p className="text-lg font-handwritten text-ink-muted opacity-70 mt-1">
               {selectedEntry ? format(new Date(selectedEntry.timestamp), 'h:mm a') : format(new Date(), 'h:mm a')}
            </p>
        </div>

        {/* Editor or View Mode Container */}
        {selectedEntry ? (
          <div className="absolute inset-0 z-10 overflow-y-auto custom-scrollbar">
             <span className="text-5xl opacity-90 absolute top-4 left-[5.5rem]">{selectedEntry.emotion}</span>
             <p className="text-[18px] text-ink whitespace-pre-wrap font-medium m-0" style={{ lineHeight: '2.8rem', padding: '5.6rem 10% 2.8rem 5.5rem' }}>
                {selectedEntry.content}
             </p>
             <div className="pl-[5.5rem] mt-auto pb-8 z-20 relative">
                 <button 
                   onClick={() => setSelectedEntry(null)}
                   className="font-handwritten text-2xl text-ink-muted hover:text-ink transition-colors pb-1 border-b-2 border-transparent hover:border-ink"
                 >
                   ← Turn page to write
                 </button>
             </div>
          </div>
        ) : (
          <>
            <div className="absolute top-[2.4rem] left-[5.5rem] z-20 flex gap-4 pointer-events-auto h-[2.8rem] items-center">
             {MOODS.map(m => (
               <button
                 key={m.label}
                 onClick={() => setEmotion(m.emoji)}
                 className={`text-3xl transition-all duration-300 ${emotion === m.emoji ? 'scale-125 opacity-100 drop-shadow-sm' : 'opacity-30 hover:opacity-80 hover:scale-110 grayscale hover:grayscale-0'}`}
                 title={m.label}
               >
                 {m.emoji}
               </button>
             ))}
            </div>

            <textarea
              className="textarea-notebook custom-scrollbar"
              placeholder="Dear diary..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck="false"
            />
            
            <div className="absolute bottom-[2.8rem] right-10 z-20 pointer-events-auto flex justify-end">
               <button
                 onClick={handleSave}
                 disabled={saving || !content.trim()}
                 className={`font-handwritten text-3xl flex items-center gap-2 transition-all duration-300 ${content.trim() ? 'text-ink hover:scale-[1.03]' : 'text-ink-muted opacity-40 cursor-not-allowed'}`}
               >
                 {saving ? 'Writing...' : 'Close book →'}
               </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
