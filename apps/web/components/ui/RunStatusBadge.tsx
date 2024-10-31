import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Badge, BadgeProps } from '@radix-ui/themes'

type Status = 'queued' | 'active' | 'done' | 'failed'

const statusProps: Record<Status, { color: BadgeProps['color']; icon: React.ReactNode }> = {
  queued: { color: 'yellow', icon: <Icons.CircleDashed size={18} /> },
  active: { color: 'blue', icon: <Icons.CircleNotch size={18} className="animate-spin" /> },
  done: { color: 'green', icon: <Icons.Check size={18} /> },
  failed: { color: 'red', icon: <Icons.WarningOctagon size={18} /> },
} as const

export const RunStatusBadge = ({ status }: { status: Status }) => {
  const { color, icon } = statusProps[status]
  return (
    <Badge color={color} size="1">
      {icon}
      {status}
    </Badge>
  )
}
