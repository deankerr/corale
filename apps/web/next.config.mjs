/** @type {import('next').NextConfig} */

import withBundleAnalyzer from '@next/bundle-analyzer'
import { withSentryConfig } from '@sentry/nextjs'

export function getConvexSiteUrl() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl) throw new Error('NEXT_PUBLIC_CONVEX_URL is undefined')
  return convexUrl.replace('.cloud', '.site')
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: '*',
      },
    ],
  },

  redirects: async () => {
    return [
      {
        source: '/drawing/:id',
        destination: '/artifact/:id',
        permanent: true,
      },
    ]
  },

  rewrites: async () => {
    return [
      {
        source: '/svg/:id',
        destination: getConvexSiteUrl() + '/svg/:id',
      },
    ]
  },

  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },

  transpilePackages: ['@corale/backend', '@corale/shared', '@corale/ui'],

  // handled in CI
  typescript: {
    ignoreBuildErrors: true,
  },

  // handled in CI
  eslint: {
    ignoreDuringBuilds: true,
  },

  allowedDevOrigins: ['bleak-scala.ts.net', '*.bleak-scala.ts.net'],
}

const configWithSentry = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  tunnelRoute: '/monitoring',
  disableLogger: true,
  automaticVercelMonitors: true,
})

export default process.env.ANALYZE === 'true' ? withBundleAnalyzer()(configWithSentry) : configWithSentry
