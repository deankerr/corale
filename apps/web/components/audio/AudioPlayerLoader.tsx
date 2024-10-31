import { SkeletonPulse } from '@/components/ui/Skeleton'
import { Card } from '@radix-ui/themes'
import dynamic from 'next/dynamic'

export const AudioPlayerSkeleton = () => (
  <Card className="mx-auto aspect-[8/5] w-80">
    <SkeletonPulse className="absolute inset-0" />
  </Card>
)

export const AudioPlayer = dynamic(() => import('@/components/audio/AudioPlayer'), {
  loading: () => <AudioPlayerSkeleton />,
})
