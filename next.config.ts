import type { NextConfig } from "next";

// Get base path from environment variable
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Configure for subpath deployment
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
