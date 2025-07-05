import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "pdf-parse",
      "mammoth",
      "tesseract.js",
      "canvas",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        "pdf-parse": "commonjs pdf-parse",
        mammoth: "commonjs mammoth",
        "tesseract.js": "commonjs tesseract.js",
      });
    }
    return config;
  },
};

export default nextConfig;
