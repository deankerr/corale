'use client'

import { useAuth } from '@clerk/nextjs'
import { ConvexQueryCacheProvider } from 'convex-helpers/react/cache/provider'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { Provider as JotaiProvider } from 'jotai'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ConvexQueryCacheProvider>
        <JotaiProvider>{children}</JotaiProvider>
      </ConvexQueryCacheProvider>
    </ConvexProviderWithClerk>
  )
}
