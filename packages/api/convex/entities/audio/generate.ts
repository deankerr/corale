import ky from 'ky'
import { api, internal } from '../../_generated/api'
import type { UserReturnObject } from '../../db/users'
import { action } from '../../functions'
import { ENV } from '../../lib/env'
import type { Id } from '../../types'
import { ConvexError, v, type Infer } from '../../values'

const SoundEffectInputV = v.object({
  text: v.string(),
  duration_seconds: v.optional(v.number()),
  prompt_influence: v.optional(v.number()),
})
type SoundEffectInputV = Infer<typeof SoundEffectInputV>

async function generateSoundEffect(input: SoundEffectInputV): Promise<Blob> {
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
  args: SoundEffectInputV,
  handler: async (ctx, args) => {
    const user: UserReturnObject | null = await ctx.runQuery(api.db.users.getViewer, {})
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
