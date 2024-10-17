'use client'

import { Select } from '@radix-ui/themes'
import { usePathname, useRouter } from 'next/navigation'

const routes = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/chat-models', label: 'chat models' },
  { path: '/admin/image-models', label: 'image models' },
  { path: '/admin/images', label: 'images' },
]

export const AdminNav = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Select.Root defaultValue={pathname} onValueChange={(path) => router.push(path)}>
      <Select.Trigger placeholder="Select a page" />
      <Select.Content>
        {routes.map((r) => (
          <Select.Item key={r.path} value={r.path}>
            {r.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}
