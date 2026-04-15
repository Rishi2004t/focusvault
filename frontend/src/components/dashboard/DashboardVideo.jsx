import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardVideo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[600px] mx-auto mb-16"
    >
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-white/80 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl group">
        
        {/* Subtle decorative glow from behind the video */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 z-0" />
        
        {/*
          The video element mapping to the provided user asset
        */}
        <video
          className="relative z-10 w-full h-full object-cover rounded-2xl"
          src="/icons/Firefly -A high-quality 3D animation of a frustrated young developer sitting in a messy room filled .mp4"
          autoPlay
          loop
          muted
          playsInline
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Premium floating glass effect border ring overlay */}
        <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none z-20" />
        
        {/* Corner elegant accents */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/30 to-transparent z-20 pointer-events-none rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/30 to-transparent z-20 pointer-events-none rounded-bl-2xl" />
      </div>
    </motion.div>
  );
}
