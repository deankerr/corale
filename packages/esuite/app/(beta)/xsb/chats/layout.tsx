import { XSBChatsSidebar } from '@/app/(beta)/_cmp/XSBChatsSidebar'
import { SidebarInset } from '@/components/ui/Sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <XSBChatsSidebar>
      <SidebarInset className="h-svh bg-transparent">{children}</SidebarInset>
    </XSBChatsSidebar>
  )
}
