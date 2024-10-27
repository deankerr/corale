import { z } from 'zod'
import { internal } from '../_generated/api'
import type { Id } from '../_generated/dataModel'
import { RunReturn, RunSchemaFields } from '../entities/runs/validators'
import { internalMutation, mutation, query } from '../functions'
import { ConvexError, nullable, pick, v } from '../values'
import { createKvMetadata, updateKvMetadata } from './helpers/kvMetadata'
import { generateXID, getEntity, getEntityWriter } from './helpers/xid'
import { createMessage, messageCreateFields } from './messages'
import { getChatModel } from './models'
import { threadPostRun } from './tasks'
import { getOrCreateUserThread } from './threads'

const runCreateFields = {
  threadId: v.string(),
  ...pick(RunSchemaFields, ['stream', 'options', 'instructions', 'additionalInstructions']),
  model: v.optional(RunSchemaFields.model),
  patternId: v.optional(v.string()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),

  appendMessages: v.optional(v.array(v.object(messageCreateFields))),
}

export const get = query({
  args: {
    runId: v.string(),
  },
  handler: async (ctx, { runId }) => {
    return await ctx.table('runs').get(runId as Id<'runs'>)
  },
  returns: nullable(RunReturn),
})

export const create = mutation({
  args: runCreateFields,
  handler: async (ctx, { appendMessages = [], ...args }) => {
    const thread = await getOrCreateUserThread(ctx, args.threadId)
    if (!thread) throw new ConvexError('invalid thread id')

    const pattern = args.patternId ? await getEntityWriter(ctx, 'patterns', args.patternId) : null
    if (pattern) {
      await pattern.patch({ lastUsedAt: Date.now() })
    }

    const model = args.model ?? pattern?.model
    if (!model) {
      throw new ConvexError('no model provided')
      // ? use fallback model
    }

    // * tag thread with ids to inform frontend input settings
    const threadKvMetadata = updateKvMetadata(thread.kvMetadata, {
      set: {
        'esuite:model:id': model.id,
        'esuite:pattern:xid': pattern?.xid,
      },
    })
    await thread.patch({ updatedAtTime: Date.now(), kvMetadata: threadKvMetadata })

    for (const message of appendMessages) {
      await createMessage(ctx, {
        threadId: thread._id,
        userId: thread.userId,
        ...message,
      })
    }

    const runId = await ctx.table('runs').insert({
      status: 'queued',
      stream: args.stream,
      patternId: pattern?._id,
      model,
      options: args.options ?? pattern?.options,
      instructions: args.instructions ?? pattern?.instructions,
      additionalInstructions: args.additionalInstructions,
      kvMetadata: args.kvMetadata ?? {},

      timings: {
        queuedAt: Date.now(),
      },

      threadId: thread._id,
      userId: thread.userId,

      updatedAt: Date.now(),
      xid: generateXID(),
    })

    await ctx.scheduler.runAfter(0, internal.action.run.run, {
      runId,
    })

    return {
      runId,
      threadId: thread.xid,
    }
  },
})

export const activate = internalMutation({
  args: {
    runId: v.id('runs'),
  },
  handler: async (ctx, { runId }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    if (run.status !== 'queued') throw new ConvexError({ message: 'run is not queued', runId })

    const pattern = run.patternId ? await getEntity(ctx, 'patterns', run.patternId) : null

    // TODO custom ctx
    const skipRulesCtx = { ...ctx, table: ctx.skipRules.table }

    // * create response message
    const responseMessage = await createMessage(skipRulesCtx, {
      threadId: run.threadId,
      userId: run.userId,
      role: 'assistant',
      runId,
      kvMetadata: createKvMetadata({
        'esuite:run:active': run.stream ? 'stream' : 'get',
        'esuite:model:id': run.model.id,
        'esuite:pattern:xid': pattern?.xid,
      }),
    })

    const messages: AIChatMessage[] = []

    // * pattern initial messages
    if (pattern) {
      const initialMessages = pattern.initialMessages.filter((message) => !message.channel).map(formatMessage)
      messages.push(...initialMessages)
    }

    // * conversation messages from thread
    const maxMessages = run.options?.maxMessages ?? 50
    const conversation = await ctx.skipRules
      .table('messages', 'threadId_channel', (q) =>
        q.eq('threadId', run.threadId).eq('channel', undefined).lt('_creationTime', responseMessage._creationTime),
      )
      .order('desc')
      .filter((q) => q.and(q.eq(q.field('deletionTime'), undefined), q.neq(q.field('text'), undefined)))
      .take(maxMessages)
      .map(formatMessage)
    messages.push(...conversation.reverse())

    await run.patch({
      status: 'active',
      updatedAt: Date.now(),
      timings: {
        ...run.timings,
        startedAt: Date.now(),
      },
    })

    return {
      ...run.doc(),
      messages,
      messageId: responseMessage._id,
    }
  },
})

