import { appConfig } from '@/config/config'
import { api } from '@corale/backend'
import { ConvexHttpClient } from 'convex/browser'
import type { Metadata } from 'next'
import { ArtifactPage } from '../../shared/ArtifactPage'

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)
  const title = await convex.query(api.entities.threads.messages.getArtifactTitle, { messageId: params.id })
  if (!title) return {}
  return {
    title,
    description: `${appConfig.siteDescription} · ${title}`,
  }
}

export default ArtifactPage
