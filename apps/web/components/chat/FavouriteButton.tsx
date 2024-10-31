'use client'

import { IconButton } from '@/components/ui/Button'
import { useThread, useUpdateThread } from '@/lib/api/threads'
import { useViewer } from '@/lib/api/users'
import * as Icons from '@phosphor-icons/react/dist/ssr'

export const FavouriteButton = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId)
  const { isViewer } = useViewer(thread?.userId)
  const sendUpdateThread = useUpdateThread()

  if (!thread || !isViewer) {
    return null
  }

  return (
    <IconButton
      aria-label={thread.favourite ? 'Unfavourite thread' : 'Favourite thread'}
      variant="ghost"
      color={thread.favourite ? 'orange' : 'gray'}
      onClick={() =>
        sendUpdateThread({
          threadId: thread._id,
          fields: { favourite: !thread.favourite },
        })
      }
    >
      <Icons.Star size={20} weight={thread.favourite ? 'fill' : 'regular'} />
    </IconButton>
  )
}
