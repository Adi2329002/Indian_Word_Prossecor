import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", 

  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optional: Add this if you get TypeScript errors next
  typescript: {
    ignoreBuildErrors: true,
  },
  
};
export default nextConfig;