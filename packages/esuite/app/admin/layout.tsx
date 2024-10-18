import { AdminNav } from '@/app/admin/AdminNav'
import { UserButtons } from '@/components/layout/UserButtons'
import { AppTitle } from '@/components/ui/AppTitle'
import { appConfig } from '@/config/config'
import { Theme } from '@radix-ui/themes'
import Link from 'next/link'

export const metadata = {
  title: {
    template: 'admin / %s',
    default: 'admin',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Theme className="flex h-dvh flex-col gap-2 px-3">
      <div className="flex-start border-gray-a3 bg-gray-a2 h-12 shrink-0 gap-3 rounded-lg border px-3">
        <Link href={appConfig.baseUrl} aria-label="Go to home page">
          <AppTitle />
        </Link>
        <div className="text-gray-a11 font-semibold">admin</div>
        <nav className="min-w-36">
          <AdminNav />
        </nav>

        <div className="flex-end shrink-0 grow">
          <UserButtons />
        </div>
      </div>

      {children}
    </Theme>
  )
}
