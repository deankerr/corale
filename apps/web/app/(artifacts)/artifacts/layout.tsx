import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/Sidebar'
import { AppSidebar } from './AppSidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      keyboardShortcut="b"
      style={
        {
          '--sidebar-width': '250px',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="h-dvh">
        {children}
        <div className="absolute left-1 top-1 block md:hidden">
          <SidebarTrigger />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
