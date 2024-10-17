'use client'

import { useThread, useUpdateThread } from '@corale/esuite/app/lib/api/threads'
import { IconButton } from '@corale/esuite/components/ui/Button'
import * as Icons from '@phosphor-icons/react/dist/ssr'

export const FavouriteButton = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId)
  const sendUpdateThread = useUpdateThread()

  if (!thread || !thread.user.isViewer) {
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
          favourite: !thread.favourite,
        })
      }
    >
      <Icons.Star size={20} weight={thread.favourite ? 'fill' : 'regular'} />
    </IconButton>
  )
}
