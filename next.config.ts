import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Optimize production build
  output: 'standalone' as const,
  
  // Configure pageExtensions to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  
  // Remove contentlayer from transpilePackages
  transpilePackages: ['@prisma/client', '@auth/prisma-adapter'],
  
  images: {
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
      "res.cloudinary.com",
    ],
  },
  
  env: {
    NEXT_PUBLIC_FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  },
  
  // Ignore ESLint errors during build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Ignore TypeScript errors during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  
  experimental: {
    mdxRs: true,
  },
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals as string[] || []), 'prisma', '@prisma/client'];
    }
    if (!isServer) {
      // Don't attempt to load these libraries on the client side
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...(config.resolve?.fallback || {}),
          fs: false,
          child_process: false,
          'fs/promises': false,
          async_hooks: false,
        },
      };
    }
    return config;
  },
};

// Create MDX configuration
const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

// Export configuration with MDX
export default withMDX(nextConfig); 