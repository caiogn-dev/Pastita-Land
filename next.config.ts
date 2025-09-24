// next.config.ts
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "agriao.shop",
    "www.agriao.shop",
  ],
  output: 'standalone', 
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  }

export default nextConfig;