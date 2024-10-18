import { generateText } from 'ai'
import { v } from 'convex/values'
import { api, internal } from '../_generated/api'
import { internalAction, internalMutation, internalQuery } from '../functions'
import { createAi } from '../lib/ai'

export const run = internalAction({
  args: {
    messageId: v.id('messages'),
  },
  handler: async (ctx, { messageId }): Promise<void> => {
    const message = await ctx.runQuery(api.db.messages.get, {
      messageId,
    })
    if (!message) {
      throw new Error('message not found')
    }

    const messages = await ctx.runQuery(internal.action.generateThreadTitle.getConversation, {
      messageId,
      limit: 4,
    })

    const { model } = createAi('openai::gpt-4o-mini')
    const { text } = await generateText({
      model,
      prompt: prompt.replace(
        '%%%',
        messages
          .filter((message) => message.role !== 'system')
          .map((message) => `${message.role}: ${message.content}`)
          .join('\n')
          .slice(0, 800),
      ),
      maxTokens: 1024,
    })

    const title = text.split('\n').at(-1)
    if (!title) {
      throw new Error('title is missing')
    }

    await ctx.runMutation(internal.action.generateThreadTitle.setTitle, {
      id: message.threadId,
      title,
    })
  },
})

export const setTitle = internalMutation({
  args: {
    id: v.id('threads'),
    title: v.string(),
  },
  handler: async (ctx, { id, title }) => {
    return await ctx.skipRules.table('threads').getX(id).patch({ title })
  },
})

const prompt = `
The following messages are from the start of a conversation that a user has just initiated with
another large language model. Your task is to create a succinct and concise summary of the
conversation so far, and create a title for the conversation, which is no more than 6 words.
It is critically important that you do not add any extra notes or explanations to the title, as this
will cause an overflow of the title text and make it difficult for the user to understand what the
title is about. Add any extra notes in the summary section instead.

<BEGIN MESSAGE HISTORY>
%%%
<END MESSAGE HISTORY>

Your response should be in this format:

# Summary
(your summary here)

# Title
(your title here)
`

export const getConversation = internalQuery({
  args: {
    messageId: v.id('messages'),
    limit: v.optional(v.number()),
    prependNamesToContent: v.optional(v.boolean()),
  },
  handler: async (ctx, { messageId, limit = 20, prependNamesToContent = false }) => {
    const message = await ctx.table('messages').getX(messageId)

    const messages = await ctx
      .table('messages', 'threadId', (q) =>
        q.eq('threadId', message.threadId).lt('_creationTime', message._creationTime),
      )
      .order('desc')
      .filter((q) => q.and(q.eq(q.field('deletionTime'), undefined), q.neq(q.field('text'), undefined)))
      .take(limit)
      .map((message) => ({
        role: message.role,
        name: prependNamesToContent ? undefined : message.name,
        content:
          prependNamesToContent && message.role === 'user' && message.name !== undefined
            ? `${message.name}: ${message.text}`
            : message.text || '',
      }))

    const thread = await ctx.skipRules.table('threads').getX(message.threadId)
    if (thread.instructions) {
      messages.push({
        role: 'system',
        content: thread.instructions.replace('{{date}}', new Date().toISOString()),
        name: undefined,
      })
    }

    return messages.reverse()
  },
})
