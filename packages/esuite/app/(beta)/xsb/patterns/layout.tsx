'use client'

import { SidebarInset } from '@/components/ui/Sidebar'
import { usePatterns } from '@/lib/api/patterns'
import { useParams } from 'next/navigation'
import { XSBSubNavSidebar } from '../../_cmp/XSBSubNavSidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const patterns = usePatterns()
  const params = useParams()
  const currentId = params.patternId?.[0]

  const items =
    patterns?.map((pattern) => ({
      href: `/xsb/patterns/${pattern.xid}`,
      name: pattern.xid,
      title: pattern.name ?? 'untitled',
      content: pattern.description ?? '',
      isActive: currentId === pattern.xid,
      time: pattern.updatedAt,
    })) ?? []

  return (
    <XSBSubNavSidebar title={`Patterns`} rootHref="/xsb/patterns" items={items}>
      <SidebarInset className="h-dvh">{children}</SidebarInset>
    </XSBSubNavSidebar>
  )
}
