import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.16.11.243'],
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '4000' },
      { protocol: 'http', hostname: '172.16.11.243', port: '4000' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
