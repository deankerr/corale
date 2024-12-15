import type { Node, Tree } from '@corale/chat-server'

export type LinkedNode = Node & {
  parent?: LinkedNode
  children: Set<LinkedNode>
  siblings: Set<LinkedNode>
}

type NodeId = string
type BranchId = number

export function buildNodeGraph(tree: Tree, nodes: Node[]) {
  const nodesMap = new Map<NodeId, LinkedNode>()
}
