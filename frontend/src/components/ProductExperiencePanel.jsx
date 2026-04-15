import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, FileText, CheckCircle2, Database, Users, 
  ArrowRight, ShieldCheck, Zap, Maximize 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductExperiencePanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [demoState, setDemoState] = useState(0);

  // Animation Variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } },
    exit: { opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1], // Custom spring-like easing
        staggerChildren: 0.1 
      } 
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const features = [
    { icon: <FileText size={28} />, title: "Neural Notes", desc: "Markdown powered intelligence with real-time sync.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: <CheckCircle2 size={28} />, title: "Smart Tasks", desc: "Prioritize workflows with AI-assisted focus modes.", color: "text-green-500", bg: "bg-green-500/10" },
    { icon: <Database size={28} />, title: "Asset Vault", desc: "Securely store files in a decentralized neomorphic grid.", color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: <Users size={28} />, title: "Collaboration", desc: "Seamlessly align your team with shared intelligence.", color: "text-rose-500", bg: "bg-rose-500/10" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Frosted Glass Overlay - explicit bright white glass look */}
          <div 
            className="absolute inset-0 bg-white/70 backdrop-blur-2xl transition-all"
            onClick={onClose}
          />

          {/* Main Content Modal */}
          <motion.div 
            className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white/60 border border-white/50 shadow-[0_0_80px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row backdrop-blur-3xl"
            variants={containerVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-black/5 hover:bg-black/10 text-gray-800 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            {/* Left Column: Hero & Benefits */}
            <div className="flex-1 p-10 md:p-16 flex flex-col justify-center overflow-y-auto no-scrollbar border-r border-black/5">
              <motion.div variants={itemVariants} className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold tracking-widest uppercase text-[10px]">
                <Sparkles size={14} /> Product Experience
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                Welcome to <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">FocusVault</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 font-medium mb-12 max-w-lg leading-relaxed">
                Your second brain for productivity. Master your tasks, secure your assets, and expand your neural notes in an environment designed for absolute focus.
              </motion.p>

              {/* Benefits Section */}
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Stay Organized</h3>
                    <p className="text-gray-500 mt-1 leading-relaxed">Eliminate mental clutter. The unified dashboard brings all your crucial data into a single, cohesive perspective.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 shrink-0">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Laser Focus</h3>
                    <p className="text-gray-500 mt-1 leading-relaxed">Our AI tools analyze your workflow, dynamically adjusting your environment to maximize deep work states.</p>
                  </div>
                </div>
              </motion.div>

              {/* CTA Section */}
              <motion.div variants={itemVariants} className="mt-16">
                <button 
                  onClick={() => {
                    navigate('/dashboard');
                    onClose();
                  }}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Organizing Your Life <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                </button>
              </motion.div>
            </div>

            {/* Right Column: Features Grid & Interactive Demo */}
            <div className="flex-1 bg-gradient-to-br from-gray-50/50 to-gray-100/50 p-10 md:p-16 flex flex-col justify-center overflow-y-auto no-scrollbar relative">
              
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Core Arsenal</h2>
                <p className="text-gray-500 font-medium">Everything you need to orchestrate greatness.</p>
              </motion.div>

              {/* Grid */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                {features.map((f, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer group"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                      {f.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{f.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Interactive Demo Area */}
              <motion.div variants={itemVariants} className="relative p-8 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-black/5 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  <Maximize size={18} className="text-blue-500" /> Interactive Demo
                </h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-4">Click to simulate syncing a Neural Note.</p>
                    <button 
                      onClick={() => setDemoState(prev => (prev === 0 ? 1 : 0))}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${
                        demoState === 1 
                          ? 'bg-green-100 text-green-700 pointer-events-none' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg shadow-blue-500/30'
                      }`}
                    >
                      {demoState === 1 ? 'Note Synced!' : 'Sync Note'}
                    </button>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="relative w-24 h-24">
                    <motion.div 
                      className="absolute inset-0 border-4 border-gray-100 rounded-full"
                    />
                    <motion.svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                      <motion.circle 
                        cx="50" cy="50" r="46" 
                        fill="transparent" 
                        stroke={demoState === 1 ? "#10b981" : "#3b82f6"} 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 300" }}
                        animate={{ strokeDasharray: demoState === 1 ? "300 300" : "0 300" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </motion.svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        {demoState === 1 ? (
                          <motion.div 
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", delay: 0.4 }}
                            className="text-green-500"
                          >
                            <CheckCircle2 size={32} />
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="dot"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-4 h-4 rounded-full bg-gray-300"
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {demoState === 1 && (
                  <button 
                    onClick={() => setDemoState(0)} 
                    className="absolute top-4 right-4 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </motion.div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
