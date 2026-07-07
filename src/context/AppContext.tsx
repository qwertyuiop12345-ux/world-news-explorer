'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Country, NewsCategory } from '@/types';

interface AppContextType {
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country | null) => void;
  hoveredCountry: string | null;
  setHoveredCountry: (code: string | null) => void;
  activeCategory: NewsCategory;
  setActiveCategory: (category: NewsCategory) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  mapZoom: number;
  setMapZoom: (zoom: number) => void;
  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('general');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapZoom, setMapZoomState] = useState(2);

  const setMapZoom = useCallback((zoom: number) => {
    setMapZoomState(zoom);
  }, []);
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 20]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleSetSelectedCountry = useCallback((country: Country | null) => {
    setSelectedCountry(country);
    if (country) {
      setSidebarOpen(true);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        selectedCountry,
        setSelectedCountry: handleSetSelectedCountry,
        hoveredCountry,
        setHoveredCountry,
        activeCategory,
        setActiveCategory,
        isSidebarOpen,
        setSidebarOpen,
        searchQuery,
        setSearchQuery,
        mapZoom,
        setMapZoom,
        mapCenter,
        setMapCenter,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
