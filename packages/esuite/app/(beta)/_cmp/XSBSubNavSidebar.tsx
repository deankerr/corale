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
import * as Icons from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

const icons = {
  Chats: Icons.Chats,
  Patterns: Icons.CodesandboxLogo,
  Collections: Icons.FolderStar,
}

type NavItem = {
  href: string
  name: string
  title: string
  time: number
  content: string
  isActive: boolean
}

export function XSBSubNavSidebar({
  title,
  rootHref,
  items,
  children,
}: {
  title: string
  rootHref: string
  items: NavItem[]
  children?: React.ReactNode
}) {
  const Icon = icons[title as keyof typeof icons] ?? Icons.Acorn
  return (
    <SidebarProvider>
      <Sidebar className="absolute h-dvh border-r">
        <SidebarHeader className="border-b">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={rootHref}>
                  <Icon className="size-8" />
                  <span className="truncate text-base font-semibold">{title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <div className="">
            <SidebarInput placeholder="Search..." disabled />
          </div>
        </SidebarHeader>

        <SidebarContent className="overflow-x-hidden">
          <SidebarGroup>
            <SidebarGroupContent>
              {items.map((item) => (
                <NavSidebarItem
                  key={item.href}
                  href={item.href}
                  isActive={item.isActive}
                  name={item.name}
                  title={item.title}
                  content={item.content}
                  time={item.time}
                />
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="h-1 border-t" />
        </SidebarFooter>
      </Sidebar>
      {children}
    </SidebarProvider>
  )
}

function NavSidebarItem({ href, name, title, time, content, isActive }: NavItem) {
  return (
    <Link
      href={href}
      className={cn(
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0',
        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
      )}
    >
      <div className="flex w-full items-center gap-2">
        <span className="truncate">{name}</span>{' '}
        <span className="ml-auto text-xs">
          <RelativeTimeAgo time={time} />
        </span>
      </div>
      <span className="font-medium">{title ?? 'Untitled'}</span>
      <span className="line-clamp-2 whitespace-break-spaces text-xs">{content ?? 'No messages'}</span>
    </Link>
  )
}
