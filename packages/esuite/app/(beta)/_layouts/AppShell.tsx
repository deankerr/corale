import { SidebarInset, SidebarProvider } from '@/components/ui/Sidebar'
import { AppSidebar } from './AppSidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false} keyboardShortcut="j" className="bg-grid-4-s-1-gray-a3">
      <AppSidebar />
      <SidebarInset className="bg-transparent">{children}</SidebarInset>
    </SidebarProvider>
  )
}
