import { query } from '../../functions'
import { nullable, omit } from '../../values'
import { UserReturn } from './validators'

export const getViewer = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await ctx.viewer()
    return viewer ? omit(viewer.doc(), ['tokenIdentifier']) : null
  },
  returns: nullable(UserReturn),
})
