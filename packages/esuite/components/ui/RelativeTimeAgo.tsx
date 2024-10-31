'use client'

import { useIsClient } from '@/lib/useIsClient'
import { Tooltip } from '@radix-ui/themes'
import { useCallback, useEffect, useState } from 'react'

type RelativeTimeAgoProps = {
  time: number
  /** Update interval in milliseconds. Defaults to 1000ms */
  updateInterval?: number
  /** Custom format for the tooltip. Defaults to standard date string */
  tooltipFormat?: (date: Date) => string
}

const DEFAULT_INTERVALS = [
  { label: 'y', seconds: 31536000 },
  { label: 'mo', seconds: 2592000 },
  { label: 'd', seconds: 86400 },
  { label: 'h', seconds: 3600 },
  { label: 'm', seconds: 60 },
] as const

export function RelativeTimeAgo({
  time,
  updateInterval = 1000,
  tooltipFormat = (date) => date.toString().split(' GMT')[0] ?? '',
}: RelativeTimeAgoProps) {
  const isClient = useIsClient()
  const [, forceUpdate] = useState(0)

  const calculateTimeSince = useCallback((timestamp: number): string => {
    if (!Number.isFinite(timestamp)) return 'Invalid date'

    const now = Date.now()
    const diffMs = now - timestamp
    const seconds = Math.floor(Math.abs(diffMs) / 1000)

    for (const interval of DEFAULT_INTERVALS) {
      const count = Math.floor(seconds / interval.seconds)
      if (count > 0) {
        const paddedCount = count.toString().padStart(2, ' ')
        return diffMs < 0 ? `in ${paddedCount}${interval.label}` : `${paddedCount}${interval.label}`
      }
    }

    return 'now'
  }, [])

  const timeString = calculateTimeSince(time)

  useEffect(() => {
    // Only set up interval if time is within last 24 hours
    const isRecent = Math.abs(Date.now() - time) < 86400000
    if (!isRecent) return

    const intervalId = setInterval(() => forceUpdate((prev) => prev + 1), updateInterval)
    return () => clearInterval(intervalId)
  }, [time, updateInterval])

  if (!isClient) {
    return null
  }

  return (
    <Tooltip content={tooltipFormat(new Date(time))}>
      <time dateTime={new Date(time).toISOString()} className="whitespace-pre">
        {timeString}
      </time>
    </Tooltip>
  )
}
