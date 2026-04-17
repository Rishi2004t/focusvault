import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  { name: "Alex R.", text: "This app changed my productivity 🚀", rating: 5 },
  { name: "Sarah K.", text: "The most beautiful dashboard I've ever used. 💎", rating: 5 },
  { name: "Mike D.", text: "Neural themes are next level! 🧠", rating: 5 },
  { name: "Jessica L.", text: "Finally a planner that feels alive. ⚡", rating: 5 },
  { name: "David M.", text: "FocusVault is my daily companion now. ❤️", rating: 5 },
  { name: "Emma W.", text: "The UI is just stunning and smooth. ✨", rating: 5 },
];

export default function FeedbackMarquee() {
  // Multiply reviews for seamless infinite scroll
  const items = [...REVIEWS, ...REVIEWS, ...REVIEWS];

  return (
    <div className="mt-24 mb-12">
      <div className="flex items-center gap-3 mb-10 px-4 sm:px-0">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-lg shadow-indigo-500/5 border border-indigo-500/20">
          <Quote size={20} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--primary-text)] tracking-tight italic">
            ✨ What Our Users Say
          </h2>
          <p className="text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-[0.2em] mt-1">
            Global Neural Feedback
          </p>
        </div>
      </div>

      <div className="relative w-full overflow-hidden pause-on-hover">
        {/* Subtle Fade Gradients for edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-[var(--bg-silk)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-[var(--bg-silk)] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee py-4">
          {items.map((review, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, scale: 1.02 }}
              className="flex-shrink-0 w-72 sm:w-80 p-6 rounded-[2rem] bg-[var(--bg-card)] border border-[var(--glass-border)] shadow-xl shadow-[var(--accent-glow)]/5 backdrop-blur-md relative overflow-hidden group transition-all duration-300"
            >
              {/* Card Glow Overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-glow)]/5 blur-3xl group-hover:bg-[var(--accent-glow)]/10 transition-colors pointer-events-none" />
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={12} className="fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              <p className="text-sm font-medium text-[var(--primary-text)] leading-relaxed mb-6 italic">
                "{review.text}"
              </p>

              <div className="flex items-center justify-between mt-auto border-t border-[var(--glass-border)] pt-4">
                <div>
                  <p className="text-[10px] font-black text-[var(--primary-text)] uppercase tracking-widest">{review.name}</p>
                  <p className="text-[8px] font-bold text-indigo-500/70 uppercase tracking-tighter mt-0.5">Verified Operative</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-500/30">
                  <Star size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
