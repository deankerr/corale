import { ConvexError } from 'convex/values'
import type { MutationCtx, QueryCtx } from '../../types'
import { nullifyDeletedEnt, nullifyDeletedEntWriter } from '../helpers'

export async function getAudio(ctx: QueryCtx, { audioId }: { audioId: string }) {
  const docId = ctx.table('audio').normalizeId(audioId)
  const audio = docId ? await ctx.table('audio').get(docId) : await ctx.table('audio').get('xid', audioId)
  return nullifyDeletedEnt(audio)
}

export async function getAudioX(ctx: QueryCtx, { audioId }: { audioId: string }) {
  const audio = await getAudio(ctx, { audioId })
  if (!audio || audio.deletionTime) throw new ConvexError({ message: `Invalid audio id`, id: audioId })
  return audio
}

export async function getAudioWriter(ctx: MutationCtx, { audioId }: { audioId: string }) {
  const docId = ctx.table('audio').normalizeId(audioId)
  const audio = docId ? await ctx.table('audio').get(docId) : await ctx.table('audio').get('xid', audioId)
  return nullifyDeletedEntWriter(audio)
}

export async function getAudioWriterX(ctx: MutationCtx, { audioId }: { audioId: string }) {
  const audio = await getAudioWriter(ctx, { audioId })
  if (!audio || audio.deletionTime) throw new ConvexError({ message: `Invalid audio id`, id: audioId })
  return audio
}
