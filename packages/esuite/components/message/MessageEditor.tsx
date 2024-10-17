import { useState } from 'react'
import { Select } from '@radix-ui/themes'

import { Button } from '../ui/Button'
import { TextareaAutosize } from '../ui/TextareaAutosize'
import { TextField } from '../ui/TextField'
import { useMessageContext } from './MessageProvider'

import type { EMessage } from '@corale/api/convex/types'

export const MessageEditor = () => {
  const { message, updateMessage, setIsEditing } = useMessageContext()
  const [textValue, setTextValue] = useState(message?.text ?? '')
  const [roleValue, setRoleValue] = useState(message.role as string)
  const [nameValue, setNameValue] = useState(message.name)

  const handleSave = () => {
    updateMessage({ text: textValue, role: roleValue as EMessage['role'], name: nameValue })
  }

  return (
    <>
      <TextareaAutosize
        name="content"
        className="border-none bg-transparent p-0 font-mono"
        value={textValue}
        onValueChange={setTextValue}
        autoFocus
      />
      <div className="flex-between gap-2 border-t pt-3">
        <div className="flex-between gap-2">
          <Select.Root
            size={{ initial: '3', sm: '2' }}
            name="role"
            value={roleValue}
            onValueChange={setRoleValue}
          >
            <Select.Trigger className="flex w-40 font-mono" />
            <Select.Content>
              <Select.Group>
                <Select.Label>Role</Select.Label>
                <Select.Item value="user" className="font-mono">
                  user
                </Select.Item>
                <Select.Item value="assistant" className="font-mono">
                  assistant
                </Select.Item>
                <Select.Item value="system" className="font-mono">
                  system
                </Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>

          <TextField
            size={{ initial: '3', sm: '2' }}
            name="name"
            value={nameValue}
            onValueChange={setNameValue}
            className="w-40"
          />
        </div>

        <div className="flex-between gap-2">
          <Button color="gray" variant="surface" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>

          <Button variant="surface" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </>
  )
}
