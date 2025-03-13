import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ['@mui/material', '@mui/x-date-pickers']
};

export default nextConfig;
