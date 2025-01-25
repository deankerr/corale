import { api } from '@corale/backend'
import { ConvexHttpClient } from 'convex/browser'
import type { Metadata } from 'next'

export async function generateMetadata(props: { params: Promise<{ id?: string[] }> }): Promise<Metadata> {
  const params = await props.params;
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)
  const id = params.id?.[0]
  const pattern = id ? await convex.query(api.entities.patterns.public.get, { patternId: id }) : null
  if (!pattern || !pattern.name) return {}
  return {
    title: pattern.name,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
