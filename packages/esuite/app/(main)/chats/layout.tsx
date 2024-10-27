import { ChatsNavPanel } from '@/components/chat/ChatsNavPanel'
import { appConfig } from '@/config/config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `${appConfig.siteTitle} · Chats · %s`,
    default: 'Chats',
  },
  description: appConfig.siteDescription,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChatsNavPanel />
      {children}
    </>
  )
}
