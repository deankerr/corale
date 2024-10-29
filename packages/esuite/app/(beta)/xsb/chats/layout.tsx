'use client'

import { SidebarInset } from '@/components/ui/Sidebar'
import { useThreads } from '@/lib/api/threads'
import { useParams } from 'next/navigation'
import { XSBSubNavSidebar } from '../../_cmp/XSBSubNavSidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const threads = useThreads()
  const params = useParams()
  const currentId = params.threadId

  const items =
    threads?.map((thread) => ({
      href: `/xsb/chats/${thread.xid}`,
      name: thread.model?.name ?? 'unknown',
      title: thread.title ?? 'untitled',
      time: thread.updatedAtTime,
      content: thread.latestMessage?.text?.trim() ?? '',
      isActive: thread.xid === currentId,
    })) ?? []

  return (
    <XSBSubNavSidebar title="Chats" rootHref="/xsb/chats" items={items}>
      <SidebarInset className="h-dvh">{children}</SidebarInset>
    </XSBSubNavSidebar>
  )
}
