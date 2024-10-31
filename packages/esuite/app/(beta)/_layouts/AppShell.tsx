import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/Sidebar'
import { ResourceSidebarLoader } from './ResourceSidebarLoader'
import { AppSidebar } from './sidebars/AppSidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      keyboardShortcut="b"
      style={
        {
          '--sidebar-width': '350px',
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="icon" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row">
        <AppSidebar />
        <ResourceSidebarLoader />
      </Sidebar>
      <SidebarInset className="h-dvh">
        {children}
        <div className="absolute left-1 top-1 block md:hidden">
          <SidebarTrigger />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
