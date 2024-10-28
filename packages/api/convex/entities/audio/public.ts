import type { PaginationOptions } from 'convex/server'
import { generateXID } from '../../db/helpers/xid'
import { internalMutation, query } from '../../functions'
import { emptyPage, paginatedReturnFields } from '../../lib/utils'
import type { MutationCtx, QueryCtx } from '../../types'
import { nullable, paginationOptsValidator, v, type AsObjectValidator, type Infer } from '../../values'
import { getAudio } from './db'
import { AudioCreate, AudioReturn } from './validators'

// * queries
export const get = query({
  args: {
    audioId: v.string(),
  },
  handler: async (ctx, args) => {
    const audio = await getAudio(ctx, args)
    return audio ? { ...audio, fileUrl: await ctx.storage.getUrl(audio.fileId) } : null
  },
  returns: nullable(AudioReturn),
})

// * listMy
async function listMyAudio(ctx: QueryCtx, args: { paginationOpts: PaginationOptions }) {
  const userId = ctx.viewerId
  if (!userId) return emptyPage()

  const list = await ctx
    .table('audio', 'userId', (q) => q.eq('userId', userId))
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
    .order('desc')
    .paginate(args.paginationOpts)
    .map(async (audio) => ({ ...audio, fileUrl: await ctx.storage.getUrl(audio.fileId) }))

  return list
}

export const listMy = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: listMyAudio,
  returns: v.object({ ...paginatedReturnFields, page: v.array(AudioReturn) }),
})

// * mutations
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
