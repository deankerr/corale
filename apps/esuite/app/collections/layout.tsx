import { CollectionsNavPanel } from '@/components/collections/CollectionsNavPanel'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `Collections · %s`,
    default: `Collections`,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CollectionsNavPanel />
      {children}
    </>
  )
}
