import { z } from 'zod'
import { internal } from '../_generated/api'
import { internalMutation, mutation, query } from '../functions'
import { nullable, v } from '../values'
import { generateXID, getEntity } from './helpers/xid'

export const audioReturnFields = v.object({
  _id: v.id('audio'),
  _creationTime: v.number(),
  fileId: v.id('_storage'),
  fileUrl: nullable(v.string()),
  generationData: v.object({
    prompt: v.string(),
    modelId: v.string(),
    modelName: v.string(),
    endpointId: v.string(),
    duration: v.optional(v.number()),
  }),
  userId: v.id('users'),
  xid: v.string(),
})

export const create = internalMutation({
  args: {
    fileId: v.id('_storage'),
    prompt: v.string(),
    duration: v.optional(v.number()),
    userId: v.id('users'),
  },
  handler: async (ctx, { fileId, prompt, duration, userId }) => {
    const xid = generateXID()
    await ctx.table('audio').insert({
      fileId,
      generationData: {
        prompt,
        modelId: 'sound-generation',
        modelName: 'ElevenLabs Sound Generation',
        endpointId: 'elevenlabs',
        duration,
      },
      userId,
      xid,
    })

    return xid
  },
})

export const get = query({
  args: {
    audioId: v.string(),
  },
  handler: async (ctx, { audioId }) => {
    const audio = await getEntity(ctx, 'audio', audioId)
    return audio && !audio.deletionTime ? { ...audio, fileUrl: await ctx.storage.getUrl(audio.fileId) } : null
  },
  returns: nullable(audioReturnFields),
})

export const generate = mutation({
  args: {
    prompt: v.string(),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, { prompt, duration }) => {
    const user = await ctx.viewerX()
    const input = z
      .object({
        prompt: z.string().max(2048),
        duration: z.number().max(30).optional(),
      })
      .parse({ prompt, duration })

    await ctx.scheduler.runAfter(0, internal.action.textToAudio.run, {
      userId: user._id,
      input,
    })
  },
})
