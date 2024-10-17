'use client'

import { useKeyboardEvent } from '@react-hookz/web'
import { useConvex } from 'convex/react'

type ConvexClientInternals = {
  listeners: Map<string, any>
  cachedSync: {
    optimisticQueryResults: {
      queryResults: Map<string, any>
    }
  }
}

export const ConvexClientLogger = () => {
  const convex = useConvex()
  useKeyboardEvent('C', (e) => {
    if (!e.ctrlKey && !e.shiftKey) return
    const c = convex as unknown as ConvexClientInternals
    console.log('=== convex query results ===')
    c.cachedSync.optimisticQueryResults.queryResults.forEach((query) => {
      console.log(query)
    })
  })

  return null
}
