import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Linkedin, Github, Globe, Heart } from 'lucide-react';

const SocialLink = ({ href, icon: Icon, label, colorClass, glowClass }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.15, y: -5 }}
    whileTap={{ scale: 0.95 }}
    className={`p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[var(--muted-text)] hover:text-white transition-all duration-300 ${colorClass} ${glowClass}`}
    title={label}
  >
    <Icon size={22} strokeWidth={1.5} />
  </motion.a>
);

export default function CreatorSection() {
  const socials = [
    { 
      href: "https://instagram.com", 
      icon: Instagram, 
      label: "Instagram", 
      colorClass: "hover:text-pink-500 hover:border-pink-500/30",
      glowClass: "hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
    },
    { 
      href: "https://youtube.com", 
      icon: Youtube, 
      label: "YouTube", 
      colorClass: "hover:text-red-500 hover:border-red-500/30",
      glowClass: "hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
    },
    { 
      href: "https://linkedin.com", 
      icon: Linkedin, 
      label: "LinkedIn", 
      colorClass: "hover:text-blue-500 hover:border-blue-500/30",
      glowClass: "hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
    },
    { 
      href: "https://github.com/Rishi2004t", 
      icon: Github, 
      label: "GitHub", 
      colorClass: "hover:text-white hover:border-white/30",
      glowClass: "hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
    },
    { 
      href: "#", 
      icon: Globe, 
      label: "Portfolio", 
      colorClass: "hover:text-indigo-400 hover:border-indigo-400/30",
      glowClass: "hover:shadow-[0_0_20px_rgba(129,140,248,0.3)]"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="mt-32 mb-16 px-4"
    >
      <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-[2.5rem] bg-[var(--bg-card)]/40 backdrop-blur-2xl border border-[var(--glass-border)] text-center relative overflow-hidden group shadow-2xl shadow-indigo-500/5">
        {/* Abstract Background Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 blur-[120px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-1000" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[var(--accent-glow)]/5 blur-[120px] rounded-full group-hover:bg-[var(--accent-glow)]/10 transition-all duration-1000" />

        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Badge */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2.5 px-5 py-2 bg-[var(--bg-silk)]/80 border border-[var(--glass-border)] rounded-full text-[var(--primary-text)] text-[10px] font-black uppercase tracking-[0.25em] italic shadow-sm"
          >
            <Heart size={14} className="text-rose-500 fill-rose-500/20 animate-pulse" />
            Made with ❤️ by Rishi
          </motion.div>

          {/* Text Content */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--primary-text)] leading-tight tracking-tight italic mb-6">
              Crafted to help you collaborate, focus, and build better every day <span className="not-italic">🚀</span>
            </h2>
            <p className="text-[var(--muted-text)] font-bold text-[11px] uppercase tracking-[0.4em] leading-relaxed opacity-70">
              Architecting Digital Sanctuaries for the Modern Mind
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-5 mt-4">
            {socials.map((social, index) => (
              <SocialLink key={index} {...social} />
            ))}
          </div>

          {/* Bottom decorative line */}
          <div className="w-12 h-1 bg-gradient-to-r from-transparent via-[var(--glass-border)] to-transparent rounded-full mt-4" />
        </div>
      </div>
    </motion.div>
  );
}
