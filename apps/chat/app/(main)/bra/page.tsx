'use client'

import { Panel, PanelContent, PanelHeader } from '@/components/layout/panel'
import { faker } from '@faker-js/faker'
import { Button } from '@ui/components/ui/button'
import { useReducer, useState } from 'react'

type Message = {
  id: string
  thread: number
  depth: number
  content: string
}

type MessagesState = {
  messages: Message[]
  selectedMessageId: string | null
}

type MessagesAction =
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'SELECT_MESSAGE'; messageId: string }
  | { type: 'CLEAR_SELECTION' }

const defaultThread = 0

function createMessage({
  depth,
  thread,
  prefixContent,
}: {
  depth: number
  thread: number
  prefixContent: string
}): Message {
  return {
    id: faker.string.ulid(),
    depth,
    thread,
    content: `${prefixContent}\n${faker.word.adjective()} ${faker.animal.type()}`,
  }
}

function messagesReducer(state: MessagesState, action: MessagesAction): MessagesState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
      }
    case 'SELECT_MESSAGE':
      return {
        ...state,
        selectedMessageId: action.messageId,
      }
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedMessageId: null,
      }
    default:
      return state
  }
}

function groupMessagesByThread(messages: Message[]): Map<number, Message[]> {
  return messages.reduce((threadMap, message) => {
    const threadMessages = threadMap.get(message.thread) ?? []
    const updatedMessages = [...threadMessages, message].sort((a, b) => a.depth - b.depth)
    threadMap.set(message.thread, updatedMessages)
    return threadMap
  }, new Map<number, Message[]>())
}

function getMaxThread(messages: Message[]): number {
  return Math.max(...messages.map((m) => m.thread), 0)
}

export default function Page() {
  const [state, dispatch] = useReducer(messagesReducer, {
    messages: [
      {
        id: '0000',
        depth: 0,
        thread: 0,
        content: '\nHello, world!',
      },
    ],
    selectedMessageId: null,
  })

  const messagesByThread = groupMessagesByThread(state.messages)
  const maxThread = getMaxThread(state.messages)

  return (
    <Panel>
      <PanelHeader>Branch Dev</PanelHeader>
      <PanelContent>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: maxThread + 1 }, (_, thread) => {
            const messages = messagesByThread.get(thread) ?? []
            const firstMessageDepth = messages[0]?.depth ?? 0

            return (
              <div key={thread} className="flex-shrink-0" style={{ minWidth: '300px' }}>
                <div className="mb-2 font-mono text-xs text-gray-500">Thread {thread}</div>
                <div className="flex flex-col gap-2">
                  {Array.from({ length: firstMessageDepth }, (_, i) => (
                    <div key={`empty-${i}`} className="h-[142px] rounded border border-dashed border-gray-200" />
                  ))}

                  {messages.map((message: Message) => (
                    <div
                      key={message.id}
                      className={`rounded border p-4 ${
                        message.id === state.selectedMessageId ? 'border-blue-500' : 'border-gray-200'
                      }`}
                      onClick={() =>
                        dispatch({
                          type: 'SELECT_MESSAGE',
                          messageId: message.id,
                        })
                      }
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-xs text-gray-500">
                            t{message.thread}d{message.depth}
                          </span>
                          <span className="text-sm text-gray-500">⇨ {message.content.split('\n')[0]}</span>
                          <span className="">{message.content.split('\n')[1]}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            dispatch({
                              type: 'ADD_MESSAGE',
                              message: createMessage({
                                depth: message.depth + 1,
                                thread: maxThread + 1,
                                prefixContent: message.content.split('\n')[1] ?? '',
                              }),
                            })
                          }}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const nextDepth = messages.at(-1)?.depth ?? -1
                      dispatch({
                        type: 'ADD_MESSAGE',
                        message: createMessage({ depth: nextDepth + 1, thread, prefixContent: '' }),
                      })
                    }}
                  >
                    Add Message
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </PanelContent>
    </Panel>
  )
}
