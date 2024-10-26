'use client'

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
}

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

  const Component = loaderComponents[type]
  if (!isClient || !Component) return null
  const loaderProps = { color: 'var(--accent-11)', ...props } as any
  return <Component {...loaderProps} />
}
