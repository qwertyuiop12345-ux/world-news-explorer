'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Clock, Building2, ArrowUpRight } from 'lucide-react';
import { NewsArticle, NewsCategory } from '@/types';
import { formatPublishedDate } from '@/services/newsApi';
import { useAppContext } from '@/context/AppContext';

interface NewsCardProps {
  article: NewsArticle;
  index: number;
}

// Category accent colours
const CATEGORY_COLORS: Record<string, { bg: string; text: string; darkBg: string }> = {
  general:       { bg: '#2563eb', text: '#fff', darkBg: '#1d4ed8' },
  business:      { bg: '#059669', text: '#fff', darkBg: '#047857' },
  technology:    { bg: '#7c3aed', text: '#fff', darkBg: '#6d28d9' },
  sports:        { bg: '#dc2626', text: '#fff', darkBg: '#b91c1c' },
  entertainment: { bg: '#d97706', text: '#fff', darkBg: '#b45309' },
  science:       { bg: '#0891b2', text: '#fff', darkBg: '#0e7490' },
  health:        { bg: '#be185d', text: '#fff', darkBg: '#9d174d' },
  politics:      { bg: '#4338ca', text: '#fff', darkBg: '#3730a3' },
};

const getCategoryColor = (category?: NewsCategory) => {
  if (!category) return CATEGORY_COLORS.general;
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.general;
};

export const NewsCard = ({ article, index }: NewsCardProps) => {
  const { isDarkMode } = useAppContext();
  const color = getCategoryColor(article.category);
  const accentColor = isDarkMode ? color.darkBg : color.bg;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
      style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        background: isDarkMode ? '#1e293b' : '#ffffff',
        border: isDarkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)',
        boxShadow: isDarkMode
          ? '0 2px 12px rgba(0,0,0,0.4)'
          : '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Colour accent bar on left edge ── */}
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 4,
        background: `linear-gradient(180deg, ${accentColor}, ${accentColor}88)`,
        borderRadius: '0 0 0 0',
      }} />

      <div style={{ padding: '16px 16px 16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* ── Top row: category chip + time ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          {/* Category pill */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 10px',
            borderRadius: 20,
            fontSize: 11, fontWeight: 700,
            letterSpacing: 0.4, textTransform: 'uppercase',
            background: `${accentColor}22`,
            color: accentColor,
            border: `1px solid ${accentColor}44`,
          }}>
            {article.category ?? 'News'}
          </span>

          {/* Time */}
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11, color: isDarkMode ? '#64748b' : '#94a3b8',
          }}>
            <Clock size={11} />
            {formatPublishedDate(article.publishedAt)}
          </span>
        </div>

        {/* ── Headline ── */}
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: 15,
          fontWeight: 700,
          lineHeight: 1.45,
          color: isDarkMode ? '#f1f5f9' : '#0f172a',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {article.title}
        </h3>

        {/* ── Description ── */}
        {article.description && (
          <p style={{
            margin: '0 0 12px 0',
            fontSize: 13,
            lineHeight: 1.6,
            color: isDarkMode ? '#94a3b8' : '#475569',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}>
            {article.description}
          </p>
        )}

        {/* ── Bottom row: source + arrow ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 'auto', paddingTop: 10,
          borderTop: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Building2 size={12} color={isDarkMode ? '#475569' : '#94a3b8'} />
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: isDarkMode ? '#64748b' : '#64748b',
              maxWidth: 200,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {article.source.name}
            </span>
          </div>

          <motion.div
            whileHover={{ x: 2, y: -2 }}
            style={{
              width: 28, height: 28,
              borderRadius: 8,
              background: `${accentColor}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: accentColor,
              flexShrink: 0,
            }}
          >
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};
