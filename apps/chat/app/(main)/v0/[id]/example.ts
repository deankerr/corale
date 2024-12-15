const samplebranches = [
  {
    id: 0,
    minSeq: 0,
  },
  {
    id: 2,
    minSeq: 2,
    parentId: 0,
  },
  {
    id: 3,
    minSeq: 4,
    parentId: 2,
  },
  {
    id: 4,
    minSeq: 4,
    parentId: 0,
  },
]

const samplenodes = [
  {
    branchId: 3,
    branchSeq: 2,
    id: 'wxki8k6fbiaz',
    message: {
      content: 'grapes',
    },
    seq: 6,
  },
  {
    branchId: 3,
    branchSeq: 1,
    id: '9q1frfzxoet6',
    message: {
      content: 'figs',
    },
    seq: 5,
  },
  {
    branchId: 0,
    branchSeq: 5,
    id: 'rt2jah7lli2p',
    message: {
      content: 'flag',
    },
    seq: 5,
  },
  {
    branchId: 4,
    branchSeq: 0,
    id: 'yihttxxb72ot',
    message: {
      content: 'nanana',
    },
    seq: 4,
  },
  {
    branchId: 3,
    branchSeq: 0,
    id: 'r51ifq00wffr',
    message: {
      content: 'eggs',
    },
    seq: 4,
  },
  {
    branchId: 2,
    branchSeq: 2,
    id: 'n0mn8m2tkm5e',
    message: {
      content: 'east germany',
    },
    seq: 4,
  },
  {
    branchId: 0,
    branchSeq: 4,
    id: 'yzqy2p44llwa',
    message: {
      content: 'eagle',
    },
    seq: 4,
  },
  {
    branchId: 2,
    branchSeq: 1,
    id: '5j18xf0qb5hl',
    message: {
      content: 'dallas',
    },
    seq: 3,
  },
  {
    branchId: 0,
    branchSeq: 3,
    id: 'qq0y0vzva1l4',
    message: {
      content: 'dog',
    },
    seq: 3,
  },
  {
    branchId: 2,
    branchSeq: 0,
    id: 'j1h4qa8t4kx2',
    message: {
      content: 'china',
    },
    seq: 2,
  },
  {
    branchId: 0,
    branchSeq: 2,
    id: '1hek1v24tk8h',
    message: {
      content: 'cheese',
    },
    seq: 2,
  },
  {
    branchId: 0,
    branchSeq: 1,
    id: '598nz3ijzo8y',
    message: {
      content: 'beta',
    },
    seq: 1,
  },
  {
    branchId: 0,
    branchSeq: 0,
    id: 'dhjy7b13xbz7',
    message: {
      content: 'alpha',
    },
    seq: 0,
  },
]

/**
 * A node in the conversation tree with bidirectional links to related nodes.
 * Each node represents a message in the conversation and maintains connections
 * to its parent, sequential children in the same branch, and any branches that
 * fork from this node.
 */
type NodeWithLinks = {
  id: string
  seq: number
  branchId: number
  branchSeq: number
  message: { content: string }
  parent?: NodeWithLinks
  children: NodeWithLinks[]
  branches: NodeWithLinks[]
}

/**
 * Builds a graph structure from a flat array of nodes and branches.
 * Optimized for pre-sorted data (by branch then seq, or by seq then branch).
 * Complexity: O(n) where n is the number of nodes.
 *
 * @param nodes - Array of conversation nodes
 * @param branches - Array of branch definitions
 * @returns Map of node IDs to their connected node objects
 */
function buildNodeGraph(nodes: typeof samplenodes, branches: typeof samplebranches) {
  // Create maps for quick lookups
  const nodesMap = new Map<string, NodeWithLinks>()
  const lastNodeInBranch = new Map<number, NodeWithLinks>()
  const branchesMap = new Map(branches.map((b) => [b.id, b]))

  console.log('\nProcessing nodes in chronological order:')
  // Process nodes in chronological order
  const sortedNodes = [...nodes].sort((a, b) => a.seq - b.seq)
  for (const node of sortedNodes) {
    console.log(`\nProcessing: [${node.branchId}:${node.seq}] ${node.message.content}`)
    const nodeWithLinks: NodeWithLinks = { ...node, children: [], branches: [] }
    nodesMap.set(node.id, nodeWithLinks)

    // Connect to previous node in same branch if it exists
    const prevNode = lastNodeInBranch.get(node.branchId)
    if (prevNode) {
      console.log(
        `  Connecting sequential: ${prevNode.message.content} -> ${node.message.content} (branch ${node.branchId})`,
      )
      prevNode.children.push(nodeWithLinks)
      nodeWithLinks.parent = prevNode
    }

    // Update last node in this branch
    lastNodeInBranch.set(node.branchId, nodeWithLinks)

    // If this is the first node in a branch (other than 0), connect it to its parent branch
    const branch = branchesMap.get(node.branchId)
    if (branch?.parentId !== undefined && node.branchSeq === 0) {
      // Find the last node in parent branch before this branch's minSeq
      const parentBranchNode = lastNodeInBranch.get(branch.parentId)
      if (parentBranchNode) {
        console.log(
          `  Connecting branch: ${parentBranchNode.message.content} -> ${node.message.content} (branch ${branch.parentId} -> ${node.branchId})`,
        )
        parentBranchNode.branches.push(nodeWithLinks)
        nodeWithLinks.parent = parentBranchNode
      }
    }
  }

  console.log('\nFinal node connections:')
  for (const node of nodesMap.values()) {
    console.log(`\n${node.message.content}:`)
    if (node.children.length > 0) console.log(`  children: ${node.children.map((n) => n.message.content).join(', ')}`)
    if (node.branches.length > 0) console.log(`  branches: ${node.branches.map((n) => n.message.content).join(', ')}`)
    if (node.parent) console.log(`  parent: ${node.parent.message.content}`)
  }

  return nodesMap
}

