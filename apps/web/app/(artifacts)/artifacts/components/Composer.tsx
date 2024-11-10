'use client'

import { RunButton } from '@/app/(beta)/_features/chat/RunButton'
import { ModelPickerCmd } from '@/components/command/ModelPickerCmd'
import { ModelLogo } from '@/components/icons/ModelLogo'
import { Button, IconButton } from '@/components/ui/Button'
import { TextArea } from '@/components/ui/TextArea'
import { useChatModel } from '@/lib/api/models'
import { cn } from '@/lib/utils'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'

export function Composer({
  defaultModelId = 'anthropic/claude-3-5-haiku:beta',
  defaultTextValue = '',
  onRunSubmit,
  state = 'ready',
  className,
}: {
  defaultModelId?: string
  defaultTextValue?: string
  onRunSubmit: (args: { modelId: string; text: string }) => void | Promise<void>
  state?: 'ready' | 'pending'
  className?: string
}) {
  const [modelId, setModelId] = useState(defaultModelId)
  const [textValue, setTextValue] = useState(defaultTextValue)

  const model = useChatModel(modelId)

  const handleRun = () => {
    const text = textValue.trim()
    if (!model?._id || !text) return
    onRunSubmit({ modelId, text })
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
        <ModelPickerCmd modelId={modelId} onModelIdChange={setModelId}>
          <Button color="gray" variant="soft">
            <ModelLogo modelName={model?.name ?? ''} />
            {model?.name || 'Select model'}
          </Button>
        </ModelPickerCmd>

        <div className="mx-1 grow" />
        <div className="flex-end gap-2">
          <IconButton color="gray" variant="surface" aria-label="Add message" disabled loading={state === 'pending'}>
            <Icons.Plus />
          </IconButton>
          <RunButton onClick={handleRun} loading={state === 'pending'} />
        </div>
      </div>
    </div>
  )
}
