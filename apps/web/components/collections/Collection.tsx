'use client'

import { DeleteCollectionDialog, EditCollectionTitleDialog } from '@/components/collections/dialogs'
import { DotsThreeFillX } from '@/components/icons/DotsThreeFillX'
import { ImageCardNext } from '@/components/images/ImageCardNext'
import { useLightbox } from '@/components/lightbox/hooks'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { IconButton } from '@/components/ui/Button'
import { InfiniteScroll } from '@/components/ui/InfiniteScroll'
import { Panel, PanelEmpty, PanelHeader, PanelLoading, PanelTitle } from '@/components/ui/Panel'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { useCollection, useCollectionImages } from '@/lib/api/collections'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu, Grid } from '@radix-ui/themes'
import { useState } from 'react'
import { Masonry } from 'react-plock'
import { Loader } from '../ui/Loader'

export const Collection = ({ collectionId }: { collectionId: string }) => {
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')

  const collection = useCollection(collectionId)
  const collectionImages = useCollectionImages(collection?._id, sort)
  const images =
    collectionImages?.results && collectionImages.results.length > 0
      ? collectionImages.results
      : collection?.images

  const openLightbox = useLightbox()
  const slides = images?.map((image) => ({
    type: 'image' as const,
    src: `/i/${image.xid}`,
    width: image.width,
    height: image.height,
    blurDataURL: image?.blurDataUrl,
  }))

  if (!collection) return collection === null ? <PanelEmpty /> : <PanelLoading />

  return (
    <Panel>
      <PanelHeader className="gap-1">
        <NavigationButton />
        <PanelTitle href={`/collections/${collection.xid}`}>{collection.title}</PanelTitle>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" color="gray" aria-label="More options">
              <DotsThreeFillX width={20} height={20} />
            </IconButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content variant="soft">
            <EditCollectionTitleDialog collectionId={collection.xid} currentTitle={collection.title}>
              <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
                <Icons.Pencil /> Edit title
              </DropdownMenu.Item>
            </EditCollectionTitleDialog>

            <DeleteCollectionDialog collectionId={collection.xid}>
              <DropdownMenu.Item color="red" onSelect={(e) => e.preventDefault()}>
                <Icons.Trash /> Delete
              </DropdownMenu.Item>
            </DeleteCollectionDialog>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

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
          items={images ?? []}
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
                    slides: slides ?? [],
                    index: images?.indexOf(image) ?? 0,
                  })
                }
              />
            </ImageCardNext>
          )}
          className="p-2"
        />

        {collectionImages?.status === 'LoadingFirstPage' ? (
          <div className="flex-center h-[98%]">
            <Grid />
          </div>
        ) : (
          <>
            {images?.length === 0 && <div className="text-gray-11">No images found.</div>}
            <div className="flex-center h-12">
              <InfiniteScroll
                isLoading={collectionImages?.isLoading ?? false}
                hasMore={collectionImages?.status !== 'Exhausted'}
                next={() => {
                  collectionImages?.loadMore(24)
                  console.log('load more')
                }}
              >
                {collectionImages?.status !== 'Exhausted' && (
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
