import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "oyobadaucviihcmxpgan.supabase.co"
      }
    ],
    domains: [
      "pub-0f6d8906e6134f709ae4318a409f1309.r2.dev"
    ]
  },
};

export default nextConfig;
