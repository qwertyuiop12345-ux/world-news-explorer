/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // All news article images come from arbitrary CDNs — unoptimized avoids
    // the need to enumerate every possible hostname in remotePatterns.
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Production security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',          value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection',         value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
