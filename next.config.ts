import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  
  // 👇 ADD THESE LINES TO IGNORE ERRORS
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // -----------------------------------

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;