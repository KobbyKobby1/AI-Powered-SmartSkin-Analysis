/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: './build',
  images: { unoptimized: true },
  compress: true,
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
};

export default nextConfig;