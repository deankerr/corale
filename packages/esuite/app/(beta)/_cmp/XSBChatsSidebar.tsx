'use client'

import { AppLogo } from '@/components/icons/AppLogo'
import { IconButton } from '@/components/ui/Button'
import { RelativeTimeAgo } from '@/components/ui/RelativeTimeAgo'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
} from '@/components/ui/Sidebar'
import { cn } from '@/lib/utils'
import { api } from '@corale/api/convex/_generated/api'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useQuery } from 'convex-helpers/react/cache/hooks'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export function XSBChatsSidebar() {
  const threads = useQuery(api.entities.threads.public.listMy, {})
  const params = useParams()

  const isActive = (threadId: string) => params.threadId === threadId

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex-start gap-3 p-1">
          <AppLogo className="text-accent-11 size-6" />
          <Link href="/xsb/chats" className="text-lg font-semibold tracking-tight">
            Chats
          </Link>

          <div className="flex-end ml-auto">
            <IconButton variant="surface" aria-label="New chat">
              <Icons.PlusCircle size={20} />
            </IconButton>
          </div>
        </div>

        <div className="py-1">
          <SidebarInput placeholder="Type to search..." />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {threads?.map((thread) => (
              <Link
                key={thread._id}
                href={`/xsb/chats/${thread.xid}`}
                className={cn(
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0',
                  isActive(thread.xid) && 'bg-sidebar-accent text-sidebar-accent-foreground',
                )}
              >
                <div className="flex w-full items-center gap-2">
                  <span className="truncate">{thread.model?.name ?? 'no model selected'}</span>{' '}
                  <span className="ml-auto text-xs">
                    <RelativeTimeAgo time={thread.updatedAtTime} />
                  </span>
                </div>
                <span className="font-medium">{thread.title ?? 'Untitled'}</span>
                <span className="line-clamp-2 whitespace-break-spaces text-xs">
                  {thread.latestMessage?.text?.slice(0, 120).trim() ?? 'No messages'}
                </span>
              </Link>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
