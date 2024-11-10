'use client'

import { AppLogo } from '@/components/icons/AppLogo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/Sidebar'
import { useViewer } from '@/lib/api/users'
import { UserButton } from '@clerk/nextjs'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { config } from './config'

export function AppSidebar() {
  const { user } = useViewer()
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="bg-gray-2">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
              <Link href="/xsb">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 min-w-8 items-center justify-center rounded-md">
                  <AppLogo className="size-4" />
                </div>
                <span className="truncate text-lg font-semibold">e⋆suite</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {config.nav.routes.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton isActive={pathname.startsWith(item.path)} tooltip={item.title} asChild>
                  <Link href={item.path}>
                    <div className="flex-center min-w-4">
                      <item.icon className="scale-125" />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton asChild>
            <Link href="/">
              <Icons.House className="size-4" />
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton className="justify-start" asChild>
            <SidebarTrigger />
          </SidebarMenuButton>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="md:h-8 md:p-0">
              <div className="flex-center size-8 min-w-8">
                <UserButton />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.role}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
