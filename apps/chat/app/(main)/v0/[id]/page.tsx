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
import { buildNodeGraph, getPath, type LinkedNode, type NodeGraph } from './node-graph'
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

const useListAllNodes = (treeId: string) => {
  const nodes = useQuery(api.v0.trees.listAllNodes, { treeId })
  return nodes?.toSorted((a, b) => a.seq - b.seq || a.branchId - b.branchId)
}

export default function Page({ params }: { params: { id: string } }) {
  const tree = useQuery(api.v0.trees.get, { treeId: params.id })
  const nodes = useListAllNodes(params.id)

  const append = useMutation(api.v0.trees.append)
  const branch = useMutation(api.v0.trees.branch)

  const [instructionsValue, setInstructionsValue] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState('')

  if (!tree || !nodes) {
    return <div>Tree not found</div>
  }

  const nodeGraph = buildNodeGraph(tree, nodes)

  return (
    <Panel>
      <PanelHeader>{tree.label || `Tree ${tree.id}`}</PanelHeader>
      <PanelContent className="p-0">
        <Tabs defaultValue="chat" className="grid min-h-[calc(100vh-3rem)] auto-rows-fr grid-rows-[auto] p-3">
          <TabsList className="justify-self-start">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="flow">Flow</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <ChatPanel tree={tree} graph={nodeGraph} />
          </TabsContent>

          <TabsContent value="flow" className="">
            <TreeFlow nodeGraph={nodeGraph} />
          </TabsContent>

          <TabsContent value="json">
            <pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(tree, null, 2)}</pre>
            <pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(nodes, null, 2)}</pre>
          </TabsContent>
        </Tabs>
      </PanelContent>
    </Panel>
  )
}

const ChatPanel = ({ tree, graph }: { tree: Tree; graph: NodeGraph }) => {
  const append = useMutation(api.v0.trees.append)
  const branch = useMutation(api.v0.trees.branch)

  const [pathNodeId, setPathNodeId] = useState(graph.rootNode?.id ?? '')
  const pathNode = graph.nodesMap.get(pathNodeId)
  const path = pathNode ? getPath(pathNode) : []

  const [selectedNodeId, setSelectedNodeId] = useState('')
  const selectedNode = path.find((n) => n.id === selectedNodeId)
  const selectedNodeIsLatest = selectedNode && path.at(-1) === selectedNode

  const currentBranchId = path.at(-1)?.branchId ?? 0

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId((prevId) => (prevId !== nodeId ? nodeId : ''))
  }

  const handleSend = async ({ text, mode }: { text: string; mode: 'run' | 'add' }) => {
    let branchId = currentBranchId

    if (selectedNode && !selectedNodeIsLatest) {
      branchId = await branch({ treeId: tree.id, nodeId: selectedNode.id })
    }

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
              // instructions: instructionsValue,
            }
          : undefined,
    }).catch(console.error)
  }

  return (
    <div className="pb-40">
      {path.map((node) => (
        <div key={node.id} className="p-2">
          <ChatMessageNode
            node={node}
            selected={selectedNodeId === node.id}
            onSelect={handleSelectNode}
            pathNodeId={pathNodeId}
            setPathNodeId={setPathNodeId}
          />
        </div>
      ))}
      <div className="absolute bottom-2 left-[50%] w-1/2 -translate-x-[50%]">
        <div>
          {currentBranchId} {selectedNode?.id} {selectedNodeIsLatest ? 'leaf' : ''}
        </div>
        <ChatComposer inputId={tree.id} onSend={handleSend} />
      </div>
    </div>
  )
}

const ChatMessageNode = ({
  node,
  className,
  selected,
  onSelect,
  pathNodeId,
  setPathNodeId,
}: {
  node: LinkedNode
  className?: string
  selected?: boolean
  onSelect: (nodeId: string) => unknown
  pathNodeId: string
  setPathNodeId: (value: string) => unknown
}) => {
  const { message } = node

  return (
    <div
      className={cn(
        'bg-card text-card-foreground ring-ring/50 whitespace-pre-wrap rounded-md border p-5',
        className,
        selected ? 'ring-ring shadow-lg ring-2 hover:ring-2' : 'hover:ring-1',
      )}
    >
      <div className="text-muted-foreground font-mono text-xs">
        {node.seq} {node.branchId}.{node.branchSeq} {node.id}
        {pathNodeId === node.id && <span className="text-primary">⇅</span>}
        <Button variant="outline" size="sm" onClick={() => onSelect(node.id)}>
          reply
        </Button>
      </div>

      {message && (
        <div className="">
          <span className={cn('font-semibold', message.role === 'assistant' && 'text-orange-400')}>
            {message.role} {message.name}
          </span>
          {message.content}
        </div>
      )}

      {node.children.length > 1 && (
        <div className="font-mono text-xs">children: {node.children.map((n) => `${n.branchId} `)}</div>
      )}
      {node.siblings.length > 0 && (
        <div className="font-mono text-xs">siblings: {node.siblings.map((n) => `${n.branchId} `)}</div>
      )}

      {node.children.length > 1 && (
        <div className="flex gap-2">
          {node.children.map((n) => (
            <Button variant="outline" onClick={() => setPathNodeId(n.id)}>
              {n.branchId}
            </Button>
          ))}
        </div>
      )}
    </div>
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
