import { Button } from '@/components/ui/Button'
import { api } from '@corale/api'
import type { Id } from '@corale/api/convex/types'
import { AlertDialog, Dialog, TextField } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export const CreateCollectionDialog = ({
  imageId,
  children,
  ...props
}: {
  imageId?: Id<'images_v2'>
} & React.ComponentProps<typeof Dialog.Root>) => {
  const router = useRouter()
  const createCollection = useMutation(api.entities.collections.public.create)
  const [title, setTitle] = useState('')
  return (
    <Dialog.Root {...props}>
      {children ? <Dialog.Trigger>{children}</Dialog.Trigger> : null}

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Create collection</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Create a new collection with this image.
        </Dialog.Description>

        <div className="flex flex-col gap-3">
          <label>
            Title
            <TextField.Root
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your new title"
            />
          </label>
        </div>

        <div className="flex-end mt-4 gap-2">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button
              onClick={() =>
                createCollection({ title, imageIds: imageId ? [imageId] : undefined })
                  .then((id) => {
                    toast.success('Collection created')
                    router.push(`/collections/${id}`)
                  })
                  .catch((error) => {
                    console.error(error)
                    toast.error('Failed to create collection')
                  })
              }
            >
              Create
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export const EditCollectionTitleDialog = ({
  collectionId,
  currentTitle,
  children,
  ...props
}: {
  collectionId: string
  currentTitle: string
} & React.ComponentProps<typeof Dialog.Root>) => {
  const updateCollection = useMutation(api.entities.collections.public.update)
  const [title, setTitle] = useState(currentTitle)
  return (
    <Dialog.Root {...props}>
      {children ? <Dialog.Trigger>{children}</Dialog.Trigger> : null}

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit title</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to your collection.
        </Dialog.Description>

        <div className="flex flex-col gap-3">
          <label>
            Title
            <TextField.Root
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your new title"
            />
          </label>
        </div>

        <div className="flex-end mt-4 gap-2">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={() => updateCollection({ collectionId, title })}>Save</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export const DeleteCollectionDialog = ({
  collectionId,
  children,
  ...props
}: {
  collectionId: string
} & React.ComponentProps<typeof AlertDialog.Root>) => {
  const deleteCollection = useMutation(api.entities.collections.public.remove)
  const router = useRouter()

  return (
    <AlertDialog.Root {...props}>
      {children ? <AlertDialog.Trigger>{children}</AlertDialog.Trigger> : null}

      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete Collection</AlertDialog.Title>
        <AlertDialog.Description size="2">Are you sure? This collection will be gone forever.</AlertDialog.Description>

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
              onClick={() => {
                deleteCollection({ collectionId })
                  .then(() => {
                    toast.success('Collection deleted')
                    router.push('/collections')
                  })
                  .catch((error) => {
                    console.error(error)
                    toast.error('Failed to delete collection')
                  })
              }}
            >
              Delete
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
