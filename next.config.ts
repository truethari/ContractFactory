import type { NextConfig } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        // destination: "http://localhost:3000/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
