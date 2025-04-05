import { withContentlayer } from 'next-contentlayer2'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['contentlayer2', 'next-contentlayer2'],
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
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default withContentlayer(nextConfig) 