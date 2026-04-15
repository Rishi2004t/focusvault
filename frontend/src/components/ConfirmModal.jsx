import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Purge Protocol", 
  message = "Are you sure you want to erase this data from the vault?", 
  confirmText = "Confirm Purge",
  isLoading = false,
  showCheckbox = false,
  checkboxLabel = "Erase linked resources?",
  checkboxValue = false,
  onCheckboxChange = () => {}
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] backdrop-blur-md bg-slate-950/20 flex items-center justify-center p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="max-w-md w-full vault-embossed p-10 rounded-[2.5rem] bg-[#F1EFE7] border border-white/20"
          >
             <div className="flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-full bg-red-400/10 flex items-center justify-center text-red-500 shadow-inner">
                   <AlertTriangle size={32} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-black vault-text italic tracking-tighter">{title}</h3>
                  <p className="text-xs font-bold text-[#8E8A7D] leading-relaxed uppercase tracking-widest px-4">
                    {message}
                  </p>
                </div>

                {showCheckbox && (
                  <label className="flex items-center gap-4 group cursor-pointer p-4 vault-debossed rounded-2xl w-full transition-all hover:bg-[#EAE8DD]">
                     <input 
                       type="checkbox" 
                       checked={checkboxValue} 
                       onChange={(e) => onCheckboxChange(e.target.checked)}
                       className="hidden"
                     />
                     <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${checkboxValue ? 'bg-red-500 border-red-500 shadow-lg' : 'border-[#cccaae]'}`}>
                        {checkboxValue && <Check size={14} className="text-white" />}
                     </div>
                     <span className="text-[10px] font-black vault-text uppercase tracking-widest">{checkboxLabel}</span>
                  </label>
                )}

                <div className="flex gap-4 w-full pt-4">
                   <button 
                     onClick={onClose}
                     disabled={isLoading}
                     className="flex-1 py-4 vault-embossed-sm rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-black transition-all active:scale-95 disabled:opacity-50"
                   >
                     Abort Sync
                   </button>
                   <button 
                     onClick={onConfirm}
                     disabled={isLoading}
                     className="flex-1 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10 active:scale-95 disabled:opacity-50"
                   >
                     {isLoading ? 'PURGING...' : confirmText}
                   </button>
                </div>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
