/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@netlify/functions'],
    isrMemoryCacheSize: 50
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com']
  }
};

module.exports = nextConfig;
