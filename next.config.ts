import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Metadata always goes in the <head>, never streamed into the body after it.
  // /blog is the only page built per request, and AI crawlers (GPTBot, ClaudeBot,
  // PerplexityBot) read only the HTML they are sent, without running scripts.
  // The cost is a slightly later first byte on /blog.
  // Revisit before turning on cacheComponents: with it, every request this pattern matches skips the prerendered shell.
  htmlLimitedBots: /.*/,
  images: {
    // Serve AVIF where supported (smaller than WebP), falling back to WebP.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    return [
      // The warehouse project was renamed to its street address (31 Sacks
      // Circle, confirmed by the business on 25 September 2026); keep the old
      // address (linked and indexed) working.
      {
        source: '/projects/logistics-warehouse-chepstow-properties',
        destination: '/projects/31-sacks-circle',
        permanent: true,
      },
      // The Brakpan project was renamed from its site type to its system
      // (12 October 2026); keep the old address (linked and indexed) working.
      {
        source: '/projects/residential-home-brakpan',
        destination: '/projects/brakpan-solar-storage',
        permanent: true,
      },
      // Pretoria and Centurion were folded into the Gauteng page on
      // 12 October 2026 (Pretoria is in Gauteng); keep the old address working.
      {
        source: '/solutions/ci-solar-storage/pretoria-centurion',
        destination: '/solutions/ci-solar-storage/gauteng',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'X-DNS-Prefetch-Control',     value: 'on' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
