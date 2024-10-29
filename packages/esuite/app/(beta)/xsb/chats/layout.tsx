import { SidebarInset } from '@/components/ui/Sidebar'
import { XSBChatsSidebar } from '../../_cmp/XSBChatsSidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <XSBChatsSidebar>
      <SidebarInset className="h-svh bg-transparent">{children}</SidebarInset>
    </XSBChatsSidebar>
  )
}
