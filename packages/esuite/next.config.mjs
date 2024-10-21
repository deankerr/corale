/** @type {import('next').NextConfig} */

import bundleAnalyzer from '@next/bundle-analyzer'

function getBackendUrl() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl) throw new Error('NEXT_PUBLIC_CONVEX_URL is not set')
  return convexUrl.replace('.cloud', '.site')
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: '*',
      },
    ],
  },

  rewrites: async () => [
    {
      source: '/convex/:slug',
      destination: `${getBackendUrl()}/i/:slug`,
    },
  ],

  transpilePackages: ['@corale/api'],
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react', '@remixicon/react'],
  },
}

export default process.env.ANALYZE === 'true' ? withBundleAnalyzer(nextConfig) : nextConfig
