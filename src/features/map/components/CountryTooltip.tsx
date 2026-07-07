'use client';

import { motion } from 'framer-motion';
import { Users, MapPin } from 'lucide-react';

interface CountryTooltipProps {
  data: {
    country: string;
    capital: string;
    population: number;
    region: string;
    flag: string;
  };
  x: number;
  y: number;
}

export const CountryTooltip = ({ data, x, y }: CountryTooltipProps) => {
  const formatPopulation = (pop: number) => {
    if (pop >= 1000000000) {
      return `${(pop / 1000000000).toFixed(2)}B`;
    } else if (pop >= 1000000) {
      return `${(pop / 1000000).toFixed(2)}M`;
    } else if (pop >= 1000) {
      return `${(pop / 1000).toFixed(2)}K`;
    }
    return pop.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.2 }}
      className="fixed pointer-events-none z-50"
      style={{
        left: x + 20,
        top: y + 20,
      }}
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 min-w-[280px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <span className="text-4xl">{data.flag}</span>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {data.country}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{data.region}</p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-gray-700 dark:text-gray-300">
              Capital: <span className="font-medium">{data.capital}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-purple-500" />
            <span className="text-gray-700 dark:text-gray-300">
              Population:{' '}
              <span className="font-medium">{formatPopulation(data.population)}</span>
            </span>
          </div>
        </div>

        {/* Click hint */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Click to view news
          </p>
        </div>
      </div>
    </motion.div>
  );
};
