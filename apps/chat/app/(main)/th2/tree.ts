import { customAlphabet } from 'nanoid'

export type TreeBranchRecord = {
  id: string
  name: string
  parentId: string
  sequence: number
}

export type TreeStore = {
  store: TreeNode[]
  defaultBranchId: string
  branches: TreeBranchRecord[]
  title: string
}

export type TreeNode = {
  id: string
  sequence: number
  branchId: string
  branchSequence: number

  data: TreeMessageData
}

export type TreeMessageData = {
  role: string
  text?: string
}

export function createTreeStore(title: string): TreeStore {
  return {
    store: [],
    defaultBranchId: 'root',
    branches: [],
    title,
  }
}

function createMessage(args: Omit<TreeNode, 'id'>): TreeNode {
  return {
    ...args,
    id: `${args.branchId}${args.sequence}`,
  }
}

export function appendMessage(tree: TreeStore, args: { message: TreeMessageData; branchId?: string }): TreeStore {
  console.log('append message', args)

  const branch = getBranch(tree, args.branchId ?? '') ?? getDefaultBranch(tree)

  const prevMessage = getLatestMessage(tree, { branchId: branch.id })
  const newMessage = createMessage({
    data: args.message,
    sequence: prevMessage ? prevMessage.sequence + 1 : 0,
    branchId: branch.id,
    branchSequence: prevMessage ? prevMessage.branchSequence + 1 : 0,
  })
  console.log('new message', newMessage)
  return {
    ...tree,
    store: [...tree.store, newMessage],
  }
}

export function appendBranchingMessage(
  tree: TreeStore,
  args: { message: TreeMessageData; messageId: string; branchName?: string },
): TreeStore {
  console.log('append branching message', args)
  const prevMessage = getNodeById(tree, args.messageId)
  if (!prevMessage) {
    throw new Error(`Message ${args.messageId} not found`)
  }

  const sequence = prevMessage.sequence + 1

  const newBranch = getNewBranch(tree.branches, {
    parentBranchId: prevMessage.branchId,
    branchName: args.branchName,
    sequence,
  })

  const newMessage = createMessage({
    data: args.message,
    sequence,
    branchId: newBranch.id,
    branchSequence: 0,
  })

  return {
    ...tree,
    store: [...tree.store, newMessage],
    branches: [...tree.branches, newBranch],
  }
}

// util

function getNewBranch(
  branches: TreeBranchRecord[],
  args: { parentBranchId: string; sequence: number; branchName?: string },
): TreeBranchRecord {
  const parentBranch = branches.find((b) => b.id === args.parentBranchId)
  if (!parentBranch) {
    throw new Error(`Parent branch ${args.parentBranchId} not found`)
  }

  function getNewBranchId(): string {
    const newBranchId = generateRandomString(8)
    const isUnique = !branches.some((b) => b.id === newBranchId)
    return isUnique ? newBranchId : getNewBranchId()
  }

  const newBranchId = getNewBranchId()

  const newBranch = { id: newBranchId, name: args.branchName ?? '', parentId: parentBranch.id, sequence: args.sequence }
  console.log('new branch', newBranch)
  return newBranch
}

function generateRandomString(length: number): string {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
  const nanoid = customAlphabet(alphabet, length)
  return nanoid()
}

function getLatestMessage(tree: TreeStore, args: { branchId?: string }): TreeNode | undefined {
  const branchId = args.branchId ?? tree.defaultBranchId
  return tree.store.findLast((m) => m.branchId === branchId)
}

export function getNodeById(tree: TreeStore, messageId: string): TreeNode | undefined {
  return tree.store.find((m) => m.id === messageId)
}

function getDefaultBranch(tree: TreeStore): TreeBranchRecord {
  return { id: tree.defaultBranchId, name: tree.defaultBranchId, parentId: '', sequence: 0 }
}

export function getBranch(tree: TreeStore, branchId: string) {
  if (branchId === tree.defaultBranchId) return getDefaultBranch(tree)
  return tree.branches.find((branch) => branch.id === branchId)
}

export function getBranchPathToRoot(tree: TreeStore, branch: TreeBranchRecord | undefined): TreeBranchRecord[] {
  if (!branch) return []
  if (branch.id === tree.defaultBranchId) return [branch]
  return [branch, ...getBranchPathToRoot(tree, getBranch(tree, branch.parentId))]
}

export function inefficientlyGetAllNodesFrom(tree: TreeStore, node: TreeNode): TreeNode[] {
  const branches = getBranchPathToRoot(tree, getBranch(tree, node.branchId))

  const snodes = tree.store.toSorted((a, b) => b.sequence - a.sequence)

  const result: TreeNode[] = []
  for (const branch of branches) {
    const maxSeq = result.at(-1)?.sequence ?? Infinity
    const bNodes = snodes.filter((node) => node.sequence < maxSeq && node.branchId === branch.id)
    result.push(...bNodes)
  }

  return result.reverse()
}

export function getAllLeafNodes(tree: TreeStore) {
  return tree.branches.map((b) => tree.store.findLast((n) => n.branchId === b.id)).filter((n) => n !== undefined)
}
