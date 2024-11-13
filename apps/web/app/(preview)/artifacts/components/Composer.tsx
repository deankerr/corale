'use client'

import { RunButton } from '@/app/(beta)/_features/chat/RunButton'
import { ModelPickerCmd } from '@/components/command/ModelPickerCmd'
import { ModelLogo } from '@/components/icons/ModelLogo'
import { Button, IconButton } from '@/components/ui/Button'
import { TextArea } from '@/components/ui/TextArea'
import { useChatModel } from '@/lib/api/models'
import { usePattern } from '@/lib/api/patterns'
import { cn } from '@/lib/utils'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'

export function Composer({
  defaultModelId = 'anthropic/claude-3-5-haiku:beta',
  defaultTextValue = '',
  onSubmit,
  state = 'ready',
  patternId,
  className,
}: {
  defaultModelId?: string
  defaultTextValue?: string
  onSubmit: (args: { text: string; modelId?: string; patternId?: string }) => Promise<unknown>
  state?: 'ready' | 'pending'
  patternId?: string
  className?: string
}) {
  const [modelId, setModelId] = useState(defaultModelId)
  const [textValue, setTextValue] = useState(defaultTextValue)

  const model = useChatModel(modelId)
  const pattern = usePattern(patternId)

  const handleRun = () => {
    onSubmit({ text: textValue, modelId, patternId: pattern?._id }).then(() => setTextValue(''))
  }

  const handleAdd = () => {
    onSubmit({ text: textValue }).then(() => setTextValue(''))
  }

  return (
    <div className={cn('bg-black-a1 w-full overflow-hidden rounded-md border pt-1 shadow-xl', className)}>
      <TextArea
        placeholder="Where do you want to go today?"
        value={textValue}
        onValueChange={setTextValue}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleRun()
          }
        }}
        autoFocus
      />

      <div className="flex-start px-3 pb-3 pt-1.5">
        {!pattern && (
          <ModelPickerCmd modelId={modelId} onModelIdChange={setModelId}>
            <Button color="gray" variant="soft">
              <ModelLogo modelName={model?.name ?? ''} />
              {model?.name || 'Select model'}
            </Button>
          </ModelPickerCmd>
        )}

        {pattern && (
          <Button color="gray" variant="soft" disabled>
            <Icons.Robot />
            {pattern.name}
          </Button>
        )}

        <div className="mx-1 grow" />
        <div className="flex-end gap-2">
          <IconButton
            color="gray"
            variant="surface"
            aria-label="Add message"
            loading={state === 'pending'}
            onClick={handleAdd}
          >
            <Icons.Plus />
          </IconButton>
          <RunButton onClick={handleRun} loading={state === 'pending'} />
        </div>
      </div>
    </div>
  )
}
