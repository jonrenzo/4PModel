import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.css": {
          loaders: ["postcss-loader"],
        },
      },
    },
  },
};

export default nextConfig;
