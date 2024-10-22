'use client'

import { ModelPickerCmd } from '@/components/command/ModelPickerCmd'
import { ModelButton } from '@/components/composer/ModelButton'
import { Button, IconButton } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Panel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { TextField } from '@/components/ui/TextField'
import { useCreatePattern, useDeletePattern, usePattern, useUpdatePattern } from '@/lib/api/patterns'
import { orderedListReducer, useOrderedList } from '@/lib/useOrderedList'
import type { EMessage, EPattern } from '@corale/api/convex/types'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Code, type ButtonProps } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { toast } from 'sonner'
import { LoadingPage } from '../pages/LoadingPage'

type PatternMessage = EPattern['initialMessages'][number] & { __key: string }

export function PatternEditorPage({ patternId }: { patternId?: string }) {
  const pattern = usePattern(patternId ?? '')

  if (patternId && !pattern) return <LoadingPage />

  const defaultPattern: EPattern = {
    xid: '',
    name: '',
    description: '',
    instructions: '',
    initialMessages: [],
    dynamicMessages: [],
    kvMetadata: {},
    model: { id: 'anthropic/claude-3-haiku:beta' },
    _id: '' as any,
    _creationTime: 0,
    updatedAt: 0,
    lastUsedAt: 0,
    userId: '' as any,
  }

  return <PatternEditor pattern={pattern || defaultPattern} isNew={!patternId} />
}

