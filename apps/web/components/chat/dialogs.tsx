'use client'

import { Button } from '@/components/ui/Button'
import { useDeleteThread, useUpdateThread } from '@/lib/api/threads'
import { AlertDialog, Dialog, TextField } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const EditThreadTitleDialog = ({
  threadId,
  currentTitle,
  children,
  ...props
}: {
  threadId: string
  currentTitle: string
} & React.ComponentProps<typeof Dialog.Root>) => {
  const sendUpdateThread = useUpdateThread()
  const [title, setTitle] = useState(currentTitle)
  return (
    <Dialog.Root {...props}>
      {children ? <Dialog.Trigger>{children}</Dialog.Trigger> : null}

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit title</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to your thread.
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
            <Button onClick={() => sendUpdateThread({ threadId, fields: { title } })}>Save</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export const DeleteThreadDialog = ({
  threadId,
  children,
  ...props
}: {
  threadId: string
} & React.ComponentProps<typeof AlertDialog.Root>) => {
  const sendDeleteThread = useDeleteThread()
  const router = useRouter()

  return (
    <AlertDialog.Root {...props}>
      {children ? <AlertDialog.Trigger>{children}</AlertDialog.Trigger> : null}

      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete Thread</AlertDialog.Title>
        <AlertDialog.Description size="2">Are you sure? This thread will be gone forever.</AlertDialog.Description>

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
                sendDeleteThread({ threadId }).then(() => router.push('/chats'))
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
