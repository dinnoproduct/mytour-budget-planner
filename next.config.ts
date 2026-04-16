import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src")],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/arm", destination: "/", permanent: true },
      { source: "/arm/:path*", destination: "/:path*", permanent: true },
      { source: "/hy", destination: "/", permanent: true },
      { source: "/hy/:path*", destination: "/:path*", permanent: true },
      { source: "/eng", destination: "/en", permanent: true },
      { source: "/eng/:path*", destination: "/en/:path*", permanent: true },
      { source: "/rus", destination: "/ru", permanent: true },
      { source: "/rus/:path*", destination: "/ru/:path*", permanent: true },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.lottie$/,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
