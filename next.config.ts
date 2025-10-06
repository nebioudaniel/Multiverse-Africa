// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // You might remove this after development
  },
  eslint: {
    ignoreDuringBuilds: true, // You might remove this after development
  },
  // Add this to transpile uploadthing packages
  transpilePackages: ["uploadthing", "@uploadthing/react"],
};

module.exports = nextConfig;