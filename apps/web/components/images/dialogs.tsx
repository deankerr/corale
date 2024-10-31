import { Button } from '@/components/ui/Button'
import { useDeleteImage } from '@/lib/api/images'
import { api } from '@corale/backend'
import { AlertDialog, Dialog } from '@radix-ui/themes'
import { useQuery } from 'convex-helpers/react/cache/hooks'
import { toast } from 'sonner'

export const DeleteImageDialog = ({
  imageId,
  children,
  ...props
}: {
  imageId: string
} & React.ComponentProps<typeof AlertDialog.Root>) => {
  const sendDeleteImage = useDeleteImage()

  return (
    <AlertDialog.Root {...props}>
      {children ? <AlertDialog.Trigger>{children}</AlertDialog.Trigger> : null}

      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete Image</AlertDialog.Title>
        <AlertDialog.Description size="2">Are you sure? This image will be gone forever.</AlertDialog.Description>

        <div className="flex-end mt-4 gap-2">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              variant="solid"
              color="red"
              onClick={() =>
                sendDeleteImage({ imageId }).catch((err) => {
                  console.error(err)
                  toast.error('Failed to delete image.')
                })
              }
            >
              Delete
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export const ImageMetadataDialog = ({
  imageId,
  children,
  ...props
}: {
  imageId: string
} & React.ComponentProps<typeof Dialog.Root>) => {
  const metadata = useQuery(api.entities.imagesMetadata.public.get, { imageId })
  return (
    <Dialog.Root {...props}>
      {children ? <Dialog.Trigger>{children}</Dialog.Trigger> : null}

      <Dialog.Content>
        <Dialog.Title>Metadata</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Here&apos;s what I have on this image:
        </Dialog.Description>

        <div className="flex flex-col gap-3">
          <pre className="bg-black-a3 overflow-x-auto whitespace-pre rounded border p-2 font-mono text-xs">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>

        <div className="flex-end mt-4 gap-2">
          <Dialog.Close>
            <Button>Close</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
