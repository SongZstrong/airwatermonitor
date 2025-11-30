import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "eoimages.gsfc.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "images-assets.nasa.gov",
      },
    ],
  },
};

export default nextConfig;
