import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `Drawings · %s`,
    default: `Drawings`,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
