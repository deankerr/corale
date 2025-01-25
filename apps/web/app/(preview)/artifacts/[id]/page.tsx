import { appConfig } from '@/config/config'
import { api } from '@corale/backend'
import { ConvexHttpClient } from 'convex/browser'
import type { Metadata } from 'next'
import { ChatWithArtifactsPage } from '../components/ChatWithArtifactsPage'

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)
  const threadId = params.id
  const thread = threadId ? await convex.query(api.entities.threads.get, { threadId }) : null
  if (!thread || !thread.title) return {}
  return {
    title: `${appConfig.siteTitle} · ${thread.title}`,
  }
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <ChatWithArtifactsPage threadId={params.id} />
}
