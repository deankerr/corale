'use client'

import { ChatComposer } from '@/components/chat-trees/chat-composer'
import { Panel, PanelContent, PanelHeader } from '@/components/layout/panel'
import { TextareaAutosize } from '@/components/textarea-autosize'
import type { Node, Tree, TreeBranch } from '@corale/chat-server'
import { api } from '@corale/chat-server/api'
import { truncateString } from '@corale/shared/strings'
import { MarkdownRenderer } from '@corale/ui/components/ui/markdown-renderer'
import { Button } from '@ui/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/components/ui/tabs'
import { cn } from '@ui/lib/utils'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { buildNodeGraph, type LinkedNode } from './node-graph'
import { TreeFlow } from './tree-flow'

const branchColors = [
  '',
  'bg-red-900/40',
  'bg-blue-900/40',
  'bg-indigo-900/40',
  'bg-yellow-900/40',
  'bg-purple-900/40',
  'bg-green-900/40',
  'bg-pink-900/40',
  'bg-teal-900/40',
  'bg-cyan-900/40',
  'bg-orange-900/40',
  'bg-sky-900/40',
  'bg-violet-900/40',
  'bg-fuchsia-900/40',
]

export default function Page({ params }: { params: { id: string } }) {
  const tree = useQuery(api.v0.trees.get, { treeId: params.id })
  const nodes = useQuery(api.v0.trees.listAllNodes, { treeId: params.id })
  const append = useMutation(api.v0.trees.append)
  const branch = useMutation(api.v0.trees.branch)

  const [instructionsValue, setInstructionsValue] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState('')

  if (!tree || !nodes) {
    return <div>Tree not found</div>
  }

  const nodesSeqGroups = new Map<number, Node[]>()

  for (const node of nodes ?? []) {
    const group = nodesSeqGroups.get(node.seq) ?? []
    group.push(node)
    nodesSeqGroups.set(node.seq, group)
  }

  const nodeGraph = buildNodeGraph(tree, nodes)

  return (
    <Panel>
      <PanelHeader>{tree.label || `Tree ${tree.id}`}</PanelHeader>
      <PanelContent>
        <Tabs defaultValue="full">
          <TabsList>
            <TabsTrigger value="full">Full</TabsTrigger>
            <TabsTrigger value="totem">Totem</TabsTrigger>
            <TabsTrigger value="choose">Choose</TabsTrigger>
            <TabsTrigger value="flow">Flow</TabsTrigger>
          </TabsList>
          <TabsContent value="full">
            <TreeFull treeId={params.id} />
          </TabsContent>
          <TabsContent value="totem">
            <TreeTotem treeId={params.id} />
          </TabsContent>
          <TabsContent value="choose">
            <TreeChoose treeId={params.id} />
          </TabsContent>
          <TabsContent value="flow">
            <TreeFlow nodeGraph={nodeGraph} />
          </TabsContent>
        </Tabs>
      </PanelContent>
    </Panel>
  )
}

