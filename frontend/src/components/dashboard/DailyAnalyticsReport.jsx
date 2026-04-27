import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Flame, Users, Lightbulb, Trophy, ScanLine } from 'lucide-react';
import api from '../../utils/api';

const DailyAnalyticsReport = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleGenerate = async () => {
    setIsScanning(true);
    
    // Simulate delay + fetch data
    const [_, response] = await Promise.all([
      new Promise(resolve => setTimeout(resolve, 2500)), // 2.5s delay
      api.get('/activity/today').catch(() => null)
    ]);
    
    if (response?.data) {
      setReportData(response.data);
    } else {
      // Fallback if failed
      setReportData({
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        focusTime: "0h 0m",
        tasks: 0,
        streak: "+0",
        collab: 0,
        timeline: [{ time: new Date().toLocaleTimeString(), event: "System active" }],
        insight: "Data unavailable.",
        score: "0/100"
      });
    }

    setIsScanning(false);
    setHasGenerated(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex justify-center items-center py-10 px-4 sm:px-6 relative">
      <AnimatePresence mode="wait">
        {!isScanning && !hasGenerated && (
          <motion.div
            key="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-2">
              <ScanLine size={32} />
            </div>
            <button
              onClick={handleGenerate}
              className="px-8 py-4 rounded-full bg-[var(--primary-text)] text-white font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl shadow-black/10"
            >
              Generate Report
            </button>
            <p className="text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-[0.2em]">Neural analytics standby</p>
          </motion.div>
        )}

        {isScanning && (
          <motion.div
            key="scan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]"
          >
            {/* Scanning Line Animation */}
            <motion.div 
              animate={{ top: ['-10%', '110%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] z-10"
            />
            
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-blue-500 mb-6"
            >
              <ScanLine size={48} />
            </motion.div>
            
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--primary-text)] mb-2 animate-pulse text-center">
              Scanning Neural Activity...
            </h3>
            <p className="text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-widest text-center">
              Compiling daily telemetry and extracting actionable insights. Please hold.
            </p>
          </motion.div>
        )}

        {hasGenerated && reportData && (
          <motion.div
            key="report"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/50"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="text-xl font-black uppercase tracking-widest text-[var(--primary-text)]">
                Daily Analytics Report
              </h2>
              <p className="text-sm font-bold text-[var(--muted-text)] mt-1 tracking-wider">
                {reportData.date}
              </p>
            </motion.div>

            {/* Summary Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex flex-col items-center p-4 rounded-2xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)]">
                <Clock size={20} className="text-blue-500 mb-2" />
                <span className="text-xs font-bold text-[var(--muted-text)] uppercase tracking-wider mb-1">Focus Time</span>
                <span className="text-lg font-black text-[var(--primary-text)]">{reportData.focusTime}</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-2xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)]">
                <CheckCircle size={20} className="text-emerald-500 mb-2" />
                <span className="text-xs font-bold text-[var(--muted-text)] uppercase tracking-wider mb-1">Tasks</span>
                <span className="text-lg font-black text-[var(--primary-text)]">{reportData.tasks}</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-2xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)]">
                <Flame size={20} className="text-orange-500 mb-2" />
                <span className="text-xs font-bold text-[var(--muted-text)] uppercase tracking-wider mb-1">Streak</span>
                <span className="text-lg font-black text-[var(--primary-text)]">{reportData.streak}</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-2xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)]">
                <Users size={20} className="text-purple-500 mb-2" />
                <span className="text-xs font-bold text-[var(--muted-text)] uppercase tracking-wider mb-1">Collab</span>
                <span className="text-lg font-black text-[var(--primary-text)]">{reportData.collab}</span>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary-text)] mb-4 flex items-center gap-2">
                Timeline
              </h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {reportData.timeline.map((item, index) => (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-[var(--bg-silk)]/30 border border-[var(--glass-border)] p-3 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[var(--primary-text)] uppercase tracking-wider">{item.event}</span>
                        <span className="text-[10px] font-bold text-[var(--muted-text)]">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Insight & Score */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <Lightbulb size={20} className="text-indigo-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Insight</p>
                  <p className="text-xs font-bold text-[var(--primary-text)] italic">"{reportData.insight}"</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-2">
                  <Trophy size={18} className="text-yellow-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Daily Score</span>
                </div>
                <span className="text-sm font-black text-[var(--primary-text)] tracking-wider">{reportData.score}</span>
              </div>
            </motion.div>

            {/* Reset Button */}
            <motion.div variants={itemVariants} className="mt-8 flex justify-center">
               <button 
                 onClick={() => { setHasGenerated(false); setReportData(null); }}
                 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)] hover:text-[var(--primary-text)] transition-colors"
               >
                 Close Report
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyAnalyticsReport;
