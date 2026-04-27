import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Flame, Users, Lightbulb, Trophy } from 'lucide-react';

const DailyAnalyticsReport = ({
  date = "April 27, 2026",
  focusTime = "2h 40m",
  tasks = 6,
  streak = "+1",
  collab = 3,
  timeline = [
    { time: "10:00", event: "Task Added" },
    { time: "11:30", event: "Focus Started" },
    { time: "01:00", event: "Code Saved" },
    { time: "07:00", event: "Task Completed" },
  ],
  insight = "You were most productive in afternoon",
  score = "92/100"
}) => {
  return (
    <div className="flex justify-center items-center py-10 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/50"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-black uppercase tracking-widest text-[var(--primary-text)]">
            Daily Analytics Report
          </h2>
          <p className="text-sm font-bold text-[var(--muted-text)] mt-1 tracking-wider">
            {date}
          </p>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)]">
            <Clock size={20} className="text-blue-500 mb-2" />
            <span className="text-xs font-bold text-[var(--muted-text)] uppercase tracking-wider mb-1">Focus Time</span>
            <span className="text-lg font-black text-[var(--primary-text)]">{focusTime}</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)]">
            <CheckCircle size={20} className="text-emerald-500 mb-2" />
            <span className="text-xs font-bold text-[var(--muted-text)] uppercase tracking-wider mb-1">Tasks</span>
            <span className="text-lg font-black text-[var(--primary-text)]">{tasks}</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)]">
            <Flame size={20} className="text-orange-500 mb-2" />
            <span className="text-xs font-bold text-[var(--muted-text)] uppercase tracking-wider mb-1">Streak</span>
            <span className="text-lg font-black text-[var(--primary-text)]">{streak}</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-[var(--bg-silk)]/50 border border-[var(--glass-border)]">
            <Users size={20} className="text-purple-500 mb-2" />
            <span className="text-xs font-bold text-[var(--muted-text)] uppercase tracking-wider mb-1">Collab</span>
            <span className="text-lg font-black text-[var(--primary-text)]">{collab}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary-text)] mb-4 flex items-center gap-2">
            Timeline
          </h3>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {timeline.map((item, index) => (
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
        </div>

        {/* Insight & Score */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <Lightbulb size={20} className="text-indigo-500 shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Insight</p>
              <p className="text-xs font-bold text-[var(--primary-text)] italic">"{insight}"</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Daily Score</span>
            </div>
            <span className="text-sm font-black text-[var(--primary-text)] tracking-wider">{score}</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default DailyAnalyticsReport;
