'use client'

import { ModelLogo } from '@/components/icons/ModelLogo'
import { SearchField } from '@/components/ui/SearchField'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { useChatModels } from '@/lib/api/models'
import { ChatModel } from '@corale/backend'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import fuzzysort from 'fuzzysort'
import { useState } from 'react'
import { PageContent, PageHeader, PageLayout } from '../shared/PageLayout'

type SortColumn = 'name' | 'created' | 'contextLength' | 'maxOutputTokens' | 'tokenInput' | 'tokenOutput'
type SortDirection = 'asc' | 'desc'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

export const ModelsPage = () => {
  const chatModels = useChatModels()
  const [searchValue, setSearchValue] = useState('')
  const [sortConfig, setSortConfig] = useState<{ column: SortColumn; direction: SortDirection } | null>(null)

  const filteredAndSortedModels = (() => {
    // fuzzy search
    const filtered = searchValue
      ? fuzzysort
          .go(searchValue, chatModels ?? [], {
            keys: ['name', 'modelId'],
            limit: 50,
          })
          .map((result) => result.obj)
      : (chatModels ?? [])

    // sorting
    return [...filtered].sort((a, b) => {
      if (!sortConfig) return 0

      const getValue = (model: ChatModel, column: SortColumn) => {
        switch (column) {
          case 'tokenInput':
            return model.pricing.tokenInput
          case 'tokenOutput':
            return model.pricing.tokenOutput
          default:
            return model[column as keyof Omit<ChatModel, '_id' | 'pricing'>]
        }
      }

      const aValue = getValue(a, sortConfig.column)
      const bValue = getValue(b, sortConfig.column)

      if (aValue === bValue) return 0
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      const result = aValue > bValue ? 1 : -1
      return sortConfig.direction === 'asc' ? result : -result
    })
  })()

  // column sort click
  const handleSort = (column: SortColumn) => {
    setSortConfig((current) => {
      if (current?.column === column) {
        if (current.direction === 'asc') {
          return { column, direction: 'desc' }
        }
        return null
      }
      return { column, direction: 'asc' }
    })
  }

  const getSortIndicator = (column: SortColumn) => {
    if (sortConfig?.column !== column) return null
    return sortConfig.direction === 'asc' ? (
      <Icons.CaretUp className="ml-1 inline-block" size={12} />
    ) : (
      <Icons.CaretDown className="ml-1 inline-block" size={12} />
    )
  }

  return (
    <PageLayout>
      <PageHeader className="border-b">
        Models
        <SearchField
          value={searchValue}
          onValueChange={setSearchValue}
          placeholder="Search models..."
          className="ml-auto"
        />
      </PageHeader>

      <PageContent className="flex overflow-hidden">
        <div className="flex-1 overflow-hidden rounded-md border">
          <Table className="overflow-y-auto">
            <TableHeader className="bg-gray-2 sticky top-0 z-10 text-xs">
              <TableRow>
                <TableHead>
                  <Icons.Cube size={18} className="mx-auto" />
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort('name')}>
                  Name {getSortIndicator('name')}
                </TableHead>
                <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('created')}>
                  Released {getSortIndicator('created')}
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-right"
                  onClick={() => handleSort('contextLength')}
                >
                  Context Length {getSortIndicator('contextLength')}
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-right"
                  onClick={() => handleSort('maxOutputTokens')}
                >
                  Max Output {getSortIndicator('maxOutputTokens')}
                </TableHead>
                <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('tokenInput')}>
                  $ M/Tokens Input {getSortIndicator('tokenInput')}
                </TableHead>
                <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('tokenOutput')}>
                  $ M/Tokens Output {getSortIndicator('tokenOutput')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedModels.map((model) => (
                <TableRow key={model._id}>
                  <TableCell>
                    <ModelLogo modelName={model.name} size={18} className="mx-auto" />
                  </TableCell>
                  <TableCell>{model.name}</TableCell>
                  <TableCell className="w-[12ch] text-right tabular-nums">
                    {new Date(model.created * 1000).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="w-[12ch] text-right tabular-nums">
                    {model.contextLength.toLocaleString()}
                  </TableCell>
                  <TableCell className="w-[12ch] text-right tabular-nums">
                    {model.maxOutputTokens?.toLocaleString() ?? '-'}
                  </TableCell>
                  <TableCell className="w-[12ch] text-right tabular-nums">
                    {formatter.format(model.pricing.tokenInput)}
                  </TableCell>
                  <TableCell className="w-[12ch] text-right tabular-nums">
                    {formatter.format(model.pricing.tokenOutput)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageContent>
    </PageLayout>
  )
}
