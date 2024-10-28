'use client'

import { Button } from '@/components/ui/Button'
import { api } from '@corale/api/convex/_generated/api'
import { AlertDialog } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'

export const DeleteGenerationDialog = ({
  id,
  children,
  ...props
}: {
  id: string
} & React.ComponentProps<typeof AlertDialog.Root>) => {
  const sendDestroy = useMutation(api.entities.generations.public.remove)
  const router = useRouter()

  return (
    <AlertDialog.Root {...props}>
      {children ? <AlertDialog.Trigger>{children}</AlertDialog.Trigger> : null}

      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete Generation</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This generation and its images will be gone forever.
        </AlertDialog.Description>

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
                sendDestroy({ generationId: id, destroyImages: true }).then(() => router.push('/generations'))
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
