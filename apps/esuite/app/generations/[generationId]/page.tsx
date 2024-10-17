'use client'

import { useGeneration } from '@corale/esuite/app/lib/api/generations'
import { GenerationCard } from '@corale/esuite/components/generations/GenerationCard'

import type { Id } from '@corale/api/convex/types'

export default function Page({ params }: { params: { generationId: Id<'generations_v2'> } }) {
  const generation = useGeneration(params.generationId)

  return generation ? (
    <div className="w-full">
      <GenerationCard generation={generation} defaultOpen />
    </div>
  ) : null
}
