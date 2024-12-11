import { api } from '@corale/chat-server/api'
import type { Id } from '@corale/chat-server/dataModel'
import { useQuery } from 'convex/react'
import { ChatMessage } from '../chat-message/chat-message'
import { Composer } from '../composer/composer'
import { useChatContext } from './chat-thread'

export const MessageFeed = ({ threadId }: { threadId: Id<'threads'> }) => {
  const messages = useQuery(api.chat.db.listMessages, { threadId })
  if (!messages) return null

  const sorted = groupMessagesBySequence(messages)

  return (
    <div className="divide-border/50 divide-y">
      {sorted.map((seqGroup, i) => (
        <div key={i} className="flex gap-2">
          {seqGroup.map((m) => (
            <div key={m._id} className="w-full max-w-lg py-3">
              <ChatMessage message={m} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* 
          <div key={m._id} className="mx-auto w-full max-w-4xl py-3">
            <ChatMessage message={m} />
          </div>
*/

function groupMessagesBySequence<T extends { sequence: number; branch: string }>(messages: T[]) {
  // First group by sequence
  const sequenceGroups = messages
    .sort((a, b) => a.sequence - b.sequence)
    .reduce((groups, message) => {
      const group = groups.get(message.sequence) ?? []
      group.push(message)
      groups.set(message.sequence, group)
      return groups
    }, new Map<number, T[]>())

  // Sort each sequence group by branch
  for (const [sequence, group] of sequenceGroups) {
    sequenceGroups.set(
      sequence,
      group.sort((a, b) => a.branch.localeCompare(b.branch)),
    )
  }

  return [...sequenceGroups.values()]
}

function groupMessagesByBranch<T extends { sequence: number; branch: string }>(messages: T[]) {
  // First sort all messages by sequence
  const sortedMessages = [...messages].sort((a, b) => a.sequence - b.sequence)

  // Get unique sorted branch names
  const branchNames = [...new Set(sortedMessages.map((m) => m.branch))].sort()

  // Create groups based on sorted branch names
  return new Map(
    branchNames.map((branchName) => {
      return [branchName, sortedMessages.filter((message) => message.branch === branchName)]
    }),
  )
}

export const MessageFeedGrid = ({ threadId }: { threadId: Id<'threads'> }) => {
  const messages = useQuery(api.chat.db.listMessages, { threadId })
  if (!messages) return null

  const byBranch = groupMessagesByBranch(messages)
  const branchNames = [...byBranch.keys()]

  return (
    <div className="grid divide-y overflow-x-auto">
      {[...byBranch.entries()].map(([branchName, messages]) => {
        const gridColumn = (branchNames.findIndex((b) => branchName === b) ?? 0) + 1

        return (
          <>
            {messages.map((m) => (
              <div
                key={m._id}
                className="py-3"
                style={{
                  gridRow: m.sequence + 1,
                  gridColumn,
                }}
              >
                <ChatMessage message={m} />
              </div>
            ))}
            <div
              className="p-2"
              style={{
                gridColumn: gridColumn,
              }}
            >
              <BranchComposer branch={branchName} />
            </div>
          </>
        )
      })}
    </div>
  )
}

const BranchComposer = ({ branch }: { branch: string }) => {
  const { handleSend, modelId, threadId } = useChatContext()

  return <Composer threadId={threadId} onSend={handleSend} defaultModel={modelId} branch={branch} />
}
