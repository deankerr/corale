'use client'

import { useAudio } from '@corale/esuite/app/lib/api/audio'
import { Panel } from '@corale/esuite/components/ui/Panel'
import { SkeletonPulse } from '@corale/esuite/components/ui/Skeleton'
import { Card } from '@radix-ui/themes'
import dynamic from 'next/dynamic'

const AudioPlayer = dynamic(() => import('@corale/esuite/components/audio/AudioPlayer'), {
  loading: () => (
    <Card className="mx-auto aspect-[8/5] w-80">
      <SkeletonPulse className="absolute inset-0" />
    </Card>
  ),
})

export default function Page({ params }: { params: { audioId: string } }) {
  const audio = useAudio(params.audioId)

  return (
    <Panel>
      <div className="flex-col-center grow">
        {audio && audio.fileUrl ? (
          <AudioPlayer
            key={audio._id}
            url={audio.fileUrl}
            titleText={audio.generationData.prompt}
          />
        ) : null}
      </div>
    </Panel>
  )
}
