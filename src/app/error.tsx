'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="mb-6"
          >
            <AlertTriangle className="w-16 h-16 text-yellow-500" />
          </motion.div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We encountered an unexpected error. Don't worry, you can try again.
          </p>

          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="w-full mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 max-h-32 overflow-auto">
              <p className="text-xs text-red-800 dark:text-red-300 font-mono break-all text-left">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = '/')}
              className="w-full py-3 px-6 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
