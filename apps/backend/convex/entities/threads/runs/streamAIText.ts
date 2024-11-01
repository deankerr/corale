import { streamText } from 'ai'
import { internal } from '../../../_generated/api'
import type { Id } from '../../../_generated/dataModel'
import type { ActionCtx } from '../../../_generated/server'
import { hasDelimiter } from '../../../lib/utils'

export async function streamAIText(
  ctx: ActionCtx,
  run: { runId: Id<'runs'>; userId: Id<'users'> },
  input: Parameters<typeof streamText>[0],
) {
  const textId = await ctx.runMutation(internal.entities.texts.internal.createMessageText, {
    runId: run.runId,
    userId: run.userId,
  })
  const result = await streamText(input)

  let firstTokenAt = 0
  let streamedText = ''
  for await (const textPart of result.textStream) {
    if (!textPart) continue
    if (!firstTokenAt) firstTokenAt = Date.now()
    streamedText += textPart
    if (hasDelimiter(textPart)) {
      await ctx.runMutation(internal.entities.texts.internal.streamToText, {
        textId,
        content: streamedText,
      })
    }
  }

  const [text, finishReason, usage, warnings, response] = await Promise.all([
    result.text,
    result.finishReason,
    result.usage,
    result.warnings,
    result.response,
  ])

  try {
    await ctx.scheduler.runAfter(0, internal.entities.texts.internal.deleteText, {
      textId,
    })
  } catch (err) {
    console.error(err)
  }

  return { text, finishReason, usage, warnings, response, firstTokenAt }
}
