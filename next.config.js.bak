/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
  serverActions: {
    bodySizeLimit: "2mb"
  }
},
    serverActions: {
      bodySizeLimit: '2mb'
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
