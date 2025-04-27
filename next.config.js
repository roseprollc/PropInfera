/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@netlify/functions'],
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig;
