'use client'

import { Button } from '@corale/ui/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@corale/ui/components/ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '@corale/ui/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@corale/ui/components/ui/popover'
import { useIsMobile } from '@corale/ui/hooks/use-is-mobile'
import * as React from 'react'

type Item = {
  value: string
  label: string
}

const models: Item[] = [
  {
    value: 'anthropic/claude-3.5-haiku:beta',
    label: 'Claude 3.5 Haiku',
  },
  {
    value: 'anthropic/claude-3.5-sonnet:beta',
    label: 'Claude 3.5 Sonnet',
  },
  {
    value: 'mistralai/pixtral-large-2411',
    label: 'Pixtral Large 2411',
  },
  {
    value: 'anthracite-org/magnum-v4-72b',
    label: 'Magnum V4 72B',
  },
  {
    value: 'meta-llama/llama-3.2-90b-vision-instruct',
    label: 'Llama 3.2 90B',
  },
]

export function ComboBoxResponsive(props: { model?: string | null; setModel?: (model: string | null) => void }) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = !useIsMobile()
  const [selectedModel, setSelectedModel] = React.useState<Item | null>(null)

  const model = models.find((model) => model.value === props.model) ?? selectedModel
  const setModel = (model: Item | null) => {
    props.setModel?.(model?.value ?? '')
    setSelectedModel(model)
  }

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start">
            {model ? <>{model.label}</> : <>Select model...</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <ModelList setOpen={setOpen} setSelectedModel={setModel} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start">
          {model ? <>{model.label}</> : <>Select model...</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ModelList setOpen={setOpen} setSelectedModel={setSelectedModel} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function ModelList({
  setOpen,
  setSelectedModel,
}: {
  setOpen: (open: boolean) => void
  setSelectedModel: (model: Item | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter models..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {models.map((model) => (
            <CommandItem
              key={model.value}
              value={model.value}
              onSelect={(value) => {
                setSelectedModel(models.find((model) => model.value === value) || null)
                setOpen(false)
              }}
            >
              {model.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
