/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  async rewrites() {
    const lambdaEndpoint = process.env.AWS_LAMBDA_ENDPOINT;
    if (!lambdaEndpoint) {
      return [];
    }
    return [
      { source: "/api/:path*", destination: `${lambdaEndpoint}/api/:path*` },
    ];
  },
}

module.exports = nextConfig
