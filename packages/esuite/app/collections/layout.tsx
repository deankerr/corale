import { CollectionsNavPanel } from '@/components/collections/CollectionsNavPanel'
import { appConfig } from '@/config/config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `${appConfig.siteTitle} · Collections · %s`,
    default: 'Collections',
  },
  description: appConfig.siteDescription,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CollectionsNavPanel />
      {children}
    </>
  )
}
