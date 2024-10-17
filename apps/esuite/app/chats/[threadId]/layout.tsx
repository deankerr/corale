import { getConvexSiteUrl } from '@corale/esuite/app/lib/utils'

export async function generateMetadata({ params }: { params: { threadId: string } }) {
  const response = await fetch(`${getConvexSiteUrl()}/metadata?route=chats&id=${params.threadId}`)
  if (!response.ok) return {}

  const data = await response.json()
  return {
    title: data.title,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
