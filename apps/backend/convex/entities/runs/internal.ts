import { z } from 'zod'
import { internal } from '../../_generated/api'
import { internalMutation } from '../../functions'
import { replaceTemplateTags } from '../../lib/parse'
import type { Ent, MutationCtx } from '../../types'
import { ConvexError, v } from '../../values'
import { getChatModel } from '../chatModels/db'
import { createKvMetadata, updateKvMetadata } from '../kvMetadata'
import { createMessage } from '../messages/db'
import { getPattern } from '../patterns/db'
import { RunSchemaFields } from './validators'

export const activate = internalMutation({
  args: {
    runId: v.id('runs'),
  },
  handler: async (ctx, { runId }) => {
    const run = await ctx.skipRules.table('runs').getX(runId)
    if (run.status !== 'queued') throw new ConvexError({ message: 'run is not queued', runId })

    const pattern = run.patternId ? await getPattern(ctx, { patternId: run.patternId }) : null

    // * system instructions
    const system = [run.instructions, run.additionalInstructions]
      .map((text = '') =>
        replaceTemplateTags(text.trim(), [
          { tag: 'isodate', value: () => new Date().toISOString() },
          { tag: 'name', value: pattern?.name ?? '[the model]' },
          { tag: 'markdown', value: 'Use GFM/Markdown formatting for your response.' },
        ]),
      )
      .join('\n')
      .trim()

    // NOTE custom ctx override
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

    // TODO define the props the action actually needs
    return {
      ...run.doc(),
      system,
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

export async function threadPostRun(ctx: MutationCtx, thread: Ent<'threads'>) {
  if (thread.title) return
  await ctx.scheduler.runAfter(1000, internal.action.generateThreadTitle.run, {
    threadId: thread._id,
  })
}

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
