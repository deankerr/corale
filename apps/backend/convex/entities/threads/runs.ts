import { internal } from '../../_generated/api'
import type { Id } from '../../_generated/dataModel'
import { maxConversationMessages } from '../../constants'
import { internalAction, internalMutation, mutation, query } from '../../functions'
import { replaceTemplateTags } from '../../lib/parse'
import { ConvexError, nullable, paginationOptsValidator, pick, v } from '../../values'
import { generateXID } from '../helpers'
import { createKvMetadata, updateKvMetadata } from '../kvMetadata'
import { createMessage } from '../messages/db'
import { getPattern, getPatternWriterX, getPatternX } from '../patterns/db'
import { getThread, getThreadWriterX } from '../threads/db'
import type { MessageRoles, Run } from '../types'
import { getUser } from '../users/db'
import { getRun } from './runs/entity'
import { generateAIText } from './runs/generate'
import { RunCreate, RunReturn, RunSchemaFields } from './runs/validators'

export const generate = internalAction({
  args: {
    runId: v.id('runs'),
  },
  handler: generateAIText,
  returns: v.null(),
})

// * queries
export const get = query({
  args: {
    runId: v.string(),
  },
  handler: async (ctx, { runId }) => {
    return getRun(ctx, { runId })
  },
  returns: nullable(RunReturn),
})

export const getTextStreams = query({
  args: {
    runId: v.id('runs'),
  },
  handler: async (ctx, { runId }): Promise<{ content: string; _id: Id<'texts'> }[]> => {
    const run = await getRun(ctx, { runId })
    if (!run) return []

    const texts = await ctx
      .table('texts', 'runId', (q) => q.eq('runId', run._id))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map((text) => ({ content: text.content, _id: text._id }))
    return texts
  },
  returns: v.array(v.object({ content: v.string(), _id: v.id('texts') })),
})

export const adminListAll = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    if (user.role !== 'admin') throw new ConvexError('Unauthorized')

    return await ctx
      .table('runs')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(args.paginationOpts)
      .map(async (run) => {
        const { userId, threadId, patternId } = run
        const user = await getUser(ctx, userId)
        const thread = await getThread(ctx, { threadId })

        return {
          ...run,
          pattern: patternId ? await getPattern(ctx, { patternId }) : undefined,
          instructions: run.instructions?.slice(0, 20),
          username: user?.name ?? 'Unknown',
          threadTitle: thread?.title ?? 'Unknown',
        }
      })
  },
})

// * create run - called by frontend with config options to request a run
export const create = mutation({
  args: RunCreate,
  handler: async (ctx, args) => {
    const thread = await getThreadWriterX(ctx, { threadId: args.threadId })
    const pattern = args.patternId ? await getPatternWriterX(ctx, { patternId: args.patternId }) : null

    // * merge pattern (if present) with run params
    const patternParams = pattern ? pick(pattern, ['model', 'options', 'instructions', 'dynamicMessage']) : {}
    const runParams = pick(args, [
      'model',
      'options',
      'instructions',
      'dynamicMessage',

      'stream',
      'additionalInstructions',
      'kvMetadata',
    ])
    const params = { ...patternParams, ...runParams }

    const model = params.model
    if (!model) throw new ConvexError({ message: 'no model specified' })

    const runXID = generateXID()
    // * run queued, any further errors will safely undo this mutation
    const runId = await ctx.table('runs').insert({
      ...params,
      model,
      status: 'queued',
      patternId: pattern?._id,
      threadId: thread._id,
      userId: thread.userId,
      xid: runXID,
      timings: {
        queuedAt: Date.now(),
      },
      updatedAt: Date.now(),
    })

    if (args.appendMessages) {
      for (const message of args.appendMessages) {
        await createMessage(ctx, {
          threadId: thread._id,
          userId: thread.userId,
          ...message,
        })
      }
    }

    // * ai response message
    await createMessage(ctx, {
      threadId: thread._id,
      userId: thread.userId,
      role: 'assistant',
      runId,
      kvMetadata: createKvMetadata({
        'esuite:run:active': params.stream ? 'stream' : 'get',
        'esuite:model:id': model.id,
        'esuite:pattern:xid': pattern?.xid,
      }),
    })

    await ctx.scheduler.runAfter(0, internal.entities.threads.runs.generate, {
      runId,
    })

    return runXID
  },
  returns: v.string(),
})

