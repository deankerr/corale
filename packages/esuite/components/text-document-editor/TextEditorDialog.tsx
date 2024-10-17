'use client'

import { useThread, useUpdateThread } from '@/app/lib/api/threads'
import type { MDXEditorMethods } from '@mdxeditor/editor'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, Dialog, IconButton } from '@radix-ui/themes'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { toast } from 'sonner'
import { MDXEditor } from '../mdx-editor/MDXEditor'

export interface TextEditorDialogRef {
  open: () => void
  close: () => void
  save: () => void
}

export interface TextEditorDialogProps {
  slug: string
  children: React.ReactNode
}

export const TextEditorDialog = forwardRef<TextEditorDialogRef, TextEditorDialogProps>(
  ({ slug, children, ...props }, ref) => {
    const thread = useThread(slug)
    const [open, setOpen] = useState(false)
    const editorRef = useRef<MDXEditorMethods>(null)

    const updateThread = useUpdateThread()

    const handleSave = () => {
      const instructions = editorRef.current?.getMarkdown()
      if (!thread || !instructions) return

      updateThread({
        threadId: thread._id,
        instructions,
      })
        .catch((err) => {
          console.error(err)
          toast.error('An error occurred while trying to update the thread.')
        })
        .then(() => {
          toast.success('Thread updated successfully.')
        })
    }

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
      save: handleSave,
    }))

    return (
      <Dialog.Root open={open} onOpenChange={setOpen} {...props}>
        <Dialog.Trigger>{children}</Dialog.Trigger>
        <Dialog.Content
          aria-describedby={undefined}
          align="start"
          maxWidth="42rem"
          className="rounded-md p-0"
        >
          <div className="grid h-full max-h-[80vh] w-full grid-rows-[auto_1fr_auto] overflow-hidden rounded-md border border-grayA-3 bg-gray-3">
            {/* header */}
            <div className="flex-between h-10 border-b border-grayA-3 px-2 font-medium">
              <div className="flex-start shrink-0">
                <IconButton variant="ghost" color="gray" disabled>
                  <Icons.DotsNine className="size-5" />
                </IconButton>
              </div>

              <Dialog.Title trim="normal" className="m-0">
                <div className="text-base font-semibold">Instructions</div>
              </Dialog.Title>

              <div className="flex-end shrink-0">
                <IconButton variant="ghost" onClick={() => setOpen(false)}>
                  <Icons.X className="size-5" />
                </IconButton>
              </div>
            </div>

            {/* text area */}
            <div
              className="min-h-80 overflow-y-auto bg-blackA-4 text-gray-12 placeholder:text-grayA-10"
              onClick={() => editorRef.current?.focus()}
            >
              <MDXEditor
                ref={editorRef}
                markdown={thread?.instructions ?? ''}
                readOnly={!thread?.user.isViewer}
                placeholder="Write your instructions here..."
                contentEditableClassName="markdown-root"
              />
            </div>

            {/* footer */}
            <div className="flex h-12 items-center border-t border-grayA-3 px-2 text-sm">
              <Button variant="soft" size="1" color="gray" disabled>
                {thread?.title ?? 'Untitled Thread'}
              </Button>

              <div className="grow" />
              <div className="flex-end shrink-0 gap-2">
                {/* <Button color="gray" variant="solid">
                  Cancel
                </Button> */}
                {thread?.user.isViewer && (
                  <Button variant="solid" onClick={handleSave}>
                    Save
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    )
  },
)

TextEditorDialog.displayName = 'TextEditorDialog'
