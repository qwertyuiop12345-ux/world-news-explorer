'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { WorldMap } from '@/features/map/components/WorldMap';
import { CountryPanel } from '@/features/news/components/CountryPanel';
import { useAppContext } from '@/context/AppContext';

export default function Home() {
  const { isDarkMode, selectedCountry } = useAppContext();
  const [hint, setHint] = useState(true);

  // Sync dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Auto-hide hint
  useEffect(() => {
    const t = setTimeout(() => setHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: isDarkMode
          ? 'radial-gradient(ellipse at 50% 0%, #0f2044 0%, #060d1f 60%, #000 100%)'
          : 'linear-gradient(160deg, #e8f0fe 0%, #f0f4ff 50%, #f8f0ff 100%)',
      }}
    >
      {/* Header — 80px tall, fixed, z=9999 */}
      <Header />

      {/* Map — fills the space below header */}
      <div style={{ position: 'absolute', top: 80, left: 0, right: 0, bottom: 0 }}>
        <WorldMap />
      </div>

      {/* Country panel — slides in from right */}
      <AnimatePresence>
        {selectedCountry && <CountryPanel />}
      </AnimatePresence>

      {/* Hint — fades out after 5s */}
      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 1 }}
            style={{
              position: 'fixed',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 50,
              pointerEvents: 'none',
            }}
          >
            <div style={{
              padding: '10px 22px',
              borderRadius: 40,
              background: isDarkMode ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.85)',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap',
              fontSize: 13,
              color: isDarkMode ? '#cbd5e1' : '#475569',
            }}>
              <span style={{ fontWeight: 700, color: isDarkMode ? '#fff' : '#000' }}>Click a country</span>
              {' to read news · '}
              <span style={{ color: '#3b82f6' }}>scroll to zoom</span>
              {' · '}
              <span style={{ color: '#8b5cf6' }}>drag to pan</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
