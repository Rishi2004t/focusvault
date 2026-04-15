export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#6366f1',
        'secondary': '#8b5cf6',
        'accent': '#ec4899',
        'neon-purple': '#bf5af2',
        'neon-blue': '#0a84ff',
        'neon-green': '#30d158',
        'sage-green': '#9dc183',
        'sage-dark': '#2d3b2d',
        'glass-bg': 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'theme-text': 'var(--primary-text)',
        'theme-secondary': 'var(--secondary-text)',
        'theme-accent': 'var(--accent-glow)',
        'theme-bg': 'var(--bg-silk)',
      },
      fontFamily: {
        'sans': ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-glow': '0 0 15px rgba(99, 102, 241, 0.5)',
        'neon-purple-glow': '0 0 20px rgba(191, 90, 242, 0.4)',
        'sage-glow': '0 0 20px rgba(157, 193, 131, 0.4)',
        'sage-glow-lg': '0 0 40px rgba(157, 193, 131, 0.3)',
      },
      animation: {
        'sage-pulse': 'sage-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'sage-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(157, 193, 131, 0.4)' },
          '70%': { boxShadow: '0 0 0 12px rgba(157, 193, 131, 0)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
};
