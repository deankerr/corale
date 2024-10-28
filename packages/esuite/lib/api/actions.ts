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

  const sendCreateThread = useMutation(api.entities.threads.public.create)
  const createThread = useCallback(
    async (threadId: string) => {
      if (threadId && threadId !== 'new') return threadId
      console.log('create thread')
      return await sendCreateThread({})
    },
    [sendCreateThread],
  )

  const sendAppend = useMutation(api.entities.messages.public.create)
  const append = useCallback(
    async (args: Omit<Parameters<typeof sendAppend>[0], 'threadId'>) => {
      if (actionState !== 'ready') {
        return toast.error('Please wait before running the action again.')
      }
      setActionState('pending')

      try {
        console.log('append', args)
        const id = await createThread(threadId)
        const result = await sendAppend({ ...args, threadId: id })

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
    [actionState, createThread, sendAppend, threadId, reset, router],
  )

  const sendCreateRun = useMutation(api.entities.runs.public.create)
  const createRun = useCallback(
    async (args: Omit<Parameters<typeof sendCreateRun>[0], 'threadId'>) => {
      if (actionState !== 'ready') {
        return toast.error('Please wait before running the action again.')
      }

      setActionState('pending')

      try {
        console.log('createRun', args)
        const id = await createThread(threadId)

        const result = await sendCreateRun({ ...args, threadId: id, stream: true })

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
    [actionState, createThread, reset, router, sendCreateRun, threadId],
  )

  const send = useCallback(
    async ({ text, model, action, patternId, maxCompletionTokens }: Parameters<ComposerSend>[0]) => {
      const message = {
        role: 'user' as const,
        text,
      }

      if (action === 'append') return append(message)
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
