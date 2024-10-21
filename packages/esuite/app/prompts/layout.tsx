import { PromptsNavPanel } from '@/components/prompts/PromptsNavPanel'
import { appConfig } from '@/config/config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `${appConfig.siteTitle} · Prompts · %s`,
    default: 'Prompts',
  },
  description: appConfig.siteDescription,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PromptsNavPanel />
      {children}
    </>
  )
}
