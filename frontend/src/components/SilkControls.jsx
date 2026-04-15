import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Sliders } from 'lucide-react';
import { useSilk } from './SilkBackground';

/**
 * SilkControls — a floating panel (bottom-right) that lets users
 * change the Silk background color, speed, and noise in real-time.
 * Changes persist to localStorage immediately.
 */
export default function SilkControls() {
  const { color, setColor, speed, updateSpeed, noise, updateNoise, PRESETS } = useSilk();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '88px', right: '24px', zIndex: 1000 }}>
      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: 44, height: 44,
          borderRadius: 14,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(0,212,200,0.25)',
          backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          color: '#00d4c8',
          boxShadow: '0 0 18px rgba(0,212,200,0.12)',
        }}
        title="Silk Background Settings"
      >
        {open ? <X size={18} /> : <Palette size={18} />}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            style={{
              position: 'absolute', bottom: '52px', right: 0,
              width: 248,
              background: 'rgba(8,14,26,0.88)',
              border: '1px solid rgba(0,212,200,0.2)',
              borderRadius: 24,
              backdropFilter: 'blur(24px)',
              padding: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,212,200,0.07)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Sliders size={14} color="#00d4c8" />
              <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,212,200,0.8)' }}>
                Silk Background
              </span>
            </div>

            {/* Color Presets */}
            <p style={{ fontSize: 9, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
              Colour Preset
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {PRESETS.map(p => (
                <button
                  key={p.hex}
                  onClick={() => setColor(p.hex)}
                  title={p.label}
                  style={{
                    width: 28, height: 28,
                    borderRadius: 8,
                    background: p.hex,
                    border: `2px solid ${color === p.hex ? '#00d4c8' : 'rgba(255,255,255,0.1)'}`,
                    cursor: 'pointer',
                    boxShadow: color === p.hex ? '0 0 10px rgba(0,212,200,0.4)' : 'none',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>

            {/* Custom Color Picker */}
            <p style={{ fontSize: 9, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>
              Custom Colour
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                style={{ width: 40, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer' }}
              />
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#94a3b8' }}>{color}</span>
            </div>

            {/* Speed Slider */}
            <p style={{ fontSize: 9, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>
              Motion Speed — {speed.toFixed(1)}
            </p>
            <input
              type="range" min="0.5" max="10" step="0.5"
              value={speed}
              onChange={e => updateSpeed(Number(e.target.value))}
              style={{ width: '100%', marginBottom: 14, accentColor: '#00d4c8' }}
            />

            {/* Noise Slider */}
            <p style={{ fontSize: 9, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>
              Noise Intensity — {noise.toFixed(1)}
            </p>
            <input
              type="range" min="0" max="3" step="0.1"
              value={noise}
              onChange={e => updateNoise(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#8b5cf6' }}
            />

            <p style={{ fontSize: 9, color: '#334155', marginTop: 14, textAlign: 'center', fontStyle: 'italic' }}>
              Settings saved automatically
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
