import { twx } from '@/lib/utils'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Loader } from '../ui/Loader'
import { useMessageContext } from './MessageProvider'

const formatCost = (value: number) => {
  const absValue = Math.abs(value)
  const firstNonZeroIndex = absValue.toString().split('.')[1]?.search(/[1-9]/) ?? -1
  const maximumFractionDigits = firstNonZeroIndex === -1 ? 2 : Math.max(2, firstNonZeroIndex + 1)

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits,
    minimumFractionDigits: 2,
  })
  return formatter.format(value)
}

function getDuration(startTime = 0, endTime = Date.now()) {
  return (endTime - startTime) / 1000
}

const FooterShell = twx.div`flex-end divide-gray-a3 border-gray-a3 text-gray-10 h-8 divide-x overflow-hidden border-t px-1 font-mono text-xs [&>div]:px-2.5`

export const MessageFooter = () => {
  const { message, run } = useMessageContext()

  if (!message.runId) return null
  if (!run) return <FooterShell />

  const timeActive = run.timings.endedAt ? getDuration(run.timings.startedAt, run.timings.endedAt) : undefined

  const timeToFirstToken = run.timings.firstTokenAt
    ? getDuration(run.timings.startedAt, run.timings.firstTokenAt)
    : undefined

  const topProvider = run.providerMetadata?.provider_name as string | undefined

  return (
    <FooterShell>
      <div className="grow">
        {run.model.id} {message.kvMetadata?.['esuite:pattern:xid']}
      </div>

      {topProvider && <div>{topProvider}</div>}

      <div>{run.usage?.finishReason}</div>

      {timeToFirstToken !== undefined && <div>{timeToFirstToken.toFixed(1)}s</div>}

      {timeActive !== undefined && <div>{timeActive.toFixed(1)}s</div>}

      {run.usage && (
        <div>
          {run.usage.completionTokens} / {run.usage.promptTokens} tok
        </div>
      )}
      {run.usage?.cost !== undefined && <div>${formatCost(run.usage.cost)} USD</div>}

      <div className="flex-center shrink-0">
        {run.status === 'queued' && <Loader type="ping" size={24} color="var(--gold-11)" />}
        {run.status === 'active' && <Loader type="ripples" size={24} color="var(--gold-11)" />}

        {run.status === 'done' && <Icons.Check className="text-green-10 size-4 saturate-50" />}

        {(run.status === 'failed' || run.usage?.finishReason === 'error') && (
          <Icons.WarningOctagon className="text-red-10 size-4 saturate-50" />
        )}
      </div>
    </FooterShell>
  )
}
