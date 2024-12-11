type Branch = string

export type TreeThread = {
  store: TreeMessage[]
  title: string
  branches: Branch[]
}

export type TreeMessage = {
  _id: string
  sequence: number
  branch: Branch
  branchSequence: number

  role: string
  text?: string
}

type InitialTreeMessage = Pick<TreeMessage, 'role' | 'text'>

const INITIAL_BRANCH = '0'

function logTree(tree: TreeThread) {
  console.log(tree.branches)
  console.log(tree.store)
}

function createRandomId() {
  return Math.random().toString(36).substring(2)
}

export function createTreeStore(title: string): TreeThread {
  const initialMessage = {
    _id: '123456',
    role: 'system',
    text: 'Initial',
    branch: INITIAL_BRANCH,
    sequence: 0,
    branchSequence: 0,
  }

  return {
    store: [initialMessage],
    title,
    branches: [INITIAL_BRANCH],
  }
}

function getLatestMessage(tree: TreeThread, branch = INITIAL_BRANCH) {
  const message = tree.store.findLast((m) => m.branch === branch)
  if (!message) throw new Error(`no message found for branch: ${branch}`)
  return message
}

function getMessageById(tree: TreeThread, messageId: string) {
  const message = tree.store.find((m) => m._id === messageId)
  if (!message) throw new Error(`no message found for id: ${messageId}`)
  return message
}

function createMessage(args: Omit<TreeMessage, '_id'>): TreeMessage {
  return {
    ...args,
    _id: createRandomId(),
  }
}

export function appendMessage(tree: TreeThread, args: { message: InitialTreeMessage; branch?: string }) {
  console.log('append message', args)
  const branch = args.branch || INITIAL_BRANCH

  const prevMessage = getLatestMessage(tree, branch)
  const newMessage = createMessage({
    ...args.message,
    sequence: prevMessage.sequence + 1,
    branch,
    branchSequence: prevMessage.branchSequence + 1,
  })

  const nextTree = {
    ...tree,
    store: [...tree.store, newMessage],
  }
  logTree(nextTree)
  return nextTree
}

export function appendMessageTo(
  tree: TreeThread,
  args: { message: InitialTreeMessage; messageId: string },
): TreeThread {
  console.log('add message to', args)

  const prevMessage = getMessageById(tree, args.messageId)
  const latestMessage = getLatestMessage(tree, prevMessage.branch)
  if (prevMessage._id === latestMessage._id) {
    return appendMessage(tree, { message: args.message, branch: prevMessage.branch })
  }

  const newBranch = getNextBranch(tree, prevMessage.branch)
  console.log('new branch:', prevMessage.branch, '->', newBranch)
  const newMessage = createMessage({
    ...args.message,
    sequence: prevMessage.sequence + 1,
    branch: newBranch,
    branchSequence: 0,
  })

  const nextTree = {
    ...tree,
    store: [...tree.store, newMessage],
    branches: [...tree.branches, newBranch],
  }
  logTree(nextTree)
  return nextTree
}

// 00-01-00-01
function getNextBranch(tree: TreeThread, currentBranch: string) {
  console.log('get next branch', currentBranch)
  const currentBranchSegments = currentBranch.split('-')

  // find existing branches from current
  const existingBranchesSegments = tree.branches
    .filter((b) => b !== currentBranch && b.startsWith(currentBranch))
    .map((b) => b.split('-').map((seg) => Number.parseInt(seg, 36)))
    .filter((b) => b.length === currentBranchSegments.length + 1)

  // this is the first branch
  if (existingBranchesSegments.length === 0) return `${currentBranch}-${INITIAL_BRANCH}`

  // find largest branch segment
  const largest = existingBranchesSegments.reduce((result, branch) => {
    if (!result) return branch

    if (!result || (branch.at(-1) ?? 0) > (result.at(-1) ?? 0)) return branch
    return result
  })

  const newBranch = largest.with(-1, (largest.at(-1) ?? -1) + 1)
  return newBranch.map((seg) => seg.toString(36)).join('-')
}

export function inc36(n: string) {
  const num = parseInt(n, 36)
  if (Number.isNaN(num)) throw new Error(`invalid branch segment: ${n}`)
  return (num + 1).toString(36).padStart(2, '0')
}
