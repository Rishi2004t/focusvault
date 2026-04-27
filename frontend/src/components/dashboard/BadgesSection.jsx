import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Database, Target, Shield, Award, Lock } from 'lucide-react';

const iconMap = {
  Zap: <Zap size={24} />,
  Database: <Database size={24} />,
  Target: <Target size={24} />,
  Shield: <Shield size={24} />,
  Award: <Award size={24} />,
};

const BadgesSection = ({ allBadges = [], userBadges = [] }) => {
  return (
    <div className="mt-16 sm:mt-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
          <Award size={16} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary-text)] italic">Neural Achievements</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {allBadges.map((badge) => {
          const isUnlocked = userBadges?.some(ub => {
            const ubId = ub._id ? ub._id.toString() : ub.toString();
            return ubId === badge._id.toString();
          });
          
          return (
            <motion.div
              key={badge._id}
              whileHover={isUnlocked ? { y: -5, scale: 1.05 } : {}}
              className={`relative p-6 rounded-[2rem] border transition-all duration-500 ${
                isUnlocked 
                ? 'bg-[var(--bg-card)] border-yellow-500/30 shadow-lg shadow-yellow-500/5' 
                : 'bg-[var(--bg-silk)]/30 border-[var(--glass-border)] opacity-50 grayscale'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                  isUnlocked 
                  ? 'bg-yellow-500/10 text-yellow-500' 
                  : 'bg-slate-500/10 text-slate-500'
                }`}>
                  {isUnlocked ? iconMap[badge.icon] || <Award size={24} /> : <Lock size={24} />}
                </div>
                <h4 className={`text-xs font-black uppercase tracking-widest mb-1 ${
                  isUnlocked ? 'text-[var(--primary-text)]' : 'text-[var(--muted-text)]'
                }`}>
                  {badge.name}
                </h4>
                <p className="text-[9px] font-bold text-[var(--muted-text)] uppercase tracking-tighter">
                  {isUnlocked ? badge.description : `Unlock at ${badge.minPoints} XP`}
                </p>
              </div>

              {isUnlocked && (
                <div className="absolute top-3 right-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_var(--yellow-500)]" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesSection;
