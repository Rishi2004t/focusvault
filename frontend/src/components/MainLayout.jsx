import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = ({ children, mainClassName = '' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--bg-silk)] text-[var(--primary-text)] transition-colors duration-500 relative overflow-x-hidden">
      {/* Background Decor (Themed Soft Gradient) */}
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--bg-silk)] to-[var(--bg-card)] -z-10 transition-all duration-500" />

      {/* ── Navigation Shell ── */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* ── Primary Content Engine ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main
          className={`flex-1 lg:ml-72 pt-16 sm:pt-20 relative px-4 sm:px-6 lg:px-8 max-w-full overflow-x-hidden ${mainClassName}`}
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
                ease: [0.4, 0, 0.2, 1],
              }}
              className="py-4 sm:py-8 lg:py-10 max-w-[1600px] mx-auto w-full px-2 sm:px-0"
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
