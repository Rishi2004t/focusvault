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

const SocialLink = ({ href, icon: Icon, label, colorClass, glowClass }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[var(--muted-text)] hover:text-white transition-all duration-300 hover:scale-[1.15] hover:-translate-y-1 block ${colorClass} ${glowClass}`}
    title={label}
  >
    <Icon size={22} />
  </a>
);

export default function CreatorSection() {
  const socials = [
    { 
      href: "https://instagram.com/rishiiii1_", 
      icon: InstagramIcon, 
      label: "Instagram", 
      colorClass: "hover:text-pink-500 hover:border-pink-500/30",
      glowClass: "hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
    },
    { 
      href: "https://youtube.com/@CodingWithRishi", 
      icon: YoutubeIcon, 
      label: "YouTube", 
      colorClass: "hover:text-red-500 hover:border-red-500/30",
      glowClass: "hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
    },
    { 
      href: "https://linkedin.com/in/rishi-thakur-dev", 
      icon: LinkedinIcon, 
      label: "LinkedIn", 
      colorClass: "hover:text-blue-500 hover:border-blue-500/30",
      glowClass: "hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
    },
    { 
      href: "https://github.com/Rishi2004t", 
      icon: GithubIcon, 
      label: "GitHub", 
      colorClass: "hover:text-white hover:border-white/30",
      glowClass: "hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
    },
    { 
      href: "https://rishithakur.portfolio.com", 
      icon: Globe, 
      label: "Portfolio", 
      colorClass: "hover:text-indigo-400 hover:border-indigo-400/30",
      glowClass: "hover:shadow-[0_0_20px_rgba(129,140,248,0.3)]"
    },
  ];

  return (
    <div className="mt-20 mb-8 px-4">
      <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-[2.5rem] bg-[var(--bg-card)]/40 backdrop-blur-2xl border border-[var(--glass-border)] text-center relative overflow-hidden group shadow-2xl shadow-indigo-500/5">
        {/* Abstract Background Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 blur-[120px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-1000" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[var(--accent-glow)]/5 blur-[120px] rounded-full group-hover:bg-[var(--accent-glow)]/10 transition-all duration-1000" />

        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Badge */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
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
    </div>
  );
}
