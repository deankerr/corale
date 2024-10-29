'use client'

import { SidebarInset } from '@/components/ui/Sidebar'
import { useCollections } from '@/lib/api/collections'
import { useParams } from 'next/navigation'
import { XSBSubNavSidebar } from '../../_cmp/XSBSubNavSidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const collections = useCollections()
  const params = useParams()
  const currentId = params.collectionId

  const items =
    collections?.map((collection) => ({
      href: `/xsb/collections/${collection.xid}`,
      name: collection.xid,
      title: collection.title ?? 'untitled',
      content: '',
      isActive: currentId === collection.xid,
      time: collection._creationTime,
    })) ?? []

  return (
    <XSBSubNavSidebar title={`Collections`} rootHref="/xsb/collections" items={items}>
      <SidebarInset className="h-dvh">{children}</SidebarInset>
    </XSBSubNavSidebar>
  )
}
