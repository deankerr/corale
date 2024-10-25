import { api } from '@corale/api/convex/_generated/api'
import { ConvexHttpClient } from 'convex/browser'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { threadId: string } }): Promise<Metadata> {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)
  const id = params.threadId
  const thread = id ? await convex.query(api.db.threads.get, { id }) : null
  if (!thread || !thread.title) return {}
  return {
    title: thread.title,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
