/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization for API routes
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app'],
    },
  },
};

export default nextConfig;

