import { ImageCardNext } from '@/components/images/ImageCardNext'
import { ImageGeneratingEffect } from '@/components/images/ImageGeneratingEffect'
import { useLightbox } from '@/components/lightbox/hooks'
import { api } from '@corale/api/convex/_generated/api'
import type { TextToImageInputs } from '@corale/api/convex/entities/types'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import * as Accordion from '@radix-ui/react-accordion'
import { Badge } from '@radix-ui/themes'
import { UsePaginatedQueryReturnType } from 'convex/react'
import { ms } from 'itty-time'
import Link from 'next/link'
import { IconButton } from '../ui/Button'
import { DeleteGenerationDialog } from './dialogs'

const statusColor = {
  queued: 'yellow',
  active: 'blue',
  done: 'green',
  failed: 'red',
} as const

const statusIcon = {
  queued: <Icons.CircleDashed size={18} />,
  active: <Icons.CircleNotch size={18} className="animate-spin" />,
  done: <Icons.Check size={18} />,
  failed: <Icons.WarningOctagon size={18} />,
} as const

export const GenerationCard = ({
  generation,
  defaultOpen = false,
}: {
  generation: UsePaginatedQueryReturnType<typeof api.db.generations.list>['results'][number]
  defaultOpen?: boolean
}) => {
  const input = generation.input as TextToImageInputs
  const openLightbox = useLightbox()

  return (
    <div key={generation._id} className="bg-gray-1 divide-y rounded border">
      {/* > header */}
      <div className="flex-start h-10 gap-2 px-1 pl-2 text-sm">
        <Badge color={statusColor[generation.status]} size="2">
          {statusIcon[generation.status]}
          {generation.status}
        </Badge>

        <Link href={`/generations/${generation._id}`} className="text-gray-11 text-xs hover:underline">
          {new Date(generation._creationTime).toLocaleString()}
        </Link>
        <div className="grow" />
        <DeleteGenerationDialog id={generation._id}>
          <IconButton variant="ghost" color="red" aria-label="Delete">
            <Icons.Trash size={18} />
          </IconButton>
        </DeleteGenerationDialog>
      </div>

      {/* > details */}
      <div className="min-h-10 space-y-2 p-2 text-sm">
        <p>{input.prompt}</p>
        <div className="flex flex-wrap gap-1">
          <Badge>{input.modelId}</Badge>
          {input.size && <Badge>{input.size}</Badge>}
          <Badge>
            <Icons.ImageSquare />
            {input.n ?? 1}
          </Badge>
        </div>
      </div>

      {/* > images */}
      <div className="flex min-h-32 flex-wrap gap-2 px-2 py-2">
        {generation.images.map((image, index) => (
          <div key={image.xid} className="w-72">
            <ImageCardNext image={image} sizes="25vw">
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={() =>
                  openLightbox({
                    slides: generation.images.map((image) => ({
                      type: 'image',
                      src: `/i/${image.xid}`,
                      width: image.width,
                      height: image.height,
                      blurDataURL: image?.blurDataUrl,
                    })),
                    index,
                  })
                }
              />
            </ImageCardNext>
          </div>
        ))}

        {generation.status !== 'failed' &&
          Date.now() - generation.updatedAt < ms('30 seconds') &&
          [...Array(Math.max(0, (generation.input?.n ?? 0) - generation.images.length))].map((_, i) => (
            <div key={i} className="aspect-square w-64 overflow-hidden">
              <ImageGeneratingEffect />
            </div>
          ))}

        {generation.errors?.map((error, index) => (
          <pre key={index} className="border-red-7 bg-red-4 text-red-12 h-fit text-wrap rounded border p-2 text-xs">
            {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
          </pre>
        ))}
      </div>

      {/* > add. details */}
      <Accordion.Root type="single" collapsible defaultValue={defaultOpen ? 'gen-details' : undefined}>
        <Accordion.Item value="gen-details" className="divide-gray-4 divide-y">
          <Accordion.Trigger className="flex-between text-gray-11 outline-accent-a8 hover:text-gray-12 group w-full p-2 text-sm font-medium transition-colors">
            Details
            <Icons.CaretDown
              size={18}
              className="transition-transform duration-300 group-data-[state=open]:rotate-180"
            />
          </Accordion.Trigger>
          <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
            <div className="p-2">
              <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap font-mono text-xs leading-5">
                {JSON.stringify({ ...generation, images: undefined }, null, 2)}
                {'\n\nimages\n'}
                {JSON.stringify(generation.images, null, 2)}
              </pre>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}
