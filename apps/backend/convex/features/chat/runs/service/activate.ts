import { internal } from '~/_generated/api'
import {
  maxConcurrentRunsPerThread,
  maxConversationMessages,
  maxRunQueuedTimeDuration,
  runQueueDelayBase,
} from '~/constants'
import { getPatternX } from '~/entities/patterns/db'
import type { MessageRoles, Run } from '~/entities/types'
import { internalMutation } from '~/functions'
import { replaceTemplateTags } from '~/lib/parse'
import type { Id } from '~/types'
import { v } from '~/values'
import { ConvexError } from 'convex/values'
import { getCurrentRunsForThread } from '../../data'

export type RunActivationData = {
  stream: boolean
  modelId: string
  modelParameters: Omit<Run['model'], 'id'>
  system: string | undefined
  messages: { role: 'user' | 'system' | 'assistant'; content: string }[]
  userId: Id<'users'>
} | null

export const activate = internalMutation({
  args: {
    runId: v.id('runs'),
  },
  handler: async (ctx, { runId }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    if (run.status !== 'queued') throw new ConvexError({ message: 'run is not queued', runId })

    // * check for other currently active/queued runs
    const maxAge = Date.now() - maxRunQueuedTimeDuration
    const currentThreadRuns = await getCurrentRunsForThread(ctx, {
      threadId: run.threadId,
      createdAfter: maxAge,
    })

    const position = currentThreadRuns.findIndex((r) => r._id === run._id)
    if (position >= maxConcurrentRunsPerThread) {
      // * check for timeout
      if (run._creationTime < maxAge) {
        console.error('max time in queue exceeded', run._id, position)
        await ctx.runMutation(internal.entities.threads.runs.fail, {
          runId,
          errors: [{ code: 'timeout', message: 'max time in queue exceeded' }],
        })
      } else {
        // * reschedule run to try again based on position
        await ctx.scheduler.runAfter(runQueueDelayBase * position, internal.entities.threads.runs.generate, { runId })
      }
      return null
    }

    // * start run setup
    const pattern = run.patternId ? await getPatternX(ctx, { patternId: run.patternId }) : null

    const system =
      replaceTemplateTags([run.instructions, run.additionalInstructions].join('\n'), [
        { tag: 'isodate', value: () => new Date().toISOString() },
        { tag: 'name', value: pattern?.name ?? '[the model]' },
        { tag: 'markdown', value: 'Use GFM/Markdown formatting for your response.' },
      ]).trim() || undefined

    const initialMessages = pattern?.initialMessages.map(formatNamePrefixMessage) ?? []

    const conversationMessages = await ctx.skipRules
      .table('messages', 'threadId_channel', (q) =>
        q.eq('threadId', run.threadId).eq('channel', undefined).lte('_creationTime', run._creationTime),
      )
      .order('desc')
      .filter((q) =>
        q.and(q.eq(q.field('deletionTime'), undefined), q.neq(q.field('text'), undefined), q.neq(q.field('text'), '')),
      )
      .take(run.options?.maxMessages ?? maxConversationMessages)
      .map(formatNamePrefixMessage)

    let messages = [...initialMessages, ...conversationMessages.reverse()]

    // insert dynamic message if present
    if (run.dynamicMessage) {
      const { role = 'system', name, text, depth = 1 } = run.dynamicMessage
      const dynamicMessage = formatNamePrefixMessage({ role, name, text })

      // calculate insertion index from n - depth
      const insertionIndex = Math.max(0, messages.length - depth)
      messages = [...messages.slice(0, insertionIndex), dynamicMessage, ...messages.slice(insertionIndex)]
    }

    // compatibility fix for certain providers if last message isn't from user
    if (messages.at(-1)?.role !== 'user') {
      messages.push({ role: 'user', content: '(continue)' })
    }

    await run.patch({
      status: 'active',
      updatedAt: Date.now(),
      timings: {
        ...run.timings,
        startedAt: Date.now(),
      },
    })

    console.debug('run', {
      pattern: {
        id: run.patternId,
        name: pattern?.name,
      },
      message1: messages.at(-2),
      message0: messages.at(-1),
      system,
    })

    const { id: modelId, ...modelParameters } = run.model

    return {
      stream: run.stream,
      modelId,
      modelParameters: {
        ...modelParameters,
        maxTokens: run.options?.maxCompletionTokens ?? modelParameters.maxTokens,
      },
      system,
      messages,
      userId: run.userId,
    }
  },
})

function formatNamePrefixMessage({ role, name, text = '' }: { role: MessageRoles; name?: string; text?: string }) {
  return {
    role,
    content: name && role !== 'system' ? `${name}: ${text}` : text,
  }
}
