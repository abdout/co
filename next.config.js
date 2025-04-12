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
  
  // Include necessary files for Prisma
  experimental: {
    outputFileTracingIncludes: {
      '/**': ['node_modules/.prisma/**/*', '.prisma/**/*', 'prisma/**/*']
    },
  },
  
  // Other existing configuration...
};

module.exports = nextConfig; 