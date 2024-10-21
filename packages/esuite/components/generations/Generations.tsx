'use client'

import { ScrollArea } from '@/components/ui/ScrollArea'
import { useGenerations } from '@/lib/api/generations'
import { Button } from '../ui/Button'
import { GenerationCard } from './GenerationCard'

export const Generations = () => {
  const generations = useGenerations()

  return (
    <ScrollArea>
      <div className="flex flex-col gap-2">
        {generations.results.map((gen) => (
          <GenerationCard key={gen._id} generation={gen} />
        ))}
      </div>

      <div className="flex-center w-full p-2">
        <Button
          variant="surface"
          onClick={() => generations.loadMore(40)}
          disabled={generations.status !== 'CanLoadMore'}
        >
          Load more
        </Button>
      </div>
    </ScrollArea>
  )
}