// * activate run - called by the scheduled action to collect the run inputs and mark the run as active
export const activate = internalMutation({
  args: {
    runId: v.id('runs'),
  },
  handler: async (ctx, { runId }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    if (run.status !== 'queued') throw new ConvexError({ message: 'run is not queued', runId })

    const pattern = run.patternId ? await getPatternX(ctx, { patternId: run.patternId }) : null

    const system = replaceTemplateTags([run.instructions, run.additionalInstructions].join('\n'), [
      { tag: 'isodate', value: () => new Date().toISOString() },
      { tag: 'name', value: pattern?.name ?? '[the model]' },
      { tag: 'markdown', value: 'Use GFM/Markdown formatting for your response.' },
    ]).trim()

    const initialMessages = pattern?.initialMessages.map(formatNamePrefixMessage) ?? []

    const conversationMessages = await ctx.skipRules
      .table('messages', 'threadId_channel', (q) =>
        q.eq('threadId', run.threadId).eq('channel', undefined).lt('_creationTime', run.timings.queuedAt),
      )
      .order('desc')
      .filter((q) => q.and(q.eq(q.field('deletionTime'), undefined), q.neq(q.field('text'), undefined)))
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

    await run.patch({
      status: 'active',
      updatedAt: Date.now(),
      timings: {
        ...run.timings,
        startedAt: Date.now(),
      },
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

export type RunActivationData = {
  stream: boolean
  modelId: string
  modelParameters: Omit<Run['model'], 'id'>
  system: string
  messages: { role: 'user' | 'system' | 'assistant'; content: string }[]
  userId: Id<'users'>
}

function formatNamePrefixMessage({ role, name, text = '' }: { role: MessageRoles; name?: string; text?: string }) {
  if (name && role !== 'system') {
    return {
      role,
      content: `${name}: ${text}`,
    }
  }

  return {
    role,
    content: text,
  }
}

// * complete run - update message with final result, update run with usage stats/timings
export const complete = internalMutation({
  args: {
    runId: v.id('runs'),
    text: v.string(),
    finishReason: v.string(),
    usage: v.object({
      promptTokens: v.number(),
      completionTokens: v.number(),
      totalTokens: v.number(),
    }),
    modelId: v.string(),
    requestId: v.string(),
    firstTokenAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const run = await ctx.skipRules.table('runs').getX(args.runId)
    if (run.status !== 'active') {
      throw new ConvexError({ message: 'run is not active', runId: args.runId })
    }

    // Get response message
    const message = await ctx.skipRules
      .table('messages')
      .filter((q) =>
        q.and(
          q.eq(q.field('runId'), run._id),
          q.eq(q.field('role'), 'assistant'),
          q.eq(q.field('deletionTime'), undefined),
        ),
      )
      .first()

    if (!message) {
      throw new ConvexError({ message: 'response message not found', runId: args.runId })
    }

    // Update message
    const kvMetadata = updateKvMetadata(message.kvMetadata ?? {}, {
      delete: ['esuite:run:active'],
      set: {
        'esuite:model:id': args.modelId,
      },
    })
    await message.patch({ text: args.text, kvMetadata })

    // Update run
    await run.patch({
      status: 'done',
      updatedAt: Date.now(),
      timings: {
        ...run.timings,
        endedAt: Date.now(),
        firstTokenAt: args.firstTokenAt,
      },
      usage: {
        finishReason: args.finishReason,
        promptTokens: args.usage.promptTokens,
        completionTokens: args.usage.completionTokens,
        modelId: args.modelId,
        requestId: args.requestId,
      },
      results: [
        {
          type: 'message',
          id: message._id,
        },
      ],
    })
  },
  returns: v.null(),
})

// * fail run - update run with error messages, timings
export const fail = internalMutation({
  args: {
    runId: v.id('runs'),
    errors: v.array(
      v.object({
        code: v.string(),
        message: v.string(),
        data: v.optional(v.any()),
      }),
    ),
  },
  handler: async (ctx, { runId, errors }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    if (run.status !== 'active') {
      throw new ConvexError({ message: 'run is not active', runId })
    }

    // Update run
    await run.patch({
      status: 'failed',
      updatedAt: Date.now(),
      timings: {
        ...run.timings,
        endedAt: Date.now(),
      },
      errors: [...(run.errors ?? []), ...errors],
    })

    // Update message with error
    const message = await ctx.skipRules
      .table('messages')
      .filter((q) =>
        q.and(
          q.eq(q.field('runId'), run._id),
          q.eq(q.field('role'), 'assistant'),
          q.eq(q.field('deletionTime'), undefined),
        ),
      )
      .first()

    if (message) {
      const kvMetadata = updateKvMetadata(message.kvMetadata ?? {}, {
        delete: ['esuite:run:active'],
        set: {
          'esuite:run:error': errors.at(-1)?.message ?? 'Unknown error',
        },
      })
      await message.patch({ kvMetadata })
    }
  },
  returns: v.null(),
})

// * update post run provider usage data
export const updateProviderMetadata = internalMutation({
  args: {
    runId: v.id('runs'),
    usage: RunSchemaFields.usage,
    providerMetadata: v.record(v.string(), v.any()),
  },
  handler: async (ctx, { runId, usage, providerMetadata }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    await run.patch({
      usage: usage ?? run.usage,
      providerMetadata,
    })
  },
  returns: v.null(),
})
