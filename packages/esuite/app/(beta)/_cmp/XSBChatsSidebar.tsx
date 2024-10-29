'use client'

import { api } from '@corale/api/convex/_generated/api'
import { useQuery } from 'convex-helpers/react/cache/hooks'
import { useParams } from 'next/navigation'
import { XSBSubNavSidebar } from './XSBSubNavSidebar'

export function XSBChatsSidebar({ children }: { children?: React.ReactNode }) {
  const threads = useQuery(api.entities.threads.public.listMy, {})
  const params = useParams()

  const isActive = (threadId: string) => params.threadId === threadId

  return (
    <XSBSubNavSidebar
      title="Chats"
      rootHref="/xsb/chats"
      items={
        threads?.map((thread) => ({
          href: `/xsb/chats/${thread.xid}`,
          name: thread.model?.name ?? 'unknown',
          title: thread.title ?? 'untitled',
          time: thread.updatedAtTime,
          content: thread.latestMessage?.text ?? '',
          isActive: isActive(thread.xid),
        })) ?? []
      }
    >
      {children}
    </XSBSubNavSidebar>
  )
}