const TreeTotem = ({ treeId }: { treeId: string }) => {
  const tree = useQuery(api.v0.trees.get, { treeId })
  const nodes = useQuery(api.v0.trees.listAllNodes, { treeId })
  const append = useMutation(api.v0.trees.append)
  const branch = useMutation(api.v0.trees.branch)

  const [instructionsValue, setInstructionsValue] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState('')

  const [path, setPath] = useState([0])
  const [branchPathToRoot, setBranchPathToRoot] = useState<TreeBranch[]>([])
  const [nodePath, setNodePath] = useState<Node[]>([])

  if (!tree || !nodes) {
    return <div>Tree not found</div>
  }

  const getParentBranchId = (branchId: number) => {
    const branch = tree.branches.find((b) => b.id === branchId)
    if (!branch) return 0
    return branch.parentId
  }

  const leafNodes = tree.branches.map((b) => nodes.find((n) => n.branchId === b.id)).filter((n) => n !== undefined)
  const leafPaths = leafNodes.map((leafNode) => {
    const path = new Set<Node>([leafNode])
    let branch = tree.branches.find((b) => b.id === leafNode.branchId)

    for (const node of nodes) {
      if (!branch) break
      if (node.branchId !== branch.id) continue
      path.add(node)
      if (node.branchSeq === 0) {
        branch = tree.branches.find((b) => b.id === branch?.parentId)
      }
    }

    return path
  })

  return (
    <>
      <ChatInstructions value={instructionsValue} onValueChange={setInstructionsValue} />
      <div className="m-1 flex gap-1 rounded border p-1">
        {leafNodes.map((node) => (
          <div key={node.id} className={cn(branchColors[node.branchId % branchColors.length])}>
            <MessageNode node={node} />
            <div className="border p-1 font-mono text-xs">
              {JSON.stringify(getBranchPath(tree, tree.branches.find((b) => b.id === node.branchId)!))}
            </div>
          </div>
        ))}
      </div>

      <div className="m-1 flex">
        {leafPaths.map((path, i) => {
          return (
            <div key={i} className="flex flex-col gap-1 px-3">
              {[...path.values()].reverse().map((node) => (
                <div key={node.id} className={cn(branchColors[node.branchId % branchColors.length])}>
                  <MessageNode node={node} />
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <div className="mb-2 flex h-[70vh] flex-col items-center gap-2">
        {nodes.toReversed().map((node) => {
          if (!path.includes(node.branchId)) return null
          const siblings = nodes.filter((n) => n.seq === node.seq && n.branchSeq === 0 && n.branchId !== node.branchId)
          const isLatest = !nodes.some((n) => n.branchId === node.branchId && n.seq === node.seq + 1)

          return (
            <div key={node.id} className="flex gap-2">
              <div className={cn('w-80', branchColors[node.branchId % branchColors.length])}>
                <MessageNode node={node} />
              </div>

              {siblings.map((sibling) => (
                <div
                  key={sibling.id}
                  className={cn('w-80 opacity-30', branchColors[sibling.branchId % branchColors.length])}
                  onClick={() => {
                    const parentBranchId = getParentBranchId(sibling.branchId)
                    console.log(parentBranchId)
                    if (parentBranchId === undefined) {
                      setPath([0])
                      return
                    }
                    const parentIndex = path.findIndex((p) => p === parentBranchId)
                    console.log(parentIndex)
                    if (parentIndex === -1) {
                      setPath([0])
                      return
                    }
                    setPath(path.slice(0, parentIndex + 1).concat(sibling.branchId))
                  }}
                >
                  <MessageNode node={sibling} />
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </>
  )
}

const TreeFull = ({ treeId }: { treeId: string }) => {
  const tree = useQuery(api.v0.trees.get, { treeId })
  const nodes = useQuery(api.v0.trees.listAllNodes, { treeId })
  const append = useMutation(api.v0.trees.append)
  const branch = useMutation(api.v0.trees.branch)

  const [instructionsValue, setInstructionsValue] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState('')

  if (!tree) {
    return <div>Tree not found</div>
  }

  const nodesSeqGroups = new Map<number, Node[]>()

  for (const node of nodes ?? []) {
    const group = nodesSeqGroups.get(node.seq) ?? []
    group.push(node)
    nodesSeqGroups.set(node.seq, group)
  }

  return (
    <>
      <ChatInstructions value={instructionsValue} onValueChange={setInstructionsValue} />

      <div className="mb-2 flex flex-col gap-2">
        {[...nodesSeqGroups.entries()].toReversed().map(([seq, nodes]) => (
          <div key={seq} className="flex justify-between gap-2">
            {nodes.map((node) => {
              const isLatest = !nodesSeqGroups.get(node.seq + 1)?.some((n) => n.branchId === node.branchId)

              return (
                <div
                  key={node.id}
                  className={cn(
                    node.branchId !== 0 && node.branchSeq !== 0 && 'opacity-30',
                    branchColors[node.branchId % branchColors.length],
                  )}
                >
                  <MessageNode
                    node={node}
                    className={cn(
                      selectedNodeId === node.id && 'outline-primary outline -outline-offset-1',
                      isLatest && 'border-b-primary',
                    )}
                    onClick={() => {
                      if (selectedNodeId === node.id) setSelectedNodeId('')
                      else setSelectedNodeId(node.id)
                    }}
                  />

                  {selectedNodeId === node.id && (
                    <div className="ml-auto w-11/12 p-2">
                      <ChatComposer
                        inputId={tree.id + '_' + node.id}
                        onSend={async ({ text, mode }) => {
                          const branchId = isLatest ? node.branchId : await branch({ treeId: tree.id, nodeId: node.id })

                          append({
                            treeId: tree.id,
                            branchId,
                            message: {
                              role: 'user',
                              name: '',
                              content: text,
                              userData: {},
                            },
                            run:
                              mode === 'run'
                                ? {
                                    instructions: instructionsValue,
                                  }
                                : undefined,
                          }).catch(console.error)
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mx-auto w-3/4">
        <ChatComposer
          inputId={tree.id}
          onSend={async ({ text, mode }) => {
            append({
              treeId: tree.id,
              message: {
                role: 'user',
                name: '',
                content: text,
                userData: {},
              },
              run:
                mode === 'run'
                  ? {
                      instructions: instructionsValue,
                    }
                  : undefined,
            }).catch(console.error)
          }}
        />
      </div>

      <pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(tree, null, 2)}</pre>
      <pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(nodes, null, 2)}</pre>
    </>
  )
}

type DAGNode = Node & {
  parent?: Node
  children?: Set<DAGNode>
}

const TreeChoose = ({ treeId }: { treeId: string }) => {
  const tree = useQuery(api.v0.trees.get, { treeId })
  const nodes = useQuery(api.v0.trees.listAllNodes, { treeId })
  const append = useMutation(api.v0.trees.append)
  const branch = useMutation(api.v0.trees.branch)

  const [instructionsValue, setInstructionsValue] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState('')

  const [selectedBranches, setSelectedBranches] = useState<TreeBranch[]>([{ id: 0, minSeq: 0 }])
  const [streamNodeId, setStreamNodeId] = useState('')

  if (!tree || !nodes) {
    return <div>Tree not found</div>
  }

  const nodeBranchGroups = new Map<number, DAGNode[]>()
  for (const node of nodes.toSorted((a, b) => a.seq - b.seq)) {
    const group = nodeBranchGroups.get(node.branchId) ?? []
    group.push(node)
    nodeBranchGroups.set(node.branchId, group)
  }

  const nodesSeqGroups = new Map<number, Node[]>()
  const branchPoints = new Map<number, string[]>()

  for (const node of nodes.toReversed() ?? []) {
    const group = nodesSeqGroups.get(node.seq) ?? []
    group.push(node)
    nodesSeqGroups.set(node.seq, group)
  }

  const nodesView = nodes
    .toReversed()
    .filter((n) => selectedBranches.some((b) => n.branchId === b.id))
    .map((n) => ({ ...n, branch: tree.branches.find((b) => b.id === n.branchId) }))

  const nodeGraph = buildNodeGraph(tree, nodes)

  const logNode = (node: LinkedNode) =>
    `[${node.seq}:${node.branchId}] ${truncateString(node.message?.content ?? '', 16)}`
  const getParent = (node: LinkedNode) => node.parent
  const getToRoot = (node?: LinkedNode): LinkedNode[] => {
    if (!node) return []
    return [node, ...getToRoot(getParent(node))]
  }

  for (const leaf of [...nodeGraph.leafNodes.values()]) {
    const path = getToRoot(leaf)
    console.log(path.map((n) => logNode(n)))
    console.log('')
  }

  for (const branch of nodeGraph.branchesMap.values()) {
    console.log(
      branch.id,
      'children',
      [...branch.children.values()].map((s) => s.id),
      'siblings',
      [...branch.siblings.values()].map((s) => s.id),
    )
  }

  return (
    <>
      <ChatInstructions value={instructionsValue} onValueChange={setInstructionsValue} />
      <div className="whitespace-pre-wrap rounded border p-2 font-mono text-xs">
        nodeBranchGroups
        {JSON.stringify(
          [...nodeBranchGroups].map(([key, nodes]) => [key, nodes.map((n) => n.id)]),
          null,
          2,
        )}
      </div>
      Branch
      <div className="mb-2 flex gap-2">
        {tree.branches.map((b) => (
          <div key={b.id} className="rounded border p-1">
            {b.id} ({b.minSeq})
          </div>
        ))}
      </div>
      <div className="mb-2 flex flex-col gap-2">
        {nodesView.map((node) => (
          <div key={node.id}>
            <MessageNode
              node={node}
              className={cn(selectedNodeId === node.id && 'outline-primary outline -outline-offset-1')}
              onClick={() => {
                if (selectedNodeId === node.id) setSelectedNodeId('')
                else setSelectedNodeId(node.id)
              }}
            />

            <div className="flex gap-1 py-1">
              {(nodesSeqGroups.get(node.seq) ?? [])
                .filter((n) => n.id === node.id || n.branchSeq === 0)
                .map((n) => (
                  <Button
                    key={n.id}
                    variant="secondary"
                    size="sm"
                    disabled={selectedBranches.some((b) => b.id === n.branchId)}
                  >
                    {n.branchId}
                  </Button>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto w-3/4">
        <ChatComposer
          inputId={tree.id}
          onSend={async ({ text, mode }) => {
            append({
              treeId: tree.id,
              message: {
                role: 'user',
                name: '',
                content: text,
                userData: {},
              },
              run:
                mode === 'run'
                  ? {
                      instructions: instructionsValue,
                    }
                  : undefined,
            }).catch(console.error)
          }}
        />
      </div>
      <pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(tree, null, 2)}</pre>
      <pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(nodes, null, 2)}</pre>
    </>
  )
}

const MessageNode = ({ node, className, ...props }: { node: Node } & React.ComponentProps<'div'>) => {
  return (
    <div className={cn('w-full rounded border p-2', className)} {...props}>
      <div className="text-xs text-gray-500">
        {node.seq}:{node.branchId}:{node.branchSeq} {node.id}
      </div>
      {node.run && <div className="py-1 font-mono text-xs text-gray-500">{JSON.stringify(node.run, null, 2)}</div>}
      {node.message && (
        <div className="whitespace-pre-wrap">
          <span className="text-gray-500">{node.message?.role} </span>
          <MarkdownRenderer>{node.message.content ?? ''}</MarkdownRenderer>
        </div>
      )}
    </div>
  )
}

const ChatInstructions = ({ value, onValueChange }: { value: string; onValueChange: (value: string) => unknown }) => {
  return (
    <div className="mx-auto mb-3 w-full max-w-3xl">
      <div className="text-muted-foreground mb-1 pl-1 font-mono text-sm uppercase">Instructions</div>
      <TextareaAutosize className="max-h-48" value={value} onValueChange={onValueChange} />
    </div>
  )
}

function getBranchPath(tree: Tree, branch: TreeBranch): TreeBranch[] {
  const parentBranch = tree.branches.find((b) => b.id === branch.parentId)
  if (!parentBranch) return [branch]
  return [branch, ...getBranchPath(tree, parentBranch)]
}
