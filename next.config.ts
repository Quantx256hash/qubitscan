import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  experimental: {
    optimizePackageImports: ["three"],
  },
};

export default config;
