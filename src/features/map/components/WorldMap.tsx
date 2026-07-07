'use client';

// WorldMap wraps LeafletMap in a dynamic import so leaflet (which
// references window / document) is never evaluated on the server.

import dynamic from 'next/dynamic';
import { useAppContext } from '@/context/AppContext';
import { Loader2 } from 'lucide-react';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <MapLoadingScreen />,
});

export const WorldMap = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <LeafletMap />
    </div>
  );
};

// ── Loading screen while leaflet bundle loads ─────────────────────────────
function MapLoadingScreen() {
  const { isDarkMode } = useAppContext();

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: isDarkMode
        ? 'radial-gradient(ellipse at 50% 40%, #0f2044 0%, #060d1f 70%)'
        : 'radial-gradient(ellipse at 50% 40%, #dbeafe 0%, #eff6ff 70%)',
    }}>
      {/* Animated globe rings */}
      <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 20 }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: i * 10,
              borderRadius: '50%',
              border: `2px solid ${isDarkMode ? 'rgba(59,130,246,' : 'rgba(59,130,246,'}${0.6 - i * 0.15})`,
              animation: `spin ${1.2 + i * 0.4}s linear infinite`,
            }}
          />
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>
          🌍
        </div>
      </div>

      <p style={{
        fontSize: 15, fontWeight: 600,
        color: isDarkMode ? '#93c5fd' : '#2563eb',
        marginBottom: 6,
      }}>
        Loading World Map
      </p>
      <p style={{ fontSize: 12, color: isDarkMode ? '#475569' : '#94a3b8' }}>
        Powered by Stadia Maps
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
