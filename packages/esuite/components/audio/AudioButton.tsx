import { cn } from '@/lib/utils'
import type { Icon } from '@phosphor-icons/react/dist/lib/types'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'
import { useState } from 'react'
import { Play, useHowl } from 'rehowl'

const icon: Record<string, Icon> = {
  playing: Icons.Stop,
  error: Icons.FileX,
  loading: Icons.CircleNotch,
  available: Icons.SpeakerHigh,
  unavailable: Icons.SpeakerNone,
}

const AudioButton = ({
  src,
  initialPlaying = true,
  onEnd,
  ...props
}: {
  src: string
  initialPlaying?: boolean
  onEnd?: () => void
} & React.ComponentProps<typeof IconButton>) => {
  const [playing, setPlaying] = useState(initialPlaying)

  const {
    howl,
    state: howlState,
    error,
  } = useHowl({
    src,
    format: ['mp3'],
  })

  const state = error ? 'error' : howlState === 'loading' ? 'loading' : playing ? 'playing' : 'available'

  const Icon = icon[state]

  const play = () => {
    if (state === 'available') setPlaying(true)
    else setPlaying(false)
  }

  return (
    <>
      <Play
        howl={howl}
        stop={!playing}
        onEnd={() => {
          setPlaying(false)
          onEnd?.()
        }}
      />
      <IconButton
        variant="ghost"
        size="1"
        color="gray"
        onClick={() => {
          play()
        }}
        {...props}
      >
        {Icon ? <Icon className={cn('size-5', state === 'loading' && 'animate-spin')} /> : null}
      </IconButton>
    </>
  )
}

export default AudioButton
