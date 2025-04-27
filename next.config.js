/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  cacheMaxMemorySize: 50,
  serverExternalPackages: ['@netlify/functions'],
  experimental: {
    // serverActions is enabled by default in Next 14
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com']
  }
};

module.exports = nextConfig;
