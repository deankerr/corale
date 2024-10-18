import { generateText } from 'ai'
import { v } from 'convex/values'
import { internal } from '../_generated/api'
import { internalAction, internalMutation, internalQuery } from '../functions'
import { createAi } from '../lib/ai'

export const run = internalAction({
  args: {
    threadId: v.id('threads'),
  },
  handler: async (ctx, { threadId }): Promise<void> => {
    const messages = await ctx.runQuery(internal.action.generateThreadTitle.getRecentMessages, {
      threadId,
      limit: 4,
    })

    const { model } = createAi('openai::gpt-4o-mini')
    const { text } = await generateText({
      model,
      prompt: prompt.replace(
        '%%%',
        messages
          .map((message) => message.text)
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
      id: threadId,
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

export const getRecentMessages = internalQuery({
  args: {
    threadId: v.id('threads'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { threadId, limit = 4 }) => {
    const thread = await ctx.skipRules.table('threads').getX(threadId)

    const messages = await thread
      .edge('messages')
      .order('desc')
      .filter((q) =>
        q.and(
          q.eq(q.field('deletionTime'), undefined),
          q.neq(q.field('text'), undefined),
          q.neq(q.field('role'), 'system'),
        ),
      )
      .take(limit)

    return messages.reverse()
  },
})
