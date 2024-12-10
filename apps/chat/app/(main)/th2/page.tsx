'use client'

import { Panel, PanelContent, PanelHeader } from '@/components/layout/panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@corale/ui/components/ui/tabs'
import { faker } from '@faker-js/faker'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Button } from '@ui/components/ui/button'
import { Input } from '@ui/components/ui/input'
import { cn } from '@ui/lib/utils'
import { useReducer, useState, type Dispatch } from 'react'
import {
  appendBranchingMessage,
  appendMessage,
  createTreeStore,
  getAllLeafNodes,
  getBranch,
  getNodeById,
  inefficientlyGetAllNodesFrom,
  type TreeMessageData,
  type TreeNode,
  type TreeStore,
} from './tree'

type TreeAction =
  | { type: 'ADD_MESSAGE'; message: TreeMessageData; branchId?: string }
  | { type: 'ADD_BRANCHING_MESSAGE'; message: TreeMessageData; messageId: string; branchName?: string }
  | { type: 'SELECT_MESSAGE'; messageId: string }
  | { type: 'SELECT_BRANCH'; branchId: string }
  | { type: 'CLEAR_SELECTION' }

type TreeState = {
  tree: TreeStore
  selectedMessageId: string
  selectedBranchId: string
}

function treeReducer(state: TreeState, action: TreeAction): TreeState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        tree: appendMessage(state.tree, action),
      }
    case 'ADD_BRANCHING_MESSAGE':
      return {
        ...state,
        tree: appendBranchingMessage(state.tree, action),
      }
    case 'SELECT_MESSAGE':
      return {
        ...state,
        selectedMessageId: action.messageId,
        selectedBranchId: '',
      }
    case 'SELECT_BRANCH':
      return {
        ...state,
        selectedBranchId: action.branchId,
        selectedMessageId: '',
      }
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedMessageId: '',
        selectedBranchId: '',
      }
    default:
      return state
  }
}

export default function Page() {
  const [state, dispatch] = useReducer(treeReducer, {
    tree: createTreeStore('DeanTree'),
    selectedMessageId: '',
    selectedBranchId: '',
  })

  return (
    <Panel>
      <PanelHeader>Tree: {state.tree.title}</PanelHeader>
      <PanelContent>
        {JSON.stringify(state.tree.branches)}
        <Tabs defaultValue="grid" className="h-full overflow-hidden">
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="path">Path</TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="grid">
            <TreeGrid state={state} dispatch={dispatch} />
          </TabsContent>
          <TabsContent value="path" className="h-full">
            <TreePath state={state} dispatch={dispatch} />
          </TabsContent>
        </Tabs>
      </PanelContent>
    </Panel>
  )
}

const MessageNode = ({
  state,
  node,
  className,
  children,
}: {
  state: TreeState
  node: TreeNode
  className?: string
  children?: React.ReactNode
}) => {
  const branch = getBranch(state.tree, node.branchId)

  return (
    <div className={cn('w-full overflow-hidden', className)}>
      <div className="font-mono text-xs text-zinc-500">
        {node.sequence} {branch?.parentId && <span className="text-zinc-700">{branch?.parentId} ← </span>}
        {node.branchId} {node.branchSequence}
      </div>
      {node.data.text}
      {children}
    </div>
  )
}

