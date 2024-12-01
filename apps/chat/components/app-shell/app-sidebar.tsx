'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@corale/ui/components/ui/sidebar'
import { AppLogoIcon } from '@corale/ui/icons/AppLogoIcon'
import { MessageCircleIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { NavThreads } from './nav-threads'

const items = {
  content: [
    {
      icon: MessageCircleIcon,
      label: 'Chat',
      href: '/chat',
    },
    {
      icon: SettingsIcon,
      label: 'Patterns',
      href: '/patterns',
    },
  ],
}

export const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
          <Link href="/">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 min-w-8 items-center justify-center rounded-md">
              <AppLogoIcon className="size-4" />
            </div>
            <span className="truncate text-lg font-semibold">e⋆suite</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {items.content.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild>
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <NavThreads />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
