import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = ({ children, mainClassName = '' }) => {
  return (
    <div className="flex min-h-screen overflow-hidden bg-[var(--bg-silk)] text-[var(--primary-text)] transition-colors duration-500">
      {/* Background Decor (Themed Soft Gradient) */}
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--bg-silk)] to-[var(--bg-card)] -z-10 transition-all duration-500" />

      {/* ── Navigation Shell ── */}
      <div className="z-50">
        <Sidebar />
      </div>

      {/* ── Primary Content Engine ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main
          className={`flex-1 ml-72 pt-20 relative overflow-y-auto ${mainClassName}`}
          style={{ zIndex: 5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.4, 0, 0.2, 1], // Standard easing for premium feel
                staggerChildren: 0.1
              }}
              className="p-8 max-w-[1600px] mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
