import { cn } from '@/app/lib/utils'
import { ModelLogo } from '@/components/icons/ModelLogo'
import type { EChatModel } from '@corale/api/convex/types'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Table } from '@radix-ui/themes'
import { useState } from 'react'

export const ModelsTable = ({
  models,
  className,
  ...props
}: { models: EChatModel[] } & React.ComponentProps<'div'>) => {
  const [sort, setSort] = useState<'score' | 'cost'>('score')

  const models2 = models.map((model) => ({
    ...model,
    costPerMToken: model.pricing,
  }))

  const byScore = models2.toSorted((a, b) => b.internalScore - a.internalScore)
  const byCost = models2.toSorted(
    (a, b) => b.costPerMToken.tokenOutput - a.costPerMToken.tokenOutput,
  )
  const sorted = sort === 'score' ? byScore : byCost
  return (
    <div {...props} className={cn('overflow-x-auto', className)}>
      <Table.Root size="1" variant="surface" layout="fixed">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Logo</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell maxWidth="240px">resourceKey</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell maxWidth="360px">name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell maxWidth="360px">endpoint</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell
              justify="end"
              onClick={() => setSort('score')}
              className={cn('cursor-pointer', sort === 'score' && 'underline underline-offset-2')}
            >
              internalScore
              <Icons.CaretUpDown
                className={cn(
                  'inline size-4',
                  sort === 'score' ? 'text-accent-11' : 'text-gray-11',
                )}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>tags</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>creatorName</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>pricing</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell
              justify="end"
              onClick={() => setSort('cost')}
              className={cn('cursor-pointer', sort === 'cost' && 'underline underline-offset-2')}
            >
              cost M/token
              <Icons.CaretUpDown
                className={cn('inline size-4', sort === 'cost' ? 'text-accent-11' : 'text-gray-11')}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell justify="end">tokens/$</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sorted.map((model) => (
            <Table.Row key={model._id}>
              <Table.Cell maxWidth="240px" className="break-all font-mono text-xs">
                <ModelLogo modelName={model.name} size={20} />
              </Table.Cell>
              <Table.Cell maxWidth="240px" className="break-all font-mono text-xs">
                {model.resourceKey}
              </Table.Cell>

              <Table.Cell maxWidth="360px">{model.name}</Table.Cell>
              <Table.Cell maxWidth="360px">{model.provider}</Table.Cell>
              <Table.Cell justify="end">{model.internalScore}</Table.Cell>
              <Table.Cell>
                {model.tags.join(', ') || <span className="italic text-gray-10">none</span>}
              </Table.Cell>
              <Table.Cell>{model.creatorName}</Table.Cell>
              <Table.Cell className="font-mono text-xs">{JSON.stringify(model.pricing)}</Table.Cell>
              <Table.Cell justify="end" className="font-mono">
                ${model.costPerMToken.tokenInput.toFixed(2)} $
                {model.costPerMToken.tokenOutput.toFixed(2)}
              </Table.Cell>
              <Table.Cell justify="end" className="font-mono">
                {model.costPerMToken.tokenInput + model.costPerMToken.tokenOutput > 0
                  ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
                      Math.round(
                        1000000 /
                          (model.costPerMToken.tokenInput + model.costPerMToken.tokenOutput),
                      ),
                    )
                  : 'N/A'}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}
