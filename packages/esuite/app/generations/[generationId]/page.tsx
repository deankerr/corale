'use client';
import { use } from "react";

import { GenerationCard } from '@/components/generations/GenerationCard'
import { useGeneration } from '@/lib/api/generations'
import type { Id } from '@corale/api/convex/types'

export default function Page(props: { params: Promise<{ generationId: Id<'generations_v2'> }> }) {
  const params = use(props.params);
  const generation = useGeneration(params.generationId)

  return generation ? (
    <div className="w-full">
      <GenerationCard generation={generation} defaultOpen />
    </div>
  ) : null
}
