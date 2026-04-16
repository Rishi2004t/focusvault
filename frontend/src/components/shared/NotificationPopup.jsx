import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle2, ExternalLink, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationPopup = ({ notification, onClose }) => {
  const navigate = useNavigate();

  if (!notification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-[100] w-96 bg-white/80 backdrop-blur-xl border border-indigo-200 rounded-[2rem] shadow-2xl shadow-indigo-500/10 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
              <Bell size={24} className="animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Mission Alert</h3>
                <button 
                  onClick={onClose}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm font-bold text-slate-600 leading-snug mb-4">
                {notification.message}
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigate('/tasks');
                    onClose();
                  }}
                  className="flex-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  View Tasks <ExternalLink size={12} />
                </button>
                {notification.link && (
                  <a
                    href={notification.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                  >
                    Launch Link <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress bar timer */}
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 10, ease: 'linear' }}
          className="h-1 bg-indigo-500/30"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPopup;
