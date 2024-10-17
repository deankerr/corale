'use client'

import { useGenerate } from '@corale/esuite/app/lib/api/generations'
import { GenerateForm } from '@corale/esuite/components/generations/GenerateForm'
import { NavigationButton } from '@corale/esuite/components/navigation/NavigationSheet'
import { Panel, PanelHeader, PanelTitle } from '@corale/esuite/components/ui/Panel'
import { ScrollArea } from '@corale/esuite/components/ui/ScrollArea'

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
