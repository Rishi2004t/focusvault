import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Silk from './Silk';
import { useTheme } from '../context/ThemeContext';

const SilkContext = createContext(null);

const PRESETS = [
  { label: 'Midnight Indigo', hex: '#0a0f1a' },
  { label: 'Deep Forest',     hex: '#071410' },
  { label: 'Charcoal Smoke',  hex: '#111118' },
  { label: 'Velvet Purple',   hex: '#0d0812' },
  { label: 'Teal Abyss',      hex: '#060f12' },
  { label: 'Crimson Night',   hex: '#120810' },
];

const THEME_BG_MAP = {
  'light': '#ffffff',
  'perpetuity': '#f0fdfa',
  'cyberpunk': '#fdf2f8',
  'midnight-indigo': '#f5f3ff',
  'lime-fusion': '#f7fee7',
  'sky-blue': '#f0f9ff',
  'cherry-blossom': '#fff1f2',
  'sunset-amber': '#fffbeb',
  'forest-phantom': '#f0fdf4',
  'royal-velvet': '#faf5ff',
  'crimson-void': '#fef2f2',
  'electric-violet': '#f5f3ff',
  'monochrome-pro': '#f8fafc',
  'pastel-dreams': '#fdf2f8',
};

export function SilkProvider({ children }) {
  const saved = localStorage.getItem('silk_color') || '#0a0f1a';
  const [color, setColorRaw]  = useState(saved);
  const [speed, setSpeed]     = useState(Number(localStorage.getItem('silk_speed')) || 5);
  const [noise, setNoise]     = useState(Number(localStorage.getItem('silk_noise')) || 1.2);

  const setColor = useCallback((hex) => {
    setColorRaw(hex);
    localStorage.setItem('silk_color', hex);
  }, []);

  const updateSpeed = useCallback((v) => {
    setSpeed(v);
    localStorage.setItem('silk_speed', v);
  }, []);

  const updateNoise = useCallback((v) => {
    setNoise(v);
    localStorage.setItem('silk_noise', v);
  }, []);

  return (
    <SilkContext.Provider value={{ color, setColor, speed, updateSpeed, noise, updateNoise, PRESETS }}>
      {children}
    </SilkContext.Provider>
  );
}

export function useSilk() {
  return useContext(SilkContext);
}

export default function SilkBackground() {
  const { color, setColor, speed, noise } = useSilk();
  const { theme } = useTheme();

  const isLight = theme !== 'dark'; // Treat all accent themes as light mode by default

  // Sync background color with neural theme
  useEffect(() => {
    const targetColor = THEME_BG_MAP[theme] || '#ffffff';
    if (targetColor !== color) {
      setColor(targetColor);
    }
  }, [theme, color, setColor]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Silk
        color={color}
        speed={speed}
        scale={1}
        noiseIntensity={noise}
        rotation={0}
      />
      {/* Dynamic neural overlay: Uses white for light themes to maintain luminosity */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          background: isLight ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,var(--overlay-opacity, 0.6))',
          transition: 'background 0.8s ease'
        }} 
      />
    </div>
  );
}
