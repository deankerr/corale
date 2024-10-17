import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `Drawing · %s`,
    default: `Drawing`,
  },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
