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
    output: 'standalone', // Optimized for AWS Lambda deployment
    poweredByHeader: false // Security best practice
  };
  
  module.exports = nextConfig;