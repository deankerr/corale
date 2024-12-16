'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@corale/ui/components/ui/sidebar'
import { AppLogoIcon } from '@corale/ui/icons/AppLogoIcon'
import { ThemeModeMenu } from '@ui/components/theme-mode-menu'
import { MessageCircleIcon, SettingsIcon, TreePalmIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavThreads, NavTrees } from './nav-threads'

const sections = {
  content: [
    {
      icon: TreePalmIcon,
      label: 'Trees',
      href: '/v0',
      items: NavTrees,
    },
    {
      icon: MessageCircleIcon,
      label: 'Chat',
      href: '/chat',
      items: NavThreads,
    },
    {
      icon: SettingsIcon,
      label: 'Patterns',
      href: '/patterns',
    },
  ],
}

export const AppSidebar = () => {
  const pathname = usePathname()

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
        {sections.content.map((section) => (
          <SidebarGroup>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === section.href}>
                  <Link href={section.href}>
                    <section.icon className="size-4" />
                    <span>{section.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {'items' in section && section.items && <section.items />}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <ThemeModeMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
