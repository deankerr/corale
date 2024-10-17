import { PromptsNavPanel } from '@corale/esuite/components/prompts/PromptsNavPanel'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `Prompts · %s`,
    default: `Prompts`,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PromptsNavPanel />
      {children}
    </>
  )
}
