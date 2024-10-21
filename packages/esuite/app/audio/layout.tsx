import { appConfig } from '@/config/config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `${appConfig.siteTitle} · Audio · %s`,
    default: 'Audio',
  },
  description: appConfig.siteDescription,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
