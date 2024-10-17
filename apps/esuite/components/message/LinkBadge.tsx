import { Badge } from '@corale/esuite/components/ui/Badge'
import { Link } from '@corale/esuite/components/ui/Link'
import { RiExternalLinkLine } from '@remixicon/react'

import type { Url } from 'next/dist/shared/lib/router/router'

export const LinkBadge = ({ href, ...props }: React.ComponentProps<typeof Link>) => {
  if (!href) return null

  const label = getLabel(href)
  return (
    <Link href={href} className="opacity-90 hover:opacity-100" {...props}>
      <Badge className="select-none" color="bronze">
        {label} <RiExternalLinkLine size="1.3em" />
      </Badge>
    </Link>
  )
}

const getLabel = (url: string | Url) => {
  try {
    if (typeof url === 'string') {
      const parsed = new URL(url)
      return parsed.hostname
    } else {
      return url.hostname?.toString() ?? url.pathname?.toString() ?? ''
    }
  } catch (err) {
    console.error(err)
    return typeof url === 'string' ? url : ''
  }
}
