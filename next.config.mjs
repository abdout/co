import { withContentlayer } from 'next-contentlayer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  transpilePackages: ['@prisma/client', '@auth/prisma-adapter'],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to load these libraries on the client side
      config.resolve.fallback = {
        fs: false,
        child_process: false,
        'fs/promises': false,
        async_hooks: false,
      };
    }
    return config;
  },
};

export default withContentlayer(nextConfig); 