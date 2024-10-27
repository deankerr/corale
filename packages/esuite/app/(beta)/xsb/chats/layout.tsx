import { XSBChatsSidebar } from '@/app/(beta)/_cmp/XSBChatsSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/Sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '18rem',
          '--sidebar-width-icon': '18rem',
        } as React.CSSProperties
      }
    >
      <XSBChatsSidebar />
      <SidebarInset className="h-svh">{children}</SidebarInset>
    </SidebarProvider>
  )
}
