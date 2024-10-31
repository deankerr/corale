import { api } from '@corale/backend'
import { ConvexHttpClient } from 'convex/browser'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { threadId: string } }): Promise<Metadata> {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)
  const { threadId } = params
  const thread = threadId ? await convex.query(api.entities.threads.public.get, { threadId }) : null
  if (!thread || !thread.title) return {}
  return {
    title: thread.title,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
