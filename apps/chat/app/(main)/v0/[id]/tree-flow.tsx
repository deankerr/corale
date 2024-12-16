import { truncateString } from '@corale/shared/strings'
import { cn } from '@corale/ui/lib/utils'
import Dagre from '@dagrejs/dagre'
import { Button } from '@ui/components/ui/button'
import {
  Background,
  BackgroundVariant,
  Handle,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useState } from 'react'
import { BaseNode } from './BaseNode'
import type { LinkedNode, NodeGraph } from './node-graph'

const rowSize = 400
const colSize = 400

function createFlowGraph(graph: NodeGraph) {
  const nodes: (Node & { data: { node: LinkedNode; label: string } })[] = []
  const edges: Edge[] = []

  for (const node of graph.nodesMap.values()) {
    nodes.push({
      id: node.id,
      position: { x: node.branchId * colSize, y: node.seq * rowSize },
      type: 'customNode',
      data: {
        node,
        label: `[${node.seq}:${node.branchId}] ${truncateString(node.message?.content ?? '')}`,
      },
    })

    for (const child of node.children) {
      edges.push({
        id: `e${node.id}-${child.id}`,
        source: node.id,
        target: child.id,
      })
    }
  }

  return { nodes, edges }
}

const getLayoutedElements = <TNode extends Node, TEdge extends Edge>(
  nodes: TNode[],
  edges: TEdge[],
  options: { direction: 'TB' | 'LR' },
) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: options.direction })

  edges.forEach((edge) => g.setEdge(edge.source, edge.target))
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  )

  Dagre.layout(g)

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id)
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2
      const y = position.y - (node.measured?.height ?? 0) / 2

      return { ...node, position: { x, y } }
    }),
    edges,
  }
}

const nodeTypes = {
  customNode: ({ data }: NodeProps) => {
    const node = data.node as LinkedNode
    const message = node.message

    return (
      <BaseNode>
        <>
          <div className="text-muted-foreground font-mono text-xs">
            {node.seq} {node.branchId}.{node.branchSeq} {node.id}
          </div>
          {message && (
            <div className="">
              <span className={cn('font-semibold', message.role === 'assistant' && 'text-orange-400')}>
                {message.role} {message.name}
              </span>
              {message.content}
            </div>
          )}

          {node.children.length > 0 && (
            <div className="font-mono text-xs">children: {node.children.map((n) => `${n.branchId} `)}</div>
          )}
          {node.siblings.length > 0 && (
            <div className="font-mono text-xs">siblings: {node.siblings.map((n) => `${n.branchId} `)}</div>
          )}

          <Handle type="source" position={Position.Bottom} />
          <Handle type="target" position={Position.Top} />
        </>
      </BaseNode>
    )
  },
}

const LayoutFlow = ({ nodeGraph }: { nodeGraph: NodeGraph }) => {
  const [initial] = useState(() => createFlowGraph(nodeGraph))

  const { fitView } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges)

  const onLayout = useCallback(
    (direction: 'TB' | 'LR') => {
      const layouted = getLayoutedElements(nodes, edges, { direction })

      setNodes(layouted.nodes)
      setEdges(layouted.edges)

      window.requestAnimationFrame(() => {
        fitView()
      })
    },
    [nodes, edges, setNodes, setEdges, fitView],
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      nodeTypes={nodeTypes}
      className="h-full"
    >
      <Background variant={BackgroundVariant.Dots} />
      <Panel position="top-right">
        <Button variant="outline" onClick={() => onLayout('TB')}>
          Layout
        </Button>
      </Panel>
    </ReactFlow>
  )
}

export const TreeFlow = ({ nodeGraph }: { nodeGraph: NodeGraph }) => {
  return (
    <ReactFlowProvider>
      <LayoutFlow nodeGraph={nodeGraph} />
    </ReactFlowProvider>
  )
}
