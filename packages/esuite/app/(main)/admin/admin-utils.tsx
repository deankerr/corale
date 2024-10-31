'use client'

import { Panel } from '@/components/ui/Panel'
import { twx } from '@/lib/utils'
import { Select } from '@radix-ui/themes'
import { usePathname, useRouter } from 'next/navigation'

const routes = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/chat-models', label: 'chat models' },
  { path: '/admin/runs', label: 'runs' },
]

export const AdminNav = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Select.Root defaultValue={pathname} onValueChange={(path) => router.push(path)}>
      <Select.Trigger placeholder="Select a page" />
      <Select.Content variant="soft">
        {routes.map((r) => (
          <Select.Item key={r.path} value={r.path}>
            {r.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}

export const AdminPageWrapper = twx(Panel)`grow overflow-auto p-2 gap-2`
