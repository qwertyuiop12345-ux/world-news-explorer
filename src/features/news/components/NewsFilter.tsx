'use client';

import { NewsCategory } from '@/types';
import { useAppContext } from '@/context/AppContext';

interface NewsFilterProps {
  activeCategory: NewsCategory;
  onCategoryChange: (c: NewsCategory) => void;
}

const CATS: { value: NewsCategory; label: string; emoji: string }[] = [
  { value: 'general',       label: 'Headlines',     emoji: '📰' },
  { value: 'business',      label: 'Business',      emoji: '💼' },
  { value: 'technology',    label: 'Tech',          emoji: '💻' },
  { value: 'sports',        label: 'Sports',        emoji: '⚽' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'science',       label: 'Science',       emoji: '🔬' },
  { value: 'health',        label: 'Health',        emoji: '❤️' },
];

export const NewsFilter = ({ activeCategory, onCategoryChange }: NewsFilterProps) => {
  const { isDarkMode } = useAppContext();

  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
      {CATS.map(({ value, label, emoji }) => {
        const active = activeCategory === value;
        return (
          <button
            key={value}
            onClick={() => onCategoryChange(value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: 13,
              fontWeight: active ? 700 : 500,
              transition: 'all 0.15s',
              flexShrink: 0,
              background: active
                ? 'linear-gradient(to right, #3b82f6, #6366f1)'
                : isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
              color: active ? '#fff' : isDarkMode ? '#cbd5e1' : '#475569',
              boxShadow: active ? '0 4px 12px rgba(59,130,246,0.35)' : 'none',
            }}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
