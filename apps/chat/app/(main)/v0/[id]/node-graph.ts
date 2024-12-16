import type { Node, Tree, TreeBranch } from '@corale/chat-server'

export type LinkedNode = Node & {
  parent?: LinkedNode
  children: LinkedNode[]
  siblings: LinkedNode[]
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
  const branchesMap = buildBranchesMap(tree.branches)

  const nodesMap = new Map<NodeId, LinkedNode>()
  const leafNodes = new Map<BranchId, LinkedNode>()

  let rootNodeId = ''

  for (const node of nodes) {
    if (!rootNodeId) rootNodeId = node.id
    console.log(node.branchId)

    const linkedNode: LinkedNode = { ...node, children: [], siblings: [] }
    let parentNode = leafNodes.get(linkedNode.branchId)

    // start of new branch
    if (linkedNode.branchSeq === 0) {
      // link to node in parent branch
      const branch = branchesMap.get(linkedNode.branchId)
      if (branch && branch.parentId !== undefined) {
        parentNode = [...nodesMap.values()].find((n) => n.branchId === branch.parentId && n.seq === linkedNode.seq - 1)
      }
    }

    linkedNode.parent = parentNode

    if (parentNode) {
      // add child to parent
      parentNode.children.push(linkedNode)
      parentNode.children.sort((a, b) => a.branchId - b.branchId)

      // connect node siblings
      for (const child of parentNode.children) {
        child.siblings = parentNode.children.filter((n) => n.id !== child.id)
      }
    }

    leafNodes.set(linkedNode.branchId, linkedNode)
    nodesMap.set(linkedNode.id, linkedNode)
  }

  console.log('nodeGraph', nodesMap.size)
  return { nodesMap, leafNodes, branchesMap, rootNode: nodesMap.get(rootNodeId) }
}

function buildBranchesMap(branches: TreeBranch[]) {
  const branchesMap = new Map<BranchId, LinkedBranch>()

  for (const branch of branches) {
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

  return branchesMap
}

export function getPath(node: LinkedNode) {
  const path: LinkedNode[] = []

  const getParentNodes = (node: LinkedNode): LinkedNode[] => {
    if (node.parent) return [node, ...getParentNodes(node.parent)]
    return [node]
  }

  const getChildNodes = (node: LinkedNode): LinkedNode[] => {
    const first = [...node.children][0]
    if (first) return [node, ...getChildNodes(first)]
    return [node]
  }

  return [...getParentNodes(node).slice(1).reverse(), ...getChildNodes(node)]
}
