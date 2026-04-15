import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, CheckSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { 
      icon: <FileText size={20} />, 
      label: 'New Note', 
      onClick: () => { navigate('/notes/new'); setIsOpen(false); },
      color: 'bg-purple-500'
    },
    { 
      icon: <CheckSquare size={20} />, 
      label: 'Task Matrix', 
      onClick: () => { navigate('/tasks'); setIsOpen(false); },
      color: 'bg-blue-500'
    },
    { 
      icon: <Plus size={20} />, 
      label: 'Vault Upload', 
      onClick: () => { navigate('/files'); setIsOpen(false); },
      color: 'bg-emerald-500'
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col gap-4 mb-4 items-end">
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="bg-[var(--bg-card)] px-3 py-1.5 rounded-lg text-[10px] font-bold text-[var(--secondary-text)] border border-[var(--glass-border)] shadow-xl uppercase tracking-widest pointer-events-none transition-colors">
                  {action.label}
                </span>
                <button
                  onClick={action.onClick}
                  className={`w-12 h-12 rounded-xl ${action.color} text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all`}
                >
                  {action.icon}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-[var(--muted-text)] rotate-90' : 'bg-[var(--brand-gradient)]'
        }`}
      >
        {isOpen ? <X size={26} /> : <Plus size={26} />}
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
