import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `Audio · %s`,
    default: `Audio`,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
