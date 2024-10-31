import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { Button, IconButton } from '@/components/ui/Button'
import { Panel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { twx } from '@/lib/utils'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu } from '@radix-ui/themes'
import { useState } from 'react'
import { TextareaAutosize } from '../ui/TextareaAutosize'

const TextFieldGhost = twx.input`flex outline-none disabled:cursor-not-allowed disabled:opacity-50 w-full text-base 
  font-normal text-gray-12 placeholder:text-gray-a10 sm:text-sm`

export const PromptEditor = ({
  initialTitle,
  initialContent,
  onSave,
  onDelete,
}: {
  initialTitle: string
  initialContent: string
  onSave: (args: { title: string; content: string }) => void
  onDelete?: () => void
}) => {
  const [titleValue, setTitleValue] = useState(initialTitle)
  const [textValue, setTextValue] = useState(initialContent)

  const hasChanged = titleValue !== initialTitle || textValue !== initialContent
  return (
    <Panel>
      <PanelHeader>
        <NavigationButton />
        <PanelTitle href="/prompts" className="shrink-0">
          Prompt Editor
        </PanelTitle>
        <Icons.CaretRight size={18} className="text-gray-a10 mx-1 shrink-0" />

        <TextFieldGhost
          placeholder="Untitled Prompt"
          id="prompt-title"
          aria-label="Prompt title"
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
        />

        {onDelete && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton variant="ghost" color="red" aria-label="Delete prompt" className="mx-1">
                <Icons.Trash size={18} />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item color="red" onClick={onDelete}>
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}

        <Button
          variant="surface"
          onClick={() => onSave({ title: titleValue, content: textValue })}
          disabled={!hasChanged}
        >
          Save
        </Button>
      </PanelHeader>
      <div className="grow">
        <TextareaAutosize value={textValue} onChange={(e) => setTextValue(e.target.value)} autoFocus />
      </div>
    </Panel>
  )
}
