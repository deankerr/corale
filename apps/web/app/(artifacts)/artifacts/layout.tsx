import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/Sidebar'
import { AppSidebar } from './AppSidebar'
import { ArtifactThreadsList } from './components/ArtifactThreadsList'

export const metadata = {
  title: 'Artifacts',
}

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
      <SidebarInset className="h-dvh flex-row">
        <ArtifactThreadsList />
        {children}
        <div className="absolute left-1 top-1 block md:hidden">
          <SidebarTrigger />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
