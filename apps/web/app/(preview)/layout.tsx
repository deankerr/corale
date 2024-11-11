import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/Sidebar'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { AppSidebar } from './shared/AppSidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      keyboardShortcut="b"
      style={
        {
          '--sidebar-width': '250px',
        } as React.CSSProperties
      }
      defaultOpen={false}
    >
      <AppSidebar />
      <SidebarInset className="h-dvh flex-row">
        {children}
        <AdminOnlyUi>
          <div className="absolute z-40 block opacity-50 md:hidden">
            <SidebarTrigger />
          </div>
        </AdminOnlyUi>
      </SidebarInset>
    </SidebarProvider>
  )
}
