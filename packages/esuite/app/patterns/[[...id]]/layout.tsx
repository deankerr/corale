import { api } from '@corale/api/convex/_generated/api'
import { ConvexHttpClient } from 'convex/browser'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id?: string[] } }): Promise<Metadata> {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)
  const id = params.id?.[0]
  const pattern = id ? await convex.query(api.db.patterns.get, { id }) : null
  if (!pattern || !pattern.name) return {}
  return {
    title: pattern.name,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
