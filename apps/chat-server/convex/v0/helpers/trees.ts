import { ConvexError, type Doc, type Id, type MutationCtx, type QueryCtx } from '#common'
import type { AsObjectValidator, Infer } from 'convex/values'
import { type vNodeMessageData, type vNodeRunData } from '../schemas'
import type { vAppendArgs } from '../trees'
import { runs } from './runs'
import { generateUid } from './uid'

export type Tree = {
  id: string
  createdAt: number
  label: string
  branches: TreeBranch[]
}

export type TreeBranch = {
  id: number
  parentId?: number
  minSeq: number
  label?: string
}

function treeDTO(tree: Doc<'trees'>): Tree {
  return {
    id: tree.uid,
    createdAt: tree._creationTime,
    label: tree.label,
    branches: [{ id: 0, minSeq: 0 }, ...tree.branches],
  }
}

export type Node = {
  id: string
  createdAt: number
  treeId: string
  seq: number
  branchId: number
  branchSeq: number

  message?: Infer<typeof vNodeMessageData>
  run?: Infer<typeof vNodeRunData>
}

function nodeDTO(node: Doc<'nodes'>): Node {
  const { _id, _creationTime, uid, ...rest } = node

  return {
    id: uid,
    createdAt: node._creationTime,
    ...rest,
  }
}

const nodes = {
  async get(ctx: QueryCtx, args: { tree: Tree; branchId: number; seq?: number }) {
    const node = await ctx.db
      .query('nodes')
      .withIndex('by_treeId_branchId_seq', (q) => q.eq('treeId', args.tree.id).eq('branchId', args.branchId))
      .order('desc')
      .first()
    return node ? nodeDTO(node) : null
  },

  async require(ctx: QueryCtx, nodeId: string) {
    const node = await ctx.db
      .query('nodes')
      .withIndex('by_uid', (q) => q.eq('uid', nodeId))
      .first()
    if (!node) throw new ConvexError(`node not found: ${nodeId}`)
    return nodeDTO(node)
  },

  async requireDoc(ctx: QueryCtx, nodeId: string) {
    const node = await ctx.db
      .query('nodes')
      .withIndex('by_uid', (q) => q.eq('uid', nodeId))
      .first()
    if (!node) throw new ConvexError(`node not found: ${nodeId}`)
    return node
  },

  async listAll(ctx: QueryCtx, args: { treeId: string }): Promise<Node[]> {
    const nodes = await ctx.db
      .query('nodes')
      .withIndex('by_treeId_seq_branchId', (q) => q.eq('treeId', args.treeId))
      .order('desc')
      .collect()
    return nodes.map(nodeDTO)
  },

  async listAllByBranch(ctx: QueryCtx, args: { treeId: string }) {
    const nodes = await ctx.db
      .query('nodes')
      .withIndex('by_treeId_branchId_seq', (q) => q.eq('treeId', args.treeId))
      .order('desc')
      .collect()
    return nodes.map(nodeDTO)
  },

  async create(ctx: MutationCtx, args: Omit<Node, 'id' | 'createdAt'>) {
    const uid = await generateUid.nodes(ctx)
    await ctx.db.insert('nodes', {
      uid,
      ...args,
    })
    return uid
  },

  async update(ctx: MutationCtx, { id, ...fields }: Pick<Node, 'id' | 'message' | 'run'>) {
    const node = await nodes.requireDoc(ctx, id)
    await ctx.db.patch(node._id, fields)
  },
}

export const trees = {
  nodes,

  async get(ctx: QueryCtx, treeId: string): Promise<Tree | null> {
    const tree = await ctx.db
      .query('trees')
      .withIndex('by_uid', (q) => q.eq('uid', treeId))
      .first()
    return tree ? treeDTO(tree) : null
  },

  async require(ctx: QueryCtx, treeId: string): Promise<Tree> {
    const tree = await trees.get(ctx, treeId)
    if (!tree) {
      throw new ConvexError('Tree not found')
    }
    return tree
  },

  async requireId(ctx: QueryCtx, treeId: string): Promise<Id<'trees'>> {
    const tree = await ctx.db
      .query('trees')
      .withIndex('by_uid', (q) => q.eq('uid', treeId))
      .first()

    if (!tree) throw new ConvexError('Tree not found')
    return tree._id
  },

  async list(ctx: QueryCtx): Promise<Tree[]> {
    const trees = await ctx.db.query('trees').order('desc').collect()
    return trees.map(treeDTO)
  },

  async create(ctx: MutationCtx, args?: { label?: string }): Promise<string> {
    const uid = await generateUid.trees(ctx)
    await ctx.db.insert('trees', {
      uid,
      label: args?.label ?? '',
      branches: [],
    })
    return uid
  },

  async append(ctx: MutationCtx, args: Infer<AsObjectValidator<typeof vAppendArgs>>) {
    const tree = await trees.require(ctx, args.treeId)
    // todo check valid branch
    const branch = tree.branches.find((b) => b.id === args.branchId) ?? { id: 0, minSeq: 0 }

    const prevNode = await nodes.get(ctx, { tree, branchId: branch.id })
    const seq = prevNode ? prevNode.seq + 1 : branch.minSeq
    const branchSeq = prevNode ? prevNode.branchSeq + 1 : 0

    // ? encapsulate node creation
    const nodeId = await nodes.create(ctx, {
      treeId: tree.id,
      branchId: branch.id,
      seq,
      branchSeq,
      message: args.message ? { ...args.message, data: {}, createdAt: Date.now() } : undefined,
    })

    if (args.run) {
      // ? encapsulate node creation
      const runNodeId = await nodes.create(ctx, {
        treeId: tree.id,
        branchId: branch.id,
        seq: seq + 1,
        branchSeq: branchSeq + 1,
      })

      const runNode = await nodes.require(ctx, runNodeId)
      await runs.run(ctx, { ...args.run, tree, runNode })
    }

    return nodeId
  },

  async branch(ctx: MutationCtx, args: { treeId: string; nodeId: string; label?: string }) {
    const tree = await trees.require(ctx, args.treeId)
    const parentNode = await nodes.require(ctx, args.nodeId)

    const newBranch = {
      id: tree.branches.length + 1,
      parentId: parentNode.branchId,
      minSeq: parentNode.seq + 1,
      label: args.label,
    }

    const tree_id = await trees.requireId(ctx, args.treeId)
    await ctx.db.patch(tree_id, { branches: [...tree.branches, newBranch] })

    return newBranch.id
  },
}

export function getBranchPath(tree: Tree, branch: TreeBranch): TreeBranch[] {
  const parentBranch = tree.branches.find((b) => b.id === branch.parentId)
  if (!parentBranch) return [branch]
  return [branch, ...getBranchPath(tree, parentBranch)]
}