/**
 * Gets the main sequential path from a starting node, following the first child at each step.
 * Useful for showing the primary conversation flow.
 *
 * @param node - Starting node to trace path from
 * @returns Array of nodes representing the main path
 */
function getMainPath(node: NodeWithLinks): NodeWithLinks[] {
  const path: NodeWithLinks[] = [node]
  let current = node

  while (current.children.length > 0) {
    current = current.children[0]
    path.push(current)
  }

  return path
}

/**
 * Finds all points in the main path where branches diverge.
 * Returns both the node where branching occurs and the starting nodes of each branch.
 *
 * @param node - Starting node to find branch points from
 * @returns Array of objects containing the branch point and its branches
 */
function getBranchPoints(node: NodeWithLinks): Array<{
  node: NodeWithLinks
  branches: NodeWithLinks[]
}> {
  const branchPoints: Array<{ node: NodeWithLinks; branches: NodeWithLinks[] }> = []
  const path = getMainPath(node)

  for (const n of path) {
    if (n.branches.length > 0) {
      branchPoints.push({ node: n, branches: n.branches })
    }
  }

  return branchPoints
}

/**
 * Gets the complete path from root to a target node.
 * Useful for showing how to reach any point in the conversation.
 *
 * @param targetNode - The node to find the path to
 * @returns Array of nodes representing the path from root to target
 */
function getPathToNode(targetNode: NodeWithLinks): NodeWithLinks[] {
  const path: NodeWithLinks[] = [targetNode]
  let current = targetNode

  while (current.parent) {
    current = current.parent
    path.unshift(current)
  }

  return path
}

/**
 * Prints a visual representation of the graph structure.
 * Shows the hierarchy with proper indentation and branch markers.
 *
 * @param root - The root node of the graph to visualize
 */
function visualizeGraph(root: NodeWithLinks | null) {
  if (!root) {
    console.log('No graph found')
    return
  }

  function printNode(node: NodeWithLinks, depth: number = 0, branchPrefix: string = '') {
    const indent = '  '.repeat(depth)
    console.log(`${indent}${branchPrefix}[${node.branchId}:${node.seq}] ${node.message.content}`)

    // Print sequential children
    for (const child of node.children) {
      printNode(child, depth + 1)
    }

    // Print branch children with a special prefix
    for (const branch of node.branches) {
      printNode(branch, depth + 1, '↳ ')
    }
  }

  printNode(root)
}

// Test the graph structure
console.log('=== Building Graph ===')
const nodesMap = buildNodeGraph(samplenodes, samplebranches)

console.log('\n=== Finding Root ===')
const rootId = samplenodes.find((n) => n.seq === 0 && n.branchId === 0)?.id
console.log('Root ID:', rootId)
const root = nodesMap.get(rootId!)!
console.log('Root node:', root.message.content)

console.log('\n=== Test Results ===')
console.log('\nGraph size:', nodesMap.size, 'nodes')
console.log('\nFull Graph Structure:')
visualizeGraph(root)

console.log('\nMain Path:')
const mainPath = getMainPath(root)
console.log(mainPath.map((n) => `[${n.branchId}:${n.seq}] ${n.message.content}`).join(' → '))

console.log('\nBranch Points:')
const branchPoints = getBranchPoints(root)
branchPoints.forEach(({ node, branches }) => {
  console.log(`At [${node.branchId}:${node.seq}] ${node.message.content}:`)
  branches.forEach((b) =>
    console.log(`  ↳ Branch ${b.branchId} starts with [${b.branchId}:${b.seq}] ${b.message.content}`),
  )
})

// Find a node deep in branch 3 (grapes)
const grapes = nodesMap.get(samplenodes.find((n) => n.message.content === 'grapes')!.id)
if (grapes) {
  console.log('\nPath to "grapes":')
  const pathToGrapes = getPathToNode(grapes)
  console.log(pathToGrapes.map((n) => `[${n.branchId}:${n.seq}] ${n.message.content}`).join(' → '))
}

// Export the utilities for use in other files
export { type NodeWithLinks, buildNodeGraph, getMainPath, getBranchPoints, getPathToNode, visualizeGraph }
