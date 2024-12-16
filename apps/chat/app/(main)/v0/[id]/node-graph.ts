import type { Node, Tree, TreeBranch } from '@corale/chat-server'

export type LinkedNode = Node & {
  parent?: LinkedNode
  children: Set<LinkedNode>
  siblings: Set<LinkedNode>
}

export type LinkedBranch = TreeBranch & {
  parent?: LinkedBranch
  children: Set<LinkedBranch>
  siblings: Set<LinkedBranch>
}

type NodeId = string
type BranchId = number

export type NodeGraph = ReturnType<typeof buildNodeGraph>

export function buildNodeGraph(tree: Tree, nodes: Node[]) {
  const nodesMap = new Map<NodeId, LinkedNode>()
  const leafNodes = new Map<BranchId, LinkedNode>()
  const branchesMap = new Map<BranchId, LinkedBranch>()

  for (const branch of tree.branches) {
    const parentBranch = branch.parentId !== undefined ? branchesMap.get(branch.parentId) : undefined
    const linkedBranch: LinkedBranch = {
      ...branch,
      parent: parentBranch,
      children: new Set(),
      siblings: new Set(),
    }

    if (parentBranch) {
      parentBranch.children.add(linkedBranch)

      // connect branch siblings
      for (const child of parentBranch.children) {
        for (const sibling of parentBranch.children) {
          if (child === sibling) continue
          child.siblings.add(sibling)
        }
      }
    }
    branchesMap.set(branch.id, linkedBranch)
  }

  const sortedNodes = nodes.toSorted((a, b) => a.seq - b.seq)
  let rootNodeId = ''

  for (const node of sortedNodes) {
    if (!rootNodeId) rootNodeId = node.id

    const linkedNode: LinkedNode = { ...node, children: new Set(), siblings: new Set() }
    let parentNode = leafNodes.get(linkedNode.branchId)

    if (linkedNode.branchSeq === 0) {
      // link to parent branch node
      const branch = branchesMap.get(linkedNode.branchId)
      parentNode = branch?.parentId !== undefined ? leafNodes.get(branch.parentId) : undefined
    }

    linkedNode.parent = parentNode

    if (parentNode) {
      parentNode.children.add(linkedNode)

      // connect node siblings
      for (const child of parentNode.children) {
        for (const sibling of parentNode.children) {
          if (child === sibling) continue
          child.siblings.add(sibling)
        }
      }
    }
    leafNodes.set(linkedNode.branchId, linkedNode)
    nodesMap.set(linkedNode.id, linkedNode)
  }

  console.log('nodeGraph', nodesMap.size)
  return { nodesMap, leafNodes, branchesMap, rootNode: nodesMap.get(rootNodeId) }
}
