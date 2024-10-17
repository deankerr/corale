/** @type {import('next').NextConfig} */

function getBackendUrl() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl) throw new Error('NEXT_PUBLIC_CONVEX_URL is not set')
  return convexUrl.replace('.cloud', '.site')
}

const backendUrl = getBackendUrl()

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
      destination: `${backendUrl}/i/:slug`,
    },
  ],
}

export default nextConfig
