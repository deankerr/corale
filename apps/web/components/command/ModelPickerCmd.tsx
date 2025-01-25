import { CmdK } from '@/components/command/CmdK'
import { ModelLogo } from '@/components/icons/ModelLogo'
import { useChatModels } from '@/lib/api/models'
import type { ChatModel } from '@corale/backend'
import { Dialog } from '@radix-ui/themes'
import { useState } from 'react'

export const ModelPickerCmd = ({
  modelId,
  onModelIdChange,
  children,
}: {
  modelId: string
  onModelIdChange: (modelId: string) => unknown
  children?: React.ReactNode
}) => {
  const chatModels = useChatModels()
  const model = chatModels?.find((model) => model.modelId === modelId)

  const [open, setOpen] = useState(false)

  const handleSelect = (modelId: string) => {
    onModelIdChange(modelId)
    setOpen(false)
  }
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content align="start" maxWidth="42rem" className="rounded-md p-0" aria-describedby={undefined}>
        <Dialog.Title className="sr-only">Model Picker</Dialog.Title>
        <CmdK tabIndex={0}>
          <CmdK.Input placeholder="Search models..." autoFocus />
          <div className="flex-end text-gray-10 gap-1 border-b px-3.5 py-1 text-xs">
            <span className="mr-2">$ per M/tokens</span> <span className="text-gray-11 w-10">input</span>
            <span className="text-gray-11 w-10">output</span>
          </div>
          <CmdK.List>
            <CmdK.Empty>No models found</CmdK.Empty>

            {model && (
              <CmdK.Group heading="Current">
                <ModelItem
                  key={model.modelId}
                  value={`current ${model.modelId}`}
                  onSelect={() => handleSelect(model.modelId)}
                  model={model}
                />
              </CmdK.Group>
            )}

            <CmdK.Group heading="Available">
              {chatModels?.map((model) => (
                <ModelItem
                  key={model.modelId}
                  value={model.modelId}
                  onSelect={() => handleSelect(model.modelId)}
                  model={model}
                />
              ))}
            </CmdK.Group>
          </CmdK.List>
        </CmdK>
      </Dialog.Content>
    </Dialog.Root>
  )
}

const ModelItem = ({
  model,
  className,
  ...props
}: { model: ChatModel } & React.ComponentProps<typeof CmdK.Item>) => {
  const isFree = model.modelId.endsWith(':free')
  const { tokenInput, tokenOutput } = model.pricing
  return (
    <CmdK.Item {...props}>
      <div className="mr-2 shrink-0">
        <ModelLogo modelName={model.name} size={20} />
      </div>
      <div className="truncate">{model.name}</div>
      <div className="grow" />

      {!model.available && <div className="text-red-11 text-xs">Not available</div>}
      {!isFree ? (
        <div className="flex shrink-0 gap-2 text-right text-xs tabular-nums">
          <div className="w-10">{modelPrice.format(tokenInput)}</div>
          <div className="w-10">{modelPrice.format(tokenOutput)}</div>
        </div>
      ) : (
        <div className="flex shrink-0 gap-1 text-xs tabular-nums">
          <div className="text-grass-11 w-20 text-center">free</div>
        </div>
      )}
    </CmdK.Item>
  )
}

const modelPrice = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})
