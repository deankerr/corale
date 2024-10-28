import { getImageModel } from '../../provider/fal/models'
import type { FalTextToImageResponse } from '../../provider/fal/schema'
import type { Doc } from '../../types'
import { ConvexError, omit } from '../../values'
import type { TextToImageInputs } from '../types'

export function createGenerationMetadata(
  generation: Doc<'generations_v2'>,
  sourceUrl: string,
): Extract<Doc<'images_metadata_v2'>['data'], { type: 'generation' }> {
  const input = generation.input as TextToImageInputs & { configId: string }
  const output = generation.output?.data as FalTextToImageResponse['data'] | undefined
  if (!(input && output && generation.results)) throw new ConvexError('generation metadata missing required fields')

  const model = getImageModel(input.modelId)
  const modelName = model?.name ?? 'unknown'

  const n = input.n ?? 1
  const nthInBatch = (generation.results.findIndex((result) => result.url === sourceUrl) ?? 0) + 1

  const seed = output.seed ?? input.seed

  const metadata: Doc<'images_metadata_v2'>['data'] = {
    type: 'generation',
    ...omit(input, ['configId', 'type', 'n']),
    modelName,
    provider: 'fal',
    n,
    nthInBatch,
    seed,
    version: 2,
    generationType: input.type,
  }

  const pricing = model?.pricing
  const result = generation.results.find((result) => result.url === sourceUrl)

  if (pricing) {
    switch (pricing.type) {
      case 'perMegapixel':
        if (!result?.width || !result?.height) break
        metadata.cost = roundDecimalPlaces((pricing.value * (result.width * result.height)) / 1000000)
        break
      case 'perSecond':
        if (!output.timings?.inference) break
        metadata.cost = roundDecimalPlaces((pricing.value * output.timings.inference) / n)
        break
      case 'perImage':
        metadata.cost = roundDecimalPlaces(pricing.value)
        break
    }
  }

  return metadata
}

function roundDecimalPlaces(value: number, places = 6) {
  return Math.round(value * 10 ** places) / 10 ** places
}
