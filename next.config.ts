import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'raw.githubusercontent.com',
      'github.com',
      'dashboard-image.s3.ir-thr-at1.arvanstorage.ir'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/Mhmk1399/storadge/main/images/**'
      },
      {
        protocol: 'https',
        hostname: 'dashboard-image.s3.ir-thr-at1.arvanstorage.ir',
        port: '',
        pathname: '/uploads/**'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/health', destination: '/api/health' },
    ];
  },
};

export default nextConfig;
