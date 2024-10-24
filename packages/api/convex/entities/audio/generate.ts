import ky from 'ky'
import { internal } from '../../_generated/api'
import type { UserReturnObject } from '../../db/users'
import { action } from '../../functions'
import { ENV } from '../../lib/env'
import type { Id } from '../../types'
import { ConvexError, v, type AsObjectValidator, type Infer } from '../../values'

const SoundEffectInputFields = {
  text: v.string(),
  duration_seconds: v.optional(v.number()),
  prompt_influence: v.optional(v.number()),
}

async function generateSoundEffect(input: Infer<AsObjectValidator<typeof SoundEffectInputFields>>): Promise<Blob> {
  const blob = await ky
    .post(`https://api.elevenlabs.io/v1/sound-generation`, {
      headers: {
        'xi-api-key': ENV.ELEVENLABS_API_KEY,
      },
      json: input,
      timeout: 2 * 60 * 1000,
    })
    .blob()

  return blob
}

export const soundEffect = action({
  args: { ...SoundEffectInputFields, apiKey: v.optional(v.string()) },
  handler: async (ctx, { apiKey, ...args }) => {
    const user: UserReturnObject | null = await ctx.runQuery(internal.db.users.getViewerWithApiKey, {
      apiKey,
    })
    if (!user) throw new ConvexError('not authorized')

    const blob = await generateSoundEffect(args)
    const fileId: Id<'_storage'> = await ctx.storage.store(blob)

    const createArgs = {
      fileId,
      userId: user._id,
      prompt: args.text,
      duration: args.duration_seconds,
    }

    const xid: string = await ctx.runMutation(internal.entities.audio.create, createArgs)
    return xid
  },
  returns: v.string(),
})
