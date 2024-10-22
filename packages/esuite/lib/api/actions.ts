import type { ComposerSend } from '@/components/composer/Composer'
import { api } from '@corale/api/convex/_generated/api'
import { useTimeoutEffect } from '@react-hookz/web'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

const runTimeout = 2500

export const useThreadActions = (threadId: string) => {
  const router = useRouter()
  const [actionState, setActionState] = useState<'ready' | 'pending' | 'rateLimited'>('ready')

  const [_, reset] = useTimeoutEffect(() => {
    setActionState('ready')
  }, runTimeout)

  const sendAppend = useMutation(api.db.threads.append)
  const append = useCallback(
    async (args: Omit<Parameters<typeof sendAppend>[0], 'threadId'>) => {
      if (actionState !== 'ready') {
        return toast.error('Please wait before running the action again.')
      }

      setActionState('pending')

      try {
        console.log('append', args)
        const result = await sendAppend({ ...args, threadId })

        setActionState('rateLimited')
        reset()

        if (result !== threadId) {
          router.push(`/chats/${result}`)
        }

        return result
      } catch (err) {
        console.error(err)
        toast.error('An error occurred while trying to append message.')

        setActionState('ready')
        return null
      }
    },
    [actionState, sendAppend, threadId, reset, router],
  )

  const sendCreateRun = useMutation(api.db.runs.create)
  const createRun = useCallback(
    async (args: Omit<Parameters<typeof sendCreateRun>[0], 'threadId'>) => {
      if (actionState !== 'ready') {
        return toast.error('Please wait before running the action again.')
      }

      setActionState('pending')

      try {
        console.log('createRun', args)
        const result = await sendCreateRun({ ...args, threadId: threadId ?? 'new', stream: true })

        setActionState('rateLimited')
        reset()

        if (result.threadId !== threadId) {
          router.push(`/chats/${result.threadId}`)
        }

        return result
      } catch (err) {
        console.error(err)
        toast.error('An error occurred while trying to create run.')

        setActionState('ready')
        return null
      }
    },
    [actionState, reset, router, sendCreateRun, threadId],
  )

  const send = useCallback(
    async ({ text, model, action, patternId, maxCompletionTokens }: Parameters<ComposerSend>[0]) => {
      const message = {
        role: 'user' as const,
        text,
      }

      if (action === 'append') return append({ message })
      else {
        const appendMessages = text ? [message] : undefined
        return createRun({
          appendMessages,
          model: patternId ? undefined : model,
          stream: true,
          patternId,
          options: { maxCompletionTokens },
        })
      }
    },
    [append, createRun],
  )

  return { append, state: actionState, send }
}
