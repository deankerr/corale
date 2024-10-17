import { useCollections } from '@/app/lib/api/collections'
import { CreateCollectionDialog } from '@/components/collections/dialogs'
import { DotsThreeFillY } from '@/components/icons/DotsThreeFillY'
import { DeleteImageDialog } from '@/components/images/dialogs'
import { IconButton } from '@/components/ui/Button'
import { api } from '@corale/api/convex/_generated/api'
import type { EImage } from '@corale/api/convex/types'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import NextImage from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import imageLoader from './image-loader'

export const ImageCardNext = ({
  image,
  sizes,
  children,
}: {
  image: EImage
  sizes: string
  children?: React.ReactNode
}) => {
  const collections = useCollections()
  const updateCollection = useMutation(api.db.collections.update)

  return (
    <div key={image.id} style={{ aspectRatio: image.width / image.height }} className="overflow-hidden rounded-lg">
      <NextImage
        alt=""
        key={image.id}
        src={`/i/${image.id}`}
        placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={image?.blurDataUrl}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className="h-full w-full object-cover"
        loader={imageLoader}
      />
      <div className="border-grayA-5 absolute inset-0 rounded-lg border-2" />
      {children}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton aria-label="Options menu" variant="ghost" highContrast className="absolute right-1 top-1">
            <DotsThreeFillY width={28} height={28} />
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content variant="soft">
          <Link href={`/convex/${image.id}?download`}>
            <DropdownMenu.Item>
              <Icons.DownloadSimple />
              Download
            </DropdownMenu.Item>
          </Link>

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
                    key={collection.id}
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

          <DeleteImageDialog id={image.id}>
            <DropdownMenu.Item color="red" onSelect={(e) => e.preventDefault()}>
              <Icons.Trash />
              Delete
            </DropdownMenu.Item>
          </DeleteImageDialog>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
