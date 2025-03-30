import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: "/blocks/_next/", // Prefix all asset URLs
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;