/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  cacheMaxMemorySize: 50,
  serverExternalPackages: ['@netlify/functions'],
  experimental: {
    serverActions: true,
    incrementalCacheHandlerPath: require.resolve('./cache-handler.js')
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com']
  }
};

module.exports = nextConfig;
