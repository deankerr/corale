import { ChatsNavPanel } from '@corale/esuite/components/chat/ChatsNavPanel'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `Chats · %s`,
    default: `Chats`,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChatsNavPanel />
      {children}
    </>
  )
}
