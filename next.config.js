/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add Prisma to the serverless function compilation process
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'prisma', '@prisma/client'];
    }
    return config;
  },
  
  // Optimize production build
  output: 'standalone',
  
  // Ignore ESLint errors during build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Other existing configuration...
};

module.exports = nextConfig; 