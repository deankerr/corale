import { v, type AsObjectValidator, type Infer } from 'convex/values'
import { internalMutation } from '../../functions'
import type { MutationCtx } from '../../types'
import { generateXID } from '../helpers'
import { AudioCreate } from './validators'

async function createAudio(ctx: MutationCtx, args: Infer<AsObjectValidator<typeof AudioCreate>>) {
  const xid = generateXID()
  await ctx.skipRules.table('audio').insert({
    fileId: args.fileId,
    generationData: {
      prompt: args.prompt,
      modelId: 'sound-generation',
      modelName: 'ElevenLabs Sound Generation',
      endpointId: 'elevenlabs',
      duration: args.duration,
    },
    userId: args.userId,
    xid,
  })

  return xid
}

export const create = internalMutation({
  args: AudioCreate.fields,
  handler: createAudio,
  returns: v.string(),
})
