import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/Sidebar'
import { ResourceSidebarLoader } from './ResourceSidebarLoader'
import { AppSidebar } from './sidebars/AppSidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      keyboardShortcut="j"
      className="bg-grid-4-s-1-gray-a3"
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
      <SidebarInset className="h-dvh">{children}</SidebarInset>
    </SidebarProvider>
  )
}
