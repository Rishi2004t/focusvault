import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-neon-purple/20 border-t-neon-purple rounded-full shadow-[0_0_20px_rgba(191,90,242,0.3)]"
        />
        
        {/* Inner Glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-neon-blue rounded-full blur-md opacity-50"
        />
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold tracking-[0.2em] text-white uppercase italic">
          Accessing <span className="neon-text-purple">Vault</span>
        </h2>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full bg-gradient-to-r from-transparent via-neon-purple to-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
