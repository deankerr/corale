import type { ComposerSend } from '@/components/composer/Composer'
import { api } from '@corale/backend'
import { useTimeoutEffect } from '@react-hookz/web'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { useUpdateThread } from './threads'

const runTimeout = 2500

export const useThreadActions = (threadId: string, baseChatRoute: string) => {
  const router = useRouter()
  const [actionState, setActionState] = useState<'ready' | 'pending' | 'rateLimited'>('ready')

  const [_, reset] = useTimeoutEffect(() => {
    setActionState('ready')
  }, runTimeout)

  const sendCreateThread = useMutation(api.entities.threads.create)
  const createThread = useCallback(
    async (threadId: string) => {
      if (threadId && threadId !== 'new') return threadId
      console.log('create thread')
      return await sendCreateThread({})
    },
    [sendCreateThread],
  )
  const updateThread = useUpdateThread()

  const sendAppend = useMutation(api.entities.threads.messages.create)
  const append = useCallback(
    async (args: Omit<Parameters<typeof sendAppend>[0], 'threadId'>) => {
      if (actionState !== 'ready') {
        return toast.error('Please wait before running the action again.')
      }
      setActionState('pending')

      try {
        console.log('append', args)
        const id = await createThread(threadId)
        await sendAppend({ ...args, threadId: id })

        setActionState('rateLimited')
        reset()

        if (id !== threadId) {
          router.push(`/${baseChatRoute}/${id}`)
        }

        return id
      } catch (err) {
        console.error(err)
        toast.error('An error occurred while trying to append message.')

        setActionState('ready')
        return null
      }
    },
    [actionState, createThread, threadId, sendAppend, reset, router, baseChatRoute],
  )

  const sendCreateRun = useMutation(api.entities.threads.runs.create)
  const createRun = useCallback(
    async (args: Omit<Parameters<typeof sendCreateRun>[0], 'threadId'>) => {
      if (actionState !== 'ready') {
        return toast.error('Please wait before running the action again.')
      }

      setActionState('pending')

      try {
        console.log('createRun', args)
        const id = await createThread(threadId)

        await sendCreateRun({ ...args, threadId: id, stream: true })

        setActionState('rateLimited')
        reset()

        // add pattern and model to thread metadata if they were used
        if (args.patternId || args.model) {
          const set: Record<string, string> = {}
          if (args.patternId) set['esuite:pattern:xid'] = args.patternId
          if (args.model) set['esuite:model:id'] = args.model.id

          await updateThread({
            threadId: id,
            fields: {
              kvMetadata: {
                set,
              },
            },
          })
        }

        if (id !== threadId) {
          router.push(`/${baseChatRoute}/${id}`)
        }

        return id
      } catch (err) {
        console.error(err)
        toast.error('An error occurred while trying to create run.')

        setActionState('ready')
        return null
      }
    },
    [actionState, createThread, reset, router, sendCreateRun, threadId, baseChatRoute, updateThread],
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