type AIChatMessage = {
  role: 'system' | 'assistant' | 'user'
  content: string
}

function formatMessage({
  role,
  name,
  text = '',
}: {
  role: AIChatMessage['role']
  name?: string
  text?: string
}): AIChatMessage {
  const prefix = role !== 'system' && name ? `${name}: ` : ''
  return {
    role,
    content: `${prefix}${text}`,
  }
}

export const complete = internalMutation({
  args: {
    runId: v.id('runs'),
    messageId: v.id('messages'),
    text: v.string(),
    firstTokenAt: v.optional(v.number()),
    finishReason: v.string(),
    promptTokens: v.number(),
    completionTokens: v.number(),
    modelId: v.string(),
    requestId: v.string(),
  },
  handler: async (
    ctx,
    { runId, messageId, text, firstTokenAt, finishReason, promptTokens, completionTokens, modelId, requestId },
  ) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    if (run.status !== 'active') throw new ConvexError({ message: 'run is not active', runId })

    const chatModel = await getChatModel(ctx, run.model.id)
    const cost = chatModel
      ? getInferenceCost({
          pricing: chatModel.pricing,
          usage: {
            promptTokens,
            completionTokens,
          },
        })
      : undefined

    const message = await ctx.skipRules.table('messages').getX(messageId)
    const kvMetadata = message.kvMetadata ?? {}
    await message.patch({
      text,
      kvMetadata: updateKvMetadata(kvMetadata, {
        delete: ['esuite:run:active'],
        set: {
          'esuite:model:name': chatModel?.name,
        },
      }),
    })

    await run.patch({
      status: 'done',
      updatedAt: Date.now(),
      timings: {
        ...run.timings,
        endedAt: Date.now(),
        firstTokenAt,
      },
      usage: {
        cost,
        finishReason,
        promptTokens,
        completionTokens,
        modelId,
        requestId,
      },
      results: [
        {
          type: 'message',
          id: messageId,
        },
      ],
    })

    await threadPostRun(ctx, await message.edgeX('thread'))
  },
})

export const fail = internalMutation({
  args: {
    runId: v.id('runs'),
    errors: v.array(RunSchemaFields.errors.element),
  },
  handler: async (ctx, { runId, errors }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    if (run.status !== 'active') throw new ConvexError({ message: 'run is not active', runId })

    await run.patch({
      status: 'failed',
      updatedAt: Date.now(),
      timings: {
        ...run.timings,
        endedAt: Date.now(),
      },
      errors: [...(run.errors ?? []), ...errors],
    })

    try {
      const messages = await ctx.skipRules
        .table('messages', 'runId', (q) => q.eq('runId', runId).gte('_creationTime', run._creationTime))
        .order('desc')

      for (const message of messages) {
        const kvMetadata = updateKvMetadata(message.kvMetadata, {
          delete: ['esuite:run:active'],
          set: {
            'esuite:run:error': errors.at(-1)?.message ?? 'unknown error',
          },
        })

        await message.patch({ kvMetadata })
      }
    } catch (err) {
      console.error('Failed to update run message', err)
    }
  },
})

const OpenRouterMetadataSchema = z.object({
  id: z.string(),
  model: z.string(),
  total_cost: z.number(),
  finish_reason: z.string(),
  native_tokens_prompt: z.number(),
  native_tokens_completion: z.number(),
})

export const updateProviderMetadata = internalMutation({
  args: {
    runId: v.id('runs'),
    providerMetadata: v.record(v.string(), v.any()),
  },
  handler: async (ctx, { runId, providerMetadata }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)

    const parsed = OpenRouterMetadataSchema.safeParse(providerMetadata)
    if (parsed.success) {
      const { total_cost, finish_reason, native_tokens_prompt, native_tokens_completion, id, model } = parsed.data

      await run.patch({
        updatedAt: Date.now(),
        usage: {
          cost: total_cost,
          finishReason: finish_reason,
          promptTokens: native_tokens_prompt,
          completionTokens: native_tokens_completion,
          modelId: model,
          requestId: id,
        },
        providerMetadata,
      })
    } else {
      await run.patch({
        updatedAt: Date.now(),
        providerMetadata,
      })
    }
  },
})

function getInferenceCost({
  pricing,
  usage,
}: {
  pricing: {
    tokenInput: number
    tokenOutput: number
  }
  usage: {
    promptTokens: number
    completionTokens: number
  }
}) {
  return (usage.promptTokens * pricing.tokenInput + usage.completionTokens * pricing.tokenOutput) / 1_000_000
}
