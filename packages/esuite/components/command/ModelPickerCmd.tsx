import { CmdK } from '@/components/command/CmdK'
import { ModelLogo } from '@/components/icons/ModelLogo'
import { useChatModels } from '@/lib/api/models'
import { cn } from '@/lib/utils'
import type { EChatModel } from '@corale/api/convex/types'
import { Dialog } from '@radix-ui/themes'
import { useState } from 'react'

export const ModelPickerCmd = ({
  value,
  onValueChange,
  children,
}: {
  value: string
  onValueChange: (value: string) => unknown
  children?: React.ReactNode
}) => {
  const chatModels = useChatModels()
  const model = chatModels?.find((model) => model.modelId === value)

  const [open, setOpen] = useState(false)
  const handleSelect = (value: string) => {
    console.debug('model', value)
    onValueChange(value)
    setOpen(false)
  }
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content align="start" maxWidth="42rem" className="rounded-md p-0" aria-describedby={undefined}>
        <Dialog.Title className="sr-only">Model Picker</Dialog.Title>
        <CmdK tabIndex={0} className="bg-gray-2">
          <CmdK.Input placeholder="Search models..." autoFocus />
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

            <CmdK.Group heading="Chat Models">
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

const ModelItem = ({ model, className, ...props }: { model: EChatModel } & React.ComponentProps<typeof CmdK.Item>) => {
  const isFree = model.name.endsWith(':free')
  return (
    <CmdK.Item {...props} className={cn('aria-selected:text-orange-11 font-medium', className)}>
      <div className="mr-2 shrink-0">
        <ModelLogo modelName={model.name} size={20} />
      </div>
      <div className="truncate">{model.name}</div>
      <div className="grow" />

      {!model.available && <div className="text-red-11 text-xs">Not available</div>}
      {!isFree ? (
        <div className="flex w-20 shrink-0 justify-evenly gap-2 text-right text-xs tabular-nums">
          <div className="text-right">{model.pricing.tokenInput.toFixed(2)}</div>
          <div className="text-right">{model.pricing.tokenOutput.toFixed(2)}</div>
        </div>
      ) : (
        <div className="flex shrink-0 gap-1 text-xs tabular-nums">
          <div className="text-grass-11 w-20 text-center">free</div>
        </div>
      )}
      {/* <div className="w-16 shrink-0 text-center text-xs">{model.endpoint}</div> */}
    </CmdK.Item>
  )
}
