import { useIsClient } from '@/lib/useIsClient'
import { Tooltip } from '@radix-ui/themes'
import { useEffect, useState } from 'react'

export const TimeSince = ({ time }: { time: number }) => {
  const isClient = useIsClient()
  const [timeSince, setTimeSince] = useState<string>('')

  const calculateTimeSince = (timestamp: number): string => {
    const now = Date.now()
    const diffMs = now - timestamp
    const seconds = Math.floor(Math.abs(diffMs) / 1000)

    const intervals = [
      { label: 'y', seconds: 31536000 },
      { label: 'd', seconds: 86400 },
      { label: 'h', seconds: 3600 },
      { label: 'm', seconds: 60 },
      // { label: 's', seconds: 1 },
    ]

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds)
      if (count > 0) {
        const paddedCount = count.toString().padStart(2, ' ')
        return diffMs < 0 ? `in ${paddedCount}${interval.label}` : `${paddedCount}${interval.label}`
      }
    }

    return 'now'
  }

  useEffect(() => {
    const updateTimeSince = () => {
      setTimeSince(calculateTimeSince(time))
    }

    updateTimeSince()
    const intervalId = setInterval(updateTimeSince, 1000)

    return () => clearInterval(intervalId)
  }, [time])

  if (!isClient) {
    return null
  }

  return (
    <Tooltip content={new Date(time).toString().split(' GMT')[0]}>
      <span className="whitespace-pre">{timeSince}</span>
    </Tooltip>
  )
}
