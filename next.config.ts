import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': path.resolve(process.cwd()),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wtjuqyqqiwmdczxanhmz.supabase.co"
      },
    ],
    unoptimized: true
  },
};

export default nextConfig;
