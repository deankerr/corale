import { internal } from '#api'
import { ConvexError, type Doc, type MutationCtx } from '#common'
import type { CoreMessage } from 'ai'
import { getBranchPath, trees, type Node, type Tree } from './trees'

const limit = 20

const defaultModelId = 'anthropic/claude-3.5-haiku:beta'

export const runs = {
  async run(ctx: MutationCtx, args: { tree: Tree; runNode: Node; modelId?: string; instructions?: string }) {
    const init = args.tree.branches.find((b) => b.id === args.runNode.branchId)
    if (!init) throw new ConvexError('invalid branch for runNode')

    const conversationNodes: Doc<'nodes'>[] = []
    const branchPath = getBranchPath(args.tree, init)
    let seq = args.runNode.seq
    console.log('branchPath', branchPath, seq)

    for (const branch of branchPath) {
      if (limit - conversationNodes.length <= 0) break

      const branchNodes = await ctx.db
        .query('nodes')
        .withIndex('by_treeId_branchId_seq', (q) =>
          q.eq('treeId', args.tree.id).eq('branchId', branch.id).lte('seq', seq),
        )
        .order('desc')
        .take(limit - conversationNodes.length)

      console.log(
        'tree',
        args.tree.id,
        'branch',
        branch.id,
        'max',
        seq,
        'min',
        branch.minSeq,
        'take',
        limit - conversationNodes.length,
      )

      console.log('loop', branch, seq, branchNodes)
      conversationNodes.push(...branchNodes)
      seq = branch.minSeq - 1
    }

    conversationNodes.reverse()

    console.log('nodes', conversationNodes)
    await trees.nodes.update(ctx, {
      id: args.runNode.id,
      run: {
        conversationNodeIds: conversationNodes.map((n) => n.uid),
        modelId: args.modelId ?? defaultModelId,
        instructions: args.instructions ?? '',
      },
    })

    const mnodes = conversationNodes
      .map((n) => n.message)
      .filter((m) => m !== undefined)
      .filter((m) => m.role !== 'tool') as CoreMessage[]

    await ctx.scheduler.runAfter(0, internal.services.completion.nodeCompletion, {
      messages: mnodes,
      system: args.instructions || undefined,
      modelId: defaultModelId,
      outputNodeId: args.runNode.id,
    })
  },
}
