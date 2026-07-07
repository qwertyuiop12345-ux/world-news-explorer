'use client';

import { Search, Moon, Sun, Globe2, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { searchCountries } from '@/data/countries';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Country } from '@/types';

export const Header = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    setSelectedCountry,
    setMapCenter,
    setMapZoom,
  } = useAppContext();

  // Local search state — completely independent of context to avoid stale closures
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Run search whenever query changes
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length >= 1) {
      const found = searchCountries(trimmed);
      setResults(found);
      setIsOpen(found.length > 0);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Select a country from results
  const handleSelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    setMapCenter(country.coordinates);
    setMapZoom(4);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
  }, [setSelectedCountry, setMapCenter, setMapZoom]);

  // Clear search
  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        zIndex: 9999,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.75)',
        borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* ── Logo ── */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}
        >
          <div style={{ position: 'relative' }}>
            <Globe2 style={{ width: 32, height: 32, color: '#3B82F6' }} />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                position: 'absolute',
                inset: -4,
                borderRadius: '50%',
                background: 'rgba(59,130,246,0.25)',
                filter: 'blur(8px)',
                pointerEvents: 'none',
              }}
            />
          </div>
          <h1 style={{
            fontSize: 20,
            fontWeight: 800,
            background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            whiteSpace: 'nowrap',
          }}>
            World News Explorer
          </h1>
        </motion.div>

        {/* ── Search ── */}
        <div ref={containerRef} style={{ flex: 1, maxWidth: 600, position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 18,
              height: 18,
              color: '#6B7280',
              pointerEvents: 'none',
            }} />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => { if (results.length > 0) setIsOpen(true); }}
              placeholder="Search countries..."
              style={{
                width: '100%',
                height: 44,
                paddingLeft: 42,
                paddingRight: query ? 40 : 14,
                borderRadius: 14,
                border: isDarkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                color: isDarkMode ? '#fff' : '#111',
                fontSize: 15,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />

            {/* Clear button */}
            {query && (
              <button
                onClick={handleClear}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 2,
                  color: '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            )}
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {isOpen && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 6,
                  backgroundColor: isDarkMode ? '#111827' : '#fff',
                  border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 16,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                  maxHeight: 380,
                  overflowY: 'auto',
                  zIndex: 99999,
                }}
              >
                {results.map((country, i) => (
                  <motion.div
                    key={country.code}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleSelect(country)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: i < results.length - 1
                        ? isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'
                        : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.backgroundColor = isDarkMode
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(0,0,0,0.04)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <span style={{ fontSize: 28, lineHeight: 1 }}>{country.flag}</span>
                    <div>
                      <div style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: isDarkMode ? '#F9FAFB' : '#111827',
                      }}>
                        {country.name}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: isDarkMode ? '#9CA3AF' : '#6B7280',
                        marginTop: 1,
                      }}>
                        {country.capital} · {country.region}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Theme Toggle ── */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          style={{
            flexShrink: 0,
            width: 44,
            height: 44,
            borderRadius: 12,
            border: isDarkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDarkMode ? '#FBBF24' : '#6B7280',
          }}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <AnimatePresence mode="wait">
            {isDarkMode ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex' }}
              >
                {/* Show Sun when in dark mode (click to go light) */}
                <Sun style={{ width: 20, height: 20 }} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex' }}
              >
                {/* Show Moon when in light mode (click to go dark) */}
                <Moon style={{ width: 20, height: 20 }} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

      </div>
    </motion.header>
  );
};
