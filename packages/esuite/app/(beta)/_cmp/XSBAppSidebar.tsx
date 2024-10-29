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
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/Sidebar'
import { useViewer } from '@/lib/api/users'
import { UserButton } from '@clerk/nextjs'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import * as React from 'react'

const config = {
  navItems: [
    {
      title: 'Chats',
      icon: Icons.Chat,
      url: '/xsb/chats',
    },
    {
      title: 'Patterns',
      icon: Icons.CodesandboxLogo,
      url: '/xsb/patterns',
    },
    {
      title: 'Generations',
      icon: Icons.Sparkle,
      url: '/xsb/generations',
    },
    {
      title: 'Collections',
      icon: Icons.FolderStar,
      url: '/xsb/collections',
    },
  ],
}

export default function XSBAppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false} keyboardShortcut="j">
      <Sidebar collapsible="icon" className="">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 min-w-8 items-center justify-center rounded-lg">
                  <AppLogo className="size-4" />
                </div>
                <span className="truncate text-lg font-semibold">e⋆suite</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {config.navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={false} tooltip={item.title} asChild>
                    <Link href={item.url}>
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
            <SidebarTrigger />
          </SidebarMenu>
          <XSBNavUser />
        </SidebarFooter>
        {/* <SidebarRail /> */}
      </Sidebar>
      {children}
    </SidebarProvider>
  )
}

function XSBNavUser() {
  const { user } = useViewer()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex-center size-8">
            <UserButton />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user?.name}</span>
            <span className="truncate text-xs">{user?.role}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
