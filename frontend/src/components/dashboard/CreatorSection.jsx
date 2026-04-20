import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Heart } from 'lucide-react';

const InstagramIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const LinkedinIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GithubIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const SocialLink = ({ href, icon: Icon, label, baseColorClass, hoverColorClass, glowClass }) => (
  <motion.a
    variants={itemVariants}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group/link relative p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:scale-[1.15] hover:-translate-y-2 block ${baseColorClass} ${hoverColorClass} ${glowClass}`}
  >
    <Icon size={24} />
    {/* Tooltip */}
    <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 backdrop-blur-md text-white text-xs font-semibold rounded-lg opacity-0 group-hover/link:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg z-50">
      {label}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
    </span>
  </motion.a>
);

export default function CreatorSection() {
  const socials = [
    { 
      href: "https://instagram.com/rishiiii1_", 
      icon: InstagramIcon, 
      label: "Instagram", 
      baseColorClass: "text-pink-500",
      hoverColorClass: "hover:bg-gradient-to-tr hover:from-pink-500 hover:to-orange-400 hover:text-white hover:border-transparent",
      glowClass: "hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]"
    },
    { 
      href: "https://youtube.com/@CodingWithRishi", 
      icon: YoutubeIcon, 
      label: "YouTube", 
      baseColorClass: "text-red-500",
      hoverColorClass: "hover:bg-red-500 hover:text-white hover:border-red-500",
      glowClass: "hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
    },
    { 
      href: "https://linkedin.com/in/rishi-thakur-dev", 
      icon: LinkedinIcon, 
      label: "LinkedIn", 
      baseColorClass: "text-blue-600",
      hoverColorClass: "hover:bg-blue-600 hover:text-white hover:border-blue-600",
      glowClass: "hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
    },
    { 
      href: "https://github.com/Rishi2004t", 
      icon: GithubIcon, 
      label: "GitHub", 
      baseColorClass: "text-slate-800",
      hoverColorClass: "hover:bg-slate-800 hover:text-white hover:border-slate-800",
      glowClass: "hover:shadow-[0_0_20px_rgba(30,41,59,0.3)]"
    },
    { 
      href: "https://rishithakur.portfolio.com", 
      icon: Globe, 
      label: "Portfolio", 
      baseColorClass: "text-indigo-500",
      hoverColorClass: "hover:bg-indigo-500 hover:text-white hover:border-indigo-500",
      glowClass: "hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
    },
  ];

  return (
    <div className="mt-28 mb-16 px-4 relative">
      {/* Horizontal Scrolling Marquee */}
      <div className="w-full overflow-hidden whitespace-nowrap mb-10 opacity-70 flex select-none pointer-events-none">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex whitespace-nowrap text-sm font-bold tracking-widest uppercase text-slate-500"
        >
          <span className="mx-4">Built for productivity <span className="text-indigo-400 mx-4">•</span> Real-time collaboration <span className="text-indigo-400 mx-4">•</span> Focus better daily <span className="text-indigo-400 mx-4">•</span> Architecting Digital Sanctuaries for the Modern Mind <span className="text-indigo-400 mx-4">•</span></span>
          <span className="mx-4">Built for productivity <span className="text-indigo-400 mx-4">•</span> Real-time collaboration <span className="text-indigo-400 mx-4">•</span> Focus better daily <span className="text-indigo-400 mx-4">•</span> Architecting Digital Sanctuaries for the Modern Mind <span className="text-indigo-400 mx-4">•</span></span>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto p-10 sm:p-14 rounded-[3rem] bg-[#f8fafc] backdrop-blur-2xl border border-white/80 text-center relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-700">
        
        {/* Animated Background Blobs */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-200/40 blur-[100px] rounded-full pointer-events-none" 
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-sky-200/40 blur-[100px] rounded-full pointer-events-none" 
        />

        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Badge */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-100 rounded-full text-slate-800 text-[11px] font-black uppercase tracking-[0.25em] italic shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Heart size={14} className="text-rose-500 fill-rose-500/20 animate-pulse" />
            Made with ❤️ by Rishi
          </motion.div>

          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-3xl mx-auto flex flex-col items-center"
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight italic mb-6 bg-gradient-to-br from-[#0f172a] to-indigo-900 bg-clip-text text-transparent drop-shadow-sm pb-2">
              Crafted to help you collaborate, focus, and build better every day <span className="not-italic opacity-90 inline-block drop-shadow-md">🚀</span>
            </h2>
            <p className="text-slate-600 font-bold text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.5em] leading-relaxed decoration-indigo-300/50 underline decoration-wavy underline-offset-8">
              Architecting Digital Sanctuaries for the Modern Mind
            </p>

            {/* Divider below subtitle */}
            <motion.div 
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-32 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mt-10 mb-2" 
            />
          </motion.div>

          {/* Social Links */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-5 sm:gap-6 mt-4 pt-2"
          >
            {socials.map((social, index) => (
              <SocialLink key={index} {...social} />
            ))}
          </motion.div>

          {/* Bottom decorative line */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-24 h-1.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full mt-6" 
          />
        </div>
      </div>
    </div>
  );
}
