import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Transpile Three.js and related packages
  transpilePackages: ['three'],
}

export default nextConfig
