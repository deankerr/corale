'use client'

import type * as LdrsType from 'ldrs'
import { useEffect, useState } from 'react'

const loaderComponents = {
  dotWave: 'l-dot-wave',
  dotStream: 'l-dot-stream',
  zoomies: 'l-zoomies',
  lineWobble: 'l-line-wobble',
  mirage: 'l-mirage',
  orbit: 'l-orbit',
  grid: 'l-grid',
  ring: 'l-ring',
  ring2: 'l-ring-2',
  square: 'l-square',
  reuleaux: 'l-reuleaux',
  cardio: 'l-cardio',
  helix: 'l-helix',
  quantum: 'l-quantum',
  wobble: 'l-wobble',
  trio: 'l-trio',
  dotPulse: 'l-dot-pulse',
  ping: 'l-ping',
  pulsar: 'l-pulsar',
  ripples: 'l-ripples',
} satisfies Partial<Record<keyof typeof LdrsType, keyof JSX.IntrinsicElements>>

export function Loader({
  type,
  ...props
}: {
  type: keyof typeof loaderComponents
  color?: string
  size?: number
  speed?: number
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    async function getLoader() {
      const Ldrs = await import('ldrs')
      Ldrs[type].register()
    }
    getLoader()
  }, [type])

  if (!isClient) return null

  const Component = loaderComponents[type]
  return <Component color="var(--accent-11)" {...props} />
}
