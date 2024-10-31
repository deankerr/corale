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
import * as Icons from '@phosphor-icons/react/dist/ssr'
import fuzzysort from 'fuzzysort'
import Link from 'next/link'
import { useState } from 'react'
import { config } from '../../config'

type ResourceItem = {
  href: string
  name: string
  title: string
  time: number
  content: string
  isActive: boolean
}

function ResourceNavItem({ href, name, title, time, content, isActive }: ResourceItem) {
  return (
    <Link
      href={href}
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

export function ResourceListSidebar({ title, items }: { title: string; items?: ResourceItem[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const Icon = config.nav.routes.find((r) => r.title === title)?.icon ?? Icons.Acorn
  const route = config.nav.routes.find((r) => r.title === title)?.route ?? ''

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
    <Sidebar collapsible="none" className="text-foreground hidden flex-1 border-l md:flex">
      <SidebarHeader className={cn('border-b', !hasItems && 'h-12')}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={`${config.nav.root}/${route}`}>
                <Icon className="text-base" />
                <span className="text-sm font-semibold">{title}</span>
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
    </Sidebar>
  )
}
