'use client'

import type * as LdrsType from 'ldrs'
import { useEffect, useState } from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'l-bouncy': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-dot-wave': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-dot-stream': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-zoomies': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-line-wobble': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-mirage': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-orbit': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-grid': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-ring': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-ring-2': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-square': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-reuleaux': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-cardio': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-helix': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-dot-pulse': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-ping': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-pulsar': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-ripples': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-trio': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-wobble': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
      'l-quantum': {
        size?: string | number
        color?: string | number
        speed?: string | number
      }
    }
  }
}

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
} as const

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
