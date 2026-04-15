import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import MoodLock from '../components/soul/MoodLock';
import SoulDashboard from '../components/soul/SoulDashboard';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function SoulVault() {
  const [status, setStatus] = useState({ isSetup: false, isLocked: true, isLoading: true });
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await api.get('/soul/status');
        setStatus({
          isSetup: data.isSetup,
          isLocked: data.isLocked,
          isLoading: false
        });
      } catch (err) {
        setStatus(s => ({ ...s, isLoading: false }));
        console.error('Failed to check soul status', err);
      }
    };
    checkStatus();
  }, []);

  if (status.isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
           <div className="w-12 h-12 rounded-full border-2 border-[var(--accent-glow)]/30 border-t-[var(--accent-glow)] animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-0">
        {(!status.isSetup || status.isLocked) && (
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500">
               <ShieldCheck size={20} />
             </div>
             <div>
               <h1 className="text-2xl font-black text-[var(--primary-text)] tracking-tight italic">Soul Vault</h1>
               <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)] mt-1">End-to-End Encrypted Neural Space</p>
             </div>
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {(!status.isSetup || status.isLocked) ? (
            <motion.div
              key="lock"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <MoodLock 
                isSetup={!status.isSetup} 
                onUnlock={() => setStatus(s => ({ ...s, isLocked: false, isSetup: true }))} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="vault"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SoulDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
