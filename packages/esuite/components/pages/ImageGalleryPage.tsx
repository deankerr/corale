'use client'

import { cn } from '@/app/lib/utils'
import { IImage } from '@/components/images/IImage'
import { ImageCardNext } from '@/components/images/ImageCardNext'
import type { EImage } from '@corale/api/convex/types'
import { Card, DataList } from '@radix-ui/themes'
import Link from 'next/link'

export const ImageGalleryPage = ({
  imageId,
  images,
  basePath,
}: {
  imageId: string
  // images: EImage[]
  images: any[]
  basePath: string
}) => {
  const image = images.find((image) => image.id === imageId)

  if (!image) return null
  return (
    <>
      <div className="grid h-full w-full grid-rows-[1fr_auto_auto] gap-3 overflow-y-auto overflow-x-hidden p-3 md:grid-cols-[3fr_1fr] md:grid-rows-[auto_1fr] md:overflow-y-hidden">
        <div className="md:overflow-hidden [&>div]:m-auto">
          {image && <ImageCardNext image={image} sizes="(min-width: 768px) 75vw, 100vw" />}
        </div>

        <div className={cn('flex-col-start row-start-2 w-full', images.length < 2 && 'hidden')}>
          <div className="grid h-28 auto-cols-[minmax(1fr,7rem)] grid-flow-col gap-1">
            {images.map((image) => (
              <Link
                href={`${basePath}/${image.id}`}
                key={image.id}
                className={cn(
                  'flex-col-center border-gray-4 bg-gray-a1 aspect-square h-full max-h-28 w-full max-w-28 overflow-hidden rounded-md border-2',
                  image.id === imageId && 'border-accent-9',
                )}
              >
                <IImage image={image} sizes="7rem" />
              </Link>
            ))}
          </div>
        </div>

        <div className="min-w-72 md:row-span-2 md:overflow-y-auto">
          <div className="space-y-2">
            <ImageCaptionOCRV0Cards metadata={image.metadata} />
            <ImageCaptionOCRV1Cards metadata={image.metadata} />
            <ImageGenerationDataV0Card metadata={image.metadata} />
            {image.generation && <ImageGenerationDataCard generation={image.generation} />}
            <ImageFileDataCard image={image} />
          </div>
        </div>
      </div>
    </>
  )
}

const ImageGenerationDataCard = ({ generation }: { generation: any }) => {
  if (!generation) return null
  const input = generation.input as any
  const model = input.resourceKey ? input.resourceKey.split('::')[1] : input.modelId ? input.modelId : null
  const endpoint = input.resourceKey ? input.resourceKey.split('::')[0] : null
  return (
    <Card className="space-y-2" size="2">
      <div className="pb-px text-sm font-medium">Generation Data</div>
      <DataList.Root orientation="vertical">
        <DataList.Item>
          <DataList.Label>prompt</DataList.Label>
          <DataList.Value>{input.prompt}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>model</DataList.Label>
          <DataList.Value>{model}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>endpoint</DataList.Label>
          <DataList.Value>{endpoint}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>generationId</DataList.Label>
          <DataList.Value>{generation._id}</DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </Card>
  )
}

const ImageCaptionOCRV1Cards = ({ metadata }: { metadata: any[] }) => {
  const data = metadata.find((m) => m.type === 'captionOCR_V1')
  if (!data) return null

  const paragraphs = data.description.split('. ').map((p: string) => (p.charAt(p.length - 1) === '.' ? p : p + '.'))

  return (
    <>
      <Card className="space-y-2" size="2">
        <div className="pb-px text-base font-semibold">{data.title}</div>
        {paragraphs.map((p: string, index: number) => (
          <p key={index} className="text-sm">
            {p}
          </p>
        ))}
        <p className="text-xs">
          caption by <span className="text-gray-11 font-mono text-[0.95em]">{data.modelId}</span>
        </p>
      </Card>

      {data.ocr_texts.length > 0 && (
        <Card className="space-y-2" size="2">
          <div className="pb-px text-sm font-medium">OCR</div>
          <p className="text-sm">{data.ocr_texts.join('\n')}</p>
          <p className="text-xs">
            ocr by <span className="text-gray-11 font-mono text-[0.95em]">{data.modelId}</span>
          </p>
        </Card>
      )}
    </>
  )
}

const ImageCaptionOCRV0Cards = ({ metadata }: { metadata: any[] }) => {
  const data = metadata.find((m) => m.type === 'captionOCR_V0')
  if (!data) return null

  return (
    <>
      <Card className="space-y-2" size="2">
        <div className="pb-px text-base font-semibold">{data.captionTitle}</div>
        <p className="text-sm">{data.captionDescription}</p>
        <p className="text-xs">
          caption by <span className="text-gray-11 font-mono text-[0.95em]">{data.captionModelId}</span>
        </p>
      </Card>

      {data.captionOCR && (
        <Card className="space-y-2" size="2">
          <div className="pb-px text-sm font-medium">OCR</div>
          <p className="text-sm">{data.captionOCR}</p>
          <p className="text-xs">
            ocr by <span className="text-gray-11 font-mono text-[0.95em]">{data.captionModelId}</span>
          </p>
        </Card>
      )}
    </>
  )
}

const ImageGenerationDataV0Card = ({ metadata }: { metadata: any[] }) => {
  const data = metadata.find((m) => m.type === 'generationData_V0')
  if (!data) return null

  return (
    <Card className="space-y-2" size="2">
      <div className="pb-px text-sm font-medium">Generation Data</div>
      <DataList.Root orientation="vertical">
        <DataList.Item>
          <DataList.Label>prompt</DataList.Label>
          <DataList.Value>{data.prompt}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>model</DataList.Label>
          <DataList.Value>{data.modelName}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>endpoint</DataList.Label>
          <DataList.Value>{data.endpointId}</DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </Card>
  )
}

const ImageFileDataCard = ({ image }: { image: EImage }) => {
  return (
    <Card className="space-y-2" size="2">
      <div className="pb-px text-sm font-medium">File Data</div>
      <DataList.Root orientation="vertical">
        <DataList.Item>
          <DataList.Label>created</DataList.Label>
          <DataList.Value suppressHydrationWarning>{new Date(image._creationTime).toLocaleString()}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>dimensions</DataList.Label>
          <DataList.Value>
            {image.width}x{image.height} px
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>id</DataList.Label>
          <DataList.Value className="font-mono">{image.id}</DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </Card>
  )
}
