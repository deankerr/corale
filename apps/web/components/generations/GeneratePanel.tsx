'use client'

import { GenerateForm } from '@/components/generations/GenerateForm'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { Panel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { useGenerate } from '@/lib/api/generations'

export const GeneratePanel = () => {
  const generate = useGenerate()

  return (
    <Panel className="w-80 shrink-0">
      <PanelHeader>
        <NavigationButton />
        <PanelTitle href="/generations">Generate</PanelTitle>
        <div className="grow" />
      </PanelHeader>

      <ScrollArea>
        <GenerateForm onRun={generate} />
      </ScrollArea>
    </Panel>
  )
}
