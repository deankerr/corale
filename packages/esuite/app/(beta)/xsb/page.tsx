import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/Sidebar'
import * as Icons from '@phosphor-icons/react/dist/ssr'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '#',
    icon: Icons.House,
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Icons.Envelope,
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Icons.Calendar,
  },
  {
    title: 'Search',
    url: '#',
    icon: Icons.MagnifyingGlass,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Icons.Gear,
  },
]

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <h1>Hello</h1>
      </main>
    </SidebarProvider>
  )
}
