import { AppShell } from '@/components/app-shell/app-shell'

export const metadata = {
  title: 'chat',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
