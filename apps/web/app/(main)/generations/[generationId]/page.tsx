'use client'

import { GenerationCard } from '@/components/generations/GenerationCard'
import { useGeneration } from '@/lib/api/generations'
import type { Id } from '@corale/backend/convex/types'

export default function Page({ params }: { params: { generationId: Id<'generations_v2'> } }) {
  const generation = useGeneration(params.generationId)

  return generation ? (
    <div className="w-full">
      <GenerationCard generation={generation} defaultOpen />
    </div>
  ) : null
}
