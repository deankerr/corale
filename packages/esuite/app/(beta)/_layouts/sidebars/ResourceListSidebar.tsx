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
} from '@/components/ui/Sidebar'
import { cn } from '@/lib/utils'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
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
      <span className="line-clamp-2 whitespace-break-spaces text-xs">{content?.trim() ?? ''}</span>
    </Link>
  )
}

export function ResourceListSidebar({ title, items }: { title: string; items?: ResourceItem[] }) {
  const Icon = config.nav.routes.find((r) => r.title === title)?.icon ?? Icons.Acorn
  const route = config.nav.routes.find((r) => r.title === title)?.route ?? ''

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={`${config.nav.root}/${route}`}>
                <Icon size={20} />
                <span className="text-base font-semibold">{title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="">
          <SidebarInput placeholder="Search..." disabled />
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden overscroll-contain">
        <SidebarGroup>
          <SidebarGroupContent>
            {items?.map((item) => (
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

      <SidebarFooter>
        <div className="h-8 border-t" />
      </SidebarFooter>
    </Sidebar>
  )
}
