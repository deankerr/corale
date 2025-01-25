'use client';
import { use } from "react";

import { Panel } from '@/components/ui/Panel'
import { SkeletonPulse } from '@/components/ui/Skeleton'
import { useAudio } from '@/lib/api/audio'
import { Card } from '@radix-ui/themes'
import dynamic from 'next/dynamic'

const AudioPlayer = dynamic(() => import('@/components/audio/AudioPlayer'), {
  loading: () => (
    <Card className="mx-auto aspect-[8/5] w-80">
      <SkeletonPulse className="absolute inset-0" />
    </Card>
  ),
})

export default function Page(props: { params: Promise<{ audioId: string }> }) {
  const params = use(props.params);
  const audio = useAudio(params.audioId)

  return (
    <Panel>
      <div className="flex-col-center grow">
        {audio && audio.fileUrl ? (
          <AudioPlayer key={audio._id} url={audio.fileUrl} titleText={audio.generationData.prompt} />
        ) : null}
      </div>
    </Panel>
  )
}
