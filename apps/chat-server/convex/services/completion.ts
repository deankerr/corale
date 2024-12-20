import { openrouter } from '@openrouter/ai-sdk-provider'
import { api } from '#api'
import { internalAction, v } from '#common'
import { generateText } from 'ai'
import { withSystemFields } from 'convex-helpers/validators'
import { vMessagesTableSchema } from '../chat/schemas'

export const completion = internalAction({
  args: {
    input: v.object({
      messages: v.array(v.object(withSystemFields('messages', vMessagesTableSchema))),
      modelId: v.string(),
      system: v.optional(v.string()),
    }),
    output: v.object({
      messageId: v.id('messages'),
    }),
  },
  handler: async (ctx, args) => {
    console.log('completion', args)
    const { messages, modelId, system } = args.input

    const completion = await generateText({
      model: openrouter(modelId),
      messages: messages.map((m) => ({
        role: m.role,
        content: m.text ?? '',
      })),
      system,
    })

    await ctx.runMutation(api.chat.db.updateMessage, {
      messageId: args.output.messageId,
      message: {
        text: completion.text,
      },
    })
  },
})
