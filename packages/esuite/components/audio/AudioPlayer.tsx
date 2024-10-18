import { cn } from '@/lib/utils'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Card, IconButton, Inset } from '@radix-ui/themes'
import AudioMotionAnalyzer from 'audiomotion-analyzer'
import { Howler } from 'howler'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Play, useHowl } from 'rehowl'
import MeshBg from './AudiPlayerMeshBg.svg'

export default function AudioPlayer({ url, titleText }: { url: string; titleText: string }) {
  const [playing, setPlaying] = useState(false)
  const [loop, setLoop] = useState(false)
  const { howl } = useHowl({ src: [url], format: ['mp3'], preload: true })

  const visualizerRef = useRef<HTMLDivElement>(null)
  const [audioMotion, setAudioMotion] = useState<AudioMotionAnalyzer | null>(null)

  const createAudioMotion = () => {
    if (!visualizerRef.current || audioMotion) return

    const node = (howl as any)._sounds[0]._node as AudioNode
    if (!node) return console.error('audio node missing')

    const newAudioMotion = new AudioMotionAnalyzer(visualizerRef.current, {
      audioCtx: Howler.ctx,
      source: node,
      showFPS: false,
      connectSpeakers: false,

      ansiBands: false,
      showScaleX: false,
      bgAlpha: 0,
      overlay: true,
      mode: 6,
      frequencyScale: 'log',
      showPeaks: true,
      smoothing: 0.7,
      ledBars: true,
      radial: false,
      gradient: 'classic',
    })

    setAudioMotion(newAudioMotion)
  }

  const stop = () => {
    setPlaying(false)
    audioMotion?.destroy()
    setAudioMotion(null)
  }

  const overlayCn = 'rounded-lg bg-black/5 p-1.5 text-sm font-medium text-white h-fit backdrop-blur-2xl'

  return (
    <Card className="mx-auto aspect-[8/5] w-80">
      <Inset>
        <Image unoptimized src={MeshBg} alt="" className="-scale-x-100" />
      </Inset>

      {/* visualizer */}
      <div ref={visualizerRef} className="absolute inset-0"></div>

      {/* overlay */}
      <div className="absolute inset-0 grid grid-rows-3 gap-1 p-3">
        <div className="flex justify-between">
          <div className={overlayCn}>
            <Icons.Waveform className="inline size-5" /> sound effect
          </div>

          <div className="space-x-1">
            <IconButton
              variant={loop ? 'outline' : 'ghost'}
              color="gray"
              highContrast
              className="m-0"
              onClick={() => setLoop(!loop)}
            >
              <Icons.Repeat className="size-5" />
            </IconButton>

            <Link href={url} target="_blank">
              <IconButton variant="ghost" color="gray" highContrast className="m-0">
                <Icons.DownloadSimple className="size-5" />
              </IconButton>
            </Link>
          </div>
        </div>

        <div className="flex-center">
          <IconButton
            variant="solid"
            size="4"
            radius="full"
            color="orange"
            onClick={() => {
              if (playing) return stop()

              if (!audioMotion) createAudioMotion()
              setPlaying(true)
            }}
            className="outline-gray-a3 hover:outline-gray-a5 outline brightness-110"
          >
            {playing ? <Icons.Stop className="size-6" /> : <Icons.Play className="size-6" />}
          </IconButton>
        </div>

        <div className="flex-col-end">
          <div className={cn(overlayCn, 'mx-auto line-clamp-2 text-center text-base')}>{titleText}</div>
        </div>
      </div>

      <Play
        howl={howl}
        stop={!playing}
        loop={loop}
        onEnd={() => {
          if (!loop) stop()
        }}
      />
    </Card>
  )
}
