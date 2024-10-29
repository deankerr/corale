'use client'

import { RelativeTimeAgo } from '@/components/ui/RelativeTimeAgo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/Sidebar'
import { cn } from '@/lib/utils'
import { api } from '@corale/api/convex/_generated/api'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useQuery } from 'convex-helpers/react/cache/hooks'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export function XSBChatsSidebar({ children }: { children?: React.ReactNode }) {
  const threads = useQuery(api.entities.threads.public.listMy, {})
  const params = useParams()

  const isActive = (threadId: string) => params.threadId === threadId

  return (
    <SidebarProvider>
      <Sidebar className="absolute h-dvh border-r">
        <SidebarHeader className="border-b">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 min-w-8 items-center justify-center rounded-lg">
                  <Icons.Chats className="size-5" />
                </div>
                <span className="truncate text-lg font-semibold">Chats</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* <div className="flex-start gap-3 p-1">
            <Link href="/xsb">
              <AppLogo className="text-accent-11 size-6" />
            </Link>
            <Link href="/xsb/chats" className="text-lg font-semibold tracking-tight">
              Chats
            </Link>

            <div className="flex-end ml-auto">
              <IconButton variant="surface" aria-label="New chat">
                <Icons.PlusCircle size={20} />
              </IconButton>
            </div>
          </div> */}

          <div className="py-1">
            <SidebarInput placeholder="Type to search..." />
          </div>
        </SidebarHeader>

        <SidebarContent className="overflow-x-hidden">
          <SidebarGroup className="">
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

        <SidebarFooter>
          <div className="h-2" />
        </SidebarFooter>
      </Sidebar>
      {children}
    </SidebarProvider>
  )
}