const TreePath = ({ state, dispatch }: { state: TreeState; dispatch: Dispatch<TreeAction> }) => {
  const [focusedBranchId, setFocusedBranchId] = useState(state.tree.defaultBranchId)
  const [focusedNodeId, setFocusedNodeId] = useState('')

  const nodesFromTop = state.tree.store.filter((m) => m.branchId === focusedBranchId)

  const [animateRef] = useAutoAnimate<HTMLDivElement>()

  const handleAddMessage = (text: string) => {
    if (state.selectedMessageId) {
      dispatch({
        type: 'ADD_BRANCHING_MESSAGE',
        message: { role: 'user', text },
        messageId: state.selectedMessageId,
        branchName: state.selectedBranchId,
      })
    } else {
      dispatch({ type: 'ADD_MESSAGE', message: { role: 'user', text }, branchId: state.selectedBranchId })
    }
  }

  const leafNodes = getAllLeafNodes(state.tree)
  const nodePath = focusedNodeId
    ? inefficientlyGetAllNodesFrom(state.tree, getNodeById(state.tree, focusedNodeId)!)
    : undefined

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center gap-2">
        Branches:
        {state.tree.branches.map((branch) => (
          <Button
            key={branch.id}
            variant={focusedBranchId === branch.id ? 'default' : 'secondary'}
            onClick={() => setFocusedBranchId(branch.id)}
          >
            {branch.name || branch.id}
          </Button>
        ))}
      </div>

      <div className="mb-2 flex items-center gap-2">
        Leaf nodes:
        {leafNodes.map((node) => (
          <Button
            key={node.id}
            variant={focusedNodeId === node.id ? 'default' : 'secondary'}
            onClick={() => setFocusedNodeId(node.id)}
          >
            {node.sequence} {node.id} {node.branchSequence}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <div ref={animateRef} className="mx-auto w-full max-w-xl flex-1 divide-y">
          {nodesFromTop.map((node) => {
            const isSelected = state.selectedMessageId === node.id
            return (
              <div
                key={node.id}
                className={cn('p-3', isSelected && 'outline -outline-offset-1 outline-orange-500')}
                onClick={() => {
                  if (isSelected) {
                    dispatch({ type: 'CLEAR_SELECTION' })
                  } else {
                    dispatch({ type: 'SELECT_MESSAGE', messageId: node.id })
                  }
                }}
              >
                <MessageNode state={state} node={node} />
              </div>
            )
          })}
        </div>

        <div className="mx-auto w-full max-w-xl flex-1 divide-y">
          {nodePath?.map((node) => {
            const isSelected = state.selectedMessageId === node.id
            return (
              <div
                key={node.id}
                className={cn('p-3', isSelected && 'outline -outline-offset-1 outline-orange-500')}
                onClick={() => {
                  if (isSelected) {
                    dispatch({ type: 'CLEAR_SELECTION' })
                  } else {
                    dispatch({ type: 'SELECT_MESSAGE', messageId: node.id })
                  }
                }}
              >
                <MessageNode state={state} node={node} />
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex justify-center p-4">
        <TreeInput onAdd={handleAddMessage} />
      </div>
    </div>
  )
}

const TreeGrid = ({ state, dispatch }: { state: TreeState; dispatch: Dispatch<TreeAction> }) => {
  const [animateRef] = useAutoAnimate<HTMLDivElement>()

  const getBranchColumn = (branchId: string) => {
    return state.tree.branches.findIndex((b) => b.id === branchId) + 1
  }

  const handleAddMessage = (text: string) => {
    if (state.selectedMessageId) {
      dispatch({
        type: 'ADD_BRANCHING_MESSAGE',
        message: { role: 'user', text },
        messageId: state.selectedMessageId,
        branchName: state.selectedBranchId,
      })
    } else {
      dispatch({ type: 'ADD_MESSAGE', message: { role: 'user', text }, branchId: state.selectedBranchId })
    }
  }

  return (
    <div>
      <div
        className="grid auto-cols-[200px] divide-x overflow-x-auto border"
        onClick={() => dispatch({ type: 'CLEAR_SELECTION' })}
        ref={animateRef}
      >
        {state.tree.branches.map((branch) => (
          <div
            key={branch.id}
            className={cn(
              'border-b p-1 text-center font-medium',
              state.selectedBranchId === branch.id && 'outline -outline-offset-1 outline-orange-500',
            )}
            style={{ gridColumn: getBranchColumn(branch.id) }}
            onClick={(e) => {
              e.stopPropagation()
              dispatch({ type: 'SELECT_BRANCH', branchId: branch.id })
            }}
          >
            <div className="font-mono text-xs text-gray-500">{branch.id}</div>
            <div className="text-sm text-gray-400">{branch.name}</div>
          </div>
        ))}

        {state.tree.store.map((node) => (
          <div
            key={node.id}
            className={cn('p-3', state.selectedMessageId === node.id && 'outline -outline-offset-1 outline-orange-500')}
            style={{ gridColumn: getBranchColumn(node.branchId), gridRow: node.sequence + 2 }}
            onClick={(e) => {
              e.stopPropagation()
              dispatch({ type: 'SELECT_MESSAGE', messageId: node.id })
            }}
          >
            <MessageNode state={state} node={node} />
          </div>
        ))}
      </div>
      <div className="flex justify-center p-4">
        <TreeInput onAdd={handleAddMessage} />
      </div>
    </div>
  )
}

const TreeInput = (props: { onAdd: (text: string) => void }) => {
  const [value, setValue] = useState('')

  return (
    <div className="flex w-full max-w-xl gap-2">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        onClick={() => {
          props.onAdd(value || `${faker.word.adjective()} ${faker.animal.type()}`)
          setValue('')
        }}
      >
        Add
      </Button>
    </div>
  )
}
