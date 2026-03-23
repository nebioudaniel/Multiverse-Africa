import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.edgestore.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // --- ADD THIS REDIRECTS BLOCK ---
  async redirects() {
    return [
      {
        source: '/webmail',
        destination: 'https://s16193.lon1.stableserver.net:2096',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
