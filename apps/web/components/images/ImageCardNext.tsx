import { CreateCollectionDialog } from '@/components/collections/dialogs'
import { DotsThreeFillY } from '@/components/icons/DotsThreeFillY'
import { DeleteImageDialog, ImageMetadataDialog } from '@/components/images/dialogs'
import { IconButton } from '@/components/ui/Button'
import { useCollections } from '@/lib/api/collections'
import { useViewer } from '@/lib/api/users'
import { getConvexSiteUrl } from '@/lib/utils'
import { api, type Image } from '@corale/backend'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import NextImage from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { AdminOnlyUi } from '../util/AdminOnlyUi'
import imageLoader from './image-loader'

export const ImageCardNext = ({
  image,
  sizes,
  children,
}: {
  image: Image
  sizes: string
  children?: React.ReactNode
}) => {
  const collections = useCollections()
  const updateCollection = useMutation(api.entities.collections.public.update)
  const { isViewer } = useViewer(image.ownerId)

  const isSaved = image.collectionIds.length > 0
  return (
    <div key={image.xid} style={{ aspectRatio: image.width / image.height }} className="overflow-hidden rounded-lg">
      <NextImage
        alt=""
        key={image.xid}
        src={`/i/${image.xid}`}
        placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={image?.blurDataUrl}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className="h-full w-full object-cover"
        loader={imageLoader}
      />
      <div className="border-gray-a5 absolute inset-0 rounded-lg border-2" />
      {children}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton aria-label="Options menu" variant="ghost" highContrast className="absolute right-1 top-1">
            <DotsThreeFillY width={28} height={28} />
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content variant="soft">
          <Link href={`${getConvexSiteUrl()}/i/${image.xid}?download`}>
            <DropdownMenu.Item>
              <Icons.DownloadSimple />
              Download
            </DropdownMenu.Item>
          </Link>

          <ImageMetadataDialog imageId={image.xid}>
            <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
              <Icons.Info />
              View metadata
            </DropdownMenu.Item>
          </ImageMetadataDialog>

          {isViewer && (
            <>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>
                  <Icons.Plus />
                  Add to collection
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <CreateCollectionDialog imageId={image._id}>
                    <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>Create new…</DropdownMenu.Item>
                  </CreateCollectionDialog>
                  <DropdownMenu.Separator />

                  {collections?.map((collection) => {
                    const isInCollection = image.collectionIds?.some((id) => id === collection._id)

                    return (
                      <DropdownMenu.CheckboxItem
                        key={collection.xid}
                        checked={isInCollection}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateCollection({
                              collectionId: collection._id,
                              images_v2: {
                                add: [image._id],
                              },
                            })
                              .then(() => toast.success('Image added to collection'))
                              .catch((error) => {
                                console.error(error)
                                toast.error('Failed to add image to collection')
                              })
                          } else {
                            updateCollection({
                              collectionId: collection._id,
                              images_v2: {
                                remove: [image._id],
                              },
                            })
                              .then(() => toast.success('Image removed from collection'))
                              .catch((error) => {
                                console.error(error)
                                toast.error('Failed to remove image from collection')
                              })
                          }
                        }}
                        onSelect={(e) => {
                          e.preventDefault()
                        }}
                      >
                        {collection.title}
                      </DropdownMenu.CheckboxItem>
                    )
                  })}
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>

              <DropdownMenu.Separator />

              <DeleteImageDialog imageId={image.xid}>
                <DropdownMenu.Item color="red" onSelect={(e) => e.preventDefault()}>
                  <Icons.Trash />
                  Delete
                </DropdownMenu.Item>
              </DeleteImageDialog>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <AdminOnlyUi>
        {isSaved ? (
          <div className="absolute left-1 top-1">
            <Icons.FloppyDisk />
          </div>
        ) : null}
      </AdminOnlyUi>
    </div>
  )
}
