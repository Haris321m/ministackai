import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "api.minismartai.com", "www.api.minismartai.com"],
  },
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)", // all routes
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups", 
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none", // prevent conflicts with COEP
          },
        ],
      },
    ];
  },
};

export default nextConfig;
