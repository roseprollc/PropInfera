/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: {
        bodySizeLimit: '2mb'
      }
    },
    eslint: {
      ignoreDuringBuilds: true
    },
    typescript: {
      // For strict type checking
      ignoreBuildErrors: false
    },
    poweredByHeader: false // Security best practice
  };
  
  module.exports = nextConfig;