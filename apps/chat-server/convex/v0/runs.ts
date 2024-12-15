import { internalMutation, v } from '#common'
import { trees } from './helpers/trees'
import { vNodeMessageData } from './schemas'

export const addMessageToNode = internalMutation({
  args: {
    id: v.string(),
    message: vNodeMessageData,
  },
  handler: async (ctx, args) => {
    await trees.nodes.update(ctx, args)
  },
})
