import { PatternsNavPanel } from '@/components/patterns/PatternNavPanel'
import { appConfig } from '@/config/config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `${appConfig.siteTitle} · Patterns · %s`,
    default: 'Patterns',
  },
  description: appConfig.siteDescription,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PatternsNavPanel />
      {children}
    </>
  )
}
