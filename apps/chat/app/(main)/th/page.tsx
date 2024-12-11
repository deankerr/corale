'use client'

import { Panel, PanelContent, PanelHeader } from '@/components/layout/panel'
import { faker } from '@faker-js/faker'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Button } from '@ui/components/ui/button'
import { Input } from '@ui/components/ui/input'
import { cn } from '@ui/lib/utils'
import { Fragment, useState } from 'react'
import { appendMessage, appendMessageTo, createTreeStore } from './thread'

export default function Page() {
  const [thread, setThread] = useState(createTreeStore('DeanTree'))
  const [selectedBranch, setSelectedBranch] = useState('')
  const [selectedMessageId, setSelectedMessageId] = useState('')

  const messages = [...thread.store].sort((a, b) => a.sequence - b.sequence)
  const branches = [...thread.branches].sort()

  const handleAddMessage = (text: string) => {
    if (selectedMessageId) {
      setThread(
        appendMessageTo(thread, {
          message: { role: 'user', text },
          messageId: selectedMessageId,
        }),
      )
      return
    }

    setThread(
      appendMessage(thread, {
        message: { role: 'user', text },
        branch: selectedBranch,
      }),
    )
  }

  const [animateRef] = useAutoAnimate<HTMLDivElement>()

  return (
    <Panel>
      <PanelHeader>Tree</PanelHeader>
      <PanelContent>
        <div className="p-2">
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedBranch('')
              setSelectedMessageId('')
            }}
          >
            Clear
          </Button>
        </div>
        <div className="grid auto-cols-[200px] divide-x overflow-x-auto border" ref={animateRef}>
          {branches.map((b) => {
            const gridColumn = (branches.findIndex((branch) => branch === b) ?? 0) + 1
            return (
              <Fragment key={b}>
                <div
                  key={`${b}-label`}
                  className={cn(
                    'p-3 text-center font-medium',
                    b === selectedBranch && 'outline -outline-offset-1 outline-blue-500',
                  )}
                  style={{ gridColumn }}
                  onClick={() => {
                    setSelectedBranch(b)
                    setSelectedMessageId('')
                  }}
                >
                  {b}
                </div>

                {messages
                  .filter((m) => m.branch === b)
                  .map((m) => (
                    <div
                      key={m._id}
                      className={cn('p-3', selectedMessageId === m._id && 'outline -outline-offset-1 outline-blue-500')}
                      style={{ gridColumn, gridRow: m.sequence + 2 }}
                      onClick={() => {
                        setSelectedBranch('')
                        setSelectedMessageId(m._id)
                      }}
                    >
                      <div className="font-mono text-xs text-gray-500">{m._id}</div>
                      <div className="font-mono text-xs">
                        {m.sequence}:{m.branchSequence}.{m.branch}
                      </div>
                      <div className="text-sm">{m.role}</div>
                      {m.text}
                    </div>
                  ))}
              </Fragment>
            )
          })}
        </div>
        <div className="flex justify-center p-4">
          <TreeInput onAdd={handleAddMessage} />
        </div>
      </PanelContent>
    </Panel>
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
