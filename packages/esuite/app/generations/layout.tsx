import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `Generations · %s`,
    default: `Generations`,
  },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
