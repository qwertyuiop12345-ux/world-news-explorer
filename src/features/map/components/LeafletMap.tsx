'use client';

// This component is loaded ONLY on the client (no SSR) via dynamic import in WorldMap.tsx
// Leaflet requires the browser's window object, so it must never run on the server.

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { countriesData } from '@/data/countries';
import { CountryTooltip } from './CountryTooltip';

// Fix leaflet's broken default icon paths in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const STADIA_KEY = process.env.NEXT_PUBLIC_STADIA_MAPS_KEY;

// ── Zoom / pan sync ──────────────────────────────────────────────────────────
const ZoomSync = () => {
  const map = useMap();
  const { mapZoom, setMapZoom, mapCenter, setMapCenter } = useAppContext();
  const prevCenter = useRef<[number, number]>([0, 20]);

  useMapEvents({
    zoomend: () => setMapZoom(map.getZoom()),
    moveend: () => {
      const c = map.getCenter();
      setMapCenter([c.lng, c.lat]);
    },
  });

  // Fly to country when context center/zoom changes (search / header click)
  useEffect(() => {
    const [lng, lat] = mapCenter;
    const [pLng, pLat] = prevCenter.current;
    if (Math.abs(lng - pLng) > 0.001 || Math.abs(lat - pLat) > 0.001) {
      map.flyTo([lat, lng], mapZoom, { duration: 1.2 });
      prevCenter.current = [lng, lat];
    }
  }, [mapCenter, mapZoom, map]);

  return null;
};

// ── Country flag markers ─────────────────────────────────────────────────────
const CountryMarkers = () => {
  const {
    setSelectedCountry,
    setMapCenter,
    setMapZoom,
    selectedCountry,
    isDarkMode,
  } = useAppContext();
  const map = useMap();
  const markersRef = useRef<L.Marker[]>([]);
  const [tooltip, setTooltip] = useState<{
    country: string;
    capital: string;
    population: number;
    region: string;
    flag: string;
  } | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    countriesData.forEach(country => {
      const [lng, lat] = country.coordinates;
      const isSelected = selectedCountry?.code === country.code;

      const icon = L.divIcon({
        className: '',
        html: `<div style="
            width:${isSelected ? 36 : 28}px;
            height:${isSelected ? 36 : 28}px;
            border-radius:50%;
            background:${isSelected ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : isDarkMode ? 'rgba(71,85,105,0.9)' : 'rgba(203,213,225,0.9)'};
            border:${isSelected ? '3px solid #fff' : '2px solid rgba(255,255,255,0.6)'};
            display:flex;align-items:center;justify-content:center;
            font-size:${isSelected ? 18 : 14}px;
            cursor:pointer;
            box-shadow:${isSelected ? '0 0 0 6px rgba(59,130,246,0.3),0 4px 20px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)'};
            transform:${isSelected ? 'scale(1.2)' : 'scale(1)'};
          ">${country.flag}</div>`,
        iconSize: isSelected ? [36, 36] : [28, 28],
        iconAnchor: isSelected ? [18, 18] : [14, 14],
      });

      const marker = L.marker([lat, lng], {
        icon,
        zIndexOffset: isSelected ? 1000 : 0,
      });

      marker.on('mouseover', (e: L.LeafletMouseEvent) => {
        setTooltip({
          country: country.name,
          capital: country.capital,
          population: country.population,
          region: country.region,
          flag: country.flag,
        });
        setMouse({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
      });

      marker.on('mousemove', (e: L.LeafletMouseEvent) => {
        setMouse({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
      });

      marker.on('mouseout', () => setTooltip(null));

      marker.on('click', () => {
        setSelectedCountry(country);
        setMapCenter(country.coordinates);
        setMapZoom(5);
        map.flyTo([lat, lng], 5, { duration: 1 });
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
    };
  }, [selectedCountry, isDarkMode, map, setSelectedCountry, setMapCenter, setMapZoom]);

  return (
    <AnimatePresence>
      {tooltip && <CountryTooltip data={tooltip} x={mouse.x} y={mouse.y} />}
    </AnimatePresence>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
export default function LeafletMap() {
  const { isDarkMode, mapZoom, setMapZoom, setMapCenter } = useAppContext();

  const tileUrl = isDarkMode
    ? `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${STADIA_KEY}`
    : `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${STADIA_KEY}`;

  const btnStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: 12,
    border: isDarkMode
      ? '1px solid rgba(255,255,255,0.15)'
      : '1px solid rgba(0,0,0,0.12)',
    background: isDarkMode
      ? 'rgba(15,23,42,0.92)'
      : 'rgba(255,255,255,0.92)',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  };

  const handleZoomIn  = () => setMapZoom(Math.min(mapZoom + 1, 10));
  const handleZoomOut = () => setMapZoom(Math.max(mapZoom - 1, 2));
  const handleReset   = () => { setMapCenter([0, 20]); setMapZoom(2); };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        zoomControl={false}
        attributionControl={false}
        style={{
          width: '100%',
          height: '100%',
          background: isDarkMode ? '#0f172a' : '#dbeafe',
        }}
        worldCopyJump
      >
        <TileLayer
          key={isDarkMode ? 'dark' : 'light'}
          url={tileUrl}
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          maxZoom={20}
        />
        <ZoomSync />
        <CountryMarkers />
      </MapContainer>

      {/* Zoom controls */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 32,
          zIndex: 9000,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          style={btnStyle} onClick={handleZoomIn} title="Zoom in">
          <Plus size={18} strokeWidth={2.5} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          style={btnStyle} onClick={handleZoomOut} title="Zoom out">
          <Minus size={18} strokeWidth={2.5} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          style={btnStyle} onClick={handleReset} title="Reset view">
          <RotateCcw size={15} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Attribution */}
      <div style={{
        position: 'absolute',
        bottom: 6,
        left: 8,
        zIndex: 9000,
        fontSize: 10,
        color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
        pointerEvents: 'none',
      }}>
        © Stadia Maps · © OpenMapTiles · © OpenStreetMap contributors
      </div>
    </div>
  );
}
