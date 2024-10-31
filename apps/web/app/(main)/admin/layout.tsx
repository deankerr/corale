import { UserButtons } from '@/components/layout/UserButtons'
import { AppTitle } from '@/components/ui/AppTitle'
import { Panel } from '@/components/ui/Panel'
import Link from 'next/link'
import { AdminNav } from './admin-utils'

export const metadata = {
  title: {
    template: 'admin / %s',
    default: 'admin',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <Panel className="flex h-12 shrink-0 flex-row items-center gap-3 px-3">
        <Link href="/" aria-label="Go to home page">
          <AppTitle />
        </Link>
        <div className="text-gray-a11 font-semibold">admin</div>
        <nav className="min-w-36">
          <AdminNav />
        </nav>

        <div className="flex-end shrink-0 grow">
          <UserButtons />
        </div>
      </Panel>

      {children}
    </div>
  )
}
