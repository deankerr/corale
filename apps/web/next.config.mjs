/** @type {import('next').NextConfig} */

import withBundleAnalyzer from '@next/bundle-analyzer'
import { withSentryConfig } from '@sentry/nextjs'

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

  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },

  transpilePackages: ['@corale/backend', '@corale/shared', '@corale/ui'],

  // handled in CI
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  devIndicators: {
    appIsrStatus: false,
  },
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
