import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: ""
      },
      {
        protocol: 'http',
        hostname: 'localhost:3001',
        port: '',
        pathname: '/uploads/',
        search: '',
      },
    ]
  },
  reactStrictMode: false,
};

export default nextConfig;
