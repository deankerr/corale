import { RelativeTimeAgo } from '@/components/ui/RelativeTimeAgo'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/Sidebar'
import { cn } from '@/lib/utils'
import type { Icon } from '@phosphor-icons/react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import fuzzysort from 'fuzzysort'
import Link from 'next/link'
import { useState } from 'react'

type ResourceItem = {
  path: string
  name: string
  title: string
  time: number
  content: string
  isActive: boolean
}

function ResourceNavItem({ path, name, title, time, content, isActive }: ResourceItem) {
  return (
    <Link
      href={path}
      className={cn(
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 whitespace-nowrap border-b p-3 text-sm leading-tight last:border-b-0',
        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
      )}
    >
      <div className="flex w-full items-center gap-2">
        <span className="truncate text-xs font-medium">{name}</span>{' '}
        <span className="ml-auto text-xs">
          <RelativeTimeAgo time={time} />
        </span>
      </div>
      <span className="text-sm font-medium">{title ?? 'Untitled'}</span>
      <span className="line-clamp-2 min-h-[2em] whitespace-break-spaces text-xs">
        {content?.replace('\n', ' ').trim() ?? ''}
      </span>
    </Link>
  )
}

export function ResourceListSidebar({
  title,
  items,
  icon,
  path,
}: {
  title: string
  items?: ResourceItem[]
  icon?: Icon
  path: string
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const Icon = icon ?? Icons.Acorn

  const hasItems = items && items.length > 0

  const filteredItems =
    items && searchQuery
      ? fuzzysort
          .go(searchQuery, items, {
            keys: ['title', 'content', 'name'],
          })
          .map((result) => result.obj)
      : items

  return (
    <Sidebar collapsible="none" className="text-foreground !w-72 shrink-0 border-r">
      <SidebarHeader className={cn('border-b', !hasItems && 'h-12')}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={path}>
                <Icon className="text-base" />
                <span className="text-sm font-medium">{title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className={cn('hidden', hasItems && 'block')}>
          <SidebarInput placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </SidebarHeader>

      <SidebarContent className="text-foreground overflow-x-hidden overscroll-contain">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            {filteredItems?.map((item) => (
              <ResourceNavItem
                key={item.path}
                path={item.path}
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
    </Sidebar>
  )
}
