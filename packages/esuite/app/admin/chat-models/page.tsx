'use client'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'
import { ModelsTable } from '@/app/admin/chat-models/ModelsTable'
import { ModelLogo } from '@/components/icons/ModelLogo'
import { SearchField } from '@/components/ui/SearchField'
import { useChatModels } from '@/lib/api/models'
import { Card, Tabs } from '@radix-ui/themes'
import fuzzysort from 'fuzzysort'
import { useState } from 'react'

export default function Page() {
  const chatModels = useChatModels()
  const [searchValue, setSearchValue] = useState('')

  const sortResults = fuzzysort.go(searchValue, chatModels ?? [], {
    keys: ['resourceKey', 'name', 'creatorName'],
    all: true,
  })
  const modelsList = sortResults.map(({ obj }) => obj)

  return (
    <AdminPageWrapper>
      <Tabs.Root defaultValue="table">
        <Tabs.List>
          <Tabs.Trigger value="badges">Badges</Tabs.Trigger>
          <Tabs.Trigger value="table">Table</Tabs.Trigger>
        </Tabs.List>

        <div className="mt-2">
          <div className="space-y-2 py-2">
            <SearchField value={searchValue} onValueChange={setSearchValue} />
            <div className="px-1 font-mono text-sm">{chatModels && `chat models: ${sortResults.length}`}</div>
          </div>

          <Tabs.Content value="badges">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-wrap gap-2">
                {/* {sortResults.map(({ obj: model }) => (
                  <ChatModelCard key={model._id} model={model} />
                ))} */}
              </div>

              <div className="flex h-fit shrink-0 flex-wrap gap-1">
                {chatModels?.map((model) => (
                  <Card key={model._id} className="h-20 w-80 p-2.5">
                    <div className="grid h-full grid-rows-[auto_1fr] items-center gap-y-1">
                      <div className="grid grid-cols-[1.5rem_1fr] items-center gap-2">
                        <ModelLogo modelName={model.name} size={18} className="justify-self-center" />
                        <div className="truncate text-sm font-medium">{model.name}</div>
                      </div>

                      <div className="grid grid-flow-col grid-cols-[4rem_1fr_auto] grid-rows-2 gap-x-1 text-xs">
                        <div className="row-span-2 text-center text-xs">
                          {model.contextLength.toLocaleString()}
                          <br />
                          context
                        </div>

                        <div>{model.creatorName}</div>
                        <div>{model.provider}</div>

                        {model.pricing.tokenInput + model.pricing.tokenOutput > 0 ? (
                          <>
                            <div className="text-right tabular-nums">
                              in ${model.pricing.tokenInput.toFixed(2)} / Mtok
                            </div>
                            <div className="text-right tabular-nums">
                              out ${model.pricing.tokenOutput.toFixed(2)} / Mtok
                            </div>
                          </>
                        ) : (
                          <div className="text-grass-11 row-span-2 place-self-center">free</div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="table">
            <ModelsTable models={modelsList} />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </AdminPageWrapper>
  )
}
