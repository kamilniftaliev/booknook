import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        // protocol: 'https',
        // hostname: "books.google.com",
        hostname: "*",
        // port: "",
        // pathname: '/assets/**'
      },
    ],
  },
};

export default nextConfig;
