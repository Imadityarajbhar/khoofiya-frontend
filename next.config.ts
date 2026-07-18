import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mediumslateblue-grouse-999387.hostingersite.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
