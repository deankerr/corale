'use client'

import { useMyImagesList } from '@/app/lib/api/images'
import { ImageCardNext } from '@/components/images/ImageCardNext'
import { useLightbox } from '@/components/lightbox/hooks'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { IconButton } from '@/components/ui/Button'
import { InfiniteScroll } from '@/components/ui/InfiniteScroll'
import { Panel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { ScrollArea } from '@/components/ui/ScrollArea'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'
import { Masonry } from 'react-plock'
import { Loader } from '../ui/Loader'

export const MyImagesCollection = () => {
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')

  const images = useMyImagesList(sort)
  const slides = images.results.map((image) => ({
    type: 'image' as const,
    src: `/i/${image.id}`,
    width: image.width,
    height: image.height,
    blurDataURL: image?.blurDataUrl,
  }))

  const openLightbox = useLightbox()

  return (
    <Panel>
      <PanelHeader className="gap-1">
        <NavigationButton />
        <PanelTitle href={`/collections/all`}>All</PanelTitle>

        <div className="grow" />
        <IconButton
          variant="ghost"
          color="gray"
          aria-label="Sort"
          onClick={() => setSort(sort === 'asc' ? 'desc' : 'asc')}
        >
          {sort === 'desc' ? <Icons.SortAscending size={20} /> : <Icons.SortDescending size={20} />}
        </IconButton>
      </PanelHeader>

      <ScrollArea>
        <Masonry
          items={images.results}
          config={{
            columns: [1, 2, 3, 4],
            gap: [8, 8, 8, 8],
            media: [520, 768, 1024, 1280],
          }}
          render={(image, idx) => (
            <ImageCardNext
              key={idx}
              image={image}
              sizes="(max-width: 520px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33.33vw, 25vw"
            >
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={() =>
                  openLightbox({
                    slides,
                    index: images.results.indexOf(image),
                  })
                }
              />
            </ImageCardNext>
          )}
          className="p-2"
        />

        {images.status === 'LoadingFirstPage' ? (
          <div className="flex-center h-[98%]">
            <Loader type="grid" />
          </div>
        ) : (
          <>
            {images.results.length === 0 && <div className="text-gray-11">No images found.</div>}
            <div className="flex-center h-12">
              <InfiniteScroll
                isLoading={images.isLoading ?? false}
                hasMore={images.status !== 'Exhausted'}
                next={() => {
                  images?.loadMore(24)
                  console.log('load more')
                }}
              >
                {images.status !== 'Exhausted' && (
                  <div>
                    <Loader type="orbit" />
                  </div>
                )}
              </InfiniteScroll>
            </div>
          </>
        )}
      </ScrollArea>
    </Panel>
  )
}
