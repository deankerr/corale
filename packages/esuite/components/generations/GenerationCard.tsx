import { ImageCardNext } from '@/components/images/ImageCardNext'
import { ImageGeneratingEffect } from '@/components/images/ImageGeneratingEffect'
import { useLightbox } from '@/components/lightbox/hooks'
import { api } from '@corale/api/convex/_generated/api'
import type { RunConfigTextToImageV2 } from '@corale/api/convex/types'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import * as Accordion from '@radix-ui/react-accordion'
import { Badge } from '@radix-ui/themes'
import { UsePaginatedQueryReturnType } from 'convex/react'
import { ms } from 'itty-time'
import Link from 'next/link'

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
  const input = generation.input as RunConfigTextToImageV2
  const openLightbox = useLightbox()

  return (
    <div key={generation._id} className="divide-y rounded border bg-gray-1">
      {/* > header */}
      <div className="flex-start h-10 gap-2 px-1 pl-2 text-sm">
        <Badge color={statusColor[generation.status]} size="2">
          {statusIcon[generation.status]}
          {generation.status}
        </Badge>

        <Link
          href={`/generations/${generation._id}`}
          className="text-xs text-gray-11 hover:underline"
        >
          {new Date(generation._creationTime).toLocaleString()}
        </Link>
        <div className="grow" />
        {/* <IconButton variant="ghost" color="red" aria-label="Delete">
          <Icons.Trash size={18} />
        </IconButton> */}
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
          <div key={image.id} className="w-72">
            <ImageCardNext image={image} sizes="25vw">
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={() =>
                  openLightbox({
                    slides: generation.images.map((image) => ({
                      type: 'image',
                      src: `/i/${image.id}`,
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
          [...Array(Math.max(0, (generation.input?.n ?? 0) - generation.images.length))].map(
            (_, i) => (
              <div key={i} className="aspect-square w-64 overflow-hidden">
                <ImageGeneratingEffect />
              </div>
            ),
          )}

        {generation.errors?.map((error, index) => (
          <pre
            key={index}
            className="h-fit text-wrap rounded border border-red-7 bg-red-4 p-2 text-xs text-red-12"
          >
            {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
          </pre>
        ))}
      </div>

      {/* > add. details */}
      <Accordion.Root
        type="single"
        collapsible
        defaultValue={defaultOpen ? 'gen-details' : undefined}
      >
        <Accordion.Item value="gen-details" className="divide-y divide-gray-4">
          <Accordion.Trigger className="group flex-between w-full p-2 text-sm font-medium text-gray-11 outline-accentA-8 transition-colors hover:text-gray-12">
            Details
            <Icons.CaretDown
              size={18}
              className="transition-transform duration-300 group-data-[state=open]:rotate-180"
            />
          </Accordion.Trigger>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="p-2">
              <pre className="max-h-64 overflow-y-auto text-wrap font-mono text-xs">
                {JSON.stringify({ ...generation, images: undefined }, null, 2)}
                {JSON.stringify(generation.images, null, 2)}
              </pre>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}
