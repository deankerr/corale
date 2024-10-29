import { SidebarInset } from '@/components/ui/Sidebar'
import XSBAppSidebar from '../_cmp/XSBAppSidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <XSBAppSidebar>
      <SidebarInset>{children}</SidebarInset>
    </XSBAppSidebar>
  )
}
