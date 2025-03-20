import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  publicRuntimeConfig: {
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  transpilePackages: ['@mui/material', '@mui/x-date-pickers']
};

export default nextConfig;
