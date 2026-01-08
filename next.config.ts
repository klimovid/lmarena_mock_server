import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable static optimization for API routes
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app'],
    },
  },
};

export default nextConfig;

