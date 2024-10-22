import { v } from 'convex/values'
import ky from 'ky'
import { internal } from '../_generated/api'
import type { ActionCtx } from '../_generated/server'
import { internalAction } from '../functions'
import { ENV } from '../lib/env'

export const run = internalAction({
  args: {
    input: v.object({
      prompt: v.string(),
      duration: v.optional(v.number()),
    }),
    userId: v.id('users'),
  },
  handler: async (ctx, { userId, input }): Promise<void> => {
    const { prompt, duration } = input

    const fileId = await soundGeneration(ctx, {
      text: prompt,
      duration_seconds: duration,
    })

    await ctx.runMutation(internal.db.audio.create, {
      userId,
      fileId,
      prompt,
      duration,
    })
  },
})

const soundGeneration = async (
  ctx: ActionCtx,
  { text, duration_seconds, prompt_influence }: { text: string; duration_seconds?: number; prompt_influence?: number },
) => {
  try {
    const blob = await ky
      .post(`https://api.elevenlabs.io/v1/sound-generation`, {
        headers: {
          'xi-api-key': ENV.ELEVENLABS_API_KEY,
        },
        json: {
          text,
          duration_seconds,
          prompt_influence,
        },
        timeout: 2 * 60 * 1000,
      })
      .blob()

    const fileId = await ctx.storage.store(blob)
    return fileId
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message)
      console.log(err.stack, err.name)
    }

    console.error(err)
    throw err
  }
}