function PatternEditor({ pattern, isNew = false }: { pattern: EPattern; isNew?: boolean }) {
  const router = useRouter()

  const [patternState, setPatternState] = useState({
    ...pattern,
    initialMessages: pattern.initialMessages.map((message) => ({ ...message, __key: getKey() })),
  })

  const updatePattern = useUpdatePattern()
  const createPattern = useCreatePattern()
  const deletePattern = useDeletePattern()

  const handleSave = () => {
    const saveAction = isNew ? createPattern : updatePattern
    saveAction(patternState)
      .then((patternId) => {
        toast.success(isNew ? 'Pattern created' : 'Pattern updated')
        router.push(`/patterns/${patternId}`)
      })
      .catch((error) => {
        toast.error(isNew ? 'Failed to create pattern' : 'Failed to update pattern')
        console.error(isNew ? 'Failed to create pattern' : 'Failed to update pattern', error)
      })
  }

  const [hasChanges, setHasChanges] = useState(false)
  const updateField = (field: string, value: any) => {
    setPatternState((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  return (
    <>
      <Panel className="">
        <PanelHeader className="pl-4">
          <PanelTitle href="/patterns">Pattern Configuration</PanelTitle>
          <div className="grow" />

          {patternState.name && (
            <Button variant="solid" onClick={handleSave} disabled={!hasChanges}>
              {isNew ? 'Create' : 'Save'}
            </Button>
          )}
        </PanelHeader>

        <ScrollArea>
          <div className="flex">
            <div className="shrink-0 px-4">
              <div className="flex gap-3 p-4">
                {/* > avatar */}
                <div className="shrink-0">
                  <div className="h-32 w-32 overflow-hidden rounded border">
                    {/* {patternState._id && <SamplePatternAvatar4 className="h-full w-full" />} */}
                  </div>
                </div>

                {/* > id/name */}
                <div className="flex grow flex-col justify-between">
                  <div>
                    <Label>Pattern ID</Label>
                    <Code size="3">{pattern.xid}</Code>
                  </div>

                  <div>
                    <Label>Name</Label>
                    <TextField value={patternState.name} onValueChange={(value) => updateField('name', value)} />
                  </div>
                </div>
              </div>

              {/* > desc */}
              <div className="p-4">
                <Label>Description</Label>
                <ReactTextareaAutosize
                  minRows={4}
                  rows={4}
                  maxRows={4}
                  className="border-gray-a7 bg-black-a3 placeholder:text-gray-a8 flex w-full resize-none rounded border p-2 outline-none"
                  value={patternState.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </div>

              {/* > model */}
              <div className="space-y-1 p-4">
                <Label>Model</Label>
                <ModelPickerCmd
                  value={patternState.model.id}
                  onValueChange={(value) => updateField('model', { id: value })}
                >
                  <ModelButton modelId={patternState.model.id} />
                </ModelPickerCmd>

                <div className="py-2">
                  <Code color="gray" size="3">
                    {patternState.model.id}
                  </Code>
                </div>
              </div>

              <div className="space-y-1 p-4">
                <Label>Maximum Conversation Size</Label>
                <TextField
                  type="number"
                  className="w-16"
                  placeholder="50"
                  value={patternState.options?.maxMessages}
                  onValueChange={(value) =>
                    updateField('options', { ...patternState.options, maxMessages: Number(value) })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 p-4">
                <Button variant="soft" color="red" onClick={() => deletePattern({ patternId: patternState.xid })}>
                  Delete
                </Button>
              </div>
            </div>

            <div className="w-full px-4">
              <div className="space-y-2 py-4">
                <div className="">Instructions</div>
                <ReactTextareaAutosize
                  minRows={6}
                  rows={6}
                  className="border-gray-a7 bg-black-a3 placeholder:text-gray-a8 flex w-full resize-none rounded border p-4 outline-none"
                  placeholder="You are a really very average assistant."
                  value={patternState.instructions}
                  onChange={(e) => updateField('instructions', e.target.value)}
                />
              </div>

              <PatternMessagesEditor
                initialMessages={patternState.initialMessages}
                dispatch={(action) => {
                  setPatternState((prev) => ({
                    ...prev,
                    initialMessages: orderedListReducer(prev.initialMessages, action),
                  }))
                }}
              />
            </div>
          </div>
        </ScrollArea>
      </Panel>
    </>
  )
}

const getKey = () => Math.random().toString(36).slice(2)

function PatternMessagesEditor({
  initialMessages,
  dispatch,
}: {
  initialMessages: PatternMessage[]
  dispatch: ReturnType<typeof useOrderedList<PatternMessage>>[1]
}) {
  const addNewMessage = () => {
    const message = {
      role: 'user' as const,
      text: '',
      __key: getKey(),
    }

    dispatch({ type: 'push', item: message })
  }

  const [ref] = useAutoAnimate()

  return (
    <div className="py-4">
      <div className="">Initial Messages</div>
      <div ref={ref} className="space-y-4 p-4">
        {initialMessages.map((message, i) => (
          <div
            key={message.__key}
            style={{ contain: 'paint' }}
            data-message-role={message.role}
            data-message-channel={message.channel}
            className="bg-gray-2 group flex shrink-0 flex-col overflow-hidden rounded border data-[message-channel=hidden]:opacity-60"
          >
            {/* > header */}
            <div className="flex-between border-gray-a3 bg-gray-a2 shrink-0 items-center gap-1 border-b px-2 py-0.5">
              <div className="flex-start w-20 gap-2">
                <RoleToggleButton
                  role={message.role}
                  onClick={(role) => {
                    dispatch({
                      type: 'update',
                      index: i,
                      updateFn: (message) => ({
                        ...message,
                        role,
                      }),
                    })
                  }}
                />
              </div>

              <TextField
                variant="surface"
                value={message.name}
                disabled={message.role === 'system'}
                placeholder="name"
                className="group-data-[message-role=system]:invisible"
              />

              <div className="flex-end gap-1">
                <IconButton
                  size="1"
                  variant="surface"
                  aria-label="Toggle hide"
                  onClick={() =>
                    dispatch({
                      type: 'update',
                      index: i,
                      updateFn: (message) => ({
                        ...message,
                        channel: message.channel === 'hidden' ? undefined : 'hidden',
                      }),
                    })
                  }
                >
                  {message.channel === 'hidden' ? <Icons.EyeClosed size={16} /> : <Icons.Eye size={16} />}
                </IconButton>
                <IconButton
                  size="1"
                  variant="surface"
                  aria-label="Move up"
                  onClick={() => dispatch({ type: 'moveUp', index: i })}
                >
                  <Icons.CaretUp size={16} />
                </IconButton>
                <IconButton
                  size="1"
                  variant="surface"
                  aria-label="Move down"
                  onClick={() => dispatch({ type: 'moveDown', index: i })}
                >
                  <Icons.CaretDown size={16} />
                </IconButton>
                <IconButton
                  size="1"
                  variant="surface"
                  aria-label="Delete"
                  color="red"
                  onClick={() => dispatch({ type: 'remove', index: i })}
                >
                  <Icons.Trash size={16} />
                </IconButton>
              </div>
            </div>

            {/* > body */}
            <ReactTextareaAutosize
              minRows={1}
              rows={1}
              className="bg-black-a1 placeholder:text-gray-a8 flex w-full resize-none rounded p-2 outline-none"
              placeholder="(blank message)"
              value={message.text}
              onChange={(e) =>
                dispatch({
                  type: 'update',
                  index: i,
                  updateFn: (message) => ({ ...message, text: e.target.value }),
                })
              }
            />
          </div>
        ))}

        <Button variant="surface" onClick={addNewMessage} className="mx-auto flex">
          Add <Icons.Plus size={16} />
        </Button>
      </div>
    </div>
  )
}

function RoleToggleButton({ role, onClick }: { role: EMessage['role']; onClick: (newRole: EMessage['role']) => void }) {
  const colors: Record<string, ButtonProps['color']> = {
    user: 'grass',
    assistant: 'orange',
    system: 'amber',
  }
  const color = colors[role] ?? 'gray'

  const roles = ['user', 'assistant', 'system'] as const
  const getNextRole = (role: (typeof roles)[number]) => {
    const index = roles.findIndex((value) => role === value) + 1
    return roles[index % roles.length] as (typeof roles)[number]
  }

  return (
    <Button
      variant="soft"
      size="1"
      color={color}
      className="font-mono uppercase"
      onClick={() => onClick(getNextRole(role))}
    >
      {role}
    </Button>
  )
}
