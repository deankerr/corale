import { SidebarInset, SidebarProvider } from '@corale/ui/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <SidebarInset className="h-dvh min-w-0 flex-row">
        <AppSidebar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
