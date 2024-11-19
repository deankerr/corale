import { appConfig } from '@/config/config'
import { api } from '@corale/backend'
import { ConvexHttpClient } from 'convex/browser'
import type { Metadata } from 'next'
import { ChatWithArtifactsPage } from '../components/ChatWithArtifactsPage'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)
  const threadId = params.id
  const thread = threadId ? await convex.query(api.entities.threads.get, { threadId }) : null
  if (!thread || !thread.title) return {}
  return {
    title: `${appConfig.siteTitle} · ${thread.title}`,
  }
}

export default function Page({ params }: { params: { id: string } }) {
  return <ChatWithArtifactsPage threadId={params.id} />
}
