'use client'

import { useUser } from '@clerk/nextjs'

export const AdminOnlyUi = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useUser()
  const isAdmin = user?.publicMetadata.role === 'admin'

  return isAdmin ? children : null
}
