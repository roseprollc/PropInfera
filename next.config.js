/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      enabled: true
    }
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Ensure API routes are optimized
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '10mb',
  },
}

module.exports = nextConfig 